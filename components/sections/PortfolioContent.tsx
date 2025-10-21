import React, { useState, useEffect } from 'react';

// Project type for portfolio
export type ProjectJson = { title: string; description: string; liveUrl: string; githubUrl: string };

/**
 * PortfolioContent displays a list of projects with links to live and GitHub versions.
 */
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
    <div className="p-6 md:p-8 h-full flex flex-col min-w-[220px] min-h-[400px] w-full text-white">
            <h2 className="text-xl font-bold text-primary mb-4 px-3">Meine Projekte</h2>
            {loading && <div className="text-center text-muted">Lade Projekte…</div>}
            {error && <div className="text-center text-destructive">Fehler beim Laden der Projekte.</div>}
            <ul className="flex flex-col gap-4 w-full">
                {projects.map(p => (
                    <li
                        key={p.title}
                        className="w-full rounded-xl shadow border border-border p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition bg-secondary hover:bg-background/25"
                        role="button"
                        aria-label={`Projekt öffnen: ${p.title}`}
                        tabIndex={0}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && window.open(p.liveUrl, '_blank')}
                    >
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-primary mb-1">{p.title}</h3>
                            <p className="text-sm text-muted mb-2">{p.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-primary text-secondary rounded font-medium text-sm hover:bg-secondary hover:text-primary transition">Live</a>
                            {p.githubUrl && (
                                <a
                                    href={p.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-secondary text-primary rounded font-medium text-sm hover:bg-muted hover:text-secondary transition"
                                >
                                    GitHub
                                </a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PortfolioContent;
