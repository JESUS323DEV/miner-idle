import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import '../../styles/modals/TavernModal.css';
import { TavernConfig } from '../../game/config/TavernConfig';
import { DogsConfig } from '../../game/config/DogsConfig';

import bgTavern from "../../assets/backgrounds/bg-tavern/bg-tavern1.png"
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"
import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.png"
import ingotBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.png"
import ingotIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.png"
import ingotDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.png"

import bgGold from "../../assets/backgrounds/bg-tavern/bg-gold.png"
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

const TavernModal = ({
    isOpen,
    onClose,
    bronzeIngot,
    ironIngot,
    diamondIngot,
    tavernCoins,
    gold,
    onConvert,
    onConvertCoins,
    onConvertGoldToIngot,
    dogs = {},
    onHireDog,
}) => {
    const [view, setView] = useState('main');

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
                    <div className='tavern-cambista' style={{ backgroundImage: `url(${bgGold})` }}>
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

                <button className="tavern-menu-btn" onClick={() => setView('perros')}>
                    <span className='cont-btn-cambista'>
                        <span style={{ fontSize: '2rem' }}>🐕</span>
                        <small>Perros</small>
                    </span>
                </button>

                {view === 'perros' && (
                    <div className='tavern-cambista' style={{ backgroundImage: `url(${bgCoin})` }}>
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
                        <h2 className="tavern-title">🐕 Perros Mineros</h2>
                        <p className="tavern-subtitle">Contrata perros para automatizar tus yacimientos</p>

                        <div className="tavern-conversions">
                            {Object.values(dogs).map(dog => {
                                const config = DogsConfig[dog.id];
                                const canAfford = gold >= config.unlockCost.gold && tavernCoins >= config.unlockCost.tavernCoins;

                                return (
                                    <div key={dog.id} className="tavern-conversion-row">
                                        <div className="tavern-conversion-info">
                                            <span className="tavern-conversion-text">
                                                🐕 <strong>{config.name}</strong>
                                            </span>
                                            {!dog.hired && (
                                                <span className="tavern-conversion-text">
                                                    {formatNumber2(config.unlockCost.gold)}
                                                    <img src={iconGold} alt="oro" className="tavern-ingot-icon" />
                                                    + {config.unlockCost.tavernCoins}
                                                    <img src={coinTavern} alt="moneda" className="tavern-ingot-icon" />
                                                </span>
                                            )}
                                        </div>
                                        {dog.hired
                                            ? <span style={{ color: '#4caf50' }}>✔ Contratada</span>
                                            : (
                                                <button
                                                    onClick={() => onHireDog(dog.id)}
                                                    disabled={!canAfford}
                                                    className={`tavern-convert-btn ${!canAfford ? 'locked' : ''}`}
                                                >
                                                    Contratar
                                                </button>
                                            )
                                        }
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