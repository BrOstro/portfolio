'use client';

import {motion} from 'motion/react';

interface SkillsSectionProps {
	delay?: number;
	className?: string;
}

const skillsData = [
	{
		title: 'Frontend',
		items: ['React', 'Next.js', 'TypeScript', "Vue.js", "Tailwind CSS"]
	},
	{title: 'Backend', items: ['Node.js', 'Express', 'ASP.NET', 'Python']},
	{
		title: 'Databases',
		items: ['PostgreSQL', 'MongoDB', 'Firestore', 'RavenDB']
	},
	{
		title: 'Tools & Platforms',
		items: ['AWS', 'RabbitMQ', 'Git', 'Docker', 'Splunk', 'Redis', 'Dynatrace', 'DataDog']
	},
	{
		title: 'AI Platforms',
		items: ['OpenAI', 'Vertex AI', 'AWS Bedrock', 'Anthropic']
	},
	{
		title: 'AI Frameworks/Tools',
		items: ['RAG Pipelines', 'LangChain', 'AutoGen', 'Semantic Kernel', 'Model Context Protocol (MCP)']
	},
];

export default function SkillsSection({delay = 2.0, className = ""}: SkillsSectionProps) {
	return (
		<motion.div
			initial={{opacity: 0}}
			animate={{opacity: 1}}
			transition={{duration: 0.6, delay}}
			className={`grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 pt-2 ${className}`}
		>
			{skillsData.map((group, groupIndex) => (
				<motion.div
					key={group.title}
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.5, delay: delay + groupIndex * 0.15}}
					className="space-y-2"
				>
					<div
						className="text-sm font-medium text-foreground/80">{group.title}</div>
					<div className="flex flex-wrap gap-2">
						{group.items.map((tech, index) => (
							<motion.span
								key={tech}
								initial={{opacity: 0, scale: 0.9}}
								animate={{opacity: 1, scale: 1}}
								transition={{
									duration: 0.25,
									delay: delay + 0.1 + groupIndex * 0.15 + index * 0.05
								}}
								whileHover={{
									scale: 1.08,
									boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
								}}
								className="px-2 py-1 lg:px-3 lg:py-1 bg-primary/10 text-primary rounded-full text-xs lg:text-sm font-medium cursor-default transition-all duration-200 hover:bg-primary/20 hover:shadow-lg"
							>
								{tech}
							</motion.span>
						))}
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}
