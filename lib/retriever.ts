import {db} from "./db";
import {sql, inArray} from "drizzle-orm";
import {documents} from "./schema";
import {
	ALLOWED_DOCUMENT_SLUGS,
	RATE_LIMIT_CONFIG,
	INPUT_VALIDATION,
	LOGGING
} from "./security-config";
import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY!});
const EMBED_MODEL = process.env.RAG_EMBED_MODEL ?? "text-embedding-3-small";

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Cleanup old rate limit entries periodically
setInterval(() => {
	const now = Date.now();
	for (const [key, value] of rateLimitMap.entries()) {
		if (now > value.resetTime) {
			rateLimitMap.delete(key);
		}
	}
}, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS);

/**
 * Validates and sanitizes the input query and slugs.
 * @param query The user's query.
 * @param slugs An array of document slugs to search.
 * @returns An object containing the sanitized query, slugs, and any validation errors.
 */
function validateAndSanitizeInput(query: string, slugs?: string[]): {
	query: string;
	slugs: string[] | undefined;
	errors: string[]
} {
	const errors: string[] = [];

	if (!query) {
		errors.push('Query is required and must be a string');
	} else if (query.trim().length < INPUT_VALIDATION.MIN_QUERY_LENGTH) {
		errors.push('Query cannot be empty');
	} else if (query.length > INPUT_VALIDATION.MAX_QUERY_LENGTH) {
		errors.push(`Query is too long (max ${INPUT_VALIDATION.MAX_QUERY_LENGTH} characters)`);
	}

	// Validate and sanitize slugs
	let sanitizedSlugs: string[] | undefined = undefined;
	if (slugs && slugs.length > 0) {
		if (slugs.length > INPUT_VALIDATION.MAX_SLUGS_PER_REQUEST) {
			errors.push(`Too many slugs requested (max ${INPUT_VALIDATION.MAX_SLUGS_PER_REQUEST})`);
		} else {
			sanitizedSlugs = [];
			for (const slug of slugs) {
				// Sanitize slug (alphanumeric, hyphens, underscores only)
				const sanitized = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
				if (sanitized.length === 0) {
					errors.push(`Invalid slug format: ${slug}`);
					continue;
				}

				// Check against allowlist
				if (!ALLOWED_DOCUMENT_SLUGS.has(sanitized)) {
					errors.push(`Document slug '${sanitized}' is not allowed`);
					continue;
				}

				sanitizedSlugs.push(sanitized);
			}

			if (sanitizedSlugs.length === 0) {
				sanitizedSlugs = undefined;
			}
		}
	}

	return {
		query: query?.trim() || '',
		slugs: sanitizedSlugs,
		errors
	};
}

/**
 * Checks the rate limit for a given identifier.
 * @param identifier The identifier to check the rate limit for (e.g., IP address).
 * @returns An object indicating whether the request is allowed and the reset time if it's not.
 */
function checkRateLimit(identifier: string): { allowed: boolean; resetTime?: number } {
	const now = Date.now();

	let record = rateLimitMap.get(identifier);

	// Debug logging
	if (LOGGING.LOG_RATE_LIMIT_VIOLATIONS) {
		console.log(`Rate limit check for ${identifier}:`, {
			currentCount: record?.count || 0,
			resetTime: record?.resetTime ? new Date(record.resetTime).toISOString() : 'none',
			now: new Date(now).toISOString()
		});
	}

	if (!record || now > record.resetTime) {
		// New window or expired window - create new record
		record = {count: 0, resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS};
		rateLimitMap.set(identifier, record);
	}

	// Check if we've hit the limit
	if (record.count >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
		if (LOGGING.LOG_RATE_LIMIT_VIOLATIONS) {
			console.warn(`Rate limit exceeded for identifier: ${identifier} (count: ${record.count})`);
		}
		return {allowed: false, resetTime: record.resetTime};
	}

	record.count++;

	if (LOGGING.LOG_RATE_LIMIT_VIOLATIONS) {
		console.log(`Rate limit updated for ${identifier}: count=${record.count}/${RATE_LIMIT_CONFIG.MAX_REQUESTS}`);
	}

	return {allowed: true};
}

/**
 * Custom error class for retriever-related errors.
 */
export class RetrieverError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode: number = 500,
		public details?: any
	) {
		super(message);
		this.name = 'RetrieverError';
	}
}

/**
 * Custom error class for validation errors.
 */
export class ValidationError extends RetrieverError {
	constructor(message: string, details?: any) {
		super(message, 'VALIDATION_ERROR', 400, details);
	}
}

/**
 * Custom error class for rate limit errors.
 */
export class RateLimitError extends RetrieverError {
	constructor(resetTime: number) {
		super('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429, {resetTime});
	}
}

/**
 * Custom error class for database errors.
 */
export class DatabaseError extends RetrieverError {
	constructor(message: string, details?: any) {
		super(message, 'DATABASE_ERROR', 500, details);
	}
}

/**
 * Custom error class for embedding errors.
 */
export class EmbeddingError extends RetrieverError {
	constructor(message: string, details?: any) {
		super(message, 'EMBEDDING_ERROR', 500, details);
	}
}

/**
 * Gets the client identifier for rate limiting.
 * @param request The request object.
 * @returns The client identifier (e.g., IP address).
 */
export function getClientIdentifier(request: Request): string {
	// Try to get IP from various headers (for different proxy setups)
	const forwarded = request.headers.get('x-forwarded-for');
	const realIp = request.headers.get('x-real-ip');
	const cfConnectingIp = request.headers.get('cf-connecting-ip');

	let ip = 'unknown';
	if (forwarded) {
		ip = forwarded.split(',')[0].trim();
	} else if (realIp) {
		ip = realIp;
	} else if (cfConnectingIp) {
		ip = cfConnectingIp;
	}

	return ip;
}

export type RetrievedChunk = {
	document_id: number;
	document_slug: string;
	chunk_index: number;
	content: string;
	similarity: number;
};

// knobs
const CANDIDATES_PER_DOC = 40;
const SEED_GAP = 4;           // seeds must be this far apart (by chunk index)
const SEEDS_PER_DOC = 1;      // how many areas of each doc to open windows around
const WINDOW_RADIUS = 2;      // include neighbors seed +/- 2 -> captures whole section
const MAX_CONTEXT_CHARS = 4500;

/**
 * Picks a set of seeds from a list of items.
 * @param items The items to pick seeds from.
 * @param maxSeeds The maximum number of seeds to pick.
 * @param gap The minimum gap between seeds.
 * @returns An array of seeds.
 */
function pickSeeds<T extends { chunk_index: number }>(items: T[], maxSeeds = SEEDS_PER_DOC, gap = SEED_GAP) {
	const out: T[] = [];
	for (const it of items) {
		if (out.every(s => Math.abs(s.chunk_index - it.chunk_index) >= gap)) {
			out.push(it);
			if (out.length >= maxSeeds) break;
		}
	}
	if (!out.length && items.length) out.push(items[0]);
	return out;
}

/**
 * Retrieves similar chunks from the database.
 * @param slugs An array of document slugs to search.
 * @param query The user's query.
 * @param clientIdentifier The client identifier for rate limiting.
 * @returns A promise that resolves to an array of retrieved chunks.
 */
export async function retrieveSimilar(
	slugs: string[] | undefined, // e.g. ['resume','about'] or undefined = all docs
	query: string,
	clientIdentifier?: string // For rate limiting (e.g., IP address or user ID)
): Promise<RetrievedChunk[]> {
	try {
		// Input validation and sanitization
		const {query: sanitizedQuery, slugs: sanitizedSlugs, errors} = validateAndSanitizeInput(query, slugs);
		if (errors.length > 0) {
			if (LOGGING.LOG_VALIDATION_ERRORS) {
				console.warn('Input validation failed:', {errors, query, slugs});
			}
			throw new ValidationError('Input validation failed', {errors});
		}

		// Rate limiting check
		if (clientIdentifier) {
			const rateLimitResult = checkRateLimit(clientIdentifier);
			if (!rateLimitResult.allowed) {
				if (LOGGING.LOG_RATE_LIMIT_VIOLATIONS) {
					console.warn(`Rate limit exceeded for client: ${clientIdentifier}`);
				}
				throw new RateLimitError(rateLimitResult.resetTime!);
			}
		}

		// Resolve documents with parameterized query
		let docRows;
		try {
			if (sanitizedSlugs?.length) {
				docRows = await db
					.select({id: documents.id, slug: documents.slug})
					.from(documents)
					.where(inArray(documents.slug, sanitizedSlugs));
			} else {
				docRows = await db
					.select({id: documents.id, slug: documents.slug})
					.from(documents);
			}
		} catch (error) {
			if (LOGGING.LOG_DATABASE_ERRORS) {
				console.error('Database error while fetching documents:', error);
			}
			throw new DatabaseError('Failed to fetch documents', {originalError: error});
		}

		if (!docRows.length) {
			return [];
		}

		const docs = docRows.map(r => ({id: r.id, slug: r.slug}));

		// Generate embedding
		let queryEmbedding: number[];
		try {
			const {data} = await openai.embeddings.create({
				model: EMBED_MODEL,
				input: [sanitizedQuery]
			});
			queryEmbedding = data[0].embedding;
		} catch (error) {
			if (LOGGING.LOG_EMBEDDING_ERRORS) {
				console.error('OpenAI embedding error:', error);
			}
			throw new EmbeddingError('Failed to generate query embedding', {originalError: error});
		}

		const qvec = sql.raw(`'[${queryEmbedding.join(",")}]'::vector`);
		const gathered: RetrievedChunk[] = [];

		for (const d of docs) {
			try {
				// Vector candidates for THIS doc with parameterized query
				const candRows = await db.execute(sql`
                    SELECT e.chunk_index,
                           e.content,
                           LEAST(1.0, GREATEST(0.0, 1.0 - cosine_distance(e.embedding, ${qvec}))) AS similarity
                    FROM embeddings e
                    WHERE e.document_id = ${d.id}
                    ORDER BY cosine_distance(e.embedding, ${qvec}) ASC
                        LIMIT ${CANDIDATES_PER_DOC}
				`);

				const candidates = (candRows.rows as any[]).map(r => ({
					document_id: d.id,
					document_slug: d.slug,
					chunk_index: Number(r.chunk_index),
					content: String(r.content),
					similarity: Number(r.similarity),
				}));

				// Choose seed(s) for this doc, then add a neighbor window around each seed
				const seeds = pickSeeds(candidates, SEEDS_PER_DOC, SEED_GAP);
				const indexSet = new Set<number>();
				for (const s of seeds) {
					for (let i = s.chunk_index - WINDOW_RADIUS; i <= s.chunk_index + WINDOW_RADIUS; i++) {
						if (i >= 0) indexSet.add(i);
					}
				}
				// Also include a few top candidates to avoid missing an item between windows
				for (const c of candidates.slice(0, 6)) indexSet.add(c.chunk_index);

				if (indexSet.size === 0) continue;

				// Convert index set to array for parameterized query
				const indexArray = Array.from(indexSet);

				const winRows = await db.execute(sql`
                    SELECT e.chunk_index,
                           e.content,
                           LEAST(1.0, GREATEST(0.0, 1.0 - cosine_distance(e.embedding, ${qvec}))) AS similarity
                    FROM embeddings e
                    WHERE e.document_id = ${d.id}
                      AND e.chunk_index = ANY (${sql.raw(`ARRAY[${indexArray.join(",")}]::int[]`)})
                    ORDER BY e.chunk_index ASC
				`);

				for (const r of winRows.rows as any[]) {
					gathered.push({
						document_id: d.id,
						document_slug: d.slug,
						chunk_index: Number(r.chunk_index),
						content: String(r.content),
						similarity: Number(r.similarity),
					});
				}
			} catch (error) {
				console.error(`Error processing document ${d.slug}:`, error);
				}
			}

		// Pack everything into a safe char budget (prioritize by similarity score)
		gathered.sort((a, b) => b.similarity - a.similarity);

		const packed: RetrievedChunk[] = [];
		let total = 0;
		for (const g of gathered) {
			const len = g.content.length + 2;
			if (total + len > MAX_CONTEXT_CHARS) break;
			packed.push(g);
			total += len;
		}

		return packed;
	} catch (error) {
		if (error instanceof RetrieverError) {
			throw error;
		}

		// Handle unexpected errors
		console.error('Unexpected error in retrieveSimilar:', error);
		throw new RetrieverError('An unexpected error occurred during retrieval', 'UNEXPECTED_ERROR', 500, {originalError: error});
	}
}