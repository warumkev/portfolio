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
  isMaximized?: boolean;
  // store previous size/position so we can restore after un-maximizing
  prevPosition?: WindowPosition;
  prevSize?: WindowSize;
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
      if (winState.isMaximized) return; // don't resize when maximized
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
      drag={!winState.isMaximized}
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
      className="absolute backdrop-blur-xl border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden"
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
        onPointerDown={(e) => {
          if (!winState.isMaximized) dragControls.start(e);
        }}
        className={`flex items-center justify-between h-10 px-3 rounded-t-lg border-border ${
          winState.isMaximized ? "cursor-default" : "cursor-grab"
        } flex-shrink-0`}
      >
        <div className="flex items-center gap-2">
          <span className="text-primary">{config.icon}</span>
          <span
            id={`window-title-${winState.id}`}
            className="text-sm text-primary font-medium"
          >
            {config.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Maximize / Restore button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              // toggle maximize via custom event on the DOM element so parent handler is used
              const ev = new CustomEvent("toggle-maximize", {
                detail: winState.id,
              });
              window.dispatchEvent(ev);
            }}
            className="p-1 rounded-md hover:bg-muted text-primary transition-colors duration-150"
            aria-label={
              winState.isMaximized
                ? `Wiederherstellen ${config.title}`
                : `Maximieren ${config.title}`
            }
          >
            {/* simple square icon using CornerDownRight rotated for a maximize glyph? keep lucide-react iconset small */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose(winState.id);
            }}
            className="p-1 rounded-full hover:bg-destructive text-primary hover:text-secondary transition-colors duration-150"
            aria-label={`Fenster "${config.title}" schließen`}
          >
            <X size={16} />
          </motion.button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto min-h-0">{config.content}</div>
      <div
        ref={resizeRef}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize text-muted z-10"
        onPointerDown={handleResize}
        style={{ display: winState.isMaximized ? "none" : undefined }}
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
            className="absolute -top-10 px-2 py-1 text-xs bg-background text-primary rounded-md pointer-events-none whitespace-nowrap"
          >
            {config.title}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1, y: -8 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClick(id)}
        className="backdrop-blur-lg p-3 rounded-xl border border-border transition-colors"
        aria-label={`Öffne ${config.title}`}
      >
        <span className="text-primary">{config.icon}</span>
      </motion.button>
      <motion.div
        animate={{ scale: isActive ? 1 : 0 }}
        className="w-1.5 h-1.5 rounded-full bg-primary"
        aria-hidden="true"
      />
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

  // Toggle maximize: expand to viewport and save/restore previous size/position
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setWindows((prev) => {
        const win = prev[id];
        if (!win) return prev;
        if (win.isMaximized) {
          // restore
          const restored = {
            ...win,
            isMaximized: false,
            position: win.prevPosition || win.position,
            size: win.prevSize || win.size,
            prevPosition: undefined,
            prevSize: undefined,
          };
          return { ...prev, [id]: restored };
        } else {
          // maximize: save current and set to cover viewport
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const savedPosition = { ...win.position };
          const savedSize = { ...win.size };
          const maximized = {
            ...win,
            isMaximized: true,
            prevPosition: savedPosition,
            prevSize: savedSize,
            position: { x: 0, y: 0 },
            size: { width: viewportWidth, height: viewportHeight },
            zIndex: highestZIndex + 1,
          };
          setHighestZIndex((z) => z + 1);
          return { ...prev, [id]: maximized };
        }
      });
    };
    window.addEventListener("toggle-maximize", handler as EventListener);
    return () =>
      window.removeEventListener("toggle-maximize", handler as EventListener);
  }, [highestZIndex]);

  const handleDrag = (id: string, newPosition: WindowPosition) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win) return prev;
      if (win.isMaximized) return prev; // don't drag when maximized
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

  return (
    <main
      ref={constraintsRef}
      className="h-[100dvh] w-screen overflow-hidden text-primary font-sans relative select-none"
    >
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
          className="flex items-end gap-3 p-3 backdrop-blur-lg border border-border rounded-2xl"
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
