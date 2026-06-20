import MinesConfig from '../../config/MinesConfig.js';
import { DogsConfig } from '../../config/DogsConfig.js';
import {
    MineCompanionConfig,
    BIOME_INGOT_KEY,
    getFuryBonus,
    getEarthquakeDamage,
    getElectricRange,
    getWaterRange,
    getFuegoCooldown,
} from '../../config/MineCompanionConfig.js';
import { checkMilestone } from '../helpers/milestoneHelpers.js';

const BONUS_MATERIAL_DURATION = 20000; // 20s

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
    // companionDogId: el perro elegido en la pantalla previa (null = sin ayudante)
    const handleEnterMine = (mineType, companionDogId = null) => {
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

            // Companion: save original assignment, mark as mine companion
            const companionDog = companionDogId ? prevState.dogs[companionDogId] : null;
            const companionOriginalAssignment = companionDog?.assignedTo ?? null;
            const companionCfg = companionDogId ? MineCompanionConfig[companionDogId] : null;
            const companionStars = companionDog?.stars ?? 0;

            // session_speed (chihuahua oscuro): fury applies from start automatically
            const sessionFuryBonus = companionCfg?.ult?.type === 'session_speed'
                ? getFuryBonus(companionDogId, companionStars)
                : 0;

            const newDogs = companionDogId ? {
                ...prevState.dogs,
                [companionDogId]: { ...companionDog, assignedTo: { isMineCompanion: true } }
            } : prevState.dogs;

            return {
                ...prevState,
                dogs: newDogs,
                mines: {
                    ...prevState.mines,
                    bronzeFirstEntryDone: true,
                    currentMine: {
                        mineType,
                        veins,
                        resourcesGathered: { bronze: 0, iron: 0, diamond: 0 },
                        clicksCount: 0,
                        enteredAt: Date.now(),
                        eventsTriggered: [],
                        companion: {
                            dogId: companionDogId,
                            originalAssignment: companionOriginalAssignment,
                        },
                        powers: {
                            bonusActive: false,
                            bonusUntil: null,
                            ultUsed: false,
                            ultActive: false,
                            ultUntil: null,
                            ultCooldownUntil: null,
                            electricActive: false,
                            electricMin: 1,
                            electricMax: 1,
                            furyBonus: sessionFuryBonus,
                            waterMult: 1,
                        },
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
    // fromAutomine=true cuando viene del automine del companion (sin durabilidad, con bonuses)
    const handleMineVein = (veinId, fromAutomine = false) => {
        setGameState(prevState => {
            if (!prevState.mines.currentMine) return prevState;

            const mine = prevState.mines.currentMine;
            const companionId = mine.companion?.dogId ?? null;
            const fromCompanion = fromAutomine && !!companionId;

            // Durabilidad: solo se consume en click manual sin companion
            const skipDurability = fromCompanion || fromAutomine;
            if (!skipDurability && prevState.pickaxe.durability <= 0) return prevState;

            const veinIndex = mine.veins.findIndex(v => v.id === veinId);
            if (veinIndex === -1) return prevState;
            const vein = mine.veins[veinIndex];
            if (vein.remaining <= 0) return prevState;

            const mineType = mine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');
            const pickaxeMaterial = prevState.pickaxe.material;
            const yieldRange = MinesConfig[mineType]?.yields?.[pickaxeMaterial];
            if (!yieldRange) return prevState;

            const miningPower = prevState.pickaxe.miningPowerByMaterial?.[pickaxeMaterial] || 1;
            const baseGain = Math.floor(Math.random() * (yieldRange.max - yieldRange.min + 1)) + yieldRange.min;

            // Burst bonus (solo si el jugador interactúa manualmente — sin companion)
            let burstBonus = 0;
            if (!fromAutomine && prevState.burst?.active) {
                const burstLevel = prevState.maxStaminaLevel ?? 0;
                let bMin = 0, bMax = 1;
                if (burstLevel <= 1) { bMin = 0; bMax = 1; }
                else if (burstLevel <= 5) { bMin = 0; bMax = burstLevel; }
                else if (burstLevel <= 15) { bMin = 0; bMax = 5; }
                else if (burstLevel <= 25) { bMin = 1; bMax = 1; }
                else { bMin = 1; bMax = Math.min(2 + (burstLevel - 26), 5); }
                burstBonus = bMin + Math.floor(Math.random() * (bMax - bMin + 1));
            }

            // Bonuses del companion
            const powers = mine.powers ?? {};
            const now = Date.now();

            // biomeBonus del perro
            const biomeBonus = companionId ? (DogsConfig[companionId]?.biomeBonus?.[baseMineType] ?? 1.0) : 1.0;

            // Electric bounce (session_bounce activo)
            const electricExtra = (fromAutomine && powers.electricActive)
                ? powers.electricMin + Math.floor(Math.random() * (powers.electricMax - powers.electricMin + 1))
                : 0;

            // Water multiplier (once_water activo toda sesión)
            const waterMult = powers.waterMult ?? 1;

            // Bonus material (genérico activable)
            const bonusMult = (powers.bonusActive && powers.bonusUntil && now < powers.bonusUntil) ? 2 : 1;

            const materialGained = Math.round((baseGain + burstBonus + electricExtra) * biomeBonus * waterMult * bonusMult);

            const updatedVeins = [...mine.veins];
            updatedVeins[veinIndex] = {
                ...vein,
                remaining: Math.max(0, vein.remaining - Math.ceil(miningPower))
            };

            return {
                ...prevState,
                pickaxe: skipDurability ? prevState.pickaxe : { ...prevState.pickaxe, durability: prevState.pickaxe.durability - 1 },
                mines: {
                    ...prevState.mines,
                    currentMine: {
                        ...mine,
                        veins: updatedVeins,
                        resourcesGathered: {
                            ...mine.resourcesGathered,
                            [baseMineType]: mine.resourcesGathered[baseMineType] + materialGained
                        },
                        clicksCount: mine.clicksCount + 1,
                    }
                }
            };
        });
    };

    // ========== ACTIVAR PODER: BONUS MATERIAL ==========
    const handleActivateMineBonus = () => {
        setGameState(prevState => {
            const mine = prevState.mines.currentMine;
            if (!mine) return prevState;
            const powers = mine.powers ?? {};
            const now = Date.now();
            if (powers.bonusActive && powers.bonusUntil && now < powers.bonusUntil) return prevState;

            return {
                ...prevState,
                mines: {
                    ...prevState.mines,
                    currentMine: {
                        ...mine,
                        powers: {
                            ...powers,
                            bonusActive: true,
                            bonusUntil: now + BONUS_MATERIAL_DURATION,
                        }
                    }
                }
            };
        });
    };

    // ========== ACTIVAR ULT DEL COMPANION ==========
    const handleActivateMineUlt = () => {
        setGameState(prevState => {
            const mine = prevState.mines.currentMine;
            if (!mine) return prevState;
            const companionId = mine.companion?.dogId;
            if (!companionId) return prevState;

            const companionDog = prevState.dogs[companionId];
            const stars = companionDog?.stars ?? 0;
            const cfg = MineCompanionConfig[companionId]?.ult;
            if (!cfg) return prevState;

            const powers = mine.powers ?? {};
            const now = Date.now();
            const mineType = mine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');

            // cooldown_ingots (fuego): 1 hit inmediato → puede dar lingote, luego cooldown
            if (cfg.type === 'cooldown_ingots') {
                if (powers.ultCooldownUntil && now < powers.ultCooldownUntil) return prevState;

                const cooldown = getFuegoCooldown(companionId, stars);
                const availableVeins = mine.veins.filter(v => v.remaining > 0);
                if (availableVeins.length === 0) return prevState;

                const targetVein = availableVeins[Math.floor(Math.random() * availableVeins.length)];
                const veinIndex = mine.veins.findIndex(v => v.id === targetVein.id);
                const pickaxeMaterial = prevState.pickaxe.material;
                const yieldRange = MinesConfig[mineType]?.yields?.[pickaxeMaterial];
                const materialGained = yieldRange
                    ? Math.floor(Math.random() * (yieldRange.max - yieldRange.min + 1)) + yieldRange.min
                    : 1;
                const miningPower = prevState.pickaxe.miningPowerByMaterial?.[pickaxeMaterial] || 1;
                const biomeBonus = DogsConfig[companionId]?.biomeBonus?.[baseMineType] ?? 1.0;
                const finalMat = Math.round(materialGained * biomeBonus);

                const ingotProc = Math.random() < cfg.chance;
                const ingotKey = BIOME_INGOT_KEY[baseMineType];

                const updatedVeins = mine.veins.map((v, idx) =>
                    idx === veinIndex ? { ...v, remaining: Math.max(0, v.remaining - Math.ceil(miningPower)) } : v
                );

                return {
                    ...prevState,
                    ...(ingotProc ? { [ingotKey]: (prevState[ingotKey] ?? 0) + finalMat } : {}),
                    mines: {
                        ...prevState.mines,
                        currentMine: {
                            ...mine,
                            veins: updatedVeins,
                            clicksCount: mine.clicksCount + 1,
                            resourcesGathered: {
                                ...mine.resourcesGathered,
                                [baseMineType]: mine.resourcesGathered[baseMineType] + (ingotProc ? 0 : finalMat),
                            },
                            powers: {
                                ...powers,
                                ultCooldownUntil: now + cooldown,
                                ultLastVeinId: targetVein.id,
                                ultFireTrigger: (powers.ultFireTrigger ?? 0) + 1,
                                ultLastIngot: ingotProc,
                            }
                        }
                    }
                };
            }

            // once_earthquake (tierra): reduce remaining de todas las venas, da loot por golpes eliminados
            if (cfg.type === 'once_earthquake') {
                if (powers.ultUsed) return prevState;
                const dmg = getEarthquakeDamage(companionId, stars);
                const pickaxeMaterial = prevState.pickaxe.material;
                const yieldRange = MinesConfig[mineType]?.yields?.[pickaxeMaterial];
                const avgYield = yieldRange ? (yieldRange.min + yieldRange.max) / 2 : 1;
                const biomeBonus = DogsConfig[companionId]?.biomeBonus?.[baseMineType] ?? 1.0;
                const waterMult = powers.waterMult ?? 1;

                let totalLoot = 0;
                const updatedVeins = mine.veins.map(v => {
                    const threshold = v.max * dmg;
                    const newRemaining = v.remaining <= threshold
                        ? 0
                        : Math.max(0, Math.floor(v.remaining * (1 - dmg)));
                    const hitsRemoved = v.remaining - newRemaining;
                    totalLoot += Math.round(hitsRemoved * avgYield * biomeBonus * waterMult);
                    return { ...v, remaining: newRemaining };
                });

                return {
                    ...prevState,
                    mines: {
                        ...prevState.mines,
                        currentMine: {
                            mineType: mine.mineType,
                            resourcesGathered: {
                                ...mine.resourcesGathered,
                                [baseMineType]: mine.resourcesGathered[baseMineType] + totalLoot,
                            },
                            clicksCount: mine.clicksCount,
                            enteredAt: mine.enteredAt,
                            eventsTriggered: mine.eventsTriggered,
                            companion: mine.companion,
                            veins: updatedVeins,
                            powers: { ...powers, ultUsed: true }
                        }
                    }
                };
            }

            // session_bounce (electrico): activa el bonus en cada hit del automine, toda la sesión
            if (cfg.type === 'session_bounce') {
                if (powers.electricActive || powers.ultUsed) return prevState;
                const [eMin, eMax] = getElectricRange(companionId, stars);
                return {
                    ...prevState,
                    mines: {
                        ...prevState.mines,
                        currentMine: {
                            ...mine,
                            powers: {
                                ...powers,
                                ultUsed: true,
                                electricActive: true,
                                electricMin: eMin,
                                electricMax: eMax,
                            }
                        }
                    }
                };
            }

            // once_water (agua): multiplica waterMult para toda la sesión
            if (cfg.type === 'once_water') {
                if (powers.ultUsed) return prevState;
                const [wMin, wMax] = getWaterRange(companionId, stars);
                const waterMult = wMin + Math.floor(Math.random() * (wMax - wMin + 1));
                return {
                    ...prevState,
                    mines: {
                        ...prevState.mines,
                        currentMine: {
                            ...mine,
                            powers: {
                                ...powers,
                                ultUsed: true,
                                waterMult,
                            }
                        }
                    }
                };
            }

            // timed_speed (oscuro nupito/zeus): activa fury temporal
            if (cfg.type === 'timed_speed') {
                if (powers.ultActive && powers.ultUntil && now < powers.ultUntil) return prevState;
                const fury = getFuryBonus(companionId, stars);
                return {
                    ...prevState,
                    mines: {
                        ...prevState.mines,
                        currentMine: {
                            ...mine,
                            powers: {
                                ...powers,
                                ultActive: true,
                                ultUntil: now + cfg.duration,
                                furyBonus: fury,
                            }
                        }
                    }
                };
            }

            return prevState;
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

            // Restaurar el companion a su asignación original
            const companionId = currentMine.companion?.dogId;
            const originalAssignment = currentMine.companion?.originalAssignment ?? null;
            const newDogs = companionId ? {
                ...prevState.dogs,
                [companionId]: { ...prevState.dogs[companionId], assignedTo: originalAssignment }
            } : prevState.dogs;

            return {
                ...prevState,
                dogs: newDogs,
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
            if (prevState.gold < 2000) return prevState;
            if (prevState.minesMapUnlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + 2000;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            const fragReward = prevState.rewards.fragmentRewards?.unlockMinas;
            return {
                ...prevState,
                gold: prevState.gold - 2000,
                totalGoldSpent: newGoldSpent,
                minesMapUnlocked: true,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone || true,
                    fragmentRewards: {
                        ...prevState.rewards.fragmentRewards,
                        unlockMinas: fragReward && !fragReward.unlocked
                            ? { ...fragReward, unlocked: true }
                            : fragReward,
                    },
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
        handleActivateMineBonus,
        handleActivateMineUlt,
    };
};
