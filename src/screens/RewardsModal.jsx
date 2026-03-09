import { X } from "lucide-react";
import { useState } from "react";

import "../styles/modals/RewardsModal.css"

const RewardsModal = ({
    isOpen,
    onClose,
    gameState,
    onClaimReward,
}) => {
    const [activeTab, setActiveTab] = useState("gold");

    if (!isOpen) return null;

    const rewards = gameState.rewards;

    // Calcula si un hito está listo para reclamar
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
        const nextMilestoneValue = milestone.step * (milestone.claimed.length + 1);
        return currentValue >= nextMilestoneValue;
    };

    // Calcula la recompensa del siguiente hito
    const getReward = (milestoneKey) => {
        const milestone = rewards[milestoneKey];
        return milestone.rewardBase + (milestone.claimed.length * milestone.rewardIncrease);
    };

    // Calcula el siguiente valor objetivo
    const getNextTarget = (milestoneKey) => {
        const milestone = rewards[milestoneKey];
        return milestone.step * (milestone.claimed.length + 1);
    };

    // Valor actual de cada hito
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

    const goldRewards = [
        { key: "goldMilestones", icon: "💰", label: "Oro acumulado" },
        { key: "goldSpentMilestones", icon: "💸", label: "Oro gastado" },
        { key: "goldPerSecondMilestones", icon: "⏱️", label: "Oro por segundo" },
        { key: "clickMilestones", icon: "⛏️", label: "Clicks totales" },
        { key: "staminaMilestones", icon: "⚡", label: "Nivel stamina" },
        { key: "pickaxeMilestones", icon: "🪓", label: "Tiers de pico" },
        { key: "repairMilestones", icon: "🔧", label: "Reparaciones" },
        { key: "refillMilestones", icon: "🔋", label: "Recargas stamina" },
    ];

    return (
        <div className="modal-overlay1" onClick={onClose}>
            <div className="rewards-modal-content" onClick={e => e.stopPropagation()}>

                {/* HEADER */}
                <button className="modal-close" onClick={onClose}><X /></button>
                <h2>🏆 Recompensas</h2>

                {/* TABS */}
                <div className="rewards-tabs">
                    <button
                        className={`rewards-tab ${activeTab === "gold" ? "active" : ""}`}
                        onClick={() => setActiveTab("gold")}
                    >
                        💰 Oro
                    </button>
                    <button
                        className={`rewards-tab ${activeTab === "coins" ? "active" : ""}`}
                        onClick={() => setActiveTab("coins")}
                    >
                        🪙 Monedas
                    </button>
                </div>

                {/* TAB ORO */}
                {activeTab === "gold" && (
                    <div className="rewards-list">
                        {goldRewards.map(({ key, icon, label }) => {
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
                                        <p className="reward-progress">{current} / {target}</p>
                                        <p className="reward-claimed">Reclamados: {claimed}</p>
                                    </div>
                                    <div className="reward-right">
                                        <p className="reward-amount">+{reward} 💰</p>
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
                    <div className="rewards-placeholder">
                        <p>🪙 Recompensas de monedas</p>
                        <p>Próximamente...</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RewardsModal;