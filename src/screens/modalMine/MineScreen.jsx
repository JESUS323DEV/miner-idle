import { useState, useEffect, useRef } from "react";
import "../../styles/modals/MineScreen.css";
import { X } from "lucide-react";
import MinesConfig from "../../game/config/MinesConfig.js";
import MineSnacksConfig from "../../game/config/MineSnacksConfig.js";
import { useGameContext } from "../../game/context/GameContext.jsx";

import bgInsideBronze from "../../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-bronze.png";
import bgInsideIron from "../../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-iron.png";
import bgInsideDiamond from "../../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-diamond.png";

import menaBronze1 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze1.png";
import menaBronze2 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze2.png";
import menaBronze3 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.png";

import menaIron1 from "../../assets/ui/icons-menas/menas-iron/mena-iron1.png";
import menaIron2 from "../../assets/ui/icons-menas/menas-iron/mena-iron2.png";
import menaIron3 from "../../assets/ui/icons-menas/menas-iron/mena-iron3.png";

import menaDiamond1 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond1.png";
import menaDiamond2 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond2.png";
import menaDiamond3 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.png";

import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png";
import bronzeHud from "../../assets/ui/icons-forge/menas-hud/bronzeHud.png";
import ironHud from "../../assets/ui/icons-forge/menas-hud/ironHud.png";
import diamondHud from "../../assets/ui/icons-forge/menas-hud/diamondHud.png";

const hudAssets = {
  bronze: bronzeHud,
  iron: ironHud,
  diamond: diamondHud,
};

const menaAssets = {
  bronze: [menaBronze1, menaBronze2, menaBronze3],
  iron: [menaIron1, menaIron2, menaIron3],
  diamond: [menaDiamond1, menaDiamond2, menaDiamond3],
};

/**
 * COMPONENTE: MineScreen
 *
 * Pantalla de mina (modal) donde el jugador mina venas individuales.
 *
 * @param {Boolean} isOpen - Si la pantalla está abierta
 * @param {Function} onClose - Función para salir de la mina
 * @param {Object} currentMine - Estado de la mina actual
 * @param {Function} onMineVein - Función que ejecuta al clickear una vena
 * @param {String} pickaxeMaterial - Material del pico actual
 * @param {Boolean} canMine - Si puede minar (stamina > 0 && durability > 0)
 */
const MineScreen = ({ isOpen, onClose }) => {
  const {
    gameState,
    handleMineVein: onMineVein,
    handleBuyMineSnack,
    handleUseMineSnack,
    handleDynamiteMine,
  } = useGameContext();

  const currentMine = gameState.mines.currentMine;
  const mineSnacks = gameState.mineSnacks;

  const canMine = gameState.stamina > 0 && gameState.pickaxe.durability > 0;

  const [showCompleted, setShowCompleted] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [openInfo, setOpenInfo] = useState(null);
  const [animTriggers, setAnimTriggers] = useState({});
  const automineRef = useRef(null);
  const snackLastUsed = useRef({});

  const totalRemainingEarly = currentMine?.veins?.reduce((s, v) => s + v.remaining, 0) ?? 1;

  // Ticker para countdowns
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  // Delay pantalla completada
  useEffect(() => {
    if (!isOpen || !currentMine) return;
    if (totalRemainingEarly === 0) {
      const t = setTimeout(() => setShowCompleted(true), 800);
      return () => clearTimeout(t);
    } else {
      setShowCompleted(false);
    }
  }, [totalRemainingEarly, isOpen, currentMine]);

  // Automine interval
  useEffect(() => {
    clearInterval(automineRef.current);
    if (!mineSnacks?.automine?.activeUntil || now > mineSnacks.automine.activeUntil) return;
    automineRef.current = setInterval(() => {
      if (!currentMine) return;
      const available = currentMine.veins.filter(v => v.remaining > 0);
      if (available.length === 0) return;
      const vein = available[Math.floor(Math.random() * available.length)];
      onMineVein(vein.id, true);
      setAnimTriggers(prev => ({ ...prev, [vein.id]: (prev[vein.id] || 0) + 1 }));
    }, 166);
    return () => clearInterval(automineRef.current);
  }, [mineSnacks?.automine?.activeUntil, now]); // eslint-disable-line

  // Si no está abierto o no hay mina actual, no renderiza
  if (!isOpen || !currentMine) return null;

  const baseMineType = currentMine.mineType
    .replace("_lvl2", "")
    .replace("_lvl3", "");

  const level = currentMine.mineType.includes("_lvl3")
    ? 2
    : currentMine.mineType.includes("_lvl2")
      ? 1
      : 0;

  const menaImg = menaAssets[baseMineType][level];

  const bgImages = {
    bronze: bgInsideBronze,
    iron: bgInsideIron,
    diamond: bgInsideDiamond,
  };

  /**
   * HELPER: getMineIcon
   * Devuelve el emoji según el tipo de mina
   */
  const getMineIcon = (mineType) => {
    const icons = {
      bronze: "🟤",
      iron: "⚙️",
      diamond: "💎",
    };
    return icons[mineType] || "🪨";
  };

  /**
   * HELPER: getMineColor
   * Devuelve el color según el tipo de mina
   */
  const getMineColor = (mineType) => {
    const colors = {
      bronze: "#CD7F32",
      iron: "#808080",
      diamond: "#B9F2FF",
    };
    return colors[mineType] || "#888";
  };

  const mineNames = {
    bronze: "Mina Bronze",
    bronze_lvl2: "Mina Bronze II",
    bronze_lvl3: "Mina Bronze III",
    iron: "Mina Hierro",
    iron_lvl2: "Mina Hierro II",
    iron_lvl3: "Mina Hierro III",
    diamond: "Mina Diamante",
    diamond_lvl2: "Mina Diamante II",
    diamond_lvl3: "Mina Diamante III",
  };

  // Calcula total de venas restantes

  return (
    <div
      className="modal-overlay2"
      onClick={onClose}
      style={{ backgroundImage: `url(${bgImages[baseMineType]})` }}
    >
      <div className="mine-screen-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="mine-screen-header">
          <div className="mine-title">
            <h2>
              {getMineIcon(baseMineType)}{" "}
              {mineNames[currentMine.mineType] || currentMine.mineType}
            </h2>
          </div>
          <button className="btn-exit-mine" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* STATS */}
        <div className="mine-stats">
          <div className="stat-item">
            <span>Materiales obtenidos:</span>
            <span className="stat-value">
              {currentMine.resourcesGathered[baseMineType]}
            </span>
          </div>
          <div className="stat-item">
            <span>Clicks totales:</span>
            <span className="stat-value">{currentMine.clicksCount}</span>
          </div>
        </div>

        {/* SNACK BAR */}
        <div className="mine-snacks-bar">
          {(() => {
          const anySnackActive = Object.values(mineSnacks ?? {}).some(s => s.activeUntil && now < s.activeUntil);
          return Object.values(MineSnacksConfig).map(cfg => {
            const snack = mineSnacks?.[cfg.id] ?? { charges: 0 };
            const activeUntil = snack.activeUntil ?? null;
            const isActive = activeUntil && now < activeUntil;
            const secsLeft = isActive ? Math.ceil((activeUntil - now) / 1000) : 0;
            const hasCharges = snack.charges > 0;

            return (
              <div key={cfg.id} className={`mine-snack-item ${isActive ? 'snack-active' : ''} ${!hasCharges && !isActive ? 'snack-locked' : ''} ${anySnackActive && !isActive ? 'snack-blocked' : ''}`}>

                {/* EMOJI = botón usar */}
                <button
                  className={`mine-snack-emoji-btn ${isActive && cfg.id === 'automine' ? 'snack-anim-spin' : ''} ${isActive && cfg.id === 'toughness' ? 'snack-anim-pulse' : ''}`}
                  onClick={() => {
                    const now2 = Date.now();
                    if (!hasCharges || anySnackActive) return;
                    if (now2 - (snackLastUsed.current[cfg.id] || 0) < 500) return;
                    snackLastUsed.current[cfg.id] = now2;
                    cfg.id === 'dynamite' ? handleDynamiteMine() : handleUseMineSnack(cfg.id);
                  }}
                  disabled={!hasCharges || anySnackActive}
                >
                  {isActive ? <span className="snack-timer">{secsLeft}s</span> : cfg.emoji}
                  {/* BADGE de cargas */}
                  {!isActive && hasCharges && (
                    <span className="snack-charges-badge">x{snack.charges}</span>
                  )}
                </button>

                {/* "+" = botón comprar */}
                <button
                  className={`snack-buy-btn ${snack.charges > 0 ? 'snack-buy-full' : ''}`}
                  onClick={() => handleBuyMineSnack(cfg.id)}
                  disabled={snack.charges > 0}
                >
                  <span className="snack-buy-plus">+</span>
                  <span className="snack-buy-price">
                    {cfg.costGold}<img src={iconGold} alt="gold" className="snack-gold-icon" />
                  </span>
                </button>

                {/* "i" = botón info */}
                <button
                  className="snack-info-btn"
                  onClick={(e) => { e.stopPropagation(); setOpenInfo(openInfo === cfg.id ? null : cfg.id); }}
                >
                  ℹ
                </button>

                {/* POPUP INFO */}
                {openInfo === cfg.id && (
                  <div className="snack-info-popup">
                    <div className="snack-info-name">{cfg.name}</div>
                    <div className="snack-info-desc">{cfg.description}</div>
                  </div>
                )}

              </div>
            );
          });
        })()}
        </div>

        {/* VENAS (MENAS CLICKEABLES) */}
        <div className="veins-container">
          {currentMine.veins.map((vein) => (
            <Vein
              key={vein.id}
              vein={vein}
              onMineVein={onMineVein}
              canMine={canMine && vein.remaining > 0}
              mineType={currentMine.mineType}
              mineColor={getMineColor(currentMine.mineType)}
              menaImg={menaImg}
              hudImg={hudAssets[baseMineType]}
              animTrigger={animTriggers[vein.id] || 0}
            />
          ))}
        </div>

        {/* MENSAJE SI COMPLETÓ TODAS */}
        {showCompleted &&
          (() => {
            const materialsGathered =
              currentMine.resourcesGathered[baseMineType];
            const config = MinesConfig[currentMine.mineType];
            const { starThresholds, starBonuses } = config;

            let speedBonus = 0;

            if (materialsGathered >= starThresholds.perfect) {
              speedBonus = Math.floor(materialsGathered * starBonuses.perfect);
            } else if (materialsGathered >= starThresholds.good) {
              speedBonus = Math.floor(materialsGathered * starBonuses.good);
            }

            const total = materialsGathered + speedBonus;

            const hudImg = hudAssets[baseMineType];
            const stars = materialsGathered >= starThresholds.perfect ? 3
              : materialsGathered >= starThresholds.good ? 2
                : materialsGathered >= starThresholds.basic ? 1 : 0;

            return (
              <div className="mine-completed">
                <h3>¡MINA COMPLETADA!</h3>

                {/* ESTRELLAS CON UMBRALES */}
                <div className="mc-stars-row">
                  {[
                    { threshold: starThresholds.basic },
                    { threshold: starThresholds.good },
                    { threshold: starThresholds.perfect },
                  ].map((s, i) => (
                    <div key={i} className={`mc-star-col ${i < stars ? "mc-star-reached" : "mc-star-locked"}`}>
                      <span className="mc-star-icon">{i < stars ? "⭐" : "☆"}</span>
                      <span className="mc-star-threshold">
                        <span className="mc-threshold-val">
                          {s.threshold} <img src={hudImg} alt="" className="mc-hud-icon" />
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* STATS */}
                <div className="mc-stats">
                  <div className="mc-stat-row">
                    <span>Clicks</span>
                    <span className="mc-stat-val">{currentMine.clicksCount}</span>
                  </div>
                  <div className="mc-stat-row">
                    <span>Obtenido</span>
                    <span className="mc-stat-val">
                      {materialsGathered} <img src={hudImg} alt="" className="mc-hud-icon" />
                    </span>
                  </div>
                  {speedBonus > 0 && (
                    <div className="mc-stat-row mc-bonus">
                      <span>Bonus</span>
                      <span className="mc-stat-val">
                        +{speedBonus} <img src={hudImg} alt="" className="mc-hud-icon" />
                      </span>
                    </div>
                  )}
                  <div className="mc-stat-row mc-total">
                    <span>Total</span>
                    <span className="mc-stat-val">
                      {total} <img src={hudImg} alt="" className="mc-hud-icon" />
                    </span>
                  </div>
                </div>

                <button className="btn-exit-completed" onClick={onClose}>
                  SALIR Y RECLAMAR
                </button>
              </div>
            );
          })()}
      </div>
    </div>
  );
};

/**
 * COMPONENTE: Vein (Vena individual clickeable)
 * Con números flotantes y partículas como GoldMine
 */
const Vein = ({ vein, onMineVein, canMine, menaImg, hudImg, animTrigger }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [particles, setParticles] = useState([]);
  const veinRef = useRef(null);

  // Automine animation trigger
  useEffect(() => {
    if (animTrigger === 0) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 150);

    const rect = veinRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 : 40;
    const y = rect ? rect.height / 2 : 40;

    const numId = Date.now();
    setFloatingNumbers(prev => [...prev, { id: numId, x, y }]);
    setTimeout(() => setFloatingNumbers(prev => prev.filter(n => n.id !== numId)), 1000);
  }, [animTrigger]);

  const handleClick = (e) => {
    if (!canMine) return;

    // Ejecuta la lógica de minado
    onMineVein(vein.id);

    // Animación de shake
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 150);

    // Calcula posición del click
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const numId = Date.now();
    setFloatingNumbers((prev) => [...prev, { id: numId, x, y }]);

    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((n) => n.id !== numId));
    }, 1000);

    // ✅ Genera partículas
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: x,
      y: y,
      angle: Math.random() * 360,
      distance: 50 + Math.random() * 30,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
      );
    }, 800);
  };

  const isDepleted = vein.remaining === 0;

  return (
    <div
      ref={veinRef}
      className={`vein ${isShaking ? "shake" : ""} ${isDepleted ? "depleted" : ""} ${!canMine ? "disabled" : ""}`}
      onClick={handleClick}
    >
      <div className="vein-icon">
        <img src={menaImg} alt="mena" className="vein-img" />
      </div>

      <div
        className="vein-counter"
      >
        {vein.remaining}/{vein.max}
      </div>

      {/* ✅ NÚMEROS FLOTANTES */}
      {floatingNumbers.map((num) => (
        <div
          key={num.id}
          className="floating-number"
          style={{
            left: `${num.x}px`,
            top: `${num.y}px`,
          }}
        >
          + <img src={hudImg} alt="mat" className="mena-floating-icon" />
        </div>
      ))}

      {/* ✅ PARTÍCULAS */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            "--angle": `${particle.angle}deg`,
            "--distance": `${particle.distance}px`,
          }}
        />
      ))}
    </div>
  );
};

export default MineScreen;
