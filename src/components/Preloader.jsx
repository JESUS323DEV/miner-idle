import { useEffect, useState } from 'react';
import { sfxReady } from '../game/utils/sfx.js';

// ===== FONDOS =====
import bgTavern from "../assets/backgrounds/bg-tavern/bg-tavern-0.webp"
import bgTavern1 from "../assets/backgrounds/bg-tavern/bg-tavern-1.webp"
import bgTavern2 from "../assets/backgrounds/bg-tavern/bg-tavern-2.webp"
import bgTavern3 from "../assets/backgrounds/bg-tavern/bg-tavern-3.webp"
import bgTavern4 from "../assets/backgrounds/bg-tavern/bg-tavern-4.webp"
import bgTavern5 from "../assets/backgrounds/bg-tavern/bg-tavern-5.webp"
import bgCoin from "../assets/backgrounds/bg-tavern/bg-coin.webp"
import bgGold1 from "../assets/backgrounds/bg-tavern/bg-gold.webp"
import bgMineBronze from "../assets/backgrounds/bg-mines/bg-mine-bronze.webp"
import bgMineIron from "../assets/backgrounds/bg-mines/bg-mine-iron.webp"
import bgMineDiamond from "../assets/backgrounds/bg-mines/bg-mine-diamond.webp"
import bgInsideBronze from "../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-bronze.webp"
import bgInsideIron from "../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-iron.webp"
import bgInsideDiamond from "../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-diamond.webp"
import bgMain from "../assets/backgrounds/fondo4.webp"
import bgGold from "../assets/backgrounds/bg-modals-hud/fondoGold.webp"
import bgStamina from "../assets/backgrounds/bg-modals-hud/bgStamina.webp"
import bgPickaxe from "../assets/backgrounds/bg-modals-hud/fondoWorkShop.webp"
import bgNupito from "../assets/backgrounds/bg-tavern/bg-back-cards/nupito-fondo.webp"

// ===== HUD PRINCIPAL =====
import cofre from "../assets/ui/icons-hud/hud-principal/cofre-oro1.webp"
import gold1 from "../assets/ui/icons-hud/hud-principal/oro1.webp"
import coinTavern from "../assets/ui/icons-hud/hud-principal/coin-tavern1.webp"
import stamina1 from "../assets/ui/icons-hud/hud-principal/stamina-1.webp"
import goldOpen from "../assets/ui/icons-hud/hud-principal/gold-open.webp"
import repair from "../assets/ui/icons-hud/hud-principal/repair.webp"
import refillStaminaIcon from "../assets/ui/icons-hud/hud-principal/refill-stamina.webp"
import rayo from "../assets/ui/icons-hud/hud-principal/rayo.webp"

// ===== HUD MODALS =====
import iconGold from "../assets/ui/icons-hud/hud-modals/icon-gold-second.webp"
import buttonUpgrade from "../assets/ui/icons-hud/hud-modals/buttonUpgrade.webp"
import upgradeStamina from "../assets/ui/icons-hud/hud-modals/icon-lvl-stamina.webp"
import PickAxeUp from "../assets/ui/icons-hud/hud-modals/btn-pickAxeUp.webp"
import btnTier from "../assets/ui/icons-hud/hud-modals/btnTier.webp"
import cookie from "../assets/ui/icons-hud/hud-modals/cookie.webp"

// ===== SAT ICONS =====
import satEnergy from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-energy.webp"
import satRepair from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-reapir.webp"
import satUpgrade from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-upgrade.webp"

// ===== TAVERN MODAL ICONS =====
import cambistaCoin from "../assets/ui/icons-hud/hud-modals/modal-tavern/cambista-coin.webp"
import cambistaMateriales from "../assets/ui/icons-hud/hud-modals/modal-tavern/materiales.webp"

// ===== ICONS TAVERN =====
import iconTavernComida from "../assets/ui/icons-hud/hud-modals/icons-tavern/comida.webp"
import iconTavernTrigo from "../assets/ui/icons-hud/hud-modals/icons-tavern/trigo.webp"
import iconTavernLupulo from "../assets/ui/icons-hud/hud-modals/icons-tavern/lupulo.webp"
import iconTavernCerveza from "../assets/ui/icons-hud/hud-modals/icons-tavern/cerveza.webp"
import iconTavernCraft from "../assets/ui/icons-hud/hud-modals/icons-tavern/craft.webp"

// ===== PICOS =====
import pickAxeStone from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone.webp"
import pickAxeStone1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier1.webp"
import pickAxeStone2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier2.webp"
import pickAxeStone3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone-tier3.webp"
import pickAxeBronze from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze.webp"
import pickAxeBronze1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier1.webp"
import pickAxeBronze2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier2.webp"
import pickAxeBronze3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-bronze/bronze-tier3.webp"
import pickAxeIron from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron.webp"
import pickAxeIron1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier1.webp"
import pickAxeIron2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier2.webp"
import pickAxeIron3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-iron/iron-tier3.webp"
import pickAxeDiamond from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond.webp"
import pickAxeDiamond1 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier1.webp"
import pickAxeDiamond2 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier2.webp"
import pickAxeDiamond3 from "../assets/ui/icons-pickaxe/Pickaxe/pickaxe-diamante/diamond-tier3.webp"

// ===== LINGOTES =====
import iconBronze from "../assets/ui/icons-forge/lingotes/lingote-bronze.webp"
import iconIron from "../assets/ui/icons-forge/lingotes/lingote-iron.webp"
import iconDiamond from "../assets/ui/icons-forge/lingotes/lingote-diamond.webp"

// ===== MENAS HUD =====
import menaBronzeHud from "../assets/ui/icons-forge/menas-hud/bronzeHud.webp"
import menaIronHud from "../assets/ui/icons-forge/menas-hud/ironHud.webp"
import menaDiamondHud from "../assets/ui/icons-forge/menas-hud/diamondHud.webp"

// ===== MENAS MINA =====
import menaBronze1 from "../assets/ui/icons-menas/menas-bronze/mena-bronze1.webp"
import menaBronze2 from "../assets/ui/icons-menas/menas-bronze/mena-bronze2.webp"
import menaBronze3 from "../assets/ui/icons-menas/menas-bronze/mena-bronze3.webp"
import menaIron1 from "../assets/ui/icons-menas/menas-iron/mena-iron1.webp"
import menaIron2 from "../assets/ui/icons-menas/menas-iron/mena-iron2.webp"
import menaIron3 from "../assets/ui/icons-menas/menas-iron/mena-iron3.webp"
import menaDiamond1 from "../assets/ui/icons-menas/menas-diamond/mena-diamond1.webp"
import menaDiamond2 from "../assets/ui/icons-menas/menas-diamond/mena-diamond2.webp"
import menaDiamond3 from "../assets/ui/icons-menas/menas-diamond/mena-diamond3.webp"

// ===== HORNOS =====
import forgeBronze1 from "../assets/ui/icons-forge/forges/forge-lvl1/forge-bronze.webp"
import forgeIron1 from "../assets/ui/icons-forge/forges/forge-lvl1/forge-iron.webp"
import forgeDiamond1 from "../assets/ui/icons-forge/forges/forge-lvl1/forge-diamond.webp"
import forgeBronze2 from "../assets/ui/icons-forge/forges/forge-lvl2/forge-bronze2.webp"
import forgeIron2 from "../assets/ui/icons-forge/forges/forge-lvl2/forge-iron2.webp"
import forgeDiamond2 from "../assets/ui/icons-forge/forges/forge-lvl2/forge-diamond2.webp"
import forgeBronze3 from "../assets/ui/icons-forge/forges/forge-lvl3/forge-bronze3.webp"
import forgeIron3 from "../assets/ui/icons-forge/forges/forge-lvl3/forge-iron3.webp"
import forgeDiamond3 from "../assets/ui/icons-forge/forges/forge-lvl3/forge-diamond3.webp"

// ===== ICONOS PANTALLA =====
import mineModal from "../assets/ui/icon-mine1.webp"
import iconTavern from "../assets/ui/icon-tavern1.webp"
import iconForge from "../assets/ui/icon-forge1.webp"

// ===== AUTOMINA =====
import activeMine from "../assets/ui/icons-auto-mine/active-mine.webp"
import stopMine from "../assets/ui/icons-auto-mine/stop-mine.webp"

// ===== SHARDS & INVOCACIONES =====
import iconInvocacion from "../assets/ui/icons-pets-shards/icon-invocacion.webp"
import iconShardRare from "../assets/ui/icons-pets-shards/icon-shard-rare.webp"
import iconShardEpic from "../assets/ui/icons-pets-shards/icon-shard-epic.webp"
import iconShardLegendary from "../assets/ui/icons-pets-shards/icon-shard-legendary.webp"
import iconShardRareGeneric from "../assets/ui/icons-pets-shards/icon-shard-rare-generic.webp"
import iconShardEpicGeneric from "../assets/ui/icons-pets-shards/icon-shard-epic-generic.webp"
import iconShardLegendaryGeneric from "../assets/ui/icons-pets-shards/icon-shard-legendary-generic.webp"

// ===== PETS MINEROS =====
import ladyIcon from "../assets/ui/icons-pets/mineros/lady-icon.webp"
import tokyoIcon from "../assets/ui/icons-pets/mineros/tokyo-icon.webp"
import tukaIcon from "../assets/ui/icons-pets/mineros/tuka-icon.webp"
import munaIcon from "../assets/ui/icons-pets/mineros/muna-icon.webp"
import gordoIcon from "../assets/ui/icons-pets/mineros/gordo-icon.webp"
import druhIcon from "../assets/ui/icons-pets/mineros/druh-icon.webp"
import smokeIcon from "../assets/ui/icons-pets/mineros/smoke-icon.webp"
import nupitoIcon from "../assets/ui/icons-pets/mineros/nupito-icon.webp"
import zeusIcon from "../assets/ui/icons-pets/mineros/zeus-icon.webp"
import boxerIcon from "../assets/ui/icons-pets/mineros/boxer-icon.webp"
import bullyIcon from "../assets/ui/icons-pets/mineros/bully-icon.webp"
import chihuahuaIcon from "../assets/ui/icons-pets/mineros/chihuhua-icon.webp"

// ===== PETS FORJA =====
import forgeIcon1 from "../assets/ui/icons-pets/forge/forge-icon1.webp"
import forgeIcon2 from "../assets/ui/icons-pets/forge/forge-icon2.webp"
import forgeIcon3 from "../assets/ui/icons-pets/forge/forge-icon3.webp"
import forgeIcon4 from "../assets/ui/icons-pets/forge/forge-icon4.webp"
import forgeIcon5 from "../assets/ui/icons-pets/forge/forge-icon5.webp"
import forgeIcon6 from "../assets/ui/icons-pets/forge/forge-icon6.webp"
import forgeIcon7 from "../assets/ui/icons-pets/forge/forge-icon7.webp"
import forgeIcon8 from "../assets/ui/icons-pets/forge/forge-icon8.webp"
import forgeIcon9 from "../assets/ui/icons-pets/forge/forge-icon9.webp"

// ===== ENEMIGOS COMBATE =====
import bat1 from "../assets/ui/icons-enemy/bats/bat-1.webp"
import bat2 from "../assets/ui/icons-enemy/bats/bat-2.webp"
import bat3 from "../assets/ui/icons-enemy/bats/bat-3.webp"
import batBoss from "../assets/ui/icons-enemy/bats/bat-boss.webp"
import bgCombatBats from "../assets/ui/icons-enemy/bats/bg-combat-bats.webp"
import topo1 from "../assets/ui/icons-enemy/topos/topo-1.webp"
import topo2 from "../assets/ui/icons-enemy/topos/topo-2.webp"
import topo3 from "../assets/ui/icons-enemy/topos/topo-3.webp"
import topoBoss from "../assets/ui/icons-enemy/topos/topo-boss.webp"
import bgCombatTopos from "../assets/ui/icons-enemy/topos/bg-combat-topos.webp"

// ===== ESCENAS MINERÍA =====
import menaGold from "../assets/scenes/mining/menaGold.webp"
import menaGold2 from "../assets/scenes/mining/menaGold2.webp"
import menaGold3 from "../assets/scenes/mining/menaGold3.webp"
import menaGold4 from "../assets/scenes/mining/mena-gold4.webp"
import menaGold5 from "../assets/scenes/mining/mena-gold5.webp"
import picando1 from "../assets/scenes/mining/picando1.webp"
import picando2 from "../assets/scenes/mining/picando2.webp"
import mineroDescanso from "../assets/scenes/mining/minero-descanso.webp"

// ===== PODERES =====
import powerFuria from "../assets/ui/power-pets/furia.webp"
import powerFire from "../assets/ui/power-pets/pelota-fire.webp"
import powerElectric from "../assets/ui/power-pets/pelota-electic.webp"
import powerWater from "../assets/ui/power-pets/pistola-agua.webp"
import powerEarth from "../assets/ui/power-pets/terremoto.webp"

// ===== TUTORIAL =====
import tutorialPrincipal from "../assets/tutorial/mascotas/principal.webp"
import tutorialMina from "../assets/tutorial/mascotas/mina.webp"
import tutorialForja from "../assets/tutorial/mascotas/forja.webp"

const IMAGES = [
    // fondos
    bgTavern, bgTavern1, bgTavern2, bgTavern3, bgTavern4, bgTavern5, bgCoin, bgGold1,
    bgMineBronze, bgMineIron, bgMineDiamond,
    bgInsideBronze, bgInsideIron, bgInsideDiamond,
    bgMain, bgGold, bgStamina, bgPickaxe, bgNupito,
    // hud principal
    cofre, gold1, coinTavern, stamina1, goldOpen, repair, refillStaminaIcon, rayo,
    // hud modals
    iconGold, buttonUpgrade, upgradeStamina, PickAxeUp, btnTier, cookie,
    // icons tavern
    iconTavernComida, iconTavernTrigo, iconTavernLupulo, iconTavernCerveza, iconTavernCraft,
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
