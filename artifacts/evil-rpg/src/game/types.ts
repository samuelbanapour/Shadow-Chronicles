export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  corruption: number;
  strength: number;
  cunning: number;
  darkness: number;
  gold: number;
  level: number;
  experience: number;
  experienceToNext: number;
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: 'buff' | 'debuff' | 'curse';
  icon: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'artifact' | 'consumable';
  rarity: 'common' | 'rare' | 'legendary' | 'cursed';
  effect?: Partial<PlayerStats>;
  lore?: string;
}

export interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  description: string;
  rewards: {
    experience: number;
    gold: number;
    items?: Item[];
  };
  abilities?: string[];
  weakness?: string;
}

export type StatChanges = Partial<PlayerStats> & {
  killCount?: number;
  soulsConsumed?: number;
  betrayals?: number;
};

export interface Choice {
  id: string;
  text: string;
  consequence?: string;
  nextScene: string;
  requires?: Partial<PlayerStats>;
  statChanges?: StatChanges;
  items?: Item[];
  morality: 'evil' | 'dark' | 'neutral' | 'grey';
  locked?: boolean;
  lockedReason?: string;
  combat?: Enemy;
  goldCost?: number;
  classBonus?: ('shadowblade' | 'necromancer' | 'warlord' | 'plague-doctor')[];
  minBetrayals?: number;
}

export interface Scene {
  id: string;
  title: string;
  chapter: number;
  narrative: string[];
  choices: Choice[];
  backgroundMood: 'tomb' | 'throne' | 'forest' | 'village' | 'dungeon' | 'ritual' | 'battlefield' | 'tower' | 'abyss';
  ambientSound?: string;
  isEnding?: boolean;
  endingType?: 'bad' | 'neutral' | 'dark-triumph' | 'true-evil' | 'redemption' | 'death';
  enemy?: Enemy;
}

export type ReputationLevel = 'none' | 'untrustworthy' | 'notorious' | 'legendary';

export interface GameState {
  currentScene: string;
  player: {
    name: string;
    class: 'shadowblade' | 'necromancer' | 'warlord' | 'plague-doctor';
    stats: PlayerStats;
    inventory: Item[];
    statusEffects: StatusEffect[];
    allies: string[];
    flags: Record<string, boolean>;
    choiceHistory: string[];
    killCount: number;
    soulsConsumed: number;
    betrayals: number;
    reputation: ReputationLevel;
  };
  gameStarted: boolean;
  chapter: number;
  log: string[];
}

export type ClassDefinition = {
  id: 'shadowblade' | 'necromancer' | 'warlord' | 'plague-doctor';
  name: string;
  description: string;
  lore: string;
  baseStats: Partial<PlayerStats>;
  startingItem: Item;
  ability: string;
  abilityDescription: string;
};
