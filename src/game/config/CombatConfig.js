export const CombatConfig = {
    biomes: [
        {
            id: 'bats',
            name: 'Caverna de Murciélagos',
            comingSoon: false,
            enemies: [
                {
                    id: 'bat-1',
                    name: 'Murciélago',
                    hp: 80,
                    timerSec: 30,
                    isBoss: false,
                    rarityPool: [{ rarity: 'rare', weight: 100 }],
                    rewardThresholds: [
                        { pct: 0.50, label: 'Básica',   shards: 2 },
                        { pct: 1.00, label: 'Completa', shards: 5 },
                    ],
                },
                {
                    id: 'bat-2',
                    name: 'Murciélago Oscuro',
                    hp: 200,
                    timerSec: 30,
                    isBoss: false,
                    rarityPool: [{ rarity: 'rare', weight: 80 }, { rarity: 'epic', weight: 20 }],
                    rewardThresholds: [
                        { pct: 0.50, label: 'Básica',   shards: 3 },
                        { pct: 1.00, label: 'Completa', shards: 8 },
                    ],
                },
                {
                    id: 'bat-3',
                    name: 'Murciélago Anciano',
                    hp: 380,
                    timerSec: 30,
                    isBoss: false,
                    rarityPool: [{ rarity: 'epic', weight: 90 }, { rarity: 'legendary', weight: 10 }],
                    rewardThresholds: [
                        { pct: 0.50, label: 'Básica',   shards: 5 },
                        { pct: 1.00, label: 'Completa', shards: 12 },
                    ],
                },
                {
                    id: 'bat-boss',
                    name: 'Murciélago Alfa',
                    hp: 600,
                    timerSec: 30,
                    isBoss: true,
                    rarityPool: [{ rarity: 'epic', weight: 70 }, { rarity: 'legendary', weight: 30 }],
                    rewardThresholds: [
                        { pct: 0.25, label: 'Básica',   shards: 3  },
                        { pct: 0.50, label: 'Media',     shards: 6  },
                        { pct: 0.75, label: 'Buena',     shards: 10 },
                        { pct: 1.00, label: 'Completa',  shards: 15 },
                    ],
                },
            ],
        },
        {
            id: 'moles',
            name: 'Madriguera de Topos',
            comingSoon: false,
            enemies: [
                {
                    id: 'topo-1',
                    name: 'Topo',
                    hp: 160,
                    timerSec: 30,
                    isBoss: false,
                    rarityPool: [{ rarity: 'rare', weight: 60 }, { rarity: 'epic', weight: 40 }],
                    rewardThresholds: [
                        { pct: 0.50, label: 'Básica',   shards: 10, gold: 2500 },
                        { pct: 1.00, label: 'Completa', shards: 10, gold: 5000 },
                    ],
                },
                {
                    id: 'topo-2',
                    name: 'Topo Excavador',
                    hp: 380,
                    timerSec: 30,
                    isBoss: false,
                    rarityPool: [{ rarity: 'rare', weight: 40 }, { rarity: 'epic', weight: 60 }],
                    rewardThresholds: [
                        { pct: 0.50, label: 'Básica',   shards: 10, gold: 5000  },
                        { pct: 1.00, label: 'Completa', shards: 10, gold: 10000 },
                    ],
                },
                {
                    id: 'topo-3',
                    name: 'Topo Anciano',
                    hp: 650,
                    timerSec: 30,
                    isBoss: false,
                    rarityPool: [{ rarity: 'epic', weight: 70 }, { rarity: 'legendary', weight: 30 }],
                    rewardThresholds: [
                        { pct: 0.50, label: 'Básica',   shards: 10, gold: 7500  },
                        { pct: 1.00, label: 'Completa', shards: 10, gold: 15000 },
                    ],
                },
                {
                    id: 'topo-boss',
                    name: 'Topo Gigante',
                    hp: 2500,
                    timerSec: 30,
                    isBoss: true,
                    rarityPool: [{ rarity: 'epic', weight: 40 }, { rarity: 'legendary', weight: 60 }],
                    rewardThresholds: [
                        { pct: 0.25, label: 'Básica',   shards: 10, gold: 5000  },
                        { pct: 0.50, label: 'Media',     shards: 10, gold: 10000 },
                        { pct: 0.75, label: 'Buena',     shards: 10, gold: 15000 },
                        { pct: 1.00, label: 'Completa',  shards: 10, gold: 20000 },
                    ],
                },
            ],
        },
    ],
};
