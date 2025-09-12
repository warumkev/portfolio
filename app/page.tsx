'use client';

import React, { useState, useRef, MouseEvent, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Mail, X, Rocket, Palette, CornerDownRight } from 'lucide-react';

// --- CUSTOM HOOK FOR MEDIA QUERIES ---
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      if (media.matches !== matches) setMatches(media.matches);
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [matches, query]);
  return matches;
};

// --- TYPE DEFINITIONS ---
interface Project {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

interface WindowPosition { x: number; y: number; }
interface WindowSize { width: number; height: number; }

interface WindowState {
  id: string;
  isOpen: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
}

// --- MOCK DATA ---
const projectData: Project[] = [
  { icon: <Rocket size={24} className="text-cyan-400" />, title: "Project Alpha", description: "Eine interaktive Datenvisualisierungsplattform.", link: "#" },
  { icon: <Palette size={24} className="text-rose-400" />, title: "Creative Suite", description: "Ein Design-Tool für Vektorgrafiken im Browser.", link: "#" },
  { icon: <Briefcase size={24} className="text-amber-400" />, title: "Portfolio OS", description: "Das Projekt, das Sie gerade betrachten.", link: "#" },
  { icon: <User size={24} className="text-lime-400" />, title: "Community Hub", description: "Eine soziale Plattform für lokale Gemeinschaften.", link: "#" },
];

// --- WINDOW CONTENT COMPONENTS ---

const AboutContent = () => (
  <div className="text-center p-4 h-full flex flex-col justify-center">
    <h2 className="text-xl font-bold text-neutral-100 mb-2">Willkommen!</h2>
    <p>Dies ist ein Experiment, um traditionelle Portfolios neu zu denken. Erkunden Sie die verschiedenen Fenster, um mehr zu erfahren.</p>
  </div>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/70 transition-colors duration-200 border border-transparent hover:border-neutral-700">
    <div className="flex items-start gap-4">
      <div className="mt-1">{project.icon}</div>
      <div>
        <h3 className="font-semibold text-neutral-100">{project.title}</h3>
        <p className="text-sm text-neutral-400">{project.description}</p>
      </div>
    </div>
  </a>
);

const PortfolioContent = () => (
  <div className="space-y-2">
    <h2 className="text-xl font-bold text-neutral-100 mb-4 px-3">Meine Projekte</h2>
    <div className="space-y-2">
      {projectData.map(p => <ProjectCard key={p.title} project={p} />)}
    </div>
  </div>
);

const ContactContent = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <h2 className="text-xl font-bold text-neutral-100 mb-4">Kontakt aufnehmen</h2>
    <p className="mb-6">Ich freue mich auf Ihre Nachricht.</p>
    <button className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 transition-all">E-Mail senden</button>
  </div>
);

// --- WINDOW CONFIGURATION ---
const WINDOW_CONFIG = {
  'about': { title: 'Über Mich', icon: <User size={16} className="text-neutral-400" />, content: <AboutContent /> },
  'portfolio': { title: 'Portfolio', icon: <Briefcase size={16} className="text-neutral-400" />, content: <PortfolioContent /> },
  'contact': { title: 'Kontakt', icon: <Mail size={16} className="text-neutral-400" />, content: <ContactContent /> },
};


// --- WINDOW COMPONENT ---
interface WindowProps {
  id: string;
  config: { title: string; icon: ReactNode; content: ReactNode };
  state: WindowState;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, newPosition: WindowPosition) => void;
  onResize: (id: string, newSize: WindowSize) => void;
}

const Window: React.FC<WindowProps> = ({ id, config, state, onClose, onFocus, onMove, onResize }) => {
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

// --- DOCK ICON COMPONENT ---
interface DockIconProps { onClick: () => void; icon: ReactNode; label: string; isActive: boolean; }
const DockIcon: React.FC<DockIconProps> = ({ onClick, icon, label, isActive }) => (
  <div className="flex flex-col items-center gap-1">
    <button onClick={onClick} className="bg-neutral-800/50 backdrop-blur-sm p-3 rounded-xl border border-neutral-700/80 hover:bg-neutral-700 transition-all" aria-label={`${label} öffnen`}>
      {icon}
    </button>
    <div className={`w-1 h-1 rounded-full bg-cyan-400 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
  </div>
);

// --- INITIAL STATE FACTORY ---
const getInitialWindowState = (): Record<string, WindowState> => ({
  'about': { id: 'about', isOpen: true, position: { x: 150, y: 100 }, zIndex: 11, size: { width: 500, height: 300 } },
  'portfolio': { id: 'portfolio', isOpen: false, position: { x: 300, y: 200 }, zIndex: 10, size: { width: 550, height: 450 } },
  'contact': { id: 'contact', isOpen: false, position: { x: 450, y: 150 }, zIndex: 10, size: { width: 400, height: 250 } },
});


// --- MAIN DESKTOP COMPONENT ---
export default function Desktop() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeMobileView, setActiveMobileView] = useState<string>('about');
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

  const renderDesktop = () => (
    <>
      <AnimatePresence>
        {Object.keys(windows).map(id => (
          windows[id].isOpen && <Window
            key={id} id={id}
            config={WINDOW_CONFIG[id]}
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
          {Object.keys(WINDOW_CONFIG).map(id => <DockIcon key={id} onClick={() => openWindow(id)} icon={WINDOW_CONFIG[id].icon} label={WINDOW_CONFIG[id].title} isActive={windows[id].isOpen} />)}
        </div>
      </div>
    </>
  );

  const renderMobile = () => {
    const activeConfig = WINDOW_CONFIG[activeMobileView];
    return (
      <>
        <div className="w-full h-full pt-6 pb-24 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeMobileView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="px-4">
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
                {activeConfig.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex items-center justify-around p-2 bg-neutral-800/20 backdrop-blur-lg border-t border-neutral-700">
            {Object.keys(WINDOW_CONFIG).map(id => <DockIcon key={id} onClick={() => setActiveMobileView(id)} icon={WINDOW_CONFIG[id].icon} label={WINDOW_CONFIG[id].title} isActive={activeMobileView === id} />)}
          </div>
        </div>
      </>
    );
  };

  return (
    <main className="h-[100dvh] w-screen overflow-hidden bg-neutral-950 text-neutral-200 font-sans relative select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(128,128,128,0.05)_0,_rgba(0,0,0,0)_50%)]"></div>
      {isMobile ? renderMobile() : renderDesktop()}
    </main>
  );
}

