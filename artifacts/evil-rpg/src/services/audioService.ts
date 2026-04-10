type BackgroundMood = 'tomb' | 'throne' | 'forest' | 'village' | 'dungeon' | 'ritual' | 'battlefield' | 'tower' | 'abyss';

interface AmbientConfig {
  baseFreq: number;
  secondFreq: number;
  type: OscillatorType;
  secondType: OscillatorType;
  filterFreq: number;
  filterQ: number;
  lfoRate: number;
  lfoDepth: number;
  gain: number;
  noiseGain: number;
}

const MOOD_CONFIGS: Record<BackgroundMood, AmbientConfig> = {
  tomb: {
    baseFreq: 55, secondFreq: 82.5, type: 'sine', secondType: 'triangle',
    filterFreq: 200, filterQ: 2, lfoRate: 0.08, lfoDepth: 8, gain: 0.12, noiseGain: 0.015,
  },
  throne: {
    baseFreq: 65, secondFreq: 98, type: 'sawtooth', secondType: 'sine',
    filterFreq: 300, filterQ: 3, lfoRate: 0.06, lfoDepth: 5, gain: 0.1, noiseGain: 0.01,
  },
  forest: {
    baseFreq: 110, secondFreq: 165, type: 'sine', secondType: 'sine',
    filterFreq: 600, filterQ: 1, lfoRate: 0.15, lfoDepth: 20, gain: 0.08, noiseGain: 0.04,
  },
  village: {
    baseFreq: 82.5, secondFreq: 123.5, type: 'sine', secondType: 'triangle',
    filterFreq: 400, filterQ: 1, lfoRate: 0.1, lfoDepth: 10, gain: 0.07, noiseGain: 0.02,
  },
  dungeon: {
    baseFreq: 41, secondFreq: 61.5, type: 'sine', secondType: 'sawtooth',
    filterFreq: 150, filterQ: 4, lfoRate: 0.04, lfoDepth: 6, gain: 0.13, noiseGain: 0.025,
  },
  ritual: {
    baseFreq: 73.5, secondFreq: 110, type: 'triangle', secondType: 'sawtooth',
    filterFreq: 350, filterQ: 5, lfoRate: 0.12, lfoDepth: 25, gain: 0.11, noiseGain: 0.02,
  },
  battlefield: {
    baseFreq: 49, secondFreq: 73.5, type: 'sawtooth', secondType: 'square',
    filterFreq: 250, filterQ: 3, lfoRate: 0.2, lfoDepth: 15, gain: 0.14, noiseGain: 0.03,
  },
  tower: {
    baseFreq: 146.8, secondFreq: 220, type: 'sine', secondType: 'sine',
    filterFreq: 800, filterQ: 1.5, lfoRate: 0.07, lfoDepth: 30, gain: 0.06, noiseGain: 0.035,
  },
  abyss: {
    baseFreq: 32.7, secondFreq: 49, type: 'sine', secondType: 'triangle',
    filterFreq: 120, filterQ: 6, lfoRate: 0.03, lfoDepth: 4, gain: 0.15, noiseGain: 0.02,
  },
};

interface AmbientNodes {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  filter: BiquadFilterNode;
  masterGain: GainNode;
  noiseSource: AudioBufferSourceNode | null;
  noiseGain: GainNode;
}

const STORAGE_KEY = 'dark-sovereign-audio-muted';
const CROSSFADE_MS = 1200;

class AudioService {
  private ctx: AudioContext | null = null;
  private currentMood: BackgroundMood | null = null;
  private currentNodes: AmbientNodes | null = null;
  private masterVolume: GainNode | null = null;
  private muted = false;
  private initialized = false;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.muted = localStorage.getItem(STORAGE_KEY) === 'true';
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null as any;
      this.ctx = new AC();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.value = this.muted ? 0 : 1;
      this.masterVolume.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private interactionHandler: (() => void) | null = null;

  init() {
    if (this.initialized) return;
    this.initialized = true;
    const handler = () => {
      this.ensureContext();
      this.removeInteractionListeners();
    };
    this.interactionHandler = handler;
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
    document.addEventListener('keydown', handler);
  }

  private removeInteractionListeners() {
    if (this.interactionHandler) {
      document.removeEventListener('click', this.interactionHandler);
      document.removeEventListener('touchstart', this.interactionHandler);
      document.removeEventListener('keydown', this.interactionHandler);
      this.interactionHandler = null;
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem(STORAGE_KEY, String(this.muted));
    if (this.masterVolume) {
      const ctx = this.ensureContext();
      this.masterVolume.gain.cancelScheduledValues(ctx.currentTime);
      this.masterVolume.gain.setTargetAtTime(this.muted ? 0 : 1, ctx.currentTime, 0.1);
    }
    return this.muted;
  }

  private createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = 0.99 * lastOut + 0.01 * white;
      data[i] = lastOut * 20;
    }
    return buffer;
  }

  private buildAmbient(mood: BackgroundMood): AmbientNodes {
    const ctx = this.ensureContext();
    const cfg = MOOD_CONFIGS[mood];

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(this.masterVolume!);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cfg.filterFreq;
    filter.Q.value = cfg.filterQ;
    filter.connect(masterGain);

    const osc1 = ctx.createOscillator();
    osc1.type = cfg.type;
    osc1.frequency.value = cfg.baseFreq;
    osc1.connect(filter);

    const osc2 = ctx.createOscillator();
    osc2.type = cfg.secondType;
    osc2.frequency.value = cfg.secondFreq;
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.6;
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = cfg.lfoRate;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = cfg.lfoDepth;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = cfg.noiseGain;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = cfg.filterFreq * 0.8;
    noiseFilter.Q.value = 0.5;
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    const noiseBuffer = this.createNoiseBuffer(ctx, 4);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseSource.connect(noiseFilter);

    osc1.start();
    osc2.start();
    lfo.start();
    noiseSource.start();

    return { osc1, osc2, lfo, lfoGain, filter, masterGain, noiseSource, noiseGain };
  }

  private fadeIn(nodes: AmbientNodes, targetGain: number) {
    const ctx = this.ensureContext();
    nodes.masterGain.gain.cancelScheduledValues(ctx.currentTime);
    nodes.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    nodes.masterGain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + CROSSFADE_MS / 1000);
  }

  private fadeOut(nodes: AmbientNodes, onDone?: () => void) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const fadeDur = CROSSFADE_MS / 1000;
    nodes.masterGain.gain.cancelScheduledValues(now);
    nodes.masterGain.gain.setValueAtTime(nodes.masterGain.gain.value, now);
    nodes.masterGain.gain.linearRampToValueAtTime(0, now + fadeDur);
    setTimeout(() => {
      try {
        nodes.osc1.stop();
        nodes.osc2.stop();
        nodes.lfo.stop();
        nodes.noiseSource?.stop();
        nodes.osc1.disconnect();
        nodes.osc2.disconnect();
        nodes.lfo.disconnect();
        nodes.lfoGain.disconnect();
        nodes.filter.disconnect();
        nodes.masterGain.disconnect();
        nodes.noiseSource?.disconnect();
        nodes.noiseGain.disconnect();
      } catch {
        // already stopped/disconnected
      }
      onDone?.();
    }, CROSSFADE_MS + 100);
  }

  playAmbient(mood: BackgroundMood) {
    if (mood === this.currentMood) return;

    const ctx = this.ensureContext();
    if (!ctx) return;
    const cfg = MOOD_CONFIGS[mood];

    if (this.currentNodes) {
      this.fadeOut(this.currentNodes);
    }

    const nodes = this.buildAmbient(mood);
    this.fadeIn(nodes, cfg.gain);
    this.currentNodes = nodes;
    this.currentMood = mood;
  }

  stopAmbient() {
    if (this.currentNodes) {
      this.fadeOut(this.currentNodes);
      this.currentNodes = null;
      this.currentMood = null;
    }
  }

  playSfx(type: 'choice' | 'transition' | 'crow' | 'heartbeat' | 'thunder' | 'sword' | 'spell') {
    try {
      const ctx = this.ensureContext();
      switch (type) {
        case 'choice': this.sfxClick(ctx); break;
        case 'transition': this.sfxSweep(ctx); break;
        case 'crow': this.sfxCrow(ctx); break;
        case 'heartbeat': this.sfxHeartbeat(ctx); break;
        case 'thunder': this.sfxThunder(ctx); break;
        case 'sword': this.sfxSword(ctx); break;
        case 'spell': this.sfxSpell(ctx); break;
      }
    } catch {
      // audio context not ready
    }
  }

  startHeartbeat() {
    if (this.heartbeatInterval) return;
    this.playSfx('heartbeat');
    this.heartbeatInterval = setInterval(() => this.playSfx('heartbeat'), 2200);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sfxClick(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.masterVolume!);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }

  private sfxSweep(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.6);
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume!);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  }

  private sfxCrow(ctx: AudioContext) {
    for (let i = 0; i < 3; i++) {
      const t = ctx.currentTime + i * 0.15;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900 + i * 100, t);
      osc.frequency.exponentialRampToValueAtTime(500, t + 0.12);
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 3;
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterVolume!);
      osc.start(t);
      osc.stop(t + 0.16);
    }
  }

  private sfxHeartbeat(ctx: AudioContext) {
    const now = ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const t = now + i * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 40;
      gain.gain.setValueAtTime(0.15 - i * 0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.masterVolume!);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  }

  private sfxThunder(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4));
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume!);
    source.start(ctx.currentTime);
  }

  private sfxSword(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume!);
    source.start(ctx.currentTime);
  }

  private sfxSpell(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(450, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.3);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.3;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(gain);
    gain.connect(this.masterVolume!);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.5);
  }

  destroy() {
    this.stopHeartbeat();
    this.stopAmbient();
    this.removeInteractionListeners();
    this.initialized = false;
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const audioService = new AudioService();
