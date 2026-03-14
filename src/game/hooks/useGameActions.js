import MinesConfig from "../MinesConfig";
import { SnacksConfig } from "../initialState/snacksGold/snacksConfig.js";
import { CombosConfig } from "../CombosConfig.js";
import { AutomineConfig } from "../AutomineConfig.js";
import { ForgeConfig } from '../config/ForgeConfig';

// ========== HELPER: DETECTA HITOS Y MARCA hasUnclaimed ==========
// Comprueba si el valor actual supera el siguiente hito no reclamado
// y si es así marca hasUnclaimed: true para que el botón brille
const checkMilestone = (milestoneConfig, currentValue) => {
    const { claimed, firstStep, step } = milestoneConfig;
    const nextTarget = claimed.length === 0
        ? firstStep
        : firstStep + step * claimed.length;
    return currentValue >= nextTarget;
};



// ========== HELPER: CALCULA RECOMPENSA DEL SIGUIENTE HITO ==========
const getMilestoneReward = (milestoneConfig) => {
    const { claimed, tiers, rewardBase, rewardIncrease } = milestoneConfig;
    const index = claimed.length;

    if (tiers) {
        const tier = tiers.find(t => index < t.upTo);
        if (!tier) return tiers[tiers.length - 1].max; // fallback al último tier
        const prevUpTo = tiers[tiers.indexOf(tier) - 1]?.upTo || 0;
        const posInTier = index - prevUpTo;
        return Math.min(tier.base + posInTier * tier.increase, tier.max);
    }

    return rewardBase + (index * rewardIncrease);
};

export const useGameActions = (gameState, setGameState, showGoldCost, showTavernCost) => {

    // ========== ORO POR SEGUNDO ==========
    // Compra upgrade → +1 oro/seg, sube coste siguiente
    // Detecta hito de goldPerSecond y stamina level
    const handleBuyGoldPerSecondUpgrade = () => {
        showGoldCost(gameState.goldPerSecondCost);
        setGameState(prevState => {
            if (prevState.gold < prevState.goldPerSecondCost) return prevState;

            const newGoldPerSecond = prevState.goldPerSecond + 1;
            const newGoldSpent = prevState.totalGoldSpent + prevState.goldPerSecondCost;
            const hasGoldPerSecondMilestone = checkMilestone(prevState.rewards.goldPerSecondMilestones, newGoldPerSecond);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - prevState.goldPerSecondCost,
                totalGoldSpent: newGoldSpent,
                goldPerSecond: newGoldPerSecond,
                goldPerSecondLevel: prevState.goldPerSecondLevel + 1,
                goldPerSecondCost: prevState.goldPerSecondCost + prevState.goldPerSecondCostIncrease,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldPerSecondMilestone || hasGoldSpentMilestone,
                },
                tutorial: prevState.tutorial ? {
                    ...prevState.tutorial,
                    goldPerSecondBought: true,
                    currentStep: 1,
                    openStaminaModal: true
                } : prevState.tutorial
            };
        });
    };

    // ========== MINADO MANUAL ==========
    // Click en mena de oro → suma oro, consume stamina/durabilidad, gestiona combos
    // Detecta hitos de clicks, oro acumulado
    const handleMineClick = () => {
        setGameState(prevState => {
            const now = Date.now();
            const timeSinceLastClick = prevState.lastClickTime
                ? now - prevState.lastClickTime
                : 0;

            let newCombo;
            if (prevState.comboCount === 0) {
                newCombo = 1;
            } else if (timeSinceLastClick > CombosConfig.resetTime) {
                newCombo = 1;
            } else {
                newCombo = prevState.comboCount + 1;
            }

            const newMaxCombo = Math.max(newCombo, prevState.maxComboEver);

            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) {
                const newClicks = prevState.totalClicks + 1;
                const hasClickMilestone = checkMilestone(prevState.rewards.clickMilestones, newClicks);
                return {
                    ...prevState,
                    comboCount: newCombo,
                    maxComboEver: newMaxCombo,
                    lastClickTime: now,
                    totalClicks: newClicks,
                    rewards: {
                        ...prevState.rewards,
                        hasUnclaimed: prevState.rewards.hasUnclaimed || hasClickMilestone,
                    }
                };
            }

            const isMultipleOf5 = newCombo >= CombosConfig.firstMilestone &&
                newCombo % CombosConfig.milestoneInterval === 0;
            const isNewMilestone = isMultipleOf5 && !prevState.comboMilestones[newCombo];

            let bonusGold = 0;
            let updatedMilestones = prevState.comboMilestones;

            if (isMultipleOf5 && prevState.comboMilestones[newCombo] !== undefined) {
                if (isNewMilestone) {
                    bonusGold = newCombo * 4;
                    updatedMilestones = { ...prevState.comboMilestones, [newCombo]: true };
                } else {
                    bonusGold = Math.floor(newCombo * 4 * 0.2);
                }
            }

            if (isMultipleOf5 && prevState.comboMilestones[newCombo] !== undefined) {
                if (isNewMilestone) {
                    bonusGold = newCombo * CombosConfig.bonusMultiplier;
                    updatedMilestones = { ...prevState.comboMilestones, [newCombo]: true };
                } else {
                    bonusGold = Math.floor(newCombo * CombosConfig.bonusMultiplier * CombosConfig.bonusRepeated);
                }
            }

            const tierGoldBonus = 1 + (prevState.pickaxe.tier * (prevState.pickaxe.goldBonusPerTier || 0));
            const goldGained = Math.floor(prevState.pickaxe.goldPerMine * tierGoldBonus) + bonusGold;
            const newTotalClicks = prevState.totalClicks + 1;
            const newTotalGoldEarned = prevState.totalGoldEarned + goldGained;

            const hasClickMilestone = checkMilestone(prevState.rewards.clickMilestones, newTotalClicks);
            const hasGoldMilestone = checkMilestone(prevState.rewards.goldMilestones, newTotalGoldEarned);

            return {
                ...prevState,
                gold: prevState.gold + goldGained,
                totalClicks: newTotalClicks,
                totalGoldEarned: newTotalGoldEarned,
                stamina: prevState.stamina - 1,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - 1
                },
                comboCount: newCombo,
                maxComboEver: newMaxCombo,
                lastClickTime: now,
                comboMilestones: updatedMilestones,
                lastComboBonus: bonusGold,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasClickMilestone || hasGoldMilestone,
                }
            };
        });
    };

    // ========== MINADO AUTOMÁTICO ==========
    // Igual que handleMineClick pero sin combos
    // Detecta hito de oro acumulado
    const handleMine = () => {
        setGameState(prevState => {
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) return prevState;

            const newTotalGoldEarned = prevState.totalGoldEarned + prevState.pickaxe.goldPerMine;
            const hasGoldMilestone = checkMilestone(prevState.rewards.goldMilestones, newTotalGoldEarned);

            return {
                ...prevState,
                gold: prevState.gold + prevState.pickaxe.goldPerMine,
                totalGoldEarned: newTotalGoldEarned,
                stamina: prevState.stamina - 1,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - 1
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldMilestone,
                }
            };
        });
    };

    // ========== STAMINA ==========
    // Upgrade → +5 stamina máxima, sube coste siguiente
    // Detecta hito de stamina level y oro gastado
    const handleBuyMaxStaminaUpgrade = () => {
        const isFree = !gameState.tutorial?.staminaUpgradeDone;
        const cost = isFree ? 0 : gameState.maxStaminaCost;
        const coinCost = gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10);
        if (!isFree && cost > 0) showGoldCost(cost);
        if (!isFree && coinCost > 0) showTavernCost(coinCost);

        setGameState(prevState => {
            const isFree = !prevState.tutorial?.staminaUpgradeDone;
            const cost = isFree ? 0 : prevState.maxStaminaCost;
            const coinCost = prevState.maxStaminaLevel < 10 ? 1 : 1 + (prevState.maxStaminaLevel - 10);
            if (!isFree && prevState.tavernCoins < coinCost) return prevState;
            if (!isFree && prevState.gold < cost) return prevState;

            const newStaminaLevel = prevState.maxStaminaLevel + 1;
            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasStaminaMilestone = checkMilestone(prevState.rewards.staminaMilestones, newStaminaLevel);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                maxStamina: prevState.maxStamina + 5,
                stamina: prevState.maxStamina + 5,
                maxStaminaLevel: newStaminaLevel,
                maxStaminaCost: prevState.maxStaminaCost + prevState.maxStaminaCostIncrease,
                staminaRefillCost: prevState.staminaRefillCost + 10,
                tavernCoins: prevState.tavernCoins - (isFree ? 0 : coinCost),
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasStaminaMilestone || hasGoldSpentMilestone,
                },
                tutorial: prevState.tutorial ? {
                    ...prevState.tutorial,
                    staminaUpgradeDone: true,
                    currentStep: 2
                } : prevState.tutorial
            };
        });
    };

    // Recarga stamina al máximo pagando staminaRefillCost
    // Detecta hito de recargas y oro gastado
    const handleRefillStamina = () => {
        showGoldCost(gameState.staminaRefillCost);
        setGameState(prevState => {
            if (prevState.stamina >= prevState.maxStamina) return prevState;
            if (prevState.gold < prevState.staminaRefillCost) return prevState;

            const newTotalRefills = prevState.totalRefills + 1;
            const newGoldSpent = prevState.totalGoldSpent + prevState.staminaRefillCost;
            const hasRefillMilestone = checkMilestone(prevState.rewards.refillMilestones, newTotalRefills);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - prevState.staminaRefillCost,
                totalGoldSpent: newGoldSpent,
                totalRefills: newTotalRefills,
                stamina: prevState.maxStamina,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasRefillMilestone || hasGoldSpentMilestone,
                }
            };
        });
    };

    // ========== PICO ==========
    // Repara durabilidad al máximo pagando repairCost
    // Detecta hito de reparaciones y oro gastado
    const handleRepairPickaxe = () => {
        showGoldCost(gameState.pickaxe.repairCost);
        setGameState(prevState => {
            if (prevState.pickaxe.durability >= prevState.pickaxe.maxDurability) return prevState;
            if (prevState.gold < prevState.pickaxe.repairCost) return prevState;

            const newTotalRepairs = prevState.totalRepairs + 1;
            const newGoldSpent = prevState.totalGoldSpent + prevState.pickaxe.repairCost;
            const hasRepairMilestone = checkMilestone(prevState.rewards.repairMilestones, newTotalRepairs);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - prevState.pickaxe.repairCost,
                totalGoldSpent: newGoldSpent,
                totalRepairs: newTotalRepairs,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.maxDurability,
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasRepairMilestone || hasGoldSpentMilestone,
                }
            };
        });
    };

    // Sube tier del pico (0→1→2→3→4→5) → +5 maxDurabilidad, +miningPower
    // Detecta hito de tier pico y oro gastado
    const handleUpgradePickaxeTier = () => {
        setGameState(prevState => {
            if (prevState.pickaxe.tier >= 5) return prevState;

            const isFree = !prevState.tutorial?.pickaxeUpgradeDone;
            const cost = isFree ? 0 : (prevState.pickaxe.tierUpgradeCosts?.[prevState.pickaxe.material] || 0);
            const currentTier = prevState.pickaxe.tier;

            const ingotCost = prevState.pickaxe.tierIngotCosts?.[prevState.pickaxe.material]?.[currentTier];
            const ingotType = ingotCost?.type;
            const ingotAmount = ingotCost?.amount || 0;

            if (!isFree && prevState.gold < cost) return prevState;
            if (!isFree && ingotType && prevState[ingotType] < ingotAmount) return prevState;

            const newTotalTiers = prevState.rewards.pickaxeMilestones.totalTiers + 1;
            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasPickaxeMilestone = checkMilestone(prevState.rewards.pickaxeMilestones, newTotalTiers);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                [ingotType]: ingotType ? prevState[ingotType] - ingotAmount : prevState[ingotType],
                pickaxe: {
                    ...prevState.pickaxe,
                    miningPower: prevState.pickaxe.miningPower + prevState.pickaxe.miningPowerPerTier,
                    tierUpgradeCosts: {
                        ...prevState.pickaxe.tierUpgradeCosts,
                        [prevState.pickaxe.material]: (prevState.pickaxe.tierUpgradeCosts?.[prevState.pickaxe.material] || 0) * 2
                    },
                    tier: currentTier + 1,
                    maxDurability: prevState.pickaxe.maxDurability + 5,
                    durability: prevState.pickaxe.maxDurability + 5,
                    repairCost: prevState.pickaxe.repairCost + 5,
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasPickaxeMilestone || hasGoldSpentMilestone,
                    pickaxeMilestones: {
                        ...prevState.rewards.pickaxeMilestones,
                        totalTiers: newTotalTiers,
                    }
                },
                tutorial: prevState.tutorial ? {
                    ...prevState.tutorial,
                    pickaxeUpgradeDone: true,
                    openPickaxeModal: false,
                    completed: true,
                    currentStep: 3
                } : prevState.tutorial
            };
        });
    };

    // Cambia material del pico (stone→bronze→metal→diamond) — requiere tier 5 + lingotes
    // Detecta hito de oro gastado
    const handleUpgradePickaxeMaterial = () => {
        setGameState(prevState => {
            if (prevState.pickaxe.tier !== 5) return prevState;

            let newMaterial;
            if (prevState.pickaxe.material === "stone") {
                newMaterial = "bronze";
            } else if (prevState.pickaxe.material === "bronze") {
                newMaterial = "metal";
            } else if (prevState.pickaxe.material === "metal") {
                newMaterial = "diamond";
            }

            const newGoldPerMine = prevState.pickaxe.goldPerMineByMaterial[newMaterial];

            const upgradeCost = prevState.pickaxe.materialUpgradeCosts?.[prevState.pickaxe.material];
            const goldCost = upgradeCost?.gold || 0;
            const ingotType = upgradeCost?.ingot?.type;
            const ingotAmount = upgradeCost?.ingot?.amount || 0;

            if (prevState.gold < goldCost || prevState[ingotType] < ingotAmount) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + goldCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - goldCost,
                totalGoldSpent: newGoldSpent,
                [ingotType]: prevState[ingotType] - ingotAmount,
                goldPerMine: newGoldPerMine,
                pickaxe: {
                    ...prevState.pickaxe,
                    material: newMaterial,
                    tier: 0,
                    goldPerMine: newGoldPerMine,
                    repairCost: prevState.pickaxe.repairCost + 20,
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // ========== LADY (TODO) ==========
    const handleFeedLady = () => { };

    // ========== MINAS ==========
    // Desbloquea bioma de mina pagando unlockCost — detecta hito oro gastado
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
                }
            };
        });
    };

    // Entra a una mina → genera venas según MinesConfig — detecta hito oro gastado
    const handleEnterMine = (mineType) => {
        setGameState(prevState => {
            const baseBiome = mineType.replace('_lvl2', '').replace('_lvl3', '');
            if (!prevState.mines.unlockedBiomes?.includes(baseBiome)) return prevState;
            if (prevState.mines.currentMine?.mineType === mineType) return prevState;
            if (prevState.mines.currentMine !== null) return prevState;

            const config = MinesConfig[mineType];
            const isFirstBronzeEntry = !prevState.mines.bronzeFirstEntryDone && mineType === 'bronze';


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
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

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
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // Descarta mina del mapa — si estás dentro también limpia currentMine
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

    // Click en vena → genera material, consume stamina/durabilidad
    const handleMineVein = (veinId) => {
        setGameState(prevState => {
            if (!prevState.mines.currentMine) return prevState;
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) return prevState;

            const veinIndex = prevState.mines.currentMine.veins.findIndex(v => v.id === veinId);
            if (veinIndex === -1) return prevState;

            const vein = prevState.mines.currentMine.veins[veinIndex];
            if (vein.remaining <= 0) return prevState;

            const mineType = prevState.mines.currentMine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');
            const pickaxeMaterial = prevState.pickaxe.material;

            const yieldRange = MinesConfig[mineType]?.yields?.[pickaxeMaterial];
            if (!yieldRange) return prevState;

            const miningPower = prevState.pickaxe.miningPower || 1;
            const baseGain = Math.floor(Math.random() * (yieldRange.max - yieldRange.min + 1)) + yieldRange.min;
            const materialGained = baseGain;
            const updatedVeins = [...prevState.mines.currentMine.veins];
            updatedVeins[veinIndex] = {
                ...vein,
                remaining: Math.max(0, vein.remaining - Math.ceil(miningPower))
            };

            return {
                ...prevState,
                stamina: prevState.stamina - 1,
                pickaxe: { ...prevState.pickaxe, durability: prevState.pickaxe.durability - 1 },
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

    // Sale de mina → cobra materiales + bonus estrellas si completó
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
            const currentBest = prevState.mines.bestScores?.[baseMineType] || 0;

            return {
                ...prevState,
                [baseMineType]: allVeinsEmpty ? prevState[baseMineType] + totalMaterials : prevState[baseMineType],
                lastMineReward: allVeinsEmpty ? { type: baseMineType, amount: totalMaterials } : null,
                mines: {
                    ...prevState.mines,
                    currentMine: allVeinsEmpty ? null : currentMine,
                    bestScores: allVeinsEmpty && starsEarned > currentBest ? {
                        ...prevState.mines.bestScores,
                        [baseMineType]: starsEarned
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

    // ========== TUTORIAL ==========
    const handleTutorialStep = (step) => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: { ...prevState.tutorial, currentStep: step }
        }));
    };

    const handleUnlockTutorialFeature = (feature) => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: { ...prevState.tutorial, [`${feature}Unlocked`]: true }
        }));
    };

    const handleCompleteTutorial = () => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: { ...prevState.tutorial, completed: true, currentStep: 3 }
        }));
    };

    // ========== SNACKS ==========
    // Desbloquea snack permanentemente pagando tavernCoins
    const handleUnlockSnack = (snackType) => {
        setGameState(prevState => {
            const cost = SnacksConfig[snackType].unlock.cost;
            if (prevState.tavernCoins < cost) return prevState;
            if (prevState.snacks[snackType].unlocked) return prevState;

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - cost,
                snacks: {
                    ...prevState.snacks,
                    [snackType]: { ...prevState.snacks[snackType], unlocked: true, level: 1 }
                }
            };
        });
    };

    // Mejora nivel del snack (1→2→3)
    const handleUpgradeSnack = (snackType) => {
        setGameState(prevState => {
            const currentLevel = prevState.snacks[snackType].level;
            if (currentLevel >= 3) return prevState;

            const costKey = currentLevel === 1 ? 'level2' : 'level3';
            const cost = SnacksConfig[snackType].upgrade[costKey];
            if (prevState.tavernCoins < cost) return prevState;

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - cost,
                snacks: {
                    ...prevState.snacks,
                    [snackType]: { ...prevState.snacks[snackType], level: currentLevel + 1 }
                }
            };
        });
    };

    // Usa snack → activa buff temporal de oro/seg con RNG según nivel
    const handleUseSnack = (snackType) => {
        setGameState(prevState => {
            const snack = prevState.snacks[snackType];
            if (!snack.unlocked || snack.level === 0) return prevState;
            if (snack.active !== null) return prevState;

            const hasActiveSnack = Object.values(prevState.snacks).some(s => s.active !== null);
            if (hasActiveSnack) return prevState;

            const useCost = SnacksConfig[snackType].use.cost;
            if (prevState.tavernCoins < useCost) return prevState;

            const effects = SnacksConfig[snackType].effects[`level${snack.level}`];

            let goldBonus;
            if (effects.goldPerSecond.min !== undefined) {
                goldBonus = Math.floor(
                    Math.random() * (effects.goldPerSecond.max - effects.goldPerSecond.min + 1)
                ) + effects.goldPerSecond.min;
            } else {
                goldBonus = effects.goldPerSecond;
            }

            let bonusApplied = null;
            let newState = { ...prevState };

            if (effects.bonus && Math.random() < effects.bonus.chance) {
                const randomBonus = effects.bonus.options[
                    Math.floor(Math.random() * effects.bonus.options.length)
                ];
                bonusApplied = randomBonus;
                if (randomBonus === "refillStamina") newState.stamina = newState.maxStamina;
                else if (randomBonus === "repairPickaxe") {
                    newState.pickaxe = { ...newState.pickaxe, durability: newState.pickaxe.maxDurability };
                }
            }

            return {
                ...newState,
                tavernCoins: newState.tavernCoins - useCost,
                snacks: {
                    ...newState.snacks,
                    [snackType]: {
                        ...snack,
                        active: {
                            startTime: Date.now(),
                            duration: effects.duration,
                            effect: goldBonus,
                            bonusApplied
                        }
                    }
                }
            };
        });
    };

    // ========== TABERNA ==========
    // Convierte lingotes en monedas de taberna
    const handleConvertMaterial = (materialType) => {
        setGameState(prevState => {
            const conversions = {
                bronzeIngot: { amount: 10, coins: 1 },
                ironIngot: { amount: 6, coins: 1 },
                diamondIngot: { amount: 2, coins: 1 }
            };
            const conversion = conversions[materialType];
            if (!conversion) return prevState;
            if (prevState[materialType] < conversion.amount) return prevState;

            return {
                ...prevState,
                [materialType]: prevState[materialType] - conversion.amount,
                tavernCoins: prevState.tavernCoins + conversion.coins
            };
        });
    };

    const handleConvertGoldToIngot = (ingotType) => {
        const costs = {
            bronzeIngot: { gold: 10000, coins: 0 },
            ironIngot: { gold: 20000, coins: 0 },
            diamondIngot: { gold: 0, coins: 1 },
        };
        const cost = costs[ingotType];
        if (cost.gold > 0) showGoldCost(cost.gold);
        if (cost.coins > 0) showTavernCost(cost.coins);
        setGameState(prevState => {
            const costs = {
                bronzeIngot: { gold: 10000, coins: 0 },
                ironIngot: { gold: 20000, coins: 0 },
                diamondIngot: { gold: 0, coins: 1 },
            };

            const cost = costs[ingotType];
            if (!cost) return prevState;
            if (prevState.gold < cost.gold) return prevState;
            if (cost.coins > 0 && prevState.tavernCoins < cost.coins) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - cost.gold,
                tavernCoins: prevState.tavernCoins - cost.coins,
                [ingotType]: prevState[ingotType] + 1,
                totalGoldSpent: prevState.totalGoldSpent + cost.gold,
            };
        });
    };

    // Convierte 1 moneda de taberna en 5000 oro — detecta hito oro acumulado
    const handleConvertCoinsToGold = () => {
        showTavernCost(1);
        setGameState(prevState => {
            if (prevState.tavernCoins < 1) return prevState;

            const newTotalGoldEarned = prevState.totalGoldEarned + 5000;
            const hasGoldMilestone = checkMilestone(prevState.rewards.goldMilestones, newTotalGoldEarned);

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - 1,
                gold: prevState.gold + 5000,
                totalGoldEarned: newTotalGoldEarned,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldMilestone,
                }
            };
        });
    };

    // Desbloquea la taberna pagando 1000 oro
    const handleUnlockTavern = () => {
        setGameState(prevState => {
            if (prevState.gold < 1000) return prevState;
            if (prevState.tavernUnlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + 1000;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - 1000,
                totalGoldSpent: newGoldSpent,
                tavernUnlocked: true,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // ========== AUTOMINE ==========
    // Desbloquea automine permanentemente
    const handleUnlockAutomine = () => {
        showGoldCost(AutomineConfig.unlockCost);
        setGameState(prevState => {
            if (prevState.gold < AutomineConfig.unlockCost) return prevState;
            if (prevState.automine.unlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + AutomineConfig.unlockCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - AutomineConfig.unlockCost,
                totalGoldSpent: newGoldSpent,
                automine: {
                    ...prevState.automine,
                    unlocked: true,
                    charges: [
                        { available: true, cooldownUntil: null },
                        { available: true, cooldownUntil: null }
                    ]
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // Activa automine consumiendo una carga disponible
    const handleActivateAutomine = () => {
        setGameState(prevState => {
            if (!prevState.automine.unlocked) return prevState;
            if (prevState.automine.isActive) return prevState;
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) return prevState;

            const chargeIndex = prevState.automine.charges.findIndex(c => c.available);
            if (chargeIndex === -1) return prevState;

            const cooldownEnd = Date.now() + (AutomineConfig.chargeRecoveryTime * 1000);
            const newCharges = [...prevState.automine.charges];
            newCharges[chargeIndex] = { available: false, cooldownUntil: cooldownEnd };

            return {
                ...prevState,
                automine: { ...prevState.automine, charges: newCharges, isActive: true }
            };
        });
    };

    // Detiene automine
    const handleStopAutomine = () => {
        setGameState(prevState => ({
            ...prevState,
            automine: { ...prevState.automine, isActive: false }
        }));
    };

    // ========== FORJA ==========
    // Desbloquea horno pagando unlockCost
    const handleUnlockFurnace = (material) => {
        showGoldCost(ForgeConfig.furnaces[material].unlockCost);
        setGameState(prevState => {
            const cost = ForgeConfig.furnaces[material].unlockCost;
            if (prevState.gold < cost) return prevState;
            if (prevState.furnaces[material].unlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                furnaces: {
                    ...prevState.furnaces,
                    [material]: { ...prevState.furnaces[material], unlocked: true }
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // Inicia fundición — consume materiales y arranca el timer
    const handleStartSmelt = (material) => {
        setGameState(prevState => {
            const furnace = prevState.furnaces[material];
            const recipe = ForgeConfig.furnaces[material].recipes;
            if (!furnace.unlocked) return prevState;
            if (furnace.isActive) return prevState;
            if (prevState[recipe.input] < recipe.inputAmount) return prevState;

            return {
                ...prevState,
                [recipe.input]: prevState[recipe.input] - recipe.inputAmount,
                furnaces: {
                    ...prevState.furnaces,
                    [material]: { ...furnace, isActive: true, startTime: Date.now(), progress: 0 }
                }
            };
        });
    };

    // Recoge lingote al terminar — si hay material suficiente reinicia automáticamente
    const handleCollectIngot = (material) => {
        setGameState(prevState => {
            const furnace = prevState.furnaces[material];
            if (!furnace.isActive) return prevState;

            const duration = ForgeConfig.furnaces[material].levels[furnace.level] * 1000;
            if (Date.now() - furnace.startTime < duration) return prevState;

            const recipe = ForgeConfig.furnaces[material].recipes;
            const hasMore = prevState[recipe.input] >= recipe.inputAmount;

            return {
                ...prevState,
                [recipe.output]: prevState[recipe.output] + 1,
                [recipe.input]: hasMore ? prevState[recipe.input] - recipe.inputAmount : prevState[recipe.input],
                furnaces: {
                    ...prevState.furnaces,
                    [material]: {
                        ...furnace,
                        isActive: hasMore,
                        startTime: hasMore ? Date.now() : null,
                        progress: 0
                    }
                }
            };
        });
    };

    // Mejora nivel del horno (1→2→3) → reduce tiempo de fundición
    const handleUpgradeFurnace = (material) => {
        const upgradeCost = ForgeConfig.furnaces[material].upgradeCosts[gameState.furnaces[material].level];
        showGoldCost(upgradeCost);
        setGameState(prevState => {
            const furnace = prevState.furnaces[material];
            const upgradeCost = ForgeConfig.furnaces[material].upgradeCosts[furnace.level];
            if (furnace.level >= ForgeConfig.furnaces[material].maxLevel) return prevState;
            if (prevState.gold < upgradeCost) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + upgradeCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - upgradeCost,
                totalGoldSpent: newGoldSpent,
                furnaces: {
                    ...prevState.furnaces,
                    [material]: { ...furnace, level: furnace.level + 1 }
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
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

    // ========== RECOMPENSAS ==========
    // Reclama el siguiente hito disponible de un tipo de recompensa
    // Suma el oro de la recompensa y marca el hito como reclamado
    const handleClaimReward = (milestoneKey) => {
        setGameState(prevState => {
            const milestone = prevState.rewards[milestoneKey];
            if (!milestone) return prevState;

            // Obtiene el valor actual según el tipo de hito
            const currentValues = {
                goldMilestones: prevState.totalGoldEarned,
                goldSpentMilestones: prevState.totalGoldSpent,
                goldPerSecondMilestones: prevState.goldPerSecond,
                clickMilestones: prevState.totalClicks,
                staminaMilestones: prevState.maxStaminaLevel,
                pickaxeMilestones: prevState.rewards.pickaxeMilestones.totalTiers,
                repairMilestones: prevState.totalRepairs,
                refillMilestones: prevState.totalRefills,
            };

            const currentValue = currentValues[milestoneKey];
            const nextMilestoneValue = milestone.claimed.length === 0
                ? milestone.firstStep
                : milestone.firstStep + milestone.step * milestone.claimed.length;

            // Verifica que realmente se puede reclamar
            if (currentValue < nextMilestoneValue) return prevState;

            const reward = getMilestoneReward(milestone);
            const newClaimed = [...milestone.claimed, nextMilestoneValue];

            // Comprueba si quedan más hitos sin reclamar tras este
            const allMilestones = {
                ...prevState.rewards,
                [milestoneKey]: { ...milestone, claimed: newClaimed }
            };
            const stillHasUnclaimed = Object.entries(allMilestones).some(([key, m]) => {
                if (key === 'hasUnclaimed') return false;
                if (key === 'pickaxeMilestones') {
                    return checkMilestone(m, prevState.rewards.pickaxeMilestones.totalTiers);
                }
                return checkMilestone(m, currentValues[key]);
            });

            return {
                ...prevState,
                gold: prevState.gold + reward,
                totalGoldEarned: prevState.totalGoldEarned,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: stillHasUnclaimed,
                    [milestoneKey]: {
                        ...milestone,
                        claimed: newClaimed,
                    }
                }
            };
        });
    };


    //====================================================================
    // Planta una mena en un slot vacío — cobra recursos y arranca el timer de crecimiento
    const handlePlantMena = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.unlocked || slot.mena !== null) return prevState;

            const cost = prevState.yacimientos[biome].plantCost;
            if (!cost) return prevState;
            if (prevState[biome] < cost.amount) return prevState;

            const config = prevState.yacimientos[biome].slotConfig[slotId];

            const newMena = {
                type: biome,
                level: 1,
                durability: config.maxDurability,
                maxDurability: config.maxDurability,
                growthTime: config.growthTime,
                plantedAt: Date.now(),
                ready: false,
                repairingUntil: null,
            };
            console.log('config:', config);
            console.log('growthTime:', config.growthTime);
            return {
                ...prevState,
                [biome]: prevState[biome] - cost.amount,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? { ...s, mena: newMena } : s
                        )
                    }
                }
            };
        });
    };

    const handleMineYacimiento = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.mena) return prevState;

            const mena = slot.mena;

            if (mena.repairingUntil && Date.now() < mena.repairingUntil) return prevState;
            const isReady = mena.ready || (Date.now() - mena.plantedAt >= mena.growthTime * 1000);
            if (!isReady) return prevState;

            if (mena.durability <= 0) return prevState;
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) return prevState;

            const miningPower = prevState.pickaxe.miningPower + (prevState.pickaxe.tier * prevState.pickaxe.miningPowerPerTier);
            const baseDrop = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
            const materialGained = Math.floor(baseDrop + (prevState.pickaxe.tier * prevState.pickaxe.miningPowerPerTier));

            const newDurability = mena.durability - 1;

            return {
                ...prevState,
                [biome]: prevState[biome] + materialGained,
                stamina: prevState.stamina - 1,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - 1
                },
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? {
                                ...s,
                                mena: {
                                    ...mena,
                                    ready: true,
                                    durability: newDurability,
                                }
                            } : s
                        )
                    }
                }
            };
        });
    };

    const handleRepairYacimiento = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.mena) return prevState;

            const mena = slot.mena;
            if (mena.durability >= mena.maxDurability) return prevState;

            const config = prevState.yacimientos[biome].slotConfig[slotId];
            if (prevState.gold < config.repairCost) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - config.repairCost,
                totalGoldSpent: prevState.totalGoldSpent + config.repairCost,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? {
                                ...s,
                                mena: {
                                    ...mena,
                                    durability: mena.maxDurability,
                                    repairingUntil: Date.now() + (config.repairCooldown * 1000),
                                }
                            } : s
                        )
                    }
                }
            };
        });
    };

    const handleUnlockYacimientoSlot = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || slot.unlocked) return prevState;

            const cost = prevState.yacimientos[biome].unlockCosts[slotId];
            if (!cost) return prevState;
            if (prevState.gold < cost.gold) return prevState;
            if (prevState[biome] < cost.amount) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + cost.gold;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost.gold,
                [biome]: prevState[biome] - cost.amount,
                totalGoldSpent: newGoldSpent,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? { ...s, unlocked: true } : s
                        )
                    }
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // ========== EXPORTS ==========
    return {
        // Minado manual y automático
        handleMine,
        handleMineClick,

        // Oro por segundo
        handleBuyGoldPerSecondUpgrade,

        // Stamina
        handleBuyMaxStaminaUpgrade,
        handleRefillStamina,

        // Pico
        handleUpgradePickaxeTier,
        handleUpgradePickaxeMaterial,
        handleRepairPickaxe,

        // Lady
        handleFeedLady,

        // Minas
        handleUnlockMineType,
        handleEnterMine,
        handleDiscardMine,
        handleMineVein,
        handleExitMine,

        // Tutorial
        handleTutorialStep,
        handleUnlockTutorialFeature,
        handleCompleteTutorial,

        // Snacks
        handleUnlockSnack,
        handleUpgradeSnack,
        handleUseSnack,

        // Taberna
        handleConvertMaterial,
        handleConvertCoinsToGold,
        handleUnlockTavern,
        handleConvertGoldToIngot,

        // Automine
        handleUnlockAutomine,
        handleActivateAutomine,
        handleStopAutomine,

        // Forja
        handleStartSmelt,
        handleUnlockFurnace,
        handleCollectIngot,
        handleUpgradeFurnace,

        // Mapa
        handleUnlockMinesMap,

        // Recompensas
        handleClaimReward,

        handleUnlockYacimientoSlot,
        handleRepairYacimiento,
        handleMineYacimiento,
        handlePlantMena,

    };
};