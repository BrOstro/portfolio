import ChatComponent from '@/components/chat/chat-component';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: "Brendan Ostrom | Chat with Brendan's AI",
	description: "Ask questions and get answers about Brendan Ostrom's experience and skills from his AI-powered chat assistant.",
};

export default function ChatPage() {
	return (
		<div className="mx-auto max-w-3xl p-4">
			<ChatComponent/>
		</div>
	);
}
