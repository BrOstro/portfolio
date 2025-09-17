'use client';
import {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {SendHorizonal} from 'lucide-react';
import {Button} from '@/components/ui/button';

export default function ChatInput({onSend, value, onValueChange, disabled}: {
	onSend: (q: string) => void;
	value?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
}) {
	const [q, setQ] = useState('');

	const inputValue = value !== undefined ? value : q;
	const setInputValue = onValueChange || setQ;

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			event.currentTarget.form?.requestSubmit();
		}
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const t = inputValue.trim();
				if (t && !disabled) onSend(t);
				setInputValue('');
			}}
			className="flex gap-2 items-center"
		>
			<Textarea
				className="flex-1 border rounded-md px-3 py-2"
				placeholder="Ask about my experience…"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				disabled={disabled}
			/>

			<Button className="px-3 py-2 rounded-full border cursor-pointer" size="icon" type="submit"
			        disabled={inputValue.trim() === '' || disabled}>
				<SendHorizonal/>
			</Button>
		</form>
	);
}
