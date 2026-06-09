import sfxHitUrl from '../../assets/audio/sfx/pick-rock.mp3';
import sfxBlockedUrl from '../../assets/audio/sfx/hit-rock2.mp3';

let audioCtx = null;
const buffers = {};

const SFX_CONFIG = {
    hit:     { offset: 2.0, duration: 0.4, gain: 0.4 },
    blocked: { offset: 0.0, duration: 0.4, gain: 0.03 },
};

const loadBuffer = async (key, url) => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (buffers[key]) return;
    const res = await fetch(url);
    const data = await res.arrayBuffer();
    buffers[key] = await audioCtx.decodeAudioData(data);
};

loadBuffer('hit', sfxHitUrl);
loadBuffer('blocked', sfxBlockedUrl);

export const playBuffer = (key) => {
    if (localStorage.getItem('sfx_enabled') === 'false') return;
    if (!audioCtx || !buffers[key]) return;
    const { offset, duration, gain: gainMult = 1.0 } = SFX_CONFIG[key] ?? { offset: 0, duration: 0.4, gain: 1.0 };
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[key];
    const gain = audioCtx.createGain();
    gain.gain.value = parseFloat(localStorage.getItem('sfx_volume') ?? '0.2') * gainMult;
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0, offset);
    source.stop(audioCtx.currentTime + duration);
};
