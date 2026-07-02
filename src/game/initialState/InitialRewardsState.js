const InitialRewardsState = {

    //ORO picado CONSEGUIDO HISTÓRICO
    goldMilestones: {
        claimed: [],
        firstStep: 1000,
        step: 5000,
        maxClaims: 30,

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
        firstStep: 5000,
        step: 10000,
        maxClaims: 20,
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
        // ===== UNICAS (oneTime: true — desaparecen al reclamar) =====
        unlockTaverna:  { oneTime: true, claimed: false, unlocked: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 50 }, { dogId: 'pip', isForge: true, amount: 50 }], label: 'Desbloquea la Taberna' },
        unlockMinas:    { oneTime: true, claimed: false, unlocked: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 50 }, { dogId: 'pip', isForge: true, amount: 50 }], label: 'Desbloquea las Minas' },
        unlockForja:    { oneTime: true, claimed: false, unlocked: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 50 }, { dogId: 'pip', isForge: true, amount: 50 }], label: 'Desbloquea la Forja' },
        unlockAutomine: { oneTime: true, claimed: false, unlocked: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea el Autominado' },

        // ===== CADENA 1: ORO PASIVO =====
        goldPassive5:  { claimed: false, unlocked: false, visible: true,  dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Oro pasivo nivel 5' },
        goldPassive10: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Oro pasivo nivel 10' },
        goldPassive20: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Oro pasivo nivel 20' },
        goldPassive30: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Oro pasivo nivel 30' },
        goldPassive40: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Oro pasivo nivel 40' },
        goldPassive50: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'bully', isForge: false, amount: 100 }, { dogId: 'rocky', isForge: true, amount: 100 }], label: 'Oro pasivo nivel 50' },

        // ===== CADENA 3: MINAS =====
        unlockMineBronze:  { claimed: false, unlocked: false, visible: true,  dogs: [{ dogId: 'nupito', isForge: false, amount: 100 }, { dogId: 'rex', isForge: true, amount: 100 }], label: 'Desbloquea la mina de bronce' },
        unlockMineIron:    { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'nupito', isForge: false, amount: 100 }, { dogId: 'rex', isForge: true, amount: 100 }], label: 'Desbloquea la mina de hierro' },
        unlockMineDiamond: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'nupito', isForge: false, amount: 100 }, { dogId: 'rex', isForge: true, amount: 100 }], label: 'Desbloquea la mina de diamante' },

        // ===== CADENA 4: MENAS =====
        bronze300:  { claimed: false, unlocked: false, visible: true,  dogs: [{ dogId: 'boxer', isForge: false, amount: 200 }, { dogId: 'pip', isForge: true, amount: 200 }], label: 'Consigue 300 de bronce' },
        iron300:    { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 200 }, { dogId: 'pip', isForge: true, amount: 200 }], label: 'Consigue 300 de hierro' },
        diamond300: { claimed: false, unlocked: false, visible: false, dogs: [{ dogId: 'boxer', isForge: false, amount: 200 }, { dogId: 'pip', isForge: true, amount: 200 }], label: 'Consigue 300 de diamante' },

        // ===== CADENA 5: HORNOS =====
        forgeUnlockBronze:  { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Desbloquea el horno de bronce' },
        forgeUnlockIron:    { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Desbloquea el horno de hierro' },
        forgeUnlockDiamond: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Desbloquea el horno de diamante' },

        // ===== CADENA 6: LINGOTES =====
        smelt50Bronze:  { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Funde 50 lingotes de bronce' },
        smelt50Iron:    { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Funde 50 lingotes de hierro' },
        smelt50Diamond: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Funde 50 lingotes de diamante' },

        // ===== CADENA 7: ESTRELLAS MINEROS =====
        miner1Star: { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube un minero a 1 estrella' },
        miner2Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube un minero a 2 estrellas' },
        miner3Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube un minero a 3 estrellas' },
        miner4Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube un minero a 4 estrellas' },
        miner5Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Sube un minero a 5 estrellas' },

        // ===== CADENA 8: ESTRELLAS FORJA =====
        forge1Star: { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Sube un perro de forja a 1 estrella' },
        forge2Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Sube un perro de forja a 2 estrellas' },
        forge3Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Sube un perro de forja a 3 estrellas' },
        forge4Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Sube un perro de forja a 4 estrellas' },
        forge5Star: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15, isForge: true }, { rarity: 'epic', amount: 10, isForge: true }, { rarity: 'legendary', amount: 5, isForge: true }], label: 'Sube un perro de forja a 5 estrellas' },

        // ===== CADENA 9: PICO MATERIAL =====
        picoMaterialBronze:  { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Consigue el pico de bronce' },
        picoMaterialIron:    { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Consigue el pico de hierro' },
        picoMaterialDiamond: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Consigue el pico de diamante' },

        // ===== CADENA 11: BURST =====
        burst5:  { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Usa el Burst 5 veces' },
        burst15: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Usa el Burst 15 veces' },
        burst30: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Usa el Burst 30 veces' },
        burst60: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Usa el Burst 60 veces' },

        // ===== CADENA 12: AUTOMINE MEJORA =====
        automineLevel2: { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Mejora el autominado a nivel 2' },
        automineLevel3: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Mejora el autominado a nivel 3' },

        // ===== CADENA 13: RAIDS PASIVAS =====
        passiveRaids5:  { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Manda 5 raids' },
        passiveRaids10: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Manda 10 raids' },
        passiveRaids20: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Manda 20 raids' },
        passiveRaids40: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Manda 40 raids' },
        passiveRaids60: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Manda 60 raids' },

        // ===== CADENA 14: PERROS DESBLOQUEADOS =====
        dogs1:  { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 1 perro' },
        dogs2:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 2 perros' },
        dogs3:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 3 perros' },
        dogs4:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 4 perros' },
        dogs5:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 5 perros' },
        dogs6:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 6 perros' },
        dogs7:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 7 perros' },
        dogs8:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 8 perros' },
        dogs9:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 9 perros' },
        dogs10: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 10 perros' },
        dogs11: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 11 perros' },
        dogs12: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 12 perros' },
        dogs13: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 13 perros' },
        dogs14: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 14 perros' },
        dogs15: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 15 perros' },
        dogs16: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 16 perros' },
        dogs17: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 17 perros' },
        dogs18: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 18 perros' },
        dogs19: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 19 perros' },
        dogs20: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 20 perros' },
        dogs21: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Desbloquea 21 perros' },

        // ===== CADENA 15: INVOCACIONES =====
        summons3:   { claimed: false, unlocked: false, visible: true,  randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 3 invocaciones' },
        summons5:   { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 5 invocaciones' },
        summons10:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 10 invocaciones' },
        summons15:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 15 invocaciones' },
        summons20:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 20 invocaciones' },
        summons25:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 25 invocaciones' },
        summons30:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 30 invocaciones' },
        summons35:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 35 invocaciones' },
        summons40:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 40 invocaciones' },
        summons45:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 45 invocaciones' },
        summons50:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 50 invocaciones' },
        summons55:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 55 invocaciones' },
        summons60:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 60 invocaciones' },
        summons65:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 65 invocaciones' },
        summons70:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 70 invocaciones' },
        summons75:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 75 invocaciones' },
        summons80:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 80 invocaciones' },
        summons85:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 85 invocaciones' },
        summons90:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 90 invocaciones' },
        summons95:  { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 95 invocaciones' },
        summons100: { claimed: false, unlocked: false, visible: false, randomFragments: [{ rarity: 'rare', amount: 15 }, { rarity: 'epic', amount: 10 }, { rarity: 'legendary', amount: 5 }], label: 'Realiza 100 invocaciones' },
    },

    hasUnclaimed: false,      // si hay alguna sin reclamar (btn brilla)
};

export default InitialRewardsState;