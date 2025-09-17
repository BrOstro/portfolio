'use client';

import {motion} from 'motion/react';
import Image from 'next/image';

interface HeadshotCardProps {
	delay?: number;
	className?: string;
}

export default function HeadshotCard({delay = 1.0, className = ""}: HeadshotCardProps) {
	return (
		<motion.div
			initial={{opacity: 0, scale: 0.8, rotateY: -15}}
			animate={{opacity: 1, scale: 1, rotateY: 0}}
			transition={{
				duration: 0.8,
				delay,
				ease: "easeOut",
				scale: {duration: 0.2},
				rotateY: {duration: 0.2}
			}}
			whileHover={{
				scale: 1.02,
				rotateY: 5
			}}
			className={`transform-gpu ${className}`}
		>
			<div
				className="rounded-2xl p-[2px] bg-gradient-to-br from-primary via-orange-400 to-accent max-w-xs mx-auto lg:max-w-none">
				<div
					className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[inset_0_0_30px_rgba(0,0,0,0.15)]">
					<Image
						src="/headshot.jpg"
						alt="Brendan Ostrom"
						fill
						className="object-cover"
						priority
					/>

					<div
						className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent mix-blend-multiply"/>
					<div
						className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"/>
				</div>
			</div>
		</motion.div>
	);
}
