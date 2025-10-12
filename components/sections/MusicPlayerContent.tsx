import React, { useState, useRef, ChangeEvent } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';

/**
 * MusicPlayerContent displays a simple music player UI with play/pause and volume control.
 */
const MusicPlayerContent = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
    <div className="p-6 md:p-8 h-full flex flex-col items-center justify-center text-white">
            <div className="w-48 h-48 rounded-lg shadow-lg mb-6 flex items-center justify-center">
                <Music size={64} className="text-blue-700" />
            </div>
            <h3 className="text-lg font-bold text-blue-700">Lofi Chill</h3>
            <p className="text-sm text-neutral-400 mb-6">by ilovemusic</p>
            <button
                onClick={togglePlayPause}
                className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-700 transition"
                aria-label={isPlaying ? "Musik anhalten" : "Musik abspielen"}
            >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <div className="w-full max-w-xs mt-6 flex items-center gap-3 hidden md:flex">
                <VolumeX size={20} className="text-neutral-200" aria-hidden="true" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-700 [&::-webkit-slider-thumb]:rounded-full"
                    aria-label="Lautstärkeregler"
                    style={{ touchAction: 'pan-y' }}
                />
                <Volume2 size={20} className="text-neutral-200" aria-hidden="true" />
            </div>
            <audio ref={audioRef} src="https://play.ilovemusic.de/ilm_ilovechillhop" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}></audio>
        </div>
    );
};

export default MusicPlayerContent;
