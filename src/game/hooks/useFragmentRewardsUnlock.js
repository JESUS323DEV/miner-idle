import { useEffect } from 'react';

export const useFragmentRewardsUnlock = (gameState, setGameState) => {
    useEffect(() => {
        const fr = gameState.rewards?.fragmentRewards;
        if (!fr) return;

        const bronzeMineUnlocked = gameState.mines?.unlockedBiomes?.includes('bronze') ?? false;
        const ironMineUnlocked   = gameState.mines?.unlockedBiomes?.includes('iron')   ?? false;
        const diamondMineUnlocked= gameState.mines?.unlockedBiomes?.includes('diamond')  ?? false;
        const maxMinerStars = Math.max(0, ...Object.values(gameState.dogs ?? {}).filter(d => d && typeof d === 'object').map(d => d.stars ?? 0));
        const maxForgeStars = Math.max(0, ...Object.values(gameState.forgeDogs ?? {}).filter(d => d && typeof d === 'object').map(d => d.stars ?? 0));
        const totalDogs = Object.values(gameState.dogs ?? {}).filter(d => d?.hired).length
                        + Object.values(gameState.forgeDogs ?? {}).filter(d => d?.hired).length;
        const totalSummons = gameState.totalSummons ?? 0;

        const checks = {
            goldPassive5:  gameState.goldPerSecondLevel >= 5,
            goldPassive10: gameState.goldPerSecondLevel >= 10,
            goldPassive20: gameState.goldPerSecondLevel >= 20,
            goldPassive30: gameState.goldPerSecondLevel >= 30,
            goldPassive40: gameState.goldPerSecondLevel >= 40,
            goldPassive50: gameState.goldPerSecondLevel >= 50,
            unlockMineBronze:  bronzeMineUnlocked,
            unlockMineIron:    ironMineUnlocked,
            unlockMineDiamond: diamondMineUnlocked,
            bronze300:  (gameState.totalBronzeMined ?? 0) >= 300,
            iron300:    (gameState.totalIronMined ?? 0) >= 300,
            diamond300: (gameState.totalDiamondMined ?? 0) >= 300,
            forgeUnlockBronze:  gameState.furnaces?.bronze?.unlocked === true,
            forgeUnlockIron:    gameState.furnaces?.iron?.unlocked === true,
            forgeUnlockDiamond: gameState.furnaces?.diamond?.unlocked === true,
            smelt50Bronze:  (gameState.totalBronzeIngotsSmelted ?? 0) >= 50,
            smelt50Iron:    (gameState.totalIronIngotsSmelted ?? 0) >= 50,
            smelt50Diamond: (gameState.totalDiamondIngotsSmelted ?? 0) >= 50,
            miner1Star: maxMinerStars >= 1,
            miner2Star: maxMinerStars >= 2,
            miner3Star: maxMinerStars >= 3,
            miner4Star: maxMinerStars >= 4,
            miner5Star: maxMinerStars >= 5,
            forge1Star: maxForgeStars >= 1,
            forge2Star: maxForgeStars >= 2,
            forge3Star: maxForgeStars >= 3,
            forge4Star: maxForgeStars >= 4,
            forge5Star: maxForgeStars >= 5,
            picoMaterialBronze:  gameState.pickaxe?.material !== 'stone',
            picoMaterialIron:    gameState.pickaxe?.material === 'metal' || gameState.pickaxe?.material === 'diamond',
            picoMaterialDiamond: gameState.pickaxe?.material === 'diamond',
            // Cadena 10: Pico tier (reserved)
            burst5:  (gameState.totalBurstUses ?? 0) >= 5,
            burst15: (gameState.totalBurstUses ?? 0) >= 15,
            burst30: (gameState.totalBurstUses ?? 0) >= 30,
            burst60: (gameState.totalBurstUses ?? 0) >= 60,
            automineLevel2: (gameState.automineUpgradeLevel ?? 0) >= 1,
            automineLevel3: (gameState.automineUpgradeLevel ?? 0) >= 2,
            passiveRaids5:  (gameState.totalPassiveRaids ?? 0) >= 5,
            passiveRaids10: (gameState.totalPassiveRaids ?? 0) >= 10,
            passiveRaids20: (gameState.totalPassiveRaids ?? 0) >= 20,
            passiveRaids40: (gameState.totalPassiveRaids ?? 0) >= 40,
            passiveRaids60: (gameState.totalPassiveRaids ?? 0) >= 60,
            dogs1: totalDogs >= 1,   dogs2: totalDogs >= 2,   dogs3: totalDogs >= 3,
            dogs4: totalDogs >= 4,   dogs5: totalDogs >= 5,   dogs6: totalDogs >= 6,
            dogs7: totalDogs >= 7,   dogs8: totalDogs >= 8,   dogs9: totalDogs >= 9,
            dogs10: totalDogs >= 10, dogs11: totalDogs >= 11, dogs12: totalDogs >= 12,
            dogs13: totalDogs >= 13, dogs14: totalDogs >= 14, dogs15: totalDogs >= 15,
            dogs16: totalDogs >= 16, dogs17: totalDogs >= 17, dogs18: totalDogs >= 18,
            dogs19: totalDogs >= 19, dogs20: totalDogs >= 20, dogs21: totalDogs >= 21,
            summons3: totalSummons >= 3,   summons5: totalSummons >= 5,
            summons10: totalSummons >= 10, summons15: totalSummons >= 15,
            summons20: totalSummons >= 20, summons25: totalSummons >= 25,
            summons30: totalSummons >= 30, summons35: totalSummons >= 35,
            summons40: totalSummons >= 40, summons45: totalSummons >= 45,
            summons50: totalSummons >= 50, summons55: totalSummons >= 55,
            summons60: totalSummons >= 60, summons65: totalSummons >= 65,
            summons70: totalSummons >= 70, summons75: totalSummons >= 75,
            summons80: totalSummons >= 80, summons85: totalSummons >= 85,
            summons90: totalSummons >= 90, summons95: totalSummons >= 95,
            summons100: totalSummons >= 100,
        };

        const needsUpdate = Object.entries(checks).some(
            ([k, met]) => met && fr[k]?.visible === true && !fr[k]?.unlocked && !fr[k]?.claimed
        );
        if (!needsUpdate) return;
        setGameState(prev => {
            const updated = { ...prev.rewards.fragmentRewards };
            Object.entries(checks).forEach(([k, met]) => {
                if (met && updated[k]?.visible === true && !updated[k]?.unlocked && !updated[k]?.claimed) {
                    updated[k] = { ...updated[k], unlocked: true };
                }
            });
            return { ...prev, rewards: { ...prev.rewards, fragmentRewards: updated } };
        });
    }, [
        gameState.goldPerSecondLevel,
        gameState.mines?.unlockedBiomes,
        gameState.totalBronzeMined,
        gameState.totalIronMined,
        gameState.totalDiamondMined,
        gameState.furnaces?.bronze?.unlocked,
        gameState.furnaces?.iron?.unlocked,
        gameState.furnaces?.diamond?.unlocked,
        gameState.totalBronzeIngotsSmelted,
        gameState.totalIronIngotsSmelted,
        gameState.totalDiamondIngotsSmelted,
        gameState.dogs,
        gameState.forgeDogs,
        gameState.pickaxe?.material,
        gameState.totalBurstUses,
        gameState.automineUpgradeLevel,
        gameState.totalPassiveRaids,
        gameState.totalSummons,
        gameState.rewards?.fragmentRewards,
    ]);
};
