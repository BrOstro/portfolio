'use client';

import {motion} from 'motion/react';
import {Card, CardContent} from '@/components/ui/card';
import ChatComponent from '@/components/chat/chat-component';

interface ChatWrapperProps {
	delay?: number;
	className?: string;
}

export default function ChatWrapper({delay = 1.2, className = ""}: ChatWrapperProps) {
	return (
		<motion.div
			initial={{opacity: 0, scale: 0.9, rotateX: 10}}
			animate={{opacity: 1, scale: 1, rotateX: 0}}
			transition={{
				duration: 0.8,
				delay,
				ease: "easeOut",
				scale: {duration: 0.2},
				y: {duration: 0.2}
			}}
			whileHover={{
				scale: 1.01,
				y: -5
			}}
			className={`transform-gpu ${className}`}
		>
			<Card
				className="border-2 bg-background/60 supports-[backdrop-filter]:bg-background/40 backdrop-blur-sm ring-2 ring-accent">
				<CardContent>
					<ChatComponent
						className=""
						showTitle={true}
						showScopeButtons={true}
					/>
				</CardContent>
			</Card>
		</motion.div>
	);
}
