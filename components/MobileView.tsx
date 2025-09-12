'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG, AppConfig } from '../config/apps';
import { Wifi, Signal } from 'lucide-react';

// --- App Icon Component ---
const AppIcon: React.FC<{ id: string; config: AppConfig; onClick: (id: string) => void }> = ({ id, config, onClick }) => (
    <motion.div
        layoutId={`app-icon-${id}`}
        onClick={() => onClick(id)}
        className="flex flex-col items-center gap-2 cursor-pointer"
    >
        <div className="w-16 h-16 bg-neutral-200/60 dark:bg-neutral-800/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-black dark:text-white">
            {config.icon}
        </div>
        <span className="text-xs text-black dark:text-white font-medium">{config.title}</span>
    </motion.div>
);

// --- Main Mobile View Component ---
export default function MobileView() {
    const [openApp, setOpenApp] = useState<string | null>(null);
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateClock = () => setTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const activeAppConfig = openApp ? APP_CONFIG[openApp] : null;

    return (
        <div className="h-[100dvh] w-screen bg-neutral-200 dark:bg-neutral-900 flex items-center justify-center p-4">
            <div className="w-full max-w-sm h-full bg-black rounded-[40px] shadow-2xl border-4 border-neutral-500 dark:border-neutral-700 overflow-hidden relative flex flex-col">
                {/* Wallpaper */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#e0e0e0,_#f0f0f0)] dark:bg-[radial-gradient(circle_at_top,_#4a0d66,_#000)] opacity-70 dark:opacity-70"></div>

                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-10 px-6 flex justify-between items-center text-black dark:text-white z-20">
                    <span className="text-sm font-bold">{time}</span>
                    <div className="flex items-center gap-1">
                        <Signal size={14} />
                        <Wifi size={14} />
                        <div className="w-5 h-2.5 border border-black dark:border-white rounded-sm flex items-center p-0.5"><div className="w-full h-full bg-black dark:bg-white rounded-xs"></div></div>
                    </div>
                </div>

                {/* App Grid (Homescreen) */}
                {!openApp && (
                    <div className="flex-grow flex items-center justify-center p-8 z-10">
                        <div className="grid grid-cols-3 gap-8">
                            {Object.entries(APP_CONFIG).map(([id, config]) => (
                                <AppIcon key={id} id={id} config={config} onClick={setOpenApp} />
                            ))}
                        </div>
                    </div>
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
                            className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 z-30 flex flex-col"
                        >
                            <div className="flex-grow overflow-y-auto pt-10">
                                {activeAppConfig.content}
                            </div>
                            {/* Home Button */}
                            <div className="h-10 flex items-center justify-center">
                                <button onClick={() => setOpenApp(null)} className="w-32 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full"></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

