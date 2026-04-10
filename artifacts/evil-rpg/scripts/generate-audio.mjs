import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = join(__dirname, '..', 'public', 'audio');
const SAMPLE_RATE = 22050;

function encodeWav(samples, sampleRate) {
  const numSamples = samples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  function writeStr(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return Buffer.from(buffer);
}

function brownNoise(length) {
  const out = new Float32Array(length);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const w = Math.random() * 2 - 1;
    last = 0.99 * last + 0.01 * w;
    out[i] = last * 15;
  }
  return out;
}

function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

function generateAmbient(config) {
  const dur = config.duration || 8;
  const len = SAMPLE_RATE * dur;
  const samples = new Float32Array(len);
  const noise = brownNoise(len);

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const lfo = 1 + config.lfoDepth * sine(config.lfoRate, t);
    let val = 0;
    val += sine(config.baseFreq * lfo, t) * config.gain;
    val += sine(config.secondFreq * lfo, t) * config.gain * 0.5;
    if (config.thirdFreq) {
      val += sine(config.thirdFreq * lfo, t) * config.gain * 0.25;
    }
    val += noise[i] * config.noiseGain;

    const fadeIn = Math.min(1, i / (SAMPLE_RATE * 0.5));
    const fadeOut = Math.min(1, (len - i) / (SAMPLE_RATE * 0.5));
    samples[i] = val * fadeIn * fadeOut;
  }

  return samples;
}

function generateSfx(type) {
  let dur, samples;
  switch (type) {
    case 'click': {
      dur = 0.08;
      const len = SAMPLE_RATE * dur;
      samples = new Float32Array(len);
      for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        samples[i] = sine(800, t) * 0.3 * Math.exp(-t * 50);
      }
      break;
    }
    case 'transition': {
      dur = 0.6;
      const len = SAMPLE_RATE * dur;
      samples = new Float32Array(len);
      for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const freq = 200 * Math.pow(0.4, t);
        samples[i] = sine(freq, t) * 0.15 * (1 - t / dur);
      }
      break;
    }
    case 'crow': {
      dur = 0.5;
      const len = SAMPLE_RATE * dur;
      samples = new Float32Array(len);
      for (let burst = 0; burst < 3; burst++) {
        const start = Math.floor(burst * 0.15 * SAMPLE_RATE);
        const burstLen = Math.floor(0.12 * SAMPLE_RATE);
        for (let i = 0; i < burstLen && start + i < len; i++) {
          const t = i / SAMPLE_RATE;
          const freq = (900 + burst * 100) * Math.pow(0.55, t * 8);
          const env = Math.exp(-t * 25);
          samples[start + i] += sine(freq, t) * 0.15 * env;
        }
      }
      break;
    }
    case 'heartbeat': {
      dur = 0.5;
      const len = SAMPLE_RATE * dur;
      samples = new Float32Array(len);
      for (let beat = 0; beat < 2; beat++) {
        const start = Math.floor(beat * 0.25 * SAMPLE_RATE);
        const beatLen = Math.floor(0.18 * SAMPLE_RATE);
        for (let i = 0; i < beatLen && start + i < len; i++) {
          const t = i / SAMPLE_RATE;
          samples[start + i] += sine(40, t) * (0.4 - beat * 0.1) * Math.exp(-t * 20);
        }
      }
      break;
    }
    case 'thunder': {
      dur = 1.5;
      const len = SAMPLE_RATE * dur;
      samples = new Float32Array(len);
      const noiseData = brownNoise(len);
      for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        samples[i] = noiseData[i] * 0.5 * Math.exp(-t * 2.5);
      }
      break;
    }
    case 'sword': {
      dur = 0.3;
      const len = SAMPLE_RATE * dur;
      samples = new Float32Array(len);
      for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 20);
        samples[i] = noise * 0.3;
      }
      break;
    }
    case 'spell': {
      dur = 0.5;
      const len = SAMPLE_RATE * dur;
      samples = new Float32Array(len);
      for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const freq = 300 * Math.pow(4, t);
        const env = t < 0.1 ? t * 10 : Math.exp(-(t - 0.1) * 5);
        samples[i] = sine(freq, t) * 0.2 * env;
        samples[i] += sine(freq * 1.5, t) * 0.08 * env;
      }
      break;
    }
    default:
      throw new Error(`Unknown SFX type: ${type}`);
  }
  return samples;
}

const MOODS = {
  tomb: { baseFreq: 55, secondFreq: 82.5, lfoRate: 0.08, lfoDepth: 0.003, gain: 0.25, noiseGain: 0.03 },
  throne: { baseFreq: 65, secondFreq: 98, thirdFreq: 130, lfoRate: 0.06, lfoDepth: 0.002, gain: 0.2, noiseGain: 0.02 },
  forest: { baseFreq: 110, secondFreq: 165, lfoRate: 0.15, lfoDepth: 0.005, gain: 0.15, noiseGain: 0.06 },
  village: { baseFreq: 82.5, secondFreq: 123.5, lfoRate: 0.1, lfoDepth: 0.004, gain: 0.15, noiseGain: 0.03 },
  dungeon: { baseFreq: 41, secondFreq: 61.5, lfoRate: 0.04, lfoDepth: 0.002, gain: 0.28, noiseGain: 0.04 },
  ritual: { baseFreq: 73.5, secondFreq: 110, thirdFreq: 147, lfoRate: 0.12, lfoDepth: 0.006, gain: 0.22, noiseGain: 0.03 },
  battlefield: { baseFreq: 49, secondFreq: 73.5, lfoRate: 0.2, lfoDepth: 0.004, gain: 0.28, noiseGain: 0.05 },
  tower: { baseFreq: 146.8, secondFreq: 220, lfoRate: 0.07, lfoDepth: 0.008, gain: 0.12, noiseGain: 0.05 },
  abyss: { baseFreq: 32.7, secondFreq: 49, lfoRate: 0.03, lfoDepth: 0.001, gain: 0.3, noiseGain: 0.04 },
};

const SFX_TYPES = ['click', 'transition', 'crow', 'heartbeat', 'thunder', 'sword', 'spell'];

console.log('Generating ambient tracks...');
for (const [mood, config] of Object.entries(MOODS)) {
  const samples = generateAmbient(config);
  const wav = encodeWav(samples, SAMPLE_RATE);
  const path = join(AUDIO_DIR, `ambient-${mood}.wav`);
  writeFileSync(path, wav);
  console.log(`  ${mood}: ${(wav.length / 1024).toFixed(0)} KB`);
}

console.log('Generating SFX...');
for (const type of SFX_TYPES) {
  const samples = generateSfx(type);
  const wav = encodeWav(samples, SAMPLE_RATE);
  const path = join(AUDIO_DIR, `sfx-${type}.wav`);
  writeFileSync(path, wav);
  console.log(`  ${type}: ${(wav.length / 1024).toFixed(0)} KB`);
}

console.log('Done! Audio files generated in public/audio/');
