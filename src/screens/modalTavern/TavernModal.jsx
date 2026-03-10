import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import '../../styles/modals/TavernModal.css';

import bgTavern from "../../assets/backgrounds/bg-tavern/bg-tavern.png"

const TavernModal = ({
    isOpen,
    onClose,
    bronze,
    iron,
    diamond,
    bronzeIngot,
    ironIngot,
    diamondIngot,
    tavernCoins,
    gold,
    onConvert,
    onConvertCoins,
    onConvertGoldToIngot,
}) => {
    const [view, setView] = useState('main');

    if (!isOpen) return null;

    const conversions = [
        { material: 'bronzeIngot', amount: 10, coins: 1, icon: '🔶' },
        { material: 'ironIngot', amount: 6, coins: 1, icon: '🔩' },
        { material: 'diamondIngot', amount: 2, coins: 1, icon: '💠' },
    ];

    const goldConversions = [
        { ingot: 'bronzeIngot', gold: 10000, coins: 0, icon: '🔶', label: 'Lingote Bronze' },
        { ingot: 'ironIngot', gold: 20000, coins: 0, icon: '🔩', label: 'Lingote Iron' },
        { ingot: 'diamondIngot', gold: 0, coins: 1, icon: '💠', label: 'Lingote Diamond' },
    ];

    const currentMaterials = {
        bronzeIngot,
        ironIngot,
        diamondIngot,
    };

    return (
        <div className="tavern-overlay" onClick={onClose} style={{ backgroundImage: `url(${bgTavern})` }}>
            <div className="tavern-content" onClick={(e) => e.stopPropagation()}>
                <button className="tavern-close" onClick={onClose}><X /></button>

                {/* MAIN */}
                {view === 'main' && (
                    <>
                        <h2 className="tavern-title">🏛️ TABERNA</h2>
                        <div className="tavern-coins">Monedas: {tavernCoins} 🪙</div>
                        <div className="tavern-menu">
                            <button className="tavern-menu-btn" onClick={() => setView('cambista')}>
                                💱 Cambista
                            </button>
                            <button className="tavern-menu-btn" onClick={() => setView('cambista-oro')}>
                                🪙 Cambista de Oro
                            </button>
                        </div>
                    </>
                )}

                {/* CAMBISTA LINGOTES → MONEDAS */}
                {view === 'cambista' && (
                    <div className='tavern-cambista'>
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
                        <h2 className="tavern-title">💱 Cambista</h2>
                        <div className="tavern-coins">Monedas: {tavernCoins} 🪙</div>
                        <p className="tavern-subtitle">Convierte materiales en monedas de taberna</p>
                        <div className="tavern-conversions">
                            {conversions.map(conv => {
                                const hasEnough = currentMaterials[conv.material] >= conv.amount;
                                return (
                                    <div key={conv.material} className="tavern-conversion-row">
                                        <div className="tavern-conversion-info">
                                            <span className="tavern-conversion-icon">{conv.icon}</span>
                                            <span className="tavern-conversion-text">{conv.amount} → {conv.coins} 🪙</span>
                                            <div className="tavern-conversion-have">Tienes: {currentMaterials[conv.material]}</div>
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
                                    <span className="tavern-conversion-icon">🪙</span>
                                    <span className="tavern-conversion-text">1 🪙 → 5000 oro</span>
                                    <div className="tavern-conversion-have">Tienes: {tavernCoins} 🪙</div>
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
                    <div className='tavern-cambista'>
                        <button className="tavern-back-btn" onClick={() => setView('main')}>
                            <ArrowLeft /> Volver
                        </button>
                        <h2 className="tavern-title">🪙 Cambista de Oro</h2>
                        <div className="tavern-coins">Oro: {gold} 💰 | Monedas: {tavernCoins} 🪙</div>
                        <p className="tavern-subtitle">Compra lingotes con oro o monedas</p>
                        <div className="tavern-conversions">
                            {goldConversions.map(conv => {
                                const canAfford = conv.coins > 0
                                    ? tavernCoins >= conv.coins
                                    : gold >= conv.gold;
                                const costLabel = conv.coins > 0
                                    ? `${conv.coins} 🪙`
                                    : `${conv.gold.toLocaleString()} 💰`;

                                return (
                                    <div key={conv.ingot} className="tavern-conversion-row">
                                        <div className="tavern-conversion-info">
                                            <span className="tavern-conversion-icon">{conv.icon}</span>
                                            <span className="tavern-conversion-text">{costLabel} → 1 {conv.label}</span>
                                            <div className="tavern-conversion-have">Tienes: {currentMaterials[conv.ingot]}</div>
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

            </div>
        </div>
    );
};

export default TavernModal;