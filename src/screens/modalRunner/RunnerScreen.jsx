import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Trophy, ArrowUp, ArrowLeft, Flame, Zap, Droplets, Mountain, Moon, Skull, Heart } from 'lucide-react';
import lockIcon from '../../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/lock.webp';
import { DogsConfig } from '../../game/config/DogsConfig.js';

import ladyRun1 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-1.webp';
import ladyRun2 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-2.webp';
import ladyRun3 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-3.webp';
import ladyRun4 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-4.webp';
import gordoRun1 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-1.webp';
import gordoJump from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-2.webp';
import munaRun1 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-1.webp';
import munaJump from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-2.webp';
import nupitoRun1 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-1.webp';
import nupitoJump from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-2.webp';
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
import druhJump from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-2.webp';

import ladyIcon    from '../../assets/ui/icons-pets/mineros/lady-icon.webp';
import gordoIcon   from '../../assets/ui/icons-pets/mineros/gordo-icon.webp';
import munaIcon    from '../../assets/ui/icons-pets/mineros/muna-icon.webp';
import nupitoIcon  from '../../assets/ui/icons-pets/mineros/nupito-icon.webp';
import smokeIcon   from '../../assets/ui/icons-pets/mineros/smoke-icon.webp';
import tokyoIcon   from '../../assets/ui/icons-pets/mineros/tokyo-icon.webp';
import tukaIcon    from '../../assets/ui/icons-pets/mineros/tuka-icon.webp';
import zeusIcon    from '../../assets/ui/icons-pets/mineros/zeus-icon.webp';
import druhIcon    from '../../assets/ui/icons-pets/mineros/druh-icon.webp';

import obstaculo2 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo2.webp';
import obstaculoRata from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo-rata.webp';
import obstaculoTopo1 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo-topo1.webp';
import obstaculo3 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/libre/obstaculo3.webp';
import obstaculo4 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/libre/obstaculo4.webp';
import obstaculo6 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/desierto/obstaculo6.webp';
import obstaculoArmadillo from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/desierto/obstaculo-armadillo.webp';
import obstaculoGato1 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/ciudad/obstaculo-gato1.webp';
import obstaculoAereo from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/ciudad/obstaculo-aereo.webp';
import obstaculoAereo2 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/desierto/obstaculo-aereo2.webp';
import obstaculoAereo3 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/libre/obstaculo-aereo3.webp';
import obstaculoAereoCuevas from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/mina/obstaculo-aereo-cuevas.webp';
import obstaculoAereoCuevas2 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/mina/obstaculo-aereo-cuevas2.webp';

import fuegoObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-fuego2.webp';
import electricoObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-electrico2.webp';
import aguaObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-hielo2.webp';
import tierraObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-tierra2.webp';
import oscuroObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-oscuro2.webp';

import batBoss from '../../assets/ui/icons-enemy/enemy-animation/bats/bat001.webp';

import escenarioMina1 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-1.webp';
import escenarioMina2 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-2.webp';
import escenarioMina3 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-3.webp';
import escenarioCiudad1 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-1.webp';
import escenarioCiudad2 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-2.webp';
import escenarioCiudad3 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-3.webp';
import escenarioCiudad4 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-3.webp'; // tambien vale como escenario de Ciudad (skyline)

import '../../styles/modals/RunnerScreen.css';

// Misma paleta que ELEMENT_ICON de CombatScreen.jsx, replicada aqui a proposito (componente aislado, ver feedback_sistemas_aislados)
const ELEMENT_ICON = {
    fuego:     { Icon: Flame,    color: '#ff6b35' },
    electrico: { Icon: Zap,      color: '#FFD700' },
    agua:      { Icon: Droplets, color: '#4fc3f7' },
    tierra:    { Icon: Mountain, color: '#8b6914' },
    oscuro:    { Icon: Moon,     color: '#b45cff' },
};

const ELEMENT_POWER_OBSTACLE_IMGS = {
    fuego: fuegoObstacle,
    electrico: electricoObstacle,
    agua: aguaObstacle,
    tierra: tierraObstacle,
    oscuro: oscuroObstacle,
};

const DOG_SELECT_ORDER = ['lady', 'gordo', 'muna', 'nupito', 'smoke', 'tokio', 'tuka', 'zeus', 'druh'];

// Bloqueados temporalmente: su ciclo de correr todavia no esta animado (webp autoanimado como el resto),
// se nota mucho mas tosco al lado de los que ya se pasaron. Se desbloquean cuando se animen.
const LOCKED_DOG_IDS = ['lady', 'tuka', 'smoke', 'zeus', 'tokio', 'nupito'];
const UNLOCKED_DOG_IDS = DOG_SELECT_ORDER.filter(id => !LOCKED_DOG_IDS.includes(id));
// Desbloqueados primero (en su orden habitual), bloqueados al final.
const DOG_SELECT_DISPLAY_ORDER = [...UNLOCKED_DOG_IDS, ...DOG_SELECT_ORDER.filter(id => LOCKED_DOG_IDS.includes(id))];

const DOG_RUN_FRAMES = {
    lady:   [ladyRun1, ladyRun2, ladyRun3, ladyRun4],
    gordo:  [gordoRun1, gordoRun1, gordoRun1, gordoRun1],
    muna:   [munaRun1, munaRun1, munaRun1, munaRun1],
    nupito: [nupitoRun1, nupitoRun1, nupitoRun1, nupitoRun1],
    smoke:  [smokeRun1, smokeRun2, smokeRun3, smokeRun4],
    tokio:  [tokyoRun1, tokyoRun2, tokyoRun3, tokyoRun4],
    tuka:   [tukaRun1, tukaRun2, tukaRun3, tukaRun4],
    zeus:   [zeusRun1, zeusRun2, zeusRun3, zeusRun4],
    druh:   [druhRun1, druhRun1, druhRun1, druhRun1],
};

// Pose de salto propia para perros con sprite de correr animado (webp autoanimado, no ciclo de 4 frames).
// El resto de perros sigue usando runFrames[1] como pose de salto (ver dogImg/cpuDogImg).
const DOG_JUMP_FRAME = {
    gordo: gordoJump,
    druh: druhJump,
    muna: munaJump,
    nupito: nupitoJump,
};

const DOG_ICONS = {
    lady: ladyIcon, gordo: gordoIcon, muna: munaIcon, nupito: nupitoIcon,
    smoke: smokeIcon, tokio: tokyoIcon, tuka: tukaIcon, zeus: zeusIcon, druh: druhIcon,
};

const BIOMES = {
    mina: { title: 'Mina', desc: '3-4 escenarios encadenados', scenes: [escenarioMina1, escenarioMina2, escenarioMina3], interior: true },
    ciudad: { title: 'Ciudad', desc: '3-4 escenarios encadenados', scenes: [escenarioCiudad1, escenarioCiudad2, escenarioCiudad3, escenarioCiudad4], interior: false },
    // desierto: pendiente de escenarios propios (exterior) -- de momento sin card, solo assets de obstaculos reservados
};
const BIOME_ORDER = ['mina', 'ciudad'];

const RUN_FRAME_MS = 130;
// Pools tematicos por contexto (libre / bioma) -- terrestres
const GROUND_OBSTACLE_IMGS_LIBRE = [obstaculo3, obstaculo4, obstaculo6, obstaculoArmadillo]; // fondo actual de Libre es desierto, mezcla libre+desierto
const GROUND_OBSTACLE_IMGS_MINA = [obstaculo2, obstaculoRata, obstaculoTopo1];
const GROUND_OBSTACLE_IMGS_CIUDAD = [obstaculo3, obstaculo4, obstaculoGato1];
// Pools tematicos por contexto -- aereos (mina usa el set de cuevas, es un bioma interior)
const AERIAL_OBSTACLE_IMGS_LIBRE = [obstaculoAereo3, obstaculoAereo2];
const AERIAL_OBSTACLE_IMGS_CIUDAD = [obstaculoAereo];
const AERIAL_OBSTACLE_IMGS_MINA_CUEVAS = [obstaculoAereoCuevas, obstaculoAereoCuevas2];

const GROUND_VISUAL_OFFSET = 12; // sube el perro un poco para que pise el camino del fondo, no la piedra de abajo
const MAX_JUMP_HEIGHT = 130; // tope para que ni el doble salto sobresalga de la card
const CHECKPOINT_INTERVAL_S = 45; // arcade: cada cuanto tiempo (segundos) aparece la pantalla de meta/recompensa
const HEART_FIRST_AT_S = 25;  // modo libre: primer corazon extra al llegar al tramo 5 (25s, 5 tramos x 5s)
const HEART_INTERVAL_S = 20;  // luego uno cada 4 tramos (20s)
const LIBRE_SCENE_COUNT = 4;  // fondos disponibles en escenarios-run-libre/ (libre-1, libre-2, libre-3...), se sortea 1 al empezar
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
// Franja del corazon cuando toca cogerlo saltando (va emparejado con un obstaculo terrestre): mas arriba
// que la franja normal de peligro aereo, cerca del pico del salto sencillo (~96px) donde el perro se
// queda "flotando" un instante (velocidad vertical casi 0), asi da mas margen de timing para cogerlo.
const HEART_AERIAL_MIN_Y = 90;
const HEART_AERIAL_MAX_Y = 130;
const AERIAL_UNLOCK_TIER = 3; // a partir de este tramo empieza el patron complejo (pareja+aereo+suelto); antes ya hay aereos, pero alternando 1 a 1
const DOUBLE_SOLO_UNLOCK_TIER = 9; // a partir de este tramo, el terrestre "suelto" del patron tambien sale en pareja
const GROUND_PAIR_GAP_PX = 90; // separacion entre los 2 terrestres cuando salen en pareja
const LANDING_SYNC_DELAY_MS = 800; // tiempo aprox. de un doble salto completo, para que el aereo llegue justo al aterrizar
const HIT_INVULN_MS = 900;
const MAX_LIVES = 3;
const GAME_END_DELAY_MS = 600; // pausa antes de mostrar la pantalla de resultado, para que clicks de mas no toquen el boton nuevo que aparece ahi

const BOSS_MAX_HP = 40;
const BOSS_POWER_DAMAGE = 10;
const BOSS_X_RATIO = 0.75; // posicion del boss como fraccion del ancho de pista, fijo cerca del borde derecho

// Cadencia de ataque del boss, independiente de la que usaba la CPU durante la carrera
const BOSS_ATTACK_MAX_CHARGES = 3;
const BOSS_ATTACK_RECHARGE_MS = 3000;
const BOSS_ATTACK_CHANCE_PER_SEC = 0.4;

const POWER_PROJECTILE_SPEED = 500; // px/s, propia y fija, no depende del ritmo de la carrera

const MAX_POWER_CHARGES = 2;
const POWER_RECHARGE_MS = 10000;
const CPU_POWER_TIER_THRESHOLD = 3; // a partir de aqui la CPU usa el poder con mucha mas frecuencia
const CPU_POWER_CHANCE_PER_SEC_EARLY = 0.02;
const CPU_POWER_CHANCE_PER_SEC_LATE = 0.15;

// La dificultad ya no es "% de acierto": la CPU siempre intenta esquivar bien,
// lo que varia es su imperfeccion (cuanto tarda en reaccionar, cuanto tiembla el timing, cuanto ve venir).
const CPU_DIFFICULTY_PRESETS = {
    facil:   { label: 'Fácil',   reactionDelayMs: 280, timingJitterMs: 110, visionPx: 200 },
    medio:   { label: 'Medio',   reactionDelayMs: 90,  timingJitterMs: 25,  visionPx: 340 },
    dificil: { label: 'Difícil', reactionDelayMs: 50,  timingJitterMs: 10,  visionPx: 410 },
};
const DIFFICULTY_ORDER = ['facil', 'medio', 'dificil'];
const MEDIUM_PAIR_CHANCE = 0.35; // en Medio, la pareja de obstaculos solo sale esta fraccion de las veces que tocaria en Dificil

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

export default function RunnerScreen({ onClose, belowHud = false }) {
    const [phase, setPhase] = useState('ready'); // 'ready' | 'playing' | 'gameover'
    const [stage, setStage] = useState('cpu'); // 'cpu' | 'boss', sub-fase dentro de 'playing'
    const [runMode, setRunMode] = useState(null); // null | 'historia' | 'arcade'
    const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
    const [paused, setPaused] = useState(false);
    const [won, setWon] = useState(false);
    const [selectedDogId, setSelectedDogId] = useState(
        () => UNLOCKED_DOG_IDS[Math.floor(Math.random() * UNLOCKED_DOG_IDS.length)]
    );
    const [cpuDogId, setCpuDogId] = useState('gordo');
    const [difficulty, setDifficulty] = useState('facil');
    const [lives, setLives] = useState(MAX_LIVES);
    const [bonusLives, setBonusLives] = useState(0); // corazones extra ganados en checkpoints, se suman al maximo
    const [cpuLives, setCpuLives] = useState(MAX_LIVES);
    const [rivalsDefeated, setRivalsDefeated] = useState(0);
    const [checkpointOpen, setCheckpointOpen] = useState(false);
    const [sceneIndex, setSceneIndex] = useState(0);
    const [libreSceneIndex, setLibreSceneIndex] = useState(1); // 1 o 2: fondo de Modo Libre, se sortea cada partida
    const [biomeSelectOpen, setBiomeSelectOpen] = useState(false);
    const [arcadeSubMode, setArcadeSubMode] = useState(null); // null | 'libre' | 'biome' -- solo 'biome' dispara checkpoints
    const [selectedBiomeId, setSelectedBiomeId] = useState(null); // key de BIOMES cuando arcadeSubMode === 'biome'
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
    const [powerCharges, setPowerCharges] = useState(MAX_POWER_CHARGES);
    const [cpuPowerPending, setCpuPowerPending] = useState(false); // brilla la pista CPU: tiene un poder tuyo por llegar
    const [playerPowerPending, setPlayerPowerPending] = useState(false); // brilla tu pista: la CPU te la ha jugado

    const trackRef = useRef(null);
    const dogElRef = useRef(null);
    const cpuDogElRef = useRef(null);
    const bossElRef = useRef(null);
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
    const spawnPatternIndexRef = useRef(0); // contador de spawns, se interpreta mod 2 (tramo 1-2) o mod 3 (tramo 3+)
    const obstaclesDataRef = useRef([]); // [{id, x, img, aerial, size, clearY, hit, cpuHit, el, cpuEl}]
    const spawnTimerRef = useRef(0);
    const invulnUntilRef = useRef(0);
    const cpuInvulnUntilRef = useRef(0);
    const scoreAccumRef = useRef(0);
    const scoreShownRef = useRef(0);
    const speedTierShownRef = useRef(1);
    const matchTimeRef = useRef(0);
    const nextCheckpointAtRef = useRef(CHECKPOINT_INTERVAL_S);
    const nextHeartAtRef = useRef(HEART_FIRST_AT_S);
    const pendingHeartRef = useRef(false);
    const powerChargesRef = useRef(MAX_POWER_CHARGES);
    const cpuPowerChargesRef = useRef(MAX_POWER_CHARGES);
    const powerRechargeTimerRef = useRef(POWER_RECHARGE_MS);
    const cpuPowerRechargeTimerRef = useRef(POWER_RECHARGE_MS);
    const pendingPowerForCpuRef = useRef(0);    // poder del jugador, pendiente de aplicar en la pista CPU
    const pendingPowerForPlayerRef = useRef(0); // poder de la CPU, pendiente de aplicar en la pista del jugador
    const endingRef = useRef(false); // true en cuanto se decide el resultado, congela el tick hasta que se muestre la pantalla
    const bossAttackChargesRef = useRef(BOSS_ATTACK_MAX_CHARGES);
    const bossAttackRechargeTimerRef = useRef(BOSS_ATTACK_RECHARGE_MS);

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

    const usePower = useCallback(() => {
        if (phase !== 'playing' || paused) return;
        if (powerChargesRef.current <= 0) return;
        powerChargesRef.current -= 1;
        setPowerCharges(powerChargesRef.current);
        if (stage === 'boss') {
            const projectile = {
                id: obstacleIdSeq++,
                x: DOG_X + DOG_SIZE,
                img: ELEMENT_POWER_OBSTACLE_IMGS[DogsConfig[selectedDogId]?.element],
                aerial: false,
                lane: 'cpu',
                isProjectile: true,
                size: OBSTACLE_SIZE,
                clearY: OBSTACLE_CLEAR_Y,
                hit: false,
                cpuHit: false,
                el: null,
                cpuEl: null,
            };
            obstaclesDataRef.current = [...obstaclesDataRef.current, projectile];
            setObstacles(obstaclesDataRef.current.map(o => ({ id: o.id, img: o.img, aerial: o.aerial, lane: o.lane, isProjectile: o.isProjectile, isHeart: o.isHeart })));
        } else {
            pendingPowerForCpuRef.current += 1;
            setCpuPowerPending(true);
        }
    }, [phase, paused, stage, selectedDogId]);

    const resetStats = useCallback(() => {
        dogYRef.current = 0;
        cpuDogYRef.current = 0;
        if (dogElRef.current) dogElRef.current.style.bottom = `${GROUND_VISUAL_OFFSET}px`;
        if (cpuDogElRef.current) cpuDogElRef.current.style.bottom = `${GROUND_VISUAL_OFFSET}px`;
        velocityRef.current = 0;
        cpuVelocityRef.current = 0;
        isJumpingRef.current = false;
        cpuIsJumpingRef.current = false;
        cpuDoubleJumpUsedRef.current = false;
        cpuJumpAtRef.current = null;
        cpuDoubleJumpAtRef.current = null;
        cpuObstacleSeenAtRef.current = new Map();
        doubleJumpUsedRef.current = false;
        spawnPatternIndexRef.current = 0;
        obstaclesDataRef.current = [];
        spawnTimerRef.current = SPAWN_MIN_MS;
        invulnUntilRef.current = 0;
        cpuInvulnUntilRef.current = 0;
        scoreAccumRef.current = 0;
        scoreShownRef.current = 0;
        speedTierShownRef.current = 1;
        matchTimeRef.current = 0;
        nextCheckpointAtRef.current = CHECKPOINT_INTERVAL_S;
        nextHeartAtRef.current = HEART_FIRST_AT_S;
        pendingHeartRef.current = false;
        powerChargesRef.current = MAX_POWER_CHARGES;
        cpuPowerChargesRef.current = MAX_POWER_CHARGES;
        powerRechargeTimerRef.current = POWER_RECHARGE_MS;
        cpuPowerRechargeTimerRef.current = POWER_RECHARGE_MS;
        pendingPowerForCpuRef.current = 0;
        pendingPowerForPlayerRef.current = 0;
        endingRef.current = false;
        bossAttackChargesRef.current = BOSS_ATTACK_MAX_CHARGES;
        bossAttackRechargeTimerRef.current = BOSS_ATTACK_RECHARGE_MS;
        setPowerCharges(MAX_POWER_CHARGES);
        setCpuPowerPending(false);
        setPlayerPowerPending(false);
        setObstacles([]);
        setAirborne(false);
        setCpuAirborne(false);
        setLives(MAX_LIVES);
        setBonusLives(0);
        setCpuLives(MAX_LIVES);
        setRivalsDefeated(0);
        setCheckpointOpen(false);
        setSceneIndex(0);
        setBiomeSelectOpen(false);
        setStage('cpu');
        setBossHp(BOSS_MAX_HP);
        setScore(0);
        setSpeedTierDisplay(1);
        setWon(false);
        setPaused(false);
    }, []);

    const resetGame = useCallback(() => {
        resetStats();
        const rivalPool = UNLOCKED_DOG_IDS.filter(id => id !== selectedDogId);
        setCpuDogId(rivalPool[Math.floor(Math.random() * rivalPool.length)]);
        setLibreSceneIndex(4); // TEMPORAL: forzado para probar libre-4, revertir a random cuando se confirme
        setPhase('playing');
    }, [resetStats, selectedDogId]);

    const backToSelect = useCallback(() => {
        resetStats();
        setPhase('ready');
        setRunMode(null);
        setBiomeSelectOpen(false);
        setArcadeSubMode(null);
        setSelectedBiomeId(null);
    }, [resetStats]);

    // Arcade: pantalla de meta cada CHECKPOINT_INTERVAL_S, encadena los escenarios del bioma elegido.
    // "Reclamar" es un label sin logica aun.
    const handleCheckpointContinue = useCallback(() => {
        const totalScenes = BIOMES[selectedBiomeId]?.scenes.length ?? 1;
        if (sceneIndex >= totalScenes - 1) {
            // Ultimo escenario del bioma completado: termina la run, vuelve a elegir bioma
            resetStats();
            setPhase('ready');
            setBiomeSelectOpen(true);
            return;
        }
        nextCheckpointAtRef.current += CHECKPOINT_INTERVAL_S;
        setSceneIndex(i => i + 1);
        obstaclesDataRef.current = [];
        setObstacles([]);
        spawnTimerRef.current = SPAWN_MIN_MS;
        setCheckpointOpen(false);
    }, [sceneIndex, selectedBiomeId, resetStats]);

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
        if (phase !== 'playing' || paused || checkpointOpen) return;
        let rafId;
        let lastTime = performance.now();

        // Decide si la CPU debe saltar/doble-saltar YA, mirando solo lo que tiene delante en este frame.
        const decideCpuAction = (now, currentSpeed, list) => {
            const preset = CPU_DIFFICULTY_PRESETS[difficulty];
            const seenAt = cpuObstacleSeenAtRef.current;
            const relevant = [];
            for (const o of list) {
                if (o.lane === 'player') continue; // obstaculo de poder que no le afecta a ella
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
            if (endingRef.current) { rafId = requestAnimationFrame(tick); return; }
            const dt = Math.min(0.05, (now - lastTime) / 1000);
            lastTime = now;

            matchTimeRef.current += dt;

            if (arcadeSubMode === 'biome' && matchTimeRef.current >= nextCheckpointAtRef.current) {
                setCheckpointOpen(true);
                return;
            }

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

            // Recarga de cargas de poder (jugador y CPU, independiente cada una)
            powerRechargeTimerRef.current -= dt * 1000;
            if (powerRechargeTimerRef.current <= 0) {
                powerRechargeTimerRef.current = POWER_RECHARGE_MS;
                if (powerChargesRef.current < MAX_POWER_CHARGES) {
                    powerChargesRef.current += 1;
                    setPowerCharges(powerChargesRef.current);
                }
            }
            if (runMode === 'historia') {
                if (stage === 'cpu') {
                    // La CPU decide sola cuando sabotearte durante la carrera: al azar, mas probable desde tramo 3
                    cpuPowerRechargeTimerRef.current -= dt * 1000;
                    if (cpuPowerRechargeTimerRef.current <= 0) {
                        cpuPowerRechargeTimerRef.current = POWER_RECHARGE_MS;
                        if (cpuPowerChargesRef.current < MAX_POWER_CHARGES) {
                            cpuPowerChargesRef.current += 1;
                        }
                    }
                    const cpuPowerChance = tierNumber >= CPU_POWER_TIER_THRESHOLD
                        ? CPU_POWER_CHANCE_PER_SEC_LATE
                        : CPU_POWER_CHANCE_PER_SEC_EARLY;
                    if (cpuPowerChargesRef.current > 0 && Math.random() < cpuPowerChance * dt) {
                        cpuPowerChargesRef.current -= 1;
                        pendingPowerForPlayerRef.current += 1;
                        setPlayerPowerPending(true);
                    }
                } else {
                    // El boss ataca con su propia cadencia, independiente de la carrera: mas cargas,
                    // recarga mas rapida y mas probabilidad, para que sea el reto principal de esta fase
                    // (puede soltar 2 ataques seguidos si lleva varias cargas acumuladas).
                    bossAttackRechargeTimerRef.current -= dt * 1000;
                    if (bossAttackRechargeTimerRef.current <= 0) {
                        bossAttackRechargeTimerRef.current = BOSS_ATTACK_RECHARGE_MS;
                        if (bossAttackChargesRef.current < BOSS_ATTACK_MAX_CHARGES) {
                            bossAttackChargesRef.current += 1;
                        }
                    }
                    if (bossAttackChargesRef.current > 0 && Math.random() < BOSS_ATTACK_CHANCE_PER_SEC * dt) {
                        bossAttackChargesRef.current -= 1;
                        pendingPowerForPlayerRef.current += 1;
                        setPlayerPowerPending(true);
                    }
                }
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

            // Fisica CPU (mismas reglas, ella misma dispara su salto mas abajo). Solo mientras siga en pie.
            if (stage === 'cpu') {
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
            }

            const trackWidth = trackRef.current?.offsetWidth ?? 320;
            let list = obstaclesDataRef.current;
            let spawned = false;

            // Modo Libre: corazon extra cada HEART_INTERVAL_S a partir de HEART_FIRST_AT_S. No se genera
            // suelto: se marca pendiente y se engancha al PROXIMO obstaculo real (ver mas abajo), exigiendo
            // la accion contraria a la que hace falta para esquivarlo (asi solo lo coges esquivando bien).
            if (arcadeSubMode === 'libre' && matchTimeRef.current >= nextHeartAtRef.current) {
                nextHeartAtRef.current += HEART_INTERVAL_S;
                pendingHeartRef.current = true;
            }

            // En fase boss ya no hay generador automatico: el unico origen de obstaculos terrestres
            // es el propio ataque del boss, disparado al momento (sin esperar a ningun spawn base).
            if (stage === 'boss' && pendingPowerForPlayerRef.current > 0) {
                pendingPowerForPlayerRef.current -= 1;
                list = [...list, {
                    id: obstacleIdSeq++,
                    x: trackWidth,
                    img: ELEMENT_POWER_OBSTACLE_IMGS[DogsConfig[cpuDogId]?.element],
                    aerial: false,
                    lane: 'player',
                    size: OBSTACLE_SIZE,
                    clearY: OBSTACLE_CLEAR_Y,
                    hit: false,
                    cpuHit: false,
                    el: null,
                    cpuEl: null,
                }];
                setPlayerPowerPending(false);
                spawned = true;
            }

            spawnTimerRef.current -= dt * 1000;
            if (stage === 'cpu' && spawnTimerRef.current <= 0) {
                spawnTimerRef.current = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
                const tierNow = speedTierShownRef.current;
                let aerial = false;
                let isPair = false;
                if (tierNow >= AERIAL_UNLOCK_TIER) {
                    // Tramo 3+: pareja terrestre -> aereo -> terrestre suelto (repite)
                    // Tramo 5+: el terrestre "suelto" tambien sale en pareja
                    const pattern = spawnPatternIndexRef.current % 3;
                    aerial = pattern === 1;
                    const wouldBePair = pattern === 0 || (pattern === 2 && tierNow >= DOUBLE_SOLO_UNLOCK_TIER);
                    // Dificultad del jugador: en Facil nunca hay pareja, en Medio sale rara vez,
                    // en Dificil es el comportamiento de siempre (fijo segun el patron).
                    if (difficulty === 'facil') {
                        isPair = false;
                    } else if (difficulty === 'medio') {
                        isPair = wouldBePair && Math.random() < MEDIUM_PAIR_CHANCE;
                    } else {
                        isPair = wouldBePair;
                    }
                } else {
                    // Tramo 1-2: terrestre -> aereo (repite), sin parejas todavia
                    const pattern = spawnPatternIndexRef.current % 2;
                    aerial = pattern === 1;
                }
                spawnPatternIndexRef.current += 1;
                const isBiomeCiudad = arcadeSubMode === 'biome' && selectedBiomeId === 'ciudad';
                const isBiomeMina = arcadeSubMode === 'biome' && selectedBiomeId === 'mina';
                const groundObstaclePool = isBiomeCiudad ? GROUND_OBSTACLE_IMGS_CIUDAD
                    : isBiomeMina ? GROUND_OBSTACLE_IMGS_MINA
                    : GROUND_OBSTACLE_IMGS_LIBRE;
                const aerialObstaclePool = isBiomeCiudad ? AERIAL_OBSTACLE_IMGS_CIUDAD
                    : isBiomeMina ? AERIAL_OBSTACLE_IMGS_MINA_CUEVAS
                    : AERIAL_OBSTACLE_IMGS_LIBRE;
                const makeObstacle = (x, lane = 'both', element = null) => {
                    // En fase boss, los terrestres normales tambien se tematizan solos con el elemento
                    // del CPU derrotado (salvo que ya venga uno explicito, como los de poder). Aereos, no.
                    const resolvedElement = element ?? (!aerial && stage === 'boss' ? DogsConfig[cpuDogId]?.element : null);
                    return {
                        id: obstacleIdSeq++,
                        x,
                        img: resolvedElement && ELEMENT_POWER_OBSTACLE_IMGS[resolvedElement]
                            ? ELEMENT_POWER_OBSTACLE_IMGS[resolvedElement]
                            : (aerial
                                ? aerialObstaclePool[Math.floor(Math.random() * aerialObstaclePool.length)]
                                : groundObstaclePool[Math.floor(Math.random() * groundObstaclePool.length)]),
                        aerial,
                        lane, // 'both' | 'player' | 'cpu' -- de poder, solo afecta/se ve en el carril indicado
                        size: OBSTACLE_SIZE,
                        clearY: OBSTACLE_CLEAR_Y,
                        hit: false,
                        cpuHit: false,
                        el: null,
                        cpuEl: null,
                    };
                };
                let groupCount = 1;
                list = [...list, makeObstacle(trackWidth)];
                if (arcadeSubMode === 'libre' && pendingHeartRef.current) {
                    pendingHeartRef.current = false;
                    // Exige la accion CONTRARIA a la que hace falta para esquivar el obstaculo real que
                    // acompaña: si el obstaculo es terrestre, el corazon solo se coge saltando (arriba);
                    // si es aereo, se coge quedandose abajo. Asi solo se recoge esquivando bien, no aparte.
                    list.push({
                        id: obstacleIdSeq++,
                        x: trackWidth,
                        img: null,
                        isHeart: true,
                        aerial: !aerial,
                        lane: 'player',
                        size: OBSTACLE_SIZE,
                        clearY: OBSTACLE_CLEAR_Y,
                        hit: false,
                        cpuHit: false,
                        el: null,
                        cpuEl: null,
                    });
                }
                if (isPair) {
                    list.push(makeObstacle(trackWidth + GROUND_PAIR_GAP_PX));
                    groupCount += 1;
                }
                // Poderes: inyectan un extra terrestre. Hacia el carril CPU solo mientras siga en pie
                // (ya no hay a quien sabotear en fase boss); hacia tu carril sigue activo en las 2 fases
                // (en boss es el ataque del boss, heredado del elemento del perro derrotado).
                if (!aerial) {
                    if (stage === 'cpu' && pendingPowerForCpuRef.current > 0) {
                        pendingPowerForCpuRef.current -= 1;
                        list.push(makeObstacle(trackWidth + GROUND_PAIR_GAP_PX * groupCount, 'cpu', DogsConfig[selectedDogId]?.element));
                        groupCount += 1;
                        if (pendingPowerForCpuRef.current === 0) setCpuPowerPending(false);
                    }
                    if (pendingPowerForPlayerRef.current > 0) {
                        pendingPowerForPlayerRef.current -= 1;
                        list.push(makeObstacle(trackWidth + GROUND_PAIR_GAP_PX * groupCount, 'player', DogsConfig[cpuDogId]?.element));
                        groupCount += 1;
                        if (pendingPowerForPlayerRef.current === 0) setPlayerPowerPending(false);
                    }
                }
                if (groupCount >= 2) {
                    spawnTimerRef.current = LANDING_SYNC_DELAY_MS;
                }
                spawned = true;
            }

            const beforeLen = list.length;
            list.forEach(o => {
                // El proyectil de tu poder viaja al reves que todo lo demas: nace junto a ti y avanza
                // hacia la derecha, con su propia velocidad fija, no la de scroll de la carrera.
                if (o.isProjectile) o.x += POWER_PROJECTILE_SPEED * dt;
                else o.x -= currentSpeed * dt;
            });
            list = list.filter(o => o.isProjectile ? (o.x < trackWidth + o.size && !o.hit) : o.x > -o.size);
            const despawned = list.length !== beforeLen;

            // La CPU evalua su situacion real cada frame: si no hace nada, ¿le choca algo? si es asi,
            // ¿saltar (o doble saltar) la libra? Reemplaza la tirada de dado por obstaculo de antes.
            if (stage === 'cpu') {
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
            }

            // Recogida de corazones: independiente de la invulnerabilidad por golpe, se puede coger
            // aunque acabes de perder una vida.
            let heartCollected = false;
            for (const o of list) {
                if (!o.isHeart || o.hit) continue;
                const overlapX = DOG_X < o.x + o.size && DOG_X + DOG_SIZE > o.x;
                if (!overlapX) continue;
                const inHeartZone = o.aerial
                    ? (dogYRef.current > HEART_AERIAL_MIN_Y && dogYRef.current < HEART_AERIAL_MAX_Y)
                    : (dogYRef.current < o.clearY);
                if (inHeartZone) {
                    o.hit = true;
                    heartCollected = true;
                }
            }
            if (heartCollected) setLives(l => l + 1);

            // Colision jugador
            const invuln = now < invulnUntilRef.current;
            let lifeLost = false;
            if (!invuln) {
                for (const o of list) {
                    if (o.hit || o.lane === 'cpu' || o.isHeart) continue;
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
            let cpuLifeLost = false;
            if (stage === 'cpu') {
                const cpuInvuln = now < cpuInvulnUntilRef.current;
                if (!cpuInvuln) {
                    for (const o of list) {
                        if (o.cpuHit || o.lane === 'player') continue;
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
            }

            // Colision con el boss: cualquier proyectil de poder que llegue a su posicion le resta vida
            let bossHit = false;
            if (stage === 'boss') {
                const bossX = trackWidth * BOSS_X_RATIO;
                if (bossElRef.current) bossElRef.current.style.left = `${bossX}px`;
                for (const o of list) {
                    if (!o.isProjectile || o.hit) continue;
                    if (o.x >= bossX) {
                        o.hit = true;
                        bossHit = true;
                    }
                }
            }

            list.forEach(o => {
                if (o.el) o.el.style.left = `${o.x}px`;
                if (o.cpuEl) o.cpuEl.style.left = `${o.x}px`;
            });
            obstaclesDataRef.current = list;
            if (spawned || despawned || bossHit) {
                setObstacles(list.map(o => ({ id: o.id, img: o.img, aerial: o.aerial, lane: o.lane, isProjectile: o.isProjectile, isHeart: o.isHeart })));
            }

            if (bossHit) {
                setBossHp(prev => {
                    const next = Math.max(0, prev - BOSS_POWER_DAMAGE);
                    if (next <= 0 && !endingRef.current) {
                        endingRef.current = true;
                        setTimeout(() => { setWon(true); setPhase('gameover'); }, GAME_END_DELAY_MS);
                    }
                    return next;
                });
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
                    if (next <= 0 && !endingRef.current) {
                        endingRef.current = true;
                        setTimeout(() => { setWon(false); setPhase('gameover'); }, GAME_END_DELAY_MS);
                    }
                    return next;
                });
            }

            if (cpuLifeLost) {
                cpuInvulnUntilRef.current = now + HIT_INVULN_MS;
                setCpuHitFlash(true);
                setTimeout(() => setCpuHitFlash(false), HIT_INVULN_MS);
                setCpuLives(prev => {
                    const next = prev - 1;
                    if (next > 0) return next;
                    if (runMode === 'historia') {
                        setStage('boss');
                        return next;
                    }
                    // Arcade infinito: en vez de terminar la partida, aparece otro rival
                    setRivalsDefeated(r => r + 1);
                    const rivalPool = UNLOCKED_DOG_IDS.filter(id => id !== selectedDogId && id !== cpuDogId);
                    setCpuDogId(rivalPool[Math.floor(Math.random() * rivalPool.length)]);
                    return MAX_LIVES;
                });
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [phase, paused, difficulty, selectedDogId, cpuDogId, stage, runMode, checkpointOpen, arcadeSubMode, selectedBiomeId]);

    const dogImg = airborne ? (DOG_JUMP_FRAME[selectedDogId] ?? runFrames[1]) : runFrames[frameIdx];
    const cpuDogImg = cpuAirborne ? (DOG_JUMP_FRAME[cpuDogId] ?? cpuRunFrames[1]) : cpuRunFrames[frameIdx];
    const playerPowerObstacleImg = ELEMENT_POWER_OBSTACLE_IMGS[DogsConfig[selectedDogId]?.element];
    const biomeSceneClass = arcadeSubMode === 'biome' && selectedBiomeId
        ? ` runner-track-scene-${selectedBiomeId}-${sceneIndex + 1}`
        : arcadeSubMode === 'libre'
            ? ` runner-track-scene-libre-${libreSceneIndex}`
            : '';
    const skyOverlayClass = `runner-sky-overlay${arcadeSubMode === 'biome' && BIOMES[selectedBiomeId]?.interior ? ' runner-sky-overlay-interior' : ''}`;

    return (
        <div className={`runner-backdrop${belowHud ? ' runner-backdrop-below-hud' : ''}`} onClick={phase !== 'playing' ? onClose : undefined}>
            <div className="runner-screen" onClick={e => e.stopPropagation()}>
                {phase !== 'playing' && onClose && (
                    <button className="modal-close" onClick={onClose}><X /></button>
                )}

                <div className="runner-tracks">
                    {phase !== 'ready' && (
                        <div className={`runner-track runner-track-cpu${phase === 'gameover' ? ' runner-track-static' : ''}${biomeSceneClass}${cpuPowerPending ? ' runner-track-power-pending' : ''}${stage === 'boss' ? ' runner-track-boss' : ''}`}>
                            <div className="runner-ground" />
                            {phase === 'playing' && stage === 'cpu' && <div className={skyOverlayClass} />}

                            {stage === 'cpu' && (
                                <>
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
                                    {obstacles.filter(o => o.lane !== 'player').map(o => (
                                        <img
                                            key={o.id}
                                            ref={el => setCpuObstacleEl(o.id, el)}
                                            src={o.img}
                                            alt=""
                                            className={`runner-obstacle${o.aerial ? ' runner-obstacle-aerial' : ''}`}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    )}

                    <div className={`runner-track runner-track-player${phase === 'gameover' ? ' runner-track-static' : ''}${biomeSceneClass}${playerPowerPending ? ' runner-track-power-pending' : ''}`} ref={trackRef}>
                        <div className="runner-ground" />
                        {phase === 'playing' && <div className={skyOverlayClass} />}

                        <span className="runner-track-player-lives">{'❤'.repeat(lives)}{'♡'.repeat(Math.max(0, (MAX_LIVES + bonusLives) - lives))}</span>

                        {stage === 'boss' && (
                            <div className="runner-boss-label">
                                <span>BOSS</span>
                                <span className="runner-track-cpu-lives">{bossHp}/{BOSS_MAX_HP}</span>
                            </div>
                        )}

                        {phase === 'ready' && (
                            <button className="runner-track-scores-btn" onClick={() => setScoresOpen(true)}><Trophy size={18} /></button>
                        )}

                        <img
                            ref={dogElRef}
                            src={dogImg}
                            alt={DogsConfig[selectedDogId]?.name ?? selectedDogId}
                            className={`runner-dog${hitFlash ? ' runner-dog-hit' : ''}`}
                        />

                        {stage === 'boss' && <img ref={bossElRef} src={batBoss} alt="Boss" className="runner-boss" />}

                        {obstacles.filter(o => o.lane !== 'cpu' || o.isProjectile).map(o => (
                            o.isHeart ? (
                                <Heart
                                    key={o.id}
                                    ref={el => setObstacleEl(o.id, el)}
                                    className={`runner-obstacle runner-obstacle-heart${o.aerial ? ' runner-obstacle-aerial' : ''}`}
                                    fill="#ff4d6d"
                                    color="#ff4d6d"
                                />
                            ) : (
                                <img
                                    key={o.id}
                                    ref={el => setObstacleEl(o.id, el)}
                                    src={o.img}
                                    alt=""
                                    className={`runner-obstacle${o.aerial ? ' runner-obstacle-aerial' : ''}`}
                                />
                            )
                        ))}
                    </div>

                    {(phase === 'ready' || phase === 'gameover') && (
                        <div className="runner-overlay">
                            {phase === 'ready' && !runMode && (
                                <div className="runner-mode-select">
                                    <button className="runner-mode-btn" onClick={() => setRunMode('arcade')}>
                                        <span className="runner-mode-btn-title">Modo Libre</span>
                                    </button>
                                    <button className="runner-mode-btn runner-mode-btn-locked" disabled>
                                        <span className="runner-mode-btn-title">Historia</span>
                                        <img src={lockIcon} alt="Bloqueado" className="runner-mode-btn-lock" />
                                    </button>
                                </div>
                            )}
                            {phase === 'ready' && runMode && !biomeSelectOpen && (
                                <>
                                    <button className="runner-mode-back-btn" onClick={() => { setRunMode(null); setBiomeSelectOpen(false); setArcadeSubMode(null); setSelectedBiomeId(null); }}><ArrowLeft size={16} /></button>
                                    <p className="runner-overlay-title">Corre y esquiva</p>
                                    <button
                                        className="runner-start-btn"
                                        onClick={runMode === 'arcade' ? () => { setArcadeSubMode('libre'); resetGame(); } : resetGame}
                                    >Empezar</button>
                                </>
                            )}
                            {phase === 'ready' && runMode === 'arcade' && biomeSelectOpen && (
                                <>
                                    <button className="runner-mode-back-btn" onClick={() => setBiomeSelectOpen(false)}><ArrowLeft size={16} /></button>
                                    <div className="runner-mode-select">
                                        <button className="runner-mode-btn" onClick={() => { setArcadeSubMode('libre'); setBiomeSelectOpen(false); resetGame(); }}>
                                            <span className="runner-mode-btn-title">Modo Libre</span>
                                            <span className="runner-mode-btn-desc">Carrera infinita, sin cambio de escena</span>
                                        </button>
                                        {BIOME_ORDER.map(biomeId => (
                                            <button
                                                key={biomeId}
                                                className="runner-mode-btn"
                                                onClick={() => { setArcadeSubMode('biome'); setSelectedBiomeId(biomeId); setBiomeSelectOpen(false); resetGame(); }}
                                            >
                                                <span className="runner-mode-btn-title">{BIOMES[biomeId].title}</span>
                                                <span className="runner-mode-btn-desc">{BIOMES[biomeId].desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                            {phase === 'gameover' && (
                                <>
                                    <p className="runner-overlay-title">{won ? '¡Has ganado!' : 'Game Over'}</p>
                                    <p className="runner-overlay-score">Puntos: {score}</p>
                                    {runMode === 'arcade' && (
                                        <p className="runner-overlay-score">Rivales vencidos: {rivalsDefeated}</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {checkpointOpen && (
                        <div className="runner-overlay">
                            <p className="runner-overlay-title">¡Meta alcanzada!</p>
                            <p className="runner-overlay-score">Puntos: {score}</p>
                            {lives < MAX_LIVES + bonusLives && (
                                <button className="runner-start-btn runner-start-btn-secondary" onClick={() => setLives(MAX_LIVES + bonusLives)}>
                                    Recargar vida (gratis)
                                </button>
                            )}
                            {lives >= MAX_LIVES + bonusLives && (
                                <button
                                    className="runner-start-btn runner-start-btn-secondary"
                                    onClick={() => { setLives(l => l + 1); setBonusLives(b => b + 1); }}
                                >
                                    Corazón extra
                                </button>
                            )}
                            <div className="runner-action-row">
                                <button className="runner-start-btn" onClick={handleCheckpointContinue}>Continuar</button>
                                <button className="runner-start-btn runner-start-btn-secondary">Reclamar</button>
                            </div>
                        </div>
                    )}
                </div>


                {phase === 'gameover' && (
                    <div className="runner-action-row">
                        <button className="runner-start-btn runner-start-btn-compact" onClick={resetGame}>Reintentar</button>
                        <button className="runner-start-btn runner-start-btn-secondary runner-start-btn-compact" onClick={backToSelect}>Volver</button>
                    </div>
                )}

                {phase === 'playing' && (
                    <div className="runner-action-row">
                        <button className="runner-jump-btn" onPointerDown={jump}>
                            <ArrowUp size={28} color="#2ecc71" />
                        </button>
                        {runMode === 'historia' && (
                            <button className="runner-power-btn" onPointerDown={usePower} disabled={powerCharges <= 0}>
                                {playerPowerObstacleImg && (
                                    <img src={playerPowerObstacleImg} alt="" className="runner-power-btn-img" />
                                )}
                                <span className="runner-power-btn-charges">{powerCharges}</span>
                            </button>
                        )}
                    </div>
                )}

                {phase === 'playing' && (
                    <button className="runner-pause-btn" onClick={() => setPaused(p => !p)}>
                        {paused ? 'REANUDAR' : 'PAUSAR'}
                    </button>
                )}

                {phase === 'playing' && (
                    <div className="runner-hud">
                        <button className="runner-scores-btn" onClick={() => setScoresOpen(true)}><Trophy size={18} /></button>
                        <span className="runner-hud-score">{score}</span>
                        {phase === 'playing' && <span className="runner-hud-tier">T{speedTierDisplay}</span>}
                        {phase === 'playing' && runMode === 'arcade' && (
                            <span className="runner-hud-rivals"><Skull size={13} />{rivalsDefeated}</span>
                        )}
                    </div>
                )}

                {phase === 'ready' && (
                    <div className="runner-dog-select">
                        {DOG_SELECT_DISPLAY_ORDER.map(id => {
                            const elementInfo = ELEMENT_ICON[DogsConfig[id]?.element];
                            const locked = LOCKED_DOG_IDS.includes(id);
                            return (
                                <div key={id} className="runner-dog-select-col">
                                    <button
                                        className={`runner-dog-select-btn dog-rarity-${DogsConfig[id]?.rarity}${selectedDogId === id ? ' runner-dog-select-active' : ''}${locked ? ' runner-dog-select-locked' : ''}`}
                                        onClick={() => !locked && setSelectedDogId(id)}
                                        disabled={locked}
                                    >
                                        <img src={DOG_ICONS[id]} alt={DogsConfig[id]?.name ?? id} className="runner-dog-select-icon" />
                                        {locked ? (
                                            <img src={lockIcon} alt="Bloqueado" className="runner-dog-select-lock" />
                                        ) : elementInfo && (
                                            <span className={`runner-dog-select-element runner-dog-select-element-${DogsConfig[id]?.element}`}>
                                                <elementInfo.Icon size={11} color="#14100c" />
                                            </span>
                                        )}
                                    </button>
                                    <span className="runner-dog-select-name">{DogsConfig[id]?.name ?? id}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {phase === 'ready' && runMode && !biomeSelectOpen && (
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
