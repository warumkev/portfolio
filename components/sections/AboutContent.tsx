import Image from "next/image";
import React from "react";

// --- AboutContent.tsx ---
// This component renders the About section of the portfolio, including profile, skills, timeline, CV download, and vibe meter.

// Skill badges for About section
const skillBadges = [
  { label: "Design" },
  { label: "User Experience" },
  { label: "SwiftUI" },
  { label: "Figma" },
  { label: "Sketch" },
  { label: "Vercel" },
  { label: "React" },
  { label: "TailwindCSS" },
  { label: "MagicUI" },
  { label: "APIs" },
  { label: "TypeScript" },
  { label: "Next.js" },
  { label: "JavaScript" },
  { label: "HTML" },
  { label: "CSS" },
  { label: "Git" },
];

/**
 * AboutContent component displays profile, skills, timeline, CV download, and vibe meter.
 * Modularized for maintainability. All static data is defined above for clarity.
 */
const AboutContent = () => (
  <div className="p-6 md:p-8 w-full min-w-[220px] min-h-0 h-full text-primary">
    <div className="flex flex-col items-center md:items-start gap-6 mb-6">
      <div className="w-32 h-32 relative rounded-full overflow-hidden shadow-lg">
        <Image
          src="/profile-image.png"
          alt="Profilbild von Kevin Tamme"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-lg font-semibold mb-1">Kevin Tamme</h3>
        <p className="text-sm text-muted">
          Hey. I&apos;m Kevin, a 22-year-old developer.
          <br />
          <br />
          My biggest motivation is pretty simple: I get annoyed by enterprise
          bloatware, subscription models for basic features, and apps that seem
          to want my data more than anything else.
          <br />
          <br />
          So, I just build my own.
          <br />
          <br />
          I&apos;m just a guy who sees a problem, thinks &quot;I can do that
          myself,&quot; and then builds a solution—usually because I need it.
          <br />
          <br />
          I&apos;m documenting the whole journey and sharing the tools for free.
          My philosophy is that powerful tech shouldn&apos;t be expensive, and
          it definitely shouldn&apos;t be built to sell you out.
          <br />
          <br />
          Welcome to portfoliOS.
        </p>
      </div>
    </div>
    <div className="mb-6">
      <h4 className="font-semibold mb-2">Toolset</h4>
      <div className="flex flex-wrap gap-2">
        {skillBadges.map((skill) => (
          <span
            key={skill.label}
            className="bg-secondary text-primary px-3 py-1 rounded-full text-sm font-medium"
          >
            {skill.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default AboutContent;
