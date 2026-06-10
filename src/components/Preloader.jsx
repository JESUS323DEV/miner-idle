import { useEffect } from 'react';

// ===== FONDOS =====
import bgTavern from "../assets/backgrounds/bg-tavern/bg-tavern1.png"
import bgCoin from "../assets/backgrounds/bg-tavern/bg-coin.png"
import bgGold1 from "../assets/backgrounds/bg-tavern/bg-gold.png"
import bgMineBronze from "../assets/backgrounds/bg-mines/bg-mine-bronze.png"
import bgMineIron from "../assets/backgrounds/bg-mines/bg-mine-iron.png"
import bgMineDiamond from "../assets/backgrounds/bg-mines/bg-mine-diamond.png"
import bgInsideBronze from "../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-bronze.png"
import bgInsideIron from "../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-iron.png"
import bgInsideDiamond from "../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-diamond.png"
import bgMain from "../assets/backgrounds/fondo4.png"
import bgGold from "../assets/backgrounds/bg-modals-hud/fondoGold.png"
import bgStamina from "../assets/backgrounds/bg-modals-hud/bgStamina.png"
import bgPickaxe from "../assets/backgrounds/bg-modals-hud/fondoWorkShop.png"

// ===== HUD PRINCIPAL =====
import cofre from "../assets/ui/icons-hud/hud-principal/cofre-oro1.png"
import gold1 from "../assets/ui/icons-hud/hud-principal/oro1.png"
import coinTavern from "../assets/ui/icons-hud/hud-principal/coin-tavern1.png"
import stamina1 from "../assets/ui/icons-hud/hud-principal/stamina-1.png"
import goldOpen from "../assets/ui/icons-hud/hud-principal/gold-open.png"
import repair from "../assets/ui/icons-hud/hud-principal/repair.png"
import refillStaminaIcon from "../assets/ui/icons-hud/hud-principal/refill-stamina.png"

// ===== HUD MODALS =====
import iconGold from "../assets/ui/icons-hud/hud-modals/icon-gold-second.png"
import buttonUpgrade from "../assets/ui/icons-hud/hud-modals/buttonUpgrade.png"
import upgradeStamina from "../assets/ui/icons-hud/hud-modals/icon-lvl-stamina.png"
import PickAxeUp from "../assets/ui/icons-hud/hud-modals/btn-pickAxeUp.png"
import btnTier from "../assets/ui/icons-hud/hud-modals/btnTier.png"

// ===== PICOS =====
import pickAxeStone from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone.png"
import pickAxeStone1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier1.png"
import pickAxeStone2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier2.png"
import pickAxeStone3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier3.png"
import pickAxeBronze from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze.png"
import pickAxeBronze1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier1.png"
import pickAxeBronze2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier2.png"
import pickAxeBronze3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier3.png"
import pickAxeIron from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron.png"
import pickAxeIron1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier1.png"
import pickAxeIron2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier2.png"
import pickAxeIron3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier3.png"
import pickAxeDiamond from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond.png"
import pickAxeDiamond1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier1.png"
import pickAxeDiamond2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier2.png"
import pickAxeDiamond3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier3.png"

// ===== LINGOTES =====
import iconBronze from "../assets/ui/icons-forge/lingotes/lingote-bronze.png"
import iconIron from "../assets/ui/icons-forge/lingotes/lingote-iron.png"
import iconDiamond from "../assets/ui/icons-forge/lingotes/lingote-diamond.png"

// ===== MENAS HUD =====
import menaBronze from "../assets/ui/icons-forge/menas-hud/bronzeHud.png"
import menaIron from "../assets/ui/icons-forge/menas-hud/ironHud.png"
import menaDiamond from "../assets/ui/icons-forge/menas-hud/diamondHud.png"

// ===== ICONOS PANTALLA =====
import mineModal from "../assets/ui/icon-mine1.png"
import iconTavern from "../assets/ui/icon-tavern1.png"
import iconForge from "../assets/ui/icon-forge1.png"

// ===== AUTOMINA =====
import activeMine from "../assets/ui/icons-auto-mine/active-mine.png"
import stopMine from "../assets/ui/icons-auto-mine/stop-mine.png"

// ===== PETS =====
import ladyIcon from "../assets/ui/icons-pets/mineros/lady-icon.png"
import tokyoIcon from "../assets/ui/icons-pets/mineros/tokyo-icon.png"
import tukaIcon from "../assets/ui/icons-pets/mineros/tuka-icon.png"
import munaIcon from "../assets/ui/icons-pets/mineros/muna-icon.png"
import gordoIcon from "../assets/ui/icons-pets/mineros/gordo-icon.png"
import druhIcon from "../assets/ui/icons-pets/mineros/druh-icon.png"
import smokeIcon from "../assets/ui/icons-pets/mineros/smoke-icon.png"
import nupitoIcon from "../assets/ui/icons-pets/mineros/nupito-icon.png"
import zeusIcon from "../assets/ui/icons-pets/mineros/zeus-icon.png"

const IMAGES = [
    // fondos
    bgTavern, bgCoin, bgGold1,
    bgMineBronze, bgMineIron, bgMineDiamond,
    bgInsideBronze, bgInsideIron, bgInsideDiamond,
    bgMain, bgGold, bgStamina, bgPickaxe,
    // hud principal
    cofre, gold1, coinTavern, stamina1, goldOpen, repair, refillStaminaIcon,
    // hud modals
    iconGold, buttonUpgrade, upgradeStamina, PickAxeUp, btnTier,
    // picos
    pickAxeStone, pickAxeStone1, pickAxeStone2, pickAxeStone3,
    pickAxeBronze, pickAxeBronze1, pickAxeBronze2, pickAxeBronze3,
    pickAxeIron, pickAxeIron1, pickAxeIron2, pickAxeIron3,
    pickAxeDiamond, pickAxeDiamond1, pickAxeDiamond2, pickAxeDiamond3,
    // lingotes y menas
    iconBronze, iconIron, iconDiamond,
    menaBronze, menaIron, menaDiamond,
    // pantalla
    mineModal, iconTavern, iconForge,
    // automina
    activeMine, stopMine,
    // pets
    ladyIcon, tokyoIcon, tukaIcon, munaIcon, gordoIcon, druhIcon, smokeIcon, nupitoIcon, zeusIcon,
];

const Preloader = () => {
    useEffect(() => {
        IMAGES.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    return null;
};

export default Preloader;
