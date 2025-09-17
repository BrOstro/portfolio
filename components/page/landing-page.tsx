'use client';

import {motion} from 'motion/react';
import HeadshotCard from '@/components/page/headshot-card';
import AboutSection from '@/components/page/about-section';
import SkillsSection from '@/components/page/skills-section';
import FeaturedProjectSection from '@/components/page/featured-project-section';
import QuickLinksSection from '@/components/page/quick-links-section';
import ChatWrapper from '@/components/page/chat-wrapper';

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

			<div className="container mx-auto px-4 relative">

				{/* Hero Section */}
				<motion.div
					initial={{opacity: 0, y: 30}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.8, ease: "easeOut"}}
					className="text-center mb-8 lg:mb-12"
				>
					<motion.h1
						initial={{opacity: 0, y: 20}}
						animate={{opacity: 1, y: 0}}
						transition={{duration: 0.8, delay: 0.2, ease: "easeOut"}}
						className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
					>
						<span
							className="bg-gradient-to-r from-slate-900 via-blue-600 to-slate-800 dark:from-primary dark:via-orange-500 dark:to-accent bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
							Brendan Ostrom
						</span>
					</motion.h1>

					<motion.p
						initial={{opacity: 0, y: 20}}
						animate={{opacity: 1, y: 0}}
						transition={{duration: 0.8, delay: 0.4, ease: "easeOut"}}
						className="text-xl text-muted-foreground max-w-2xl mx-auto"
					>
						Full-stack engineer focused on AI-powered products and building the future of software.
					</motion.p>
				</motion.div>

				{/* Main Content Grid */}
				<motion.div
					initial={{opacity: 0, y: 40}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.8, delay: 0.6, ease: "easeOut"}}
					className="max-w-7xl mx-auto relative"
				>
					{/* Mobile Layout: Headshot -> Chat -> About */}
					<div className="lg:hidden space-y-4">
						<HeadshotCard delay={1.0} />
						<ChatWrapper delay={1.2} />
					</div>

					{/* Desktop Layout: Two Column Grid */}
					<div className="hidden lg:grid lg:grid-cols-2 gap-8">
						<div
							className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent -translate-x-1/2"/>

						{/* Left Column - Profile Section */}
						<motion.div
							initial={{opacity: 0, x: -30}}
							animate={{opacity: 1, x: 0}}
							transition={{duration: 0.8, delay: 0.8, ease: "easeOut"}}
							className="space-y-6"
						>
							<HeadshotCard delay={1.0} />
							<AboutSection delay={1.2} />
							<SkillsSection delay={2.0} />
							<FeaturedProjectSection delay={2.6} />
							<QuickLinksSection delay={2.8} />
						</motion.div>

						{/* Right Column - Chat Component */}
						<motion.div
							initial={{opacity: 0, x: 30}}
							animate={{opacity: 1, x: 0}}
							transition={{duration: 0.8, delay: 1.0, ease: "easeOut"}}
							className="space-y-6"
						>
							<ChatWrapper delay={1.2} />
						</motion.div>
					</div>

					{/* Mobile About Section - appears after chat */}
					<div className="lg:hidden space-y-4 mt-4">
						<AboutSection delay={1.4} />
						<SkillsSection delay={2.2} />
						<FeaturedProjectSection delay={2.8} />
						<QuickLinksSection delay={3.0} />
					</div>
				</motion.div>
			</div>
		</div>
	);
}