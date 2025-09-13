'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, CornerDownRight } from 'lucide-react';
import { APP_CONFIG, AppConfig } from '@/config/apps';

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
    onDragEnd: (id: string, info: PanInfo) => void;
    onResize: (id: string, newSize: WindowSize) => void;
}

const Window: React.FC<WindowProps> = ({ winState, onClose, onFocus, onDrag, onDragEnd, onResize }) => {
    const resizeRef = React.useRef<HTMLDivElement>(null);

    const handleResize = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onFocus(winState.id);
        const resizeStart = { x: event.clientX, y: event.clientY, w: winState.size.width, h: winState.size.height };

        const onPointerMove = (moveEvent: PointerEvent) => {
            const dw = moveEvent.clientX - resizeStart.x;
            const dh = moveEvent.clientY - resizeStart.y;
            onResize(winState.id, { width: Math.max(300, resizeStart.w + dw), height: Math.max(200, resizeStart.h + dh) });
        };
        const onPointerUp = () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    }, [winState.id, winState.size, onFocus, onResize]);

    const config = APP_CONFIG[winState.id];
    if (!config) return null;

    return (
        <motion.div
            key={winState.id}
            drag
            dragMomentum={false}
            onDragStart={() => onFocus(winState.id)}
            onDrag={(e, info) => onDrag(winState.id, { x: info.point.x - info.delta.x, y: info.point.y - info.delta.y })}
            onDragEnd={(e, info) => onDragEnd(winState.id, info)}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                x: winState.position.x,
                y: winState.position.y,
                width: winState.size.width,
                height: winState.size.height,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl flex flex-col overflow-hidden"
            style={{ zIndex: winState.zIndex }}
            onPointerDown={() => onFocus(winState.id)}
        >
            <div
                className="flex items-center justify-between h-10 px-3 bg-neutral-200/70 dark:bg-neutral-800/70 rounded-t-lg border-b border-neutral-300 dark:border-neutral-700 cursor-grab flex-shrink-0"
            >
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">{config.icon}</span>
                    <span className="text-sm font-medium">{config.title}</span>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onClose(winState.id); }}
                    className="p-1 rounded-full hover:bg-red-500/80 text-neutral-500 dark:text-neutral-400 hover:text-white transition-colors duration-150"
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
            >
                <span className="text-neutral-800 dark:text-neutral-200">{config.icon}</span>
            </motion.button>
            <motion.div
                animate={{ scale: isActive ? 1 : 0 }}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
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
    const [windows, setWindows] = useState<Record<string, WindowState>>(generateInitialWindows);
    const [highestZIndex, setHighestZIndex] = useState(11);

    const openWindow = (id: string) => {
        const newZIndex = highestZIndex + 1;
        setHighestZIndex(newZIndex);
        setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: true, zIndex: newZIndex } }));
    };

    const closeWindow = (id: string) => setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));

    const focusWindow = (id: string) => {
        if (windows[id].zIndex < highestZIndex) {
            const newZIndex = highestZIndex + 1;
            setHighestZIndex(newZIndex);
            setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: newZIndex } }));
        }
    };

    const moveWindow = (id: string, newPosition: WindowPosition) => {
        setWindows(prev => ({ ...prev, [id]: { ...prev[id], position: newPosition } }));
    };

    const handleDragEnd = (id: string, info: PanInfo) => {
        const snapThreshold = 50;
        let newPos = { x: info.point.x, y: info.point.y };

        if (info.point.x < snapThreshold) { newPos.x = 0; }
        if (info.point.y < snapThreshold) { newPos.y = 0; }
        if (window.innerWidth - info.point.x < snapThreshold) { newPos.x = window.innerWidth - windows[id].size.width; }
        if (window.innerHeight - info.point.y < snapThreshold) { newPos.y = window.innerHeight - windows[id].size.height; }

        setWindows(prev => ({ ...prev, [id]: { ...prev[id], position: newPos } }));
    }

    const resizeWindow = (id: string, newSize: WindowSize) => setWindows(prev => ({ ...prev, [id]: { ...prev[id], size: newSize } }));

    return (
        <main className="h-[100dvh] w-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 text-black dark:text-white font-sans relative select-none">
            <div className="absolute inset-0 bg-transparent dark:bg-[radial-gradient(circle_at_center,_rgba(40,40,80,0.3)_0,_rgba(10,10,20,0)_50%)]"></div>

            <AnimatePresence>
                {Object.values(windows).map(winState => {
                    if (winState.isOpen) {
                        return (
                            <Window
                                key={winState.id}
                                winState={winState}
                                onClose={closeWindow}
                                onFocus={focusWindow}
                                onDrag={moveWindow}
                                onDragEnd={handleDragEnd}
                                onResize={resizeWindow}
                            />
                        )
                    }
                    return null;
                })}
            </AnimatePresence>

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
    );
}

