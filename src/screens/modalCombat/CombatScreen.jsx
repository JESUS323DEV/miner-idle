import { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { DogsConfig } from '../../game/config/DogsConfig.js';
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

const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
    boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
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

    const [phase, setPhase]                     = useState('biome');
    const [activeBiome, setActiveBiome]         = useState(null);
    const [activeEnemy, setActiveEnemy]         = useState(null);
    const [team, setTeam]                       = useState([]);
    const [enemyHp, setEnemyHp]                 = useState(0);
    const [timer, setTimer]                     = useState(0);
    const [resultsData, setResultsData]         = useState(null);
    const [abilityCooldowns, setAbilityCooldowns] = useState({});

    const ABILITY_COOLDOWN    = 10;
    const ABILITY_MULTIPLIER  = 15;

    useEffect(() => {
        if (isOpen) {
            setPhase('biome');
            setActiveBiome(null);
            setActiveEnemy(null);
            setTeam([]);
            setEnemyHp(0);
            setTimer(0);
            setResultsData(null);
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

    const calcDamage = () => {
        const pickDmg = gameState.pickaxe.miningPowerByMaterial?.[gameState.pickaxe.material] ?? 2;
        const dogDmg  = team.reduce((sum, id) => sum + (DogsConfig[id]?.miningPower ?? 0), 0);
        return Math.max(1, pickDmg + dogDmg);
    };

    const handleTap = () => {
        if (phase !== 'fight') return;
        setEnemyHp(prev => Math.max(0, prev - calcDamage()));
    };

    const handleAbility = (dogId) => {
        if (phase !== 'fight' || (abilityCooldowns[dogId] ?? 0) > 0) return;
        const dmg = (DogsConfig[dogId]?.miningPower ?? 1) * ABILITY_MULTIPLIER;
        setEnemyHp(prev => Math.max(0, prev - dmg));
        setAbilityCooldowns(prev => ({ ...prev, [dogId]: ABILITY_COOLDOWN }));
    };

    const startFight = () => {
        if (team.length === 0 || !activeEnemy) return;
        const cooldowns = {};
        team.forEach(id => { cooldowns[id] = 0; });
        setAbilityCooldowns(cooldowns);
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
    const hiredDogs = Object.values(dogs).filter(
        d => d && typeof d === 'object' && !Array.isArray(d) && d.hired
    );
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
                        <button className="combat-close-btn-sm" onClick={onClose}><X /></button>
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
                        <button className="combat-close-btn-sm" onClick={onClose}><X /></button>
                    </div>
                    <p className="combat-subtitle-meta">❤️ {activeEnemy.hp} · ⏱ {activeEnemy.timerSec}s</p>

                    <div className="combat-selected-slots">
                        {[0, 1, 2].map(i => {
                            const id = team[i];
                            if (id) {
                                const cfg = DogsConfig[id];
                                return (
                                    <div
                                        key={i}
                                        className={`combat-sel-slot filled dog-rarity-${cfg?.rarity}`}
                                        onClick={() => setTeam(prev => prev.filter(d => d !== id))}
                                    >
                                        <img src={dogAssets[id]} alt={id} />
                                        <span>{cfg?.name}</span>
                                    </div>
                                );
                            }
                            return <div key={i} className="combat-sel-slot empty"><span>+</span></div>;
                        })}
                    </div>

                    <div className="combat-dogs-grid">
                        {hiredDogs.length === 0 && (
                            <p className="combat-no-dogs">No tienes mascotas contratadas</p>
                        )}
                        {hiredDogs.map(dog => {
                            const cfg      = DogsConfig[dog.id];
                            const selected = team.includes(dog.id);
                            return (
                                <button
                                    key={dog.id}
                                    className={`combat-dog-card${selected ? ' combat-dog-selected' : ''} dog-rarity-${cfg?.rarity}`}
                                    onClick={() => setTeam(prev =>
                                        selected
                                            ? prev.filter(id => id !== dog.id)
                                            : prev.length < 3 ? [...prev, dog.id] : prev
                                    )}
                                >
                                    <img src={dogAssets[dog.id]} alt={dog.id} />
                                    <span className="cdc-name">{cfg?.name}</span>
                                    <span className="cdc-power">⚔️ {cfg?.miningPower}</span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        className={`combat-start-btn${team.length === 0 ? ' combat-start-disabled' : ''}`}
                        onClick={startFight}
                        disabled={team.length === 0}
                    >
                        ⚔️ Combatir
                    </button>
                </div>
            )}

            {/* ===== FIGHT ===== */}
            {phase === 'fight' && activeEnemy && (
                <div className="combat-fight">
                    <div className={`combat-timer${timer <= 10 ? ' combat-timer-urgent' : ''}`}>
                        ⏱ {timer}s
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
                        {team.map(id => {
                            const cfg = DogsConfig[id];
                            const cd  = abilityCooldowns[id] ?? 0;
                            return (
                                <button
                                    key={id}
                                    className={`combat-team-slot dog-rarity-${cfg?.rarity}${cd === 0 ? ' ability-ready' : ''}`}
                                    onClick={() => handleAbility(id)}
                                    disabled={cd > 0}
                                >
                                    <img src={dogAssets[id]} alt={id} />
                                    <span className="ability-label">
                                        {cd === 0 ? '⚡' : `${cd}s`}
                                    </span>
                                </button>
                            );
                        })}
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
                                        <img src={dogAssets[resultsData.rewardDogId]} alt={resultsData.rewardDogId} />
                                        <span>{DogsConfig[resultsData.rewardDogId]?.name}</span>
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
