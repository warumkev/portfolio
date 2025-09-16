'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { Suspense } from 'react';
const DotPattern = React.lazy(() => import('@/components/magicui/dot-pattern').then(mod => ({ default: mod.DotPattern })));
import { APP_CONFIG, AppConfig } from '../config/apps';
// Removed Wifi, Signal import

// --- App Icon Component ---
const AppIcon: React.FC<{ id: string; config: AppConfig; onClick: (id: string) => void }> = ({ id, config, onClick }) => (
    <motion.div
        layoutId={`app-icon-${id}`}
        onClick={() => onClick(id)}
        className="flex flex-col items-center gap-2 cursor-pointer"
        role="button"
        aria-label={`Öffne ${config.title}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(id)}
    >
        <div className="w-16 h-16 bg-neutral-200/60 dark:bg-neutral-800/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-black dark:text-white">
            {config.icon}
        </div>
        <span className="text-xs text-black dark:text-white font-medium" aria-hidden="true">{config.title}</span>
    </motion.div>
);

// --- Main Mobile View Component ---


// --- Login Splash for Mobile ---
const MobileLoginSplash: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    return (
        <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -1000, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground"
        >
            <div className="flex flex-col items-center gap-6 w-full text-center">
                <h1 className="text-4xl font-extrabold tracking-tight select-none">Portfolio von Kevin Tamme – Frontend Entwickler Frankfurt</h1>
                <span className="text-base text-neutral-500 font-mono tracking-wide select-none">Willkommen! Entdecken Sie React, Next.js, TypeScript und UI/UX Projekte.</span>
            </div>
            <motion.div
                drag="y"
                dragDirectionLock
                dragConstraints={{ top: 0, bottom: 0 }}
                style={{ touchAction: 'pan-y' }}
                onDragEnd={(_e, info) => {
                    if (info.offset.y < -60) { // swipe up threshold
                        onLogin();
                    }
                }}
                className="absolute bottom-16 left-0 right-0 flex flex-col items-center"
            >
                <motion.div
                    className="w-24 h-2 bg-primary rounded-full mb-2"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <span className="text-sm text-neutral-500 font-medium text-center">Swipe up to enter</span>
                <span className="text-xs text-neutral-400 mt-1 text-center">Just like on your phone</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-6 left-0 w-full flex flex-col items-center gap-2 text-center"
            >
                <a
                    href="/safe-mode.html"
                    className="text-xs text-neutral-500 underline hover:text-neutral-800 transition-colors"
                    tabIndex={0}
                >
                    Safe Mode: Simple HTML version
                </a>
                <span className="text-xs text-neutral-400 font-mono block mt-1">
                    © {new Date().getFullYear()} Kevin Tamme – portfoliOS
                </span>
            </motion.div>
        </motion.div>
    );
};

export default function MobileView() {
    const [openApp, setOpenApp] = useState<string | null>(null);
    const [time, setTime] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Prevent pull-to-refresh (overscroll) but allow normal scrolling
        const html = document.documentElement;
        const body = document.body;
        const prevHtmlOverscroll = html.style.overscrollBehaviorY;
        const prevBodyOverscroll = body.style.overscrollBehaviorY;
        const prevBodyTouchAction = body.style.touchAction;
        html.style.overscrollBehaviorY = 'none';
        body.style.overscrollBehaviorY = 'none';
        body.style.touchAction = 'pan-y';
        const updateClock = () => setTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => {
            clearInterval(timer);
            html.style.overscrollBehaviorY = prevHtmlOverscroll;
            body.style.overscrollBehaviorY = prevBodyOverscroll;
            body.style.touchAction = prevBodyTouchAction;
        };
    }, []);

    const activeAppConfig = openApp ? APP_CONFIG[openApp] : null;

    return (
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative">
            {/* Lazy-load DotPattern for better FCP/LCP */}
            {(!openApp && loggedIn) && (
                <Suspense fallback={null}>
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <DotPattern />
                    </div>
                </Suspense>
            )}
            <AnimatePresence>
                {!loggedIn && (
                    <MobileLoginSplash key="mobile-login" onLogin={() => setLoggedIn(true)} />
                )}
            </AnimatePresence>
            {loggedIn && (
                <>
                    {/* Large Centered Time Widget */}
                    {!openApp && (
                        <>
                            <div className="w-full flex flex-col items-center mb-8 mt-8">
                                <span className="text-5xl font-extrabold text-black dark:text-white tracking-tight drop-shadow-sm">{time}</span>
                            </div>
                            <div className="flex-grow flex items-center justify-center p-8 z-10 w-full">
                                <div className="grid grid-cols-3 gap-8 w-full max-w-xl mx-auto">
                                    {Object.entries(APP_CONFIG).map(([id, config]) => (
                                        <AppIcon key={id} id={id} config={config} onClick={setOpenApp} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Opened App */}
                    <AnimatePresence>
                        {openApp && activeAppConfig && (
                            <motion.div
                                layoutId={`app-icon-${openApp}`}
                                initial={{ borderRadius: '1.5rem', scale: 0.5, opacity: 0 }}
                                animate={{ borderRadius: 0, scale: 1, opacity: 1 }}
                                exit={{ borderRadius: '1.5rem', scale: 0.5, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900 z-30 flex flex-col"
                            >
                                <div className="flex-grow pt-10 pb-14 overflow-y-auto">
                                    {activeAppConfig.content}
                                </div>
                                {/* Home Button with swipe-to-close, always visible at bottom */}
                                <motion.div
                                    className="fixed left-0 right-0 bottom-0 h-14 flex items-center justify-center z-50"
                                    drag="y"
                                    dragDirectionLock
                                    dragConstraints={{ top: 0, bottom: 0 }}
                                    style={{ touchAction: 'pan-y' }}
                                    onDragEnd={(_e, info) => {
                                        if (info.offset.y < -60) { // swipe up threshold
                                            setOpenApp(null);
                                        }
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenApp(null)}
                                        className="w-32 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full"
                                        aria-label="Zum Home-Bildschirm zurückkehren"
                                    ></button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}
