import { useState, useEffect, useMemo } from "react";
import { DogsConfig } from "../game/config/DogsConfig.js";
import { RentalConfig } from "../game/config/RentalConfig.js";
import { InitialRentalState } from "../game/initialState/InitialRentalState.js";

// ===== HOOKS =====
import useGoldPerSecond from "../game/hooks/useGoldPerSecond.js";
import { useGameActions } from "../game/hooks/useGameActions.js";
import { useAutoMining } from "../game/hooks/useAutoMining.js";
import useSnackBuffs from "../game/hooks/useSnackBuffs.js";
import useAutomine from "../game/hooks/useAutomine.js";
import useAutomineCooldown from "../game/hooks/useAutomineCooldown.js";
import useDogsAutomine from "../game/hooks/useDogsAutomine.js";
import { useBackgroundMusic } from "../game/hooks/useBackgroundMusic.js";
import { AutomineConfig } from "../game/config/AutomineConfig.js";
import { InitialDogsState } from "../game/initialState/InitialDogsState.js";
import { InitialForgeDogsState } from "../game/initialState/InitialForgeDogsState.js";

// ===== ESTADOS INICIALES =====
import InitialGameState from "../game/initialState/InitialGameState.js";
import InitialPickaxeState from "../game/initialState/InitialPickaxeState.js";
import InitialLadyState from "../game/initialState/lady/InitialLadyState.js";
import InitialRewardsState from "../game/initialState/InitialRewardsState.js";
import InitialYacimientosState from "../game/initialState/InitialYacimientosState.js";

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

import ladyIcon from "../assets/ui/icons-pets/mineros/lady-icon.png";
import tokyoIcon from "../assets/ui/icons-pets/mineros/tokyo-icon.png";
import tukaIcon from "../assets/ui/icons-pets/mineros/tuka-icon.png";
import munaIcon from "../assets/ui/icons-pets/mineros/muna-icon.png";
import gordoIcon from "../assets/ui/icons-pets/mineros/gordo-icon.png";
import druhIcon from "../assets/ui/icons-pets/mineros/druh-icon.png";
import smokeIcon from "../assets/ui/icons-pets/mineros/smoke-icon.png";
import nupitoIcon from "../assets/ui/icons-pets/mineros/nupito-icon.png";
import zeusIcon from "../assets/ui/icons-pets/mineros/zeus-icon.png";
const dogAssets = {
  lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
  muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
  smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
};

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

function GameRoot() {
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('music_enabled');
    return saved === null ? true : saved === 'true';
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem('music_volume');
    return saved === null ? 0.02 : parseFloat(saved);
  });

  const [sfxEnabled, setSfxEnabled] = useState(() => {
    const saved = localStorage.getItem('sfx_enabled');
    return saved === null ? true : saved === 'true';
  });
  const [sfxVolume, setSfxVolume] = useState(() => {
    const saved = localStorage.getItem('sfx_volume');
    return saved === null ? 0.4 : parseFloat(saved);
  });

  const handleMusicToggle = (val) => {
    setMusicEnabled(val);
    localStorage.setItem('music_enabled', val);
  };
  const handleMusicVolume = (val) => {
    setMusicVolume(val);
    localStorage.setItem('music_volume', val);
  };
  const handleSfxToggle = (val) => {
    setSfxEnabled(val);
    localStorage.setItem('sfx_enabled', val);
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
  const [goldFloatingNumbers, setGoldFloatingNumbers] = useState([]);
  const [tavernModalOpen, setTavernModalOpen] = useState(false);
  const [forgeModalOpen, setForgeModalOpen] = useState(false);

  useBackgroundMusic(musicEnabled, musicVolume, tavernModalOpen ? 'tavern' : 'main');

  const [selectedBiome, setSelectedBiome] = useState(null);
  const [biomeSelectorOpen, setBiomeSelectorOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [raidOpen, setRaidOpen] = useState(false);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [combatOpen, setCombatOpen] = useState(false);
  const [globalDogMenuOpen, setGlobalDogMenuOpen] = useState(null); // índice del slot abierto
  const [flippedSlot, setFlippedSlot] = useState(null); // índice del slot girado
  const [now, setNow] = useState(0);

  // ===== GAME STATE — carga desde localStorage si existe =====
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem("ladyHungryGame");
    if (saved) {
      const loaded = JSON.parse(saved);
      const r = loaded.rental ?? InitialRentalState;
      return {
        ...loaded,
        rental: {
          ...r,
          active: Array.isArray(r.active) ? r.active : (r.active ? [r.active] : []),
        },
      };
    }
    return {
      ...InitialGameState,
      lady: InitialLadyState,
      pickaxe: InitialPickaxeState,
      mines: InitialMinesState,
      rewards: InitialRewardsState,
      yacimientos: InitialYacimientosState,
      dogs: InitialDogsState,
      forgeDogs: InitialForgeDogsState,
      rental: InitialRentalState,
    };
  });

  // ===== AUTO-SAVE — guarda en localStorage en cada cambio =====
  useEffect(() => {
    if (!isResetting) {
      localStorage.setItem("ladyHungryGame", JSON.stringify(gameState));
    }
  }, [gameState, isResetting]);

  // ===== NUEVO JUEGO — borra save y recarga =====
  const handleNewGame = () => {
    if (
      window.confirm(
        "¿Seguro que quieres empezar un nuevo juego? Se perderá todo el progreso.",
      )
    ) {
      setIsResetting(true);
      localStorage.removeItem("ladyHungryGame");
      localStorage.setItem("hasPlayedBefore", "true");
      setTimeout(() => location.reload(), 0);
    }
  };

  // ===== FLOATING NUMBERS — oro =====
  const showGoldCost = (cost) => {
    const id = `${Date.now()}-${Math.random()}`;
    setGoldFloatingNumbers((prev) => [...prev, { id, value: -cost }]);
    setTimeout(() => setGoldFloatingNumbers((prev) => prev.filter((n) => n.id !== id)), 1500);
  };

  const showGoldGain = (amount) => {
    const id = `${Date.now()}-${Math.random()}`;
    setGoldFloatingNumbers((prev) => [...prev, { id, value: +amount }]);
    setTimeout(() => setGoldFloatingNumbers((prev) => prev.filter((n) => n.id !== id)), 1500);
  };

  // ===== FLOATING NUMBERS — COIN TAVERN =====
  const [tavernFloatingNumbers, setTavernFloatingNumbers] = useState([]);

  const showTavernCost = (cost) => {
    const id = `${Date.now()}-${Math.random()}`;
    setTavernFloatingNumbers((prev) => [...prev, { id, value: -cost }]);
    setTimeout(() => setTavernFloatingNumbers((prev) => prev.filter((n) => n.id !== id)), 1500);
  };

  const showTavernGain = (amount) => {
    const id = `${Date.now()}-${Math.random()}`;
    setTavernFloatingNumbers((prev) => [...prev, { id, value: +amount }]);
    setTimeout(() => setTavernFloatingNumbers((prev) => prev.filter((n) => n.id !== id)), 1500);
  };

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
    handleUnlockTutorialFeature,
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
    handleUnlockForge,
    handleUnlockFurnace,
    handleStartSmelt,
    handleCollectIngot,
    handleUpgradeFurnace,
    handleClaimReward,
    handleClaimCoinReward,
    handleClaimFragmentReward,

    handleUnlockYacimientoSlot,
    handleRepairYacimiento,
    handleMineYacimiento,
    handlePlantMena,
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
    handleDogMineYacimiento,
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
    handleUnlockTutorialFeature,
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
    handleUnlockForge,
    handleUnlockFurnace,
    handleStartSmelt,
    handleCollectIngot,
    handleUpgradeFurnace,
    handleClaimReward,
    handleClaimCoinReward,
    handleClaimFragmentReward,
    handleUnlockYacimientoSlot,
    handleRepairYacimiento,
    handleMineYacimiento,
    handlePlantMena,
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
    handleDogMineYacimiento,
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
  const canAffordTierUpgrade = !gameState.tutorial?.pickaxeUpgradeDone
    ? true
    : gameState.gold >=
    (gameState.pickaxe.tierUpgradeCosts?.[gameState.pickaxe.material] ||
      0) &&
    (!tierIngotCost || gameState[tierIngotCost.type] >= tierIngotCost.amount);

  const materialUpgradeCost =
    gameState.pickaxe.materialUpgradeCosts?.[gameState.pickaxe.material];
  const canAffordMaterialUpgrade =
    gameState.pickaxe.tier === 5 &&
    gameState.gold >= (materialUpgradeCost?.gold || 0) &&
    gameState[materialUpgradeCost?.ingot?.type] >=
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

  // ===== RENTAL — helper para generar perro aleatorio =====
  const getRentalDog = (currentDogs, currentActive) => {
    const hiredIds = new Set(
      Object.values(currentDogs)
        .filter(d => d && typeof d === 'object' && !Array.isArray(d) && d.hired)
        .map(d => d.id)
    );
    const rentedIds = new Set((currentActive ?? []).map(r => r.dogId));
    const rand = Math.random() * 100;
    const rarity = rand < RentalConfig.rarityThresholds.legendary
      ? 'legendary'
      : rand < RentalConfig.rarityThresholds.epic
        ? 'epic'
        : 'rare';
    let pool = Object.values(DogsConfig).filter(d => d.rarity === rarity && !hiredIds.has(d.id) && !rentedIds.has(d.id));
    if (pool.length === 0) pool = Object.values(DogsConfig).filter(d => !hiredIds.has(d.id) && !rentedIds.has(d.id));
    if (pool.length === 0) return null;
    const dog = pool[Math.floor(Math.random() * pool.length)];
    return { dogId: dog.id, rarity: dog.rarity, cost: RentalConfig.costs[dog.rarity] };
  };

  // ===== RENTAL — timer de aparición y duración activa =====
  useEffect(() => {
    const t = setInterval(() => {
      setGameState(prev => {
        const rental = prev.rental;
        if (!rental) return prev;

        let changed = false;
        let available = rental.available;
        let appearanceRemainingMs = rental.appearanceRemainingMs;
        const newSlots = [...(prev.dogs?.globalSlots ?? [null, null, null])];
        let slotsChanged = false;

        // Timer de aparición: corre siempre que no haya perro disponible
        if (!available) {
          const newMs = Math.max(0, appearanceRemainingMs - 1000);
          if (newMs !== appearanceRemainingMs) {
            changed = true;
            if (newMs <= 0) {
              const generated = getRentalDog(prev.dogs ?? {}, rental.active);
              if (generated) {
                available = generated;
                appearanceRemainingMs = 0;
              } else {
                appearanceRemainingMs = 60 * 1000;
              }
            } else {
              appearanceRemainingMs = newMs;
            }
          }
        }

        // Timers de alquileres activos (array)
        const newActive = [];
        for (const r of (rental.active ?? [])) {
          const newMs = Math.max(0, r.remainingMs - 1000);
          if (newMs <= 0) {
            changed = true;
            if (r.destination !== 'raid' && r.assignedSlot !== null && newSlots[r.assignedSlot] === r.dogId) {
              newSlots[r.assignedSlot] = null;
              slotsChanged = true;
            }
          } else {
            if (newMs !== r.remainingMs) changed = true;
            newActive.push({ ...r, remainingMs: newMs });
          }
        }

        if (!changed) return prev;

        return {
          ...prev,
          rental: { available, active: newActive, appearanceRemainingMs },
          dogs: slotsChanged ? { ...prev.dogs, globalSlots: newSlots } : prev.dogs,
        };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const formatRentalTimer = (ms) => {
    const totalSec = Math.ceil(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ===== HOOKS DE SISTEMA =====
  useGoldPerSecond(gameState, setGameState); // Tick oro/segundo
  useAutoMining(gameState, handleMine, setGameState); // Automina continua
  useSnackBuffs(gameState, setGameState); // Aplica buffs activos
  useAutomine(gameState, handleMineClick, handleStopAutomine); // Automine manual
  useAutomineCooldown(gameState, setGameState); // Recupera cargas de automine
  useDogsAutomine(gameState, handleDogTick);

  // Tick del burst: cuenta duración activa y recarga
  useEffect(() => {
    const t = setInterval(() => {
      setGameState(prev => {
        const burst = prev.burst ?? { active: false, recharging: false, rechargeRemaining: 0 };
        if (!burst.active && !burst.recharging) return prev;
        if (burst.active) {
          const newStamina = prev.stamina - 1;
          if (newStamina <= 0) {
            const getRechargeTime = (lvl) => {
              if (lvl <= 20) return Math.round(40 - lvl * 0.5);
              if (lvl <= 40) return Math.round(30 - (lvl - 20) * 0.25);
              if (lvl <= 55) return Math.round(25 - (lvl - 40) * (5 / 15));
              return 20;
            };
            return {
              ...prev,
              stamina: 0,
              burst: { active: false, recharging: true, rechargeRemaining: getRechargeTime(prev.maxStaminaLevel ?? 0) }
            };
          }
          return { ...prev, stamina: newStamina };
        }
        if (burst.recharging) {
          const newRecharge = burst.rechargeRemaining - 1;
          if (newRecharge <= 0) {
            return {
              ...prev,
              stamina: prev.maxStamina,
              burst: { active: false, recharging: false, rechargeRemaining: 0 }
            };
          }
          return { ...prev, burst: { ...burst, rechargeRemaining: newRecharge } };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [setGameState]);

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

  // ===== TUTORIAL TRIGGERS =====
  // Intro: muestra bienvenida si es la primera vez
  useEffect(() => {
    if (!gameState.tutorial?.completed && !gameState.tutorial?.introDone) {
      setTimeout(() => setTutorialStep('intro'), 400);
    }
  }, [gameState.tutorial?.completed, gameState.tutorial?.introDone]);

  // Paso 0: apunta a oro/segundo (solo tras ver intro)
  useEffect(() => {
    if (gameState.tutorial?.completed) return;
    if (!gameState.tutorial?.introDone) return;
    if (gameState.tutorial?.currentStep === 0) {
      setTimeout(() => setTutorialStep(0), 500);
    }
  }, [gameState.tutorial?.currentStep, gameState.tutorial?.completed, gameState.tutorial?.introDone]);

  // Pasos de hint (taberna→mina→forja): tras completar el pico, cierra el modal
  useEffect(() => {
    if (gameState.tutorial?.currentStep === 3 && !gameState.tutorial?.minesHinted) {
      setOpenModal(null);
      setTutorialStep('hint_tavern');
    }
  }, [gameState.tutorial?.currentStep, gameState.tutorial?.minesHinted]);

  // Paso 1: tras comprar oro/segundo, muestra snacks primero y luego stamina
  useEffect(() => {
    if (
      gameState.tutorial?.goldPerSecondBought &&
      gameState.tutorial?.currentStep === 1 &&
      !gameState.tutorial?.staminaUnlocked
    ) {
      if (!gameState.tutorial?.snacksHinted) {
        setTutorialStep('0_snacks');
      } else {
        setTutorialStep(1);
        handleUnlockTutorialFeature("stamina");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameState.tutorial?.goldPerSecondBought,
    gameState.tutorial?.currentStep,
    gameState.tutorial?.staminaUnlocked,
    gameState.tutorial?.snacksHinted,
  ]);

  // Paso 2: desbloquea pico tras mejorar stamina
  useEffect(() => {
    if (
      gameState.tutorial?.staminaUpgradeDone &&
      gameState.tutorial?.currentStep === 2 &&
      !gameState.tutorial?.pickaxeUnlocked
    ) {
      setTutorialStep(2);
      handleUnlockTutorialFeature("pickaxe");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameState.tutorial?.staminaUpgradeDone,
    gameState.tutorial?.currentStep,
    gameState.tutorial?.pickaxeUnlocked,
  ]);

  // stamina_hint: burst activado → mine_tap
  useEffect(() => {
    if (tutorialStep === 'stamina_hint' && gameState.burst?.active) {
      setTutorialStep('mine_tap');
    }
  }, [gameState.burst?.active, tutorialStep]);

  // mine_tap: pico roto → repair_hint
  useEffect(() => {
    if (tutorialStep === 'mine_tap' && gameState.pickaxe.durability === 0) {
      setTutorialStep('repair_hint');
    }
  }, [gameState.pickaxe.durability, tutorialStep]);

  // repair_hint: reparado → automine_hint
  useEffect(() => {
    if (tutorialStep === 'repair_hint' && gameState.pickaxe.durability > 0) {
      setTutorialStep('automine_hint');
    }
  }, [gameState.pickaxe.durability, tutorialStep]);

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

  // ===== TUTORIAL MODAL AUTO-OPEN (recuperación tras recarga) =====
  // Solo para recovery tras recarga en fase '0_snacks' (modal bloqueado sin dialog)
  useEffect(() => {
    if (tutorialStep === '0_snacks' && openModal === null) {
      setOpenModal('goldPerSecond');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialStep]);

  // Hint automine: primera vez que el jugador alcanza 1500 oro
  useEffect(() => {
    if (
      !gameState.automine?.unlocked &&
      !gameState.tutorial?.automineHinted &&
      gameState.gold >= AutomineConfig.unlockCost
    ) {
      setGameState(prev => ({ ...prev, tutorial: { ...prev.tutorial, automineHinted: true } }));
    }
  }, [gameState.gold]); // eslint-disable-line

  // Formatea números grandes (10k, 1.5M...) PARA ORO GENERAL
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + "k";
    return num;
  };

  // Formatea números grandes (1k, 1.5M...) PARA INFO DEL HUD - MENAS LINGOTES
  const formatNumber2 = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };
  const getMinesBg = (biome) => {
    if (biome === "bronze") return bgMineBronze;
    if (biome === "iron") return bgMineIron;
    if (biome === "diamond") return bgMineDiamond;
    return null;
  };

  // ===== RENDER =====
  return (
    <GameContext.Provider value={contextValue}>
      <div
        className="game-container"
        style={{ backgroundImage: `url(${bgMain})` }}
      >
        {/* OVERLAY OSCURO DURANTE TUTORIAL */}
        {tutorialStep !== null && tutorialStep !== 'done' && tutorialStep !== 'automine_hint' && openModal === null && (
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
                {goldFloatingNumbers.map((num) => (
                  <div
                    key={num.id}
                    className={
                      num.value > 0 ? "floating-gold-gain" : "floating-gold-cost1"
                    }
                  >
                    {num.value > 0 ? `+${num.value}` : num.value}
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
                  {tavernFloatingNumbers.map((num) => (
                    <div key={num.id} className={num.value > 0 ? "floating-gold-gain" : "floating-gold-cost1"} style={{ color: num.value > 0 ? "#7eff7e" : "#f0c040" }}>
                      {num.value > 0 ? `+${num.value}` : num.value}
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
            musicEnabled={musicEnabled}
            musicVolume={musicVolume}
            onMusicToggle={handleMusicToggle}
            onMusicVolume={handleMusicVolume}
            sfxEnabled={sfxEnabled}
            sfxVolume={sfxVolume}
            onSfxToggle={handleSfxToggle}
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
            canAfford={gameState.gold >= gameState.goldPerSecondCost}
            tutorialStep0Active={!gameState.tutorial?.completed}
            tutorialPhase={
              tutorialStep === 0 ? 'upgrade'
              : tutorialStep === '0_snacks' ? 'snacks'
              : null
            }
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
              onClick={handleActivateBurst}
              disabled={gameState.burst?.active || gameState.burst?.recharging}
              className={`${gameState.burst?.recharging ? "low-resource" : ""} ${gameState.burst?.active ? "burst-active" : ""} ${tutorialStep === 'stamina_hint' ? "tutorial-highlight" : ""}`}
              style={{ position: "relative", ...(tutorialStep === 'stamina_hint' ? { zIndex: 600 } : {}) }}
            >
              <img src={stamina1} loading="lazy" alt="Burst" />
            </button>

            <p>
              {gameState.burst?.recharging
                ? `${gameState.burst.rechargeRemaining}s`
                : `${gameState.stamina}/${gameState.maxStamina}`}
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
            cost={gameState.tutorial?.staminaUpgradeDone ? gameState.maxStaminaCost : 0}
            coinCost={gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10)}
            onUpgrade={() => {
              handleBuyMaxStaminaUpgrade();
              if (!gameState.tutorial?.completed) setOpenModal(null);
            }}
            canAfford={
              gameState.gold >= (gameState.tutorial?.staminaUpgradeDone ? gameState.maxStaminaCost : 0) &&
              gameState.tavernCoins >= (gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10))
            }
            tutorialPhase={!gameState.tutorial?.staminaUpgradeDone && !gameState.tutorial?.completed ? 'upgrade' : null}
            tutorialHintText="Mejora la Energía para aumentar la duración del burst, reducir su tiempo de recarga y obtener más materiales mientras esté activo."
            onTutorialAction={handleTutorialAction}
            tutorialStep0Active={!gameState.tutorial?.completed}
            bgImage={bgStamina}
            iconImage={upgradeStamina}
            buttonImage={buttonUpgrade}
            title={"Mejorar Burst"}
            showStaminaSnacks={true}
          />

          {/* PICO */}
          <div className="pickaxe-display">
            {/* Icono del pico — repara directamente */}
            <button
              onClick={() => {
                handleRepairPickaxe();
                setOpenModal(null);
              }}
              disabled={
                (!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed) ||
                gameState.pickaxe.durability >= gameState.pickaxe.maxDurability ||
                gameState.automine?.isActive
              }
              className={`
                            ${gameState.pickaxe.durability <= 5 ? "low-resource" : ""}
                            ${tutorialStep === 'repair_hint' ? "tutorial-highlight" : ""}
                            ${!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed ? "locked-tutorial" : ""}
                        `.trim()}
            style={tutorialStep === 'repair_hint' ? { position: 'relative', zIndex: 600 } : {}}
            >
              <img
                src={getPickaxeIcon(gameState.pickaxe.material, gameState.pickaxe.tier)}
                loading="lazy"
                alt="Pickaxe"
              />
            </button>

            <p>
              {gameState.pickaxe.durability}/{gameState.pickaxe.maxDurability}
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
                : 0
            }
            onUpgrade={() => {
              handlePickaxeUpgrade();
            }}
            canAfford={canAffordTierUpgrade}
            tutorialPhase={!gameState.tutorial?.pickaxeUpgradeDone && !gameState.tutorial?.completed ? 'upgrade' : null}
            tutorialStep0Active={!gameState.tutorial?.completed}
            tutorialHintText="Refuerza tu pico para conseguir más materiales. Cuando alcance el nivel máximo, podrás ascenderlo al siguiente nivel para obtener una mayor durabilidad.."
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
                className={`tavern-btn ${tutorialStep === 'hint_tavern' ? 'tutorial-highlight' : ''}`}
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
              onClick={
                gameState.automine.isActive
                  ? handleStopAutomine
                  : handleActivateAutomine
              }
              disabled={
                !gameState.automine.isActive &&
                (availableCharges <= 0 ||
                  gameState.pickaxe.durability <= 0)
              }
              className={`automine-button-pico charges-${availableCharges}`}
              style={{
                "--progress1": chargeTimers[0]
                  ? `${Math.round((1 - chargeTimers[0] / AutomineConfig.chargeRecoveryTime) * 100) * 3.6}deg`
                  : "0deg",
                "--progress2": chargeTimers[1]
                  ? `${Math.round((1 - chargeTimers[1] / AutomineConfig.chargeRecoveryTime) * 100) * 3.6}deg`
                  : "0deg",
              }}
            >
              <img
                src={gameState.automine.isActive ? stopMine : activeMine}
                alt="Pico"
              />
              <span className="automine-charge-count">{availableCharges}/2</span>
            </button>
          )}

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
          onEnterMine={(type) => {
            handleEnterMine(type);
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
        />

        {/* ALQUILER */}
        <RentalModal
          isOpen={rentalModalOpen}
          onClose={() => setRentalModalOpen(false)}
        />

        {/* FORJA */}
        <ForgeModal
          isOpen={forgeModalOpen}
          onClose={() => setForgeModalOpen(false)}
        />

        {/* SLOTS PERROS GLOBALES */}
        <div className="global-dog-slots">
          {[0, 1, 2].map(i => {
            const assignedDogId = (gameState.dogs.globalSlots ?? [null, null, null])[i] ?? null;
            const assignedDog = assignedDogId ? gameState.dogs[assignedDogId] : null;
            const availableDogs = Object.values(gameState.dogs).filter(
              d => d && typeof d === 'object' && !Array.isArray(d) && d.hired && d.assignedTo === null
            );
            const isMenuOpen = globalDogMenuOpen === i;
            const isFlipped = flippedSlot === i;

            const renderPassiveBack = () => {
              const bonus = DogsConfig[assignedDogId]?.goldMineBonus;
              if (!bonus) return null;
              if (bonus.type === 'extraGold') return <><span>+{bonus.value} oro</span><span>por picada</span></>;
              if (bonus.type === 'freeHit') return <><span>{bonus.chance * 100}%</span><span>reduce</span><span>cooldown</span></>;
              if (bonus.type === 'doubleHit') return <><span>{bonus.chance * 100}%</span><span>de doblar</span><span>el oro</span></>;
              return null;
            };

            const assignedRarity = assignedDogId ? DogsConfig[assignedDogId]?.rarity : null;
            const rentalEntry = (gameState.rental?.active ?? []).find(r => r.assignedSlot === i && r.dogId === assignedDogId);
            const isRentedSlot = !!rentalEntry;
            return (
              <div key={i} className={`global-dog-slot-wrapper${isRentedSlot ? ' global-dog-slot-rented' : ''}`}>
                <div
                  className={`global-dog-slot${assignedRarity ? ` dog-rarity-${assignedRarity}` : ''}`}
                  onClick={() => {
                    if (isRentedSlot) {
                      setFlippedSlot(isFlipped ? null : i);
                      return;
                    }
                    if (assignedDog) {
                      setFlippedSlot(isFlipped ? null : i);
                      setGlobalDogMenuOpen(isMenuOpen ? null : i);
                    } else {
                      setGlobalDogMenuOpen(isMenuOpen ? null : i);
                    }
                  }}
                >
                  <div className={`global-slot-flip${isFlipped ? ' flipped' : ''}`}>
                    {/* FRENTE: portrait */}
                    <div className="global-slot-front">
                      {assignedDog ? (
                        <>
                          {dogAssets[assignedDogId]
                            ? <img src={dogAssets[assignedDogId]} className="global-dog-slot-img" alt={assignedDogId} />
                            : <span className="global-dog-slot-emoji">🐕</span>
                          }
                          {isRentedSlot && (
                            <span className="global-dog-slot-rental-badge">{formatRentalTimer(rentalEntry.remainingMs)}</span>
                          )}
                          {!isRentedSlot && (
                            <button className="global-dog-slot-unassign" onClick={e => {
                              e.stopPropagation();
                              setFlippedSlot(null);
                              setGameState(prev => ({
                                ...prev,
                                dogs: {
                                  ...prev.dogs,
                                  globalSlots: (prev.dogs.globalSlots ?? [null, null, null]).map((id, idx) => idx === i ? null : id),
                                  [assignedDogId]: { ...prev.dogs[assignedDogId], assignedTo: null }
                                }
                              }));
                            }}>✖</button>
                          )}
                        </>
                      ) : (
                        <span className="global-dog-slot-plus">+</span>
                      )}
                    </div>
                    {/* REVERSO: pasiva */}
                    {assignedDog && (
                      <div className="global-slot-back">
                        {renderPassiveBack()}
                      </div>
                    )}
                  </div>

                  {/* Menú asignar / cambiar — bloqueado para slots alquilados */}
                  {isMenuOpen && !isRentedSlot && (
                    <div className="global-dog-menu">
                      {availableDogs.length === 0
                        ? <span className="global-dog-menu-empty">Sin mascotas libres</span>
                        : availableDogs.map(dog => (
                          <button key={dog.id} className="global-dog-menu-option" onClick={e => {
                            e.stopPropagation();
                            setGameState(prev => ({
                              ...prev,
                              dogs: {
                                ...prev.dogs,
                                globalSlots: (prev.dogs.globalSlots ?? [null, null, null]).map((id, idx) => idx === i ? dog.id : id),
                                [dog.id]: { ...prev.dogs[dog.id], assignedTo: { globalSlot: i } }
                              }
                            }));
                            setGlobalDogMenuOpen(null);
                          }}>🐕 {DogsConfig[dog.id]?.name ?? dog.id}</button>
                        ))
                      }
                      <button className="global-dog-menu-cancel" onClick={e => { e.stopPropagation(); setGlobalDogMenuOpen(null); setFlippedSlot(null); }}>✕</button>
                    </div>
                  )}
                </div>
                {assignedDog && (
                  <span className="global-dog-slot-name">{DogsConfig[assignedDogId]?.name ?? assignedDogId}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* SETTINGS */}
        <div className="hud-top-right" style={{ display: combatOpen ? 'none' : undefined }}>

          {(() => {
            const raidReady = gameState.raid?.passiveRaid && Date.now() >= gameState.raid.passiveRaid.returnAt;
            return (
              <button
                className={`btn-raid ${raidReady ? 'btn-raid-ready' : ''}`}
                onClick={() => setRaidOpen(true)}
              >
                ⚔️
              </button>
            );
          })()}

          {/* ALQUILER — abre Ayudantes directo al tab de alquiler */}
          {(() => {
            const rentalAvailable = gameState.rental?.available;
            const activeCount = gameState.rental?.active?.length ?? 0;
            return (
              <button
                className={`btn-rental ${rentalAvailable ? 'btn-rental-ready' : 'btn-rental-recharging'}`}
                onClick={() => setRentalModalOpen(true)}
              >
                <img src={ladyIcon} className="btn-rental-img" alt="alquiler" />
                {activeCount > 0 && (
                  <span className="btn-rental-active-count">{activeCount}</span>
                )}
                {!rentalAvailable && (
                  <span className="btn-rental-timer">{formatRentalTimer(gameState.rental?.appearanceRemainingMs ?? 0)}</span>
                )}
              </button>
            );
          })()}
          <button
            className={`btn-rewards ${gameState.rewards?.hasUnclaimed ||
              Object.values(gameState.rewards?.coinRewards ?? {}).some(r => typeof r.claimed === 'boolean' && r.unlocked && !r.claimed) ||
              Object.values(gameState.rewards?.fragmentRewards ?? {}).some(r => r.unlocked && !r.claimed)
              ? "btn-rewards-pulse" : ""
              }`}
            onClick={() => setRewardsOpen(true)}
          >
            🏆
          </button>


        </div>

        <RewardsModal
          isOpen={rewardsOpen}
          onClose={() => setRewardsOpen(false)}
        />

        <RaidScreen
          isOpen={raidOpen}
          onClose={() => setRaidOpen(false)}
          onOpenCombat={() => { setRaidOpen(false); setCombatOpen(true); }}
        />

        <CombatScreen
          isOpen={combatOpen}
          onClose={() => setCombatOpen(false)}
          onBack={() => { setCombatOpen(false); setRaidOpen(true); }}
        />

        {/* MENA DE ORO — elemento principal clickeable */}
        <GoldMine elevated={tutorialStep === 'mine_tap'} />

        {/* TUTORIAL DIALOG */}
        <TutorialDialog
          step={openModal === null && tutorialStep !== 'mine_tap' ? tutorialStep : null}
          onSkip={handleSkipTutorial}
          onAction={handleTutorialAction}
          isFirstTime={!localStorage.getItem("hasPlayedBefore")}
        />

        {tutorialStep === 'automine_hint' && (
          <div className="automine-hint-tooltip">
            <p>El autominado golpea solo durante unos segundos. Tiene 2 cargas que se recargan con el tiempo.</p>
            <button onClick={() => setTutorialStep('done')}>Entendido</button>
          </div>
        )}
      </div>
    </GameContext.Provider>
  );
}

export default GameRoot;
