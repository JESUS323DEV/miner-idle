import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/GoldMine.css';
import { CombosConfig } from '../game/config/CombosConfig.js';
import menaGold from '../assets/scenes/mining/mena-gold5.png';
import { useGameContext } from '../game/context/GameContext.jsx';
import { playBuffer } from '../game/utils/sfx.js';
import { useFloatingNumbers } from '../game/hooks/useFloatingNumbers.js';
import { DogsConfig } from '../game/config/DogsConfig.js';

const calcBurstBonus = (level) => {
    let bMin = 0, bMax = 1;
    if (level <= 1) { bMin = 0; bMax = 1; }
    else if (level <= 5) { bMin = 0; bMax = level; }
    else if (level <= 15) { bMin = 0; bMax = 5; }
    else if (level <= 25) { bMin = 1; bMax = 1; }
    else { bMin = 1; bMax = Math.min(2 + (level - 26), 5); }
    return Math.max(1, bMin + Math.floor(Math.random() * (bMax - bMin + 1)));
};

const GoldMine = ({ elevated = false }) => {
    const { gameState, handleMineClick: onMineClick } = useGameContext();
    const { pickaxe, comboCount: currentCombo, comboMilestones } = gameState;
    const goldPerMine = pickaxe.goldPerMine;
    const canMine = pickaxe.durability > 0;
    const burstActive = gameState.burst?.active ?? false;
    const burstLevel = gameState.maxStaminaLevel ?? 0;
    const { floats, add } = useFloatingNumbers();
    const lastClickTimeRef = useRef(null);
    const [isShaking, setIsShaking] = useState(false);

    const lastHandledRef = useRef(0);
    const lastMineBonusRef = useRef(null);

    useEffect(() => {
        const bonus = gameState.lastMineBonus;
        if (!bonus || bonus === lastMineBonusRef.current) return;
        lastMineBonusRef.current = bonus;
        if (bonus.doubleHitCount > 0) add('doubleHit', { multiplier: 1 + bonus.doubleHitCount }, 900);
        if (bonus.savedDurability) add('saveDurability', {}, 1000);
        if (bonus.burstReduced > 0) add('burstRecharge', { value: bonus.burstReduced }, 1000);
    }, [gameState.lastMineBonus]); // eslint-disable-line

    const handleClick = (e) => {
        const now = Date.now();
        if (now - lastHandledRef.current < 100) return;
        lastHandledRef.current = now;
        e.stopPropagation();
        if (!canMine) {
            playBuffer('blocked');
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.min(Math.max(e.clientX - rect.left, 60), rect.width - 110);
            const y = e.clientY - rect.top;
            add('warning', { x, y, msg: '⛏️ Pico roto' }, 1200);
            return;
        }


        playBuffer('hit');
        onMineClick();

        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 150);

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const safeX = Math.min(x, rect.width - 100);

        add('gold', { value: goldPerMine, x, y }, 1000);

        const extraGoldTotal = (gameState.dogs?.globalSlots ?? []).reduce((sum, dogId) => {
            if (!dogId) return sum;
            const bonus = DogsConfig[dogId]?.goldMineBonus;
            return bonus?.type === 'extraGold' ? sum + bonus.value : sum;
        }, 0);
        if (extraGoldTotal > 0) add('extraGold', { value: extraGoldTotal, x, y }, 1000);

        if (burstActive) {
            add('burst', { value: calcBurstBonus(burstLevel), x, y }, 1000);
        }

        const clickNow = Date.now();
        const timeSinceLastClick = lastClickTimeRef.current ? clickNow - lastClickTimeRef.current : 0;

        let displayCombo;
        if (currentCombo === 0) displayCombo = 1;
        else if (timeSinceLastClick > CombosConfig.resetTime) displayCombo = 1;
        else displayCombo = currentCombo + 1;

        lastClickTimeRef.current = clickNow;

        const isHito = displayCombo >= CombosConfig.firstMilestone &&
            displayCombo % CombosConfig.milestoneInterval === 0;

        if (isHito) {
            const isFirstTime = !comboMilestones[displayCombo];
            const bonusGold = isFirstTime
                ? displayCombo * CombosConfig.bonusMultiplier
                : Math.floor(displayCombo * CombosConfig.bonusMultiplier * CombosConfig.bonusRepeated);
            add('bonus', { combo: displayCombo, bonus: bonusGold, x: safeX, y: y - 60 }, 2000);
        }

        add('combo', { value: displayCombo, x: safeX, y: y - 90 }, 1000);

        Array.from({ length: 6 }).forEach(() => {
            add('particle', { x, y, angle: Math.random() * 360, distance: 50 + Math.random() * 30 }, 800);
        });
    };

    const content = (
        <div
            className="gold-mine-container"
            style={elevated ? { position: 'fixed', zIndex: 1500 } : {}}
        >
            {elevated && (
                <div style={{
                    position: 'absolute',
                    top: '-2.2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#FFD700',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                    pointerEvents: 'none',
                }}>
                    👇 Dale tap
                </div>
            )}
            {/* IMAGEN DE LA MENA (clickeable) */}
            <img
                src={menaGold}
                alt="Gold Mine"
                className={`gold-mine ${isShaking ? 'shake' : ''} ${!canMine ? 'disabled' : ''}`}
                data-gold-mine="true"
                onClick={handleClick}
            />

            {floats.map(f => {
                if (f.type === 'warning')   return <div key={f.id} className="floating-warning-gold" style={{ left: `${f.x}px`, top: `${f.y}px` }}>{f.msg}</div>;
                if (f.type === 'gold')      return <div key={f.id} className="floating-number-gold" style={{ left: `${f.x}px`, top: `${f.y}px` }}>+{f.value}</div>;
                if (f.type === 'extraGold') return <div key={f.id} className="floating-number-extra-gold" style={{ left: `${f.x - 40}px`, top: `${f.y}px` }}>+{f.value}</div>;
                if (f.type === 'burst')     return <div key={f.id} className="floating-number-burst-gold" style={{ left: `${f.x + 50}px`, top: `${f.y}px` }}>+{f.value}</div>;
                if (f.type === 'doubleHit')     return <div key={f.id} className="floating-double-hit">x{f.multiplier}!</div>;
                if (f.type === 'saveDurability') return <div key={f.id} className="floating-save-durability">🛡️</div>;
                if (f.type === 'burstRecharge')  return <div key={f.id} className="floating-burst-recharge">⚡-{f.value}s</div>;
                if (f.type === 'combo')     return <div key={f.id} className="floating-combo" style={{ left: `${Math.min(f.x, 200)}px`, top: `${f.y}px` }}>Combo x{f.value}</div>;
                if (f.type === 'bonus')     return <div key={f.id} className="floating-bonus-wrapper" style={{ left: `${Math.min(f.x, 180)}px`, top: `${f.y}px` }}><div className="floating-bonus-combo">🔥 COMBO {f.combo}!</div><div className="floating-bonus-gold">+{f.bonus} ORO ✨</div></div>;
                if (f.type === 'particle')  return <div key={f.id} className="particle" style={{ left: `${f.x}px`, top: `${f.y}px`, '--angle': `${f.angle}deg`, '--distance': `${f.distance}px` }} />;
                return null;
            })}
        </div>
    );

    if (elevated) return createPortal(content, document.body);
    return content;
};

export default GoldMine;