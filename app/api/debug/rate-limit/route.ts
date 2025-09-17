import {NextResponse} from 'next/server';
import {getClientIdentifier, retrieveSimilar, RetrieverError} from '@/lib/retriever';

/**
 * @swagger
 * /api/debug/rate-limit:
 *   get:
 *     summary: Debug endpoint to test rate limiting
 *     description: This endpoint is only available in development mode and is used to test the rate limiting functionality.
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not available in production
 *       429:
 *         description: Rate limit exceeded
 */
export async function GET(req: Request) {
	// Only allow in development
	if (process.env.NODE_ENV === 'production') {
		console.warn('Debug route accessed in production. This should not happen in a production environment.');
		return NextResponse.json({error: 'Not available in production'}, {status: 404});
	}

	console.log('Debug route accessed in development');

	const clientId = getClientIdentifier(req);

	try {
		// This will trigger the rate limiting logic
		const hits = await retrieveSimilar(['resume'], 'test query', clientId);

		return NextResponse.json({
			clientIdentifier: clientId,
			timestamp: new Date().toISOString(),
			status: 'success',
			hitsCount: hits.length,
			message: 'Request processed successfully'
		});
	} catch (error) {
		if (error instanceof RetrieverError) {
			return NextResponse.json({
				clientIdentifier: clientId,
				timestamp: new Date().toISOString(),
				status: 'error',
				error: error.message,
				code: error.code,
				details: error.details
			}, {status: error.statusCode});
		}

		return NextResponse.json({
			clientIdentifier: clientId,
			timestamp: new Date().toISOString(),
			status: 'error',
			error: 'Unexpected error',
			message: error instanceof Error ? error.message : 'Unknown error'
		}, {status: 500});
	}
}