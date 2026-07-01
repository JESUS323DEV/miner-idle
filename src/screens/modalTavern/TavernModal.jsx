import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Coins, Flame, Zap, Droplets, Mountain, Moon } from 'lucide-react';
import RouletteGold from './RouletteGold.jsx';
import TavernDogSlot from './TavernDogSlot.jsx';
import RouletteShards from './RouletteShards.jsx';
import SlotMachine from './SlotMachine.jsx';
import PrizeOverlay from '../../components/PrizeOverlay.jsx';
import '../../styles/modals/Roulette.css';
import { useGameContext } from '../../game/context/GameContext.jsx';
import '../../styles/modals/TavernModal.css';
import '../../styles/modals/ForgeModal.css';
import { TavernConfig } from '../../game/config/TavernConfig';
import { computeTavernClients, computeTavernGold } from '../../game/hooks/useTavernTick.js';
import { DogsConfig } from '../../game/config/DogsConfig';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig';
import { MineCompanionConfig } from '../../game/config/MineCompanionConfig';
import { formatNumber2 } from '../../game/utils/formatters.js';
import { PACK_TYPES } from '../../game/config/GachaConfig';

import tutorialPrincipal from "../../assets/tutorial/mascotas/principal.webp"
import tutorialMina from "../../assets/tutorial/mascotas/mina.webp"
import tutorialForja from "../../assets/tutorial/mascotas/forja.webp"

import iconInvocacion from "../../assets/ui/icons-pets-shards/icon-invocacion.webp"
import iconShardRareGeneric from "../../assets/ui/icons-pets-shards/icon-shard-rare-generic.webp"
import iconShardEpicGeneric from "../../assets/ui/icons-pets-shards/icon-shard-epic-generic.webp"
import iconShardLegendaryGeneric from "../../assets/ui/icons-pets-shards/icon-shard-legendary-generic.webp"

import bgTavern0 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-0.webp"
import bgTavern1 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-1.webp"
import bgTavern2 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-2.webp"
import bgTavern3 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-3.webp"
import bgTavern4 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-4.webp"
import bgTavern5 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-5.webp"
import bgTavern6 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-6.webp"
import bgTavern7 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-7.webp"
import bgTavern8 from "../../assets/backgrounds/bg-tavern/bg-scene-tavern/bg-tavern-8.webp"
import iconTavernTrigo from "../../assets/ui/icons-hud/hud-modals/icons-tavern/trigo.webp"
import iconTavernLupulo from "../../assets/ui/icons-hud/hud-modals/icons-tavern/lupulo.webp"
import iconTavernCerveza from "../../assets/ui/icons-hud/hud-modals/icons-tavern/cerveza.webp"
import iconTavernCraft from "../../assets/ui/icons-hud/hud-modals/icons-tavern/craft.webp"
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.webp"
import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp"
import ingotBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.webp"
import ingotIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.webp"
import ingotDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.webp"

import bgCoin from "../../assets/backgrounds/bg-tavern/bg-coin.webp"

import pickaxeStone from "../../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone.webp"
import menaBronze from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.webp"
import menaIron from "../../assets/ui/icons-menas/menas-iron/mena-iron3.webp"
import menaDiamond from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.webp"

import cambistaCoin from "../../assets/ui/icons-hud/hud-modals/modal-tavern/cambista-coin.webp"
import iconRuleta from "../../assets/ui/icons-hud/hud-modals/modal-tavern/ruleta.png"
import iconTragaperras from "../../assets/ui/icons-hud/hud-modals/modal-tavern/traga-perras.png"
import iconLogo from "../../assets/landing-pico-pata/logo.webp"

import ladyIcon from "../../assets/ui/icons-pets/mineros/lady-icon.webp"
import tokyoIcon from "../../assets/ui/icons-pets/mineros/tokyo-icon.webp"
import tukaIcon from "../../assets/ui/icons-pets/mineros/tuka-icon.webp"
import munaIcon from "../../assets/ui/icons-pets/mineros/muna-icon.webp"
import gordoIcon from "../../assets/ui/icons-pets/mineros/gordo-icon.webp"
import druhIcon from "../../assets/ui/icons-pets/mineros/druh-icon.webp"
import smokeIcon from "../../assets/ui/icons-pets/mineros/smoke-icon.webp"
import nupitoIcon from "../../assets/ui/icons-pets/mineros/nupito-icon.webp"
import zeusIcon from "../../assets/ui/icons-pets/mineros/zeus-icon.webp"
import boxerIcon from "../../assets/ui/icons-pets/mineros/boxer-icon.webp"
import bullyIcon from "../../assets/ui/icons-pets/mineros/bully-icon.webp"
import chihuahuaIcon from "../../assets/ui/icons-pets/mineros/chihuhua-icon.webp"

import forgeIcon1 from "../../assets/ui/icons-pets/forge/forge-icon1.webp"
import forgeIcon2 from "../../assets/ui/icons-pets/forge/forge-icon2.webp"
import forgeIcon3 from "../../assets/ui/icons-pets/forge/forge-icon3.webp"
import forgeIcon4 from "../../assets/ui/icons-pets/forge/forge-icon4.webp"
import forgeIcon5 from "../../assets/ui/icons-pets/forge/forge-icon5.webp"
import forgeIcon6 from "../../assets/ui/icons-pets/forge/forge-icon6.webp"
import forgeIcon7 from "../../assets/ui/icons-pets/forge/forge-icon7.webp"
import forgeIcon8 from "../../assets/ui/icons-pets/forge/forge-icon8.webp"
import forgeIcon9 from "../../assets/ui/icons-pets/forge/forge-icon9.webp"
import staminaIcon from "../../assets/ui/icons-hud/hud-principal/stamina-1.webp"
import forgeBadge from "../../assets/ui/icons-forge/forges/forge-lvl1/forge-bronze.webp"

const ELEMENT_ICON = {
    fuego: { Icon: Flame, color: '#ff6b35' },
    electrico: { Icon: Zap, color: '#FFD700' },
    agua: { Icon: Droplets, color: '#4fc3f7' },
    tierra: { Icon: Mountain, color: '#8b6914' },
    oscuro: { Icon: Moon, color: '#b45cff' },
};

const FORGE_COMBAT_PASSIVE_BY_ELEMENT = {
    fuego: 'Cada golpe calienta al enemigo. Cuantos mas golpes, mas daño. Cuanto mejor el perro, mas aguanta.',
    agua: 'El activo hace mas daño cuanto mas tiempo lleva peleando sin cambiar. Mejora con la rareza.',
    electrico: 'Cada golpe del activo tiene mas probabilidad de impactar dos veces. Mejora con la rareza.',
    tierra: 'Cada golpe debilita la armadura del enemigo de forma permanente. Mejora con la rareza.',
    oscuro: 'El activo hace mas daño mientras el enemigo tiene mucha vida. Mejora con la rareza.',
};

const COMBAT_PASSIVE_BY_ELEMENT = {
    fuego: 'Añade daño fijo extra por cada golpe al enemigo.',
    electrico: 'Cada golpe tiene probabilidad de impactar dos veces.',
    tierra: 'El enemigo recibe un porcentaje extra de daño en cada golpe.',
    agua: 'Multiplica el daño de todos los golpes durante la batalla.',
    oscuro: 'Reduce el cooldown de la habilidad activa del perro central.',
};

const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
    boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
};

const forgeDogAssets = {
    pip: forgeIcon1, koda: forgeIcon2, milo: forgeIcon3,
    rocky: forgeIcon4, bruno: forgeIcon5, max: forgeIcon6,
    rex: forgeIcon7, toby: forgeIcon8, buddy: forgeIcon9,
};

const ingotAssets = {
    bronzeIngot: ingotBronze,
    ironIngot: ingotIron,
    diamondIngot: ingotDiamond,
};


const TavernModal = ({ isOpen, onClose, hasFreePacks = false, hasPendingDogAction = false }) => {
    const {
        gameState,
        setGameState,
        handleConvertMaterial: onConvert,
        handleConvertCoinsToGold: onConvertCoins,
        handleUnlockWithFragments: onUnlockWithFragments,
        handleUpgradeStar: onUpgradeStar,
        handleOpenPack: onOpenPack,
        handleFreePull: onFreePull,
    } = useGameContext();
    const { bronzeIngot, ironIngot, diamondIngot, tavernCoins, dogs = {}, forgeDogs = {}, bartenderHired = false, tavernStock = {} } = gameState;
    const hireBartender = () => {
        const { gold: costGold, coins: costCoins } = TavernConfig.bartenderCost;
        if (gameState.gold < costGold || tavernCoins < costCoins) return;
        setGameState(prev => ({
            ...prev,
            bartenderHired: true,
            gold: prev.gold - costGold,
            tavernCoins: prev.tavernCoins - costCoins,
        }));
    };

    const activeClients = bartenderHired ? computeTavernClients(tavernStock) : 0;
    const stockNeedsAttention = bartenderHired && (
        (tavernStock.cerveza ?? 0) <= 1 ||
        (tavernStock.trigo ?? 0) <= 1 ||
        (tavernStock.lupulo ?? 0) <= 1
    );
    const BG_IMAGES = [bgTavern0, bgTavern1, bgTavern2, bgTavern3, bgTavern4, bgTavern5, bgTavern6, bgTavern7, bgTavern8];
    const tavernBgIndex = !bartenderHired ? 0
        : activeClients <= 0 ? 1
        : activeClients >= 10 ? 8
        : activeClients >= 8  ? 7
        : activeClients >= 6  ? 6
        : activeClients >= 5  ? 5
        : activeClients >= 4  ? 4
        : activeClients >= 3  ? 3
        : activeClients >= 2  ? 2
        : 1;
    const tavernBg = BG_IMAGES[tavernBgIndex];

    const brewLevel = gameState.tavernBrewLevel ?? 0;
    const BREW_DURATION = TavernConfig.brewDurations[brewLevel] ?? 15000;
    const brew = gameState.tavernBrewery ?? { isActive: false, startTime: null, progress: 0 };
    const createdMax = gameState.tavernCreatedMaxStock ?? TavernConfig.createdMaxStock;
    const materialsMax = gameState.tavernProvisionMaxStock ?? TavernConfig.provisionsMaxStock;

    useEffect(() => {
        if (!bartenderHired) return;
        const interval = setInterval(() => {
            setGameState(prev => {
                const b = prev.tavernBrewery ?? { isActive: false, startTime: null, progress: 0 };
                const stock = prev.tavernStock ?? {};
                const cMax = prev.tavernCreatedMaxStock ?? TavernConfig.createdMaxStock;
                const brewLevel = prev.tavernBrewLevel ?? 0;
                const duration = TavernConfig.brewDurations[brewLevel] ?? 15000;
                const brewOutput = TavernConfig.brewOutputs[brewLevel] ?? 1;
                const cerveza = stock.cerveza ?? 0;
                const hasMats = (stock.trigo ?? 0) >= 1 && (stock.lupulo ?? 0) >= 1;
                const cervezaFull = cerveza >= cMax;

                if (b.isActive) {
                    const elapsed = Date.now() - b.startTime;
                    const progress = Math.min(1, elapsed / duration);
                    if (elapsed >= duration) {
                        if (cervezaFull) return { ...prev, tavernBrewery: { ...b, progress: 1 } };
                        const canContinue = hasMats;
                        return {
                            ...prev,
                            tavernStock: {
                                ...stock,
                                cerveza: Math.min(cMax, cerveza + brewOutput),
                                ...(canContinue ? { trigo: stock.trigo - 1, lupulo: stock.lupulo - 1 } : {}),
                            },
                            tavernBrewery: {
                                isActive: canContinue,
                                startTime: canContinue ? Date.now() : null,
                                progress: 0,
                            },
                        };
                    }
                    return { ...prev, tavernBrewery: { ...b, progress } };
                }

                if (hasMats && !cervezaFull) {
                    return {
                        ...prev,
                        tavernStock: { ...stock, trigo: stock.trigo - 1, lupulo: stock.lupulo - 1 },
                        tavernBrewery: { isActive: true, startTime: Date.now(), progress: 0 },
                    };
                }
                return prev;
            });
        }, 500);
        return () => clearInterval(interval);
    }, [bartenderHired]); // eslint-disable-line

    const upgradeBrew = () => {
        const currentLevel = gameState.tavernBrewLevel ?? 0;
        const next = TavernConfig.brewUpgrades.find(u => u.level > currentLevel);
        if (!next || gameState.gold < next.cost || tavernCoins < (next.coins ?? 0)) return;
        setGameState(prev => ({
            ...prev,
            gold: prev.gold - next.cost,
            tavernCoins: prev.tavernCoins - (next.coins ?? 0),
            tavernBrewLevel: next.level,
        }));
    };

    const upgradeStock = () => {
        const current = gameState.tavernProvisionMaxStock ?? TavernConfig.provisionsMaxStock;
        const next = TavernConfig.stockUpgrades.find(u => u.to > current);
        if (!next || gameState.gold < next.cost || tavernCoins < (next.coins ?? 0)) return;
        setGameState(prev => ({
            ...prev,
            gold: prev.gold - next.cost,
            tavernCoins: prev.tavernCoins - (next.coins ?? 0),
            tavernProvisionMaxStock: next.to,
        }));
    };

    const upgradeCreatedStock = () => {
        const current = gameState.tavernCreatedMaxStock ?? TavernConfig.createdMaxStock;
        const next = TavernConfig.createdStockUpgrades.find(u => u.to > current);
        if (!next || gameState.gold < next.gold || gameState.tavernCoins < next.coins) return;
        setGameState(prev => ({
            ...prev,
            gold: prev.gold - next.gold,
            tavernCoins: prev.tavernCoins - next.coins,
            tavernCreatedMaxStock: next.to,
        }));
    };

    const buyProvision = (id, costPerUnit, buyAmount) => {
        const current = tavernStock[id] ?? 0;
        const max = gameState.tavernProvisionMaxStock ?? TavernConfig.provisionsMaxStock;
        if (current >= max) return;
        const total = costPerUnit * buyAmount;
        if (gameState.gold < total) return;
        setGameState(prev => ({
            ...prev,
            gold: prev.gold - total,
            tavernStock: { ...prev.tavernStock, [id]: Math.min(max, current + buyAmount) },
        }));
    };

    const [showDogsIntro, setShowDogsIntro] = useState(false);
    const [showCambistaIntro, setShowCambistaIntro] = useState(false);
    const [cambistaTab, setCambistaTab] = useState('materiales');
    const [showBrewPanel, setShowBrewPanel] = useState(false);
    const [showSobresIntro, setShowSobresIntro] = useState(false);
    const [view, setView] = useState('main');
    const [rouletteTab, setRouletteTab] = useState('gold');
    const [flippedDog, setFlippedDog] = useState(null);
    const [dogTab, setDogTab] = useState('mineros');
    const [rarityFilter, setRarityFilter] = useState(null);
    const [packTab, setPackTab] = useState('mineros');
    const [invocPrizeData, setInvocPrizeData] = useState(null);
    const pendingSfxRef = useRef('rewardShards');

    useEffect(() => {
        if (view === 'ayudantes' && !gameState.tutorial?.dogsIntroDone) setShowDogsIntro(true);
        if (view === 'cambista' && !gameState.tutorial?.cambistaIntroDone) setShowCambistaIntro(true);
        if (view === 'sobres' && !gameState.tutorial?.sobreIntroDone) setShowSobresIntro(true);
    }, [view]); // eslint-disable-line

    useEffect(() => {
        const r = gameState.lastPackResult;
        if (!r) return;
        const dogIcon = r.isForge ? forgeDogAssets[r.dogId] : dogAssets[r.dogId];
        const dogName = r.isForge ? ForgeDogsConfig[r.dogId]?.name : DogsConfig[r.dogId]?.name;
        const rarityLabel = { rare: 'Raro', epic: 'Epico', legendary: 'Legendario' }[r.rarity] ?? r.rarity;
        setInvocPrizeData({
            icon: dogIcon,
            label: dogName,
            sublabel: `${rarityLabel} · +${r.fragments} fragmentos`,
            isWin: true,
            sfx: pendingSfxRef.current,
        });
    }, [gameState.lastPackResult]);

    if (!isOpen) return null;

    const currentMaterials = { bronzeIngot, ironIngot, diamondIngot };

    const STAR_GOLD_BASE = { rare: 5000, epic: 10000, legendary: 15000 };
    const STAR_COIN_BASE = { rare: 1, epic: 2, legendary: 3 };
    const getStarGoldCost = (rarity, stars) => (STAR_GOLD_BASE[rarity] ?? 0) + stars * 5000;
    const getStarCoinCost = (rarity, stars) => (STAR_COIN_BASE[rarity] ?? 0) + stars;
    const FREE_PULL_COOLDOWNS = { basic: 5 * 3600000, epic: 10 * 3600000, legendary: 24 * 3600000 };
    const _dogHasAction = (dogsState, config) => Object.values(dogsState).some(dog => {
        if (!dog || typeof dog !== 'object') return false;
        const cfg = config[dog.id];
        if (!cfg) return false;
        const frags = dog.fragments ?? 0;
        const stars = dog.stars ?? 0;
        const { gold: goldCost = 0, tavernCoins: coinCost = 0 } = cfg.unlockCost ?? {};
        const canUnlock = !dog.hired && frags >= cfg.unlockFragments && gameState.gold >= goldCost && tavernCoins >= coinCost;
        const canUpgrade = dog.hired && stars < 5 && frags >= (cfg.starFragments?.[stars] ?? Infinity)
            && tavernCoins >= getStarCoinCost(cfg.rarity, stars)
            && gameState.gold >= getStarGoldCost(cfg.rarity, stars);
        return canUnlock || canUpgrade;
    });
    const minerHasAction = _dogHasAction(dogs, DogsConfig);
    const forgeHasAction = _dogHasAction(forgeDogs, ForgeDogsConfig);
    const minerHasFree = ['basic', 'epic', 'legendary'].some(p => Date.now() - (gameState.lastFreePull?.[`miner_${p}`] ?? 0) >= FREE_PULL_COOLDOWNS[p]);
    const forgeHasFree = ['basic', 'epic', 'legendary'].some(p => Date.now() - (gameState.lastFreePull?.[`forge_${p}`] ?? 0) >= FREE_PULL_COOLDOWNS[p]);
    const todayMidnight = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const rouletteHasFree = !gameState.lastFreeSpinGold || gameState.lastFreeSpinGold < todayMidnight()
        || !gameState.lastFreeSpinShards || gameState.lastFreeSpinShards < todayMidnight();

    const currentDogsData = dogTab === 'mineros' ? dogs : forgeDogs;
    const currentDogsConfig = dogTab === 'mineros' ? DogsConfig : ForgeDogsConfig;
    const rarityHasAction = {};
    Object.values(currentDogsData).forEach(dog => {
        if (!dog || typeof dog !== 'object' || Array.isArray(dog)) return;
        const config = currentDogsConfig[dog.id];
        if (!config) return;
        const { gold: goldCost = 0, tavernCoins: coinCost = 0 } = config.unlockCost ?? {};
        const frags = dog.fragments ?? 0;
        const stars = dog.stars ?? 0;
        const fragForNext = dog.hired && stars < 5 ? config.starFragments?.[stars] : null;
        const canUnlock = !dog.hired && frags >= config.unlockFragments && gameState.gold >= goldCost && tavernCoins >= coinCost;
        const canUpgrade = fragForNext !== null && frags >= fragForNext
            && tavernCoins >= getStarCoinCost(config.rarity, stars)
            && gameState.gold >= getStarGoldCost(config.rarity, stars);
        if (canUnlock || canUpgrade) rarityHasAction[config.rarity] = true;
    });
    const _checkHiredUpgradeable = (dogsState, config) => Object.values(dogsState).some(dog => {
        if (!dog?.hired) return false;
        const cfg = config[dog.id];
        if (!cfg) return false;
        const stars = dog.stars ?? 0;
        const fragForNext = stars < 5 ? cfg.starFragments?.[stars] : null;
        return fragForNext !== null && (dog.fragments ?? 0) >= fragForNext
            && tavernCoins >= getStarCoinCost(cfg.rarity, stars)
            && gameState.gold >= getStarGoldCost(cfg.rarity, stars);
    });
    const obtenidosHasUpgrade = dogTab === 'mineros'
        ? _checkHiredUpgradeable(dogs, DogsConfig)
        : _checkHiredUpgradeable(forgeDogs, ForgeDogsConfig);

    return (
        <div className="tavern-overlay" onClick={onClose} style={{ backgroundImage: `url(${tavernBg})`, overflowY: view === 'main' ? 'hidden' : 'auto' }}>
            {view !== 'main' && (
                <button className="tavern-back-btn-fixed" onClick={(e) => { e.stopPropagation(); setView('main'); if (view === 'sobres') setInvocPrizeData(null); }}>
                    <ArrowLeft size={16} /> Volver
                </button>
            )}
            {bartenderHired && view === 'main' && (
                <div className="tavern-stock-hud" onClick={e => e.stopPropagation()}>


                    {[
                        { key: 'trigo',   icon: iconTavernTrigo,   label: 'trigo'   },
                        { key: 'lupulo',  icon: iconTavernLupulo,  label: 'lupulo'  },
                        { key: 'cerveza', icon: iconTavernCerveza, label: 'cerveza' },
                    ].map(({ key, icon, label }) => {
                        const qty = tavernStock[key] ?? 0;
                        const max = key === 'cerveza' ? createdMax : materialsMax;
                        return (
                            <div key={key} className={`tavern-stock-item${qty <= 1 ? ' tavern-stock-zero' : ''}`}>
                                <img src={icon} className="tavern-stock-icon" alt={label} />
                                <span>{qty}/{max}</span>
                            </div>
                        );
                    })}
                    {activeClients > 0 && (
                        <div className="tavern-stock-item tavern-clients-badge">
                            <span>{activeClients} cli · +{formatNumber2(computeTavernGold(activeClients))}g</span>
                        </div>
                    )}
                </div>
            )}
            <div className="tavern-content" onClick={(e) => e.stopPropagation()}>
                {view === 'main' && <button className="tavern-close" onClick={onClose}><X /></button>}

                {/* MAIN — escena interactiva */}
                {view === 'main' && (() => {
                    const ZONES = [
                        { id: 'cambista', icon: cambistaCoin, notify: stockNeedsAttention },
                        { id: 'ayudantes', icon: iconLogo, notify: hasPendingDogAction },
                        { id: 'sobres', icon: iconInvocacion, notify: hasFreePacks },
                        { id: 'ruleta', icon: iconRuleta, notify: rouletteHasFree },
                        { id: 'tragaperras', icon: iconTragaperras, notify: !gameState.slotWelcomeDone },
                    ];
                    return (
                        <div className="tavern-scene">
                            {!bartenderHired && (() => {
                                const { gold: costGold, coins: costCoins } = TavernConfig.bartenderCost;
                                const canHire = gameState.gold >= costGold && tavernCoins >= costCoins;
                                return (
                                    <button className={`tavern-bartender-btn${!canHire ? ' locked' : ''}`} onClick={hireBartender} disabled={!canHire}>
                                        <span>Contratar cantinero</span>
                                        <span className="bartender-cost">
                                            {costGold / 1000}k <img src={iconGold} className="conv-small-icon" />
                                            {' '}{costCoins} <img src={coinTavern} className="conv-small-icon" />
                                        </span>
                                    </button>
                                );
                            })()}

                            {bartenderHired && (
                                <div className="tavern-left-controls">
                                <div className="tavern-brew-anchor">
                                    <button
                                        className="tavern-brew-btn"
                                        onClick={(e) => { e.stopPropagation(); setShowBrewPanel(p => !p); }}
                                    >
                                        {showBrewPanel
                                            ? <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={28} color="white" /></div>
                                            : <img src={iconTavernCraft} alt="craft" className="tavern-brew-btn-icon" />
                                        }
                                    </button>
                                    {showBrewPanel && (
                                        <div className="tavern-brew-panel" onClick={e => e.stopPropagation()}>
                                            <div className="brew-slots">
                                                <div className="brew-slot">
                                                    <span className="brew-slot-label">Cebada</span>
                                                    <span className="brew-slot-qty">{tavernStock.trigo ?? 0}</span>
                                                </div>
                                                <span className="brew-plus">+</span>
                                                <div className="brew-slot">
                                                    <span className="brew-slot-label">Lupulo</span>
                                                    <span className="brew-slot-qty">{tavernStock.lupulo ?? 0}</span>
                                                </div>
                                                <span className="brew-plus">=</span>
                                                <div className="brew-slot brew-slot-result">
                                                    <span className="brew-slot-label">Cerveza</span>
                                                    <span className="brew-slot-qty">{tavernStock.cerveza ?? 0}</span>
                                                </div>
                                            </div>
                                            <div className="brew-progress-bar">
                                                <div className="brew-progress-fill" style={{ width: `${(brew.progress ?? 0) * 100}%` }} />
                                            </div>
                                            <span className="brew-status-label">
                                                {brew.isActive ? 'Elaborando...' : ((tavernStock.trigo ?? 0) < 1 || (tavernStock.lupulo ?? 0) < 1) ? 'Sin materiales' : 'Esperando...'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <TavernDogSlot gameState={gameState} setGameState={setGameState} />
                                </div>
                            )}
                            <div className="tavern-bottom-bar">
                                {ZONES.map(z => (
                                    <button
                                        key={z.id}
                                        className={`tavern-zone-btn${z.notify ? ' tavern-zone-notify' : ''}`}
                                        onClick={() => setView(z.id)}
                                    >
                                        <img src={z.icon} alt={z.id} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* CAMBISTA LINGOTES → MONEDAS */}
                {view === 'cambista' && (
                    <div className='tavern-cambista' style={{ backgroundImage: `url(${bgCoin})` }}>
                        <h2 className="tavern-title">Comerciante</h2>

                        {showCambistaIntro && (
                            <div className="forge-intro-overlay">
                                <h3 className="forge-intro-title">El Cambista</h3>
                                <p className="forge-intro-text">
                                    Convierte tus lingotes en monedas de taberna. Las monedas son la moneda premium del juego: las necesitas para contratar mascotas, subir estrellas y abrir sobres de invocación. Cuantos más lingotes fundas en la forja, más monedas podrás obtener aquí.
                                </p>
                                <button className="forge-intro-btn" onClick={() => {
                                    setShowCambistaIntro(false);
                                    setGameState(prev => ({ ...prev, tutorial: { ...prev.tutorial, cambistaIntroDone: true } }));
                                }}>Entendido</button>
                            </div>
                        )}
                        <div className="dog-tabs">
                            <button className={`dog-tab-btn ${cambistaTab === 'materiales' ? 'active' : ''}`} onClick={() => setCambistaTab('materiales')}>Materiales</button>
                            {bartenderHired && (
                                <button className={`dog-tab-btn ${cambistaTab === 'taberna' ? 'active' : ''}${stockNeedsAttention ? ' tavern-zone-notify' : ''}`} onClick={() => setCambistaTab('taberna')}>
                                    Taberna
                                </button>
                            )}
                        </div>

                        {cambistaTab === 'materiales' && (
                            <>
                                <p className="tavern-subtitle">Convierte materiales en monedas de taberna</p>
                                <div className="tavern-conversions">
                                    {TavernConfig.conversions.map(conv => {
                                        const stock = currentMaterials[conv.material] ?? 0;
                                        const hasEnough = stock >= conv.amount;
                                        return (
                                            <div key={conv.material} className={`tavern-conv-card ${!hasEnough ? 'conv-locked' : ''}`}>
                                                <div className="conv-left">
                                                    <img src={ingotAssets[conv.material]} className="conv-icon" />
                                                    <div className="conv-details">
                                                        <span className="conv-ratio">{conv.amount} → {conv.coins} <img src={coinTavern} className="conv-small-icon" /></span>
                                                        <span className={`conv-stock ${hasEnough ? 'conv-stock-ok' : 'conv-stock-low'}`}>Tienes: {formatNumber2(stock)}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => onConvert(conv.material)} disabled={!hasEnough} className="conv-btn">→</button>
                                            </div>
                                        );
                                    })}
                                    <div className={`tavern-conv-card ${tavernCoins < 1 ? 'conv-locked' : ''}`}>
                                        <div className="conv-left">
                                            <img src={coinTavern} className="conv-icon" />
                                            <div className="conv-details">
                                                <span className="conv-ratio">1 <img src={coinTavern} className="conv-small-icon" /> → {formatNumber2(TavernConfig.coinToGold)} <img src={iconGold} className="conv-small-icon" /></span>
                                                <span className={`conv-stock ${tavernCoins >= 1 ? 'conv-stock-ok' : 'conv-stock-low'}`}>Tienes: {tavernCoins}</span>
                                            </div>
                                        </div>
                                        <button onClick={onConvertCoins} disabled={tavernCoins < 1} className="conv-btn">→</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {cambistaTab === 'taberna' && (() => {
                            const provIcons = { trigo: iconTavernTrigo, lupulo: iconTavernLupulo, cerveza: iconTavernCerveza };
                            const nextUpgrade = TavernConfig.stockUpgrades.find(u => u.to > materialsMax);
                            const canUpgrade = nextUpgrade && gameState.gold >= nextUpgrade.cost && tavernCoins >= (nextUpgrade.coins ?? 0);
                            return (
                                <div className="tavern-conversions">
                                    <span className="tavern-section-label">Provisiones</span>
                                    {TavernConfig.provisions.map(prov => {
                                        const current = tavernStock[prov.id] ?? 0;
                                        const total = prov.costPerUnit * prov.buyAmount;
                                        const maxForProv = materialsMax;
                                        const isFull = current >= maxForProv;
                                        const canBuy = !isFull && gameState.gold >= total;
                                        return (
                                            <div key={prov.id} className={`tavern-conv-card ${!canBuy ? 'conv-locked' : ''}`}>
                                                <div className="conv-left">
                                                    <img src={provIcons[prov.id]} className="conv-icon" />
                                                    <div className="conv-details">
                                                        <span className="conv-ratio">{prov.label} · {current}/{maxForProv}</span>
                                                        <span className={`conv-stock ${canBuy ? 'conv-stock-ok' : 'conv-stock-low'}`}>
                                                            {formatNumber2(total)} <img src={iconGold} className="conv-small-icon" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <button onClick={() => buyProvision(prov.id, prov.costPerUnit, prov.buyAmount)} disabled={!canBuy} className="conv-btn">
                                                    {isFull ? 'MAX' : `+${prov.buyAmount}`}
                                                </button>
                                            </div>
                                        );
                                    })}
                                    <span className="tavern-section-label">Mejoras</span>
                                    <div className={`tavern-conv-card tavern-stock-upgrade-card ${!canUpgrade ? 'conv-locked' : ''}`}>
                                        <div className="conv-left">
                                            <div className="conv-details">
                                                <span className="conv-ratio">Almacén {materialsMax} → {nextUpgrade ? nextUpgrade.to : materialsMax}</span>
                                                {nextUpgrade ? (
                                                    <span className={`conv-stock ${canUpgrade ? 'conv-stock-ok' : 'conv-stock-low'}`}>
                                                        {formatNumber2(nextUpgrade.cost)} <img src={iconGold} className="conv-small-icon" />
                                                        {nextUpgrade.coins > 0 && <> {nextUpgrade.coins} <img src={coinTavern} className="conv-small-icon" /></>}
                                                    </span>
                                                ) : (
                                                    <span className="conv-stock conv-stock-ok">Capacidad maxima</span>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={upgradeStock} disabled={!canUpgrade} className="conv-btn">
                                            {nextUpgrade ? 'Mejorar' : 'MAX'}
                                        </button>
                                    </div>
                                    {(() => {
                                        const nextCreated = TavernConfig.createdStockUpgrades.find(u => u.to > createdMax);
                                        const canUpgradeCreated = nextCreated && gameState.gold >= nextCreated.gold && gameState.tavernCoins >= nextCreated.coins;
                                        return (
                                            <div className={`tavern-conv-card tavern-stock-upgrade-card ${!canUpgradeCreated ? 'conv-locked' : ''}`}>
                                                <div className="conv-left">
                                                    <div className="conv-details">
                                                        <span className="conv-ratio">Almacén cerveza {createdMax} → {nextCreated ? nextCreated.to : createdMax}</span>
                                                        {nextCreated ? (
                                                            <span className={`conv-stock ${canUpgradeCreated ? 'conv-stock-ok' : 'conv-stock-low'}`}>
                                                                {formatNumber2(nextCreated.gold)} <img src={iconGold} className="conv-small-icon" />
                                                                {' '}{nextCreated.coins} <img src={coinTavern} className="conv-small-icon" />
                                                            </span>
                                                        ) : (
                                                            <span className="conv-stock conv-stock-ok">Capacidad maxima</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button onClick={upgradeCreatedStock} disabled={!canUpgradeCreated} className="conv-btn">
                                                    {nextCreated ? 'Mejorar' : 'MAX'}
                                                </button>
                                            </div>
                                        );
                                    })()}
                                    {(() => {
                                        const nextBrew = TavernConfig.brewUpgrades.find(u => u.level > brewLevel);
                                        const canUpgradeBrew = nextBrew && gameState.gold >= nextBrew.cost && tavernCoins >= (nextBrew.coins ?? 0);
                                        const currentSecs = BREW_DURATION / 1000;
                                        const nextSecs = nextBrew ? nextBrew.duration / 1000 : null;
                                        return (
                                            <div className={`tavern-conv-card ${!canUpgradeBrew ? 'conv-locked' : ''}`}>
                                                <div className="conv-left">
                                                    <div className="conv-details">
                                                        <span className="conv-ratio">Crafteo {currentSecs}s → {nextSecs ? `${nextSecs}s` : 'MAX'}</span>
                                                        {nextBrew ? (
                                                            <span className={`conv-stock ${canUpgradeBrew ? 'conv-stock-ok' : 'conv-stock-low'}`}>
                                                                {formatNumber2(nextBrew.cost)} <img src={iconGold} className="conv-small-icon" />
                                                                {nextBrew.coins > 0 && <> {nextBrew.coins} <img src={coinTavern} className="conv-small-icon" /></>}
                                                            </span>
                                                        ) : (
                                                            <span className="conv-stock conv-stock-ok">Velocidad maxima</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button onClick={upgradeBrew} disabled={!canUpgradeBrew} className="conv-btn">
                                                    {nextBrew ? 'Mejorar' : 'MAX'}
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        })()}
                    </div>
                )}



                {/*======================== AYUDANTES ==================================*/}

                {view === 'ayudantes' && (
                    <div className='tavern-cambista' style={{ backgroundImage: `url(${bgCoin})` }}>
                        <h2 className="tavern-title"> Ayudantes</h2>

                        {showDogsIntro && (
                            <div className="forge-intro-overlay">
                                <h3 className="forge-intro-title">Tus mascotas</h3>
                                <p className="forge-intro-text">
                                    Las mascotas te ayudan en distintas partes del juego. Desbloquéalas aquí y asígnalas donde más las necesites.
                                </p>
                                <div className="dogs-intro-rows">
                                    <div className="dogs-intro-row">
                                        <img src={tutorialPrincipal} className="dogs-intro-img" alt="pantalla principal" />
                                        <span className="dogs-intro-row-text">En la pantalla principal potencian cada golpe en la mina de oro.</span>
                                    </div>
                                    <div className="dogs-intro-row">
                                        <img src={tutorialMina} className="dogs-intro-img" alt="minas" />
                                        <span className="dogs-intro-row-text">En los yacimientos minan materiales de forma automática.</span>
                                    </div>
                                    <div className="dogs-intro-row">
                                        <img src={tutorialForja} className="dogs-intro-img" alt="forja" />
                                        <span className="dogs-intro-row-text">En la forja aceleran la fundición de lingotes.</span>
                                    </div>
                                </div>
                                <button
                                    className="forge-intro-btn"
                                    onClick={() => {
                                        setShowDogsIntro(false);
                                        setGameState(prev => ({
                                            ...prev,
                                            tutorial: { ...prev.tutorial, dogsIntroDone: true }
                                        }));
                                    }}
                                >
                                    Entendido
                                </button>
                            </div>
                        )}

                        {/* PESTAÑAS */}
                        <div className="dog-tabs">
                            <button
                                className={`dog-tab-btn ${dogTab === 'mineros' ? 'active' : ''} ${minerHasAction && dogTab !== 'mineros' ? 'tavern-zone-notify' : ''}`}
                                onClick={() => { setDogTab('mineros'); setRarityFilter(null); }}
                            >
                                Mineros
                            </button>
                            <button
                                className={`dog-tab-btn ${dogTab === 'forja' ? 'active' : ''} ${forgeHasAction && dogTab !== 'forja' ? 'tavern-zone-notify' : ''}`}
                                onClick={() => { setDogTab('forja'); setRarityFilter(null); }}
                            >
                                Forja
                            </button>
                        </div>

                        {/* FILTRO RAREZA */}
                        <div className="rarity-filter-bar">
                            {['legendary', 'epic', 'rare', 'obtenidos'].map(r => {
                                const hasPulse = r === 'obtenidos'
                                    ? obtenidosHasUpgrade && rarityFilter !== 'obtenidos'
                                    : rarityHasAction[r] && rarityFilter !== r;
                                return (
                                    <button
                                        key={r}
                                        className={`rarity-filter-btn${r !== 'obtenidos' ? ` rarity-filter-${r}` : ''}${rarityFilter === r ? ' rarity-filter-active' : ''}${hasPulse ? ' rarity-filter-pulse' : ''}`}
                                        onClick={() => setRarityFilter(rarityFilter === r ? null : r)}
                                    >
                                        {r === 'legendary' ? 'Legendaria' : r === 'epic' ? 'Épica' : r === 'rare' ? 'Rara' : 'Obtenidos'}
                                    </button>
                                );
                            })}
                        </div>

                        {/* MINEROS */}
                        {dogTab === 'mineros' && (
                            <div className="dogs-grid">
                                {Object.values(dogs)
                                    .filter(d => d && typeof d === 'object' && !Array.isArray(d))
                                    .filter(d => !rarityFilter || (rarityFilter === 'obtenidos' ? d.hired : DogsConfig[d.id]?.rarity === rarityFilter))
                                    .sort((a, b) => {
                                        const ca = DogsConfig[a.id];
                                        const cb = DogsConfig[b.id];
                                        const isGiftA = ca?.unlockCost?.gold === 0 && ca?.unlockCost?.tavernCoins === 0 ? 1 : 0;
                                        const isGiftB = cb?.unlockCost?.gold === 0 && cb?.unlockCost?.tavernCoins === 0 ? 1 : 0;
                                        if (isGiftA !== isGiftB) return isGiftA - isGiftB;
                                        const rarityOrder = { legendary: 0, epic: 1, rare: 2 };
                                        const rd = (rarityOrder[ca?.rarity] ?? 3) - (rarityOrder[cb?.rarity] ?? 3);
                                        if (rd !== 0) return rd;
                                        return (ca?.order ?? 99) - (cb?.order ?? 99);
                                    })
                                    .map(dog => {
                                        const config = DogsConfig[dog.id];
                                        const { gold: goldCost = 0, tavernCoins: coinCost = 0 } = config.unlockCost ?? {};
                                        const canUnlock = (dog.fragments ?? 0) >= config.unlockFragments
                                            && gameState.gold >= goldCost
                                            && tavernCoins >= coinCost;
                                        const stars = dog.stars ?? 0;
                                        const fragForNext = dog.hired && stars < 5 ? config.starFragments[stars] : null;
                                        const starCoinCost = getStarCoinCost(config.rarity, stars);
                                        const starGoldCost = getStarGoldCost(config.rarity, stars);
                                        const canUpgrade = fragForNext !== null && (dog.fragments ?? 0) >= fragForNext && tavernCoins >= starCoinCost && gameState.gold >= starGoldCost;
                                        const isFlipped = flippedDog === dog.id;
                                        return (
                                            <div key={dog.id} className={`dog-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                                <div className={`dog-card dog-card-front dog-rarity-${config.rarity} ${dog.hired ? 'dog-hired' : ''} ${!canUnlock && !dog.hired ? 'dog-cant-afford' : ''}`}>
                                                    <button className="dog-info-btn" onClick={() => setFlippedDog(dog.id)}>ℹ</button>
                                                    <span className={`dog-rarity-badge dog-rarity-${config.rarity}`}>{config.rarity}</span>
                                                    {config.element && ELEMENT_ICON[config.element] && (() => {
                                                        const { Icon, color } = ELEMENT_ICON[config.element];
                                                        return <span className="dog-element-icon"><Icon size={15} color={color} /></span>;
                                                    })()}
                                                    <img src={dogAssets[dog.id]} className="dog-portrait" alt={config.name} />
                                                    <div className="dog-name">{config.name}</div>
                                                    <div className="dog-stars-row">
                                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className={`dog-star ${stars >= s ? 'dog-star-active' : ''}`}>★</span>)}
                                                    </div>
                                                    {dog.hired ? (
                                                        stars < 5 ? (
                                                            <>
                                                                <div className="dog-frag-row">🧩 {dog.fragments ?? 0} / {fragForNext}</div>
                                                                <div className="dog-unlock-cost">
                                                                    <span className={tavernCoins < starCoinCost ? 'cost-missing' : 'cost-ok'}>
                                                                        <img src={coinTavern} alt="coins" className="cost-icon" />{starCoinCost}
                                                                    </span>
                                                                    <span className={gameState.gold < starGoldCost ? 'cost-missing' : 'cost-ok'}>
                                                                        <img src={iconGold} alt="gold" className="cost-icon" />{`${starGoldCost / 1000}k`}
                                                                    </span>
                                                                </div>
                                                                <button className={`dog-hire-btn ${!canUpgrade ? 'locked' : ''}`} onClick={() => onUpgradeStar(dog.id)} disabled={!canUpgrade}>⬆ Mejorar</button>
                                                            </>
                                                        ) : <div className="dog-status">MAX ⭐</div>
                                                    ) : (
                                                        <>
                                                            <div className="dog-frag-row">🧩 {dog.fragments ?? 0} / {config.unlockFragments}</div>
                                                            <div className="dog-unlock-cost">
                                                                <span className={gameState.gold < goldCost ? 'cost-missing' : 'cost-ok'}>
                                                                    <img src={iconGold} alt="oro" className="cost-icon" />{goldCost >= 1000000 ? (goldCost / 1000000).toFixed(1) + 'M' : goldCost >= 1000 ? (goldCost / 1000).toFixed(0) + 'k' : goldCost}
                                                                </span>
                                                                <span className={tavernCoins < coinCost ? 'cost-missing' : 'cost-ok'}>
                                                                    <img src={coinTavern} alt="coins" className="cost-icon" />{coinCost}
                                                                </span>
                                                            </div>
                                                            <button className={`dog-hire-btn ${!canUnlock ? 'locked' : ''}`} onClick={() => onUnlockWithFragments(dog.id)} disabled={!canUnlock}>Desbloquear</button>
                                                        </>
                                                    )}
                                                </div>
                                                <div className={`dog-card dog-card-back dog-card-back-${dog.id}`}>
                                                    <button className="dog-info-btn" onClick={() => setFlippedDog(null)}>✖</button>
                                                    <div className="dog-name">{config.name}</div>

                                                    <div className="dog-stat-section">
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={pickaxeStone} className="dog-stat-icon" /> Poder minado</span>
                                                            <span className="dog-stat-val">{config.miningPower}</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label">⚡ Velocidad</span>
                                                            <span className="dog-stat-val">{(() => { const pps = 1 / config.miningSpeed; return pps >= 1 ? `${parseFloat(pps.toFixed(2))} pic/s` : `1 pic/${config.miningSpeed}s`; })()}</span>
                                                        </div>
                                                    </div>

                                                    <div className="dog-stat-divider">Bonus bioma</div>
                                                    <div className="dog-stat-section">
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={menaBronze} className="dog-stat-icon-lg" /> Bronce</span>
                                                            <span className={`dog-stat-val ${(Array.isArray(config.biomeBonus.bronze) ? config.biomeBonus.bronze[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.bronze) > 1 ? 'dog-stat-bonus' : ''}`}>x{Array.isArray(config.biomeBonus.bronze) ? config.biomeBonus.bronze[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.bronze}</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={menaIron} className="dog-stat-icon-lg" /> Hierro</span>
                                                            <span className={`dog-stat-val ${(Array.isArray(config.biomeBonus.iron) ? config.biomeBonus.iron[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.iron) > 1 ? 'dog-stat-bonus' : ''}`}>x{Array.isArray(config.biomeBonus.iron) ? config.biomeBonus.iron[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.iron}</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={menaDiamond} className="dog-stat-icon-lg" /> Diamante</span>
                                                            <span className={`dog-stat-val ${(Array.isArray(config.biomeBonus.diamond) ? config.biomeBonus.diamond[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.diamond) > 1 ? 'dog-stat-bonus' : ''}`}>x{Array.isArray(config.biomeBonus.diamond) ? config.biomeBonus.diamond[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.diamond}</span>
                                                        </div>
                                                    </div>

                                                    <div className="dog-stat-divider">Pasiva oro</div>
                                                    <div className="dog-stat-passive">
                                                        {config.goldMineBonus.type === 'extraGold' && <><b>+{config.goldMineBonus.value}</b> de <img src={iconGold} className="dog-stat-icon" /> extra por picada</>}
                                                        {config.goldMineBonus.type === 'freeHit' && <><b>{config.goldMineBonus.chance * 100}%</b> de prob. de reducir la recarga de <img src={staminaIcon} className="dog-stat-icon" /> picando</>}
                                                        {config.goldMineBonus.type === 'doubleHit' && <><b>{config.goldMineBonus.chance * 100}%</b> de prob. de doblar <img src={iconGold} className="dog-stat-icon" /> minado</>}
                                                        {config.goldMineBonus.type === 'saveDurability' && <><b>{config.goldMineBonus.chance * 100}%</b> de prob. de no gastar durabilidad al picar</>}
                                                    </div>
                                                    {MineCompanionConfig[dog.id]?.ult && config.element && ELEMENT_ICON[config.element] && (() => {
                                                        const { Icon, color } = ELEMENT_ICON[config.element];
                                                        return (
                                                            <>
                                                                <div className="dog-stat-divider">Activa</div>
                                                                <div className="dog-stat-activa">
                                                                    <span className="dog-activa-icon"><Icon size={13} color={color} /></span>
                                                                    {MineCompanionConfig[dog.id].ult.name}
                                                                </div>
                                                                <div className="dog-stat-divider">Combate</div>
                                                                <div className="dog-stat-passive"><b>Pasiva:</b> {COMBAT_PASSIVE_BY_ELEMENT[config.element]}</div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}

                        {/* OBTENIDOS — bloque eliminado, ahora es filtro de rareza */}
                        {false && (() => { // eslint-disable-line no-constant-binary-expression
                            const sortByRarity = (a, b) => {
                                const rarityOrder = { legendary: 0, epic: 1, rare: 2 };
                                const ca = DogsConfig[a.id] ?? ForgeDogsConfig[a.id];
                                const cb = DogsConfig[b.id] ?? ForgeDogsConfig[b.id];
                                const rd = (rarityOrder[ca?.rarity] ?? 3) - (rarityOrder[cb?.rarity] ?? 3);
                                if (rd !== 0) return rd;
                                return (ca?.order ?? 99) - (cb?.order ?? 99);
                            };
                            const STAR_COIN_COST_MAP = { rare: 1, epic: 2, legendary: 3 };
                            const hiredMineros = Object.values(dogs).filter(d => d?.hired).sort(sortByRarity);
                            const hiredForja = Object.values(forgeDogs).filter(d => d?.hired).sort(sortByRarity);
                            const renderCard = (dog, isForge) => {
                                const config = isForge ? ForgeDogsConfig[dog.id] : DogsConfig[dog.id];
                                if (!config) return null;
                                const assets = isForge ? forgeDogAssets : dogAssets;
                                const stars = dog.stars ?? 0;
                                const fragForNext = stars < 5 ? config.starFragments?.[stars] : null;
                                const starCoinCost = STAR_COIN_COST_MAP[config.rarity] ?? 0;
                                const starGoldCost = config.starGoldCost ?? 0;
                                const canUpgrade = fragForNext !== null && (dog.fragments ?? 0) >= fragForNext && tavernCoins >= starCoinCost && gameState.gold >= starGoldCost;
                                const isFlipped = flippedDog === dog.id;
                                return (
                                    <div key={dog.id} className={`dog-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                        <div className={`dog-card dog-card-front dog-rarity-${config.rarity} dog-hired`}>
                                            <button className="dog-info-btn" onClick={() => setFlippedDog(isFlipped ? null : dog.id)}>ℹ</button>
                                            <span className={`dog-rarity-badge dog-rarity-${config.rarity}`}>{config.rarity}</span>
                                            <img src={isForge ? forgeBadge : pickaxeStone} className="dog-type-badge" alt="" />
                                            <img src={assets[dog.id]} className="dog-portrait" alt={config.name} />
                                            <div className="dog-name">{config.name}</div>
                                            <div className="dog-stars-row">
                                                {[1, 2, 3, 4, 5].map(s => <span key={s} className={`dog-star ${stars >= s ? 'dog-star-active' : ''}`}>★</span>)}
                                            </div>
                                            {stars < 5 ? (
                                                <>
                                                    <div className="dog-frag-row">🧩 {dog.fragments ?? 0} / {fragForNext}</div>
                                                    <div className="dog-unlock-cost">
                                                        <span className={tavernCoins < starCoinCost ? 'cost-missing' : 'cost-ok'}>
                                                            <img src={coinTavern} alt="coins" className="cost-icon" />{starCoinCost}
                                                        </span>
                                                        {starGoldCost > 0 && (
                                                            <span className={gameState.gold < starGoldCost ? 'cost-missing' : 'cost-ok'}>
                                                                <img src={iconGold} alt="gold" className="cost-icon" />{starGoldCost >= 1000 ? `${(starGoldCost / 1000).toFixed(0)}k` : starGoldCost}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button className={`dog-hire-btn ${!canUpgrade ? 'locked' : ''}`} onClick={() => onUpgradeStar(dog.id, isForge)} disabled={!canUpgrade}>Mejorar</button>
                                                </>
                                            ) : <div className="dog-status">MAX ⭐</div>}
                                        </div>
                                        <div className={`dog-card dog-card-back ${!isForge ? `dog-card-back-${dog.id}` : ''}`}>
                                            <button className="dog-info-btn" onClick={() => setFlippedDog(null)}>✖</button>
                                            <div className="dog-name">{config.name}</div>
                                            {!isForge ? (
                                                <>
                                                    <div className="dog-stat-section">
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={pickaxeStone} className="dog-stat-icon" /> Poder minado</span>
                                                            <span className="dog-stat-val">{config.miningPower}</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label">Velocidad</span>
                                                            <span className="dog-stat-val">{(() => { const pps = 1 / config.miningSpeed; return pps >= 1 ? `${parseFloat(pps.toFixed(2))} pic/s` : `1 pic/${config.miningSpeed}s`; })()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="dog-stat-divider">Bonus bioma</div>
                                                    <div className="dog-stat-section">
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={menaBronze} className="dog-stat-icon-lg" /> Bronce</span>
                                                            <span className={`dog-stat-val ${(Array.isArray(config.biomeBonus.bronze) ? config.biomeBonus.bronze[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.bronze) > 1 ? 'dog-stat-bonus' : ''}`}>x{Array.isArray(config.biomeBonus.bronze) ? config.biomeBonus.bronze[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.bronze}</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={menaIron} className="dog-stat-icon-lg" /> Hierro</span>
                                                            <span className={`dog-stat-val ${(Array.isArray(config.biomeBonus.iron) ? config.biomeBonus.iron[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.iron) > 1 ? 'dog-stat-bonus' : ''}`}>x{Array.isArray(config.biomeBonus.iron) ? config.biomeBonus.iron[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.iron}</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={menaDiamond} className="dog-stat-icon-lg" /> Diamante</span>
                                                            <span className={`dog-stat-val ${(Array.isArray(config.biomeBonus.diamond) ? config.biomeBonus.diamond[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.diamond) > 1 ? 'dog-stat-bonus' : ''}`}>x{Array.isArray(config.biomeBonus.diamond) ? config.biomeBonus.diamond[Math.min(5, dog.stars ?? 0)] : config.biomeBonus.diamond}</span>
                                                        </div>
                                                    </div>
                                                    <div className="dog-stat-divider">Pasiva oro</div>
                                                    <div className="dog-stat-passive">
                                                        {config.goldMineBonus.type === 'extraGold' && <><b>+{config.goldMineBonus.value}</b> de <img src={iconGold} className="dog-stat-icon" /> extra por picada</>}
                                                        {config.goldMineBonus.type === 'freeHit' && <><b>{config.goldMineBonus.chance * 100}%</b> de prob. de reducir recarga de energía</>}
                                                        {config.goldMineBonus.type === 'doubleHit' && <><b>{config.goldMineBonus.chance * 100}%</b> de prob. de doblar <img src={iconGold} className="dog-stat-icon" /> minado</>}
                                                        {config.goldMineBonus.type === 'saveDurability' && <><b>{config.goldMineBonus.chance * 100}%</b> de prob. de no gastar durabilidad</>}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="dog-stat-section">
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label">Reducción base</span>
                                                            <span className="dog-stat-val">-{config.forgeBonus.timeReduction}s</span>
                                                        </div>
                                                        {config.forgeBonus.doubleIngot > 0 && (
                                                            <div className="dog-stat-row">
                                                                <span className="dog-stat-label">Doble lingote</span>
                                                                <span className="dog-stat-val dog-stat-bonus">{config.forgeBonus.doubleIngot * 100}%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="dog-stat-divider">Bonus bioma</div>
                                                    <div className="dog-stat-section">
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={ingotBronze} className="dog-stat-icon-lg" /> Bronce</span>
                                                            <span className={`dog-stat-val ${config.forgeBonus.biomeBonus.bronze > 0 ? 'dog-stat-bonus' : ''}`}>-{config.forgeBonus.biomeBonus.bronze}s</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={ingotIron} className="dog-stat-icon-lg" /> Hierro</span>
                                                            <span className={`dog-stat-val ${config.forgeBonus.biomeBonus.iron > 0 ? 'dog-stat-bonus' : ''}`}>-{config.forgeBonus.biomeBonus.iron}s</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={ingotDiamond} className="dog-stat-icon-lg" /> Diamante</span>
                                                            <span className={`dog-stat-val ${config.forgeBonus.biomeBonus.diamond > 0 ? 'dog-stat-bonus' : ''}`}>-{config.forgeBonus.biomeBonus.diamond}s</span>
                                                        </div>
                                                    </div>
                                                    {config.globalSlotBonus && (
                                                        <>
                                                            <div className="dog-stat-divider">Pasiva slot principal</div>
                                                            <div className="dog-stat-passive">
                                                                {config.globalSlotBonus.type === 'goldTrickle' && <>+{config.globalSlotBonus.min}-{config.globalSlotBonus.max} <img src={iconGold} className="dog-stat-icon" /> oro cada 60s</>}
                                                                {config.globalSlotBonus.type === 'burstRecharge' && <><b>{config.globalSlotBonus.chance * 100}%</b> de recargar energía al minar</>}
                                                                {config.globalSlotBonus.type === 'maxDurability' && <>+{config.globalSlotBonus.value} de durabilidad máxima</>}
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            };

                            const allHired = [
                                ...hiredMineros.map(d => ({ d, isForge: false })),
                                ...hiredForja.map(d => ({ d, isForge: true })),
                            ].sort((a, b) => sortByRarity(a.d, b.d));

                            return (
                                <div className="dogs-obtenidos">
                                    {allHired.length === 0 && (
                                        <p className="dogs-empty-msg">Aún no tienes ayudantes contratados.</p>
                                    )}
                                    {allHired.length > 0 && (
                                        <div className="dogs-grid">{allHired.map(({ d, isForge }) => renderCard(d, isForge))}</div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* FORJA */}
                        {dogTab === 'forja' && (
                            <div className="dogs-grid">
                                {Object.values(forgeDogs)
                                    .filter(d => d && typeof d === 'object')
                                    .filter(d => !rarityFilter || (rarityFilter === 'obtenidos' ? d.hired : ForgeDogsConfig[d.id]?.rarity === rarityFilter))
                                    .sort((a, b) => {
                                        const isGiftA = (ForgeDogsConfig[a.id]?.unlockCost?.gold === 0 && ForgeDogsConfig[a.id]?.unlockCost?.tavernCoins === 0);
                                        const isGiftB = (ForgeDogsConfig[b.id]?.unlockCost?.gold === 0 && ForgeDogsConfig[b.id]?.unlockCost?.tavernCoins === 0);
                                        if (isGiftA !== isGiftB) return isGiftA ? 1 : -1;
                                        const order = { legendary: 0, epic: 1, rare: 2 };
                                        return (order[ForgeDogsConfig[a.id]?.rarity] ?? 3) - (order[ForgeDogsConfig[b.id]?.rarity] ?? 3);
                                    })
                                    .map(dog => {
                                        const config = ForgeDogsConfig[dog.id];
                                        const { gold: goldCostF = 0, tavernCoins: coinCostF = 0 } = config.unlockCost ?? {};
                                        const canUnlockF = (dog.fragments ?? 0) >= config.unlockFragments
                                            && gameState.gold >= goldCostF
                                            && tavernCoins >= coinCostF;
                                        const starsF = dog.stars ?? 0;
                                        const fragForNextF = dog.hired && starsF < 5 ? config.starFragments[starsF] : null;
                                        const starCoinCostF = getStarCoinCost(config.rarity, starsF);
                                        const starGoldCostF = getStarGoldCost(config.rarity, starsF);
                                        const canUpgradeF = fragForNextF !== null && (dog.fragments ?? 0) >= fragForNextF && tavernCoins >= starCoinCostF && gameState.gold >= starGoldCostF;
                                        const isFlipped = flippedDog === dog.id;

                                        return (
                                            <div key={dog.id} className={`dog-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                                <div className={`dog-card dog-card-front dog-rarity-${config.rarity} ${dog.hired ? 'dog-hired' : ''} ${!canUnlockF && !dog.hired ? 'dog-cant-afford' : ''}`}>
                                                    <button className="dog-info-btn" onClick={() => setFlippedDog(dog.id)}>ℹ</button>
                                                    <span className={`dog-rarity-badge dog-rarity-${config.rarity}`}>{config.rarity}</span>
                                                    {config.element && ELEMENT_ICON[config.element] && (() => {
                                                        const { Icon, color } = ELEMENT_ICON[config.element];
                                                        return <span className="dog-element-icon"><Icon size={15} color={color} /></span>;
                                                    })()}
                                                    <img src={forgeDogAssets[dog.id]} className="dog-portrait" alt={config.name} />
                                                    <div className="dog-name">{config.name}</div>
                                                    <div className="dog-stars-row">
                                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className={`dog-star ${starsF >= s ? 'dog-star-active' : ''}`}>★</span>)}
                                                    </div>
                                                    {dog.hired ? (
                                                        starsF < 5 ? (
                                                            <>
                                                                <div className="dog-frag-row">🧩 {dog.fragments ?? 0} / {fragForNextF}</div>
                                                                <div className="dog-unlock-cost">
                                                                    <span className={gameState.gold < starGoldCostF ? 'cost-missing' : 'cost-ok'}>
                                                                        <img src={iconGold} alt="oro" className="cost-icon" />{`${starGoldCostF / 1000}k`}
                                                                    </span>
                                                                    <span className={tavernCoins < starCoinCostF ? 'cost-missing' : 'cost-ok'}>
                                                                        <img src={coinTavern} alt="coins" className="cost-icon" />{starCoinCostF}
                                                                    </span>
                                                                </div>
                                                                <button className={`dog-hire-btn ${!canUpgradeF ? 'locked' : ''}`} onClick={() => onUpgradeStar(dog.id, true)} disabled={!canUpgradeF}>⬆ Mejorar</button>
                                                            </>
                                                        ) : <div className="dog-status">MAX ⭐</div>
                                                    ) : (
                                                        <>
                                                            <div className="dog-frag-row">🧩 {dog.fragments ?? 0} / {config.unlockFragments}</div>
                                                            <div className="dog-unlock-cost">
                                                                <span className={gameState.gold < goldCostF ? 'cost-missing' : 'cost-ok'}>
                                                                    <img src={iconGold} alt="oro" className="cost-icon" />{goldCostF >= 1000000 ? (goldCostF / 1000000).toFixed(1) + 'M' : goldCostF >= 1000 ? (goldCostF / 1000).toFixed(0) + 'k' : goldCostF}
                                                                </span>
                                                                <span className={tavernCoins < coinCostF ? 'cost-missing' : 'cost-ok'}>
                                                                    <img src={coinTavern} alt="coins" className="cost-icon" />{coinCostF}
                                                                </span>
                                                            </div>
                                                            <button className={`dog-hire-btn ${!canUnlockF ? 'locked' : ''}`} onClick={() => onUnlockWithFragments(dog.id, true)} disabled={!canUnlockF}>Desbloquear</button>
                                                        </>
                                                    )}

                                                </div>
                                                <div className="dog-card dog-card-back">
                                                    <button className="dog-info-btn" onClick={() => setFlippedDog(null)}>✖</button>
                                                    <div className="dog-name">{config.name}</div>

                                                    <div className="dog-stat-section">
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label">⏱️ Reducción base</span>
                                                            <span className="dog-stat-val">-{config.forgeBonus.timeReduction}s</span>
                                                        </div>
                                                        {config.forgeBonus.doubleIngot > 0 && (
                                                            <div className="dog-stat-row">
                                                                <span className="dog-stat-label">✨ Doble lingote</span>
                                                                <span className="dog-stat-val dog-stat-bonus">{config.forgeBonus.doubleIngot * 100}%</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="dog-stat-divider">Bonus bioma</div>
                                                    <div className="dog-stat-section">
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={ingotBronze} className="dog-stat-icon-lg" /> Bronce</span>
                                                            <span className={`dog-stat-val ${config.forgeBonus.biomeBonus.bronze > 0 ? 'dog-stat-bonus' : ''}`}>-{config.forgeBonus.biomeBonus.bronze}s</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={ingotIron} className="dog-stat-icon-lg" /> Hierro</span>
                                                            <span className={`dog-stat-val ${config.forgeBonus.biomeBonus.iron > 0 ? 'dog-stat-bonus' : ''}`}>-{config.forgeBonus.biomeBonus.iron}s</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={ingotDiamond} className="dog-stat-icon-lg" /> Diamante</span>
                                                            <span className={`dog-stat-val ${config.forgeBonus.biomeBonus.diamond > 0 ? 'dog-stat-bonus' : ''}`}>-{config.forgeBonus.biomeBonus.diamond}s</span>
                                                        </div>
                                                    </div>

                                                    {config.globalSlotBonus && (
                                                        <>
                                                            <div className="dog-stat-divider">Pasiva slot principal</div>
                                                            <div className="dog-stat-passive">
                                                                {config.globalSlotBonus.type === 'goldTrickle' && <>+{config.globalSlotBonus.min === config.globalSlotBonus.max ? config.globalSlotBonus.min : `${config.globalSlotBonus.min}-${config.globalSlotBonus.max}`} <img src={iconGold} className="dog-stat-icon" /> oro cada 60s</>}
                                                                {config.globalSlotBonus.type === 'burstRecharge' && <><b>{config.globalSlotBonus.chance * 100}%</b> de recargar energía al minar</>}
                                                                {config.globalSlotBonus.type === 'maxDurability' && <>+{config.globalSlotBonus.value} de durabilidad máxima del pico</>}
                                                            </div>
                                                        </>
                                                    )}
                                                    {config.element && ELEMENT_ICON[config.element] && (() => {
                                                        const { Icon, color } = ELEMENT_ICON[config.element];
                                                        return (
                                                            <>
                                                                <div className="dog-stat-divider">Combate</div>
                                                                <div className="dog-stat-passive">
                                                                    <span className="dog-activa-icon"><Icon size={13} color={color} /></span>
                                                                    {FORGE_COMBAT_PASSIVE_BY_ELEMENT[config.element]}
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                )}

                {/* SOBRES */}
                {view === 'sobres' && (
                    <div className="tavern-cambista">
                        <h2 className="tavern-title">Invocación</h2>

                        {showSobresIntro && (
                            <div className="forge-intro-overlay">
                                <h3 className="forge-intro-title">Invocación</h3>
                                <p className="forge-intro-text">
                                    Abre sobres con monedas de taberna para conseguir fragmentos de mascotas. Acumula suficientes fragmentos para desbloquear una mascota o subirle estrellas. Los sobres de mayor rareza tienen mejores probabilidades de mascotas épicas y legendarias.
                                </p>
                                <button className="forge-intro-btn" onClick={() => {
                                    setShowSobresIntro(false);
                                    setGameState(prev => ({ ...prev, tutorial: { ...prev.tutorial, sobreIntroDone: true } }));
                                }}>Entendido</button>
                            </div>
                        )}

                        <div className="dog-tabs">
                            <button className={`dog-tab-btn ${packTab === 'mineros' ? 'active' : ''}`} onClick={() => setPackTab('mineros')}>Mineros</button>
                            <button className={`dog-tab-btn ${packTab === 'forja' ? 'active' : ''}`} onClick={() => setPackTab('forja')}>Forja</button>
                            <button className={`dog-tab-btn ${packTab === 'gratis' ? 'active' : ''} ${(minerHasFree || forgeHasFree) && packTab !== 'gratis' ? 'tavern-zone-notify' : ''}`} onClick={() => setPackTab('gratis')}>Gratis</button>
                        </div>

                        <PrizeOverlay
                            prizeData={invocPrizeData}
                            onAccept={() => setInvocPrizeData(null)}
                        />

                        {(packTab === 'mineros' || packTab === 'forja') && (
                            <div className="packs-grid">
                                {Object.values(PACK_TYPES).map(pack => {
                                    const canOpen = tavernCoins >= pack.cost;
                                    return (
                                        <div key={pack.id} className={`pack-card pack-card-${pack.id}`}>
                                            <div className='wrap-title-pack'>
                                                <div className="pack-envelope">
                                                    <img
                                                        src={{ basic: iconShardRareGeneric, epic: iconShardEpicGeneric, legendary: iconShardLegendaryGeneric }[pack.id]}
                                                        className="pack-shard-icon"
                                                        alt={pack.id}
                                                    />
                                                </div>
                                                <div className="pack-name">{pack.name}</div>
                                            </div>
                                            <div className='wrap-btn-rates-card'>
                                                <div className="pack-rates">
                                                    {pack.rates.legendary > 0 && <span className="pack-rate rate-legendary">⭐ {pack.rates.legendary * 100}%</span>}
                                                    {pack.rates.epic > 0 && <span className="pack-rate rate-epic">🔮 {pack.rates.epic * 100}%</span>}
                                                    {pack.rates.rare > 0 && <span className="pack-rate rate-rare">💠 {pack.rates.rare * 100}%</span>}
                                                </div>
                                                <button
                                                    className={`pack-open-btn ${!canOpen ? 'locked' : ''}`}
                                                    disabled={!canOpen}
                                                    onClick={() => { pendingSfxRef.current = 'rewardShards'; onOpenPack(pack.id, packTab === 'forja'); }}
                                                >
                                                    Abrir — {pack.cost} <img src={coinTavern} alt="coin" style={{ width: 14, height: 14, verticalAlign: 'middle', marginLeft: 2 }} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {packTab === 'gratis' && (() => {
                            const cooldowns = { basic: 5 * 3600000, epic: 10 * 3600000, legendary: 24 * 3600000 };
                            const renderGroup = (isForge) => (
                                <div className="free-packs-group">
                                    <p className="free-packs-group-title">{isForge ? '🔥 Forja' : '⛏️ Mineros'}</p>
                                    <div className="free-packs-grid">
                                        {Object.values(PACK_TYPES).map(pack => {
                                            const pullKey = `${isForge ? 'forge' : 'miner'}_${pack.id}`;
                                            const last = gameState.lastFreePull?.[pullKey] ?? 0;
                                            const remaining = cooldowns[pack.id] - (Date.now() - last);
                                            const freeReady = remaining <= 0;
                                            const freeLabel = (() => {
                                                const h = Math.floor(remaining / 3600000);
                                                const m = Math.floor((remaining % 3600000) / 60000);
                                                return h > 0 ? `${h}h ${m}m` : `${m}m`;
                                            })();
                                            return (
                                                <div key={`${isForge ? 'forge' : 'miner'}_${pack.id}`} className={`free-pack-card pack-card-${pack.id}`}>
                                                    <img
                                                        src={{ basic: iconShardRareGeneric, epic: iconShardEpicGeneric, legendary: iconShardLegendaryGeneric }[pack.id]}
                                                        className="free-pack-img"
                                                        alt={pack.id}
                                                    />
                                                    <span className={`dog-rarity-badge dog-rarity-${pack.id === 'basic' ? 'rare' : pack.id === 'epic' ? 'epic' : 'legendary'}`}>
                                                        {pack.name}
                                                    </span>
                                                    <button
                                                        className={`pack-free-btn ${!freeReady ? 'locked' : ''}`}
                                                        disabled={!freeReady}
                                                        onClick={() => { pendingSfxRef.current = 'freeInvoc'; onFreePull(pack.id, isForge); }}
                                                    >
                                                        {freeReady ? '🎁 Gratis' : `⏱ ${freeLabel}`}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                            return (
                                <div className="free-packs-sections">
                                    {renderGroup(false)}
                                    {renderGroup(true)}
                                </div>
                            );
                        })()}

                    </div>
                )}

                {/* RULETA */}
                {view === 'ruleta' && (
                    <div className="tavern-cambista">
                        <h2 className="tavern-title">Ruleta</h2>

                        <div className="dog-tabs">
                            <button
                                className={`dog-tab-btn ${rouletteTab === 'gold' ? 'active' : ''}`}
                                onClick={() => setRouletteTab('gold')}
                            >
                                Oro
                            </button>
                            <button
                                className={`dog-tab-btn ${rouletteTab === 'shards' ? 'active' : ''} ${(!gameState.lastFreeSpinShards || gameState.lastFreeSpinShards < todayMidnight()) && rouletteTab !== 'shards' ? 'tavern-zone-notify' : ''}`}
                                onClick={() => setRouletteTab('shards')}
                            >
                                Shards
                            </button>
                        </div>

                        {rouletteTab === 'gold' && <RouletteGold />}
                        {rouletteTab === 'shards' && <RouletteShards />}
                    </div>
                )}

                {/* TRAGAPERRAS */}
                {view === 'tragaperras' && (
                    <div className="tavern-cambista">
                        <h2 className="tavern-title">Tragaperras</h2>
                        <div className="slot-center-wrapper">
                            <SlotMachine guaranteed={!gameState.slotWelcomeDone} />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TavernModal;