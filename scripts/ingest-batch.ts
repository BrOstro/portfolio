import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import {upsertDocumentWithEmbeddings} from '@/lib/embeddings';
import pdf from "pdf-parse";

function normalize(s: string) {
	return s.replace(/\r\n?/g, "\n").replace(/\t/g, " ").replace(/[ \u00A0]{2,}/g, " ").trim();
}

async function readText(file: string) {
	return (await fs.readFile(file, 'utf8'))
		.replace(/\r\n?/g, '\n')
		.replace(/\t/g, ' ')
		.trim();
}

async function readResume(): Promise<string> {
	const file = process.env.RESUME_FILE ?? path.join(process.cwd(), "public", "content", "resume.pdf");
	const ext = path.extname(file).toLowerCase();
	if (ext === ".pdf") {
		const buf = await fs.readFile(file);
		const data = await pdf(buf);
		return normalize(data.text);
	}
	return normalize(await fs.readFile(file, "utf8"));
}

async function main() {
	const root = process.cwd();

	const resumeText = await readResume();
	const aboutText = await readText(path.join(root, 'public', 'content', 'about.txt'));

	const docs = [
		{slug: 'resume', title: 'Brendan Ostrom — Resume', content: resumeText, type: 'resume', weight: 3},
		{slug: 'about', title: 'About Brendan', content: aboutText, type: 'about', weight: 1},
	];

	for (const d of docs) {
		const res = await upsertDocumentWithEmbeddings({
			slug: d.slug,
			title: d.title,
			content: d.content,
			type: d.type,
			weight: d.weight
		});
		console.log(`Ingested ${d.slug}: ${res.inserted} chunks`);
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
