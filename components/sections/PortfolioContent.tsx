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
            <h2 className="text-xl font-bold text-white mb-4 px-3">Meine Projekte</h2>
            {loading && <div className="text-center text-neutral-200">Lade Projekte…</div>}
            {error && <div className="text-center text-red-600">Fehler beim Laden der Projekte.</div>}
            <ul className="flex flex-col gap-4 w-full">
                {projects.map(p => (
                    <li
                        key={p.title}
                        className="w-full rounded-xl shadow border border-neutral-200 p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition hover:shadow-lg"
                        role="button"
                        aria-label={`Projekt öffnen: ${p.title}`}
                        tabIndex={0}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && window.open(p.liveUrl, '_blank')}
                    >
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-blue-700 mb-1">{p.title}</h3>
                            <p className="text-sm text-neutral-400 mb-2">{p.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-700 text-white rounded font-medium text-sm hover:bg-blue-800 transition">Live</a>
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white text-blue-700 rounded font-medium text-sm hover:bg-blue-200 transition">GitHub</a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PortfolioContent;
