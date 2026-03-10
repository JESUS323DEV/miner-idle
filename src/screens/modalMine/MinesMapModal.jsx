import { useState, useEffect } from 'react';
import '../../styles/modals/MinesMapModal.css';



//ASSETS MENA BRONZE
import menaBronze1 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze2.png"
import menaBronze2 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.png"
//ASSETS MENA IRON
import menaIron1 from "../../assets/ui/icons-menas/menas-iron/mena-iron2.png"
import menaIron2 from "../../assets/ui/icons-menas/menas-iron/mena-iron3.png"

//ASSETS MENA DIAMOND
import menaDiamond1 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond2.png"
import menaDiamond2 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.png"



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

    const getMenaAsset = (slotId, type) => {
        const assets = {
            bronze: [menaBronze1, menaBronze2],
            iron: [menaIron1, menaIron2],
            diamond: [menaDiamond1, menaDiamond2],
        };
        return assets[type]?.[slotId - 1] || null;
    };

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
                    {yacimientos && selectedBiome && (
                        <div className="yacimientos-section">
                            <div className="yacimientos-slots">
                                {yacimientos[selectedBiome].slots.map(slot => {
                                    const mena = slot.mena;
                                    const ready = isMenaReady(mena);
                                    const timeLeft = getGrowthTimeLeft(mena);
                                    const config = mena ? yacimientos[selectedBiome].slotConfig[slot.id] : null;

                                    const unlockCost = yacimientos[selectedBiome].unlockCosts[slot.id];

                                    if (!slot.unlocked) return (
                                        <div key={slot.id} className="yacimiento-slot locked">
                                            <div className="mena-locked-container">
                                                <img
                                                    src={getMenaAsset(slot.id, selectedBiome)}
                                                    alt="locked"
                                                    className="mena-img mena-no-durability"
                                                />
                                                <span
                                                    className="mena-lock-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUnlockYacimientoSlot(slot.id, selectedBiome);
                                                    }}
                                                >
                                                    🔒
                                                </span>
                                            </div>
                                            <p className="mena-unlock-cost">{unlockCost.gold} 💰 · {unlockCost.amount} {selectedBiome}</p>
                                        </div>
                                    );

                                    if (!mena) return (
                                        <div key={slot.id} className="yacimiento-slot empty">
                                            <p>🌱 Vacío</p>
                                            <button
                                                className="btn-plant-mena"
                                                onClick={(e) => { e.stopPropagation(); onPlantMena(slot.id, selectedBiome); }}
                                            >
                                                Plantar {yacimientos[selectedBiome].plantCost.amount} {selectedBiome}
                                            </button>
                                        </div>
                                    );



                                    return (
                                        <div key={slot.id} className="yacimiento-slot active">
                                            <p className="mena-durability">{mena.durability}/{mena.maxDurability} ❤️</p>
                                            <img
                                                src={getMenaAsset(slot.id, mena.type)}
                                                alt={mena.type}
                                                className={`mena-img ${ready && !isRepairing(mena) ? 'mena-clickable' : 'mena-disabled'}`}
                                                onClick={(e) => {
                                                    if (ready && !isRepairing(mena)) {
                                                        e.stopPropagation();
                                                        onMineYacimiento(slot.id, selectedBiome);
                                                    }
                                                }}
                                            />
                                            <div className="mena-bottom">
                                                {!ready && <span>⏱️ {timeLeft}s</span>}
                                                {isRepairing(mena)
                                                    ? <span>🔧 {getRepairTimeLeft(mena)}s</span>
                                                    : <span
                                                        className={`repair-mena-btn ${mena.durability >= mena.maxDurability ? 'repair-disabled' : ''}`}
                                                        onClick={(e) => {
                                                            if (mena.durability < mena.maxDurability) {
                                                                e.stopPropagation();
                                                                onRepairYacimiento(slot.id, selectedBiome);
                                                            }
                                                        }}
                                                    >
                                                        🔧 {config?.repairCost}
                                                    </span>
                                                }
                                            </div>
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