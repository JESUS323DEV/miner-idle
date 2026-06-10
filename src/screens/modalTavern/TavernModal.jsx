import { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import '../../styles/modals/TavernModal.css';
import '../../styles/modals/ForgeModal.css';
import { TavernConfig } from '../../game/config/TavernConfig';
import { DogsConfig } from '../../game/config/DogsConfig';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig';
import { PACK_TYPES } from '../../game/config/GachaConfig';

import tutorialPrincipal from "../../assets/tutorial/mascotas/principal.png"
import tutorialMina from "../../assets/tutorial/mascotas/mina.png"
import tutorialForja from "../../assets/tutorial/mascotas/forja.png"

import iconInvocacion from "../../assets/ui/icons-pets-shards/icon-invocacion.png"
import iconShardRare from "../../assets/ui/icons-pets-shards/icon-shard-rare.png"
import iconShardEpic from "../../assets/ui/icons-pets-shards/icon-shard-epic.png"
import iconShardLegendary from "../../assets/ui/icons-pets-shards/icon-shard-legendary.png"

import bgTavern from "../../assets/backgrounds/bg-tavern/bg-tavern1.png"
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"
import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.png"
import ingotBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.png"
import ingotIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.png"
import ingotDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.png"

import bgCoin from "../../assets/backgrounds/bg-tavern/bg-coin.png"

import pickaxeStone from "../../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone.png"
import menaBronze from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.png"
import menaIron from "../../assets/ui/icons-menas/menas-iron/mena-iron3.png"
import menaDiamond from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.png"

import cambistaCoin from "../../assets/ui/icons-hud/hud-modals/modal-tavern/cambista-coin.png"
import materiales from "../../assets/ui/icons-hud/hud-modals/modal-tavern/materiales.png"

import ladyIcon from "../../assets/ui/icons-pets/mineros/lady-icon.png"
import tokyoIcon from "../../assets/ui/icons-pets/mineros/tokyo-icon.png"
import tukaIcon from "../../assets/ui/icons-pets/mineros/tuka-icon.png"
import munaIcon from "../../assets/ui/icons-pets/mineros/muna-icon.png"
import gordoIcon from "../../assets/ui/icons-pets/mineros/gordo-icon.png"
import druhIcon from "../../assets/ui/icons-pets/mineros/druh-icon.png"
import smokeIcon from "../../assets/ui/icons-pets/mineros/smoke-icon.png"
import nupitoIcon from "../../assets/ui/icons-pets/mineros/nupito-icon.png"
import zeusIcon from "../../assets/ui/icons-pets/mineros/zeus-icon.png"

import forgeIcon1 from "../../assets/ui/icons-pets/forge/forge-icon1.png"
import forgeIcon2 from "../../assets/ui/icons-pets/forge/forge-icon2.png"
import forgeIcon3 from "../../assets/ui/icons-pets/forge/forge-icon3.png"

const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
};

const forgeDogAssets = {
    pip: forgeIcon1, koda: forgeIcon2, milo: forgeIcon3,
    rocky: forgeIcon1, bruno: forgeIcon2, max: forgeIcon3,
    rex: forgeIcon1, toby: forgeIcon2, buddy: forgeIcon3,
};

const ingotAssets = {
    bronzeIngot: ingotBronze,
    ironIngot: ingotIron,
    diamondIngot: ingotDiamond,
};

// Formatea números grandes (1k, 1.5M...) PARA INFO DEL HUD - MENAS LINGOTES
const formatNumber2 = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
};

const TavernModal = ({ isOpen, onClose }) => {
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
    const [flippedDog, setFlippedDog] = useState(null);
    const [dogTab, setDogTab] = useState('mineros');
    const [rarityFilter, setRarityFilter] = useState(null);
    const [packTab, setPackTab] = useState('mineros');
    const [packResult, setPackResult] = useState(null);
    const [resultStreak, setResultStreak] = useState({ dogId: null, count: 0 });

    useEffect(() => {
        if (view === 'ayudantes' && !gameState.tutorial?.dogsIntroDone) setShowDogsIntro(true);
        if (view === 'cambista' && !gameState.tutorial?.cambistaIntroDone) setShowCambistaIntro(true);
        if (view === 'sobres' && !gameState.tutorial?.sobreIntroDone) setShowSobresIntro(true);
    }, [view]); // eslint-disable-line

    useEffect(() => {
        if (!gameState.lastPackResult) return;
        setPackResult(gameState.lastPackResult);
        setResultStreak(prev => ({
            dogId: gameState.lastPackResult.dogId,
            count: prev.dogId === gameState.lastPackResult.dogId ? prev.count + 1 : 1
        }));
        const t = setTimeout(() => setPackResult(null), 10000);
        return () => clearTimeout(t);
    }, [gameState.lastPackResult]);

    if (!isOpen) return null;

    const currentMaterials = { bronzeIngot, ironIngot, diamondIngot };

    const STAR_COIN_COST_MAP = { legendary: 3, epic: 2, rare: 1 };
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
        const starCoinCost = STAR_COIN_COST_MAP[config.rarity] ?? 0;
        const fragForNext = dog.hired && stars < 5 ? config.starFragments?.[stars] : null;
        const canUnlock = !dog.hired && frags >= config.unlockFragments && gameState.gold >= goldCost && tavernCoins >= coinCost;
        const canUpgrade = fragForNext !== null && frags >= fragForNext && tavernCoins >= starCoinCost;
        if (canUnlock || canUpgrade) rarityHasAction[config.rarity] = true;
    });

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

                            <button className="tavern-menu-card" onClick={() => setView('ayudantes')}>
                                <img src={ladyIcon} className="tavern-card-icon" />
                                <div className="tavern-card-info">
                                    <span className="tavern-card-name">Ayudantes</span>
                                    <span className="tavern-card-desc">Contrata y gestiona tus mascotas</span>
                                </div>
                                <span className="tavern-card-arrow">›</span>
                            </button>

                            <button className="tavern-menu-card" onClick={() => setView('sobres')}>
                                <img src={iconInvocacion} className="tavern-card-icon" />
                                <div className="tavern-card-info">
                                    <span className="tavern-card-name">Invocación</span>
                                    <span className="tavern-card-desc">Abre sobres y consigue fragmentos</span>
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
                                className={`dog-tab-btn ${dogTab === 'mineros' ? 'active' : ''}`}
                                onClick={() => setDogTab('mineros')}
                            >
                                ⛏️ Mineros
                            </button>
                            <button
                                className={`dog-tab-btn ${dogTab === 'forja' ? 'active' : ''}`}
                                onClick={() => setDogTab('forja')}
                            >
                                🔥 Forja
                            </button>
                        </div>

                        {/* FILTRO RAREZA */}
                        <div className="rarity-filter-bar">
                            {[null, 'legendary', 'epic', 'rare'].map(r => {
                                const hasPulse = r ? rarityHasAction[r] && rarityFilter !== r : false;
                                return (
                                    <button
                                        key={r ?? 'all'}
                                        className={`rarity-filter-btn${r ? ` rarity-filter-${r}` : ''}${rarityFilter === r ? ' rarity-filter-active' : ''}${hasPulse ? ' rarity-filter-pulse' : ''}`}
                                        onClick={() => setRarityFilter(r)}
                                    >
                                        {r === null ? 'Todas' : r === 'legendary' ? 'Legendaria' : r === 'epic' ? 'Épica' : 'Rara'}
                                    </button>
                                );
                            })}
                        </div>

                        {/* MINEROS */}
                        {dogTab === 'mineros' && (
                            <div className="dogs-grid">
                                {Object.values(dogs)
                                    .filter(d => d && typeof d === 'object' && !Array.isArray(d))
                                    .filter(d => !rarityFilter || DogsConfig[d.id]?.rarity === rarityFilter)
                                    .sort((a, b) => {
                                        const order = { legendary: 0, epic: 1, rare: 2 };
                                        return (order[DogsConfig[a.id]?.rarity] ?? 3) - (order[DogsConfig[b.id]?.rarity] ?? 3);
                                    })
                                    .map(dog => {
                                        const config = DogsConfig[dog.id];
                                        const { gold: goldCost = 0, tavernCoins: coinCost = 0 } = config.unlockCost ?? {};
                                        const canUnlock = (dog.fragments ?? 0) >= config.unlockFragments
                                            && gameState.gold >= goldCost
                                            && tavernCoins >= coinCost;
                                        const stars = dog.stars ?? 0;
                                        const fragForNext = dog.hired && stars < 5 ? config.starFragments[stars] : null;
                                        const STAR_COIN_COST = { legendary: 3, epic: 2, rare: 1 };
                                        const starCoinCost = STAR_COIN_COST[config.rarity] ?? 0;
                                        const canUpgrade = fragForNext !== null && (dog.fragments ?? 0) >= fragForNext && tavernCoins >= starCoinCost;
                                        const isFlipped = flippedDog === dog.id;
                                        return (
                                            <div key={dog.id} className={`dog-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                                <div className={`dog-card dog-card-front dog-rarity-${config.rarity} ${dog.hired ? 'dog-hired' : ''} ${!canUnlock && !dog.hired ? 'dog-cant-afford' : ''}`}>
                                                    <button className="dog-info-btn" onClick={() => setFlippedDog(dog.id)}>ℹ</button>
                                                    <span className={`dog-rarity-badge dog-rarity-${config.rarity}`}>{config.rarity}</span>
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
                                                            <span className={`dog-stat-val ${config.biomeBonus.bronze > 1 ? 'dog-stat-bonus' : ''}`}>x{config.biomeBonus.bronze}</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={menaIron} className="dog-stat-icon-lg" /> Hierro</span>
                                                            <span className={`dog-stat-val ${config.biomeBonus.iron > 1 ? 'dog-stat-bonus' : ''}`}>x{config.biomeBonus.iron}</span>
                                                        </div>
                                                        <div className="dog-stat-row">
                                                            <span className="dog-stat-label"><img src={menaDiamond} className="dog-stat-icon-lg" /> Diamante</span>
                                                            <span className={`dog-stat-val ${config.biomeBonus.diamond > 1 ? 'dog-stat-bonus' : ''}`}>x{config.biomeBonus.diamond}</span>
                                                        </div>
                                                    </div>

                                                    <div className="dog-stat-divider">Pasiva oro</div>
                                                    <div className="dog-stat-passive">
                                                        {config.goldMineBonus.type === 'extraGold' && <><b>+{config.goldMineBonus.value}</b> <img src={iconGold} className="dog-stat-icon" /> extra por picada</>}
                                                        {config.goldMineBonus.type === 'freeHit' && <>🎯
                                                            <b>{config.goldMineBonus.chance * 100}%</b> de que el golpe no consuma stamina ni pico</>}

                                                        {config.goldMineBonus.type === 'doubleHit' && <><b>+{config.goldMineBonus.chance * 100}%</b> de doblar el
                                                            <img src={iconGold} className="dog-stat-icon" /> minado </>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}

                        {/* FORJA */}
                        {dogTab === 'forja' && (
                            <div className="dogs-grid">
                                {Object.values(forgeDogs)
                                    .filter(d => d && typeof d === 'object')
                                    .filter(d => !rarityFilter || ForgeDogsConfig[d.id]?.rarity === rarityFilter)
                                    .sort((a, b) => {
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
                                        const starCoinCostF = { legendary: 3, epic: 2, rare: 1 }[config.rarity] ?? 0;
                                        const canUpgradeF = fragForNextF !== null && (dog.fragments ?? 0) >= fragForNextF && tavernCoins >= starCoinCostF;
                                        const isFlipped = flippedDog === dog.id;

                                        return (
                                            <div key={dog.id} className={`dog-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                                <div className={`dog-card dog-card-front dog-rarity-${config.rarity} ${dog.hired ? 'dog-hired' : ''} ${!canUnlockF && !dog.hired ? 'dog-cant-afford' : ''}`}>
                                                    <button className="dog-info-btn" onClick={() => setFlippedDog(dog.id)}>ℹ</button>
                                                    <span className={`dog-rarity-badge dog-rarity-${config.rarity}`}>{config.rarity}</span>
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
                        <button className="tavern-back-btn" onClick={() => { setView('main'); setPackResult(null); }}>
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
                        </div>

                        {packResult && (
                            <div className={`pack-result-mini pack-result-mini-${packResult.rarity}`}>
                                <img
                                    src={packResult.isForge ? forgeDogAssets[packResult.dogId] : dogAssets[packResult.dogId]}
                                    className="pack-result-mini-img"
                                    alt={packResult.dogId}
                                />
                                <div className="pack-result-mini-info">
                                    <span className="pack-result-mini-name">
                                        {packResult.isForge ? ForgeDogsConfig[packResult.dogId]?.name : DogsConfig[packResult.dogId]?.name}
                                    </span>
                                    <span className={`dog-rarity-badge dog-rarity-${packResult.rarity}`}>{packResult.rarity}</span>
                                </div>
                                <div className="pack-result-mini-frags">+{packResult.fragments} 🧩</div>
                            {resultStreak.count > 1 && (
                                <div className="pack-result-streak">x{resultStreak.count}</div>
                            )}
                            </div>
                        )}

                        <div className="packs-grid">
                            {Object.values(PACK_TYPES).map(pack => {
                                const canOpen = tavernCoins >= pack.cost;
                                const cooldowns = { basic: 5 * 3600000, epic: 10 * 3600000, legendary: 24 * 3600000 };
                                const last = gameState.lastFreePull?.[pack.id] ?? 0;
                                const remaining = cooldowns[pack.id] - (Date.now() - last);
                                const freeReady = remaining <= 0;
                                const freeLabel = freeReady ? 'Gratis' : (() => {
                                    const h = Math.floor(remaining / 3600000);
                                    const m = Math.floor((remaining % 3600000) / 60000);
                                    return h > 0 ? `${h}h ${m}m` : `${m}m`;
                                })();
                                return (
                                    <div key={pack.id} className={`pack-card pack-card-${pack.id}`}>

                                        <div className='wrap-title-pack'>
                                            <div className="pack-envelope">
                                                <img
                                                    src={packTab === 'forja'
                                                        ? { basic: forgeIcon1, epic: forgeIcon2, legendary: forgeIcon3 }[pack.id]
                                                        : { basic: iconShardRare, epic: iconShardEpic, legendary: iconShardLegendary }[pack.id]
                                                    }
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
                                                onClick={() => onOpenPack(pack.id, packTab === 'forja')}
                                            >
                                                Abrir — {pack.cost} 🪙
                                            </button>
                                            <button
                                                className={`pack-free-btn ${!freeReady ? 'locked' : ''}`}
                                                disabled={!freeReady}
                                                onClick={() => onFreePull(pack.id, packTab === 'forja')}
                                            >
                                                {freeReady ? '🎁 Gratis' : `⏱ ${freeLabel}`}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default TavernModal;