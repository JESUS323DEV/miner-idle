import { useState, useEffect, useRef } from 'react';
import { playSfx } from '../../game/utils/sfx.js';
import { X, ArrowLeft, Coins, Flame, Zap, Droplets, Mountain, Moon } from 'lucide-react';
import RouletteGold from './RouletteGold.jsx';
import RouletteShards from './RouletteShards.jsx';
import SlotMachine from './SlotMachine.jsx';
import PrizeOverlay from '../../components/PrizeOverlay.jsx';
import '../../styles/modals/Roulette.css';
import { useGameContext } from '../../game/context/GameContext.jsx';
import '../../styles/modals/TavernModal.css';
import '../../styles/modals/ForgeModal.css';
import { TavernConfig } from '../../game/config/TavernConfig';
import { DogsConfig } from '../../game/config/DogsConfig';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig';
import { MineCompanionConfig } from '../../game/config/MineCompanionConfig';
import { formatNumber2 } from '../../game/utils/formatters.js';
import { PACK_TYPES } from '../../game/config/GachaConfig';

import tutorialPrincipal from "../../assets/tutorial/mascotas/principal.webp"
import tutorialMina from "../../assets/tutorial/mascotas/mina.webp"
import tutorialForja from "../../assets/tutorial/mascotas/forja.webp"

import iconInvocacion from "../../assets/ui/icons-pets-shards/icon-invocacion.webp"
import iconShardRare from "../../assets/ui/icons-pets-shards/icon-shard-rare.webp"
import iconShardRareGeneric from "../../assets/ui/icons-pets-shards/icon-shard-rare-generic.webp"
import iconShardEpicGeneric from "../../assets/ui/icons-pets-shards/icon-shard-epic-generic.webp"
import iconShardLegendaryGeneric from "../../assets/ui/icons-pets-shards/icon-shard-legendary-generic.webp"
import iconShardEpic from "../../assets/ui/icons-pets-shards/icon-shard-epic.webp"
import iconShardLegendary from "../../assets/ui/icons-pets-shards/icon-shard-legendary.webp"

import bgTavern from "../../assets/backgrounds/bg-tavern/bg-tavern1.webp"
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
import materiales from "../../assets/ui/icons-hud/hud-modals/modal-tavern/materiales.webp"

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
    fuego:    { Icon: Flame,     color: '#ff6b35' },
    electrico:{ Icon: Zap,       color: '#FFD700' },
    agua:     { Icon: Droplets,  color: '#4fc3f7' },
    tierra:   { Icon: Mountain,  color: '#8b6914' },
    oscuro:   { Icon: Moon,      color: '#b45cff' },
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
    const { bronzeIngot, ironIngot, diamondIngot, tavernCoins, dogs = {}, forgeDogs = {} } = gameState;

    const [showDogsIntro, setShowDogsIntro] = useState(false);
    const [showCambistaIntro, setShowCambistaIntro] = useState(false);
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
    }, [gameState.lastPackResult]); // eslint-disable-line

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
        <div className="tavern-overlay" onClick={onClose} style={{ backgroundImage: `url(${bgTavern})` }}>
            <div className="tavern-content" onClick={(e) => e.stopPropagation()}>
                {view === 'main' && <button className="tavern-close" onClick={onClose}><X /></button>}

                {/* MAIN */}
                {view === 'main' && (
                    <>
                        <h2 className="tavern-title">🏛️ TABERNA</h2>
                        <div className="tavern-menu">

                            <button className="tavern-menu-card" onClick={() => setView('cambista')}>
                                <img src={cambistaCoin} className="tavern-card-icon" />
                                <div className="tavern-card-info">
                                    <span className="tavern-card-name">Cambista</span>
                                    <span className="tavern-card-desc">
                                        Convierte materiales <img src={materiales} className="tavern-card-inline-icon" /> en monedas <img src={coinTavern} className="tavern-card-inline-icon" />
                                    </span>
                                </div>
                                <span className="tavern-card-arrow">›</span>
                            </button>

                            <button className={`tavern-menu-card ${hasPendingDogAction ? 'notify-pulse' : ''}`} onClick={() => setView('ayudantes')}>
                                <img src={ladyIcon} className="tavern-card-icon" />
                                <div className="tavern-card-info">
                                    <span className="tavern-card-name">Ayudantes</span>
                                    <span className="tavern-card-desc">Contrata y gestiona tus mascotas</span>
                                </div>
                                <span className="tavern-card-arrow">›</span>
                            </button>

                            <button className={`tavern-menu-card ${hasFreePacks ? 'notify-pulse' : ''}`} onClick={() => setView('sobres')}>
                                <img src={iconInvocacion} className="tavern-card-icon" />
                                <div className="tavern-card-info">
                                    <span className="tavern-card-name">Invocación</span>
                                    <span className="tavern-card-desc">Abre sobres y consigue fragmentos</span>
                                </div>
                                <span className="tavern-card-arrow">›</span>
                            </button>

                            <button className={`tavern-menu-card ${rouletteHasFree ? 'notify-pulse' : ''}`} onClick={() => setView('ruleta')}>
                                <Coins className="tavern-card-icon" style={{ width: 40, height: 40, color: '#FFD700' }} />
                                <div className="tavern-card-info">
                                    <span className="tavern-card-name">Ruleta</span>
                                    <span className="tavern-card-desc">Apuesta oro y gana premios</span>
                                </div>
                                <span className="tavern-card-arrow">›</span>
                            </button>

                            <button
                                className={`tavern-menu-card ${!gameState.slotWelcomeDone ? 'notify-pulse' : ''}`}
                                onClick={() => setView('tragaperras')}
                            >
                                <img src={iconShardLegendary} className="tavern-card-icon" alt="" />
                                <div className="tavern-card-info">
                                    <span className="tavern-card-name">Tragaperras</span>
                                    <span className="tavern-card-desc">
                                        {!gameState.slotWelcomeDone ? 'Tirada de bienvenida disponible' : 'Gira por épicos y legendarios'}
                                    </span>
                                </div>
                                <span className="tavern-card-arrow">›</span>
                            </button>

                        </div>
                    </>
                )}

                {/* CAMBISTA LINGOTES → MONEDAS */}
                {view === 'cambista' && (
                    <div className='tavern-cambista' style={{ backgroundImage: `url(${bgCoin})` }}>
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
                        <h2 className="tavern-title">💱 Cambista</h2>

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
                    </div>
                )}



                {/*======================== AYUDANTES ==================================*/}

                {view === 'ayudantes' && (
                    <div className='tavern-cambista' style={{ backgroundImage: `url(${bgCoin})` }}>
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
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
                                className={`dog-tab-btn ${dogTab === 'mineros' ? 'active' : ''} ${minerHasAction && dogTab !== 'mineros' ? 'dog-tab-btn-pulse' : ''}`}
                                onClick={() => { setDogTab('mineros'); setRarityFilter(null); }}
                            >
                                ⛏️ Mineros
                            </button>
                            <button
                                className={`dog-tab-btn ${dogTab === 'forja' ? 'active' : ''} ${forgeHasAction && dogTab !== 'forja' ? 'dog-tab-btn-pulse' : ''}`}
                                onClick={() => { setDogTab('forja'); setRarityFilter(null); }}
                            >
                                🔥 Forja
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
                        {false && (() => {
                            const sortByRarity = (a, b) => {
                                const rarityOrder = { legendary: 0, epic: 1, rare: 2 };
                                const ca = DogsConfig[a.id] ?? ForgeDogsConfig[a.id];
                                const cb = DogsConfig[b.id] ?? ForgeDogsConfig[b.id];
                                const rd = (rarityOrder[ca?.rarity] ?? 3) - (rarityOrder[cb?.rarity] ?? 3);
                                if (rd !== 0) return rd;
                                return (ca?.order ?? 99) - (cb?.order ?? 99);
                            };
                            const hiredMineros = Object.values(dogs)
                                .filter(d => d?.hired && (!rarityFilter || DogsConfig[d.id]?.rarity === rarityFilter))
                                .sort(sortByRarity);
                            const hiredForja = Object.values(forgeDogs)
                                .filter(d => d?.hired && (!rarityFilter || ForgeDogsConfig[d.id]?.rarity === rarityFilter))
                                .sort(sortByRarity);

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
                                                {[1,2,3,4,5].map(s => <span key={s} className={`dog-star ${stars >= s ? 'dog-star-active' : ''}`}>★</span>)}
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
                                                                <img src={iconGold} alt="gold" className="cost-icon" />{starGoldCost >= 1000 ? `${(starGoldCost/1000).toFixed(0)}k` : starGoldCost}
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
                        <button className="tavern-back-btn" onClick={() => { setView('main'); setInvocPrizeData(null); }}>
                            <ArrowLeft /> Volver
                        </button>
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
                            <button className={`dog-tab-btn ${packTab === 'mineros' ? 'active' : ''}`} onClick={() => setPackTab('mineros')}>⛏️ Mineros</button>
                            <button className={`dog-tab-btn ${packTab === 'forja' ? 'active' : ''}`} onClick={() => setPackTab('forja')}>🔥 Forja</button>
                            <button className={`dog-tab-btn ${packTab === 'gratis' ? 'active' : ''} ${(minerHasFree || forgeHasFree) && packTab !== 'gratis' ? 'dog-tab-btn-pulse' : ''}`} onClick={() => setPackTab('gratis')}>🎁 Gratis</button>
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
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
                        <h2 className="tavern-title">Ruleta</h2>

                        <div className="roulette-tabs">
                            <button
                                className={`roulette-tab ${rouletteTab === 'gold' ? 'rtab-active' : ''}`}
                                onClick={() => setRouletteTab('gold')}
                            >
                                Oro
                            </button>
                            <button
                                className={`roulette-tab ${rouletteTab === 'shards' ? 'rtab-active' : ''} ${(!gameState.lastFreeSpinShards || gameState.lastFreeSpinShards < todayMidnight()) && rouletteTab !== 'shards' ? 'rtab-pulse' : ''}`}
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
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
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