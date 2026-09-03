import sfxHitUrl          from '../../assets/audio/sfx/pick-rock.mp3';
import sfxBlockedUrl      from '../../assets/audio/sfx/hit-rock2.mp3';
import sfxBurstUrl        from '../../assets/audio/sfx/only-burst-use.mp3';
import sfxRepairUrl       from '../../assets/audio/sfx/only-repair-use.mp3';
import sfxUpgradeUrl      from '../../assets/audio/sfx/sound-unlock-upgrades.mp3';
import sfxRewardGoldUrl   from '../../assets/audio/sfx/only-rewards-gold.mp3';
import sfxRewardCoinUrl   from '../../assets/audio/sfx/only-rewards-coin-tavern.mp3';
import sfxRewardShardsUrl from '../../assets/audio/sfx/only-rewards-shards.mp3';
import sfxFinalMinaUrl    from '../../assets/audio/sfx/only-final-mina.mp3';
import sfxSendRaidUrl     from '../../assets/audio/sfx/only-send-raid.mp3';
import sfxFreeInvocUrl    from '../../assets/audio/sfx/rewards-raids-invocaciones-free.mp3';
import sfxFurnaceUrl      from '../../assets/audio/sfx/furnace.mp3';
import sfxHealUrl         from '../../assets/audio/lady-run/sfx/heal-sfx.mp3';
import sfxRouletteUrl     from '../../assets/audio/lady-run/sfx/ruleta-esenario-trim.mp3';
import sfxSelectSceneUrl  from '../../assets/audio/lady-run/sfx/select-esenario-trim.mp3';
import sfxHitPlayerUrl    from '../../assets/audio/lady-run/sfx/hit-pj-1-sfx-trim.mp3';

let audioCtx = null;
const buffers = {};

// gain calibrado para que a sfx_volume=0.09 (default) → volumen efectivo 0.09
const SFX_CONFIG = {
    hit:          { offset: 2.0, duration: 0.4, gain: 1.0 },
    blocked:      { offset: 0.0, duration: 0.4, gain: 0.3 },
    burst:        { offset: 0.0, gain: 1.0 },
    repair:       { offset: 0.0, gain: 1.0 },
    upgrade:      { offset: 0.0, gain: 1.0 },
    rewardGold:   { offset: 0.0, gain: 1.0 },
    rewardCoin:   { offset: 0.0, gain: 1.0 },
    rewardShards: { offset: 0.0, gain: 1.0 },
    finalMina:    { offset: 0.0, gain: 1.0 },
    sendRaid:     { offset: 0.0, gain: 1.0 },
    freeInvoc:    { offset: 0.0, gain: 1.0 },
    furnace:      { offset: 0.0, gain: 0.15, loop: true },
    heal:         { offset: 0.0, gain: 1.0 },
    roulette:     { offset: 0.0, gain: 1.0 },
    selectScene:  { offset: 0.0, gain: 1.0 },
    hitPlayer:    { offset: 0.0, gain: 1.0 },
};

const SFX_SOURCES = {
    hit:          sfxHitUrl,
    blocked:      sfxBlockedUrl,
    burst:        sfxBurstUrl,
    repair:       sfxRepairUrl,
    upgrade:      sfxUpgradeUrl,
    rewardGold:   sfxRewardGoldUrl,
    rewardCoin:   sfxRewardCoinUrl,
    rewardShards: sfxRewardShardsUrl,
    finalMina:    sfxFinalMinaUrl,
    sendRaid:     sfxSendRaidUrl,
    freeInvoc:    sfxFreeInvocUrl,
    furnace:      sfxFurnaceUrl,
    heal:         sfxHealUrl,
    roulette:     sfxRouletteUrl,
    selectScene:  sfxSelectSceneUrl,
    hitPlayer:    sfxHitPlayerUrl,
};

const ensureCtx = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
};

const loadBuffer = async (key, url) => {
    if (buffers[key]) return;
    try {
        const ctx = ensureCtx();
        const res = await fetch(url);
        const data = await res.arrayBuffer();
        buffers[key] = await ctx.decodeAudioData(data);
    } catch { /* ignore decode errors */ }
};

export const sfxReady = Promise.all(
    Object.entries(SFX_SOURCES).map(([key, url]) => loadBuffer(key, url))
).catch(() => {});

const loopingSources = {};

export const playBuffer = (key, volumeKey = 'sfx_volume') => {
    if (!audioCtx || !buffers[key]) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const { offset = 0, duration, gain: gainMult = 1.0, loop = false } = SFX_CONFIG[key] ?? {};
    if (loop && loopingSources[key]) return;
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[key];
    source.loop = loop;
    const gain = audioCtx.createGain();
    gain.gain.value = parseFloat(localStorage.getItem(volumeKey) ?? '0.09') * gainMult;
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0, offset);
    if (duration != null) source.stop(audioCtx.currentTime + duration);
    if (loop) {
        loopingSources[key] = source;
        source.onended = () => { loopingSources[key] = null; };
    }
};

export const stopSfx = (key) => {
    const source = loopingSources[key];
    if (!source) return;
    try { source.stop(); } catch { /* already stopped */ }
    loopingSources[key] = null;
};

export const playSfx = playBuffer;
