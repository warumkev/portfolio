'use client';

import { useState, useEffect } from 'react';
import DesktopView from '../components/DesktopView';
import MobileView from '../components/MobileView';

// --- Media Query Hook ---
const useMediaQuery = (query: string): boolean | null => {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// --- Hauptseite ---
export default function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile]);

  if (isMobile === null) {
  return <div className="h-screen w-screen text-white dark:bg-neutral-950" />;
  }

  return isMobile ? <MobileView /> : <DesktopView />;
}

