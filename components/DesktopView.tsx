
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { X, CornerDownRight } from 'lucide-react';
import { APP_CONFIG, AppConfig } from '@/config/apps';
import { DotPattern } from '@/components/magicui/dot-pattern';

// Splash/Login Screen
import { ChevronUp } from 'lucide-react';


const SplashScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    return (
        <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -800, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background text-foreground"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.2 }}
                className="flex flex-col items-center gap-6"
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight select-none text-black dark:text-white">Portfolio von Kevin Tamme – Frontend Entwickler</h1>
                    <span className="text-base md:text-lg font-mono tracking-wide select-none text-black dark:text-white/90">Willkommen! Entdecken Sie React, Next.js, TypeScript und UI/UX Projekte.</span>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="w-full flex flex-col items-center"
                >
                    <button
                        onClick={onLogin}
                        className="px-8 py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold text-lg shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400 flex items-center gap-2"
                    >
                        <motion.span
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                            className="inline-flex"
                        >
                            <ChevronUp size={22} />
                        </motion.span>
                        <span>Unlock</span>
                    </button>
                    <span className="text-sm font-medium mt-2 text-center text-black dark:text-white/80">Click to begin</span>
                    <span className="text-xs mt-1 text-center text-black dark:text-white/70">A creative portfolio by Kevin Tamme</span>
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-6 left-0 w-full flex flex-col items-center gap-2 text-center"
            >
                <a
                    href="/safe-mode.html"
                    className="text-xs text-primary underline hover:text-primary/80 transition-colors"
                    tabIndex={0}
                >
                    Safe Mode: Simple HTML version
                </a>
                <span className="text-xs text-neutral-800 font-mono block mt-1">
                    © {new Date().getFullYear()} Kevin Tamme – portfoliOS
                </span>
            </motion.div>
        </motion.div>
    );
};

// --- Type Definitions ---
interface WindowPosition { x: number; y: number; }
interface WindowSize { width: number; height: number; }

interface WindowState {
    id: string;
    isOpen: boolean;
    position: WindowPosition;
    size: WindowSize;
    zIndex: number;
}

// --- Window Component ---
interface WindowProps {
    winState: WindowState;
    onClose: (id: string) => void;
    onFocus: (id: string) => void;
    onDrag: (id: string, newPosition: WindowPosition) => void;
    onResize: (id: string, newSize: WindowSize) => void;
    constraintsRef: React.RefObject<HTMLDivElement | null>;
}

const Window: React.FC<WindowProps> = ({ winState, onClose, onFocus, onDrag, onResize, constraintsRef }) => {
    const config = APP_CONFIG[winState.id];
    const resizeRef = React.useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();
    const windowRef = useRef<HTMLDivElement>(null);

    const handleResize = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onFocus(winState.id);
        const resizeStart = { x: event.clientX, y: event.clientY, w: winState.size.width, h: winState.size.height };
        const minSize = config?.minSize || { width: 320, height: 240 };

        const onPointerMove = (moveEvent: PointerEvent) => {
            const dw = moveEvent.clientX - resizeStart.x;
            const dh = moveEvent.clientY - resizeStart.y;
            onResize(winState.id, {
                width: Math.max(minSize.width, resizeStart.w + dw),
                height: Math.max(minSize.height, resizeStart.h + dh)
            });
        };
        const onPointerUp = () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    }, [winState.id, winState.size, onFocus, onResize, config]);

    // Accessibility: Focus management for dialog
    useEffect(() => {
        if (winState.isOpen && windowRef.current) {
            windowRef.current.focus();
        }
    }, [winState.isOpen]);

    if (!config) return null;

    return (
        <motion.div
            ref={windowRef}
            key={winState.id}
            drag
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            dragConstraints={constraintsRef}
            onDragStart={() => onFocus(winState.id)}
            onDrag={(e, info) => {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const width = winState.size.width;
                const height = winState.size.height;
                let x = winState.position.x + info.delta.x;
                let y = winState.position.y + info.delta.y;
                x = Math.max(0, Math.min(x, viewportWidth - width));
                y = Math.max(0, Math.min(y, viewportHeight - height));
                onDrag(winState.id, { x, y });
            }}
            className="absolute bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl flex flex-col overflow-hidden"
            style={{
                x: winState.position.x,
                y: winState.position.y,
                width: winState.size.width,
                height: winState.size.height,
                zIndex: winState.zIndex
            }}
            onPointerDown={() => onFocus(winState.id)}
            aria-labelledby={`window-title-${winState.id}`}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
        >
            <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex items-center justify-between h-10 px-3 bg-neutral-200/70 dark:bg-neutral-800/70 rounded-t-lg border-b border-neutral-300 dark:border-neutral-700 cursor-grab flex-shrink-0"
            >
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">{config.icon}</span>
                    <span id={`window-title-${winState.id}`} className="text-sm font-medium">{config.title}</span>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onClose(winState.id); }}
                    className="p-1 rounded-full hover:bg-red-500/80 text-neutral-500 dark:text-neutral-400 hover:text-white transition-colors duration-150"
                    aria-label={`Fenster "${config.title}" schließen`}
                >
                    <X size={16} />
                </motion.button>
            </div>
            <div className="flex-grow overflow-y-auto min-h-0">
                {config.content}
            </div>
            <div
                ref={resizeRef}
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize text-neutral-400 dark:text-neutral-600 z-10"
                onPointerDown={handleResize}
                role="slider"
                aria-label="Fenstergröße ändern"
                aria-valuenow={winState.size.width}
                tabIndex={0}
            >
                <CornerDownRight size={16} />
            </div>
        </motion.div>
    );
};

// --- Dock Icon Component ---
const DockIcon: React.FC<{ id: string; config: AppConfig; onClick: (id: string) => void; isActive: boolean; }> = ({ id, config, onClick, isActive }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex flex-col items-center gap-1 group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-10 px-2 py-1 text-xs bg-neutral-800 text-white rounded-md pointer-events-none whitespace-nowrap"
                    >
                        {config.title}
                    </motion.span>
                )}
            </AnimatePresence>
            <motion.button
                whileHover={{ scale: 1.1, y: -8 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onClick(id)}
                className="bg-neutral-200/50 dark:bg-black/20 backdrop-blur-lg p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors"
                aria-label={`Öffne ${config.title}`}
            >
                <span className="text-neutral-800 dark:text-neutral-200">{config.icon}</span>
            </motion.button>
            <motion.div
                animate={{ scale: isActive ? 1 : 0 }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
                aria-hidden="true"
            />
        </div>
    )
};

const generateInitialWindows = (): Record<string, WindowState> => {
    const initialWindows: Record<string, WindowState> = {};
    Object.entries(APP_CONFIG).forEach(([id, config], index) => {
        initialWindows[id] = {
            id,
            isOpen: id === 'about',
            position: { x: 150 + index * 50, y: 100 + index * 40 },
            zIndex: id === 'about' ? 11 : 10,
            size: config.defaultSize,
        };
    });
    return initialWindows;
};


// --- Main Desktop Component ---
export default function DesktopView() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [windows, setWindows] = useState<Record<string, WindowState>>(generateInitialWindows);
    const [highestZIndex, setHighestZIndex] = useState(11);
    const constraintsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent scrolling on desktop view
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const openWindow = (id: string) => {
        setWindows(prev => {
            const win = prev[id];
            if (!win) return prev;
            if (win.isOpen) {
                // If already open, close it
                return { ...prev, [id]: { ...win, isOpen: false } };
            } else {
                // If closed, open and bring to front
                const newZIndex = highestZIndex + 1;
                setHighestZIndex(newZIndex);
                return { ...prev, [id]: { ...win, isOpen: true, zIndex: newZIndex } };
            }
        });
    };

    const closeWindow = (id: string) => setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));

    const focusWindow = (id: string) => {
        if (windows[id].zIndex < highestZIndex) {
            const newZIndex = highestZIndex + 1;
            setHighestZIndex(newZIndex);
            setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: newZIndex } }));
        }
    };

    const handleDrag = (id: string, newPosition: WindowPosition) => {
        setWindows(prev => {
            const win = prev[id];
            if (!win) return prev;
            // Clamp position to viewport
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const clampedX = Math.max(0, Math.min(newPosition.x, viewportWidth - win.size.width));
            const clampedY = Math.max(0, Math.min(newPosition.y, viewportHeight - win.size.height));
            return {
                ...prev,
                [id]: { ...win, position: { x: clampedX, y: clampedY } }
            };
        });
    };

    const resizeWindow = (id: string, newSize: WindowSize) => setWindows(prev => {
        const win = prev[id];
        if (!win) return prev;
        const config = APP_CONFIG[id];
        const minSize = config?.minSize || { width: 320, height: 240 };
        // Clamp size so window stays in viewport and respects minSize
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxWidth = Math.max(minSize.width, viewportWidth - win.position.x);
        const maxHeight = Math.max(minSize.height, viewportHeight - win.position.y);
        const clampedWidth = Math.max(minSize.width, Math.min(newSize.width, maxWidth));
        const clampedHeight = Math.max(minSize.height, Math.min(newSize.height, maxHeight));
        return {
            ...prev,
            [id]: { ...win, size: { width: clampedWidth, height: clampedHeight } }
        };
    });

    return (
        <>
            <AnimatePresence>
                {!loggedIn && (
                    <SplashScreen key="splash" onLogin={() => setLoggedIn(true)} />
                )}
            </AnimatePresence>
            {loggedIn && (
                <main
                    ref={constraintsRef}
                    className="h-[100dvh] w-screen overflow-hidden text-black dark:text-white font-sans relative select-none"
                >
                    {/* Dot pattern background */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <DotPattern />
                    </div>
                    {/* Windows */}
                    {Object.values(windows).map(winState => {
                        if (winState.isOpen) {
                            return (
                                <Window
                                    key={winState.id}
                                    winState={winState}
                                    onClose={closeWindow}
                                    onFocus={focusWindow}
                                    onDrag={handleDrag}
                                    onResize={resizeWindow}
                                    constraintsRef={constraintsRef}
                                />
                            )
                        }
                        return null;
                    })}
                    {/* Dock */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.5 }}
                            className="flex items-end gap-3 p-3 bg-neutral-200/50 dark:bg-black/20 backdrop-blur-lg border border-neutral-300 dark:border-neutral-700 rounded-2xl"
                        >
                            {Object.entries(APP_CONFIG).map(([id, config]) => (
                                <DockIcon key={id} id={id} config={config} onClick={openWindow} isActive={windows[id]?.isOpen ?? false} />
                            ))}
                        </motion.div>
                    </div>
                </main>
            )}
        </>
    );
}

