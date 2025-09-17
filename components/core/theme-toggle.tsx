"use client";

import {useEffect, useState} from "react";

function applyThemeClass(theme: "light" | "dark") {
	const root = document.documentElement;
	if (theme === "dark") root.classList.add("dark");
	else root.classList.remove("dark");
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("dark");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Hydration: read stored preference; default to dark
		const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as
			| "light"
			| "dark"
			| null;
		const initial = stored ?? "dark";
		setTheme(initial);
		applyThemeClass(initial);
		setMounted(true);
	}, []);

	function toggleTheme() {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		localStorage.setItem("theme", next);
		applyThemeClass(next);
	}

	const iconSize = 18;
	return (
		<button
			aria-label="Toggle theme"
			onClick={toggleTheme}
			className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-foreground shadow hover:bg-accent hover:text-accent-foreground"
		>
			{theme === "dark" ? (
				<span className="inline-flex items-center gap-2">
					<svg
						width={iconSize}
						height={iconSize}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="opacity-90"
					>
						<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
					</svg>
					<span className="hidden sm:inline">Dark</span>
				</span>
			) : (
				<span className="inline-flex items-center gap-2">
					<svg
						width={iconSize}
						height={iconSize}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="opacity-90"
					>
						<circle cx="12" cy="12" r="4"/>
						<path
							d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364 6.364-1.414-1.414M8.05 8.05 6.636 6.636m10.728 0-1.414 1.414M8.05 15.95 6.636 17.364"/>
					</svg>
					<span className="hidden sm:inline">Light</span>
				</span>
			)}
		</button>
	);
}

export default ThemeToggle;


