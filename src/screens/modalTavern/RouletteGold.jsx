import { useState, useRef } from 'react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import PrizeOverlay from '../../components/PrizeOverlay.jsx';

import iconGold   from "../../assets/ui/icons-hud/hud-principal/oro1.webp";
import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp";

const SECTORS = [
    { pct: 30, color: '#0d4a1a', type: 'gold_mult', mult: 1.5, label: 'x1.5' },
    { pct: 20, color: '#6b0000', type: 'gold_mult', mult: 0,   label: 'x0'   },
    { pct: 15, color: '#4a0066', type: 'coin',                  label: 'Coin' },
    { pct: 15, color: '#2a005a', type: 'coin',                  label: 'Coin' },
    { pct: 13, color: '#0a2060', type: 'gold_mult', mult: 2,   label: 'x2'   },
    { pct: 7,  color: '#6b5000', type: 'gold_mult', mult: 3,   label: 'x3'   },
];

const BET_OPTIONS = [5000, 10000, 15000];

const N = SECTORS.length;
const SECTOR_DEG = 360 / N;

const buildCumulative = () => {
    let cum = 0;
    return SECTORS.map(s => { const start = cum; cum += s.pct; return { ...s, start, end: cum }; });
};
const SECTORS_CUM = buildCumulative();

const buildGradient = () => {
    const segPct = 100 / N;
    return `conic-gradient(from 0deg, ${SECTORS.map((s, i) =>
        `${s.color} ${(i * segPct).toFixed(6)}% ${((i + 1) * segPct).toFixed(6)}%`
    ).join(', ')})`;
};
const GRADIENT = buildGradient();

const getVisualMidDeg = (i) => i * SECTOR_DEG + SECTOR_DEG / 2;

const rollResult = () => {
    const r = Math.random() * 100;
    const idx = SECTORS_CUM.findIndex(s => r >= s.start && r < s.end);
    return idx < 0 ? 0 : idx;
};

const getSectorIcon = (s) => {
    if (s.type === 'coin') return coinTavern;
    return null;
};

const fmt = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace('.0', '')}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`;
    return String(n);
};

const getPrizeData = (sector, bet) => {
    if (sector.type === 'gold_mult') {
        if (sector.mult === 0) return {
            icon: iconGold, isWin: false, sfx: 'blocked',
            label: 'Sin suerte', sublabel: `Pierdes ${fmt(bet)} oro`,
        };
        const win = Math.floor(bet * sector.mult);
        return {
            icon: iconGold, isWin: true, sfx: 'rewardGold',
            label: `+${fmt(win)} oro`, sublabel: sector.label,
        };
    }
    if (sector.type === 'coin') return {
        icon: coinTavern, isWin: true, sfx: 'rewardCoin',
        label: '+3 monedas', sublabel: 'de taberna',
    };
    return null;
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

export default function RouletteGold() {
    const { gameState, setGameState } = useGameContext();
    const [isSpinning, setIsSpinning]         = useState(false);
    const [rotation, setRotation]             = useState(0);
    const [wheelTransition, setWheelTransition] = useState('none');
    const [prizeData, setPrizeData]           = useState(null);
    const [bet, setBet]                       = useState(5000);
    const rotRef = useRef(0);

    const canAfford = gameState.gold >= bet;

    const spin = () => {
        if (isSpinning || !canAfford) return;

        const currentBet = bet;
        setGameState(prev => ({ ...prev, gold: prev.gold - currentBet }));
        setPrizeData(null);
        setIsSpinning(true);
        setWheelTransition('transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)');

        const winnerIdx = rollResult();
        const winner = SECTORS_CUM[winnerIdx];
        const targetAngle = (360 - getVisualMidDeg(winnerIdx)) % 360;

        const currentAngle = rotRef.current % 360;
        let diff = targetAngle - currentAngle;
        if (diff < 0) diff += 360;
        const target = rotRef.current + diff + 8 * 360;

        setRotation(target);
        rotRef.current = target;

        setTimeout(() => {
            setIsSpinning(false);
            setGameState(prev => {
                if (winner.type === 'gold_mult') return { ...prev, gold: prev.gold + (winner.mult === 0 ? 0 : currentBet + Math.floor(currentBet * winner.mult)) };
                if (winner.type === 'coin') return { ...prev, tavernCoins: prev.tavernCoins + 3 };
return prev;
            });
            const prize = getPrizeData(winner, currentBet);
            setPrizeData(prize);
            playSfx(prize.sfx);
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
                        const mid = getVisualMidDeg(i);
                        const midRad = (mid * Math.PI) / 180;
                        const radius = 62;
                        const x = Math.sin(midRad) * radius;
                        const y = -Math.cos(midRad) * radius;
                        const icon = getSectorIcon(s);
                        return (
                            <div
                                key={i}
                                className="roulette-sector-item"
                                style={{ top: `calc(50% + ${y}px)`, left: `calc(50% + ${x}px)` }}
                            >
                                <img src={icon ?? iconGold} className="roulette-sector-icon" alt="" />
                                <span className="roulette-sector-text">{s.label}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="roulette-hub" />
            </div>

            <div className="roulette-bet-area">
                <span className="roulette-bet-label">Apuesta</span>
                <div className="roulette-bet-btns">
                    {BET_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            className={`roulette-bet-btn ${bet === opt ? 'rbet-active' : ''}`}
                            onClick={() => setBet(opt)}
                            disabled={isSpinning}
                        >
                            {fmt(opt)}
                        </button>
                    ))}
                </div>
            </div>

            <button
                className="roulette-spin-btn"
                onClick={spin}
                disabled={isSpinning || !canAfford}
            >
                {isSpinning ? 'Girando...' : 'Girar'}
            </button>

            {!canAfford && !isSpinning && (
                <p className="roulette-warn">Oro insuficiente</p>
            )}

        </div>
    );
}
