export function chunkText(body: string, target = 800, overlap = 120): string[] {
	if (!body || !body.trim()) return [];
	if (target <= 0) return [body.trim()];
	if (overlap < 0) overlap = 0;

	// Normalize whitespace but preserve paragraph breaks
	const cleaned = body
		.replace(/\r?\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.replace(/\s+\n/g, '\n')
		.trim();

	const parts: string[] = [];
	let i = 0;
	const len = cleaned.length;

	while (i < len) {
		const end = Math.min(i + target, len);
		let slice = cleaned.slice(i, end);

		// Prefer to end at a sentence boundary near the end of the slice
		if (end < len) {
			const boundaryWindowStart = Math.floor(slice.length * 0.5);
			const nearEnd = slice.slice(boundaryWindowStart);
			let bestIdx = -1;

			// Look for sentence punctuation followed by space/newline
			const punctIdx = Math.max(
				nearEnd.lastIndexOf('. '),
				nearEnd.lastIndexOf('! '),
				nearEnd.lastIndexOf('? '),
			);

			if (punctIdx !== -1) {
				bestIdx = boundaryWindowStart + punctIdx + 1; // include the punctuation
			} else {
				// Fallback: break on last whitespace to avoid cutting words
				const wsIdx = nearEnd.search(/\s(?![\s\S]*\s)/) === -1 ? -1 : nearEnd.lastIndexOf(' ');
				if (wsIdx !== -1) bestIdx = boundaryWindowStart + wsIdx;
			}
			if (bestIdx > -1) {
				slice = slice.slice(0, bestIdx + 1);
			}
		}

		const trimmed = slice.trim();
		if (trimmed) parts.push(trimmed);

		// Advance with overlap
		i += Math.max(slice.length - overlap, 1);
	}

	// Merge trailing tiny chunk if it's too small
	if (parts.length >= 2) {
		const last = parts[parts.length - 1];
		if (last.length < Math.max(80, Math.floor(target * 0.3))) {
			parts[parts.length - 2] = `${parts[parts.length - 2]}\n\n${last}`.trim();
			parts.pop();
		}
	}

	return parts;
}
