import {NextRequest} from 'next/server';
import OpenAI from 'openai';
import {retrieveSimilar, getClientIdentifier, RetrieverError} from '@/lib/retriever';
import {buildPrompt} from '@/lib/answer';
import {verifyTurnstileToken, getClientIP} from '@/lib/turnstile';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY!});

export async function POST(req: NextRequest) {
	try {
		const { query, scope = 'all', turnstileToken } = await req.json();
		
		// Verify Turnstile token
		if (!turnstileToken) {
			return new Response(JSON.stringify({
				type: 'error',
				message: 'CAPTCHA verification required',
				code: 'TURNSTILE_MISSING'
			}), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const clientIP = getClientIP(req);
		const isValidToken = await verifyTurnstileToken(turnstileToken, clientIP);
		
		if (!isValidToken) {
			return new Response(JSON.stringify({
				type: 'error',
				message: 'CAPTCHA verification failed',
				code: 'TURNSTILE_VERIFICATION_FAILED'
			}), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
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
