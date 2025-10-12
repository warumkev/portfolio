import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// Note type for blog/notes
export type Note = {
    slug: string;
    title: string;
    date: string;
    content: string;
};

/**
 * BlogContent displays a list of notes/learnings and allows viewing details.
 */
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
    <div className="p-6 md:p-8 font-sans text-white">
            <h2 className="text-xl font-bold text-white mb-4 px-2">Notizen & Learnings</h2>
            {loading && <div className="text-center text-neutral-200">Lade Notizen…</div>}
            {error && <div className="text-center text-red-600">Fehler beim Laden der Notizen.</div>}
            {notes && selectedNote === null && (
                <div className="space-y-4">
                    {notes.map((note, index) => (
                        <div
                            key={note.slug}
                            className="p-4 border border-neutral-200 rounded-lg cursor-pointer bg-black hover:bg-transparent transition-colors"
                            onClick={() => setSelectedNote(index)}
                            role="button"
                            aria-label={`Notiz öffnen: ${note.title}`}
                            tabIndex={0}
                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedNote(index)}
                        >
                            <h3 className="font-semibold text-blue-700 mb-1">{note.title}</h3>
                            <p className="text-xs text-neutral-200 mb-2">{note.date}</p>
                            <div className="prose prose-neutral max-w-none text-sm text-neutral-400 line-clamp-3 overflow-hidden">
                                <ReactMarkdown>{note.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {notes && selectedNote !== null && notes[selectedNote] && (
                <div className="space-y-4">
                    <button
                        className="mb-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-white hover:text-blue-700 transition-colors"
                        onClick={() => setSelectedNote(null)}
                    >
                        ← Zurück zur Übersicht
                    </button>
                    <div className="p-4 border border-neutral-200 bg-black rounded-lg">
                        <h3 className="font-semibold text-blue-700 text-lg mb-1">{notes[selectedNote].title}</h3>
                        <p className="text-xs text-neutral-200 mb-2">{notes[selectedNote].date}</p>
                        <div className="prose prose-neutral max-w-none text-sm text-white">
                            <ReactMarkdown>{notes[selectedNote].content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogContent;
