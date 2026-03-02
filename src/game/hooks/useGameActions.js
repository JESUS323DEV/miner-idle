
import MinesConfig from "../MinesConfig";
import { SnacksConfig } from "../initialState/snacksGold/snacksConfig.js";
import { CombosConfig } from "../CombosConfig.js";
import { AutomineConfig } from "../AutomineConfig.js";
import { ForgeConfig } from '../config/ForgeConfig';

export const useGameActions = (setGameState) => {

    // ========== SISTEMA DE ORO POR SEGUNDO ==========

    /**
     * FUNCIÓN: handleBuyGoldPerSecondUpgrade
     * Mejora la producción pasiva de oro (goldPerSecond)
     * 
     * EFECTOS:
     * - Resta oro según el coste actual
     * - Aumenta goldPerSecond en +1
     * - Sube el nivel (solo cosmético/tracking)
     * - Incrementa el coste para la siguiente compra
     */
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
                    openStaminaModal: true  // ← nuevo flag
                } : prevState.tutorial
            };
        });
    };


    const handleMineClick = () => {
        setGameState(prevState => {
            const now = Date.now();
            const timeSinceLastClick = prevState.lastClickTime
                ? now - prevState.lastClickTime
                : 0;

            // ✅ Lógica combo corregida
            let newCombo;
            if (prevState.comboCount === 0) {
                newCombo = 1;  // Primer click
            } else if (timeSinceLastClick > CombosConfig.resetTime) {
                newCombo = 1;  // Reset
            } else {
                newCombo = prevState.comboCount + 1;  // Suma normal
            }

            const newMaxCombo = Math.max(newCombo, prevState.maxComboEver);

            // ✅ Si NO hay stamina, solo actualiza combo
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) {
                return {
                    ...prevState,
                    comboCount: newCombo,
                    maxComboEver: newMaxCombo,
                    lastClickTime: now
                };
            }

            // ✅ Si SÍ hay stamina, calcula todo
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

            // console, combos mena de oro
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
    /**
     * FUNCIÓN: handleMine
     * Ejecuta una picada automática (usada por useAutoMining hook)
     * 
     * NOTA: Es idéntica a handleMineClick pero separada para claridad
     * (handleMineClick = click manual, handleMine = auto-minar)
     * 
     * REQUISITOS:
     * - Stamina > 0
     * - Durabilidad del pico > 0
     * 
     * EFECTOS:
     * - Suma oro según goldPerMine
     * - Resta 1 stamina
     * - Resta 1 durabilidad del pico
     */
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



    // ========== SISTEMA DE STAMINA ==========

    /**
     * FUNCIÓN: handleBuyMaxStaminaUpgrade
     * Aumenta la stamina máxima
     * 
     * EFECTOS:
     * - Resta oro según el coste actual
     * - Aumenta maxStamina en +5
     * - Sube el nivel
     * - Incrementa el coste para la siguiente compra
     * - Incrementa el coste de recargar stamina (+10 oro)
     */
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

    /**
     * FUNCIÓN: handleRefillStamina
     * Recarga la stamina al máximo
     * 
     * REQUISITOS:
     * - Stamina actual < maxStamina (no recarga si ya está llena)
     * - Oro suficiente para pagar el coste
     * 
     * EFECTOS:
     * - Resta oro según staminaRefillCost
     * - Restaura stamina a maxStamina
     * 
     * NOTA: El coste NO sube con cada recarga, solo al mejorar maxStamina
     */
    const handleRefillStamina = () => {
        setGameState(prevState => {
            if (prevState.stamina >= prevState.maxStamina) {
                return prevState;
            }

            if (prevState.gold < prevState.staminaRefillCost) {
                return prevState;
            }

            const newGold = prevState.gold - prevState.staminaRefillCost;

            console.log('🔍 Gold antes:', prevState.gold);
            console.log('🔍 Coste:', prevState.staminaRefillCost);
            console.log('🔍 Gold después:', newGold);  // ✅ AÑADE ESTO

            return {
                ...prevState,
                gold: newGold,
                stamina: prevState.maxStamina,
            };
        });
    };

    // ========== SISTEMA DE PICO ==========

    /**
     * FUNCIÓN: handleRepairPickaxe
     * Repara el pico (restaura durabilidad al máximo)
     * 
     * REQUISITOS:
     * - Durabilidad actual < maxDurability (no repara si ya está al máximo)
     * - Oro suficiente para pagar el coste
     * 
     * EFECTOS:
     * - Resta oro según repairCost
     * - Restaura durabilidad a maxDurability
     * 
     * NOTA: El coste NO sube con cada reparación, solo al mejorar tier/material
     */
    const handleRepairPickaxe = () => {
        setGameState(prevState => {
            // Verificación: Si ya está al máximo, no hace nada
            if (prevState.pickaxe.durability >= prevState.pickaxe.maxDurability) {
                return prevState;
            }

            // Verificación: Si no hay oro suficiente, no hace nada
            if (prevState.gold < prevState.pickaxe.repairCost) {
                return prevState;
            }

            return {
                ...prevState,
                gold: prevState.gold - prevState.pickaxe.repairCost,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.maxDurability,  // Restaura al máximo
                }
            };
        });
    };

    /**
     * FUNCIÓN: handleUpgradePickaxeTier
     * Sube el tier del pico (0 → 1 → 2 → 3)
     * 
     * REQUISITOS:
     * - Tier actual < 3
     * - Oro suficiente
     * 
     * EFECTOS:
     * - Resta oro según tierUpgradeCost
     * - Sube tier en +1
     * - Aumenta maxDurability en +5
     * - Aumenta durabilidad actual en +5 (bonus al mejorar)
     * - Incrementa el coste de reparación (+5 oro)
     * 
     * NOTA: Al llegar a tier 3, el botón cambia a "Upgrade Material"
     */
    const handleUpgradePickaxeTier = () => {
        setGameState(prevState => {
            if (prevState.pickaxe.tier >= 3) return prevState;

            const isFree = !prevState.tutorial?.pickaxeUpgradeDone;
            const cost = isFree ? 0 : prevState.pickaxe.tierUpgradeCost;

            if (!isFree && prevState.gold < cost) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - cost,
                pickaxe: {
                    ...prevState.pickaxe,
                    tier: prevState.pickaxe.tier + 1,
                    maxDurability: prevState.pickaxe.maxDurability + 5,

                    durability: prevState.pickaxe.maxDurability + 5,
                    repairCost: prevState.pickaxe.repairCost + 5,
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

    /**
     * FUNCIÓN: handleUpgradePickaxeMaterial
     * Cambia el material del pico (stone → bronze → metal → diamond)
     * 
     * REQUISITOS:
     * - Tier === 3 (solo puedes cambiar material en tier máximo)
     * - Oro suficiente (materialUpgradeCost)
     * - Material suficiente (50 bronce, 30 hierro, o 10 diamante)
     * 
     * EFECTOS:
     * - Resta oro según materialUpgradeCost
     * - Resta el material necesario (bronze/iron/diamond)
     * - Cambia el material del pico
     * - Aumenta goldPerMine (más oro por picada)
     * - Resetea tier a 0 (debes volver a subirlo)
     * - Incrementa el coste de reparación (+20 oro)
     * - Mantiene la durabilidad actual y máxima
     * 
     * PROGRESIÓN:
     * - Stone (5 oro/mina) → Bronze (8 oro/mina) [requiere 50 bronce]
     * - Bronze (8 oro/mina) → Metal (12 oro/mina) [requiere 30 hierro]
     * - Metal (12 oro/mina) → Diamond (20 oro/mina) [requiere 10 diamante]
     */
    const handleUpgradePickaxeMaterial = () => {
        setGameState(prevState => {
            // Verificación: Solo puedes cambiar material en tier 3
            if (prevState.pickaxe.tier !== 3) {
                return prevState;
            }

            // Determina el siguiente material y sus requisitos
            let newMaterial, newGoldPerMine, materialCost, materialType;

            if (prevState.pickaxe.material === "stone") {
                newMaterial = "bronze";
                newGoldPerMine = 8;
                materialCost = 5;
                materialType = "bronzeIngot";  // ← lingote
            } else if (prevState.pickaxe.material === "bronze") {
                newMaterial = "metal";
                newGoldPerMine = 12;
                materialCost = 3;
                materialType = "ironIngot";    // ← lingote
            } else if (prevState.pickaxe.material === "metal") {
                newMaterial = "diamond";
                newGoldPerMine = 20;
                materialCost = 2;
                materialType = "diamondIngot"; // ← lingote
            }

            // Verificación: Si no tienes oro O material suficiente, no hace nada
            if (prevState.gold < prevState.pickaxe.materialUpgradeCost ||
                prevState[materialType] < materialCost) {
                return prevState;
            }

            return {
                ...prevState,
                gold: prevState.gold - prevState.pickaxe.materialUpgradeCost,  // Resta oro
                [materialType]: prevState[materialType] - materialCost,  // Resta material (bronze/iron/diamond)
                goldPerMine: newGoldPerMine,  // Aumenta oro por picada
                pickaxe: {
                    ...prevState.pickaxe,
                    material: newMaterial,  // Cambia material
                    tier: 0,  // Resetea tier a 0
                    goldPerMine: newGoldPerMine,
                    repairCost: prevState.pickaxe.repairCost + 20,  // Sube coste de reparación
                }
            };
        });
    };

    // ========== SISTEMA DE LADY (PLACEHOLDER) ==========

    /**
     * FUNCIÓN: handleFeedLady
     * Dar comida a Lady (mascota del juego)
     * 
     * TODO: Implementar lógica de:
     * - Reducir hambre de Lady
     * - Aumentar mood/felicidad
     * - Activar buffs temporales
     * - Consumir comida del inventario
     */
    const handleFeedLady = () => {
        // Lógica de dar comida a Lady
    };

    // ========== SISTEMA DE MINAS ==========

    /**
     * FUNCIÓN: handleUnlockMineType
     * Desbloquea un tipo de mina (bronce, hierro, diamante)
     * 
     * REQUISITOS:
     * - Oro suficiente (según MinesConfig[type].unlockCost)
     * - Tipo no desbloqueado previamente
     * 
     * EFECTOS:
     * - Resta oro
     * - Añade tipo a mines.unlockedTypes
     */
    const handleUnlockMineType = (mineType) => {
        setGameState(prevState => {
            // Verifica si ya está desbloqueado
            if (prevState.mines.unlockedTypes.includes(mineType)) {
                return prevState;
            }


            // LEE DESDE MINES CONFIG
            const cost = MinesConfig[mineType]?.unlockCost;

            // ✅ Verifica que exista (permite coste 0 si está definido)
            if (cost === undefined) return prevState;

            // Verifica oro suficiente
            if (prevState.gold < cost) {
                return prevState;
            }

            return {
                ...prevState,
                gold: prevState.gold - cost,
                mines: {
                    ...prevState.mines,
                    unlockedTypes: [...prevState.mines.unlockedTypes, mineType]
                }
            };
        });
    };

    /**
     * FUNCIÓN: handleEnterMine
     * Entra a una mina específica
     * 
     * REQUISITOS:
     * - Tipo desbloqueado
     * - Oro suficiente para entrada (baseEntryCost)
     * 
     * EFECTOS:
     * - Resta oro (coste de entrada)
     * - Crea currentMine con estado inicial
     * - (Futuro) Cambia a pantalla de mina
     * 
     * TODO: Por ahora solo resta oro y prepara el estado
     * Cuando tengamos MineScreen.jsx, aquí cambiaremos de pantalla
     */
    const handleEnterMine = (mineType) => {
        setGameState(prevState => {
            if (!prevState.mines.unlockedTypes.includes(mineType)) {
                return prevState;
            }

            if (prevState.mines.currentMine && prevState.mines.currentMine.mineType === mineType) {
                return prevState;
            }

            // ✅ USA MINESCONFIG PARA GENERAR VENAS
            const config = MinesConfig[mineType];
            const numVeins = Math.floor(
                Math.random() * (config.baseVeinsCount.max - config.baseVeinsCount.min + 1)
            ) + config.baseVeinsCount.min;

            const veins = Array.from({ length: numVeins }, (_, i) => {
                const capacity = Math.floor(
                    Math.random() * (config.baseVeinCapacity.max - config.baseVeinCapacity.min + 1)
                ) + config.baseVeinCapacity.min;

                return {
                    id: i + 1,
                    remaining: capacity,
                    max: capacity
                };
            });

            return {
                ...prevState,
                mines: {
                    ...prevState.mines,
                    currentMine: {
                        mineType: mineType,
                        veins: veins,
                        resourcesGathered: {
                            bronze: 0,
                            iron: 0,
                            diamond: 0
                        },
                        clicksCount: 0,
                        enteredAt: Date.now(),
                        eventsTriggered: []
                    }
                }
            };
        });

        console.log(`Entrando a mina de ${mineType}...`);
    };
    /**
     * FUNCIÓN: handleDiscardMine
     * Descarta una mina del mapa
     * 
     * EFECTOS:
     * - Remueve el tipo de unlockedTypes
     * - Si estás dentro, también limpia currentMine
     */
    const handleDiscardMine = (mineType) => {
        setGameState(prevState => {
            // Filtra el tipo de las minas desbloqueadas
            const updatedUnlockedTypes = prevState.mines.unlockedTypes.filter(
                type => type !== mineType
            );

            return {
                ...prevState,
                mines: {
                    ...prevState.mines,
                    unlockedTypes: updatedUnlockedTypes,
                    // Si estás dentro de esa mina, también limpia currentMine
                    currentMine: prevState.mines.currentMine?.mineType === mineType
                        ? null
                        : prevState.mines.currentMine
                }
            };
        });

        console.log(`Mina de ${mineType} descartada.`);
    };

    // ========== SISTEMA DE MINADO EN MINAS ==========

    /**
     * FUNCIÓN: handleMineVein
     * Mina una vena específica dentro de la mina actual
     * 
     * REQUISITOS:
     * - Estar dentro de una mina (currentMine !== null)
     * - Vena tenga remaining > 0
     * - Stamina > 0
     * - Durabilidad > 0
     * 
     * EFECTOS:
     * - Genera material aleatorio según yields del pico
     * - Resta 1 a vein.remaining
     * - Resta 1 stamina
     * - Resta 1 durabilidad
     * - Suma material a resourcesGathered
     * - Incrementa clicksCount
     */
    const handleMineVein = (veinId) => {
        setGameState(prevState => {
            // Verifica que esté en una mina
            if (!prevState.mines.currentMine) {
                return prevState;
            }

            // Verifica stamina y durabilidad
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) {
                return prevState;
            }

            // Encuentra la vena específica
            const veinIndex = prevState.mines.currentMine.veins.findIndex(v => v.id === veinId);
            if (veinIndex === -1) return prevState;

            const vein = prevState.mines.currentMine.veins[veinIndex];

            // Verifica que la vena tenga remaining
            if (vein.remaining <= 0) {
                return prevState;
            }


            // Calcula material obtenido (aleatorio según yields del pico)
            const mineType = prevState.mines.currentMine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');
            const pickaxeMaterial = prevState.pickaxe.material;


            const yieldRange = MinesConfig[mineType]?.yields?.[pickaxeMaterial];
            if (!yieldRange) return prevState;

            const materialGained = Math.floor(
                Math.random() * (yieldRange.max - yieldRange.min + 1)
            ) + yieldRange.min;


            // Actualiza el estado
            const updatedVeins = [...prevState.mines.currentMine.veins];
            updatedVeins[veinIndex] = {
                ...vein,
                remaining: vein.remaining - 1
            };

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

    /**
     * FUNCIÓN: handleExitMine
     * Sale de la mina actual
     * 
     * MECÁNICA CLAVE:
     * - Si sales SIN terminar → NO cobras materiales (se guardan en currentMine)
     * - Si sales TERMINANDO → Cobras todos los materiales acumulados
     * - El progreso de la mina se mantiene (puedes volver cuando quieras)
     * 
     * DISEÑO:
     * Esto incentiva al jugador a:
     * 1. Mejorar stamina (para poder terminar la mina)
     * 2. Mejorar pico (para obtener más materiales)
     * 3. Volver estratégicamente (cuando esté preparado)
     * 
     * EFECTOS SI COMPLETA:
     * - Suma materiales al gameState principal
     * - Limpia currentMine
     * - Quita la mina de disponibles (se agotó)
     * - Incrementa stats de minas completadas
     * 
     * EFECTOS SI NO COMPLETA:
     * - NO suma materiales (quedan guardados en currentMine)
     * - Mantiene currentMine con progreso
     * - La mina sigue disponible para volver
     */
    const handleExitMine = () => {
        setGameState(prevState => {
            if (!prevState.mines.currentMine) {
                return prevState;
            }

            const currentMine = prevState.mines.currentMine;
            const mineType = currentMine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');
            const materialsGathered = currentMine.resourcesGathered[baseMineType];

            // ✅ AÑADE ESTOS LOGS
            console.log('🔍 DEBUG handleExitMine:');
            console.log('mineType:', mineType);
            console.log('baseMineType:', baseMineType);
            console.log('resourcesGathered:', currentMine.resourcesGathered);
            console.log('materialsGathered:', materialsGathered);
            const clicksCount = currentMine.clicksCount;

            // Verifica si completó todas las venas
            const allVeinsEmpty = currentMine.veins.every(vein => vein.remaining === 0);

            // ✅ CALCULA BONUS POR EFICIENCIA (solo si completó)
            let speedBonus = 0;
            let starsEarned = 0;

            if (allVeinsEmpty) {
                const totalPoints = currentMine.veins.reduce((sum, vein) => sum + vein.max, 0);

                let perfectThreshold, goodThreshold;

                // ✅ DETECTA NIVEL POR NOMBRE
                if (mineType.includes('_lvl3')) {
                    // MINA NIVEL 3 (muy difícil)
                    perfectThreshold = 300;   // 3⭐ si sacas ≥300
                    goodThreshold = 200;      // 2⭐ si sacas ≥200
                    // 1⭐ si sacas <200
                } else if (mineType.includes('_lvl2')) {
                    // MINA NIVEL 2 (difícil)
                    perfectThreshold = 200;   // 3⭐ si sacas ≥200
                    goodThreshold = 150;      // 2⭐ si sacas ≥150
                    // 1⭐ si sacas <150
                } else {
                    // MINA NIVEL 1 (normal)
                    perfectThreshold = 100;   // 3⭐ si sacas ≥100
                    goodThreshold = 50;       // 2⭐ si sacas ≥50
                    // 1⭐ si sacas <50
                }

                // Asigna bonus según materiales obtenidos
                if (materialsGathered >= perfectThreshold) {
                    speedBonus = Math.floor(materialsGathered * 0.5);
                    starsEarned = 3;
                } else if (materialsGathered >= goodThreshold) {
                    speedBonus = Math.floor(materialsGathered * 0.25);
                    starsEarned = 2;
                } else {
                    speedBonus = 0;
                    starsEarned = 1;
                }
            }

            const totalMaterials = materialsGathered + speedBonus;

            // ✅ VERIFICA SI DEBE DESBLOQUEAR LVL2
            // ✅ VERIFICA SI DEBE DESBLOQUEAR SIGUIENTE NIVEL
            const currentBest = prevState.mines.bestScores?.[baseMineType] || 0;

            let shouldUnlockNext = false;
            let nextLevelType = null;

            if (!mineType.includes('_lvl')) {
                // Es lvl1 → Desbloquea lvl2 si consigues 2⭐
                shouldUnlockNext = starsEarned >= 2 && starsEarned > currentBest;
                nextLevelType = `${baseMineType}_lvl2`;
            } else if (mineType.includes('_lvl2')) {
                // Es lvl2 → Desbloquea lvl3 si consigues 3⭐
                shouldUnlockNext = starsEarned >= 3 && starsEarned > currentBest;
                nextLevelType = `${baseMineType}_lvl3`;
            }
            // Si es lvl3 → No desbloquea nada (es el máximo)

            return {
                ...prevState,

                [baseMineType]: allVeinsEmpty
                    ? prevState[baseMineType] + totalMaterials
                    : prevState[baseMineType],
                lastMineReward: allVeinsEmpty ? {
                    type: baseMineType,
                    amount: totalMaterials
                } : null,

                mines: {
                    ...prevState.mines,

                    currentMine: allVeinsEmpty ? null : currentMine,


                    // ACTUALIZA MEJOR PUNTUACIÓN
                    bestScores: allVeinsEmpty && starsEarned > currentBest ? {
                        ...prevState.mines.bestScores,
                        [baseMineType]: starsEarned
                    } : prevState.mines.bestScores,

                    // ✅ DESBLOQUEA LVL2 SI CUMPLE REQUISITOS
                    unlockedTypes: allVeinsEmpty
                        ? prevState.mines.unlockedTypes.filter(t => t !== mineType)
                        : prevState.mines.unlockedTypes,

                    completedMines: allVeinsEmpty
                        ? [...prevState.mines.completedMines, mineType + '_' + Date.now()]
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



    // ========== SISTEMA DE TUTORIAL ==========

    /**
     * FUNCIÓN: handleTutorialStep
     * Avanza el tutorial al siguiente paso
     */
    const handleTutorialStep = (step) => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: {
                ...prevState.tutorial,
                currentStep: step
            }
        }));
    };

    /**
     * FUNCIÓN: handleUnlockTutorialFeature
     * Desbloquea una feature del tutorial
     */
    const handleUnlockTutorialFeature = (feature) => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: {
                ...prevState.tutorial,
                [`${feature}Unlocked`]: true
            }
        }));
    };

    /**
     * FUNCIÓN: handleCompleteTutorial
     * Marca el tutorial como completado
     */
    const handleCompleteTutorial = () => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: {
                ...prevState.tutorial,
                completed: true,
                currentStep: 3
            }
        }));
    };




    // ========== SISTEMA DE SNACKS ==========

    /**
     * Desbloquea un snack permanentemente
     */
    const handleUnlockSnack = (snackType) => {
        setGameState(prevState => {
            const cost = SnacksConfig[snackType].unlock.cost;

            // Verifica monedas suficientes
            if (prevState.tavernCoins < cost) {
                return prevState;
            }

            // Verifica que no esté ya desbloqueado
            if (prevState.snacks[snackType].unlocked) {
                return prevState;
            }

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - cost,
                snacks: {
                    ...prevState.snacks,
                    [snackType]: {
                        ...prevState.snacks[snackType],
                        unlocked: true,
                        level: 1  // Empieza en nivel 1 al desbloquear
                    }
                }
            };
        });
    };

    /**
     * Mejora el nivel de un snack
     */
    const handleUpgradeSnack = (snackType) => {
        setGameState(prevState => {
            const currentLevel = prevState.snacks[snackType].level;

            // Solo puede mejorar si está en nivel 1 o 2
            if (currentLevel >= 3) {
                return prevState;
            }

            const costKey = currentLevel === 1 ? 'level2' : 'level3';
            const cost = SnacksConfig[snackType].upgrade[costKey];

            // Verifica monedas suficientes
            if (prevState.tavernCoins < cost) {
                return prevState;
            }

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - cost,
                snacks: {
                    ...prevState.snacks,
                    [snackType]: {
                        ...prevState.snacks[snackType],
                        level: currentLevel + 1
                    }
                }
            };
        });
    };

    /**
     * Usa un snack (activa el buff)
     */
    const handleUseSnack = (snackType) => {
        setGameState(prevState => {
            const snack = prevState.snacks[snackType];

            // Verifica que esté desbloqueado
            if (!snack.unlocked || snack.level === 0) {
                return prevState;
            }

            // Verifica que no esté ya activo
            if (snack.active !== null) {
                return prevState;
            }

            // Verifica que no haya OTRO snack activo
            const hasActiveSnack = Object.values(prevState.snacks).some(s => s.active !== null);
            if (hasActiveSnack) {
                return prevState;
            }

            const useCost = SnacksConfig[snackType].use.cost;

            // Verifica monedas suficientes
            if (prevState.tavernCoins < useCost) {
                return prevState;
            }

            // Obtiene efectos según nivel
            const effects = SnacksConfig[snackType].effects[`level${snack.level}`];

            // Calcula efecto RNG si aplica
            let goldBonus;
            if (effects.goldPerSecond.min !== undefined) {
                // RNG entre min y max
                goldBonus = Math.floor(
                    Math.random() * (effects.goldPerSecond.max - effects.goldPerSecond.min + 1)
                ) + effects.goldPerSecond.min;
            } else {
                // Fijo
                goldBonus = effects.goldPerSecond;
            }

            // Activa bonus lvl 3 (recarga/repara) si aplica
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
                    newState.pickaxe = {
                        ...newState.pickaxe,
                        durability: newState.pickaxe.maxDurability
                    };
                }
            }

            const now = Date.now();
            console.log(`🍪 Galleta usada: +${goldBonus} oro/seg durante ${effects.duration}s`);
            return {
                ...newState,
                tavernCoins: newState.tavernCoins - useCost,
                snacks: {
                    ...newState.snacks,
                    [snackType]: {
                        ...snack,
                        active: {
                            startTime: now,
                            duration: effects.duration,
                            effect: goldBonus,  // +X oro/segundo
                            bonusApplied: bonusApplied  // "refillStamina" o "repairPickaxe" o null
                        }
                    }
                }
            };
        });
    };

    //=========================================================

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
    // ========== AUTOMINE ==========

    /**
     * Desbloquea automine permanentemente
     */
    const handleUnlockAutomine = () => {
        setGameState(prevState => {
            if (prevState.gold < AutomineConfig.unlockCost) {
                return prevState;
            }

            if (prevState.automine.unlocked) {
                return prevState;
            }

            return {
                ...prevState,
                gold: prevState.gold - AutomineConfig.unlockCost,
                automine: {
                    ...prevState.automine,
                    unlocked: true,
                    charges: [  // ✅ Array, no número
                        { available: true, cooldownUntil: null },
                        { available: true, cooldownUntil: null }
                    ]
                }
            };
        });
    };

    /**
     * Activa automine 2 cargas
     */
    const handleActivateAutomine = () => {
        setGameState(prevState => {
            if (!prevState.automine.unlocked) return prevState;
            if (prevState.automine.isActive) return prevState;
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) return prevState;

            // ✅ Busca primera carga disponible
            const chargeIndex = prevState.automine.charges.findIndex(c => c.available);

            if (chargeIndex === -1) return prevState;  // No hay cargas disponibles

            const now = Date.now();
            const cooldownEnd = now + (AutomineConfig.chargeRecoveryTime * 1000);

            const newCharges = [...prevState.automine.charges];
            newCharges[chargeIndex] = {
                available: false,
                cooldownUntil: cooldownEnd
            };

            return {
                ...prevState,
                automine: {
                    ...prevState.automine,
                    charges: newCharges,
                    isActive: true
                }
            };
        });
    };

    /**
     * Detiene automine
     */
    const handleStopAutomine = () => {
        setGameState(prevState => ({
            ...prevState,
            automine: {
                ...prevState.automine,
                isActive: false
            }
        }));
    };

    //=======================================FORJA
    const handleUnlockTavern = () => {
        setGameState(prevState => {
            if (prevState.gold < 1000) return prevState;
            if (prevState.tavernUnlocked) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - 1000,
                tavernUnlocked: true
            };
        });
    };

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


    const handleUnlockMinesMap = () => {
        setGameState(prevState => {
            if (prevState.gold < 1000) return prevState;
            if (prevState.minesMapUnlocked) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - 1000,
                minesMapUnlocked: true
            };
        });
    };

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




    // ========== EXPORT DE TODAS LAS FUNCIONES ==========
    return {
        // Sistema de minado

        handleMine,
        handleMineClick,

        // Sistema de oro
        handleBuyGoldPerSecondUpgrade,

        // Sistema de stamina
        handleBuyMaxStaminaUpgrade,
        handleRefillStamina,

        // Sistema de pico
        handleUpgradePickaxeTier,
        handleUpgradePickaxeMaterial,
        handleRepairPickaxe,

        // Sistema de Lady
        handleFeedLady,

        // Sistema de minas
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

        //=========
        handleConvertMaterial,

        //========
        handleUnlockAutomine,
        handleActivateAutomine,
        handleStopAutomine,

        //====

        handleUnlockTavern,
        handleUnlockMinesMap,

        //=======
        handleConvertCoinsToGold,

        //===========
        handleStartSmelt,
        handleUnlockFurnace,
        handleCollectIngot,
        handleUpgradeFurnace,

    };




};