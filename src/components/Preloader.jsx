import { useEffect, useRef, useState } from 'react';
import { sfxReady } from '../game/utils/sfx.js';
import { dogSkinAssets } from '../game/utils/dogSkinAssets.js';

// ===== FONDOS =====
import bgTavern from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-0.webp"
import bgTavern1 from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-1.webp"
import bgTavern2 from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-2.webp"
import bgTavern3 from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-3.webp"
import bgTavern4 from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-4.webp"
import bgTavern5 from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-5.webp"
import bgTavern6 from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-6.webp"
import bgTavern7 from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-7.webp"
import bgTavern8 from "../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-8.webp"
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
import iconRaids from "../assets/ui/icons-hud/hud-principal/raids.webp"
import iconRewards from "../assets/ui/icons-hud/hud-principal/rewards.webp"
import iconRent from "../assets/ui/icons-hud/hud-principal/rent.webp"
import huesinCoin from "../assets/ui/icons-hud/hud-principal/huesin-coin.webp"

// ===== HUD MODALS =====
import iconGold from "../assets/ui/icons-hud/hud-modals/icon-gold-second.webp"
import buttonUpgrade from "../assets/ui/icons-hud/hud-modals/buttonUpgrade.webp"
import upgradeStamina from "../assets/ui/icons-hud/hud-modals/icon-lvl-stamina.webp"
import PickAxeUp from "../assets/ui/icons-hud/hud-modals/btn-pickAxeUp.webp"
import btnTier from "../assets/ui/icons-hud/hud-modals/btnTier.webp"
import cookie from "../assets/ui/icons-hud/hud-modals/cookie.webp"
import iconUnlock from "../assets/ui/icons-hud/hud-modals/unlock.webp"
import iconOffline from "../assets/ui/icons-hud/hud-modals/off-line.webp"

// ===== SAT ICONS =====
import satEnergy from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-energy.webp"
import satRepair from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-reapir.webp"
import satUpgrade from "../assets/ui/icons-hud/hud-modals/icons-sat/icon-upgrade.webp"

// ===== TAVERN MODAL ICONS =====
import cambistaCoin from "../assets/ui/icons-hud/hud-modals/modal-tavern/cambista-coin.webp"
import exchangeBgBronze from "../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/bronze.webp"
import exchangeBgIron from "../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/iron.webp"
import exchangeBgDiamond from "../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/diamond.webp"
import iconSelectLeft from "../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/select-left.webp"
import iconSelectRight from "../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/select-right.webp"
import cambistaMateriales from "../assets/ui/icons-hud/hud-modals/modal-tavern/materiales.webp"
import iconRuleta from "../assets/ui/icons-hud/hud-modals/modal-tavern/ruleta.webp"
import iconTragaperras from "../assets/ui/icons-hud/hud-modals/modal-tavern/traga-perras.webp"
import iconTavernRewards from "../assets/ui/icons-hud/hud-modals/modal-tavern/rewards.webp"
import iconTavernUp from "../assets/ui/icons-hud/hud-modals/icons-tavern/tavern-up.webp"
import iconTavernClientes from "../assets/ui/icons-hud/hud-modals/icons-tavern/clientes.webp"
import iconTabMineros from "../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/mineros.webp"
import iconTabForja from "../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/forja.webp"
import iconRarityLegend from "../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/legend.webp"
import iconRarityEpic from "../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/epic.webp"
import iconRarityRara from "../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/rara.webp"
import iconRarityObtenidos from "../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/obtenidos.webp"
import iconTabGratis from "../assets/ui/icons-hud/hud-modals/modal-invocacion/gratis.webp"
import iconAbrirSobre from "../assets/ui/icons-hud/hud-modals/modal-invocacion/abrir.webp"
import iconGratis2 from "../assets/ui/icons-hud/hud-modals/modal-invocacion/gratis2.webp"
import iconBtnVacio from "../assets/ui/icons-hud/hud-modals/modal-invocacion/vacio.webp"

// ===== LANDING =====
import landingLogo from "../assets/landing-pico-pata/logo.webp"
import landingAyudantes from "../assets/landing-pico-pata/ayudantes.webp"
import landingMinas from "../assets/landing-pico-pata/minas.webp"
import landingPicos from "../assets/landing-pico-pata/picos.webp"
import landingProduccionOro from "../assets/landing-pico-pata/produccion-oro.webp"

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
import iconBronze from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/lingotes/lingote-bronze.webp"
import iconIron from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/lingotes/lingote-iron.webp"
import iconDiamond from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/lingotes/lingote-diamond.webp"

// ===== MENAS HUD =====
import menaBronzeHud from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/menas-hud/bronzeHud.webp"
import menaIronHud from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/menas-hud/ironHud.webp"
import menaDiamondHud from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/menas-hud/diamondHud.webp"

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
import forgeBronze1 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl1/forge-bronze.webp"
import forgeIron1 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl1/forge-iron.webp"
import forgeDiamond1 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl1/forge-diamond.webp"
import forgeBronze2 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl2/forge-bronze2.webp"
import forgeIron2 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl2/forge-iron2.webp"
import forgeDiamond2 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl2/forge-diamond2.webp"
import forgeBronze3 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl3/forge-bronze3.webp"
import forgeIron3 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl3/forge-iron3.webp"
import forgeDiamond3 from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/forges/forge-lvl3/forge-diamond3.webp"

// ===== FORJA — REDISEÑO =====
import forgeCardBronze from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/bg-forge/card-bronze.webp"
import forgeCardIron from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/bg-forge/card-iron.webp"
import forgeCardDiamond from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/bg-forge/card-diamond.webp"
import forgeBg from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/bg-forge/forge-bg.webp"
import forgeIconFundir from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/icons-modal/fundir2.webp"
import forgeIconUpgrade from "../assets/ui/icons-hud/hud-modals/modal-forge/icons-forge/icons-modal/upgrade.webp"
import automineIcon from "../assets/ui/icons-hud/hud-modals/automine.webp"

// ===== RECOMPENSAS ORO — REDISEÑO =====
import rewardsBgGoldMined from "../assets/ui/icons-hud/hud-modals/rewards/rewards-gold/gold-pickaxe.webp"
import rewardsBgGoldSpent from "../assets/ui/icons-hud/hud-modals/rewards/rewards-gold/gold-gastado.webp"
import rewardsBgGoldPerSecond from "../assets/ui/icons-hud/hud-modals/rewards/rewards-gold/gold-second.webp"
import rewardsBgClicks from "../assets/ui/icons-hud/hud-modals/rewards/rewards-gold/taps-total.webp"
import rewardsBgPickaxeTiers from "../assets/ui/icons-hud/hud-modals/rewards/rewards-gold/tier-pico.webp"
import rewardsBgRepairs from "../assets/ui/icons-hud/hud-modals/rewards/rewards-gold/repair-total.webp"
import rewardsIconLock from "../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/lock.webp"
import rewardsIconUnlock from "../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/unlock.webp"
import rewardsIconReclamed from "../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/reclamed.webp"
import rewardsCoinMinaBronze from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/mina-bronze.webp"
import rewardsCoinMinaIron from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/mina-iron.webp"
import rewardsCoinMinaDiamond from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/mina-diamond.webp"
import rewardsCoinFurnaceBronze from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/furnace-bronze.webp"
import rewardsCoinFurnaceIron from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/furnace-iron.webp"
import rewardsCoinFurnaceDiamond from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/furnace-diamond.webp"
import rewardsCoinUpPickaxe from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/up-pickaxe.webp"
import rewardsCoinUpFurnace from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/up-furnace.webp"
import rewardsCoinAutominar from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/autominar.webp"
import rewardsCoinPoderAutominar from "../assets/ui/icons-hud/hud-modals/rewards/rewards-coin/poder-autominar.webp"
import rewardsShardBasic from "../assets/ui/icons-hud/hud-modals/rewards/rewards-shards/basic.webp"
import rewardsShardEpic from "../assets/ui/icons-hud/hud-modals/rewards/rewards-shards/epic.webp"
import rewardsShardLegend from "../assets/ui/icons-hud/hud-modals/rewards/rewards-shards/legend.webp"
import rewardsShardGeneric from "../assets/ui/icons-hud/hud-modals/rewards/rewards-shards/generic.webp"
import rewardsTabGold from "../assets/ui/icons-hud/hud-modals/rewards/btn-gold.webp"
import rewardsTabCoin from "../assets/ui/icons-hud/hud-modals/rewards/btn-coin.webp"
import rewardsTabShards from "../assets/ui/icons-hud/hud-modals/rewards/btn-shards.webp"
import rewardsTabDaily from "../assets/ui/icons-hud/hud-modals/rewards/btn-daily.webp"

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
import forgeDayoIcon from "../assets/ui/icons-pets/forge/forge-dayo.webp"

// ===== ENEMIGOS COMBATE =====
import bat1 from "../assets/ui/icons-enemy/bats/bat-1.webp"
import bat1Select from "../assets/ui/icons-enemy/enemy-animation/bats/bat001.webp"
import bat2 from "../assets/ui/icons-enemy/bats/bat-2.webp"
import bat2Select from "../assets/ui/icons-enemy/enemy-animation/bats/bat002.webp"
import bat3 from "../assets/ui/icons-enemy/bats/bat-3.webp"
import bat3Select from "../assets/ui/icons-enemy/enemy-animation/bats/bat003.webp"
import batBoss from "../assets/ui/icons-enemy/bats/bat-boss.webp"
import batBossSelect from "../assets/ui/icons-enemy/enemy-animation/bats/bat-boss.webp"
import bgCombatBats from "../assets/backgrounds/bg-modal-raids/bg-raids-active/bg-combat-bats.webp"
import topo1 from "../assets/ui/icons-enemy/topos/topo-1.webp"
import topo2 from "../assets/ui/icons-enemy/topos/topo-2.webp"
import topo3 from "../assets/ui/icons-enemy/topos/topo-3.webp"
import topo1Select from "../assets/ui/icons-enemy/enemy-animation/topos/topo001.webp"
import topo2Select from "../assets/ui/icons-enemy/enemy-animation/topos/topo002.webp"
import topo3Select from "../assets/ui/icons-enemy/enemy-animation/topos/topo003.webp"
import topoBoss from "../assets/ui/icons-enemy/topos/topo-boss.webp"
import topoBossSelect from "../assets/ui/icons-enemy/enemy-animation/topos/topo-boss.webp"
import bgCombatTopos from "../assets/backgrounds/bg-modal-raids/bg-raids-active/bg-combat-topos.webp"
import spider1 from "../assets/ui/icons-enemy/spiders/sipder-1.webp"
import spider1Select from "../assets/ui/icons-enemy/enemy-animation/spider/spider001.webp"
import spider2 from "../assets/ui/icons-enemy/spiders/spider-2.webp"
import spider2Select from "../assets/ui/icons-enemy/enemy-animation/spider/spider002.webp"
import spider3 from "../assets/ui/icons-enemy/spiders/spider-3.webp"
import spider3Select from "../assets/ui/icons-enemy/enemy-animation/spider/spider003.webp"
import spiderBoss from "../assets/ui/icons-enemy/spiders/spider-boss.webp"
import spiderBossSelect from "../assets/ui/icons-enemy/enemy-animation/spider/spider-boss.webp"
import scorpion1 from "../assets/ui/icons-enemy/scorpions/scorpion-1.webp"
import scorpion2 from "../assets/ui/icons-enemy/scorpions/scorpion-2.webp"
import scorpion3 from "../assets/ui/icons-enemy/scorpions/scorpion-3.webp"
import scorpionBoss from "../assets/ui/icons-enemy/scorpions/scorpion-boss.webp"
import scorpion1Select from "../assets/ui/icons-enemy/enemy-animation/scorpions/scorpion001.webp"
import scorpion2Select from "../assets/ui/icons-enemy/enemy-animation/scorpions/scorpion002.webp"
import scorpion3Select from "../assets/ui/icons-enemy/enemy-animation/scorpions/scorpion003.webp"
import cardBat from "../assets/ui/icons-enemy/hud/card-bat.webp"
import cardTopo from "../assets/ui/icons-enemy/hud/card-topo.webp"
import cardScorpion from "../assets/ui/icons-enemy/hud/card-scorpion.webp"
import cardSpiders from "../assets/ui/icons-enemy/hud/card-spiders.webp"
import marcoEnemy0 from "../assets/ui/icons-enemy/hud/marcos/marco.webp"
import marcoEnemy1 from "../assets/ui/icons-enemy/hud/marcos/marco-1.webp"
import marcoEnemy2 from "../assets/ui/icons-enemy/hud/marcos/marco-2.webp"
import marcoEnemy3 from "../assets/ui/icons-enemy/hud/marcos/marco-3.webp"
import marcoSlotRare from "../assets/ui/icons-enemy/marco-slot-combat/combat-rare.webp"
import marcoSlotEpic from "../assets/ui/icons-enemy/marco-slot-combat/combat-epic.webp"
import marcoSlotLegend from "../assets/ui/icons-enemy/marco-slot-combat/combat-legend.webp"
import marcoSkinUltimate from "../assets/ui/icons-pets/dog-skins/ui-skins/marco-skin-ultimate.webp"

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

// ===== RAIDS PASIVAS: SPRITES CORRIENDO =====
import ladyRunP1 from "../assets/ui/lady-sprite/sprite-run/lady-run/lady-1.webp"
import ladyRunP2 from "../assets/ui/lady-sprite/sprite-run/lady-run/lady-2.webp"
import ladyRunP3 from "../assets/ui/lady-sprite/sprite-run/lady-run/lady-3.webp"
import ladyRunP4 from "../assets/ui/lady-sprite/sprite-run/lady-run/lady-4.webp"
import ladyWaitP1 from "../assets/ui/lady-sprite/lady-wait/wait-2/lady300.webp"
import ladyWaitP2 from "../assets/ui/lady-sprite/lady-wait/wait-2/lady-sitlady-sit.webp"
import gordoRunP1 from "../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-1.webp"
import gordoRunP2 from "../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-2.webp"
import gordoRunP3 from "../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-3.webp"
import gordoRunP4 from "../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-4.webp"
import munaRunP1 from "../assets/ui/lady-sprite/sprite-run/muna-run/muna-1.webp"
import munaRunP2 from "../assets/ui/lady-sprite/sprite-run/muna-run/muna-2.webp"
import munaRunP3 from "../assets/ui/lady-sprite/sprite-run/muna-run/muna-3.webp"
import munaRunP4 from "../assets/ui/lady-sprite/sprite-run/muna-run/muna-4.webp"
import nupitoRunP1 from "../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-1.webp"
import nupitoRunP2 from "../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-2.webp"
import nupitoRunP3 from "../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-3.webp"
import nupitoRunP4 from "../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-4.webp"
import tukaRunP1 from "../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-1.webp"
import tukaRunP2 from "../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-2.webp"
import tukaRunP3 from "../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-3.webp"
import tukaRunP4 from "../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-4.webp"
import druhRunP1 from "../assets/ui/lady-sprite/sprite-run/druh-run/druh-1.webp"
import druhRunP2 from "../assets/ui/lady-sprite/sprite-run/druh-run/druh-2.webp"
import druhRunP3 from "../assets/ui/lady-sprite/sprite-run/druh-run/druh-3.webp"
import druhRunP4 from "../assets/ui/lady-sprite/sprite-run/druh-run/druh-4.webp"
import tokyoRunP1 from "../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-1.webp"
import tokyoRunP2 from "../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-2.webp"
import tokyoRunP3 from "../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-3.webp"
import tokyoRunP4 from "../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-4.webp"
import smokeRunP1 from "../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-1.webp"
import smokeRunP2 from "../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-2.webp"
import smokeRunP3 from "../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-3.webp"
import smokeRunP4 from "../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-4.webp"
import zeusRunP1 from "../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-1.webp"
import zeusRunP2 from "../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-2.webp"
import zeusRunP3 from "../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-3.webp"
import zeusRunP4 from "../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-4.webp"
import runnerFondo1 from "../assets/ui/icons-hud/hud-modals/game-run/fondo-1.webp"
import runnerFondoRun from "../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-1.webp"
import runnerFondoRun2 from "../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-2.webp"
import runnerFondoRun3 from "../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-3.webp"
import runnerFondoRun4 from "../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-4.webp"
import runnerObstaculo2 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo2.webp"
import runnerObstaculoRata from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo-rata.webp"
import runnerObstaculoTopo1 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo-topo1.webp"
import runnerObstaculo3 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/libre/obstaculo3.webp"
import runnerObstaculo4 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/libre/obstaculo4.webp"
import runnerObstaculo6 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/desierto/obstaculo6.webp"
import runnerObstaculoGato1 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/ciudad/obstaculo-gato1.webp"
import runnerObstaculoArmadillo from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/desierto/obstaculo-armadillo.webp"
import runnerObstaculoAereo from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/ciudad/obstaculo-aereo.webp"
import runnerObstaculoAereo2 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/desierto/obstaculo-aereo2.webp"
import runnerObstaculoAereo3 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/libre/obstaculo-aereo3.webp"
import runnerObstaculoAereoCuevas from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/mina/obstaculo-aereo-cuevas.webp"
import runnerObstaculoAereoCuevas2 from "../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/mina/obstaculo-aereo-cuevas2.webp"
import runnerPowerFuego from "../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-fuego2.webp"
import runnerPowerElectrico from "../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-electrico2.webp"
import runnerPowerAgua from "../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-hielo2.webp"
import runnerPowerTierra from "../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-tierra2.webp"
import runnerPowerOscuro from "../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-oscuro2.webp"
import runnerBatBoss from "../assets/ui/icons-enemy/enemy-animation/bats/bat001.webp"

// ===== SPRITES DE CARRERA (ANIMACIÓN DE COMPRA DE SKINS) =====
import ladySkinRunP1 from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-1.webp"
import ladySkinRunP2 from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-2.webp"
import ladySkinRunP3 from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-3.webp"
import ladySkinRunP4 from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-4.webp"
import ladyGafasRunP from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-gafas-run.webp"
import ladyCascosRunP from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-cascos-run.webp"
import ladyCapuchaRunP from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-capucha-run.webp"
import ladyMineraRunP from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-minero-run.webp"
import ladyPirataRunP from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-pirata-run.webp"
import ladyUltimateRunP from "../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-ultimate-run.webp"
import munaCascosRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-cascos.webp"
import munaMineraRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-minero.webp"
import munaPilotoRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-piloto.webp"
import munaPirataRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-pirata.webp"
import munaReinaRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-rey.webp"
import munaUltimateRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-ultimate.webp"
import gordoSkinRunP1 from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-1.webp"
import gordoSkinRunP2 from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-2.webp"
import gordoSkinRunP3 from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-3.webp"
import gordoSkinRunP4 from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-4.webp"
import gordoCascosRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-cascos.webp"
import gordoGafasRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-gafas.webp"
import gordoMagoRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-mago.webp"
import gordoReyRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-rey.webp"
import gordoSenorRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-señor.webp"
import gordoUltimateRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-ultimate.webp"
import munaSkinRunP1 from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-1.webp"
import munaSkinRunP2 from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-2.webp"
import munaSkinRunP3 from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-3.webp"
import munaSkinRunP4 from "../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-4.webp"
import nupitoSkinRunP1 from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-1.webp"
import nupitoSkinRunP2 from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-2.webp"
import nupitoSkinRunP3 from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-3.webp"
import nupitoSkinRunP4 from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-4.webp"
import nupitoMagoRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-mago.webp"
import nupitoMineroRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-minero.webp"
import nupitoReyRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-rey.webp"
import nupitoSherifRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-sherif.webp"
import nupitoUltimateRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-ultimatef.webp"
import tukaSkinRunP1 from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-1.webp"
import tukaSkinRunP2 from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-2.webp"
import tukaSkinRunP3 from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-3.webp"
import tukaSkinRunP4 from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-4.webp"
import tukaCapuchaRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-capucha.webp"
import tukaCascosRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-cascos.webp"
import tukaChefRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-chef.webp"
import tukaGafasRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-gafas.webp"
import tukaReinaRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-rey.webp"
import tukaUltimateRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-ultimate.webp"
import druhSkinRunP1 from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-1.webp"
import druhSkinRunP2 from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-2.webp"
import druhSkinRunP3 from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-3.webp"
import druhSkinRunP4 from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-4.webp"
import druhUltimateRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-ultimate.webp"
import druhCascosRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-cascos.webp"
import druhMagoRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-mago.webp"
import druhReyRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-rey.webp"
import druhSenorRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-señor.webp"
import tokyoSkinRunP1 from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-1.webp"
import tokyoSkinRunP2 from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-2.webp"
import tokyoSkinRunP3 from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-3.webp"
import tokyoSkinRunP4 from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-4.webp"
import tokioCapuchaRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-capucha.webp"
import tokioCascosRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-cascos.webp"
import tokioGafasRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-gafas.webp"
import tokioMineraRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-minero.webp"
import tokioReinaRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-rey.webp"
import tokioUltimateRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-ultimate.webp"
import zeusSkinRunP1 from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-1.webp"
import zeusSkinRunP2 from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-2.webp"
import zeusSkinRunP3 from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-3.webp"
import zeusSkinRunP4 from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-4.webp"
import zeusChefRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-chef.webp"
import zeusMagoRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-mago.webp"
import zeusMineroRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-minero.webp"
import zeusReyRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-rey.webp"
import zeusSherifRunSkinP from "../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-sherif.webp"

// ===== RAIDS: FONDOS Y TABLÓN =====
import bgRaids from "../assets/backgrounds/bg-modal-raids/bg-raids.webp"
import bgRaidsPassive from "../assets/backgrounds/bg-modal-raids/bg-raids-passive/raids-passive-bg.png"
import btnRaidPassive from "../assets/ui/icons-hud/hud-modals/modal-raids/btn-raid-pasive.webp"
import btnRaidActive from "../assets/ui/icons-hud/hud-modals/modal-raids/btn-raid-active.webp"
import btnTablon from "../assets/ui/icons-hud/hud-modals/modal-raids/tablon/btn-tablon.webp"
import tabMisiones from "../assets/ui/icons-hud/hud-modals/modal-raids/tablon/tab-misiones.webp"
import tabShop from "../assets/ui/icons-hud/hud-modals/modal-raids/tablon/tab-shop.webp"
import tabSkins from "../assets/ui/icons-hud/hud-modals/modal-raids/tablon/btn-skins.webp"
import cardBgForest from "../assets/backgrounds/bg-modal-raids/cards-pasive-raids/bosque-antiguo.webp"
import cardBgCaves from "../assets/backgrounds/bg-modal-raids/cards-pasive-raids/cavernas-oscuras.webp"
import cardBgVolcano from "../assets/backgrounds/bg-modal-raids/cards-pasive-raids/volcan-diamantes.webp"

// ===== MISIONES: TABS =====
import questsTabDaily from "../assets/ui/icons-hud/hud-modals/misiones-diarias/misiones-diarias.webp"
import questsTabPJ from "../assets/ui/icons-hud/hud-modals/misiones-diarias/misiones-pj.webp"

// ===== MODAL PICO: TIERS Y CARDS =====
import pickAxeModalStoneTier0 from "../assets/ui/icons-pickaxe/icons/stone/tier-0-stone.webp"
import pickAxeModalStoneTier2 from "../assets/ui/icons-pickaxe/icons/stone/tier-2-stone.webp"
import pickAxeModalBronzeTier0 from "../assets/ui/icons-pickaxe/icons/bronze/tier-0-bronze.webp"
import pickAxeModalBronzeTier2 from "../assets/ui/icons-pickaxe/icons/bronze/tier-2-bronze.webp"
import pickAxeModalIronTier0 from "../assets/ui/icons-pickaxe/icons/iron/tier-0-iron.webp"
import pickAxeModalIronTier2 from "../assets/ui/icons-pickaxe/icons/iron/tier-2-iron.webp"
import pickAxeModalDiamondTier from "../assets/ui/icons-pickaxe/icons/diamond/diamond-tier.webp"
import pickaxeCardRecarga from "../assets/ui/icons-hud/hud-modals/modal-pickaxe/card-1.webp"
import pickaxeCardPoder from "../assets/ui/icons-hud/hud-modals/modal-pickaxe/card-2.webp"

// ===== MODAL UPGRADE: RENDIMIENTO OFFLINE Y BURST =====
import iconOfflineRate2 from "../assets/ui/icons-hud/hud-modals/off-line2.webp"
import iconStaminaRecharge from "../assets/ui/icons-hud/hud-principal/stamina-2.webp"
import iconBurstPower from "../assets/ui/icons-hud/hud-principal/stamina-3.webp"

const IMAGES = [
    // fondos
    bgTavern, bgTavern1, bgTavern2, bgTavern3, bgTavern4, bgTavern5, bgTavern6, bgTavern7, bgTavern8, bgCoin, bgGold1,
    bgMineBronze, bgMineIron, bgMineDiamond,
    bgInsideBronze, bgInsideIron, bgInsideDiamond,
    bgMain, bgGold, bgStamina, bgPickaxe, bgNupito,
    // hud principal
    cofre, gold1, coinTavern, stamina1, goldOpen, repair, refillStaminaIcon, rayo,
    iconRaids, iconRewards, iconRent, huesinCoin,
    // hud modals
    iconGold, buttonUpgrade, upgradeStamina, PickAxeUp, btnTier, cookie, iconUnlock, iconOffline,
    // icons tavern
    iconTavernComida, iconTavernTrigo, iconTavernLupulo, iconTavernCerveza, iconTavernCraft,
    // sat
    satEnergy, satRepair, satUpgrade,
    // tavern
    cambistaCoin, cambistaMateriales, iconRuleta, iconTragaperras,
    exchangeBgBronze, exchangeBgIron, exchangeBgDiamond,
    iconSelectLeft, iconSelectRight,
    iconTavernRewards, iconTavernUp, iconTavernClientes,
    iconTabMineros, iconTabForja,
    iconRarityLegend, iconRarityEpic, iconRarityRara, iconRarityObtenidos,
    iconTabGratis, iconAbrirSobre, iconGratis2, iconBtnVacio,
    // landing
    landingLogo, landingAyudantes, landingMinas, landingPicos, landingProduccionOro,
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
    // forja — rediseño
    forgeCardBronze, forgeCardIron, forgeCardDiamond, forgeBg,
    forgeIconFundir, forgeIconUpgrade, automineIcon,
    rewardsBgGoldMined, rewardsBgGoldSpent, rewardsBgGoldPerSecond,
    rewardsBgClicks, rewardsBgPickaxeTiers, rewardsBgRepairs,
    rewardsIconLock, rewardsIconUnlock, rewardsIconReclamed,
    rewardsCoinMinaBronze, rewardsCoinMinaIron, rewardsCoinMinaDiamond,
    rewardsCoinFurnaceBronze, rewardsCoinFurnaceIron, rewardsCoinFurnaceDiamond,
    rewardsCoinUpPickaxe, rewardsCoinUpFurnace, rewardsCoinAutominar, rewardsCoinPoderAutominar,
    rewardsShardBasic, rewardsShardEpic, rewardsShardLegend, rewardsShardGeneric,
    rewardsTabGold, rewardsTabCoin, rewardsTabShards, rewardsTabDaily,
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
    forgeIcon6, forgeIcon7, forgeIcon8, forgeIcon9, forgeDayoIcon,
    // enemigos
    bat1, bat2, bat3, batBoss, bgCombatBats, bat1Select, bat2Select, bat3Select, batBossSelect,
    topo1, topo2, topo3, topoBoss, bgCombatTopos, topo1Select, topo2Select, topo3Select, topoBossSelect,
    spider1, spider2, spider3, spiderBoss, spider1Select, spider2Select, spider3Select, spiderBossSelect,
    scorpion1, scorpion2, scorpion3, scorpionBoss, scorpion1Select, scorpion2Select, scorpion3Select,
    cardBat, cardTopo, cardScorpion, cardSpiders,
    marcoEnemy0, marcoEnemy1, marcoEnemy2, marcoEnemy3,
    marcoSlotRare, marcoSlotEpic, marcoSlotLegend, marcoSkinUltimate,
    // skins de perros
    ...Object.values(dogSkinAssets).flatMap(skins => Object.values(skins)),
    // escenas
    menaGold, menaGold2, menaGold3, menaGold4, menaGold5,
    picando1, picando2, mineroDescanso,
    // poderes
    powerFuria, powerFire, powerElectric, powerWater, powerEarth,
    // tutorial
    tutorialPrincipal, tutorialMina, tutorialForja,
    // raids pasivas: sprites corriendo
    ladyRunP1, ladyRunP2, ladyRunP3, ladyRunP4, ladyWaitP1, ladyWaitP2,
    gordoRunP1, gordoRunP2, gordoRunP3, gordoRunP4,
    munaRunP1, munaRunP2, munaRunP3, munaRunP4,
    nupitoRunP1, nupitoRunP2, nupitoRunP3, nupitoRunP4,
    tukaRunP1, tukaRunP2, tukaRunP3, tukaRunP4,
    druhRunP1, druhRunP2, druhRunP3, druhRunP4,
    tokyoRunP1, tokyoRunP2, tokyoRunP3, tokyoRunP4,
    smokeRunP1, smokeRunP2, smokeRunP3, smokeRunP4,
    zeusRunP1, zeusRunP2, zeusRunP3, zeusRunP4,
    runnerFondo1, runnerFondoRun, runnerFondoRun2, runnerFondoRun3, runnerFondoRun4, runnerObstaculo2, runnerObstaculo3, runnerObstaculo4, runnerObstaculo6, runnerObstaculoRata, runnerObstaculoTopo1,
    runnerObstaculoGato1, runnerObstaculoArmadillo,
    runnerObstaculoAereo, runnerObstaculoAereo2, runnerObstaculoAereo3, runnerObstaculoAereoCuevas, runnerObstaculoAereoCuevas2,
    runnerPowerFuego, runnerPowerElectrico, runnerPowerAgua, runnerPowerTierra, runnerPowerOscuro, runnerBatBoss,
    // sprites de carrera (animación de compra de skins)
    ladySkinRunP1, ladySkinRunP2, ladySkinRunP3, ladySkinRunP4, ladyGafasRunP, ladyCascosRunP, ladyCapuchaRunP, ladyMineraRunP, ladyPirataRunP, ladyUltimateRunP,
    munaCascosRunSkinP, munaMineraRunSkinP, munaPilotoRunSkinP, munaPirataRunSkinP, munaReinaRunSkinP, munaUltimateRunSkinP,
    gordoSkinRunP1, gordoSkinRunP2, gordoSkinRunP3, gordoSkinRunP4,
    gordoCascosRunSkinP, gordoGafasRunSkinP, gordoMagoRunSkinP, gordoReyRunSkinP, gordoSenorRunSkinP, gordoUltimateRunSkinP,
    munaSkinRunP1, munaSkinRunP2, munaSkinRunP3, munaSkinRunP4,
    nupitoSkinRunP1, nupitoSkinRunP2, nupitoSkinRunP3, nupitoSkinRunP4,
    nupitoMagoRunSkinP, nupitoMineroRunSkinP, nupitoReyRunSkinP, nupitoSherifRunSkinP, nupitoUltimateRunSkinP,
    tukaSkinRunP1, tukaSkinRunP2, tukaSkinRunP3, tukaSkinRunP4,
    tukaCapuchaRunSkinP, tukaCascosRunSkinP, tukaChefRunSkinP, tukaGafasRunSkinP, tukaReinaRunSkinP, tukaUltimateRunSkinP,
    druhSkinRunP1, druhSkinRunP2, druhSkinRunP3, druhSkinRunP4, druhUltimateRunSkinP,
    druhCascosRunSkinP, druhMagoRunSkinP, druhReyRunSkinP, druhSenorRunSkinP,
    tokyoSkinRunP1, tokyoSkinRunP2, tokyoSkinRunP3, tokyoSkinRunP4, tokioCapuchaRunSkinP,
    tokioCascosRunSkinP, tokioGafasRunSkinP, tokioMineraRunSkinP, tokioReinaRunSkinP, tokioUltimateRunSkinP,
    zeusSkinRunP1, zeusSkinRunP2, zeusSkinRunP3, zeusSkinRunP4,
    zeusChefRunSkinP, zeusMagoRunSkinP, zeusMineroRunSkinP, zeusReyRunSkinP, zeusSherifRunSkinP,
    // raids: fondos y tablón
    bgRaids, bgRaidsPassive, btnRaidPassive, btnRaidActive, btnTablon,
    tabMisiones, tabShop, tabSkins,
    cardBgForest, cardBgCaves, cardBgVolcano,
    // misiones: tabs
    questsTabDaily, questsTabPJ,
    // modal pico: tiers y cards
    pickAxeModalStoneTier0, pickAxeModalStoneTier2,
    pickAxeModalBronzeTier0, pickAxeModalBronzeTier2,
    pickAxeModalIronTier0, pickAxeModalIronTier2,
    pickAxeModalDiamondTier,
    pickaxeCardRecarga, pickaxeCardPoder,
    // modal upgrade: rendimiento offline y burst
    iconOfflineRate2, iconStaminaRecharge, iconBurstPower,
];

export const usePreloader = () => {
    const [loaded, setLoaded] = useState(false);
    const imagesRef = useRef([]);

    useEffect(() => {
        let done = 0;
        const total = IMAGES.length;
        const onImageDone = () => {
            done++;
            if (done === total) {
                sfxReady.then(() => setLoaded(true));
            }
        };
        imagesRef.current = IMAGES.map(src => {
            const img = new Image();
            img.onload = img.onerror = onImageDone;
            img.src = src;
            return img;
        });
    }, []);

    return loaded;
};
