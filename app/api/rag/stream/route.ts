import {NextRequest} from 'next/server';
import OpenAI from 'openai';
import {retrieveSimilar, getClientIdentifier, RetrieverError} from '@/lib/retriever';
import {buildPrompt} from '@/lib/answer';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY!});

/**
 * @swagger
 * /api/rag/stream:
 *   post:
 *     summary: Get a streaming answer to a query using the RAG system
 *     description: This endpoint takes a query and a scope, retrieves similar documents from the database, and streams an answer using the OpenAI API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               scope:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
	try {
		const origin = req.headers.get('origin') || '';
		const host = req.headers.get('host') || '';
		const allowedHosts = new Set([
			host,
			process.env.NEXT_PUBLIC_APP_HOST ?? '', // optional explicit host
		]);
		if (origin) {
			try {
				const url = new URL(origin);
				if (!allowedHosts.has(url.host)) {
					return new Response(JSON.stringify({ type: 'error', message: 'Forbidden origin' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
				}
			} catch {
				return new Response(JSON.stringify({ type: 'error', message: 'Forbidden origin' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
			}
		}

		const { query, scope = 'all' } = await req.json();
		
		// Get client identifier for rate limiting
		const clientId = getClientIdentifier(req);
		
		// Convert scope to slugs array
		const slugs = scope === 'all' ? undefined : [scope];   // 'resume' | 'about' | all
		const hits = await retrieveSimilar(slugs, query, clientId);      // ← pulls from both by default

		const contexts = hits.map(h => `(${h.document_slug} #${h.chunk_index}) ${h.content}`);
		const { system, user } = buildPrompt(query, contexts);

		const stream = await openai.chat.completions.create({
			model: process.env.RAG_CHAT_MODEL ?? 'gpt-5-nano',
			stream: true,
			messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
		});

		const encoder = new TextEncoder();
		const readable = new ReadableStream({
			async start(controller) {
				// Send tidy citations including document slug
				controller.enqueue(encoder.encode(JSON.stringify({
					type: 'meta',
					citations: hits.map(h => ({
						doc: h.document_slug,
						chunkIndex: h.chunk_index,
						preview: h.content.replace(/\s+/g, ' ').slice(0, 180),
						similarity: h.similarity
					}))
				}) + '\n'));

				try {
					for await (const part of stream) {
						const t = part.choices?.[0]?.delta?.content ?? '';
						if (t) controller.enqueue(encoder.encode(JSON.stringify({type: 'token', value: t}) + '\n'));
					}
				} catch (streamError) {
					console.error('Streaming error:', streamError);
					controller.enqueue(encoder.encode(JSON.stringify({
						type: 'error',
						message: 'Error generating response'
					}) + '\n'));
				} finally {
					controller.enqueue(encoder.encode(JSON.stringify({type: 'done'}) + '\n'));
					controller.close();
				}
			}
		});

		return new Response(readable, {
			headers: {
				'Content-Type': 'application/x-ndjson; charset=utf-8',
				'Cache-Control': 'no-cache, no-transform',
				Connection: 'keep-alive',
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
				'X-XSS-Protection': '1; mode=block',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
			},
		});
	} catch (error) {
		console.error('RAG Stream API error:', error);
		
		if (error instanceof RetrieverError) {
			return new Response(JSON.stringify({
				type: 'error',
				message: error.message,
				code: error.code,
				details: error.details
			}), {
				status: error.statusCode,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({
			type: 'error',
			message: 'Internal server error'
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}