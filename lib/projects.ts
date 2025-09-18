'use client';

export type Project = {
	name: string;
	description: string;
	image: string;
	techStack: string[];
	githubUrl?: string;
	liveUrl?: string;
	featured?: boolean;
};

export const projects: Project[] = [
	{
		name: "AI-Powered Portfolio",
		description: "A modern portfolio website with AI-powered chat functionality using RAG (Retrieval-Augmented Generation) to answer questions about my experience and projects.",
		image: "/projects/portfolio.png",
		techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Drizzle", "Neon", "RAG", "OpenAI", "Motion"],
		githubUrl: "https://github.com/brostro/portfolio",
		liveUrl: "https://brendanostrom.com"
	},
	{
		name: "RuneLite Collection Log Plugin",
		description: "This project is a high-traffic RuneLite plugin and companion website that enables players of Old School RuneScape to share their in-game collection logs. The system was scaled to support over 2,200 daily active users, providing low-latency data synchronization and secure data handling.",
		image: "/projects/clogged.png",
		techStack: ["Vue.js", "TypeScript", "Tailwind CSS", "Express", "PostgreSQL", "Redis"],
		githubUrl: "https://github.com/Advistane/clogged-server",
		liveUrl: "https://clogged.me"
	},
	{
		name: "Wuxby Financial Tracker",
		description: "Real-time personal finance tracker engineered and deployed to allow users to log assets, liabilities, and income with responsive dashboards. The application provides low-latency updates and seamless cross-device synchronization.",
		image: "/projects/wuxby.png",
		techStack: ["Vue.js", "TypeScript", "Firestore", "Tailwind CSS"],
		liveUrl: "https://wuxby.com"
	}
];


