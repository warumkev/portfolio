import { ReactNode, useState, useRef, FormEvent } from 'react';
import { User, Briefcase, Mail, Rocket, Palette, NotebookText, CircuitBoard, Music, Play, Pause, Bot } from 'lucide-react';
import Image from 'next/image';


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
    defaultSize: { width: number; height: number };
}

export interface BlogPost {
    title: string;
    date: string;
    content: string;
}


// --- Content Components ---

// --- 1. About Me App ---
const AboutContent = () => (
    <div className="p-6 text-neutral-800 dark:text-neutral-200 font-sans">
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
                <Image
                    src="/profile-image.PNG"
                    alt="Professionelles Foto von Kevin Tamme"
                    width={128}
                    height={128}
                    className="rounded-full shadow-lg border-4 border-neutral-200 dark:border-neutral-700"
                />
            </div>
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Kevin Tamme</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    22-jähriger Frontend-Entwickler aus Frankfurt am Main, kurz vor dem Abschluss meines Informatik-Studiums. Meine Leidenschaft gilt dem Design und der Kreativität, spezialisiert auf immersive UI/UX, die im Kopf bleiben.
                </p>
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-2">Kernkompetenzen:</h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
                    <li>- TypeScript & React</li>
                    <li>- UI/UX Design (Figma, Adobe CC)</li>
                    <li>- Next.js</li>
                    <li>- Animationen (MagicUI)</li>
                    <li>- Tailwind CSS</li>
                    <li>- Git & APIs</li>
                </ul>
            </div>
        </div>
    </div>
);

// --- 2. Portfolio App ---
const projectData: Project[] = [
    { icon: <User size={24} />, title: "PortfoliOS (Diese Seite)", description: "Ein interaktives Portfolio im Stil eines Betriebssystems mit Next.js, TypeScript und Tailwind CSS.", url: "kevintamme.com" },
    { icon: <Bot size={24} />, title: "Katalyst", description: "Showcase einer App zur KI-Generierung von Biografien, READMEs und 'Über mich'-Texten.", url: "https://ketam-katalyst.vercel.app" },
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


// --- 3. Contact App ---
const ContactContent = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('sending');
        // TODO: Implement form submission logic (e.g., using an API route or a third-party service)
        // For demonstration, we'll just simulate a delay and success.
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000); // Reset after 3 seconds
        }, 1500);
    };

    return (
        <div className="p-6 font-sans">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 text-center">Noch Fragen?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-center max-w-md mx-auto">
                Haben Sie ein Projekt im Sinn oder möchten sich vernetzen? Ich freue mich auf Ihre Nachricht.
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 mx-auto">
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name</label>
                    <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">E-Mail</label>
                    <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                    <label htmlFor="message" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Nachricht</label>
                    <textarea id="message" name="message" rows={4} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full px-6 py-2.5 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 transition-all disabled:bg-cyan-400 disabled:cursor-not-allowed"
                    >
                        {status === 'sending' ? 'Sende...' : 'Nachricht senden'}
                    </button>
                </div>
            </form>
            {status === 'success' && <p className="mt-4 text-green-600 dark:text-green-400 text-center">Vielen Dank! Ihre Nachricht wurde gesendet.</p>}
            {status === 'error' && <p className="mt-4 text-red-600 dark:text-red-400 text-center">Fehler. Bitte versuchen Sie es später erneut.</p>}
        </div>
    );
};


// --- 4. Blog App ---
const blogPosts: BlogPost[] = [
    {
        title: "State Management in React 2024",
        date: "15. Juli 2024",
        content: "Die Landschaft des State Managements in React ist vielfältiger denn je. Von Redux über Zustand bis hin zu Jotai und den eingebauten Hooks wie `useContext` und `useReducer` – die Wahl des richtigen Tools hängt stark vom Projektumfang ab. Für kleine bis mittlere Projekte hat sich `Zustand` als leichtgewichtige und dennoch leistungsstarke Alternative etabliert..."
    },
    {
        title: "Learnings aus Projekt 'Phoenix'",
        date: "02. Juni 2024",
        content: "Die größte Herausforderung bei 'Phoenix' war die Skalierung der Datenbank-Abfragen unter hoher Last. Durch die Implementierung eines Caching-Layers mit Redis und die Optimierung von Indizes konnten wir die Latenz um 70% reduzieren. Ein wichtiges Learning: Performance-Tests sollten so früh wie möglich in den Entwicklungszyklus integriert werden."
    },
    {
        title: "Warum TypeScript ein Game-Changer ist",
        date: "10. Mai 2024",
        content: "Die Einführung von TypeScript in unserem Team war anfangs mit Lernaufwand verbunden, hat sich aber schnell bezahlt gemacht. Die statische Typisierung fängt Fehler bereits während der Entwicklung ab, verbessert die Code-Qualität und macht die Zusammenarbeit durch selbstdokumentierenden Code deutlich effizienter. Es ist ein Investment, das sich langfristig auszahlt."
    }
];

const BlogContent = () => (
    <div className="p-4 font-sans">
         <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-2">Notizen & Learnings</h2>
         <div className="space-y-4">
            {blogPosts.map((post, index) => (
                <div key={index} className="p-4 bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">{post.title}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{post.date}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{post.content}</p>
                </div>
            ))}
         </div>
    </div>
);

// --- 5. System Info App ---
const SysteminfoContent = () => (
    <div className="p-6 font-mono text-sm text-neutral-800 dark:text-neutral-200">
        <div className="w-full">
            <div className="flex items-center gap-4 mb-6">
                 <CircuitBoard size={48} className="text-cyan-500" />
                 <div>
                    <h2 className="text-2xl font-bold">PortfoliOS v1.0</h2>
                    <p className="text-neutral-500">© 2025 Kevin Tamme</p>
                 </div>
            </div>
            <div className="space-y-2 border-t border-neutral-300 dark:border-neutral-700 pt-4">
                <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Frontend:</span>
                    <span className="font-semibold">TypeScript, React, Next.js</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Styling:</span>
                    <span className="font-semibold">Tailwind CSS, MagicUI</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Design:</span>
                    <span className="font-semibold">Figma, Adobe CC</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Backend/DB:</span>
                    <span className="font-semibold">PHP, SQL, APIs</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Tooling:</span>
                    <span className="font-semibold">Git, Vercel</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Status:</span>
                    <span className="font-semibold">Informatik-Student (B.Sc.)</span>
                </div>
            </div>
        </div>
    </div>
);

// --- 6. Music Player App ---
const MusicPlayerContent = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    return (
        <div className="p-6 h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 dark:from-purple-900/50 to-indigo-100 dark:to-indigo-900/50">
            <div className="w-48 h-48 bg-neutral-300 dark:bg-neutral-700 rounded-lg shadow-lg mb-6 flex items-center justify-center">
                 <Music size={64} className="text-neutral-500 dark:text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Lofi Chill</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">by Lofi Girl</p>
            <button
                onClick={togglePlayPause}
                className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center text-cyan-500 hover:scale-105 transition-transform"
            >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            {/* HINWEIS: Ersetzen Sie die `src` unten durch eine URL zu Ihrer lizenfreien Musikdatei.
              Da ich keine externen Dateien einbetten kann, ist dies ein Platzhalter.
              Ein Beispiel wäre eine Datei, die Sie im /public Ordner Ihres Projekts ablegen.
            */}
            <audio ref={audioRef} src="/lofi-music.mp3" loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}></audio>
        </div>
    );
};


// --- App Configuration ---
export const APP_CONFIG: Record<string, AppConfig> = {
    'about': { 
        title: 'Über Mich', 
        icon: <User />, 
        content: <AboutContent />,
        defaultSize: { width: 680, height: 320 }
    },
    'portfolio': { 
        title: 'Portfolio', 
        icon: <Briefcase />, 
        content: <PortfolioContent />,
        defaultSize: { width: 500, height: 400 }
    },
    'blog': { 
        title: 'Notizen', 
        icon: <NotebookText />, 
        content: <BlogContent />,
        defaultSize: { width: 550, height: 450 }
    },
     'systeminfo': { 
        title: 'Systeminfo', 
        icon: <CircuitBoard />, 
        content: <SysteminfoContent />,
        defaultSize: { width: 520, height: 380 }
    },
     'musicplayer': { 
        title: 'Musik', 
        icon: <Music />, 
        content: <MusicPlayerContent />,
        defaultSize: { width: 380, height: 480 }
    },
    'contact': { 
        title: 'Kontakt', 
        icon: <Mail />, 
        content: <ContactContent />,
        defaultSize: { width: 520, height: 580 }
    },
};

