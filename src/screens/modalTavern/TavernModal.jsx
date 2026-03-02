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
    onConvert,
    onConvertCoins,
}) => {
    const [view, setView] = useState('main');

    if (!isOpen) return null;

    const conversions = [
        { material: 'bronzeIngot', amount: 10, coins: 1, icon: '🔶' },
        { material: 'ironIngot', amount: 6, coins: 1, icon: '🔩' },
        { material: 'diamondIngot', amount: 2, coins: 1, icon: '💠' },
    ];
    const currentMaterials = {
        bronzeIngot: bronzeIngot,
        ironIngot: ironIngot,
        diamondIngot: diamondIngot
    };

    return (
        <div className="tavern-overlay" onClick={onClose} style={{ backgroundImage: `url(${bgTavern})` }}>
            <div className="tavern-content" onClick={(e) => e.stopPropagation()}>
                <button className="tavern-close" onClick={onClose}><X /></button>

                {view === 'main' && (
                    <>
                        <h2 className="tavern-title">🏛️ TABERNA</h2>
                        <div className="tavern-coins">Monedas: {tavernCoins} 🪙</div>
                        <div className="tavern-menu">
                            <button className="tavern-menu-btn" onClick={() => setView('cambista')}>
                                💱 Cambista
                            </button>
                        </div>
                    </>
                )}

                {view === 'cambista' && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default TavernModal;