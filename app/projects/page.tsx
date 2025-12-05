import ProjectsPage from '@/components/page/projects-page';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Brendan Ostrom | Projects',
	description: 'A collection of projects by Brendan Ostrom, showcasing his skills in full-stack development, AI/ML, and modern web technologies.',
};

export default function Projects() {
	return <ProjectsPage/>;
}
