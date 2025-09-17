"use client";

import Link from "next/link";
import {useState} from "react";
import ThemeToggle from "@/components/core/theme-toggle";
import {Linkedin, Mail} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const closeMenu = () => setIsMenuOpen(false);

	return (
		<header
			className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:py-4">
				<div className="flex items-center gap-3">
					<Link href="/" className="inline-flex items-center gap-2 font-semibold" onClick={closeMenu}>
						<span className="text-base sm:text-lg">Brendan Ostrom</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden gap-6 text-sm font-medium sm:flex">
					<Link href="/" className="text-foreground/90 hover:text-foreground">Home</Link>
					<Link href="/projects" className="text-foreground/90 hover:text-foreground">Projects</Link>
					<Link href="/chat" className="text-foreground/90 hover:text-foreground">Chat</Link>
					<a href="/content/resume.pdf" target="_blank" rel="noopener noreferrer"
					   className="text-foreground/90 hover:text-foreground">Resume</a>
				</nav>

				<div className="flex items-center gap-2">
					<a
						href="https://linkedin.com/in/brostro"
						target="_blank"
						rel="noopener noreferrer"
						className="hidden sm:flex rounded-lg hover:bg-accent hover:text-accent-foreground"
						aria-label="LinkedIn profile"
					>
						<div className="flex items-center">
							<Button size="icon" variant="outline" className="bg-primary/10 text-primary cursor-pointer">
								<Linkedin/>
							</Button>
						</div>

					</a>
					<a
						href="mailto:brendan.ostrom@gmail.com"
						className="hidden sm:flex rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground outline-primary"
						aria-label="Send email"
					>
						<div className="flex items-center">
							<Button size="icon" variant="outline" className="bg-primary/10 text-primary cursor-pointer">
								<Mail/>
							</Button>
						</div>
					</a>

					<ThemeToggle/>

					{/* Mobile Hamburger Button */}
					<button
						onClick={toggleMenu}
						className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground sm:hidden"
						aria-label="Toggle menu"
					>
						<svg
							className={`h-6 w-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							{isMenuOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
								      d="M6 18L18 6M6 6l12 12"/>
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
								      d="M4 6h16M4 12h16M4 18h16"/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			{isMenuOpen && (
				<>
					<div
						className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
						onClick={closeMenu}
					/>

					<div
						className="absolute left-0 right-0 top-full z-50 border-b bg-background/95 backdrop-blur-sm sm:hidden">
						<nav className="flex flex-col space-y-1 p-4">
							<Link
								href="/"
								className="rounded-md px-3 py-2 text-base font-medium text-foreground/90 hover:bg-accent hover:text-accent-foreground"
								onClick={closeMenu}
							>
								Home
							</Link>
							<Link
								href="/projects"
								className="rounded-md px-3 py-2 text-base font-medium text-foreground/90 hover:bg-accent hover:text-accent-foreground"
								onClick={closeMenu}
							>
								Projects
							</Link>
							<Link
								href="/chat"
								className="rounded-md px-3 py-2 text-base font-medium text-foreground/90 hover:bg-accent hover:text-accent-foreground"
								onClick={closeMenu}
							>
								Chat
							</Link>
							<a
								href="/content/resume.pdf"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md px-3 py-2 text-base font-medium text-foreground/90 hover:bg-accent hover:text-accent-foreground"
								onClick={closeMenu}
							>
								Resume
							</a>
							<a
								href="https://linkedin.com/in/brostro"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md px-3 py-2 text-base font-medium text-foreground/90 hover:bg-accent hover:text-accent-foreground"
								onClick={closeMenu}
								aria-label="LinkedIn profile"
							>
								LinkedIn
							</a>
							<a
								href="mailto:brendan.ostrom@gmail.com"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md px-3 py-2 text-base font-medium text-foreground/90 hover:bg-accent hover:text-accent-foreground"
								onClick={closeMenu}
								aria-label="Send email"
							>
								Contact
							</a>
						</nav>
					</div>
				</>
			)}
		</header>
	);
}



