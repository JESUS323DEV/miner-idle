import { useState, useEffect, useMemo, useRef } from "react";
import { playSfx } from "../game/utils/sfx.js";
import satUpgrade from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-upgrade.png";
import satEnergy from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-energy.png";
import satRepair from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-reapir.png";
import { DogsConfig } from "../game/config/DogsConfig.js";
import { ForgeDogsConfig } from "../game/config/ForgeDogsConfig.js";
import { getDogStats } from "../game/utils/getDogStats.js";
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
import { useFloatingNumbers } from "../game/hooks/useFloatingNumbers.js";
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
import tokyoIcon from "../assets/ui/icons-pets/mineros/tokyo-icon.png";
import tukaIcon from "../assets/ui/icons-pets/mineros/tuka-icon.png";
import munaIcon from "../assets/ui/icons-pets/mineros/muna-icon.png";
import gordoIcon from "../assets/ui/icons-pets/mineros/gordo-icon.png";
import druhIcon from "../assets/ui/icons-pets/mineros/druh-icon.png";
import smokeIcon from "../assets/ui/icons-pets/mineros/smoke-icon.png";
import nupitoIcon from "../assets/ui/icons-pets/mineros/nupito-icon.png";
import zeusIcon from "../assets/ui/icons-pets/mineros/zeus-icon.png";
import boxerIcon from "../assets/ui/icons-pets/mineros/boxer-icon.png";
import bullyIcon from "../assets/ui/icons-pets/mineros/bully-icon.png";
import chihuahuaIcon from "../assets/ui/icons-pets/mineros/chihuhua-icon.png";
import forgeIcon1 from "../assets/ui/icons-pets/forge/forge-icon1.png";
import forgeIcon2 from "../assets/ui/icons-pets/forge/forge-icon2.png";
import forgeIcon3 from "../assets/ui/icons-pets/forge/forge-icon3.png";
import forgeIcon4 from "../assets/ui/icons-pets/forge/forge-icon4.png";
import forgeIcon5 from "../assets/ui/icons-pets/forge/forge-icon5.png";
import forgeIcon6 from "../assets/ui/icons-pets/forge/forge-icon6.png";
import forgeIcon7 from "../assets/ui/icons-pets/forge/forge-icon7.png";
import forgeIcon8 from "../assets/ui/icons-pets/forge/forge-icon8.png";
import forgeIcon9 from "../assets/ui/icons-pets/forge/forge-icon9.png";
const dogAssets = {
  lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
  muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
  smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
  boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
  pip: forgeIcon1, koda: forgeIcon2, milo: forgeIcon3,
  rocky: forgeIcon4, bruno: forgeIcon5, max: forgeIcon6,
  rex: forgeIcon7, toby: forgeIcon8, buddy: forgeIcon9,
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
  const [globalDogMenuOpen, setGlobalDogMenuOpen] = useState(null); // índice del slot abierto
  const [flippedSlot, setFlippedSlot] = useState(null); // índice del slot girado
  const [now, setNow] = useState(0);


  const trickleRef = useRef([
    { cooldown: 60, active: false, activeRemaining: 0 },
    { cooldown: 60, active: false, activeRemaining: 0 },
    { cooldown: 60, active: false, activeRemaining: 0 },
  ]);
  const globalSlotsRef = useRef([null, null, null]);

  // ===== GAME STATE — carga desde localStorage si existe =====
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem("ladyHungryGame");
    if (saved) {
      const loaded = JSON.parse(saved);
      const r = loaded.rental ?? InitialRentalState;

      // Añade entradas nuevas de fragmentRewards que no existen en el save
      const savedFR = loaded.rewards?.fragmentRewards ?? {};
      const mergedFR = { ...savedFR };
      // Eliminar claves obsoletas del diseño anterior
      const obsoleteFRKeys = [
        'set4Miner1Star','set4Miner2Star','set4Miner3Star','set4Miner4Star','set4Miner5Star',
        'set4Forge1Star','set4Forge2Star','set4Forge3Star','set4Forge4Star','set4Forge5Star',
        'set3FurnaceBronze2','set3FurnaceBronze3','set3FurnaceIron2','set3FurnaceIron3',
        'set3FurnaceDiamond2','set3FurnaceDiamond3',
      ];
      obsoleteFRKeys.forEach(k => delete mergedFR[k]);
      Object.keys(InitialRewardsState.fragmentRewards).forEach(k => {
        if (!(k in mergedFR)) mergedFR[k] = InitialRewardsState.fragmentRewards[k];
      });
      // Asegurar que los líderes de cadena sean visibles
      const chainLeaders = [
        'goldPassive5','stamina2','unlockMineBronze','bronze300','forgeUnlockBronze','smelt50Bronze',
        'miner1Star','forge1Star','picoTier1','picoMaterialBronze','burst5','automineLevel2',
        'passiveRaids5','dogs1','summons3',
      ];
      chainLeaders.forEach(k => {
        if (mergedFR[k] && !mergedFR[k].claimed) mergedFR[k] = { ...mergedFR[k], visible: true };
      });

      // Añade entradas nuevas de coinRewards que no existen en el save
      const savedCR = loaded.rewards?.coinRewards ?? {};
      const mergedCR = { ...savedCR };
      Object.keys(InitialRewardsState.coinRewards).forEach(k => {
        if (!(k in mergedCR)) mergedCR[k] = InitialRewardsState.coinRewards[k];
      });

      // Migración yacimientos: si el save tiene la estructura antigua (con slotConfig o mena), resetea al estado inicial
      const savedYac = loaded.yacimientos;
      const yacNeedsReset = !savedYac || Object.values(savedYac).some(b => b.slotConfig || b.slots?.some(s => s.mena !== undefined));
      let migratedYac = yacNeedsReset ? InitialYacimientosState : savedYac;
      // Migrar sesiones con formato antiguo (active: bool) al nuevo (phase: string)
      // También limpiar sesiones con phase pero sin endsAt (now >= undefined es siempre false)
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
            })
          }
        ]));
      }

      return {
        ...InitialGameState,
        ...loaded,
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

  // ===== DESBLOQUEO AUTOMÁTICO RECOMPENSAS DE FRAGMENTOS =====
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
      // Cadena 1: Oro pasivo
      goldPassive5:  gameState.goldPerSecondLevel >= 5,
      goldPassive10: gameState.goldPerSecondLevel >= 10,
      goldPassive20: gameState.goldPerSecondLevel >= 20,
      goldPassive30: gameState.goldPerSecondLevel >= 30,
      goldPassive40: gameState.goldPerSecondLevel >= 40,
      goldPassive50: gameState.goldPerSecondLevel >= 50,
      // Cadena 2: Stamina
      stamina2:  gameState.maxStaminaLevel >= 2,
      stamina5:  gameState.maxStaminaLevel >= 5,
      stamina10: gameState.maxStaminaLevel >= 10,
      stamina20: gameState.maxStaminaLevel >= 20,
      stamina30: gameState.maxStaminaLevel >= 30,
      stamina50: gameState.maxStaminaLevel >= 50,
      // Cadena 3: Minas
      unlockMineBronze:  bronzeMineUnlocked,
      unlockMineIron:    ironMineUnlocked,
      unlockMineDiamond: diamondMineUnlocked,
      // Cadena 4: Menas
      bronze300:  (gameState.totalBronzeMined ?? 0) >= 300,
      iron300:    (gameState.totalIronMined ?? 0) >= 300,
      diamond300: (gameState.totalDiamondMined ?? 0) >= 300,
      // Cadena 5: Hornos
      forgeUnlockBronze:  gameState.furnaces?.bronze?.unlocked === true,
      forgeUnlockIron:    gameState.furnaces?.iron?.unlocked === true,
      forgeUnlockDiamond: gameState.furnaces?.diamond?.unlocked === true,
      // Cadena 6: Lingotes
      smelt50Bronze:  (gameState.totalBronzeIngotsSmelted ?? 0) >= 50,
      smelt50Iron:    (gameState.totalIronIngotsSmelted ?? 0) >= 50,
      smelt50Diamond: (gameState.totalDiamondIngotsSmelted ?? 0) >= 50,
      // Cadena 7: Estrellas mineros
      miner1Star: maxMinerStars >= 1,
      miner2Star: maxMinerStars >= 2,
      miner3Star: maxMinerStars >= 3,
      miner4Star: maxMinerStars >= 4,
      miner5Star: maxMinerStars >= 5,
      // Cadena 8: Estrellas forja
      forge1Star: maxForgeStars >= 1,
      forge2Star: maxForgeStars >= 2,
      forge3Star: maxForgeStars >= 3,
      forge4Star: maxForgeStars >= 4,
      forge5Star: maxForgeStars >= 5,
      // Cadena 9: Pico material
      picoMaterialBronze:  gameState.pickaxe?.material !== 'stone',
      picoMaterialIron:    gameState.pickaxe?.material === 'metal' || gameState.pickaxe?.material === 'diamond',
      picoMaterialDiamond: gameState.pickaxe?.material === 'diamond',
      // Cadena 11: Burst
      burst5:  (gameState.totalBurstUses ?? 0) >= 5,
      burst15: (gameState.totalBurstUses ?? 0) >= 15,
      burst30: (gameState.totalBurstUses ?? 0) >= 30,
      burst60: (gameState.totalBurstUses ?? 0) >= 60,
      // Cadena 12: Automine mejora
      automineLevel2: (gameState.automineUpgradeLevel ?? 0) >= 1,
      automineLevel3: (gameState.automineUpgradeLevel ?? 0) >= 2,
      // Cadena 13: Raids pasivas
      passiveRaids5:  (gameState.totalPassiveRaids ?? 0) >= 5,
      passiveRaids10: (gameState.totalPassiveRaids ?? 0) >= 10,
      passiveRaids20: (gameState.totalPassiveRaids ?? 0) >= 20,
      passiveRaids40: (gameState.totalPassiveRaids ?? 0) >= 40,
      passiveRaids60: (gameState.totalPassiveRaids ?? 0) >= 60,
      // Cadena 14: Perros desbloqueados
      dogs1: totalDogs >= 1,   dogs2: totalDogs >= 2,   dogs3: totalDogs >= 3,
      dogs4: totalDogs >= 4,   dogs5: totalDogs >= 5,   dogs6: totalDogs >= 6,
      dogs7: totalDogs >= 7,   dogs8: totalDogs >= 8,   dogs9: totalDogs >= 9,
      dogs10: totalDogs >= 10, dogs11: totalDogs >= 11, dogs12: totalDogs >= 12,
      dogs13: totalDogs >= 13, dogs14: totalDogs >= 14, dogs15: totalDogs >= 15,
      dogs16: totalDogs >= 16, dogs17: totalDogs >= 17, dogs18: totalDogs >= 18,
      dogs19: totalDogs >= 19, dogs20: totalDogs >= 20, dogs21: totalDogs >= 21,
      // Cadena 15: Invocaciones
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
    gameState.maxStaminaLevel,
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
    : !gameState.tutorial?.pickaxeUpgradeDone
      ? true
      : gameState.gold >= (gameState.pickaxe.tierUpgradeCosts?.[gameState.pickaxe.material] || 0) &&
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
    const giftIds = new Set(['boxer', 'bully', 'chihuahua']);
    let pool = Object.values(DogsConfig).filter(d => d.rarity === rarity && !hiredIds.has(d.id) && !rentedIds.has(d.id) && !giftIds.has(d.id));
    if (pool.length === 0) pool = Object.values(DogsConfig).filter(d => !hiredIds.has(d.id) && !rentedIds.has(d.id) && !giftIds.has(d.id));
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
            const drinkBuffRecharge = prev.snacks?.drink?.active?.type === 'stamina' ? (prev.snacks.drink.active.effect ?? 0) : 0;
            return {
              ...prev,
              stamina: prev.maxStamina + drinkBuffRecharge,
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

  const effectiveRecoveryTime = useMemo(() => {
    const level = gameState.automineUpgradeLevel ?? 0;
    const reduction = AutomineConfig.chargeUpgrades
      .slice(0, level)
      .reduce((sum, u) => sum + u.reductionSeconds, 0);
    return AutomineConfig.chargeRecoveryTime - reduction;
  }, [gameState.automineUpgradeLevel]);


  // Mantiene globalSlotsRef sincronizado
  useEffect(() => {
    globalSlotsRef.current = gameState.dogs?.globalSlots ?? [null, null, null];
  }, [gameState.dogs?.globalSlots]); // eslint-disable-line

  // goldTrickle: cada segundo tick, activa 10s cada 60s
  useEffect(() => {
    const t = setInterval(() => {
      const slots = globalSlotsRef.current;
      const trickle = trickleRef.current;
      let goldGained = 0;
      const newTrickle = trickle.map((timer, i) => {
        const dogId = slots[i];
        const bonus = dogId ? ForgeDogsConfig[dogId]?.globalSlotBonus : null;
        if (!bonus || bonus.type !== 'goldTrickle') return { cooldown: 60, active: false, activeRemaining: 0 };
        if (timer.active) {
          goldGained += Math.floor(Math.random() * (bonus.max - bonus.min + 1)) + bonus.min;
          const rem = timer.activeRemaining - 1;
          return rem <= 0 ? { cooldown: 60, active: false, activeRemaining: 0 } : { ...timer, activeRemaining: rem };
        }
        const cd = timer.cooldown - 1;
        return cd <= 0 ? { active: true, activeRemaining: 10, cooldown: 0 } : { ...timer, cooldown: cd };
      });
      trickleRef.current = newTrickle;
      if (goldGained > 0) {
        setGameState(prev => ({
          ...prev,
          gold: prev.gold + goldGained,
          totalGoldEarned: prev.totalGoldEarned + goldGained,
        }));
      }
    }, 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line

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

  // hint_rewards: no hace nada automático, el jugador abre el modal

  // hint_rental: inyecta Zeus cuando empieza el paso
  useEffect(() => {
    if (tutorialStep !== 'hint_rental') return;
    if ((gameState.tutorial?.rentalTutorialStep ?? 0) !== 0) return;
    setGameState(prev => ({
      ...prev,
      rental: { ...prev.rental, available: { dogId: 'zeus', rarity: 'rare', cost: 0 } },
    }));
  }, [tutorialStep]); // eslint-disable-line

  // hint_rental: Zeus alquilado → inyectar Druh
  useEffect(() => {
    if (tutorialStep !== 'hint_rental') return;
    if ((gameState.tutorial?.rentalTutorialStep ?? 0) !== 0) return;
    const zeusRented = (gameState.rental?.active ?? []).some(r => r.dogId === 'zeus');
    if (zeusRented && !gameState.rental?.available) {
      setGameState(prev => ({
        ...prev,
        tutorial: { ...prev.tutorial, rentalTutorialStep: 1 },
        rental: { ...prev.rental, available: { dogId: 'druh', rarity: 'rare', cost: 0 } },
      }));
    }
  }, [gameState.rental?.active, gameState.rental?.available, tutorialStep, gameState.tutorial?.rentalTutorialStep]); // eslint-disable-line

  // hint_rental: Druh alquilado → avanzar a raids
  useEffect(() => {
    if (tutorialStep !== 'hint_rental') return;
    if ((gameState.tutorial?.rentalTutorialStep ?? 0) !== 1) return;
    const druhRented = (gameState.rental?.active ?? []).some(r => r.dogId === 'druh');
    if (druhRented) {
      setGameState(prev => ({
        ...prev,
        tutorial: { ...prev.tutorial, rentalTutorialStep: 2 },
      }));
      setRentalModalOpen(false);
      setTutorialStep('hint_raids');
    }
  }, [gameState.rental?.active, tutorialStep, gameState.tutorial?.rentalTutorialStep]); // eslint-disable-line

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
            cost={gameState.tutorial?.staminaUpgradeDone ? gameState.maxStaminaCost : 1000}
            coinCost={gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10)}
            onUpgrade={() => {
              handleBuyMaxStaminaUpgrade();
              if (!gameState.tutorial?.completed) setOpenModal(null);
            }}
            canAfford={
              gameState.gold >= (gameState.tutorial?.staminaUpgradeDone ? gameState.maxStaminaCost : 1000) &&
              gameState.tavernCoins >= (gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10)) &&
              !(gameState.tutorial?.staminaUpgradeDone && !gameState.tutorial?.completed)
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

        {/* AUTOMINE — desbloqueable, 2 cargas con cooldown */}
        <div className="automine-container" style={
          (tutorialStep === 'automine_hint' || tutorialStep === 'stamina_hint' || tutorialStep === 'repair_hint')
            ? { zIndex: 600 }
            : undefined
        }>
          <div className="automine-hub-wrap" style={!gameState.automine?.unlocked ? { width: 'auto', height: 'auto' } : undefined}>
            {/* Hub — desbloquear o pico circular */}
            {!gameState.automine?.unlocked ? (
              <button
                onClick={handleUnlockAutomine}
                disabled={gameState.gold < AutomineConfig.unlockCost}
                className={`automine-button unlock${tutorialStep === 'automine_hint' ? ' tutorial-highlight' : ''}`}
              >
                <img src={getPickaxeIcon(gameState.pickaxe.material, gameState.pickaxe.tier)} alt="Pico" />
                <span>{AutomineConfig.unlockCost} oro</span>
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

            {/* Satélite — Energía (siempre visible) */}
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
                    <div
                      className="sat-burst-bar"
                      style={{ width: `${Math.max(0, (gameState.stamina / effectiveMaxStamina) * 100)}%` }}
                    />
                  </div>
                )}
                {gameState.burst?.recharging && (
                  <span className="sat-poder-overlay">{gameState.burst.rechargeRemaining}s</span>
                )}
              </div>
              {tutorialStep === 'stamina_hint' && <TutorialPointer step="stamina_hint" />}
            </button>

            {/* Satélite — Upgrade (bloqueado hasta desbloquear automine) */}
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

            {/* Satélite — Reparar (siempre visible) */}
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

        {/* SLOTS PERROS GLOBALES */}
        <div className="global-dog-slots" style={tutorialStep === 'hint_mine_dog' ? { zIndex: 600 } : undefined}>
          {[0, 1, 2].map(i => {
            const assignedDogId = (gameState.dogs.globalSlots ?? [null, null, null])[i] ?? null;
            const assignedDog = assignedDogId ? (gameState.dogs[assignedDogId] ?? gameState.forgeDogs?.[assignedDogId] ?? null) : null;
            const availableDogs = [
              ...Object.values(gameState.dogs).filter(d => d && typeof d === 'object' && !Array.isArray(d) && d.hired && d.assignedTo === null),
              ...Object.values(gameState.forgeDogs ?? {}).filter(d => d && typeof d === 'object' && !Array.isArray(d) && d.hired && d.assignedTo === null),
            ];
            const isMenuOpen = globalDogMenuOpen === i;
            const isFlipped = flippedSlot === i;

            const renderPassiveBack = () => {
              if (!assignedDogId) return null;
              const isForge = assignedDogId in ForgeDogsConfig;
              const stars = assignedDog?.stars ?? 0;
              const scaledConfig = getDogStats(assignedDogId, stars, isForge);
              const bonus = isForge ? scaledConfig?.globalSlotBonus : scaledConfig?.goldMineBonus;
              if (!bonus) return null;
              if (bonus.type === 'extraGold') return <><span>+{bonus.value} oro</span><span>por picada</span></>;
              if (bonus.type === 'saveDurability') return <><span>{Math.round(bonus.chance * 100)}%</span><span>sin gastar</span><span>durabilidad</span></>;
              if (bonus.type === 'doubleHit') return <><span>{Math.round(bonus.chance * 100)}%</span><span>de doblar</span><span>el oro</span></>;
              if (bonus.type === 'goldTrickle') return <><span>+{bonus.min === bonus.max ? bonus.min : `${bonus.min}-${bonus.max}`}</span><span>oro cada</span><span>60s</span></>;
              if (bonus.type === 'burstRecharge') return <><span>{Math.round(bonus.chance * 100)}%</span><span>recarga</span><span>energía</span></>;
              if (bonus.type === 'maxDurability') return <><span>+{bonus.value}</span><span>durabilidad</span><span>máx.</span></>;
              return null;
            };

            const assignedRarity = assignedDogId ? (DogsConfig[assignedDogId]?.rarity ?? ForgeDogsConfig[assignedDogId]?.rarity ?? null) : null;
            const rentalEntry = (gameState.rental?.active ?? []).find(r => r.assignedSlot === i && r.dogId === assignedDogId);
            const isRentedSlot = !!rentalEntry;
            const isZeusTutorialSlot = tutorialStep === 'hint_mine_dog' && assignedDogId === 'zeus';
            return (
              <div key={i} className={`global-dog-slot-wrapper${isRentedSlot ? ' global-dog-slot-rented' : ''}${isZeusTutorialSlot ? ' tutorial-highlight' : ''}`}>
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
                              const isForge = assignedDogId in ForgeDogsConfig;
                              setGameState(prev => {
                                const newSlots = (prev.dogs.globalSlots ?? [null, null, null]).map((id, idx) => idx === i ? null : id);
                                if (isForge) {
                                  return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots }, forgeDogs: { ...prev.forgeDogs, [assignedDogId]: { ...prev.forgeDogs[assignedDogId], assignedTo: null } } };
                                }
                                return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots, [assignedDogId]: { ...prev.dogs[assignedDogId], assignedTo: null } } };
                              });
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
                            const isForge = dog.id in ForgeDogsConfig;
                            setGameState(prev => {
                              const newSlots = (prev.dogs.globalSlots ?? [null, null, null]).map((id, idx) => idx === i ? dog.id : id);
                              if (isForge) {
                                return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots }, forgeDogs: { ...prev.forgeDogs, [dog.id]: { ...prev.forgeDogs[dog.id], assignedTo: { globalSlot: i } } } };
                              }
                              return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots, [dog.id]: { ...prev.dogs[dog.id], assignedTo: { globalSlot: i } } } };
                            });
                            setGlobalDogMenuOpen(null);
                          }}>🐕 {DogsConfig[dog.id]?.name ?? ForgeDogsConfig[dog.id]?.name ?? dog.id}</button>
                        ))
                      }
                      <button className="global-dog-menu-cancel" onClick={e => { e.stopPropagation(); setGlobalDogMenuOpen(null); setFlippedSlot(null); }}>✕</button>
                    </div>
                  )}
                </div>
                {assignedDog && (
                  <span className="global-dog-slot-name">{DogsConfig[assignedDogId]?.name ?? ForgeDogsConfig[assignedDogId]?.name ?? assignedDogId}</span>
                )}
              </div>
            );
          })}
        </div>

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

        {/* MENA DE ORO — elemento principal clickeable */}
        <GoldMine elevated={tutorialStep === 'mine_tap'} />

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
            'stamina_hint': { bottom: 'auto', top: '17.5rem' },
            'repair_hint': { bottom: 'auto', top: '23.5rem', left: '12rem' },
            'hint_rewards': { bottom: '19rem' },
            'hint_rental': { bottom: '22rem' },
            'hint_raids': { bottom: '25.5rem' },
            'hint_mine_dog': { bottom: '2rem' },
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

        {tutorialStep === 'automine_hint' && (
          <div className="automine-hint-tooltip">
            <p>El autominado golpea solo durante unos segundos. Tiene 2 cargas que se recargan con el tiempo. Usa el botón de mejora para reducir el tiempo de recarga. ¡Desbloquéalo cuando puedas!</p>
            <button onClick={() => setTutorialStep('hint_rewards')}>Entendido</button>
          </div>
        )}

      </div>
    </GameContext.Provider>
  );
}

export default GameRoot;
