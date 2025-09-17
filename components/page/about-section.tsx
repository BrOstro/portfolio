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
					I&apos;m a full-stack software engineer who loves building products that blend
					thoughtful design with powerful technology.
					Over the past few years I&apos;ve implemented major UI and UX improvements,
					engineered core systems that drove over $130,000 in first-year ARR, and helped
					teams adopt cutting-edge AI tools.
				</motion.p>

				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.6}}
				>
					At Momentus Technologies I created and delivered an applied AI curriculum that
					upskilled more than 80 engineers and led the rollout of AI tools that boosted
					both developer productivity and customer features.
				</motion.p>

				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.6}}
				>
					Earlier in my career at Charles Schwab I focused on large-scale architecture
					projects, migrating monoliths to microservices and improving API performance by
					more than 50 percent.
				</motion.p>

				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.6}}
				>
					Outside of work I build and maintain personal projects like a high-traffic
					RuneLite plugin and a financial tracking app.
					Both of these projects let me experiment with new frameworks and technologies
					while creating secure, scalable applications that make a real impact.
				</motion.p>

				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: delay + 0.6}}
				>
					I&apos;m excited about building tools that empower people and push the limits of
					what&apos;s possible with technology.
				</motion.p>
			</div>
		</motion.div>
	);
}
