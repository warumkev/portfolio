import React, { useState, useEffect } from 'react';
import { CircuitBoard, Moon, Sun, Clock, Maximize2, Globe2, Monitor } from 'lucide-react';

/**
 * SysteminfoContent displays system and environment info, theme toggle, and some fun stats.
 */
const SysteminfoContent = () => {
    const [date, setDate] = useState<string>("");
    const [windowSize, setWindowSize] = useState<{ w: number, h: number }>({ w: 0, h: 0 });
    useEffect(() => {
        const update = () => {
            setDate(new Date().toLocaleString());
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
        };
        update();
        window.addEventListener("resize", update);
        const interval = setInterval(update, 2000);
        return () => {
            window.removeEventListener("resize", update);
            clearInterval(interval);
        };
    }, []);
    return (
    <div className="relative p-6 md:p-8 font-sans min-h-[340px] flex flex-col items-center justify-center text-white shadow max-w-xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-700 rounded-full p-3 shadow">
                    <CircuitBoard size={40} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-blue-700">PortfoliOS v2.0</h2>
                    <p className="text-xs text-neutral-400">© 2025 Kevin Tamme</p>
                </div>
            </div>
            <div className="flex gap-3 items-center mb-4">
                <span className="text-xs bg-green-900 text-neutral-200 px-2 py-1 rounded">Online</span>
                <span className="text-xs text-neutral-400">Letztes Update: 12.10.2025</span>
            </div>
            {/* Theme toggle removed. */}
            <div className="mt-4 w-full space-y-3">
                <div className="flex items-center gap-3 border border-neutral-400 rounded-lg px-4 py-3 bg-black hover:bg-transparent">
                    <span className=""><Clock size={20} className="text-blue-700" /></span>
                    <span className="text-neutral-200">Uhrzeit:</span>
                    <span className="ml-auto font-semibold text-neutral-400">{date}</span>
                </div>
                <div className="flex items-center gap-3 border border-neutral-400 rounded-lg px-4 py-3 bg-black hover:bg-transparent">
                    <span className="text-blue-700"><Maximize2 size={20} /></span>
                    <span className="text-neutral-200">Fenstergröße:</span>
                    <span className="ml-auto font-semibold text-neutral-400">{windowSize.w} x {windowSize.h}</span>
                </div>
                <div className="flex items-center gap-3 border border-neutral-400 rounded-lg px-4 py-3 bg-black hover:bg-transparent">
                    <span className="text-blue-700"><Globe2 size={20} /></span>
                    <span className="text-neutral-200">Browser:</span>
                    <span className="ml-auto font-semibold text-neutral-400">{typeof navigator !== "undefined" ? navigator.userAgent : "-"}</span>
                </div>
                <div className="flex items-center gap-3 border border-neutral-400 rounded-lg px-4 py-3 bg-black hover:bg-transparent">
                    <span className="text-blue-700"><Monitor size={20} /></span>
                    <span className="text-neutral-200">OS:</span>
                    <span className="ml-auto font-semibold text-neutral-400">{typeof navigator !== "undefined" ? navigator.platform : "-"}</span>
                </div>
            </div>
        </div>
    );
};

export default SysteminfoContent;
