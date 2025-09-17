import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import {ScrollArea} from "@/components/ui/scroll-area"
import {motion, AnimatePresence} from "motion/react"
import LoadingAnimation from "@/components/core/loading-animation"

type Cite = { chunkIndex: number; preview: string; similarity: number }

function PlainText({text}: { text: string }) {
	// Preserve newlines, but make paragraphs readable.
	const blocks = text.trim().split(/\n{2,}/g).map(s => s.trim()).filter(Boolean)
	return (
		<div className="space-y-2 leading-relaxed text-base">
			{blocks.length
				? blocks.map((b, i) => <p key={i} className="whitespace-pre-wrap">{b}</p>)
				: <span className="opacity-60">
					<LoadingAnimation/>
					</span>}
		</div>
	)
}

export default function AnswerCard({text, cites}: { text: string; cites?: Cite[] }) {
	return (
		<Card className="border-muted/40 shadow-sm">
			<CardContent className="space-y-3 p-4">
				<PlainText text={text}/>

				{!!cites?.length && (
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="evidence" className="border-none">
							<AccordionTrigger className="rounded-md bg-muted/40 px-3 py-2 no-underline">
								Evidence & citations
							</AccordionTrigger>

							<AccordionContent>
								<ScrollArea className="h-64 p-2 border rounded-md">
									<div className="space-y-3">
										<AnimatePresence initial={false}>
											{cites.map((c, i) => (
												<motion.div
													key={i}
													initial={{opacity: 0, y: 6}}
													animate={{opacity: 1, y: 0}}
													exit={{opacity: 0, y: -6}}
													transition={{type: 'spring', stiffness: 250, damping: 22}}
													className="rounded-md border bg-muted/20 p-3"
												>
													<div className="mb-1 flex items-center justify-between gap-2">
														<div className="text-xs font-medium opacity-80">Chunk
															#{c.chunkIndex}</div>
														<Badge variant="secondary" className="text-[10px]">
															{Math.round(c.similarity * 100)}% match
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground line-clamp-3">{c.preview}</p>
												</motion.div>
											))}
										</AnimatePresence>
									</div>
								</ScrollArea>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				)}
			</CardContent>
		</Card>
	)
}
