import { useState, useEffect } from 'react';
import { playSfx } from '../../game/utils/sfx.js';
import { ArrowLeft, Lock, LockOpen, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { DAILY_QUESTS_FIXED, DAILY_QUESTS_EXTRA_20, ALL_DAILY_QUESTS, getQuestsByIds } from '../../game/config/QuestsConfig.js';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { PJ_MISSION_TEMPLATES } from '../../game/config/PJQuestsConfig.js';
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

const pickDailyQuests = (dayNumber) => {
    if (dayNumber === 1) return DAILY_QUESTS_FIXED.map(q => q.id);
    const pool = dayNumber === 2 ? DAILY_QUESTS_EXTRA_20 : ALL_DAILY_QUESTS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10).map(q => q.id);
};

const QuestsModal = ({ isOpen, onClose }) => {
    const { gameState, setGameState } = useGameContext();
    const [activeTab, setActiveTab] = useState('daily');
    const [expandedPJDog, setExpandedPJDog] = useState(null);

    const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2 };
    const MINER_DOGS = Object.entries(DogsConfig)
        .sort((a, b) => (RARITY_ORDER[a[1].rarity] ?? 9) - (RARITY_ORDER[b[1].rarity] ?? 9) || (a[1].order ?? 99) - (b[1].order ?? 99))
        .map(([id]) => id);

    const handleClaimPJMission = (dogId, missionId, reward) => {
        playSfx('rewardShards');
        setGameState(prev => {
            const prevPJ = prev.pjQuests?.[dogId] ?? {};
            return {
                ...prev,
                dogs: { ...prev.dogs, [dogId]: { ...prev.dogs[dogId], fragments: (prev.dogs[dogId]?.fragments ?? 0) + reward } },
                pjQuests: { ...prev.pjQuests, [dogId]: { ...prevPJ, claimedMissions: [...(prevPJ.claimedMissions ?? []), missionId] } },
            };
        });
    };

    const handleClaimPJFinal = (dogId, reward) => {
        playSfx('rewardShards');
        setGameState(prev => {
            const prevPJ = prev.pjQuests?.[dogId] ?? {};
            return {
                ...prev,
                dogs: { ...prev.dogs, [dogId]: { ...prev.dogs[dogId], fragments: (prev.dogs[dogId]?.fragments ?? 0) + reward } },
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

    const hasPJClaimable = MINER_DOGS.some(dogId => {
        const cfg = DogsConfig[dogId];
        const template = PJ_MISSION_TEMPLATES[cfg.rarity];
        if (!template) return false;
        const pjData = gameState.pjQuests?.[dogId] ?? {};
        const claimedM = pjData.claimedMissions ?? [];
        const finalClaimed = pjData.finalClaimed ?? false;
        const getProg = (m) => {
            if (m.type === 'slotTime') return getPJSlotTimeMs(gameState.pjQuests, dogId);
            if (m.type === 'passiveRaids') return pjData.passiveRaids ?? 0;
            return 0;
        };
        const allDone = template.missions.every(m => claimedM.includes(m.missionId));
        return template.missions.some(m => getProg(m) >= m.target && !claimedM.includes(m.missionId))
            || (allDone && !finalClaimed);
    });

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
                <p className="tavern-subtitle">Completa misiones para ganar monedas de taberna</p>

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
                        {activeQuests.map((quest, i) => {
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
                        {MINER_DOGS.map(dogId => {
                            const cfg = DogsConfig[dogId];
                            const template = PJ_MISSION_TEMPLATES[cfg.rarity];
                            if (!template) return null;
                            const pjData = gameState.pjQuests?.[dogId] ?? {};
                            const claimed = pjData.claimedMissions ?? [];
                            const finalClaimed = pjData.finalClaimed ?? false;
                            const isExpanded = expandedPJDog === dogId;

                            const getMissionProgress = (m) => {
                                if (m.type === 'slotTime') return getPJSlotTimeMs(gameState.pjQuests, dogId);
                                if (m.type === 'passiveRaids') return pjData.passiveRaids ?? 0;
                                return 0;
                            };
                            const allMissionsDone = template.missions.every(m => claimed.includes(m.missionId));
                            const doneMissions = template.missions.filter(m => getMissionProgress(m) >= m.target).length;
                            const hasClaimable = template.missions.some(m => getMissionProgress(m) >= m.target && !claimed.includes(m.missionId))
                                || (allMissionsDone && !finalClaimed);

                            return (
                                <div key={dogId} className={`pj-dog-card dog-rarity-${cfg.rarity}`}>
                                    <div className="pj-dog-row" onClick={() => setExpandedPJDog(isExpanded ? null : dogId)}>
                                        <img src={dogAssets[dogId]} className="pj-dog-portrait" alt={cfg.name} />
                                        <div className="pj-dog-info">
                                            <span className="pj-dog-name">{cfg.name}</span>
                                            <span className={`pj-dog-rarity dog-rarity-${cfg.rarity}`}>{cfg.rarity}</span>
                                        </div>
                                        <div className="pj-dog-meta">
                                            {hasClaimable && <span className="pj-notify-dot" />}
                                            <span className="pj-progress-text">{doneMissions}/{template.missions.length}</span>
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="pj-missions">
                                            {template.missions.map(m => {
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
                                                            <span className="pj-reward-amount">+{template.missionReward} frags</span>
                                                            <button
                                                                className={`reward-btn ${isClaimed ? 'btn-locked' : isComplete ? 'btn-claim btn-claim-icon' : 'btn-locked'}`}
                                                                disabled={isClaimed || !isComplete}
                                                                onClick={() => handleClaimPJMission(dogId, m.missionId, template.missionReward)}
                                                            >
                                                                {isClaimed ? <Check size={18} /> : isComplete ? <LockOpen size={18} /> : <Lock size={18} />}
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
                                                            {finalClaimed ? <Check size={18} /> : <LockOpen size={18} />}
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
