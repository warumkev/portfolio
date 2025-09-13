import { ReactNode, useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { User, Briefcase, Mail, NotebookText, CircuitBoard, Music, Play, Pause, Bot, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
// import { fetchLinkPreview, LinkPreview } from '../lib/linkPreview';


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
    minSize?: { width: number; height: number };
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




const ProjectScreenshotCard: React.FC<{ project: Project }> = ({ project }) => {
    const [imgError, setImgError] = useState(false);
    const url = project.url.startsWith('http') ? project.url : `https://${project.url}`;
    // Microlink screenshot API
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&screenshot.waitForTimeout=2000`;
    return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow hover:shadow-lg transition overflow-hidden h-full flex flex-col w-[300px] min-w-[260px] max-w-[300px] min-h-[320px] max-h-[360px]">
            <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative">
                {!imgError ? (
                    <img
                        src={screenshotUrl}
                        alt={project.title + ' Screenshot'}
                        className="object-contain w-full h-full max-w-full max-h-80"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full p-4">
                        <span className="text-neutral-400 text-sm">Screenshot nicht verfügbar</span>
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-500">{project.icon}</span>
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex-1">{project.title}</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 flex-1">{project.description}</p>
                <div className="flex gap-3 mt-2">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline font-medium">Zur Website</a>
                    {project.url.includes('github.com') && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-neutral-400 mt-1">GitHub</a>
                    )}
                </div>
            </div>
        </div>
    );
};

const PortfolioContent = () => (
    <div className="p-1 h-full flex flex-col min-w-[220px] min-h-[400px]">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-3">Projekte</h2>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] gap-6 items-stretch flex-1 min-h-0 grid-auto-rows-auto justify-center">
            {projectData.map(p => (
                <div key={p.title} className="flex justify-center h-full">
                    <div className="w-[260px] min-w-[220px] max-w-[260px] h-full min-h-[320px] max-h-[360px] flex flex-col">
                        <ProjectScreenshotCard project={p} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- 3. Contact App ---
const ContactContent = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('sending');
        const form = event.currentTarget;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setStatus('success');
                form.reset();
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
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
    const [volume, setVolume] = useState(0.5);
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

    const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
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
                aria-label={isPlaying ? "Musik anhalten" : "Musik abspielen"}
            >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <div className="w-full max-w-xs mt-6 flex items-center gap-3 hidden md:flex">
                <VolumeX size={20} className="text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full"
                    aria-label="Lautstärkeregler"
                    style={{ touchAction: 'pan-y' }}
                />
                <Volume2 size={20} className="text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
            </div>
            <audio ref={audioRef} src="https://play.ilovemusic.de/ilm_ilovechillhop" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}></audio>
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
        defaultSize: { width: 700, height: 500 }, // larger default for better grid
        minSize: { width: 260, height: 400 }, // enforce min size for list view usability
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
