import { useState, useRef } from 'react';
import '../styles/GoldMine.css';
import { CombosConfig } from '../game/config/CombosConfig.js';
import menaGold from '../assets/scenes/mining/mena-gold5.png';




const GoldMine = ({ onMineClick, goldPerMine, canMine, currentCombo, comboMilestones }) => {
    const [bonusNumbers, setBonusNumbers] = useState([]);
    const lastClickTimeRef = useRef(null);
    // Estado para controlar la animación de shake de la mena
    const [isShaking, setIsShaking] = useState(false);

    // Array de números flotantes activos (ej: [{id: 123, value: 5, x: 100, y: 200}])
    const [floatingNumbers, setFloatingNumbers] = useState([]);

    // Array de partículas activas que explotan al clickear
    const [particles, setParticles] = useState([]);



    const [comboNumbers, setComboNumbers] = useState([]);

    const handleClick = (e) => {
        // Si no puede minar (sin stamina o durabilidad), no hace nada
        if (!canMine) return;

        // Ejecuta la lógica de minado (suma oro, resta stamina/durabilidad)
        onMineClick();

        // Activa animación de shake por 150ms
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 150);

        // Calcula la posición exacta del click dentro de la imagen
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const safeX = Math.min(x, rect.width - 100);

        // Crea número flotante (+5, +8, etc.) en la posición del click
        const numId = Date.now();
        setFloatingNumbers(prev => [...prev, {
            id: numId,
            value: goldPerMine,  // Cantidad de oro ganado
            x: x,  // Posición X del click
            y: y   // Posición Y del click
        }]);

        // Elimina el número flotante después de 1 segundo (cuando termina la animación)
        setTimeout(() => {
            setFloatingNumbers(prev => prev.filter(n => n.id !== numId));
        }, 1000);

        const now = Date.now();

        const timeSinceLastClick = lastClickTimeRef.current
            ? now - lastClickTimeRef.current
            : 0;

        let displayCombo;
        if (currentCombo === 0) {
            displayCombo = 1;  // Primer click del juego
        } else if (timeSinceLastClick > CombosConfig.resetTime) {
            displayCombo = 1;  // Reset por tiempo
        } else {
            displayCombo = currentCombo + 1;  // Suma normal
        }


        // Actualiza timestamp local
        lastClickTimeRef.current = now;

        // ✅ VERIFICA SI ES UN HITO (20, 25, 30, etc.)
        const isHito = displayCombo >= CombosConfig.firstMilestone &&
            displayCombo % CombosConfig.milestoneInterval === 0;

        if (isHito) {
            // ✅ VERIFICA SI ES PRIMERA VEZ (igual que en handleMineClick)
            // Necesitas pasar comboMilestones como prop
            const isFirstTime = !comboMilestones[displayCombo];

            // Calcula bonus
            const bonusGold = isFirstTime
                ? displayCombo * CombosConfig.bonusMultiplier
                : Math.floor(displayCombo * CombosConfig.bonusMultiplier * CombosConfig.bonusRepeated);

            const bonusId = Date.now() + 2;
            setBonusNumbers(prev => [...prev, {
                id: bonusId,
                combo: displayCombo,
                bonus: bonusGold,
                x: safeX,  
                y: y - 60
            }]);

            setTimeout(() => {
                setBonusNumbers(prev => prev.filter(n => n.id !== bonusId));
            }, 2000);
        }
        // Muestra combo normal
        const comboId = Date.now() + 1;
        setComboNumbers(prev => [...prev, {
            id: comboId,
            value: displayCombo,
            x: safeX,  // 👈
            y: y - 90
        }]);

        setTimeout(() => {
            setComboNumbers(prev => prev.filter(n => n.id !== comboId));
        }, 1000);

        // Genera 6 partículas doradas que explotan desde el punto de click
        const newParticles = Array.from({ length: 6 }, (_, i) => ({
            id: Date.now() + i,  // ID único para cada partícula
            x: x,  // Posición inicial X (donde se clickeó)
            y: y,  // Posición inicial Y (donde se clickeó)
            angle: Math.random() * 360,  // Ángulo aleatorio de explosión (0-360°)
            distance: 50 + Math.random() * 30  // Distancia de vuelo aleatoria (50-80px)
        }));
        setParticles(prev => [...prev, ...newParticles]);

        // Elimina las partículas después de 800ms (cuando termina la animación)
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 800);
    };

    return (
        <div className="gold-mine-container">
            {/* IMAGEN DE LA MENA (clickeable) */}
            <img
                src={menaGold}
                alt="Gold Mine"
                className={`gold-mine ${isShaking ? 'shake' : ''} ${!canMine ? 'disabled' : ''}`}
                data-gold-mine="true"
                onClick={handleClick}
            />

            {/* NÚMEROS FLOTANTES DE ORO */}
            {floatingNumbers.map(num => (
                <div
                    key={num.id}
                    className="floating-number-gold"
                    style={{ left: `${num.x}px`, top: `${num.y}px` }}
                >
                    +{num.value}
                </div>
            ))}

            {/* NÚMEROS COMBO */}
            {comboNumbers.map(combo => (
                <div
                    key={combo.id}
                    className="floating-combo"
                    style={{ left: `${Math.min(combo.x, 200)}px`, top: `${combo.y}px` }}
                >
                    Combo x{combo.value}
                </div>
            ))}

            {/* BONUS HITOS */}
            {bonusNumbers.map(bonus => (
                <div key={bonus.id} className="floating-bonus-wrapper"
                    style={{ left: `${Math.min(bonus.x, 180)}px`, top: `${bonus.y}px` }}
                >
                    <div className="floating-bonus-combo">🔥 COMBO {bonus.combo}!</div>
                    <div className="floating-bonus-gold">+{bonus.bonus} ORO ✨</div>
                </div>
            ))}

            {/* PARTÍCULAS */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="particle"
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        '--angle': `${particle.angle}deg`,
                        '--distance': `${particle.distance}px`
                    }}
                />
            ))}
        </div>
    );
};

export default GoldMine;