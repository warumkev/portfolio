'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function MobileView() {
    const [openApp, setOpenApp] = useState<string | null>(null);
    const [time, setTime] = useState('');

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
        <div className="min-h-[100dvh] w-full bg-white dark:bg-neutral-900 flex flex-col items-center justify-center p-4">
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
        </div>
    );
}
