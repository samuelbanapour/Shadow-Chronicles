import { Howl } from 'howler';

type BackgroundMood = 'tomb' | 'throne' | 'forest' | 'village' | 'dungeon' | 'ritual' | 'battlefield' | 'tower' | 'abyss';
type SfxType = 'choice' | 'transition' | 'crow' | 'heartbeat' | 'thunder' | 'sword' | 'spell';

const AMBIENT_FILES: Record<BackgroundMood, string> = {
  tomb: '/audio/ambient-tomb.mp3',
  throne: '/audio/ambient-throne.mp3',
  forest: '/audio/ambient-forest.mp3',
  village: '/audio/ambient-village.mp3',
  dungeon: '/audio/ambient-dungeon.mp3',
  ritual: '/audio/ambient-ritual.mp3',
  battlefield: '/audio/ambient-battlefield.mp3',
  tower: '/audio/ambient-tower.mp3',
  abyss: '/audio/ambient-abyss.mp3',
};

const SFX_FILES: Record<SfxType, string> = {
  choice: '/audio/sfx-click.mp3',
  transition: '/audio/sfx-transition.mp3',
  crow: '/audio/sfx-crow.mp3',
  heartbeat: '/audio/sfx-heartbeat.mp3',
  thunder: '/audio/sfx-thunder.mp3',
  sword: '/audio/sfx-sword.mp3',
  spell: '/audio/sfx-spell.mp3',
};

const AMBIENT_VOLUME: Record<BackgroundMood, number> = {
  tomb: 0.35,
  throne: 0.3,
  forest: 0.25,
  village: 0.25,
  dungeon: 0.4,
  ritual: 0.35,
  battlefield: 0.4,
  tower: 0.2,
  abyss: 0.45,
};

const SFX_VOLUME: Record<SfxType, number> = {
  choice: 0.25,
  transition: 0.3,
  crow: 0.35,
  heartbeat: 0.5,
  thunder: 0.5,
  sword: 0.4,
  spell: 0.3,
};

const STORAGE_KEY = 'dark-sovereign-audio-muted';
const CROSSFADE_MS = 1200;

function resolveAudioPath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  if (path.startsWith('/')) {
    return base.endsWith('/') ? base + path.slice(1) : base + path;
  }
  return base + path;
}

class AudioService {
  private currentMood: BackgroundMood | null = null;
  private pendingMood: BackgroundMood | null = null;
  private currentAmbient: Howl | null = null;
  private currentAmbientId: number | null = null;
  private sfxCache: Partial<Record<SfxType, Howl>> = {};
  private muted = false;
  private initialized = false;
  private hasInteracted = false;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private interactionHandler: (() => void) | null = null;

  constructor() {
    this.muted = localStorage.getItem(STORAGE_KEY) === 'true';
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.preloadSfx();

    const handler = () => {
      this.hasInteracted = true;
      this.removeInteractionListeners();
      if (this.pendingMood && !this.muted) {
        this.playAmbient(this.pendingMood);
      }
    };
    this.interactionHandler = handler;
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
    document.addEventListener('keydown', handler);
  }

  private removeInteractionListeners(): void {
    if (this.interactionHandler) {
      document.removeEventListener('click', this.interactionHandler);
      document.removeEventListener('touchstart', this.interactionHandler);
      document.removeEventListener('keydown', this.interactionHandler);
      this.interactionHandler = null;
    }
  }

  private preloadSfx(): void {
    const types: SfxType[] = ['choice', 'transition', 'crow', 'heartbeat', 'thunder', 'sword', 'spell'];
    for (const type of types) {
      this.sfxCache[type] = new Howl({
        src: [resolveAudioPath(SFX_FILES[type])],
        volume: this.muted ? 0 : SFX_VOLUME[type],
        preload: true,
      });
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem(STORAGE_KEY, String(this.muted));

    if (this.currentAmbient && this.currentAmbientId !== null) {
      if (this.muted) {
        this.currentAmbient.fade(
          this.currentAmbient.volume(),
          0,
          200,
          this.currentAmbientId
        );
      } else {
        const mood = this.currentMood;
        const targetVol = mood ? AMBIENT_VOLUME[mood] : 0.3;
        this.currentAmbient.fade(0, targetVol, 200, this.currentAmbientId);
      }
    }

    for (const [type, howl] of Object.entries(this.sfxCache)) {
      if (howl) {
        howl.volume(this.muted ? 0 : SFX_VOLUME[type as SfxType]);
      }
    }

    return this.muted;
  }

  playAmbient(mood: BackgroundMood): void {
    if (mood === this.currentMood) return;

    this.pendingMood = mood;

    if (!this.hasInteracted) return;

    const previousAmbient = this.currentAmbient;
    const previousId = this.currentAmbientId;

    if (previousAmbient && previousId !== null) {
      previousAmbient.fade(previousAmbient.volume(), 0, CROSSFADE_MS, previousId);
      const ref = previousAmbient;
      const refId = previousId;
      setTimeout(() => {
        ref.stop(refId);
        ref.unload();
      }, CROSSFADE_MS + 100);
    }

    const targetVolume = this.muted ? 0 : AMBIENT_VOLUME[mood];
    const newAmbient = new Howl({
      src: [resolveAudioPath(AMBIENT_FILES[mood])],
      loop: true,
      volume: 0,
      preload: true,
      onplay: (id) => {
        newAmbient.fade(0, targetVolume, CROSSFADE_MS, id);
      },
    });

    const id = newAmbient.play();
    this.currentAmbient = newAmbient;
    this.currentAmbientId = typeof id === 'number' ? id : null;
    this.currentMood = mood;
  }

  stopAmbient(): void {
    if (this.currentAmbient) {
      const amb = this.currentAmbient;
      const id = this.currentAmbientId;
      if (id !== null) {
        amb.fade(amb.volume(), 0, 400, id);
        setTimeout(() => {
          amb.stop();
          amb.unload();
        }, 450);
      } else {
        amb.stop();
        amb.unload();
      }
      this.currentAmbient = null;
      this.currentAmbientId = null;
      this.currentMood = null;
    }
  }

  playSfx(type: SfxType): void {
    if (this.muted || !this.hasInteracted) return;
    const howl = this.sfxCache[type];
    if (howl) {
      howl.play();
    }
  }

  startHeartbeat(): void {
    if (this.heartbeatInterval) return;
    this.playSfx('heartbeat');
    this.heartbeatInterval = setInterval(() => this.playSfx('heartbeat'), 2200);
  }

  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  destroy(): void {
    this.stopHeartbeat();
    this.stopAmbient();
    this.removeInteractionListeners();

    for (const howl of Object.values(this.sfxCache)) {
      if (howl) {
        howl.unload();
      }
    }
    this.sfxCache = {};

    this.initialized = false;
    this.hasInteracted = false;
  }
}

export const audioService = new AudioService();
