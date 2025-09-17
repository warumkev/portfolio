// App configuration for all window sections
export const APP_CONFIG: Record<string, AppConfig> = {
    about: {
        title: 'Über mich',
        icon: <User size={20} />, // adjust icon as needed
        content: <AboutContent />,
        defaultSize: { width: 420, height: 600 },
        minSize: { width: 320, height: 400 },
    },
    portfolio: {
        title: 'Portfolio',
        icon: <Briefcase size={20} />,
        content: <PortfolioContent />,
        defaultSize: { width: 520, height: 600 },
        minSize: { width: 320, height: 400 },
    },
    contact: {
        title: 'Kontakt',
        icon: <Mail size={20} />,
        content: <ContactContent />,
        defaultSize: { width: 420, height: 600 },
        minSize: { width: 320, height: 400 },
    },
    blog: {
        title: 'Notizen',
        icon: <NotebookText size={20} />,
        content: <BlogContent />,
        defaultSize: { width: 520, height: 600 },
        minSize: { width: 320, height: 400 },
    },
    systeminfo: {
        title: 'Systeminfo',
        icon: <CircuitBoard size={20} />,
        content: <SysteminfoContent />,
        defaultSize: { width: 420, height: 600 },
        minSize: { width: 320, height: 400 },
    },
    music: {
        title: 'Musik',
        icon: <Music size={20} />,
        content: <MusicPlayerContent />,
        defaultSize: { width: 420, height: 600 },
        minSize: { width: 320, height: 400 },
    },
};
import { ReactNode, useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Briefcase, Mail, NotebookText, CircuitBoard, Music, Play, Pause, Moon, Sun, Volume2, VolumeX, Clock, Maximize2, Globe2, Monitor } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Declarations for app icons and content components
export interface Project {
    icon: ReactNode;
    title: string;
    description: string;
    url: string;
}

export interface AppConfig {
    title: string;
    icon: ReactNode;
    content: ReactNode;
    defaultSize: { width: number; height: number };
    minSize?: { width: number; height: number };
}

export interface BlogPost {
    title: string;
    date: string;
    content: string;
}

// Modular section components
import AboutContent from '../components/sections/AboutContent';
import PortfolioContent from '../components/sections/PortfolioContent';
import ContactContent from '../components/sections/ContactContent';
import BlogContent from '../components/sections/BlogContent';
import SysteminfoContent from '../components/sections/SysteminfoContent';
import MusicPlayerContent from '../components/sections/MusicPlayerContent';

