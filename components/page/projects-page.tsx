'use client';

import {motion} from 'motion/react';
import ProjectCard from '@/components/project/project-card';
import {projects} from '@/lib/projects';

export default function ProjectsPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div
					initial={{opacity: 0, scale: 0.8}}
					animate={{opacity: 0.1, scale: 1}}
					transition={{duration: 2, ease: "easeOut"}}
					className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
				/>
				<motion.div
					initial={{opacity: 0, scale: 0.8}}
					animate={{opacity: 0.1, scale: 1}}
					transition={{duration: 2, delay: 0.5, ease: "easeOut"}}
					className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
				/>
			</div>

			<div className="container mx-auto relative">
				{/* Header Section */}
				<motion.div
					initial={{opacity: 0, y: 30}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.8, ease: "easeOut"}}
					className="text-center mb-12"
				>
					<motion.h1
						initial={{opacity: 0, y: 20}}
						animate={{opacity: 1, y: 0}}
						transition={{duration: 0.8, delay: 0.2, ease: "easeOut"}}
						className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
					>
			            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
			              My Projects
			            </span>
					</motion.h1>
					<motion.p
						initial={{opacity: 0, y: 20}}
						animate={{opacity: 1, y: 0}}
						transition={{duration: 0.8, delay: 0.4, ease: "easeOut"}}
						className="text-xl text-muted-foreground max-w-3xl mx-auto"
					>
						A collection of projects showcasing my skills in full-stack development,
						AI/ML, and modern web technologies.
					</motion.p>
				</motion.div>

				{/* Featured Projects Section */}
				<motion.div
					initial={{opacity: 0, y: 40}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.8, delay: 0.6, ease: "easeOut"}}
					className="mb-16"
				>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{projects.map((project, index) => (
							<motion.div
								key={project.name}
								initial={{opacity: 0, y: 20}}
								animate={{opacity: 1, y: 0}}
								transition={{
									duration: 0.5,
									delay: 1.0 + index * 0.1,
									ease: "easeOut"
								}}
							>
								<ProjectCard {...project} />
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
