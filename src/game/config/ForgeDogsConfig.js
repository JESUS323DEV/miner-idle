export const ForgeDogsConfig = {
    pip: {
        rarity: 'rare',
        id: 'pip',
        name: 'Pip',
        element: 'electrico',
        unlockCost: { gold: 0, tavernCoins: 0 },
        starBonus: 0.10,
        unlockFragments: 50,
        starFragments: [80, 160, 240, 320, 400],
        forgeBonus: {
            timeReduction: 0,
            doubleIngot: 0,
            biomeBonus: { bronze: 1, iron: 0, diamond: 0 }
        },
        globalSlotBonus: { type: 'goldTrickle', min: 1, max: 1 },
    },
    koda: {
        rarity: 'rare',
        id: 'koda',
        name: 'Koda',
        element: 'fuego',
        unlockCost: { gold: 25000, tavernCoins: 1 },
        starBonus: 0.10,
        unlockFragments: 50,
        starFragments: [80, 160, 240, 320, 400],
        forgeBonus: {
            timeReduction: 0,
            doubleIngot: 0.05,
            biomeBonus: { bronze: 0, iron: 1, diamond: 0 }
        },
        globalSlotBonus: { type: 'burstRecharge', chance: 0.05 },
    },
    milo: {
        rarity: 'rare',
        id: 'milo',
        name: 'Milo',
        element: 'agua',
        unlockCost: { gold: 30000, tavernCoins: 1 },
        starBonus: 0.10,
        unlockFragments: 50,
        starFragments: [80, 160, 240, 320, 400],
        forgeBonus: {
            timeReduction: 0,
            doubleIngot: 0.08,
            biomeBonus: { bronze: 1, iron: 1, diamond: 0 }
        },
        globalSlotBonus: { type: 'maxDurability', value: 1 },
    },
    rocky: {
        rarity: 'epic',
        id: 'rocky',
        name: 'Rocky',
        element: 'tierra',
        unlockCost: { gold: 40000, tavernCoins: 3 },
        starBonus: 0.15,
        unlockFragments: 100,
        starFragments: [150, 300, 450, 600, 750],
        forgeBonus: {
            timeReduction: 1,
            doubleIngot: 0.05,
            biomeBonus: { bronze: 2, iron: 0, diamond: 0 }
        },
        globalSlotBonus: { type: 'burstRecharge', chance: 0.05 },
    },
    bruno: {
        rarity: 'epic',
        id: 'bruno',
        name: 'Bruno',
        element: 'fuego',
        unlockCost: { gold: 55000, tavernCoins: 4 },
        starBonus: 0.15,
        unlockFragments: 100,
        starFragments: [150, 300, 450, 600, 750],
        forgeBonus: {
            timeReduction: 1,
            doubleIngot: 0.10,
            biomeBonus: { bronze: 0, iron: 3, diamond: 0 }
        },
        globalSlotBonus: { type: 'goldTrickle', min: 1, max: 3 },
    },
    max: {
        rarity: 'epic',
        id: 'max',
        name: 'Max',
        element: 'oscuro',
        unlockCost: { gold: 200000, tavernCoins: 6 },
        starBonus: 0.15,
        unlockFragments: 100,
        starFragments: [150, 300, 450, 600, 750],
        forgeBonus: {
            timeReduction: 1,
            doubleIngot: 0.15,
            biomeBonus: { bronze: 0, iron: 0, diamond: 4 }
        },
        globalSlotBonus: { type: 'maxDurability', value: 3 },
    },
    rex: {
        rarity: 'legendary',
        id: 'rex',
        name: 'Rex',
        element: 'tierra',
        unlockCost: { gold: 200000, tavernCoins: 12 },
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        forgeBonus: {
            timeReduction: 3,
            doubleIngot: 0.05,
            biomeBonus: { bronze: 2, iron: 0, diamond: 0 }
        },
        globalSlotBonus: { type: 'burstRecharge', chance: 0.08 },
    },
    toby: {
        rarity: 'legendary',
        id: 'toby',
        name: 'Toby',
        element: 'agua',
        unlockCost: { gold: 900000, tavernCoins: 22 },
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        forgeBonus: {
            timeReduction: 2,
            doubleIngot: 0.20,
            biomeBonus: { bronze: 0, iron: 3, diamond: 0 }
        },
        globalSlotBonus: { type: 'goldTrickle', min: 2, max: 4 },
    },
    buddy: {
        rarity: 'legendary',
        id: 'buddy',
        name: 'Buddy',
        element: 'oscuro',
        unlockCost: { gold: 1500000, tavernCoins: 30 },
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        forgeBonus: {
            timeReduction: 4,
            doubleIngot: 0.25,
            biomeBonus: { bronze: 0, iron: 0, diamond: 2 }
        },
        globalSlotBonus: { type: 'maxDurability', value: 5 },
    }
};