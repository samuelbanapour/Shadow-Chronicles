import type { ClassDefinition } from './types';

export const CLASSES: ClassDefinition[] = [
  {
    id: 'shadowblade',
    name: 'Shadowblade',
    description: 'A former royal assassin who sold their soul for perfect lethality.',
    lore: 'Once the crown\'s most trusted blade, you were betrayed. Now you serve only darkness — and the cold mathematics of death.',
    ability: 'Shadow Step',
    abilityDescription: 'Vanish from sight, striking vital points from the unseen dark. +25% damage on first strike.',
    baseStats: {
      strength: 16,
      cunning: 18,
      darkness: 12,
      health: 80,
      maxHealth: 80,
      mana: 60,
      maxMana: 60,
    },
    startingItem: {
      id: 'obsidian-dagger',
      name: 'Obsidian Dagger',
      description: 'A blade that drinks shadow. It cuts through both flesh and doubt.',
      type: 'weapon',
      rarity: 'rare',
      lore: 'Forged in the void between stars. It hungered before you found it.'
    }
  },
  {
    id: 'necromancer',
    name: 'Necromancer',
    description: 'A scholar who tore open the boundary between living and dead.',
    lore: 'You did not begin evil. You began with questions. Then obsession. Then the first corpse spoke back.',
    ability: 'Soul Leech',
    abilityDescription: 'Drain life force from enemies, converting their vitality into your mana and restoring health.',
    baseStats: {
      strength: 8,
      cunning: 20,
      darkness: 20,
      health: 60,
      maxHealth: 60,
      mana: 100,
      maxMana: 100,
    },
    startingItem: {
      id: 'grimoire-of-unmaking',
      name: 'Grimoire of Unmaking',
      description: 'A book bound in the skin of its previous owner. The pages rewrite themselves.',
      type: 'artifact',
      rarity: 'cursed',
      lore: 'Every spell within it was written in blood. Mostly the author\'s.'
    }
  },
  {
    id: 'warlord',
    name: 'Warlord',
    description: 'A conqueror who burns kingdoms to forge an empire of iron.',
    lore: 'Lesser men call you a monster. You call them subjects — or corpses. There is no third category.',
    ability: 'Wrath of Iron',
    abilityDescription: 'Channel unbridled rage to deal massive damage, ignoring enemy defenses entirely.',
    baseStats: {
      strength: 22,
      cunning: 10,
      darkness: 14,
      health: 120,
      maxHealth: 120,
      mana: 40,
      maxMana: 40,
    },
    startingItem: {
      id: 'executioners-axe',
      name: 'Executioner\'s Axe',
      description: 'Heavy. Honest. It does exactly what its name promises.',
      type: 'weapon',
      rarity: 'rare',
      lore: 'Three hundred and twelve heads. You counted the notches until you stopped caring.'
    }
  },
  {
    id: 'plague-doctor',
    name: 'Plague Doctor',
    description: 'A healer who discovered that disease is the purest form of power.',
    lore: 'You cured patients until you understood something profound: the sick need you. The healthy do not. So you changed that.',
    ability: 'Epidemic',
    abilityDescription: 'Release a cloud of tailored pestilence that weakens all enemies while your corrupted body remains immune.',
    baseStats: {
      strength: 10,
      cunning: 16,
      darkness: 16,
      health: 70,
      maxHealth: 70,
      mana: 80,
      maxMana: 80,
    },
    startingItem: {
      id: 'vial-of-the-black-death',
      name: 'Vial of the Black Death',
      description: 'A sealed glass vial containing a plague you invented. You\'re rather proud of it.',
      type: 'artifact',
      rarity: 'cursed',
      lore: 'It ate through iron chains in twelve hours. Flesh takes three.'
    }
  }
];
