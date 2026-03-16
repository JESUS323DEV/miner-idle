import { useState, useEffect } from "react";

// ===== HOOKS =====
import useGoldPerSecond from "../game/hooks/useGoldPerSecond.js";
import { useGameActions } from "../game/hooks/useGameActions.js";
import { useAutoMining } from "../game/hooks/useAutoMining.js";
import useSnackBuffs from "../game/hooks/useSnackBuffs.js";
import useAutomine from "../game/hooks/useAutomine.js";
import useAutomineCooldown from "../game/hooks/useAutomineCooldown.js";
import useDogsAutomine from '../game/hooks/useDogsAutomine.js';
import { AutomineConfig } from "../game/AutomineConfig.js";
import { InitialDogsState } from '../game/initialState/InitialDogsState.js';

// ===== ESTADOS INICIALES =====
import InitialGameState from "../game/initialState/InitialGameState.js";
import InitialPickaxeState from "../game/initialState/InitialPickaxeState.js";
import InitialLadyState from "../game/initialState/lady/InitialLadyState.js";
import InitialRewardsState from '../game/initialState/InitialRewardsState.js';
import InitialYacimientosState from '../game/initialState/InitialYacimientosState.js';

// ===== COMPONENTES =====
import UpgradeModal from "../components/modals/UpgradeModal.jsx";
import ModalsMenu from "../components/modals/ModalsMenu.jsx";
import PickaxeModal from "../components/modals/PickaxeModal.jsx";
import TavernModal from "./modalTavern/TavernModal.jsx";
import GoldMine from "../components/GoldMine.jsx";
import TutorialPointer from "../components/TutorialPointer.jsx";
import ForgeModal from '../screens/modalForge/ForgeModal';
import BiomeSelectorModal from "../screens/modalMine/BiomeSelectorModal.jsx";

import RewardsModal from "../screens/RewardsModal.jsx"

// ===== ASSETS: HUD PRINCIPAL =====
import cofre from "../assets/ui/icons-hud/hud-principal/cofre-oro1.png";
import gold1 from "../assets/ui/icons-hud/hud-principal/oro1.png";
import coinTavern from "../assets/ui/icons-hud/hud-principal/coin-tavern1.png";
import stamina1 from "../assets/ui/icons-hud/hud-principal/stamina-1.png";
import goldOpen from "../assets/ui/icons-hud/hud-principal/gold-open.png";
import repair from "../assets/ui/icons-hud/hud-principal/repair.png";
import refillStaminaIcon from "../assets/ui/icons-hud/hud-principal/refill-stamina.png";

import iconBronze from "../assets/ui/icons-forge/lingotes/lingote-bronze.png"
import iconIron from "../assets/ui/icons-forge/lingotes/lingote-iron.png"
import iconDiamond from "../assets/ui/icons-forge/lingotes/lingote-diamond.png"

import menaBronze from "../assets/ui/icons-forge/menas-hud/bronzeHud.png"
import menaIron from "../assets/ui/icons-forge/menas-hud/ironHud.png"
import menaDiamond from "../assets/ui/icons-forge/menas-hud/diamondHud.png"

// ===== ASSETS: FONDOS =====
import bgMain from "../assets/backgrounds/fondo4.png";

// ===== ASSETS: FONDOS MINES =====

import bgMineBronze from "../assets/backgrounds/bg-mines/bg-mine-bronze.png"
import bgMineIron from "../assets/backgrounds/bg-mines/bg-mine-iron.png"
import bgMineDiamond from "../assets/backgrounds/bg-mines/bg-mine-diamond.png"


// ===== ASSETS: ORES (comentado, en uso futuro) =====

// ===== ASSETS: PICKAXE — stone =====
import pickAxeStone from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone.png";
import pickAxeStone1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier1.png";
import pickAxeStone2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier2.png";
import pickAxeStone3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier3.png";

// ===== ASSETS: PICKAXE — bronze =====
import pickAxeBronze from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze.png";
import pickAxeBronze1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier1.png";
import pickAxeBronze2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier2.png";
import pickAxeBronze3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier3.png";

// ===== ASSETS: PICKAXE — iron =====
import pickAxeIron from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron.png";
import pickAxeIron1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier1.png";
import pickAxeIron2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier2.png";
import pickAxeIron3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier3.png";

// ===== ASSETS: PICKAXE — diamond =====
import pickAxeDiamond from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond.png";
import pickAxeDiamond1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier1.png";
import pickAxeDiamond2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier2.png";
import pickAxeDiamond3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier3.png";

// ===== ASSETS: AUTOMINE =====
import activeMine from "../assets/ui/icons-auto-mine/active-mine.png";
import stopMine from "../assets/ui/icons-auto-mine/stop-mine.png";

// ===== ASSETS: ICONOS PANTALLAS =====
import mineModal from "../assets/ui/icon-mine1.png";
import iconTavern from "../assets/ui/icon-tavern1.png";
import iconForge from "../assets/ui/icon-forge1.png";

// ===== ASSETS: MODALES =====
import bgGold from "../assets/backgrounds/bg-modals-hud/fondoGold.png";
import iconGold from "../assets/ui/icons-hud/hud-modals/icon-gold-second.png";
import buttonUpgrade from "../assets/ui/icons-hud/hud-modals/buttonUpgrade.png";
import bgStamina from "../assets/backgrounds/bg-modals-hud/bgStamina.png";
import upgradeStamina from "../assets/ui/icons-hud/hud-modals/icon-lvl-stamina.png";
import bgPickaxe from "../assets/backgrounds/bg-modals-hud/fondoWorkShop.png";
import PickAxeUp from "../assets/ui/icons-hud/hud-modals/btn-pickAxeUp.png";
import btnTier from "../assets/ui/icons-hud/hud-modals/btnTier.png";

// ===== MINAS =====
import MinesConfig from "../game/MinesConfig.js";
import InitialMinesState from "../game/initialState/InitialMinesState.js";
import MinesMapModal from "../screens/modalMine/MinesMapModal.jsx";
import MineScreen from "../screens/modalMine/MineScreen.jsx";

// ===== CSS =====
import "../styles/gameRoot.css";

// ===== ICONS =====
import { Menu, Settings } from "lucide-react";

function GameRoot() {

    // ===== ESTADOS UI =====
    const [isResetting, setIsResetting] = useState(false);
    const [isMineScreenOpen, setIsMineScreenOpen] = useState(false);
    const [openModal, setOpenModal] = useState(null);
    const [menuOpenModal, setMenuOpenModal] = useState(false);
    const [minesModalOpen, setMinesModalOpen] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(null);
    const [goldFloatingNumbers, setGoldFloatingNumbers] = useState([]);
    const [tavernModalOpen, setTavernModalOpen] = useState(false);
    const [oreFloatingNumbers, setOreFloatingNumbers] = useState([]);
    const [forgeModalOpen, setForgeModalOpen] = useState(false);

    const [selectedBiome, setSelectedBiome] = useState(null);
    const [biomeSelectorOpen, setBiomeSelectorOpen] = useState(false);
    const [rewardsOpen, setRewardsOpen] = useState(false);

    // ===== GAME STATE — carga desde localStorage si existe =====
    const [gameState, setGameState] = useState(() => {
        const saved = localStorage.getItem('ladyHungryGame');
        if (saved) return JSON.parse(saved);
        return {
            ...InitialGameState,
            lady: InitialLadyState,
            pickaxe: InitialPickaxeState,
            mines: InitialMinesState,
            rewards: InitialRewardsState,
            yacimientos: InitialYacimientosState,
            dogs: InitialDogsState,
        };
    });

    // ===== AUTO-SAVE — guarda en localStorage en cada cambio =====
    useEffect(() => {
        if (!isResetting) {
            localStorage.setItem('ladyHungryGame', JSON.stringify(gameState));
        }
    }, [gameState, isResetting]);

    // ===== NUEVO JUEGO — borra save y recarga =====
    const handleNewGame = () => {
        if (window.confirm('¿Seguro que quieres empezar un nuevo juego? Se perderá todo el progreso.')) {
            setIsResetting(true);
            localStorage.removeItem('ladyHungryGame');
            setTimeout(() => location.reload(), 0);
        }
    };

    // ===== FLOATING NUMBERS — oro =====
    // Muestra coste negativo al gastar oro
    const showGoldCost = (cost) => {
        const id = Date.now();
        setGoldFloatingNumbers(prev => [...prev, { id, value: -cost, timestamp: Date.now() }]);
        setTimeout(() => {
            setGoldFloatingNumbers(prev => prev.filter(n => n.id !== id));
        }, 1500);
    };

    // ===== FLOATING NUMBERS — COIN TAVERN =====
    // Muestra coste negativo al gastar COIN TAVERN
    const [tavernFloatingNumbers, setTavernFloatingNumbers] = useState([]);

    const showTavernCost = (cost) => {
        const id = Date.now();
        setTavernFloatingNumbers(prev => [...prev, { id, value: -cost, timestamp: Date.now() }]);
        setTimeout(() => {
            setTavernFloatingNumbers(prev => prev.filter(n => n.id !== id));
        }, 1500);
    };

    // ===== ACTIONS — todas las funciones de lógica del juego =====
    const {
        handleFeedLady,
        handleBuyGoldPerSecondUpgrade,
        handleBuyMaxStaminaUpgrade,
        handleRefillStamina,
        handleUpgradePickaxeMaterial,
        handleUpgradePickaxeTier,
        handleRepairPickaxe,
        handleMine,
        handleMineClick,
        handleUnlockMineType,
        handleEnterMine,
        handleDiscardMine,
        handleMineVein,
        handleExitMine,
        handleTutorialStep,
        handleUnlockTutorialFeature,
        handleCompleteTutorial,
        handleUnlockSnack,
        handleUpgradeSnack,
        handleUseSnack,
        handleConvertMaterial,
        handleUnlockAutomine,
        handleActivateAutomine,
        handleStopAutomine,
        handleUnlockTavern,
        handleUnlockMinesMap,
        handleConvertCoinsToGold,
        handleUnlockFurnace,
        handleStartSmelt,
        handleCollectIngot,
        handleUpgradeFurnace,
        handleClaimReward,
        handleClaimCoinReward,

        handleUnlockYacimientoSlot,
        handleRepairYacimiento,
        handleMineYacimiento,
        handlePlantMena,
        handleConvertGoldToIngot,
        handleHireDog,
        handleAssignDog,
        handleUnassignDog,
        handleDogTick,


    } = useGameActions(gameState, setGameState, showGoldCost, showTavernCost);

    // ===== PICKAXE LOGIC =====
    // Determina si el upgrade es de tier o de material
    const isTierUpgrade = gameState.pickaxe.tier < 5;
    const pickaxeUpgradeCost = isTierUpgrade ? gameState.pickaxe.tierUpgradeCost : gameState.pickaxe.materialUpgradeCost;
    const canUpgradePickaxe = gameState.gold >= pickaxeUpgradeCost;
    const handlePickaxeUpgrade = isTierUpgrade ? handleUpgradePickaxeTier : handleUpgradePickaxeMaterial;
    const canRepairPickaxe = gameState.pickaxe.durability < gameState.pickaxe.maxDurability && gameState.gold >= gameState.pickaxe.repairCost;
    const tierIngotCost = gameState.pickaxe.tierIngotCosts?.[gameState.pickaxe.material]?.[gameState.pickaxe.tier];
    const canAffordTierUpgrade = !gameState.tutorial?.pickaxeUpgradeDone ? true :
        gameState.gold >= (gameState.pickaxe.tierUpgradeCosts?.[gameState.pickaxe.material] || 0) &&
        (!tierIngotCost || gameState[tierIngotCost.type] >= tierIngotCost.amount);


    const materialUpgradeCost = gameState.pickaxe.materialUpgradeCosts?.[gameState.pickaxe.material];
    const canAffordMaterialUpgrade = gameState.pickaxe.tier === 5 &&
        gameState.gold >= (materialUpgradeCost?.gold || 0) &&
        gameState[materialUpgradeCost?.ingot?.type] >= (materialUpgradeCost?.ingot?.amount || 0);

    // Devuelve imagen del pico según material y tier actual
    const getPickaxeIcon = (material, tier) => {
        const icons = {
            stone: [pickAxeStone, pickAxeStone1, pickAxeStone2, pickAxeStone3],
            bronze: [pickAxeBronze, pickAxeBronze1, pickAxeBronze2, pickAxeBronze3],
            metal: [pickAxeIron, pickAxeIron1, pickAxeIron2, pickAxeIron3],
            diamond: [pickAxeDiamond, pickAxeDiamond1, pickAxeDiamond2, pickAxeDiamond3],
        };
        // tier 0→0, 1→1, 2→1, 3→2, 4→2, 5→3
        const assetMap = [0, 1, 1, 2, 2, 3];
        return icons[material]?.[assetMap[tier]] || pickAxeStone;
    };

    // ===== HOOKS DE SISTEMA =====
    useGoldPerSecond(gameState, setGameState);        // Tick oro/segundo
    useAutoMining(gameState, handleMine, setGameState); // Automina continua
    useSnackBuffs(gameState, setGameState);            // Aplica buffs activos
    useAutomine(gameState, handleMineClick, handleStopAutomine); // Automine manual
    useAutomineCooldown(gameState, setGameState);    // Recupera cargas de automine
    useDogsAutomine(gameState, handleDogTick);


    // Cargas disponibles de automine
    const availableCharges = gameState.automine?.charges?.filter(c => c.available).length || 0;

    // ===== FLOATING NUMBERS — ores =====
    const showOreCost = (type, amount) => {
        const id = Date.now();
        setOreFloatingNumbers(prev => [...prev, { id, type, value: amount }]);
        setTimeout(() => {
            setOreFloatingNumbers(prev => prev.filter(n => n.id !== id));
        }, 1500);
    };

    // Muestra número flotante al recibir recompensa de mina
    useEffect(() => {
        console.log('lastMineReward:', gameState.lastMineReward);
        if (gameState.lastMineReward) {
            showOreCost(gameState.lastMineReward.type, gameState.lastMineReward.amount);
        }
    }, [gameState.lastMineReward]);

    // Calcula segundos restantes por cada carga de automine
    const getChargeTimers = () => {
        if (!gameState.automine?.charges) return [];
        const now = Date.now();
        return gameState.automine.charges.map(charge => {
            if (charge.available) return null;
            if (!charge.cooldownUntil) return null;
            return Math.max(0, Math.ceil((charge.cooldownUntil - now) / 1000));
        });
    };

    const chargeTimers = getChargeTimers();

    // ===== TUTORIAL TRIGGERS =====
    // Paso 0: muestra animación en oro/segundo
    useEffect(() => {
        if (gameState.tutorial?.currentStep === 0 && !gameState.tutorial?.completed) {
            setTimeout(() => setTutorialStep(0), 500);
        }
    }, [gameState.tutorial?.currentStep]);

    // Paso 1: desbloquea stamina tras comprar oro/segundo
    useEffect(() => {
        if (gameState.tutorial?.goldPerSecondBought &&
            gameState.tutorial?.currentStep === 1 &&
            !gameState.tutorial?.staminaUnlocked) {
            setTutorialStep(1);
            handleUnlockTutorialFeature('stamina');
        }
    }, [gameState.tutorial?.goldPerSecondBought, gameState.tutorial?.currentStep, gameState.tutorial?.staminaUnlocked]);

    // Paso 2: desbloquea pico tras mejorar stamina
    useEffect(() => {
        if (gameState.tutorial?.staminaUpgradeDone &&
            gameState.tutorial?.currentStep === 2 &&
            !gameState.tutorial?.pickaxeUnlocked) {
            setTutorialStep(2);
            handleUnlockTutorialFeature('pickaxe');
        }
    }, [gameState.tutorial?.staminaUpgradeDone, gameState.tutorial?.currentStep, gameState.tutorial?.pickaxeUnlocked]);





    // Formatea números grandes (10k, 1.5M...) PARA ORO GENERAL
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 10000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    // Formatea números grandes (1k, 1.5M...) PARA INFO DEL HUD - MENAS LINGOTES
    const formatNumber2 = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };
    const getMinesBg = (biome) => {
        if (biome === 'bronze') return bgMineBronze;
        if (biome === 'iron') return bgMineIron;
        if (biome === 'diamond') return bgMineDiamond;
        return null;
    };

    // ===== RENDER =====
    return (
        <div className="game-container" style={{ backgroundImage: `url(${bgMain})` }}>

            {/* OVERLAY OSCURO DURANTE TUTORIAL */}
            {tutorialStep !== null && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 500,
                    pointerEvents: 'none'
                }} />
            )}

            {/* HEADER — oro + monedas taberna + menú */}
            <div className="gold-menu-display">
                <div className="gold-display">
                    <div className="gold-cont" style={{ position: 'relative' }}>
                        <div className="cont-gold-mena">
                            <div className="cont-hud-gold">
                                <img src={cofre} alt="Cofre Oro" />
                                <p>{formatNumber(gameState.gold)}</p>
                            </div>

                            {/* Números flotantes de gasto de oro */}
                            {goldFloatingNumbers.map(num => (
                                <div key={num.id} className="floating-gold-cost">{num.value}</div>
                            ))}

                            <div className="cont-icon-menas">

                                <div className="icon-menas">
                                    <img src={menaBronze} loading="lazy" alt="menaBronze" />
                                    <span>{formatNumber2(gameState.bronze)}</span>
                                </div>

                                <div className="icon-menas">
                                    <img src={menaIron} loading="lazy" alt="menaIron" />
                                    <span>{formatNumber2(gameState.iron)}</span>
                                </div>

                                <div className="icon-menas">
                                    <img src={menaDiamond} loading="lazy" alt="menaDiamond" />
                                    <span>{formatNumber2(gameState.diamond)}</span>
                                </div>

                            </div>


                        </div>
                        {/* Monedas de taberna-lingotes */}
                        <div className="coinTavern-lingotes">
                            <div className="container-coinTavern">
                                <img src={coinTavern} alt="Coin-Tavern" />
                                <span>{formatNumber2(gameState.tavernCoins)}</span>
                            </div>

                            <div className="container-lingotes">

                                <div className="icon-lingotes">
                                    <img src={iconBronze} loading="lazy" alt="iconBronze" />
                                    <span>
                                        {formatNumber2(gameState.bronzeIngot)}
                                    </span>

                                </div>

                                <div className="icon-lingotes">
                                    <img src={iconIron} loading="lazy" alt="iconIron" />
                                    <span>
                                        {formatNumber2(gameState.ironIngot)}

                                    </span>
                                </div>

                                <div className="icon-lingotes">
                                    <img src={iconDiamond} loading="lazy" alt="iconDiamond" />
                                    <span>

                                        {formatNumber2(gameState.diamondIngot)}
                                    </span>
                                </div>

                            </div>

                        </div>




                    </div>
                </div>

                <ModalsMenu
                    isOpen={menuOpenModal}
                    onClose={() => setMenuOpenModal(false)}
                    button1={() => { handleNewGame(); }}
                    textButton={"newGame"}
                />
            </div>

            {/* HUD — oro/seg, stamina, pico */}
            <div className="game-info">

                {/* ORO/SEGUNDO */}
                <div className="gold-per-sec">
                    <img className="img-goldSec" src={gold1} alt="Oro" />
                    <p>+{gameState.goldPerSecond}</p>
                    <button
                        onClick={() => { setTutorialStep(null); setOpenModal("goldPerSecond"); }}
                        className={`openDisplay1 ${tutorialStep === 0 ? 'tutorial-highlight' : ''}`}
                        style={{ position: 'relative' }}
                    >
                        <img src={goldOpen} alt="icon goldOpen" />
                        {tutorialStep === 0 && <TutorialPointer step={0} />}
                    </button>
                </div>

                {/* Modal oro/segundo + snacks */}
                <UpgradeModal
                    isOpen={openModal === "goldPerSecond"}
                    onClose={() => setOpenModal(null)}
                    currentLevel={`x${gameState.goldPerSecondLevel}`}
                    cost={gameState.goldPerSecondCost}
                    onUpgrade={() => {

                        handleBuyGoldPerSecondUpgrade();
                        if (gameState.tutorial?.currentStep === 0) setOpenModal(null);
                    }}
                    canAfford={gameState.gold >= gameState.goldPerSecondCost}
                    tutorialStep0Active={gameState.tutorial?.currentStep === 0 && !gameState.tutorial?.goldPerSecondBought}
                    tutorialMessage={(gameState.tutorial?.currentStep === 0 && !gameState.tutorial?.goldPerSecondBought) ? " 👉" : null}
                    bgImage={bgGold}
                    iconImage={iconGold}
                    buttonImage={buttonUpgrade}
                    showSnacks={true}
                    snacksData={gameState.snacks}
                    tavernCoins={gameState.tavernCoins}
                    onUnlockSnack={handleUnlockSnack}
                    onUpgradeSnack={handleUpgradeSnack}
                    onUseSnack={handleUseSnack}
                    title={"Oro por segundo"}
                />

                {/* STAMINA */}
                <div className="stamina-display">
                    {/* Botón abrir modal — bloqueado hasta tutorial paso 1 */}
                    <button
                        onClick={() => { setTutorialStep(null); setOpenModal("maxStamina"); }}
                        disabled={!gameState.tutorial?.staminaUnlocked && !gameState.tutorial?.completed}
                        className={`${gameState.stamina <= 5 ? 'low-resource' : ''} ${tutorialStep === 1 ? 'tutorial-highlight' : ''}`}
                        style={{
                            position: 'relative',
                            opacity: (!gameState.tutorial?.staminaUnlocked && !gameState.tutorial?.completed) ? 0.5 : 1,
                            cursor: (!gameState.tutorial?.staminaUnlocked && !gameState.tutorial?.completed) ? 'not-allowed' : 'pointer',
                            filter: (!gameState.tutorial?.staminaUnlocked && !gameState.tutorial?.completed) ? 'grayscale(100%)' : 'none'
                        }}
                    >
                        <img src={stamina1} loading='lazy' alt="Stamina" />
                        {tutorialStep === 1 && <TutorialPointer step={1} />}
                    </button>

                    <p>{gameState.stamina}/{gameState.maxStamina}</p>

                    {/* Botón recarga rápida sin abrir modal */}
                    <button
                        onClick={() => {
                            handleRefillStamina();
                            setOpenModal(null);
                        }}
                        disabled={gameState.automine?.isActive || gameState.stamina >= gameState.maxStamina}
                        className={`openDisplay2 ${gameState.stamina <= 5 ? 'low-resource-green' : ''}`}
                    >
                        <img src={refillStaminaIcon} alt="Refill-Stamina" />
                    </button>
                </div>

                {/* Modal stamina */}
                <UpgradeModal
                    isOpen={openModal === "maxStamina"}
                    onClose={() => { setOpenModal(null); setTutorialStep(null); }}
                    currentLevel={`Nivel ${gameState.maxStaminaLevel}`}
                    cost={gameState.tutorial?.staminaUpgradeDone ? gameState.maxStaminaCost : 0}
                    coinCost={gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10)}
                    onUpgrade={() => {

                        handleBuyMaxStaminaUpgrade();
                    }}
                    canAfford={
                        gameState.gold >= (gameState.tutorial?.staminaUpgradeDone ? gameState.maxStaminaCost : 0) &&
                        gameState.tavernCoins >= (gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10))
                    }
                    tutorialMessage={!gameState.tutorial?.staminaUpgradeDone ? " 👉" : null}
                    bgImage={bgStamina}
                    iconImage={upgradeStamina}
                    buttonImage={buttonUpgrade}
                    showStaminaSnacks={true}
                    title={"Energía Max."}
                />

                {/* PICO */}
                <div className="pickaxe-display">
                    {/* Botón abrir modal — bloqueado hasta tutorial paso 2 */}
                    <button
                        onClick={() => { setTutorialStep(null); setOpenModal("pickaxe"); }}
                        disabled={!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed}
                        className={`
                            ${gameState.pickaxe.durability <= 5 ? 'low-resource' : ''}
                            ${tutorialStep === 2 ? 'tutorial-highlight' : ''}
                            ${(!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed) ? 'locked-tutorial' : ''}
                        `.trim()}
                    >
                        <img src={getPickaxeIcon(gameState.pickaxe.material, gameState.pickaxe.tier)} loading='lazy' alt="Pickaxe" />
                        {tutorialStep === 2 && <TutorialPointer step={2} />}
                    </button>

                    <p>{gameState.pickaxe.durability}/{gameState.pickaxe.maxDurability}</p>

                    {/* Botón reparación rápida sin abrir modal */}
                    <button
                        onClick={() => {
                            handleRepairPickaxe();
                            setOpenModal(null);
                        }}
                        disabled={gameState.automine?.isActive || gameState.pickaxe.durability >= gameState.pickaxe.maxDurability}
                        className={`openDisplay3 ${gameState.pickaxe.durability <= 5 ? 'low-resource-green' : ''}`}
                    >
                        <img src={repair} alt="repair" />
                    </button>
                </div>

                {/* Modal pico */}
                <PickaxeModal
                    isOpen={openModal === "pickaxe"}
                    onClose={() => { setOpenModal(null); setTutorialStep(null); }}
                    currentLevel={`Tier ${gameState.pickaxe.tier}`}
                    cost={gameState.tutorial?.pickaxeUpgradeDone ? (gameState.pickaxe.tierUpgradeCosts?.[gameState.pickaxe.material] || 0) : 0}
                    onUpgrade={() => {
                        handlePickaxeUpgrade();
                    }}
                    canAfford={canAffordTierUpgrade}
                    tutorialMessage={!gameState.tutorial?.pickaxeUpgradeDone ? " 👉" : null}
                    buttonImage={btnTier}
                    iconImage={getPickaxeIcon(gameState.pickaxe.material, gameState.pickaxe.tier)}
                    bgImage={bgPickaxe}
                    pickaxeTier={gameState.pickaxe.tier}
                    pickaxeMaterial={gameState.pickaxe.material}
                    onUpgradeMaterial={handleUpgradePickaxeMaterial}
                    materialCost={materialUpgradeCost?.gold || 0}
                    canAffordMaterial={canAffordMaterialUpgrade}
                    materialButtonImage={PickAxeUp}
                    onShowGoldCost={showGoldCost}
                    tierIngotCost={tierIngotCost}
                    materialIngotCost={materialUpgradeCost?.ingot}
                />
            </div>

            {/* ORES HUD — comentado, pendiente de activar
            <div className="cont-hud-ores">
                <div className="cont-ore" style={{ position: 'relative' }}>
                    <p>{gameState.bronze}</p>
                    <img src={bronze1} alt="Bronze" />
                    {oreFloatingNumbers.filter(n => n.type === 'bronze').map(n => (
                        <div key={n.id} className="floating-gold-cost" style={{ color: '#CD7F32' }}>+{n.value}</div>
                    ))}
                </div>
                <div className="cont-ore" style={{ position: 'relative' }}>
                    <p>{gameState.iron}</p>
                    <img src={metal1} alt="Metal" />
                    {oreFloatingNumbers.filter(n => n.type === 'iron').map(n => (
                        <div key={n.id} className="floating-gold-cost" style={{ color: '#808080' }}>+{n.value}</div>
                    ))}
                </div>
                <div className="cont-ore" style={{ position: 'relative' }}>
                    <p>{gameState.diamond}</p>
                    <img src={diamond1} alt="Diamante" />
                    {oreFloatingNumbers.filter(n => n.type === 'diamond').map(n => (
                        <div key={n.id} className="floating-gold-cost" style={{ color: '#B9F2FF' }}>+{n.value}</div>
                    ))}
                </div>
            </div>
            */}

            {/* BOTONES PANTALLAS — Taberna, Minas, Forja */}
            <div className="cont-screens">

                {/* Taberna — bloqueada hasta pagar 1000 oro */}
                <div className="modal-tavern">
                    {gameState.tavernUnlocked ? (
                        <button onClick={() => setTavernModalOpen(true)} className="tavern-btn">
                            <img src={iconTavern} alt="Icono-Taberna" />
                        </button>
                    ) : (
                        <button onClick={handleUnlockTavern} disabled={gameState.gold < 1000} className="tavern-btn tavern-locked">
                            <img src={iconTavern} alt="Icono-Taberna" />
                            <span>🔒 1000 oro</span>
                        </button>
                    )}
                </div>

                {/* Minas — bloqueadas hasta pagar 2000 oro */}
                <div className="modal-mine">
                    {gameState.minesMapUnlocked ? (
                        <button onClick={() => setBiomeSelectorOpen(true)} className="mines-map-btn">
                            <img src={mineModal} alt="Icon1" />
                        </button>
                    ) : (
                        <button onClick={handleUnlockMinesMap} disabled={gameState.gold < 1000} className="mines-map-btn mines-map-locked">
                            <img src={mineModal} alt="Icon1" />
                            <span>🔒 2000 oro</span>
                        </button>
                    )}
                </div>

                {/* Forja — siempre disponible */}
                <div className="modal-forge">
                    <button onClick={() => setForgeModalOpen(true)} className="forge-btn">
                        <img src={iconForge} alt="Icon-Forge" />
                    </button>
                </div>
            </div>

            {/* AUTOMINE — desbloqueable, 2 cargas con cooldown */}
            <div className="automine-container">
                {!gameState.automine?.unlocked ? (
                    // Bloqueado — muestra coste de desbloqueo
                    <button
                        onClick={handleUnlockAutomine}
                        disabled={gameState.gold < AutomineConfig.unlockCost}
                        className="automine-button unlock"
                    >
                        <img src={activeMine} alt="Pico" />
                        <span>🔒 {AutomineConfig.unlockCost} oro</span>
                    </button>
                ) : (
                    // Activo — muestra cargas disponibles y progreso de cooldown
                    <button
                        onClick={gameState.automine.isActive ? handleStopAutomine : handleActivateAutomine}
                        disabled={!gameState.automine.isActive && (availableCharges <= 0 || gameState.stamina <= 0 || gameState.pickaxe.durability <= 0)}
                        className={`automine-button-pico charges-${availableCharges}`}
                        style={{
                            '--progress1': chargeTimers[0] ? `${Math.round((1 - chargeTimers[0] / AutomineConfig.chargeRecoveryTime) * 100) * 3.6}deg` : '0deg',
                            '--progress2': chargeTimers[1] ? `${Math.round((1 - chargeTimers[1] / AutomineConfig.chargeRecoveryTime) * 100) * 3.6}deg` : '0deg',
                        }}
                    >
                        <img src={gameState.automine.isActive ? stopMine : activeMine} alt="Pico" />
                        <span className="automine-charge-count">{availableCharges}/2</span>
                    </button>
                )}

                {/* PERRO AUTOMINE ORO */}
                <div className="gold-dog-slot">
                    {gameState.dogs.goldDog ? (
                        <div className="gold-dog-assigned">
                            <span>🐕 {gameState.dogs.goldDog}</span>
                            <button
                                className="btn-unassign-gold-dog"
                                onClick={() => setGameState(prev => ({
                                    ...prev,
                                    dogs: { ...prev.dogs, goldDog: null }
                                }))}
                            >
                                ✖
                            </button>
                        </div>
                    ) : (
                        <div className="gold-dog-empty">
                            {Object.values(gameState.dogs)
                                .filter(d => d && typeof d === 'object' && d.hired && d.assignedTo === null)
                                .length === 0 ? (
                                <span className="gold-dog-none">Sin perros libres</span>
                            ) : (
                                <select
                                    className="gold-dog-select"
                                    defaultValue=""
                                    onChange={(e) => {
                                        if (e.target.value) setGameState(prev => ({
                                            ...prev,
                                            dogs: { ...prev.dogs, goldDog: e.target.value }
                                        }));
                                    }}
                                >
                                    <option value="">🐕 Asignar</option>
                                    {Object.values(gameState.dogs)
                                        .filter(d => d && typeof d === 'object' && d.hired && d.assignedTo === null)
                                        .map(d => (
                                            <option key={d.id} value={d.id}>🐕 {d.id}</option>
                                        ))
                                    }
                                </select>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <BiomeSelectorModal
                isOpen={biomeSelectorOpen}
                onClose={() => setBiomeSelectorOpen(false)}
                onSelectBiome={(biome) => {
                    setSelectedBiome(biome);
                    setBiomeSelectorOpen(false);
                    setMinesModalOpen(true);
                }}
                currentGold={gameState.gold}
                unlockedTypes={gameState.mines.unlockedTypes}
                onUnlockBiome={(type) => handleUnlockMineType(type)}
                unlockedBiomes={gameState.mines.unlockedBiomes}
                onShowGoldCost={showGoldCost}
            />

            {/* MAPA DE MINAS */}
            <MinesMapModal
                selectedBiome={selectedBiome}
                isOpen={minesModalOpen}
                onClose={() => setMinesModalOpen(false)}
                unlockedTypes={gameState.mines.unlockedTypes}
                bestScores={gameState.mines.bestScores}
                minesConfig={MinesConfig}
                onUnlockType={(type) => { handleUnlockMineType(type); }}
                onEnterMine={(type) => {
                    handleEnterMine(type);
                    setTimeout(() => {
                        setGameState(prev => {
                            if (prev.mines.currentMine?.mineType === type) {
                                setMinesModalOpen(false);
                                setIsMineScreenOpen(true);
                            }
                            return prev;
                        });
                    }, 50);
                }}
                onDiscardMine={handleDiscardMine}
                currentGold={gameState.gold}
                currentPickaxeMaterial={gameState.pickaxe.material}
                bgImage={getMinesBg(selectedBiome)}
                yacimientos={gameState.yacimientos}
                onPlantMena={handlePlantMena}
                onMineYacimiento={handleMineYacimiento}
                onRepairYacimiento={handleRepairYacimiento}
                onUnlockYacimientoSlot={handleUnlockYacimientoSlot}
                currentMaterials={{
                    bronze: gameState.bronze,
                    iron: gameState.iron,
                    diamond: gameState.diamond,
                }}
                dogs={gameState.dogs}
                onAssignDog={handleAssignDog}
                onUnassignDog={handleUnassignDog}
            />

            {/* PANTALLA DE MINA INTERIOR */}
            <MineScreen
                isOpen={isMineScreenOpen}
                onClose={() => { handleExitMine(); setIsMineScreenOpen(false); }}
                currentMine={gameState.mines.currentMine}
                onMineVein={handleMineVein}
                pickaxeMaterial={gameState.pickaxe.material}
                canMine={gameState.stamina > 0 && gameState.pickaxe.durability > 0}
            />

            {/* TABERNA */}
            <TavernModal
                isOpen={tavernModalOpen}
                onClose={() => setTavernModalOpen(false)}
                bronzeIngot={gameState.bronzeIngot}
                ironIngot={gameState.ironIngot}
                diamondIngot={gameState.diamondIngot}
                bronze={gameState.bronze}
                iron={gameState.iron}
                diamond={gameState.diamond}
                tavernCoins={gameState.tavernCoins}
                onConvert={handleConvertMaterial}
                onConvertCoins={handleConvertCoinsToGold}
                onConvertGoldToIngot={handleConvertGoldToIngot}
                gold={gameState.gold}
                dogs={gameState.dogs}
                onHireDog={handleHireDog}
            />

            {/* FORJA */}
            <ForgeModal
                isOpen={forgeModalOpen}
                onClose={() => setForgeModalOpen(false)}
                gameState={gameState}
                onUnlockFurnace={handleUnlockFurnace}
                onStartSmelt={handleStartSmelt}
                onCollectIngot={handleCollectIngot}
                onUpgradeFurnace={handleUpgradeFurnace}
            />

            {/* SETTINGS */}
            <div className="hud-top-right">
                <button className="btn-settings" onClick={() => setMenuOpenModal(prev => !prev)}>
                    <Settings />
                </button>
                <button
                    className={`btn-rewards ${gameState.rewards?.hasUnclaimed ? "btn-rewards-pulse" : ""}`}
                    onClick={() => setRewardsOpen(true)}
                >
                    🏆
                </button>
            </div>

            <RewardsModal
                isOpen={rewardsOpen}
                onClose={() => setRewardsOpen(false)}
                gameState={gameState}
                onClaimReward={handleClaimReward}
                onClaimCoinReward={handleClaimCoinReward}
            />

            {/* MENA DE ORO — elemento principal clickeable */}
            <GoldMine
                onMineClick={handleMineClick}
                goldPerMine={gameState.pickaxe.goldPerMine}
                canMine={gameState.stamina > 0 && gameState.pickaxe.durability > 0}
                currentCombo={gameState.comboCount}
                comboMilestones={gameState.comboMilestones}
            />

        </div>
    )
}

export default GameRoot;