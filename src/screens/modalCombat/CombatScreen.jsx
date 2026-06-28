import { useState, useEffect } from 'react';
import { X, ChevronLeft, Flame, Zap, Droplets, Mountain, Moon, Star, Swords, Pickaxe } from 'lucide-react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig.js';
import { CombatConfig } from '../../game/config/CombatConfig.js';
import '../../styles/modals/CombatScreen.css';

import bat1Img    from '../../assets/ui/icons-enemy/bats/bat-1.webp';
import bat2Img    from '../../assets/ui/icons-enemy/bats/bat-2.webp';
import bat3Img    from '../../assets/ui/icons-enemy/bats/bat-3.webp';
import batBossImg from '../../assets/ui/icons-enemy/bats/bat-boss.webp';
import bgBats     from '../../assets/ui/icons-enemy/bats/bg-combat-bats.webp';

import topo1Img    from '../../assets/ui/icons-enemy/topos/topo-1.webp';
import topo2Img    from '../../assets/ui/icons-enemy/topos/topo-2.webp';
import topo3Img    from '../../assets/ui/icons-enemy/topos/topo-3.webp';
import topoBossImg from '../../assets/ui/icons-enemy/topos/topo-boss.webp';
import bgTopos     from '../../assets/ui/icons-enemy/topos/bg-combat-topos.webp';

import ladyIcon   from '../../assets/ui/icons-pets/mineros/lady-icon.webp';
import tokyoIcon  from '../../assets/ui/icons-pets/mineros/tokyo-icon.webp';
import tukaIcon   from '../../assets/ui/icons-pets/mineros/tuka-icon.webp';
import munaIcon   from '../../assets/ui/icons-pets/mineros/muna-icon.webp';
import gordoIcon  from '../../assets/ui/icons-pets/mineros/gordo-icon.webp';
import druhIcon   from '../../assets/ui/icons-pets/mineros/druh-icon.webp';
import smokeIcon  from '../../assets/ui/icons-pets/mineros/smoke-icon.webp';
import nupitoIcon from '../../assets/ui/icons-pets/mineros/nupito-icon.webp';
import zeusIcon      from '../../assets/ui/icons-pets/mineros/zeus-icon.webp';
import boxerIcon    from '../../assets/ui/icons-pets/mineros/boxer-icon.webp';
import bullyIcon    from '../../assets/ui/icons-pets/mineros/bully-icon.webp';
import chihuahuaIcon from '../../assets/ui/icons-pets/mineros/chihuhua-icon.webp';

import forgeIcon1 from '../../assets/ui/icons-pets/forge/forge-icon1.webp';
import forgeIcon2 from '../../assets/ui/icons-pets/forge/forge-icon2.webp';
import forgeIcon3 from '../../assets/ui/icons-pets/forge/forge-icon3.webp';
import forgeIcon4 from '../../assets/ui/icons-pets/forge/forge-icon4.webp';
import forgeIcon5 from '../../assets/ui/icons-pets/forge/forge-icon5.webp';
import forgeIcon6 from '../../assets/ui/icons-pets/forge/forge-icon6.webp';
import forgeIcon7 from '../../assets/ui/icons-pets/forge/forge-icon7.webp';
import forgeIcon8 from '../../assets/ui/icons-pets/forge/forge-icon8.webp';
import forgeIcon9 from '../../assets/ui/icons-pets/forge/forge-icon9.webp';

const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
    boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
};

const forgeDogAssets = {
    pip: forgeIcon1, koda: forgeIcon2, milo: forgeIcon3,
    rocky: forgeIcon4, bruno: forgeIcon5, max: forgeIcon6,
    rex: forgeIcon7, toby: forgeIcon8, buddy: forgeIcon9,
};

const getConfig = (id) => DogsConfig[id] ?? ForgeDogsConfig[id];
const getAsset  = (id) => dogAssets[id]  ?? forgeDogAssets[id];

const getCombatStatus = (dog, isForge) => {
    if (!dog.assignedTo) return 'available';
    const a = dog.assignedTo;
    if (isForge) {
        if (typeof a === 'string') return 'inFurnace';
        if (a.type === 'raid') return 'inRaid';
        if (a.globalSlot !== undefined) return 'available';
    } else {
        if (a.biome || a.mineComp !== undefined) return 'inMine';
        if (a.type === 'raid') return 'inRaid';
        if (a.globalSlot !== undefined) return 'available';
    }
    return 'available';
};

const ELEMENT_ICON = {
    fuego:     { Icon: Flame,     color: '#ff6b35' },
    electrico: { Icon: Zap,       color: '#FFD700' },
    agua:      { Icon: Droplets,  color: '#4fc3f7' },
    tierra:    { Icon: Mountain,  color: '#8b6914' },
    oscuro:    { Icon: Moon,      color: '#b45cff' },
};

const MINER_COMBAT_INFO = {
    fuego:     { ult: 'Bola de fuego', passive: 'Lateral: +5 daño plano al activo' },
    electrico: { ult: 'Bola eléctrica', passive: 'Lateral: +12% prob. doble golpe' },
    tierra:    { ult: 'Terremoto', passive: 'Lateral: x1.12 daño amplificado' },
    agua:      { ult: 'Pistola de agua', passive: 'Lateral: x1.25 daño multiplicado' },
    oscuro:    { ult: 'Furia', passive: 'Lateral: -1s cooldown de cambio' },
};

const MINER_ULT_NAME = {
    fuego: 'Pelota de fuego', electrico: 'Pelota eléctrica',
    agua: 'Pistola de agua',  tierra: 'Terremoto', oscuro: 'Furia',
};

const FORGE_ULT_NAME = {
    fuego: 'Brasas', agua: 'Vapor', electrico: 'Estática', tierra: 'Roca', oscuro: 'Sombra',
};

const FORGE_PASSIVE_INFO = {
    fuego:     'Solo actua en lateral. Si lo pones aqui pierdes el calor acumulado.',
    agua:      'Solo actua en lateral. Desde ahi potencia al activo con el tiempo.',
    electrico: 'Solo actua en lateral. Desde ahi aumenta el doble golpe del activo.',
    tierra:    'Solo actua en lateral. Cada golpe debilita la armadura del enemigo.',
    oscuro:    'Solo actua en lateral. Da mas daño mientras el enemigo tiene mucha vida.',
};

const ULT_COOLDOWN_BY_ELEMENT = {
    fuego: 12, electrico: 10, tierra: 15, agua: 12, oscuro: 8,
};

const enemyImgs = {
    'bat-1':    bat1Img,
    'bat-2':    bat2Img,
    'bat-3':    bat3Img,
    'bat-boss': batBossImg,
    'topo-1':    topo1Img,
    'topo-2':    topo2Img,
    'topo-3':    topo3Img,
    'topo-boss': topoBossImg,
};

const biomeBg = {
    bats:  bgBats,
    moles: bgTopos,
};

const CombatScreen = ({ isOpen, onClose, onBack }) => {
    const { gameState, setGameState } = useGameContext();

    const [phase, setPhase]                       = useState('biome');
    const [infoCardId, setInfoCardId]             = useState(null);
    const [activeBiome, setActiveBiome]           = useState(null);
    const [activeEnemy, setActiveEnemy]           = useState(null);
    const [team, setTeam]                         = useState([]);
    const [slots, setSlots]                       = useState([null, null, null]);
    const [enemyHp, setEnemyHp]                   = useState(0);
    const [timer, setTimer]                       = useState(0);
    const [resultsData, setResultsData]           = useState(null);
    const [abilityCooldowns, setAbilityCooldowns] = useState({});
    const [switchCooldowns, setSwitchCooldowns]   = useState({});
    const [swappingTo, setSwappingTo]             = useState(null);
    const [ultCooldown, setUltCooldown]           = useState(0);
    const [activeEffect, setActiveEffect]         = useState(null);
    const [heatStacks, setHeatStacks]             = useState(0);
    const [activeSeconds, setActiveSeconds]       = useState(0);
    const [defenseDebuff, setDefenseDebuff]       = useState(0);

    const SWITCH_COOLDOWN = 6;

    useEffect(() => {
        if (isOpen) {
            setPhase('biome');
            setActiveBiome(null);
            setActiveEnemy(null);
            setTeam([]);
            setSlots([null, null, null]);
            setEnemyHp(0);
            setTimer(0);
            setResultsData(null);
            setAbilityCooldowns({});
            setSwitchCooldowns({});
            setSwappingTo(null);
            setUltCooldown(0);
            setActiveEffect(null);
            setHeatStacks(0);
            setActiveSeconds(0);
            setDefenseDebuff(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (phase !== 'fight' || timer <= 0) return;
        const t = setTimeout(() => {
            setTimer(prev => prev - 1);
            setAbilityCooldowns(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(id => { if (next[id] > 0) next[id]--; });
                return next;
            });
            setSwitchCooldowns(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(id => { if (next[id] > 0) next[id]--; });
                return next;
            });
            setUltCooldown(prev => Math.max(0, prev - 1));
            setActiveSeconds(prev => prev + 1);
            setActiveEffect(prev => {
                if (!prev || prev.type === 'doubleHits') return prev;
                const remaining = prev.remaining - 1;
                return remaining <= 0 ? null : { ...prev, remaining };
            });
        }, 1000);
        return () => clearTimeout(t);
    }, [phase, timer]);

    const rollRarity = (rarityPool) => {
        const total = rarityPool.reduce((s, r) => s + r.weight, 0);
        let rand = Math.random() * total;
        for (const entry of rarityPool) {
            rand -= entry.weight;
            if (rand <= 0) return entry.rarity;
        }
        return rarityPool[rarityPool.length - 1].rarity;
    };

    const pickRewardDog = (rarity) => {
        const pool = Object.values(DogsConfig).filter(d => d.rarity === rarity);
        if (pool.length === 0) return null;
        return pool[Math.floor(Math.random() * pool.length)];
    };

    useEffect(() => {
        if (phase !== 'fight' || !activeEnemy) return;
        if (enemyHp <= 0 || timer <= 0) {
            const dealt = activeEnemy.hp - Math.max(0, enemyHp);
            const pct   = Math.min(1, dealt / activeEnemy.hp);
            const threshold = [...activeEnemy.rewardThresholds].reverse().find(t => pct >= t.pct) ?? null;
            const shards = threshold?.shards ?? 0;

            const gold = threshold?.gold ?? 0;
            let rewardDogId  = null;
            let rewardRarity = null;

            if (shards > 0 && activeEnemy.rarityPool) {
                rewardRarity = rollRarity(activeEnemy.rarityPool);
                const dog = pickRewardDog(rewardRarity);
                if (dog) {
                    rewardDogId = dog.id;
                    setGameState(prev => ({
                        ...prev,
                        gold: prev.gold + gold,
                        dogs: {
                            ...prev.dogs,
                            [dog.id]: {
                                ...prev.dogs[dog.id],
                                fragments: (prev.dogs[dog.id]?.fragments ?? 0) + shards,
                            },
                        },
                    }));
                }
            }

            setResultsData({
                pct,
                shards,
                gold,
                label:        threshold?.label ?? 'Sin recompensa',
                defeated:     enemyHp <= 0,
                rewardDogId,
                rewardRarity,
            });
            setPhase('results');
        }
    }, [phase, enemyHp, timer]);

    const getPassiveEffects = () => {
        const eff = {
            flatBonus: 0, doubleHitChance: 0, damageMulti: 1, damageAmp: 1,
            switchCooldownReduce: 0, heatStackDmg: 0, addHeatStack: false,
            heatStackCap: 0, vaporBonusPerSec: 0, vaporCap: 0,
            addDefenseDebuff: false, defenseDebuffCap: 0, shadowBonus: 0,
        };
        for (const id of [slots[0], slots[2]].filter(Boolean)) {
            const cfg = getConfig(id);
            if (!cfg?.element) continue;
            if (!ForgeDogsConfig[id]) {
                switch (cfg.element) {
                    case 'fuego':     eff.flatBonus += 5; break;
                    case 'electrico': eff.doubleHitChance += 0.12; break;
                    case 'tierra':    eff.damageAmp *= 1.12; break;
                    case 'agua':      eff.damageMulti *= 1.25; break;
                    case 'oscuro':    eff.switchCooldownReduce += 1; break;
                }
            } else {
                switch (cfg.element) {
                    case 'fuego': {
                        eff.heatStackDmg += 5;
                        eff.addHeatStack = true;
                        const stars   = gameState.forgeDogs?.[id]?.stars ?? 0;
                        const baseCap = cfg.rarity === 'legendary' ? 7 : cfg.rarity === 'epic' ? 5 : 3;
                        eff.heatStackCap = Math.max(eff.heatStackCap, baseCap + (stars >= 5 ? 1 : 0));
                        break;
                    }
                    case 'agua': {
                        const perSec = cfg.rarity === 'legendary' ? 0.03 : cfg.rarity === 'epic' ? 0.02 : 0.01;
                        const cap    = cfg.rarity === 'legendary' ? 0.40 : cfg.rarity === 'epic' ? 0.30 : 0.20;
                        eff.vaporBonusPerSec += perSec;
                        eff.vaporCap = Math.max(eff.vaporCap, cap);
                        break;
                    }
                    case 'electrico': {
                        const chance = cfg.rarity === 'legendary' ? 0.20 : cfg.rarity === 'epic' ? 0.15 : 0.10;
                        eff.doubleHitChance += chance;
                        break;
                    }
                    case 'tierra': {
                        eff.addDefenseDebuff = true;
                        const debuffCap = cfg.rarity === 'legendary' ? 6 : cfg.rarity === 'epic' ? 4 : 2;
                        eff.defenseDebuffCap = Math.max(eff.defenseDebuffCap, debuffCap);
                        break;
                    }
                    case 'oscuro': {
                        const bonus = cfg.rarity === 'legendary' ? 0.35 : cfg.rarity === 'epic' ? 0.25 : 0.15;
                        eff.shadowBonus += bonus;
                        break;
                    }
                }
            }
        }
        return eff;
    };

    const handleTap = () => {
        if (phase !== 'fight') return;
        const pickDmg  = gameState.pickaxe.miningPowerByMaterial?.[gameState.pickaxe.material] ?? 2;
        const activeId = slots[1];
        const dogDmg   = activeId ? (getConfig(activeId)?.miningPower ?? 0) : 0;
        const passive  = getPassiveEffects();

        let dmg = Math.max(1, pickDmg + dogDmg);
        dmg += passive.flatBonus;
        dmg += heatStacks * passive.heatStackDmg;
        if (passive.vaporBonusPerSec > 0)
            dmg *= 1 + Math.min(activeSeconds * passive.vaporBonusPerSec, passive.vaporCap || 0.3);
        if (passive.shadowBonus > 0 && activeEnemy && enemyHp / activeEnemy.hp > 0.5)
            dmg *= 1 + passive.shadowBonus;
        dmg *= passive.damageMulti;
        dmg *= passive.damageAmp;
        if (activeEffect?.type === 'damageMulti') dmg *= activeEffect.value;

        const defense = Math.max(0, (activeEnemy?.defense ?? 0) - defenseDebuff);
        dmg = Math.round(Math.max(1, dmg - defense));

        const isGuaranteedDouble = activeEffect?.type === 'doubleHits' && activeEffect.remaining > 0;
        const isDoubleHit = isGuaranteedDouble || Math.random() < passive.doubleHitChance;
        setEnemyHp(prev => Math.max(0, prev - (isDoubleHit ? dmg * 2 : dmg)));

        if (passive.addHeatStack) setHeatStacks(prev => Math.min(passive.heatStackCap, prev + 1));
        if (passive.addDefenseDebuff) setDefenseDebuff(prev => Math.min(passive.defenseDebuffCap, prev + 1));
        if (isGuaranteedDouble) {
            setActiveEffect(prev => {
                if (!prev || prev.type !== 'doubleHits') return prev;
                const remaining = prev.remaining - 1;
                return remaining <= 0 ? null : { ...prev, remaining };
            });
        }
    };

    const handleUlt = () => {
        if (phase !== 'fight' || ultCooldown > 0 || !slots[1]) return;
        const activeId = slots[1];
        const cfg      = getConfig(activeId);
        const element  = cfg?.element;
        const isForge  = !!ForgeDogsConfig[activeId];
        const pickDmg  = gameState.pickaxe.miningPowerByMaterial?.[gameState.pickaxe.material] ?? 2;

        setUltCooldown(ULT_COOLDOWN_BY_ELEMENT[element] ?? 12);
        const defense = activeEnemy?.defense ?? 0;
        const applyDefense = (dmg) => Math.max(1, dmg - defense);

        if (!isForge) {
            switch (element) {
                case 'fuego': {
                    const dmg = applyDefense(Math.round((cfg.miningPower ?? 1) * 20 + pickDmg * 5));
                    setEnemyHp(prev => Math.max(0, prev - dmg));
                    break;
                }
                case 'electrico':
                    setActiveEffect({ type: 'doubleHits', remaining: 5 });
                    break;
                case 'tierra': {
                    const dmg = applyDefense(Math.round((cfg.miningPower ?? 1) * 30 + pickDmg * 8));
                    setEnemyHp(prev => Math.max(0, prev - dmg));
                    break;
                }
                case 'agua':
                    setActiveEffect({ type: 'damageMulti', value: 3, remaining: 6 });
                    break;
                case 'oscuro':
                    setSwitchCooldowns({});
                    break;
            }
        } else {
            switch (element) {
                case 'fuego': {
                    const dmg = applyDefense(Math.round(Math.max(5, pickDmg * 12 + heatStacks * 10)));
                    setEnemyHp(prev => Math.max(0, prev - dmg));
                    setHeatStacks(0);
                    break;
                }
                case 'agua':
                    setActiveEffect({ type: 'damageMulti', value: 1.8, remaining: 6 });
                    break;
                case 'electrico': {
                    const dmg = applyDefense(Math.round(Math.max(5, pickDmg * 28)));
                    setEnemyHp(prev => Math.max(0, prev - dmg));
                    break;
                }
                case 'tierra': {
                    const dmg = applyDefense(Math.round(Math.max(5, pickDmg * 35)));
                    setEnemyHp(prev => Math.max(0, prev - dmg));
                    break;
                }
                case 'oscuro':
                    setActiveEffect({ type: 'damageMulti', value: 2.5, remaining: 6 });
                    break;
            }
        }
    };

    const handleSwap = (position) => {
        if (phase !== 'fight') return;
        const [left, center, right] = slots;
        const targetId = position === 'left' ? left : right;
        if (!targetId || (switchCooldowns[targetId] ?? 0) > 0) return;

        const newSlots = position === 'left'
            ? [center, left, right]
            : [left, right, center];

        const newLeft  = newSlots[0];
        const newRight = newSlots[2];

        const oscuroReduce = [newLeft, newRight].filter(id => {
            if (!id) return false;
            const cfg = getConfig(id);
            return cfg?.element === 'oscuro' && !ForgeDogsConfig[id];
        }).length * 2;
        const finalCd = Math.max(0, SWITCH_COOLDOWN - oscuroReduce);

        setSlots(newSlots);
        setSwappingTo(targetId);
        setUltCooldown(0);
        setHeatStacks(0);
        setActiveSeconds(0);
        setSwitchCooldowns(prev => ({
            ...prev,
            ...(newLeft  ? { [newLeft]:  finalCd } : {}),
            ...(newRight ? { [newRight]: finalCd } : {}),
        }));
        setTimeout(() => setSwappingTo(null), 300);
    };



    const startFight = () => {
        if (team.length === 0 || !activeEnemy) return;
        setSlots([team[1] ?? null, team[0], team[2] ?? null]);
        setAbilityCooldowns({});
        setSwitchCooldowns({});
        setHeatStacks(0);
        setActiveSeconds(0);
        setDefenseDebuff(0);
        setActiveEffect(null);
        setUltCooldown(0);
        setEnemyHp(activeEnemy.hp);
        setTimer(activeEnemy.timerSec);
        setPhase('fight');
    };

    const goToBiome = () => {
        setActiveBiome(null);
        setActiveEnemy(null);
        setTeam([]);
        setPhase('biome');
    };

    if (!isOpen) return null;

    const dogs = gameState.dogs ?? {};
    const forgeDogs = gameState.forgeDogs ?? {};
    const hiredDogs = [
        ...Object.values(dogs).filter(d => d && typeof d === 'object' && !Array.isArray(d) && d.hired),
        ...Object.values(forgeDogs).filter(d => d && typeof d === 'object' && !Array.isArray(d) && d.hired),
    ];
    const hpPct    = activeEnemy ? (enemyHp / activeEnemy.hp) * 100 : 100;
    const hasBg    = !!activeBiome;
    const bgStyle  = hasBg ? { backgroundImage: `url(${biomeBg[activeBiome.id]})` } : {};

    return (
        <div
            className={`combat-screen${hasBg ? ' combat-screen-with-bg' : ''}`}
            style={bgStyle}
        >

            {/* ===== BIOME SELECT ===== */}
            {phase === 'biome' && (
                <div className="combat-biome-select">
                    <button className="combat-back-btn combat-biome-back" onClick={onBack ?? onClose}><ChevronLeft /></button>
                    <h2 className="combat-title">Raids Activas</h2>
                    <p className="combat-subtitle">Elige un bioma</p>
                    <div className="combat-biome-grid">
                        {CombatConfig.biomes.map(biome => (
                            <button
                                key={biome.id}
                                className={`combat-biome-btn${biome.comingSoon ? ' combat-biome-soon' : ''}`}
                                onClick={() => { if (!biome.comingSoon) { setActiveBiome(biome); setPhase('enemy'); } }}
                                disabled={biome.comingSoon}
                            >
                                <span className="cbb-name">{biome.name}</span>
                                {biome.comingSoon && <span className="cbb-soon-label">Próximamente</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== ENEMY SELECT ===== */}
            {phase === 'enemy' && activeBiome && (
                <div className="combat-enemy-select">
                    <div className="combat-nav">
                        <button className="combat-back-btn" onClick={goToBiome}><ChevronLeft /></button>
                        <h2 className="combat-title">{activeBiome.name}</h2>
                        <div style={{ width: 32 }} />
                    </div>
                    <div className="combat-enemy-grid">
                        {activeBiome.enemies.map(enemy => (
                            <button
                                key={enemy.id}
                                className={`combat-enemy-card${enemy.isBoss ? ' combat-enemy-boss' : ''}`}
                                onClick={() => { setActiveEnemy(enemy); setPhase('select'); }}
                            >
                                {enemy.isBoss && <span className="cec-boss-badge">BOSS</span>}
                                <img src={enemyImgs[enemy.id]} alt={enemy.name} />
                                <span className="cec-name">{enemy.name}</span>
                                <span className="cec-meta">❤️ {enemy.hp} · ⏱ {enemy.timerSec}s</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== DOG SELECT ===== */}
            {phase === 'select' && activeEnemy && (
                <div className="combat-select">
                    <div className="combat-nav">
                        <button className="combat-back-btn" onClick={() => { setActiveEnemy(null); setTeam([]); setPhase('enemy'); }}>
                            <ChevronLeft />
                        </button>
                        <h2 className="combat-title">{activeEnemy.name}</h2>
                        <div style={{ width: 32 }} />
                    </div>
                    <p className="combat-subtitle-meta">❤️ {activeEnemy.hp} · ⏱ {activeEnemy.timerSec}s</p>

                    <div className="combat-selected-slots">
                        {[0, 1, 2].map(i => {
                            const id = team[i];
                            if (id) {
                                const cfg = getConfig(id);
                                return (
                                    <div
                                        key={i}
                                        className={`combat-sel-slot filled dog-rarity-${cfg?.rarity}`}
                                        onClick={() => setTeam(prev => prev.filter(d => d !== id))}
                                    >
                                        <img src={getAsset(id)} alt={id} />
                                        <span>{cfg?.name}</span>
                                    </div>
                                );
                            }
                            return <div key={i} className="combat-sel-slot empty"><span>+</span></div>;
                        })}
                    </div>

                    <button
                        className={`combat-start-btn${team.length === 0 ? ' combat-start-disabled' : ''}`}
                        onClick={startFight}
                        disabled={team.length === 0}
                    >
                        <Swords size={14} /> Combatir
                    </button>

                    <div className="combat-dogs-grid">
                        {hiredDogs.length === 0 && (
                            <p className="combat-no-dogs">No tienes mascotas contratadas</p>
                        )}
                        {hiredDogs.map(dog => {
                            const cfg      = getConfig(dog.id);
                            const isForge  = !!ForgeDogsConfig[dog.id];
                            const status   = getCombatStatus(dog, isForge);
                            const blocked  = status !== 'available';
                            const selected = team.includes(dog.id);
                            const elemInfo  = cfg?.element ? ELEMENT_ICON[cfg.element] : null;
                            const showInfo  = infoCardId === dog.id;
                            return (
                                <div
                                    key={dog.id}
                                    className={`combat-dog-card${selected ? ' combat-dog-selected' : ''}${blocked ? ' unavailable' : ''} dog-rarity-${cfg?.rarity}`}
                                    onClick={() => {
                                        if (blocked || showInfo) return;
                                        setTeam(prev =>
                                            selected
                                                ? prev.filter(id => id !== dog.id)
                                                : prev.length < 3 ? [...prev, dog.id] : prev
                                        );
                                    }}
                                >
                                    {elemInfo && (
                                        <span className="cdc-element-icon">
                                            <elemInfo.Icon size={11} color={elemInfo.color} />
                                        </span>
                                    )}
                                    <button
                                        className="cdc-info-btn"
                                        onClick={e => { e.stopPropagation(); setInfoCardId(showInfo ? null : dog.id); }}
                                    >i</button>

                                    <div className="cdc-img-wrap">
                                        <img src={getAsset(dog.id)} alt={dog.id} />
                                        {status === 'inMine'    && <span className="gds-status-badge"><Pickaxe size={9} /></span>}
                                        {status === 'inRaid'    && <span className="gds-status-badge"><Swords size={9} /></span>}
                                        {status === 'inFurnace' && <span className="gds-status-badge"><Flame size={9} /></span>}
                                    </div>
                                    <span className="cdc-name">{cfg?.name}</span>
                                    <span className="cdc-power"><Swords size={9} /> {cfg?.miningPower ?? 0}</span>
                                    <div className="fdm-card-stars">
                                        {[0,1,2,3,4].map(si => (
                                            <Star key={si} size={8} fill={si < (dog.stars ?? 0) ? '#f5c842' : 'none'} color={si < (dog.stars ?? 0) ? '#f5c842' : '#555'} />
                                        ))}
                                    </div>

                                    {showInfo && (() => {
                                        const info = isForge
                                            ? { ult: null, passive: FORGE_PASSIVE_INFO[cfg?.element] ?? '' }
                                            : (MINER_COMBAT_INFO[cfg?.element] ?? { ult: null, passive: '' });
                                        return (
                                            <div
                                                className="cdc-info-overlay"
                                                onClick={e => { e.stopPropagation(); setInfoCardId(null); }}
                                            >
                                                {elemInfo && <elemInfo.Icon size={14} color={elemInfo.color} />}
                                                {info.ult && <span className="cdc-info-ult">{info.ult}</span>}
                                                <span className="cdc-info-passive">{info.passive}</span>
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ===== FIGHT ===== */}
            {phase === 'fight' && activeEnemy && (
                <div className="combat-fight">
                    <div className={`combat-timer${timer <= 10 ? ' combat-timer-urgent' : ''}`}>
                        {timer}s
                    </div>

                    <div className="combat-boss-area">
                        <p className="combat-boss-label">{activeEnemy.name}</p>
                        <div className="combat-hp-bar-wrap">
                            <div className="combat-hp-bar">
                                <div className="combat-hp-fill" style={{ width: `${hpPct}%` }} />
                            </div>
                            <span className="combat-hp-text">{enemyHp} / {activeEnemy.hp}</span>
                        </div>
                        <button className="combat-boss-portrait" onClick={handleTap}>
                            <img src={enemyImgs[activeEnemy.id]} alt={activeEnemy.name} className="combat-boss-img" />
                        </button>
                    </div>

                    <div className="combat-team-row">
                        {/* LATERAL IZQUIERDO */}
                        {slots[0] ? (() => {
                            const id  = slots[0];
                            const cfg = getConfig(id);
                            const cd  = switchCooldowns[id] ?? 0;
                            return (
                                <button
                                    key={`left-${id}`}
                                    className={`combat-slot-lateral dog-rarity-${cfg?.rarity}${cd > 0 ? ' swap-on-cd' : ''}`}
                                    onClick={() => handleSwap('left')}
                                    disabled={cd > 0}
                                >
                                    <img src={getAsset(id)} alt={id} />
                                    <span className="csl-name">{cfg?.name}</span>
                                    {cd > 0 && <span className="csl-cd">{cd}s</span>}
                                </button>
                            );
                        })() : <div className="combat-slot-lateral combat-slot-empty" />}

                        {/* ACTIVO CENTRAL */}
                        {slots[1] && (() => {
                            const id  = slots[1];
                            const cfg = getConfig(id);
                            return (
                                <div
                                    key={`center-${id}`}
                                    className={`combat-slot-active dog-rarity-${cfg?.rarity}${swappingTo === id ? ' dog-swap-in' : ''}`}
                                >
                                    <img src={getAsset(id)} alt={id} />
                                    <span className="csa-name">{cfg?.name}</span>
                                    <span className="csa-label">activo</span>
                                </div>
                            );
                        })()}

                        {/* LATERAL DERECHO */}
                        {slots[2] ? (() => {
                            const id  = slots[2];
                            const cfg = getConfig(id);
                            const cd  = switchCooldowns[id] ?? 0;
                            return (
                                <button
                                    key={`right-${id}`}
                                    className={`combat-slot-lateral dog-rarity-${cfg?.rarity}${cd > 0 ? ' swap-on-cd' : ''}`}
                                    onClick={() => handleSwap('right')}
                                    disabled={cd > 0}
                                >
                                    <img src={getAsset(id)} alt={id} />
                                    <span className="csl-name">{cfg?.name}</span>
                                    {cd > 0 && <span className="csl-cd">{cd}s</span>}
                                </button>
                            );
                        })() : <div className="combat-slot-lateral combat-slot-empty" />}
                    </div>

                    {/* ULT */}
                    {slots[1] && (() => {
                        const id      = slots[1];
                        const cfg     = getConfig(id);
                        const element = cfg?.element;
                        const isForge = !!ForgeDogsConfig[id];

                        if (isForge) {
                            const elemInfo = element ? ELEMENT_ICON[element] : null;
                            const ElemIcon = elemInfo?.Icon ?? Flame;
                            const elemColor = elemInfo?.color ?? '#ff6b35';
                            return (
                                <div className="combat-passive-info">
                                    <ElemIcon size={13} color={elemColor} />
                                    <span>{FORGE_PASSIVE_INFO[element] ?? 'Activa su pasiva cuando es lateral.'}</span>
                                </div>
                            );
                        }

                        const elemInfo = element ? ELEMENT_ICON[element] : null;
                        const isReady  = ultCooldown === 0;
                        const ultName  = isForge
                            ? (FORGE_ULT_NAME[element] ?? 'Ult')
                            : (MINER_ULT_NAME[element] ?? 'Ult');
                        return (
                            <button
                                className={`combat-ult-btn${isReady ? ' ult-ready' : ''}`}
                                style={isReady && elemInfo ? { borderColor: elemInfo.color, boxShadow: `0 0 14px ${elemInfo.color}44` } : {}}
                                onClick={handleUlt}
                                disabled={!isReady}
                            >
                                {elemInfo && <elemInfo.Icon size={14} color={isReady ? elemInfo.color : 'rgba(255,255,255,0.28)'} />}
                                <span className="ult-btn-label">{isReady ? ultName : `${ultCooldown}s`}</span>
                            </button>
                        );
                    })()}

                    {/* EFECTOS ACTIVOS */}
                    <div className="combat-effects-row">
                        {activeEffect?.type === 'doubleHits' && (
                            <span className="combat-effect-badge effect-electrico">
                                x2 golpe · {activeEffect.remaining} taps
                            </span>
                        )}
                        {activeEffect?.type === 'damageMulti' && (
                            <span className="combat-effect-badge effect-buff">
                                x{activeEffect.value} DMG · {activeEffect.remaining}s
                            </span>
                        )}
                        {heatStacks > 0 && (
                            <span className="combat-effect-badge effect-fuego">
                                <Flame size={11} color="#ff6b35" /> {heatStacks}
                            </span>
                        )}
                        {defenseDebuff > 0 && (
                            <span className="combat-effect-badge effect-tierra">
                                <Mountain size={11} color="#8b6914" /> -{defenseDebuff} def
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ===== RESULTS ===== */}
            {phase === 'results' && resultsData && (
                <div className="combat-results">
                    <h2 className="combat-results-title">
                        {resultsData.defeated ? '¡Derrotado!' : 'Tiempo agotado'}
                    </h2>
                    <p className="combat-result-boss">{activeEnemy?.name}</p>

                    <div className="combat-result-pct-wrap">
                        <div className="combat-result-pct-bar">
                            <div
                                className="combat-result-pct-fill"
                                style={{ width: `${Math.round(resultsData.pct * 100)}%` }}
                            />
                        </div>
                        <span className="combat-result-pct-label">
                            {Math.round(resultsData.pct * 100)}% de vida bajada
                        </span>
                    </div>

                    <div className={`combat-result-reward${resultsData.shards > 0 ? ' has-reward' : ''}`}>
                        {resultsData.shards > 0 ? (
                            <>
                                <span className="combat-result-tier">{resultsData.label}</span>
                                {resultsData.rewardDogId && (
                                    <div className={`combat-result-dog dog-rarity-${resultsData.rewardRarity}`}>
                                        <img src={getAsset(resultsData.rewardDogId)} alt={resultsData.rewardDogId} />
                                        <span>{getConfig(resultsData.rewardDogId)?.name}</span>
                                    </div>
                                )}
                                <span className="combat-result-shards">+{resultsData.shards} fragmentos</span>
                                {resultsData.gold > 0 && (
                                    <span className="combat-result-gold">+{resultsData.gold.toLocaleString()} oro</span>
                                )}
                            </>
                        ) : (
                            <span className="combat-result-noreward">Sin recompensa (menos del 50%)</span>
                        )}
                    </div>

                    <button className="combat-retry-btn" onClick={() => { setPhase('select'); setTeam([]); }}>
                        Repetir
                    </button>
                    <button className="combat-exit-btn" onClick={goToBiome}>
                        Volver al inicio
                    </button>
                </div>
            )}
        </div>
    );
};

export default CombatScreen;
