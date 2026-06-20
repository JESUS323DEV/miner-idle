export const MINE_AUTOMINE_INTERVAL = 500;

export const ELEMENT_COLORS = {
    fuego:    '#ff5252',
    electrico: '#00e5ff',
    tierra:   '#c8a96e',
    agua:     '#4dd0e1',
    oscuro:   '#ce93d8',
};

export const BIOME_INGOT_KEY = {
    bronze:  'bronzeIngot',
    iron:    'ironIngot',
    diamond: 'diamondIngot',
};

// Ult types:
//  cooldown_ingots  — fuego: 1 hit on click, high chance of ingot, goes on cooldown
//  session_bounce   — electrico: 1 activation, bonus material on every automine hit whole session
//  once_earthquake  — tierra: 1 use, reduces all vein remaining by damage%, no loot for removed hits
//  once_water       — agua: 1 use, random multiplier to all material gains for whole session
//  session_speed    — oscuro legendary: speed boost auto-applied from session start, no button
//  timed_speed      — oscuro epic/rare: activatable speed boost for X seconds

export const MineCompanionConfig = {
    // ===== LEGENDARIOS =====
    lady: {
        element: 'fuego',
        ult: {
            type: 'cooldown_ingots',
            name: 'Pelota de Fuego',
            baseCooldown: 10000,
            starReduction: 1000, // -1s per star → 5s at 5★
            chance: 0.85,
        },
    },
    tokio: {
        element: 'electrico',
        ult: {
            type: 'session_bounce',
            name: 'Pelota Eléctrica',
            // [min, max] extra material per hit, indexed by stars 0-5
            starRanges: [[1,2],[1,2],[1,3],[2,3],[2,4],[3,4]],
        },
    },
    tuka: {
        element: 'tierra',
        ult: {
            type: 'once_earthquake',
            name: 'Terremoto',
            baseDamage: 0.50,
            starScale: 0.06, // → 80% at 5★
        },
    },
    muna: {
        element: 'agua',
        ult: {
            type: 'once_water',
            name: 'Pistola de Agua',
            // [min, max] multiplier, indexed by stars 0-5
            starRanges: [[2,3],[2,3],[2,4],[3,4],[3,5],[4,5]],
        },
    },
    chihuahua: {
        element: 'oscuro',
        ult: {
            type: 'session_speed',
            name: 'Furia',
            baseBonus: 0.50,
            starScale: 0.10, // → +100% at 5★
        },
    },

    // ===== ÉPICOS =====
    bully: {
        element: 'tierra',
        ult: {
            type: 'once_earthquake',
            name: 'Terremoto',
            baseDamage: 0.30,
            starScale: 0.05, // → 55% at 5★
        },
    },
    smoke: {
        element: 'fuego',
        ult: {
            type: 'cooldown_ingots',
            name: 'Pelota de Fuego',
            baseCooldown: 20000,
            starReduction: 2000, // → 10s at 5★ (matches Lady base)
            chance: 0.70,
        },
    },
    nupito: {
        element: 'oscuro',
        ult: {
            type: 'timed_speed',
            name: 'Furia',
            duration: 15000,
            baseBonus: 0.30,
            starScale: 0.06, // → +60% at 5★
        },
    },

    // ===== RAROS =====
    boxer: {
        element: 'agua',
        ult: {
            type: 'once_water',
            name: 'Pistola de Agua',
            starRanges: [[1,2],[1,2],[1,2],[1,3],[2,3],[2,3]],
        },
    },
    druh: {
        element: 'electrico',
        ult: {
            type: 'session_bounce',
            name: 'Pelota Eléctrica',
            starRanges: [[1,1],[1,1],[1,2],[1,2],[1,3],[1,3]],
        },
    },
    gordo: {
        element: 'tierra',
        ult: {
            type: 'once_earthquake',
            name: 'Terremoto',
            baseDamage: 0.15,
            starScale: 0.03, // → 30% at 5★
        },
    },
    zeus: {
        element: 'oscuro',
        ult: {
            type: 'timed_speed',
            name: 'Furia',
            duration: 10000,
            baseBonus: 0.15,
            starScale: 0.04, // → 35% at 5★
        },
    },
};

// Helper: get the fury speed bonus for a dog at given stars
export const getFuryBonus = (dogId, stars) => {
    const cfg = MineCompanionConfig[dogId]?.ult;
    if (!cfg || (cfg.type !== 'session_speed' && cfg.type !== 'timed_speed')) return 0;
    return cfg.baseBonus + (cfg.starScale ?? 0) * (stars ?? 0);
};

// Helper: get the earthquake damage % for a dog at given stars
export const getEarthquakeDamage = (dogId, stars) => {
    const cfg = MineCompanionConfig[dogId]?.ult;
    if (!cfg || cfg.type !== 'once_earthquake') return 0;
    return Math.min(0.95, cfg.baseDamage + (cfg.starScale ?? 0) * (stars ?? 0));
};

// Helper: get the electric bonus range for a dog at given stars
export const getElectricRange = (dogId, stars) => {
    const cfg = MineCompanionConfig[dogId]?.ult;
    if (!cfg || cfg.type !== 'session_bounce') return [0, 0];
    return cfg.starRanges[Math.min(5, stars ?? 0)] ?? [1, 1];
};

// Helper: get the water multiplier range for a dog at given stars
export const getWaterRange = (dogId, stars) => {
    const cfg = MineCompanionConfig[dogId]?.ult;
    if (!cfg || cfg.type !== 'once_water') return [1, 1];
    return cfg.starRanges[Math.min(5, stars ?? 0)] ?? [2, 3];
};

// Helper: get fuego cooldown for a dog at given stars
export const getFuegoCooldown = (dogId, stars) => {
    const cfg = MineCompanionConfig[dogId]?.ult;
    if (!cfg || cfg.type !== 'cooldown_ingots') return 10000;
    return Math.max(1000, cfg.baseCooldown - (cfg.starReduction ?? 0) * (stars ?? 0));
};
