"use client";

import {motion} from "motion/react";
import {Sparkles} from "lucide-react";

export default function LoadingAnimation() {
	return (
		<motion.div
			className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/5 via-background to-primary/5 px-3 py-1.5 text-sm font-medium text-primary shadow-sm"
			initial={{opacity: 0, y: 4}}
			animate={{opacity: 1, y: 0}}
		>
			<motion.span
				className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary shadow-inner"
				animate={{rotate: [0, 12, -10, 0], scale: [1, 1.08, 1, 1.04, 1]}}
				transition={{duration: 2.5, repeat: Infinity, ease: "easeInOut"}}
			>
				<Sparkles className="h-3.5 w-3.5"/>
			</motion.span>
			<div className="relative flex items-center gap-1">
				<motion.span
					className="bg-gradient-to-r from-primary/40 via-primary to-primary/40 bg-[length:200%_100%] bg-clip-text text-transparent"
					animate={{backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]}}
					transition={{duration: 3, repeat: Infinity, ease: "easeInOut"}}
				>
					Thinking
				</motion.span>
				<motion.span
					className="flex w-5 justify-start overflow-hidden text-primary/80"
					animate={{opacity: [0.3, 0.9, 0.3], x: [0, 2, 0]}}
					transition={{duration: 1.4, repeat: Infinity, ease: "easeInOut"}}
				>
					<span>...</span>
				</motion.span>
			</div>
		</motion.div>
	);
}
