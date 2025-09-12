'use client';

import { useState, useEffect } from 'react';
import DesktopView from '@/components/DesktopView';
import MobileView from '@/components/MobileView';

// --- Media Query Hook ---
const useMediaQuery = (query: string): boolean | null => {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    // This ensures the code only runs on the client
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener(); // Set initial state
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};


// --- Main Page Component ---
export default function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Prevents a flash of the wrong view during server-side rendering and initial client-side hydration.
  if (isMobile === null) {
    return <div className="h-screen w-screen bg-neutral-950" />;
  }

  return isMobile ? <MobileView /> : <DesktopView />;
}

