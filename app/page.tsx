'use client';

import React, { useState, useRef, MouseEvent, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Mail, Settings, X, Sun, Moon, Rocket, Palette } from 'lucide-react';

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
type Theme = 'light' | 'dark';

interface Project {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

interface WindowPosition {
  x: number;
  y: number;
}

interface WindowState {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  position: WindowPosition;
  zIndex: number;
  size: { width: number; height: number };
}

// --- MOCK DATA ---
const projectData: Project[] = [
  { icon: <Rocket size={24} className="text-cyan-400" />, title: "Project Alpha", description: "Eine interaktive Datenvisualisierungsplattform mit Echtzeit-Updates.", link: "#" },
  { icon: <Palette size={24} className="text-rose-400" />, title: "Creative Suite", description: "Ein Design-Tool für die Erstellung von Vektorgrafiken im Browser.", link: "#" },
  { icon: <Briefcase size={24} className="text-amber-400" />, title: "Portfolio OS", description: "Das Projekt, das Sie gerade betrachten. Ein Betriebssystem im Browser.", link: "#" },
  { icon: <User size={24} className="text-lime-400" />, title: "Community Hub", description: "Eine soziale Plattform für lokale Gemeinschaften zum Austausch.", link: "#" },
  { icon: <Mail size={24} className="text-violet-400" />, title: "Secure Messenger", description: "Ein Ende-zu-Ende-verschlüsselter Messenger-Dienst.", link: "#" },
];

// --- SUB-COMPONENTS ---

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <a
    href={project.link}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-4 rounded-lg bg-background-secondary/50 hover:bg-background-tertiary transition-colors duration-200 border border-transparent hover:border-border-primary"
  >
    <div className="flex items-start gap-4">
      <div className="mt-1">{project.icon}</div>
      <div>
        <h3 className="font-semibold text-text-primary">{project.title}</h3>
        <p className="text-sm text-text-secondary">{project.description}</p>
      </div>
    </div>
  </a>
);

const ThemeSwitcher: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => (
  <div className="flex flex-col items-center gap-4 p-4">
    <p className="text-sm text-text-secondary">Wähle ein Farbschema</p>
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="flex items-center justify-center w-32 h-12 bg-background-secondary border border-border-primary rounded-lg text-text-primary hover:bg-background-tertiary transition-colors"
    >
      {theme === 'dark' ? <Moon className="mr-2" size={16} /> : <Sun className="mr-2" size={16} />}
      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
    </button>
  </div>
);

// --- WINDOW COMPONENT (for Desktop) ---
interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, newPosition: WindowPosition) => void;
}

const Window: React.FC<WindowProps> = ({ window, onClose, onFocus, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    const newX = Math.max(0, Math.min(globalThis.window.innerWidth - window.size.width, dragStartRef.current.elX + dx));
    const newY = Math.max(0, Math.min(globalThis.window.innerHeight - window.size.height, dragStartRef.current.elY + dy));
    onMove(window.id, { x: newX, y: newY });
  }, [onMove, window.id, window.size]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    onFocus(window.id);
    setIsDragging(true);
    dragStartRef.current = { startX: e.clientX, startY: e.clientY, elX: window.position.x, elY: window.position.y };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute bg-background-primary/80 backdrop-blur-md border border-border-primary rounded-lg shadow-2xl flex flex-col"
      style={{
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        zIndex: window.zIndex,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
      }}
      onMouseDown={() => onFocus(window.id)}
    >
      <div
        className="window-header flex items-center justify-between h-10 px-3 bg-background-secondary/70 rounded-t-lg border-b border-border-primary cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          {window.icon}
          <span className="text-sm font-medium text-text-primary">{window.title}</span>
        </div>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onClose(window.id)}
          className="p-1 rounded-full hover:bg-red-500/80 text-text-secondary hover:text-white transition-colors"
          aria-label="Fenster schließen"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-1 flex-grow overflow-y-auto text-text-secondary">
        <div className="p-3 h-full">
          {window.content}
        </div>
      </div>
    </motion.div>
  );
};

// --- DOCK ICON COMPONENT (reusable) ---
interface DockIconProps { onClick: () => void; icon: ReactNode; label: string; isActive: boolean; }
const DockIcon: React.FC<DockIconProps> = ({ onClick, icon, label, isActive }) => (
  <div className="flex flex-col items-center gap-1">
    <button onClick={onClick} className="bg-background-secondary/50 backdrop-blur-sm p-3 rounded-xl border border-border-primary/80 hover:bg-background-tertiary transition-all" aria-label={`${label} öffnen`}>
      {icon}
    </button>
    <div className={`w-1 h-1 rounded-full bg-cyan-400 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
  </div>
);


// --- MAIN DESKTOP COMPONENT ---
export default function Desktop() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeMobileView, setActiveMobileView] = useState<string>('about');
  const [theme, setTheme] = useState<Theme>('dark');
  const [highestZIndex, setHighestZIndex] = useState(12);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const [windows, setWindows] = useState<Record<string, WindowState>>({
    'about': {
      id: 'about', title: 'Über Mich', icon: <User size={16} className="text-text-secondary" />,
      content: <div className="text-center p-4"><h2 className="text-xl font-bold text-text-primary mb-2">Willkommen!</h2><p>Dies ist ein Experiment, um traditionelle Portfolios neu zu denken. Erkunden Sie die verschiedenen Fenster, um mehr zu erfahren.</p></div>,
      isOpen: true, position: { x: 150, y: 100 }, zIndex: 11, size: { width: 500, height: 300 },
    },
    'portfolio': {
      id: 'portfolio', title: 'Portfolio', icon: <Briefcase size={16} className="text-text-secondary" />,
      content: <div className="space-y-2"><h2 className="text-xl font-bold text-text-primary mb-4 px-3">Meine Projekte</h2><div className="space-y-2">{projectData.map(p => <ProjectCard key={p.title} project={p} />)}</div></div>,
      isOpen: false, position: { x: 300, y: 200 }, zIndex: 10, size: { width: 550, height: 450 },
    },
    'contact': {
      id: 'contact', title: 'Kontakt', icon: <Mail size={16} className="text-text-secondary" />,
      content: <div className="flex flex-col items-center justify-center h-full text-center"><h2 className="text-xl font-bold text-text-primary mb-4">Kontakt aufnehmen</h2><p className="mb-6">Ich freue mich auf Ihre Nachricht.</p><button className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 transition-all">E-Mail senden</button></div>,
      isOpen: false, position: { x: 450, y: 150 }, zIndex: 10, size: { width: 400, height: 250 },
    },
    'settings': {
      id: 'settings', title: 'Einstellungen', icon: <Settings size={16} className="text-text-secondary" />,
      content: <ThemeSwitcher theme={theme} setTheme={setTheme} />,
      isOpen: false, position: { x: 200, y: 250 }, zIndex: 12, size: { width: 300, height: 200 },
    }
  });

  const openWindow = (id: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: true, zIndex: newZIndex } }));
  };
  const closeWindow = (id: string) => { setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } })); };
  const focusWindow = (id: string) => {
    if (windows[id].zIndex < highestZIndex) {
      const newZIndex = highestZIndex + 1;
      setHighestZIndex(newZIndex);
      setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: newZIndex } }));
    }
  };
  const moveWindow = (id: string, newPosition: WindowPosition) => { setWindows(prev => ({ ...prev, [id]: { ...prev[id], position: newPosition } })); };
  const handleMobileNav = (id: string) => { setActiveMobileView(id); };

  const renderDesktop = () => (
    <>
      <AnimatePresence>
        {Object.values(windows).map(w => w.isOpen && <Window key={w.id} window={w} onClose={closeWindow} onFocus={focusWindow} onMove={moveWindow} />)}
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex items-end gap-3 p-3 bg-background-secondary/20 backdrop-blur-lg border border-border-primary rounded-2xl">
          {Object.values(windows).map(w => <DockIcon key={w.id} onClick={() => openWindow(w.id)} icon={w.icon} label={w.title} isActive={w.isOpen} />)}
        </div>
      </div>
    </>
  );

  const renderMobile = () => {
    const activeWindow = windows[activeMobileView];
    return (
      <>
        <div className="w-full h-full pt-6 pb-24 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMobileView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="px-4"
            >
              <div className="bg-background-secondary/50 border border-border-primary rounded-xl p-4">
                {activeWindow.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex items-center justify-around p-2 bg-background-secondary/20 backdrop-blur-lg border-t border-border-primary">
            {Object.values(windows).map(w => <DockIcon key={w.id} onClick={() => handleMobileNav(w.id)} icon={w.icon} label={w.title} isActive={activeMobileView === w.id} />)}
          </div>
        </div>
      </>
    );
  };

  return (
    <main className="h-[100dvh] w-screen overflow-hidden bg-background-primary text-text-primary font-sans relative select-none">
      <style>{`
            :root.light {
                --background-primary: #f0f0f0;
                --background-secondary: #e0e0e0;
                --background-tertiary: #d0d0d0;
                --border-primary: #cccccc;
                --text-primary: #111111;
                --text-secondary: #555555;
            }
            :root.dark {
                --background-primary: #0a0a0a;
                --background-secondary: #1a1a1a;
                --background-tertiary: #2a2a2a;
                --border-primary: #333333;
                --text-primary: #eeeeee;
                --text-secondary: #aaaaaa;
            }
            body {
                background-color: var(--background-primary);
            }
            .bg-background-primary { background-color: var(--background-primary); }
            .bg-background-secondary { background-color: var(--background-secondary); }
            .bg-background-tertiary { background-color: var(--background-tertiary); }
            .border-border-primary { border-color: var(--border-primary); }
            .text-text-primary { color: var(--text-primary); }
            .text-text-secondary { color: var(--text-secondary); }
        `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(128,128,128,0.05)_0,_rgba(0,0,0,0)_50%)]"></div>
      {isMobile ? renderMobile() : renderDesktop()}
    </main>
  );
}

