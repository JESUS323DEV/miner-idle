import { useState, useEffect } from 'react';
import { playSfx } from '../../game/utils/sfx.js';
import { ArrowLeft, ChevronDown, ChevronUp, Pickaxe, Flame, Zap, Droplets, Mountain, Moon, Gem } from 'lucide-react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { DAILY_QUESTS_FIXED, DAILY_QUESTS_DAY2, DAILY_QUESTS_DAY3, DAILY_QUESTS_DAY4, DAILY_QUESTS_DAY5, ALL_DAILY_QUESTS, getQuestsByIds } from '../../game/config/QuestsConfig.js';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig.js';
import { PJ_MISSION_TEMPLATES, PJ_MISSION_TEMPLATES_FORGE } from '../../game/config/PJQuestsConfig.js';
import { getPJSlotTimeMs } from '../../game/utils/questUtils.js';
import { dogAssets } from '../../game/utils/dogAssets.js';
import { DAILY_CARD_BGS } from '../../game/config/RewardsCardConfig.js';
import coinTavern from '../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp';
import iconLock from '../../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/lock.webp';
import iconUnlock from '../../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/unlock.webp';
import iconReclamed from '../../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/reclamed.webp';
import iconTabDaily from '../../assets/ui/icons-hud/hud-modals/misiones-diarias/misiones-diarias.webp';
import iconTabPJ from '../../assets/ui/icons-hud/hud-modals/misiones-diarias/misiones-pj.webp';
import '../../styles/modals/RewardsModal.css';
import '../../styles/modals/QuestsModal.css';
import '../../styles/modals/TavernModal.css';

const todayStr = () => new Date().toISOString().slice(0, 10);

const ELEMENT_ICON = {
    fuego: { Icon: Flame, color: '#ff6b35' },
    electrico: { Icon: Zap, color: '#FFD700' },
    agua: { Icon: Droplets, color: '#4fc3f7' },
    tierra: { Icon: Mountain, color: '#8b6914' },
    oscuro: { Icon: Moon, color: '#b45cff' },
};

const COMBAT_PASSIVE_BY_ELEMENT = {
    fuego: 'Añade daño fijo extra por cada golpe al enemigo.',
    electrico: 'Cada golpe tiene probabilidad de impactar dos veces.',
    tierra: 'El enemigo recibe un porcentaje extra de daño en cada golpe.',
    agua: 'Multiplica el daño de todos los golpes durante la batalla.',
    oscuro: 'Los próximos taps hacen daño extra según la vida actual del enemigo.',
};

const getGoldBonusText = (b) => {
    if (!b) return '';
    if (b.type === 'extraGold') return `+${b.value} oro extra por picada`;
    if (b.type === 'freeHit') return `${b.chance * 100}% de prob. de reducir la recarga picando`;
    if (b.type === 'doubleHit') return `${b.chance * 100}% de prob. de doblar el oro minado`;
    if (b.type === 'saveDurability') return `${b.chance * 100}% de prob. de no gastar durabilidad`;
    return '';
};

const getForgeSlotBonusText = (b) => {
    if (!b) return '';
    if (b.type === 'goldTrickle') return `+${b.min === b.max ? b.min : `${b.min}-${b.max}`} oro cada 60s`;
    if (b.type === 'burstRecharge') return `${b.chance * 100}% de prob. de recargar energía`;
    if (b.type === 'maxDurability') return `+${b.value} durabilidad máxima`;
    return '';
};

const FORGE_COMBAT_SUMMARY_BY_ELEMENT = {
    fuego: 'Más daño cuanto más calor acumula.',
    agua: 'Más daño cuanto más dura el combate.',
    electrico: 'Más probabilidad de golpe doble.',
    tierra: 'Reduce la armadura del enemigo.',
    oscuro: 'Amplifica el daño de forma fija.',
};

const FIXED_DAY_POOLS = {
    1: DAILY_QUESTS_FIXED,
    2: DAILY_QUESTS_DAY2,
    3: DAILY_QUESTS_DAY3,
    4: DAILY_QUESTS_DAY4,
    5: DAILY_QUESTS_DAY5,
};

const getVisiblePJMissions = (missions, claimedIds) => {
    const groups = [];
    for (let i = 0; i < missions.length; i += 2) groups.push(missions.slice(i, i + 2));
    const visible = [];
    for (const group of groups) {
        visible.push(...group);
        if (!group.every(m => claimedIds.includes(m.missionId))) break;
    }
    return visible;
};

const pickDailyQuests = (dayNumber) => {
    const fixedPool = FIXED_DAY_POOLS[dayNumber];
    if (fixedPool) return fixedPool.map(q => q.id);

    const shuffled = [...ALL_DAILY_QUESTS].sort(() => Math.random() - 0.5);
    const usedTypes = new Set();
    const picked = [];
    for (const q of shuffled) {
        if (usedTypes.has(q.type)) continue;
        usedTypes.add(q.type);
        picked.push(q.id);
        if (picked.length >= 15) break;
    }
    return picked;
};

const QuestsModal = ({ isOpen, onClose }) => {
    const { gameState, setGameState } = useGameContext();
    const [activeTab, setActiveTab] = useState('daily');
    const [pjSubTab, setPjSubTab] = useState('minero');
    const [expandedPJDog, setExpandedPJDog] = useState(null);

    const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2 };
    const RARITY_CARD_BG = { legendary: 'shard-card-legend', epic: 'shard-card-epic', rare: 'shard-card-basic' };
    const MINER_DOGS = Object.entries(DogsConfig)
        .sort((a, b) => (RARITY_ORDER[a[1].rarity] ?? 9) - (RARITY_ORDER[b[1].rarity] ?? 9) || (a[1].order ?? 99) - (b[1].order ?? 99))
        .map(([id]) => id);
    const FORGE_DOGS = Object.entries(ForgeDogsConfig)
        .sort((a, b) => (RARITY_ORDER[a[1].rarity] ?? 9) - (RARITY_ORDER[b[1].rarity] ?? 9))
        .map(([id]) => id);

    const handleClaimPJMission = (dogId, missionId, reward, isForge = false) => {
        playSfx('rewardShards');
        setGameState(prev => {
            const prevPJ = prev.pjQuests?.[dogId] ?? {};
            const stateKey = isForge ? 'forgeDogs' : 'dogs';
            return {
                ...prev,
                [stateKey]: { ...prev[stateKey], [dogId]: { ...prev[stateKey][dogId], fragments: (prev[stateKey][dogId]?.fragments ?? 0) + reward } },
                pjQuests: { ...prev.pjQuests, [dogId]: { ...prevPJ, claimedMissions: [...(prevPJ.claimedMissions ?? []), missionId] } },
            };
        });
    };

    const handleClaimPJFinal = (dogId, reward, isForge = false) => {
        playSfx('rewardShards');
        setGameState(prev => {
            const prevPJ = prev.pjQuests?.[dogId] ?? {};
            const stateKey = isForge ? 'forgeDogs' : 'dogs';
            return {
                ...prev,
                [stateKey]: { ...prev[stateKey], [dogId]: { ...prev[stateKey][dogId], fragments: (prev[stateKey][dogId]?.fragments ?? 0) + reward } },
                pjQuests: { ...prev.pjQuests, [dogId]: { ...prevPJ, finalClaimed: true } },
            };
        });
    };

    useEffect(() => {
        if (!isOpen) return;
        const today = todayStr();
        const dq = gameState.dailyQuests;
        if (dq.lastResetDate === today) return;

        const newDayNumber = (dq.dayNumber ?? 0) + 1;
        const newIds = pickDailyQuests(newDayNumber);
        const initialProgress = {};
        newIds.forEach(id => { initialProgress[id] = 0; });
        if (newIds.includes('open_today')) initialProgress['open_today'] = 1;
        if (newIds.includes('tavern_visit')) initialProgress['tavern_visit'] = 1;

        setGameState(prev => ({
            ...prev,
            dailyQuests: {
                lastResetDate: today,
                dayNumber: newDayNumber,
                activeQuestIds: newIds,
                progress: initialProgress,
                claimed: [],
            },
        }));
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isOpen) return null;

    const dq = gameState.dailyQuests;
    const activeQuests = getQuestsByIds(dq.activeQuestIds ?? []);
    const progress = dq.progress ?? {};
    const claimed = dq.claimed ?? [];

    const claimedCount = claimed.length;

    const getProgress = (quest) => {
        if (quest.type === 'questsDone') return Math.min(claimedCount, quest.target);
        if (quest.type === 'passiveActive') return Math.min(gameState.raid?.passiveRaids?.length ?? 0, quest.target);
        if (quest.type === 'mineFullSlots') {
            const allDogs = Object.values(gameState.dogs ?? {});
            const allFull = ['bronze', 'iron', 'diamond'].every(m => allDogs.some(d => d?.assignedTo?.mineComp === m));
            return allFull ? 1 : 0;
        }
        return Math.min(progress[quest.id] ?? 0, quest.target);
    };

    const isCompleted = (quest) => getProgress(quest) >= quest.target;
    const isClaimed = (quest) => claimed.includes(quest.id);

    const hasClaimmable = activeQuests.some(q => isCompleted(q) && !isClaimed(q));

    const getPJMissionProgress = (m, dogId, pjData) => {
        if (m.type === 'slotTime') return getPJSlotTimeMs(gameState.pjQuests, dogId);
        if (m.type === 'passiveRaids') return pjData.passiveRaids ?? 0;
        if (m.type === 'mineUses') return pjData.mineUses ?? 0;
        if (m.type === 'activeUses') return pjData.activeUses ?? 0;
        if (m.type === 'forgeUses') return pjData.forgeUses ?? 0;
        return 0;
    };

    const isPJDogClaimable = (dogId, template) => {
        if (!template) return false;
        const pjData = gameState.pjQuests?.[dogId] ?? {};
        const claimedM = pjData.claimedMissions ?? [];
        const finalClaimed = pjData.finalClaimed ?? false;
        const visibleMissions = getVisiblePJMissions(template.missions, claimedM);
        const allDone = template.missions.every(m => claimedM.includes(m.missionId));
        return visibleMissions.some(m => getPJMissionProgress(m, dogId, pjData) >= m.target && !claimedM.includes(m.missionId))
            || (allDone && !finalClaimed);
    };

    const hasPJClaimable = MINER_DOGS.some(dogId => isPJDogClaimable(dogId, PJ_MISSION_TEMPLATES[DogsConfig[dogId].rarity]))
        || FORGE_DOGS.some(dogId => isPJDogClaimable(dogId, PJ_MISSION_TEMPLATES_FORGE[ForgeDogsConfig[dogId].rarity]));

    const handleClaim = (quest) => {
        if (!isCompleted(quest) || isClaimed(quest)) return;
        playSfx('rewardCoin');
        setGameState(prev => ({
            ...prev,
            tavernCoins: (prev.tavernCoins ?? 0) + quest.reward.coins,
            dailyQuests: {
                ...prev.dailyQuests,
                claimed: [...(prev.dailyQuests.claimed ?? []), quest.id],
            },
        }));
    };

    return (
        <div className="rewards-backdrop" onClick={onClose}>
            <div className="quests-panel" onClick={e => e.stopPropagation()}>
                <div className="tavern-title-row">
                    <button className="tavern-back-btn-inline" onClick={onClose}>
                        <ArrowLeft size={22} />
                    </button>
                    <h2 className="tavern-title">Misiones</h2>
                </div>

                <div className="rewards-tabs">
                    <button
                        className={`rewards-tab ${activeTab === 'daily' ? 'active' : ''} ${hasClaimmable && activeTab !== 'daily' ? 'tab-pulse' : ''}`}
                        onClick={() => setActiveTab('daily')}
                    >
                        <img src={iconTabDaily} alt="diarias" />
                    </button>
                    <button
                        className={`rewards-tab ${activeTab === 'pj' ? 'active' : ''} ${hasPJClaimable && activeTab !== 'pj' ? 'tab-pulse' : ''}`}
                        onClick={() => setActiveTab('pj')}
                    >
                        <img src={iconTabPJ} alt="misiones pj" />
                    </button>
                </div>

                <div className="quests-scroll-area">
                {activeTab === 'daily' && (
                    <div className="rewards-list">
                        <p className="tavern-subtitle">Completa las misiones diarias para conseguir monedas de taberna, cambian cada día</p>
                        {[...activeQuests].sort((a, b) => {
                            const da = isClaimed(a), db = isClaimed(b);
                            if (da && !db) return 1;
                            if (!da && db) return -1;
                            const ca = isCompleted(a) && !da, cb = isCompleted(b) && !db;
                            if (ca && !cb) return -1;
                            if (!ca && cb) return 1;
                            return 0;
                        }).map((quest, i) => {
                            const prog = getProgress(quest);
                            const completed = isCompleted(quest);
                            const done = isClaimed(quest);
                            const pct = Math.min(100, (prog / quest.target) * 100);

                            return (
                                <div
                                    key={quest.id}
                                    className={`reward-card ${DAILY_CARD_BGS[i % DAILY_CARD_BGS.length]} gold-milestone-card fragment-reward-card ${done ? 'fragment-claimed' : completed ? 'claimable' : 'locked'}`}
                                >
                                    <span className="shard-card-icon-wrap daily-big-icon-wrap">
                                        <img src={coinTavern} alt="coins" className="daily-big-icon" />
                                    </span>
                                    <div className="reward-info">
                                        <p className="reward-label">{quest.label}</p>
                                        <p className="reward-progress">{prog} / {quest.target} · +{quest.reward.coins} monedas</p>
                                        <div className="quest-progress-bar">
                                            <div
                                                className={`quest-progress-fill${completed ? ' complete' : ''}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="reward-right">
                                        <button
                                            className={`reward-btn ${done ? 'btn-fragment-claimed' : completed ? 'btn-claim btn-claim-icon' : 'btn-locked'}`}
                                            onClick={() => handleClaim(quest)}
                                            disabled={done || !completed}
                                        >
                                            <img src={done ? iconReclamed : completed ? iconUnlock : iconLock} alt={done ? 'Completado' : completed ? 'Reclamar' : 'Bloqueado'} className="reward-lock-img" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {activeQuests.length === 0 && (
                            <div className="quests-empty">Cargando misiones...</div>
                        )}
                    </div>
                )}

                {activeTab === 'pj' && (
                    <div className="pj-dog-list">
                        <div className="gds-tabs">
                            <button className={`gds-tab${pjSubTab === 'minero' ? ' active' : ''}`} onClick={() => setPjSubTab('minero')}>Minero</button>
                            <button className={`gds-tab${pjSubTab === 'forja' ? ' active' : ''}`} onClick={() => setPjSubTab('forja')}>Forja</button>
                        </div>

                        {pjSubTab === 'minero' && MINER_DOGS.map((dogId) => {
                            const cfg = DogsConfig[dogId];
                            const template = PJ_MISSION_TEMPLATES[cfg.rarity];
                            if (!template) return null;
                            const pjData = gameState.pjQuests?.[dogId] ?? {};
                            const claimed = pjData.claimedMissions ?? [];
                            const finalClaimed = pjData.finalClaimed ?? false;
                            const isExpanded = expandedPJDog === dogId;

                            const getMissionProgress = (m) => getPJMissionProgress(m, dogId, pjData);
                            const visibleMissions = getVisiblePJMissions(template.missions, claimed);
                            const allMissionsDone = template.missions.every(m => claimed.includes(m.missionId));
                            const doneMissions = template.missions.filter(m => claimed.includes(m.missionId)).length;
                            const hasClaimable = visibleMissions.some(m => getMissionProgress(m) >= m.target && !claimed.includes(m.missionId))
                                || (allMissionsDone && !finalClaimed);

                            return (
                                <div key={dogId} className={`pj-dog-card dog-rarity-${cfg.rarity}`}>
                                    <div className={`pj-dog-row reward-card ${RARITY_CARD_BG[cfg.rarity]}`} onClick={() => setExpandedPJDog(isExpanded ? null : dogId)}>
                                        <div className="pj-dog-info">
                                            <img src={dogAssets[dogId]} className="pj-dog-portrait" alt={cfg.name} />
                                            <span className="pj-dog-name">{cfg.name}</span>
                                            <span className={`pj-dog-rarity dog-rarity-${cfg.rarity}`}>{cfg.rarity}</span>
                                        </div>
                                        <div className="pj-dog-details">
                                            {ELEMENT_ICON[cfg.element] && (() => {
                                                const { Icon, color } = ELEMENT_ICON[cfg.element];
                                                return (
                                                    <span className="dog-stat-activa">
                                                        <span className="dog-activa-icon"><Icon size={12} color={color} /></span>
                                                        {cfg.element}
                                                    </span>
                                                );
                                            })()}
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><Pickaxe size={12} /> Poder minado</span>
                                                <span className="dog-stat-val">{cfg.miningPower}</span>
                                            </div>
                                            <p className="dog-stat-passive">{getGoldBonusText(cfg.goldMineBonus)}</p>
                                            <p className="dog-stat-passive">{COMBAT_PASSIVE_BY_ELEMENT[cfg.element]}</p>
                                        </div>
                                        <div className="pj-dog-meta">
                                            {hasClaimable && <span className="pj-notify-dot" />}
                                            <span className="pj-progress-text">{doneMissions}/{template.missions.length}</span>
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="pj-missions">
                                            {visibleMissions.map(m => {
                                                const prog = getMissionProgress(m);
                                                const isClaimed = claimed.includes(m.missionId);
                                                const isComplete = prog >= m.target;
                                                const pct = Math.min(100, (prog / m.target) * 100);
                                                const displayProg = m.type === 'slotTime'
                                                    ? `${Math.floor(prog / 60000)}/${m.target / 60000} min`
                                                    : `${prog}/${m.target}`;

                                                return (
                                                    <div key={m.missionId} className={`pj-mission-row ${isClaimed ? 'exhausted' : isComplete ? 'claimable' : ''}`}>
                                                        <div className="pj-mission-info">
                                                            <p className="pj-mission-label">{m.label}</p>
                                                            <p className="pj-mission-prog">{displayProg}</p>
                                                            <div className="quest-progress-bar">
                                                                <div className={`quest-progress-fill${isComplete ? ' complete' : ''}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                        </div>
                                                        <div className="pj-mission-reward">
                                                            <span className="pj-reward-amount">+{m.reward} frags</span>
                                                            <button
                                                                className={`reward-btn ${isClaimed ? 'btn-locked' : isComplete ? 'btn-claim btn-claim-icon' : 'btn-locked'}`}
                                                                disabled={isClaimed || !isComplete}
                                                                onClick={() => handleClaimPJMission(dogId, m.missionId, m.reward)}
                                                            >
                                                                <img src={isClaimed ? iconReclamed : isComplete ? iconUnlock : iconLock} alt={isClaimed ? 'Completado' : isComplete ? 'Reclamar' : 'Bloqueado'} className="reward-lock-img" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {allMissionsDone && (
                                                <div className={`pj-mission-row pj-final-row ${finalClaimed ? 'exhausted' : 'claimable'}`}>
                                                    <div className="pj-mission-info">
                                                        <p className="pj-mission-label">Recompensa final</p>
                                                    </div>
                                                    <div className="pj-mission-reward">
                                                        <span className="pj-reward-amount">+{template.finalReward} frags</span>
                                                        <button
                                                            className={`reward-btn ${finalClaimed ? 'btn-locked' : 'btn-claim btn-claim-icon'}`}
                                                            disabled={finalClaimed}
                                                            onClick={() => handleClaimPJFinal(dogId, template.finalReward)}
                                                        >
                                                            <img src={finalClaimed ? iconReclamed : iconUnlock} alt={finalClaimed ? 'Completado' : 'Reclamar'} className="reward-lock-img" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {pjSubTab === 'forja' && FORGE_DOGS.map((dogId) => {
                            const cfg = ForgeDogsConfig[dogId];
                            const template = PJ_MISSION_TEMPLATES_FORGE[cfg.rarity];
                            if (!template) return null;
                            const pjData = gameState.pjQuests?.[dogId] ?? {};
                            const claimed = pjData.claimedMissions ?? [];
                            const finalClaimed = pjData.finalClaimed ?? false;
                            const isExpanded = expandedPJDog === dogId;

                            const getMissionProgress = (m) => getPJMissionProgress(m, dogId, pjData);
                            const visibleMissions = getVisiblePJMissions(template.missions, claimed);
                            const allMissionsDone = template.missions.every(m => claimed.includes(m.missionId));
                            const doneMissions = template.missions.filter(m => claimed.includes(m.missionId)).length;
                            const hasClaimable = visibleMissions.some(m => getMissionProgress(m) >= m.target && !claimed.includes(m.missionId))
                                || (allMissionsDone && !finalClaimed);

                            return (
                                <div key={dogId} className={`pj-dog-card dog-rarity-${cfg.rarity}`}>
                                    <div className={`pj-dog-row reward-card ${RARITY_CARD_BG[cfg.rarity]}`} onClick={() => setExpandedPJDog(isExpanded ? null : dogId)}>
                                        <div className="pj-dog-info">
                                            <img src={dogAssets[dogId]} className="pj-dog-portrait" alt={cfg.name} />
                                            <span className="pj-dog-name">{cfg.name}</span>
                                            <span className={`pj-dog-rarity dog-rarity-${cfg.rarity}`}>{cfg.rarity}</span>
                                        </div>
                                        <div className="pj-dog-details">
                                            {ELEMENT_ICON[cfg.element] && (() => {
                                                const { Icon, color } = ELEMENT_ICON[cfg.element];
                                                return (
                                                    <span className="dog-stat-activa">
                                                        <span className="dog-activa-icon"><Icon size={12} color={color} /></span>
                                                        {cfg.element}
                                                    </span>
                                                );
                                            })()}
                                            <div className="dog-stat-row">
                                                <span className="dog-stat-label"><Gem size={12} /> Doble lingote</span>
                                                <span className="dog-stat-val">{cfg.forgeBonus?.doubleIngot ? `${cfg.forgeBonus.doubleIngot * 100}%` : '—'}</span>
                                            </div>
                                            <p className="dog-stat-passive">{getForgeSlotBonusText(cfg.globalSlotBonus)}</p>
                                            <p className="dog-stat-passive">{FORGE_COMBAT_SUMMARY_BY_ELEMENT[cfg.element]}</p>
                                        </div>
                                        <div className="pj-dog-meta">
                                            {hasClaimable && <span className="pj-notify-dot" />}
                                            <span className="pj-progress-text">{doneMissions}/{template.missions.length}</span>
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="pj-missions">
                                            {visibleMissions.map(m => {
                                                const prog = getMissionProgress(m);
                                                const isClaimed = claimed.includes(m.missionId);
                                                const isComplete = prog >= m.target;
                                                const pct = Math.min(100, (prog / m.target) * 100);
                                                const displayProg = m.type === 'slotTime'
                                                    ? `${Math.floor(prog / 60000)}/${m.target / 60000} min`
                                                    : `${prog}/${m.target}`;

                                                return (
                                                    <div key={m.missionId} className={`pj-mission-row ${isClaimed ? 'exhausted' : isComplete ? 'claimable' : ''}`}>
                                                        <div className="pj-mission-info">
                                                            <p className="pj-mission-label">{m.label}</p>
                                                            <p className="pj-mission-prog">{displayProg}</p>
                                                            <div className="quest-progress-bar">
                                                                <div className={`quest-progress-fill${isComplete ? ' complete' : ''}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                        </div>
                                                        <div className="pj-mission-reward">
                                                            <span className="pj-reward-amount">+{m.reward} frags</span>
                                                            <button
                                                                className={`reward-btn ${isClaimed ? 'btn-locked' : isComplete ? 'btn-claim btn-claim-icon' : 'btn-locked'}`}
                                                                disabled={isClaimed || !isComplete}
                                                                onClick={() => handleClaimPJMission(dogId, m.missionId, m.reward, true)}
                                                            >
                                                                <img src={isClaimed ? iconReclamed : isComplete ? iconUnlock : iconLock} alt={isClaimed ? 'Completado' : isComplete ? 'Reclamar' : 'Bloqueado'} className="reward-lock-img" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {allMissionsDone && (
                                                <div className={`pj-mission-row pj-final-row ${finalClaimed ? 'exhausted' : 'claimable'}`}>
                                                    <div className="pj-mission-info">
                                                        <p className="pj-mission-label">Recompensa final</p>
                                                    </div>
                                                    <div className="pj-mission-reward">
                                                        <span className="pj-reward-amount">+{template.finalReward} frags</span>
                                                        <button
                                                            className={`reward-btn ${finalClaimed ? 'btn-locked' : 'btn-claim btn-claim-icon'}`}
                                                            disabled={finalClaimed}
                                                            onClick={() => handleClaimPJFinal(dogId, template.finalReward, true)}
                                                        >
                                                            <img src={finalClaimed ? iconReclamed : iconUnlock} alt={finalClaimed ? 'Completado' : 'Reclamar'} className="reward-lock-img" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default QuestsModal;
