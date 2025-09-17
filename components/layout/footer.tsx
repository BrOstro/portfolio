'use client';

import { motion } from 'motion/react';

export default function Footer() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
			className="text-center mt-16 py-8 border-t border-border/50"
		>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.6 }}
				className="text-sm text-muted-foreground"
			>
				Built with Next.js, TypeScript, and AI-powered by RAG
			</motion.p>
		</motion.div>
	);
}


