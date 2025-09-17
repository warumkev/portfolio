import React, { useState, useEffect } from 'react';
import { CircuitBoard, Moon, Sun, Clock, Maximize2, Globe2, Monitor } from 'lucide-react';

/**
 * SysteminfoContent displays system and environment info, theme toggle, and some fun stats.
 */
const SysteminfoContent = () => {
    const [date, setDate] = useState<string>("");
    const [windowSize, setWindowSize] = useState<{ w: number, h: number }>({ w: 0, h: 0 });
    const [cpu, setCpu] = useState<number>(Math.random() * 60 + 20);
    const [dark, setDark] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const stored = window.localStorage.getItem("systeminfo-darkmode");
            return stored === "true";
        }
        return false;
    });
    useEffect(() => {
        const update = () => {
            setDate(new Date().toLocaleString());
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
            setCpu(Math.random() * 60 + 20);
        };
        update();
        window.addEventListener("resize", update);
        const interval = setInterval(update, 2000);
        return () => {
            window.removeEventListener("resize", update);
            clearInterval(interval);
        };
    }, []);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("systeminfo-darkmode", dark ? "true" : "false");
        }
    }, [dark]);
    return (
        <div className="relative p-6 font-sans min-h-[340px] flex flex-col items-center justify-center bg-background text-foreground rounded-xl shadow border border-border max-w-xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary rounded-full p-3 shadow">
                    <CircuitBoard size={40} className="text-primary-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-primary">PortfoliOS v1.0</h2>
                    <p className="text-xs text-muted-foreground">© 2025 Kevin Tamme</p>
                </div>
            </div>
            <div className="flex gap-3 items-center mb-4">
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">Online</span>
                <span className="text-xs text-muted-foreground">Letztes Update: 16.09.2025</span>
            </div>
            <div className="mb-4 flex items-center gap-3 justify-center">
                <span className="text-muted-foreground">Theme:</span>
                <button
                    className={`relative flex items-center w-12 h-8 rounded-full transition-colors duration-300 focus:outline-none shadow ${dark ? "bg-primary" : "bg-muted"}`}
                    aria-label="Theme umschalten"
                    onClick={() => setDark(d => !d)}
                >
                    <span
                        className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${dark ? "translate-x-4 bg-card text-primary" : "translate-x-0 bg-card text-primary"}`}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                        {dark ? <Moon size={18} /> : <Sun size={18} />}
                    </span>
                </button>
            </div>
            <div className="mt-4 w-full space-y-3">
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                    <span className=""><Clock size={20} className="text-primary" /></span>
                    <span className="text-muted-foreground">Uhrzeit:</span>
                    <span className="ml-auto font-semibold text-card-foreground">{date}</span>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-primary"><Maximize2 size={20} /></span>
                    <span className="text-muted-foreground">Fenstergröße:</span>
                    <span className="ml-auto font-semibold text-card-foreground">{windowSize.w} x {windowSize.h}</span>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-primary"><Globe2 size={20} /></span>
                    <span className="text-muted-foreground">Browser:</span>
                    <span className="ml-auto font-semibold text-card-foreground">{typeof navigator !== "undefined" ? navigator.userAgent : "-"}</span>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                    <span className="text-primary"><Monitor size={20} /></span>
                    <span className="text-muted-foreground">OS:</span>
                    <span className="ml-auto font-semibold text-card-foreground">{typeof navigator !== "undefined" ? navigator.platform : "-"}</span>
                </div>
            </div>
        </div>
    );
};

export default SysteminfoContent;
