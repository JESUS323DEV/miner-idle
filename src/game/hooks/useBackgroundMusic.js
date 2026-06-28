import { useEffect, useRef, useCallback } from 'react';
import track1 from '../../assets/audio/western-cowboy-texas-music-bg.mp3';
import track2 from '../../assets/audio/western-cowboy-texas-music-bg-2.mp3';
import track3 from '../../assets/audio/western-cowboy-texas-music-bg-3.mp3';
import track4 from '../../assets/audio/western-cowboy-texas-music-bg-4.mp3';
import track5 from '../../assets/audio/western-cowboy-texas-music-bg-5.mp3';
import tavernTrack1 from '../../assets/audio/bg-tavern/western-tavern-bg.mp3';
import tavernTrack2 from '../../assets/audio/bg-tavern/western-tavern-bg-2.mp3';

const PLAYLIST = [track1, track2, track3, track4, track5, tavernTrack1, tavernTrack2];

const getNextTrack = (currentIndex) => {
    const pool = PLAYLIST.map((_, i) => i).filter(i => i !== currentIndex);
    return pool[Math.floor(Math.random() * pool.length)];
};

export const useBackgroundMusic = (volume = 0.010) => {
    const audioRef = useRef(null);
    const startedRef = useRef(false);
    const currentTrackIndex = useRef(0);
    const volumeRef = useRef(volume);

    const getAudio = () => {
        if (!audioRef.current) audioRef.current = new Audio();
        return audioRef.current;
    };

    useEffect(() => {
        volumeRef.current = volume;
        getAudio().volume = volume;
    }, [volume]);

    const playTrack = useCallback((index) => {
        const audio = getAudio();
        audio.src = PLAYLIST[index];
        audio.volume = volumeRef.current;
        audio.currentTime = 0;
        audio.play().catch(() => {});
        currentTrackIndex.current = index;
    }, []);

    const pause  = useCallback(() => { getAudio().pause(); }, []);
    const resume = useCallback(() => {
        const a = getAudio();
        if (startedRef.current && a.paused) a.play().catch(() => {});
    }, []);

    useEffect(() => {
        const audio = getAudio();

        const handleEnded = () => {
            playTrack(getNextTrack(currentTrackIndex.current));
        };

        audio.addEventListener('ended', handleEnded);

        const startMusic = () => {
            startedRef.current = true;
            sessionStorage.setItem('musicStarted', '1');
            playTrack(currentTrackIndex.current);
        };

        const handleFirstInteraction = () => {
            if (startedRef.current) return;
            startMusic();
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && startedRef.current) {
                const a = getAudio();
                if (a.paused) a.play().catch(() => {});
            }
        };

        const handlePageShow = (e) => {
            if (e.persisted && startedRef.current) {
                const a = getAudio();
                if (a.paused) a.play().catch(() => {});
            }
        };

        if (sessionStorage.getItem('musicStarted') && !startedRef.current) {
            const a = getAudio();
            a.src = PLAYLIST[currentTrackIndex.current];
            a.volume = volumeRef.current;
            a.play()
                .then(() => { startedRef.current = true; })
                .catch(() => {});
        }

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pageshow', handlePageShow);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, [playTrack]);

    return { pause, resume };
};
