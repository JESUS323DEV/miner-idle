import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Flame, Star } from 'lucide-react';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig';
import { dogAssets } from '../../game/utils/dogAssets';

const MATERIALS = ['bronze', 'iron', 'diamond'];
const MATERIAL_NAMES = { bronze: 'Bronze', iron: 'Hierro', diamond: 'Diamante' };
const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2 };

export default function ForgeDogModal({ isOpen, onClose, targetMaterial, setTarget, forgeDogs, onAssign, onUnassign }) {
    const [materialFilter, setMaterialFilter] = useState(null);
    const [flippedCard, setFlippedCard] = useState(null);

    if (!isOpen) return null;

    const dogs = Object.entries(forgeDogs)
        .filter(([, d]) => d && typeof d === 'object' && d.hired)
        .map(([id, d]) => ({ ...d, id }));

    const sorted = [...dogs].sort((a, b) => {
        if (materialFilter) {
            const ab = ForgeDogsConfig[a.id]?.forgeBonus?.biomeBonus?.[materialFilter] ?? 0;
            const bb = ForgeDogsConfig[b.id]?.forgeBonus?.biomeBonus?.[materialFilter] ?? 0;
            if (ab !== bb) return bb - ab;
        }
        return (RARITY_ORDER[ForgeDogsConfig[a.id]?.rarity] ?? 9) - (RARITY_ORDER[ForgeDogsConfig[b.id]?.rarity] ?? 9);
    });

    return createPortal(
        <>
            <div className="gds-overlay" onClick={onClose} />
            <div className="fdm-modal">
                <div className="fdm-header">
                    <button className="fdm-close" onClick={onClose}><X size={16} /></button>
                    <div className="fdm-tabs">
                        <span className="fdm-tab active">Perros de Forja</span>
                    </div>
                </div>

                <div className="fdm-filter-bar">
                    {MATERIALS.map(mat => (
                        <button
                            key={mat}
                            className={`fdm-mat-btn fdm-mat-${mat}${materialFilter === mat ? ' active' : ''}`}
                            onClick={() => setMaterialFilter(materialFilter === mat ? null : mat)}
                        >
                            {MATERIAL_NAMES[mat]}
                        </button>
                    ))}
                </div>

                <div className="fdm-body">
                    <div className="fdm-slots-col">
                        {MATERIALS.map(mat => {
                            const assigned = dogs.find(d => d.assignedTo === mat);
                            const cfg = assigned ? ForgeDogsConfig[assigned.id] : null;
                            const isTarget = mat === targetMaterial;
                            return (
                                <div key={mat} className="fdm-slot-item" onClick={() => setTarget(mat)}>
                                    <div className={`gds-modal-slot${cfg ? ` dog-rarity-${cfg.rarity}` : ''}${isTarget ? ' fdm-target-slot' : ''}`}>
                                        {assigned
                                            ? <img src={dogAssets[assigned.id]} className="fdm-slot-img" alt={assigned.id} />
                                            : <span className="fdm-slot-plus">+</span>
                                        }
                                        {assigned && (
                                            <button
                                                className="gds-slot-unassign"
                                                onClick={e => { e.stopPropagation(); onUnassign(assigned.id); }}
                                            >
                                                <X size={9} />
                                            </button>
                                        )}
                                    </div>
                                    <span className="fdm-slot-label">{MATERIAL_NAMES[mat]}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="fdm-dogs-col">
                        <div className="fdm-grid">
                            {sorted.length === 0 && (
                                <span className="fdm-empty">Sin mascotas de forja disponibles</span>
                            )}
                            {sorted.map(dog => {
                                const cfg = ForgeDogsConfig[dog.id];
                                const assignedToTarget = dog.assignedTo === targetMaterial;
                                const assignedElsewhere = dog.assignedTo && !assignedToTarget;
                                return (
                                    <div key={dog.id} className={`fdm-card-wrapper${flippedCard === dog.id ? ' flipped' : ''}${assignedElsewhere ? ' unavailable' : ''}${assignedToTarget ? ' fdm-card-active' : ''}`}>
                                        <div className={`fdm-card fdm-card-face fdm-card-front dog-rarity-${cfg?.rarity}`}
                                            onClick={() => !assignedElsewhere && onAssign(dog.id)}
                                        >
                                            <button className="fdm-info-btn" onClick={e => { e.stopPropagation(); setFlippedCard(dog.id); }}>i</button>
                                            <div className="fdm-card-img-wrap">
                                                <img src={dogAssets[dog.id]} className="fdm-card-img" alt={dog.id} />
                                                {dog.assignedTo && <span className="fdm-status-badge"><Flame size={9} /></span>}
                                            </div>
                                            <span className="fdm-card-name">{cfg?.name ?? dog.id}</span>
                                            <div className="fdm-card-stars">
                                                {[0,1,2,3,4].map(i => (
                                                    <Star key={i} size={8} fill={i < (dog.stars ?? 0) ? '#f5c842' : 'none'} color={i < (dog.stars ?? 0) ? '#f5c842' : '#555'} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="fdm-card fdm-card-face fdm-card-back">
                                            <button className="fdm-info-btn" onClick={e => { e.stopPropagation(); setFlippedCard(null); }}><X size={8} /></button>
                                            <span className="fdm-back-name">{cfg?.name ?? dog.id}</span>
                                            {cfg?.forgeBonus?.timeReduction > 0 && <span className="fdm-back-stat">-{cfg.forgeBonus.timeReduction}s fundición</span>}
                                            {cfg?.forgeBonus?.doubleIngot > 0 && <span className="fdm-back-stat">{Math.round(cfg.forgeBonus.doubleIngot * 100)}% 2x lingote</span>}
                                            {MATERIALS.map(m => cfg?.forgeBonus?.biomeBonus?.[m] > 0 && (
                                                <span key={m} className="fdm-back-stat">+{cfg.forgeBonus.biomeBonus[m]} {MATERIAL_NAMES[m]}</span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
