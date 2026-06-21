import { useState, useRef } from 'react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import PrizeOverlay from '../../components/PrizeOverlay.jsx';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig.js';

import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.png";

import ladyIcon    from "../../assets/ui/icons-pets/mineros/lady-icon.png";
import tokyoIcon   from "../../assets/ui/icons-pets/mineros/tokyo-icon.png";
import tukaIcon    from "../../assets/ui/icons-pets/mineros/tuka-icon.png";
import munaIcon    from "../../assets/ui/icons-pets/mineros/muna-icon.png";
import gordoIcon   from "../../assets/ui/icons-pets/mineros/gordo-icon.png";
import druhIcon    from "../../assets/ui/icons-pets/mineros/druh-icon.png";
import smokeIcon   from "../../assets/ui/icons-pets/mineros/smoke-icon.png";
import nupitoIcon  from "../../assets/ui/icons-pets/mineros/nupito-icon.png";
import zeusIcon    from "../../assets/ui/icons-pets/mineros/zeus-icon.png";
import boxerIcon   from "../../assets/ui/icons-pets/mineros/boxer-icon.png";
import bullyIcon   from "../../assets/ui/icons-pets/mineros/bully-icon.png";
import chihuahuaIcon from "../../assets/ui/icons-pets/mineros/chihuhua-icon.png";
import pipIcon     from "../../assets/ui/icons-pets/forge/forge-icon1.png";
import kodaIcon    from "../../assets/ui/icons-pets/forge/forge-icon2.png";
import miloIcon    from "../../assets/ui/icons-pets/forge/forge-icon3.png";
import rockyIcon   from "../../assets/ui/icons-pets/forge/forge-icon4.png";
import brunoIcon   from "../../assets/ui/icons-pets/forge/forge-icon5.png";
import maxIcon     from "../../assets/ui/icons-pets/forge/forge-icon6.png";
import rexIcon     from "../../assets/ui/icons-pets/forge/forge-icon7.png";
import tobyIcon    from "../../assets/ui/icons-pets/forge/forge-icon8.png";
import buddyIcon   from "../../assets/ui/icons-pets/forge/forge-icon9.png";

const DOG_ICONS = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon, muna: munaIcon,
    gordo: gordoIcon, druh: druhIcon, smoke: smokeIcon, nupito: nupitoIcon,
    zeus: zeusIcon, boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
    pip: pipIcon, koda: kodaIcon, milo: miloIcon, rocky: rockyIcon,
    bruno: brunoIcon, max: maxIcon, rex: rexIcon, toby: tobyIcon, buddy: buddyIcon,
};

const RARITY_BORDER  = { rare: '#4ca8ff', epic: '#b45cff', legendary: '#fbb534' };
const SECTOR_COLORS  = {
    rare:      ['#0d1830', '#152240', '#0a1428', '#1a2a4a'],
    epic:      '#2a0050',
    legendary: '#3d2800',
    nothing:   '#180f0f',
};

const SPIN_COST = 2;
const SHARDS_PER_RARITY = { rare: 30, epic: 60, legendary: 100 };
const RARITY_LABEL = { rare: 'Raro', epic: 'Épico', legendary: 'Legendario' };

const FIXED_RARES = ['boxer', 'druh', 'gordo', 'zeus'];

// Solo epic y legendary rotan. 8 sets para cubrir todos los legendarios.
const SETS = [
    { epic: 'smoke',  legendary: 'muna'      },
    { epic: 'bruno',  legendary: 'lady'      },
    { epic: 'nupito', legendary: 'tuka'      },
    { epic: 'max',    legendary: 'chihuahua' },
    { epic: 'rocky',  legendary: 'tokio'     },
    { epic: 'bully',  legendary: 'rex'       },
    { epic: 'smoke',  legendary: 'toby'      },
    { epic: 'max',    legendary: 'buddy'     },
];

// Set 1 (Muna) arranca el 21-06-2026
const ROTATION_START = new Date('2026-06-21').getTime();

const getActiveSet = () => {
    const daysSinceStart = Math.floor((Date.now() - ROTATION_START) / 86400000);
    return SETS[Math.floor(Math.max(0, daysSinceStart) / 5) % SETS.length];
};

const buildSectors = (set) => {
    const [r1, r2, r3, r4] = FIXED_RARES;
    const makeShard = (dogId, rarity, colorIdx = 0) => ({
        type: 'shard', dogId, rarity,
        isForge: !!ForgeDogsConfig[dogId],
        pct: rarity === 'rare' ? 21.875 : rarity === 'epic' ? 1.5 : 1.0,
        color: Array.isArray(SECTOR_COLORS[rarity]) ? SECTOR_COLORS[rarity][colorIdx] : SECTOR_COLORS[rarity],
    });
    return [
        makeShard(r1, 'rare', 0),
        makeShard(set.epic, 'epic'),
        makeShard(r2, 'rare', 1),
        makeShard(set.legendary, 'legendary'),
        makeShard(r3, 'rare', 2),
        { type: 'nothing', pct: 10, color: SECTOR_COLORS.nothing },
        makeShard(r4, 'rare', 3),
    ];
};

const buildCumulative = (sectors) => {
    let cum = 0;
    return sectors.map(s => { const start = cum; cum += s.pct; return { ...s, start, end: cum }; });
};

const buildGradient = (sectors) => {
    const N = sectors.length;
    const seg = 100 / N;
    return `conic-gradient(from 0deg, ${sectors.map((s, i) =>
        `${s.color} ${(i * seg).toFixed(6)}% ${((i + 1) * seg).toFixed(6)}%`
    ).join(', ')})`;
};

const getVisualMidDeg = (i, N) => i * (360 / N) + (360 / N) / 2;

const rollResult = (sectorsCum) => {
    const r = Math.random() * 100;
    const idx = sectorsCum.findIndex(s => r >= s.start && r < s.end);
    return idx < 0 ? 0 : idx;
};

const getPrizeData = (sector) => {
    if (sector.type === 'nothing') return {
        icon: coinTavern, isWin: false, sfx: 'blocked',
        label: 'Sin suerte', sublabel: `Pierdes ${SPIN_COST} monedas`,
    };
    const frags = SHARDS_PER_RARITY[sector.rarity];
    const name = sector.isForge
        ? ForgeDogsConfig[sector.dogId]?.name
        : DogsConfig[sector.dogId]?.name;
    return {
        icon: DOG_ICONS[sector.dogId],
        isWin: true, sfx: 'rewardShards',
        label: `+${frags} fragmentos`,
        sublabel: `${name} · ${RARITY_LABEL[sector.rarity]}`,
    };
};

const resetWheel = (rotRef, setWheelTransition, setRotation) => {
    const equiv = rotRef.current % 360;
    setWheelTransition('none');
    setRotation(equiv);
    rotRef.current = 0;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setWheelTransition('transform 0.6s ease-in-out');
            setRotation(0);
        });
    });
};

const ACTIVE_SET   = getActiveSet();
const SECTORS      = buildSectors(ACTIVE_SET);
const N            = SECTORS.length;
const SECTORS_CUM  = buildCumulative(SECTORS);
const GRADIENT     = buildGradient(SECTORS);

export default function RouletteShards() {
    const { gameState, setGameState } = useGameContext();
    const [isSpinning, setIsSpinning]     = useState(false);
    const [rotation, setRotation]         = useState(0);
    const [wheelTransition, setWheelTransition] = useState('none');
    const [prizeData, setPrizeData]       = useState(null);
    const rotRef = useRef(0);

    const canAfford = gameState.tavernCoins >= SPIN_COST;

    const spin = () => {
        if (isSpinning || !canAfford) return;

        setGameState(prev => ({ ...prev, tavernCoins: prev.tavernCoins - SPIN_COST }));
        setPrizeData(null);
        setIsSpinning(true);
        setWheelTransition('transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)');

        const winnerIdx = rollResult(SECTORS_CUM);
        const winner    = SECTORS_CUM[winnerIdx];
        const targetAngle = (360 - getVisualMidDeg(winnerIdx, N)) % 360;

        const currentAngle = rotRef.current % 360;
        let diff = targetAngle - currentAngle;
        if (diff < 0) diff += 360;
        const target = rotRef.current + diff + 8 * 360;

        setRotation(target);
        rotRef.current = target;

        setTimeout(() => {
            setIsSpinning(false);
            if (winner.type === 'shard') {
                setGameState(prev => {
                    const key = winner.isForge ? 'forgeDogs' : 'dogs';
                    const dog = prev[key][winner.dogId];
                    return {
                        ...prev,
                        [key]: { ...prev[key], [winner.dogId]: { ...dog, fragments: (dog.fragments ?? 0) + SHARDS_PER_RARITY[winner.rarity] } },
                    };
                });
            }
            setPrizeData(getPrizeData(winner));
        }, 4100);
    };

    const handleAccept = () => {
        setPrizeData(null);
        resetWheel(rotRef, setWheelTransition, setRotation);
    };

    return (
        <div className="roulette-gold-wrap">
            <PrizeOverlay prizeData={prizeData} onAccept={handleAccept} />

            <div className="roulette-wheel-area">
                <div className="roulette-pointer" />
                <div
                    className="roulette-wheel"
                    style={{
                        background: GRADIENT,
                        transform: `rotate(${rotation}deg)`,
                        transition: wheelTransition,
                    }}
                >
                    {SECTORS.map((s, i) => {
                        const mid    = getVisualMidDeg(i, N);
                        const midRad = (mid * Math.PI) / 180;
                        const radius = 62;
                        const x = Math.sin(midRad) * radius;
                        const y = -Math.cos(midRad) * radius;
                        return (
                            <div
                                key={i}
                                className="roulette-sector-item"
                                style={{ top: `calc(50% + ${y}px)`, left: `calc(50% + ${x}px)` }}
                            >
                                {s.type === 'shard' && (
                                    <img
                                        src={DOG_ICONS[s.dogId]}
                                        className="rs-dog-icon"
                                        style={{ borderColor: RARITY_BORDER[s.rarity] }}
                                        alt=""
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="roulette-hub" />
            </div>

            <div className="roulette-cost-row rs-cost-purple">
                <img src={coinTavern} className="roulette-ico" alt="" />
                <span className="roulette-cost-label">{SPIN_COST} monedas por tirada</span>
            </div>

            <button
                className="roulette-spin-btn"
                onClick={spin}
                disabled={isSpinning || !canAfford}
            >
                {isSpinning ? 'Girando...' : 'Girar'}
            </button>

            {!canAfford && !isSpinning && (
                <p className="roulette-warn">Monedas insuficientes</p>
            )}
        </div>
    );
}
