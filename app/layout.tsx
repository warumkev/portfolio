import type { Metadata } from "next";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import { Inter } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kevintamme.com"),
  title: {
    default: "Portfolio | Kevin Tamme - Frontend Entwickler Frankfurt, React, UI/UX, TypeScript",
    template: "%s | Kevin Tamme - Frontend Entwickler Frankfurt",
  },
  description: "Portfolio von Kevin Tamme, Frontend Entwickler aus Frankfurt am Main. Spezialisiert auf React, Next.js, TypeScript und UI/UX Design. Entdecken Sie Projekte, Blog, Learnings und Kontaktmöglichkeiten.",
  keywords: [
    "Frontend Entwickler Frankfurt",
    "React Entwickler",
    "Next.js Portfolio",
    "TypeScript Projekte",
    "UI/UX Design",
    "Webentwicklung",
    "Kevin Tamme",
    "Portfolio",
    "Blog",
    "Projekte",
    "Kontakt",
    "Web Developer Germany",
    "Modern Web Design"
  ],
  authors: [{ name: "Kevin Tamme" }],
  creator: "Kevin Tamme",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.kevintamme.com",
    title: "PortfoliOS | Kevin Tamme - Frontend-Entwickler",
    description: "Ein interaktives Portfolio im Stil eines Betriebssystems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PortfoliOS - Kevin Tamme",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PortfoliOS | Kevin Tamme - Frontend-Entwickler",
    description: "Ein interaktives Portfolio im Stil eines Betriebssystems.",
    images: ["/og-image.png"],
    creator: "@warumkev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased relative h-full`}
      >

        {children}
      </body>
    </html>
  );
}