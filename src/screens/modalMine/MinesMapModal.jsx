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
    selectedBiome = null,
    bgImage = null,
}) => {
    if (!isOpen) return null;

    const filteredUnlocked = unlockedTypes
        .filter(type => type !== 'gold')
        .filter(type => selectedBiome ? type === selectedBiome || type.startsWith(selectedBiome) : true);

    const filteredLocked = Object.keys(minesConfig)
        .filter(type => type !== 'gold' && !unlockedTypes.includes(type))
        .filter(type => selectedBiome ? type === selectedBiome || type.startsWith(selectedBiome) : true);

    const getMineYield = (mineType) => {
        const yields = minesConfig[mineType]?.yields;
        if (!yields) return null;
        const yieldRange = yields[currentPickaxeMaterial];
        return yieldRange ? `${yieldRange.min}-${yieldRange.max}` : '0';
    };

    const canAffordUnlock = (unlockCost) => currentGold >= unlockCost;
    const canAffordEnter = (mineType) => currentGold >= minesConfig[mineType]?.unlockCost;

    return (
        <div className="modal-overlay1" onClick={onClose}>
            <div className="mines-modal-content" onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
            >
                {/* HEADER */}
                <div className="mines-modal-header">
                    <h2>MINA DE {selectedBiome ? selectedBiome.toUpperCase() : 'MAPA DE MINAS'}</h2>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                {/* CONTENIDO */}
                <div className="mines-content">

                    {/* MINAS DESBLOQUEADAS */}
                    {filteredUnlocked.length > 0 && filteredUnlocked.map(type => {
                        const config = minesConfig[type];
                        if (!config) return null;

                        const baseMineType = type.replace('_lvl2', '').replace('_lvl3', '');
                        const level = type.includes('_lvl3') ? 'lvl3' : type.includes('_lvl2') ? 'lvl2' : 'lvl1';
                        const canEnter = canAffordEnter(type);

                        return (
                            <div key={type} className={`mine-card mine-card-${baseMineType} mine-card-${level}`}>
                                <div className="mine-card-actions">
                                    <button
                                        className={`btn-enter-mine ${!canEnter ? 'disabled' : ''}`}
                                        onClick={() => canEnter && onEnterMine(type)}
                                        disabled={!canEnter}
                                    >
                                        {canEnter ? 'Entrar' : `${config.unlockCost} 💰`}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* MINAS BLOQUEADAS */}
                    {filteredLocked.map(type => {
                        const config = minesConfig[type];
                        const canAfford = canAffordUnlock(config.unlockCost);
                        const meetsStarRequirement = config.requiresStars
                            ? (bestScores?.[config.requiresStars.mineType] ?? 0) >= config.requiresStars.stars
                            : true;
                        const canUnlock = canAfford && meetsStarRequirement;

                        const baseMineType = type.replace('_lvl2', '').replace('_lvl3', '');
                        const level = type.includes('_lvl3') ? 'lvl3' : type.includes('_lvl2') ? 'lvl2' : 'lvl1';

                        return (
                            <div key={type} className={`mine-card locked mine-card-${baseMineType} mine-card-${level}`}>
                                <div className="mine-card-body">
                                    {config.requiresStars && !meetsStarRequirement && (
                                        <div className="mine-info-row">
                                            <span className="cannot-afford1">
                                                {config.requiresStars.stars}⭐ en {config.requiresStars.mineType}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="mine-card-actions">
                                    <button
                                        className={`btn-unlock-mine ${!canUnlock ? 'disabled' : ''}`}
                                        onClick={() => { if (canUnlock) onUnlockType(type); }}
                                        disabled={!canUnlock}
                                    >
                                        {config.unlockCost} 🪙
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default MinesMapModal;