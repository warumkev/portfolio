'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CornerDownRight } from 'lucide-react';
import { APP_CONFIG } from '@/config/apps';

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
    onMove: (id: string, newPosition: WindowPosition) => void;
    onResize: (id: string, newSize: WindowSize) => void;
}

const Window: React.FC<WindowProps> = ({ winState, onClose, onFocus, onMove, onResize }) => {
    const headerRef = React.useRef<HTMLDivElement>(null);
    const resizeRef = React.useRef<HTMLDivElement>(null);

    const config = APP_CONFIG[winState.id];
    if (!config) return null;

    const handleDrag = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!(headerRef.current && headerRef.current.contains(event.target as Node))) return;
        onFocus(winState.id);
        const dragStart = { x: event.clientX, y: event.clientY, elX: winState.position.x, elY: winState.position.y };
        const onPointerMove = (moveEvent: PointerEvent) => {
            const dx = moveEvent.clientX - dragStart.x;
            const dy = moveEvent.clientY - dragStart.y;
            onMove(winState.id, { x: dragStart.elX + dx, y: dragStart.elY + dy });
        };
        const onPointerUp = () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    }, [winState.id, winState.position, onFocus, onMove]);

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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl flex flex-col"
            style={{
                left: `${winState.position.x}px`,
                top: `${winState.position.y}px`,
                zIndex: winState.zIndex,
                width: `${winState.size.width}px`,
                height: `${winState.size.height}px`,
            }}
            onPointerDown={() => onFocus(winState.id)}
        >
            <div
                ref={headerRef}
                className="flex items-center justify-between h-10 px-3 bg-neutral-200/70 dark:bg-neutral-800/70 rounded-t-lg border-b border-neutral-300 dark:border-neutral-700 cursor-grab"
                onPointerDown={handleDrag}
            >
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 dark:text-neutral-400">{config.icon}</span>
                    <span className="text-sm font-medium">{config.title}</span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(winState.id); }}
                    className="p-1 rounded-full hover:bg-red-500/80 text-neutral-500 dark:text-neutral-400 hover:text-white transition-colors duration-150"
                >
                    <X size={16} />
                </button>
            </div>
            <div className="p-1 flex-grow overflow-y-auto">
                {config.content}
            </div>
            <div
                ref={resizeRef}
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize text-neutral-400 dark:text-neutral-600"
                onPointerDown={handleResize}
            >
                <CornerDownRight size={16} />
            </div>
        </motion.div>
    );
};

// --- Dock Icon Component ---
const DockIcon: React.FC<{ id: string; onClick: (id: string) => void; isActive: boolean; }> = ({ id, onClick, isActive }) => {
    const config = APP_CONFIG[id];
    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={() => onClick(id)}
                className="bg-neutral-200/50 dark:bg-black/20 backdrop-blur-lg p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300/70 dark:hover:bg-neutral-700/50 transition-all duration-200"
            >
                <span className="text-neutral-800 dark:text-neutral-200">{config.icon}</span>
            </button>
            <div className={`w-1 h-1 rounded-full bg-cyan-400 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
    )
};

// --- Main Desktop Component ---
export default function DesktopView() {
    const [windows, setWindows] = React.useState<Record<string, WindowState>>({
        'about': { id: 'about', isOpen: true, position: { x: 150, y: 100 }, zIndex: 11, size: { width: 500, height: 300 } },
        'portfolio': { id: 'portfolio', isOpen: false, position: { x: 300, y: 200 }, zIndex: 10, size: { width: 600, height: 400 } },
        'contact': { id: 'contact', isOpen: false, position: { x: 450, y: 150 }, zIndex: 10, size: { width: 400, height: 250 } },
    });
    const [highestZIndex, setHighestZIndex] = React.useState(11);

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

    const moveWindow = (id: string, newPosition: WindowPosition) => setWindows(prev => ({ ...prev, [id]: { ...prev[id], position: newPosition } }));
    const resizeWindow = (id: string, newSize: WindowSize) => setWindows(prev => ({ ...prev, [id]: { ...prev[id], size: newSize } }));

    return (
        <main className="h-[100dvh] w-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 text-black dark:text-white font-sans relative select-none">
            <div className="absolute inset-0 bg-transparent dark:bg-[radial-gradient(circle_at_center,_rgba(40,40,80,0.3)_0,_rgba(10,10,20,0)_50%)]"></div>

            <AnimatePresence>
                {Object.values(windows).map(winState => (
                    winState.isOpen && <Window
                        key={winState.id}
                        winState={winState}
                        onClose={closeWindow}
                        onFocus={focusWindow}
                        onMove={moveWindow}
                        onResize={resizeWindow}
                    />
                ))}
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex items-end gap-3 p-3 bg-neutral-200/50 dark:bg-black/20 backdrop-blur-lg border border-neutral-300 dark:border-neutral-700 rounded-2xl">
                    {Object.keys(APP_CONFIG).map(id => (
                        <DockIcon key={id} id={id} onClick={openWindow} isActive={windows[id]?.isOpen ?? false} />
                    ))}
                </div>
            </div>
        </main>
    );
}

