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

export const playBuffer = (key) => {
    if (!audioCtx || !buffers[key]) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const { offset = 0, duration, gain: gainMult = 1.0 } = SFX_CONFIG[key] ?? {};
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[key];
    const gain = audioCtx.createGain();
    gain.gain.value = parseFloat(localStorage.getItem('sfx_volume') ?? '0.09') * gainMult;
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0, offset);
    if (duration != null) source.stop(audioCtx.currentTime + duration);
};

export const playSfx = playBuffer;
