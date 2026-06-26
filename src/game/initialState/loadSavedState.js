import InitialGameState from './InitialGameState.js';
import InitialPickaxeState from './InitialPickaxeState.js';
import InitialLadyState from './lady/InitialLadyState.js';
import InitialRewardsState from './InitialRewardsState.js';
import InitialYacimientosState from './InitialYacimientosState.js';
import { InitialDogsState } from './InitialDogsState.js';
import { InitialForgeDogsState } from './InitialForgeDogsState.js';
import { InitialRentalState } from './InitialRentalState.js';
import InitialMinesState from './InitialMinesState.js';

const SAVE_KEY = 'ladyHungryGame';

const OBSOLETE_FR_KEYS = [
    'set4Miner1Star','set4Miner2Star','set4Miner3Star','set4Miner4Star','set4Miner5Star',
    'set4Forge1Star','set4Forge2Star','set4Forge3Star','set4Forge4Star','set4Forge5Star',
    'set3FurnaceBronze2','set3FurnaceBronze3','set3FurnaceIron2','set3FurnaceIron3',
    'set3FurnaceDiamond2','set3FurnaceDiamond3',
    'welcomeBoxer','welcomePip',
];

const CHAIN_LEADERS = [
    'goldPassive5','stamina2','unlockMineBronze','bronze300','forgeUnlockBronze','smelt50Bronze',
    'miner1Star','forge1Star','picoTier1','picoMaterialBronze','burst5','automineLevel2',
    'passiveRaids5','dogs1','summons3',
];

const freshState = () => ({
    ...InitialGameState,
    lady: InitialLadyState,
    pickaxe: InitialPickaxeState,
    mines: InitialMinesState,
    rewards: InitialRewardsState,
    yacimientos: InitialYacimientosState,
    dogs: InitialDogsState,
    forgeDogs: InitialForgeDogsState,
    rental: InitialRentalState,
});

export const loadSavedState = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return freshState();

    const loaded = JSON.parse(saved);
    const r = loaded.rental ?? InitialRentalState;

    // Merge fragmentRewards: añade nuevas, elimina obsoletas, fuerza visibilidad de líderes de cadena
    const mergedFR = { ...(loaded.rewards?.fragmentRewards ?? {}) };
    OBSOLETE_FR_KEYS.forEach(k => delete mergedFR[k]);
    Object.keys(InitialRewardsState.fragmentRewards).forEach(k => {
        if (!(k in mergedFR)) mergedFR[k] = InitialRewardsState.fragmentRewards[k];
    });
    CHAIN_LEADERS.forEach(k => {
        if (mergedFR[k] && !mergedFR[k].claimed) mergedFR[k] = { ...mergedFR[k], visible: true };
    });

    // Merge coinRewards: añade nuevas entradas
    const mergedCR = { ...(loaded.rewards?.coinRewards ?? {}) };
    Object.keys(InitialRewardsState.coinRewards).forEach(k => {
        if (!(k in mergedCR)) mergedCR[k] = InitialRewardsState.coinRewards[k];
    });

    // Migración yacimientos
    const savedYac = loaded.yacimientos;
    const yacNeedsReset = !savedYac || Object.values(savedYac).some(
        b => b.slotConfig || b.slots?.some(s => s.mena !== undefined)
    );
    let migratedYac = yacNeedsReset ? InitialYacimientosState : savedYac;
    if (!yacNeedsReset) {
        migratedYac = Object.fromEntries(Object.entries(migratedYac).map(([biome, biomeData]) => [
            biome,
            {
                ...biomeData,
                slots: biomeData.slots.map(s => {
                    if (!s.session) return s;
                    if ('active' in s.session && !('phase' in s.session)) return { ...s, session: null };
                    if (s.session.phase && !s.session.endsAt) return { ...s, session: null };
                    return s;
                }),
            },
        ]));
    }

    // Migración dogs
    const migratedDogs = { ...(loaded.dogs ?? InitialDogsState) };
    Object.keys(migratedDogs).forEach(key => {
        const dog = migratedDogs[key];
        if (!dog || typeof dog !== 'object' || Array.isArray(dog)) return;
        let updated = dog;
        if (!updated.mineCompTimer) {
            updated = { ...updated, mineCompTimer: { remaining: 0, activeFrom: null } };
        }
        // Limpiar cualquier assignedTo desconocido (formatos stale de features eliminadas)
        const a = updated.assignedTo;
        if (a !== null && a !== undefined) {
            const valid =
                typeof a.globalSlot === 'number' ||
                (typeof a.biome === 'string' && typeof a.slotId === 'number') ||
                a.type === 'raid' ||
                typeof a.mineComp === 'string';
            if (!valid) updated = { ...updated, assignedTo: null };
        }
        migratedDogs[key] = updated;
    });

    return {
        ...InitialGameState,
        ...loaded,
        dogs: migratedDogs,
        yacimientos: migratedYac,
        totalExchanges: loaded.totalExchanges ?? 0,
        totalSummons: loaded.totalSummons ?? 0,
        totalBurstUses: loaded.totalBurstUses ?? 0,
        totalPassiveRaids: loaded.totalPassiveRaids ?? 0,
        totalBronzeMined: loaded.totalBronzeMined ?? 0,
        totalIronMined: loaded.totalIronMined ?? 0,
        totalIngotsSmelted: loaded.totalIngotsSmelted ?? 0,
        totalBronzeIngotsSmelted: loaded.totalBronzeIngotsSmelted ?? 0,
        tutorial: {
            ...InitialGameState.tutorial,
            ...(loaded.tutorial ?? {}),
        },
        rental: {
            ...r,
            active: Array.isArray(r.active) ? r.active : (r.active ? [r.active] : []),
        },
        rewards: {
            ...loaded.rewards,
            fragmentRewards: mergedFR,
            coinRewards: mergedCR,
        },
    };
};
