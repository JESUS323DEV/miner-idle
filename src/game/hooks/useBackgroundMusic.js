import { useEffect, useRef, useCallback } from 'react';
import track1 from '../../assets/audio/western-cowboy-texas-music-bg.mp3';
import track2 from '../../assets/audio/western-cowboy-texas-music-bg-2.mp3';
import track3 from '../../assets/audio/western-cowboy-texas-music-bg-3.mp3';
import tavernTrack1 from '../../assets/audio/bg-tavern/western-tavern-bg.mp3';
import tavernTrack2 from '../../assets/audio/bg-tavern/western-tavern-bg-2.mp3';

const PLAYLISTS = {
    main:   [track1, track2, track3],
    tavern: [tavernTrack1, tavernTrack2],
};
const PAUSE_BETWEEN_MS = 40000;

const getNextTrack = (tracks, currentIndex) => {
    const pool = tracks.map((_, i) => i).filter(i => i !== currentIndex);
    return pool[Math.floor(Math.random() * pool.length)];
};

export const useBackgroundMusic = (enabled = true, volume = 0.02, scene = 'main') => {
    const audioRef = useRef(null);
    const pauseTimerRef = useRef(null);
    const startedRef = useRef(false);
    const currentTrackIndex = useRef(0);
    const currentScene = useRef(scene);

    const getAudio = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(PLAYLISTS.main[0]);
        }
        return audioRef.current;
    };

    const playTrack = useCallback((tracks, index) => {
        const audio = getAudio();
        audio.src = tracks[index];
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(() => {});
        currentTrackIndex.current = index;
    }, [volume]);

    useEffect(() => {
        const audio = getAudio();
        audio.volume = volume;
    }, [volume]);

    useEffect(() => {
        const audio = getAudio();
        if (!startedRef.current) return;
        if (enabled) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
            clearTimeout(pauseTimerRef.current);
        }
    }, [enabled]);

    // Cambio de escena
    useEffect(() => {
        if (!startedRef.current || !enabled) return;
        if (currentScene.current === scene) return;
        currentScene.current = scene;
        clearTimeout(pauseTimerRef.current);
        const tracks = PLAYLISTS[scene] ?? PLAYLISTS.main;
        playTrack(tracks, 0);
    }, [scene, enabled, playTrack]);

    useEffect(() => {
        const audio = getAudio();

        const handleEnded = () => {
            if (!enabled) return;
            const tracks = PLAYLISTS[currentScene.current] ?? PLAYLISTS.main;
            const next = getNextTrack(tracks, currentTrackIndex.current);
            pauseTimerRef.current = setTimeout(() => playTrack(tracks, next), PAUSE_BETWEEN_MS);
        };

        audio.addEventListener('ended', handleEnded);

        const handleFirstInteraction = () => {
            if (startedRef.current) return;
            startedRef.current = true;
            currentScene.current = scene;
            if (enabled) playTrack(PLAYLISTS[scene] ?? PLAYLISTS.main, 0);
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            clearTimeout(pauseTimerRef.current);
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, [playTrack, enabled, scene]);
};
