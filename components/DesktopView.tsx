"use client";
import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { X, CornerDownRight } from "lucide-react";
import { APP_CONFIG, AppConfig } from "@/config/apps";

// (Splash/login removed) The desktop loads immediately.

// --- Type Definitions ---
interface WindowPosition {
  x: number;
  y: number;
}
interface WindowSize {
  width: number;
  height: number;
}

interface WindowState {
  id: string;
  isOpen: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  // Removed maximize functionality
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

const Window: React.FC<WindowProps> = ({
  winState,
  onClose,
  onFocus,
  onDrag,
  onResize,
  constraintsRef,
}) => {
  const config = APP_CONFIG[winState.id];
  const resizeRef = React.useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);

  const handleResize = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onFocus(winState.id);
      const resizeStart = {
        x: event.clientX,
        y: event.clientY,
        w: winState.size.width,
        h: winState.size.height,
      };
      const minSize = config?.minSize || { width: 320, height: 240 };

      const onPointerMove = (moveEvent: PointerEvent) => {
        const dw = moveEvent.clientX - resizeStart.x;
        const dh = moveEvent.clientY - resizeStart.y;
        onResize(winState.id, {
          width: Math.max(minSize.width, resizeStart.w + dw),
          height: Math.max(minSize.height, resizeStart.h + dh),
        });
      };
      const onPointerUp = () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
      };
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [winState.id, winState.size, onFocus, onResize, config]
  );

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
      drag={true}
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
      className="absolute bg-black/20 backdrop-blur-xl border border-neutral-300 rounded-lg shadow-2xl flex flex-col overflow-hidden"
      style={{
        x: winState.position.x,
        y: winState.position.y,
        width: winState.size.width,
        height: winState.size.height,
        zIndex: winState.zIndex,
      }}
      onPointerDown={() => onFocus(winState.id)}
      aria-labelledby={`window-title-${winState.id}`}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="flex items-center justify-between h-10 px-3 rounded-t-lg border-b border-neutral-300 cursor-grab flex-shrink-0"
      >
        <div className="flex items-center gap-2 text-white">
          <span className="text-neutral-300">{config.icon}</span>
          <span
            id={`window-title-${winState.id}`}
            className="text-sm font-medium"
          >
            {config.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose(winState.id);
            }}
            className="p-1 rounded-full hover:bg-red-500/80 text-neutral-300 hover:text-white transition-colors duration-150"
            aria-label={`Fenster "${config.title}" schließen`}
          >
            <X size={16} />
          </motion.button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto min-h-0">{config.content}</div>
      <div
        ref={resizeRef}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize text-neutral-200 z-10"
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
const DockIcon: React.FC<{
  id: string;
  config: AppConfig;
  onClick: (id: string) => void;
  isActive: boolean;
}> = ({ id, config, onClick, isActive }) => {
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
        className="backdrop-blur-lg p-3 rounded-xl border border-neutral-300 transition-colors"
        aria-label={`Öffne ${config.title}`}
      >
        <span className="text-white">{config.icon}</span>
      </motion.button>
      <motion.div
        animate={{ scale: isActive ? 1 : 0 }}
        className="w-1.5 h-1.5 rounded-full bg-primary"
        aria-hidden="true"
      />
    </div>
  );
};

// --- Desktop Icon Component ---
const DesktopIcon: React.FC<{
  id: string;
  label: string;
  onClick: (id: string) => void;
}> = ({ id, label, onClick }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick(id)}
      className="flex flex-col items-center gap-2 cursor-pointer select-none"
      aria-label={label}
    >
      <img
        src="/folder.svg"
        alt={`${label} folder`}
        className="w-12 h-12 object-contain"
      />
      <span className="text-xs text-white">{label}</span>
    </div>
  );
};

const generateInitialWindows = (): Record<string, WindowState> => {
  const initialWindows: Record<string, WindowState> = {};
  Object.entries(APP_CONFIG).forEach(([id, config], index) => {
    initialWindows[id] = {
      id,
      isOpen: id === "about",
      position: { x: 150 + index * 50, y: 100 + index * 40 },
      zIndex: id === "about" ? 11 : 10,
      size: config.defaultSize,
    };
  });
  return initialWindows;
};

// --- Main Desktop Component ---
export default function DesktopView() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [windows, setWindows] = useState<Record<string, WindowState>>(
    generateInitialWindows
  );
  const [highestZIndex, setHighestZIndex] = useState(11);
  const constraintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent scrolling on desktop view
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const openWindow = (id: string) => {
    setWindows((prev) => {
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

  const closeWindow = (id: string) =>
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));

  const focusWindow = (id: string) => {
    if (windows[id].zIndex < highestZIndex) {
      const newZIndex = highestZIndex + 1;
      setHighestZIndex(newZIndex);
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], zIndex: newZIndex },
      }));
    }
  };

  const handleDrag = (id: string, newPosition: WindowPosition) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win) return prev;
      // Clamp position to viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const clampedX = Math.max(
        0,
        Math.min(newPosition.x, viewportWidth - win.size.width)
      );
      const clampedY = Math.max(
        0,
        Math.min(newPosition.y, viewportHeight - win.size.height)
      );
      return {
        ...prev,
        [id]: { ...win, position: { x: clampedX, y: clampedY } },
      };
    });
  };

  const resizeWindow = (id: string, newSize: WindowSize) =>
    setWindows((prev) => {
      const win = prev[id];
      if (!win) return prev;
      const config = APP_CONFIG[id];
      const minSize = config?.minSize || { width: 320, height: 240 };
      // Clamp size so window stays in viewport and respects minSize
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxWidth = Math.max(minSize.width, viewportWidth - win.position.x);
      const maxHeight = Math.max(
        minSize.height,
        viewportHeight - win.position.y
      );
      const clampedWidth = Math.max(
        minSize.width,
        Math.min(newSize.width, maxWidth)
      );
      const clampedHeight = Math.max(
        minSize.height,
        Math.min(newSize.height, maxHeight)
      );
      return {
        ...prev,
        [id]: { ...win, size: { width: clampedWidth, height: clampedHeight } },
      };
    });

  // Removed maximize functionality

  return (
    <main
      ref={constraintsRef}
      className="h-[100dvh] w-screen overflow-hidden text-white font-sans relative select-none"
    >
      {/* Desktop icons (e.g., Projects folder) */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-auto">
        <div className="transform -translate-x-9 translate-y-4">
          <DesktopIcon id="portfolio" label="Projekte" onClick={openWindow} />
        </div>
      </div>
      {/* Windows */}
      {Object.values(windows).map((winState) => {
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
          );
        }
        return null;
      })}
      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.5,
          }}
          className="flex items-end gap-3 p-3 backdrop-blur-lg border border-neutral-300 rounded-2xl"
        >
          {Object.entries(APP_CONFIG).map(([id, config]) => (
            <DockIcon
              key={id}
              id={id}
              config={config}
              onClick={openWindow}
              isActive={windows[id]?.isOpen ?? false}
            />
          ))}
        </motion.div>
      </div>
    </main>
  );
}
