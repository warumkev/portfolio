import { ReactNode } from 'react';
import { User, Briefcase, Mail, Rocket, Palette } from 'lucide-react';

// --- Type Definitions ---
export interface Project {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

export interface AppConfig {
  title: string;
  icon: ReactNode;
  content: ReactNode;
  defaultSize: { width: number; height: number };
}

// --- Mock Data ---
const projectData: Project[] = [
    { icon: <Rocket size={24} className="text-cyan-400" />, title: "Project Alpha", description: "Eine interaktive Datenvisualisierungsplattform.", link: "#" },
    { icon: <Palette size={24} className="text-rose-400" />, title: "Creative Suite", description: "Ein Design-Tool für Vektorgrafiken im Browser.", link: "#" },
    { icon: <Briefcase size={24} className="text-amber-400" />, title: "Portfolio OS", description: "Das Projekt, das Sie gerade betrachten.", link: "#" },
];


// --- Content Components ---
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/70 transition-colors duration-200 border border-transparent hover:border-neutral-700">
        <div className="flex items-start gap-4">
            <div className="mt-1">{project.icon}</div>
            <div>
                <h3 className="font-semibold text-neutral-100">{project.title}</h3>
                <p className="text-sm text-neutral-400">{project.description}</p>
            </div>
        </div>
    </a>
);

const AboutContent = () => (
    <div className="text-center p-4 h-full flex flex-col justify-center">
        <h2 className="text-xl font-bold text-neutral-100 mb-2">Willkommen!</h2>
        <p>Dies ist ein Experiment, um traditionelle Portfolios neu zu denken. Erkunden Sie die verschiedenen Fenster, um mehr zu erfahren.</p>
    </div>
);

const PortfolioContent = () => (
    <div className="space-y-2">
        <h2 className="text-xl font-bold text-neutral-100 mb-4 px-3">Meine Projekte</h2>
        <div className="space-y-2">
            {projectData.map(p => <ProjectCard key={p.title} project={p} />)}
        </div>
    </div>
);

const ContactContent = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold text-neutral-100 mb-4">Kontakt aufnehmen</h2>
        <p className="mb-6">Ich freue mich auf Ihre Nachricht.</p>
        <button className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 transition-all">E-Mail senden</button>
    </div>
);

// --- App Configuration ---
export const APP_CONFIG: Record<string, AppConfig> = {
    'about': { 
        title: 'Über Mich', 
        icon: <User size={16} className="text-neutral-400"/>, 
        content: <AboutContent />,
        defaultSize: { width: 500, height: 300 }
    },
    'portfolio': { 
        title: 'Portfolio', 
        icon: <Briefcase size={16} className="text-neutral-400"/>, 
        content: <PortfolioContent />,
        defaultSize: { width: 550, height: 450 }
    },
    'contact': { 
        title: 'Kontakt', 
        icon: <Mail size={16} className="text-neutral-400"/>, 
        content: <ContactContent />,
        defaultSize: { width: 400, height: 250 }
    },
};
