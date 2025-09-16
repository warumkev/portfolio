import { ReactNode, useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Briefcase, Mail, NotebookText, CircuitBoard, Music, Play, Pause, Moon, Sun, Volume2, VolumeX, Clock, Maximize2, Globe2, Monitor } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Declarations for app icons and content components
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

// About Me
const skillBadges = [
    { label: 'TypeScript', color: 'bg-secondary text-secondary-foreground' },
    { label: 'React', color: 'bg-secondary text-secondary-foreground' },
    { label: 'UI/UX', color: 'bg-secondary text-secondary-foreground' },
    { label: 'Next.js', color: 'bg-secondary text-secondary-foreground' },
    { label: 'Figma', color: 'bg-secondary text-secondary-foreground' },
    { label: 'MagicUI', color: 'bg-secondary text-secondary-foreground' },
    { label: 'Tailwind', color: 'bg-secondary text-secondary-foreground' },
    { label: 'APIs', color: 'bg-secondary text-secondary-foreground' },
];
const vibeLevels = [
    { label: 'Creativity', value: 90 },
    { label: 'Tech', value: 85 },
    { label: 'Design', value: 80 },
    { label: 'Fun', value: 75 },
];
const AboutContent = () => (
    <div className="p-2 h-full flex flex-col min-w-[220px] min-h-[400px] w-full bg-background text-foreground">
        <div className="justify-center flex mb-4">
            <Image
                src="/profile-image.PNG"
                alt="Kevin Tamme, Frontend Entwickler aus Frankfurt"
                width={128}
                height={128}
                className="rounded-full shadow-lg border-4 border-border"
            />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-1 tracking-tight text-center">
            Kevin Tamme
        </h2>
        <div className="text-base font-medium text-muted-foreground text-center mb-2">
            Design. Code. Creativity.
        </div>
        <p className="text-card-foreground text-center max-w-xl mx-auto mb-2">
            Ich bin 22 Jahre jung und ein Informatik-Student aus Frankfurt. Ich liebe es, mit <span className="font-bold text-primary">TypeScript</span>, <span className="font-bold text-primary">UI/UX</span> und <span className="font-bold text-primary">kreativen Ideen</span> digitale Erlebnisse zu schaffen, die einem im Kopf bleiben.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-2 mb-4">
            {skillBadges.map(badge => (
                <span key={badge.label} className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${badge.color}`}>{badge.label}</span>
            ))}
        </div>
        <div className="w-full max-w-md mx-auto mt-2">
            <h3 className="text-xs font-bold text-muted-foreground mb-2 text-center">Vibe Meter</h3>
            <div className="space-y-2">
                {vibeLevels.map(vibe => (
                    <div key={vibe.label} className="flex items-center gap-2">
                        <span className="w-20 text-xs text-muted-foreground">{vibe.label}</span>
                        <div className="flex-1 h-2 rounded bg-secondary overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${vibe.value}%` }} transition={{ delay: 0.6 }} className={`h-2 rounded bg-primary`} style={{ width: `${vibe.value}%` }} />
                            <motion.div />
                        </div>
                        <span className="text-xs font-bold text-primary">{vibe.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Portfolio
type ProjectJson = { title: string; description: string; liveUrl: string; githubUrl: string };
const ProjectScreenshotCard: React.FC<{ project: ProjectJson }> = ({ project }) => {
    const [imgError, setImgError] = useState(false);
    const url = project.liveUrl;
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&screenshot.waitForTimeout=2000`;
    return (
        <div className="rounded-xl border border-border bg-card shadow hover:shadow-lg transition overflow-hidden h-full flex flex-col w-[300px] min-w-[260px] max-w-[300px] min-h-[320px] max-h-[360px]">
            <div className="aspect-video bg-secondary flex items-center justify-center relative">
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
                        <span className="text-destructive text-sm">Screenshot nicht verfügbar</span>
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-primary flex-1">{project.title}</h3>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub Repo" className="ml-2">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8c0 2.92 1.89 5.39 4.51 6.26.33.06.45-.14.45-.32v-1.13c-1.84.4-2.23-.89-2.23-.89-.3-.76-.74-.96-.74-.96-.6-.41.05-.4.05-.4.66.05 1.01.68 1.01.68.59 1.01 1.54.72 1.91.55.06-.43.23-.72.41-.89-1.47-.17-3.02-.74-3.02-3.29 0-.73.26-1.33.68-1.8-.07-.17-.29-.85.06-1.77 0 0 .55-.18 1.8.68a6.2 6.2 0 0 1 1.64-.22c.56 0 1.12.07 1.64.22 1.25-.86 1.8-.68 1.8-.68.35.92.13 1.6.06 1.77.42.47.68 1.07.68 1.8 0 2.56-1.55 3.12-3.03 3.29.24.21.45.62.45 1.25v1.85c0 .18.12.38.46.32A6.51 6.51 0 0 0 14.5 8c0-3.59-2.91-6.5-6.5-6.5z" fill="#222" /></svg>
                    </a>
                </div>
                <p className="text-sm text-muted-foreground mb-2 flex-1">{project.description}</p>
                <div className="flex gap-3 mt-2">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-1.5 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/80 transition">Zum Projekt</a>
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
        <div className="p-2 h-full flex flex-col min-w-[220px] min-h-[400px] w-full bg-background text-foreground">
            <h2 className="text-xl font-bold text-primary mb-4 px-3">Projekte</h2>
            {loading && <div className="text-center text-muted-foreground">Lade Projekte…</div>}
            {error && <div className="text-center text-destructive">Fehler beim Laden der Projekte.</div>}
            <ul className="flex flex-col gap-4 w-full">
                {projects.map(p => (
                    <li key={p.title} className="w-full bg-card rounded-xl shadow border border-border p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition hover:shadow-lg">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-primary mb-1">{p.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/80 transition">Live</a>
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-secondary text-secondary-foreground rounded font-medium text-sm hover:bg-secondary/80 transition">GitHub</a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Contact
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
        <div className="p-6 font-sans bg-background text-foreground">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">Noch Fragen?</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md mx-auto">
                Haben Sie ein Projekt im Sinn oder möchten sich vernetzen? Ich freue mich auf Ihre Nachricht.
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 mx-auto">
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-primary">Name</label>
                    <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 bg-card border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-primary">E-Mail</label>
                    <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 bg-card border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="message" className="text-sm font-medium text-primary">Nachricht</label>
                    <textarea id="message" name="message" rows={4} required className="mt-1 block w-full px-3 py-2 bg-card border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/80 transition-all disabled:bg-muted disabled:cursor-not-allowed"
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

// Blog
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
        <div className="p-4 font-sans bg-background text-foreground">
            <h2 className="text-xl font-bold text-primary mb-4 px-2">Notizen & Learnings</h2>
            {loading && <div className="text-center text-muted-foreground">Lade Notizen…</div>}
            {error && <div className="text-center text-destructive">Fehler beim Laden der Notizen.</div>}
            {notes && selectedNote === null && (
                <div className="space-y-4">
                    {notes.map((note, index) => (
                        <div key={note.slug} className="p-4 bg-card border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors" onClick={() => setSelectedNote(index)}>
                            <h3 className="font-semibold text-primary mb-1">{note.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{note.date}</p>
                            <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-muted-foreground line-clamp-3 overflow-hidden">
                                <ReactMarkdown>{note.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {notes && selectedNote !== null && notes[selectedNote] && (
                <div className="space-y-4">
                    <button
                        className="mb-4 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-muted transition-colors"
                        onClick={() => setSelectedNote(null)}
                    >
                        ← Zurück zur Übersicht
                    </button>
                    <div className="p-4 bg-card border border-border rounded-lg">
                        <h3 className="font-semibold text-primary text-lg mb-1">{notes[selectedNote].title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{notes[selectedNote].date}</p>
                        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-muted-foreground">
                            <ReactMarkdown>{notes[selectedNote].content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// System Info
const techStack = [
    { label: "TypeScript", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    { label: "React", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200" },
    { label: "Next.js", color: "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200" },
    { label: "Tailwind CSS", color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" },
    { label: "MagicUI", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    { label: "Figma", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
    { label: "Git", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    { label: "Vercel", color: "bg-black text-white dark:bg-white dark:text-black" },
];

const SysteminfoContent = () => {
    const [date, setDate] = useState<string>("");
    const [windowSize, setWindowSize] = useState<{ w: number, h: number }>({ w: 0, h: 0 });
    const [cpu, setCpu] = useState<number>(Math.random() * 60 + 20);
    const [dark, setDark] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const stored = window.localStorage.getItem("systeminfo-darkmode");
            return stored === "true";
        }
        return false;
    });
    useEffect(() => {
        const update = () => {
            setDate(new Date().toLocaleString());
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
            setCpu(Math.random() * 60 + 20);
        };
        update();
        window.addEventListener("resize", update);
        const interval = setInterval(update, 2000);
        return () => {
            window.removeEventListener("resize", update);
            clearInterval(interval);
        };
    }, []);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("systeminfo-darkmode", dark ? "true" : "false");
        }
    }, [dark]);
    return (
        <div className="relative p-6 font-sans min-h-[340px] flex flex-col items-center justify-center bg-background text-foreground rounded-xl shadow border border-border max-w-xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary rounded-full p-3 shadow">
                    <CircuitBoard size={40} className="text-primary-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-primary">PortfoliOS v1.0</h2>
                    <p className="text-xs text-muted-foreground">© 2025 Kevin Tamme</p>
                </div>
            </div>
            <div className="flex gap-3 items-center mb-4">
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">Online</span>
                <span className="text-xs text-muted-foreground">Letztes Update: 16.09.2025</span>
            </div>
            <div className="mb-4 flex items-center gap-3 justify-center">
                <span className="text-muted-foreground">Theme:</span>
                <button
                    className={`relative flex items-center w-12 h-8 rounded-full transition-colors duration-300 focus:outline-none shadow ${dark ? "bg-primary" : "bg-muted"}`}
                    aria-label="Theme umschalten"
                    onClick={() => setDark(d => !d)}
                >
                    <span
                        className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${dark ? "translate-x-4 bg-card text-primary" : "translate-x-0 bg-card text-primary"}`}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                        {dark ? <Moon size={18} /> : <Sun size={18} />}
                    </span>
                </button>
            </div>
            <div className="mt-4 w-full space-y-3">
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                    <span className=""><Clock size={20} className="text-primary" /></span>
                    <span className="text-muted-foreground">Uhrzeit:</span>
                    <span className="ml-auto font-semibold text-card-foreground">{date}</span>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-primary"><Maximize2 size={20} /></span>
                    <span className="text-muted-foreground">Fenstergröße:</span>
                    <span className="ml-auto font-semibold text-card-foreground">{windowSize.w} x {windowSize.h}</span>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-primary"><Globe2 size={20} /></span>
                    <span className="text-muted-foreground">Browser:</span>
                    <span className="ml-auto font-semibold text-card-foreground">{typeof navigator !== "undefined" ? navigator.userAgent : "-"}</span>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-primary"><Monitor size={20} /></span>
                    <span className="text-muted-foreground">OS:</span>
                    <span className="ml-auto font-semibold text-card-foreground">{typeof navigator !== "undefined" ? navigator.platform : "-"}</span>
                </div>
            </div>
        </div>
    );
};

// Music Player
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
        <div className="p-6 h-full flex flex-col items-center justify-center bg-background text-foreground">
            <div className="w-48 h-48 bg-background rounded-lg shadow-lg mb-6 flex items-center justify-center">
                <Music size={64} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-primary">Lofi Chill</h3>
            <p className="text-sm text-muted-foreground mb-6">by Lofi Girl</p>
            <button
                onClick={togglePlayPause}
                className="w-16 h-16 bg-card rounded-full shadow-lg flex items-center justify-center text-primary hover:scale-105 transition-transform"
                aria-label={isPlaying ? "Musik anhalten" : "Musik abspielen"}
            >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <div className="w-full max-w-xs mt-6 flex items-center gap-3 hidden md:flex">
                <VolumeX size={20} className="text-muted-foreground" aria-hidden="true" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                    aria-label="Lautstärkeregler"
                    style={{ touchAction: 'pan-y' }}
                />
                <Volume2 size={20} className="text-muted-foreground" aria-hidden="true" />
            </div>
            <audio ref={audioRef} src="https://play.ilovemusic.de/ilm_ilovechillhop" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}></audio>
        </div>
    );
};

// App Config
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
