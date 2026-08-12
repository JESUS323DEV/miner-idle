import { CombatConfig } from './CombatConfig.js';

export const HUNT_BOSS_REWARDS = {
    'spider-boss': 3,
    'bat-boss': 5,
    'topo-boss': 8,
    'scorpion-boss': 10,
};

export const getHuntBossName = (bossId) => {
    for (const biome of CombatConfig.biomes) {
        const enemy = biome.enemies.find(e => e.id === bossId);
        if (enemy) return enemy.name;
    }
    return bossId;
};

export const HUNT_CONDITIONS = [
    {
        id: 'tiempo',
        label: 'Con tiempo de sobra',
        desc: 'Gana con al menos un 30% del reloj restante.',
        evaluate: (ctx) => ctx.timerLeft >= ctx.timerTotal * 0.3,
    },
    {
        id: 'elemento_unico',
        label: 'Equipo mono-elemento',
        desc: 'Gana con los 3 puestos del mismo elemento.',
        evaluate: (ctx) => {
            const els = ctx.elements.filter(Boolean);
            return els.length === 3 && els.every(e => e === els[0]);
        },
    },
    {
        id: 'combo',
        label: 'Combo alto',
        desc: 'Alcanza un combo máximo de 15 en la pelea.',
        evaluate: (ctx) => ctx.maxCombo >= 15,
    },
    {
        id: 'sin_auto',
        label: 'Sin Auto',
        desc: 'Gana sin usar el auto-lanzar del ultimate.',
        evaluate: (ctx) => !ctx.autoUsed,
    },
    {
        id: 'equipo_mixto',
        label: 'Equipo mixto',
        desc: 'Gana con los 3 puestos de elementos distintos.',
        evaluate: (ctx) => {
            const els = ctx.elements.filter(Boolean);
            return els.length === 3 && new Set(els).size === 3;
        },
    },
];

const seededRng = (seed) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    return () => {
        h = Math.imul(h ^ (h >>> 15), h | 1);
        h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
        return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
    };
};

export const getHuntRotationKey = () => new Date().toISOString().slice(0, 10);

export const getDailyHuntContracts = (rotationKey) => {
    const bossIds = Object.keys(HUNT_BOSS_REWARDS);
    const rng = seededRng(`hunt-${rotationKey}`);
    const shuffled = [...bossIds];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3).map(bossId => ({
        bossId,
        reward: HUNT_BOSS_REWARDS[bossId],
        condition: HUNT_CONDITIONS[Math.floor(rng() * HUNT_CONDITIONS.length)],
    }));
};
