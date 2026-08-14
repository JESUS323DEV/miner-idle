import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ArrowLeft, Flame, Zap, Droplets, Mountain, Moon, Star, Swords, Pickaxe, Lock, Info } from 'lucide-react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { dogSkinAssets } from '../../game/utils/dogSkinAssets.js';
import raidActiveBg       from '../../assets/audio/bg-raid-active.mp3';
import raidActiveSelectBg from '../../assets/audio/bg-raid-active-select.mp3';

import ultFuego     from '../../assets/ui/power-pets/pelota-fire.webp';
import ultElectrico from '../../assets/ui/power-pets/pelota-electic.webp';
import ultAgua      from '../../assets/ui/power-pets/pistola-agua.webp';
import ultTierra    from '../../assets/ui/power-pets/terremoto.webp';
import ultOscuro    from '../../assets/ui/power-pets/furia.webp';

const ULT_ASSET = {
    fuego: ultFuego, electrico: ultElectrico,
    agua: ultAgua, tierra: ultTierra, oscuro: ultOscuro,
};
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig.js';
import { CombatConfig } from '../../game/config/CombatConfig.js';
import { getHuntRotationKey, getDailyHuntContracts } from '../../game/config/TablonHuntConfig.js';
import { playSfx } from '../../game/utils/sfx.js';
import { advanceDailyQuestInState, advanceDailyQuest, advancePJActiveUse } from '../../game/utils/questUtils.js';
import { useFloatingNumbers } from '../../game/hooks/useFloatingNumbers.js';
import '../../styles/modals/TavernModal.css';
import '../../styles/modals/CombatScreen.css';

import bat1Img    from '../../assets/ui/icons-enemy/bats/bat-1.webp';
import bat2Img    from '../../assets/ui/icons-enemy/bats/bat-2.webp';
import bat3Img    from '../../assets/ui/icons-enemy/bats/bat-3.webp';
import batBossImg from '../../assets/ui/icons-enemy/bats/bat-boss.webp';
import bgBats     from '../../assets/backgrounds/bg-modal-raids/bg-raids-active/bg-combat-bats.webp';

import topo1Img    from '../../assets/ui/icons-enemy/topos/topo-1.webp';
import topo2Img    from '../../assets/ui/icons-enemy/topos/topo-2.webp';
import topo3Img    from '../../assets/ui/icons-enemy/topos/topo-3.webp';
import topoBossImg from '../../assets/ui/icons-enemy/topos/topo-boss.webp';
import bgTopos     from '../../assets/backgrounds/bg-modal-raids/bg-raids-active/bg-combat-topos.webp';

import scorpion1Img    from '../../assets/ui/icons-enemy/scorpions/scorpion-1.webp';
import scorpion2Img    from '../../assets/ui/icons-enemy/scorpions/scorpion-2.webp';
import scorpion3Img    from '../../assets/ui/icons-enemy/scorpions/scorpion-3.webp';
import scorpionBossImg from '../../assets/ui/icons-enemy/scorpions/scorpion-boss.webp';

import spider1Img    from '../../assets/ui/icons-enemy/spiders/sipder-1.webp';
import spider2Img    from '../../assets/ui/icons-enemy/spiders/spider-2.webp';
import spider3Img    from '../../assets/ui/icons-enemy/spiders/spider-3.webp';
import spiderBossImg from '../../assets/ui/icons-enemy/spiders/spider-boss.webp';

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
import forgeDayoIcon from '../../assets/ui/icons-pets/forge/forge-dayo.webp';

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
    dayo: forgeDayoIcon,
};

const getConfig = (id) => DogsConfig[id] ?? ForgeDogsConfig[id];
const getAsset  = (id, dogSkins) => {
    const equipped = dogSkins?.[id]?.equipped;
    if (equipped && dogSkinAssets[id]?.[equipped]) return dogSkinAssets[id][equipped];
    return dogAssets[id] ?? forgeDogAssets[id];
};

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
    fuego:     { ult: 'Bola de fuego',   passive: 'Golpe de daño directo. Escala con rareza y estrellas. El CD baja a mas estrellas.' },
    electrico: { ult: 'Bola electrica',  passive: 'Daño directo con CD corto. Cada 3er disparo es un golpe cargado con mas daño.' },
    tierra:    { ult: 'Terremoto',       passive: 'Golpe de daño directo mas potente. Escala con rareza y estrellas. El CD baja a mas estrellas.' },
    agua:      { ult: 'Pistola de agua', passive: 'Durante unos segundos suma daño fijo y baja la armadura del enemigo. La cantidad escala con rareza y estrellas.' },
    oscuro:    { ult: 'Furia',           passive: 'Los proximos X taps hacen daño extra segun la HP actual del enemigo.' },
};

const FORGE_PASSIVE_INFO = {
    fuego:     'Acumula calor con cada golpe del activo. A mayor calor, mas daño inflige.',
    agua:      'Cada varios taps dispara una ola de daño extra. Cuantos mas perros de agua, mas frecuente y mas fuerte.',
    electrico: 'Cada varios taps suelta un chispazo de daño extra. Cuantos mas perros de electrico, mas frecuente y mas fuerte.',
    tierra:    'Reduce el cooldown del poder del activo, sea del elemento que sea.',
    oscuro:    'Inflige mas daño cuanta mas vida le quede al enemigo. Ideal para empezar fuerte.',
};

const ULT_COOLDOWN_BY_ELEMENT = {
    fuego: 12, electrico: 10, tierra: 15, agua: 12, oscuro: 8,
};

// Sinergias mixtas de early game: central + los 2 elementos laterales exactos
// (sin importar el orden) que le dan bonus de daño plano por tap.
const MIXED_SYNERGIES = {
    agua:      'electrico+fuego',
    oscuro:    'agua+fuego',
    electrico: 'agua+fuego',
    tierra:    'electrico+fuego',
};

const mixedRarityValue = (cfg) => cfg?.rarity === 'legendary' ? 4 : cfg?.rarity === 'epic' ? 3 : 2;

const ELEMENT_LIST = ['fuego', 'agua', 'oscuro', 'tierra', 'electrico'];

const ELEMENT_SYNERGY_DESC = {
    fuego:     'Acumula calor con cada golpe: cuantos más de fuego, más stacks y más daño por stack.',
    agua:      'Cada pocos taps dispara una ola de daño extra: más agua, más frecuente y más fuerte.',
    oscuro:    'Suma daño según el % de vida ACTUAL del enemigo, ideal para arrancar fuerte.',
    tierra:    'Reduce el cooldown de cualquier poder. Con los 3 de tierra, baja directo el coste de su propia ultimate.',
    electrico: 'Cada varios taps suelta un chispazo de daño extra, como la ola de agua. Mas electricos, mas frecuente y mas fuerte.',
};

const MIXED_SYNERGY_DESC = 'Combo mixto: suma daño plano por tap según la rareza de los 3 perros implicados.';

const CONSTANT_PASSIVE_ELEMENTS = ['agua', 'tierra', 'oscuro', 'electrico'];

const COMBO_RESET_TIME         = 1000;
const COMBO_FIRST_MILESTONE    = 5;
const COMBO_MILESTONE_INTERVAL = 5;
const COMBO_GOLD_CAP           = 2000;
const COMBO_GOLD_OVERFLOW_STEP = 20;

const enemyImgs = {
    'bat-1':    bat1Img,
    'bat-2':    bat2Img,
    'bat-3':    bat3Img,
    'bat-boss': batBossImg,
    'topo-1':    topo1Img,
    'topo-2':    topo2Img,
    'topo-3':    topo3Img,
    'topo-boss': topoBossImg,
    'scorpion-1':    scorpion1Img,
    'scorpion-2':    scorpion2Img,
    'scorpion-3':    scorpion3Img,
    'scorpion-boss': scorpionBossImg,
    'spider-1':    spider1Img,
    'spider-2':    spider2Img,
    'spider-3':    spider3Img,
    'spider-boss': spiderBossImg,
};

// scorpions/spiders reutilizan fondo mientras no tengan uno propio
const biomeBg = {
    bats:      bgBats,
    moles:     bgTopos,
    spiders:   bgBats,
    scorpions: bgTopos,
};

const CombatScreen = ({ isOpen, onClose, onBack, onFightStart, onFightEnd, musicVolume = 0.08 }) => {
    const { gameState, setGameState } = useGameContext();
    const raidAudioRef   = useRef(null);
    const selectAudioRef = useRef(null);

    useEffect(() => {
        const fight = new Audio(raidActiveBg);
        fight.volume = musicVolume;
        fight.loop = true;
        fight.preload = 'auto';
        raidAudioRef.current = fight;

        const select = new Audio(raidActiveSelectBg);
        select.volume = musicVolume;
        select.loop = true;
        select.preload = 'auto';
        selectAudioRef.current = select;

        return () => { fight.pause(); select.pause(); };
    }, []); // eslint-disable-line

    const [phase, setPhase]                       = useState('biome');
    const [infoCardId, setInfoCardId]             = useState(null);
    const [activeBiome, setActiveBiome]           = useState(null);
    const [activeEnemy, setActiveEnemy]           = useState(null);
    const [team, setTeam]                         = useState([null, null, null]);
    const [slots, setSlots]                       = useState([null, null, null]);
    const [enemyHp, setEnemyHp]                   = useState(0);
    const [timer, setTimer]                       = useState(0);
    const [resultsData, setResultsData]           = useState(null);
    const [, setAbilityCooldowns] = useState({});
    const [, setSwitchCooldowns]                   = useState({});
    const [swappingTo, setSwappingTo]             = useState(null);
    const [ultCooldown, setUltCooldown]           = useState(0);
    const [activeEffect, setActiveEffect]         = useState(null);
    const [heatStacks, setHeatStacks]             = useState(0);
    const [electricStacks, setElectricStacks]     = useState(0);
    const [autoUlt, setAutoUlt]                   = useState(false);
    const [autoFiring, setAutoFiring]             = useState(false);
    const [fightStarted, setFightStarted]         = useState(false);
    const [shakeKey, setShakeKey]                 = useState(0);
    const [hintTick, setHintTick]                 = useState(0);
    const [showSynergyCodex, setShowSynergyCodex] = useState(false);
    const [ultImpactActive, setUltImpactActive]   = useState(false);
    const [ultImpactElement, setUltImpactElement] = useState(null);
    const { floats, add: addFloat }               = useFloatingNumbers();
    const autoFireTimerRef                        = useRef(null);
    const leftSlotRef                             = useRef(null);
    const rightSlotRef                            = useRef(null);
    const lastTapTimeRef                          = useRef(null);
    const comboCountRef                           = useRef(0);
    const comboGoldRef                            = useRef(0);
    const maxComboRef                             = useRef(0);
    const waterTapCounterRef                      = useRef(0);
    const electricTapCounterRef                   = useRef(0);
    const autoUsedRef                             = useRef(false);

    const SWITCH_COOLDOWN = 6;

    useEffect(() => {
        if (isOpen) {
            const FADE_MS = 600;
            onFightStart?.(FADE_MS);
            const t = setTimeout(() => {
                selectAudioRef.current.currentTime = 0;
                selectAudioRef.current.play().catch(() => {});
            }, FADE_MS);
            return () => clearTimeout(t);
        } else {
            selectAudioRef.current?.pause();
            if (selectAudioRef.current) selectAudioRef.current.currentTime = 0;
            raidAudioRef.current?.pause();
            if (raidAudioRef.current) raidAudioRef.current.currentTime = 0;
            onFightEnd?.();
        }
    }, [isOpen]); // eslint-disable-line

    useEffect(() => {
        if (!isOpen) return;
        if (phase === 'fight') {
            selectAudioRef.current?.pause();
            if (selectAudioRef.current) selectAudioRef.current.currentTime = 0;
            raidAudioRef.current.currentTime = 0;
            raidAudioRef.current.play().catch(() => {});
        } else {
            if (raidAudioRef.current && !raidAudioRef.current.paused) {
                raidAudioRef.current.pause();
                raidAudioRef.current.currentTime = 0;
            }
            if (selectAudioRef.current?.paused) {
                selectAudioRef.current.play().catch(() => {});
            }
        }
    }, [phase]); // eslint-disable-line

    useEffect(() => {
        if (raidAudioRef.current)   raidAudioRef.current.volume   = musicVolume;
        if (selectAudioRef.current) selectAudioRef.current.volume = musicVolume;
    }, [musicVolume]);

    useEffect(() => {
        if (isOpen) {
            setPhase('biome');
            setActiveBiome(null);
            setActiveEnemy(null);
            setTeam([null, null, null]);
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
            setAutoUlt(false);
            setFightStarted(false);
            setShakeKey(0);
            setShowSynergyCodex(false);
            setUltImpactActive(false);
            comboCountRef.current = 0;
            lastTapTimeRef.current = null;
            comboGoldRef.current = 0;
            maxComboRef.current = 0;
            waterTapCounterRef.current = 0;
            electricTapCounterRef.current = 0;
        }
    }, [isOpen]);

    useEffect(() => {
        if (phase !== 'fight' || timer <= 0 || !fightStarted || ultImpactActive) return;
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
            setActiveEffect(prev => {
                if (!prev || prev.type === 'doubleHits' || prev.type === 'furyTaps') return prev;
                const remaining = prev.remaining - 1;
                return remaining <= 0 ? null : { ...prev, remaining };
            });
        }, 1000);
        return () => clearTimeout(t);
    }, [phase, timer, fightStarted, ultImpactActive]);

    useEffect(() => {
        if (!gameState.debugForceEndFight || phase !== 'fight') return;
        setEnemyHp(0);
    }, [gameState.debugForceEndFight]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (autoUlt && phase === 'fight' && ultCooldown === 0 && slots[1] && !autoFiring) {
            setAutoFiring(true);
            autoFireTimerRef.current = setTimeout(() => {
                autoUsedRef.current = true;
                handleUlt(); // eslint-disable-line react-hooks/immutability
                setAutoFiring(false);
            }, 350);
        }
        return () => clearTimeout(autoFireTimerRef.current);
    }, [ultCooldown, autoUlt]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (phase !== 'select' || !team[1]) return;
        const interval = setInterval(() => setHintTick(t => t + 1), 2200);
        return () => clearInterval(interval);
    }, [phase, team[1]]); // eslint-disable-line react-hooks/exhaustive-deps

    const getLateralSynergyHint = (centerCfg, slotIndex, pairIndex) => {
        if (!centerCfg?.element) return null;
        const centerElement = centerCfg.element;
        const otherId  = team[slotIndex === 0 ? 2 : 0];
        const otherCfg = otherId ? getConfig(otherId) : null;
        const mixedPair = MIXED_SYNERGIES[centerElement] ? MIXED_SYNERGIES[centerElement].split('+') : [];

        if (!otherCfg) {
            // sin nada en ninguno de los 2 laterales: cicla entre combos VALIDOS a la
            // vez (ambos agua / electrico+fuego / fuego+electrico), nunca el mismo
            // elemento suelto en los 2 lados a la vez (eso no es ninguna sinergia real)
            const pairOptions = [[centerElement, centerElement]];
            if (mixedPair.length === 2) {
                pairOptions.push([mixedPair[0], mixedPair[1]]);
                pairOptions.push([mixedPair[1], mixedPair[0]]);
            }
            const pair = pairOptions[pairIndex % pairOptions.length];
            return slotIndex === 0 ? pair[0] : pair[1];
        }
        if (otherCfg.element === centerElement) return centerElement;
        if (mixedPair.includes(otherCfg.element)) {
            return mixedPair.find(e => e !== otherCfg.element) ?? null;
        }
        return null;
    };

    const getActiveMixedSynergy = () => {
        const [leftId, centerId, rightId] = team;
        if (!leftId || !centerId || !rightId) return null;
        const leftCfg   = ForgeDogsConfig[leftId]  ? getConfig(leftId)  : null;
        const rightCfg  = ForgeDogsConfig[rightId] ? getConfig(rightId) : null;
        const centerCfg = getConfig(centerId);
        if (!leftCfg || !rightCfg || !centerCfg?.element) return null;
        const mixedPair = MIXED_SYNERGIES[centerCfg.element];
        if (!mixedPair) return null;
        const lateralPair = [leftCfg.element, rightCfg.element].filter(Boolean).sort().join('+');
        if (lateralPair !== mixedPair) return null;
        return { bonus: mixedRarityValue(leftCfg) + mixedRarityValue(rightCfg) + mixedRarityValue(centerCfg) };
    };

    const getActiveElementSynergy = () => {
        const [leftId, centerId, rightId] = team;
        if (!leftId || !centerId || !rightId) return null;
        const leftCfg   = getConfig(leftId);
        const centerCfg = getConfig(centerId);
        const rightCfg  = getConfig(rightId);
        if (!leftCfg?.element || !centerCfg?.element || !rightCfg?.element) return null;
        if (leftCfg.element !== centerCfg.element || centerCfg.element !== rightCfg.element) return null;
        return { element: centerCfg.element };
    };

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
            const gold       = comboGoldRef.current;
            const starsEarned = threshold?.stars ?? 0;
            const previousBestStars = gameState.raidBestStars?.[activeEnemy.id] ?? 0;
            const isNewBest  = starsEarned > previousBestStars;
            const shards     = isNewBest ? (threshold?.shards ?? 0) : Math.round((threshold?.shards ?? 0) * 0.4);
            const isFirstBossWin = activeEnemy.isBoss && enemyHp <= 0 && previousBestStars === 0;
            const huesinDropped = enemyHp <= 0 && Math.random() * 100 < (activeEnemy.huesinChance ?? 0) ? (activeEnemy.huesinAmount ?? 1) : 0;

            let rewardDogId  = null;
            let rewardRarity = null;
            if (shards > 0 && activeEnemy.rarityPool) {
                rewardRarity = rollRarity(activeEnemy.rarityPool);
                const dog    = pickRewardDog(rewardRarity);
                if (dog) rewardDogId = dog.id;
            }

            let huntCompleted = false;
            if (activeEnemy.isBoss && enemyHp <= 0) {
                const huntRotationKey = getHuntRotationKey(gameState.debugDayOffset ?? 0);
                const hunt = gameState.tablonHunt?.rotationKey === huntRotationKey ? gameState.tablonHunt : null;
                if (hunt?.contracts[activeEnemy.id] === 'accepted') {
                    const contract = getDailyHuntContracts(huntRotationKey).find(c => c.bossId === activeEnemy.id);
                    if (contract) {
                        const ctx = {
                            timerLeft: timer,
                            timerTotal: activeEnemy.timerSec,
                            elements: slots.map(id => id ? getConfig(id)?.element : null),
                            maxCombo: maxComboRef.current,
                            autoUsed: autoUsedRef.current,
                        };
                        huntCompleted = contract.condition.evaluate(ctx);
                    }
                }
            }

            setGameState(prev => {
                const currentBest = prev.raidBestStars?.[activeEnemy.id] ?? 0;

                const attempts = prev.raidAttempts ?? {};
                const current = attempts[activeEnemy.id] ?? { count: 0, cooldownUntil: null };
                const expired = current.cooldownUntil && Date.now() > current.cooldownUntil;
                const baseCount = expired ? 0 : current.count;
                const newCount = baseCount + 1;
                const cooldownUntil = newCount >= 3
                    ? Date.now() + (activeEnemy.isBoss ? 15 : 10) * 60 * 1000
                    : null;
                const newRaidAttempts = { ...attempts, [activeEnemy.id]: { count: newCount, cooldownUntil } };

                let dq = prev.dailyQuests;
                let pjQuests = prev.pjQuests;
                if (enemyHp <= 0) {
                    dq = advanceDailyQuestInState(dq, 'activeWins', 1);
                    dq = advanceDailyQuestInState(dq, 'activeNoLoss', 1);
                    if (slots[1] && !ForgeDogsConfig[slots[1]]) pjQuests = advancePJActiveUse(pjQuests, slots[1]);
                }

                const next = {
                    ...prev,
                    raidBestStars: { ...(prev.raidBestStars ?? {}), [activeEnemy.id]: Math.max(currentBest, starsEarned) },
                    gold: prev.gold + gold,
                    huesin: prev.huesin + huesinDropped,
                    raidAttempts: newRaidAttempts,
                    dailyQuests: dq,
                    pjQuests,
                    ...(huntCompleted ? {
                        tablonHunt: {
                            rotationKey: prev.tablonHunt.rotationKey,
                            contracts: { ...prev.tablonHunt.contracts, [activeEnemy.id]: 'completed' },
                        },
                    } : {}),
                };
                if (!rewardDogId) return next;
                return {
                    ...next,
                    dogs: {
                        ...next.dogs,
                        [rewardDogId]: {
                            ...next.dogs[rewardDogId],
                            fragments: (next.dogs[rewardDogId]?.fragments ?? 0) + shards,
                        },
                    },
                };
            });

            setResultsData({
                pct,
                shards,
                gold,
                starsEarned,
                label:    threshold?.label ?? 'Sin recompensa',
                defeated: enemyHp <= 0,
                rewardDogId,
                rewardRarity,
                maxCombo: maxComboRef.current,
                isFirstBossWin,
                huesin: huesinDropped,
                huntCompleted,
            });
            playSfx('finalMina');
            setPhase('results');
        }
    }, [phase, enemyHp, timer]);

    const getPassiveEffects = () => {
        const eff = {
            doubleHitChance: 0,
            heatStackDmg: 0, addHeatStack: false, heatStackCap: 0,
            oscuroPct: 0, oscuroFlatMin: 0,
            waterInterval: 0, waterBurst: 0,
            electricSparkInterval: 0, electricSparkBurst: 0,
            ultCdReduction: 0, earthFullSynergy: false,
            mixedSynergyBonus: 0,
        };

        // Sinergia de fuego: el tope de stacks sale de cuantos fuegos hay en el equipo
        // (1 lateral / 2 laterales / 2 laterales + central), el daño por stack sigue
        // saliendo de la rareza+estrellas de los perros de forja implicados.
        const leftId   = slots[0];
        const rightId  = slots[2];
        const leftCfg  = leftId  && ForgeDogsConfig[leftId]  ? getConfig(leftId)  : null;
        const rightCfg = rightId && ForgeDogsConfig[rightId] ? getConfig(rightId) : null;
        const centerCfg = slots[1] ? getConfig(slots[1]) : null;

        const fireHeatValue = (id, cfg) => {
            const stars = gameState.forgeDogs?.[id]?.stars ?? 0;
            const base  = cfg.rarity === 'legendary' ? 9 : cfg.rarity === 'epic' ? 7 : 5;
            return base + stars * 0.6;
        };

        const leftIsFire   = leftCfg?.element   === 'fuego';
        const rightIsFire  = rightCfg?.element  === 'fuego';
        const centerIsFire = centerCfg?.element === 'fuego';

        if (leftIsFire && rightIsFire) {
            const leftVal  = fireHeatValue(leftId, leftCfg);
            const rightVal = fireHeatValue(rightId, rightCfg);
            eff.addHeatStack = true;
            if (centerIsFire) {
                eff.heatStackCap = 5;
                eff.heatStackDmg = leftVal + rightVal;
            } else {
                eff.heatStackCap = 3;
                eff.heatStackDmg = Math.max(leftVal, rightVal);
            }
        } else if (leftIsFire || rightIsFire) {
            const [fireId, fireCfg] = leftIsFire ? [leftId, leftCfg] : [rightId, rightCfg];
            eff.addHeatStack = true;
            eff.heatStackCap = 2;
            eff.heatStackDmg = fireHeatValue(fireId, fireCfg);
        }

        // Sinergia de oscuro: suma daño plano segun % de la vida ACTUAL del enemigo
        // (no multiplica el daño del tap). Los laterales no miran rareza, pero en la
        // sinergia completa (central tambien oscuro) la rareza del central SI importa.
        const leftIsOscuro   = leftCfg?.element   === 'oscuro';
        const rightIsOscuro  = rightCfg?.element  === 'oscuro';
        const centerIsOscuro = centerCfg?.element === 'oscuro';

        if (leftIsOscuro && rightIsOscuro) {
            if (centerIsOscuro) {
                const centerTier = { rare: [0.03, 15], epic: [0.05, 25], legendary: [0.06, 30] };
                const [pct, min] = centerTier[centerCfg.rarity] ?? centerTier.rare;
                eff.oscuroPct     = pct;
                eff.oscuroFlatMin = min;
            } else {
                eff.oscuroPct     = 0.015;
                eff.oscuroFlatMin = 10;
            }
        } else if (leftIsOscuro || rightIsOscuro) {
            eff.oscuroPct     = 0.01;
            eff.oscuroFlatMin = 5;
        }

        // Freno fuego+oscuro juntos de laterales: por separado cada uno esta bien
        // ajustado, pero juntos se disparan sin control. Se atenuan los dos segun
        // la rareza del central, solo se libera al 100% con central legendario.
        const fireAndDarkTogether = (leftIsFire && rightIsOscuro) || (leftIsOscuro && rightIsFire);
        if (fireAndDarkTogether) {
            const dampenFactor = centerCfg?.rarity === 'legendary' ? 1 : centerCfg?.rarity === 'epic' ? 0.75 : 0.5;
            eff.heatStackDmg  *= dampenFactor;
            eff.oscuroPct     *= dampenFactor;
            eff.oscuroFlatMin *= dampenFactor;
        }

        // Sinergia de agua: cada X taps se dispara un golpe extra de daño plano
        // (chorro/olita/tsunami). Cuantos mas perros de agua, mas frecuente Y mas
        // fuerte el golpe, sin depender de rareza/estrellas.
        const leftIsWater   = leftCfg?.element   === 'agua';
        const rightIsWater  = rightCfg?.element  === 'agua';
        const centerIsWater = centerCfg?.element === 'agua';

        if (leftIsWater && rightIsWater) {
            if (centerIsWater) {
                eff.waterInterval = 2;
                eff.waterBurst    = 30;
            } else {
                eff.waterInterval = 3;
                eff.waterBurst    = 15;
            }
        } else if (leftIsWater || rightIsWater) {
            eff.waterInterval = 5;
            eff.waterBurst    = 8;
        }

        // Sinergia de tierra: los laterales bajan el cooldown de CUALQUIER ultimate
        // (no solo la de tierra). Si el central tambien es tierra, en vez de aplicar
        // esa reduccion generica, la propia ultimate de tierra pasa a costar un fijo
        // de 7s menos el recorte por rareza+estrellas del central.
        const leftIsEarth   = leftCfg?.element   === 'tierra';
        const rightIsEarth  = rightCfg?.element  === 'tierra';
        const centerIsEarth = centerCfg?.element === 'tierra';

        if (leftIsEarth && rightIsEarth) {
            if (centerIsEarth) {
                eff.earthFullSynergy = true;
            } else {
                eff.ultCdReduction = 1;
            }
        } else if (leftIsEarth || rightIsEarth) {
            eff.ultCdReduction = 0.5;
        }

        // Sinergia de electrico: "chispazo", mismo patron que la ola de agua (cada X
        // taps suelta un golpe extra de daño plano). La ulti (ciclo de 3 disparos) se
        // gestiona aparte en handleUlt.
        const leftIsElectric   = leftCfg?.element   === 'electrico';
        const rightIsElectric  = rightCfg?.element  === 'electrico';
        const centerIsElectric = centerCfg?.element === 'electrico';

        if (leftIsElectric && rightIsElectric) {
            if (centerIsElectric) {
                eff.electricSparkInterval = 2;
                eff.electricSparkBurst    = 100;
            } else {
                eff.electricSparkInterval = 3;
                eff.electricSparkBurst    = 25;
            }
        } else if (leftIsElectric || rightIsElectric) {
            eff.electricSparkInterval = 5;
            eff.electricSparkBurst    = 15;
        }

        // Sinergias mixtas de early game: central + 2 laterales concretos (distintos
        // entre si) dan un bonus de daño plano por tap. Cada uno de los 3 perros
        // implicados aporta segun su PROPIA rareza (rare +2, epic +3, legendary +4),
        // para que 3 rares no rindan igual que 3 legendarios.
        // (tierra+fuego/oscuro quitada de MIXED_SYNERGIES: se sentia rota, tierra de
        // central ya pega fuerte con su ultimate sumado a los tier1 planos de fuego y oscuro)
        const lateralPair = [leftCfg?.element, rightCfg?.element].filter(Boolean).sort().join('+');
        if (centerCfg?.element && MIXED_SYNERGIES[centerCfg.element] === lateralPair) {
            eff.mixedSynergyBonus = mixedRarityValue(leftCfg) + mixedRarityValue(rightCfg) + mixedRarityValue(centerCfg);
        }

        return eff;
    };

    const handleTap = (e) => {
        if (phase !== 'fight' || ultImpactActive) return;
        if (!fightStarted) setFightStarted(true);
        const pickDmg  = gameState.pickaxe.miningPowerByMaterial?.[gameState.pickaxe.material] ?? 2;
        const activeId = slots[1];
        const dogDmg   = activeId ? (getConfig(activeId)?.miningPower ?? 0) : 0;
        const passive  = getPassiveEffects();

        let dmg = Math.max(1, pickDmg + dogDmg);
        dmg += heatStacks * passive.heatStackDmg;
        if (activeEffect?.type === 'damageMulti') dmg *= activeEffect.value;
        if (activeEffect?.type === 'damageAddTaps' && activeEffect.remaining > 0) dmg += activeEffect.value;
        if (activeEffect?.type === 'furyTaps' && activeEffect.remaining > 0)
            dmg += Math.round(enemyHp * activeEffect.value);
        if (passive.oscuroPct > 0) dmg += Math.max(passive.oscuroFlatMin, Math.round(enemyHp * passive.oscuroPct));
        if (passive.waterInterval > 0) {
            waterTapCounterRef.current += 1;
            if (waterTapCounterRef.current >= passive.waterInterval) {
                dmg += passive.waterBurst;
                waterTapCounterRef.current = 0;
            }
        }
        if (passive.electricSparkInterval > 0) {
            electricTapCounterRef.current += 1;
            if (electricTapCounterRef.current >= passive.electricSparkInterval) {
                dmg += passive.electricSparkBurst;
                electricTapCounterRef.current = 0;
            }
        }
        if (passive.mixedSynergyBonus > 0) dmg += passive.mixedSynergyBonus;

        const waterUltActive = activeEffect?.type === 'damageAddTaps' && activeEffect.remaining > 0;
        const defense = waterUltActive
            ? Math.max(0, (activeEnemy?.defense ?? 0) * (1 - activeEffect.armorCutPct))
            : (activeEnemy?.defense ?? 0);
        dmg = Math.round(Math.max(1, dmg - defense));

        const isGuaranteedDouble = activeEffect?.type === 'doubleHits' && activeEffect.remaining > 0;
        const isDoubleHit = isGuaranteedDouble || Math.random() < passive.doubleHitChance;
        const finalDmg = isDoubleHit ? dmg * 2 : dmg;
        setEnemyHp(prev => Math.max(0, prev - finalDmg));

        setShakeKey(k => k + 1);

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const safeX = Math.min(x, rect.width - 90);
        addFloat('damage', { value: finalDmg, x, y }, 900);

        [[slots[0], leftSlotRef], [slots[2], rightSlotRef]].forEach(([lateralId, ref]) => {
            if (!lateralId || !ForgeDogsConfig[lateralId] || !ref.current) return;
            const lateralCfg = getConfig(lateralId);
            const slotRect = ref.current.getBoundingClientRect();
            const fx = slotRect.left + slotRect.width / 2;
            const fy = slotRect.top;
            if (lateralCfg.element === 'fuego') {
                addFloat('slotHeat', { x: fx, y: fy }, 800);
            } else if (lateralCfg.element === 'electrico' && isDoubleHit) {
                addFloat('slotDouble', { x: fx, y: fy }, 900);
            }
        });

        const tapNow = Date.now();
        const gapSinceLastTap = lastTapTimeRef.current ? tapNow - lastTapTimeRef.current : null;
        const newCombo = (gapSinceLastTap !== null && gapSinceLastTap <= COMBO_RESET_TIME) ? comboCountRef.current + 1 : 1;
        lastTapTimeRef.current = tapNow;
        comboCountRef.current = newCombo;
        if (newCombo > maxComboRef.current) maxComboRef.current = newCombo;

        addFloat('combo', { value: newCombo, x: safeX, y: y - 30 }, 800);

        const goldPerCombo = activeEnemy?.goldPerCombo ?? 0;
        if (newCombo >= COMBO_FIRST_MILESTONE && newCombo % COMBO_MILESTONE_INTERVAL === 0) {
            if (goldPerCombo > 0) {
                const bonus = comboGoldRef.current < COMBO_GOLD_CAP ? newCombo * goldPerCombo : COMBO_GOLD_OVERFLOW_STEP;
                comboGoldRef.current += bonus;
            }
            addFloat('milestone', { combo: newCombo, x: safeX, y: y - 70 }, 1800);
        }

        if (passive.addHeatStack) setHeatStacks(prev => Math.min(passive.heatStackCap, prev + 1));
        if (isGuaranteedDouble) {
            setActiveEffect(prev => {
                if (!prev || prev.type !== 'doubleHits') return prev;
                const remaining = prev.remaining - 1;
                return remaining <= 0 ? null : { ...prev, remaining };
            });
        }
        if (activeEffect?.type === 'furyTaps' && activeEffect.remaining > 0) {
            setActiveEffect(prev => {
                if (!prev || prev.type !== 'furyTaps') return prev;
                const remaining = prev.remaining - 1;
                return remaining <= 0 ? null : { ...prev, remaining };
            });
        }
    };

    const triggerUltImpact = (dmg, element) => {
        setUltImpactActive(true);
        setUltImpactElement(element);
        addFloat('ultDamage', { value: dmg, element }, 900);
        setTimeout(() => {
            setEnemyHp(prev => Math.max(0, prev - dmg));
            setUltImpactActive(false);
        }, 400);
    };

    const handleUlt = () => {
        if (phase !== 'fight' || ultCooldown > 0 || !slots[1]) return;
        if (!fightStarted) setFightStarted(true);
        advanceDailyQuest(setGameState, 'abilityUses', 1);
        const activeId = slots[1];
        const cfg      = getConfig(activeId);
        const element  = cfg?.element;
        const passive  = getPassiveEffects();

        setUltCooldown(ULT_COOLDOWN_BY_ELEMENT[element] ?? 12);
        const defense = activeEnemy?.defense ?? 0;
        const applyDefense = (dmg) => Math.max(1, dmg - defense);

        switch (element) {
            case 'fuego': {
                const stars   = gameState.dogs?.[activeId]?.stars ?? 0;
                const baseDmg = cfg.rarity === 'legendary' ? 350 : 250;
                const baseCd  = cfg.rarity === 'legendary' ? 10 : 12;
                const cdStep  = cfg.rarity === 'legendary' ? 0.4 : 0.6;
                setUltCooldown(Math.round(baseCd - stars * cdStep));
                triggerUltImpact(applyDefense(baseDmg + stars * 20), element);
                break;
            }
            case 'electrico': {
                const stars   = gameState.dogs?.[activeId]?.stars ?? 0;
                const baseCd  = cfg.rarity === 'legendary' ? 5 : 6;
                const cdStep  = cfg.rarity === 'legendary' ? 0.2 : 0.3;
                setUltCooldown(Math.round(baseCd - stars * cdStep));

                const shotIndex = electricStacks; // 0 = 1er disparo, 1 = 2do, 2 = 3ero (cargado)
                const shotBase  = cfg.rarity === 'legendary' ? [200, 300, 450][shotIndex] : [150, 175, 250][shotIndex];
                triggerUltImpact(applyDefense(shotBase + stars * 20), element);

                if (shotIndex >= 2) {
                    setElectricStacks(0);
                } else {
                    setElectricStacks(prev => prev + 1);
                }
                break;
            }
            case 'tierra': {
                const stars   = gameState.dogs?.[activeId]?.stars ?? 0;
                const baseDmg = cfg.rarity === 'legendary' ? 750 : cfg.rarity === 'epic' ? 550 : 450;
                if (passive.earthFullSynergy) {
                    const earthBase = cfg.rarity === 'legendary' ? 1.5 : cfg.rarity === 'epic' ? 1 : 0.5;
                    setUltCooldown(Math.round((7 - (earthBase + stars * 0.1)) * 10) / 10);
                } else {
                    const baseCd  = cfg.rarity === 'legendary' ? 10 : cfg.rarity === 'epic' ? 12 : 13;
                    const cdStep  = cfg.rarity === 'legendary' ? 0.4 : 0.6;
                    setUltCooldown(Math.round(baseCd - stars * cdStep));
                }
                triggerUltImpact(applyDefense(baseDmg + stars * 20), element);
                break;
            }
            case 'agua': {
                const stars       = gameState.dogs?.[activeId]?.stars ?? 0;
                const base        = cfg.rarity === 'legendary' ? 50 : cfg.rarity === 'epic' ? 30 : 10;
                const durationSec = cfg.rarity === 'legendary' ? 5 : cfg.rarity === 'epic' ? 4 : 3;
                const armorCutPctBase = cfg.rarity === 'legendary' ? 0.55 : cfg.rarity === 'epic' ? 0.40 : 0.25;
                const cdBase      = cfg.rarity === 'legendary' ? 10 : cfg.rarity === 'epic' ? 12 : 15;
                const cdStep      = cfg.rarity === 'legendary' ? 0.4 : cfg.rarity === 'epic' ? 0.5 : 0.6;
                setUltCooldown(Math.round((cdBase - stars * cdStep) * 10) / 10);
                setActiveEffect({
                    type: 'damageAddTaps',
                    value: base + stars * 3,
                    armorCutPct: armorCutPctBase + stars * 0.01,
                    remaining: durationSec,
                });
                break;
            }
            case 'oscuro': {
                const stars   = gameState.dogs?.[activeId]?.stars ?? 0;
                const pct     = cfg.rarity === 'legendary' ? 0.08 : cfg.rarity === 'epic' ? 0.05 : 0.03;
                const tapBase = cfg.rarity === 'legendary' ? 4 : cfg.rarity === 'epic' ? 3 : 2;
                const cdBase  = cfg.rarity === 'legendary' ? 8 : cfg.rarity === 'epic' ? 9 : 10;
                const cdStep  = cfg.rarity === 'legendary' ? 0.3 : 0.2;
                setUltCooldown(Math.round((cdBase - stars * cdStep) * 10) / 10);
                setActiveEffect({ type: 'furyTaps', value: pct, remaining: Math.round(tapBase + stars * 0.5) });
                break;
            }
        }

        if (passive.ultCdReduction > 0) {
            setUltCooldown(prev => Math.max(1, Math.round((prev - passive.ultCdReduction) * 10) / 10));
        }
    };



    const getAttemptStatus = (enemy) => {
        const data = (gameState.raidAttempts ?? {})[enemy.id] ?? { count: 0, cooldownUntil: null };
        const expired = data.cooldownUntil && Date.now() > data.cooldownUntil;
        if (expired) return { isOnCooldown: false, attemptsLeft: 3, remainingMin: 0 };
        const isOnCooldown = !!data.cooldownUntil;
        const remainingMin = isOnCooldown ? Math.ceil((data.cooldownUntil - Date.now()) / 60000) : 0;
        const attemptsLeft = Math.max(0, 3 - data.count);
        return { isOnCooldown, attemptsLeft, remainingMin };
    };

    const startFight = () => {
        if (team.every(id => id === null) || !activeEnemy) return;
        const centerDog = team[1] ?? null;
        setSlots([team[0] ?? null, centerDog, team[2] ?? null]);
        setAbilityCooldowns({});
        setSwitchCooldowns({});
        setHeatStacks(0);
        setElectricStacks(0);
        setActiveEffect(null);
        setUltCooldown(0);
        setEnemyHp(activeEnemy.hp);
        setTimer(activeEnemy.timerSec);
        comboCountRef.current = 0;
        lastTapTimeRef.current = null;
        comboGoldRef.current = 0;
        maxComboRef.current = 0;
        waterTapCounterRef.current = 0;
        electricTapCounterRef.current = 0;
        autoUsedRef.current = false;
        setPhase('fight');
    };

    const goToBiome = () => {
        setActiveBiome(null);
        setActiveEnemy(null);
        setTeam([]);
        setPhase('biome');
    };

    if (!isOpen) return null;

    const raidBestStars = gameState.raidBestStars ?? {};
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
                    <div className="tavern-title-row">
                        <button className="tavern-back-btn-inline" onClick={onBack ?? onClose}><ArrowLeft size={22} /></button>
                        <h2 className="tavern-title">Asaltos</h2>
                    </div>
                    <p className="combat-subtitle">Elige un bioma</p>
                    <div className="combat-early-warning">
                        Sistema en fase muy temprana. Puede contener errores o cambios bruscos de balance.
                    </div>
                    <div className="combat-biome-grid">
                        {CombatConfig.biomes.map(biome => {
                            const req = biome.requiresBiomeStars;
                            const reqBiome = req ? CombatConfig.biomes.find(b => b.id === req.biomeId) : null;
                            const reqStars = reqBiome
                                ? reqBiome.enemies.reduce((sum, e) => sum + (raidBestStars[e.id] ?? 0), 0)
                                : 0;
                            const locked = !!req && reqStars < req.stars;
                            return (
                                <button
                                    key={biome.id}
                                    className={`combat-biome-btn combat-biome-bg-${biome.id}${biome.comingSoon ? ' combat-biome-soon' : ''}${locked ? ' combat-biome-locked' : ''}`}
                                    onClick={() => { if (!biome.comingSoon && !locked) { setActiveBiome(biome); setPhase('enemy'); } }}
                                    disabled={biome.comingSoon || locked}
                                >
                                    {locked ? (
                                        <>
                                            <Lock size={20} className="cbb-lock-icon" />
                                            <span className="cbb-name">{biome.name}</span>
                                            <span className="cbb-lock-req">{reqStars}/{req.stars} estrellas en {reqBiome.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="cbb-name">{biome.name}</span>
                                            {biome.comingSoon && <span className="cbb-soon-label">Próximamente</span>}
                                        </>
                                    )}
                                </button>
                            );
                        })}
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
                        {activeBiome.enemies.map((enemy, idx) => {
                            const req     = enemy.requiresStars;
                            const locked  = req ? (raidBestStars[req.enemyId] ?? 0) < req.stars : false;
                            const { isOnCooldown, attemptsLeft, remainingMin } = getAttemptStatus(enemy);
                            const earnedStars = raidBestStars[enemy.id] ?? 0;
                            return (
                                <button
                                    key={enemy.id}
                                    className={`combat-enemy-card combat-enemy-frame-${earnedStars}${enemy.isBoss ? ' combat-enemy-boss' : ''}${locked || isOnCooldown ? ' combat-enemy-locked' : ''}${earnedStars >= 3 && !locked && !isOnCooldown ? ' combat-enemy-complete' : ''}`}
                                    onClick={() => { if (!locked && !isOnCooldown) { setActiveEnemy(enemy); setPhase('select'); } }}
                                    disabled={locked || isOnCooldown}
                                >
                                    {enemy.isBoss && !locked && !isOnCooldown && <span className="cec-boss-badge">BOSS</span>}
                                    {locked ? (
                                        <>
                                            <div className="cec-lock-icon"><Lock size={28} /></div>
                                            <span className="cec-name">{enemy.name}</span>
                                            <span className="cec-lock-req">
                                                {req.stars} {req.stars === 1 ? 'estrella' : 'estrellas'} en anterior
                                            </span>
                                        </>
                                    ) : isOnCooldown ? (
                                        <>
                                            <img src={enemyImgs[enemy.id]} alt={enemy.name} style={{ opacity: 0.35 }} />
                                            <span className="cec-name">{enemy.name}</span>
                                            <span className="cec-cooldown"><Moon size={10} /> {remainingMin}min</span>
                                        </>
                                    ) : (
                                        <>
                                            <img src={enemyImgs[enemy.id]} alt={enemy.name} />
                                            <span className="cec-name">{enemy.name}</span>
                                            <span className="cec-meta">❤ {enemy.hp} · {enemy.timerSec}s</span>
                                            {attemptsLeft < 3 && (
                                                <span className="cec-attempts">{attemptsLeft} {attemptsLeft === 1 ? 'intento' : 'intentos'}</span>
                                            )}
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ===== DOG SELECT ===== */}
            {phase === 'select' && activeEnemy && (
                <div className="combat-select">
                    <div className="combat-select-header">
                        <div className="combat-nav">
                            <button className="combat-back-btn" onClick={() => { setActiveEnemy(null); setTeam([]); setPhase('enemy'); }}>
                                <ChevronLeft />
                            </button>
                            <h2 className="combat-title">{activeEnemy.name}</h2>
                            <button className="combat-info-btn" onClick={() => setShowSynergyCodex(true)}>
                                <Info size={18} />
                            </button>
                        </div>
                        <p className="combat-subtitle-meta">❤️ {activeEnemy.hp} · ⏱ {activeEnemy.timerSec}s</p>
                    </div>

                    {(() => {
                        const activeMixed = getActiveMixedSynergy();
                        const activeElementSynergy = getActiveElementSynergy();
                        const elementSynergyInfo = activeElementSynergy ? ELEMENT_ICON[activeElementSynergy.element] : null;
                        const anySynergyActive = !!activeMixed || !!activeElementSynergy;
                        return (
                            <>
                                {activeMixed && <span className="combat-synergy-banner">¡Combo elemental!</span>}
                                {activeElementSynergy && elementSynergyInfo && (
                                    <span className={`combat-synergy-banner csb-elem-${activeElementSynergy.element}`}>
                                        ¡Sinergia total! <elementSynergyInfo.Icon size={12} color={elementSynergyInfo.color} />
                                    </span>
                                )}
                                <div className="combat-selected-slots">
                                    {[0, 1, 2].map(i => {
                                        const id = team[i];
                                        if (id) {
                                            const cfg = getConfig(id);
                                            const slotElemInfo = cfg?.element ? ELEMENT_ICON[cfg.element] : null;
                                            return (
                                                <div key={i} className="csel-column">
                                                    <div
                                                        className={`combat-sel-slot filled dog-rarity-${cfg?.rarity}`}
                                                        onClick={() => setTeam(prev => prev.map((x, j) => j === i ? null : x))}
                                                    >
                                                        <img src={getAsset(id, gameState.dogSkins)} alt={id} />
                                                        <span>{cfg?.name}</span>
                                                    </div>
                                                    {slotElemInfo && (
                                                        <span className={`csel-center-badge${anySynergyActive ? ' csel-badge-glow' : ''}`}>
                                                            <slotElemInfo.Icon size={13} color={slotElemInfo.color} />
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        }
                            const centerId  = team[1];
                            const centerCfg = centerId ? getConfig(centerId) : null;
                            const hintElement = i !== 1 && centerCfg ? getLateralSynergyHint(centerCfg, i, hintTick) : null;
                            const hintInfo = hintElement ? ELEMENT_ICON[hintElement] : null;
                            return (
                                <div key={i} className="csel-column">
                                    <div className="combat-sel-slot empty">
                                        <span className="csel-label">{i === 1 ? 'Minero' : 'Forja'}</span>
                                        {hintInfo ? (
                                            <span key={`${hintElement}-${hintTick}`} className="csel-hint-icon">
                                                <hintInfo.Icon size={18} color={hintInfo.color} />
                                            </span>
                                        ) : (
                                            <span>+</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                                </div>
                            </>
                        );
                    })()}

                    <button
                        className={`combat-start-btn${team.every(id => !id) ? ' combat-start-disabled' : ' combat-start-ready'}`}
                        onClick={startFight}
                        disabled={team.every(id => !id)}
                    >
                        Combatir
                    </button>

                    <div className="combat-dogs-list">
                        {hiredDogs.length === 0 && (
                            <p className="combat-no-dogs">No tienes mascotas contratadas</p>
                        )}
                        {(() => {
                            const renderCard = (dog) => {
                                const cfg      = getConfig(dog.id);
                                const isForge  = !!ForgeDogsConfig[dog.id];
                                const status   = getCombatStatus(dog, isForge);
                                const selected = team.some(id => id === dog.id);
                                const blocked  = status !== 'available' || selected;
                                const elemInfo = cfg?.element ? ELEMENT_ICON[cfg.element] : null;
                                const showInfo = infoCardId === dog.id;
                                return (
                                    <div
                                        key={dog.id}
                                        className={`combat-dog-card${blocked ? ' unavailable' : ''} dog-rarity-${cfg?.rarity}`}
                                        onClick={() => {
                                            if (blocked || showInfo) return;
                                            setTeam(prev => {
                                                const next = [...prev];
                                                if (isForge) {
                                                    if (!next[0]) { next[0] = dog.id; return next; }
                                                    if (!next[2]) { next[2] = dog.id; return next; }
                                                    return prev;
                                                } else {
                                                    if (!next[1]) { next[1] = dog.id; return next; }
                                                    return prev;
                                                }
                                            });
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
                                            <img src={getAsset(dog.id, gameState.dogSkins)} alt={dog.id} />
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
                            };

                            const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2 };
                            const byRarityThenStars = (a, b) => {
                                const ra = RARITY_ORDER[getConfig(a.id)?.rarity] ?? 3;
                                const rb = RARITY_ORDER[getConfig(b.id)?.rarity] ?? 3;
                                if (ra !== rb) return ra - rb;
                                return (b.stars ?? 0) - (a.stars ?? 0);
                            };
                            const miners = hiredDogs.filter(d => !ForgeDogsConfig[d.id]).sort(byRarityThenStars);
                            const forge  = hiredDogs.filter(d =>  ForgeDogsConfig[d.id]).sort(byRarityThenStars);

                            const minerSelected = !!team[1];
                            const selectedMinerCfg = minerSelected ? getConfig(team[1]) : null;

                            return (
                                <>
                                    {miners.length > 0 && (
                                        <div className="cdl-section">
                                            <span className="cdl-section-title">
                                                <Pickaxe size={12} /> Mineros
                                                {minerSelected && (
                                                    <span className="cdl-section-selected-text">{selectedMinerCfg?.name}</span>
                                                )}
                                            </span>
                                            {!minerSelected && (
                                                <div className="combat-dogs-grid">
                                                    {miners.map(renderCard)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {forge.length > 0 && minerSelected && (
                                        <div className="cdl-section">
                                            <span className="cdl-section-title"><Flame size={12} /> Forja</span>
                                            <div className="combat-dogs-grid">
                                                {forge.map(renderCard)}
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* ===== CODEX DE SINERGIAS ===== */}
            {showSynergyCodex && (
                <div className="combat-synergy-codex">
                    <div className="combat-nav">
                        <button className="combat-back-btn" onClick={() => setShowSynergyCodex(false)}>
                            <ChevronLeft />
                        </button>
                        <h2 className="combat-title">Sinergias</h2>
                        <div style={{ width: 32 }} />
                    </div>
                    <div className="csc-list">
                        <p className="csc-section-label">Mismo elemento (los 3 iguales)</p>
                        {ELEMENT_LIST.map(el => {
                            const info = ELEMENT_ICON[el];
                            return (
                                <div key={`same-${el}`} className="csc-row">
                                    <div className="csc-icons">
                                        <info.Icon size={18} color={info.color} />
                                        <info.Icon size={18} color={info.color} />
                                        <info.Icon size={18} color={info.color} />
                                    </div>
                                    <p className="csc-desc">{ELEMENT_SYNERGY_DESC[el]}</p>
                                </div>
                            );
                        })}
                        <p className="csc-section-label">Combos mixtos</p>
                        {Object.entries(MIXED_SYNERGIES).map(([centerEl, pair]) => {
                            const [leftEl, rightEl] = pair.split('+');
                            const centerInfo = ELEMENT_ICON[centerEl];
                            const leftInfo   = ELEMENT_ICON[leftEl];
                            const rightInfo  = ELEMENT_ICON[rightEl];
                            return (
                                <div key={`mixed-${centerEl}`} className="csc-row">
                                    <div className="csc-icons">
                                        <leftInfo.Icon size={18} color={leftInfo.color} />
                                        <centerInfo.Icon size={18} color={centerInfo.color} />
                                        <rightInfo.Icon size={18} color={rightInfo.color} />
                                    </div>
                                    <p className="csc-desc">{MIXED_SYNERGY_DESC}</p>
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
                            <img
                                src={enemyImgs[activeEnemy.id]}
                                alt={activeEnemy.name}
                                key={shakeKey}
                                className={`combat-boss-img${shakeKey > 0 ? ' combat-tap-shake' : ''}${ultImpactActive ? ` combat-ult-shake combat-ult-shake-${ultImpactElement}` : ''}${activeEffect?.type === 'damageAddTaps' && activeEffect.remaining > 0 ? ' combat-water-active' : ''}${activeEffect?.type === 'furyTaps' && activeEffect.remaining > 0 ? ' combat-fury-active' : ''}`}
                            />
                            {floats.map(f => {
                                if (f.type === 'damage') {
                                    return (
                                        <div key={f.id} className="combat-floating-damage" style={{ left: `${f.x}px`, top: `${f.y}px` }}>
                                            -{f.value}
                                        </div>
                                    );
                                }
                                if (f.type === 'combo') {
                                    return (
                                        <div key={f.id} className="combat-floating-combo" style={{ left: `${f.x}px`, top: `${f.y}px` }}>
                                            Combo x{f.value}
                                        </div>
                                    );
                                }
                                if (f.type === 'ultDamage') {
                                    return (
                                        <div key={f.id} className={`combat-floating-ult-damage combat-ult-damage-${f.element}`}>
                                            -{f.value}
                                        </div>
                                    );
                                }
                                if (f.type === 'milestone') {
                                    return (
                                        <div key={f.id} className="combat-floating-milestone-wrap" style={{ left: `${f.x}px`, top: `${f.y}px` }}>
                                            <div className="combat-floating-milestone-combo">COMBO {f.combo}!</div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </button>
                    </div>

                    <div className="combat-team-row">
                        {/* LATERAL IZQUIERDO */}
                        {slots[0] ? (() => {
                            const id  = slots[0];
                            const cfg = getConfig(id);
                            const charging = CONSTANT_PASSIVE_ELEMENTS.includes(cfg?.element) ? cfg.element : null;
                            return (
                                <div key={`left-${id}`} ref={leftSlotRef} className={`combat-slot-lateral dog-rarity-${cfg?.rarity}`}>
                                    <div className={`csl-img-wrap${charging ? ` combat-slot-passive-charging combat-slot-passive-charging-${charging}` : ''}`}>
                                        <img src={getAsset(id, gameState.dogSkins)} alt={id} />
                                    </div>
                                    <span className="csl-name">{cfg?.name}</span>
                                </div>
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
                                    <img src={getAsset(id, gameState.dogSkins)} alt={id} />
                                    <span className="csa-name">{cfg?.name}</span>
                                    <span className="csa-label">activo</span>
                                </div>
                            );
                        })()}

                        {/* LATERAL DERECHO */}
                        {slots[2] ? (() => {
                            const id  = slots[2];
                            const cfg = getConfig(id);
                            const charging = CONSTANT_PASSIVE_ELEMENTS.includes(cfg?.element) ? cfg.element : null;
                            return (
                                <div key={`right-${id}`} ref={rightSlotRef} className={`combat-slot-lateral dog-rarity-${cfg?.rarity}`}>
                                    <div className={`csl-img-wrap${charging ? ` combat-slot-passive-charging combat-slot-passive-charging-${charging}` : ''}`}>
                                        <img src={getAsset(id, gameState.dogSkins)} alt={id} />
                                    </div>
                                    <span className="csl-name">{cfg?.name}</span>
                                </div>
                            );
                        })() : <div className="combat-slot-lateral combat-slot-empty" />}
                    </div>

                    {/* ULT */}
                    {slots[1] && (() => {
                        const id      = slots[1];
                        const cfg     = getConfig(id);
                        const element = cfg?.element;

                        const isReady = ultCooldown === 0;
                        const asset   = ULT_ASSET[element];
                        return (
                            <button
                                className={`combat-ult-btn${isReady ? ' ult-ready' : ''}${autoFiring ? ' ult-auto-firing' : ''}`}
                                onClick={handleUlt}
                                disabled={!isReady}
                            >
                                {asset && <img src={asset} alt={element} className="ult-btn-img" />}
                                {!isReady && <span className="ult-btn-cd">{ultCooldown}s</span>}
                            </button>
                        );
                    })()}

                    {slots[1] && !ForgeDogsConfig[slots[1]] && (
                        <label className="combat-auto-ult">
                            <input
                                type="checkbox"
                                checked={autoUlt}
                                onChange={e => setAutoUlt(e.target.checked)}
                            />
                            Auto
                        </label>
                    )}

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
                        {activeEffect?.type === 'damageAddTaps' && (
                            <span className="combat-effect-badge effect-buff">
                                +{activeEffect.value} DMG · {activeEffect.remaining}s
                            </span>
                        )}
                        {activeEffect?.type === 'furyTaps' && (
                            <span className="combat-effect-badge effect-oscuro">
                                <Moon size={11} color="#b45cff" /> {Math.round(activeEffect.value * 100)}% HP · {activeEffect.remaining} taps
                            </span>
                        )}
                        {heatStacks > 0 && (
                            <span className="combat-effect-badge effect-fuego">
                                <Flame size={11} color="#ff6b35" /> {heatStacks}
                            </span>
                        )}
                        {electricStacks > 0 && (
                            <span className="combat-effect-badge effect-electrico">
                                <Zap size={11} color="#ffe033" /> {electricStacks}/2
                            </span>
                        )}
                    </div>

                    {createPortal(
                        <>
                            {floats.map(f => {
                                if (f.type === 'slotHeat') {
                                    return (
                                        <div key={f.id} className="combat-floating-slot-heat" style={{ left: `${f.x}px`, top: `${f.y}px` }}>
                                            <Flame size={16} color="#ff6b35" />
                                        </div>
                                    );
                                }
                                if (f.type === 'slotDouble') {
                                    return (
                                        <div key={f.id} className="combat-floating-slot-double" style={{ left: `${f.x}px`, top: `${f.y}px` }}>
                                            ¡Doble!
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </>,
                        document.body
                    )}
                </div>
            )}

            {/* ===== RESULTS ===== */}
            {phase === 'results' && resultsData && (
                <div className="combat-results">
                    <h2 className="combat-results-title">
                        {resultsData.defeated ? 'Derrotado' : 'Tiempo agotado'}
                    </h2>
                    <p className="combat-result-boss">{activeEnemy?.name}</p>

                    <div className="combat-result-stars">
                        {[1,2,3].map(s => (
                            <Star
                                key={s}
                                size={36}
                                fill={resultsData.starsEarned >= s ? '#ffd740' : 'none'}
                                color={resultsData.starsEarned >= s ? '#ffd740' : '#333'}
                                strokeWidth={1.5}
                            />
                        ))}
                    </div>

                    <div className="combat-result-enemy-portrait" style={{ '--reveal-pct': `${(resultsData.starsEarned / 3) * 100}%` }}>
                        <img src={enemyImgs[activeEnemy.id]} alt={activeEnemy?.name} className="cre-color" />
                        <img src={enemyImgs[activeEnemy.id]} alt="" className="cre-gray" />
                    </div>

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
                                {resultsData.rewardDogId && (
                                    <div className={`combat-result-dog dog-rarity-${resultsData.rewardRarity}`}>
                                        <img src={getAsset(resultsData.rewardDogId)} alt={resultsData.rewardDogId} />
                                        <div className="combat-result-dog-info">
                                            <span>{getConfig(resultsData.rewardDogId)?.name}</span>
                                            <span className="combat-result-shards">🧩 +{resultsData.shards}</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <span className="combat-result-noreward">Sin recompensa (menos del 15%)</span>
                        )}
                        {resultsData.gold > 0 && (
                            <span className="combat-result-gold">+{resultsData.gold.toLocaleString()} oro</span>
                        )}
                        {resultsData.huesin > 0 && (
                            <span className="combat-result-huesin">+{resultsData.huesin} Huesín</span>
                        )}
                        {resultsData.maxCombo >= COMBO_FIRST_MILESTONE && (
                            <span className="combat-result-combo">Combo máximo x{resultsData.maxCombo}</span>
                        )}
                    </div>

                    {(() => {
                        const nextIdx = activeBiome.enemies.findIndex(e => e.id === activeEnemy.id) + 1;
                        const nextEnemy = activeBiome.enemies[nextIdx] ?? null;
                        const nextUnlocked = nextEnemy && (
                            !nextEnemy.requiresStars ||
                            (raidBestStars[nextEnemy.requiresStars.enemyId] ?? 0) >= nextEnemy.requiresStars.stars
                        ) && !getAttemptStatus(nextEnemy).isOnCooldown;
                        return nextUnlocked ? (
                            <button
                                className="combat-next-enemy-btn"
                                onClick={() => { setActiveEnemy(nextEnemy); setPhase('select'); }}
                            >
                                Siguiente enemigo
                            </button>
                        ) : null;
                    })()}
                    {!resultsData.isFirstBossWin && !getAttemptStatus(activeEnemy).isOnCooldown && (
                        <button className="combat-retry-btn" onClick={() => { setPhase('select'); setTeam([]); }}>
                            Repetir
                        </button>
                    )}
                    <button className="combat-exit-btn" onClick={goToBiome}>
                        Volver al inicio
                    </button>
                </div>
            )}
        </div>
    );
};

export default CombatScreen;
