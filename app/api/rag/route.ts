import { NextResponse } from 'next/server';
import { retrieveSimilar, getClientIdentifier, RetrieverError } from '@/lib/retriever';
import { synthesizeAnswer } from '@/lib/answer';

/**
 * @swagger
 * /api/rag:
 *   post:
 *     summary: Get an answer to a query using the RAG system
 *     description: This endpoint takes a query and a slug, retrieves similar documents from the database, and synthesizes an answer using the OpenAI API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               slug:
 *                 type: string
 *               topK:
 *                 type: number
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
export async function POST(req: Request) {
	try {
		const { query, slug = 'resume', topK = 6 } = await req.json();
		
		// Get client identifier for rate limiting
		const clientId = getClientIdentifier(req);
		console.log('RAG API called with clientId:', clientId);
		
		// Convert single slug to array format expected by retrieveSimilar
		const slugs = Array.isArray(slug) ? slug : [slug];
		
		const hits = await retrieveSimilar(slugs, query, clientId);
		const answer = await synthesizeAnswer(query, hits.map(h => ({ content: h.content, chunk_index: h.chunk_index })));

		return NextResponse.json({
			answer,
			citations: hits.map((h, i) => ({ chunkIndex: h.chunk_index, preview: h.content.slice(0, 200), similarity: h.similarity })),
		});
	} catch (error) {
		console.error('RAG API error:', error);
		
		if (error instanceof RetrieverError) {
			return NextResponse.json(
				{ 
					error: error.message, 
					code: error.code,
					details: error.details 
				}, 
				{ status: error.statusCode }
			);
		}

		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}