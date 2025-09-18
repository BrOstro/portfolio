'use client';

import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import ChatInput from '@/components/chat/chat-input';
import ChatMessage from '@/components/chat/chat-message';
import PromptChips from '@/components/chat/prompt-chips';
import {Sparkles} from 'lucide-react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Cite} from '@/components/chat/answer-card';

type Msg = { role: 'user' | 'assistant'; text: string; cites?: Cite[]; ts: number };

interface ChatComponentProps {
	className?: string;
	showTitle?: boolean;
	showScopeButtons?: boolean;
}

export default function ChatComponent({
	                                      className = "",
	                                      showTitle = true,
	                                      showScopeButtons = true
                                      }: ChatComponentProps) {
	const [messages, setMessages] = useState<Msg[]>([]);
	const [loading, setLoading] = useState(false);
	const [scope, setScope] = useState<'all' | 'resume' | 'about'>('all');
	const [inputValue, setInputValue] = useState('');

	// Auto-scroll container ref (wrapper around ScrollArea)
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [showScrollToBottom, setShowScrollToBottom] = useState(false);

	function getViewportEl(): HTMLElement | null {
		const root = scrollRef.current;
		if (!root) return null;
		return root.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null;
	}

	async function ask(query: string) {
		setMessages(m => [...m, {role: 'user', text: query, ts: Date.now()}]);
		setLoading(true);

		// Create an empty assistant message we can append tokens into
		const idx = messages.length + 1;
		setMessages(m => [...m, {role: 'assistant', text: '', ts: Date.now()}]);

		const res = await fetch('/api/rag/stream', {
			method: 'POST',
			body: JSON.stringify({query, scope}),
		});

		if (!res.ok || !res.body) {
			setLoading(false);

			setMessages(m => {
				const next = [...m];
				next[idx] = {...next[idx], role: 'assistant', text: 'Sorry, something went wrong.'} as Msg;
				return next;
			});

			return;
		}

		const reader = res.body.getReader();
		const decoder = new TextDecoder('utf-8');
		let buffer = '';
		let citations: Cite[] | undefined;

		while (true) {
			const {value, done} = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, {stream: true});

			// NDJSON parse: split on newlines and keep the last partial line in buffer
			const lines = buffer.split('\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (!line.trim()) continue;
				try {
					const evt = JSON.parse(line);
					if (evt.type === 'meta') {
						citations = evt.citations;
						// set cites placeholder immediately
						setMessages(m => {
							const next = [...m];
							next[idx] = {...next[idx], cites: citations};
							return next;
						});
					} else if (evt.type === 'token') {
						const token: string = evt.value;
						setMessages(m => {
							const next = [...m];
							next[idx] = {...next[idx], text: (next[idx].text || '') + token};
							return next;
						});
					} else if (evt.type === 'error') {
						setMessages(m => {
							const next = [...m];
							next[idx] = {...next[idx], role: 'assistant', text: `Error: ${evt.message}`} as Msg;
							return next;
						});
					} else if (evt.type === 'done') {
						// no-op
					}
				} catch {
					// ignore malformed line
				}
			}
		}

		setLoading(false);
	}

	// Auto scroll to bottom on messages change
	useEffect(() => {
		const viewport = getViewportEl();
		if (!viewport) return;
		viewport.scrollTop = viewport.scrollHeight;
	}, [messages]);

	// Track whether we are near the bottom to toggle the CTA
	useEffect(() => {
		const viewport = getViewportEl();
		if (!viewport) return;
		const onScroll = () => {
			const threshold = 24; // px from bottom to consider at-bottom
			const atBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= threshold;
			setShowScrollToBottom(!atBottom);
		};
		onScroll();
		viewport.addEventListener('scroll', onScroll, {passive: true});
		return () => viewport.removeEventListener('scroll', onScroll);
	}, []);

	function scrollToBottom() {
		const viewport = getViewportEl();
		if (!viewport) return;
		viewport.scrollTo({top: viewport.scrollHeight, behavior: 'smooth'});
	}

	function handlePromptSelect(prompt: string) {
		setInputValue(prompt);
	}

	return (
		<div className={`flex flex-col h-full ${className}`}>
			{showTitle && (
				<div className="flex flex-col">
					<div className="flex items-center gap-2">
						<Sparkles/>
						<h2 className="text-2xl font-semibold tracking-tight ">Ask about me...</h2>
					</div>
					<p className="text-sm text-muted-foreground">I built an AI feature to answer questions about my
						experience and myself—try it!</p>
				</div>
			)}

			<div className="flex-1 flex flex-col min-h-0 pt-2">
				{messages.length > 0 && (
					<div className="rounded-xl border bg-background p-3 relative flex-1 flex flex-col min-h-0">
						<div ref={scrollRef} className="flex-1 min-h-0">
							<ScrollArea className="h-[60vh] pr-1">
								<div className="space-y-3 py-1">
									<AnimatePresence>
										{messages.map((m, i) => (
											<motion.div
												key={i}
												layout
												initial={{opacity: 0, y: 8}}
												animate={{opacity: 1, y: 0}}
												exit={{opacity: 0, y: -8}}
												transition={{type: 'spring', stiffness: 300, damping: 24}}
											>
												<ChatMessage role={m.role} text={m.text} cites={m.cites} ts={m.ts}/>
											</motion.div>
										))}
									</AnimatePresence>
								</div>
							</ScrollArea>
						</div>

						<AnimatePresence>
							{showScrollToBottom && (
								<motion.button
									type="button"
									onClick={scrollToBottom}
									className="absolute bottom-3 right-3 rounded-full border bg-background/80 backdrop-blur px-3 py-1.5 text-xs shadow-sm hover:bg-background"
									initial={{opacity: 0, y: 6}}
									animate={{opacity: 1, y: 0}}
									exit={{opacity: 0, y: 6}}
									transition={{type: 'spring', stiffness: 300, damping: 24}}
									aria-label="Scroll to bottom"
								>
									Jump to latest
								</motion.button>
							)}
						</AnimatePresence>
					</div>
				)}

				<div className="mt-4">
					{showScopeButtons && (
						<div className="flex gap-2 mb-2">
							{(['all', 'resume', 'about'] as const).map(s => (
								<button
									key={s}
									onClick={() => setScope(s)}
									className={`px-3 py-1 rounded-md border ${scope === s ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
								>
									{s[0].toUpperCase() + s.slice(1)}
								</button>
							))}
						</div>
					)}

					<ChatInput
						onSend={ask}
						value={inputValue}
						onValueChange={setInputValue}
						disabled={loading}
					/>

					{messages.length === 0 && (
						<PromptChips onPromptSelect={handlePromptSelect}/>
					)}
				</div>
			</div>
		</div>
	);
}