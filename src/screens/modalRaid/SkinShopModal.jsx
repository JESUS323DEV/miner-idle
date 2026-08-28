import { useState, useEffect } from 'react';
import { X, Star, Lock } from 'lucide-react';
import { DogSkinsConfig } from '../../game/config/DogSkinsConfig.js';
import { dogSkinAssets } from '../../game/utils/dogSkinAssets.js';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import huesinCoin from '../../assets/ui/icons-hud/hud-principal/huesin-coin.webp';
import coinTavern from '../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp';
import iconRarityLegend from '../../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/legend.webp';
import iconRarityEpic from '../../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/epic.webp';
import iconRarityRara from '../../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/rara.webp';
import iconRarityObtenidos from '../../assets/ui/icons-hud/hud-modals/modal-ayudantes/icon-hud/obtenidos.webp';

import ladyRunSkin1 from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-1.webp';
import ladyRunSkin2 from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-2.webp';
import ladyRunSkin3 from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-3.webp';
import ladyRunSkin4 from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-4.webp';
import ladyGafasRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-gafas-run.webp';
import ladyCascosRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-cascos-run.webp';
import ladyCapuchaRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-capucha-run.webp';
import ladyMineraRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-minero-run.webp';
import ladyPirataRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-pirata-run.webp';
import ladyUltimateRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/lady-run-skin/lady-ultimate-run.webp';
import munaCascosRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-cascos.webp';
import munaMineraRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-minero.webp';
import munaPilotoRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-piloto.webp';
import munaPirataRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-pirata.webp';
import munaReinaRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-rey.webp';
import munaUltimateRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-run-ultimate.webp';
import munaRunSkin1 from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-1.webp';
import munaRunSkin2 from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-2.webp';
import munaRunSkin3 from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-3.webp';
import munaRunSkin4 from '../../assets/ui/lady-sprite/sprites-run-skins/muna-run-skin/muna-4.webp';
import nupitoRunSkin1 from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-1.webp';
import nupitoRunSkin2 from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-2.webp';
import nupitoRunSkin3 from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-3.webp';
import nupitoRunSkin4 from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-4.webp';
import nupitoMagoRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-mago.webp';
import nupitoMineroRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-minero.webp';
import nupitoReyRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-rey.webp';
import nupitoSherifRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-sherif.webp';
import nupitoUltimateRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/nupito-run-skin/nupito-run-ultimatef.webp';
import tukaRunSkin1 from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-1.webp';
import tukaRunSkin2 from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-2.webp';
import tukaRunSkin3 from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-3.webp';
import tukaRunSkin4 from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-4.webp';
import tukaCapuchaRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-capucha.webp';
import tukaCascosRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-cascos.webp';
import tukaChefRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-chef.webp';
import tukaGafasRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-gafas.webp';
import tukaReinaRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-rey.webp';
import tukaUltimateRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tuka-run-skin/tuka-run-ultimate.webp';
import druhRunSkin1 from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-1.webp';
import druhRunSkin2 from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-2.webp';
import druhRunSkin3 from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-3.webp';
import druhRunSkin4 from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-4.webp';
import druhUltimateRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-ultimate.webp';
import druhCascosRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-cascos.webp';
import druhMagoRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-mago.webp';
import druhReyRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-rey.webp';
import druhSenorRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/druh-run-skin/druh-run-señor.webp';
import tokyoRunSkin1 from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-1.webp';
import tokyoRunSkin2 from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-2.webp';
import tokyoRunSkin3 from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-3.webp';
import tokyoRunSkin4 from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-4.webp';
import tokioCapuchaRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-capucha.webp';
import tokioCascosRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-cascos.webp';
import tokioGafasRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-gafas.webp';
import tokioMineraRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-minero.webp';
import tokioReinaRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-rey.webp';
import tokioUltimateRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/tokyo-run-skin/tokyo-run-ultimate.webp';
import zeusRunSkin1 from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-1.webp';
import zeusRunSkin2 from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-2.webp';
import zeusRunSkin3 from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-3.webp';
import zeusRunSkin4 from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-4.webp';
import zeusChefRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-chef.webp';
import zeusMagoRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-mago.webp';
import zeusMineroRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-minero.webp';
import zeusReyRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-rey.webp';
import zeusSherifRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/zeus-run-skin/zeus-run-sherif.webp';
import gordoRunSkin1 from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-1.webp';
import gordoRunSkin2 from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-2.webp';
import gordoRunSkin3 from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-3.webp';
import gordoRunSkin4 from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-4.webp';
import gordoCascosRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-cascos.webp';
import gordoGafasRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-gafas.webp';
import gordoMagoRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-mago.webp';
import gordoReyRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-rey.webp';
import gordoSenorRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-señor.webp';
import gordoUltimateRunSkin from '../../assets/ui/lady-sprite/sprites-run-skins/gordo-run-skin/gordo-run-ultimate.webp';

import '../../styles/modals/RaidScreen.css';
import '../../styles/modals/TavernModal.css';

const RARITY_LABEL = { legendary: 'Legendaria', epic: 'Épica', rare: 'Rara' };
const PURCHASE_ANIM_FRAMES = {
    muna: [munaRunSkin1, munaRunSkin2, munaRunSkin3, munaRunSkin4],
    gordo: [gordoRunSkin1, gordoRunSkin2, gordoRunSkin3, gordoRunSkin4],
    lady: [ladyRunSkin1, ladyRunSkin2, ladyRunSkin3, ladyRunSkin4],
    nupito: [nupitoRunSkin1, nupitoRunSkin2, nupitoRunSkin3, nupitoRunSkin4],
    tuka: [tukaRunSkin1, tukaRunSkin2, tukaRunSkin3, tukaRunSkin4],
    druh: [druhRunSkin1, druhRunSkin2, druhRunSkin3, druhRunSkin4],
    tokio: [tokyoRunSkin1, tokyoRunSkin2, tokyoRunSkin3, tokyoRunSkin4],
    zeus: [zeusRunSkin1, zeusRunSkin2, zeusRunSkin3, zeusRunSkin4],
};
const CONCEPT_DISPLAY_NAME = { capucha: 'Urbana', cascos: 'Beats', gafas: 'SWAG' };
const SKIN_RUN_OVERRIDE = {
    'lady:gafas': ladyGafasRunSkin,
    'lady:cascos': ladyCascosRunSkin,
    'lady:capucha': ladyCapuchaRunSkin,
    'lady:minera': ladyMineraRunSkin,
    'lady:pirata': ladyPirataRunSkin,
    'lady:fase1': ladyUltimateRunSkin,
    'muna:cascos': munaCascosRunSkin,
    'muna:minera': munaMineraRunSkin,
    'muna:piloto': munaPilotoRunSkin,
    'muna:pirata': munaPirataRunSkin,
    'muna:reina': munaReinaRunSkin,
    'muna:fase1': munaUltimateRunSkin,
    'nupito:mago': nupitoMagoRunSkin,
    'nupito:minero': nupitoMineroRunSkin,
    'nupito:rey': nupitoReyRunSkin,
    'nupito:sherif': nupitoSherifRunSkin,
    'nupito:fase1': nupitoUltimateRunSkin,
    'tokio:capucha': tokioCapuchaRunSkin,
    'tokio:cascos': tokioCascosRunSkin,
    'tokio:gafas': tokioGafasRunSkin,
    'tokio:minera': tokioMineraRunSkin,
    'tokio:reina': tokioReinaRunSkin,
    'tokio:fase1': tokioUltimateRunSkin,
    'tuka:capucha': tukaCapuchaRunSkin,
    'tuka:cascos': tukaCascosRunSkin,
    'tuka:chef': tukaChefRunSkin,
    'tuka:gafas': tukaGafasRunSkin,
    'tuka:reina': tukaReinaRunSkin,
    'tuka:fase1': tukaUltimateRunSkin,
    'druh:fase1': druhUltimateRunSkin,
    'druh:cascos': druhCascosRunSkin,
    'druh:mago': druhMagoRunSkin,
    'druh:rey': druhReyRunSkin,
    'druh:señor': druhSenorRunSkin,
    'gordo:cascos': gordoCascosRunSkin,
    'gordo:gafas': gordoGafasRunSkin,
    'gordo:mago': gordoMagoRunSkin,
    'gordo:rey': gordoReyRunSkin,
    'gordo:señor': gordoSenorRunSkin,
    'gordo:fase1': gordoUltimateRunSkin,
    'zeus:chef': zeusChefRunSkin,
    'zeus:mago': zeusMagoRunSkin,
    'zeus:minero': zeusMineroRunSkin,
    'zeus:rey': zeusReyRunSkin,
    'zeus:sherif': zeusSherifRunSkin,
};

/**
 * Tienda de skins del Tablón, extraída de RaidScreen.jsx para poder reutilizarla
 * tanto ahí (pestaña Skins) como en el acceso standalone de Lady Run.
 * Misma lógica de compra/preview que tenía antes, sin cambios de comportamiento.
 */
const SkinShopModal = ({ gameState, setGameState, onGoEquipSkin }) => {
    const [skinRarityFilter, setSkinRarityFilter] = useState(null);
    const [ultimatePreview, setUltimatePreview] = useState(null);
    const [skinJustBought, setSkinJustBought] = useState(false);
    const [purchaseAnim, setPurchaseAnim] = useState(null); // null | 'fading' | 'running' | 'reveal'
    const [previewTilt, setPreviewTilt] = useState({ x: 0, y: 0 });
    const [previewShockwave, setPreviewShockwave] = useState(null);
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        setSkinJustBought(false);
        setPurchaseAnim(null);
    }, [ultimatePreview]);

    useEffect(() => {
        const t = setInterval(() => setFrameIndex(prev => (prev + 1) % 4), 150);
        return () => clearInterval(t);
    }, []);

    const handlePreviewImgTap = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        setPreviewTilt({ x: -(relY - 0.5) * 26, y: (relX - 0.5) * 26 });
        setPreviewShockwave({ x: relX * 100, y: relY * 100, id: Date.now() });
        setTimeout(() => setPreviewTilt({ x: 0, y: 0 }), 400);
    };

    const handleBuySkin = (dogId, skinId) => {
        const skin = DogSkinsConfig[dogId]?.find(s => s.id === skinId);
        if (!skin || skin.starGated) return;
        setGameState(prev => {
            const owned = prev.dogSkins?.[dogId]?.owned ?? [];
            if (owned.includes(skinId)) return prev;
            if ((prev.huesin ?? 0) < skin.huesinPrice || (prev.tavernCoins ?? 0) < skin.tavernPrice) return prev;
            return {
                ...prev,
                huesin: prev.huesin - skin.huesinPrice,
                tavernCoins: prev.tavernCoins - skin.tavernPrice,
                dogSkins: {
                    ...prev.dogSkins,
                    [dogId]: { owned: [...owned, skinId], equipped: prev.dogSkins?.[dogId]?.equipped ?? null },
                },
            };
        });
    };

    return (
        <>
            <div className="rarity-filter-bar">
                {['legendary', 'epic', 'rare', 'obtenidos'].map(r => {
                    const rarityIcon = r === 'legendary' ? iconRarityLegend : r === 'epic' ? iconRarityEpic : r === 'rare' ? iconRarityRara : iconRarityObtenidos;
                    return (
                        <button
                            key={r}
                            className={`rarity-filter-btn${r !== 'obtenidos' ? ` rarity-filter-${r}` : ''}${skinRarityFilter === r ? ' rarity-filter-active' : ''}`}
                            onClick={() => setSkinRarityFilter(skinRarityFilter === r ? null : r)}
                        >
                            <img src={rarityIcon} alt={r} />
                        </button>
                    );
                })}
            </div>

            <div className="skin-shop-list">
                {Object.entries(DogSkinsConfig).sort(([a], [b]) => {
                    const rank = (id) => {
                        if (id === 'lady') return 0;
                        const rarity = DogsConfig[id]?.rarity;
                        if (rarity === 'legendary') return 1;
                        if (rarity === 'epic') return 2;
                        return 3;
                    };
                    return rank(a) - rank(b);
                }).map(([dogId, allSkins]) => {
                    const config = DogsConfig[dogId];
                    if (!config) return null;
                    if (allSkins.length === 0 && skinRarityFilter !== 'obtenidos') {
                        return (
                            <div key={dogId} className="skin-shop-dog-block">
                                <span className="cdl-section-title">{config.name}</span>
                                <p className="raid-tablon-soon">Próximamente</p>
                            </div>
                        );
                    }
                    const owned = gameState.dogSkins?.[dogId]?.owned ?? [];
                    const skins = allSkins.filter(skin => !skin.hiddenInShop).filter(skin => {
                        if (!skinRarityFilter) return true;
                        if (skinRarityFilter === 'obtenidos') return owned.includes(skin.id);
                        if (skinRarityFilter === 'legendary') return skin.tier === 'legendary' || skin.tier === 'ultimate';
                        return skin.tier === skinRarityFilter;
                    });
                    if (skins.length === 0) return null;
                    return (
                        <div key={dogId} className="skin-shop-dog-block">
                            <span className="cdl-section-title">{config.name}</span>
                            <div className="skin-shop-grid">
                                {skins.map(skin => {
                                    const isOwned = owned.includes(skin.id);
                                    const canBuy = !isOwned && !skin.starGated
                                        && (gameState.huesin ?? 0) >= skin.huesinPrice
                                        && (gameState.tavernCoins ?? 0) >= skin.tavernPrice;
                                    return (
                                        <div key={skin.id} className={`skin-shop-item dog-rarity-${skin.tier}`}>
                                            {skin.loopWith ? (
                                                <div className="skin-shop-ultimate-loop" onClick={() => setUltimatePreview({ dogId, skin })}>
                                                    <img src={dogSkinAssets[dogId]?.[skin.id]} alt={skin.id} className="skin-shop-img skin-shop-ultimate-fase1" />
                                                    <img src={dogSkinAssets[dogId]?.[skin.loopWith]} alt={skin.loopWith} className="skin-shop-img skin-shop-ultimate-fase2" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={dogSkinAssets[dogId]?.[skin.id]}
                                                    alt={skin.id}
                                                    className="skin-shop-img"
                                                    onClick={() => setUltimatePreview({ dogId, skin })}
                                                />
                                            )}
                                            <button
                                                className={`skin-shop-buy-btn ${canBuy || isOwned ? '' : 'raid-tablon-buy-disabled'}`}
                                                onClick={() => setUltimatePreview({ dogId, skin })}
                                            >
                                                {isOwned ? 'Comprada' : skin.starGated ? (
                                                    <span className="skin-shop-price">
                                                        <Lock size={11} /> {skin.starGated} <Star size={11} />
                                                    </span>
                                                ) : (
                                                    <span className="skin-shop-price">
                                                        {skin.huesinPrice} <img src={huesinCoin} alt="Huesín" className="raid-tablon-buy-icon" />
                                                        <span className="skin-shop-price-plus">+</span>
                                                        {skin.tavernPrice} <img src={coinTavern} alt="coins" className="raid-tablon-buy-icon" />
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {ultimatePreview && (() => {
                const owned = gameState.dogSkins?.[ultimatePreview.dogId]?.owned ?? [];
                const isOwned = owned.includes(ultimatePreview.skin.id);
                const canBuy = !isOwned
                    && (gameState.huesin ?? 0) >= ultimatePreview.skin.huesinPrice
                    && (gameState.tavernCoins ?? 0) >= ultimatePreview.skin.tavernPrice;
                const isUltimate = !!ultimatePreview.skin.loopWith;
                const skinRunOverride = SKIN_RUN_OVERRIDE[`${ultimatePreview.dogId}:${ultimatePreview.skin.id}`] ?? null;
                const conceptId = ultimatePreview.skin.id;
                const conceptName = CONCEPT_DISPLAY_NAME[conceptId] ?? (conceptId.charAt(0).toUpperCase() + conceptId.slice(1));
                const skinName = ultimatePreview.skin.name ?? `${DogsConfig[ultimatePreview.dogId]?.name} ${conceptName}`;
                return (
                <div className="skin-preview-overlay" onClick={e => { e.stopPropagation(); setUltimatePreview(null); }}>
                    <div className={`skin-preview-frame dog-rarity-${ultimatePreview.skin.tier} skin-preview-${ultimatePreview.dogId}`} onClick={e => e.stopPropagation()}>
                        <button className="skin-preview-close" onClick={() => setUltimatePreview(null)}><X /></button>
                        <div className="skin-preview-darken" />
                        {isUltimate && (
                            <>
                                <div className="skin-preview-glow" />
                                <div className="skin-preview-flash" />
                                <div className="skin-preview-motes">
                                    <span></span><span></span><span></span>
                                </div>
                            </>
                        )}
                        <div className="skin-preview-particles">
                            <span></span><span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <h2 className="skin-preview-title">{skinName}</h2>
                        {isUltimate ? (
                            <div className="skin-preview-phase-badge">
                                <span className="skin-shop-ultimate-fase1">FASE 1</span>
                                <span className="skin-shop-ultimate-fase2">FASE 2</span>
                            </div>
                        ) : (
                            <div className="skin-preview-phase-badge">
                                <span className="skin-preview-rarity-label">{RARITY_LABEL[ultimatePreview.skin.tier]}</span>
                            </div>
                        )}
                        <div
                            className="skin-preview-img-slot"
                            onClick={handlePreviewImgTap}
                            style={{ transform: `perspective(700px) rotateX(${previewTilt.x}deg) rotateY(${previewTilt.y}deg)` }}
                        >
                            {purchaseAnim === 'running' ? (
                                skinRunOverride ? (
                                    <img src={skinRunOverride} alt="" className="skin-preview-run-sprite" />
                                ) : (
                                    <img
                                        src={(() => {
                                            const frames = PURCHASE_ANIM_FRAMES[ultimatePreview.dogId] ?? [];
                                            return frames[frameIndex % frames.length];
                                        })()}
                                        alt=""
                                        className="skin-preview-run-sprite"
                                    />
                                )
                            ) : purchaseAnim === 'reveal' ? (
                                <img src={dogSkinAssets[ultimatePreview.dogId]?.[ultimatePreview.skin.id]} alt="" className="skin-preview-img skin-preview-reveal-spin" />
                            ) : isUltimate ? (
                                <>
                                    <img src={dogSkinAssets[ultimatePreview.dogId]?.[ultimatePreview.skin.id]} alt="" className={`skin-preview-img skin-shop-ultimate-fase1${purchaseAnim === 'fading' ? ' skin-preview-fade-out' : ''}`} />
                                    <img src={dogSkinAssets[ultimatePreview.dogId]?.[ultimatePreview.skin.loopWith]} alt="" className={`skin-preview-img skin-shop-ultimate-fase2${purchaseAnim === 'fading' ? ' skin-preview-fade-out' : ''}`} />
                                </>
                            ) : (
                                <img src={dogSkinAssets[ultimatePreview.dogId]?.[ultimatePreview.skin.id]} alt="" className={`skin-preview-img${purchaseAnim === 'fading' ? ' skin-preview-fade-out' : ''}`} />
                            )}
                            {previewShockwave && (
                                <span
                                    key={previewShockwave.id}
                                    className="skin-preview-shockwave"
                                    style={{ left: `${previewShockwave.x}%`, top: `${previewShockwave.y}%` }}
                                    onAnimationEnd={() => setPreviewShockwave(null)}
                                />
                            )}
                        </div>
                        {isUltimate && (
                            <p className="skin-preview-hint">{DogsConfig[ultimatePreview.dogId]?.name} a 3 <Star size={11} /> evoluciona la skin</p>
                        )}
                        {isOwned && skinJustBought ? (
                            <div className="skin-preview-postbuy-actions">
                                <button className="skin-preview-postbuy-btn" onClick={() => setSkinJustBought(false)}>
                                    Seguir comprando
                                </button>
                                <button
                                    className="skin-preview-postbuy-btn"
                                    onClick={() => {
                                        const dogId = ultimatePreview.dogId;
                                        setUltimatePreview(null);
                                        onGoEquipSkin?.(dogId);
                                    }}
                                >
                                    Ir a equipar
                                </button>
                            </div>
                        ) : (
                            <button
                                className={`skin-preview-buy-btn ${canBuy || isOwned ? '' : 'raid-tablon-buy-disabled'}`}
                                disabled={isOwned || !canBuy}
                                onClick={() => {
                                    const dogId = ultimatePreview.dogId;
                                    const isTestAnim = skinRunOverride || (!isUltimate && PURCHASE_ANIM_FRAMES[dogId]);
                                    handleBuySkin(dogId, ultimatePreview.skin.id);
                                    if (isTestAnim) {
                                        setPurchaseAnim('fading');
                                        setTimeout(() => setPurchaseAnim('running'), 250);
                                        setTimeout(() => setPurchaseAnim('reveal'), 3050);
                                        setTimeout(() => { setPurchaseAnim(null); setSkinJustBought(true); }, 3950);
                                    } else {
                                        setSkinJustBought(true);
                                    }
                                }}
                            >
                                {isOwned ? 'Comprada' : (
                                    <span className="skin-shop-price">
                                        {ultimatePreview.skin.huesinPrice} <img src={huesinCoin} alt="Huesín" className="raid-tablon-buy-icon" />
                                        <span className="skin-shop-price-plus">+</span>
                                        {ultimatePreview.skin.tavernPrice} <img src={coinTavern} alt="coins" className="raid-tablon-buy-icon" />
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                );
            })()}
        </>
    );
};

export default SkinShopModal;
