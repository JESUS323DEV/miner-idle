import { useState, useEffect } from 'react';
import '../../styles/modals/MinesMapModal.css';
import { X } from 'lucide-react';

const MinesMapModal = ({
    isOpen,
    onClose,
    unlockedTypes,
    minesConfig,
    onUnlockType,
    bestScores,
    onEnterMine,
    onDiscardMine,
    currentGold,
    currentPickaxeMaterial,
    initialTab = 'disponibles'
}) => {
    const [activeTab, setActiveTab] = useState('disponibles');

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const getMineYield = (mineType) => {
        const yields = minesConfig[mineType]?.yields;
        if (!yields) return null;
        const yieldRange = yields[currentPickaxeMaterial];
        return yieldRange ? `${yieldRange.min}-${yieldRange.max}` : '0';
    };

    const canAffordUnlock = (unlockCost) => {
        return currentGold >= unlockCost;
    };

    return (
        <div className="modal-overlay1" onClick={onClose}>
            <div className="mines-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="mines-modal-header">
                    <h2>🗺️ MAPA DE MINAS</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* TABS */}
                <div className="mines-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'disponibles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('disponibles')}
                    >
                        DISPONIBLES
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'desbloquear' ? 'active' : ''}`}
                        onClick={() => setActiveTab('desbloquear')}
                    >
                        DESBLOQUEAR
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="mines-content">

                    {/* TAB: DISPONIBLES */}
                    {activeTab === 'disponibles' && (
                        <div className="tab-disponibles">
                            {unlockedTypes.length === 0 ? (
                                <p className="no-mines">No tienes minas desbloqueadas aún.</p>
                            ) : (
                                unlockedTypes
                                    .filter(type => type !== 'gold')
                                    .map(type => {
                                        const config = minesConfig[type];
                                        if (!config) return null;

                                        const isLvl2 = type.includes('_lvl2');

                                        return (
                                            <div key={type} className={`mine-card ${isLvl2 ? 'lvl2' : ''}`}>
                                                <div className="mine-card-header" style={{ borderColor: config.color }}>
                                                    <h3>{config.name}</h3>
                                                </div>

                                                <div className="mine-card-body">
                                                    <div className="mine-info-row">
                                                        <span>Drop:</span>
                                                        <span className="mine-value">
                                                            {getMineYield(type)}
                                                        </span>
                                                    </div>
                                                    <div className="mine-info-row">
                                                        <span>Menas:</span>
                                                        <span className="mine-value">
                                                            {config.baseVeinsCount.min}-{config.baseVeinsCount.max}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mine-card-actions">
                                                    <button
                                                        className="btn-enter-mine"
                                                        onClick={() => onEnterMine(type)}
                                                    >
                                                        ENTRAR ➡️
                                                    </button>
                                                    {onDiscardMine && (
                                                        <button
                                                            className="btn-discard-mine"
                                                            onClick={() => onDiscardMine(type)}
                                                        >
                                                            DESCARTAR
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    )}

                    {/* TAB: DESBLOQUEAR */}
                    {activeTab === 'desbloquear' && (
                        <div className="tab-desbloquear">
                            {Object.keys(minesConfig)
                                .filter(type => type !== 'gold' && !unlockedTypes.includes(type))
                                .map(type => {
                                    const config = minesConfig[type];
                                    const canAfford = canAffordUnlock(config.unlockCost);

                                    // ✅ VERIFICA REQUISITOS DE ESTRELLAS
                                    const meetsStarRequirement = config.requiresStars
                                        ? (bestScores?.[config.requiresStars.mineType] || 0) >= config.requiresStars.stars
                                        : true;

                                    const canUnlock = canAfford && meetsStarRequirement;

                                    return (
                                        <div key={type} className="mine-card locked">
                                            <div className="mine-card-header" style={{ borderColor: config.color }}>
                                                <h3>{config.name}</h3>
                                                <span className="lock-icon">🔒</span>
                                            </div>

                                            <div className="mine-card-body">
                                                <p className="mine-description">{config.description || "Desbloquea para acceder a esta mina."}</p>

                                                {/* ✅ MUESTRA REQUISITO SI LO TIENE */}
                                                {config.requiresStars && (
                                                    <div className="mine-info-row">
                                                        <span>Requisito:</span>
                                                        <span className={`mine-value ${meetsStarRequirement ? 'can-afford' : 'cannot-afford'}`}>
                                                            {config.requiresStars.stars}⭐ en {config.requiresStars.mineType}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="mine-info-row">
                                                    <span>Coste desbloqueo:</span>
                                                    <span className={`mine-value ${canAfford ? 'can-afford' : 'cannot-afford'}`}>
                                                        {config.unlockCost} 🪙
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mine-card-actions">
                                                <button
                                                    className={`btn-unlock-mine ${!canUnlock ? 'disabled' : ''}`}
                                                    onClick={() => {
                                                        if (canUnlock) {
                                                            onUnlockType(type);
                                                            setTimeout(() => {
                                                                setActiveTab('disponibles');
                                                            }, 500);
                                                        }
                                                    }}
                                                    disabled={!canUnlock}
                                                >
                                                    {!meetsStarRequirement ? '🔒 REQUIERE ESTRELLAS' :
                                                        !canAfford ? '🔒 BLOQUEADO' :
                                                            '🔓 DESBLOQUEAR'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MinesMapModal;