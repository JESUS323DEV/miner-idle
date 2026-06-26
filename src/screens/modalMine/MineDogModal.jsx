import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Swords, Pickaxe, Star } from 'lucide-react';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { dogAssets } from '../../game/utils/dogAssets.js';

const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2 };

const getDogStatus = (dog) => {
    if (!dog.assignedTo) return 'available';
    const a = dog.assignedTo;
    if (a.mineComp !== undefined) return 'inMineComp';
    if (a.type === 'raid') return 'inRaid';
    if (a.biome) return 'inYacimiento';
    if (a.globalSlot !== undefined) return 'inSlot';
    return 'unavailable';
};

const fmtTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function MineDogModal({ isOpen, onClose, mineId, dogs, onAssign, onUnassign }) {
    const [raritySort, setRaritySort] = useState(null);

    if (!isOpen) return null;

    const assignedDog = Object.values(dogs).find(
        d => d && typeof d === 'object' && !Array.isArray(d) && d.assignedTo?.mineComp === mineId
    ) || null;
    const isLocked = (assignedDog?.mineCompTimer?.remaining ?? 0) > 0;

    const pool = Object.entries(dogs)
        .filter(([key, d]) => key !== 'globalSlots' && d && typeof d === 'object' && d.hired)
        .map(([id, d]) => ({ id, dog: d, cfg: DogsConfig[id], status: getDogStatus(d) }))
        .sort((a, b) => {
            if (raritySort) {
                const aFirst = a.cfg?.rarity === raritySort ? 0 : 1;
                const bFirst = b.cfg?.rarity === raritySort ? 0 : 1;
                if (aFirst !== bFirst) return aFirst - bFirst;
            }
            return (RARITY_ORDER[a.cfg?.rarity] ?? 9) - (RARITY_ORDER[b.cfg?.rarity] ?? 9);
        });

    const assignedCfg = assignedDog ? DogsConfig[assignedDog.id] : null;

    return createPortal(
        <>
            <div className="gds-overlay" onClick={onClose} />
            <div className="gds-modal">
                <div className="gds-header">
                    <button className="gds-close" onClick={onClose}><X size={16} /></button>
                    <div className="gds-tabs">
                        <span className="gds-tab active">Minero</span>
                    </div>
                </div>

                <div className="gds-rarity-bar">
                    {['legendary', 'epic', 'rare'].map(r => (
                        <button
                            key={r}
                            className={`gds-rarity-btn rarity-${r}${raritySort === r ? ' active' : ''}`}
                            onClick={() => setRaritySort(raritySort === r ? null : r)}
                        >
                            {r === 'legendary' ? 'Leg.' : r === 'epic' ? 'Épico' : 'Raro'}
                        </button>
                    ))}
                </div>

                <div className="gds-grid">
                    {pool.length === 0 && <span className="gds-empty">Sin mascotas mineras disponibles</span>}
                    {pool.map(({ id, dog, cfg, status }) => {
                        const unavailable = status !== 'available';
                        return (
                            <div
                                key={id}
                                className={`gds-card dog-rarity-${cfg?.rarity}${unavailable ? ' unavailable' : ''}`}
                                onClick={() => { if (!unavailable) onAssign(id, mineId); }}
                            >
                                <div className="gds-card-img-wrap">
                                    <img src={dogAssets[id]} className="gds-card-img" alt={id} />
                                    {(status === 'inMineComp' || status === 'inYacimiento' || status === 'inSlot') && <span className="gds-status-badge"><Pickaxe size={9} /></span>}
                                    {status === 'inRaid' && <span className="gds-status-badge"><Swords size={9} /></span>}
                                </div>
                                <span className="gds-card-name">{cfg?.name ?? id}</span>
                                <div className="fdm-card-stars">
                                    {[0,1,2,3,4].map(i => (
                                        <Star key={i} size={8} fill={i < (dog.stars ?? 0) ? '#f5c842' : 'none'} color={i < (dog.stars ?? 0) ? '#f5c842' : '#555'} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="gds-slots-row">
                    <div className="gds-slot-wrap">
                        <div className="gds-modal-slot-wrap">
                            <div className={`gds-modal-slot${assignedCfg ? ` dog-rarity-${assignedCfg.rarity}` : ''}`}>
                                {assignedDog ? (
                                    <>
                                        <img src={dogAssets[assignedDog.id]} className="global-dog-slot-img" alt={assignedDog.id} />
                                        {isLocked && (
                                            <div className="dog-slot-timer-overlay">
                                                <span className="mdc-slot-timer">{fmtTimer(assignedDog.mineCompTimer.remaining)}</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <span className="global-dog-slot-plus">+</span>
                                )}
                            </div>
                            {assignedDog && (
                                <button className="gds-slot-unassign" onClick={() => onUnassign(assignedDog.id)}>
                                    <X size={9} />
                                </button>
                            )}
                        </div>
                        {assignedDog && (
                            <span className="gds-slot-name">{assignedCfg?.name ?? assignedDog.id}</span>
                        )}
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
