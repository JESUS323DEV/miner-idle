import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Trophy, ArrowLeft, Flame, Zap, Droplets, Mountain, Moon, Skull } from 'lucide-react';
import lockIcon from '../../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/lock.webp';
import tavernCoinIcon from '../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp';
import jumpBtnIcon1 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/btn-action/jump-1.webp';
import jumpBtnIcon2 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/btn-action/jump-2.webp';
import chapaIcon from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/chapas.webp';
import lifeHeart0 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/vida-base-0.webp';
import lifeHeart1 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/vida-base-1.webp';
import lifeHeart2 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/vida-base-2.webp';
import lifeHeart3 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/vida-base-3.webp';
import lifeHeart4 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/vida-base-4.webp';
import magicHeartIcon from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/corazon-magico.webp';
import pawFill0 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-0.webp';
import pawFill1 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-1.webp';
import pawFill2 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-2.webp';
import pawFill3 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-3.webp';
import pawFill4 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-4.webp';
import pawFill5 from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-5.webp';
import huesinIcon from '../../assets/ui/icons-hud/hud-principal/huesin-coin.webp';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { playSfx } from '../../game/utils/sfx.js';
import { useLadyRunMusic } from '../../game/hooks/useLadyRunMusic.js';
import { LIBRE_SCENE_MUSIC, MINAS_MUSIC_TRACKS, BG_PRINCIPAL_TRACK } from './runnerMusic.js';
import LadyRunShopModal from './LadyRunShopModal.jsx';

import ladyRun1 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-1.webp';
import ladyJump from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-2.webp';
import gordoRun1 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-1.webp';
import gordoJump from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-2.webp';
import munaRun1 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-1.webp';
import munaJump from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-2.webp';
import munaGameOver from '../../assets/ui/icons-hud/hud-modals/game-run/assets-perros/animations-muna/muna-run-firme.webp';
import druhGameOver from '../../assets/ui/icons-hud/hud-modals/game-run/assets-perros/animations-druh/druh-run-firme.webp';
import gordoGameOver from '../../assets/ui/icons-hud/hud-modals/game-run/assets-perros/animations-gordo/gordo-run-firme.webp';
import ladyGameOver from '../../assets/ui/icons-hud/hud-modals/game-run/assets-perros/animations-lady/lady-run-firme.webp';
import nupitoGameOver from '../../assets/ui/icons-hud/hud-modals/game-run/assets-perros/animations-nupito/nupito-run-firme.webp';
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
import attackAgua from '../../assets/ui/icons-hud/hud-modals/game-run/icons/ataques/perros/agua/atack-agua.webp';
import attackElectrico from '../../assets/ui/icons-hud/hud-modals/game-run/icons/ataques/perros/electrico/ataque-electrico.webp';
import attackBatsBoss from '../../assets/ui/icons-hud/hud-modals/game-run/icons/ataques/enemigos/bats/atack-bats-1.webp';
import tierraObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-tierra2.webp';
import oscuroObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-oscuro2.webp';

import batBoss from '../../assets/ui/icons-enemy/enemy-animation/bats/bat001.webp';
import minaBoss1 from '../../assets/ui/icons-hud/hud-modals/game-run/bosses/bats/new-boss-1.webp';
import minaBoss2 from '../../assets/ui/icons-hud/hud-modals/game-run/bosses/bats/new-boss-2.webp';
import spider001 from '../../assets/ui/icons-enemy/enemy-animation/spider/spider001.webp';
import spider002 from '../../assets/ui/icons-enemy/enemy-animation/spider/spider002.webp';
import spiderBossFinal from '../../assets/ui/icons-enemy/enemy-animation/spider/spider-boss.webp';

import escenarioMina1 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-1.webp';
import escenarioMina2 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-2.webp';
import escenarioMina3 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-3.webp';
import escenarioCiudad1 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-1.webp';
import escenarioCiudad2 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-2.webp';
import escenarioCiudad3 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-3.webp';
import escenarioCiudad4 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-ciudad.webp'; // tambien vale como escenario de Ciudad (skyline)

// Versiones estaticas (ligeras, no animadas) de los fondos de Modo Libre, solo para los fotogramas
// de relleno de la ruleta: los animados pesan 6-15MB cada uno, renderizar 20 copias a la vez del
// animado iba fatal en movil. El fotograma final (el que se queda) SI usa el animado real.
import libreStaticBosque from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/img-fija/libre-bosque-estatica.webp';
import libreStaticCiudad from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/img-fija/libre-ciudad-estatica.webp';
import libreStaticDesierto from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/img-fija/libre-desierto-estatica.webp';
import libreStaticMinas from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/img-fija/libre-minas-estatica.webp';
import libreStaticPradera from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/img-fija/libre-pradera-estatica.webp';
import libreStaticHielo from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/img-fija/libre-hielo-estatica.webp';

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

// Arte de los ataques de fase boss (proyectil dentro del cuadrado con borde). El tuyo, por elemento
// del perro; el del boss, por bioma (es el diseño del propio enemigo, no un icono generico del
// elemento). Los que no tienen arte propio todavia se quedan con el cuadrado vacio.
const ATTACK_PLAYER_ELEMENT_IMGS = {
    agua: attackAgua,
    electrico: attackElectrico,
};
const ATTACK_BOSS_BIOME_IMGS = {
    mina: attackBatsBoss,
};

const DOG_SELECT_ORDER = ['lady', 'gordo', 'muna', 'nupito', 'smoke', 'tokio', 'tuka', 'zeus', 'druh'];

// Bloqueados temporalmente: su ciclo de correr todavia no esta animado (webp autoanimado como el resto),
// se nota mucho mas tosco al lado de los que ya se pasaron. Se desbloquean cuando se animen.
const LOCKED_DOG_IDS = ['smoke', 'zeus', 'tokio'];
const UNLOCKED_DOG_IDS = DOG_SELECT_ORDER.filter(id => !LOCKED_DOG_IDS.includes(id));
// Desbloqueados primero (en su orden habitual), bloqueados al final.
const DOG_SELECT_DISPLAY_ORDER = [...UNLOCKED_DOG_IDS, ...DOG_SELECT_ORDER.filter(id => LOCKED_DOG_IDS.includes(id))];

// De los ya animados (UNLOCKED_DOG_IDS), solo Gordo y Druh son gratis. El resto hay que comprarlo
// con la moneda del juego (ver unlockedDogIds/onUnlockDog, guardado en gameState.ladyRunUnlockedDogs).
const PAID_DOG_IDS = ['lady', 'muna', 'nupito', 'tuka'];
const DOG_UNLOCK_PRICE = { huesin: 10, tavernCoins: 5 };

const DOG_RUN_FRAMES = {
    lady:   [ladyRun1, ladyRun1, ladyRun1, ladyRun1],
    gordo:  [gordoRun1, gordoRun1, gordoRun1, gordoRun1],
    muna:   [munaRun1, munaRun1, munaRun1, munaRun1],
    nupito: [nupitoRun1, nupitoRun1, nupitoRun1, nupitoRun1],
    smoke:  [smokeRun1, smokeRun2, smokeRun3, smokeRun4],
    tokio:  [tokyoRun1, tokyoRun2, tokyoRun3, tokyoRun4],
    tuka:   [tukaRun1, tukaRun1, tukaRun1, tukaRun1],
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
    lady: ladyJump,
    tuka: tukaRun2,
};

// Fila de 3 huecos de vida fijos. Cada tramo de 3 vidas suma una capa nueva encima de los 3 huecos
// (tier 0 = vidas 1-3, tier 1 = vidas 4-6, tier 2 = vidas 7-9...). Anadir mas assets aqui para seguir subiendo.
const LIFE_TIER_ASSETS = [lifeHeart1, lifeHeart2, lifeHeart3, lifeHeart4];
function getLifeSlotAsset(lives, slotIndex) {
    if (lives <= 0) return lifeHeart0;
    const tier = Math.floor((lives - 1) / 3);
    const filledInTier = lives - tier * 3;
    if (slotIndex < filledInTier) return LIFE_TIER_ASSETS[Math.min(tier, LIFE_TIER_ASSETS.length - 1)];
    if (tier > 0) return LIFE_TIER_ASSETS[Math.min(tier - 1, LIFE_TIER_ASSETS.length - 1)];
    return lifeHeart0;
}

// Marcador de progreso de Modo Libre: una pata que se va llenando (0 a 5) cada vez que se cruza
// una recompensa, tope en 5. Al perder, esto luego alimenta una recompensa extra (logica pendiente).
const PAW_FILL_IMAGES = [pawFill0, pawFill1, pawFill2, pawFill3, pawFill4, pawFill5];
const PAW_FILL_MAX = 5;

// Pose especifica al perder (game over), por ahora solo Muna tiene este asset.
const DOG_GAMEOVER_IMG = {
    muna: munaGameOver,
    druh: druhGameOver,
    gordo: gordoGameOver,
    lady: ladyGameOver,
    nupito: nupitoGameOver,
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

// Boss por escenario dentro de cada capitulo de Historia (indice = sceneIndex).
const CHAPTER_BOSS_IMAGES = {
    mina: [minaBoss1, minaBoss1, minaBoss2],
    ciudad: [spider001, spider002, spiderBossFinal],
};
// Elemento fijo del boss segun el capitulo (los 3 bosses del capitulo comparten elemento).
const CHAPTER_BOSS_ELEMENT = {
    mina: 'tierra',
    ciudad: 'electrico',
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
const TAVERN_COIN_TIER_INTERVAL = 4; // modo libre: 1 tavern coin cada 4 tramos, toda la partida
const LIBRE_SCENES = ['bosque', 'ciudad', 'desierto', 'minas', 'pradera', 'hielo']; // fondos disponibles en escenarios-run-libre/, se sortea 1 al empezar

// Modo Libre sin meta final: 3 tramos por fase, cada uno con su recompensa (misma tabla, se repite
// cada fase). Al completar los 3, empieza otra fase con la duracion de sus tramos x1.5 (se sigue
// alargando fase tras fase). Nunca hay pantalla de "victoria", solo se cobra todo lo acumulado al
// perder.
const RUN_BASE_INTERVALS_S = [20, 25, 30]; // duracion de cada tramo dentro de una fase, no acumulado
const RUN_PHASE_TIME_MULTIPLIER = 1.5; // cada fase completa multiplica la duracion de la siguiente
// Posicion de las 3 marcas en la barra, como % del total de la fase: el multiplicador de fase
// afecta a los 3 tramos por igual, asi que la proporcion (y por tanto el % en la barra) no cambia.
const RUN_PHASE_TOTAL_S = RUN_BASE_INTERVALS_S[0] + RUN_BASE_INTERVALS_S[1] + RUN_BASE_INTERVALS_S[2];
const RUN_MARK_PERCENTS = [
    (RUN_BASE_INTERVALS_S[0] / RUN_PHASE_TOTAL_S) * 100,
    ((RUN_BASE_INTERVALS_S[0] + RUN_BASE_INTERVALS_S[1]) / RUN_PHASE_TOTAL_S) * 100,
    100,
];
const RUN_MILESTONE_REWARDS = {
    facil:   [{ tavernCoins: 2 }, { tavernCoins: 3 }, { huesin: 1 }],
    medio:   [{ tavernCoins: 3 }, { tavernCoins: 4 }, { huesin: 2 }],
    dificil: [{ tavernCoins: 4 }, { tavernCoins: 5 }, { huesin: 3 }],
};
const LIBRE_SCENE_LABELS = {
    bosque: 'Bosque',
    ciudad: 'Ciudad Guau guau',
    desierto: 'Desierto',
    minas: 'Minas',
    pradera: 'Pradera',
    hielo: 'Hielo',
};
const LIBRE_SCENE_STATIC_IMGS = {
    bosque: libreStaticBosque,
    ciudad: libreStaticCiudad,
    desierto: libreStaticDesierto,
    minas: libreStaticMinas,
    pradera: libreStaticPradera,
    hielo: libreStaticHielo,
};

// Efecto ruleta al pulsar Empezar en Modo Libre: una tira de escenarios se desliza en horizontal
// (frame a frame, uno sale por la izquierda mientras el siguiente entra por la derecha), frenando
// hacia el final (ease-out) hasta pararse en el escenario real, que se mantiene ROULETTE_SETTLE_MS
// antes de empezar a jugar.
const ROULETTE_STRIP_LENGTH = 20; // frames en la tira (varias vueltas a los 5 escenarios + el final)
const ROULETTE_SPIN_MS = 2600;
const ROULETTE_SETTLE_MS = 1500;

// Cuenta atras (3, 2, 1, ¡Ya!) antes de que arranque cualquier partida: la partida ya esta en
// phase 'playing' pero en pausa hasta que termina, para que no se pueda perder nada antes de tiempo.
const COUNTDOWN_STEP_MS = 700;
const GRAVITY = 2200;
const JUMP_VELOCITY = 780;          // impulso del salto completo / del 2o salto
const JUMP_VELOCITY_SINGLE = 650;   // impulso del 1er salto (solo), mas margen que a media altura
const SPEED_TIERS = [280, 320, 380, 440];
const SPEED_TIER_MS = 5000;
const TRAMO1_DURATION_FACIL_MS = 15000; // en Facil, tramo1 dura 15s en vez de 5s
const TRAMO2_DURATION_FACIL_MS = 10000; // en Facil, tramo2 dura 10s en vez de 5s
const SPEED_RAMP_STEP = 20;   // px/s que se suma cada SPEED_RAMP_MS tras agotar los tramos
const SPEED_RAMP_MS = 10000;
const SPEED_MAX = 700;
const METERS_PER_PX = 25; // escala cosmetica px->metros para el resumen de distancia de Modo Libre, sin relacion fisica real
const SPAWN_MIN_MS = 1100;
const SPAWN_MAX_MS = 1900;
const DOG_X = 10; // pegado a la izquierda (era 40), asi el proyectil recorre mas distancia visible en fase boss
const DOG_SIZE = 64;
// Solo en Modo Libre: tamaño real (visual + colision de peligro) segun el porte de cada perro.
// El margen resta un poco de caja de colision extra sobre el tamaño visual (perdona algo de golpe),
// mayor cuanto mas grande es el perro, para compensar tener mas caja que golpear.
const DOG_SIZE_TIER = {
    nupito: 'small', zeus: 'small',
    lady: 'medium', druh: 'medium',
    gordo: 'large', smoke: 'large', tokio: 'large', tuka: 'large', muna: 'large',
};
const DOG_TIER_VISUAL_SIZE = { small: 48, medium: 56, large: 64 };
const DOG_TIER_HIT_MARGIN = { small: 0, medium: 3, large: 6 };
const OBSTACLE_SIZE = 46;
const OBSTACLE_CLEAR_Y = OBSTACLE_SIZE * 0.75;
const AERIAL_MIN_Y = 85;   // franja de altura peligrosa de los obstaculos aereos
const AERIAL_MAX_Y = 130;
const CHAPA_LEAD_OFFSET_PX = 30; // la chapa del 1er terrestre nace un poco antes que el obstaculo (llega antes al jugador)
const PICKUP_SIZE = 38; // corazon/tavern coin/chapa son un pelin mas pequeños que un obstaculo normal (46)
// Altura real (bottom, en px) a la que se dibuja cada pickup aereo en pantalla -- coincide con el CSS
// (.runner-obstacle-aerial / .runner-obstacle-heart.runner-obstacle-aerial / .runner-obstacle-chapa.runner-obstacle-aerial).
// La colision se calcula contra esta posicion real, no una franja aparte, para que si el perro lo toca
// visualmente siempre cuente (sea con salto simple o doble), igual que la colision del boss.
const COIN_AERIAL_ICON_BOTTOM = 92;
const HEART_AERIAL_ICON_BOTTOM = 110;
const CHAPA_AERIAL_ICON_BOTTOM = 120;
const PICKUP_COLLECT_ANIM_MS = 350; // se paran en el sitio y se encogen/desvanecen al recogerlos
const AERIAL_UNLOCK_TIER = 3; // a partir de este tramo empieza el patron complejo (pareja+aereo+suelto); antes ya hay aereos, pero alternando 1 a 1
const DOUBLE_SOLO_UNLOCK_TIER = 9; // a partir de este tramo, el terrestre "suelto" del patron tambien sale en pareja
// En Dificil el patron complejo (con pareja) empieza mucho antes: desde el primer tramo, no el 3.
const AERIAL_UNLOCK_TIER_DIFICIL = 1;
const DOUBLE_SOLO_UNLOCK_TIER_DIFICIL = 5;
const GROUND_PAIR_GAP_PX = 90; // separacion entre los 2 terrestres cuando salen en pareja
const LANDING_SYNC_DELAY_MS = 800; // tiempo aprox. de un doble salto completo, para que el aereo llegue justo al aterrizar
const HIT_INVULN_MS = 900;
const MAGIC_HEART_INVULN_MS = 5000;
const MAX_LIVES = 3;
const GAME_END_DELAY_MS = 600; // pausa antes de mostrar la pantalla de resultado, para que clicks de mas no toquen el boton nuevo que aparece ahi

const BOSS_MAX_HP = 40;
const BOSS_X_RATIO = 0.65; // posicion del boss como fraccion del ancho de pista, mas a la izquierda para que quepa su tamaño (135px) sin salirse por la derecha
const BOSS_BOTTOM_PX = 20; // debe coincidir con el bottom base de .runner-boss en CSS
const BOSS_ELEVATE_PX = 70; // cuanto sube por encima de su bottom base al esquivar
const BOSS_ELEVATE_SPEED_PX_S = 280; // velocidad real de la subida/bajada (antes era una transition CSS de 0.25s, ahora animada a mano para que la colision use la misma altura que se ve)
// Altura de tu disparo para que cuente como impacto: 2 condiciones independientes (no un margen
// simetrico) para que cada una se pueda ajustar sin robarle rango a la otra. Contra el boss normal,
// techo generoso (cubre de sobra un salto sencillo, ~96px); contra el elevado, suelo que excluye el
// disparo a ras de suelo (0px) pero deja pasar la mayoria de saltos.
const BOSS_HIT_GROUND_MAX_Y = 110;
const BOSS_HIT_ELEVATED_MIN_Y = 40;

// A partir de la mitad de vida, en Facil, el boss alterna elevado/normal para esquivar el proyectil
// terrestre (a ras de suelo); el tuyo lanzado saltando si le sigue dando.
const BOSS_DODGE_TOGGLE_MS = 2000;

// Gesto de aviso antes de disparar: el boss se "carga" (crece + brilla del color de su elemento)
// y el proyectil no sale hasta que termina, para que se pueda anticipar el ataque. Si suelta varios
// disparos seguidos (cargas acumuladas), cada uno de la racha carga mas que el anterior, para que se
// note el ritmo. La racha se corta si pasa un rato sin atacar.
const BOSS_WINDUP_MS = 350;
const BOSS_WINDUP_STREAK_STEP_MS = 250;
const BOSS_ATTACK_STREAK_RESET_MS = 2000;

// Cadencia de ataque del boss, independiente de la que usaba la CPU durante la carrera
const BOSS_ATTACK_MAX_CHARGES = 3;
const BOSS_ATTACK_RECHARGE_MS = 3000;
const BOSS_ATTACK_CHANCE_PER_SEC = 0.4;

// Obstaculos ambientales durante el combate contra el boss (distintos de sus ataques): por ahora
// solo en Facil, del escenario del capitulo, 0-1 terrestre y 0-1 aereo cada BOSS_OBSTACLE_WAVE_MS.
const BOSS_OBSTACLE_WAVE_MS = 5000;

const POWER_PROJECTILE_SPEED = 350; // px/s, propia y fija, no depende del ritmo de la carrera
const ATTACK_SIZE = 28; // ataques de fase boss (placeholder cuadrado), mas pequeño que un obstaculo (46)

// Poder de sabotaje durante la carrera (tuyo y de la CPU): sin cambios de cadencia, solo mas cargas.
const SABOTAGE_MAX_CHARGES = 3;
const SABOTAGE_RECHARGE_MS = 10000;

// Proyectiles en fase boss: sistema propio, separado del sabotaje. Cooldown entre disparos aparte
// de las cargas, para que no se puedan soltar las 4 de golpe.
const PROJECTILE_MAX_CHARGES = 4;
const PROJECTILE_RECHARGE_MS = 5000;
const PROJECTILE_DAMAGE = 5;
const PROJECTILE_COOLDOWN_MS = 1000;

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
const FACIL_HARD_SWITCH_TIER = 10; // en Facil, a partir de este tramo las parejas se comportan como en Dificil (limite natural)
// El regalo de chapas se repite igual en las 3 dificultades: cada 5 tramos (5, 10, 15...).
const CHAPA_BONUS_INTERVAL_TIER = 5;
const getChapaBonusIntervalTier = () => CHAPA_BONUS_INTERVAL_TIER;

// Limite anti-farmeo: solo las 3 primeras partidas (game overs) del dia dan loot normal por dificultad.
// De la 4a en adelante, en vez de reducir el valor de cada chapa/tavern coin (eso se probo y se sentia
// como "moneda fantasma": el icono se veia y se recogia igual, pero a veces no sumaba nada), se reduce
// directamente CUANTAS aparecen: chapas 1-2 al azar (en vez de 3-5 segun dificultad) y tavern coin 0-1 al
// azar por disparo (en vez de 1-3). Lo que sale, sale a su valor completo, sin tirada oculta al recogerlo.
const MAX_FULL_LOOT_RUNS_PER_DAY = 3;

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

// Guarda una partida en curso para que, si se recarga la pagina o se cierra y se vuelve, no se pierda:
// al volver a entrar arranca en PAUSA con la vida/puntuacion/modo tal cual estaban, no se intenta
// recuperar el frame exacto (obstaculos en pantalla), eso no compensa y con pausa no hace falta.
const IN_PROGRESS_KEY = 'ladyRunInProgress';

const loadInProgressRun = () => {
    try {
        const raw = localStorage.getItem(IN_PROGRESS_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const saveInProgressRun = (snapshot) => {
    try {
        localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(snapshot));
    } catch {
        // localStorage no disponible o lleno: no es critico, simplemente no se podra reanudar
    }
};

const clearInProgressRun = () => {
    try {
        localStorage.removeItem(IN_PROGRESS_KEY);
    } catch {
        // nada que hacer si falla el borrado
    }
};

export default function RunnerScreen({
    onClose,
    belowHud = false,
    onEarnTavernCoins,
    onEarnChapas,
    onEarnHuesin,
    chapas = 0,
    tavernCoins = 0,
    huesin = 0,
    pendingHeartsBonus = 0,
    onBuyItem,
    onConsumePendingHearts,
    fullLootRunsByDifficulty,
    onGameOverRun,
    dailyTramosClaimedByDifficulty,
    onClaimDailyTramos,
    bestDistanceByDog,
    onNewDistanceRecord,
    unlockedDogIds = [],
    onUnlockDog,
    magicHearts = 0,
    onUseMagicHeart,
}) {
    const [phase, setPhase] = useState('ready'); // 'ready' | 'playing' | 'gameover'
    const onEarnTavernCoinsRef = useRef(onEarnTavernCoins);
    onEarnTavernCoinsRef.current = onEarnTavernCoins;
    const onEarnChapasRef = useRef(onEarnChapas);
    onEarnChapasRef.current = onEarnChapas;
    const onEarnHuesinRef = useRef(onEarnHuesin);
    onEarnHuesinRef.current = onEarnHuesin;
    const onClaimDailyTramosRef = useRef(onClaimDailyTramos);
    onClaimDailyTramosRef.current = onClaimDailyTramos;
    const onNewDistanceRecordRef = useRef(onNewDistanceRecord);
    onNewDistanceRecordRef.current = onNewDistanceRecord;

    const [stage, setStage] = useState('cpu'); // 'cpu' | 'boss', sub-fase dentro de 'playing'
    const [runMode, setRunMode] = useState(null); // null | 'historia' | 'arcade'
    const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
    const [paused, setPaused] = useState(false);
    const [won, setWon] = useState(false);
    const [selectedDogId, setSelectedDogId] = useState(() => {
        const owned = UNLOCKED_DOG_IDS.filter(id => !PAID_DOG_IDS.includes(id) || unlockedDogIds.includes(id));
        return owned[Math.floor(Math.random() * owned.length)];
    });
    const [cpuDogId, setCpuDogId] = useState('gordo');
    const [difficulty, setDifficulty] = useState('facil');
    const fullLootRunsToday = fullLootRunsByDifficulty?.[difficulty] ?? 0;
    const dailyTramosClaimedToday = dailyTramosClaimedByDifficulty?.[difficulty] ?? 0; // tramos de "meta" ya cobrados hoy en esta dificultad, no vuelven a pagar
    const bestMetersForDog = bestDistanceByDog?.[selectedDogId] ?? 0; // record de distancia guardado para el perro actual
    const [lives, setLives] = useState(MAX_LIVES);
    const [bonusLives, setBonusLives] = useState(0); // corazones extra ganados en checkpoints, se suman al maximo
    const [cpuLives, setCpuLives] = useState(MAX_LIVES);
    const [rivalsDefeated, setRivalsDefeated] = useState(0);
    const [checkpointOpen, setCheckpointOpen] = useState(false);
    const [sceneIndex, setSceneIndex] = useState(0);
    const [libreSceneKey, setLibreSceneKey] = useState(LIBRE_SCENES[0]); // fondo de Modo Libre, se sortea cada partida
    const [rouletteOpen, setRouletteOpen] = useState(false);
    const [rouletteSequence, setRouletteSequence] = useState([]);
    const [rouletteSpinning, setRouletteSpinning] = useState(false);
    const [rouletteSettled, setRouletteSettled] = useState(false);
    const [countdownValue, setCountdownValue] = useState(null); // 3,2,1,0 (0 = "¡Ya!"), null = sin cuenta atras
    const [biomeSelectOpen, setBiomeSelectOpen] = useState(false);
    const [arcadeSubMode, setArcadeSubMode] = useState(null); // null | 'libre' | 'biome' -- solo 'biome' dispara checkpoints
    const [libreMusicTrack, setLibreMusicTrack] = useState(null);
    // Musica de Modo Libre: en las pantallas de seleccion (antes de darle a Empezar) suena
    // bg-principal. Al darle a Empezar se corta (mientras gira la ruleta no suena musica, solo su
    // SFX), y ya jugando suena 1 pista fija por escenario exterior, o minas (unico interior)
    // sorteando entre sus 2 pistas cada vez que se entra ahi.
    useEffect(() => {
        if (phase === 'gameover') { setLibreMusicTrack(null); return; }
        if (phase === 'ready' && !rouletteOpen) { setLibreMusicTrack(BG_PRINCIPAL_TRACK); return; }
        if (arcadeSubMode !== 'libre' || rouletteOpen) { setLibreMusicTrack(null); return; }
        if (libreSceneKey === 'minas') {
            setLibreMusicTrack(MINAS_MUSIC_TRACKS[Math.floor(Math.random() * MINAS_MUSIC_TRACKS.length)]);
        } else {
            setLibreMusicTrack(LIBRE_SCENE_MUSIC[libreSceneKey] ?? null);
        }
    }, [phase, arcadeSubMode, libreSceneKey, rouletteOpen]);
    const musicVolume = (() => {
        const saved = localStorage.getItem('music_volume_ladyrun');
        return saved === null ? 0.06 : parseFloat(saved);
    })();
    useLadyRunMusic(libreMusicTrack, musicVolume);
    const [selectedBiomeId, setSelectedBiomeId] = useState(null); // key de BIOMES cuando arcadeSubMode === 'biome'
    const [score, setScore] = useState(0);
    const [speedTierDisplay, setSpeedTierDisplay] = useState(1);
    const [airborne, setAirborne] = useState(false);
    const [canDoubleJump, setCanDoubleJump] = useState(false); // true tras el 1er salto, hasta usar el 2o o aterrizar
    const [runMilestoneIndex, setRunMilestoneIndex] = useState(-1); // -1 = ninguno, 0/1/2 = tramo alcanzado DENTRO de la fase actual (visual)
    const [pawFill, setPawFill] = useState(0); // 0-5, sube una vez por cada recompensa cruzada en Modo Libre
    const pawFillRef = useRef(0); // espejo de pawFill para leerlo al instante desde el tick loop (evita closure viejo)
    const [runCoinsEarned, setRunCoinsEarned] = useState(0); // totales de ESTA run, solo para mostrar en game over
    const [runHuesinEarned, setRunHuesinEarned] = useState(0);
    const [runChapasEarned, setRunChapasEarned] = useState(0);
    const runTotalMilestonesRef = useRef(0); // total de tramos cruzados en toda la run (todas las fases), para la recompensa
    const runPhaseStartAtRef = useRef(0); // matchTimeRef.current en el que empezo la fase actual
    const runFlagElRef = useRef(null);
    const runTrackCoinsCollectedRef = useRef(0); // coins cogidas en pista, se pagan al perder
    const runChapasCollectedRef = useRef(0); // chapas cogidas en pista, se pagan al perder
    const runDistanceRef = useRef(0); // distancia acumulada esta run (px), solo cosmetico para el resumen final
    const [runMetersEarned, setRunMetersEarned] = useState(0);
    const [runIsNewRecord, setRunIsNewRecord] = useState(false);
    const [runBestMeters, setRunBestMeters] = useState(0);
    const [cpuAirborne, setCpuAirborne] = useState(false);
    const [obstacles, setObstacles] = useState([]); // solo {id, img}, la posicion real vive en refs
    const [attacks, setAttacks] = useState([]); // ataques de fase boss (jugador/boss), separados de los obstaculos de la carrera
    const [frameIdx, setFrameIdx] = useState(0);
    const [hitFlash, setHitFlash] = useState(false);
    const [cpuHitFlash, setCpuHitFlash] = useState(false);
    const [bossHitFlash, setBossHitFlash] = useState(false);
    const [bossWindingUp, setBossWindingUp] = useState(false);
    const [bossWindupDurationMs, setBossWindupDurationMs] = useState(BOSS_WINDUP_MS);
    const [scoresOpen, setScoresOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [chapterSelectOpen, setChapterSelectOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null); // 1 | 2, solo etiqueta por ahora, sin efecto en combate/obstaculos
    const [highScores, setHighScores] = useState(loadHighScores);
    const [powerCharges, setPowerCharges] = useState(SABOTAGE_MAX_CHARGES);
    const [projectileCharges, setProjectileCharges] = useState(PROJECTILE_MAX_CHARGES);
    const [projectileCoolingDown, setProjectileCoolingDown] = useState(false);
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
    const attacksDataRef = useRef([]); // [{id, x, owner: 'player'|'boss', hit, el}], solo fase boss
    const bossObstacleWaveTimerRef = useRef(BOSS_OBSTACLE_WAVE_MS);
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
    const nextTavernCoinAtTierRef = useRef(TAVERN_COIN_TIER_INTERVAL);
    const pendingTavernCoinRef = useRef(false);
    const firstGroundBonusGivenRef = useRef(false); // regalo de chapa en el 1er terrestre/aereo de la partida
    const firstAerialBonusGivenRef = useRef(false);
    const thirdBonusGivenRef = useRef(false); // 3a chapa, un poco mas atras: en el siguiente obstaculo tras las 2 primeras
    const fourthBonusGivenRef = useRef(false); // 4a chapa, Medio y Dificil, un obstaculo mas atras que la 3a
    const fifthBonusGivenRef = useRef(false); // 5a chapa, solo Dificil, un obstaculo mas atras que la 4a
    const chapaExtraSpawnsRef = useRef(0); // cuenta spawns desde que la ground+aerial ya se dieron, para espaciar 3a/4a/5a
    const nextChapaBonusTierRef = useRef(CHAPA_BONUS_INTERVAL_TIER); // proximo tramo en que se re-arma el regalo
    const runIsReducedRef = useRef(false); // se fija al empezar la partida (4a+ game over del dia = loot reducido toda la run)
    const resumedRunRef = useRef(false); // true si esta partida viene de restaurar un guardado de partida en curso
    const chapaSpawnCapRef = useRef(Infinity); // en partida reducida, tope de chapas que pueden llegar a aparecer en toda la run (1 o 2 al azar)
    const chapasSpawnedCountRef = useRef(0); // cuantas chapas han aparecido ya esta run (para respetar el tope)
    const powerChargesRef = useRef(SABOTAGE_MAX_CHARGES);
    const cpuPowerChargesRef = useRef(SABOTAGE_MAX_CHARGES);
    const powerRechargeTimerRef = useRef(SABOTAGE_RECHARGE_MS);
    const cpuPowerRechargeTimerRef = useRef(SABOTAGE_RECHARGE_MS);
    const projectileChargesRef = useRef(PROJECTILE_MAX_CHARGES);
    const projectileRechargeTimerRef = useRef(PROJECTILE_RECHARGE_MS);
    const projectileCooldownUntilRef = useRef(0);
    const pendingPowerForCpuRef = useRef(0);    // poder del jugador, pendiente de aplicar en la pista CPU
    const pendingPowerForPlayerRef = useRef(0); // poder de la CPU, pendiente de aplicar en la pista del jugador
    const endingRef = useRef(false); // true en cuanto se decide el resultado, congela el tick hasta que se muestre la pantalla
    const bossAttackChargesRef = useRef(BOSS_ATTACK_MAX_CHARGES);
    const bossAttackRechargeTimerRef = useRef(BOSS_ATTACK_RECHARGE_MS);
    const bossHpRef = useRef(BOSS_MAX_HP);
    const bossDodgeTimerRef = useRef(BOSS_DODGE_TOGGLE_MS);
    const bossElevatedRef = useRef(false);
    const bossCurrentBottomRef = useRef(BOSS_BOTTOM_PX); // altura real animada, para que la colision use lo mismo que se ve en pantalla
    const bossWindupTimerRef = useRef(0);
    const bossAttackStreakRef = useRef(0);
    const bossLastAttackAtRef = useRef(0);

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

    const setAttackEl = useCallback((id, el) => {
        const found = attacksDataRef.current.find(a => a.id === id);
        if (found) found.el = el;
    }, []);

    const jump = useCallback(() => {
        if (phase !== 'playing' || paused) return;
        if (!isJumpingRef.current) {
            isJumpingRef.current = true;
            doubleJumpUsedRef.current = false;
            velocityRef.current = JUMP_VELOCITY_SINGLE;
            setAirborne(true);
            setCanDoubleJump(true);
        } else if (!doubleJumpUsedRef.current) {
            doubleJumpUsedRef.current = true;
            velocityRef.current = JUMP_VELOCITY;
            setCanDoubleJump(false);
            playSfx('sendRaid', 'sfx_volume_ladyrun');
        }
    }, [phase, paused]);

    const usePower = useCallback(() => {
        if (phase !== 'playing' || paused) return;
        if (stage === 'boss') {
            if (projectileChargesRef.current <= 0) return;
            if (performance.now() < projectileCooldownUntilRef.current) return;
            projectileChargesRef.current -= 1;
            setProjectileCharges(projectileChargesRef.current);
            projectileCooldownUntilRef.current = performance.now() + PROJECTILE_COOLDOWN_MS;
            setProjectileCoolingDown(true);
            setTimeout(() => setProjectileCoolingDown(false), PROJECTILE_COOLDOWN_MS);
            const attack = {
                id: obstacleIdSeq++,
                x: DOG_X + DOG_SIZE,
                y: dogYRef.current,
                owner: 'player',
                element: DogsConfig[selectedDogId]?.element,
                hit: false,
                el: null,
            };
            attacksDataRef.current = [...attacksDataRef.current, attack];
            setAttacks(attacksDataRef.current.map(a => ({ id: a.id, owner: a.owner, element: a.element, aerial: a.aerial })));
        } else {
            if (powerChargesRef.current <= 0) return;
            powerChargesRef.current -= 1;
            setPowerCharges(powerChargesRef.current);
            pendingPowerForCpuRef.current += 1;
            setCpuPowerPending(true);
        }
    }, [phase, paused, stage, selectedDogId]);

    const useMagicHeart = useCallback(() => {
        if (phase !== 'playing' || paused) return;
        if (magicHearts <= 0) return;
        invulnUntilRef.current = performance.now() + MAGIC_HEART_INVULN_MS;
        onUseMagicHeart?.();
    }, [phase, paused, magicHearts, onUseMagicHeart]);

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
        attacksDataRef.current = [];
        bossObstacleWaveTimerRef.current = BOSS_OBSTACLE_WAVE_MS;
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
        nextTavernCoinAtTierRef.current = TAVERN_COIN_TIER_INTERVAL;
        pendingTavernCoinRef.current = false;
        firstGroundBonusGivenRef.current = false;
        firstAerialBonusGivenRef.current = false;
        thirdBonusGivenRef.current = false;
        fourthBonusGivenRef.current = false;
        fifthBonusGivenRef.current = false;
        chapaExtraSpawnsRef.current = 0;
        chapasSpawnedCountRef.current = 0;
        nextChapaBonusTierRef.current = getChapaBonusIntervalTier(difficulty);
        powerChargesRef.current = SABOTAGE_MAX_CHARGES;
        cpuPowerChargesRef.current = SABOTAGE_MAX_CHARGES;
        powerRechargeTimerRef.current = SABOTAGE_RECHARGE_MS;
        cpuPowerRechargeTimerRef.current = SABOTAGE_RECHARGE_MS;
        projectileChargesRef.current = PROJECTILE_MAX_CHARGES;
        projectileRechargeTimerRef.current = PROJECTILE_RECHARGE_MS;
        projectileCooldownUntilRef.current = 0;
        setProjectileCoolingDown(false);
        pendingPowerForCpuRef.current = 0;
        pendingPowerForPlayerRef.current = 0;
        endingRef.current = false;
        bossAttackChargesRef.current = BOSS_ATTACK_MAX_CHARGES;
        bossAttackRechargeTimerRef.current = BOSS_ATTACK_RECHARGE_MS;
        bossHpRef.current = BOSS_MAX_HP;
        bossDodgeTimerRef.current = BOSS_DODGE_TOGGLE_MS;
        bossElevatedRef.current = false;
        bossCurrentBottomRef.current = BOSS_BOTTOM_PX;
        bossWindupTimerRef.current = 0;
        bossAttackStreakRef.current = 0;
        bossLastAttackAtRef.current = 0;
        setBossWindingUp(false);
        setPowerCharges(SABOTAGE_MAX_CHARGES);
        setProjectileCharges(PROJECTILE_MAX_CHARGES);
        setCpuPowerPending(false);
        setPlayerPowerPending(false);
        setObstacles([]);
        setAttacks([]);
        setAirborne(false);
        setCanDoubleJump(false);
        runTotalMilestonesRef.current = 0;
        pawFillRef.current = 0;
        setPawFill(0);
        runPhaseStartAtRef.current = 0;
        runTrackCoinsCollectedRef.current = 0;
        runChapasCollectedRef.current = 0;
        runDistanceRef.current = 0;
        setRunMilestoneIndex(-1);
        setRunCoinsEarned(0);
        setRunHuesinEarned(0);
        setRunChapasEarned(0);
        setRunMetersEarned(0);
        setRunIsNewRecord(false);
        if (runFlagElRef.current) runFlagElRef.current.style.left = '0%';
        setCpuAirborne(false);
        setLives(MAX_LIVES + pendingHeartsBonus);
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
    }, [pendingHeartsBonus, difficulty]);

    const claimRunMilestoneRewards = useCallback((totalCrossed) => {
        const rewards = RUN_MILESTONE_REWARDS[difficulty] ?? RUN_MILESTONE_REWARDS.facil;
        // Solo se pagan los tramos que hoy, en esta dificultad, todavia no se habian cobrado (evita
        // farmear repitiendo runs): si esta run no llega mas lejos que lo ya cobrado hoy, no da nada
        // nuevo, pero tampoco pierde el progreso ya guardado para el siguiente intento.
        let totalCoins = runTrackCoinsCollectedRef.current;
        let totalHuesin = 0;
        for (let i = dailyTramosClaimedToday; i < totalCrossed; i++) {
            const r = rewards[i % 3]; // la tabla de 3 tramos se repite cada fase
            totalCoins += r?.tavernCoins ?? 0;
            totalHuesin += r?.huesin ?? 0;
        }
        let totalChapas = runChapasCollectedRef.current;
        const pawMultiplier = pawFillRef.current >= 2 ? pawFillRef.current : 1;
        if (pawMultiplier > 1) {
            totalCoins *= pawMultiplier;
            totalHuesin *= pawMultiplier;
            totalChapas *= pawMultiplier;
        }
        if (totalCoins > 0) onEarnTavernCoinsRef.current?.(totalCoins);
        if (totalHuesin > 0) onEarnHuesinRef.current?.(totalHuesin);
        if (totalChapas > 0) onEarnChapasRef.current?.(totalChapas);
        if (totalCrossed > dailyTramosClaimedToday) onClaimDailyTramosRef.current?.(difficulty, totalCrossed);
        setRunCoinsEarned(totalCoins);
        setRunHuesinEarned(totalHuesin);
        setRunChapasEarned(totalChapas);
    }, [difficulty, dailyTramosClaimedToday]);

    // Cuenta atras 3-2-1-¡Ya! reutilizable: al terminar, quita la pausa. Se usa tanto al empezar una
    // partida nueva como al reanudar una guardada (boton REANUDAR sobre la card).
    const startCountdown = useCallback(() => {
        setCountdownValue(3);
        let step = 3;
        const countdownTick = () => {
            step -= 1;
            setCountdownValue(step >= 0 ? step : null);
            if (step > -1) {
                setTimeout(countdownTick, COUNTDOWN_STEP_MS);
            } else {
                setPaused(false);
            }
        };
        setTimeout(countdownTick, COUNTDOWN_STEP_MS);
    }, []);

    const resetGame = useCallback((forcedLibreSceneKey) => {
        resetStats();
        const rivalPool = UNLOCKED_DOG_IDS.filter(id => id !== selectedDogId);
        setCpuDogId(rivalPool[Math.floor(Math.random() * rivalPool.length)]);
        setLibreSceneKey(forcedLibreSceneKey ?? LIBRE_SCENES[Math.floor(Math.random() * LIBRE_SCENES.length)]);
        if (pendingHeartsBonus > 0) onConsumePendingHearts?.();
        runIsReducedRef.current = fullLootRunsToday >= MAX_FULL_LOOT_RUNS_PER_DAY;
        chapaSpawnCapRef.current = runIsReducedRef.current ? (1 + Math.floor(Math.random() * 2)) : Infinity;
        setPhase('playing');
        // La partida empieza en pausa (el bucle principal no arranca mientras paused===true) hasta
        // que termina la cuenta atras, para que no se pueda perder una vida antes de estar listo.
        setPaused(true);
        startCountdown();
    }, [resetStats, selectedDogId, pendingHeartsBonus, onConsumePendingHearts, fullLootRunsToday, startCountdown]);

    const startLibreRoulette = useCallback(() => {
        setArcadeSubMode('libre');
        const finalScene = LIBRE_SCENES[Math.floor(Math.random() * LIBRE_SCENES.length)];
        const sequence = Array.from({ length: ROULETTE_STRIP_LENGTH }, (_, i) =>
            i === ROULETTE_STRIP_LENGTH - 1 ? finalScene : LIBRE_SCENES[i % LIBRE_SCENES.length]
        );
        setRouletteSequence(sequence);
        setRouletteSpinning(false);
        setRouletteSettled(false);
        setRouletteOpen(true);
        playSfx('roulette', 'sfx_volume_ladyrun');
        // Doble rAF: deja pintar la tira en su posicion inicial (sin transition) antes de activar
        // el movimiento, si no el navegador puede saltarse la transicion entera.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setRouletteSpinning(true));
        });
        setTimeout(() => {
            setRouletteSettled(true);
            playSfx('selectScene', 'sfx_volume_ladyrun');
        }, ROULETTE_SPIN_MS);
        setTimeout(() => {
            setRouletteOpen(false);
            resetGame(finalScene);
        }, ROULETTE_SPIN_MS + ROULETTE_SETTLE_MS);
    }, [resetGame]);

    const backToSelect = useCallback(() => {
        resetStats();
        setPhase('ready');
        setRunMode(null);
        setBiomeSelectOpen(false);
        setArcadeSubMode(null);
        setSelectedBiomeId(null);
        setChapterSelectOpen(false);
        setSelectedChapter(null);
    }, [resetStats]);

    // "Reclamar" es un label sin logica aun.
    const handleCheckpointContinue = useCallback(() => {
        if (runMode === 'historia') {
            // Siguiente escenario del capitulo: nuevo rival CPU, boss reiniciado, se conserva
            // vida/puntuacion/chapas del jugador (esto NO es un reinicio de partida).
            setSceneIndex(i => i + 1);
            const rivalPool = UNLOCKED_DOG_IDS.filter(id => id !== selectedDogId);
            setCpuDogId(rivalPool[Math.floor(Math.random() * rivalPool.length)]);
            setCpuLives(MAX_LIVES);
            setStage('cpu');
            setBossHp(BOSS_MAX_HP);
            bossHpRef.current = BOSS_MAX_HP;
            bossDodgeTimerRef.current = BOSS_DODGE_TOGGLE_MS;
            bossElevatedRef.current = false;
            bossCurrentBottomRef.current = BOSS_BOTTOM_PX;
            bossWindupTimerRef.current = 0;
            bossAttackStreakRef.current = 0;
            bossLastAttackAtRef.current = 0;
            setBossWindingUp(false);
            projectileChargesRef.current = PROJECTILE_MAX_CHARGES;
            projectileRechargeTimerRef.current = PROJECTILE_RECHARGE_MS;
            projectileCooldownUntilRef.current = 0;
            setProjectileCoolingDown(false);
            setProjectileCharges(PROJECTILE_MAX_CHARGES);
            cpuDogYRef.current = 0;
            cpuVelocityRef.current = 0;
            cpuIsJumpingRef.current = false;
            cpuDoubleJumpUsedRef.current = false;
            cpuJumpAtRef.current = null;
            cpuDoubleJumpAtRef.current = null;
            cpuObstacleSeenAtRef.current = new Map();
            spawnPatternIndexRef.current = 0;
            if (cpuDogElRef.current) cpuDogElRef.current.style.bottom = `${GROUND_VISUAL_OFFSET}px`;
            obstaclesDataRef.current = [];
            setObstacles([]);
            attacksDataRef.current = [];
            setAttacks([]);
            bossObstacleWaveTimerRef.current = BOSS_OBSTACLE_WAVE_MS;
            spawnTimerRef.current = SPAWN_MIN_MS;
            setCheckpointOpen(false);
            return;
        }
        // Arcade/bioma (dormant): pantalla de meta cada CHECKPOINT_INTERVAL_S, encadena los escenarios.
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
    }, [runMode, sceneIndex, selectedBiomeId, selectedDogId, resetStats]);

    // Ultimo escenario del capitulo completado: aqui es donde de verdad se "reclama" (recompensa real
    // sin definir todavia). De momento solo termina la partida como victoria.
    const handleClaimChapter = useCallback(() => {
        setCheckpointOpen(false);
        setWon(true);
        setPhase('gameover');
    }, []);

    // Al montar, si habia una partida en curso guardada (recarga de pagina o cierre y vuelta), la
    // restaura en PAUSA con la vida/puntuacion/modo tal cual estaban, sin arrancar sola.
    useEffect(() => {
        const saved = loadInProgressRun();
        if (!saved) return;
        resumedRunRef.current = true;
        setRunMode(saved.runMode);
        setArcadeSubMode(saved.arcadeSubMode);
        setDifficulty(saved.difficulty);
        setSelectedDogId(saved.selectedDogId);
        setCpuDogId(saved.cpuDogId);
        setLives(saved.lives);
        setScore(saved.score);
        setPhase('playing');
        setPaused(true);
    }, []);

    // Guarda la partida en curso cada vez que cambia la vida o la puntuacion (eventos reales del juego,
    // no cada frame), para poder restaurarla si se recarga la pagina o se cierra y se vuelve.
    useEffect(() => {
        if (phase !== 'playing') return;
        saveInProgressRun({ runMode, arcadeSubMode, difficulty, selectedDogId, cpuDogId, lives, score });
    }, [phase, lives, score, runMode, arcadeSubMode, difficulty, selectedDogId, cpuDogId]);

    // Refleja en la vista previa (pantalla de seleccion) los corazones extra comprados en la tienda,
    // sin necesidad de reiniciar partida para verlo sumado.
    useEffect(() => {
        if (phase === 'ready' && !resumedRunRef.current) setLives(MAX_LIVES + pendingHeartsBonus);
    }, [phase, pendingHeartsBonus]);

    // Guarda la puntuacion al entrar en game over, y cuenta esta partida para el limite diario anti-farmeo
    useEffect(() => {
        if (phase !== 'gameover') return;
        setHighScores(saveHighScore(score, selectedDogId));
        if (arcadeSubMode === 'libre') onGameOverRun?.(difficulty);
        clearInProgressRun();
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

            // Modo Libre: barra de progreso de la fase actual (por tiempo jugado) + tramos de recompensa.
            // Sin meta final: al completar los 3 tramos de una fase, empieza otra con tramos x1.5 mas
            // largos, indefinidamente. Solo se cobra todo lo acumulado al perder (ver mas abajo).
            if (arcadeSubMode === 'libre') {
                const tramoInPhase = runTotalMilestonesRef.current % 3;
                const phaseIndex = Math.floor(runTotalMilestonesRef.current / 3);
                const phaseMult = RUN_PHASE_TIME_MULTIPLIER ** phaseIndex;
                const phaseDurations = RUN_BASE_INTERVALS_S.map(s => s * phaseMult);
                const phaseTotal = phaseDurations[0] + phaseDurations[1] + phaseDurations[2];

                if (runFlagElRef.current) {
                    const elapsedInPhase = matchTimeRef.current - runPhaseStartAtRef.current;
                    const progress = Math.min(1, Math.max(0, elapsedInPhase / phaseTotal));
                    runFlagElRef.current.style.left = `${progress * 100}%`;
                }

                let nextMilestoneAt = runPhaseStartAtRef.current;
                for (let i = 0; i <= tramoInPhase; i++) nextMilestoneAt += phaseDurations[i];
                if (matchTimeRef.current >= nextMilestoneAt) {
                    if (runTotalMilestonesRef.current >= dailyTramosClaimedToday) {
                        pawFillRef.current = Math.min(PAW_FILL_MAX, pawFillRef.current + 1);
                        setPawFill(pawFillRef.current);
                    }
                    runTotalMilestonesRef.current += 1;
                    setRunMilestoneIndex(tramoInPhase);
                    if (tramoInPhase === 2) {
                        // Fase completa: el avance de fase es SINCRONO (si no, el siguiente tick calcula
                        // con el tiempo de la fase vieja y el tramo de la nueva, y cruza varios de golpe).
                        // Solo el reset VISUAL del marcador se retrasa, para que se vea el 3er tramo un instante.
                        runPhaseStartAtRef.current += phaseTotal;
                        setTimeout(() => {
                            setRunMilestoneIndex(-1);
                        }, 500);
                    }
                }
            }

            if (arcadeSubMode === 'biome' && matchTimeRef.current >= nextCheckpointAtRef.current) {
                setCheckpointOpen(true);
                return;
            }

            const matchTimeMs = matchTimeRef.current * 1000;
            // En Facil, tramo1 y tramo2 duran mas (15s y 10s) para dar mas margen al empezar.
            // En Medio y Dificil, tramo2 y tramo3 duran mas (10s en vez de 5s) para que salgan mas
            // obstaculos ahi (el ritmo de spawn es por tiempo, no por tramo, asi que alargar la ventana
            // ya los aumenta solo, sin tocar el patron ni el timing entre obstaculos).
            const tramoDurationsMs = difficulty === 'facil'
                ? [TRAMO1_DURATION_FACIL_MS, TRAMO2_DURATION_FACIL_MS, SPEED_TIER_MS]
                : [SPEED_TIER_MS, SPEED_TIER_MS * 2, SPEED_TIER_MS * 2];
            const rampStartMs = (SPEED_TIERS.length - 1) * SPEED_TIER_MS;
            let currentSpeed;
            let tierNumber;
            let cumulativeMs = 0;
            let matchedTramo = false;
            for (let i = 0; i < tramoDurationsMs.length; i++) {
                cumulativeMs += tramoDurationsMs[i];
                if (matchTimeMs < cumulativeMs) {
                    currentSpeed = SPEED_TIERS[i];
                    tierNumber = i + 1;
                    matchedTramo = true;
                    break;
                }
            }
            if (!matchedTramo) {
                const shiftedMs = matchTimeMs - cumulativeMs + rampStartMs;
                const rampSteps = Math.floor((shiftedMs - rampStartMs) / SPEED_RAMP_MS);
                currentSpeed = Math.min(SPEED_MAX, SPEED_TIERS[SPEED_TIERS.length - 1] + rampSteps * SPEED_RAMP_STEP);
                tierNumber = SPEED_TIERS.length + 1 + rampSteps;
            }
            if (tierNumber !== speedTierShownRef.current) {
                speedTierShownRef.current = tierNumber;
                setSpeedTierDisplay(tierNumber);
            }
            runDistanceRef.current += currentSpeed * dt;

            // Modo Libre: 1 tavern coin cada TAVERN_COIN_TIER_INTERVAL tramos, toda la partida. Igual que
            // el corazon, no se genera suelto: se marca pendiente y se engancha al proximo obstaculo real.
            if (arcadeSubMode === 'libre' && tierNumber >= nextTavernCoinAtTierRef.current) {
                nextTavernCoinAtTierRef.current += TAVERN_COIN_TIER_INTERVAL;
                pendingTavernCoinRef.current = true;
            }

            // El regalo de chapas se repite en las 3 dificultades: cada 10 tramos en Facil, cada 5 en
            // Medio/Dificil, durante toda la partida (no solo al principio).
            if (arcadeSubMode === 'libre' && tierNumber >= nextChapaBonusTierRef.current) {
                nextChapaBonusTierRef.current += getChapaBonusIntervalTier(difficulty);
                firstGroundBonusGivenRef.current = false;
                firstAerialBonusGivenRef.current = false;
                thirdBonusGivenRef.current = false;
                fourthBonusGivenRef.current = false;
                fifthBonusGivenRef.current = false;
                chapaExtraSpawnsRef.current = 0;
            }

            // Recarga de cargas de poder (jugador y CPU, independiente cada una)
            powerRechargeTimerRef.current -= dt * 1000;
            if (powerRechargeTimerRef.current <= 0) {
                powerRechargeTimerRef.current = SABOTAGE_RECHARGE_MS;
                if (powerChargesRef.current < SABOTAGE_MAX_CHARGES) {
                    powerChargesRef.current += 1;
                    setPowerCharges(powerChargesRef.current);
                }
            }
            projectileRechargeTimerRef.current -= dt * 1000;
            if (projectileRechargeTimerRef.current <= 0) {
                projectileRechargeTimerRef.current = PROJECTILE_RECHARGE_MS;
                if (projectileChargesRef.current < PROJECTILE_MAX_CHARGES) {
                    projectileChargesRef.current += 1;
                    setProjectileCharges(projectileChargesRef.current);
                }
            }
            if (runMode === 'historia') {
                if (stage === 'cpu') {
                    // La CPU decide sola cuando sabotearte durante la carrera: al azar, mas probable desde tramo 3
                    cpuPowerRechargeTimerRef.current -= dt * 1000;
                    if (cpuPowerRechargeTimerRef.current <= 0) {
                        cpuPowerRechargeTimerRef.current = SABOTAGE_RECHARGE_MS;
                        if (cpuPowerChargesRef.current < SABOTAGE_MAX_CHARGES) {
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
                    if (bossWindupTimerRef.current <= 0 && bossAttackChargesRef.current > 0 && Math.random() < BOSS_ATTACK_CHANCE_PER_SEC * dt) {
                        bossAttackChargesRef.current -= 1;
                        if (now - bossLastAttackAtRef.current > BOSS_ATTACK_STREAK_RESET_MS) {
                            bossAttackStreakRef.current = 0;
                        }
                        const windupMs = BOSS_WINDUP_MS + bossAttackStreakRef.current * BOSS_WINDUP_STREAK_STEP_MS;
                        bossWindupTimerRef.current = windupMs;
                        bossAttackStreakRef.current += 1;
                        bossLastAttackAtRef.current = now;
                        setBossWindupDurationMs(windupMs);
                        setBossWindingUp(true);
                    }
                }
            }

            // Gesto de aviso: hasta que no termina, el ataque decidido arriba no llega a dispararse.
            if (stage === 'boss' && bossWindupTimerRef.current > 0) {
                bossWindupTimerRef.current -= dt * 1000;
                if (bossWindupTimerRef.current <= 0) {
                    bossWindupTimerRef.current = 0;
                    setBossWindingUp(false);
                    pendingPowerForPlayerRef.current += 1;
                    setPlayerPowerPending(true);
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
            if (justLanded) { setAirborne(false); setCanDoubleJump(false); }

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

            // El ataque del boss es un ataque propio, disparado al momento (sin esperar a ningun spawn
            // base), separado del sistema de obstaculos.
            if (stage === 'boss' && pendingPowerForPlayerRef.current > 0) {
                pendingPowerForPlayerRef.current -= 1;
                attacksDataRef.current = [...attacksDataRef.current, {
                    id: obstacleIdSeq++,
                    x: trackWidth,
                    owner: 'boss',
                    aerial: bossElevatedRef.current,
                    element: CHAPTER_BOSS_ELEMENT[selectedBiomeId],
                    hit: false,
                    el: null,
                }];
                setAttacks(attacksDataRef.current.map(a => ({ id: a.id, owner: a.owner, element: a.element, aerial: a.aerial })));
                setPlayerPowerPending(false);
            }

            // Obstaculos ambientales del combate (distintos de los ataques del boss): por ahora solo en
            // Facil, del escenario del capitulo, 0-1 terrestre y 0-1 aereo cada BOSS_OBSTACLE_WAVE_MS.
            if (stage === 'boss' && difficulty === 'facil') {
                bossObstacleWaveTimerRef.current -= dt * 1000;
                if (bossObstacleWaveTimerRef.current <= 0) {
                    bossObstacleWaveTimerRef.current = BOSS_OBSTACLE_WAVE_MS;
                    const isChapterCiudad = selectedBiomeId === 'ciudad';
                    const bossGroundPool = isChapterCiudad ? GROUND_OBSTACLE_IMGS_CIUDAD : GROUND_OBSTACLE_IMGS_MINA;
                    const bossAerialPool = isChapterCiudad ? AERIAL_OBSTACLE_IMGS_CIUDAD : AERIAL_OBSTACLE_IMGS_MINA_CUEVAS;
                    const makeWaveObstacle = (aerial, pool) => ({
                        id: obstacleIdSeq++,
                        x: trackWidth,
                        img: pool[Math.floor(Math.random() * pool.length)],
                        aerial,
                        lane: 'player',
                        size: OBSTACLE_SIZE,
                        clearY: OBSTACLE_CLEAR_Y,
                        hit: false,
                        cpuHit: false,
                        el: null,
                        cpuEl: null,
                    });
                    // Nunca terrestre y aereo a la vez: como mucho 1 de los 2 por oleada.
                    if (Math.random() < 0.5) {
                        const aerial = Math.random() < 0.5;
                        list = [...list, makeWaveObstacle(aerial, aerial ? bossAerialPool : bossGroundPool)];
                        spawned = true;
                    }
                }
            }

            spawnTimerRef.current -= dt * 1000;
            if (stage === 'cpu' && spawnTimerRef.current <= 0) {
                spawnTimerRef.current = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
                const tierNow = speedTierShownRef.current;
                const aerialUnlockTier = difficulty === 'dificil' ? AERIAL_UNLOCK_TIER_DIFICIL : AERIAL_UNLOCK_TIER;
                const doubleSoloUnlockTier = difficulty === 'dificil' ? DOUBLE_SOLO_UNLOCK_TIER_DIFICIL : DOUBLE_SOLO_UNLOCK_TIER;
                let aerial = false;
                let isPair = false;
                if (tierNow >= aerialUnlockTier) {
                    // Facil/Medio desde tramo 3, Dificil desde el tramo 1: pareja terrestre -> aereo -> terrestre suelto (repite)
                    // Facil/Medio desde tramo 9, Dificil desde tramo 5: el terrestre "suelto" tambien sale en pareja
                    const pattern = spawnPatternIndexRef.current % 3;
                    aerial = pattern === 1;
                    const wouldBePair = pattern === 0 || (pattern === 2 && tierNow >= doubleSoloUnlockTier);
                    // Dificultad del jugador: en Facil nunca hay pareja, en Medio sale rara vez,
                    // en Dificil es el comportamiento de siempre (fijo segun el patron). Limite natural:
                    // en Facil, a partir de FACIL_HARD_SWITCH_TIER se comporta como Dificil, para que no
                    // se pueda alargar la partida indefinidamente farmeando moneda sin riesgo real.
                    if (difficulty === 'facil' && tierNow < FACIL_HARD_SWITCH_TIER) {
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
                    return {
                        id: obstacleIdSeq++,
                        x,
                        img: element && ELEMENT_POWER_OBSTACLE_IMGS[element]
                            ? ELEMENT_POWER_OBSTACLE_IMGS[element]
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
                if (arcadeSubMode === 'libre' && !aerial && !firstGroundBonusGivenRef.current && chapasSpawnedCountRef.current < chapaSpawnCapRef.current) {
                    firstGroundBonusGivenRef.current = true;
                    chapasSpawnedCountRef.current += 1;
                    // Regalo unico de chapas en el 1er terrestre de la partida: nace un poco antes que el
                    // obstaculo (a su izquierda, llega antes al jugador) y arriba, como enseñando a saltar.
                    // + GROUND_PAIR_GAP_PX * (groupCount - 1): mismo hueco que coin/heart/poderes, para
                    // no coincidir si algo mas se dispara en este mismo spawn (por defecto no mueve nada).
                    list.push({
                        id: obstacleIdSeq++,
                        x: trackWidth - CHAPA_LEAD_OFFSET_PX + GROUND_PAIR_GAP_PX * (groupCount - 1),
                        img: chapaIcon,
                        isChapa: true,
                        aerial: true,
                        lane: 'player',
                        size: PICKUP_SIZE,
                        clearY: PICKUP_SIZE * 0.75,
                        hit: false,
                        cpuHit: false,
                        el: null,
                        cpuEl: null,
                    });
                    groupCount += 1;
                }
                if (arcadeSubMode === 'libre' && aerial && !firstAerialBonusGivenRef.current && chapasSpawnedCountRef.current < chapaSpawnCapRef.current) {
                    firstAerialBonusGivenRef.current = true;
                    chapasSpawnedCountRef.current += 1;
                    // Regalo unico de chapas en el 1er aereo de la partida, abajo (se coge sin saltar).
                    list.push({
                        id: obstacleIdSeq++,
                        x: trackWidth + GROUND_PAIR_GAP_PX * (groupCount - 1),
                        img: chapaIcon,
                        isChapa: true,
                        aerial: false,
                        lane: 'player',
                        size: PICKUP_SIZE,
                        clearY: PICKUP_SIZE * 0.75,
                        hit: false,
                        cpuHit: false,
                        el: null,
                        cpuEl: null,
                    });
                    groupCount += 1;
                }
                // 3a chapa (Facil/Medio/Dificil), 4a (Medio y Dificil) y 5a (solo Dificil): se cuentan los
                // spawns que pasan DESPUES de tener ya la de terrestre y la de aereo, para separarlas bien
                // entre si. 3a = 2 spawns despues (obstaculo nº4). 4a = 3 spawns despues (nº5). 5a = 4 spawns despues (nº6).
                const pushChapaBonus = () => {
                    chapasSpawnedCountRef.current += 1;
                    list.push({
                        id: obstacleIdSeq++,
                        x: trackWidth + CHAPA_LEAD_OFFSET_PX + GROUND_PAIR_GAP_PX * (groupCount - 1),
                        img: chapaIcon,
                        isChapa: true,
                        aerial: !aerial,
                        lane: 'player',
                        size: PICKUP_SIZE,
                        clearY: PICKUP_SIZE * 0.75,
                        hit: false,
                        cpuHit: false,
                        el: null,
                        cpuEl: null,
                    });
                    groupCount += 1;
                };
                const chapaBonusPending =
                    (!thirdBonusGivenRef.current
                        || ((difficulty === 'medio' || difficulty === 'dificil') && !fourthBonusGivenRef.current)
                        || (difficulty === 'dificil' && !fifthBonusGivenRef.current))
                    && chapasSpawnedCountRef.current < chapaSpawnCapRef.current;
                if (arcadeSubMode === 'libre' && firstGroundBonusGivenRef.current && firstAerialBonusGivenRef.current && chapaBonusPending) {
                    chapaExtraSpawnsRef.current += 1;
                    if (chapaExtraSpawnsRef.current === 2 && !thirdBonusGivenRef.current) {
                        thirdBonusGivenRef.current = true;
                        pushChapaBonus();
                    } else if ((difficulty === 'medio' || difficulty === 'dificil') && chapaExtraSpawnsRef.current === 3 && !fourthBonusGivenRef.current) {
                        fourthBonusGivenRef.current = true;
                        pushChapaBonus();
                    } else if (difficulty === 'dificil' && chapaExtraSpawnsRef.current === 4 && !fifthBonusGivenRef.current) {
                        fifthBonusGivenRef.current = true;
                        pushChapaBonus();
                    }
                }
                if (arcadeSubMode === 'libre' && pendingHeartRef.current) {
                    pendingHeartRef.current = false;
                    // Exige la accion CONTRARIA a la que hace falta para esquivar el obstaculo real que
                    // acompaña: si el obstaculo es terrestre, el corazon solo se coge saltando (arriba);
                    // si es aereo, se coge quedandose abajo. Asi solo se recoge esquivando bien, no aparte.
                    // x separado con el mismo hueco (GROUND_PAIR_GAP_PX * groupCount) que usan monedas/poderes,
                    // para que nunca coincida con otro regalo que se dispare en el mismo spawn.
                    list.push({
                        id: obstacleIdSeq++,
                        x: trackWidth + GROUND_PAIR_GAP_PX * groupCount,
                        img: null,
                        isHeart: true,
                        aerial: !aerial,
                        lane: 'player',
                        size: PICKUP_SIZE,
                        clearY: PICKUP_SIZE * 0.75,
                        hit: false,
                        cpuHit: false,
                        el: null,
                        cpuEl: null,
                    });
                    groupCount += 1;
                }
                if (isPair) {
                    list.push(makeObstacle(trackWidth + GROUND_PAIR_GAP_PX));
                    groupCount += 1;
                }
                // Poderes: inyectan un extra terrestre. Hacia el carril CPU solo mientras siga en pie
                // (ya no hay a quien sabotear en fase boss); hacia tu carril sigue activo en las 2 fases
                // (en boss es el ataque del boss, con el elemento fijo del capitulo).
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
                if (arcadeSubMode === 'libre' && pendingTavernCoinRef.current) {
                    pendingTavernCoinRef.current = false;
                    // 1 en Facil, 2 en Medio, 3 en Dificil. En partida reducida, 0 o 1 al azar en vez de eso
                    // (no hay tirada de valor: la que sale, si sale, vale su valor completo).
                    // Cada una separada en X de cualquier obstaculo real de este spawn (mismo hueco que usan
                    // las parejas/inyecciones de poder), para que nunca coincida con un obstaculo peligroso.
                    const tavernCoinCount = runIsReducedRef.current
                        ? (Math.random() < 0.5 ? 0 : 1)
                        : (difficulty === 'dificil' ? 3 : difficulty === 'medio' ? 2 : 1);
                    for (let i = 0; i < tavernCoinCount; i++) {
                        list.push({
                            id: obstacleIdSeq++,
                            x: trackWidth + GROUND_PAIR_GAP_PX * groupCount,
                            img: tavernCoinIcon,
                            isCoin: true,
                            aerial: Math.random() < 0.5,
                            lane: 'player',
                            size: PICKUP_SIZE,
                            clearY: PICKUP_SIZE * 0.75,
                            hit: false,
                            cpuHit: false,
                            el: null,
                            cpuEl: null,
                        });
                        groupCount += 1;
                    }
                }
                if (groupCount >= 2) {
                    spawnTimerRef.current = LANDING_SYNC_DELAY_MS;
                }
                spawned = true;
            }

            const beforeLen = list.length;
            const isPickup = o => o.isHeart || o.isCoin || o.isChapa;
            list.forEach(o => {
                // Un recogible ya cogido se para en el sitio (deja de moverse con el scroll) mientras
                // dura su animacion de encogerse/desvanecerse.
                if (!(o.hit && isPickup(o))) o.x -= currentSpeed * dt;
            });
            list = list.filter(o => {
                if (o.hit && isPickup(o)) return now - (o.collectedAt ?? now) < PICKUP_COLLECT_ANIM_MS;
                return o.x > -o.size;
            });
            const despawned = list.length !== beforeLen;

            // Ataques de fase boss: proyectiles propios (tuyo y del boss), separados del sistema de
            // obstaculos de la carrera, con su propia velocidad fija. El tuyo nace junto a ti y avanza
            // hacia la derecha (hacia el boss); el del boss nace a la derecha y avanza hacia la izquierda
            // (hacia ti). Misma velocidad fija para ambos, sin depender del ritmo de la carrera.
            let atkList = attacksDataRef.current;
            const atkBeforeLen = atkList.length;
            atkList.forEach(a => {
                a.x += (a.owner === 'player' ? POWER_PROJECTILE_SPEED : -POWER_PROJECTILE_SPEED) * dt;
            });
            atkList = atkList.filter(a => !a.hit && a.x > -ATTACK_SIZE && a.x < trackWidth + ATTACK_SIZE);
            const atkDespawned = atkList.length !== atkBeforeLen;

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

            // Solape real perro-icono para pickups aereos: caja del perro (altura real en pantalla)
            // contra la caja del icono (su bottom real en CSS + su tamaño), no una franja aparte.
            const dogBottomReal = dogYRef.current + GROUND_VISUAL_OFFSET;
            const dogTopReal = dogBottomReal + DOG_SIZE;
            const touchesAerialIcon = (iconBottom) => dogTopReal > iconBottom && dogBottomReal < iconBottom + PICKUP_SIZE;

            // Recogida de corazones: independiente de la invulnerabilidad por golpe, se puede coger
            // aunque acabes de perder una vida.
            let heartCollected = false;
            for (const o of list) {
                if (!o.isHeart || o.hit) continue;
                const overlapX = DOG_X < o.x + o.size && DOG_X + DOG_SIZE > o.x;
                if (!overlapX) continue;
                const inHeartZone = o.aerial
                    ? touchesAerialIcon(HEART_AERIAL_ICON_BOTTOM)
                    : (dogYRef.current < o.clearY);
                if (inHeartZone) {
                    o.hit = true;
                    o.collectedAt = now;
                    heartCollected = true;
                }
            }
            if (heartCollected) {
                setLives(l => l + 1);
                playSfx('heal', 'sfx_volume_ladyrun');
            }

            // Recogida de tavern coins: mismo criterio, independiente de la invulnerabilidad.
            let coinsCollected = 0;
            for (const o of list) {
                if (!o.isCoin || o.hit) continue;
                const overlapX = DOG_X < o.x + o.size && DOG_X + DOG_SIZE > o.x;
                if (!overlapX) continue;
                const inCoinZone = o.aerial
                    ? touchesAerialIcon(COIN_AERIAL_ICON_BOTTOM)
                    : (dogYRef.current < o.clearY);
                if (inCoinZone) {
                    o.hit = true;
                    o.collectedAt = now;
                    coinsCollected += 1;
                }
            }
            if (coinsCollected > 0) {
                if (arcadeSubMode === 'libre') runTrackCoinsCollectedRef.current += coinsCollected;
                else onEarnTavernCoinsRef.current?.(coinsCollected);
                playSfx('rewardShards', 'sfx_volume_ladyrun');
            }

            // Recogida del regalo de chapas (1er terrestre/aereo de la partida).
            let chapasCollected = 0;
            for (const o of list) {
                if (!o.isChapa || o.hit) continue;
                const overlapX = DOG_X < o.x + o.size && DOG_X + DOG_SIZE > o.x;
                if (!overlapX) continue;
                const inChapaZone = o.aerial
                    ? touchesAerialIcon(CHAPA_AERIAL_ICON_BOTTOM)
                    : (dogYRef.current < o.clearY);
                if (inChapaZone) {
                    o.hit = true;
                    o.collectedAt = now;
                    chapasCollected += 1;
                }
            }
            if (chapasCollected > 0) {
                runChapasCollectedRef.current += chapasCollected;
                setRunChapasEarned(c => c + chapasCollected);
                playSfx('rewardGold', 'sfx_volume_ladyrun');
            }

            // Colision jugador. Tamaño de la caja de golpe: en Modo Libre depende del porte del
            // perro (pequeño/mediano/grande), con margen de tolerancia restado para medianos/grandes.
            const dogHitTier = DOG_SIZE_TIER[selectedDogId] ?? 'medium';
            const dogHitSize = arcadeSubMode === 'libre'
                ? DOG_TIER_VISUAL_SIZE[dogHitTier] - DOG_TIER_HIT_MARGIN[dogHitTier]
                : DOG_SIZE;
            const invuln = now < invulnUntilRef.current;
            let lifeLost = false;
            if (!invuln) {
                for (const o of list) {
                    if (o.hit || o.lane === 'cpu' || o.isHeart || o.isCoin || o.isChapa) continue;
                    const overlapX = DOG_X < o.x + o.size && DOG_X + dogHitSize > o.x;
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
                // Ataque del boss: si nacio con el elevado, es aereo (peligroso saltando, como un
                // obstaculo aereo); si no, es terrestre (peligroso sin saltar), como cualquier otro.
                if (!lifeLost && stage === 'boss') {
                    for (const a of atkList) {
                        if (a.hit || a.owner !== 'boss') continue;
                        const overlapX = DOG_X < a.x + ATTACK_SIZE && DOG_X + DOG_SIZE > a.x;
                        if (!overlapX) continue;
                        const dangerous = a.aerial
                            ? (dogYRef.current > AERIAL_MIN_Y && dogYRef.current < AERIAL_MAX_Y)
                            : (dogYRef.current < OBSTACLE_CLEAR_Y);
                        if (dangerous) {
                            a.hit = true;
                            lifeLost = true;
                            break;
                        }
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

            // A partir de mitad de vida, en Facil, el boss alterna elevado/normal para esquivar el
            // proyectil terrestre (el saltando si le sigue dando).
            if (stage === 'boss' && difficulty === 'facil' && bossHpRef.current <= BOSS_MAX_HP / 2) {
                bossDodgeTimerRef.current -= dt * 1000;
                if (bossDodgeTimerRef.current <= 0) {
                    bossDodgeTimerRef.current = BOSS_DODGE_TOGGLE_MS;
                    bossElevatedRef.current = !bossElevatedRef.current;
                }
            }

            // Colision con el boss: cualquier ataque tuyo que llegue a su posicion le resta vida, pero
            // solo si tu altura tiene sentido para donde esta ahora mismo (normal o elevado), con 2
            // condiciones independientes en vez de un margen simetrico (ver BOSS_HIT_GROUND_MAX_Y /
            // BOSS_HIT_ELEVATED_MIN_Y).
            let bossHit = false;
            if (stage === 'boss') {
                const bossX = trackWidth * BOSS_X_RATIO;
                const bossTargetBottom = BOSS_BOTTOM_PX + (bossElevatedRef.current ? BOSS_ELEVATE_PX : 0);
                const bossBottomDiff = bossTargetBottom - bossCurrentBottomRef.current;
                const bossBottomStep = BOSS_ELEVATE_SPEED_PX_S * dt;
                if (Math.abs(bossBottomDiff) <= bossBottomStep) {
                    bossCurrentBottomRef.current = bossTargetBottom;
                } else {
                    bossCurrentBottomRef.current += Math.sign(bossBottomDiff) * bossBottomStep;
                }
                const bossBottom = bossCurrentBottomRef.current;
                if (bossElRef.current) {
                    bossElRef.current.style.left = `${bossX}px`;
                    bossElRef.current.style.bottom = `${bossBottom}px`;
                }
                // Que cuente como "elevado" o "normal" depende de donde esta AHORA mismo en pantalla
                // (bossBottom, ya animado), no del flag de destino: asi a mitad de la subida/bajada la
                // colision usa lo mismo que se ve, no adelanta el resultado final antes de tiempo.
                const bossIsCloseToElevated = bossBottom > (BOSS_BOTTOM_PX + BOSS_ELEVATE_PX) / 2;
                for (const a of atkList) {
                    if (a.owner !== 'player' || a.hit) continue;
                    if (a.x >= bossX) {
                        a.hit = true;
                        const heightOk = bossIsCloseToElevated ? a.y >= BOSS_HIT_ELEVATED_MIN_Y : a.y <= BOSS_HIT_GROUND_MAX_Y;
                        if (heightOk) bossHit = true;
                    }
                }
            }

            list.forEach(o => {
                if (o.el) o.el.style.left = `${o.x}px`;
                if (o.cpuEl) o.cpuEl.style.left = `${o.x}px`;
            });
            obstaclesDataRef.current = list;
            if (spawned || despawned || heartCollected || coinsCollected > 0 || chapasCollected > 0) {
                setObstacles(list.map(o => ({ id: o.id, img: o.img, aerial: o.aerial, lane: o.lane, isHeart: o.isHeart, isCoin: o.isCoin, isChapa: o.isChapa, hit: o.hit })));
            }

            atkList.forEach(a => {
                if (!a.el) return;
                a.el.style.left = `${a.x}px`;
                // El tuyo nace a la altura a la que estabas al usar el poder (si saltabas, sale desde
                // arriba); el del boss se queda a su altura fija de siempre (ver CSS).
                if (a.owner === 'player') a.el.style.bottom = `${a.y + GROUND_VISUAL_OFFSET}px`;
            });
            attacksDataRef.current = atkList;
            if (atkDespawned || bossHit || lifeLost) {
                setAttacks(atkList.map(a => ({ id: a.id, owner: a.owner, element: a.element, aerial: a.aerial })));
            }

            if (bossHit) {
                setBossHitFlash(true);
                setTimeout(() => setBossHitFlash(false), 200);
                setBossHp(prev => {
                    const next = Math.max(0, prev - PROJECTILE_DAMAGE);
                    bossHpRef.current = next;
                    if (next <= 0 && !endingRef.current) {
                        endingRef.current = true;
                        if (runMode === 'historia' && selectedBiomeId) {
                            // Historia con capitulo: SIEMPRE checkpoint al vencer al boss, tanto entre
                            // escenarios (solo "Continuar") como en el ultimo (solo "Reclamar" ahi).
                            setTimeout(() => { setCheckpointOpen(true); endingRef.current = false; }, GAME_END_DELAY_MS);
                        } else {
                            // Historia sin capitulo (no deberia pasar ya, pero por si acaso): victoria real.
                            setTimeout(() => { setWon(true); setPhase('gameover'); }, GAME_END_DELAY_MS);
                        }
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
                playSfx('hitPlayer', 'sfx_volume_ladyrun');
                setLives(prev => {
                    const next = prev - 1;
                    if (next <= 0 && !endingRef.current) {
                        endingRef.current = true;
                        setTimeout(() => {
                            if (arcadeSubMode === 'libre') {
                                claimRunMilestoneRewards(runTotalMilestonesRef.current);
                                setObstacles([]);
                                const meters = Math.floor(runDistanceRef.current / METERS_PER_PX);
                                setRunMetersEarned(meters);
                                if (meters > bestMetersForDog) {
                                    setRunIsNewRecord(true);
                                    setRunBestMeters(meters);
                                    onNewDistanceRecordRef.current?.(selectedDogId, meters);
                                } else {
                                    setRunIsNewRecord(false);
                                    setRunBestMeters(bestMetersForDog);
                                }
                            }
                            setWon(false);
                            setPhase('gameover');
                            playSfx('loseGame', 'sfx_volume_ladyrun');
                        }, GAME_END_DELAY_MS);
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
    }, [phase, paused, difficulty, selectedDogId, cpuDogId, stage, runMode, checkpointOpen, arcadeSubMode, selectedBiomeId, sceneIndex, claimRunMilestoneRewards, bestMetersForDog]);

    const dogImg = airborne ? (DOG_JUMP_FRAME[selectedDogId] ?? runFrames[1]) : runFrames[frameIdx];
    const cpuDogImg = cpuAirborne ? (DOG_JUMP_FRAME[cpuDogId] ?? cpuRunFrames[1]) : cpuRunFrames[frameIdx];
    const playerPowerObstacleImg = stage === 'boss'
        ? (ATTACK_PLAYER_ELEMENT_IMGS[DogsConfig[selectedDogId]?.element] ?? ELEMENT_POWER_OBSTACLE_IMGS[DogsConfig[selectedDogId]?.element])
        : ELEMENT_POWER_OBSTACLE_IMGS[DogsConfig[selectedDogId]?.element];
    const isLibre = runMode === 'arcade' && arcadeSubMode === 'libre';
    const biomeSceneClass = (arcadeSubMode === 'biome' || runMode === 'historia') && selectedBiomeId
        ? ` runner-track-scene-${selectedBiomeId}-${sceneIndex + 1}`
        : arcadeSubMode === 'libre'
            ? ` runner-track-scene-libre-${libreSceneKey}`
            : '';
    const skyOverlayClass = `runner-sky-overlay${(arcadeSubMode === 'biome' || runMode === 'historia') && BIOMES[selectedBiomeId]?.interior ? ' runner-sky-overlay-interior' : ''}`;
    const lootRunsLeftToday = Math.max(0, MAX_FULL_LOOT_RUNS_PER_DAY - fullLootRunsToday);
    const bossImg = (runMode === 'historia' && CHAPTER_BOSS_IMAGES[selectedBiomeId]?.[sceneIndex]) || batBoss;
    const checkpointTotalScenes = BIOMES[selectedBiomeId]?.scenes.length ?? 1;
    const checkpointIsFinalScene = sceneIndex >= checkpointTotalScenes - 1;

    return (
        <div className={`runner-backdrop${belowHud ? ' runner-backdrop-below-hud' : ''}`} onClick={phase !== 'playing' ? onClose : undefined}>
            <div className={`runner-screen${phase === 'playing' || phase === 'gameover' ? ' runner-screen-centered' : ''}`} onClick={e => e.stopPropagation()}>
                {phase !== 'playing' && onClose && (
                    <button className="modal-close" onClick={onClose}><X /></button>
                )}

                {rouletteOpen && (
                    <div className="runner-roulette-overlay">
                        <p className={`runner-roulette-label${rouletteSettled ? ' runner-roulette-label-visible' : ''}`}>
                            {LIBRE_SCENE_LABELS[rouletteSequence[rouletteSequence.length - 1]]}
                        </p>
                        <div className={`runner-roulette-viewport${rouletteSettled ? ' runner-roulette-viewport-settled' : ''}`}>
                            <div
                                className="runner-roulette-track"
                                style={{
                                    width: `${rouletteSequence.length * 100}%`,
                                    transform: `translateX(-${rouletteSpinning ? (rouletteSequence.length - 1) / rouletteSequence.length * 100 : 0}%)`,
                                    transition: rouletteSpinning ? `transform ${ROULETTE_SPIN_MS}ms cubic-bezier(0.25, 0.35, 0.1, 1)` : 'none',
                                }}
                            >
                                {rouletteSequence.map((idx, i) => {
                                    const isFinalFrame = i === rouletteSequence.length - 1;
                                    return (
                                        <div
                                            key={i}
                                            className={`runner-roulette-frame${isFinalFrame ? ` runner-track-scene-libre-${idx}` : ''}`}
                                            style={{
                                                width: `${100 / rouletteSequence.length}%`,
                                                backgroundImage: isFinalFrame ? undefined : `url(${LIBRE_SCENE_STATIC_IMGS[idx]})`,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {countdownValue !== null && (
                    <div className="runner-countdown-overlay">
                        <span key={countdownValue} className="runner-countdown-value">
                            {countdownValue > 0 ? countdownValue : '¡Ya!'}
                        </span>
                    </div>
                )}

                <div className={`runner-tracks${isLibre ? ' runner-tracks-solo' : ''}`}>
                    {phase !== 'ready' && !isLibre && (
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

                    <div
                        className={`runner-track runner-track-player${isLibre ? ' runner-track-player-solo' : ''}${phase === 'gameover' ? ' runner-track-static' : ''}${biomeSceneClass}${playerPowerPending ? ' runner-track-power-pending' : ''}`}
                        style={isLibre && phase === 'gameover' ? { backgroundImage: `url(${LIBRE_SCENE_STATIC_IMGS[libreSceneKey]})` } : undefined}
                        ref={trackRef}
                    >
                        <div className="runner-ground" />
                        {phase === 'playing' && <div className={skyOverlayClass} />}

                        <span className="runner-track-player-lives">
                            {[0, 1, 2].map(i => (
                                <img
                                    key={i}
                                    src={getLifeSlotAsset(lives, i)}
                                    alt=""
                                    className="runner-life-heart-img"
                                />
                            ))}
                        </span>

                        {stage === 'boss' && (
                            <div className="runner-boss-label">
                                <span>BOSS</span>
                                <span className="runner-track-cpu-lives">{bossHp}/{BOSS_MAX_HP}</span>
                            </div>
                        )}


                        <img
                            ref={dogElRef}
                            src={dogImg}
                            alt={DogsConfig[selectedDogId]?.name ?? selectedDogId}
                            className={`runner-dog${hitFlash ? ' runner-dog-hit' : ''}${phase === 'gameover' && DOG_GAMEOVER_IMG[selectedDogId] ? ' runner-dog-hidden' : ''}`}
                        />

                        {stage === 'boss' && (
                            <img
                                ref={bossElRef}
                                src={bossImg}
                                alt="Boss"
                                className={`runner-boss${bossHitFlash ? ' runner-boss-hit' : ''}${bossWindingUp ? ' runner-boss-windup' : ''}`}
                                style={bossWindingUp ? { filter: `drop-shadow(0 0 18px ${ELEMENT_ICON[CHAPTER_BOSS_ELEMENT[selectedBiomeId]]?.color})`, animationDuration: `${bossWindupDurationMs}ms` } : undefined}
                            />
                        )}

                        {stage === 'boss' && attacks.map(a => {
                            const attackImg = a.owner === 'player' ? ATTACK_PLAYER_ELEMENT_IMGS[a.element] : ATTACK_BOSS_BIOME_IMGS[selectedBiomeId];
                            return (
                                <div
                                    key={a.id}
                                    ref={el => setAttackEl(a.id, el)}
                                    className={`runner-attack runner-attack-${a.owner}${a.aerial ? ' runner-attack-aerial' : ''}`}
                                >
                                    {attackImg && (
                                        <img src={attackImg} alt="" className="runner-attack-img" />
                                    )}
                                </div>
                            );
                        })}

                        {obstacles.filter(o => o.lane !== 'cpu').map(o => {
                            const collectedClass = ((o.isHeart || o.isCoin || o.isChapa) && o.hit) ? ' runner-obstacle-collected' : '';
                            return o.isHeart ? (
                                <img
                                    key={o.id}
                                    ref={el => setObstacleEl(o.id, el)}
                                    src={LIFE_TIER_ASSETS[Math.min(Math.floor(lives / 3), LIFE_TIER_ASSETS.length - 1)]}
                                    alt=""
                                    className={`runner-obstacle runner-obstacle-heart${o.aerial ? ' runner-obstacle-aerial' : ''}${collectedClass}`}
                                />
                            ) : (
                                <img
                                    key={o.id}
                                    ref={el => setObstacleEl(o.id, el)}
                                    src={o.img}
                                    alt=""
                                    className={`runner-obstacle${o.aerial ? ' runner-obstacle-aerial' : ''}${o.isCoin ? ' runner-obstacle-coin' : ''}${o.isChapa ? ' runner-obstacle-chapa' : ''}${collectedClass}${isLibre && !o.aerial && !o.isCoin && !o.isChapa ? ' runner-obstacle-warn-blink' : ''}`}
                                />
                            );
                        })}

                        {(phase === 'ready' || phase === 'gameover') && (
                        <div className={`runner-overlay${phase === 'gameover' ? ' runner-overlay-gameover' : ''}`}>
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
                            {phase === 'ready' && runMode === 'historia' && chapterSelectOpen && (
                                <>
                                    <button className="lady-run-back-btn" onClick={() => { setRunMode(null); setChapterSelectOpen(false); setSelectedChapter(null); }}><ArrowLeft size={16} /></button>
                                    <div className="runner-mode-select">
                                        <button className="runner-mode-btn" onClick={() => { setSelectedChapter(1); setSelectedBiomeId('mina'); setSceneIndex(0); setChapterSelectOpen(false); }}>
                                            <span className="runner-mode-btn-title">Capítulo 1</span>
                                        </button>
                                        <button className="runner-mode-btn" onClick={() => { setSelectedChapter(2); setSelectedBiomeId('ciudad'); setSceneIndex(0); setChapterSelectOpen(false); }}>
                                            <span className="runner-mode-btn-title">Capítulo 2</span>
                                        </button>
                                    </div>
                                </>
                            )}
                            {phase === 'ready' && runMode && !biomeSelectOpen && !chapterSelectOpen && (
                                <>
                                    <button className="lady-run-back-btn" onClick={() => { setRunMode(null); setBiomeSelectOpen(false); setArcadeSubMode(null); setSelectedBiomeId(null); setChapterSelectOpen(false); setSelectedChapter(null); }}><ArrowLeft size={16} /></button>
                                    <p className="runner-overlay-title">{runMode === 'historia' && selectedChapter ? `Capítulo ${selectedChapter}` : 'Corre y esquiva'}</p>
                                    <button
                                        className="runner-start-btn"
                                        onClick={runMode === 'arcade' ? startLibreRoulette : resetGame}
                                    >Empezar</button>
                                    {runMode === 'arcade' && (
                                        <p className="runner-loot-limit-text">
                                            {lootRunsLeftToday > 0 ? `${lootRunsLeftToday}/${MAX_FULL_LOOT_RUNS_PER_DAY} con botín completo hoy` : 'Botín reducido hoy'}
                                        </p>
                                    )}
                                </>
                            )}
                            {phase === 'ready' && runMode === 'arcade' && biomeSelectOpen && (
                                <>
                                    <button className="lady-run-back-btn" onClick={() => setBiomeSelectOpen(false)}><ArrowLeft size={16} /></button>
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
                                    {DOG_GAMEOVER_IMG[selectedDogId] ? (
                                        <img src={DOG_GAMEOVER_IMG[selectedDogId]} alt="" className="runner-overlay-dog-img runner-overlay-dog-img-solo" />
                                    ) : (
                                        <p className="runner-overlay-title">{isLibre ? 'Perdiste' : (won ? '¡Has ganado!' : 'Game Over')}</p>
                                    )}
                                    {isLibre && (
                                        <p className="runner-run-dog-summary-name">{DogsConfig[selectedDogId]?.name ?? selectedDogId}</p>
                                    )}
                                    <p className="runner-overlay-score">Puntos: {score}</p>
                                    {isLibre && (
                                        <p className="runner-overlay-score">
                                            {runMetersEarned}m {runIsNewRecord ? '¡Nuevo récord!' : `(Récord: ${runBestMeters}m)`}
                                        </p>
                                    )}
                                    {runMode === 'arcade' && !isLibre && (
                                        <p className="runner-overlay-score">Rivales vencidos: {rivalsDefeated}</p>
                                    )}
                                    {isLibre && (
                                        <div className="runner-run-rewards">
                                            <span className="runner-run-reward"><img src={chapaIcon} alt="Chapas" />{runChapasEarned}</span>
                                            <span className="runner-run-reward"><img src={tavernCoinIcon} alt="Monedas" />{runCoinsEarned}</span>
                                            <span className="runner-run-reward"><img src={huesinIcon} alt="Huesin" />{runHuesinEarned}</span>
                                            {pawFill >= 2 && (
                                                <span className="runner-run-reward-paw">
                                                    <img src={PAW_FILL_IMAGES[pawFill]} alt="" />
                                                    <span className="runner-run-reward-paw-mult">x{pawFill}</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        )}

                        {phase === 'playing' && paused && resumedRunRef.current && countdownValue === null && (
                            <div className="runner-overlay">
                                <button className="runner-start-btn" onClick={startCountdown}>Reanudar</button>
                            </div>
                        )}
                    </div>

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
                                {runMode === 'historia' && checkpointIsFinalScene ? (
                                    <button className="runner-start-btn runner-start-btn-secondary" onClick={handleClaimChapter}>Reclamar</button>
                                ) : (
                                    <button className="runner-start-btn" onClick={handleCheckpointContinue}>Continuar</button>
                                )}
                            </div>
                        </div>
                    )}

                    {isLibre && (phase === 'playing' || phase === 'gameover') && (
                        <div className="runner-progress-bar">
                            <div className="runner-progress-line">
                                {RUN_MARK_PERCENTS.map((pct, i) => {
                                    const reward = (RUN_MILESTONE_REWARDS[difficulty] ?? RUN_MILESTONE_REWARDS.facil)[i];
                                    const rewardIcon = reward?.huesin ? huesinIcon : tavernCoinIcon;
                                    const rewardAmount = reward?.huesin ?? reward?.tavernCoins ?? 0;
                                    const currentPhaseIndex = Math.floor(runTotalMilestonesRef.current / 3);
                                    const claimedToday = (currentPhaseIndex * 3 + i) < dailyTramosClaimedToday;
                                    const reached = runMilestoneIndex >= i || claimedToday;
                                    return (
                                        <div key={i} className="runner-progress-mark-group" style={{ left: `${pct}%` }}>
                                            <span className={`runner-progress-mark-reward${reached ? ' runner-progress-mark-reward-claimed' : ''}`}>
                                                <span className={`runner-progress-mark-reward-icon${reward?.huesin ? ' runner-progress-mark-reward-icon-huesin' : ''}`}>
                                                    <img src={rewardIcon} alt="" />
                                                </span>
                                                {rewardAmount}
                                            </span>
                                        </div>
                                    );
                                })}
                                <img ref={runFlagElRef} src={PAW_FILL_IMAGES[pawFill]} alt="" className="runner-progress-flag" />
                            </div>
                        </div>
                    )}
                </div>

                {phase === 'ready' && !runMode && (
                    <div className="runner-mode-card-shop runner-mode-card-static-pradera">
                        <button className="runner-mode-btn" onClick={() => setShopOpen(true)}>
                            <span className="runner-mode-btn-title">Tienda</span>
                        </button>
                    </div>
                )}

                {phase === 'ready' && !runMode && (
                    <div className="runner-mode-cards-extra">
                        <div className="runner-mode-card-locked runner-mode-card-static-ciudad">
                            <button className="runner-mode-btn runner-mode-btn-locked" disabled>
                                <span className="runner-mode-btn-title">Eventos</span>
                                <img src={lockIcon} alt="Bloqueado" className="runner-mode-btn-lock" />
                            </button>
                            <span className="runner-mode-card-tag">Próximamente</span>
                        </div>
                        <div className="runner-mode-card-locked runner-mode-card-static-desierto">
                            <button className="runner-mode-btn runner-mode-btn-locked" disabled>
                                <span className="runner-mode-btn-title">Torneo</span>
                                <img src={lockIcon} alt="Bloqueado" className="runner-mode-btn-lock" />
                            </button>
                            <span className="runner-mode-card-tag">Próximamente</span>
                        </div>
                    </div>
                )}

                {phase === 'ready' && !runMode && (
                    <div className="runner-mode-cards-extra">
                        <div className="runner-mode-card-locked runner-mode-card-static-hielo runner-mode-card-half">
                            <button className="runner-mode-btn runner-mode-btn-locked" disabled>
                                <span className="runner-mode-btn-title">Skins</span>
                                <img src={lockIcon} alt="Bloqueado" className="runner-mode-btn-lock" />
                            </button>
                            <span className="runner-mode-card-tag">Próximamente</span>
                        </div>
                    </div>
                )}

                {phase === 'gameover' && (
                    <>
                        <div className="runner-action-row">
                            <button className="runner-start-btn runner-start-btn-compact" onClick={() => (arcadeSubMode === 'libre' ? startLibreRoulette() : resetGame())}>Reintentar</button>
                            <button className="runner-start-btn runner-start-btn-secondary runner-start-btn-compact" onClick={backToSelect}>Volver</button>
                        </div>
                        {arcadeSubMode === 'libre' && (
                            <p className="runner-loot-limit-text">
                                {lootRunsLeftToday > 0 ? `${lootRunsLeftToday}/${MAX_FULL_LOOT_RUNS_PER_DAY} con botín completo hoy` : 'Botín reducido hoy'}
                            </p>
                        )}
                    </>
                )}

                {phase === 'playing' && (
                    <div className="runner-action-row">
                        <div className="runner-jump-hub">
                            <button className="runner-jump-btn" onPointerDown={jump}>
                                <img src={canDoubleJump ? jumpBtnIcon2 : jumpBtnIcon1} alt="Saltar" className="runner-jump-btn-img" />
                            </button>
                            {isLibre && (
                                <button className="runner-power-btn runner-magic-heart-sat" onPointerDown={useMagicHeart} disabled={magicHearts <= 0}>
                                    <img src={magicHeartIcon} alt="" className="runner-power-btn-img" />
                                    <span className="runner-power-btn-charges">x{magicHearts}</span>
                                </button>
                            )}
                        </div>
                        {runMode === 'historia' && (
                            <button className="runner-power-btn" onPointerDown={usePower} disabled={(stage === 'boss' ? projectileCharges : powerCharges) <= 0 || (stage === 'boss' && projectileCoolingDown)}>
                                {playerPowerObstacleImg && (
                                    <img src={playerPowerObstacleImg} alt="" className="runner-power-btn-img" />
                                )}
                                <span className="runner-power-btn-charges">{stage === 'boss' ? projectileCharges : powerCharges}</span>
                            </button>
                        )}
                    </div>
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

                {phase === 'ready' && runMode && (
                    <div className="runner-dog-select">
                        {[...UNLOCKED_DOG_IDS]
                            .sort((a, b) => {
                                const aLocked = PAID_DOG_IDS.includes(a) && !unlockedDogIds.includes(a);
                                const bLocked = PAID_DOG_IDS.includes(b) && !unlockedDogIds.includes(b);
                                return aLocked - bLocked;
                            })
                            .map(id => {
                            const elementInfo = ELEMENT_ICON[DogsConfig[id]?.element];
                            const needsUnlock = PAID_DOG_IDS.includes(id) && !unlockedDogIds.includes(id);
                            const canAfford = huesin >= DOG_UNLOCK_PRICE.huesin && tavernCoins >= DOG_UNLOCK_PRICE.tavernCoins;
                            return (
                                <div key={id} className="runner-dog-select-col">
                                    <button
                                        className={`runner-dog-select-btn dog-rarity-${DogsConfig[id]?.rarity}${selectedDogId === id ? ' runner-dog-select-active' : ''}${needsUnlock ? ' runner-dog-select-locked' : ''}`}
                                        onClick={() => needsUnlock ? (canAfford && onUnlockDog?.(id)) : setSelectedDogId(id)}
                                        disabled={needsUnlock && !canAfford}
                                    >
                                        <img src={DOG_ICONS[id]} alt={DogsConfig[id]?.name ?? id} className="runner-dog-select-icon" />
                                        {needsUnlock && (
                                            <span className="runner-dog-select-price">
                                                <img src={huesinIcon} alt="" />
                                                <span className={huesin >= DOG_UNLOCK_PRICE.huesin ? '' : 'runner-dog-select-price-short'}>{DOG_UNLOCK_PRICE.huesin}</span>
                                                <img src={tavernCoinIcon} alt="" />
                                                <span className={tavernCoins >= DOG_UNLOCK_PRICE.tavernCoins ? '' : 'runner-dog-select-price-short'}>{DOG_UNLOCK_PRICE.tavernCoins}</span>
                                            </span>
                                        )}
                                        {needsUnlock ? (
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
                        {DIFFICULTY_ORDER.map(id => {
                            const hasBonusLeft = runMode === 'arcade' && (fullLootRunsByDifficulty?.[id] ?? 0) < MAX_FULL_LOOT_RUNS_PER_DAY;
                            return (
                                <button
                                    key={id}
                                    className={`runner-difficulty-btn${difficulty === id ? ' runner-difficulty-active' : ''}${hasBonusLeft ? ' runner-difficulty-bonus-glow' : ''}`}
                                    onClick={() => setDifficulty(id)}
                                >
                                    {CPU_DIFFICULTY_PRESETS[id].label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {phase === 'ready' && runMode && (
                    <div className="runner-dog-select">
                        <span className="runner-dog-select-locked-label">Próximamente</span>
                        {DOG_SELECT_ORDER.filter(id => LOCKED_DOG_IDS.includes(id)).map(id => (
                            <div key={id} className="runner-dog-select-col">
                                <button className={`runner-dog-select-btn dog-rarity-${DogsConfig[id]?.rarity} runner-dog-select-locked`} disabled>
                                    <img src={DOG_ICONS[id]} alt={DogsConfig[id]?.name ?? id} className="runner-dog-select-icon" />
                                    <img src={lockIcon} alt="Bloqueado" className="runner-dog-select-lock" />
                                </button>
                                <span className="runner-dog-select-name">{DogsConfig[id]?.name ?? id}</span>
                            </div>
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

                {shopOpen && (
                    <LadyRunShopModal
                        onClose={() => setShopOpen(false)}
                        chapas={chapas}
                        tavernCoins={tavernCoins}
                        magicHearts={magicHearts}
                        onBuyItem={onBuyItem}
                    />
                )}
            </div>
        </div>
    );
}
