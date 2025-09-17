import OpenAI from 'openai';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY!});

const CHAT_MODEL = process.env.RAG_CHAT_MODEL ?? 'gpt-5-nano';

export function buildPrompt(query: string, contexts: string[]) {
	const system = `You help recruiters explore Brendan's resume.
Use only the provided context; if unknown, say you don't have direct evidence.
FORMAT: Plain English, and use precisely enough sentences to cover all the information relevant to the question and no more. No markdown, no lists, no code fences. Use line and paragraph breaks to improve readability.
Answer on behalf of brendan (for example, "Brendan is a software engineer at Momentus." or "Brendan's key technical skills are...").`;

	const contextBlock = contexts
		.map((c, i) => `### [chunk ${i}]\n${c}`)
		.join('\n\n');
	const user = `Question:\n${query}\n\nContext:\n${contextBlock}\n\nAnswer:`;
	return {system, user};
}

export async function synthesizeAnswer(query: string, chunks: { content: string; chunk_index: number }[]) {
	const contexts = chunks.map(x => `(${x.chunk_index}) ${x.content}`);
	const {system, user} = buildPrompt(query, contexts);

	const chat = await openai.chat.completions.create({
		model: CHAT_MODEL,
		messages: [
			{role: 'system', content: system},
			{role: 'user', content: user},
		],
	});

	return chat.choices[0]?.message?.content ?? '';
}
