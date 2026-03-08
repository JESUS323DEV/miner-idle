import MinesConfig from "../MinesConfig";
import { SnacksConfig } from "../initialState/snacksGold/snacksConfig.js";
import { CombosConfig } from "../CombosConfig.js";
import { AutomineConfig } from "../AutomineConfig.js";
import { ForgeConfig } from '../config/ForgeConfig';

export const useGameActions = (setGameState) => {

    // ========== ORO POR SEGUNDO ==========
    // Compra upgrade → +1 oro/seg, sube coste siguiente
    const handleBuyGoldPerSecondUpgrade = () => {
        setGameState(prevState => {
            if (prevState.gold < prevState.goldPerSecondCost) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - prevState.goldPerSecondCost,
                goldPerSecond: prevState.goldPerSecond + 1,
                goldPerSecondLevel: prevState.goldPerSecondLevel + 1,
                goldPerSecondCost: prevState.goldPerSecondCost + prevState.goldPerSecondCostIncrease,
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
    const handleMineClick = () => {
        setGameState(prevState => {
            const now = Date.now();
            const timeSinceLastClick = prevState.lastClickTime
                ? now - prevState.lastClickTime
                : 0;

            // Calcula combo actual
            let newCombo;
            if (prevState.comboCount === 0) {
                newCombo = 1;
            } else if (timeSinceLastClick > CombosConfig.resetTime) {
                newCombo = 1;
            } else {
                newCombo = prevState.comboCount + 1;
            }

            const newMaxCombo = Math.max(newCombo, prevState.maxComboEver);

            // Sin recursos → solo actualiza combo
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) {
                return {
                    ...prevState,
                    comboCount: newCombo,
                    maxComboEver: newMaxCombo,
                    lastClickTime: now
                };
            }

            // Verifica si es hito de combo (20, 25, 30...)
            const isMultipleOf5 = newCombo >= CombosConfig.firstMilestone &&
                newCombo % CombosConfig.milestoneInterval === 0;
            const isNewMilestone = isMultipleOf5 && !prevState.comboMilestones[newCombo];

            let bonusGold = 0;
            let updatedMilestones = prevState.comboMilestones;

            if (isMultipleOf5 && prevState.comboMilestones[newCombo] !== undefined) {
                if (isNewMilestone) {
                    bonusGold = newCombo * 4;
                    updatedMilestones = {
                        ...prevState.comboMilestones,
                        [newCombo]: true
                    };
                } else {
                    bonusGold = Math.floor(newCombo * 4 * 0.2);
                }
            }

            // Calcula bonus final según config
            if (isMultipleOf5 && prevState.comboMilestones[newCombo] !== undefined) {
                if (isNewMilestone) {
                    bonusGold = newCombo * CombosConfig.bonusMultiplier;
                    console.log('🔥 HITO ALCANZADO:', newCombo, '| Bonus:', bonusGold);
                    updatedMilestones = {
                        ...prevState.comboMilestones,
                        [newCombo]: true
                    };
                } else {
                    bonusGold = Math.floor(newCombo * CombosConfig.bonusMultiplier * CombosConfig.bonusRepeated);
                    console.log('✅ Hito repetido:', newCombo, '| Bonus:', bonusGold);
                }
            }

            console.log('💰 Oro total sumado:', prevState.goldPerMine + bonusGold);

            return {
                ...prevState,
                gold: prevState.gold + prevState.goldPerMine + bonusGold,
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
            };
        });
    };

    // ========== MINADO AUTOMÁTICO ==========
    // Usado por useAutoMining — igual que handleMineClick pero sin combos
    const handleMine = () => {
        setGameState(prevState => {
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) {
                return prevState;
            }

            return {
                ...prevState,
                gold: prevState.gold + prevState.goldPerMine,
                stamina: prevState.stamina - 1,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - 1
                }
            };
        });
    };

    // ========== STAMINA ==========
    // Upgrade → +5 stamina máxima, sube coste siguiente
    const handleBuyMaxStaminaUpgrade = () => {
        setGameState(prevState => {
            const isFree = !prevState.tutorial?.staminaUpgradeDone;
            const cost = isFree ? 0 : prevState.maxStaminaCost;

            if (!isFree && prevState.gold < cost) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - cost,
                maxStamina: prevState.maxStamina + 5,
                stamina: prevState.maxStamina + 5,
                maxStaminaLevel: prevState.maxStaminaLevel + 1,
                maxStaminaCost: prevState.maxStaminaCost + prevState.maxStaminaCostIncrease,
                staminaRefillCost: prevState.staminaRefillCost + 10,
                tutorial: prevState.tutorial ? {
                    ...prevState.tutorial,
                    staminaUpgradeDone: true,
                    currentStep: 2
                } : prevState.tutorial
            };
        });
    };

    // Recarga stamina al máximo pagando staminaRefillCost
    const handleRefillStamina = () => {
        setGameState(prevState => {
            if (prevState.stamina >= prevState.maxStamina) return prevState;
            if (prevState.gold < prevState.staminaRefillCost) return prevState;

            const newGold = prevState.gold - prevState.staminaRefillCost;

            console.log('🔍 Gold antes:', prevState.gold);
            console.log('🔍 Coste:', prevState.staminaRefillCost);
            console.log('🔍 Gold después:', newGold);

            return {
                ...prevState,
                gold: newGold,
                stamina: prevState.maxStamina,
            };
        });
    };

    // ========== PICO ==========
    // Repara durabilidad al máximo pagando repairCost
    const handleRepairPickaxe = () => {
        setGameState(prevState => {
            if (prevState.pickaxe.durability >= prevState.pickaxe.maxDurability) return prevState;
            if (prevState.gold < prevState.pickaxe.repairCost) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - prevState.pickaxe.repairCost,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.maxDurability,
                }
            };
        });
    };

    // Sube tier del pico (0→1→2→3) → +5 maxDurabilidad por tier
    const handleUpgradePickaxeTier = () => {
        setGameState(prevState => {
            if (prevState.pickaxe.tier >= 3) return prevState;

            const isFree = false;
            const cost = isFree ? 0 : prevState.pickaxe.tierUpgradeCost;
            const currentTier = prevState.pickaxe.tier;

            // Coste de lingotes según tier actual
            const ingotCost = prevState.pickaxe.tierIngotCosts?.[currentTier];
            const ingotType = ingotCost?.type;
            const ingotAmount = ingotCost?.amount || 0;

            if (!isFree && prevState.gold < cost) return prevState;
            if (!isFree && ingotType && prevState[ingotType] < ingotAmount) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - cost,
                [ingotType]: ingotType ? prevState[ingotType] - ingotAmount : prevState[ingotType],
                pickaxe: {
                    ...prevState.pickaxe,
                    tier: currentTier + 1,
                    maxDurability: prevState.pickaxe.maxDurability + 5,
                    durability: prevState.pickaxe.maxDurability + 5,
                    repairCost: prevState.pickaxe.repairCost + 5,
                    tierUpgradeCost: prevState.pickaxe.tierUpgradeCost + 500,
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
    // Cambia material del pico (stone→bronze→metal→diamond) — requiere tier 3 + lingotes
    const handleUpgradePickaxeMaterial = () => {
        setGameState(prevState => {
            if (prevState.pickaxe.tier !== 3) return prevState;

            let newMaterial, newGoldPerMine, materialCost, materialType;

            if (prevState.pickaxe.material === "stone") {
                newMaterial = "bronze"; newGoldPerMine = 8; materialCost = 5; materialType = "bronzeIngot";
            } else if (prevState.pickaxe.material === "bronze") {
                newMaterial = "metal"; newGoldPerMine = 12; materialCost = 3; materialType = "ironIngot";
            } else if (prevState.pickaxe.material === "metal") {
                newMaterial = "diamond"; newGoldPerMine = 20; materialCost = 2; materialType = "diamondIngot";
            }

            if (prevState.gold < prevState.pickaxe.materialUpgradeCost ||
                prevState[materialType] < materialCost) {
                return prevState;
            }

            return {
                ...prevState,
                gold: prevState.gold - prevState.pickaxe.materialUpgradeCost,
                [materialType]: prevState[materialType] - materialCost,
                goldPerMine: newGoldPerMine,
                pickaxe: {
                    ...prevState.pickaxe,
                    material: newMaterial,
                    tier: 0,
                    goldPerMine: newGoldPerMine,
                    repairCost: prevState.pickaxe.repairCost + 20,
                }
            };
        });
    };

    // ========== LADY (TODO) ==========
    // Placeholder — dar comida a Lady activa buffs temporales
    const handleFeedLady = () => {
        // TODO: reducir hambre, aumentar mood, activar buffs, consumir inventario
    };

    // ========== MINAS ==========
    // Desbloquea tipo de mina pagando unlockCost
    const handleUnlockMineType = (mineType) => {
        setGameState(prevState => {
            if (prevState.mines.unlockedTypes.includes(mineType)) return prevState;

            const cost = MinesConfig[mineType]?.unlockCost;
            const baseBiome = mineType.replace('_lvl2', '').replace('_lvl3', '');
            if (cost === undefined) return prevState;
            if (prevState.gold < cost) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - cost,
                mines: {
                    ...prevState.mines,
                    unlockedTypes: [...prevState.mines.unlockedTypes, mineType],
                    unlockedBiomes: prevState.mines.unlockedBiomes?.includes(baseBiome)
                        ? prevState.mines.unlockedBiomes
                        : [...(prevState.mines.unlockedBiomes || []), baseBiome]
                }
            };
        });
    };

    // Entra a una mina → genera venas según MinesConfig
    const handleEnterMine = (mineType) => {
        setGameState(prevState => {
            console.log('unlockedBiomes:', prevState.mines.unlockedBiomes);
            console.log('gold:', prevState.gold);
            console.log('unlockCost:', MinesConfig[mineType]?.unlockCost);
            const baseBiome = mineType.replace('_lvl2', '').replace('_lvl3', '');
            if (!prevState.mines.unlockedBiomes?.includes(baseBiome)) return prevState;
            if (prevState.mines.currentMine?.mineType === mineType) return prevState;

            const config = MinesConfig[mineType];
            if (prevState.gold < config.unlockCost) return prevState;

            const numVeins = Math.floor(
                Math.random() * (config.baseVeinsCount.max - config.baseVeinsCount.min + 1)
            ) + config.baseVeinsCount.min;

            const veins = Array.from({ length: numVeins }, (_, i) => {
                const capacity = Math.floor(
                    Math.random() * (config.baseVeinCapacity.max - config.baseVeinCapacity.min + 1)
                ) + config.baseVeinCapacity.min;
                return { id: i + 1, remaining: capacity, max: capacity };
            });

            return {
                ...prevState,
                gold: prevState.gold - config.unlockCost,
                mines: {
                    ...prevState.mines,
                    currentMine: {
                        mineType,
                        veins,
                        resourcesGathered: { bronze: 0, iron: 0, diamond: 0 },
                        clicksCount: 0,
                        enteredAt: Date.now(),
                        eventsTriggered: []
                    }
                }
            };
        });
    };

    // Descarta mina del mapa — si estás dentro también limpia currentMine
    const handleDiscardMine = (mineType) => {
        setGameState(prevState => {
            return {
                ...prevState,
                mines: {
                    ...prevState.mines,
                    unlockedTypes: prevState.mines.unlockedTypes.filter(t => t !== mineType),
                    currentMine: prevState.mines.currentMine?.mineType === mineType
                        ? null
                        : prevState.mines.currentMine
                }
            };
        });

        console.log(`Mina de ${mineType} descartada.`);
    };

    // ========== MINADO EN MINAS ==========
    // Click en vena → genera material aleatorio según yields del pico, consume stamina/durabilidad
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

            const materialGained = Math.floor(
                Math.random() * (yieldRange.max - yieldRange.min + 1)
            ) + yieldRange.min;

            const updatedVeins = [...prevState.mines.currentMine.veins];
            updatedVeins[veinIndex] = { ...vein, remaining: vein.remaining - 1 };

            return {
                ...prevState,
                stamina: prevState.stamina - 1,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - 1
                },
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

    // Sale de mina → si completó cobra materiales + bonus estrellas, si no mantiene progreso
    const handleExitMine = () => {
        setGameState(prevState => {
            if (!prevState.mines.currentMine) return prevState;

            const currentMine = prevState.mines.currentMine;
            const mineType = currentMine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');
            const materialsGathered = currentMine.resourcesGathered[baseMineType];

            console.log('🔍 DEBUG handleExitMine:');
            console.log('mineType:', mineType);
            console.log('baseMineType:', baseMineType);
            console.log('resourcesGathered:', currentMine.resourcesGathered);
            console.log('materialsGathered:', materialsGathered);

            const allVeinsEmpty = currentMine.veins.every(vein => vein.remaining === 0);

            // Calcula estrellas y bonus si completó
            let speedBonus = 0;
            let starsEarned = 0;

            if (allVeinsEmpty) {
                let perfectThreshold, goodThreshold;

                if (mineType.includes('_lvl3')) {
                    perfectThreshold = 300; goodThreshold = 200;
                } else if (mineType.includes('_lvl2')) {
                    perfectThreshold = 200; goodThreshold = 150;
                } else {
                    perfectThreshold = 100; goodThreshold = 50;
                }

                if (materialsGathered >= perfectThreshold) {
                    speedBonus = Math.floor(materialsGathered * 0.5); starsEarned = 3;
                } else if (materialsGathered >= goodThreshold) {
                    speedBonus = Math.floor(materialsGathered * 0.25); starsEarned = 2;
                } else {
                    starsEarned = 1;
                }
            }

            const totalMaterials = materialsGathered + speedBonus;
            const currentBest = prevState.mines.bestScores?.[baseMineType] || 0;

            // Verifica si desbloquea siguiente nivel
            let shouldUnlockNext = false;
            let nextLevelType = null;

            if (!mineType.includes('_lvl')) {
                shouldUnlockNext = starsEarned >= 2 && starsEarned > currentBest;
                nextLevelType = `${baseMineType}_lvl2`;
            } else if (mineType.includes('_lvl2')) {
                shouldUnlockNext = starsEarned >= 3 && starsEarned > currentBest;
                nextLevelType = `${baseMineType}_lvl3`;
            }

            return {
                ...prevState,
                [baseMineType]: allVeinsEmpty
                    ? prevState[baseMineType] + totalMaterials
                    : prevState[baseMineType],
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

        console.log('Saliste de la mina.');
    };

    // ========== TUTORIAL ==========
    // Avanza el tutorial al paso indicado
    const handleTutorialStep = (step) => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: { ...prevState.tutorial, currentStep: step }
        }));
    };

    // Desbloquea una feature del tutorial (stamina, pickaxe, mines...)
    const handleUnlockTutorialFeature = (feature) => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: { ...prevState.tutorial, [`${feature}Unlocked`]: true }
        }));
    };

    // Marca el tutorial como completado
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

            // Solo un snack activo a la vez
            const hasActiveSnack = Object.values(prevState.snacks).some(s => s.active !== null);
            if (hasActiveSnack) return prevState;

            const useCost = SnacksConfig[snackType].use.cost;
            if (prevState.tavernCoins < useCost) return prevState;

            const effects = SnacksConfig[snackType].effects[`level${snack.level}`];

            // Calcula bonus RNG o fijo
            let goldBonus;
            if (effects.goldPerSecond.min !== undefined) {
                goldBonus = Math.floor(
                    Math.random() * (effects.goldPerSecond.max - effects.goldPerSecond.min + 1)
                ) + effects.goldPerSecond.min;
            } else {
                goldBonus = effects.goldPerSecond;
            }

            // Bonus lvl3 — puede recargar stamina o reparar pico
            let bonusApplied = null;
            let newState = { ...prevState };

            if (effects.bonus && Math.random() < effects.bonus.chance) {
                const randomBonus = effects.bonus.options[
                    Math.floor(Math.random() * effects.bonus.options.length)
                ];
                bonusApplied = randomBonus;
                if (randomBonus === "refillStamina") {
                    newState.stamina = newState.maxStamina;
                } else if (randomBonus === "repairPickaxe") {
                    newState.pickaxe = { ...newState.pickaxe, durability: newState.pickaxe.maxDurability };
                }
            }

            console.log(`🍪 Galleta usada: +${goldBonus} oro/seg durante ${effects.duration}s`);

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

    // Convierte 1 moneda de taberna en 5000 oro
    const handleConvertCoinsToGold = () => {
        setGameState(prevState => {
            if (prevState.tavernCoins < 1) return prevState;
            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - 1,
                gold: prevState.gold + 5000
            };
        });
    };

    // Desbloquea la taberna pagando 1000 oro
    const handleUnlockTavern = () => {
        setGameState(prevState => {
            if (prevState.gold < 1000) return prevState;
            if (prevState.tavernUnlocked) return prevState;
            return { ...prevState, gold: prevState.gold - 1000, tavernUnlocked: true };
        });
    };

    // ========== AUTOMINE ==========
    // Desbloquea automine permanentemente
    const handleUnlockAutomine = () => {
        setGameState(prevState => {
            if (prevState.gold < AutomineConfig.unlockCost) return prevState;
            if (prevState.automine.unlocked) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - AutomineConfig.unlockCost,
                automine: {
                    ...prevState.automine,
                    unlocked: true,
                    charges: [
                        { available: true, cooldownUntil: null },
                        { available: true, cooldownUntil: null }
                    ]
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
        setGameState(prevState => {
            const cost = ForgeConfig.furnaces[material].unlockCost;
            if (prevState.gold < cost) return prevState;
            if (prevState.furnaces[material].unlocked) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - cost,
                furnaces: {
                    ...prevState.furnaces,
                    [material]: { ...prevState.furnaces[material], unlocked: true }
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
        setGameState(prevState => {
            const furnace = prevState.furnaces[material];
            if (furnace.level >= 3) return prevState;
            if (prevState.gold < 500) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - 500,
                furnaces: {
                    ...prevState.furnaces,
                    [material]: { ...furnace, level: furnace.level + 1 }
                }
            };
        });
    };

    // ========== MAPA DE MINAS ==========
    // Desbloquea el mapa de minas pagando 1000 oro
    const handleUnlockMinesMap = () => {
        setGameState(prevState => {
            if (prevState.gold < 1000) return prevState;
            if (prevState.minesMapUnlocked) return prevState;
            return { ...prevState, gold: prevState.gold - 1000, minesMapUnlocked: true };
        });
    };

    // ========== EXPORTS ==========
    return {
        // Minado
        handleMine,
        handleMineClick,

        // Oro
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
    };
};