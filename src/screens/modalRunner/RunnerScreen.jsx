import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Trophy } from 'lucide-react';
import { DogsConfig } from '../../game/config/DogsConfig.js';

import ladyRun1 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-1.webp';
import ladyRun2 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-2.webp';
import ladyRun3 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-3.webp';
import ladyRun4 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-4.webp';
import gordoRun1 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-1.webp';
import gordoRun2 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-2.webp';
import gordoRun3 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-3.webp';
import gordoRun4 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-4.webp';
import munaRun1 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-1.webp';
import munaRun2 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-2.webp';
import munaRun3 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-3.webp';
import munaRun4 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-4.webp';
import nupitoRun1 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-1.webp';
import nupitoRun2 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-2.webp';
import nupitoRun3 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-3.webp';
import nupitoRun4 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-4.webp';
import smokeRun1 from '../../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-1.webp';
import smokeRun2 from '../../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-2.webp';
import smokeRun3 from '../../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-3.webp';
import smokeRun4 from '../../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-4.webp';
import tokyoRun1 from '../../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-1.webp';
import tokyoRun2 from '../../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-2.webp';
import tokyoRun3 from '../../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-3.webp';
import tokyoRun4 from '../../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-4.webp';
import tukaRun1 from '../../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-1.webp';
import tukaRun2 from '../../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-2.webp';
import tukaRun3 from '../../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-3.webp';
import tukaRun4 from '../../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-4.webp';
import zeusRun1 from '../../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-1.webp';
import zeusRun2 from '../../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-2.webp';
import zeusRun3 from '../../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-3.webp';
import zeusRun4 from '../../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-4.webp';
import druhRun1 from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-1.webp';
import druhRun2 from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-2.webp';
import druhRun3 from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-3.webp';
import druhRun4 from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-4.webp';

import ladyIcon    from '../../assets/ui/icons-pets/mineros/lady-icon.webp';
import gordoIcon   from '../../assets/ui/icons-pets/mineros/gordo-icon.webp';
import munaIcon    from '../../assets/ui/icons-pets/mineros/muna-icon.webp';
import nupitoIcon  from '../../assets/ui/icons-pets/mineros/nupito-icon.webp';
import smokeIcon   from '../../assets/ui/icons-pets/mineros/smoke-icon.webp';
import tokyoIcon   from '../../assets/ui/icons-pets/mineros/tokyo-icon.webp';
import tukaIcon    from '../../assets/ui/icons-pets/mineros/tuka-icon.webp';
import zeusIcon    from '../../assets/ui/icons-pets/mineros/zeus-icon.webp';
import druhIcon    from '../../assets/ui/icons-pets/mineros/druh-icon.webp';

import menaBronze1 from '../../assets/ui/icons-menas/menas-bronze/mena-bronze1.webp';
import menaIron1 from '../../assets/ui/icons-menas/menas-iron/mena-iron1.webp';
import menaDiamond1 from '../../assets/ui/icons-menas/menas-diamond/mena-diamond1.webp';

import '../../styles/modals/RunnerScreen.css';

// Lady siempre primera en el selector, el resto en el orden que ya usa Ayudantes
const DOG_SELECT_ORDER = ['lady', 'gordo', 'muna', 'nupito', 'smoke', 'tokio', 'tuka', 'zeus', 'druh'];

const DOG_RUN_FRAMES = {
    lady:   [ladyRun1, ladyRun2, ladyRun3, ladyRun4],
    gordo:  [gordoRun1, gordoRun2, gordoRun3, gordoRun4],
    muna:   [munaRun1, munaRun2, munaRun3, munaRun4],
    nupito: [nupitoRun1, nupitoRun2, nupitoRun3, nupitoRun4],
    smoke:  [smokeRun1, smokeRun2, smokeRun3, smokeRun4],
    tokio:  [tokyoRun1, tokyoRun2, tokyoRun3, tokyoRun4],
    tuka:   [tukaRun1, tukaRun2, tukaRun3, tukaRun4],
    zeus:   [zeusRun1, zeusRun2, zeusRun3, zeusRun4],
    druh:   [druhRun1, druhRun2, druhRun3, druhRun4],
};

const DOG_ICONS = {
    lady: ladyIcon, gordo: gordoIcon, muna: munaIcon, nupito: nupitoIcon,
    smoke: smokeIcon, tokio: tokyoIcon, tuka: tukaIcon, zeus: zeusIcon, druh: druhIcon,
};

const RUN_FRAME_MS = 130;
const OBSTACLE_IMGS = [menaBronze1, menaIron1, menaDiamond1];

const GRAVITY = 2200;
const JUMP_VELOCITY = 780;          // impulso del salto completo / del 2o salto
const JUMP_VELOCITY_SINGLE = 650;   // impulso del 1er salto (solo), mas margen que a media altura
const DOUBLE_JUMP_COOLDOWN_MS = 2000;
const SPEED_TIERS = [260, 320, 380, 440];
const SPEED_TIER_MS = 5000;
const SPEED_RAMP_STEP = 20;   // px/s que se suma cada SPEED_RAMP_MS tras agotar los tramos
const SPEED_RAMP_MS = 10000;
const SPEED_MAX = 700;
const SPAWN_MIN_MS = 1100;
const SPAWN_MAX_MS = 1900;
const DOG_X = 40;
const DOG_SIZE = 64;
const OBSTACLE_SIZE = 46;
const OBSTACLE_CLEAR_Y = OBSTACLE_SIZE * 0.75;
const HIT_INVULN_MS = 900;
const MAX_LIVES = 3;

const CPU_DIFFICULTY_PRESETS = {
    facil:   { label: 'Fácil',   dodgeChance: 0.78, reactionS: 0.30 },
    medio:   { label: 'Medio',   dodgeChance: 0.93, reactionS: 0.22 },
    dificil: { label: 'Difícil', dodgeChance: 0.97, reactionS: 0.18 },
};
const DIFFICULTY_ORDER = ['facil', 'medio', 'dificil'];

let obstacleIdSeq = 0;

const HIGH_SCORES_KEY = 'runnerHighScores';
const MAX_HIGH_SCORES = 10;

const loadHighScores = () => {
    try {
        const raw = localStorage.getItem(HIGH_SCORES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveHighScore = (score, dogId) => {
    const list = loadHighScores();
    list.push({ score, dogId, date: Date.now() });
    list.sort((a, b) => b.score - a.score);
    const trimmed = list.slice(0, MAX_HIGH_SCORES);
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(trimmed));
    return trimmed;
};

export default function RunnerScreen({ onClose }) {
    const [phase, setPhase] = useState('ready'); // 'ready' | 'playing' | 'gameover'
    const [won, setWon] = useState(false);
    const [selectedDogId, setSelectedDogId] = useState('lady');
    const [cpuDogId, setCpuDogId] = useState('gordo');
    const [difficulty, setDifficulty] = useState('medio');
    const [lives, setLives] = useState(MAX_LIVES);
    const [cpuLives, setCpuLives] = useState(MAX_LIVES);
    const [score, setScore] = useState(0);
    const [airborne, setAirborne] = useState(false);
    const [cpuAirborne, setCpuAirborne] = useState(false);
    const [obstacles, setObstacles] = useState([]); // solo {id, img}, la posicion real vive en refs
    const [frameIdx, setFrameIdx] = useState(0);
    const [hitFlash, setHitFlash] = useState(false);
    const [cpuHitFlash, setCpuHitFlash] = useState(false);
    const [scoresOpen, setScoresOpen] = useState(false);
    const [highScores, setHighScores] = useState(loadHighScores);
    const [doubleJumpReady, setDoubleJumpReady] = useState(true);

    const trackRef = useRef(null);
    const dogElRef = useRef(null);
    const cpuDogElRef = useRef(null);
    const dogYRef = useRef(0);
    const cpuDogYRef = useRef(0);
    const velocityRef = useRef(0);
    const cpuVelocityRef = useRef(0);
    const isJumpingRef = useRef(false);
    const cpuIsJumpingRef = useRef(false);
    const cpuPendingJumpRef = useRef(false);
    const obstaclesDataRef = useRef([]); // [{id, x, img, hit, cpuHit, cpuDodge, cpuJumped, el, cpuEl}]
    const spawnTimerRef = useRef(0);
    const invulnUntilRef = useRef(0);
    const cpuInvulnUntilRef = useRef(0);
    const scoreAccumRef = useRef(0);
    const scoreShownRef = useRef(0);
    const matchTimeRef = useRef(0);

    const runFrames = DOG_RUN_FRAMES[selectedDogId];
    const cpuRunFrames = DOG_RUN_FRAMES[cpuDogId];

    const setObstacleEl = useCallback((id, el) => {
        const found = obstaclesDataRef.current.find(o => o.id === id);
        if (found) found.el = el;
    }, []);

    const setCpuObstacleEl = useCallback((id, el) => {
        const found = obstaclesDataRef.current.find(o => o.id === id);
        if (found) found.cpuEl = el;
    }, []);

    const jump = useCallback(() => {
        if (phase !== 'playing') return;
        if (!isJumpingRef.current) {
            isJumpingRef.current = true;
            velocityRef.current = JUMP_VELOCITY_SINGLE;
            setAirborne(true);
        } else if (doubleJumpReady) {
            velocityRef.current = JUMP_VELOCITY;
            setDoubleJumpReady(false);
            setTimeout(() => setDoubleJumpReady(true), DOUBLE_JUMP_COOLDOWN_MS);
        }
    }, [phase, doubleJumpReady]);

    const resetStats = useCallback(() => {
        dogYRef.current = 0;
        cpuDogYRef.current = 0;
        velocityRef.current = 0;
        cpuVelocityRef.current = 0;
        isJumpingRef.current = false;
        cpuIsJumpingRef.current = false;
        cpuPendingJumpRef.current = false;
        obstaclesDataRef.current = [];
        spawnTimerRef.current = SPAWN_MIN_MS;
        invulnUntilRef.current = 0;
        cpuInvulnUntilRef.current = 0;
        scoreAccumRef.current = 0;
        scoreShownRef.current = 0;
        matchTimeRef.current = 0;
        setObstacles([]);
        setAirborne(false);
        setCpuAirborne(false);
        setLives(MAX_LIVES);
        setCpuLives(MAX_LIVES);
        setScore(0);
        setWon(false);
        setDoubleJumpReady(true);
    }, []);

    const resetGame = useCallback(() => {
        resetStats();
        const rivalPool = DOG_SELECT_ORDER.filter(id => id !== selectedDogId);
        setCpuDogId(rivalPool[Math.floor(Math.random() * rivalPool.length)]);
        setPhase('playing');
    }, [resetStats, selectedDogId]);

    const backToSelect = useCallback(() => {
        resetStats();
        setPhase('ready');
    }, [resetStats]);

    // Guarda la puntuacion al entrar en game over
    useEffect(() => {
        if (phase !== 'gameover') return;
        setHighScores(saveHighScore(score, selectedDogId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // Ciclo de correr en el suelo (compartido, las 2 pistas tienen 4 frames)
    useEffect(() => {
        if (phase === 'gameover') return;
        const interval = setInterval(() => {
            setFrameIdx(i => (i + 1) % 4);
        }, RUN_FRAME_MS);
        return () => clearInterval(interval);
    }, [phase]);

    // Salto con espacio (pruebas de escritorio)
    useEffect(() => {
        const onKey = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [jump]);

    // Bucle principal: fisica (jugador + CPU), spawns, colisiones. Las posiciones
    // se escriben directo en el DOM via refs, nunca por props style dinamicas en el JSX.
    useEffect(() => {
        if (phase !== 'playing') return;
        let rafId;
        let lastTime = performance.now();

        const tick = (now) => {
            const dt = Math.min(0.05, (now - lastTime) / 1000);
            lastTime = now;

            matchTimeRef.current += dt;
            const matchTimeMs = matchTimeRef.current * 1000;
            const rampStartMs = (SPEED_TIERS.length - 1) * SPEED_TIER_MS;
            let currentSpeed;
            if (matchTimeMs < rampStartMs) {
                const speedTier = Math.floor(matchTimeMs / SPEED_TIER_MS);
                currentSpeed = SPEED_TIERS[speedTier];
            } else {
                const rampSteps = Math.floor((matchTimeMs - rampStartMs) / SPEED_RAMP_MS);
                currentSpeed = Math.min(SPEED_MAX, SPEED_TIERS[SPEED_TIERS.length - 1] + rampSteps * SPEED_RAMP_STEP);
            }

            // Fisica jugador
            velocityRef.current -= GRAVITY * dt;
            let newY = dogYRef.current + velocityRef.current * dt;
            let justLanded = false;
            if (newY <= 0) {
                newY = 0;
                velocityRef.current = 0;
                if (isJumpingRef.current) justLanded = true;
                isJumpingRef.current = false;
            }
            dogYRef.current = newY;
            if (dogElRef.current) dogElRef.current.style.bottom = `${newY}px`;
            if (justLanded) setAirborne(false);

            // Fisica CPU (mismas reglas, ella misma dispara su salto mas abajo)
            cpuVelocityRef.current -= GRAVITY * dt;
            let cpuNewY = cpuDogYRef.current + cpuVelocityRef.current * dt;
            let cpuJustLanded = false;
            if (cpuNewY <= 0) {
                cpuNewY = 0;
                cpuVelocityRef.current = 0;
                if (cpuIsJumpingRef.current) cpuJustLanded = true;
                cpuIsJumpingRef.current = false;
            }
            cpuDogYRef.current = cpuNewY;
            if (cpuDogElRef.current) cpuDogElRef.current.style.bottom = `${cpuNewY}px`;
            if (cpuJustLanded) {
                if (cpuPendingJumpRef.current) {
                    cpuPendingJumpRef.current = false;
                    cpuIsJumpingRef.current = true;
                    cpuVelocityRef.current = JUMP_VELOCITY;
                    setCpuAirborne(true);
                } else {
                    setCpuAirborne(false);
                }
            }

            const trackWidth = trackRef.current?.offsetWidth ?? 320;
            let list = obstaclesDataRef.current;

            spawnTimerRef.current -= dt * 1000;
            let spawned = false;
            if (spawnTimerRef.current <= 0) {
                spawnTimerRef.current = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
                list = [...list, {
                    id: obstacleIdSeq++,
                    x: trackWidth,
                    img: OBSTACLE_IMGS[Math.floor(Math.random() * OBSTACLE_IMGS.length)],
                    size: OBSTACLE_SIZE,
                    clearY: OBSTACLE_CLEAR_Y,
                    hit: false,
                    cpuHit: false,
                    cpuDodge: Math.random() < CPU_DIFFICULTY_PRESETS[difficulty].dodgeChance,
                    cpuJumped: false,
                    el: null,
                    cpuEl: null,
                }];
                spawned = true;
            }

            const beforeLen = list.length;
            list.forEach(o => { o.x -= currentSpeed * dt; });
            list = list.filter(o => o.x > -o.size);
            const despawned = list.length !== beforeLen;

            // La CPU "pulsa" su salto cuando el obstaculo que decidio esquivar se acerca
            for (const o of list) {
                if (o.cpuDodge && !o.cpuJumped && o.x <= DOG_X + DOG_SIZE + CPU_DIFFICULTY_PRESETS[difficulty].reactionS * currentSpeed) {
                    o.cpuJumped = true;
                    if (!cpuIsJumpingRef.current) {
                        cpuIsJumpingRef.current = true;
                        cpuVelocityRef.current = JUMP_VELOCITY;
                        setCpuAirborne(true);
                    } else {
                        // Ya esta en el aire por otro obstaculo: guarda el salto para el aterrizaje
                        cpuPendingJumpRef.current = true;
                    }
                }
            }

            // Colision jugador
            const invuln = now < invulnUntilRef.current;
            let lifeLost = false;
            if (!invuln) {
                for (const o of list) {
                    if (o.hit) continue;
                    const overlapX = DOG_X < o.x + o.size && DOG_X + DOG_SIZE > o.x;
                    if (overlapX && dogYRef.current < o.clearY) {
                        o.hit = true;
                        lifeLost = true;
                        break;
                    }
                }
            }

            // Colision CPU
            const cpuInvuln = now < cpuInvulnUntilRef.current;
            let cpuLifeLost = false;
            if (!cpuInvuln) {
                for (const o of list) {
                    if (o.cpuHit) continue;
                    const overlapX = DOG_X < o.x + o.size && DOG_X + DOG_SIZE > o.x;
                    if (overlapX && cpuDogYRef.current < o.clearY) {
                        o.cpuHit = true;
                        cpuLifeLost = true;
                        break;
                    }
                }
            }

            list.forEach(o => {
                if (o.el) o.el.style.left = `${o.x}px`;
                if (o.cpuEl) o.cpuEl.style.left = `${o.x}px`;
            });
            obstaclesDataRef.current = list;
            if (spawned || despawned) {
                setObstacles(list.map(o => ({ id: o.id, img: o.img })));
            }

            scoreAccumRef.current += dt * 10;
            const flooredScore = Math.floor(scoreAccumRef.current);
            if (flooredScore !== scoreShownRef.current) {
                scoreShownRef.current = flooredScore;
                setScore(flooredScore);
            }

            if (lifeLost) {
                invulnUntilRef.current = now + HIT_INVULN_MS;
                setHitFlash(true);
                setTimeout(() => setHitFlash(false), HIT_INVULN_MS);
                setLives(prev => {
                    const next = prev - 1;
                    if (next <= 0) { setWon(false); setPhase('gameover'); }
                    return next;
                });
            }

            if (cpuLifeLost) {
                cpuInvulnUntilRef.current = now + HIT_INVULN_MS;
                setCpuHitFlash(true);
                setTimeout(() => setCpuHitFlash(false), HIT_INVULN_MS);
                setCpuLives(prev => {
                    const next = prev - 1;
                    if (next <= 0) { setWon(true); setPhase('gameover'); }
                    return next;
                });
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [phase, difficulty]);

    const dogImg = airborne ? runFrames[1] : runFrames[frameIdx];
    const cpuDogImg = cpuAirborne ? cpuRunFrames[1] : cpuRunFrames[frameIdx];

    return (
        <div className="runner-backdrop" onClick={onClose}>
            <div className="runner-screen" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X /></button>

                <div className="runner-hud">
                    <button className="runner-scores-btn" onClick={() => setScoresOpen(true)}><Trophy size={18} /></button>
                    <span className="runner-hud-score">{score}</span>
                    <span className="runner-hud-lives">{'❤'.repeat(lives)}{'♡'.repeat(MAX_LIVES - lives)}</span>
                </div>

                <div className="runner-tracks">
                    {phase !== 'ready' && (
                        <div className="runner-track runner-track-cpu">
                            <div className="runner-ground" />
                            <div className="runner-track-cpu-label">
                                <span>CPU</span>
                                <span className="runner-track-cpu-lives">{'❤'.repeat(cpuLives)}{'♡'.repeat(MAX_LIVES - cpuLives)}</span>
                            </div>

                            <img
                                ref={cpuDogElRef}
                                src={cpuDogImg}
                                alt={DogsConfig[cpuDogId]?.name ?? cpuDogId}
                                className={`runner-dog${cpuHitFlash ? ' runner-dog-hit' : ''}`}
                            />

                            {obstacles.map(o => (
                                <img
                                    key={o.id}
                                    ref={el => setCpuObstacleEl(o.id, el)}
                                    src={o.img}
                                    alt=""
                                    className="runner-obstacle"
                                />
                            ))}
                        </div>
                    )}

                    <div className="runner-track runner-track-player" ref={trackRef}>
                        <div className="runner-ground" />

                        <img
                            ref={dogElRef}
                            src={dogImg}
                            alt={DogsConfig[selectedDogId]?.name ?? selectedDogId}
                            className={`runner-dog${hitFlash ? ' runner-dog-hit' : ''}`}
                        />

                        {obstacles.map(o => (
                            <img
                                key={o.id}
                                ref={el => setObstacleEl(o.id, el)}
                                src={o.img}
                                alt=""
                                className="runner-obstacle"
                            />
                        ))}
                    </div>

                    {(phase === 'ready' || phase === 'gameover') && (
                        <div className="runner-overlay">
                            {phase === 'ready' && (
                                <>
                                    <p className="runner-overlay-title">Corre y esquiva</p>
                                    <button className="runner-start-btn" onClick={resetGame}>Empezar</button>
                                </>
                            )}
                            {phase === 'gameover' && (
                                <>
                                    <p className="runner-overlay-title">{won ? '¡Has ganado!' : 'Game Over'}</p>
                                    <p className="runner-overlay-score">Puntos: {score}</p>
                                    <div className="runner-overlay-btn-row">
                                        <button className="runner-start-btn" onClick={resetGame}>Reintentar</button>
                                        <button className="runner-start-btn runner-start-btn-secondary" onClick={backToSelect}>Elegir perro</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <button className="runner-jump-btn" onPointerDown={jump} disabled={phase !== 'playing'}>
                    SALTAR
                </button>

                {phase === 'ready' && (
                    <div className="runner-dog-select">
                        {DOG_SELECT_ORDER.map(id => (
                            <button
                                key={id}
                                className={`runner-dog-select-btn${selectedDogId === id ? ' runner-dog-select-active' : ''}`}
                                onClick={() => setSelectedDogId(id)}
                            >
                                <img src={DOG_ICONS[id]} alt={DogsConfig[id]?.name ?? id} className="runner-dog-select-icon" />
                            </button>
                        ))}
                    </div>
                )}

                {phase === 'ready' && (
                    <div className="runner-difficulty-select">
                        {DIFFICULTY_ORDER.map(id => (
                            <button
                                key={id}
                                className={`runner-difficulty-btn${difficulty === id ? ' runner-difficulty-active' : ''}`}
                                onClick={() => setDifficulty(id)}
                            >
                                {CPU_DIFFICULTY_PRESETS[id].label}
                            </button>
                        ))}
                    </div>
                )}

                {scoresOpen && (
                    <div className="runner-scores-backdrop" onClick={() => setScoresOpen(false)}>
                        <div className="runner-scores-panel" onClick={e => e.stopPropagation()}>
                            <p className="runner-overlay-title">Mejores puntuaciones</p>
                            {highScores.length === 0 && <p className="runner-overlay-score">Todavía no hay puntuaciones</p>}
                            <div className="runner-scores-list">
                                {highScores.map((entry, i) => (
                                    <div key={entry.date} className="runner-scores-row">
                                        <span className="runner-scores-rank">{i + 1}</span>
                                        <img src={DOG_ICONS[entry.dogId]} alt={DogsConfig[entry.dogId]?.name ?? entry.dogId} className="runner-scores-dog-icon" />
                                        <span className="runner-scores-value">{entry.score}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="runner-start-btn" onClick={() => setScoresOpen(false)}>Cerrar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
