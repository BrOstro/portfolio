import './globals.css';
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function RootLayout({children}: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(() => { try { const s = localStorage.getItem('theme'); const t = s === 'light' || s === 'dark' ? s : 'dark'; if (t === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); } catch {} })();`,
					}}
				/>
			</head>
			<body className="min-h-screen bg-background text-foreground">
				<Navbar/>
				<main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
					{children}
				</main>
				<Footer/>
			</body>
		</html>
	);
}
