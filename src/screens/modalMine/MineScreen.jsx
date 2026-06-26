import { useState, useEffect, useRef } from "react";
import "../../styles/modals/MineScreen.css";
import { X } from "lucide-react";
import MinesConfig from "../../game/config/MinesConfig.js";
import { DogsConfig, RARITY_COLORS } from "../../game/config/DogsConfig.js";
import { MineCompanionConfig, ELEMENT_COLORS, MINE_AUTOMINE_INTERVAL, RARITY_AUTOMINE_INTERVAL } from "../../game/config/MineCompanionConfig.js";
import { useGameContext } from "../../game/context/GameContext.jsx";
import { playSfx } from "../../game/utils/sfx.js";

import powerFuria    from "../../assets/ui/power-pets/furia.webp";
import powerFire     from "../../assets/ui/power-pets/pelota-fire.webp";
import powerElectric from "../../assets/ui/power-pets/pelota-electic.webp";
import powerWater    from "../../assets/ui/power-pets/pistola-agua.webp";
import powerEarth    from "../../assets/ui/power-pets/terremoto.webp";

import bgInsideBronze from "../../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-bronze.webp";
import bgInsideIron from "../../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-iron.webp";
import bgInsideDiamond from "../../assets/backgrounds/bg-mines/bg-inside-mine/bg-inside-diamond.webp";

import menaBronze1 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze1.webp";
import menaBronze2 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze2.webp";
import menaBronze3 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.webp";
import menaIron1 from "../../assets/ui/icons-menas/menas-iron/mena-iron1.webp";
import menaIron2 from "../../assets/ui/icons-menas/menas-iron/mena-iron2.webp";
import menaIron3 from "../../assets/ui/icons-menas/menas-iron/mena-iron3.webp";
import menaDiamond1 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond1.webp";
import menaDiamond2 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond2.webp";
import menaDiamond3 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.webp";

import bronzeHud from "../../assets/ui/icons-forge/menas-hud/bronzeHud.webp";
import ironHud from "../../assets/ui/icons-forge/menas-hud/ironHud.webp";
import diamondHud from "../../assets/ui/icons-forge/menas-hud/diamondHud.webp";

import ingotBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.webp";
import ingotIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.webp";
import ingotDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.webp";
const ingotAssets = { bronze: ingotBronze, iron: ingotIron, diamond: ingotDiamond };

import ladyIcon from "../../assets/ui/icons-pets/mineros/lady-icon.webp";
import tokyoIcon from "../../assets/ui/icons-pets/mineros/tokyo-icon.webp";
import tukaIcon from "../../assets/ui/icons-pets/mineros/tuka-icon.webp";
import munaIcon from "../../assets/ui/icons-pets/mineros/muna-icon.webp";
import gordoIcon from "../../assets/ui/icons-pets/mineros/gordo-icon.webp";
import druhIcon from "../../assets/ui/icons-pets/mineros/druh-icon.webp";
import smokeIcon from "../../assets/ui/icons-pets/mineros/smoke-icon.webp";
import nupitoIcon from "../../assets/ui/icons-pets/mineros/nupito-icon.webp";
import zeusIcon from "../../assets/ui/icons-pets/mineros/zeus-icon.webp";
import boxerIcon from "../../assets/ui/icons-pets/mineros/boxer-icon.webp";
import bullyIcon from "../../assets/ui/icons-pets/mineros/bully-icon.webp";
import chihuahuaIcon from "../../assets/ui/icons-pets/mineros/chihuhua-icon.webp";

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
  iron: [menaIron1, menaIron2, menaIron3],
  diamond: [menaDiamond1, menaDiamond2, menaDiamond3],
};
const bgAssets = { bronze: bgInsideBronze, iron: bgInsideIron, diamond: bgInsideDiamond };

const mineNames = {
  bronze: "Mina Bronce", bronze_lvl2: "Mina Bronce II", bronze_lvl3: "Mina Bronce III",
  iron: "Mina Hierro", iron_lvl2: "Mina Hierro II", iron_lvl3: "Mina Hierro III",
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
  const [ultFireTriggers, setUltFireTriggers] = useState({});
  const [earthTriggers, setEarthTriggers] = useState({});
  const [electricVeinTrigger, setElectricVeinTrigger] = useState(null);
  const [waterVeinTrigger, setWaterVeinTrigger] = useState(null);
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

  // Resetea todos los triggers al entrar a una mina nueva
  useEffect(() => {
    if (!currentMine) return;
    setAnimTriggers({});
    setUltFireTriggers({});
    setEarthTriggers({});
    setElectricVeinTrigger(null);
    setWaterVeinTrigger(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMine?.mineType]);

  // Fuego: flash rojo + lingote flotante por tick de automine
  useEffect(() => {
    const t = currentMine?.powers?.fireVeinTrigger;
    if (!t) return;
    setUltFireTriggers(prev => ({ ...prev, [t.veinId]: { count: (prev[t.veinId]?.count || 0) + 1, amount: t.amount } }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMine?.powers?.fireVeinTrigger?.seq]);


  // ULT tierra: flash marrón + loot flotante en cada vena afectada
  useEffect(() => {
    const trigger = currentMine?.powers?.earthquakeTrigger;
    const veinData = currentMine?.powers?.earthquakeVeinData;
    if (!trigger || !veinData) return;
    const updated = {};
    Object.entries(veinData).forEach(([id, hits]) => {
      if (hits > 0) updated[id] = { count: (earthTriggers[id]?.count || 0) + 1, hits };
    });
    setEarthTriggers(prev => ({ ...prev, ...updated }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMine?.powers?.earthquakeTrigger]);

  // Eléctrico: floating por hit de automine
  useEffect(() => {
    const t = currentMine?.powers?.electricVeinTrigger;
    if (!t) return;
    setElectricVeinTrigger(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMine?.powers?.electricVeinTrigger?.seq]);

  // Agua: floating +N por hit de automine
  useEffect(() => {
    const t = currentMine?.powers?.waterVeinTrigger;
    if (!t) return;
    setWaterVeinTrigger(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMine?.powers?.waterVeinTrigger?.seq]);


  // Automine con delay inicial al entrar
  useEffect(() => {
    clearInterval(automineRef.current);
    if (!isOpen || !currentMine) return;

    const cId = currentMine.companion?.dogId ?? null;
    const rarity = cId ? DogsConfig[cId]?.rarity : null;
    const baseInterval = RARITY_AUTOMINE_INTERVAL[rarity] ?? MINE_AUTOMINE_INTERVAL;
    const furyBonus = currentMine.powers?.furyBonus ?? 0;
    const interval = Math.max(50, Math.round(baseInterval / (1 + furyBonus)));

    const delay = setTimeout(() => {
      automineRef.current = setInterval(() => {
        const mine = currentMineRef.current;
        if (!mine) return;
        const available = mine.veins.filter(v => v.remaining > 0);
        if (available.length === 0) return;
        const vein = available[Math.floor(Math.random() * available.length)];
        handleMineVein(vein.id, true);
        setAnimTriggers(prev => ({ ...prev, [vein.id]: (prev[vein.id] || 0) + 1 }));
      }, interval);
    }, 1000);

    return () => { clearTimeout(delay); clearInterval(automineRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentMine?.powers?.furyBonus, currentMine?.mineType]);

  if (!isOpen || !currentMine) return null;

  const baseMineType = currentMine.mineType.replace("_lvl2", "").replace("_lvl3", "");
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
      style={{ backgroundImage: `url(${bgAssets[baseMineType]})` }}
    >
      <div className="mine-screen-content" ref={mineContentRef} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="mine-screen-header">
          <div className="mine-title">
            <h2>{mineNames[currentMine.mineType] || currentMine.mineType}</h2>
          </div>
          {totalRemaining === 0 && (
            <button className="btn-exit-mine" onClick={onClose}><X /></button>
          )}
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



        {/* VENAS */}
        <div className="veins-container">
          {currentMine.veins.map((vein) => (
            <Vein
              key={vein.id}
              vein={vein}
              menaImg={menaImg}
              hudImg={hudImg}
              ingotImg={ingotAssets[baseMineType]}
              animTrigger={animTriggers[vein.id] || 0}
              ultTrigger={ultFireTriggers[vein.id] || null}
              earthTrigger={earthTriggers[vein.id] || null}
              electricTrigger={electricVeinTrigger?.veinId === vein.id ? electricVeinTrigger : null}
              waterTrigger={waterVeinTrigger?.veinId === vein.id ? waterVeinTrigger : null}
            />
          ))}
        </div>

        {/* PANTALLA COMPLETADA */}
        {showCompleted && <MineCompleted currentMine={currentMine} baseMineType={baseMineType} hudImg={hudImg} ingotImg={ingotAssets[baseMineType]} onClose={onClose} />}
      </div>
    </div>
  );
};

// ===================== COMPANION PANEL =====================

const BIOME_LABEL = { bronze: 'Bronce', iron: 'Hierro', diamond: 'Diamante' };
const BIOME_COLOR = { bronze: '#cd7f32', iron: '#a8bfc9', diamond: '#80deea' };

const CompanionPanel = ({ companionId, companionCfg, companionCompCfg, elemColor, rarityColor, stars, powers, now, baseMineType, onActivateUlt }) => {
  const ultCfg = companionCompCfg?.ult;
  const ultType = ultCfg?.type;

  // ULT button state
  const ultOnCooldown = powers.ultCooldownUntil && now < powers.ultCooldownUntil;
  const ultCooldownSecs = ultOnCooldown ? Math.ceil((powers.ultCooldownUntil - now) / 1000) : 0;
  const ultTimedActive = powers.ultActive && powers.ultUntil && now < powers.ultUntil;
  const ultTimedSecs = ultTimedActive ? Math.ceil((powers.ultUntil - now) / 1000) : 0;
  const fireTimedActive = powers.fireActive && powers.fireUntil && now < powers.fireUntil;
  const fireTimedSecs = fireTimedActive ? Math.ceil((powers.fireUntil - now) / 1000) : 0;
  const ultUsed = powers.ultUsed;
  const isSessionSpeed = ultType === 'session_speed';

  const getUltLabel = () => {
    if (!ultCfg) return null;
    if (ultOnCooldown) return `${ultCooldownSecs}s`;
    if (ultType === 'timed_ingots' && fireTimedActive) return `${fireTimedSecs}s`;
    if (ultTimedActive) return `${ultTimedSecs}s activo`;
    if (ultUsed && ultType !== 'timed_speed') return 'Usada';
    return ultCfg.name;
  };

  const ultDisabled = !companionId || !ultCfg || isSessionSpeed
    || ultOnCooldown
    || (ultUsed && ultType !== 'timed_speed')
    || ultTimedActive
    || fireTimedActive;

  // Pasiva 2: biome bonus del perro (escalado por estrellas)
  const biomeBonusRaw = companionId ? (companionCfg?.biomeBonus?.[baseMineType] ?? 1.0) : 1.0;
  const biomeBonus = Array.isArray(biomeBonusRaw) ? (biomeBonusRaw[Math.min(5, stars ?? 0)] ?? 1.0) : biomeBonusRaw;

  // Pasiva 1: automine interval en ms
  const furyBonus = powers.furyBonus ?? 0;
  const baseInterval = companionId ? (RARITY_AUTOMINE_INTERVAL[companionCfg?.rarity] ?? MINE_AUTOMINE_INTERVAL) : MINE_AUTOMINE_INTERVAL;
  const automineMs = Math.max(50, Math.round(baseInterval / (1 + furyBonus)));

  return (
    <div className="companion-panel">
      {/* DOG INFO */}
      <div className="companion-dog-info">
        <div className="companion-dog-wrap">
          {companionId ? (
            <>
              <div className="companion-dog-avatar-wrap">
                <div className="companion-dog-avatar" style={{ borderColor: rarityColor }}>
                  {dogAssets[companionId] && (
                    <img src={dogAssets[companionId]} alt={companionCfg?.name} className="companion-dog-img" />
                  )}
                </div>
                {stars > 0 && <span className="companion-dog-stars">{'★'.repeat(stars)}</span>}
              </div>

              <div className="companion-dog-meta">
                <span className="companion-dog-name">{companionCfg?.name ?? companionId}</span>
                <span className="companion-dog-elem" style={{ color: elemColor }}>
                  {companionCompCfg?.element}
                </span>
                {/* PASIVAS */}
                <div className="companion-passives">

                  {companionId && (
                    <span className="passive-badge passive-biome" style={{ color: BIOME_COLOR[baseMineType] ?? elemColor }}>
                      x{biomeBonus.toFixed(1)} {BIOME_LABEL[baseMineType]}
                    </span>
                  )}
                </div>
              </div>

            </>
          ) : (
            <div className="companion-dog-meta">
              <span className="companion-dog-name">Sin ayudante</span>
            </div>
          )}

        </div>
        {/* ULT */}
        <div className="companion-ult-row">
          {!isSessionSpeed ? (() => {
            const pwType = ultType === 'timed_ingots' ? 'fire' : ultType === 'session_bounce' ? 'electric' : ultType === 'once_water' ? 'water' : 'earth';
            const pwIcon = { fire: powerFire, electric: powerElectric, water: powerWater, earth: powerEarth }[pwType];
            return (
              <button
                className={`power-btn power-btn-ult${ultTimedActive ? ' power-active' : ''}${ultDisabled ? ' power-disabled' : ''} power-btn-${pwType}`}
                style={{ '--ult-color': elemColor }}
                onClick={onActivateUlt}
                disabled={ultDisabled}
              >
                <img src={pwIcon} className="power-btn-icon" alt="" />
                <span className="power-btn-label">{getUltLabel()}</span>
              </button>
            );
          })() : (
            <div className="power-btn power-btn-fury power-active">
              <img src={powerFuria} className="power-btn-icon" alt="" />
              <span className="power-btn-label">Furia activa ({automineMs}ms)</span>
            </div>
          )}

          {/* Estado electrico / agua activo */}
          {powers.fireActive && (
            <span className="ult-active-badge" style={{ color: ELEMENT_COLORS.fuego }}>
              +{powers.fireMin === powers.fireMax ? powers.fireMin : `${powers.fireMin}-${powers.fireMax}`} lingote/golpe
            </span>
          )}
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


    </div>
  );
};

// ===================== VENA (solo visual, no clickeable) =====================

const Vein = ({ vein, menaImg, hudImg, ingotImg, animTrigger, ultTrigger, earthTrigger, electricTrigger, waterTrigger }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isEarthFlash, setIsEarthFlash] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [floatingIngots, setFloatingIngots] = useState([]);
  const [floatingEarth, setFloatingEarth] = useState([]);
  const [floatingElectric, setFloatingElectric] = useState([]);
  const [floatingWater, setFloatingWater] = useState([]);
  const electricTimeoutRef = useRef(null);
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

  useEffect(() => {
    if (!ultTrigger?.amount) return;
    const rect = veinRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 + 8 : 48;
    const y = rect ? rect.height / 2 : 40;
    const ingotId = Date.now() + Math.random();
    setFloatingIngots(prev => [...prev, { id: ingotId, x, y }]);
    setTimeout(() => setFloatingIngots(prev => prev.filter(n => n.id !== ingotId)), 4200);
  }, [ultTrigger?.count]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!earthTrigger) return;
    setIsEarthFlash(true);
    setTimeout(() => setIsEarthFlash(false), 600);
    const rect = veinRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 : 40;
    const y = rect ? rect.height / 2 : 40;
    const earthId = Date.now() + Math.random();
    setFloatingEarth(prev => [...prev, { id: earthId, x, y, hits: earthTrigger.hits }]);
    setTimeout(() => setFloatingEarth(prev => prev.filter(n => n.id !== earthId)), 4200);
  }, [earthTrigger?.count]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!electricTrigger) return;
    if (electricTimeoutRef.current) clearTimeout(electricTimeoutRef.current);
    const rect = veinRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 + 8 : 48;
    const y = rect ? rect.height / 2 : 40;
    const elecId = Date.now() + Math.random();
    setFloatingElectric([{ id: elecId, x, y }]);
    electricTimeoutRef.current = setTimeout(() => setFloatingElectric([]), 4200);
  }, [electricTrigger?.seq]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!waterTrigger) return;
    const rect = veinRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 + 8 : 48;
    const y = rect ? rect.height / 2 : 40;
    const waterId = Date.now() + Math.random();
    setFloatingWater(prev => [...prev, { id: waterId, x, y, bonus: waterTrigger.bonus }]);
    setTimeout(() => setFloatingWater(prev => prev.filter(n => n.id !== waterId)), 4200);
  }, [waterTrigger?.seq]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDepleted = vein.remaining === 0;

  return (
    <div
      ref={veinRef}
      className={`vein vein-auto${isShaking ? ' shake' : ''}${isDepleted ? ' depleted' : ''}${isEarthFlash ? ' vein-earth-flash' : ''}`}
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
      {floatingIngots.map((ing) => (
        <div key={ing.id} className="floating-number floating-ingot" style={{ left: `${ing.x}px`, top: `${ing.y}px` }}>
          +<img src={ingotImg} alt="lingote" className="mena-floating-icon" />
        </div>
      ))}
      {floatingEarth.map((e) => (
        <div key={e.id} className="floating-number floating-earth" style={{ left: `${e.x}px`, top: `${e.y}px` }}>
          +<img src={hudImg} alt="mat" className="mena-floating-icon-earth" />
        </div>
      ))}
      {floatingElectric.map((e) => (
        <div key={e.id} className="floating-number floating-electric" style={{ left: `${e.x}px`, top: `${e.y}px` }}>
          +<img src={hudImg} alt="mat" className="mena-floating-icon" />
        </div>
      ))}
      {floatingWater.map((w) => (
        <div key={w.id} className="floating-number floating-water" style={{ left: `${w.x}px`, top: `${w.y}px` }}>
          +{w.bonus}<img src={hudImg} alt="mat" className="mena-floating-icon" />
        </div>
      ))}
    </div>
  );
};

// ===================== PANTALLA COMPLETADA =====================

const MineCompleted = ({ currentMine, baseMineType, hudImg, ingotImg, onClose }) => {
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
        {(currentMine.fireIngotGained ?? 0) > 0 && (
          <div className="mc-stat-row mc-bonus">
            <span>Poder de fuego</span>
            <span className="mc-stat-val">+{fmt(currentMine.fireIngotGained)} <img src={ingotImg} alt="" className="mc-hud-icon" /></span>
          </div>
        )}
        <div className="mc-stat-row">
          <span>Autominado</span>
          <span className="mc-stat-val">{fmt(currentMine.automineGained ?? 0)} <img src={hudImg} alt="" className="mc-hud-icon" /></span>
        </div>
        {speedBonus > 0 && (
          <div className="mc-stat-row mc-bonus">
            <span>Bonus estrellas</span>
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
