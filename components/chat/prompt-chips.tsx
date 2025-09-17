'use client';

import { motion } from 'motion/react';

interface PromptChipsProps {
	onPromptSelect: (prompt: string) => void;
}

const PROMPTS = [
	"What are your key technical skills?",
	"Tell me about your leadership experience",
	"What projects have you worked on?",
	"Do you even lift? Or what do you do for fun?",
	"What makes you a strong candidate?"
];

export default function PromptChips({ onPromptSelect }: PromptChipsProps) {
	return (
		<div className="mt-3">
			<p className="text-sm text-muted-foreground mb-2">Try these prompts:</p>
			<div className="flex flex-wrap gap-2">
				{PROMPTS.map((prompt, index) => (
					<motion.button
						key={prompt}
						type="button"
						onClick={() => onPromptSelect(prompt)}
						className="px-3 py-1.5 text-sm rounded-full border bg-background hover:bg-muted transition-colors cursor-pointer"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ 
							delay: index * 0.05,
							type: 'spring',
							stiffness: 300,
							damping: 24
						}}
					>
						{prompt}
					</motion.button>
				))}
			</div>
		</div>
	);
}
