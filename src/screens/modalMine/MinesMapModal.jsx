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
    yacimientos = null,
    onPlantMena,
    onMineYacimiento,
    onRepairYacimiento,
    onUnlockYacimientoSlot,
    currentMaterials = {},
}) => {
    if (!isOpen) return null;

    const filteredUnlocked = unlockedTypes
        .filter(type => type !== 'gold')
        .filter(type => selectedBiome ? type === selectedBiome || type.startsWith(selectedBiome) : true);

    const filteredLocked = Object.keys(minesConfig)
        .filter(type => type !== 'gold' && !unlockedTypes.includes(type))
        .filter(type => selectedBiome ? type === selectedBiome || type.startsWith(selectedBiome) : true);

    const canAffordUnlock = (unlockCost) => currentGold >= unlockCost;
    const canAffordEnter = (mineType) => currentGold >= minesConfig[mineType]?.unlockCost;

    // Comprueba si la mena ya está lista para picar
    const isMenaReady = (mena) => {
        if (!mena) return false;
        if (mena.ready) return true;
        return Date.now() - mena.plantedAt >= mena.growthTime * 1000;
    };

    const isRepairing = (mena) => {
        if (!mena || !mena.repairingUntil) return false;
        return Date.now() < mena.repairingUntil;
    };

    const getRepairTimeLeft = (mena) => {
        if (!mena || !mena.repairingUntil) return 0;
        return Math.ceil((mena.repairingUntil - Date.now()) / 1000);
    };

    // Tiempo restante para que la mena esté lista
    const getGrowthTimeLeft = (mena) => {
        if (!mena || isMenaReady(mena)) return 0;
        const elapsed = (Date.now() - mena.plantedAt) / 1000;
        return Math.ceil(mena.growthTime - elapsed);
    };

    return (
        <div className="modal-overlay1" >
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

                    {/* YACIMIENTOS */}
                    {yacimientos && (
                        <div className="yacimientos-section">
                            <h3 className="yacimientos-title">⛏️ Yacimientos</h3>
                            <div className="yacimientos-slots">
                                {yacimientos.slots.map(slot => {
                                    const mena = slot.mena;
                                    const ready = isMenaReady(mena);
                                    const timeLeft = getGrowthTimeLeft(mena);

                                    if (!slot.unlocked) return (
                                        <div key={slot.id} className="yacimiento-slot locked">
                                            <p>🔒</p>
                                            <p>{yacimientos.unlockCosts[slot.id]} 💰</p>
                                            <button
                                                className="btn-unlock-slot"
                                                onClick={(e) => { e.stopPropagation(); onUnlockYacimientoSlot(slot.id); }}
                                                disabled={currentGold < yacimientos.unlockCosts[slot.id]}
                                            >
                                                Desbloquear
                                            </button>
                                        </div>
                                    );

                                    if (!mena) return (
                                        <div key={slot.id} className="yacimiento-slot empty">
                                            <p>🌱 Vacío</p>
                                            <button
                                                className="btn-plant-mena"
                                                onClick={(e) => { e.stopPropagation(); onPlantMena(slot.id, selectedBiome); }}
                                                disabled={!selectedBiome}
                                            >
                                                Plantar
                                            </button>
                                        </div>
                                    );

                                    return (
                                        <div key={slot.id} className={`yacimiento-slot active ${!ready ? 'growing' : ''}`}>
                                            <p>{mena.type === 'bronze' ? '🟤' : mena.type === 'iron' ? '⚫' : '💎'}</p>
                                            <p>{mena.durability}/{mena.maxDurability} ❤️</p>
                                            {!ready && <p>⏱️ {timeLeft}s</p>}
                                            {ready && (
                                                <button
                                                    className="btn-mine-mena"
                                                    onClick={(e) => { e.stopPropagation(); onMineYacimiento(slot.id); }}
                                                    disabled={isRepairing(mena)}
                                                >
                                                    ⛏️ Picar
                                                </button>
                                            )}
                                            {isRepairing(mena)
                                                ? <p>🔧 {getRepairTimeLeft(mena)}s</p>
                                                : <button
                                                    className="btn-repair-mena"
                                                    onClick={(e) => { e.stopPropagation(); onRepairYacimiento(slot.id); }}
                                                    disabled={mena.durability >= mena.maxDurability}
                                                >
                                                    🔧 {mena.repairCost} {mena.type}
                                                </button>
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MinesMapModal;