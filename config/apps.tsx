import { ReactNode, useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Briefcase, Mail, NotebookText, CircuitBoard, Music, Play, Pause, Bot, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

// MagicUI
import { TextAnimate } from "@/components/magicui/text-animate";

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
import { motion } from 'framer-motion';
const skillBadges = [
    { label: 'TypeScript', color: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' },
    { label: 'React', color: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' },
    { label: 'UI/UX', color: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' },
    { label: 'Next.js', color: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' },
    { label: 'Figma', color: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' },
    { label: 'MagicUI', color: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' },
    { label: 'Tailwind', color: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' },
    { label: 'APIs', color: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' },
];
const vibeLevels = [
    { label: 'Creativity', value: 90 },
    { label: 'Tech', value: 85 },
    { label: 'Design', value: 80 },
    { label: 'Fun', value: 75 },
];
const AboutContent = () => (
    <div className="relative p-6 font-sans min-h-[340px] flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="relative">
            <Image
                src="/profile-image.PNG"
                alt="Kevin Tamme, Frontend Entwickler aus Frankfurt"
                width={128}
                height={128}
                className="rounded-full shadow-lg border-4 border-neutral-200 dark:border-neutral-700"
            />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1 tracking-tight text-center">
            <TextAnimate animation="blurInUp" by="word" delay={0.25}>Kevin Tamme</TextAnimate>
        </h2>
        <div className="text-base font-medium text-neutral-500 dark:text-neutral-400 text-center mb-2">
            <TextAnimate animation="blurInUp" by="word" delay={0.25 * 2}>Design. Code. Creativity.</TextAnimate>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 text-center max-w-xl mx-auto mb-2">
            <TextAnimate animation="blurInUp" by="word" delay={0.25 * 3}>Ich bin 22 Jahre jung und ein Informatik-Student aus Frankfurt. Ich liebe es, mit <span className="font-bold text-neutral-800 dark:text-neutral-100">TypeScript</span>, <span className="font-bold text-neutral-800 dark:text-neutral-100">UI/UX</span> und <span className="font-bold text-neutral-800 dark:text-neutral-100">kreativen Ideen</span> digitale Erlebnisse zu schaffen, die einem im Kopf bleiben.</TextAnimate>
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-2 mb-4">
            {skillBadges.map(badge => (
                <span key={badge.label} className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${badge.color}`}>{badge.label}</span>
            ))}
        </div>
        <div className="w-full max-w-md mx-auto mt-2">
            <h3 className="text-xs font-bold text-neutral-600 dark:text-neutral-300 mb-2 text-center">Vibe Meter</h3>
            <div className="space-y-2">
                {vibeLevels.map(vibe => (
                    <div key={vibe.label} className="flex items-center gap-2">
                        <span className="w-20 text-xs text-neutral-500 dark:text-neutral-400">{vibe.label}</span>
                        <div className="flex-1 h-2 rounded bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${vibe.value}%` }} transition={{ delay: 0.6 }} className={`h-2 rounded bg-neutral-400 dark:bg-neutral-600`} style={{ width: `${vibe.value}%` }} />
                            <motion.div />
                        </div>
                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200">{vibe.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- 2. Portfolio App ---
type ProjectJson = { title: string; description: string; liveUrl: string; githubUrl: string };
const ProjectScreenshotCard: React.FC<{ project: ProjectJson }> = ({ project }) => {
    const [imgError, setImgError] = useState(false);
    const url = project.liveUrl;
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
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex-1">{project.title}</h3>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub Repo" className="ml-2">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8c0 2.92 1.89 5.39 4.51 6.26.33.06.45-.14.45-.32v-1.13c-1.84.4-2.23-.89-2.23-.89-.3-.76-.74-.96-.74-.96-.6-.41.05-.4.05-.4.66.05 1.01.68 1.01.68.59 1.01 1.54.72 1.91.55.06-.43.23-.72.41-.89-1.47-.17-3.02-.74-3.02-3.29 0-.73.26-1.33.68-1.8-.07-.17-.29-.85.06-1.77 0 0 .55-.18 1.8.68a6.2 6.2 0 0 1 1.64-.22c.56 0 1.12.07 1.64.22 1.25-.86 1.8-.68 1.8-.68.35.92.13 1.6.06 1.77.42.47.68 1.07.68 1.8 0 2.56-1.55 3.12-3.03 3.29.24.21.45.62.45 1.25v1.85c0 .18.12.38.46.32A6.51 6.51 0 0 0 14.5 8c0-3.59-2.91-6.5-6.5-6.5z" fill="#222" /></svg>
                    </a>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 flex-1">{project.description}</p>
                <div className="flex gap-3 mt-2">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-1.5 bg-cyan-500 text-white font-medium rounded hover:bg-cyan-600 transition">Zum Projekt</a>
                </div>
            </div>
        </div>
    );
};

const PortfolioContent = () => {
    const [projects, setProjects] = useState<ProjectJson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        async function loadProjects() {
            try {
                const res = await fetch('/api/projects');
                if (!res.ok) throw new Error('Failed to load projects');
                const data = await res.json();
                setProjects(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        loadProjects();
    }, []);
    return (
        <div className="p-2 h-full flex flex-col min-w-[220px] min-h-[400px] w-full">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-3">Projekte</h2>
            {loading && <div className="text-center text-neutral-400">Lade Projekte…</div>}
            {error && <div className="text-center text-red-500">Fehler beim Laden der Projekte.</div>}
            <ul className="flex flex-col gap-4 w-full">
                {projects.map(p => (
                    <li key={p.title} className="w-full bg-white dark:bg-neutral-800 rounded-xl shadow border border-neutral-200 dark:border-neutral-700 p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition hover:shadow-lg">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">{p.title}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{p.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-cyan-500 text-white rounded font-medium text-sm hover:bg-cyan-600 transition">Live</a>
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-neutral-700 text-white rounded font-medium text-sm hover:bg-neutral-800 transition">GitHub</a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}


// --- 3. Contact App ---
// Toast component for success/error messages
const Toast = ({ show, type, message, onClose }: { show: boolean; type: 'success' | 'error'; message: string; onClose: () => void }) => {
    // Animate in from bottom right on desktop, from top on mobile
    return (
        <div
            className={`
                fixed z-50
                transition-transform duration-500 ease-out
                ${show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
                right-4 bottom-4
                sm:right-4 sm:bottom-4
                sm:translate-y-0
                w-[90vw] max-w-xs
                sm:w-auto
                sm:max-w-sm
                rounded-xl shadow-lg
                px-5 py-4
                font-medium
                text-base
                ${type === 'success' ? 'bg-green-600 text-white dark:bg-green-500' : 'bg-red-600 text-white dark:bg-red-500'}
                dark:shadow-black/40
                // Mobile: from top
                sm:bottom-4 sm:right-4
                bottom-auto top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:top-auto sm:translate-x-0
                ${show ? '' : 'sm:opacity-0 sm:pointer-events-none'}
            `}
            role="status"
            aria-live="polite"
        >
            <span>{message}</span>
            <button
                onClick={onClose}
                className="ml-4 text-white/80 hover:text-white focus:outline-none"
                aria-label="Schließen"
            >
                ×
            </button>
        </div>
    );
};

const ContactContent = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [showToast, setShowToast] = useState(false);
    const toastTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            setShowToast(true);
            if (toastTimeout.current) clearTimeout(toastTimeout.current);
            toastTimeout.current = setTimeout(() => {
                setShowToast(false);
                setStatus('idle');
            }, 3500);
        }
        return () => {
            if (toastTimeout.current) clearTimeout(toastTimeout.current);
        };
    }, [status]);

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
            <Toast
                show={showToast}
                type={status === 'success' ? 'success' : 'error'}
                message={status === 'success' ? 'Vielen Dank! Ihre Nachricht wurde gesendet.' : 'Fehler. Bitte versuchen Sie es später erneut.'}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};


// --- 4. Blog App ---
type BlogJson = { title: string; date: string; content: string };
type Note = {
    slug: string;
    title: string;
    date: string;
    content: string;
};
const BlogContent = () => {
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedNote, setSelectedNote] = useState<number | null>(null);
    useEffect(() => {
        fetch('/api/notes')
            .then(r => r.json())
            .then(data => {
                setNotes(data);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);
    return (
        <div className="p-4 font-sans">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-2">Notizen & Learnings</h2>
            {loading && <div className="text-center text-neutral-400">Lade Notizen…</div>}
            {error && <div className="text-center text-red-500">Fehler beim Laden der Notizen.</div>}
            {notes && selectedNote === null && (
                <div className="space-y-4">
                    {notes.map((note, index) => (
                        <div key={note.slug} className="p-4 bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" onClick={() => setSelectedNote(index)}>
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-1">{note.title}</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{note.date}</p>
                            <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 overflow-hidden">
                                <ReactMarkdown>{note.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {notes && selectedNote !== null && notes[selectedNote] && (
                <div className="space-y-4">
                    <button
                        className="mb-4 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                        onClick={() => setSelectedNote(null)}
                    >
                        ← Zurück zur Übersicht
                    </button>
                    <div className="p-4 bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                        <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-lg mb-1">{notes[selectedNote].title}</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{notes[selectedNote].date}</p>
                        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-neutral-600 dark:text-neutral-300">
                            <ReactMarkdown>{notes[selectedNote].content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

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
        defaultSize: { width: 680, height: 320 },
        minSize: { width: 500, height: 320 },
    },
    'portfolio': {
        title: 'Portfolio',
        icon: <Briefcase />,
        content: <PortfolioContent />,
        defaultSize: { width: 700, height: 500 },
        minSize: { width: 500, height: 400 },
    },
    'blog': {
        title: 'Notizen',
        icon: <NotebookText />,
        content: <BlogContent />,
        defaultSize: { width: 550, height: 450 },
        minSize: { width: 500, height: 400 },
    },
    'systeminfo': {
        title: 'Systeminfo',
        icon: <CircuitBoard />,
        content: <SysteminfoContent />,
        defaultSize: { width: 520, height: 380 },
        minSize: { width: 500, height: 400 },
    },
    'musicplayer': {
        title: 'Musik',
        icon: <Music />,
        content: <MusicPlayerContent />,
        defaultSize: { width: 380, height: 480 },
        minSize: { width: 500, height: 400 },
    },
    'contact': {
        title: 'Kontakt',
        icon: <Mail />,
        minSize: { width: 500, height: 400 },
        content: <ContactContent />,
        defaultSize: { width: 500, height: 600 }
    },
};
