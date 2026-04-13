import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface MusicContextType {
    isPlaying: boolean;
    hasInteracted: boolean;
    togglePlay: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element once
        const audio = new Audio('/music/turning-page.mp3');
        audio.loop = true;
        audio.preload = 'auto';
        audioRef.current = audio;

        // Attempt to autoplay
        const playAttempt = audio.play();
        if (playAttempt !== undefined) {
            playAttempt
                .then(() => {
                    setIsPlaying(true);
                    setHasInteracted(true);
                })
                .catch((error) => {
                    console.log("Autoplay blocked:", error);
                    setIsPlaying(false);
                });
        }

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        setHasInteracted(true);
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    return (
        <MusicContext.Provider value={{ isPlaying, hasInteracted, togglePlay }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};
