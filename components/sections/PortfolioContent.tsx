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
        <div className="p-2 h-full flex flex-col min-w-[220px] min-h-[400px] w-full bg-background text-foreground">
            <h2 className="text-xl font-bold text-primary mb-4 px-3">Projekte</h2>
            {loading && <div className="text-center text-muted-foreground">Lade Projekte…</div>}
            {error && <div className="text-center text-destructive">Fehler beim Laden der Projekte.</div>}
            <ul className="flex flex-col gap-4 w-full">
                {projects.map(p => (
                    <li
                        key={p.title}
                        className="w-full bg-card rounded-xl shadow border border-border p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition hover:shadow-lg"
                        role="button"
                        aria-label={`Projekt öffnen: ${p.title}`}
                        tabIndex={0}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && window.open(p.liveUrl, '_blank')}
                    >
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
};

export default PortfolioContent;
