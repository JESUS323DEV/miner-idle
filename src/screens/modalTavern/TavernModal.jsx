import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import '../../styles/modals/TavernModal.css';
import { TavernConfig } from '../../game/config/TavernConfig';
import { DogsConfig } from '../../game/config/DogsConfig';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig';

import bgTavern from "../../assets/backgrounds/bg-tavern/bg-tavern1.png"
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"
import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.png"
import ingotBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.png"
import ingotIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.png"
import ingotDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.png"

import bgGold1 from "../../assets/backgrounds/bg-tavern/bg-gold.png"
import bgCoin from "../../assets/backgrounds/bg-tavern/bg-coin.png"

import cambistaCoin from "../../assets/ui/icons-hud/hud-modals/modal-tavern/cambista-coin.png"
import cambistaGold from "../../assets/ui/icons-hud/hud-modals/modal-tavern/cambista-gold.png"

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
        handleConvertMaterial: onConvert,
        handleConvertCoinsToGold: onConvertCoins,
        handleConvertGoldToIngot: onConvertGoldToIngot,
        handleHireDog: onHireDog,
        handleHireForgeDog: onHireForgeDog,
    } = useGameContext();
    const { bronzeIngot, ironIngot, diamondIngot, tavernCoins, gold, dogs = {}, forgeDogs = {} } = gameState;

    const [view, setView] = useState('main');
    const [flippedDog, setFlippedDog] = useState(null);
    const [dogTab, setDogTab] = useState('mineros');

    if (!isOpen) return null;

    const currentMaterials = { bronzeIngot, ironIngot, diamondIngot };

    return (
        <div className="tavern-overlay" onClick={onClose} style={{ backgroundImage: `url(${bgTavern})` }}>
            <div className="tavern-content" onClick={(e) => e.stopPropagation()}>
                <button className="tavern-close" onClick={onClose}><X /></button>

                {/* MAIN */}
                {view === 'main' && (
                    <>
                        <h2 className="tavern-title">🏛️ TABERNA</h2>
                        <div className="tavern-menu">
                            <button className="tavern-menu-btn" onClick={() => setView('cambista')}>
                                <span className='cont-btn-cambista'>
                                    <img src={cambistaCoin} alt="Cambista Coin" />
                                    <small>Cambista</small>
                                </span>
                            </button>
                            <button className="tavern-menu-btn1" onClick={() => setView('cambista-oro')}>
                                <span className='cont-btn-cambista'>
                                    <img src={cambistaGold} alt="Cambista Gold" />
                                    <small>Cambista</small>
                                </span>
                            </button>
                            <button className="tavern-menu-btn" onClick={() => setView('ayudantes')}>
                                <span className='cont-btn-cambista'>
                                    <span style={{ fontSize: '2rem' }}>🐕</span>
                                    <small>Ayudantes</small>
                                </span>
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
                        <p className="tavern-subtitle">Convierte materiales en monedas de taberna</p>

                        <div className="tavern-conversions">
                            {TavernConfig.conversions.map(conv => {
                                const hasEnough = currentMaterials[conv.material] >= conv.amount;
                                return (
                                    <div key={conv.material} className="tavern-conversion-row">
                                        <div className="tavern-conversion-info">
                                            <span className="tavern-conversion-text">
                                                <img src={ingotAssets[conv.material]} alt={conv.material} className="tavern-ingot-icon" />
                                                {conv.amount} → {conv.coins}
                                                <img src={coinTavern} alt="moneda" className="tavern-ingot-icon" />
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onConvert(conv.material)}
                                            disabled={!hasEnough}
                                            className={`tavern-convert-btn ${!hasEnough ? 'locked' : ''}`}
                                        >
                                            Convertir
                                        </button>
                                    </div>
                                );
                            })}

                            <div className="tavern-conversion-row">
                                <div className="tavern-conversion-info">
                                    <span className="tavern-conversion-text">
                                        1 <img src={coinTavern} alt="moneda" className="tavern-ingot-icon" /> → {formatNumber2(TavernConfig.coinToGold)} <img src={iconGold} alt="oro" className="tavern-ingot-icon" />
                                    </span>
                                </div>
                                <button
                                    onClick={onConvertCoins}
                                    disabled={tavernCoins < 1}
                                    className={`tavern-convert-btn ${tavernCoins < 1 ? 'locked' : ''}`}
                                >
                                    Convertir
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CAMBISTA ORO → LINGOTES */}
                {view === 'cambista-oro' && (
                    <div className='tavern-cambista' style={{ backgroundImage: `url(${bgGold1})` }}>
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
                        <h2 className="tavern-title">Cambista de Oro</h2>

                        <p className="tavern-subtitle">Compra lingotes con oro o monedas</p>
                        <div className="tavern-conversions">
                            {TavernConfig.goldConversions.map(conv => {
                                const canAfford = conv.coins > 0
                                    ? tavernCoins >= conv.coins
                                    : gold >= conv.gold;

                                return (
                                    <div key={conv.ingot} className="tavern-conversion-row">
                                        <div className="tavern-conversion-info">

                                            <span className="tavern-conversion-text">
                                                {conv.coins > 0
                                                    ? <>{conv.coins} <img src={coinTavern} alt="moneda" className="tavern-ingot-icon" /></>
                                                    : <>{formatNumber2(conv.gold)} <img src={iconGold} alt="oro" className="tavern-ingot-icon" /></>
                                                } → 1 <img src={ingotAssets[conv.ingot]} alt={conv.ingot} className="tavern-ingot-icon" />
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onConvertGoldToIngot(conv.ingot)}
                                            disabled={!canAfford}
                                            className={`tavern-convert-btn ${!canAfford ? 'locked' : ''}`}
                                        >
                                            Comprar
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}


                {view === 'ayudantes' && (
                    <div className='tavern-cambista' style={{ backgroundImage: `url(${bgCoin})` }}>
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
                        <h2 className="tavern-title">🐕 Ayudantes</h2>

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

                        {/* MINEROS */}
                        {dogTab === 'mineros' && (
                            <div className="dogs-grid">
                                {Object.values(dogs).filter(d => d && typeof d === 'object' && !Array.isArray(d)).map(dog => {
                                    const config = DogsConfig[dog.id];
                                    const canAfford = gold >= config.unlockCost.gold && tavernCoins >= config.unlockCost.tavernCoins;
                                    const isFlipped = flippedDog === dog.id;

                                    return (
                                        <div key={dog.id} className={`dog-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                            <div className={`dog-card dog-card-front ${dog.hired ? 'dog-hired' : ''} ${!canAfford && !dog.hired ? 'dog-cant-afford' : ''}`}>
                                                <button className="dog-info-btn" onClick={() => setFlippedDog(dog.id)}>i</button>
                                                <div className="dog-emoji">🐕</div>
                                                <div className="dog-name">{config.name}</div>
                                                {dog.hired ? (
                                                    <div className="dog-status">✔</div>
                                                ) : (
                                                    <>
                                                        <div className="dog-cost">
                                                            <span>{formatNumber2(config.unlockCost.gold)}</span>
                                                            <img src={iconGold} alt="oro" className="tavern-ingot-icon" />
                                                        </div>
                                                        <div className="dog-cost">
                                                            <span>{config.unlockCost.tavernCoins}</span>
                                                            <img src={coinTavern} alt="moneda" className="tavern-ingot-icon" />
                                                        </div>
                                                        <button
                                                            onClick={() => onHireDog(dog.id)}
                                                            disabled={!canAfford}
                                                            className={`dog-hire-btn ${!canAfford ? 'locked' : ''}`}
                                                        >
                                                            Contratar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <div className="dog-card dog-card-back">
                                                <button className="dog-info-btn" onClick={() => setFlippedDog(null)}>✖</button>
                                                <div className="dog-name">{config.name}</div>
                                                <div className="dog-stat">⛏️ Poder: {config.miningPower}</div>
                                                <div className="dog-stat">⚡ Vel: {config.miningSpeed}s</div>
                                                <div className="dog-stat">🟤 Bronze: x{config.biomeBonus.bronze}</div>
                                                <div className="dog-stat">⚙️ Iron: x{config.biomeBonus.iron}</div>
                                                <div className="dog-stat">💎 Diamond: x{config.biomeBonus.diamond}</div>
                                                <div className="dog-stat">
                                                    {config.goldMineBonus.type === 'extraGold' && `🪙 +${config.goldMineBonus.value} oro`}
                                                    {config.goldMineBonus.type === 'freeHit' && `🎯 ${config.goldMineBonus.chance * 100}% golpe gratis`}
                                                    {config.goldMineBonus.type === 'doubleHit' && `✨ ${config.goldMineBonus.chance * 100}% doble oro`}
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
                                {Object.values(forgeDogs).filter(d => d && typeof d === 'object').map(dog => {
                                    const config = ForgeDogsConfig[dog.id];
                                    const canAfford = gold >= config.unlockCost.gold && tavernCoins >= config.unlockCost.tavernCoins;
                                    const isFlipped = flippedDog === dog.id;

                                    return (
                                        <div key={dog.id} className={`dog-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                            <div className={`dog-card dog-card-front ${dog.hired ? 'dog-hired' : ''} ${!canAfford && !dog.hired ? 'dog-cant-afford' : ''}`}>
                                                <button className="dog-info-btn" onClick={() => setFlippedDog(dog.id)}>i</button>
                                                <div className="dog-emoji">🔥</div>
                                                <div className="dog-name">{config.name}</div>
                                                {dog.hired ? (
                                                    <div className="dog-status">✔</div>
                                                ) : (
                                                    <>
                                                        <div className="dog-cost">
                                                            <span>{formatNumber2(config.unlockCost.gold)}</span>
                                                            <img src={iconGold} alt="oro" className="tavern-ingot-icon" />
                                                        </div>
                                                        <div className="dog-cost">
                                                            <span>{config.unlockCost.tavernCoins}</span>
                                                            <img src={coinTavern} alt="moneda" className="tavern-ingot-icon" />
                                                        </div>
                                                        <button
                                                            onClick={() => onHireForgeDog(dog.id)}
                                                            disabled={!canAfford}
                                                            className={`dog-hire-btn ${!canAfford ? 'locked' : ''}`}
                                                        >
                                                            Contratar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <div className="dog-card dog-card-back">
                                                <button className="dog-info-btn" onClick={() => setFlippedDog(null)}>✖</button>
                                                <div className="dog-name">{config.name}</div>
                                                <div className="dog-stat">⏱️ -{config.forgeBonus.timeReduction}s base</div>
                                                {config.forgeBonus.doubleIngot > 0 && (
                                                    <div className="dog-stat">✨ {config.forgeBonus.doubleIngot * 100}% doble lingote</div>
                                                )}
                                                <div className="dog-stat">🟤 Bronze: -{config.forgeBonus.biomeBonus.bronze}s</div>
                                                <div className="dog-stat">⚙️ Iron: -{config.forgeBonus.biomeBonus.iron}s</div>
                                                <div className="dog-stat">💎 Diamond: -{config.forgeBonus.biomeBonus.diamond}s</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TavernModal;