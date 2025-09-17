import AnswerCard, {Cite} from "@/components/chat/answer-card"
import {motion} from "motion/react"

function formatTime(ts?: number) {
	if (!ts) return ''
	const d = new Date(ts)
	return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
}

export default function ChatMessage({
	                                    role, text, cites, ts
                                    }: { role: 'user' | 'assistant'; text: string; cites?: Cite[]; ts?: number }) {
	if (role === 'assistant') {
		return (
			<motion.div className="space-y-1" initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}}
			            transition={{type: 'spring', stiffness: 250, damping: 22}}>
				<AnswerCard text={text} cites={cites}/>
				<div className="text-[10px] text-muted-foreground/80 pl-1">{formatTime(ts)}</div>
			</motion.div>
		)
	}
	return (
		<div className="flex flex-col items-end gap-1">
			<motion.div
				className="max-w-[80%] break-words rounded-lg bg-primary/90 text-primary-foreground px-3 py-2 shadow-sm"
				initial={{opacity: 0, scale: 0.98, y: 4}}
				animate={{opacity: 1, scale: 1, y: 0}}
				transition={{type: 'spring', stiffness: 300, damping: 20}}
			>
				{text}
			</motion.div>

			<div className="text-[10px] text-muted-foreground/80 pr-1">{formatTime(ts)}</div>
		</div>
	)
}
