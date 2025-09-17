import OpenAI from 'openai';
import {db} from './db';
import {sql} from 'drizzle-orm';
import {chunkText} from './chunk';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY!});
const EMBED_MODEL = process.env.RAG_EMBED_MODEL ?? 'text-embedding-3-small';
const EMBED_BATCH_SIZE = Number(process.env.RAG_EMBED_BATCH_SIZE ?? 64);
const EMBED_MAX_RETRIES = Number(process.env.RAG_EMBED_MAX_RETRIES ?? 2);

type IngestOptions = {
	slug: string;
	title: string;
	content: string;
	type?: string;   // e.g., 'resume' | 'about'
	weight?: number;
};

/**
 * Upserts a document and its embeddings into the database.
 * @param opts The options for ingesting the document.
 * @param opts.slug The slug of the document.
 * @param opts.title The title of the document.
 * @param opts.content The content of the document.
 * @param opts.type The type of the document (e.g., 'resume', 'about').
 * @param opts.weight The weight of the document.
 * @returns The number of chunks inserted.
 */
export async function upsertDocumentWithEmbeddings(opts: IngestOptions) {
	const {slug, title, content, type = 'generic', weight = 1} = opts;

	if (!slug || !title) throw new Error('slug and title are required');
	if (!content || !content.trim()) return {inserted: 0};

	await db.execute(sql`
        INSERT INTO documents (slug, title, body, type, weight)
        VALUES (${slug}, ${title}, ${content}, ${type}, ${weight}) ON CONFLICT (slug) DO
        UPDATE
            SET title = EXCLUDED.title,
            body = EXCLUDED.body,
            type = EXCLUDED.type,
            weight = EXCLUDED.weight,
            updated_at = now()
	`);

	const {rows} = await db.execute(sql`SELECT id
                                        FROM documents
                                        WHERE slug = ${slug} LIMIT 1`);
	const docId = Number(rows[0].id);

	const chunks = chunkText(content, 800, 120);
	if (chunks.length === 0) return {inserted: 0};

	// Batch embeddings to avoid hitting token/body limits
	const vectors: number[][] = [];
	for (let start = 0; start < chunks.length; start += EMBED_BATCH_SIZE) {
		const batch = chunks.slice(start, start + EMBED_BATCH_SIZE);
		let attempt = 0;

		// simple retry with jitter
		while (true) {
			try {
				const {data} = await openai.embeddings.create({
					model: EMBED_MODEL,
					input: batch,
				});
				for (const item of data) vectors.push(item.embedding as unknown as number[]);
				break;
			} catch (err) {
				if (attempt >= EMBED_MAX_RETRIES) throw err;
				attempt++;
				const delayMs = 300 * attempt + Math.floor(Math.random() * 200);
				await new Promise(res => setTimeout(res, delayMs));
			}
		}
	}

	// replace existing rows for this doc
	await db.execute(sql`DELETE
                         FROM embeddings
                         WHERE document_id = ${docId}`);

	for (let i = 0; i < chunks.length; i++) {
		const vec = `'[${vectors[i].join(',')}]'::vector`;
		await db.execute(sql`
            INSERT INTO embeddings (document_id, chunk_index, content, embedding, fts)
            VALUES (${docId},
                    ${i},
                    ${chunks[i]},
                    ${sql.raw(vec)},
                    to_tsvector('english', ${chunks[i]}))
		`);
	}
	return {inserted: chunks.length};
}