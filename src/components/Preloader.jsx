import { useEffect, useState } from 'react';
import { sfxReady } from '../game/utils/sfx.js';

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
import bgNupito from "../assets/backgrounds/bg-tavern/bg-back-cards/nupito-fondo.png"

// ===== HUD PRINCIPAL =====
import cofre from "../assets/ui/icons-hud/hud-principal/cofre-oro1.png"
import gold1 from "../assets/ui/icons-hud/hud-principal/oro1.png"
import coinTavern from "../assets/ui/icons-hud/hud-principal/coin-tavern1.png"
import stamina1 from "../assets/ui/icons-hud/hud-principal/stamina-1.png"
import goldOpen from "../assets/ui/icons-hud/hud-principal/gold-open.png"
import repair from "../assets/ui/icons-hud/hud-principal/repair.png"
import refillStaminaIcon from "../assets/ui/icons-hud/hud-principal/refill-stamina.png"
import rayo from "../assets/ui/icons-hud/hud-principal/rayo.png"

// ===== HUD MODALS =====
import iconGold from "../assets/ui/icons-hud/hud-modals/icon-gold-second.png"
import buttonUpgrade from "../assets/ui/icons-hud/hud-modals/buttonUpgrade.png"
import upgradeStamina from "../assets/ui/icons-hud/hud-modals/icon-lvl-stamina.png"
import PickAxeUp from "../assets/ui/icons-hud/hud-modals/btn-pickAxeUp.png"
import btnTier from "../assets/ui/icons-hud/hud-modals/btnTier.png"
import cookie from "../assets/ui/icons-hud/hud-modals/cookie.png"

// ===== SAT ICONS =====
import satEnergy from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-energy.png"
import satRepair from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-reapir.png"
import satUpgrade from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-upgrade.png"

// ===== TAVERN MODAL ICONS =====
import cambistaCoin from "../assets/ui/icons-hud/hud-modals/modal-tavern/cambista-coin.png"
import cambistaMateriales from "../assets/ui/icons-hud/hud-modals/modal-tavern/materiales.png"

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
import menaBronzeHud from "../assets/ui/icons-forge/menas-hud/bronzeHud.png"
import menaIronHud from "../assets/ui/icons-forge/menas-hud/ironHud.png"
import menaDiamondHud from "../assets/ui/icons-forge/menas-hud/diamondHud.png"

// ===== MENAS MINA =====
import menaBronze1 from "../assets/ui/icons-menas/menas-bronze/mena-bronze1.png"
import menaBronze2 from "../assets/ui/icons-menas/menas-bronze/mena-bronze2.png"
import menaBronze3 from "../assets/ui/icons-menas/menas-bronze/mena-bronze3.png"
import menaIron1 from "../assets/ui/icons-menas/menas-iron/mena-iron1.png"
import menaIron2 from "../assets/ui/icons-menas/menas-iron/mena-iron2.png"
import menaIron3 from "../assets/ui/icons-menas/menas-iron/mena-iron3.png"
import menaDiamond1 from "../assets/ui/icons-menas/menas-diamond/mena-diamond1.png"
import menaDiamond2 from "../assets/ui/icons-menas/menas-diamond/mena-diamond2.png"
import menaDiamond3 from "../assets/ui/icons-menas/menas-diamond/mena-diamond3.png"

// ===== HORNOS =====
import forgeBronze1 from "../assets/ui/icons-forge/forges/forge-lvl1/forge-bronze.png"
import forgeIron1 from "../assets/ui/icons-forge/forges/forge-lvl1/forge-iron.png"
import forgeDiamond1 from "../assets/ui/icons-forge/forges/forge-lvl1/forge-diamond.png"
import forgeBronze2 from "../assets/ui/icons-forge/forges/forge-lvl2/forge-bronze2.png"
import forgeIron2 from "../assets/ui/icons-forge/forges/forge-lvl2/forge-iron2.png"
import forgeDiamond2 from "../assets/ui/icons-forge/forges/forge-lvl2/forge-diamond2.png"
import forgeBronze3 from "../assets/ui/icons-forge/forges/forge-lvl3/forge-bronze3.png"
import forgeIron3 from "../assets/ui/icons-forge/forges/forge-lvl3/forge-iron3.png"
import forgeDiamond3 from "../assets/ui/icons-forge/forges/forge-lvl3/forge-diamond3.png"

// ===== ICONOS PANTALLA =====
import mineModal from "../assets/ui/icon-mine1.png"
import iconTavern from "../assets/ui/icon-tavern1.png"
import iconForge from "../assets/ui/icon-forge1.png"

// ===== AUTOMINA =====
import activeMine from "../assets/ui/icons-auto-mine/active-mine.png"
import stopMine from "../assets/ui/icons-auto-mine/stop-mine.png"

// ===== SHARDS & INVOCACIONES =====
import iconInvocacion from "../assets/ui/icons-pets-shards/icon-invocacion.png"
import iconShardRare from "../assets/ui/icons-pets-shards/icon-shard-rare.png"
import iconShardEpic from "../assets/ui/icons-pets-shards/icon-shard-epic.png"
import iconShardLegendary from "../assets/ui/icons-pets-shards/icon-shard-legendary.png"
import iconShardRareGeneric from "../assets/ui/icons-pets-shards/icon-shard-rare-generic.png"
import iconShardEpicGeneric from "../assets/ui/icons-pets-shards/icon-shard-epic-generic.png"
import iconShardLegendaryGeneric from "../assets/ui/icons-pets-shards/icon-shard-legendary-generic.png"

// ===== PETS MINEROS =====
import ladyIcon from "../assets/ui/icons-pets/mineros/lady-icon.png"
import tokyoIcon from "../assets/ui/icons-pets/mineros/tokyo-icon.png"
import tukaIcon from "../assets/ui/icons-pets/mineros/tuka-icon.png"
import munaIcon from "../assets/ui/icons-pets/mineros/muna-icon.png"
import gordoIcon from "../assets/ui/icons-pets/mineros/gordo-icon.png"
import druhIcon from "../assets/ui/icons-pets/mineros/druh-icon.png"
import smokeIcon from "../assets/ui/icons-pets/mineros/smoke-icon.png"
import nupitoIcon from "../assets/ui/icons-pets/mineros/nupito-icon.png"
import zeusIcon from "../assets/ui/icons-pets/mineros/zeus-icon.png"
import boxerIcon from "../assets/ui/icons-pets/mineros/boxer-icon.png"
import bullyIcon from "../assets/ui/icons-pets/mineros/bully-icon.png"
import chihuahuaIcon from "../assets/ui/icons-pets/mineros/chihuhua-icon.png"

// ===== PETS FORJA =====
import forgeIcon1 from "../assets/ui/icons-pets/forge/forge-icon1.png"
import forgeIcon2 from "../assets/ui/icons-pets/forge/forge-icon2.png"
import forgeIcon3 from "../assets/ui/icons-pets/forge/forge-icon3.png"
import forgeIcon4 from "../assets/ui/icons-pets/forge/forge-icon4.png"
import forgeIcon5 from "../assets/ui/icons-pets/forge/forge-icon5.png"
import forgeIcon6 from "../assets/ui/icons-pets/forge/forge-icon6.png"
import forgeIcon7 from "../assets/ui/icons-pets/forge/forge-icon7.png"
import forgeIcon8 from "../assets/ui/icons-pets/forge/forge-icon8.png"
import forgeIcon9 from "../assets/ui/icons-pets/forge/forge-icon9.png"

// ===== ENEMIGOS COMBATE =====
import bat1 from "../assets/ui/icons-enemy/bats/bat-1.png"
import bat2 from "../assets/ui/icons-enemy/bats/bat-2.png"
import bat3 from "../assets/ui/icons-enemy/bats/bat-3.png"
import batBoss from "../assets/ui/icons-enemy/bats/bat-boss.png"
import bgCombatBats from "../assets/ui/icons-enemy/bats/bg-combat-bats.png"
import topo1 from "../assets/ui/icons-enemy/topos/topo-1.png"
import topo2 from "../assets/ui/icons-enemy/topos/topo-2.png"
import topo3 from "../assets/ui/icons-enemy/topos/topo-3.png"
import topoBoss from "../assets/ui/icons-enemy/topos/topo-boss.png"
import bgCombatTopos from "../assets/ui/icons-enemy/topos/bg-combat-topos.png"

// ===== ESCENAS MINERÍA =====
import menaGold from "../assets/scenes/mining/menaGold.png"
import menaGold2 from "../assets/scenes/mining/menaGold2.png"
import menaGold3 from "../assets/scenes/mining/menaGold3.png"
import menaGold4 from "../assets/scenes/mining/mena-gold4.png"
import menaGold5 from "../assets/scenes/mining/mena-gold5.png"
import picando1 from "../assets/scenes/mining/picando1.png"
import picando2 from "../assets/scenes/mining/picando2.png"
import mineroDescanso from "../assets/scenes/mining/minero-descanso.png"

// ===== PODERES =====
import powerFuria from "../assets/ui/power-pets/furia.png"
import powerFire from "../assets/ui/power-pets/pelota-fire.png"
import powerElectric from "../assets/ui/power-pets/pelota-electic.png"
import powerWater from "../assets/ui/power-pets/pistola-agua.png"
import powerEarth from "../assets/ui/power-pets/terremoto.png"

// ===== TUTORIAL =====
import tutorialPrincipal from "../assets/tutorial/mascotas/principal.png"
import tutorialMina from "../assets/tutorial/mascotas/mina.png"
import tutorialForja from "../assets/tutorial/mascotas/forja.png"

const IMAGES = [
    // fondos
    bgTavern, bgCoin, bgGold1,
    bgMineBronze, bgMineIron, bgMineDiamond,
    bgInsideBronze, bgInsideIron, bgInsideDiamond,
    bgMain, bgGold, bgStamina, bgPickaxe, bgNupito,
    // hud principal
    cofre, gold1, coinTavern, stamina1, goldOpen, repair, refillStaminaIcon, rayo,
    // hud modals
    iconGold, buttonUpgrade, upgradeStamina, PickAxeUp, btnTier, cookie,
    // sat
    satEnergy, satRepair, satUpgrade,
    // tavern
    cambistaCoin, cambistaMateriales,
    // picos
    pickAxeStone, pickAxeStone1, pickAxeStone2, pickAxeStone3,
    pickAxeBronze, pickAxeBronze1, pickAxeBronze2, pickAxeBronze3,
    pickAxeIron, pickAxeIron1, pickAxeIron2, pickAxeIron3,
    pickAxeDiamond, pickAxeDiamond1, pickAxeDiamond2, pickAxeDiamond3,
    // lingotes
    iconBronze, iconIron, iconDiamond,
    // menas hud
    menaBronzeHud, menaIronHud, menaDiamondHud,
    // menas mina
    menaBronze1, menaBronze2, menaBronze3,
    menaIron1, menaIron2, menaIron3,
    menaDiamond1, menaDiamond2, menaDiamond3,
    // hornos
    forgeBronze1, forgeIron1, forgeDiamond1,
    forgeBronze2, forgeIron2, forgeDiamond2,
    forgeBronze3, forgeIron3, forgeDiamond3,
    // pantallas
    mineModal, iconTavern, iconForge,
    // automina
    activeMine, stopMine,
    // shards
    iconInvocacion,
    iconShardRare, iconShardEpic, iconShardLegendary,
    iconShardRareGeneric, iconShardEpicGeneric, iconShardLegendaryGeneric,
    // pets mineros
    ladyIcon, tokyoIcon, tukaIcon, munaIcon, gordoIcon,
    druhIcon, smokeIcon, nupitoIcon, zeusIcon,
    boxerIcon, bullyIcon, chihuahuaIcon,
    // pets forja
    forgeIcon1, forgeIcon2, forgeIcon3, forgeIcon4, forgeIcon5,
    forgeIcon6, forgeIcon7, forgeIcon8, forgeIcon9,
    // enemigos
    bat1, bat2, bat3, batBoss, bgCombatBats,
    topo1, topo2, topo3, topoBoss, bgCombatTopos,
    // escenas
    menaGold, menaGold2, menaGold3, menaGold4, menaGold5,
    picando1, picando2, mineroDescanso,
    // poderes
    powerFuria, powerFire, powerElectric, powerWater, powerEarth,
    // tutorial
    tutorialPrincipal, tutorialMina, tutorialForja,
];

export const usePreloader = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let done = 0;
        const total = IMAGES.length;
        const onImageDone = () => {
            done++;
            if (done === total) {
                sfxReady.then(() => setLoaded(true));
            }
        };
        IMAGES.forEach(src => {
            const img = new Image();
            img.onload = img.onerror = onImageDone;
            img.src = src;
        });
    }, []);

    return loaded;
};
