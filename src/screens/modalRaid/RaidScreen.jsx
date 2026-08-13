import { useState, useEffect } from 'react';
import { X, Pickaxe, ArrowLeft, Flame, Zap, Droplets, Mountain, Moon, Star } from 'lucide-react';
import TutorialPointer from '../../components/TutorialPointer.jsx';
import { playSfx } from '../../game/utils/sfx.js';
import { useGameContext } from '../../game/context/GameContext.jsx';
import bgRaids        from '../../assets/backgrounds/bg-modal-raids/bg-raids.webp';
import bgRaidsPassive from '../../assets/backgrounds/bg-modal-raids/bg-raids-passive/raids-passive-bg.png';
import btnRaidPassive from '../../assets/ui/icons-hud/hud-modals/modal-raids/btn-raid-pasive.webp';
import btnRaidActive  from '../../assets/ui/icons-hud/hud-modals/modal-raids/btn-raid-active.webp';
import btnTablon      from '../../assets/ui/icons-hud/hud-modals/modal-raids/tablon/btn-tablon.webp';
import tabMisiones    from '../../assets/ui/icons-hud/hud-modals/modal-raids/tablon/tab-misiones.webp';
import tabShop        from '../../assets/ui/icons-hud/hud-modals/modal-raids/tablon/tab-shop.webp';
import spiderBossImg   from '../../assets/ui/icons-enemy/spiders/spider-boss.webp';
import batBossImg      from '../../assets/ui/icons-enemy/bats/bat-boss.webp';
import topoBossImg     from '../../assets/ui/icons-enemy/topos/topo-boss.webp';
import scorpionBossImg from '../../assets/ui/icons-enemy/scorpions/scorpion-boss.webp';
import { getHuntRotationKey, getDailyHuntContracts, getHuntBossName } from '../../game/config/TablonHuntConfig.js';
import huesinCoin from '../../assets/ui/icons-hud/hud-principal/huesin-coin.webp';

const HUNT_BOSS_IMG = {
    'spider-boss': spiderBossImg,
    'bat-boss': batBossImg,
    'topo-boss': topoBossImg,
    'scorpion-boss': scorpionBossImg,
};
import ladyRun1 from '../../assets/ui/lady-sprite/lady-run/lady-1.webp';
import ladyRun2 from '../../assets/ui/lady-sprite/lady-run/lady-2.webp';
import ladyRun3 from '../../assets/ui/lady-sprite/lady-run/lady-3.webp';
import ladyRun4 from '../../assets/ui/lady-sprite/lady-run/lady-4.webp';
import ladyWait1 from '../../assets/ui/lady-sprite/lady-wait/wait-1/lady-wait-1.webp';
import ladyWait2 from '../../assets/ui/lady-sprite/lady-wait/wait-1/lady-wait-2.webp';
import gordoRun1 from '../../assets/ui/lady-sprite/gordo-run/gordo-1.webp';
import gordoRun2 from '../../assets/ui/lady-sprite/gordo-run/gordo-2.webp';
import gordoRun3 from '../../assets/ui/lady-sprite/gordo-run/gordo-3.webp';
import gordoRun4 from '../../assets/ui/lady-sprite/gordo-run/gordo-4.webp';
import munaRun1 from '../../assets/ui/lady-sprite/muna-run/muna-1.webp';
import munaRun2 from '../../assets/ui/lady-sprite/muna-run/muna-2.webp';
import munaRun3 from '../../assets/ui/lady-sprite/muna-run/muna-3.webp';
import munaRun4 from '../../assets/ui/lady-sprite/muna-run/muna-4.webp';
import nupitoRun1 from '../../assets/ui/lady-sprite/nupito-run/nupito-1.webp';
import nupitoRun2 from '../../assets/ui/lady-sprite/nupito-run/nupito-2.webp';
import nupitoRun3 from '../../assets/ui/lady-sprite/nupito-run/nupito-3.webp';
import nupitoRun4 from '../../assets/ui/lady-sprite/nupito-run/nupito-4.webp';
import tukaRun1 from '../../assets/ui/lady-sprite/tuka-run/tuka-1.webp';
import tukaRun2 from '../../assets/ui/lady-sprite/tuka-run/tuka-2.webp';
import tukaRun3 from '../../assets/ui/lady-sprite/tuka-run/tuka-3.webp';
import tukaRun4 from '../../assets/ui/lady-sprite/tuka-run/tuka-4.webp';
import druhRun1 from '../../assets/ui/lady-sprite/druh-run/druh-1.webp';
import druhRun2 from '../../assets/ui/lady-sprite/druh-run/druh-2.webp';
import druhRun3 from '../../assets/ui/lady-sprite/druh-run/druh-3.webp';
import druhRun4 from '../../assets/ui/lady-sprite/druh-run/druh-4.webp';

const LADY_WAIT_FRAMES = [ladyWait1, ladyWait2];
const RUN_SPRITES = {
    lady:   [ladyRun1, ladyRun2, ladyRun3, ladyRun4],
    gordo:  [gordoRun1, gordoRun2, gordoRun3, gordoRun4],
    muna:   [munaRun1, munaRun2, munaRun3, munaRun4],
    nupito: [nupitoRun1, nupitoRun2, nupitoRun3, nupitoRun4],
    tuka:   [tukaRun1, tukaRun2, tukaRun3, tukaRun4],
    druh:   [druhRun1, druhRun2, druhRun3, druhRun4],
};
const RUN_SPRITE_KEYS = Object.keys(RUN_SPRITES);

// Mientras no todos los perros tengan sprite propio: usa el del primer perro
// del equipo que sí tenga uno, y si ninguno tiene, uno random pero estable
// para esa raid/pedido en concreto (no debe cambiar en cada repintado).
const getRunFrames = (dogEntries, seed) => {
    for (const entry of dogEntries ?? []) {
        const id = entry?.id ?? entry;
        if (RUN_SPRITES[id]) return RUN_SPRITES[id];
    }
    const idx = Math.abs(seed ?? 0) % RUN_SPRITE_KEYS.length;
    return RUN_SPRITES[RUN_SPRITE_KEYS[idx]];
};
import cardBgForest   from '../../assets/backgrounds/bg-modal-raids/cards-pasive-raids/bosque-antiguo.webp';
import cardBgCaves    from '../../assets/backgrounds/bg-modal-raids/cards-pasive-raids/cavernas-oscuras.webp';
import cardBgVolcano  from '../../assets/backgrounds/bg-modal-raids/cards-pasive-raids/volcan-diamantes.webp';
import { RaidConfig, calcTeamStrength } from '../../game/config/RaidConfig.js';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig.js';
import { TavernConfig } from '../../game/config/TavernConfig.js';
import PrizeOverlay from '../../components/PrizeOverlay.jsx';
import '../../styles/modals/RaidScreen.css';
import '../../styles/modals/ForgeModal.css';
import '../../styles/modals/TavernModal.css';
import '../../styles/modals/RewardsModal.css';
import '../../styles/modals/CombatScreen.css';

const TABLON_ELEMENT_ICON = {
    fuego:     { Icon: Flame,    color: '#ff6b35' },
    electrico: { Icon: Zap,      color: '#FFD700' },
    agua:      { Icon: Droplets, color: '#4fc3f7' },
    tierra:    { Icon: Mountain, color: '#8b6914' },
    oscuro:    { Icon: Moon,     color: '#b45cff' },
};

import iconTavernTrigo from '../../assets/ui/icons-hud/hud-modals/icons-tavern/trigo.webp';
import iconTavernLupulo from '../../assets/ui/icons-hud/hud-modals/icons-tavern/lupulo.webp';
import iconSelectLeft from '../../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/select-left.webp';
import iconSelectRight from '../../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/select-right.webp';
import cardBgTrigo from '../../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/trigo.webp';
import cardBgLupulo from '../../assets/ui/icons-hud/hud-modals/modal-comerciante/icons-comerciante/lupulo.webp';

import iconGold         from '../../assets/ui/icons-hud/hud-principal/oro1.webp';
import coinTavern       from '../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp';
import iconShardRare    from '../../assets/ui/icons-pets-shards/icon-shard-rare-generic.webp';
import iconShardEpic    from '../../assets/ui/icons-pets-shards/icon-shard-epic-generic.webp';
import iconShardLegend  from '../../assets/ui/icons-pets-shards/icon-shard-legendary-generic.webp';

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
    pip: forgeIcon1, koda: forgeIcon2, milo: forgeIcon3,
    rocky: forgeIcon4, bruno: forgeIcon5, max: forgeIcon6,
    rex: forgeIcon7, toby: forgeIcon8, buddy: forgeIcon9,
    dayo: forgeDayoIcon,
};

const RARITY_RANK = { common: 0, rare: 1, epic: 2, legendary: 3 };

const fmt = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return n;
};

const formatTime = (ms) => {
    const s = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

// ============================================================
// Posiciones de los botones del hub sobre el fondo (% relativo al contenedor)
const SHARD_ICON = {
    rare:      iconShardRare,
    epic:      iconShardEpic,
    legendary: iconShardLegend,
};

const RAID_SHARD_ICON = {
    forest:  iconShardRare,
    caves:   iconShardEpic,
    volcano: iconShardLegend,
};

const RAID_CARD_BG = {
    forest:  cardBgForest,
    caves:   cardBgCaves,
    volcano: cardBgVolcano,
};

const PROV_CARD_BG = {
    trigo:  cardBgTrigo,
    lupulo: cardBgLupulo,
};

const PROV_ICON = {
    trigo:  iconTavernTrigo,
    lupulo: iconTavernLupulo,
};

// Tablón de Envíos: pendiente de asset propio para el botón del hub, se deja oculto
// hasta que exista (ver HUB_BUTTONS.orders). Cambiar a `true` para probarlo mientras tanto.
const SHOW_ENVIOS_TABLON = false;

// Tablón: escaparate rotativo (2 rare + 1 epic + 1 legendario, cambia cada 24h)
const TABLON_SHOP_PRICE = { rare: 5, epic: 10, legendary: 15 };
const TABLON_SHOP_FRAGMENTS = 20;

const getTablonRotationKey = (dayOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d.toISOString().slice(0, 10);
};

const buildRarityPools = (config) => {
    const pools = { rare: [], epic: [], legendary: [] };
    Object.entries(config).forEach(([id, cfg]) => {
        if (pools[cfg.rarity]) pools[cfg.rarity].push(id);
    });
    return pools;
};

const seededRng = (seed) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    return () => {
        h = Math.imul(h ^ (h >>> 15), h | 1);
        h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
        return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
    };
};

const pickN = (pool, n, rng, exclude = []) => {
    const preferred = pool.filter(id => !exclude.includes(id));
    const source = preferred.length >= n ? preferred : pool;
    const shuffled = [...source];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
};

const getTablonLineup = (category, rotationKey, pools) => {
    const rng = seededRng(`${rotationKey}-${category}`);
    const yesterdayKey = getTablonRotationKey(-1);
    const yesterdayRng = seededRng(`${yesterdayKey}-${category}`);
    const yesterdayRare = pickN(pools.rare, 2, yesterdayRng);
    return {
        rare: pickN(pools.rare, 2, rng, yesterdayRare),
        epic: pickN(pools.epic, 1, rng),
        legendary: pickN(pools.legendary, 1, rng),
    };
};

const HUB_BUTTONS = {
    passive: { top: '40%', left: '22%' },
    active:  { top: '30%', left: '55%' },
    orders:  { top: '15%', left: '38%' },
    tablon:  { top: '40%', left: '87%' },
};

const RaidScreen = ({ isOpen, onClose, onOpenCombat, tutorialStep, onTutorialAdvanceToPassive, onTutorialRaidSent }) => {
    const {
        gameState, setGameState,
        handleSendPassiveRaid,
        handleClaimPassiveRaid,
        handleUnlockRaidActivas,
        handleSendOrder,
        handleClaimOrder,
        handleBuyTablonDog,
    } = useGameContext();

    const [now, setNow] = useState(Date.now());
    const [selectedRaid, setSelectedRaid] = useState(null);
    const [teamDogIds, setTeamDogIds] = useState([]);
    const [selectedOrderMat, setSelectedOrderMat] = useState(null);
    const [orderQty, setOrderQty] = useState({ trigo: 1, lupulo: 1 });
    const [orderAutoResend, setOrderAutoResend] = useState({ trigo: false, lupulo: false });
    const [raidView, setRaidView] = useState('hub');
    const [tablonTab, setTablonTab] = useState('canje');
    const [canjeCategory, setCanjeCategory] = useState('perros');
    const [showRaidIntro, setShowRaidIntro] = useState(false);
    const [prizeQueue, setPrizeQueue] = useState([]);
    const [frameIndex, setFrameIndex] = useState(0);
    const [waitFrameIndex, setWaitFrameIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setRaidView('hub');
            setSelectedRaid(null);
            setTeamDogIds([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setFrameIndex(prev => (prev + 1) % 4), 150);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setWaitFrameIndex(prev => (prev + 1) % 2), 2000);
        return () => clearInterval(t);
    }, []);

    // Auto-select forest + Druh during tutorial raid step
    useEffect(() => {
        if (!isOpen || tutorialStep !== 'hint_raids_passive') return;
        const passiveRaids = gameState.raid?.passiveRaids ?? [];
        if (passiveRaids.some(r => r.raidId === 'forest')) return;
        setSelectedRaid('forest');
        setTeamDogIds([{ id: 'druh', isForge: false, isRented: true }]);
    }, [isOpen, tutorialStep]); // eslint-disable-line

    if (!isOpen) return null;

    const passiveRaids = gameState.raid?.passiveRaids ?? [];
    const dogs = gameState.dogs ?? {};
    const forgeDogs = gameState.forgeDogs ?? {};
    const raidOrders = gameState.raidOrders ?? {};
    const tavernStock = gameState.tavernStock ?? {};

    const rentalForRaids = (gameState.rental?.active ?? []).filter(r =>
        r.destination === 'raid' &&
        !passiveRaids.some(pr => pr.dogEntries?.some(d => d.id === r.dogId))
    );

    const formatRentalMs = (ms) => {
        const totalSec = Math.ceil(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const availableDogs = [
        ...rentalForRaids.map(r => ({
            id: r.dogId,
            isForge: false,
            isRented: true,
            remainingMs: r.remainingMs,
            stars: dogs[r.dogId]?.stars ?? 0,
            hired: true,
            assignedTo: null,
        })),
        ...Object.values(dogs).filter(d => d && typeof d === 'object' && d.hired && (!d.assignedTo || d.assignedTo?.globalSlot !== undefined))
            .map(d => ({ ...d, isForge: false, inGlobalSlot: d.assignedTo?.globalSlot !== undefined })),
        ...Object.values(forgeDogs).filter(d => d && typeof d === 'object' && d.hired && (!d.assignedTo || d.assignedTo?.globalSlot !== undefined))
            .map(d => ({ ...d, isForge: true, inGlobalSlot: d.assignedTo?.globalSlot !== undefined })),
    ];

    const getDogConfig = (dogId, isForge) => isForge ? ForgeDogsConfig[dogId] : DogsConfig[dogId];

    // teamDogIds: array de { id, isForge }
    const toggleDog = (dogId, isForge, isRented = false) => {
        setTeamDogIds(prev => {
            if (prev.some(d => d.id === dogId)) return prev.filter(d => d.id !== dogId);
            if (!selectedRaid) return prev;
            if (prev.length >= 3) return prev;
            return [...prev, { id: dogId, isForge, isRented }];
        });
    };

    const removeSlot = (dogId) => {
        setTeamDogIds(prev => prev.filter(d => d.id !== dogId));
    };

    const handleSelectRaid = (raidId) => {
        if (passiveRaids.some(r => r.raidId === raidId)) return;
        if (selectedRaid === raidId) {
            setSelectedRaid(null);
            setTeamDogIds([]);
        } else {
            setSelectedRaid(raidId);
            setTeamDogIds([]);
        }

    };


    const buildPrizeData = (loot, raidCfg) => {
        const steps = [];
        const sub = `${raidCfg.emoji} ${raidCfg.name}`;
        if (loot.gold > 0) steps.push({
            icon: iconGold, label: `+${fmt(loot.gold)} oro`, sublabel: sub, isWin: true, sfx: 'rewardGold',
        });
        if (loot.tavernCoins > 0) steps.push({
            icon: coinTavern, label: `+${loot.tavernCoins} monedas`, sublabel: sub, isWin: true, sfx: 'rewardGold',
        });
        loot.fragments?.forEach(f => steps.push({
            icon: SHARD_ICON[DogsConfig[f.dogId]?.rarity] ?? iconShardRare,
            label: `×${f.amount} fragmentos`,
            sublabel: DogsConfig[f.dogId]?.name ?? f.dogId,
            isWin: true,
            sfx: 'rewardGold',
        }));
        if (loot.huesin > 0) steps.push({
            icon: iconGold, label: `+${loot.huesin} Huesín`, sublabel: sub, isWin: true, sfx: 'rewardGold',
        });
        if (steps.length === 0) steps.push({
            icon: iconGold, label: 'Sin botín', sublabel: sub, isWin: false, sfx: 'blocked',
        });
        setPrizeQueue(steps);
    };

    const handleSend = (raidId, minTeam) => {
        if (teamDogIds.length < minTeam) return;
        playSfx('sendRaid');
        handleSendPassiveRaid(raidId, teamDogIds);
        setTeamDogIds([]);
        setSelectedRaid(null);
        if (tutorialStep === 'hint_raids_passive') {
            onTutorialRaidSent?.();
        }
    };

    const handleAcceptHunt = (bossId, rotationKey) => {
        setGameState(prev => {
            const hunt = prev.tablonHunt?.rotationKey === rotationKey ? prev.tablonHunt : { rotationKey, contracts: {} };
            if (hunt.contracts[bossId]) return prev;
            return { ...prev, tablonHunt: { rotationKey, contracts: { ...hunt.contracts, [bossId]: 'accepted' } } };
        });
    };

    const handleClaimHunt = (bossId, rotationKey, reward) => {
        setGameState(prev => {
            const hunt = prev.tablonHunt?.rotationKey === rotationKey ? prev.tablonHunt : null;
            if (!hunt || hunt.contracts[bossId] !== 'completed') return prev;
            return {
                ...prev,
                huesin: prev.huesin + reward,
                tablonHunt: { rotationKey, contracts: { ...hunt.contracts, [bossId]: 'claimed' } },
            };
        });
    };

    return (
        <div className="raid-backdrop" onClick={(tutorialStep === 'hint_raids' || tutorialStep === 'hint_raids_passive') ? undefined : onClose}>
            <div className={`raid-screen-content raid-view-${raidView}`} onClick={e => e.stopPropagation()} style={{ backgroundImage: raidView === 'passive'
    ? `url(${bgRaidsPassive})`
    : `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bgRaids})`
}}>
                {raidView !== 'tablon' && (
                    <button
                        className="modal-close"
                        onClick={raidView !== 'hub' ? () => { setRaidView('hub'); setSelectedRaid(null); setTeamDogIds([]); } : ((tutorialStep === 'hint_raids' || tutorialStep === 'hint_raids_passive') ? undefined : onClose)}
                        disabled={tutorialStep === 'hint_raids' || tutorialStep === 'hint_raids_passive'}
                        style={(tutorialStep === 'hint_raids' || tutorialStep === 'hint_raids_passive') ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
                    ><X /></button>
                )}

                {/* HUB */}
                {raidView === 'hub' && (
                    <div className="raid-hub">
                        <button
                            className={`raid-hub-btn ${tutorialStep === 'hint_raids' ? 'tutorial-highlight' : (passiveRaids.some(r => now >= r.returnAt) || (availableDogs.length > 0 && passiveRaids.length < RaidConfig.passiveRaids.length)) ? 'btn-notify-dot notify-pulse' : ''}`}
                            style={{ top: HUB_BUTTONS.passive.top, left: HUB_BUTTONS.passive.left, position: 'absolute' }}
                            data-tutorial="tut-raids-passive"
                            onClick={() => { if (tutorialStep === 'hint_raids') onTutorialAdvanceToPassive?.(); if (!gameState.tutorial?.raidIntroDone) setShowRaidIntro(true); setRaidView('passive'); }}
                        >
                            <img src={btnRaidPassive} alt="pasiva" className="raid-hub-btn-img" />
                            {tutorialStep === 'hint_raids' && <TutorialPointer step="hint_raids" />}
                        </button>
                        <button
                            className={`raid-hub-btn ${!gameState.raidActivasUnlocked ? 'raid-hub-btn-locked' : ''}`}
                            style={{ top: HUB_BUTTONS.active.top, left: HUB_BUTTONS.active.left }}
                            onClick={() => {
                                if (gameState.raidActivasUnlocked) { setRaidView('active'); onOpenCombat?.(); }
                                else handleUnlockRaidActivas();
                            }}
                            disabled={!gameState.raidActivasUnlocked && gameState.gold < 25000}
                        >
                            <img src={btnRaidActive} alt="activa" className="raid-hub-btn-img" />
                            {!gameState.raidActivasUnlocked && (
                                <span className={`raid-hub-price ${gameState.gold >= 25000 ? 'raid-hub-price-ready' : ''}`}>
                                    <img src={iconGold} alt="gold" />25k
                                </span>
                            )}
                        </button>
                        {SHOW_ENVIOS_TABLON && (
                            <button
                                className="raid-hub-btn"
                                style={{ top: HUB_BUTTONS.orders.top, left: HUB_BUTTONS.orders.left }}
                                onClick={() => setRaidView('orders')}
                            >
                                <img src={btnRaidPassive} alt="envios" className="raid-hub-btn-img" />
                            </button>
                        )}
                        <button
                            className="raid-hub-btn"
                            style={{ top: HUB_BUTTONS.tablon.top, left: HUB_BUTTONS.tablon.left }}
                            onClick={() => setRaidView('tablon')}
                        >
                            <img src={btnTablon} alt="tablón" className="raid-hub-btn-img" />
                        </button>
                    </div>
                )}

                {showRaidIntro && (
                    <div className="forge-intro-overlay">
                        <h3 className="forge-intro-title">⚔️ Raids</h3>
                        <p className="forge-intro-text">
                            Envía a tus mascotas en expediciones mientras sigues jugando. Cada raid dura un tiempo y al terminar te trae oro, monedas o fragmentos.
                        </p>
                        <p className="forge-intro-text">
                            Cuanto más fuertes sean las mascotas del equipo, más recompensas obtendrás.
                        </p>
                        <button
                            className="forge-intro-btn"
                            onClick={() => {
                                setShowRaidIntro(false);
                                setGameState(prev => ({
                                    ...prev,
                                    tutorial: { ...prev.tutorial, raidIntroDone: true }
                                }));
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                )}

                {/* CONTENIDO PASIVA */}
                {raidView === 'passive' && <>

                {/* LISTA DE RAIDS */}
                <div className="raid-list">
                        {RaidConfig.passiveRaids.map(raid => {
                            const activeRaid = passiveRaids.find(r => r.raidId === raid.id);
                            const isActive = !!activeRaid;
                            const isSelected = selectedRaid === raid.id && !isActive;

                            const canClaim = isActive && now >= activeRaid.returnAt;
                            const timeLeft = isActive ? activeRaid.returnAt - now : 0;
                            const progress = isActive
                                ? Math.min(1, (now - activeRaid.startedAt) / (activeRaid.returnAt - activeRaid.startedAt))
                                : 0;
                            const teamStrength = isSelected
                                ? calcTeamStrength(teamDogIds.map(d => d.id), dogs, raid.difficulty)
                                : isActive
                                    ? calcTeamStrength((activeRaid.dogEntries ?? activeRaid.dogIds ?? []).map(d => d.id ?? d), dogs, raid.difficulty)
                                    : 0;

                            return (
                                <div key={raid.id} className="raid-entry">

                                    {/* RAID CARD */}
                                    <div
                                        className={`raid-card ${isSelected ? 'raid-card-selected' : ''} ${isActive ? 'raid-card-active' : ''}`}
                                        onClick={() => !isActive && handleSelectRaid(raid.id)}
                                        style={RAID_CARD_BG[raid.id] ? {
                                            backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${RAID_CARD_BG[raid.id]})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center 20%',
                                        } : undefined}
                                    >
                                        {isActive ? (
                                            /* Estado EN CURSO */
                                            <div className="raid-inline-progress">
                                                <div className="rip-header">
                                                    <span className="rc-name">{raid.name}</span>
                                                </div>
                                                <div className="rip-dogs">
                                                    {(activeRaid.dogEntries ?? activeRaid.dogIds?.map(id => ({ id, isForge: false })) ?? []).map(({ id }) => (
                                                        <div key={id} className={`rip-dog dog-rarity-${DogsConfig[id]?.rarity}`}>
                                                            <img src={dogAssets[id]} alt={id} />
                                                            <span>{DogsConfig[id]?.name ?? id}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {canClaim ? (
                                                    <div className="rip-actions">
                                                        <img
                                                            src={LADY_WAIT_FRAMES[waitFrameIndex]}
                                                            className="raid-lady-sprite raid-lady-wait"
                                                            alt="lady"
                                                        />
                                                        <button
                                                            className="btn-claim-raid btn-claim-ready"
                                                            onClick={e => { e.stopPropagation(); handleClaimPassiveRaid(raid.id, buildPrizeData); }}
                                                        >
                                                            Reclamar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="raid-lady-track">
                                                        <img
                                                            src={getRunFrames(activeRaid.dogEntries ?? activeRaid.dogIds?.map(id => ({ id })), activeRaid.startedAt)[frameIndex]}
                                                            className="raid-lady-sprite"
                                                            alt="lady"
                                                            style={{ left: `${Math.min(92, Math.max(8, progress * 100))}%` }}
                                                        />
                                                        <span className="raid-lady-timer">⏱ {formatTime(timeLeft)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Estado NORMAL */
                                            <>
                                                <div className="rc-info">
                                                    <span className="rc-name">{raid.name}</span>
                                                    <span className="rc-desc">{raid.description}</span>
                                                    <span className="rc-meta">
                                                        ⏱ {formatTime(raid.duration * 1000)} &nbsp;·&nbsp;
                                                        👥 {raid.minTeam === raid.maxTeam ? `${raid.minTeam}` : `${raid.minTeam}–${raid.maxTeam}`} perros
                                                        {raid.minRarity && <> &nbsp;·&nbsp; <span className={`rc-min-rarity rarity-${raid.minRarity}`}>min. {raid.minRarity}</span></>}
                                                    </span>
                                                </div>
                                                <div className="rc-loot-preview">
                                                    {Object.keys(raid.loot).map(res =>
                                                        res === 'gold' ? <img key={res} src={iconGold} alt="gold" /> :
                                                        res === 'tavernCoins' ? <img key={res} src={coinTavern} alt="coins" /> :
                                                        res === 'fragments' ? <img key={res} src={RAID_SHARD_ICON[raid.id] ?? iconShardRare} alt="shards" /> : null
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* SELECTOR DE EQUIPO — se abre debajo de la raid */}
                                    {isSelected && (
                                        <div className="raid-team-picker">
                                            {/* 3 slots */}
                                            <div className="rtp-slots">
                                                {[0, 1, 2].map(i => {
                                                    const slot = teamDogIds[i];
                                                    const required = i < raid.minTeam;
                                                    if (slot) {
                                                        const cfg = getDogConfig(slot.id, slot.isForge);
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`rtp-slot filled dog-rarity-${cfg?.rarity}`}
                                                                onClick={() => removeSlot(slot.id)}
                                                                title="Click para quitar"
                                                            >
                                                                <img src={dogAssets[slot.id]} alt={slot.id} />
                                                                <span>{cfg?.name ?? slot.id}</span>
                                                            </div>
                                                        );
                                                    }
                                                    return (
                                                        <div key={i} className={`rtp-slot empty ${required ? 'rtp-required' : 'rtp-optional'}`}>
                                                            <span>{required ? '!' : '+'}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {teamStrength > 0 && (
                                                <p className="rts-strength">
                                                    Fuerza estimada: <strong>{Math.round(teamStrength * 100)}%</strong>
                                                </p>
                                            )}

                                            {(() => {
                                                const meetsRarity = !raid.minRarity || teamDogIds.some(d => {
                                                    const cfg = getDogConfig(d.id, d.isForge);
                                                    return (RARITY_RANK[cfg?.rarity] ?? 0) >= (RARITY_RANK[raid.minRarity] ?? 0);
                                                });
                                                const canSend = teamDogIds.length >= raid.minTeam && meetsRarity;
                                                return (<>
                                                    <button
                                                        className={`btn-send-raid ${canSend ? '' : 'btn-send-disabled'}`}
                                                        onClick={() => handleSend(raid.id, raid.minTeam)}
                                                        disabled={!canSend}
                                                    >
                                                        Enviar equipo
                                                    </button>
                                                    {teamDogIds.length >= raid.minTeam && !meetsRarity && (
                                                        <p className="rts-rarity-warning">Necesitas al menos un perro {raid.minRarity}</p>
                                                    )}
                                                </>);
                                            })()}

                                            {/* Grid de perros disponibles */}
                                            <div className="raid-dogs-grid">
                                                {availableDogs.length === 0 && (
                                                    <p className="raid-no-dogs">Sin perros disponibles</p>
                                                )}
                                                {availableDogs.map(dog => {
                                                    const cfg = getDogConfig(dog.id, dog.isForge);
                                                    const selected = teamDogIds.includes(dog.id);
                                                    return (
                                                        <button
                                                            key={dog.id}
                                                            className={`raid-dog-card ${selected ? 'raid-dog-selected' : ''} dog-rarity-${cfg?.rarity}`}
                                                            onClick={() => toggleDog(dog.id, dog.isForge, dog.isRented)}
                                                        >
                                                            <img src={dogAssets[dog.id]} alt={dog.id} />
                                                            <span className="rdc-name">{cfg?.name ?? dog.id}</span>
                                                            <span className="rdc-stars">
                                                                {'★'.repeat(dog.stars ?? 0)}{'☆'.repeat(5 - (dog.stars ?? 0))}
                                                            </span>
                                                            {dog.isForge && <span className="rdc-forge-badge">🔥</span>}
                                                            {dog.isRented && <span className="rdc-rented-badge">{formatRentalMs(dog.remainingMs)}</span>}
                                                            {dog.inGlobalSlot && <span className="rdc-mining-badge"><Pickaxe size={10} /></span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                        </div>
                                    )}


                                </div>
                            );
                        })}
                    </div>
                </>}

                {/* TABLÓN DE ENVÍOS — trigo/lupulo, mismo esqueleto que Pasivas */}
                {raidView === 'orders' && (
                    <div className="raid-list">
                        {TavernConfig.provisions.map(prov => {
                            const matId = prov.id;
                            const current = tavernStock[matId] ?? 0;
                            const maxStock = gameState.tavernProvisionMaxStock ?? TavernConfig.provisionsMaxStock;
                            const order = raidOrders[matId] ?? null;
                            const ready = order && now >= order.returnAt;
                            const orderProgress = order ? Math.min(1, (now - order.startedAt) / (order.returnAt - order.startedAt)) : 0;
                            const orderReturning = orderProgress > 0.5;
                            const orderVisualProgress = orderReturning ? (1 - orderProgress) * 2 : orderProgress * 2;

                            const qty = orderQty[matId] ?? 1;
                            const roomLeft = maxStock - current;
                            const maxQtyByRoom = Math.max(1, Math.floor(roomLeft / prov.buyAmount));
                            const maxQtyByGold = Math.max(1, Math.floor(gameState.gold / (prov.costPerUnit * prov.buyAmount)));
                            const maxQty = Math.min(maxQtyByRoom, maxQtyByGold);
                            const canOrder = roomLeft >= prov.buyAmount && gameState.gold >= prov.costPerUnit * prov.buyAmount;
                            const isSelected = selectedOrderMat === matId && !order;
                            const dogCfg = order ? (order.isForge ? ForgeDogsConfig[order.dogId] : DogsConfig[order.dogId]) : null;

                            return (
                                <div key={matId} className="raid-entry">
                                    <div
                                        className={`raid-card ${isSelected ? 'raid-card-selected' : ''} ${order ? 'raid-card-active' : ''}`}
                                        onClick={() => !order && setSelectedOrderMat(p => p === matId ? null : matId)}
                                        style={PROV_CARD_BG[matId] ? {
                                            backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${PROV_CARD_BG[matId]})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center 20%',
                                        } : undefined}
                                    >
                                        {order ? (
                                            <div className="raid-inline-progress">
                                                <div className="rip-header">
                                                    <span className="rc-name">{prov.label} · {current}/{maxStock}</span>
                                                </div>
                                                <div className="rip-dogs">
                                                    <div className={`rip-dog dog-rarity-${dogCfg?.rarity}`}>
                                                        <img src={dogAssets[order.dogId]} alt={order.dogId} />
                                                        <span>{dogCfg?.name ?? order.dogId}</span>
                                                    </div>
                                                </div>
                                                {ready ? (
                                                    <div className="rip-actions">
                                                        <img src={LADY_WAIT_FRAMES[waitFrameIndex]} className="raid-lady-sprite raid-lady-wait" alt="lady" />
                                                        {!order.autoResend && (
                                                            <button
                                                                className="btn-claim-raid btn-claim-ready"
                                                                onClick={e => { e.stopPropagation(); handleClaimOrder(matId); }}
                                                            >
                                                                Reclamar
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="raid-lady-track">
                                                        <img
                                                            src={getRunFrames([{ id: order.dogId }], order.startedAt)[frameIndex]}
                                                            className={`raid-lady-sprite ${orderReturning ? 'raid-order-lady-flip' : ''}`}
                                                            alt="lady"
                                                            style={{ left: `${Math.min(92, Math.max(8, orderVisualProgress * 100))}%` }}
                                                        />
                                                        <span className="raid-lady-timer">{formatTime(order.returnAt - now)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rc-info">
                                                <span className="rc-name">{prov.label} · {current}/{maxStock}</span>
                                                <span className="rc-desc">Manda un perro a por materiales.</span>
                                                <span className="rc-meta">👥 1 perro {!canOrder && '· sin hueco/oro'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <div className="raid-team-picker">
                                            <label className="raid-order-autoresend-label">
                                                <input
                                                    type="checkbox"
                                                    checked={orderAutoResend[matId] ?? false}
                                                    onChange={() => setOrderAutoResend(prev => ({ ...prev, [matId]: !prev[matId] }))}
                                                />
                                                Enviar 10 min
                                            </label>
                                            {!orderAutoResend[matId] && (
                                                <div className="tavern-stepper">
                                                    <button className="tavern-stepper-btn" onClick={() => setOrderQty(prev => ({ ...prev, [matId]: Math.max(1, (prev[matId] ?? 1) - 1) }))} disabled={qty <= 1}><img src={iconSelectLeft} alt="menos" className="tavern-stepper-icon" /></button>
                                                    <span className="tavern-stepper-qty">{qty}</span>
                                                    <button className="tavern-stepper-btn" onClick={() => setOrderQty(prev => ({ ...prev, [matId]: Math.min(maxQty, (prev[matId] ?? 1) + 1) }))} disabled={qty >= maxQty}><img src={iconSelectRight} alt="mas" className="tavern-stepper-icon" /></button>
                                                </div>
                                            )}
                                            <div className="raid-dogs-grid">
                                                {availableDogs.length === 0 && (
                                                    <p className="raid-no-dogs">Sin perros disponibles</p>
                                                )}
                                                {availableDogs.map(dog => {
                                                    const cfg = getDogConfig(dog.id, dog.isForge);
                                                    return (
                                                        <button
                                                            key={dog.id}
                                                            className={`raid-dog-card dog-rarity-${cfg?.rarity}`}
                                                            onClick={() => {
                                                                handleSendOrder(matId, dog.id, dog.isForge, qty, orderAutoResend[matId] ?? false);
                                                                setSelectedOrderMat(null);
                                                                setOrderQty(prev => ({ ...prev, [matId]: 1 }));
                                                            }}
                                                        >
                                                            <img src={dogAssets[dog.id]} alt={dog.id} />
                                                            <span className="rdc-name">{cfg?.name ?? dog.id}</span>
                                                            <span className="rdc-stars">
                                                                {'★'.repeat(dog.stars ?? 0)}{'☆'.repeat(5 - (dog.stars ?? 0))}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* TABLÓN — misiones (placeholder) + escaparate rotativo de Huesín */}
                {raidView === 'tablon' && (() => {
                    const huntRotationKey = getHuntRotationKey();
                    const huntContracts = getDailyHuntContracts(huntRotationKey);
                    const huntState = gameState.tablonHunt?.rotationKey === huntRotationKey ? gameState.tablonHunt.contracts : {};

                    const rotationKey = getTablonRotationKey();
                    const flattenLineup = (lineup) => [
                        ...lineup.rare.map(id => ({ id, rarity: 'rare' })),
                        ...lineup.epic.map(id => ({ id, rarity: 'epic' })),
                        ...lineup.legendary.map(id => ({ id, rarity: 'legendary' })),
                    ];
                    const mineroLineup = flattenLineup(getTablonLineup('mineros', rotationKey, buildRarityPools(DogsConfig)));
                    const forjaLineup = flattenLineup(getTablonLineup('forja', rotationKey, buildRarityPools(ForgeDogsConfig)));
                    const purchasedToday = gameState.tablonShop?.rotationKey === rotationKey ? (gameState.tablonShop.purchased ?? []) : [];

                    const renderTablonDogCard = (id, rarity, isForge) => {
                        const cfg = getDogConfig(id, isForge);
                        const dogState = (isForge ? forgeDogs : dogs)[id];
                        const stars = dogState?.hired ? (dogState.stars ?? 0) : 0;
                        const price = TABLON_SHOP_PRICE[rarity] ?? 0;
                        const bought = purchasedToday.includes(id);
                        const canBuy = !bought && (gameState.huesin ?? 0) >= price;
                        const elemInfo = cfg?.element ? TABLON_ELEMENT_ICON[cfg.element] : null;
                        return (
                            <div key={id} className={`combat-dog-card dog-rarity-${rarity}`}>
                                {elemInfo && (
                                    <span className="cdc-element-icon">
                                        <elemInfo.Icon size={11} color={elemInfo.color} />
                                    </span>
                                )}
                                <div className="cdc-img-wrap">
                                    <img src={dogAssets[id]} alt={id} />
                                </div>
                                <span className="cdc-name">{cfg?.name ?? id}</span>
                                <div className="fdm-card-stars">
                                    {[0, 1, 2, 3, 4].map(si => (
                                        <Star key={si} size={8} fill={si < stars ? '#f5c842' : 'none'} color={si < stars ? '#f5c842' : '#555'} />
                                    ))}
                                </div>
                                {!dogState?.hired && <span className="cdc-power">Sin desbloquear</span>}
                                <button
                                    className={`raid-tablon-buy-btn ${canBuy ? '' : 'raid-tablon-buy-disabled'}`}
                                    disabled={!canBuy}
                                    onClick={() => handleBuyTablonDog(id, isForge)}
                                >
                                    {bought ? 'Comprado' : (
                                        <span className="raid-tablon-buy-price">
                                            {price} <img src={huesinCoin} alt="Huesín" className="raid-tablon-buy-icon" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    };

                    return (
                        <div className="raid-tablon">
                            <div className="raid-tablon-header">
                                <div className="tavern-title-row">
                                    <button className="tavern-back-btn-inline" onClick={() => setRaidView('hub')}>
                                        <ArrowLeft size={22} />
                                    </button>
                                    <h2 className="tavern-title">Tablón</h2>
                                </div>
                                <div className="rewards-tabs">
                                    <button
                                        className={`rewards-tab ${tablonTab === 'misiones' ? 'active' : ''}`}
                                        onClick={() => setTablonTab('misiones')}
                                    ><img src={tabMisiones} alt="misiones" /></button>
                                    <button
                                        className={`rewards-tab ${tablonTab === 'canje' ? 'active' : ''}`}
                                        onClick={() => setTablonTab('canje')}
                                    ><img src={tabShop} alt="canje" /></button>
                                </div>

                                {tablonTab === 'misiones' && (
                                    <p className="rc-desc">Contratos de caza del día. Acepta, cumple la condición en combate contra ese boss, y vuelve a reclamar.</p>
                                )}

                                {tablonTab === 'canje' && (
                                    <>
                                        <p className="raid-tablon-offer-title">¡Oferta especial!</p>
                                        <p className="tavern-subtitle">Cambia Huesín por fragmentos, la selección se renueva cada 24h.</p>
                                        <div className="raid-tablon-tabs">
                                            <button
                                                className={`raid-tablon-tab-btn ${canjeCategory === 'perros' ? 'active' : ''}`}
                                                onClick={() => setCanjeCategory('perros')}
                                            >Perros</button>
                                            <button
                                                className={`raid-tablon-tab-btn ${canjeCategory === 'skins' ? 'active' : ''}`}
                                                onClick={() => setCanjeCategory('skins')}
                                            >Skins</button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="raid-tablon-scroll">
                                {tablonTab === 'misiones' && (
                                    <div className="raid-hunt-list">
                                        {huntContracts.map(({ bossId, reward, condition }) => {
                                            const status = huntState[bossId];
                                            return (
                                                <div key={bossId} className={`raid-hunt-row ${status ? `raid-hunt-${status}` : ''}`}>
                                                    <img src={HUNT_BOSS_IMG[bossId]} alt={bossId} className="raid-hunt-portrait" />
                                                    <div className="raid-hunt-info">
                                                        <span className="raid-hunt-name">{getHuntBossName(bossId)}</span>
                                                        <span className="raid-hunt-condition">{condition.label}</span>
                                                        <span className="raid-hunt-desc">{condition.desc}</span>
                                                        <span className="raid-hunt-reward">+{reward} Huesín</span>
                                                    </div>
                                                    {!status && (
                                                        <button className="btn-send-raid raid-hunt-btn" onClick={() => handleAcceptHunt(bossId, huntRotationKey)}>Aceptar</button>
                                                    )}
                                                    {status === 'accepted' && (
                                                        <span className="raid-hunt-status">En curso</span>
                                                    )}
                                                    {status === 'completed' && (
                                                        <button className="btn-send-raid raid-hunt-btn" onClick={() => handleClaimHunt(bossId, huntRotationKey, reward)}>Reclamar</button>
                                                    )}
                                                    {status === 'claimed' && (
                                                        <span className="raid-hunt-status">Reclamado</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {tablonTab === 'canje' && canjeCategory === 'perros' && (
                                    <>
                                        <span className="cdl-section-title"><Pickaxe size={12} /> Mineros</span>
                                        <div className="combat-dogs-grid">
                                            {mineroLineup.map(({ id, rarity }) => renderTablonDogCard(id, rarity, false))}
                                        </div>
                                        <span className="cdl-section-title"><Flame size={12} /> Forja</span>
                                        <div className="combat-dogs-grid">
                                            {forjaLineup.map(({ id, rarity }) => renderTablonDogCard(id, rarity, true))}
                                        </div>
                                    </>
                                )}
                                {tablonTab === 'canje' && canjeCategory === 'skins' && (
                                    <p className="raid-tablon-soon">Próximamente</p>
                                )}
                            </div>
                        </div>
                    );
                })()}

            </div>
            <PrizeOverlay prizeData={prizeQueue[0] ?? null} onAccept={() => setPrizeQueue(prev => prev.slice(1))} />
        </div>
    );
};

export default RaidScreen;
