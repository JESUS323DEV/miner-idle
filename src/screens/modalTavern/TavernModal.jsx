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
    rocky: forgeIcon1, bruno: forgeIcon2, max: forgeIcon3,
    rex: forgeIcon1,   toby: forgeIcon2, buddy: forgeIcon3,
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
        handleConvertMaterial: onConvert,
        handleConvertCoinsToGold: onConvertCoins,

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
                                <span className="tavern-card-icon-emoji">🐕</span>
                                <div className="tavern-card-info">
                                    <span className="tavern-card-name">Ayudantes</span>
                                    <span className="tavern-card-desc">Contrata y gestiona tus mascotas</span>
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
                                            <div className={`dog-card dog-card-front dog-rarity-${config.rarity} ${dog.hired ? 'dog-hired' : ''} ${!canAfford && !dog.hired ? 'dog-cant-afford' : ''}`}>
                                                <button className="dog-info-btn" onClick={() => setFlippedDog(dog.id)}>ℹ</button>
                                                <span className={`dog-rarity-badge dog-rarity-${config.rarity}`}>{config.rarity}</span>
                                                <img src={dogAssets[dog.id]} className="dog-portrait" alt={config.name} />
                                                <div className="dog-name">{config.name}</div>
                                                {dog.hired ? (
                                                    <div className="dog-status">✔</div>
                                                ) : (
                                                    <>
                                                        <div className="dog-cost-row">
                                                            <span>{formatNumber2(config.unlockCost.gold)}</span>
                                                            <img src={iconGold} alt="oro" className="tavern-ingot-icon" />
                                                            <span className="dog-cost-sep">+</span>
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
                                            <div className={`dog-card dog-card-back dog-card-back-${dog.id}`}>
                                                <button className="dog-info-btn" onClick={() => setFlippedDog(null)}>✖</button>
                                                <div className="dog-name">{config.name}</div>

                                                <div className="dog-stat-section">
                                                    <div className="dog-stat-row">
                                                        <span className="dog-stat-label"><img src={pickaxeStone} className="dog-stat-icon" /> Poder minado</span>
                                                        <span className="dog-stat-val">{config.miningPower}</span>
                                                    </div>
                                                    <div className="dog-stat-row">
                                                        <span className="dog-stat-label">⏳ Vel. ataque</span>
                                                        <span className="dog-stat-val">{config.miningSpeed}s</span>
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
                                {Object.values(forgeDogs).filter(d => d && typeof d === 'object').map(dog => {
                                    const config = ForgeDogsConfig[dog.id];
                                    const canAfford = gold >= config.unlockCost.gold && tavernCoins >= config.unlockCost.tavernCoins;
                                    const isFlipped = flippedDog === dog.id;

                                    return (
                                        <div key={dog.id} className={`dog-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                            <div className={`dog-card dog-card-front dog-rarity-${config.rarity} ${dog.hired ? 'dog-hired' : ''} ${!canAfford && !dog.hired ? 'dog-cant-afford' : ''}`}>
                                                <button className="dog-info-btn" onClick={() => setFlippedDog(dog.id)}>ℹ</button>
                                                <span className={`dog-rarity-badge dog-rarity-${config.rarity}`}>{config.rarity}</span>
                                                <img src={forgeDogAssets[dog.id]} className="dog-portrait" alt={config.name} />
                                                <div className="dog-name">{config.name}</div>
                                                {dog.hired ? (
                                                    <div className="dog-status">✔</div>
                                                ) : (
                                                    <>
                                                        <div className="dog-cost-row">
                                                            <span>{formatNumber2(config.unlockCost.gold)}</span>
                                                            <img src={iconGold} alt="oro" className="tavern-ingot-icon" />
                                                            <span className="dog-cost-sep">+</span>
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
            </div>
        </div>
    );
};

export default TavernModal;