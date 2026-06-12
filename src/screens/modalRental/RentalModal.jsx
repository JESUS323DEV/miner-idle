import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { RentalConfig } from '../../game/config/RentalConfig.js';
import '../../styles/modals/TavernModal.css';
import '../../styles/modals/RentalModal.css';

import ladyIcon from '../../assets/ui/icons-pets/mineros/lady-icon.png';
import tokyoIcon from '../../assets/ui/icons-pets/mineros/tokyo-icon.png';
import tukaIcon from '../../assets/ui/icons-pets/mineros/tuka-icon.png';
import munaIcon from '../../assets/ui/icons-pets/mineros/muna-icon.png';
import gordoIcon from '../../assets/ui/icons-pets/mineros/gordo-icon.png';
import druhIcon from '../../assets/ui/icons-pets/mineros/druh-icon.png';
import smokeIcon from '../../assets/ui/icons-pets/mineros/smoke-icon.png';
import nupitoIcon from '../../assets/ui/icons-pets/mineros/nupito-icon.png';
import zeusIcon from '../../assets/ui/icons-pets/mineros/zeus-icon.png';

import iconGold from '../../assets/ui/icons-hud/hud-principal/oro1.png';
import staminaIcon from '../../assets/ui/icons-hud/hud-principal/stamina-1.png';
import pickaxeStone from '../../assets/ui/icons-pickaxe/Pickaxe/pickaxe-stone/stone.png';
import menaBronze from '../../assets/ui/icons-menas/menas-bronze/mena-bronze3.png';
import menaIron from '../../assets/ui/icons-menas/menas-iron/mena-iron3.png';
import menaDiamond from '../../assets/ui/icons-menas/menas-diamond/mena-diamond3.png';

import bgCoin from '../../assets/backgrounds/bg-tavern/bg-coin.png';

const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
};

const formatMs = (ms) => {
    const totalSec = Math.ceil(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const RentalModal = ({ isOpen, onClose }) => {
    const { gameState, setGameState } = useGameContext();
    const [cardFlipped, setCardFlipped] = useState(false);
    const [flippedActiveIdx, setFlippedActiveIdx] = useState(null);

    useEffect(() => {
        setCardFlipped(false);
    }, [gameState.rental?.available?.dogId]);

    if (!isOpen) return null;

    const rental = gameState.rental;
    const firstFreeSlot = (gameState.dogs?.globalSlots ?? [null, null, null]).findIndex(s => s === null);

    const handleRentDog = (destination) => {
        const available = rental?.available;
        if (!available || gameState.gold < available.cost) return;
        if (destination === 'slot' && firstFreeSlot === -1) return;
        setGameState(prev => {
            const newEntry = {
                dogId: available.dogId,
                rarity: available.rarity,
                cost: available.cost,
                remainingMs: RentalConfig.rentalDurationMs,
                destination,
                assignedSlot: null,
            };
            if (destination === 'slot') {
                const slots = [...(prev.dogs.globalSlots ?? [null, null, null])];
                const slot = slots.findIndex(s => s === null);
                if (slot === -1) return prev;
                slots[slot] = available.dogId;
                newEntry.assignedSlot = slot;
                return {
                    ...prev,
                    gold: prev.gold - available.cost,
                    dogs: { ...prev.dogs, globalSlots: slots },
                    rental: {
                        ...prev.rental,
                        available: null,
                        appearanceRemainingMs: RentalConfig.reappearanceMs,
                        active: [...(prev.rental.active ?? []), newEntry],
                    },
                };
            }
            return {
                ...prev,
                gold: prev.gold - available.cost,
                rental: {
                    ...prev.rental,
                    available: null,
                    appearanceRemainingMs: RentalConfig.reappearanceMs,
                    active: [...(prev.rental.active ?? []), newEntry],
                },
            };
        });
    };

    const handleDiscard = () => {
        setGameState(prev => ({
            ...prev,
            rental: { ...prev.rental, available: null, appearanceRemainingMs: RentalConfig.reappearanceMs },
        }));
    };

    const checkOnRaid = (dogId) =>
        (gameState.raid?.passiveRaids ?? []).some(r => r.dogEntries?.some(d => d.id === dogId));

    const hasCards = rental?.available || (rental?.active?.length > 0);

    return (
        <div className="rm-overlay" onClick={onClose} style={{ backgroundImage: `url(${bgCoin})` }}>
            <div className="rm-content" onClick={e => e.stopPropagation()}>
                <button className="rm-close" onClick={onClose}><X /></button>
                <h2 className="rm-title">Alquiler</h2>

                {/* Recargando — solo si no hay perro disponible */}
                {!rental?.available && (
                    <div className="rm-recharging">
                        <p className="rm-recharging-label">Buscando ayudante...</p>
                        <span className="rm-recharging-timer">{formatMs(rental?.appearanceRemainingMs ?? 0)}</span>
                    </div>
                )}

                {/* Grid de tarjetas */}
                {hasCards && (
                    <div className="dogs-grid rm-grid">

                        {/* Perro disponible */}
                        {rental?.available && (() => {
                            const avail = rental.available;
                            const config = DogsConfig[avail.dogId];
                            const dogState = gameState.dogs?.[avail.dogId];
                            const stars = dogState?.stars ?? 0;
                            const canAfford = gameState.gold >= avail.cost;
                            const hasSlot = firstFreeSlot !== -1;
                            return (
                                <div className={`dog-card-wrapper rm-avail-wrapper ${cardFlipped ? 'flipped' : ''}`}>
                                    <div className={`dog-card dog-card-front dog-rarity-${avail.rarity} rental-card-available`}>
                                        <button className="dog-info-btn" onClick={() => setCardFlipped(true)}>i</button>
                                        <span className={`dog-rarity-badge dog-rarity-${avail.rarity}`}>{avail.rarity}</span>
                                        <img src={dogAssets[avail.dogId]} className="dog-portrait" alt={config?.name} />
                                        <div className="dog-name">{config?.name}</div>
                                        <div className="dog-stars-row">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <span key={s} className={`dog-star ${stars >= s ? 'dog-star-active' : ''}`}>★</span>
                                            ))}
                                        </div>
                                        <div className="rental-cost">
                                            <img src={iconGold} className="rental-cost-icon" alt="oro" />
                                            <span className={canAfford ? 'cost-ok' : 'cost-missing'}>{avail.cost.toLocaleString()}</span>
                                        </div>
                                        <div className="rental-dest-choice">
                                            <button
                                                className={`rental-dest-btn rental-dest-slot ${!canAfford || !hasSlot ? 'locked' : ''}`}
                                                onClick={() => handleRentDog('slot')}
                                                disabled={!canAfford || !hasSlot}
                                            >
                                                Asignar a Oro
                                                {!hasSlot && <span className="rental-dest-hint">sin slots</span>}
                                            </button>
                                            <button
                                                className={`rental-dest-btn rental-dest-raid ${!canAfford ? 'locked' : ''}`}
                                                onClick={() => handleRentDog('raid')}
                                                disabled={!canAfford}
                                            >
                                                Asignar a Raids
                                            </button>
                                        </div>
                                        <button className="rental-btn-discard" onClick={handleDiscard}>Descartar</button>
                                    </div>
                                    <div className={`dog-card dog-card-back dog-card-back-${avail.dogId}`}>
                                        <button className="dog-info-btn" onClick={() => setCardFlipped(false)}>✖</button>
                                        <div className="dog-name">{config?.name}</div>
                                        <div className="dog-stat-section">
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><img src={pickaxeStone} className="dog-stat-icon" /> Poder minado</span>
                                                <span className="dog-stat-val">{config?.miningPower}</span>
                                            </div>
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label">Velocidad</span>
                                                <span className="dog-stat-val">{(() => { const pps = 1 / config.miningSpeed; return pps >= 1 ? `${parseFloat(pps.toFixed(2))} pic/s` : `1 pic/${config.miningSpeed}s`; })()}</span>
                                            </div>
                                        </div>
                                        <div className="dog-stat-divider">Bonus bioma</div>
                                        <div className="dog-stat-section">
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><img src={menaBronze} className="dog-stat-icon-lg" /> Bronce</span>
                                                <span className={`dog-stat-val ${config?.biomeBonus?.bronze > 1 ? 'dog-stat-bonus' : ''}`}>x{config?.biomeBonus?.bronze}</span>
                                            </div>
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><img src={menaIron} className="dog-stat-icon-lg" /> Hierro</span>
                                                <span className={`dog-stat-val ${config?.biomeBonus?.iron > 1 ? 'dog-stat-bonus' : ''}`}>x{config?.biomeBonus?.iron}</span>
                                            </div>
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><img src={menaDiamond} className="dog-stat-icon-lg" /> Diamante</span>
                                                <span className={`dog-stat-val ${config?.biomeBonus?.diamond > 1 ? 'dog-stat-bonus' : ''}`}>x{config?.biomeBonus?.diamond}</span>
                                            </div>
                                        </div>
                                        <div className="dog-stat-divider">Pasiva oro</div>
                                        <div className="dog-stat-passive">
                                            {config?.goldMineBonus?.type === 'extraGold' && <><b>+{config.goldMineBonus.value}</b> de <img src={iconGold} className="dog-stat-icon" /> extra por picada</>}
                                            {config?.goldMineBonus?.type === 'freeHit' && <><b>{config.goldMineBonus.chance * 100}%</b> de reducir la recarga de <img src={staminaIcon} className="dog-stat-icon" /> picando</>}
                                            {config?.goldMineBonus?.type === 'doubleHit' && <><b>+{config.goldMineBonus.chance * 100}%</b> de doblar <img src={iconGold} className="dog-stat-icon" /> minado</>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Alquileres activos */}
                        {(rental?.active ?? []).map((act, idx) => {
                            const config = DogsConfig[act.dogId];
                            const dogState = gameState.dogs?.[act.dogId];
                            const frags = dogState?.fragments ?? 0;
                            const required = config?.unlockFragments ?? 50;
                            const onRaid = checkOnRaid(act.dogId);
                            const destLabel = act.destination === 'raid'
                                ? (onRaid ? 'En raid' : 'Preparado para raids')
                                : 'Activo en Oro';
                            const isFlipped = flippedActiveIdx === idx;
                            return (
                                <div key={idx} className={`dog-card-wrapper rm-active-wrapper ${isFlipped ? 'flipped' : ''}`}>
                                    <div className={`dog-card dog-card-front dog-rarity-${act.rarity} dog-hired`}>
                                        <button className="dog-info-btn" onClick={() => setFlippedActiveIdx(idx)}>i</button>
                                        <span className={`dog-rarity-badge dog-rarity-${act.rarity}`}>{act.rarity}</span>
                                        <img src={dogAssets[act.dogId]} className="dog-portrait" alt={config?.name} />
                                        <div className="dog-name">{config?.name}</div>
                                        <div className={`rental-dest-status ${act.destination === 'raid' ? 'rental-dest-status-raid' : 'rental-dest-status-slot'}`}>
                                            {destLabel}
                                        </div>
                                        <div className="rental-active-timer">
                                            <span className="rental-timer-label">Tiempo restante</span>
                                            <span className="rental-timer-value">{formatMs(act.remainingMs)}</span>
                                        </div>
                                        <p className="rental-frag-row">🧩 {frags} / {required}</p>
                                    </div>
                                    <div className={`dog-card dog-card-back dog-card-back-${act.dogId}`}>
                                        <button className="dog-info-btn" onClick={() => setFlippedActiveIdx(null)}>✖</button>
                                        <div className="dog-name">{config?.name}</div>
                                        <div className="dog-stat-section">
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><img src={pickaxeStone} className="dog-stat-icon" /> Poder minado</span>
                                                <span className="dog-stat-val">{config?.miningPower}</span>
                                            </div>
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label">Velocidad</span>
                                                <span className="dog-stat-val">{(() => { const pps = 1 / config.miningSpeed; return pps >= 1 ? `${parseFloat(pps.toFixed(2))} pic/s` : `1 pic/${config.miningSpeed}s`; })()}</span>
                                            </div>
                                        </div>
                                        <div className="dog-stat-divider">Bonus bioma</div>
                                        <div className="dog-stat-section">
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><img src={menaBronze} className="dog-stat-icon-lg" /> Bronce</span>
                                                <span className={`dog-stat-val ${config?.biomeBonus?.bronze > 1 ? 'dog-stat-bonus' : ''}`}>x{config?.biomeBonus?.bronze}</span>
                                            </div>
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><img src={menaIron} className="dog-stat-icon-lg" /> Hierro</span>
                                                <span className={`dog-stat-val ${config?.biomeBonus?.iron > 1 ? 'dog-stat-bonus' : ''}`}>x{config?.biomeBonus?.iron}</span>
                                            </div>
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><img src={menaDiamond} className="dog-stat-icon-lg" /> Diamante</span>
                                                <span className={`dog-stat-val ${config?.biomeBonus?.diamond > 1 ? 'dog-stat-bonus' : ''}`}>x{config?.biomeBonus?.diamond}</span>
                                            </div>
                                        </div>
                                        <div className="dog-stat-divider">Pasiva oro</div>
                                        <div className="dog-stat-passive">
                                            {config?.goldMineBonus?.type === 'extraGold' && <><b>+{config.goldMineBonus.value}</b> de <img src={iconGold} className="dog-stat-icon" /> extra por picada</>}
                                            {config?.goldMineBonus?.type === 'freeHit' && <><b>{config.goldMineBonus.chance * 100}%</b> de reducir la recarga de <img src={staminaIcon} className="dog-stat-icon" /> picando</>}
                                            {config?.goldMineBonus?.type === 'doubleHit' && <><b>+{config.goldMineBonus.chance * 100}%</b> de doblar <img src={iconGold} className="dog-stat-icon" /> minado</>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
};

export default RentalModal;
