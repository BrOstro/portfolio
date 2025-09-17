import LandingPage from '@/components/page/landing-page';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Brendan Ostrom | Full-Stack Engineer & AI Enthusiast',
	description: 'The portfolio of Brendan Ostrom, a full-stack engineer with a passion for building AI-powered products and the future of software.',
};

export default function Home() {
	return <LandingPage/>;
}
