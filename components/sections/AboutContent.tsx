import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

// --- AboutContent.tsx ---
// This component renders the About section of the portfolio, including profile, skills, timeline, CV download, and vibe meter.

// Skill badges for About section
const skillBadges = [
    { label: 'Design'},
    { label: 'User Experience'},
    { label: 'SwiftUI'},
    { label: 'Figma'},
    { label: 'Sketch'},
    { label: 'Vercel'},
    { label: 'React'},
    { label: 'TailwindCSS'},
    { label: 'MagicUI'},
    { label: 'APIs'},
    { label: 'TypeScript'},
    { label: 'Next.js'},
    { label: 'JavaScript'},
    { label: 'HTML'},
    { label: 'CSS'},
    { label: 'Git'},
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
    <div className="p-6 md:p-8 flex flex-col min-w-[220px] min-h-[400px] w-full text-white">
        {/* Profile image */}
        <div className="justify-center flex mb-4">
            <Image
                src="/profile-image.png"
                alt="Kevin Tamme, Frontend Entwickler aus Frankfurt"
                width={128}
                height={128}
                className="rounded-full shadow-lg border-4 border-blue-700"
            />
        </div>
        {/* Name and tagline */}
    <h2 className="text-2xl font-bold text-blue-700 mb-1 tracking-tight text-center">
            Kevin Tamme
        </h2>
    <div className="text-base font-medium text-neutral-400 text-center mb-2">
            Design. Code. Creativity.
        </div>
    <p className="text-nwhite text-left max-w-xl mx-auto mb-2">
            Was du hier siehst, ist mehr als nur ein Portfolio – es ist meine Art zu denken, zu strukturieren und kreative Ideen in funktionierende digitale Erlebnisse zu übersetzen.<br />
            Mein Name ist Kevin Tamme, und ich baue die Systeme, in denen sich Nutzer und Marken zuhause fühlen.
        </p>
        {/* Skill badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-2 mb-4">
            {skillBadges.map(badge => (
                <span key={badge.label} className={`px-3 py-1 rounded-full text-xs font-semibold shadow bg-blue-700 text-white border border-blue-700`}>{badge.label}</span>
            ))}
        </div>
        {/* Skill matrix removed */}
        {/* Timeline Section: education and career milestones */}
        <div className="w-full max-w-md mx-auto mt-2 mb-4">
            <h3 className="text-xs font-bold text-blue-700 mb-2 text-center">Timeline</h3>
            <ul className="timeline list-none p-0 m-0">
                <li className="mb-2">
                    <span className="font-semibold text-blue-700">2026</span> – B.Sc. Informatik Abschluss, Frankfurt
                </li>
                <li className="mb-2">
                    <span className="font-semibold text-blue-700">2024</span> – Launch Portfolio v1.0
                </li>
                <li className="mb-2">
                    <span className="font-semibold text-blue-700">2022-2025</span> – Softwareentwickler & Freelance Webentwicklung
                </li>
                <li className="mb-2">
                    <span className="font-semibold text-blue-700">2022</span> – Beginn Informatik-Studium
                </li>
            </ul>
        </div>
        {/* Downloadable CV Button: PDF download */}
        <div className="w-full max-w-md mx-auto mb-2 flex justify-center">
            <a
                href="/cv-kevin-tamme.pdf"
                download
                className="inline-flex items-center px-4 py-2 bg-blue-700 text-white font-semibold rounded shadow hover:bg-white hover:text-blue-700 transition"
                aria-label="Lebenslauf herunterladen"
            >
                <svg className="mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m0 0l-6-6m6 6l6-6" /></svg>
                Lebenslauf herunterladen
            </a>
        </div>
        {/* Vibe meter removed */}
    </div>
);

export default AboutContent;
