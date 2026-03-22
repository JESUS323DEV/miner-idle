import { useState } from "react";
import "../../styles/modals/MineScreen.css";
import { X } from "lucide-react";
import MinesConfig from "../../game/config/MinesConfig.js";

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
const MineScreen = ({ isOpen, onClose, currentMine, onMineVein, canMine }) => {
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
  const totalRemaining = currentMine.veins.reduce(
    (sum, vein) => sum + vein.remaining,
    0,
  );
  const allCompleted = totalRemaining === 0;

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
            />
          ))}
        </div>

        {/* MENSAJE SI COMPLETÓ TODAS */}
        {allCompleted &&
          (() => {
            const materialsGathered =
              currentMine.resourcesGathered[baseMineType];
            const config = MinesConfig[currentMine.mineType];
            const { starThresholds, starBonuses } = config;

            let speedBonus = 0;
            let rankText = "";

            if (materialsGathered >= starThresholds.perfect) {
              speedBonus = Math.floor(materialsGathered * starBonuses.perfect);
              rankText = "⭐⭐⭐";
            } else if (materialsGathered >= starThresholds.good) {
              speedBonus = Math.floor(materialsGathered * starBonuses.good);
              rankText = "⭐⭐☆";
            } else {
              rankText = "⭐☆☆";
            }

            const total = materialsGathered + speedBonus;

            return (
              <div className="mine-completed">
                <h3>🎉 ¡MINA COMPLETADA!</h3>
                <p style={{ fontSize: "32px", margin: "10px 0" }}>{rankText}</p>
                <p>Clicks totales: {currentMine.clicksCount}</p>
                <p>
                  Materiales obtenidos: {materialsGathered}{" "}
                  {getMineIcon(baseMineType)}
                </p>
                {speedBonus > 0 && (
                  <p style={{ color: "#4CAF50", fontWeight: "bold" }}>
                    Bonus: +{speedBonus} {getMineIcon(baseMineType)}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "28px",
                    color: "#FFD700",
                    fontWeight: "bold",
                  }}
                >
                  Total: {total} {getMineIcon(baseMineType)}
                </p>
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
const Vein = ({ vein, onMineVein, canMine, mineType, mineColor, menaImg }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [particles, setParticles] = useState([]);

  // Emoji según tipo de mina
  const getMineEmoji = (type) => {
    const emojis = {
      bronze: "🟤",
      iron: "⚙️",
      diamond: "💎",
    };
    return emojis[type] || "🪨";
  };

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

    // ✅ Crea número flotante con emoji
    const numId = Date.now();
    setFloatingNumbers((prev) => [
      ...prev,
      {
        id: numId,
        emoji: getMineEmoji(mineType),
        x: x,
        y: y,
      },
    ]);

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
      className={`vein ${isShaking ? "shake" : ""} ${isDepleted ? "depleted" : ""} ${!canMine ? "disabled" : ""}`}
      onClick={handleClick}
    >
      <div className="vein-icon">
        <img src={menaImg} alt="mena" className="vein-img" />
      </div>

      <div
        className="vein-counter"
        style={{ color: isDepleted ? "#555" : mineColor }}
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
          {num.emoji}
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
