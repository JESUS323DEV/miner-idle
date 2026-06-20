import { useState, useEffect, useRef } from "react";
import "../../styles/modals/MineScreen.css";
import { X } from "lucide-react";
import MinesConfig from "../../game/config/MinesConfig.js";
import { DogsConfig, RARITY_COLORS } from "../../game/config/DogsConfig.js";
import { MineCompanionConfig, ELEMENT_COLORS, MINE_AUTOMINE_INTERVAL } from "../../game/config/MineCompanionConfig.js";
import { useGameContext } from "../../game/context/GameContext.jsx";
import { playSfx } from "../../game/utils/sfx.js";

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

import bronzeHud from "../../assets/ui/icons-forge/menas-hud/bronzeHud.png";
import ironHud from "../../assets/ui/icons-forge/menas-hud/ironHud.png";
import diamondHud from "../../assets/ui/icons-forge/menas-hud/diamondHud.png";

import ladyIcon   from "../../assets/ui/icons-pets/mineros/lady-icon.png";
import tokyoIcon  from "../../assets/ui/icons-pets/mineros/tokyo-icon.png";
import tukaIcon   from "../../assets/ui/icons-pets/mineros/tuka-icon.png";
import munaIcon   from "../../assets/ui/icons-pets/mineros/muna-icon.png";
import gordoIcon  from "../../assets/ui/icons-pets/mineros/gordo-icon.png";
import druhIcon   from "../../assets/ui/icons-pets/mineros/druh-icon.png";
import smokeIcon  from "../../assets/ui/icons-pets/mineros/smoke-icon.png";
import nupitoIcon from "../../assets/ui/icons-pets/mineros/nupito-icon.png";
import zeusIcon   from "../../assets/ui/icons-pets/mineros/zeus-icon.png";
import boxerIcon  from "../../assets/ui/icons-pets/mineros/boxer-icon.png";
import bullyIcon  from "../../assets/ui/icons-pets/mineros/bully-icon.png";
import chihuahuaIcon from "../../assets/ui/icons-pets/mineros/chihuhua-icon.png";

const dogAssets = {
  lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
  muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
  smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
  boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
};

const fmt = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
  return num;
};

const hudAssets = { bronze: bronzeHud, iron: ironHud, diamond: diamondHud };
const menaAssets = {
  bronze: [menaBronze1, menaBronze2, menaBronze3],
  iron:   [menaIron1,   menaIron2,   menaIron3],
  diamond:[menaDiamond1,menaDiamond2,menaDiamond3],
};
const bgAssets = { bronze: bgInsideBronze, iron: bgInsideIron, diamond: bgInsideDiamond };

const mineNames = {
  bronze: "Mina Bronce", bronze_lvl2: "Mina Bronce II", bronze_lvl3: "Mina Bronce III",
  iron: "Mina Hierro",   iron_lvl2:   "Mina Hierro II", iron_lvl3:   "Mina Hierro III",
  diamond: "Mina Diamante", diamond_lvl2: "Mina Diamante II", diamond_lvl3: "Mina Diamante III",
};

const MineScreen = ({ isOpen, onClose }) => {
  const {
    gameState,
    handleMineVein,
    handleActivateMineUlt,
  } = useGameContext();

  const currentMine = gameState.mines.currentMine;

  const [showCompleted, setShowCompleted] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [animTriggers, setAnimTriggers] = useState({});
  const automineRef = useRef(null);
  const mineContentRef = useRef(null);
  const currentMineRef = useRef(currentMine);
  useEffect(() => { currentMineRef.current = currentMine; }, [currentMine]);

  const totalRemaining = currentMine?.veins?.reduce((s, v) => s + v.remaining, 0) ?? 1;

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isOpen || !currentMine) return;
    if (totalRemaining === 0) {
      const t = setTimeout(() => { setShowCompleted(true); playSfx('finalMina'); }, 800);
      return () => clearTimeout(t);
    } else {
      setShowCompleted(false);
    }
  }, [totalRemaining, isOpen, currentMine]);

  // Automine siempre activo. Velocidad = 166ms / (1 + furyBonus)
  useEffect(() => {
    clearInterval(automineRef.current);
    if (!isOpen || !currentMine) return;

    const furyBonus = currentMine.powers?.furyBonus ?? 0;
    const interval = Math.max(50, Math.round(MINE_AUTOMINE_INTERVAL / (1 + furyBonus)));

    automineRef.current = setInterval(() => {
      const mine = currentMineRef.current;
      if (!mine) return;
      const available = mine.veins.filter(v => v.remaining > 0);
      if (available.length === 0) return;
      const vein = available[Math.floor(Math.random() * available.length)];
      handleMineVein(vein.id, true);
      setAnimTriggers(prev => ({ ...prev, [vein.id]: (prev[vein.id] || 0) + 1 }));
    }, interval);

    return () => clearInterval(automineRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentMine?.powers?.furyBonus, currentMine?.mineType]);

  if (!isOpen || !currentMine) return null;

  const baseMineType = currentMine.mineType.replace("_lvl2","").replace("_lvl3","");
  const level = currentMine.mineType.includes("_lvl3") ? 2 : currentMine.mineType.includes("_lvl2") ? 1 : 0;
  const menaImg = menaAssets[baseMineType][level];
  const hudImg = hudAssets[baseMineType];

  const companionId = currentMine.companion?.dogId ?? null;
  const companionDog = companionId ? gameState.dogs[companionId] : null;
  const companionCfg = companionId ? DogsConfig[companionId] : null;
  const companionCompCfg = companionId ? MineCompanionConfig[companionId] : null;
  const elemColor = companionCompCfg ? ELEMENT_COLORS[companionCompCfg.element] : '#aaa';
  const rarityColor = RARITY_COLORS[companionCfg?.rarity] ?? '#aaa';
  const stars = companionDog?.stars ?? 0;
  const powers = currentMine.powers ?? {};

  return (
    <div
      className="modal-overlay2"
      onClick={onClose}
      style={{ backgroundImage: `url(${bgAssets[baseMineType]})` }}
    >
      <div className="mine-screen-content" ref={mineContentRef} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="mine-screen-header">
          <div className="mine-title">
            <h2>{mineNames[currentMine.mineType] || currentMine.mineType}</h2>
          </div>
          <button className="btn-exit-mine" onClick={onClose}><X /></button>
        </div>

        {/* STATS */}
        <div className="mine-stats">
          <div className="stat-item">
            <span>Obtenido</span>
            <span className="stat-value">
              {fmt(currentMine.resourcesGathered[baseMineType])}
              <img src={hudImg} alt="" className="stat-hud-icon" />
            </span>
          </div>
          <div className="stat-item">
            <span>Golpes</span>
            <span className="stat-value">{currentMine.clicksCount}</span>
          </div>
        </div>

        {/* PANEL COMPANION */}
        <CompanionPanel
          companionId={companionId}
          companionCfg={companionCfg}
          companionCompCfg={companionCompCfg}
          elemColor={elemColor}
          rarityColor={rarityColor}
          stars={stars}
          powers={powers}
          now={now}
          baseMineType={baseMineType}
          onActivateUlt={handleActivateMineUlt}
        />

        {/* VENAS (solo visuales, sin click) */}
        <div className="veins-container">
          {currentMine.veins.map((vein) => (
            <Vein
              key={vein.id}
              vein={vein}
              menaImg={menaImg}
              hudImg={hudImg}
              animTrigger={animTriggers[vein.id] || 0}
            />
          ))}
        </div>

        {/* PANTALLA COMPLETADA */}
        {showCompleted && <MineCompleted currentMine={currentMine} baseMineType={baseMineType} hudImg={hudImg} onClose={onClose} />}
      </div>
    </div>
  );
};

// ===================== COMPANION PANEL =====================

const BIOME_LABEL = { bronze: 'Bronce', iron: 'Hierro', diamond: 'Diamante' };

const CompanionPanel = ({ companionId, companionCfg, companionCompCfg, elemColor, rarityColor, stars, powers, now, baseMineType, onActivateUlt }) => {
  const ultCfg = companionCompCfg?.ult;
  const ultType = ultCfg?.type;

  // ULT button state
  const ultOnCooldown = powers.ultCooldownUntil && now < powers.ultCooldownUntil;
  const ultCooldownSecs = ultOnCooldown ? Math.ceil((powers.ultCooldownUntil - now) / 1000) : 0;
  const ultTimedActive = powers.ultActive && powers.ultUntil && now < powers.ultUntil;
  const ultTimedSecs = ultTimedActive ? Math.ceil((powers.ultUntil - now) / 1000) : 0;
  const ultUsed = powers.ultUsed;
  const isSessionSpeed = ultType === 'session_speed';

  const getUltLabel = () => {
    if (!ultCfg) return null;
    if (ultOnCooldown) return `${ultCooldownSecs}s`;
    if (ultTimedActive) return `${ultTimedSecs}s activo`;
    if (ultUsed && ultType !== 'cooldown_ingots' && ultType !== 'timed_speed') return 'Usada';
    return ultCfg.name;
  };

  const ultDisabled = !companionId || !ultCfg || isSessionSpeed
    || ultOnCooldown
    || (ultUsed && ultType !== 'cooldown_ingots' && ultType !== 'timed_speed')
    || ultTimedActive;

  // Pasiva 2: biome bonus del perro
  const biomeBonus = companionId ? (companionCfg?.biomeBonus?.[baseMineType] ?? 1.0) : 1.0;

  // Pasiva 1: automine interval en ms
  const furyBonus = powers.furyBonus ?? 0;
  const automineMs = Math.max(50, Math.round(MINE_AUTOMINE_INTERVAL / (1 + furyBonus)));

  return (
    <div className="companion-panel">
      {/* DOG INFO */}
      <div className="companion-dog-info">
        {companionId ? (
          <>
            <div className="companion-dog-avatar" style={{ borderColor: rarityColor }}>
              {dogAssets[companionId] && (
                <img src={dogAssets[companionId]} alt={companionCfg?.name} className="companion-dog-img" />
              )}
            </div>
            <div className="companion-dog-meta">
              <span className="companion-dog-name">{companionCfg?.name ?? companionId}</span>
              <span className="companion-dog-elem" style={{ color: elemColor }}>
                {companionCompCfg?.element}
              </span>
              {stars > 0 && <span className="companion-dog-stars">{'★'.repeat(stars)}</span>}
            </div>
          </>
        ) : (
          <div className="companion-dog-meta">
            <span className="companion-dog-name">Sin ayudante</span>
          </div>
        )}

        {/* PASIVAS */}
        <div className="companion-passives">
          <span className="passive-badge">
            Automine {automineMs}ms
          </span>
          {companionId && (
            <span className="passive-badge passive-biome" style={{ color: elemColor }}>
              x{biomeBonus.toFixed(1)} {BIOME_LABEL[baseMineType]}
            </span>
          )}
        </div>
      </div>

      {/* ULT */}
      <div className="companion-ult-row">
        {!isSessionSpeed ? (
          <button
            className={`power-btn power-btn-ult${ultTimedActive ? ' power-active' : ''}${ultDisabled ? ' power-disabled' : ''} power-btn-${ultType === 'cooldown_ingots' ? 'fire' : ultType === 'session_bounce' ? 'electric' : ultType === 'once_water' ? 'water' : 'earth'}`}
            style={{ '--ult-color': elemColor }}
            onClick={onActivateUlt}
            disabled={ultDisabled}
          >
            <span className="power-btn-label">{getUltLabel()}</span>
          </button>
        ) : (
          <div className="power-btn power-btn-fury power-active">
            <span className="power-btn-label">Furia activa ({automineMs}ms)</span>
          </div>
        )}

        {/* Estado electrico / agua activo */}
        {powers.electricActive && (
          <span className="ult-active-badge" style={{ color: ELEMENT_COLORS.electrico }}>
            +{powers.electricMin}-{powers.electricMax} por golpe
          </span>
        )}
        {powers.waterMult > 1 && (
          <span className="ult-active-badge" style={{ color: ELEMENT_COLORS.agua }}>
            x{powers.waterMult} materiales
          </span>
        )}
      </div>
    </div>
  );
};

// ===================== VENA (solo visual, no clickeable) =====================

const Vein = ({ vein, menaImg, hudImg, animTrigger }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const veinRef = useRef(null);

  useEffect(() => {
    if (animTrigger === 0) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 150);

    const rect = veinRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 : 40;
    const y = rect ? rect.height / 2 : 40;
    const numId = Date.now() + Math.random();
    setFloatingNumbers(prev => [...prev, { id: numId, x, y }]);
    setTimeout(() => setFloatingNumbers(prev => prev.filter(n => n.id !== numId)), 900);
  }, [animTrigger]);

  const isDepleted = vein.remaining === 0;

  return (
    <div
      ref={veinRef}
      className={`vein vein-auto${isShaking ? " shake" : ""}${isDepleted ? " depleted" : ""}`}
    >
      <div className="vein-icon">
        <img src={menaImg} alt="mena" className="vein-img" />
      </div>
      <div className="vein-counter">{vein.remaining}/{vein.max}</div>

      {floatingNumbers.map((num) => (
        <div key={num.id} className="floating-number" style={{ left: `${num.x}px`, top: `${num.y}px` }}>
          +<img src={hudImg} alt="mat" className="mena-floating-icon" />
        </div>
      ))}
    </div>
  );
};

// ===================== PANTALLA COMPLETADA =====================

const MineCompleted = ({ currentMine, baseMineType, hudImg, onClose }) => {
  const materialsGathered = currentMine.resourcesGathered[baseMineType];
  const config = MinesConfig[currentMine.mineType];
  const { starThresholds, starBonuses } = config;

  let speedBonus = 0;
  if (materialsGathered >= starThresholds.perfect) {
    speedBonus = Math.floor(materialsGathered * starBonuses.perfect);
  } else if (materialsGathered >= starThresholds.good) {
    speedBonus = Math.floor(materialsGathered * starBonuses.good);
  }

  const total = materialsGathered + speedBonus;
  const stars = materialsGathered >= starThresholds.perfect ? 3
    : materialsGathered >= starThresholds.good ? 2
    : materialsGathered >= starThresholds.basic ? 1 : 0;

  return (
    <div className="mine-completed">
      <h3>MINA COMPLETADA</h3>

      <div className="mc-stars-row">
        {[starThresholds.basic, starThresholds.good, starThresholds.perfect].map((threshold, i) => (
          <div key={i} className={`mc-star-col ${i < stars ? "mc-star-reached" : "mc-star-locked"}`}>
            <span className="mc-star-icon">{i < stars ? "★" : "☆"}</span>
            <span className="mc-star-threshold">
              {fmt(threshold)} <img src={hudImg} alt="" className="mc-hud-icon" />
            </span>
          </div>
        ))}
      </div>

      <div className="mc-stats">
        <div className="mc-stat-row">
          <span>Golpes</span>
          <span className="mc-stat-val">{fmt(currentMine.clicksCount)}</span>
        </div>
        <div className="mc-stat-row">
          <span>Obtenido</span>
          <span className="mc-stat-val">{fmt(materialsGathered)} <img src={hudImg} alt="" className="mc-hud-icon" /></span>
        </div>
        {speedBonus > 0 && (
          <div className="mc-stat-row mc-bonus">
            <span>Bonus</span>
            <span className="mc-stat-val">+{fmt(speedBonus)} <img src={hudImg} alt="" className="mc-hud-icon" /></span>
          </div>
        )}
        <div className="mc-stat-row mc-total">
          <span>Total</span>
          <span className="mc-stat-val">{fmt(total)} <img src={hudImg} alt="" className="mc-hud-icon" /></span>
        </div>
      </div>

      <button className="btn-exit-completed" onClick={onClose}>SALIR Y RECLAMAR</button>
    </div>
  );
};

export default MineScreen;
