'use client';

import {motion} from 'motion/react';

interface AboutSectionProps {
	delay?: number;
	className?: string;
}

export default function AboutSection({delay = 1.2, className = ""}: AboutSectionProps) {
	return (
		<motion.div
			initial={{opacity: 0, y: 30}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.8, delay, ease: "easeOut"}}
			className={`space-y-4 ${className}`}
		>
			<motion.h2
				initial={{opacity: 0, x: -20}}
				animate={{opacity: 1, x: 0}}
				transition={{duration: 0.6, delay: delay + 0.2}}
				className="text-xl lg:text-2xl font-semibold"
			>
				About Me
			</motion.h2>
			<div className="space-y-3 text-muted-foreground">
				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.4}}
				>
					I’m a full-stack software engineer focused on building applied AI systems and production-grade developer workflows.
				</motion.p>

				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.6}}
				>
					At Momentus Technologies, I architected a company-wide AI framework that enables teams to build intelligent agents over internal knowledge bases and customer data. I also created and delivered an applied AI curriculum that upskilled 80+ engineers in multi-agent orchestration, LLM system design, and real-world API integration.
				</motion.p>

				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.6}}
				>
					Earlier in my career at Charles Schwab, I worked on large-scale backend systems, helping migrate monoliths to microservices and improving API performance by over 50 percent.
				</motion.p>

				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.6}}
				>
					Outside of work, I build systems that push beyond typical “AI demos.” I maintain a high-traffic RuneLite plugin serving 4,900+ daily users and recently built Ellory, an autonomous multi-agent system that executes a full engineering workflow from idea to codebase using stateful orchestration and real GitHub integration.
				</motion.p>

				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.6}}
				>
					Most of my recent work has been around building systems that move beyond simple AI demos into real workflows with state, iteration, and external integrations.
				</motion.p>
			</div>
		</motion.div>
	);
}
