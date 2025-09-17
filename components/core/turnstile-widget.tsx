"use client";

import Turnstile, {useTurnstile} from "react-turnstile";

interface TurnstileWidgetProps {
	onVerify?: (token: string) => void;
	onError?: () => void;
	onExpire?: () => void;
}

function TurnstileWidget({onVerify, onError, onExpire}: TurnstileWidgetProps) {
	const turnstile = useTurnstile();

	return (
		<Turnstile
			sitekey="0x4AAAAAAB1yllAcUwWUmU4C"
			onVerify={(token) => {
				onVerify?.(token);
			}}
			onError={() => {
				onError?.();
			}}
			onExpire={() => {
				onExpire?.();
			}}
		/>
	);
}

export default TurnstileWidget;