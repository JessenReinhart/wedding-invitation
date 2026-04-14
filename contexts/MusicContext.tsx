import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface MusicContextType {
    isPlaying: boolean;
    hasInteracted: boolean;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio('/music/turning-page.mp3');
        audio.loop = true;
        audio.preload = 'auto';
        audioRef.current = audio;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        const attemptPlay = () => {
            const storedMusicEnabled = (() => {
                try {
                    return window.localStorage.getItem('wedding_invitation_music_enabled') === '1';
                } catch {
                    return false;
                }
            })();

            if (storedMusicEnabled) {
                const playAttempt = audio.play();
                if (playAttempt !== undefined) {
                    playAttempt.then(() => setHasInteracted(true)).catch(() => {
                        // If autoplay fails, we wait for any interaction to trigger it
                        const playOnInteraction = () => {
                            audio.play().then(() => setHasInteracted(true)).catch(() => undefined);
                            document.removeEventListener('click', playOnInteraction);
                            document.removeEventListener('touchstart', playOnInteraction);
                        };
                        document.addEventListener('click', playOnInteraction);
                        document.addEventListener('touchstart', playOnInteraction);
                    });
                }
            }
        };

        // Try playing immediately, browsers sometimes allow it right away if there was prior interaction on the domain
        attemptPlay();

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    const play = () => {
        if (!audioRef.current) return;
        setHasInteracted(true);
        try {
            window.localStorage.setItem('wedding_invitation_music_enabled', '1');
        } catch {
            undefined;
        }
        const playAttempt = audioRef.current.play();
        if (playAttempt !== undefined) {
            playAttempt.catch(() => undefined);
        }
    };

    const pause = () => {
        if (!audioRef.current) return;
        setHasInteracted(true);
        audioRef.current.pause();
    };

    const togglePlay = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    return (
        <MusicContext.Provider value={{ isPlaying, hasInteracted, play, pause, togglePlay }}>
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
