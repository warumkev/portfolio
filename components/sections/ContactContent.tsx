import React, { useState, useRef, useEffect, FormEvent } from 'react';

// Toast component for feedback messages
const Toast = ({ show, type, message, onClose }: { show: boolean; type: 'success' | 'error'; message: string; onClose: () => void }) => {
    return (
        <div
            className={`
                fixed z-50 transition-transform duration-500 ease-out
                ${show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
                right-4 bottom-4 sm:right-4 sm:bottom-4 sm:translate-y-0
                w-[90vw] max-w-xs sm:w-auto sm:max-w-sm rounded-xl shadow-lg px-5 py-4 font-medium text-base
                ${type === 'success' ? 'bg-green-600 text-white dark:bg-green-500' : 'bg-red-600 text-white dark:bg-red-500'} dark:shadow-black/40
                sm:bottom-4 sm:right-4 bottom-auto top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:top-auto sm:translate-x-0
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

/**
 * ContactContent displays a contact form with feedback toast.
 */
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

export default ContactContent;
