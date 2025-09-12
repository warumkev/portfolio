import { ReactNode } from 'react';
import { User, Briefcase, Mail, Rocket, Palette } from 'lucide-react';

// --- Type Definitions ---
export interface Project {
    icon: ReactNode;
    title: string;
    description: string;
    url: string;
}

export interface AppConfig {
    title: string;
    icon: ReactNode;
    content: ReactNode;
}

// --- Content Components ---

const AboutContent = () => (
    <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Willkommen!</h2>
        <p className="text-neutral-600 dark:text-neutral-300">Dies ist ein Experiment, um traditionelle Portfolios neu zu denken.</p>
    </div>
);

const projectData: Project[] = [
    { icon: <Rocket size={24} />, title: "Project Alpha", description: "Eine innovative Webanwendung, die...", url: "#" },
    { icon: <Palette size={24} />, title: "Design System", description: "Ein unternehmensweites Design-System...", url: "#" },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-all mb-4">
        <div className="flex items-center gap-4">
            <div className="text-cyan-500">{project.icon}</div>
            <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">{project.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{project.description}</p>
            </div>
        </div>
    </a>
);

const PortfolioContent = () => (
    <div className="p-1">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-3">Projekte</h2>
        {projectData.map(p => <ProjectCard key={p.title} project={p} />)}
    </div>
);

const ContactContent = () => (
    <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Kontakt</h2>
        <button className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 transition-all">
            E-Mail senden
        </button>
    </div>
);


export const APP_CONFIG: Record<string, AppConfig> = {
    'about': { title: 'Über Mich', icon: <User />, content: <AboutContent /> },
    'portfolio': { title: 'Portfolio', icon: <Briefcase />, content: <PortfolioContent /> },
    'contact': { title: 'Kontakt', icon: <Mail />, content: <ContactContent /> },
};

