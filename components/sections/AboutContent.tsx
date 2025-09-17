import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

// --- AboutContent.tsx ---
// This component renders the About section of the portfolio, including profile, skills, timeline, CV download, and vibe meter.

// Skill badges for About section
const skillBadges = [
    { label: 'TypeScript', color: 'bg-secondary text-secondary-foreground' },
    { label: 'React', color: 'bg-secondary text-secondary-foreground' },
    { label: 'UI/UX', color: 'bg-secondary text-secondary-foreground' },
    { label: 'Next.js', color: 'bg-secondary text-secondary-foreground' },
    { label: 'Figma', color: 'bg-secondary text-secondary-foreground' },
    { label: 'MagicUI', color: 'bg-secondary text-secondary-foreground' },
    { label: 'Tailwind', color: 'bg-secondary text-secondary-foreground' },
    { label: 'APIs', color: 'bg-secondary text-secondary-foreground' },
];

// Vibe meter levels for About section
// Used to visually represent personal strengths
const vibeLevels = [
    { label: 'Creativity', value: 90 },
    { label: 'Tech', value: 80 },
    { label: 'Design', value: 95 },
    { label: 'Fun', value: 100 },
    { label: 'Problems', value: 5 }
];

/**
 * AboutContent component displays profile, skills, timeline, CV download, and vibe meter.
 * Modularized for maintainability. All static data is defined above for clarity.
 */
const AboutContent = () => (
    <div className="p-2 flex flex-col min-w-[220px] min-h-[400px] w-full bg-background text-foreground">
        {/* Profile image */}
        <div className="justify-center flex mb-4">
            <Image
                src="/profile-image.png"
                alt="Kevin Tamme, Frontend Entwickler aus Frankfurt"
                width={128}
                height={128}
                className="rounded-full shadow-lg border-4 border-border"
            />
        </div>
        {/* Name and tagline */}
        <h2 className="text-2xl font-bold text-primary mb-1 tracking-tight text-center">
            Kevin Tamme
        </h2>
        <div className="text-base font-medium text-muted-foreground text-center mb-2">
            Design. Code. Creativity.
        </div>
        <p className="text-card-foreground text-center max-w-xl mx-auto mb-2">
            Ich bin 22 Jahre jung und ein Informatik-Student aus Frankfurt. Ich liebe es, mit <span className="font-bold text-primary">TypeScript</span>, <span className="font-bold text-primary">UI/UX</span> und <span className="font-bold text-primary">kreativen Ideen</span> digitale Erlebnisse zu schaffen, die einem im Kopf bleiben.
        </p>
        {/* Skill badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-2 mb-4">
            {skillBadges.map(badge => (
                <span key={badge.label} className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${badge.color}`}>{badge.label}</span>
            ))}
        </div>
        {/* Skills Matrix: lists frontend and design/tool skills */}
        <div className="w-full max-w-md mx-auto mt-4 mb-4">
            <h3 className="text-xs font-bold text-muted-foreground mb-2 text-center">Skills Matrix</h3>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <h4 className="text-xs font-semibold text-primary mb-1">Frontend</h4>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                        <li>React (Advanced)</li>
                        <li>Next.js (Advanced)</li>
                        <li>TypeScript (Advanced)</li>
                        <li>Tailwind CSS (Advanced)</li>
                        <li>Framer Motion</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-semibold text-primary mb-1">Design & Tools</h4>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                        <li>UI/UX Design (Figma, Adobe CC)</li>
                        <li>MagicUI</li>
                        <li>Git & Version Control</li>
                        <li>Vercel Deployment</li>
                        <li>APIs & Integration</li>
                    </ul>
                </div>
            </div>
        </div>
        {/* Timeline Section: education and career milestones */}
        <div className="w-full max-w-md mx-auto mt-2 mb-4">
            <h3 className="text-xs font-bold text-muted-foreground mb-2 text-center">Timeline</h3>
            <ul className="timeline list-none p-0 m-0">
                <li className="mb-2">
                    <span className="font-semibold text-primary">2026</span> – B.Sc. Informatik Abschluss, Frankfurt
                </li>
                <li className="mb-2">
                    <span className="font-semibold text-primary">2024</span> – Launch Portfolio v1.0
                </li>
                <li className="mb-2">
                    <span className="font-semibold text-primary">2022-2025</span> – Softwareentwickler & Freelance Webentwicklung
                </li>
                <li className="mb-2">
                    <span className="font-semibold text-primary">2022</span> – Beginn Informatik-Studium
                </li>
            </ul>
        </div>
        {/* Downloadable CV Button: PDF download */}
        <div className="w-full max-w-md mx-auto mb-2 flex justify-center">
            <a
                href="/cv-kevin-tamme.pdf"
                download
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground font-semibold rounded shadow hover:bg-primary/80 transition"
                aria-label="Lebenslauf herunterladen"
            >
                <svg className="mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m0 0l-6-6m6 6l6-6" /></svg>
                Lebenslauf herunterladen
            </a>
        </div>
        {/* Vibe Meter: animated bars for personal strengths */}
        <div className="w-full max-w-md mx-auto mt-2">
            <h3 className="text-xs font-bold text-muted-foreground mb-2 text-center">Vibe Meter</h3>
            <div className="space-y-2">
                {vibeLevels.map(vibe => (
                    <div key={vibe.label} className="flex items-center gap-2">
                        <span className="w-20 text-xs text-muted-foreground">{vibe.label}</span>
                        <div className="flex-1 h-2 rounded bg-secondary overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${vibe.value}%` }} transition={{ delay: 0.6 }} className={`h-2 rounded bg-primary`} style={{ width: `${vibe.value}%` }} />
                        </div>
                        <span className="text-xs font-bold text-primary">{vibe.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default AboutContent;
