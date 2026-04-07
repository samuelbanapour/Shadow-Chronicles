import type { GameState, PlayerStats, Item, Scene, Choice } from './types';
import { SCENES } from './storyline';
import { CLASSES } from './classes';

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  health: 100,
  maxHealth: 100,
  mana: 80,
  maxMana: 80,
  corruption: 0,
  strength: 12,
  cunning: 12,
  darkness: 0,
  gold: 50,
  level: 1,
  experience: 0,
  experienceToNext: 200,
};

export function createInitialState(
  name: string,
  classId: 'shadowblade' | 'necromancer' | 'warlord' | 'plague-doctor'
): GameState {
  const classDef = CLASSES.find(c => c.id === classId)!;
  const baseStats = { ...DEFAULT_PLAYER_STATS, ...classDef.baseStats };

  return {
    currentScene: 'intro',
    chapter: 1,
    gameStarted: true,
    log: [`You are ${name}, ${classDef.description}`],
    player: {
      name,
      class: classId,
      stats: baseStats,
      inventory: [classDef.startingItem],
      statusEffects: [],
      allies: [],
      flags: {},
      choiceHistory: [],
      killCount: 0,
      soulsConsumed: 0,
      betrayals: 0,
    }
  };
}

export function applyChoice(state: GameState, choice: Choice): GameState {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;

  if (choice.statChanges) {
    const stats = newState.player.stats;
    const changes = choice.statChanges;

    if (changes.health !== undefined) stats.health = Math.max(0, Math.min(stats.maxHealth, stats.health + changes.health));
    if (changes.mana !== undefined) stats.mana = Math.max(0, Math.min(stats.maxMana, stats.mana + changes.mana));
    if (changes.corruption !== undefined) stats.corruption = Math.max(0, Math.min(100, stats.corruption + changes.corruption));
    if (changes.strength !== undefined) stats.strength = Math.max(1, stats.strength + changes.strength);
    if (changes.cunning !== undefined) stats.cunning = Math.max(1, stats.cunning + changes.cunning);
    if (changes.darkness !== undefined) stats.darkness = Math.max(0, stats.darkness + changes.darkness);
    if (changes.gold !== undefined) stats.gold = Math.max(0, stats.gold + changes.gold);
    if (changes.experience !== undefined) {
      stats.experience += changes.experience;
      while (stats.experience >= stats.experienceToNext) {
        stats.experience -= stats.experienceToNext;
        stats.level += 1;
        stats.experienceToNext = Math.floor(stats.experienceToNext * 1.5);
        stats.maxHealth += 10;
        stats.health = Math.min(stats.health + 15, stats.maxHealth);
        stats.maxMana += 8;
      }
    }
  }

  if (choice.items) {
    for (const item of choice.items) {
      if (!newState.player.inventory.find(i => i.id === item.id)) {
        newState.player.inventory.push(item);
      }
    }
  }

  const changes = choice.statChanges;
  if (changes) {
    if (typeof (changes as Record<string, unknown>)['killCount'] === 'number') {
      newState.player.killCount += (changes as Record<string, unknown>)['killCount'] as number;
    }
    if (typeof (changes as Record<string, unknown>)['soulsConsumed'] === 'number') {
      newState.player.soulsConsumed += (changes as Record<string, unknown>)['soulsConsumed'] as number;
    }
    if (typeof (changes as Record<string, unknown>)['betrayals'] === 'number') {
      newState.player.betrayals += (changes as Record<string, unknown>)['betrayals'] as number;
    }
  }

  newState.player.choiceHistory.push(choice.id);

  if (choice.consequence) {
    newState.log.push(choice.consequence);
  }

  newState.currentScene = choice.nextScene;

  const nextScene = SCENES[choice.nextScene];
  if (nextScene) {
    newState.chapter = nextScene.chapter;
  }

  return newState;
}

export function getCurrentScene(state: GameState): Scene | null {
  return SCENES[state.currentScene] ?? null;
}

export function isChoiceLocked(choice: Choice, stats: PlayerStats): { locked: boolean; reason?: string } {
  if (!choice.requires) return { locked: false };

  for (const [key, value] of Object.entries(choice.requires)) {
    const currentValue = stats[key as keyof PlayerStats];
    if (typeof currentValue === 'number' && typeof value === 'number') {
      if (currentValue < value) {
        return {
          locked: true,
          reason: `Requires ${key.charAt(0).toUpperCase() + key.slice(1)} ${value} (yours: ${currentValue})`
        };
      }
    }
  }

  return { locked: false };
}

export function getCorruptionLabel(corruption: number): string {
  if (corruption >= 80) return 'Void-Touched';
  if (corruption >= 60) return 'Darkened Soul';
  if (corruption >= 40) return 'Morally Compromised';
  if (corruption >= 20) return 'Shadow\'s Edge';
  return 'Relatively Clean';
}

export function getDarknessLabel(darkness: number): string {
  if (darkness >= 40) return 'Instrument of Void';
  if (darkness >= 25) return 'Creature of Darkness';
  if (darkness >= 15) return 'Dark Practitioner';
  if (darkness >= 5) return 'Shadow-Touched';
  return 'Untainted';
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem('dark-sovereign-save', JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem('dark-sovereign-save');
    if (!data) return null;
    return JSON.parse(data) as GameState;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem('dark-sovereign-save');
}
