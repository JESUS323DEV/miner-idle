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

    // Filtra minas según bioma seleccionado
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

    return (
        <div className="modal-overlay1" onClick={onClose} >
            <div className="mines-modal-content" onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}

            >

                {/* HEADER */}
                <div className="mines-modal-header">
                    <h2>🗺️ {selectedBiome ? selectedBiome.toUpperCase() : 'MAPA DE MINAS'}</h2>
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
                        return (
                            <div key={type} className={`mine-card mine-card-${baseMineType} mine-card-${level}`}>

                                <div className="mine-card-header" style={{ borderColor: config.color }}>
                                    <h3>{config.name}</h3>
                                </div>

                                <div className="mine-card-body">
                                    <div className="mine-info-row">
                                        <span>Drop:</span>
                                        <span className="mine-value">{getMineYield(type)}</span>
                                    </div>
                                    <div className="mine-info-row">
                                        <span>Menas:</span>
                                        <span className="mine-value">{config.baseVeinsCount.min}-{config.baseVeinsCount.max}</span>
                                    </div>
                                </div>

                                <div className="mine-card-actions">
                                    <button className="btn-enter-mine" onClick={() => onEnterMine(type)}>
                                        ENTRAR ➡️
                                    </button>
                                    {onDiscardMine && (
                                        <button className="btn-discard-mine" onClick={() => onDiscardMine(type)}>
                                            DESCARTAR
                                        </button>
                                    )}
                                </div>


                            </div>
                        );
                    })}

                    {/* MINAS BLOQUEADAS */}
                    {filteredLocked.map(type => {
                        const config = minesConfig[type];
                        const canAfford = canAffordUnlock(config.unlockCost);
                        const meetsStarRequirement = config.requiresStars
                            ? (bestScores?.[config.requiresStars.mineType] || 0) >= config.requiresStars.stars
                            : true;
                        const canUnlock = canAfford && meetsStarRequirement;

                        const baseMineType = type.replace('_lvl2', '').replace('_lvl3', '');
                        const level = type.includes('_lvl3') ? 'lvl3' : type.includes('_lvl2') ? 'lvl2' : 'lvl1';

                        return (
                            <div key={type} className={`mine-card locked mine-card-${baseMineType} mine-card-${level}`}>
                                <div className="mine-card-header" >
                                    <span className="lock-icon">🔒</span>
                                    <p className="mine-description">{config.name}</p>

                                    <span className={`mine-value ${canAfford ? 'can-afford' : 'cannot-afford'}`}>
                                        {config.unlockCost} 🪙
                                    </span>
                                </div>

                                <div className="mine-card-body">

                                    {config.requiresStars && (
                                        <div className="mine-info-row">
                                            <span>Requisito:</span>
                                            <span className={`mine-value ${meetsStarRequirement ? 'can-afford' : 'cannot-afford'}`}>
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
                                        {!meetsStarRequirement ? '🔒 ' :
                                            !canAfford ? '🔒' : '🔓 '}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Sin minas */}
                    {filteredUnlocked.length === 0 && filteredLocked.length === 0 && (
                        <p className="no-mines">No hay minas disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MinesMapModal;