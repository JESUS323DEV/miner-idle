import { useState, useEffect } from 'react';
import { X, Pickaxe } from 'lucide-react';
import { playSfx } from '../../game/utils/sfx.js';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { RaidConfig, calcTeamStrength } from '../../game/config/RaidConfig.js';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig.js';
import '../../styles/modals/RaidScreen.css';
import '../../styles/modals/ForgeModal.css';

import iconGold   from '../../assets/ui/icons-hud/hud-principal/oro1.png';
import coinTavern from '../../assets/ui/icons-hud/hud-principal/coin-tavern1.png';

import ladyIcon   from '../../assets/ui/icons-pets/mineros/lady-icon.png';
import tokyoIcon  from '../../assets/ui/icons-pets/mineros/tokyo-icon.png';
import tukaIcon   from '../../assets/ui/icons-pets/mineros/tuka-icon.png';
import munaIcon   from '../../assets/ui/icons-pets/mineros/muna-icon.png';
import gordoIcon  from '../../assets/ui/icons-pets/mineros/gordo-icon.png';
import druhIcon   from '../../assets/ui/icons-pets/mineros/druh-icon.png';
import smokeIcon  from '../../assets/ui/icons-pets/mineros/smoke-icon.png';
import nupitoIcon from '../../assets/ui/icons-pets/mineros/nupito-icon.png';
import zeusIcon      from '../../assets/ui/icons-pets/mineros/zeus-icon.png';
import boxerIcon    from '../../assets/ui/icons-pets/mineros/boxer-icon.png';
import bullyIcon    from '../../assets/ui/icons-pets/mineros/bully-icon.png';
import chihuahuaIcon from '../../assets/ui/icons-pets/mineros/chihuhua-icon.png';

import forgeIcon1 from '../../assets/ui/icons-pets/forge/forge-icon1.png';
import forgeIcon2 from '../../assets/ui/icons-pets/forge/forge-icon2.png';
import forgeIcon3 from '../../assets/ui/icons-pets/forge/forge-icon3.png';
import forgeIcon4 from '../../assets/ui/icons-pets/forge/forge-icon4.png';
import forgeIcon5 from '../../assets/ui/icons-pets/forge/forge-icon5.png';
import forgeIcon6 from '../../assets/ui/icons-pets/forge/forge-icon6.png';
import forgeIcon7 from '../../assets/ui/icons-pets/forge/forge-icon7.png';
import forgeIcon8 from '../../assets/ui/icons-pets/forge/forge-icon8.png';
import forgeIcon9 from '../../assets/ui/icons-pets/forge/forge-icon9.png';

const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
    boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
    pip: forgeIcon1, koda: forgeIcon2, milo: forgeIcon3,
    rocky: forgeIcon4, bruno: forgeIcon5, max: forgeIcon6,
    rex: forgeIcon7, toby: forgeIcon8, buddy: forgeIcon9,
};

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
const RaidScreen = ({ isOpen, onClose, onOpenCombat, tutorialStep, onTutorialRaidSent }) => {
    const {
        gameState, setGameState,
        handleSendPassiveRaid,
        handleClaimPassiveRaid,
        handleCancelPassiveRaid,
    } = useGameContext();

    const [now, setNow] = useState(Date.now());
    const [selectedRaid, setSelectedRaid] = useState(null);
    const [teamDogIds, setTeamDogIds] = useState([]);
    const [raidTab, setRaidTab] = useState('passive');
    const [showRaidIntro, setShowRaidIntro] = useState(false);

    useEffect(() => {
        if (isOpen && !gameState.tutorial?.raidIntroDone) setShowRaidIntro(true);
    }, [isOpen]); // eslint-disable-line

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    // Auto-select forest + Druh during tutorial raid step
    useEffect(() => {
        if (!isOpen || tutorialStep !== 'hint_raids') return;
        const passiveRaids = gameState.raid?.passiveRaids ?? [];
        if (passiveRaids.some(r => r.raidId === 'forest')) return;
        setSelectedRaid('forest');
        setTeamDogIds([{ id: 'druh', isForge: false, isRented: true }]);
    }, [isOpen, tutorialStep]); // eslint-disable-line

    if (!isOpen) return null;

    const passiveRaids = gameState.raid?.passiveRaids ?? [];
    const lastRaidResults = gameState.raid?.lastRaidResults ?? {};
    const dogs = gameState.dogs ?? {};
    const forgeDogs = gameState.forgeDogs ?? {};

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


    const handleSend = (raidId, minTeam) => {
        if (teamDogIds.length < minTeam) return;
        playSfx('sendRaid');
        handleSendPassiveRaid(raidId, teamDogIds);
        setTeamDogIds([]);
        setSelectedRaid(null);
        if (tutorialStep === 'hint_raids') {
            onTutorialRaidSent?.();
        }
    };

    return (
        <div className="modal-overlay1" onClick={tutorialStep === 'hint_raids' ? undefined : onClose}>
            <div className="raid-screen-content" onClick={e => e.stopPropagation()}>
                <button
                    className="modal-close"
                    onClick={tutorialStep === 'hint_raids' ? undefined : onClose}
                    disabled={tutorialStep === 'hint_raids'}
                    style={tutorialStep === 'hint_raids' ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
                ><X /></button>
                <h2>⚔️ Raids</h2>

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

                {/* TABS */}
                <div className="raid-tabs">
                    <button
                        className={`raid-tab ${raidTab === 'passive' ? 'active' : ''}`}
                        onClick={() => setRaidTab('passive')}
                    >
                        🏕️ Pasiva
                    </button>
                    <button className="raid-tab raid-tab-soon" disabled>
                        ⚡ Activa <span className="raid-soon-badge">pronto</span>
                    </button>
                </div>

                {/* RESULTADOS ÚLTIMAS RAIDS */}
                {Object.entries(lastRaidResults).map(([raidId, result]) => {
                    if (passiveRaids.some(r => r.raidId === raidId)) return null;
                    const raidCfg = RaidConfig.passiveRaids.find(r => r.id === raidId);
                    const dismiss = () => setGameState(prev => {
                        const next = { ...prev.raid.lastRaidResults };
                        delete next[raidId];
                        return { ...prev, raid: { ...prev.raid, lastRaidResults: next } };
                    });
                    return (
                        <div key={raidId} className="raid-last-result">
                            <div className="rlr-header">
                                <p className="rlr-title">🎁 {raidCfg?.emoji} {raidCfg?.name}</p>
                                <button className="rlr-dismiss" onClick={dismiss}><X size={16} /></button>
                            </div>
                            <div className="rlr-loot">
                                {result.gold > 0 && <span><img src={iconGold} alt="gold" />{fmt(result.gold)}</span>}
                                {result.tavernCoins > 0 && <span><img src={coinTavern} alt="coins" />{result.tavernCoins}</span>}
                                {result.fragments?.map(({ dogId, amount }) => (
                                    <span key={dogId}>🧩×{amount} <small>{DogsConfig[dogId]?.name ?? dogId}</small></span>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* LISTA DE RAIDS — siempre visible */}
                {raidTab === 'passive' && (
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
                                    >
                                        {isActive ? (
                                            /* Estado EN CURSO */
                                            <div className="raid-inline-progress">
                                                <div className="rip-header">
                                                    <span className="rc-emoji">{raid.emoji}</span>
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
                                                <div className="rap-progress-bar">
                                                    <div className="rap-progress-fill" style={{ width: `${progress * 100}%` }} />
                                                </div>
                                                <div className="rap-timer">
                                                    {canClaim ? '¡Han vuelto!' : `⏱ ${formatTime(timeLeft)}`}
                                                </div>
                                                <div className="rip-actions">
                                                    <button
                                                        className={`btn-claim-raid ${canClaim ? 'btn-claim-ready' : ''}`}
                                                        onClick={e => { e.stopPropagation(); playSfx('freeInvoc'); handleClaimPassiveRaid(raid.id); }}
                                                        disabled={!canClaim}
                                                    >
                                                        {canClaim ? '🎁 Reclamar' : 'En camino...'}
                                                    </button>
                                                    <button
                                                        className="btn-cancel-raid"
                                                        onClick={e => { e.stopPropagation(); handleCancelPassiveRaid(raid.id); }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Estado NORMAL */
                                            <>
                                                <span className="rc-emoji">{raid.emoji}</span>
                                                <div className="rc-info">
                                                    <span className="rc-name">{raid.name}</span>
                                                    <span className="rc-desc">{raid.description}</span>
                                                    <span className="rc-meta">
                                                        ⏱ {formatTime(raid.duration * 1000)} &nbsp;·&nbsp;
                                                        👥 {raid.minTeam === raid.maxTeam ? `${raid.minTeam}` : `${raid.minTeam}–${raid.maxTeam}`} perros
                                                    </span>
                                                </div>
                                                <div className="rc-loot-preview">
                                                    {Object.keys(raid.loot).map(res =>
                                                        res === 'gold' ? <img key={res} src={iconGold} alt="gold" /> :
                                                        res === 'tavernCoins' ? <img key={res} src={coinTavern} alt="coins" /> :
                                                        res === 'fragments' ? <span key={res}>🧩</span> : null
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

                                            <button
                                                className={`btn-send-raid ${teamDogIds.length >= raid.minTeam ? '' : 'btn-send-disabled'}`}
                                                onClick={() => handleSend(raid.id, raid.minTeam)}
                                                disabled={teamDogIds.length < raid.minTeam}
                                            >
                                                🚀 Enviar equipo
                                            </button>
                                        </div>
                                    )}


                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

export default RaidScreen;
