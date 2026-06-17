const InitialRewardsState = {

    //ORO picado CONSEGUIDO HISTÓRICO
    goldMilestones: {
        claimed: [],
        firstStep: 1000,   // primer hito
        step: 5000,        // a partir del 2do

        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },
            { upTo: Infinity, base: 1000, increase: 100, max: 5000 },

        ],
    },

    //ORO GASTADO
    goldSpentMilestones: {

        claimed: [],
        firstStep: 5000,   // primer hito
        step: 10000,           // cada X oro gastado
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },
            { upTo: Infinity, base: 1000, increase: 100, max: 1500 },
        ],
    },


    //ORO X SEGUNDO
    goldPerSecondMilestones: {
        claimed: [],

        firstStep: 1,   // primer hito
        step: 1,              // segundo hito

        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },
            { upTo: Infinity, base: 1000, increase: 100, max: 1500 },

        ],
    },



    //CLICK HISTÓRICOS
    clickMilestones: {
        claimed: [],
        firstStep: 100,   // primer hito
        step: 500,            //segundo hito 400 click

        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },

            { upTo: Infinity, base: 1000, increase: 100, max: 1500 },
        ],
    },

    //MEJORAR STAMINA HISTÓRICO
    staminaMilestones: {

        claimed: [],
        firstStep: 1,   // primer hito

        step: 1,
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },

            { upTo: Infinity, base: 1000, increase: 100, max: 1500 },
        ],
    },


    //MEJORAR PICO HISTÓRICO
    pickaxeMilestones: {
        claimed: [],
        firstStep: 1,   // primer hito

        step: 1,
        totalTiers: 0,
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 2500 },

            { upTo: Infinity, base: 1000, increase: 300, max: 1500 },
        ],
    },

    //REPAIR HISTÓRICO
    repairMilestones: {
        claimed: [],

        firstStep: 1,   // primer hito
        step: 5,              // segundo hito
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 2500 },

            { upTo: Infinity, base: 1000, increase: 300, max: 1500 },
        ],
    },

    //REFILL STAMINA HISTÓRICO
    refillMilestones: {
        claimed: [],

        firstStep: 1,   // primer hito
        step: 5,              // segundo hito
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 2500 },

            { upTo: Infinity, base: 1000, increase: 300, max: 1500 },
        ],
    },

    coinRewards: {

        // ===== ÚNICOS — se reclaman una vez =====

        // MINAS — primera entrada
        firstBronzeMine: { claimed: false, unlocked: false, reward: 1, label: 'Primera entrada mina bronce' },
        firstIronMine: { claimed: false, unlocked: false, reward: 2, label: 'Primera entrada mina hierro' },
        firstDiamondMine: { claimed: false, unlocked: false, reward: 3, label: 'Primera entrada mina diamante' },

        // MINAS — desbloqueo lvl2
        unlockBronzeLvl2: { claimed: false, unlocked: false, reward: 1, label: 'Desbloquear Mina Bronce II' },
        unlockIronLvl2: { claimed: false, unlocked: false, reward: 2, label: 'Desbloquear Mina Hierro II' },
        unlockDiamondLvl2: { claimed: false, unlocked: false, reward: 3, label: 'Desbloquear Mina Diamante II' },

        // MINAS — desbloqueo lvl3
        unlockBronzeLvl3: { claimed: false, unlocked: false, reward: 2, label: 'Desbloquear Mina Bronce III' },
        unlockIronLvl3: { claimed: false, unlocked: false, reward: 3, label: 'Desbloquear Mina Hierro III' },
        unlockDiamondLvl3: { claimed: false, unlocked: false, reward: 5, label: 'Desbloquear Mina Diamante III' },

        // PICO — cambio de material
        pickaxeBronze: { claimed: false, unlocked: false, reward: 2, label: 'Pico de Bronce' },
        pickaxeMetal: { claimed: false, unlocked: false, reward: 3, label: 'Pico de Metal' },
        pickaxeDiamond: { claimed: false, unlocked: false, reward: 5, label: 'Pico de Diamante' },

        // FORJA — desbloqueo
        forgeBronze: { claimed: false, unlocked: false, reward: 1, label: 'Desbloquear Forja Bronce' },
        forgeIron: { claimed: false, unlocked: false, reward: 1, label: 'Desbloquear Forja Hierro' },
        forgeDiamond: { claimed: false, unlocked: false, reward: 2, label: 'Desbloquear Forja Diamante' },

        // ===== PROGRESIVOS — dan monedas por hito =====

        // TIER DEL PICO
        pickaxeTiers: {
            claimed: [],
            firstStep: 1,
            step: 1,
            label: 'Tiers de pico',
            tiers: [
                { upTo: 5, base: 1, increase: 0, max: 1 },
                { upTo: 10, base: 1, increase: 0, max: 1 },
                { upTo: 20, base: 2, increase: 0, max: 2 },
                { upTo: Infinity, base: 3, increase: 0, max: 3 },
            ],
        },

        // MEJORAS DE FORJA
        forgeUpgrades: {
            claimed: [],
            firstStep: 1,
            step: 1,
            label: 'Mejoras de forja',
            tiers: [
                { upTo: 3, base: 1, increase: 0, max: 1 },
                { upTo: 6, base: 1, increase: 0, max: 1 },
                { upTo: Infinity, base: 2, increase: 0, max: 2 },
            ],
        },
    },

    // ===== RECOMPENSAS DE FRAGMENTOS =====
    fragmentRewards: {
        welcomeBoxer: { claimed: false, unlocked: true, dogId: 'boxer', isForge: false, amount: 100, label: 'Bienvenida — Boxer' },
        welcomePip: { claimed: false, unlocked: true, dogId: 'pip', isForge: true, amount: 100, label: 'Bienvenida — Pip (Forja)' },
        unlockTaverna: { claimed: false, unlocked: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 50 }, { dogId: 'pip', isForge: true, amount: 50 }], label: 'Desbloquea la Taberna' },
        unlockMinas: { claimed: false, unlocked: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 50 }, { dogId: 'pip', isForge: true, amount: 50 }], label: 'Desbloquea las Minas' },
        unlockForja: { claimed: false, unlocked: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 50 }, { dogId: 'pip', isForge: true, amount: 50 }], label: 'Desbloquea la Forja' },
        // ===== CADENA ORO PASIVO =====
        goldPassive5:  { claimed: false, unlocked: false, visible: true, dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Oro pasivo nivel 5' },
        goldPassive10: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 150 }, { dogId: 'rocky', isForge: true, amount: 150 }], label: 'Oro pasivo nivel 10' },
        goldPassive20: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 200 }, { dogId: 'rocky', isForge: true, amount: 200 }], label: 'Oro pasivo nivel 20' },
        goldPassive30: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 250 }, { dogId: 'rocky', isForge: true, amount: 250 }], label: 'Oro pasivo nivel 30' },
        goldPassive40: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 300 }, { dogId: 'rocky', isForge: true, amount: 300 }], label: 'Oro pasivo nivel 40' },
        goldPassive50: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 350 }, { dogId: 'rocky', isForge: true, amount: 350 }], label: 'Oro pasivo nivel 50' },

        // ===== CADENA STAMINA =====
        stamina2:  { claimed: false, unlocked: false, visible: true, dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Energía nivel 2' },
        stamina5:  { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 150 }, { dogId: 'rocky', isForge: true, amount: 150 }], label: 'Energía nivel 5' },
        stamina10: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 200 }, { dogId: 'rocky', isForge: true, amount: 200 }], label: 'Energía nivel 10' },
        stamina20: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 250 }, { dogId: 'rocky', isForge: true, amount: 250 }], label: 'Energía nivel 20' },
        stamina30: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 300 }, { dogId: 'rocky', isForge: true, amount: 300 }], label: 'Energía nivel 30' },
        stamina50: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 350 }, { dogId: 'rocky', isForge: true, amount: 350 }], label: 'Energía nivel 50' },

        // ===== CADENA MINAS =====
        unlockMineBronze:  { claimed: false, unlocked: false, visible: true, dogs: [{ dogId: 'chihuahua', isForge: false, amount: 100 }, { dogId: 'rex', isForge: true, amount: 100 }], label: 'Desbloquea la mina de bronce' },
        unlockMineIron:    { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'chihuahua', isForge: false, amount: 150 }, { dogId: 'rex', isForge: true, amount: 150 }], label: 'Desbloquea la mina de hierro' },
        unlockMineDiamond: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'chihuahua', isForge: false, amount: 200 }, { dogId: 'rex', isForge: true, amount: 200 }], label: 'Desbloquea la mina de diamante' },

        // ===== CADENA MENAS CONSEGUIDAS =====
        bronze300:  { claimed: false, unlocked: false, visible: true, dogs: [{ dogId: 'boxer', isForge: false, amount: 200 }, { dogId: 'pip', isForge: true, amount: 200 }], label: 'Consigue 300 de bronce' },
        iron300:    { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 250 }, { dogId: 'pip', isForge: true, amount: 250 }], label: 'Consigue 300 de hierro' },
        diamond300: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 300 }, { dogId: 'pip', isForge: true, amount: 300 }], label: 'Consigue 300 de diamante' },

        // ===== CADENA HORNOS =====
        forgeUnlockBronze:  { claimed: false, unlocked: false, visible: true, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Desbloquea el horno de bronce' },
        forgeUnlockIron:    { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 20, isForge: true }, { rarity: 'epic', amount: 15, isForge: true }, { rarity: 'legendary', amount: 8, isForge: true }], label: 'Desbloquea el horno de hierro' },
        forgeUnlockDiamond: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 25, isForge: true }, { rarity: 'epic', amount: 20, isForge: true }, { rarity: 'legendary', amount: 10, isForge: true }], label: 'Desbloquea el horno de diamante' },

        // ===== CADENA LINGOTES =====
        smelt50Bronze:  { claimed: false, unlocked: false, visible: true, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Funde 50 lingotes de bronce' },
        smelt50Iron:    { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 20, isForge: true }, { rarity: 'epic', amount: 15, isForge: true }, { rarity: 'legendary', amount: 8, isForge: true }], label: 'Funde 50 lingotes de hierro' },
        smelt50Diamond: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 25, isForge: true }, { rarity: 'epic', amount: 20, isForge: true }, { rarity: 'legendary', amount: 10, isForge: true }], label: 'Funde 50 lingotes de diamante' },
        set4Miner1Star: { claimed: false, unlocked: false, visible: true, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube un minero a 1 estrella' },
        set4Miner2Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 20 }, { rarity: 'epic', amount: 15 }, { rarity: 'legendary', amount: 8 }], label: 'Sube un minero a 2 estrellas' },
        set4Miner3Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 25 }, { rarity: 'epic', amount: 20 }, { rarity: 'legendary', amount: 10 }], label: 'Sube un minero a 3 estrellas' },
        set4Miner4Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 30 }, { rarity: 'epic', amount: 25 }, { rarity: 'legendary', amount: 12 }], label: 'Sube un minero a 4 estrellas' },
        set4Miner5Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 40 }, { rarity: 'epic', amount: 30 }, { rarity: 'legendary', amount: 15 }], label: 'Sube un minero a 5 estrellas' },
        set4Forge1Star: { claimed: false, unlocked: false, visible: true, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Sube un perro de forja a 1 estrella' },
        set4Forge2Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 20, isForge: true }, { rarity: 'epic', amount: 15, isForge: true }, { rarity: 'legendary', amount: 8, isForge: true }], label: 'Sube un perro de forja a 2 estrellas' },
        set4Forge3Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 25, isForge: true }, { rarity: 'epic', amount: 20, isForge: true }, { rarity: 'legendary', amount: 10, isForge: true }], label: 'Sube un perro de forja a 3 estrellas' },
        set4Forge4Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 30, isForge: true }, { rarity: 'epic', amount: 25, isForge: true }, { rarity: 'legendary', amount: 12, isForge: true }], label: 'Sube un perro de forja a 4 estrellas' },
        set4Forge5Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 40, isForge: true }, { rarity: 'epic', amount: 30, isForge: true }, { rarity: 'legendary', amount: 15, isForge: true }], label: 'Sube un perro de forja a 5 estrellas' },
        set3FurnaceBronze2: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de bronce a nivel 2' },
        set3FurnaceBronze3: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de bronce a nivel 3' },
        set3FurnaceIron2:   { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de hierro a nivel 2' },
        set3FurnaceIron3:   { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de hierro a nivel 3' },
        set3FurnaceDiamond2:{ claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de diamante a nivel 2' },
        set3FurnaceDiamond3:{ claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de diamante a nivel 3' },
    },

    hasUnclaimed: false,      // si hay alguna sin reclamar (btn brilla)
};

export default InitialRewardsState;