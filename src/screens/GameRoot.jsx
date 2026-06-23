import { useState, useEffect, useMemo, useRef } from "react";
import { playSfx } from "../game/utils/sfx.js";
import satUpgrade from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-upgrade.png";
import satEnergy from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-energy.png";
import satRepair from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-reapir.png";
import { DogsConfig } from "../game/config/DogsConfig.js";
import { ForgeDogsConfig } from "../game/config/ForgeDogsConfig.js";

// ===== HOOKS =====
import useGoldPerSecond from "../game/hooks/useGoldPerSecond.js";
import { useGameActions } from "../game/hooks/useGameActions.js";
import { useAutoMining } from "../game/hooks/useAutoMining.js";
import useSnackBuffs from "../game/hooks/useSnackBuffs.js";
import useAutomine from "../game/hooks/useAutomine.js";
import useAutomineCooldown from "../game/hooks/useAutomineCooldown.js";
import useDogsAutomine from "../game/hooks/useDogsAutomine.js";
import { useBackgroundMusic } from "../game/hooks/useBackgroundMusic.js";
import { useFloatingNumbers } from "../game/hooks/useFloatingNumbers.js";
import { useBurst } from "../game/hooks/useBurst.js";
import { useGoldTrickle } from "../game/hooks/useGoldTrickle.js";
import { useRentalTimer } from "../game/hooks/useRentalTimer.js";
import { useFragmentRewardsUnlock } from "../game/hooks/useFragmentRewardsUnlock.js";
import { useTutorialTriggers } from "../game/hooks/useTutorialTriggers.js";
import { AutomineConfig } from "../game/config/AutomineConfig.js";
import { formatNumber, formatNumber2, formatRentalTimer } from "../game/utils/formatters.js";
import { InitialDogsState } from "../game/initialState/InitialDogsState.js";
import { InitialForgeDogsState } from "../game/initialState/InitialForgeDogsState.js";

// ===== ESTADOS INICIALES =====
import InitialGameState from "../game/initialState/InitialGameState.js";
import InitialRewardsState from "../game/initialState/InitialRewardsState.js";
import { loadSavedState } from "../game/initialState/loadSavedState.js";

// ===== COMPONENTES =====
import UpgradeModal from "../components/modals/UpgradeModal.jsx";
import ModalsMenu from "../components/modals/ModalsMenu.jsx";
import PickaxeModal from "../components/modals/PickaxeModal.jsx";
import TavernModal from "./modalTavern/TavernModal.jsx";
import RentalModal from "./modalRental/RentalModal.jsx";
import GoldMine from "../components/GoldMine.jsx";
import TutorialPointer from "../components/TutorialPointer.jsx";
import TutorialDialog from "../components/TutorialDialog.jsx";
import ForgeModal from "../screens/modalForge/ForgeModal";
import BiomeSelectorModal from "../screens/modalMine/BiomeSelectorModal.jsx";

import RewardsModal from "../screens/RewardsModal.jsx";
import RaidScreen from "../screens/modalRaid/RaidScreen.jsx";
import GlobalDogSlots from "../components/GlobalDogSlots.jsx";
// ===== ASSETS: HUD PRINCIPAL =====
import cofre from "../assets/ui/icons-hud/hud-principal/cofre-oro1.png";
import gold1 from "../assets/ui/icons-hud/hud-principal/oro1.png";
import coinTavern from "../assets/ui/icons-hud/hud-principal/coin-tavern1.png";
import stamina1 from "../assets/ui/icons-hud/hud-principal/stamina-1.png";
import goldOpen from "../assets/ui/icons-hud/hud-principal/gold-open.png";
import repair from "../assets/ui/icons-hud/hud-principal/repair.png";
import refillStaminaIcon from "../assets/ui/icons-hud/hud-principal/refill-stamina.png";

import iconBronze from "../assets/ui/icons-forge/lingotes/lingote-bronze.png";
import iconIron from "../assets/ui/icons-forge/lingotes/lingote-iron.png";
import iconDiamond from "../assets/ui/icons-forge/lingotes/lingote-diamond.png";

import menaBronze from "../assets/ui/icons-forge/menas-hud/bronzeHud.png";
import menaIron from "../assets/ui/icons-forge/menas-hud/ironHud.png";
import menaDiamond from "../assets/ui/icons-forge/menas-hud/diamondHud.png";

// ===== ASSETS: FONDOS =====
import bgMain from "../assets/backgrounds/fondo4.png";

// ===== ASSETS: FONDOS MINES =====

import bgMineBronze from "../assets/backgrounds/bg-mines/bg-mine-bronze.png";
import bgMineIron from "../assets/backgrounds/bg-mines/bg-mine-iron.png";
import bgMineDiamond from "../assets/backgrounds/bg-mines/bg-mine-diamond.png";

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

// ===== ASSETS: ICONOS PANTALLAS =====
import mineModal from "../assets/ui/icon-mine1.png";
import iconTavern from "../assets/ui/icon-tavern1.png";
import iconForge from "../assets/ui/icon-forge1.png";

// ===== ASSETS: MODALES =====
import bgGold from "../assets/backgrounds/bg-modals-hud/fondoGold.png";
import iconGold from "../assets/ui/icons-hud/hud-modals/icon-gold-second.png";
import buttonUpgrade from "../assets/ui/icons-hud/hud-modals/buttonUpgrade.png";
import bgStamina from "../assets/backgrounds/bg-modals-hud/bgStamina.png";
import bgPickaxe from "../assets/backgrounds/bg-modals-hud/fondoWorkShop.png";
import PickAxeUp from "../assets/ui/icons-hud/hud-modals/btn-pickAxeUp.png";
import btnTier from "../assets/ui/icons-hud/hud-modals/btnTier.png";

import ladyIcon from "../assets/ui/icons-pets/mineros/lady-icon.png";

// ===== MINAS =====
import InitialMinesState from "../game/initialState/InitialMinesState.js";
import MinesMapModal from "../screens/modalMine/MinesMapModal.jsx";
import MineScreen from "../screens/modalMine/MineScreen.jsx";
import { GameContext } from "../game/context/GameContext.jsx";

// ===== CSS =====
import "../styles/gameRoot.css";

// ===== ICONS =====
import { Settings } from "lucide-react";
import CombatScreen from "./modalCombat/CombatScreen.jsx";

function GameRoot({ onBack }) {
  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem('music_volume');
    return saved === null ? 0.08 : parseFloat(saved);
  });
  const [sfxVolume, setSfxVolume] = useState(() => {
    const saved = localStorage.getItem('sfx_volume');
    return saved === null ? 0.09 : parseFloat(saved);
  });

  const handleMusicVolume = (val) => {
    setMusicVolume(val);
    localStorage.setItem('music_volume', val);
  };
  const handleSfxVolume = (val) => {
    setSfxVolume(val);
    localStorage.setItem('sfx_volume', val);
  };

  // ===== ESTADOS UI =====
  const [isResetting, setIsResetting] = useState(false);
  const [isMineScreenOpen, setIsMineScreenOpen] = useState(false);
  const [openModal, setOpenModal] = useState(null);
  const [menuOpenModal, setMenuOpenModal] = useState(false);
  const [minesModalOpen, setMinesModalOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(null);
  const { floats: goldFloats, add: addGoldFloat } = useFloatingNumbers();
  const { floats: tavernFloats, add: addTavernFloat } = useFloatingNumbers();
  const [tavernModalOpen, setTavernModalOpen] = useState(false);
  const [forgeModalOpen, setForgeModalOpen] = useState(false);

  useBackgroundMusic(musicVolume);

  const [selectedBiome, setSelectedBiome] = useState(null);
  const [biomeSelectorOpen, setBiomeSelectorOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [raidOpen, setRaidOpen] = useState(false);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [combatOpen, setCombatOpen] = useState(false);
  const [now, setNow] = useState(0);



  // ===== GAME STATE — carga desde localStorage si existe =====
  const [gameState, setGameState] = useState(loadSavedState);

  // ===== AUTO-SAVE — guarda en localStorage en cada cambio =====
  useEffect(() => {
    if (!isResetting) {
      localStorage.setItem("ladyHungryGame", JSON.stringify(gameState));
    }
  }, [gameState, isResetting]);

  useFragmentRewardsUnlock(gameState, setGameState);

  // ===== NUEVO JUEGO — borra save y recarga =====
  const handleNewGame = () => {
    if (
      window.confirm(
        "¿Seguro que quieres empezar un nuevo juego? Se perderá todo el progreso.",
      )
    ) {
      setIsResetting(true);
      localStorage.removeItem("ladyHungryGame");
      setTimeout(() => location.reload(), 0);
    }
  };

  // ===== FLOATING NUMBERS — oro =====
  const showGoldCost = (cost) => addGoldFloat('cost', { value: -cost }, 1500);
  const showGoldGain = (amount) => addGoldFloat('gain', { value: +amount }, 1500);

  // ===== FLOATING NUMBERS — COIN TAVERN =====
  const showTavernCost = (cost) => addTavernFloat('cost', { value: -cost }, 1500);
  const showTavernGain = (amount) => addTavernFloat('gain', { value: +amount }, 1500);

  // ===== ACTIONS — todas las funciones de lógica del juego =====
  const {
    handleBuyGoldPerSecondUpgrade,
    handleBuyMaxStaminaUpgrade,
    handleActivateBurst,
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
    handleActivateMineBonus,
    handleActivateMineUlt,
    handleUnlockTutorialFeature,
    handleUnlockSnack,
    handleUpgradeSnack,
    handleUseSnack,
    handleConvertMaterial,
    handleUnlockAutomine,
    handleActivateAutomine,
    handleStopAutomine,
    handleAutomineUpgrade,
    handleActivatePoder,
    handleUnlockTavern,
    handleUnlockMinesMap,
    handleConvertCoinsToGold,
    handleUnlockForge,
    handleUnlockFurnace,
    handleStartSmelt,
    handleCollectIngot,
    handleUpgradeFurnace,
    handleClaimReward,
    handleClaimCoinReward,
    handleClaimFragmentReward,

    handleUnlockYacimientoSlot,
    handleActivateYacimiento,
    handleConvertGoldToIngot,
    handleHireDog,
    handleAssignDog,
    handleUnassignDog,
    handleDogTick,
    handleHireForgeDog,
    handleAssignForgeDog,
    handleUnassignForgeDog,
    handleUnlockWithFragments,
    handleUpgradeStar,
    handleOpenPack,
    handleFreePull,
    handleBuyMineSnack,
    handleUseMineSnack,
    handleDynamiteMine,
    handleSendPassiveRaid,
    handleClaimPassiveRaid,
    handleCancelPassiveRaid,
  } = useGameActions(
    gameState,
    setGameState,
    showGoldCost,
    showTavernCost,
    showGoldGain,
    showTavernGain,
  );

  // ===== MINE CLICK COUNT — GlobalDogSlots escucha este contador para disparar floats de slots =====
  const [mineClickCount, setMineClickCount] = useState(0);
  const notifyMineClick = () => setMineClickCount(c => c + 1);

  // ===== CONTEXT VALUE =====
  const contextValue = {
    gameState,
    setGameState,
    handleBuyGoldPerSecondUpgrade,
    handleBuyMaxStaminaUpgrade,
    handleActivateBurst,
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
    handleActivateMineBonus,
    handleActivateMineUlt,
    handleUnlockTutorialFeature,
    handleUnlockSnack,
    handleUpgradeSnack,
    handleUseSnack,
    handleConvertMaterial,
    handleUnlockAutomine,
    handleActivateAutomine,
    handleStopAutomine,
    handleAutomineUpgrade,
    handleActivatePoder,
    handleUnlockTavern,
    handleUnlockMinesMap,
    handleConvertCoinsToGold,
    handleUnlockForge,
    handleUnlockFurnace,
    handleStartSmelt,
    handleCollectIngot,
    handleUpgradeFurnace,
    handleClaimReward,
    handleClaimCoinReward,
    handleClaimFragmentReward,
    handleUnlockYacimientoSlot,
    handleActivateYacimiento,
    handleConvertGoldToIngot,
    handleHireDog,
    handleAssignDog,
    handleUnassignDog,
    handleDogTick,
    handleHireForgeDog,
    handleAssignForgeDog,
    handleUnassignForgeDog,
    handleUnlockWithFragments,
    handleUpgradeStar,
    handleOpenPack,
    handleFreePull,
    handleBuyMineSnack,
    handleUseMineSnack,
    handleDynamiteMine,
    handleSendPassiveRaid,
    handleClaimPassiveRaid,
    handleCancelPassiveRaid,
    showGoldCost,
    showGoldGain,
    showTavernCost,
    showTavernGain,
    mineClickCount,
    notifyMineClick,
  };

  // ===== TUTORIAL HANDLERS =====
  const handleSkipTutorial = () => {
    setGameState(prev => ({
      ...prev,
      tutorial: {
        ...prev.tutorial,
        completed: true,
        introDone: true,
        minesHinted: true,
        snacksHinted: true,
        staminaUnlocked: true,
        pickaxeUnlocked: true,
        pickaxeUpgradeDone: true,
        staminaUpgradeDone: true,
        goldPerSecondBought: true,
      }
    }));
    setOpenModal(null);
    setTutorialStep(null);
  };

  const handleTutorialAction = () => {
    if (tutorialStep === 'intro') {
      setGameState(prev => ({
        ...prev,
        tutorial: { ...prev.tutorial, introDone: true }
      }));
    } else if (tutorialStep === '0_snacks') {
      setGameState(prev => ({
        ...prev,
        tutorial: { ...prev.tutorial, snacksHinted: true }
      }));
      setOpenModal(null);
    } else if (tutorialStep === 'hint_tavern') {
      setTutorialStep('hint_mine');
    } else if (tutorialStep === 'hint_mine') {
      setTutorialStep('hint_forge');
    } else if (tutorialStep === 'hint_forge') {
      setGameState(prev => ({
        ...prev,
        tutorial: { ...prev.tutorial, minesHinted: true }
      }));
      setTutorialStep('stamina_hint');
    } else if (tutorialStep === 'automine_hint') {
      setTutorialStep('hint_rewards');
    } else if (tutorialStep === 'hint_mine_dog') {
      setTutorialStep('done');
    } else if (tutorialStep === 'done') {
      setGameState(prev => ({
        ...prev,
        tutorial: { ...prev.tutorial, completed: true }
      }));
      setTutorialStep(null);
    }
  };

  // ===== PICKAXE LOGIC =====
  // Determina si el upgrade es de tier o de material
  const isTierUpgrade = gameState.pickaxe.tier < 5;
  const handlePickaxeUpgrade = isTierUpgrade
    ? handleUpgradePickaxeTier
    : handleUpgradePickaxeMaterial;

  const tierIngotCost =
    gameState.pickaxe.tierIngotCosts?.[gameState.pickaxe.material]?.[
    gameState.pickaxe.tier
    ];
  const canAffordTierUpgrade = (gameState.tutorial?.pickaxeUpgradeDone && !gameState.tutorial?.completed)
    ? false
    : gameState.gold >= (gameState.pickaxe.tierUpgradeCosts?.[gameState.pickaxe.material] || 0) &&
      (!tierIngotCost || gameState[tierIngotCost.type] >= tierIngotCost.amount);

  const materialUpgradeCost =
    gameState.pickaxe.materialUpgradeCosts?.[gameState.pickaxe.material];
  const canAffordMaterialUpgrade =
    gameState.pickaxe.tier === 5 &&
    gameState.gold >= (materialUpgradeCost?.gold || 0) &&
    (gameState[materialUpgradeCost?.ingot?.type] ?? 0) >=
    (materialUpgradeCost?.ingot?.amount || 0);

  // Devuelve imagen del pico según material y tier actual
  const getPickaxeIcon = (material, tier) => {
    const icons = {
      stone: [pickAxeStone, pickAxeStone1, pickAxeStone2, pickAxeStone3],
      bronze: [pickAxeBronze, pickAxeBronze1, pickAxeBronze2, pickAxeBronze3],
      metal: [pickAxeIron, pickAxeIron1, pickAxeIron2, pickAxeIron3],
      diamond: [
        pickAxeDiamond,
        pickAxeDiamond1,
        pickAxeDiamond2,
        pickAxeDiamond3,
      ],
    };
    // tier 0→0, 1→1, 2→1, 3→2, 4→2, 5→3
    const assetMap = [0, 1, 1, 2, 2, 3];
    return icons[material]?.[assetMap[tier]] || pickAxeStone;
  };

  useRentalTimer(setGameState);


  // ===== HOOKS DE SISTEMA =====
  useGoldPerSecond(gameState, setGameState); // Tick oro/segundo
  useAutoMining(gameState, handleMine, setGameState); // Automina continua
  useSnackBuffs(gameState, setGameState); // Aplica buffs activos
  useAutomine(gameState, handleMineClick, handleStopAutomine); // Automine manual
  useAutomineCooldown(gameState, setGameState); // Recupera cargas de automine
  useDogsAutomine(gameState, handleDogTick);

  useBurst(setGameState);

  // Cargas disponibles de automine
  const availableCharges =
    gameState.automine?.charges?.filter((c) => c.available).length || 0;

  // ===== FLOATING NUMBERS — ores =====

  // Muestra número flotante al recibir recompensa de mina

  // Actualiza "now" cada segundo para los timers de automine
  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calcula segundos restantes por cada carga de automine
  const chargeTimers = useMemo(() => {
    if (!gameState.automine?.charges) return [];
    return gameState.automine.charges.map((charge) => {
      if (charge.available) return null;
      if (!charge.cooldownUntil) return null;
      return Math.max(0, Math.ceil((charge.cooldownUntil - now) / 1000));
    });
  }, [gameState.automine?.charges, now]);

  const effectiveRecoveryTime = useMemo(() => {
    const level = gameState.automineUpgradeLevel ?? 0;
    const reduction = AutomineConfig.chargeUpgrades
      .slice(0, level)
      .reduce((sum, u) => sum + u.reductionSeconds, 0);
    return AutomineConfig.chargeRecoveryTime - reduction;
  }, [gameState.automineUpgradeLevel]);


  useGoldTrickle(gameState.dogs?.globalSlots, setGameState);

  useTutorialTriggers({ tutorialStep, setTutorialStep, gameState, setGameState, setOpenModal, setRentalModalOpen, handleUnlockTutorialFeature });

  // Sonido al gastar oro o monedas
  const prevGoldRef = useRef(null);
  const prevCoinsRef = useRef(null);
  const skipUpgradeSoundRef = useRef(false);
  useEffect(() => {
    const gold = gameState.gold ?? 0;
    const coins = gameState.tavernCoins ?? 0;
    if (prevGoldRef.current !== null && prevCoinsRef.current !== null) {
      if (gold < prevGoldRef.current || coins < prevCoinsRef.current) {
        if (!skipUpgradeSoundRef.current) {
          playSfx('upgrade');
        }
        skipUpgradeSoundRef.current = false;
      }
    }
    prevGoldRef.current = gold;
    prevCoinsRef.current = coins;
  }, [gameState.gold, gameState.tavernCoins]);

  // Pausa/reanuda snacks de mina según si la pantalla está abierta
  useEffect(() => {
    setGameState(prev => {
      const snacks = prev.mineSnacks;
      const updated = { ...snacks };
      ['automine', 'toughness'].forEach(id => {
        const s = snacks[id];
        if (!s) return;
        if (isMineScreenOpen) {
          if (s.remainingMs > 0) {
            updated[id] = { ...s, activeUntil: Date.now() + s.remainingMs, remainingMs: 0 };
          }
        } else {
          if (s.activeUntil && s.activeUntil > Date.now()) {
            updated[id] = { ...s, remainingMs: s.activeUntil - Date.now(), activeUntil: null };
          }
        }
      });
      return { ...prev, mineSnacks: updated };
    });
  }, [isMineScreenOpen]);

  const drinkBuff = gameState.snacks?.drink?.active?.type === 'stamina' ? (gameState.snacks.drink.active.effect ?? 0) : 0;
  const effectiveMaxStamina = gameState.maxStamina + drinkBuff;

  const effectiveMaxDurability = (gameState.dogs?.globalSlots ?? []).reduce((sum, dogId) => {
    if (!dogId) return sum;
    const bonus = ForgeDogsConfig[dogId]?.globalSlotBonus;
    return bonus?.type === 'maxDurability' ? sum + bonus.value : sum;
  }, gameState.pickaxe.maxDurability);

  const FREE_PULL_COOLDOWNS = { basic: 5 * 3600000, epic: 10 * 3600000, legendary: 24 * 3600000 };
  const hasFreePacks = ['miner_basic', 'miner_epic', 'miner_legendary', 'forge_basic', 'forge_epic', 'forge_legendary'].some(key => {
    const packId = key.split('_')[1];
    return Date.now() - (gameState.lastFreePull?.[key] ?? 0) >= FREE_PULL_COOLDOWNS[packId];
  });
  const STAR_GOLD_BASE_CHECK = { rare: 5000, epic: 10000, legendary: 15000 };
  const STAR_COIN_BASE_CHECK = { rare: 1, epic: 2, legendary: 3 };
  const _checkDogsPending = (dogsState, config) =>
    Object.entries(dogsState).some(([id, dog]) => {
      const cfg = config[id];
      if (!cfg) return false;
      const frags = dog.fragments ?? 0;
      const stars = dog.stars ?? 0;
      if (!dog.hired) {
        const { gold: goldCost = 0, tavernCoins: coinCost = 0 } = cfg.unlockCost ?? {};
        return frags >= cfg.unlockFragments && gameState.gold >= goldCost && gameState.tavernCoins >= coinCost;
      }
      if (stars < 5) {
        const needed = cfg.starFragments?.[stars] ?? Infinity;
        const starGold = (STAR_GOLD_BASE_CHECK[cfg.rarity] ?? 0) + stars * 5000;
        const starCoin = (STAR_COIN_BASE_CHECK[cfg.rarity] ?? 0) + stars;
        return frags >= needed && gameState.gold >= starGold && gameState.tavernCoins >= starCoin;
      }
      return false;
    });
  const hasPendingDogAction = _checkDogsPending(gameState.dogs ?? {}, DogsConfig) || _checkDogsPending(gameState.forgeDogs ?? {}, ForgeDogsConfig);

  const getMinesBg = (biome) => {
    if (biome === "bronze") return bgMineBronze;
    if (biome === "iron") return bgMineIron;
    if (biome === "diamond") return bgMineDiamond;
    return null;
  };

  // ===== RENDER =====
  const [debugOpen, setDebugOpen] = useState(false);
  const MINER_DOGS = ['lady','tokio','tuka','muna','chihuahua','bully','smoke','nupito','boxer','druh','gordo','zeus'];
  const FORGE_DOGS  = ['pip','koda','milo','rocky','bruno','max','rex','toby','buddy'];
  const handleDebugSetStars = (dogId, delta) => {
    setGameState(prev => {
      const dog = prev.dogs[dogId];
      if (!dog) return prev;
      const newStars = Math.min(5, Math.max(0, (dog.stars ?? 0) + delta));
      return { ...prev, dogs: { ...prev.dogs, [dogId]: { ...dog, hired: true, fragments: 999, stars: newStars } } };
    });
  };
  const handleDebugSetForgeStars = (dogId, delta) => {
    setGameState(prev => {
      const dog = prev.forgeDogs?.[dogId];
      if (!dog) return prev;
      const newStars = Math.min(5, Math.max(0, (dog.stars ?? 0) + delta));
      return { ...prev, forgeDogs: { ...prev.forgeDogs, [dogId]: { ...dog, hired: true, fragments: 999, stars: newStars } } };
    });
  };

  return (
    <GameContext.Provider value={contextValue}>
      <div
        className="game-container"
        style={{ backgroundImage: `url(${bgMain})` }}
      >
        {onBack && (
          <button className="game-back-btn" onClick={onBack} title="Volver">‹</button>
        )}
        {/* DEBUG */}
        {false && <button onClick={() => setDebugOpen(o => !o)} style={{ position:'fixed', top:4, left:4, zIndex:9999, fontSize:10, padding:'2px 6px', background:'#222', color:'#ff0', border:'1px solid #ff0', borderRadius:4, cursor:'pointer' }}>
          DEV
        </button>}
        {debugOpen && (
          <div style={{ position:'fixed', top:24, left:4, zIndex:9999, background:'#111', border:'1px solid #ff0', borderRadius:6, padding:'6px 8px', display:'flex', flexDirection:'column', gap:4, minWidth:160, maxHeight:'80vh', overflowY:'auto' }}>
            {/* RECURSOS */}
            <span style={{ fontSize:9, color:'#ff0', fontWeight:800, letterSpacing:1 }}>RECURSOS</span>
            <button
              onClick={() => setGameState(prev => ({ ...prev, gold: prev.gold + 100000 }))}
              style={{ fontSize:10, padding:'2px 4px', background:'#332200', color:'#ffd740', border:'1px solid #ffd740', borderRadius:3, cursor:'pointer' }}
            >+100k oro</button>
            <button
              onClick={() => setGameState(prev => ({ ...prev, tavernCoins: prev.tavernCoins + 500 }))}
              style={{ fontSize:10, padding:'2px 4px', background:'#002233', color:'#4dd0e1', border:'1px solid #4dd0e1', borderRadius:3, cursor:'pointer' }}
            >+500 tavern</button>
            <button
              onClick={() => setGameState(prev => ({ ...prev, tutorial: { ...prev.tutorial, completed: true, currentStep: 3, staminaUnlocked: true, pickaxeUnlocked: true, minesUnlocked: true, goldPerSecondBought: true, pickaxeUpgradeDone: true, introDone: true, minesHinted: true, snacksHinted: true, automineHinted: true, forgeIntroDone: true, tavernIntroDone: true, cambistaIntroDone: true, dogsIntroDone: true, raidIntroDone: true, rentalTutorialStep: 3, sobreIntroDone: true, mineIntroBronzeDone: true, mineIntroIronDone: true, mineIntroDiamondDone: true } }))}
              style={{ fontSize:10, padding:'2px 4px', background:'#002200', color:'#69f080', border:'1px solid #69f080', borderRadius:3, cursor:'pointer' }}
            >skip tutorial</button>
            {/* MINEROS */}
            <span style={{ fontSize:9, color:'#ff0', fontWeight:800, letterSpacing:1 }}>MINEROS</span>
            <button
              onClick={() => setGameState(prev => {
                const updated = { ...prev.dogs };
                MINER_DOGS.forEach(id => { if (updated[id]) updated[id] = { ...updated[id], hired: true, fragments: 999, stars: 0 }; });
                return { ...prev, dogs: updated };
              })}
              style={{ fontSize:10, padding:'2px 4px', background:'#331100', color:'#ff9944', border:'1px solid #ff9944', borderRadius:3, cursor:'pointer' }}
            >desbloquear + 0★</button>
            {MINER_DOGS.map(id => (
              <div key={id} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#fff' }}>
                <span style={{ width:70 }}>{id}</span>
                <span style={{ width:14, textAlign:'center', color:'#ffd740' }}>{gameState.dogs[id]?.stars ?? 0}</span>
                <button onClick={() => handleDebugSetStars(id, -1)} style={{ padding:'0 5px', background:'#333', color:'#fff', border:'1px solid #555', borderRadius:3, cursor:'pointer' }}>-</button>
                <button onClick={() => handleDebugSetStars(id,  1)} style={{ padding:'0 5px', background:'#333', color:'#fff', border:'1px solid #555', borderRadius:3, cursor:'pointer' }}>+</button>
              </div>
            ))}
            {/* FORJA */}
            <span style={{ fontSize:9, color:'#ff0', fontWeight:800, letterSpacing:1, marginTop:4 }}>FORJA</span>
            <button
              onClick={() => setGameState(prev => {
                const updated = { ...prev.forgeDogs };
                FORGE_DOGS.forEach(id => { if (updated[id]) updated[id] = { ...updated[id], hired: true, fragments: 999, stars: 0 }; });
                return { ...prev, forgeDogs: updated };
              })}
              style={{ fontSize:10, padding:'2px 4px', background:'#331100', color:'#ff9944', border:'1px solid #ff9944', borderRadius:3, cursor:'pointer' }}
            >desbloquear + 0★</button>
            {FORGE_DOGS.map(id => (
              <div key={id} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#fff' }}>
                <span style={{ width:70 }}>{id}</span>
                <span style={{ width:14, textAlign:'center', color:'#ffd740' }}>{gameState.forgeDogs?.[id]?.stars ?? 0}</span>
                <button onClick={() => handleDebugSetForgeStars(id, -1)} style={{ padding:'0 5px', background:'#333', color:'#fff', border:'1px solid #555', borderRadius:3, cursor:'pointer' }}>-</button>
                <button onClick={() => handleDebugSetForgeStars(id,  1)} style={{ padding:'0 5px', background:'#333', color:'#fff', border:'1px solid #555', borderRadius:3, cursor:'pointer' }}>+</button>
              </div>
            ))}
          </div>
        )}

        {/* OVERLAY OSCURO DURANTE TUTORIAL */}
        {tutorialStep !== null && tutorialStep !== 'done' && openModal === null && !rewardsOpen && !rentalModalOpen && !raidOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.85)",
              zIndex: 500,
              pointerEvents: "all",
            }}
          />
        )}

        {/* HEADER — oro + monedas taberna + menú */}
        <div className="gold-menu-display">
          <button
            className="btn-settings btn-settings-header"
            onClick={() => setMenuOpenModal((prev) => !prev)}
          >
            <Settings />
          </button>
          <div className="gold-display">
            <div className="gold-cont" style={{ position: "relative" }}>
              <div className="cont-gold-mena">
                <div className="cont-hud-gold">
                  <img src={cofre} alt="Cofre Oro" />
                  <p>{formatNumber(gameState.gold)}</p>
                </div>

                {/* Números flotantes de gasto de oro */}
                {goldFloats.map(f => (
                  <div key={f.id} className={f.type === 'gain' ? "floating-gold-gain" : "floating-gold-cost1"}>
                    {f.type === 'gain' ? `+${f.value}` : f.value}
                  </div>
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
                <div className="container-coinTavern" style={{ position: "relative" }}>
                  <img src={coinTavern} alt="Coin-Tavern" />
                  <span>{formatNumber2(gameState.tavernCoins)}</span>
                  {tavernFloats.map(f => (
                    <div key={f.id} className={f.type === 'gain' ? "floating-gold-gain" : "floating-gold-cost1"} style={{ color: f.type === 'gain' ? "#7eff7e" : "#f0c040" }}>
                      {f.type === 'gain' ? `+${f.value}` : f.value}
                    </div>
                  ))}
                </div>

                <div className="container-lingotes">
                  <div className="icon-lingotes">
                    <img src={iconBronze} loading="lazy" alt="iconBronze" />
                    <span>{formatNumber2(gameState.bronzeIngot)}</span>
                  </div>

                  <div className="icon-lingotes">
                    <img src={iconIron} loading="lazy" alt="iconIron" />
                    <span>{formatNumber2(gameState.ironIngot)}</span>
                  </div>

                  <div className="icon-lingotes">
                    <img src={iconDiamond} loading="lazy" alt="iconDiamond" />
                    <span>{formatNumber2(gameState.diamondIngot)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ModalsMenu
            isOpen={menuOpenModal}
            onClose={() => setMenuOpenModal(false)}
            onNewGame={handleNewGame}
            musicVolume={musicVolume}
            onMusicVolume={handleMusicVolume}
            sfxVolume={sfxVolume}
            onSfxVolume={handleSfxVolume}
          />
        </div>

        {/* HUD — oro/seg, stamina, pico */}
        <div className="game-info">
          {/* ORO/SEGUNDO */}
          <div className="gold-per-sec">
            <img className="img-goldSec" src={gold1} alt="Oro" />
            <p>+{gameState.goldPerSecond}</p>
            <button
              onClick={() => {
                if (tutorialStep !== 0) setTutorialStep(null);
                setOpenModal("goldPerSecond");
              }}
              disabled={!gameState.tutorial?.completed && tutorialStep !== 0}
              className={`openDisplay1 ${tutorialStep === 0 && openModal === null ? "tutorial-highlight" : ""}`}
              style={{ position: "relative" }}
            >
              <img src={goldOpen} alt="icon goldOpen" />
              {tutorialStep === 0 && openModal === null && <TutorialPointer step={0} />}
            </button>
          </div>

          {/* Modal oro/segundo + snacks */}
          <UpgradeModal
            isOpen={openModal === "goldPerSecond"}
            onClose={() => setOpenModal(null)}
            currentLevel={`x${gameState.goldPerSecondLevel}`}
            cost={gameState.goldPerSecondCost}
            onUpgrade={handleBuyGoldPerSecondUpgrade}
            canAfford={gameState.gold >= gameState.goldPerSecondCost && !(gameState.tutorial?.goldPerSecondBought && !gameState.tutorial?.completed)}
            tutorialStep0Active={!gameState.tutorial?.completed}
            tutorialPhase={
              tutorialStep === 0 ? 'upgrade'
                : tutorialStep === '0_snacks' ? 'snacks'
                  : null
            }
            tutorialHint="goldPerSecond"
            onTutorialAction={handleTutorialAction}
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

          {/* BURST */}
          <div className="stamina-display">
            <button
              style={{ cursor: 'default', pointerEvents: 'none' }}
            >
              <img src={stamina1} loading="lazy" alt="Burst" />
            </button>

            <p>
              {gameState.burst?.recharging
                ? `${gameState.burst.rechargeRemaining}s`
                : `${gameState.stamina}/${effectiveMaxStamina}`}
            </p>

            {/* Mejora burst — abre modal con duración y recarga */}
            <button
              className={`openDisplay2 ${tutorialStep === 1 ? 'tutorial-highlight' : ''}`}
              style={tutorialStep === 1 ? { position: 'relative', zIndex: 600 } : {}}
              onClick={() => { setTutorialStep(null); setOpenModal("maxStamina"); }}
            >
              <img src={refillStaminaIcon} alt="Mejorar burst" />
            </button>
          </div>

          {/* Modal burst — duración + recarga */}
          <UpgradeModal
            isOpen={openModal === "maxStamina"}
            onClose={() => { setOpenModal(null); setTutorialStep(null); }}
            currentLevel={`Nv. ${gameState.maxStaminaLevel} `}
            cost={gameState.maxStaminaCost}
            coinCost={gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10)}
            onUpgrade={() => {
              handleBuyMaxStaminaUpgrade();
              if (!gameState.tutorial?.completed) setOpenModal(null);
            }}
            canAfford={
              gameState.gold >= gameState.maxStaminaCost &&
              gameState.tavernCoins >= (gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10))
            }
            tutorialPhase={!gameState.tutorial?.staminaUpgradeDone && !gameState.tutorial?.completed ? 'upgrade' : null}
            tutorialHint="stamina"
            onTutorialAction={handleTutorialAction}
            tutorialStep0Active={!gameState.tutorial?.completed}
            bgImage={bgStamina}
            iconImage={satEnergy}
            buttonImage={buttonUpgrade}
            title={"Mejorar Burst"}
            showStaminaSnacks={true}
          />

          {/* PICO */}
          <div className="pickaxe-display">
            {/* Icono del pico — solo informativo */}
            <button
              style={{ cursor: 'default', pointerEvents: 'none' }}
            >
              <img
                src={getPickaxeIcon(gameState.pickaxe.material, gameState.pickaxe.tier)}
                loading="lazy"
                alt="Pickaxe"
              />
            </button>

            <p>
              {gameState.pickaxe.durability}/{effectiveMaxDurability}
            </p>

            {/* "+" — abre modal de mejora */}
            <button
              onClick={() => {
                setTutorialStep(null);
                setOpenModal("pickaxe");
              }}
              disabled={!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed}
              className={`openDisplay3 ${tutorialStep === 2 ? 'tutorial-highlight' : ''}`}
              style={tutorialStep === 2 ? { position: 'relative', zIndex: 600 } : {}}
            >
              <img src={repair} alt="Mejorar pico" />
            </button>
          </div>

          {/* Modal pico */}
          <PickaxeModal
            isOpen={openModal === "pickaxe"}
            onClose={() => {
              setOpenModal(null);
              setTutorialStep(null);
            }}
            currentLevel={`Tier ${gameState.pickaxe.tier}`}
            cost={
              gameState.tutorial?.pickaxeUpgradeDone
                ? gameState.pickaxe.tierUpgradeCosts?.[
                gameState.pickaxe.material
                ] || 0
                : 1000
            }
            onUpgrade={() => {
              handlePickaxeUpgrade();
            }}
            canAfford={canAffordTierUpgrade}
            tutorialPhase={!gameState.tutorial?.pickaxeUpgradeDone && !gameState.tutorial?.completed ? 'upgrade' : null}
            tutorialStep0Active={!gameState.tutorial?.completed}
            tutorialHint="pickaxe"
            buttonImage={btnTier}
            iconImage={getPickaxeIcon(
              gameState.pickaxe.material,
              gameState.pickaxe.tier,
            )}
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
        <div className="cont-screens" style={{ display: combatOpen ? 'none' : undefined }}>
          {/* Taberna — bloqueada hasta pagar 1000 oro */}
          <div className="modal-tavern">
            {gameState.tavernUnlocked ? (
              <button
                onClick={() => setTavernModalOpen(true)}
                className={`tavern-btn ${tutorialStep === 'hint_tavern' ? 'tutorial-highlight' : ''} ${(hasFreePacks || hasPendingDogAction) ? 'notify-pulse' : ''}`}
              >
                <img src={iconTavern} alt="Icono-Taberna" />
              </button>
            ) : (
              <button
                onClick={handleUnlockTavern}
                disabled={gameState.gold < 1000}
                className={`tavern-btn tavern-locked ${tutorialStep === 'hint_tavern' ? 'tutorial-highlight' : ''}`}
              >
                <img src={iconTavern} alt="Icono-Taberna" />
                <span className="lock-price-badge"><img src={gold1} alt="gold" />1k</span>
              </button>
            )}
          </div>

          {/* Minas — bloqueadas hasta pagar 2000 oro */}
          <div className="modal-mine">
            {gameState.minesMapUnlocked ? (
              <button
                onClick={() => setBiomeSelectorOpen(true)}
                className={`mines-map-btn ${tutorialStep === 'hint_mine' ? 'tutorial-highlight' : ''}`}
              >
                <img src={mineModal} alt="Icon1" />
              </button>
            ) : (
              <button
                onClick={handleUnlockMinesMap}
                disabled={gameState.gold < 2000}
                className={`mines-map-btn mines-map-locked ${tutorialStep === 'hint_mine' ? 'tutorial-highlight' : ''}`}
              >
                <img src={mineModal} alt="Icon1" />
                <span className="lock-price-badge"><img src={gold1} alt="gold" />2k</span>
              </button>
            )}
          </div>

          {/* Forja — bloqueada hasta pagar 3000 oro */}
          <div className="modal-forge">
            {gameState.forgeUnlocked ? (
              (() => {
                const forgeReady =
                  (gameState.furnaces.bronze.unlocked && !gameState.furnaces.bronze.isActive && gameState.bronze >= 10) ||
                  (gameState.furnaces.iron.unlocked && !gameState.furnaces.iron.isActive && gameState.iron >= 6) ||
                  (gameState.furnaces.diamond.unlocked && !gameState.furnaces.diamond.isActive && gameState.diamond >= 2);
                return (
                  <button onClick={() => setForgeModalOpen(true)} className={`forge-btn ${forgeReady ? 'forge-btn-ready' : ''} ${tutorialStep === 'hint_forge' ? 'tutorial-highlight' : ''}`}>
                    <img src={iconForge} alt="Icon-Forge" />
                  </button>
                );
              })()
            ) : (
              <button
                onClick={handleUnlockForge}
                disabled={gameState.gold < 3000}
                className={`forge-btn forge-btn-locked ${tutorialStep === 'hint_forge' ? 'tutorial-highlight' : ''}`}
              >
                <img src={iconForge} alt="Icon-Forge" />
                <span className="lock-price-badge"><img src={gold1} alt="gold" />3k</span>
              </button>
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
        />

        {/* MAPA DE MINAS */}
        <MinesMapModal
          isOpen={minesModalOpen}
          onClose={() => setMinesModalOpen(false)}
          selectedBiome={selectedBiome}
          bgImage={getMinesBg(selectedBiome)}
          set1Complete={true}
          onEnterMine={(type, companionId) => {
            handleEnterMine(type, companionId === '__none__' ? null : companionId);
            setTimeout(() => {
              setGameState((prev) => {
                if (prev.mines.currentMine?.mineType === type) {
                  setMinesModalOpen(false);
                  setIsMineScreenOpen(true);
                }
                return prev;
              });
            }, 50);
          }}
        />

        {/* PANTALLA DE MINA INTERIOR */}
        <MineScreen
          isOpen={isMineScreenOpen}
          onClose={() => {
            handleExitMine();
            setIsMineScreenOpen(false);
            setMinesModalOpen(true);
          }}
        />

        {/* TABERNA */}
        <TavernModal
          isOpen={tavernModalOpen}
          onClose={() => setTavernModalOpen(false)}
          hasFreePacks={hasFreePacks}
          hasPendingDogAction={hasPendingDogAction}
        />

        {/* ALQUILER */}
        <RentalModal
          isOpen={rentalModalOpen}
          onClose={() => setRentalModalOpen(false)}
          tutorialStep={tutorialStep}
        />

        {/* FORJA */}
        <ForgeModal
          isOpen={forgeModalOpen}
          onClose={() => setForgeModalOpen(false)}
        />


        {/* SETTINGS */}
        <div
          className="hud-top-right"
          style={{
            display: (combatOpen || rewardsOpen || rentalModalOpen || raidOpen) ? 'none' : undefined,
            zIndex: (tutorialStep === 'hint_rewards' || tutorialStep === 'hint_rental' || tutorialStep === 'hint_raids') ? 600 : undefined,
          }}
        >

          {(() => {
            const passiveRaids = gameState.raid?.passiveRaids ?? [];
            const canClaim = passiveRaids.some(r => now >= r.returnAt);
            const hasFreeDogs =
              Object.values(gameState.dogs ?? {}).some(
                d => d && typeof d === 'object' && !Array.isArray(d) && d.hired && !d.assignedTo
              ) ||
              Object.values(gameState.forgeDogs ?? {}).some(
                d => d && typeof d === 'object' && !Array.isArray(d) && d.hired && !d.assignedTo
              ) ||
              (gameState.rental?.active ?? []).some(r =>
                r.destination === 'raid' &&
                !passiveRaids.some(pr => pr.dogEntries?.some(d => d.id === r.dogId))
              );
            const isRaidStep = tutorialStep === 'hint_raids';
            const raidBlocked = tutorialStep !== null && tutorialStep !== 'done' && !isRaidStep;
            return (
              <button
                className={`btn-raid ${canClaim ? 'btn-raid-ready' : hasFreeDogs ? 'btn-raid-dogs-free' : ''} ${isRaidStep ? 'tutorial-highlight' : ''}`}
                onClick={() => setRaidOpen(true)}
                disabled={raidBlocked}
                style={{ position: 'relative', ...(raidBlocked ? { opacity: 0.3, cursor: 'not-allowed' } : {}) }}
              >
                ⚔️
                {isRaidStep && !raidOpen && <TutorialPointer step="hint_raids" />}
              </button>
            );
          })()}

          {/* ALQUILER */}
          {(() => {
            const rentalAvailable = gameState.rental?.available;
            const activeCount = gameState.rental?.active?.length ?? 0;
            const isRentalStep = tutorialStep === 'hint_rental';
            const inActiveTutorial = tutorialStep !== null && tutorialStep !== 'done';
            const showRentalReady = rentalAvailable && (!inActiveTutorial || isRentalStep);
            const rentalBlocked = inActiveTutorial && !isRentalStep;
            return (
              <button
                className={`btn-rental ${showRentalReady ? 'btn-rental-ready' : !rentalAvailable ? 'btn-rental-recharging' : ''} ${isRentalStep ? 'tutorial-highlight' : ''}`}
                onClick={() => setRentalModalOpen(true)}
                disabled={rentalBlocked}
                style={{ position: 'relative', ...(rentalBlocked ? { opacity: 0.3, cursor: 'not-allowed' } : {}) }}
              >
                <img src={ladyIcon} className="btn-rental-img" alt="alquiler" />
                {activeCount > 0 && (
                  <span className="btn-rental-active-count">{activeCount}</span>
                )}
                {!rentalAvailable && (
                  <span className="btn-rental-timer">{formatRentalTimer(gameState.rental?.appearanceRemainingMs ?? 0)}</span>
                )}
                {isRentalStep && !rentalModalOpen && <TutorialPointer step="hint_rental" />}
              </button>
            );
          })()}

          {(() => {
            const isRewardsStep = tutorialStep === 'hint_rewards';
            const rewardsBlocked = tutorialStep !== null && tutorialStep !== 'done' && !isRewardsStep;
            return (
              <button
                className={`btn-rewards ${gameState.rewards?.hasUnclaimed ||
                  Object.values(gameState.rewards?.coinRewards ?? {}).some(r => typeof r.claimed === 'boolean' && r.unlocked && !r.claimed) ||
                  Object.values(gameState.rewards?.fragmentRewards ?? {}).some(r => r.unlocked && !r.claimed && r.visible !== false)
                  ? "btn-rewards-pulse" : ""
                  } ${isRewardsStep ? 'tutorial-highlight' : ''}`}
                onClick={() => setRewardsOpen(true)}
                disabled={rewardsBlocked}
                style={{ position: 'relative', ...(rewardsBlocked ? { opacity: 0.3, cursor: 'not-allowed' } : {}) }}
              >
                🏆
                {tutorialStep === 'hint_rewards' && !rewardsOpen && <TutorialPointer step="hint_rewards" />}
              </button>
            );
          })()}

        </div>

        <RewardsModal
          isOpen={rewardsOpen}
          onClose={() => {
            setRewardsOpen(false);
            if (tutorialStep === 'hint_rewards') setTutorialStep('hint_rental');
          }}
          tutorialStep={tutorialStep}
        />

        <RaidScreen
          isOpen={raidOpen}
          onClose={() => setRaidOpen(false)}
          onOpenCombat={() => { setRaidOpen(false); setCombatOpen(true); }}
          tutorialStep={tutorialStep}
          onTutorialRaidSent={() => {
            setRaidOpen(false);
            setTutorialStep('hint_mine_dog');
          }}
        />

        <CombatScreen
          isOpen={combatOpen}
          onClose={() => setCombatOpen(false)}
          onBack={() => { setCombatOpen(false); setRaidOpen(true); }}
        />

        {/* MENA DE ORO + AUTOMINE + SLOTS PERROS — posicionados juntos como unidad */}
        <div className="mine-scene" style={
          (tutorialStep === 'stamina_hint' || tutorialStep === 'automine_hint' || tutorialStep === 'repair_hint' || tutorialStep === 'hint_mine_dog')
            ? { zIndex: 600 }
            : undefined
        }>
          {/* AUTOMINE — posición absoluta relativa a mine-scene */}
          <div className="automine-container" style={
            tutorialStep === 'mine_tap' ? { visibility: 'hidden' }
            : (tutorialStep === 'automine_hint' || tutorialStep === 'stamina_hint' || tutorialStep === 'repair_hint')
              ? { zIndex: 600 }
              : undefined
          }>
            <div className="automine-hub-wrap" style={!gameState.automine?.unlocked ? { width: 'auto', height: 'auto' } : undefined}>
              {!gameState.automine?.unlocked ? (
                <button
                  onClick={handleUnlockAutomine}
                  disabled={gameState.gold < AutomineConfig.unlockCost}
                  className={`automine-button unlock${tutorialStep === 'automine_hint' ? ' tutorial-highlight' : ''}`}
                >
                  <img src={getPickaxeIcon(gameState.pickaxe.material, gameState.pickaxe.tier)} alt="Pico" />
                  <span>{formatNumber(AutomineConfig.unlockCost)} oro</span>
                </button>
              ) : (
                <button
                  onClick={handleActivateAutomine}
                  disabled={availableCharges <= 0 || gameState.pickaxe.durability <= 0 || gameState.automine?.isActive}
                  className={`automine-hub charges-${availableCharges}${gameState.automine.isActive ? ' is-active' : ''}`}
                  style={{
                    "--progress1": chargeTimers[0]
                      ? `${Math.round((1 - chargeTimers[0] / effectiveRecoveryTime) * 100) * 3.6}deg`
                      : "0deg",
                    "--progress2": chargeTimers[1]
                      ? `${Math.round((1 - chargeTimers[1] / effectiveRecoveryTime) * 100) * 3.6}deg`
                      : "0deg",
                  }}
                >
                  <img src={getPickaxeIcon(gameState.pickaxe.material, gameState.pickaxe.tier)} alt="Pico" />
                  <span className="automine-charge-count">{availableCharges}/2</span>
                </button>
              )}
              <button
                className={`sat-btn sat-poder sat-pos-energy${gameState.burst?.active ? ' on-cd' : ''}${gameState.burst?.recharging ? ' on-cd' : ''}${tutorialStep === 'stamina_hint' ? ' tutorial-highlight' : ''}`}
                onClick={() => { playSfx('burst'); handleActivateBurst(); }}
                disabled={gameState.burst?.active || gameState.burst?.recharging}
                title={gameState.burst?.recharging ? `Recargando — ${gameState.burst.rechargeRemaining}s` : gameState.burst?.active ? 'Burst activo' : 'Activar Burst'}
                style={tutorialStep === 'stamina_hint' ? { zIndex: 601 } : undefined}
              >
                <div className="sat-poder-inner">
                  <img src={satEnergy} alt="Burst" className="sat-poder-img" />
                  {gameState.burst?.active && (
                    <div className="sat-burst-bar-wrap">
                      <div className="sat-burst-bar" style={{ width: `${Math.max(0, (gameState.stamina / effectiveMaxStamina) * 100)}%` }} />
                    </div>
                  )}
                  {gameState.burst?.recharging && (
                    <span className="sat-poder-overlay">{gameState.burst.rechargeRemaining}s</span>
                  )}
                </div>
                {tutorialStep === 'stamina_hint' && <TutorialPointer step="stamina_hint" />}
              </button>
              {(() => {
                const level = gameState.automineUpgradeLevel ?? 0;
                const atMax = level >= AutomineConfig.chargeUpgrades.length;
                const next = atMax ? null : AutomineConfig.chargeUpgrades[level];
                const lockedUpgrade = !gameState.automine?.unlocked;
                return (
                  <button
                    className={`sat-btn sat-upgrade sat-pos-upgrade${atMax ? ' at-max' : ''}${!atMax && !lockedUpgrade && gameState.gold < next.cost ? ' cant-afford' : ''}${lockedUpgrade ? ' locked-tutorial' : ''}`}
                    onClick={handleAutomineUpgrade}
                    disabled={lockedUpgrade || atMax || gameState.gold < next?.cost}
                    title={lockedUpgrade ? 'Desbloquea el autominar primero' : atMax ? 'Mejora al máximo' : `Mejorar recarga (-${next.reductionSeconds}s) — ${next.cost} oro`}
                  >
                    <div className="sat-upgrade-inner">
                      <img src={satUpgrade} alt="Mejorar" className="sat-upgrade-arrow" />
                      <span className="sat-upgrade-overlay">{atMax ? 'Max' : `${level}/${AutomineConfig.chargeUpgrades.length}`}</span>
                    </div>
                  </button>
                );
              })()}
              <button
                className={`sat-btn sat-repair sat-pos-repair${gameState.pickaxe.durability < effectiveMaxDurability ? ' needs-repair' : ''}${tutorialStep === 'repair_hint' ? ' tutorial-highlight' : ''}`}
                onClick={() => { skipUpgradeSoundRef.current = true; playSfx('repair'); handleRepairPickaxe(); }}
                disabled={gameState.pickaxe.durability >= effectiveMaxDurability || gameState.automine?.isActive}
                title="Reparar pico"
                style={tutorialStep === 'repair_hint' ? { zIndex: 601 } : undefined}
              >
                <img src={satRepair} alt="Reparar" />
                {tutorialStep === 'repair_hint' && <TutorialPointer step="repair_hint" />}
              </button>
            </div>
          </div>
          <GoldMine elevated={tutorialStep === 'mine_tap'} />
          <GlobalDogSlots
            gameState={gameState}
            setGameState={setGameState}
            tutorialStep={tutorialStep}
            hidden={tutorialStep === 'mine_tap'}
          />
        </div>

        {/* TUTORIAL DIALOG */}
        {/* ── Posiciones por paso: ajusta top según donde caiga el botón en pantalla ── */}
        {(() => {
          const DIALOG_POSITIONS = {
            'intro': { bottom: '7rem' },
            0: { bottom: 'auto', top: '9rem' }, //gold x second
            1: { bottom: 'auto', top: '9rem' },
            2: { bottom: 'auto', top: '9rem', left: '12.5rem' },
            'hint_tavern': { bottom: 'auto', top: '14rem' },
            'hint_mine': { bottom: 'auto', top: '14rem' },
            'hint_forge': { bottom: 'auto', top: '14rem' },
            'automine_hint': { bottom: '21rem' },
            'stamina_hint': { bottom: 'auto', top: '7.5rem', left: '12rem' },
            'repair_hint': { bottom: 'auto', top: '12.5rem', left: '12rem' },
            'hint_rewards': { bottom: '18rem' },
            'hint_rental': { bottom: '21.5rem' },
            'hint_raids': { bottom: '25rem' },
            'hint_mine_dog': { bottom: '7.5rem' },
            'done': { bottom: '2rem' },
          };
          const dialogStyle = DIALOG_POSITIONS[tutorialStep] ?? { bottom: '2rem' };
          return (
            <TutorialDialog
              step={openModal === null &&
                tutorialStep !== 'mine_tap' &&
                !(tutorialStep === 'hint_rewards' && rewardsOpen) &&
                !(tutorialStep === 'hint_rental' && rentalModalOpen) &&
                !(tutorialStep === 'hint_raids' && raidOpen)
                ? tutorialStep : null}
              dialogStyle={dialogStyle}
              onSkip={handleSkipTutorial}
              onAction={handleTutorialAction}
              isFirstTime={true}
            />
          );
        })()}


      </div>
    </GameContext.Provider>
  );
}

export default GameRoot;
