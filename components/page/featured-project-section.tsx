'use client';

import {motion} from 'motion/react';
import ProjectCard from '@/components/project/project-card';
import {projects} from '@/lib/projects';

interface FeaturedProjectSectionProps {
	delay?: number;
	className?: string;
}

export default function FeaturedProjectSection({delay = 2.6, className = ""}: FeaturedProjectSectionProps) {
	const clogged = projects.find(p => p.liveUrl === 'https://clogged.me');

	if (!clogged) return null;

	return (
		<motion.div
			initial={{opacity: 0, y: 30}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.8, delay, ease: "easeOut"}}
			className={`space-y-3 pt-4 ${className}`}
		>
			<motion.h3
				initial={{opacity: 0, x: -20}}
				animate={{opacity: 1, x: 0}}
				transition={{duration: 0.6, delay: delay + 0.2}}
				className="text-base lg:text-lg font-semibold"
			>
				Featured Project
			</motion.h3>

			<ProjectCard {...clogged} />
		</motion.div>
	);
}
