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
        goldPassive5: { claimed: false, unlocked: false, visible: false, group: 'set2', dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Mejora el oro pasivo 5 veces' },
        stamina2: { claimed: false, unlocked: false, visible: false, group: 'set2', dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Mejora la energía 2 veces' },
        pickaxeTier2: { claimed: false, unlocked: false, visible: false, group: 'set2', dogs: [{ dogId: 'bully', isForge: false, amount: 150 }, { dogId: 'rocky', isForge: true, amount: 150 }], label: 'Mejora el pico 2 veces' },
        set2Complete: { claimed: false, unlocked: false, visible: false, group: 'set2', groupCloser: true, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Completa los anteriores' },
        set3IronMine: { claimed: false, unlocked: false, visible: false, group: 'set3', dogs: [{ dogId: 'chihuahua', isForge: false, amount: 100 }, { dogId: 'rex', isForge: true, amount: 100 }], label: 'Desbloquea la mina de hierro' },
        set3Iron: { claimed: false, unlocked: false, visible: false, group: 'set3', dogs: [{ dogId: 'boxer', isForge: false, amount: 200 }, { dogId: 'pip', isForge: true, amount: 200 }], label: 'Obtén 500 de hierro en la mina' },
        set3DogMine: { claimed: false, unlocked: false, visible: false, group: 'set3', dogs: [{ dogId: 'bully', isForge: false, amount: 150 }, { dogId: 'rocky', isForge: true, amount: 150 }], label: 'Asigna un ayudante a un yacimiento en la mina' },
        set3ForjaBronze: { claimed: false, unlocked: false, visible: false, group: 'set3', randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Desbloquea el horno de bronce' },
        set3SmeltBronze: { claimed: false, unlocked: false, visible: false, group: 'set3', randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Funde 50 lingotes' },
        set3Complete: { claimed: false, unlocked: false, visible: false, group: 'set3', groupCloser: true, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Completa los anteriores' },
        set4Miner1Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 minero llega a 1 estrella' },
        set4Miner2Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 minero llega a 2 estrellas' },
        set4Miner3Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 minero llega a 3 estrellas' },
        set4Miner4Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 minero llega a 4 estrellas' },
        set4Miner5Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 minero llega a 5 estrellas' },
        set4Forge1Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 perro de forja llega a 1 estrella' },
        set4Forge2Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 perro de forja llega a 2 estrellas' },
        set4Forge3Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 perro de forja llega a 3 estrellas' },
        set4Forge4Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 perro de forja llega a 4 estrellas' },
        set4Forge5Star:     { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: '1 perro de forja llega a 5 estrellas' },
        set4FurnaceBronze2: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de bronce a nivel 2' },
        set4FurnaceBronze3: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de bronce a nivel 3' },
        set4FurnaceIron2:   { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de hierro a nivel 2' },
        set4FurnaceIron3:   { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de hierro a nivel 3' },
        set4FurnaceDiamond2:{ claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de diamante a nivel 2' },
        set4FurnaceDiamond3:{ claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube el horno de diamante a nivel 3' },
    },

    hasUnclaimed: false,      // si hay alguna sin reclamar (btn brilla)
};

export default InitialRewardsState;