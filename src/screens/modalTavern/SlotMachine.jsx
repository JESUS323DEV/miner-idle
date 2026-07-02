import { useState, useRef } from 'react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import PrizeOverlay from '../../components/PrizeOverlay.jsx';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { playSfx } from '../../game/utils/sfx.js';

import coinTavern    from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp";
import ladyIcon      from "../../assets/ui/icons-pets/mineros/lady-icon.webp";
import tokyoIcon     from "../../assets/ui/icons-pets/mineros/tokyo-icon.webp";
import tukaIcon      from "../../assets/ui/icons-pets/mineros/tuka-icon.webp";
import munaIcon      from "../../assets/ui/icons-pets/mineros/muna-icon.webp";
import smokeIcon     from "../../assets/ui/icons-pets/mineros/smoke-icon.webp";
import nupitoIcon    from "../../assets/ui/icons-pets/mineros/nupito-icon.webp";
import bullyIcon     from "../../assets/ui/icons-pets/mineros/bully-icon.webp";
import chihuahuaIcon from "../../assets/ui/icons-pets/mineros/chihuhua-icon.webp";

import '../../styles/modals/SlotMachine.css';

const SLOT_DOGS = [
    { id: 'bully',     rarity: 'epic',      weight: 2567 },
    { id: 'smoke',     rarity: 'epic',      weight: 2567 },
    { id: 'nupito',    rarity: 'epic',      weight: 2566 },
    { id: 'chihuahua', rarity: 'legendary', weight: 1000 },
    { id: 'muna',      rarity: 'legendary', weight: 1000 },
    { id: 'tuka',      rarity: 'legendary', weight: 100  },
    { id: 'lady',      rarity: 'legendary', weight: 100  },
    { id: 'tokio',     rarity: 'legendary', weight: 100  },
];

const TOTAL_WEIGHT = SLOT_DOGS.reduce((acc, d) => acc + d.weight, 0);
const weightedRnd = () => {
    let r = Math.floor(Math.random() * TOTAL_WEIGHT);
    for (const dog of SLOT_DOGS) {
        r -= dog.weight;
        if (r < 0) return dog;
    }
    return SLOT_DOGS[SLOT_DOGS.length - 1];
};

const DOG_ICONS = {
    bully: bullyIcon, smoke: smokeIcon, nupito: nupitoIcon,
    chihuahua: chihuahuaIcon, tuka: tukaIcon, muna: munaIcon,
    lady: ladyIcon, tokio: tokyoIcon,
};

const RARITY_BORDER = { epic: '#b45cff', legendary: '#fbb534' };
const RARITY_LABEL  = { epic: 'Épico', legendary: 'Legendario' };

const SYMBOL_H      = 72;
const STRIP_LEN     = 30;
const RESULT_IDX    = 25;
const FINAL_OFFSET  = -(RESULT_IDX - 1) * SYMBOL_H;
const SPIN_DURATIONS = [2400, 2900, 3400];
const SPIN_COST     = 50;

const rnd = (n) => Math.floor(Math.random() * n);

const buildStrip = (targetId) => {
    const strip = Array.from({ length: STRIP_LEN }, () => weightedRnd());
    strip[RESULT_IDX] = SLOT_DOGS.find(d => d.id === targetId);
    return strip;
};

export default function SlotMachine({ guaranteed }) {
    const { gameState, setGameState } = useGameContext();

    const [isSpinning, setIsSpinning]   = useState(false);
    const [prizeData, setPrizeData]     = useState(null);
    const [strips, setStrips]           = useState(() =>
        [0, 1, 2].map(() => buildStrip(SLOT_DOGS[rnd(SLOT_DOGS.length)].id))
    );
    const [offsets, setOffsets]         = useState([FINAL_OFFSET, FINAL_OFFSET, FINAL_OFFSET]);
    const [transitions, setTransitions] = useState(['none', 'none', 'none']);

    const resultsRef  = useRef(null);
    const canAfford   = gameState.tavernCoins >= SPIN_COST;

    const spin = () => {
        if (isSpinning) return;
        if (!guaranteed && !canAfford) return;

        let results;
        if (guaranteed) {
            const winner = weightedRnd();
            results = [winner, winner, winner];
            setGameState(prev => ({ ...prev, slotWelcomeDone: true }));
        } else {
            results = Array.from({ length: 3 }, () => weightedRnd());
            setGameState(prev => ({ ...prev, tavernCoins: prev.tavernCoins - SPIN_COST }));
        }
        resultsRef.current = results;

        setIsSpinning(true);
        setTransitions(['none', 'none', 'none']);
        setOffsets([0, 0, 0]);

        requestAnimationFrame(() => {
            setStrips(results.map(r => buildStrip(r.id)));
            requestAnimationFrame(() => {
                setTransitions(SPIN_DURATIONS.map(d => `transform ${d}ms cubic-bezier(0.1, 0.5, 0.2, 1.0)`));
                setOffsets([FINAL_OFFSET, FINAL_OFFSET, FINAL_OFFSET]);

                setTimeout(() => {
                    setIsSpinning(false);
                    const res = resultsRef.current;
                    const [r0, r1, r2] = res;

                    // Detectar coincidencias
                    let matchId = null;
                    let matchCount = 0;
                    if (r0.id === r1.id && r1.id === r2.id) {
                        matchId = r0.id; matchCount = 3;
                    } else if (r0.id === r1.id) {
                        matchId = r0.id; matchCount = 2;
                    } else if (r0.id === r2.id) {
                        matchId = r0.id; matchCount = 2;
                    } else if (r1.id === r2.id) {
                        matchId = r1.id; matchCount = 2;
                    }

                    if (guaranteed) {
                        // Versión bienvenida: siempre 3 iguales → desbloquear perro
                        const winner = r0;
                        const config = DogsConfig[winner.id];
                        setGameState(prev => {
                            const dog = prev.dogs[winner.id];
                            const globalSlots = prev.dogs.globalSlots ?? [null, null, null];
                            const emptyIdx = globalSlots.findIndex(id => id === null);
                            const newSlots = emptyIdx !== -1
                                ? globalSlots.map((id, i) => i === emptyIdx ? winner.id : id)
                                : globalSlots;
                            const assignedTo = emptyIdx !== -1 ? { globalSlot: emptyIdx } : null;
                            return {
                                ...prev,
                                dogs: {
                                    ...prev.dogs,
                                    globalSlots: newSlots,
                                    [winner.id]: {
                                        ...dog,
                                        hired: true,
                                        assignedTo,
                                        fragments: Math.max(dog?.fragments ?? 0, config.unlockFragments),
                                    },
                                },
                            };
                        });
                        const prize = {
                            icon: DOG_ICONS[winner.id],
                            isWin: true,
                            sfx: 'rewardShards',
                            label: `${config.name} desbloqueado`,
                            sublabel: RARITY_LABEL[winner.rarity],
                        };
                        playSfx(prize.sfx);
                        setPrizeData(prize);
                        return;
                    }

                    // Versión premium
                    if (matchCount === 0) {
                        const prize = { icon: coinTavern, isWin: false, sfx: 'blocked', label: 'Sin suerte', sublabel: 'Los tres carretes son distintos' };
                        playSfx(prize.sfx);
                        setPrizeData(prize);
                        return;
                    }

                    const frags = matchCount === 3 ? 100 : 20;
                    const config = DogsConfig[matchId];
                    setGameState(prev => {
                        const dog = prev.dogs[matchId];
                        return {
                            ...prev,
                            dogs: {
                                ...prev.dogs,
                                [matchId]: { ...dog, fragments: (dog?.fragments ?? 0) + frags },
                            },
                        };
                    });
                    const prize = {
                        icon: DOG_ICONS[matchId],
                        isWin: true,
                        sfx: 'rewardShards',
                        label: `+${frags} fragmentos`,
                        sublabel: matchCount === 3 ? `${config.name} · Premio gordo` : `${config.name} · ${RARITY_LABEL[config.rarity]}`,
                    };
                    playSfx(prize.sfx);
                    setPrizeData(prize);
                }, SPIN_DURATIONS[2] + 200);
            });
        });
    };

    return (
        <div className="slot-machine-wrap">
            <PrizeOverlay prizeData={prizeData} onAccept={() => setPrizeData(null)} />

            {guaranteed && (
                <div className="slot-welcome-banner">
                    Tirada de bienvenida garantizada
                </div>
            )}

            <div className="slot-frame">
                <div className="slot-reels-row">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="slot-reel-window">
                            <div
                                className="slot-reel-strip"
                                style={{
                                    transform: `translateY(${offsets[i]}px)`,
                                    transition: transitions[i],
                                }}
                            >
                                {strips[i].map((dog, j) => (
                                    <div key={j} className="slot-symbol">
                                        <img
                                            src={DOG_ICONS[dog.id]}
                                            className="slot-dog-icon"
                                            style={{ borderColor: RARITY_BORDER[dog.rarity] }}
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="slot-payline" />
                <div className="slot-mask slot-mask-top" />
                <div className="slot-mask slot-mask-bottom" />
            </div>

            {guaranteed ? (
                <p className="slot-info">Solo épicos y legendarios — siempre garantizado</p>
            ) : (
                <div className="slot-cost-row">
                    <img src={coinTavern} className="slot-coin-icon" alt="" />
                    <span>{SPIN_COST} monedas por tirada</span>
                </div>
            )}

            <button
                className="slot-spin-btn"
                onClick={spin}
                disabled={isSpinning || (!guaranteed && !canAfford)}
            >
                {isSpinning ? 'Girando...' : guaranteed ? 'Girar — Gratis' : 'Girar'}
            </button>

            {!guaranteed && !canAfford && !isSpinning && (
                <p className="slot-warn">Monedas insuficientes</p>
            )}
        </div>
    );
}
