import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Trophy, ArrowUp } from 'lucide-react';
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

const GROUND_VISUAL_OFFSET = 22; // sube el perro un poco para que pise el camino del fondo, no la piedra de abajo
const MAX_JUMP_HEIGHT = 130; // tope para que ni el doble salto sobresalga de la card
const GRAVITY = 2200;
const JUMP_VELOCITY = 780;          // impulso del salto completo / del 2o salto
const JUMP_VELOCITY_SINGLE = 650;   // impulso del 1er salto (solo), mas margen que a media altura
const SPEED_TIERS = [280, 320, 380, 440];
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
const AERIAL_MIN_Y = 85;   // franja de altura peligrosa de los obstaculos aereos
const AERIAL_MAX_Y = 130;
const AERIAL_UNLOCK_TIER = 3; // a partir de este tramo empiezan a aparecer, intercalados
const GROUND_PAIR_GAP_PX = 90; // separacion entre los 2 terrestres cuando salen en pareja
const LANDING_SYNC_DELAY_MS = 800; // tiempo aprox. de un doble salto completo, para que el aereo llegue justo al aterrizar
const HIT_INVULN_MS = 900;
const MAX_LIVES = 3;

// La dificultad ya no es "% de acierto": la CPU siempre intenta esquivar bien,
// lo que varia es su imperfeccion (cuanto tarda en reaccionar, cuanto tiembla el timing, cuanto ve venir).
const CPU_DIFFICULTY_PRESETS = {
    medio:   { label: 'Medio',   reactionDelayMs: 180, timingJitterMs: 70, visionPx: 260 },
    dificil: { label: 'Difícil', reactionDelayMs: 90,  timingJitterMs: 25, visionPx: 340 },
};
const DIFFICULTY_ORDER = ['medio', 'dificil'];

const CPU_SIM_STEP_MS = 16;      // paso de la mini-simulacion que usa la CPU para predecir su propia trayectoria
const CPU_SIM_HORIZON_MS = 1500; // hasta donde mira hacia delante como mucho
const CPU_ACTION_LEAD_MS = 80;   // margen antes de que empiece el peligro para pulsar el salto, no en cuanto lo detecta

const isDangerousY = (y, aerial, clearY) => (aerial
    ? (y > AERIAL_MIN_Y && y < AERIAL_MAX_Y)
    : (y < clearY));

// Ventana de tiempo (ms desde ahora) en la que este obstaculo solaparia horizontalmente al perro,
// misma formula que la colision real pero despejada para tiempo en vez de posicion.
const getDangerWindowMs = (obstacle, speed) => {
    if (speed <= 0) return null;
    const t1 = ((obstacle.x - DOG_X - DOG_SIZE) / speed) * 1000;
    const t2 = ((obstacle.x + obstacle.size - DOG_X) / speed) * 1000;
    if (t2 < 0) return null;
    return { start: Math.max(0, t1), end: t2 };
};

// Version programatica de "si hago esto ahora, ¿voy a estar a salvo cuando llegue esto?":
// simula la trayectoria de la CPU (con un salto opcional en actionAtMs) y comprueba si evita
// las ventanas de peligro de los obstaculos dados.
const simulateCpuSafe = (startY, startVelocity, actionAtMs, actionVelocity, relevantObstacles) => {
    if (relevantObstacles.length === 0) return true;
    const horizonMs = Math.min(CPU_SIM_HORIZON_MS, Math.max(...relevantObstacles.map(r => r.window.end)) + 50);
    let y = startY;
    let v = startVelocity;
    let actionApplied = actionAtMs === null;
    const stepS = CPU_SIM_STEP_MS / 1000;
    for (let t = 0; t <= horizonMs; t += CPU_SIM_STEP_MS) {
        if (!actionApplied && t >= actionAtMs) {
            v = actionVelocity;
            actionApplied = true;
        }
        v -= GRAVITY * stepS;
        y += v * stepS;
        if (y <= 0) { y = 0; v = 0; }
        else if (y > MAX_JUMP_HEIGHT) { y = MAX_JUMP_HEIGHT; }
        for (const { o, window } of relevantObstacles) {
            if (t < window.start || t > window.end) continue;
            if (isDangerousY(y, o.aerial, o.clearY)) return false;
        }
    }
    return true;
};

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
    const [paused, setPaused] = useState(false);
    const [won, setWon] = useState(false);
    const [selectedDogId, setSelectedDogId] = useState('lady');
    const [cpuDogId, setCpuDogId] = useState('gordo');
    const [difficulty, setDifficulty] = useState('medio');
    const [lives, setLives] = useState(MAX_LIVES);
    const [cpuLives, setCpuLives] = useState(MAX_LIVES);
    const [score, setScore] = useState(0);
    const [speedTierDisplay, setSpeedTierDisplay] = useState(1);
    const [airborne, setAirborne] = useState(false);
    const [cpuAirborne, setCpuAirborne] = useState(false);
    const [obstacles, setObstacles] = useState([]); // solo {id, img}, la posicion real vive en refs
    const [frameIdx, setFrameIdx] = useState(0);
    const [hitFlash, setHitFlash] = useState(false);
    const [cpuHitFlash, setCpuHitFlash] = useState(false);
    const [scoresOpen, setScoresOpen] = useState(false);
    const [highScores, setHighScores] = useState(loadHighScores);

    const trackRef = useRef(null);
    const dogElRef = useRef(null);
    const cpuDogElRef = useRef(null);
    const dogYRef = useRef(0);
    const cpuDogYRef = useRef(0);
    const velocityRef = useRef(0);
    const cpuVelocityRef = useRef(0);
    const isJumpingRef = useRef(false);
    const cpuIsJumpingRef = useRef(false);
    const cpuDoubleJumpUsedRef = useRef(false);
    const cpuJumpAtRef = useRef(null);
    const cpuDoubleJumpAtRef = useRef(null);
    const cpuObstacleSeenAtRef = useRef(new Map());
    const doubleJumpUsedRef = useRef(false);
    const aerialToggleRef = useRef(false);
    const obstaclesDataRef = useRef([]); // [{id, x, img, aerial, size, clearY, hit, cpuHit, el, cpuEl}]
    const spawnTimerRef = useRef(0);
    const invulnUntilRef = useRef(0);
    const cpuInvulnUntilRef = useRef(0);
    const scoreAccumRef = useRef(0);
    const scoreShownRef = useRef(0);
    const speedTierShownRef = useRef(1);
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
        if (phase !== 'playing' || paused) return;
        if (!isJumpingRef.current) {
            isJumpingRef.current = true;
            doubleJumpUsedRef.current = false;
            velocityRef.current = JUMP_VELOCITY_SINGLE;
            setAirborne(true);
        } else if (!doubleJumpUsedRef.current) {
            doubleJumpUsedRef.current = true;
            velocityRef.current = JUMP_VELOCITY;
        }
    }, [phase, paused]);

    const resetStats = useCallback(() => {
        dogYRef.current = 0;
        cpuDogYRef.current = 0;
        velocityRef.current = 0;
        cpuVelocityRef.current = 0;
        isJumpingRef.current = false;
        cpuIsJumpingRef.current = false;
        cpuDoubleJumpUsedRef.current = false;
        cpuJumpAtRef.current = null;
        cpuDoubleJumpAtRef.current = null;
        cpuObstacleSeenAtRef.current = new Map();
        doubleJumpUsedRef.current = false;
        aerialToggleRef.current = false;
        obstaclesDataRef.current = [];
        spawnTimerRef.current = SPAWN_MIN_MS;
        invulnUntilRef.current = 0;
        cpuInvulnUntilRef.current = 0;
        scoreAccumRef.current = 0;
        scoreShownRef.current = 0;
        speedTierShownRef.current = 1;
        matchTimeRef.current = 0;
        setObstacles([]);
        setAirborne(false);
        setCpuAirborne(false);
        setLives(MAX_LIVES);
        setCpuLives(MAX_LIVES);
        setScore(0);
        setSpeedTierDisplay(1);
        setWon(false);
        setPaused(false);
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
        if (phase === 'gameover' || paused) return;
        const interval = setInterval(() => {
            setFrameIdx(i => (i + 1) % 4);
        }, RUN_FRAME_MS);
        return () => clearInterval(interval);
    }, [phase, paused]);

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
        if (phase !== 'playing' || paused) return;
        let rafId;
        let lastTime = performance.now();

        // Decide si la CPU debe saltar/doble-saltar YA, mirando solo lo que tiene delante en este frame.
        const decideCpuAction = (now, currentSpeed, list) => {
            const preset = CPU_DIFFICULTY_PRESETS[difficulty];
            const seenAt = cpuObstacleSeenAtRef.current;
            const relevant = [];
            for (const o of list) {
                if (o.x + o.size < DOG_X) continue; // ya paso
                if (o.x > DOG_X + DOG_SIZE + preset.visionPx) continue; // aun no "visible"
                if (!seenAt.has(o.id)) seenAt.set(o.id, now);
                if (now - seenAt.get(o.id) < preset.reactionDelayMs) continue; // todavia procesando
                const dangerWindow = getDangerWindowMs(o, currentSpeed);
                if (!dangerWindow) continue;
                relevant.push({ o, window: dangerWindow });
            }
            if (seenAt.size > 40) {
                const activeIds = new Set(list.map(o => o.id));
                for (const id of seenAt.keys()) if (!activeIds.has(id)) seenAt.delete(id);
            }
            if (relevant.length === 0) return;

            // Solo se evalua contra la amenaza mas inmediata: la siguiente decision (aterrizar,
            // o gastar el doble salto) ya se reevalua sola en un frame futuro con el estado real de ese momento.
            relevant.sort((a, b) => a.window.start - b.window.start);
            const immediate = [relevant[0]];

            // No actua en cuanto detecta que hara falta (eso la hace saltar de mas y comerse lo siguiente),
            // sino lo mas tarde posible sin dejar de ser seguro: justo antes de que empiece el peligro real.
            const scheduleAt = () => {
                const idealDelay = Math.max(0, immediate[0].window.start - CPU_ACTION_LEAD_MS);
                const jitter = (Math.random() * 2 - 1) * preset.timingJitterMs;
                return now + Math.max(0, idealDelay + jitter);
            };

            if (!cpuIsJumpingRef.current) {
                if (cpuJumpAtRef.current !== null) return;
                if (simulateCpuSafe(cpuDogYRef.current, cpuVelocityRef.current, null, 0, immediate)) return;
                if (simulateCpuSafe(cpuDogYRef.current, cpuVelocityRef.current, 0, JUMP_VELOCITY_SINGLE, immediate)) {
                    cpuJumpAtRef.current = scheduleAt();
                }
            } else if (!cpuDoubleJumpUsedRef.current) {
                // Aqui ya no hay una siguiente decision a la que delegar (es el ultimo recurso),
                // asi que mira TODO lo que tiene delante ahora mismo, no solo lo mas inmediato:
                // si solo mirase el 1er obstaculo, no veria el 2o hasta que el 1o termine de pasar.
                if (cpuDoubleJumpAtRef.current !== null) return;
                if (simulateCpuSafe(cpuDogYRef.current, cpuVelocityRef.current, null, 0, relevant)) return;
                if (simulateCpuSafe(cpuDogYRef.current, cpuVelocityRef.current, 0, JUMP_VELOCITY, relevant)) {
                    // El doble salto RESETEA la velocidad desde la altura actual: pulsarlo mas tarde
                    // (mas arriba en el arco) genera MAS tiempo de vuelo, al reves que el salto simple.
                    // Por eso se dispara ya, pegado al primero, no se espera al ultimo momento seguro.
                    const jitter = (Math.random() * 2 - 1) * preset.timingJitterMs;
                    cpuDoubleJumpAtRef.current = now + Math.max(0, jitter);
                }
            }
        };

        const tick = (now) => {
            const dt = Math.min(0.05, (now - lastTime) / 1000);
            lastTime = now;

            matchTimeRef.current += dt;
            const matchTimeMs = matchTimeRef.current * 1000;
            const rampStartMs = (SPEED_TIERS.length - 1) * SPEED_TIER_MS;
            let currentSpeed;
            let tierNumber;
            if (matchTimeMs < rampStartMs) {
                const speedTier = Math.floor(matchTimeMs / SPEED_TIER_MS);
                currentSpeed = SPEED_TIERS[speedTier];
                tierNumber = speedTier + 1;
            } else {
                const rampSteps = Math.floor((matchTimeMs - rampStartMs) / SPEED_RAMP_MS);
                currentSpeed = Math.min(SPEED_MAX, SPEED_TIERS[SPEED_TIERS.length - 1] + rampSteps * SPEED_RAMP_STEP);
                tierNumber = SPEED_TIERS.length + 1 + rampSteps;
            }
            if (tierNumber !== speedTierShownRef.current) {
                speedTierShownRef.current = tierNumber;
                setSpeedTierDisplay(tierNumber);
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
            } else if (newY > MAX_JUMP_HEIGHT) {
                newY = MAX_JUMP_HEIGHT;
            }
            dogYRef.current = newY;
            if (dogElRef.current) dogElRef.current.style.bottom = `${newY + GROUND_VISUAL_OFFSET}px`;
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
            if (cpuDogElRef.current) cpuDogElRef.current.style.bottom = `${cpuNewY + GROUND_VISUAL_OFFSET}px`;
            if (cpuJustLanded) {
                setCpuAirborne(false);
            }

            const trackWidth = trackRef.current?.offsetWidth ?? 320;
            let list = obstaclesDataRef.current;

            spawnTimerRef.current -= dt * 1000;
            let spawned = false;
            if (spawnTimerRef.current <= 0) {
                spawnTimerRef.current = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
                let aerial = false;
                const tierNow = speedTierShownRef.current;
                if (tierNow >= AERIAL_UNLOCK_TIER) {
                    aerial = aerialToggleRef.current;
                    aerialToggleRef.current = !aerialToggleRef.current;
                }
                const makeObstacle = (x) => ({
                    id: obstacleIdSeq++,
                    x,
                    img: OBSTACLE_IMGS[Math.floor(Math.random() * OBSTACLE_IMGS.length)],
                    aerial,
                    size: OBSTACLE_SIZE,
                    clearY: OBSTACLE_CLEAR_Y,
                    hit: false,
                    cpuHit: false,
                    el: null,
                    cpuEl: null,
                });
                list = [...list, makeObstacle(trackWidth)];
                if (!aerial && tierNow >= AERIAL_UNLOCK_TIER) {
                    list.push(makeObstacle(trackWidth + GROUND_PAIR_GAP_PX));
                    spawnTimerRef.current = LANDING_SYNC_DELAY_MS;
                }
                spawned = true;
            }

            const beforeLen = list.length;
            list.forEach(o => { o.x -= currentSpeed * dt; });
            list = list.filter(o => o.x > -o.size);
            const despawned = list.length !== beforeLen;

            // La CPU evalua su situacion real cada frame: si no hace nada, ¿le choca algo? si es asi,
            // ¿saltar (o doble saltar) la libra? Reemplaza la tirada de dado por obstaculo de antes.
            decideCpuAction(now, currentSpeed, list);
            if (cpuJumpAtRef.current !== null && now >= cpuJumpAtRef.current) {
                cpuJumpAtRef.current = null;
                if (!cpuIsJumpingRef.current) {
                    cpuIsJumpingRef.current = true;
                    cpuDoubleJumpUsedRef.current = false;
                    cpuVelocityRef.current = JUMP_VELOCITY_SINGLE;
                    setCpuAirborne(true);
                }
            }
            if (cpuDoubleJumpAtRef.current !== null && now >= cpuDoubleJumpAtRef.current) {
                cpuDoubleJumpAtRef.current = null;
                if (cpuIsJumpingRef.current && !cpuDoubleJumpUsedRef.current) {
                    cpuDoubleJumpUsedRef.current = true;
                    cpuVelocityRef.current = JUMP_VELOCITY;
                }
            }

            // Colision jugador
            const invuln = now < invulnUntilRef.current;
            let lifeLost = false;
            if (!invuln) {
                for (const o of list) {
                    if (o.hit) continue;
                    const overlapX = DOG_X < o.x + o.size && DOG_X + DOG_SIZE > o.x;
                    if (!overlapX) continue;
                    const dangerous = o.aerial
                        ? (dogYRef.current > AERIAL_MIN_Y && dogYRef.current < AERIAL_MAX_Y)
                        : (dogYRef.current < o.clearY);
                    if (dangerous) {
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
                    if (!overlapX) continue;
                    const cpuDangerous = isDangerousY(cpuDogYRef.current, o.aerial, o.clearY);
                    if (cpuDangerous) {
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
                setObstacles(list.map(o => ({ id: o.id, img: o.img, aerial: o.aerial })));
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
    }, [phase, paused, difficulty]);

    const dogImg = airborne ? runFrames[1] : runFrames[frameIdx];
    const cpuDogImg = cpuAirborne ? cpuRunFrames[1] : cpuRunFrames[frameIdx];

    return (
        <div className="runner-backdrop" onClick={phase !== 'playing' ? onClose : undefined}>
            <div className="runner-screen" onClick={e => e.stopPropagation()}>
                {phase !== 'playing' && (
                    <button className="modal-close" onClick={onClose}><X /></button>
                )}

                <div className="runner-tracks">
                    {phase !== 'ready' && (
                        <div className={`runner-track runner-track-cpu${phase === 'gameover' ? ' runner-track-static' : ''}`}>
                            <div className="runner-ground" />
                            {phase === 'playing' && <div className="runner-sky-overlay" />}
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
                                    className={`runner-obstacle${o.aerial ? ' runner-obstacle-aerial' : ''}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className={`runner-track runner-track-player${phase === 'gameover' ? ' runner-track-static' : ''}`} ref={trackRef}>
                        <div className="runner-ground" />
                        {phase === 'playing' && <div className="runner-sky-overlay" />}

                        <span className="runner-track-player-lives">{'❤'.repeat(lives)}{'♡'.repeat(MAX_LIVES - lives)}</span>

                        {phase === 'ready' && (
                            <button className="runner-track-scores-btn" onClick={() => setScoresOpen(true)}><Trophy size={18} /></button>
                        )}

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
                                className={`runner-obstacle${o.aerial ? ' runner-obstacle-aerial' : ''}`}
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
                                </>
                            )}
                        </div>
                    )}
                </div>

                {phase === 'gameover' && (
                    <div className="runner-action-row">
                        <button className="runner-start-btn" onClick={resetGame}>Reintentar</button>
                        <button className="runner-start-btn runner-start-btn-secondary" onClick={backToSelect}>Elegir perro</button>
                    </div>
                )}

                {phase === 'playing' && (
                    <div className="runner-action-row">
                        <button className="runner-jump-btn" onPointerDown={jump}>
                            <ArrowUp size={28} color="#2ecc71" />
                        </button>
                        <button className="runner-power-btn" disabled>
                            PODER
                        </button>
                    </div>
                )}

                {phase === 'playing' && (
                    <button className="runner-pause-btn" onClick={() => setPaused(p => !p)}>
                        {paused ? 'REANUDAR' : 'PAUSAR'}
                    </button>
                )}

                {phase !== 'ready' && (
                    <div className="runner-hud">
                        <button className="runner-scores-btn" onClick={() => setScoresOpen(true)}><Trophy size={18} /></button>
                        <span className="runner-hud-score">{score}</span>
                        {phase === 'playing' && <span className="runner-hud-tier">T{speedTierDisplay}</span>}
                    </div>
                )}

                {phase === 'ready' && (
                    <div className="runner-dog-select">
                        {DOG_SELECT_ORDER.map(id => (
                            <div key={id} className="runner-dog-select-col">
                                <button
                                    className={`runner-dog-select-btn dog-rarity-${DogsConfig[id]?.rarity}${selectedDogId === id ? ' runner-dog-select-active' : ''}`}
                                    onClick={() => setSelectedDogId(id)}
                                >
                                    <img src={DOG_ICONS[id]} alt={DogsConfig[id]?.name ?? id} className="runner-dog-select-icon" />
                                </button>
                                <span className="runner-dog-select-name">{DogsConfig[id]?.name ?? id}</span>
                            </div>
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
