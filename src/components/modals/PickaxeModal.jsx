import { X } from "lucide-react";
import '../../styles/modals/PickaxeModal.css';


//asset lingotes
import lingoteBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.png"
import lingoteIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.png"
import lingoteDiamond from "../../assets/ui/icons-forge/lingotes/lingote-Diamond.png"
//asset gold
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"

const formatNumber = (num) => {
    if (num >= 1000000) return Number((num / 1000000).toFixed(1)) + 'M';
    if (num >= 1000) return Number((num / 1000).toFixed(1)) + 'k';
    return num;
};

const lingoteIcons = {
    "Lingotes Bronze": lingoteBronze,
    "Lingotes Hierro": lingoteIron,
    "Lingotes Diamante": lingoteDiamond,
};

const getMaterialName = (material) => {
    const names = { stone: "Piedra", bronze: "Bronze", metal: "Metal", diamond: "Diamante" };
    return names[material] || material;
};

const getNextMaterial = (current) => {
    const materials = { stone: "Bronze", bronze: "Metal", metal: "Diamante" };
    return materials[current] || "???";
};



const getMaterialCost = (material) => {
    if (material === "stone") return { amount: 5, type: "Lingotes Bronze" };
    if (material === "bronze") return { amount: 3, type: "Lingotes Hierro" };
    if (material === "metal") return { amount: 2, type: "Lingotes Diamante" };
    return null;
};



const PickaxeModal = ({
    isOpen,
    onClose,
    currentLevel,
    cost,
    onUpgrade,
    canAfford,
    showRefill,
    refillCost,
    onRefill,
    canAffordRefill,
    bgImage,
    iconImage,
    buttonImage,
    refillButtonImage,
    pickaxeTier,
    pickaxeMaterial,
    onUpgradeMaterial,
    materialCost,
    canAffordMaterial,
    materialButtonImage,
    tutorialMessage = null,
    onShowGoldCost = null,

}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-pickaxe" onClick={onClose}>
            <div
                className="pickaxe-modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="pickaxe-modal">
                    <button className="modal-close" onClick={onClose}><X /></button>

                    {tutorialMessage && (
                        <div className='title-modal-pickaxe'>
                            <p>{tutorialMessage}</p>
                        </div>
                    )}
                    <div className="pickaxe-modal-info">
                        <p>Pico {getMaterialName(pickaxeMaterial)} {currentLevel}</p>
                        <img src={iconImage} loading="lazy" alt="Pickaxe" />
                    </div>


                    <div className="cont-upgrade-pickaxe">

                        {pickaxeTier < 3 ? (
                            <button
                                className={`btn-upgrade ${!canAfford ? "locked" : ""}`}
                                onClick={() => { onShowGoldCost?.(cost); onUpgrade(); }}
                                disabled={!canAfford}
                            >
                                <img src={buttonImage} loading="lazy" alt="Upgrade" />
                                <p>{cost} Oro</p>
                            </button>
                        ) : (

                            <button
                                className={`btn-upgrade-material ${!canAffordMaterial ? "locked" : ""}`}
                                onClick={() => { onShowGoldCost?.(materialCost); onUpgradeMaterial(); }}
                                disabled={!canAffordMaterial}
                            >
                                <img src={materialButtonImage} loading="lazy" alt="Upgrade Material" />

                            </button>
                        )}

                        {pickaxeTier >= 3 && (
                            <div className="info-upgrade-pickaxe">
                                <p>Pico {getNextMaterial(pickaxeMaterial)}</p>

                                <span>
                                    Coste: {formatNumber(materialCost)} <img src={iconGold} alt="oro" />
                                    {' + '}
                                    {getMaterialCost(pickaxeMaterial)?.amount}

                                    <img src={lingoteIcons[getMaterialCost(pickaxeMaterial)?.type]} alt="lingote" />
                                </span>

                            </div>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default PickaxeModal;