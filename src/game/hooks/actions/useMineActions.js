import MinesConfig from '../../config/MinesConfig.js';
import { checkMilestone } from '../helpers/milestoneHelpers.js';

export const useMineActions = (gameState, setGameState, showGoldCost) => {

    // ========== DESBLOQUEAR TIPO DE MINA ==========
    const handleUnlockMineType = (mineType) => {
        const cost = MinesConfig[mineType]?.unlockCost;
        if (cost) showGoldCost(cost);
        setGameState(prevState => {
            if (prevState.mines.unlockedTypes.includes(mineType)) return prevState;
            const cost = MinesConfig[mineType]?.unlockCost;
            const baseBiome = mineType.replace('_lvl2', '').replace('_lvl3', '');
            if (cost === undefined) return prevState;
            if (prevState.gold < cost) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                mines: {
                    ...prevState.mines,
                    unlockedTypes: [...prevState.mines.unlockedTypes, mineType],
                    unlockedBiomes: prevState.mines.unlockedBiomes?.includes(baseBiome)
                        ? prevState.mines.unlockedBiomes
                        : [...(prevState.mines.unlockedBiomes || []), baseBiome]
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                    coinRewards: {
                        ...prevState.rewards.coinRewards,
                        unlockBronzeLvl2: mineType === 'bronze_lvl2'
                            ? { ...prevState.rewards.coinRewards.unlockBronzeLvl2, unlocked: true }
                            : prevState.rewards.coinRewards.unlockBronzeLvl2,
                        unlockBronzeLvl3: mineType === 'bronze_lvl3'
                            ? { ...prevState.rewards.coinRewards.unlockBronzeLvl3, unlocked: true }
                            : prevState.rewards.coinRewards.unlockBronzeLvl3,
                        unlockIronLvl2: mineType === 'iron_lvl2'
                            ? { ...prevState.rewards.coinRewards.unlockIronLvl2, unlocked: true }
                            : prevState.rewards.coinRewards.unlockIronLvl2,
                        unlockIronLvl3: mineType === 'iron_lvl3'
                            ? { ...prevState.rewards.coinRewards.unlockIronLvl3, unlocked: true }
                            : prevState.rewards.coinRewards.unlockIronLvl3,
                        unlockDiamondLvl2: mineType === 'diamond_lvl2'
                            ? { ...prevState.rewards.coinRewards.unlockDiamondLvl2, unlocked: true }
                            : prevState.rewards.coinRewards.unlockDiamondLvl2,
                        unlockDiamondLvl3: mineType === 'diamond_lvl3'
                            ? { ...prevState.rewards.coinRewards.unlockDiamondLvl3, unlocked: true }
                            : prevState.rewards.coinRewards.unlockDiamondLvl3,
                    }
                },
            };
        });
    };

    // ========== ENTRAR A MINA ==========
    const handleEnterMine = (mineType) => {
        setGameState(prevState => {
            const baseBiome = mineType.replace('_lvl2', '').replace('_lvl3', '');
            if (!prevState.mines.unlockedBiomes?.includes(baseBiome)) return prevState;
            if (prevState.mines.currentMine?.mineType === mineType) return prevState;
            if (prevState.mines.currentMine !== null) return prevState;

            const config = MinesConfig[mineType];

            const numVeins = Math.floor(
                Math.random() * (config.baseVeinsCount.max - config.baseVeinsCount.min + 1)
            ) + config.baseVeinsCount.min;

            const veins = Array.from({ length: numVeins }, (_, i) => {
                const capacity = Math.floor(
                    Math.random() * (config.baseVeinCapacity.max - config.baseVeinCapacity.min + 1)
                ) + config.baseVeinCapacity.min;
                return { id: i + 1, remaining: capacity, max: capacity };
            });

            const goldCost = 0;
            const newGoldSpent = prevState.totalGoldSpent + goldCost;

            return {
                ...prevState,
                gold: prevState.gold - goldCost,
                totalGoldSpent: newGoldSpent,
                mines: {
                    ...prevState.mines,
                    bronzeFirstEntryDone: true,
                    currentMine: {
                        mineType,
                        veins,
                        resourcesGathered: { bronze: 0, iron: 0, diamond: 0 },
                        clicksCount: 0,
                        enteredAt: Date.now(),
                        eventsTriggered: []
                    }
                },
                rewards: {
                    ...prevState.rewards,
                    coinRewards: {
                        ...prevState.rewards.coinRewards,
                        firstBronzeMine: baseBiome === 'bronze' && !prevState.rewards.coinRewards.firstBronzeMine.unlocked
                            ? { ...prevState.rewards.coinRewards.firstBronzeMine, unlocked: true }
                            : prevState.rewards.coinRewards.firstBronzeMine,
                        firstIronMine: baseBiome === 'iron' && !prevState.rewards.coinRewards.firstIronMine.unlocked
                            ? { ...prevState.rewards.coinRewards.firstIronMine, unlocked: true }
                            : prevState.rewards.coinRewards.firstIronMine,
                        firstDiamondMine: baseBiome === 'diamond' && !prevState.rewards.coinRewards.firstDiamondMine.unlocked
                            ? { ...prevState.rewards.coinRewards.firstDiamondMine, unlocked: true }
                            : prevState.rewards.coinRewards.firstDiamondMine,
                    }
                },
            };
        });
    };

    // ========== DESCARTAR MINA ==========
    const handleDiscardMine = (mineType) => {
        setGameState(prevState => ({
            ...prevState,
            mines: {
                ...prevState.mines,
                unlockedTypes: prevState.mines.unlockedTypes.filter(t => t !== mineType),
                currentMine: prevState.mines.currentMine?.mineType === mineType
                    ? null
                    : prevState.mines.currentMine
            }
        }));
    };

    // ========== MINAR VENA ==========
    const handleMineVein = (veinId) => {
        setGameState(prevState => {
            if (!prevState.mines.currentMine) return prevState;

            const isToughnessActive = prevState.mineSnacks?.toughness?.activeUntil
                && Date.now() < prevState.mineSnacks.toughness.activeUntil;
            const toughnessProc = isToughnessActive && Math.random() < 0.3;

            const isAutomineActive = prevState.mineSnacks?.automine?.activeUntil
                && Date.now() < prevState.mineSnacks.automine.activeUntil;

            if (!isAutomineActive && (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0)) return prevState;

            const veinIndex = prevState.mines.currentMine.veins.findIndex(v => v.id === veinId);
            if (veinIndex === -1) return prevState;

            const vein = prevState.mines.currentMine.veins[veinIndex];
            if (vein.remaining <= 0) return prevState;

            const mineType = prevState.mines.currentMine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');
            const pickaxeMaterial = prevState.pickaxe.material;

            const yieldRange = MinesConfig[mineType]?.yields?.[pickaxeMaterial];
            if (!yieldRange) return prevState;

            const miningPower = prevState.pickaxe.miningPowerByMaterial?.[prevState.pickaxe.material] || 1;
            const baseGain = Math.floor(Math.random() * (yieldRange.max - yieldRange.min + 1)) + yieldRange.min;
            const materialGained = baseGain;
            const updatedVeins = [...prevState.mines.currentMine.veins];
            updatedVeins[veinIndex] = {
                ...vein,
                remaining: Math.max(0, vein.remaining - Math.ceil(miningPower))
            };

            return {
                ...prevState,
                stamina: (toughnessProc || isAutomineActive) ? prevState.stamina : prevState.stamina - 1,
                pickaxe: (toughnessProc || isAutomineActive) ? prevState.pickaxe : { ...prevState.pickaxe, durability: prevState.pickaxe.durability - 1 },
                mines: {
                    ...prevState.mines,
                    currentMine: {
                        ...prevState.mines.currentMine,
                        veins: updatedVeins,
                        resourcesGathered: {
                            ...prevState.mines.currentMine.resourcesGathered,
                            [baseMineType]: prevState.mines.currentMine.resourcesGathered[baseMineType] + materialGained
                        },
                        clicksCount: prevState.mines.currentMine.clicksCount + 1
                    }
                }
            };
        });
    };

    // ========== SALIR DE MINA ==========
    const handleExitMine = () => {
        setGameState(prevState => {
            if (!prevState.mines.currentMine) return prevState;

            const currentMine = prevState.mines.currentMine;
            const mineType = currentMine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');
            const materialsGathered = currentMine.resourcesGathered[baseMineType];
            const allVeinsEmpty = currentMine.veins.every(vein => vein.remaining === 0);

            let speedBonus = 0;
            let starsEarned = 0;

            if (allVeinsEmpty) {
                const { starThresholds, starBonuses } = MinesConfig[mineType] || MinesConfig[baseMineType];

                if (materialsGathered >= starThresholds.perfect) {
                    speedBonus = Math.floor(materialsGathered * starBonuses.perfect);
                    starsEarned = 3;
                } else if (materialsGathered >= starThresholds.good) {
                    speedBonus = Math.floor(materialsGathered * starBonuses.good);
                    starsEarned = 2;
                } else {
                    starsEarned = 1;
                }
            }

            const totalMaterials = materialsGathered + speedBonus;
            const currentBest = prevState.mines.bestScores?.[mineType] || 0;

            return {
                ...prevState,
                [baseMineType]: allVeinsEmpty ? prevState[baseMineType] + totalMaterials : prevState[baseMineType],
                lastMineReward: allVeinsEmpty ? { type: baseMineType, amount: totalMaterials } : null,
                mines: {
                    ...prevState.mines,
                    currentMine: allVeinsEmpty ? null : currentMine,
                    bestScores: allVeinsEmpty && starsEarned > currentBest ? {
                        ...prevState.mines.bestScores,
                        [mineType]: starsEarned
                    } : prevState.mines.bestScores,
                    unlockedTypes: allVeinsEmpty
                        ? prevState.mines.unlockedTypes.filter(t => t !== mineType)
                        : prevState.mines.unlockedTypes,
                    completedMines: allVeinsEmpty
                        ? [...prevState.mines.completedMines, mineType + '_' + Date.now() + '_' + Math.random()]
                        : prevState.mines.completedMines,
                    totalMinesCompleted: allVeinsEmpty
                        ? prevState.mines.totalMinesCompleted + 1
                        : prevState.mines.totalMinesCompleted,
                    stats: {
                        ...prevState.mines.stats,
                        [baseMineType]: {
                            completed: allVeinsEmpty
                                ? (prevState.mines.stats[baseMineType]?.completed || 0) + 1
                                : prevState.mines.stats[baseMineType]?.completed || 0,
                            totalGathered: allVeinsEmpty
                                ? (prevState.mines.stats[baseMineType]?.totalGathered || 0) + totalMaterials
                                : prevState.mines.stats[baseMineType]?.totalGathered || 0
                        }
                    },
                }
            };
        });
    };

    // ========== MAPA DE MINAS ==========
    const handleUnlockMinesMap = () => {
        setGameState(prevState => {
            if (prevState.gold < 1000) return prevState;
            if (prevState.minesMapUnlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + 1000;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - 1000,
                totalGoldSpent: newGoldSpent,
                minesMapUnlocked: true,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    return {
        handleUnlockMineType,
        handleEnterMine,
        handleDiscardMine,
        handleMineVein,
        handleExitMine,
        handleUnlockMinesMap,
    };
};
