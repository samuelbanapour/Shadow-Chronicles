const PLAY_GAMES_SCOPE = 'https://www.googleapis.com/auth/games';
const GAMES_API = 'https://games.googleapis.com/games/v1';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Record<string, AchievementDef> = {
  game_start: {
    id: import.meta.env.VITE_ACH_GAME_START ?? '',
    name: 'Dark Awakening',
    description: 'Begin your journey into darkness',
  },
  chapter_2: {
    id: import.meta.env.VITE_ACH_CHAPTER_2 ?? '',
    name: 'Deeper Into Darkness',
    description: 'Survive to Chapter 2',
  },
  chapter_3: {
    id: import.meta.env.VITE_ACH_CHAPTER_3 ?? '',
    name: 'The Abyss Stares Back',
    description: 'Reach Chapter 3',
  },
  chapter_4: {
    id: import.meta.env.VITE_ACH_CHAPTER_4 ?? '',
    name: 'No Turning Back',
    description: 'Enter the final chapter',
  },
  ending_bad: {
    id: import.meta.env.VITE_ACH_ENDING_BAD ?? '',
    name: 'A Worthy Death',
    description: 'Reach a tragic ending',
  },
  ending_neutral: {
    id: import.meta.env.VITE_ACH_ENDING_NEUTRAL ?? '',
    name: 'Bittersweet Legacy',
    description: 'Reach a bittersweet ending',
  },
  ending_dark_triumph: {
    id: import.meta.env.VITE_ACH_ENDING_DARK_TRIUMPH ?? '',
    name: 'Dark Triumph',
    description: 'Seize absolute power',
  },
  ending_true_evil: {
    id: import.meta.env.VITE_ACH_ENDING_TRUE_EVIL ?? '',
    name: 'True Evil',
    description: 'Transcend into something beyond mortal reckoning',
  },
  ending_redemption: {
    id: import.meta.env.VITE_ACH_ENDING_REDEMPTION ?? '',
    name: 'The Light Within',
    description: 'Find the hidden redemption ending',
  },
  corruption_50: {
    id: import.meta.env.VITE_ACH_CORRUPTION_50 ?? '',
    name: 'Corrupted',
    description: 'Reach 50 corruption',
  },
  corruption_80: {
    id: import.meta.env.VITE_ACH_CORRUPTION_80 ?? '',
    name: 'Void-Touched',
    description: 'Reach 80 corruption',
  },
  class_shadowblade: {
    id: import.meta.env.VITE_ACH_CLASS_SHADOWBLADE ?? '',
    name: 'Master of Shadows',
    description: 'Play as the Shadowblade',
  },
  class_necromancer: {
    id: import.meta.env.VITE_ACH_CLASS_NECROMANCER ?? '',
    name: 'Commander of the Dead',
    description: 'Play as the Necromancer',
  },
  class_warlord: {
    id: import.meta.env.VITE_ACH_CLASS_WARLORD ?? '',
    name: 'Iron Warlord',
    description: 'Play as the Warlord',
  },
  class_plague_doctor: {
    id: import.meta.env.VITE_ACH_CLASS_PLAGUE_DOCTOR ?? '',
    name: 'Doctor of Despair',
    description: 'Play as the Plague Doctor',
  },
  level_5: {
    id: import.meta.env.VITE_ACH_LEVEL_5 ?? '',
    name: 'Rising Power',
    description: 'Reach level 5',
  },
  all_classes: {
    id: import.meta.env.VITE_ACH_ALL_CLASSES ?? '',
    name: 'Sovereign of All Paths',
    description: 'Play through the game with all four classes',
  },
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

class PlayGamesService {
  private accessToken: string | null = null;
  private unlocked = new Set<string>();
  private pendingUnlocks = new Set<string>();
  private clientId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
  private gisLoaded = false;
  private toastCallback: ((name: string) => void) | null = null;

  init(onAchievementUnlocked?: (name: string) => void) {
    this.toastCallback = onAchievementUnlocked ?? null;
    const stored = localStorage.getItem('pgs-unlocked');
    if (stored) this.unlocked = new Set(JSON.parse(stored) as string[]);
    this.loadGIS();
  }

  private loadGIS() {
    if (this.gisLoaded || !this.clientId) return;
    if (document.getElementById('google-gis')) { this.gisLoaded = true; return; }
    const script = document.createElement('script');
    script.id = 'google-gis';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => { this.gisLoaded = true; };
    document.head.appendChild(script);
  }

  isConfigured(): boolean {
    return !!this.clientId;
  }

  isSignedIn(): boolean {
    return this.accessToken !== null;
  }

  async signIn(): Promise<boolean> {
    if (!this.clientId || !window.google) return false;
    return new Promise((resolve) => {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: PLAY_GAMES_SCOPE,
        callback: async (response) => {
          if (response.access_token) {
            this.accessToken = response.access_token;
            await this.flushPending();
            resolve(true);
          } else {
            resolve(false);
          }
        },
      });
      client.requestAccessToken();
    });
  }

  signOut() {
    this.accessToken = null;
  }

  async trigger(eventKey: string) {
    const ach = ACHIEVEMENTS[eventKey];
    if (!ach || !ach.id) return;
    if (this.unlocked.has(ach.id)) return;

    if (!this.accessToken) {
      this.pendingUnlocks.add(ach.id);
      this.toastCallback?.(ach.name);
      return;
    }

    await this.unlock(ach.id, ach.name);
  }

  private async unlock(achievementId: string, name: string) {
    if (!achievementId || this.unlocked.has(achievementId)) return;
    try {
      const res = await fetch(`${GAMES_API}/achievements/${achievementId}/unlock`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
      if (res.ok || res.status === 409) {
        this.unlocked.add(achievementId);
        const arr = JSON.parse(localStorage.getItem('pgs-unlocked') ?? '[]') as string[];
        if (!arr.includes(achievementId)) arr.push(achievementId);
        localStorage.setItem('pgs-unlocked', JSON.stringify(arr));
        this.toastCallback?.(name);
      }
    } catch {
      // Silently fail — game continues without achievements
    }
  }

  private async flushPending() {
    for (const id of this.pendingUnlocks) {
      const name = Object.values(ACHIEVEMENTS).find(a => a.id === id)?.name ?? '';
      await this.unlock(id, name);
    }
    this.pendingUnlocks.clear();
  }
}

export const playGames = new PlayGamesService();
