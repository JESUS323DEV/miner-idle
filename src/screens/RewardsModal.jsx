import { X } from "lucide-react";
import { useState } from "react";
import "../styles/modals/RewardsModal.css"
import { useGameContext } from "../game/context/GameContext.jsx";

const fmt = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    return num;
};

const RewardsModal = ({ isOpen, onClose }) => {
    const { gameState, handleClaimReward: onClaimReward, handleClaimCoinReward: onClaimCoinReward, handleClaimFragmentReward: onClaimFragmentReward } = useGameContext();
    const [activeTab, setActiveTab] = useState("gold");
    const [fragmentToast, setFragmentToast] = useState(null);

    if (!isOpen) return null;

    const claimFragment = (key, amount) => {
        onClaimFragmentReward(key);
        setFragmentToast(`+${amount} 🧩`);
        setTimeout(() => setFragmentToast(null), 1500);
    };

    const rewards = gameState.rewards;
    const coinRewards = rewards.coinRewards;

    // ===== HELPERS ORO =====
    const isClaimable = (milestoneKey) => {
        const milestone = rewards[milestoneKey];
        const currentValues = {
            goldMilestones: gameState.totalGoldEarned,
            goldSpentMilestones: gameState.totalGoldSpent,
            goldPerSecondMilestones: gameState.goldPerSecond,
            clickMilestones: gameState.totalClicks,
            staminaMilestones: gameState.maxStaminaLevel,
            pickaxeMilestones: rewards.pickaxeMilestones.totalTiers,
            repairMilestones: gameState.totalRepairs,
            refillMilestones: gameState.totalRefills,
        };
        const currentValue = currentValues[milestoneKey];
        const nextMilestoneValue = milestone.claimed.length === 0
            ? milestone.firstStep
            : milestone.firstStep + milestone.step * milestone.claimed.length;
        return currentValue >= nextMilestoneValue;
    };

    const getReward = (milestoneKey) => {
        const milestone = rewards[milestoneKey];
        const { claimed, tiers } = milestone;
        const index = claimed.length;
        if (tiers) {
            const tier = tiers.find(t => index < t.upTo);
            if (!tier) return tiers[tiers.length - 1].max;
            const prevUpTo = tiers[tiers.indexOf(tier) - 1]?.upTo || 0;
            const posInTier = index - prevUpTo;
            return Math.min(tier.base + posInTier * tier.increase, tier.max);
        }
        return milestone.rewardBase + (index * milestone.rewardIncrease);
    };

    const getNextTarget = (milestoneKey) => {
        const milestone = rewards[milestoneKey];
        return milestone.claimed.length === 0
            ? milestone.firstStep
            : milestone.firstStep + milestone.step * milestone.claimed.length;
    };

    const getCurrentValue = (milestoneKey) => {
        const values = {
            goldMilestones: gameState.totalGoldEarned,
            goldSpentMilestones: gameState.totalGoldSpent,
            goldPerSecondMilestones: gameState.goldPerSecond,
            clickMilestones: gameState.totalClicks,
            staminaMilestones: gameState.maxStaminaLevel,
            pickaxeMilestones: rewards.pickaxeMilestones.totalTiers,
            repairMilestones: gameState.totalRepairs,
            refillMilestones: gameState.totalRefills,
        };
        return values[milestoneKey];
    };

    // ===== HELPERS MONEDAS =====

    // Hitos únicos — claimed es boolean
    const isUniqueCoinClaimable = (key) => {
        return coinRewards[key].unlocked && !coinRewards[key].claimed;
    };

    // Hitos progresivos — claimed es array
    const isProgressiveCoinClaimable = (key) => {
        const milestone = coinRewards[key];
        const nextTarget = milestone.claimed.length === 0
            ? milestone.firstStep
            : milestone.firstStep + milestone.step * milestone.claimed.length;
        const currentValues = {
            pickaxeTiers: rewards.pickaxeMilestones.totalTiers,
            forgeUpgrades: (gameState.furnaces.bronze.level - 1) +
                (gameState.furnaces.iron.level - 1) +
                (gameState.furnaces.diamond.level - 1),
        };
        return (currentValues[key] || 0) >= nextTarget;
    };

    const getProgressiveCoinReward = (key) => {
        const milestone = coinRewards[key];
        const { claimed, tiers } = milestone;
        const index = claimed.length;
        if (tiers) {
            const tier = tiers.find(t => index < t.upTo);
            if (!tier) return tiers[tiers.length - 1].max;
            const prevUpTo = tiers[tiers.indexOf(tier) - 1]?.upTo || 0;
            const posInTier = index - prevUpTo;
            return Math.min(tier.base + posInTier * tier.increase, tier.max);
        }
        return 1;
    };

    const goldRewardsList = [
        { key: "goldMilestones", icon: "💰", label: "Oro minado" },
        { key: "goldSpentMilestones", icon: "💸", label: "Oro gastado" },
        { key: "goldPerSecondMilestones", icon: "⏱️", label: "Oro por segundo" },
        { key: "clickMilestones", icon: "⛏️", label: "Clicks totales" },
        { key: "staminaMilestones", icon: "⚡", label: "Nivel stamina" },
        { key: "pickaxeMilestones", icon: "🪓", label: "Tiers de pico" },
        { key: "repairMilestones", icon: "🔧", label: "Reparaciones" },
        { key: "refillMilestones", icon: "🔋", label: "Recargas stamina" },
    ];

    const uniqueCoinRewardsList = [
        { key: "firstBronzeMine", icon: "🟤", label: "Primera entrada mina bronce" },
        { key: "firstIronMine", icon: "⚙️", label: "Primera entrada mina hierro" },
        { key: "firstDiamondMine", icon: "💎", label: "Primera entrada mina diamante" },
        { key: "unlockBronzeLvl2", icon: "🟤", label: "Desbloquear Mina Bronce II" },
        { key: "unlockIronLvl2", icon: "⚙️", label: "Desbloquear Mina Hierro II" },
        { key: "unlockDiamondLvl2", icon: "💎", label: "Desbloquear Mina Diamante II" },
        { key: "unlockBronzeLvl3", icon: "🟤", label: "Desbloquear Mina Bronce III" },
        { key: "unlockIronLvl3", icon: "⚙️", label: "Desbloquear Mina Hierro III" },
        { key: "unlockDiamondLvl3", icon: "💎", label: "Desbloquear Mina Diamante III" },
        { key: "pickaxeBronze", icon: "🪓", label: "Pico de Bronce" },
        { key: "pickaxeMetal", icon: "🪓", label: "Pico de Metal" },
        { key: "pickaxeDiamond", icon: "🪓", label: "Pico de Diamante" },
        { key: "forgeBronze", icon: "🏭", label: "Desbloquear Forja Bronce" },
        { key: "forgeIron", icon: "🏭", label: "Desbloquear Forja Hierro" },
        { key: "forgeDiamond", icon: "🏭", label: "Desbloquear Forja Diamante" },
    ];

    const progressiveCoinRewardsList = [
        { key: "pickaxeTiers", icon: "🪓", label: "Tiers de pico" },
        { key: "forgeUpgrades", icon: "🏭", label: "Mejoras de forja" },
    ];

    const hasUnclaimedCoins =
        uniqueCoinRewardsList.some(({ key }) => coinRewards[key] && isUniqueCoinClaimable(key)) ||
        progressiveCoinRewardsList.some(({ key }) => coinRewards[key] && isProgressiveCoinClaimable(key));

    const hasUnclaimedGold = goldRewardsList.some(({ key }) => isClaimable(key));

    const fragmentRewards = rewards.fragmentRewards ?? {};
    const hasUnclaimedFragments = Object.values(fragmentRewards).some(r => r.unlocked && !r.claimed);

    return (
        <div className="modal-overlay1" onClick={onClose}>
            <div className="rewards-modal-content" onClick={e => e.stopPropagation()}>

                <button className="modal-close" onClick={onClose}><X /></button>
                <h2>🏆 Recompensas</h2>

                <div className="rewards-tabs">
                    <button
                        className={`rewards-tab ${activeTab === "gold" ? "active" : ""} ${hasUnclaimedGold && activeTab !== "gold" ? "tab-pulse" : ""}`}
                        onClick={() => setActiveTab("gold")}
                    >
                        💰 Oro
                    </button>
                    <button
                        className={`rewards-tab ${activeTab === "coins" ? "active" : ""} ${hasUnclaimedCoins && activeTab !== "coins" ? "tab-pulse" : ""}`}
                        onClick={() => setActiveTab("coins")}
                    >
                        🪙 Monedas
                    </button>
                    <button
                        className={`rewards-tab ${activeTab === "fragments" ? "active" : ""} ${hasUnclaimedFragments && activeTab !== "fragments" ? "tab-pulse" : ""}`}
                        onClick={() => setActiveTab("fragments")}
                    >
                        🧩 Fragmentos
                    </button>
                </div>

                {/* TAB ORO */}
                {activeTab === "gold" && (
                    <div className="rewards-list">
                        {goldRewardsList.map(({ key, icon, label }) => {
                            const claimable = isClaimable(key);
                            const reward = getReward(key);
                            const target = getNextTarget(key);
                            const current = getCurrentValue(key);
                            const claimed = rewards[key].claimed.length;

                            return (
                                <div key={key} className={`reward-card ${claimable ? "claimable" : "locked"}`}>
                                    <span className="reward-icon">{icon}</span>
                                    <div className="reward-info">
                                        <p className="reward-label">{label}</p>
                                        <p className="reward-progress">{fmt(current)} / {fmt(target)}</p>
                                        <p className="reward-claimed">Reclamados: {claimed}</p>
                                    </div>
                                    <div className="reward-right">
                                        <p className="reward-amount">+{fmt(reward)} 💰</p>
                                        <button
                                            className={`reward-btn ${claimable ? "btn-claim" : "btn-locked"}`}
                                            onClick={() => claimable && onClaimReward(key)}
                                            disabled={!claimable}
                                        >
                                            {claimable ? "RECLAMAR" : "🔒"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* TAB MONEDAS */}
                {activeTab === "coins" && (
                    <div className="rewards-list">

                        {/* ÚNICOS */}
                        {uniqueCoinRewardsList.map(({ key, icon, label }) => {
                            const reward = coinRewards[key];
                            if (!reward) return null;
                            const claimable = isUniqueCoinClaimable(key);
                            const isClaimed = reward.claimed;

                            return (
                                <div key={key} className={`reward-card ${claimable ? "claimable" : "locked"} ${isClaimed ? "claimed" : ""}`}>
                                    <span className="reward-icon">{icon}</span>
                                    <div className="reward-info">
                                        <p className="reward-label">{label}</p>
                                        <p className="reward-claimed">{isClaimed ? "✅ Reclamado" : "🔒 Pendiente"}</p>
                                    </div>
                                    <div className="reward-right">
                                        <p className="reward-amount">+{fmt(reward.reward)} 🪙</p>
                                        <button
                                            className={`reward-btn ${claimable ? "btn-claim" : "btn-locked"}`}
                                            onClick={() => claimable && onClaimCoinReward(key)}
                                            disabled={!claimable || isClaimed}
                                        >
                                            {isClaimed ? "✅" : claimable ? "RECLAMAR" : "🔒"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* PROGRESIVOS */}
                        {progressiveCoinRewardsList.map(({ key, icon, label }) => {
                            const milestone = coinRewards[key];
                            if (!milestone) return null;
                            const claimable = isProgressiveCoinClaimable(key);
                            const reward = getProgressiveCoinReward(key);
                            const claimed = milestone.claimed.length;

                            return (
                                <div key={key} className={`reward-card ${claimable ? "claimable" : "locked"}`}>
                                    <span className="reward-icon">{icon}</span>
                                    <div className="reward-info">
                                        <p className="reward-label">{label}</p>
                                        <p className="reward-claimed">Reclamados: {claimed}</p>
                                    </div>
                                    <div className="reward-right">
                                        <p className="reward-amount">+{fmt(reward)} 🪙</p>
                                        <button
                                            className={`reward-btn ${claimable ? "btn-claim" : "btn-locked"}`}
                                            onClick={() => claimable && onClaimCoinReward(key)}
                                            disabled={!claimable}
                                        >
                                            {claimable ? "RECLAMAR" : "🔒"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

                {/* TAB FRAGMENTOS */}
                {activeTab === "fragments" && (
                    <div className="rewards-list" style={{ position: "relative" }}>
                        {fragmentToast && (
                            <div className="fragment-toast">{fragmentToast}</div>
                        )}
                        {Object.entries(fragmentRewards).map(([key, r]) => (
                            <div key={key} className={`reward-card ${r.claimed ? "fragment-claimed" : r.unlocked ? "claimable" : "locked"}`}>
                                <span className="reward-icon">🧩</span>
                                <div className="reward-info">
                                    <p className="reward-label">{r.label}</p>
                                    <p style={{ margin: "2px 0", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                                        ×{r.amount} fragmentos
                                    </p>
                                </div>
                                <div className="reward-right">
                                    <button
                                        className={`reward-btn ${r.claimed ? "btn-fragment-claimed" : r.unlocked ? "btn-claim" : "btn-locked"}`}
                                        onClick={() => !r.claimed && r.unlocked && claimFragment(key, r.amount)}
                                        disabled={r.claimed || !r.unlocked}
                                    >
                                        {r.claimed ? "✅ Reclamado" : "RECLAMAR"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default RewardsModal;