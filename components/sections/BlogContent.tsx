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
        <div className="p-4 font-sans bg-background text-foreground">
            <h2 className="text-xl font-bold text-primary mb-4 px-2">Notizen & Learnings</h2>
            {loading && <div className="text-center text-muted-foreground">Lade Notizen…</div>}
            {error && <div className="text-center text-destructive">Fehler beim Laden der Notizen.</div>}
            {notes && selectedNote === null && (
                <div className="space-y-4">
                    {notes.map((note, index) => (
                        <div
                            key={note.slug}
                            className="p-4 bg-card border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                            onClick={() => setSelectedNote(index)}
                            role="button"
                            aria-label={`Notiz öffnen: ${note.title}`}
                            tabIndex={0}
                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedNote(index)}
                        >
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

export default BlogContent;
