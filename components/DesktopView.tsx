'use client';

import React, { useState, useRef, MouseEvent, useCallback, ReactNode, useEffect } from 'react';
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
    id: string;
    state: WindowState;
    onClose: (id: string) => void;
    onFocus: (id: string) => void;
    onMove: (id: string, newPosition: WindowPosition) => void;
    onResize: (id: string, newSize: WindowSize) => void;
}

const Window: React.FC<WindowProps> = ({ id, state, onClose, onFocus, onMove, onResize }) => {
    const config = APP_CONFIG[id];
    const dragRef = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);
    const resizeRef = useRef<{ startX: number; startY: number; elW: number; elH: number } | null>(null);

    const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
        if (dragRef.current) {
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            onMove(id, { x: dragRef.current.elX + dx, y: dragRef.current.elY + dy });
        }
        if (resizeRef.current) {
            const dx = e.clientX - resizeRef.current.startX;
            const dy = e.clientY - resizeRef.current.startY;
            const newWidth = Math.max(300, resizeRef.current.elW + dx);
            const newHeight = Math.max(200, resizeRef.current.elH + dy);
            onResize(id, { width: newWidth, height: newHeight });
        }
    }, [id, onMove, onResize]);

    const handleMouseUp = useCallback(() => {
        dragRef.current = null;
        resizeRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleHeaderMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        onFocus(id);
        dragRef.current = { startX: e.clientX, startY: e.clientY, elX: state.position.x, elY: state.position.y };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleResizeMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (e.button !== 0) return;
        onFocus(id);
        resizeRef.current = { startX: e.clientX, startY: e.clientY, elW: state.size.width, elH: state.size.height };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bg-neutral-900/80 backdrop-blur-md border border-neutral-700 rounded-lg shadow-2xl flex flex-col"
            style={{ left: state.position.x, top: state.position.y, zIndex: state.zIndex, width: state.size.width, height: state.size.height }}
        >
            <div className="window-header flex items-center justify-between h-10 px-3 bg-neutral-800/70 rounded-t-lg border-b border-neutral-700 cursor-grab active:cursor-grabbing" onMouseDown={handleHeaderMouseDown}>
                <div className="flex items-center gap-2">{config.icon}<span className="text-sm font-medium text-neutral-200">{config.title}</span></div>
                <button onClick={() => onClose(id)} className="p-1 rounded-full hover:bg-red-500/80 text-neutral-400 hover:text-white transition-colors" aria-label="Fenster schließen"><X size={16} /></button>
            </div>
            <div className="p-1 flex-grow overflow-y-auto text-neutral-300 relative">
                <div className="p-3 h-full">{config.content}</div>
                <div className="absolute bottom-0 right-0 cursor-se-resize p-1 text-neutral-600 hover:text-neutral-400" onMouseDown={handleResizeMouseDown}>
                    <CornerDownRight size={14} />
                </div>
            </div>
        </motion.div>
    );
};

// --- Dock Icon Component ---
interface DockIconProps { onClick: () => void; icon: ReactNode; label: string; isActive: boolean; }
const DockIcon: React.FC<DockIconProps> = ({ onClick, icon, label, isActive }) => (
    <div className="flex flex-col items-center gap-1">
        <button onClick={onClick} className="bg-neutral-800/50 backdrop-blur-sm p-3 rounded-xl border border-neutral-700/80 hover:bg-neutral-700 transition-all" aria-label={`${label} öffnen`}>
            {icon}
        </button>
        <div className={`w-1 h-1 rounded-full bg-cyan-400 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
);

// --- Initial State Factory ---
const getInitialWindowState = (): Record<string, WindowState> => ({
    'about': { id: 'about', isOpen: true, position: { x: 150, y: 100 }, zIndex: 11, size: APP_CONFIG['about'].defaultSize },
    'portfolio': { id: 'portfolio', isOpen: false, position: { x: 300, y: 200 }, zIndex: 10, size: APP_CONFIG['portfolio'].defaultSize },
    'contact': { id: 'contact', isOpen: false, position: { x: 450, y: 150 }, zIndex: 10, size: APP_CONFIG['contact'].defaultSize },
});

// --- Main Desktop Component ---
export default function DesktopView() {
    const [windows, setWindows] = useState<Record<string, WindowState>>(getInitialWindowState);
    const [highestZIndex, setHighestZIndex] = useState(11);

    const updateWindowState = (id: string, updates: Partial<WindowState>) => {
        setWindows(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
    };

    const openWindow = (id: string) => {
        const newZIndex = highestZIndex + 1;
        setHighestZIndex(newZIndex);
        updateWindowState(id, { isOpen: true, zIndex: newZIndex });
    };

    const focusWindow = (id: string) => {
        if (windows[id].zIndex < highestZIndex) {
            const newZIndex = highestZIndex + 1;
            setHighestZIndex(newZIndex);
            updateWindowState(id, { zIndex: newZIndex });
        }
    };

    return (
        <div className="h-[100dvh] w-screen overflow-hidden bg-neutral-950 text-neutral-200 font-sans relative select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(128,128,128,0.05)_0,_rgba(0,0,0,0)_50%)]"></div>
            <AnimatePresence>
                {Object.keys(windows).map(id => (
                    windows[id].isOpen && <Window
                        key={id} id={id}
                        state={windows[id]}
                        onClose={(id) => updateWindowState(id, { isOpen: false })}
                        onFocus={focusWindow}
                        onMove={(id, pos) => updateWindowState(id, { position: pos })}
                        onResize={(id, size) => updateWindowState(id, { size: size })}
                    />
                ))}
            </AnimatePresence>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex items-end gap-3 p-3 bg-neutral-800/20 backdrop-blur-lg border border-neutral-700 rounded-2xl">
                    {Object.keys(APP_CONFIG).map(id => <DockIcon key={id} onClick={() => openWindow(id)} icon={APP_CONFIG[id].icon} label={APP_CONFIG[id].title} isActive={windows[id].isOpen} />)}
                </div>
            </div>
        </div>
    );
}

