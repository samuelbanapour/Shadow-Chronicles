import type { Scene } from './types';

export const SCENES: Record<string, Scene> = {

  // ═══════════════════════════════════════════════════════
  // CHAPTER 1: THE AWAKENING
  // ═══════════════════════════════════════════════════════

  'intro': {
    id: 'intro',
    chapter: 1,
    title: 'The Throne of Ash',
    backgroundMood: 'tomb',
    narrative: [
      'You awaken in the ruins of what was once the greatest cathedral in the realm.',
      'Around you: scorched marble, shattered stained glass, and thirty-seven bodies arranged in a perfect pentagram.',
      'You did not arrange them. You do not remember arriving here. But deep in your chest, where guilt once lived, you feel only... appetite.',
      'A figure stands at the altar — the Whispering Shade, a being of pure shadow that has waited a thousand years for someone like you.',
      '"Finally," it breathes, voice like wind through a graveyard. "The vessel has arrived. The Obsidian Crown awaits a worthy sovereign. Will you claim your destiny... or flee back to the light like a coward?"',
    ],
    choices: [
      {
        id: 'intro-claim',
        text: '"The Crown will be mine. Tell me what must be done."',
        nextScene: 'ch1-first-choice',
        morality: 'evil',
        statChanges: { darkness: 2, corruption: 5 },
        consequence: 'The Shade\'s hollow eyes gleam. "There are three seals. Three sacrifices. Begin in the village below."'
      },
      {
        id: 'intro-question',
        text: '"What is the Obsidian Crown? What does it cost?"',
        nextScene: 'ch1-first-choice',
        morality: 'neutral',
        statChanges: { cunning: 1 },
        consequence: '"Cost?" The Shade laughs like breaking bones. "Everything. And you will pay it gladly once you taste real power."'
      },
      {
        id: 'intro-threaten',
        text: '"I bow to nothing. Not even shadow. Now tell me what I want to know — or I unmake you."',
        nextScene: 'ch1-first-choice',
        morality: 'dark',
        statChanges: { darkness: 3, strength: 1 },
        consequence: 'The Shade goes silent. Then, slowly, it kneels. "...Yes. Sovereign. The Crown is below. And so are your enemies."'
      }
    ]
  },

  'ch1-first-choice': {
    id: 'ch1-first-choice',
    chapter: 1,
    title: 'The Village of Thornwatch',
    backgroundMood: 'village',
    narrative: [
      'The village of Thornwatch huddles in the shadow of the cathedral ruins, its people oblivious to what stirs above.',
      'Simple folk. Farmers. Families. The kind of people who pray to gods that do not answer.',
      'The First Seal requires a soul freely given — or souls taken by force. You count forty-three people in the village.',
      'The village Elder, a woman named Maren with silver-streaked hair, spots you approaching. Her eyes narrow with old, practiced wariness.',
      '"Stranger. State your business in Thornwatch." Behind her, a young girl peers around a doorframe, clutching a doll made of straw.',
    ],
    choices: [
      {
        id: 'ch1-corrupt-elder',
        text: 'Offer the Elder power and wealth in exchange for her people\'s "willing" participation in the ritual.',
        nextScene: 'ch1-corruption-path',
        morality: 'evil',
        statChanges: { cunning: 2, corruption: 8, gold: -20 },
        consequence: 'Greed is older than goodness. The Elder\'s eyes flicker. You have found her price.'
      },
      {
        id: 'ch1-slaughter',
        text: 'Slaughter the village. A massacre requires no negotiations.',
        nextScene: 'ch1-slaughter-path',
        morality: 'evil',
        statChanges: { strength: 3, darkness: 5, corruption: 15, killCount: 43 },
        consequence: 'You draw your weapon. The screaming begins. It does not last long.',
        requires: { strength: 12 }
      },
      {
        id: 'ch1-deceive',
        text: 'Pose as a travelling priest. Gain their trust. Perform the "ritual" in secret.',
        nextScene: 'ch1-deception-path',
        morality: 'dark',
        statChanges: { cunning: 3, corruption: 6, darkness: 2 },
        consequence: 'The Elder\'s wariness melts into relief. A priest. How fortunate. "We haven\'t had a blessing in years," she says.'
      },
      {
        id: 'ch1-spare',
        text: 'Find another way. These people are... irrelevant. The seal can be broken differently.',
        nextScene: 'ch1-alternative-seal',
        morality: 'grey',
        statChanges: { cunning: 2 },
        consequence: 'The Shade whispers: "There is another way. The old Inquisitor\'s crypt. But it is... guarded."'
      },
      {
        id: 'ch1-bribe-elder',
        text: 'Press a heavy purse into Maren\'s hands. "Look the other way for one night. Your people need never know."',
        nextScene: 'ch1-seal-broken',
        morality: 'dark',
        goldCost: 40,
        statChanges: { cunning: 3, corruption: 7, killCount: 3 },
        consequence: 'Gold speaks louder than prayer. Maren pockets the purse and turns away. Three volunteers "disappear" before morning. The seal breaks quietly.'
      },
      {
        id: 'ch1-str-intimidate',
        text: 'Seize Maren by the collar and lift her off her feet with one hand. "Move. Or be moved."',
        nextScene: 'ch1-slaughter-path',
        morality: 'evil',
        requires: { strength: 20 },
        statChanges: { strength: 3, darkness: 4, corruption: 12, killCount: 10 },
        consequence: 'Maren\'s feet dangle. The village scatters. Only the brave stay — and the brave die first.'
      },
      {
        id: 'ch1-cun-poison',
        text: 'Examine the well. With the right preparation, the ritual can be done through the water supply.',
        nextScene: 'ch1-seal-broken',
        morality: 'evil',
        requires: { cunning: 20 },
        statChanges: { cunning: 4, corruption: 12, darkness: 3, killCount: 15 },
        consequence: 'No screaming. No combat. Just a quiet morning where fifteen people don\'t wake. The seal breaks like glass.'
      }
    ]
  },

  'ch1-corruption-path': {
    id: 'ch1-corruption-path',
    chapter: 1,
    title: 'A Deal Most Wicked',
    backgroundMood: 'village',
    narrative: [
      'The Elder\'s name is Maren Coldbrook, and she has buried three husbands and two children. She knows what suffering costs.',
      'When you describe the power available — immortality for herself, prosperity for Thornwatch — her hands stop trembling.',
      '"The villagers won\'t consent," she says carefully. "They\'re devout. Foolish with it."',
      '"They won\'t need to consent," you reply. "Only you need to understand what happens either way."',
      'A long silence. The doll-clutching girl has disappeared. Somewhere, a dog barks.',
      'Maren looks at her village. Then at you. Then back at something only she can see.',
      '"...How many?" she asks.',
    ],
    choices: [
      {
        id: 'ch1-cp-seven',
        text: '"Seven souls. The eldest. They\'ve lived their lives." Bargain for fewer victims.',
        nextScene: 'ch1-seal-broken',
        morality: 'dark',
        statChanges: { cunning: 2, corruption: 10, killCount: 7 },
        consequence: 'She names them herself. You almost admire the calculus of it. The children are saved.'
      },
      {
        id: 'ch1-cp-all',
        text: '"All of them. But quickly — I\'ll make it painless."',
        nextScene: 'ch1-seal-broken-complete',
        morality: 'evil',
        statChanges: { darkness: 6, corruption: 18, killCount: 43 },
        consequence: 'Maren breaks. You take that from her too, in the end.'
      },
      {
        id: 'ch1-cp-betray-elder',
        text: 'Promise seven. Then take all of them — including Maren.',
        nextScene: 'ch1-seal-broken-complete',
        morality: 'evil',
        statChanges: { darkness: 8, corruption: 20, cunning: 1, betrayals: 1, killCount: 43 },
        consequence: 'Betrayal is the purest form of power. You told her. You told her not to trust strangers.'
      }
    ]
  },

  'ch1-slaughter-path': {
    id: 'ch1-slaughter-path',
    chapter: 1,
    title: 'Red Harvest',
    backgroundMood: 'village',
    narrative: [
      'Thornwatch burns.',
      'They fought, in the way that farmers fight — with pitchforks and prayer. Neither worked.',
      'The girl with the straw doll ran the furthest. You remember that.',
      'The First Seal pulses with dark energy as the last soul departs. It cracks. Then shatters.',
      'The Whispering Shade appears at your shoulder, and for the first time, it sounds... respectful.',
      '"No hesitation. No performance. Raw. The Crown will know its sovereign."',
      'You look at what you\'ve done. You feel nothing. That is the most alarming thing of all.',
    ],
    choices: [
      {
        id: 'ch1-sp-onward',
        text: 'Leave immediately. The second seal awaits.',
        nextScene: 'ch2-crossroads',
        morality: 'evil',
        statChanges: { darkness: 3 },
        consequence: 'You step over what remains and walk north. Behind you, crows gather.'
      },
      {
        id: 'ch1-sp-linger',
        text: 'Search the ruins. These people had secrets. Everyone does.',
        nextScene: 'ch1-thornwatch-secret',
        morality: 'dark',
        statChanges: { cunning: 2, gold: 35 },
        consequence: 'Under the Elder\'s floorboards: gold, correspondence, and something very interesting indeed.'
      }
    ]
  },

  'ch1-thornwatch-secret': {
    id: 'ch1-thornwatch-secret',
    chapter: 1,
    title: 'What the Elder Knew',
    backgroundMood: 'village',
    narrative: [
      'In a sealed chest beneath Maren\'s bed, wrapped in oilskin:',
      'Thirty years of correspondence with the Royal Inquisition. Maps. Names. Coordinates of "heretical" sites.',
      'Maren Coldbrook was an informant. She had sent dozens of people to their deaths over the years — heretics, dissidents, anyone who questioned the crown.',
      'She had blood on her hands long before you arrived.',
      '"Hm," you say to no one in particular. "Justice, then."',
      'The Shade says nothing. But you sense something that might be amusement.',
    ],
    choices: [
      {
        id: 'ch1-ts-use-info',
        text: 'Keep the documents. The Inquisition\'s network could be... useful.',
        nextScene: 'ch2-crossroads',
        morality: 'dark',
        statChanges: { cunning: 3 },
        consequence: 'Knowledge is the second-sharpest weapon.'
      }
    ]
  },

  'ch1-deception-path': {
    id: 'ch1-deception-path',
    chapter: 1,
    title: 'The Shepherd\'s Sermon',
    backgroundMood: 'village',
    narrative: [
      'They believe you completely. Priests are trusted here; no one has given them reason not to be.',
      'You perform a "purification ritual" that lasts three hours. The village gathers. They hold candles. They sing.',
      'You are close enough to smell the life on them — sweat, woodsmoke, bread, hope.',
      'The ritual drains exactly what you need. Seven of them will simply... not wake tomorrow. They will believe it was the Crimson Fever. It swept through last winter too.',
      'The girl with the doll offers you a gift as you prepare to leave — a small carved wooden crow.',
      '"For luck," she says. "Papa says crows carry prayers to the gods."',
    ],
    choices: [
      {
        id: 'ch1-dp-take-gift',
        text: 'Take the crow. Thank her.',
        nextScene: 'ch1-seal-broken',
        morality: 'grey',
        statChanges: { corruption: 8, killCount: 7 },
        consequence: 'The crow sits in your pocket. A small weight. A strange weight.',
        items: [{
          id: 'carved-crow',
          name: 'The Crow\'s Gift',
          description: 'A child\'s carved wooden crow. It should mean nothing.',
          type: 'artifact',
          rarity: 'common',
          lore: 'You told yourself you would throw it away. You haven\'t yet.'
        }]
      },
      {
        id: 'ch1-dp-refuse-gift',
        text: 'Refuse. Walk away without looking back.',
        nextScene: 'ch1-seal-broken',
        morality: 'dark',
        statChanges: { corruption: 10, darkness: 2, killCount: 7 },
        consequence: 'Better this way. Sentiment is a poison slower than any plague.'
      }
    ]
  },

  'ch1-alternative-seal': {
    id: 'ch1-alternative-seal',
    chapter: 1,
    title: 'The Inquisitor\'s Crypt',
    backgroundMood: 'dungeon',
    narrative: [
      'The Inquisitor Vael served the old kingdom for fifty years. His crypt is sealed with divine wards — and guarded by three undead knights, bound to protect his resting place for eternity.',
      'His soul, preserved in a reliquary, is worth a hundred village souls to the seal.',
      'The problem: one of the undead knights recognizes you. Or rather, recognizes what rides in your chest.',
      '"Darkwalker," it says, sword already drawn. Its voice sounds like gravel and old grief. "The Inquisitor\'s soul is not yours to take."',
      '"I know," you say. And then you explain — carefully, honestly — what you intend to do with it.',
      'A pause. "...And the village?"',
      '"Untouched."',
    ],
    choices: [
      {
        id: 'ch1-as-fight',
        text: 'Fight all three knights. Take the reliquary by force.',
        nextScene: 'ch1-crypt-battle',
        morality: 'dark',
        statChanges: { strength: 2, corruption: 5 },
        consequence: 'They are strong. So are you.'
      },
      {
        id: 'ch1-as-negotiate',
        text: 'Negotiate. Offer the knight something it wants — something only the dead could want.',
        nextScene: 'ch1-knight-bargain',
        morality: 'grey',
        statChanges: { cunning: 3, darkness: 1 },
        consequence: '"What could you offer the dead?" And then you tell it. Its visor tilts. It listens.'
      },
      {
        id: 'ch1-as-bribe',
        text: 'Scatter gold coins across the crypt floor. "Even the dead remember what wealth meant."',
        nextScene: 'ch1-seal-broken',
        morality: 'dark',
        goldCost: 30,
        statChanges: { cunning: 2, corruption: 4 },
        consequence: 'The knight watches the coins roll. "We... cannot use these," it says. But the ward-magic reads your offering as tribute. The wards shimmer and fade.'
      },
      {
        id: 'ch1-as-str-shatter',
        text: 'Drive your fist into the ward-stone itself. Raw strength against ancient magic.',
        nextScene: 'ch1-crypt-battle',
        morality: 'evil',
        requires: { strength: 20 },
        statChanges: { strength: 4, health: -15, darkness: 3 },
        consequence: 'The ward cracks. The knights stagger. You didn\'t negotiate — you made the crypt itself flinch.'
      }
    ]
  },

  'ch1-crypt-battle': {
    id: 'ch1-crypt-battle',
    chapter: 1,
    title: 'The Battle of Still Bones',
    backgroundMood: 'dungeon',
    narrative: [
      'Three undead knights. Each one was formidable in life. In death, they feel no fear, no pain, no hesitation.',
      'The battle is brutal. You use every advantage you have — terrain, shadow, whatever dark power stirs in your blood.',
      'When it is over, you are bleeding. Two knights lie in pieces. The third — the one that recognized you — kneels, missing an arm.',
      '"Well fought," it says. "The Inquisitor would have hated you." A pause. "Take his soul. Spare the village. That is... acceptable."',
      'It falls still. Finally still.',
    ],
    choices: [
      {
        id: 'ch1-cb-continue',
        text: 'Take the reliquary. The First Seal awaits.',
        nextScene: 'ch1-seal-broken',
        morality: 'grey',
        statChanges: { health: -20, killCount: 1 },
        consequence: 'The reliquary is cold in your hands. The soul inside screams briefly. Then goes quiet.'
      }
    ]
  },

  'ch1-knight-bargain': {
    id: 'ch1-knight-bargain',
    chapter: 1,
    title: 'The Price of Rest',
    backgroundMood: 'dungeon',
    narrative: [
      'The knight\'s name was Sir Aldric. In life, he protected a woman named Senna from a plague. She died anyway, three years later, of old age, in her bed, surrounded by grandchildren she named after him.',
      'He has been dead for two hundred years. He has never known this.',
      'You tell him.',
      'A long silence fills the crypt like water fills a drowned man\'s lungs.',
      '"She... lived?" His voice cracks on the last word — the first genuine emotion you\'ve heard from undead bone in your life.',
      '"She thrived. I read it in the Inquisitor\'s own records."',
      'The other two knights slowly lower their swords.',
    ],
    choices: [
      {
        id: 'ch1-kb-take-soul',
        text: 'Take the reliquary while they are distracted.',
        nextScene: 'ch1-seal-broken',
        morality: 'evil',
        statChanges: { cunning: 3, corruption: 5, betrayals: 1 },
        consequence: 'You used his grief. That was efficient. That was very you.'
      },
      {
        id: 'ch1-kb-honor-deal',
        text: '"Aldric. I will take the Inquisitor\'s soul. The village lives. This was honest."',
        nextScene: 'ch1-seal-broken-honored',
        morality: 'grey',
        statChanges: { cunning: 2, darkness: 1 },
        consequence: '"Then go," Aldric says. "And do not make a liar of yourself." The other knights step aside.',
        items: [{
          id: 'aldrics-badge',
          name: 'Aldric\'s Crested Badge',
          description: 'A tarnished knight\'s badge, freely given.',
          type: 'artifact',
          rarity: 'rare',
          lore: 'He pressed it into your hand. "In case you forget what honor costs," he said.'
        }]
      }
    ]
  },

  'ch1-seal-broken': {
    id: 'ch1-seal-broken',
    chapter: 1,
    title: 'First Blood, First Power',
    backgroundMood: 'ritual',
    narrative: [
      'The First Seal shatters with a sound like the end of prayer.',
      'Power floods into you — cold and absolute, like dark water filling a vessel.',
      'You are... more. More than you were an hour ago.',
      'The Whispering Shade drifts at your side. "The Second Seal lies in the capital. In the heart of the Kingdom of Vael — in the Royal Catacombs beneath the throne itself."',
      '"The king," you say.',
      '"The king," it confirms. "He sits on the Pale Throne. He has a daughter. An army. And he will die at your hand, or outlive you."',
    ],
    choices: [
      {
        id: 'ch1-sb-proceed',
        text: 'March on the capital.',
        nextScene: 'ch2-crossroads',
        morality: 'evil',
        statChanges: { corruption: 5, experience: 150 },
        consequence: 'The road to power is paved with what you\'ve already left behind.'
      }
    ]
  },

  'ch1-seal-broken-complete': {
    id: 'ch1-seal-broken-complete',
    chapter: 1,
    title: 'Nothing Left',
    backgroundMood: 'ritual',
    narrative: [
      'The First Seal does not just shatter — it detonates.',
      'An entire settlement\'s worth of souls, consumed at once.',
      'The power is extraordinary. The silence in the aftermath is more extraordinary still.',
      'Thornwatch is gone. The Shade surveys the empty streets with what might be reverence.',
      '"Few sovereigns have begun so... completely," it says.',
      '"The Second Seal. The capital." You are already walking.',
    ],
    choices: [
      {
        id: 'ch1-sbc-proceed',
        text: 'Walk north. The capital awaits.',
        nextScene: 'ch2-crossroads',
        morality: 'evil',
        statChanges: { darkness: 5, corruption: 10, experience: 200 },
        consequence: 'A raven crosses the sky above the ruins. Following you, perhaps. Or reporting.'
      }
    ]
  },

  'ch1-seal-broken-honored': {
    id: 'ch1-seal-broken-honored',
    chapter: 1,
    title: 'The Villain\'s Compact',
    backgroundMood: 'ritual',
    narrative: [
      'The First Seal breaks cleanly. One soul willingly sacrificed, a villain\'s bargain honored.',
      'The Shade watches you with something approaching curiosity.',
      '"You kept your word," it says. "To a knight. The dead are worth more to you than the living?"',
      '"Principles," you say, "are only meaningful when they cost something."',
      'The power fills you differently — not cold and flooding, but deliberate. Controlled.',
      '"Interesting," the Shade murmurs. "You may be more dangerous than the simple monsters."',
    ],
    choices: [
      {
        id: 'ch1-sbh-proceed',
        text: 'The capital. The Second Seal.',
        nextScene: 'ch2-crossroads',
        morality: 'grey',
        statChanges: { cunning: 2, corruption: 5, experience: 180 },
        consequence: 'You travel north. Behind you, Thornwatch smokes with cookfire, not ash.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 2: THE CAPITAL
  // ═══════════════════════════════════════════════════════

  'ch2-crossroads': {
    id: 'ch2-crossroads',
    chapter: 2,
    title: 'The Road to Vael',
    backgroundMood: 'forest',
    narrative: [
      'The capital city of Vael is three days\' travel north, nestled where two rivers meet and armies drown.',
      'On the road, you pass refugees from somewhere you haven\'t burned yet. Children, the elderly, the desperate.',
      'A wanted poster is nailed to a tree. Your description — inaccurate in all the interesting ways.',
      'Below it, a man sits at a makeshift camp. He looks up. He sees you. He doesn\'t run.',
      'That is unusual enough to be interesting.',
      '"I know what you are," says the man. He is lean, scarred, missing two fingers. "I\'ve been looking for something like you. I have a proposition."',
    ],
    choices: [
      {
        id: 'ch2-cr-listen',
        text: '"Then speak. Quickly."',
        nextScene: 'ch2-marcus-intro',
        morality: 'neutral',
        statChanges: { cunning: 1 },
        consequence: 'He exhales. He was holding his breath. "My name is Marcus. I was the king\'s spymaster. Past tense."'
      },
      {
        id: 'ch2-cr-threaten',
        text: '"You are either useful or you are an obstacle. Which is it?"',
        nextScene: 'ch2-marcus-intro',
        morality: 'dark',
        statChanges: { darkness: 1 },
        consequence: 'He doesn\'t flinch. "Useful. I promise. Though I appreciate the directness — we\'ll work well together."'
      },
      {
        id: 'ch2-cr-kill',
        text: 'Kill him before he can report your location.',
        nextScene: 'ch2-capital-approach',
        morality: 'evil',
        statChanges: { corruption: 5, killCount: 1 },
        consequence: 'Efficient. But you find his journal, and it is very, very interesting.'
      },
      {
        id: 'ch2-cr-ignore',
        text: 'Walk past without acknowledging him.',
        nextScene: 'ch2-capital-approach',
        morality: 'grey',
        consequence: '"Wait—" He follows. At a distance. He keeps following. He is either very brave or very stupid.'
      },
      {
        id: 'ch2-cr-cun-read',
        text: 'Study his scars, his posture, his missing fingers. You can read a man\'s entire history from his body.',
        nextScene: 'ch2-hidden-intel',
        morality: 'grey',
        requires: { cunning: 20 },
        statChanges: { cunning: 4 },
        consequence: 'His scars are precise — torture, not combat. Missing fingers: standard Inquisition punishment. He was interrogated and escaped. He is exactly what he claims.'
      },
      {
        id: 'ch2-cr-str-disarm',
        text: 'Close the distance in one step and pin him to the ground. Check for weapons, then talk.',
        nextScene: 'ch2-hidden-vault',
        morality: 'dark',
        requires: { strength: 20 },
        statChanges: { strength: 2, cunning: 1 },
        consequence: 'He carries three knives and a garrote. Professional. After you let him up, he\'s more forthcoming than he intended.'
      },
      {
        id: 'ch2-cr-shop',
        text: 'Examine the contraband spread around his camp. Some of these items are... interesting.',
        nextScene: 'black-market',
        morality: 'neutral',
        statChanges: { cunning: 1 },
        consequence: 'Among the supplies: dark artifacts, contraband weapons, and things that should not exist outside locked vaults.'
      }
    ]
  },

  'ch2-hidden-intel': {
    id: 'ch2-hidden-intel',
    chapter: 2,
    title: 'The Spymaster\'s Secret',
    backgroundMood: 'forest',
    narrative: [
      'Your reading reveals more than Marcus intended. The missing fingers, the precise scars — but also: a faded tattoo on his inner wrist. The mark of the King\'s Whispers.',
      'He wasn\'t just a soldier. He was royal intelligence. And the tattoo means he still has access to the palace\'s hidden passage network.',
      '"You see too much," Marcus says quietly. He doesn\'t deny it.',
      '"The palace has seven secret entrances. Three are trapped. Two are sealed. One is guarded by something that was once human. And one..." he pauses. "One leads directly to the throne room."',
      '"I\'ll show you. But you\'ll owe me something. Not gold. A promise: when you take the throne, the intelligence network survives."',
    ],
    choices: [
      {
        id: 'ch2-hi-agree',
        text: '"The network survives. You have my word." Make the deal.',
        nextScene: 'ch2-palace-infiltration',
        morality: 'grey',
        statChanges: { cunning: 4, experience: 200 },
        items: [{
          id: 'palace-map',
          name: 'Palace Passage Map',
          description: 'A detailed map of seven hidden entrances to the capital palace.',
          type: 'artifact',
          rarity: 'legendary',
          effect: { cunning: 3 },
          lore: 'Drawn from memory by a man who memorized it, then burned the original.'
        }],
        consequence: 'Marcus draws the map from memory. Seven passages. Seven chances. One throne.'
      },
      {
        id: 'ch2-hi-take',
        text: 'Extract the information by force. Promises are for the naive.',
        nextScene: 'ch2-capital-approach',
        morality: 'evil',
        statChanges: { strength: 2, cunning: 2, betrayals: 1, corruption: 5 },
        consequence: 'Marcus talks. Eventually, everyone talks. But the map he draws under duress is missing one passage. The safe one.'
      }
    ]
  },

  'ch2-hidden-vault': {
    id: 'ch2-hidden-vault',
    chapter: 2,
    title: 'The Buried Armory',
    backgroundMood: 'dungeon',
    narrative: [
      'When you pin Marcus, something clinks beneath his coat. Not just weapons — a key. Heavy, blackened iron, ancient.',
      'After you release him, he sees you noticed. His expression shifts from fear to calculation.',
      '"That key opens a vault beneath the crossroads," he says. "I found it two years ago. Never had the strength to force the door."',
      'The vault is real. Cut into living rock beneath the road, hidden by centuries of soil. The key turns with a sound like a bone breaking.',
      'Inside: a dead knight in ancient armor, still gripping a weapon that hums with contained violence. And gold. Quite a lot of gold.',
    ],
    choices: [
      {
        id: 'ch2-hv-take-all',
        text: 'Take the weapon, the armor, and the gold. The dead don\'t negotiate.',
        nextScene: 'ch2-capital-approach',
        morality: 'evil',
        statChanges: { strength: 4, gold: 60, darkness: 3, corruption: 3, experience: 200 },
        items: [{
          id: 'vault-greatsword',
          name: 'Vault Knight\'s Greatsword',
          description: 'A massive blade that vibrates with dormant fury. It wants to be swung.',
          type: 'weapon',
          rarity: 'legendary',
          effect: { strength: 5 },
          lore: 'The knight who wielded it killed forty men in a single battle. Then he walked into this vault and sat down.'
        }],
        consequence: 'The dead knight crumbles when you take its weapon. It was waiting for someone worthy. Or at least strong enough.'
      },
      {
        id: 'ch2-hv-share',
        text: 'Split the findings with Marcus. He found the vault; you opened it.',
        nextScene: 'ch2-marcus-intro',
        morality: 'grey',
        statChanges: { strength: 3, gold: 30, cunning: 2, experience: 150 },
        consequence: 'Marcus takes his share and looks at you differently. Not with trust — with respect. In this world, that may be more valuable.'
      }
    ]
  },

  'ch2-marcus-intro': {
    id: 'ch2-marcus-intro',
    chapter: 2,
    title: 'The Fallen Spymaster',
    backgroundMood: 'forest',
    narrative: [
      'Marcus Vane — former spymaster to King Aldren IV, currently wanted for treason.',
      '"The king discovered I was feeding information to the resistance. He had my family arrested. I barely escaped." His jaw tightens.',
      '"I know every secret passage in the palace. Every guard rotation. The location of the Second Seal — yes, I know about the Seals — and more importantly, I know the king\'s daughter."',
      '"Princess Sera," he continues. "She\'s seventeen. Brilliant. The king plans to sacrifice her to the Pale Court to extend his own life. She doesn\'t know yet."',
      '"I want two things: the king dead and Sera free. You want..." He studies you. "The Second Seal and presumably everything after. We can help each other."',
    ],
    choices: [
      {
        id: 'ch2-mi-ally',
        text: '"We have a deal, Vane. But understand: I won\'t sacrifice my mission for your sentiment."',
        nextScene: 'ch2-palace-infiltration',
        morality: 'dark',
        statChanges: { cunning: 3 },
        consequence: '"Understood," Marcus says. A pause. "That\'s somehow more reassuring than a promise would have been."'
      },
      {
        id: 'ch2-mi-use',
        text: '"Guide me in. Then we\'ll see how useful you remain."',
        nextScene: 'ch2-palace-infiltration',
        morality: 'evil',
        statChanges: { cunning: 2, corruption: 3 },
        consequence: 'He hears the subtext. He accepts it. Desperate men make excellent tools.'
      },
      {
        id: 'ch2-mi-refuse-sera',
        text: '"I care nothing for the girl. But your maps and knowledge have value. Deal."',
        nextScene: 'ch2-palace-infiltration',
        morality: 'evil',
        statChanges: { cunning: 2, darkness: 2 },
        consequence: '"...Alright," Marcus says quietly. He knows you mean it. He helps you anyway, because he has no other options.'
      }
    ]
  },

  'ch2-capital-approach': {
    id: 'ch2-capital-approach',
    chapter: 2,
    title: 'Gates of Vael',
    backgroundMood: 'village',
    narrative: [
      'The capital is magnificent and rotten in equal measure — marble columns, gilded banners, and beneath it all, the smell of fear that no perfume can mask.',
      'The king\'s guards are posted triple-thick. The Pale Court\'s insignia flies alongside the royal standard.',
      'You find Marcus Vane\'s journal in your possessions — either taken from his body or preserved somehow.',
      'His maps are accurate. His intelligence is excellent. He documented everything: guard rotations, secret passages, the king\'s weaknesses, and a single line underlined three times:',
      '"SERA MUST NOT BE IN THE PALACE ON MIDWINTER\'S EVE."',
      'Tomorrow is Midwinter\'s Eve.',
    ],
    choices: [
      {
        id: 'ch2-ca-proceed',
        text: 'Enter the city and find your own path to the palace.',
        nextScene: 'ch2-palace-infiltration',
        morality: 'neutral',
        statChanges: { cunning: 1 },
        consequence: 'You have the maps. You have the will. That is enough.'
      }
    ]
  },

  'ch2-palace-infiltration': {
    id: 'ch2-palace-infiltration',
    chapter: 2,
    title: 'The Pale Throne',
    backgroundMood: 'dungeon',
    narrative: [
      'The palace interior is cold. The Pale Court has been here longer than it should have been; frost grows in the corners of rooms that are well-heated.',
      'You find the Royal Catacombs entrance exactly where the maps said. Fifteen guards between you and the Second Seal.',
      'But you also find something unexpected: Princess Sera, alone in a chapel, praying furiously to gods who clearly aren\'t listening.',
      'She looks up when you enter. She is not afraid. That is unusual.',
      '"Are you here to kill me?" she asks. "Or save me? I need to know which, because I have prepared differently for each outcome."',
    ],
    choices: [
      {
        id: 'ch2-pi-ignore-sera',
        text: '"Neither. Move aside."',
        nextScene: 'ch2-catacomb-battle',
        morality: 'evil',
        statChanges: { darkness: 2 },
        consequence: 'She stands. "I know about the Seals. I know what you\'re doing." A pause. "I know where the shortcut is."'
      },
      {
        id: 'ch2-pi-save-sera',
        text: '"If you want to live through tonight, follow me and ask nothing until I say so."',
        nextScene: 'ch2-sera-ally',
        morality: 'grey',
        statChanges: { cunning: 2 },
        consequence: 'She stands immediately. "Done." She has been waiting for exactly this instruction from someone capable of giving it.'
      },
      {
        id: 'ch2-pi-use-sera',
        text: '"Tell me about the shortcut. Then whether you live is a question of how useful you remain."',
        nextScene: 'ch2-sera-tool',
        morality: 'evil',
        statChanges: { cunning: 3, darkness: 1, corruption: 5 },
        consequence: 'She reads you in an instant. "Honest, at least." She tells you about the shortcut. And something more.'
      }
    ]
  },

  'ch2-sera-ally': {
    id: 'ch2-sera-ally',
    chapter: 2,
    title: 'The Princess Who Knew Too Much',
    backgroundMood: 'dungeon',
    narrative: [
      'Sera leads you through servants\' passages, kitchens, and a laundry chute that puts you exactly where you need to be.',
      'She moves with practiced ease. She has clearly been planning escape routes for months.',
      '"My father intends to sacrifice me tonight," she says matter-of-factly while you navigate a pipe corridor. "The Pale Court promised him another thirty years if he gives them royal blood."',
      '"I know about the Obsidian Crown," she continues. "I know what it does. And I know that whoever wears it will either save or destroy this kingdom." A pause. "I\'m not naive enough to believe you\'ll save it."',
      '"But you\'re more likely to kill my father than he is to survive your arrival, so here we are."',
    ],
    choices: [
      {
        id: 'ch2-sa-respect',
        text: '"You are remarkably unsentimental for a princess."',
        nextScene: 'ch2-catacomb-descent',
        morality: 'grey',
        statChanges: { cunning: 2 },
        consequence: '"Seventeen years in that palace," she says. "Sentiment is a luxury I stopped affording." She smiles. It doesn\'t reach her eyes.'
      }
    ]
  },

  'ch2-sera-tool': {
    id: 'ch2-sera-tool',
    chapter: 2,
    title: 'The Princess\'s Gambit',
    backgroundMood: 'dungeon',
    narrative: [
      'The shortcut exists because Sera discovered it at age nine. She has been maintaining it ever since, waiting.',
      'She also tells you something the Shade didn\'t: the Second Seal is not just in the Catacombs.',
      '"It\'s in my father. He consumed it. Forty years ago, to secure his rule. You cannot break it without...", she pauses. "Without reaching into him and tearing it out."',
      '"His death, then," you say.',
      '"His specific death." She hands you a small vial. "A compound I developed. It dissolves the Seal\'s binding when mixed with royal blood. It will... not be pleasant."',
      'She has been planning to kill her father for some time, you realize. She just needed the right hands.',
    ],
    choices: [
      {
        id: 'ch2-st-take-vial',
        text: 'Take the vial. This changes the method, not the goal.',
        nextScene: 'ch2-catacomb-descent',
        morality: 'dark',
        statChanges: { cunning: 3, corruption: 5 },
        consequence: '"I want nothing from you afterward," she says. "Except to never see you again." A fair price.'
      }
    ]
  },

  'ch2-catacomb-battle': {
    id: 'ch2-catacomb-battle',
    chapter: 2,
    title: 'The King\'s Guard',
    backgroundMood: 'dungeon',
    narrative: [
      'Fifteen guards stand between you and the catacombs. The Captain of the Guard — a mountain of a man named Dorian — steps forward.',
      '"Halt. Identify yourself or die where you stand."',
      'You identify yourself, in a manner of speaking.',
      'The battle that follows is documented in palace records as "an inexplicable disaster." Witnesses will later disagree about what exactly they saw.',
      'What you remember: efficient. Brutal. And over quickly once you stopped holding back.',
    ],
    choices: [
      {
        id: 'ch2-cb-descend',
        text: 'Descend into the catacombs.',
        nextScene: 'ch2-catacomb-descent',
        morality: 'evil',
        statChanges: { health: -15, killCount: 15, strength: 2 },
        consequence: 'Dorian was the last standing. He managed one word before the end: "Monster." You took it as a compliment.'
      }
    ]
  },

  'ch2-catacomb-descent': {
    id: 'ch2-catacomb-descent',
    chapter: 2,
    title: 'Into the Pale Dark',
    backgroundMood: 'dungeon',
    narrative: [
      'The Royal Catacombs predate the kingdom by three centuries. Something has been living here.',
      'Not just the dead — the Pale Court. You see their marks on the walls, their rituals left half-finished, and something worse:',
      'People in iron cages. Prisoners. Some are breathing.',
      'The Shade presses you onward. "The seal. The king. Do not be distracted."',
      'The prisoners watch you pass. One reaches through the bars.',
      '"Please," she says. Just that word. Just: please.',
    ],
    choices: [
      {
        id: 'ch2-cd-free-prisoners',
        text: 'Free the prisoners. It slows you down. You do it anyway.',
        nextScene: 'ch2-king-confrontation',
        morality: 'grey',
        statChanges: { corruption: -5, cunning: 1 },
        consequence: 'The Shade says nothing. Perhaps that is significant. The prisoners scatter into the dark.'
      },
      {
        id: 'ch2-cd-ignore',
        text: 'Walk past. There is a seal to break and a king to kill.',
        nextScene: 'ch2-king-confrontation',
        morality: 'evil',
        statChanges: { corruption: 8, darkness: 2 },
        consequence: 'They watch you pass. You don\'t look back. The sound of their hands on the bars fades.'
      },
      {
        id: 'ch2-cd-use-prisoners',
        text: 'Open the cages — not to free them. To let them slow down the guards pursuing you.',
        nextScene: 'ch2-king-confrontation',
        morality: 'evil',
        statChanges: { cunning: 3, corruption: 10, betrayals: 1 },
        consequence: 'They think you\'re saving them. Some of them won\'t make it. You knew that. You used them anyway.'
      }
    ]
  },

  'ch2-king-confrontation': {
    id: 'ch2-king-confrontation',
    chapter: 2,
    title: 'The Pale Throne',
    backgroundMood: 'throne',
    narrative: [
      'King Aldren IV of Vael sits on a throne made of compressed bones, wearing the Pale Court\'s sigil like a collar he chose himself.',
      'He is older than his portraits suggest. The Pale Court\'s gifts have a cost that shows in the eyes.',
      'He looks at you with complete recognition.',
      '"I\'ve been expecting something like you," he says. His voice is steady. A man who has made terrible bargains does not frighten easily. "You\'re here for the Second Seal. And for my head, presumably."',
      '"The Pale Court told me you were coming. They offered to protect me." He smiles. "I declined. A king who requires monsters to fight his monsters deserves to be replaced by one."',
    ],
    choices: [
      {
        id: 'ch2-king-kill-direct',
        text: 'Kill him. Quickly. He has earned a clean death.',
        nextScene: 'ch2-seal-two-broken',
        morality: 'dark',
        statChanges: { darkness: 3, corruption: 8, killCount: 1 },
        consequence: 'He closes his eyes before you reach him. The Seal tears free of his soul with a sound like cloth ripping.'
      },
      {
        id: 'ch2-king-talk',
        text: '"You declined the Pale Court\'s protection. Why?"',
        nextScene: 'ch2-king-dialogue',
        morality: 'grey',
        statChanges: { cunning: 2 },
        consequence: '"Because," he says carefully, "I wanted to look into the eyes of whatever I\'ve created. Whatever my failures made inevitable."'
      },
      {
        id: 'ch2-king-torture',
        text: 'Take the Seal slowly. Make him feel every moment of it.',
        nextScene: 'ch2-seal-two-broken',
        morality: 'evil',
        statChanges: { darkness: 6, corruption: 15, killCount: 1 },
        consequence: 'He does not beg. That surprises you. He simply watches you with something that looks uncomfortably like understanding.'
      }
    ]
  },

  'ch2-king-dialogue': {
    id: 'ch2-king-dialogue',
    chapter: 2,
    title: 'The King\'s Confession',
    backgroundMood: 'throne',
    narrative: [
      '"I was not always this," Aldren says. "I had a wife. A daughter. A court I believed in."',
      '"The Pale Court came to me when my son was dying. Offered to save him. I paid. And paid. And eventually I became someone who could pay with a village\'s tears and not lose sleep."',
      '"Sera," he says. "My daughter. I was going to—" He stops. "I became the thing I feared most. And the worst part is that I don\'t remember the exact moment it happened."',
      '"You will," he says, looking directly at you. "Whatever you\'re becoming. You won\'t remember the moment either. But it will come."',
      'He reaches under his robe and produces a dagger. He holds it out to you, hilt first.',
    ],
    choices: [
      {
        id: 'ch2-kd-take-dagger',
        text: 'Take the dagger. End this.',
        nextScene: 'ch2-seal-two-broken',
        morality: 'grey',
        statChanges: { darkness: 2, corruption: 5, killCount: 1 },
        consequence: '"Make it quick," he says. You do. This, at least, you can give him.'
      },
      {
        id: 'ch2-kd-consider-words',
        text: '"You think your warning means anything to me?"',
        nextScene: 'ch2-seal-two-broken-defiant',
        morality: 'dark',
        statChanges: { darkness: 3, corruption: 8, killCount: 1 },
        consequence: '"No," he says. "But I had to say it." He closes his eyes. He is ready. "Tell Sera... it was never her fault."'
      }
    ]
  },

  'ch2-seal-two-broken': {
    id: 'ch2-seal-two-broken',
    chapter: 2,
    title: 'Crown Without a Kingdom',
    backgroundMood: 'ritual',
    narrative: [
      'The Second Seal detonates outward from the king\'s chest in a wave of darkness.',
      'The palace shudders. The Pale Court\'s marks on the walls burn away.',
      'You feel the power settle into you like a second heartbeat.',
      'The Shade appears at the throne room\'s edge, and its voice carries something new: deference.',
      '"Two seals. One remains. The Third Seal lies in the Abyss — the space between the living world and the void. To reach it, you must go through the Pale Court itself."',
      '"And the Crown?" you ask.',
      '"Waits. Beyond the Pale Court. Beyond the Abyss. It has waited a thousand years. It can wait a little longer."',
    ],
    choices: [
      {
        id: 'ch2-s2b-proceed',
        text: 'The Pale Court. The Abyss. The Crown. Forward.',
        nextScene: 'ch3-abyss-descent',
        morality: 'evil',
        statChanges: { corruption: 5, experience: 300 },
        consequence: 'The Shade leads the way. In the dead king\'s throne room, you feel a strange thing: anticipation.'
      },
      {
        id: 'ch2-s2b-stronghold',
        text: 'Search for any advantage before entering the Abyss. Someone must have tried this before.',
        nextScene: 'ch3-stronghold',
        morality: 'grey',
        statChanges: { cunning: 2, experience: 200 },
        consequence: 'The Shade tilts its head. "There was one. Long ago. They left traces. If you can find them."'
      }
    ]
  },

  'ch2-seal-two-broken-defiant': {
    id: 'ch2-seal-two-broken-defiant',
    chapter: 2,
    title: 'The Second Power',
    backgroundMood: 'ritual',
    narrative: [
      'The Second Seal tears free with volcanic force.',
      'When the light clears, you stand alone in the throne room.',
      'The dead king is gone — consumed utterly. Even the throne seems to have shrunken slightly.',
      'Two seals. You are changing. Not in any way you can point to, but you feel it: the world is smaller than it was. People more distant. Their lives more abstract.',
      'The Whispering Shade says quietly: "You will remember this feeling when the Crown sits on your head. It is useful data."',
      'You don\'t answer. You don\'t have a good answer.',
    ],
    choices: [
      {
        id: 'ch2-s2bd-proceed',
        text: 'The Third Seal awaits. March into the Pale Court\'s domain.',
        nextScene: 'ch3-abyss-descent',
        morality: 'evil',
        statChanges: { darkness: 3, experience: 280 },
        consequence: 'Forward. Always forward. This is the only direction you know anymore.'
      },
      {
        id: 'ch2-s2bd-stronghold',
        text: 'Seek out the ruins of those who came before. Knowledge is power.',
        nextScene: 'ch3-stronghold',
        morality: 'grey',
        statChanges: { cunning: 2, experience: 200 },
        consequence: 'The Shade knows the way. It always does.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 3: THE PALE COURT
  // ═══════════════════════════════════════════════════════

  'ch3-pale-court': {
    id: 'ch3-pale-court',
    chapter: 3,
    title: 'Between Life and Nothing',
    backgroundMood: 'abyss',
    narrative: [
      'The Pale Court does not exist in any place on any map. It exists in the spaces between heartbeats.',
      'To reach it, you had to do something that cost a piece of yourself — exactly which piece, you are not certain.',
      'The Court itself is a vast, grey architecture that shifts as you observe it. Pillars of compressed memory. Floors of solidified silence.',
      'And at the end of a corridor that is also a cliff that is also a question: the Pale Court in session.',
      'Three beings of impossible age, who have been consuming souls since before this kingdom was mud.',
      'They know you\'re here. They were expecting you.',
      '"The aspirant," the First says. Its voice sounds like every funeral you\'ve ever attended. "We have a proposition."',
    ],
    choices: [
      {
        id: 'ch3-pc-listen',
        text: '"I will hear your proposition. I will not accept it."',
        nextScene: 'ch3-pale-court-offer',
        morality: 'dark',
        statChanges: { cunning: 2 },
        consequence: 'The Second speaks: "We know. We make the offer anyway. It is..." it pauses. "...protocol."'
      },
      {
        id: 'ch3-pc-attack',
        text: 'Attack immediately. The element of surprise, such as it exists here.',
        nextScene: 'ch3-court-battle',
        morality: 'evil',
        statChanges: { strength: 2, corruption: 10, darkness: 3 },
        consequence: 'The Third seems genuinely pleased. "Oh, wonderful," it says. "We\'ve been bored for YEARS."'
      },
      {
        id: 'ch3-pc-negotiate',
        text: '"Name your terms. I\'ll counter. We\'ll arrive somewhere interesting."',
        nextScene: 'ch3-pale-court-offer',
        morality: 'grey',
        statChanges: { cunning: 3 },
        consequence: 'The First tilts what serves as its head. "A negotiator. How refreshing. They usually just scream."'
      },
      {
        id: 'ch3-pc-notorious',
        text: 'Hold your ground as they name your betrayals aloud.',
        nextScene: 'ch3-notorious-court',
        morality: 'dark',
        minBetrayals: 3,
        statChanges: { darkness: 2 },
        consequence: 'The First\'s voice changes. "Ah. The Betrayer. We know what you are."'
      }
    ]
  },

  'ch3-pale-court-offer': {
    id: 'ch3-pale-court-offer',
    chapter: 3,
    title: 'The Oldest Deal',
    backgroundMood: 'abyss',
    narrative: [
      'The Pale Court\'s offer is elegant in its simplicity:',
      'Give up the Third Seal. Give up the Obsidian Crown. In exchange: immortality, power, and a seat at the Court.',
      'You would become what they are — eternal, terrible, fed by the slow consumption of the world\'s grief.',
      '"The Crown is a cage," the First says. "It requires a sovereign. A sovereign has responsibilities. We have none."',
      '"We merely feed," the Second adds. "For eternity. You would never age. Never fear. Never—"',
      '"—feel anything," the Third finishes. Its voice is the softest. It sounds almost kind.',
    ],
    choices: [
      {
        id: 'ch3-pco-refuse',
        text: '"No. I will wear the Crown. And I will come for you after."',
        nextScene: 'ch3-court-battle',
        morality: 'evil',
        statChanges: { darkness: 5, corruption: 8 },
        consequence: 'The Third smiles. "There it is. The ambition we recognized from the beginning. Let us see if it\'s earned."'
      },
      {
        id: 'ch3-pco-false-accept',
        text: 'Pretend to accept. Buy time. Learn their weaknesses in the negotiation.',
        nextScene: 'ch3-court-betrayal',
        morality: 'evil',
        statChanges: { cunning: 4, darkness: 2, betrayals: 1 },
        consequence: 'You smile. You agree. You listen carefully to everything they say while appearing to acquiesce.'
      },
      {
        id: 'ch3-pco-use-shade',
        text: 'Ask the Whispering Shade — your guide — what it truly knows about the Court\'s weakness.',
        nextScene: 'ch3-shade-truth',
        morality: 'grey',
        statChanges: { cunning: 3 },
        consequence: 'The Shade hesitates. Just for a moment. "I... yes. There is something. But first you should know: I have not been honest about everything."'
      },
      {
        id: 'ch3-pco-bribe',
        text: 'Offer the Pale Court tribute — gold infused with the power of two broken seals.',
        nextScene: 'ch3-court-bribe-result',
        morality: 'dark',
        goldCost: 60,
        statChanges: { cunning: 3, corruption: 5 },
        consequence: 'The First examines the offering. "Seal-touched gold. How... novel. You think to buy ancient beings?" A pause. "It is working. How irritating."'
      },
      {
        id: 'ch3-pco-cun-exploit',
        text: 'You notice it: the Second and Third are not aligned with the First. Exploit the fracture.',
        nextScene: 'ch3-court-schism',
        morality: 'dark',
        requires: { cunning: 20 },
        statChanges: { cunning: 5, darkness: 2 },
        consequence: '"The Second hesitates when the First speaks," you say aloud. The Court goes very still. You\'ve touched something they never expected an outsider to see.'
      }
    ]
  },

  'ch3-shade-truth': {
    id: 'ch3-shade-truth',
    chapter: 3,
    title: 'What the Shadow Knew',
    backgroundMood: 'abyss',
    narrative: [
      'The Shade tells you, in the space between moments while the Pale Court watches:',
      '"I am the Obsidian Crown\'s last sovereign. I have been searching for a thousand years for someone capable of wearing it again. Someone who would use it as it was meant."',
      '"The Crown was made to CONTAIN the Pale Court. Not to rule. Not to conquer. To imprison. Three seals around three of their anchors."',
      '"If you wear the Crown with the three seals broken, you gain the power to lock the Pale Court away for another thousand years. But you will be bound to that purpose. You will be the prison\'s jailer."',
      '"I did not tell you this because... I was not certain you would agree. Jailer is not as appealing as Sovereign."',
      'The Pale Court has gone very, very still.',
    ],
    choices: [
      {
        id: 'ch3-st-jailer',
        text: '"A jailer. That is what I would become." Consider this seriously.',
        nextScene: 'ch3-final-choice',
        morality: 'grey',
        statChanges: { cunning: 2, darkness: -3, corruption: -5 },
        consequence: '"Yes," the Shade says. "Bound. Powerful. Eternal — but purposeful. Not free." A pause. "I am sorry I deceived you."'
      },
      {
        id: 'ch3-st-reject-purpose',
        text: '"I did not come this far to be anyone\'s jailer. The Crown\'s purpose is mine to define."',
        nextScene: 'ch3-court-battle',
        morality: 'evil',
        statChanges: { darkness: 5, corruption: 8 },
        consequence: 'The Shade says: "I thought as much. I hoped otherwise." It steps aside. The Court rises to meet you.'
      }
    ]
  },

  'ch3-court-betrayal': {
    id: 'ch3-court-betrayal',
    chapter: 3,
    title: 'The Betrayer\'s Gambit',
    backgroundMood: 'abyss',
    narrative: [
      'While performing the ritual of "joining" the Pale Court, you gather intelligence:',
      'Their anchor is the Third Seal itself — but it can be accessed through the Court\'s own ritual chamber.',
      'The First speaks the words of induction. You repeat them. Perfectly.',
      'Then, at the exact moment of binding — you reach for the Third Seal directly through the ritual\'s structure.',
      '"Oh," the Third says. Just: "Oh."',
      '"That was very clever," the Second admits.',
      '"You LIED to us," the First says. And then it gets complicated.',
    ],
    choices: [
      {
        id: 'ch3-cb-seize',
        text: 'Seize the Third Seal before they can react.',
        nextScene: 'ch3-seal-three',
        morality: 'evil',
        statChanges: { cunning: 5, darkness: 5, corruption: 10, betrayals: 1 },
        consequence: 'You did lie to them. And it worked. A betrayal so perfect it felt like art.'
      }
    ]
  },

  'ch3-court-battle': {
    id: 'ch3-court-battle',
    chapter: 3,
    title: 'Three Against One',
    backgroundMood: 'abyss',
    narrative: [
      'Fighting the Pale Court in their own domain is like trying to cut smoke.',
      'But you have two Seals\' worth of power and the Shade\'s guidance and something they underestimated:',
      'You have practiced at losing everything before.',
      'The battle spans minutes that feel like years. The First falls first — dissipated by the power of the broken seals turned weapon.',
      'The Second tries to flee into the grey. You pursue it into depths you\'ve never seen and come back changed in ways you\'ll take months to understand.',
      'The Third simply waits. When you return, exhausted, it says: "The Third Seal is yours. You\'ve earned it. Take it."',
      'It holds out something that looks like a black pearl.',
    ],
    choices: [
      {
        id: 'ch3-battle-take',
        text: 'Take the Third Seal.',
        nextScene: 'ch3-seal-three',
        morality: 'evil',
        statChanges: { health: -30, killCount: 2, strength: 4, darkness: 5 },
        consequence: '"Interesting," the Third says as it fades. "You fought like someone who had already decided to lose themselves. That is the most dangerous kind."'
      }
    ]
  },

  'ch3-seal-three': {
    id: 'ch3-seal-three',
    chapter: 3,
    title: 'The Last Seal',
    backgroundMood: 'ritual',
    narrative: [
      'Three seals. Three powers. They exist inside you now like a second skeleton.',
      'The Pale Court is broken. The Abyss begins to collapse without their anchor.',
      'The Shade materializes beside you, fully visible for the first time — a figure of pure black, with stars where eyes should be.',
      '"The Crown," it says. "It is ahead. Beyond the collapsing Abyss."',
      '"And if I don\'t go now, I\'ll be trapped here as it falls."',
      '"Yes."',
      'You run. The Abyss tears apart around you in slow motion. You see things falling into the void: memories, mostly. Old regrets. Ancient promises.',
      'One of them is yours. You watch it fall without being able to catch it.',
      'Then: a door. Light.',
    ],
    choices: [
      {
        id: 'ch3-s3-door',
        text: 'Step through the door.',
        nextScene: 'ch4-the-crown',
        morality: 'neutral',
        statChanges: { experience: 400 },
        consequence: 'You step through. The Abyss closes behind you like an eye shutting.'
      }
    ]
  },

  'ch3-final-choice': {
    id: 'ch3-final-choice',
    chapter: 3,
    title: 'What Power Is For',
    backgroundMood: 'abyss',
    narrative: [
      'The Shade waits for your answer. The Pale Court is poised between amusement and alarm.',
      '"A jailer," you say again. "Bound to purpose. Not free. But powerful."',
      'You think of the village you may have burned, or bargained with, or deceived.',
      'You think of the king who saw his own ending in you and recognized the pattern.',
      'You think of the knight who waited two hundred years to hear that she was safe.',
      '"Tell me about the first sovereign," you say to the Shade. "The one who built the Crown. Who were they?"',
      '"Someone," the Shade says quietly, "who also began this journey believing they were the villain of the story. Who learned, at the final door, that the story had always been about something else entirely."',
    ],
    choices: [
      {
        id: 'ch3-fc-become-jailer',
        text: '"Then show me the Third Seal. I\'ll be what the Crown needs."',
        nextScene: 'ch3-seal-three-jailer',
        morality: 'grey',
        statChanges: { corruption: -10, darkness: -5 },
        consequence: 'The Pale Court makes a sound that might be fear. The Shade makes a sound that might be relief.'
      },
      {
        id: 'ch3-fc-refuse-still',
        text: '"No. Power is only worth having if you can use it freely. I refuse the prison."',
        nextScene: 'ch3-court-battle',
        morality: 'evil',
        statChanges: { corruption: 5, darkness: 5 },
        consequence: '"Then we fight," the Shade says. Not judging. Just stating. "I will still guide you. It is what I do."'
      }
    ]
  },

  'ch3-seal-three-jailer': {
    id: 'ch3-seal-three-jailer',
    chapter: 3,
    title: 'The Willing Prison',
    backgroundMood: 'ritual',
    narrative: [
      'The Third Seal comes to you not by conquest, but by acceptance.',
      'The Pale Court flees — screaming — as you reach for it. They know what a willing jailer means.',
      'No chains needed. No battles. Just understanding what the Crown was built for.',
      'The Shade is beside you as the Abyss stabilizes — not collapsing now, but restructuring around the new anchor.',
      '"You," it says. "For a thousand years, I searched for someone who would choose this knowingly. I found them."',
      '"I haven\'t chosen yet," you say. "I\'ve only agreed to hear the Crown\'s case."',
      '"That," it says, "is enough."',
    ],
    choices: [
      {
        id: 'ch3-stj-crown',
        text: 'Walk toward the Crown.',
        nextScene: 'ch4-the-crown-redemption',
        morality: 'grey',
        statChanges: { experience: 500, corruption: -15 },
        consequence: 'The Abyss parts for you like water. The Crown is ahead, and it is waiting, and it has been waiting a very long time for someone who understood what it was asking.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 4: THE CROWN
  // ═══════════════════════════════════════════════════════

  'ch4-the-crown': {
    id: 'ch4-the-crown',
    chapter: 4,
    title: 'The Obsidian Crown',
    backgroundMood: 'ritual',
    narrative: [
      'The Obsidian Crown rests on an altar of black stone in a room that exists at the center of everything.',
      'It is exactly what it sounds like: a crown made of obsidian, carved with sigils that shift as you watch.',
      'It is also, you now understand, alive. In the way that ancient things accumulate something over centuries that isn\'t quite will but isn\'t quite instinct either.',
      'The Shade stands beside the altar.',
      '"Three seals. All broken. The Crown will accept you. Whatever you are now — it will accept you."',
      '"What will it make me?" you ask.',
      '"Whatever you choose to be," it says. "That is both the promise and the terror of it."',
    ],
    choices: [
      {
        id: 'ch4-tc-dark-sovereign',
        text: '"I will be Sovereign. This kingdom, this world — they all kneel."',
        nextScene: 'ending-dark-sovereign',
        morality: 'evil',
        statChanges: { darkness: 10, corruption: 20 },
        consequence: 'The Crown rises from the altar and settles on your head. The world tilts.'
      },
      {
        id: 'ch4-tc-destroy-crown',
        text: 'Destroy the Crown. Let no one have this power — not even you.',
        nextScene: 'ending-sacrifice',
        morality: 'grey',
        statChanges: { corruption: -30, darkness: -10 },
        consequence: 'The Shade is silent for a long moment. "That will kill you," it says. "The seals will tear free of you." A pause. "I know."'
      },
      {
        id: 'ch4-tc-remake-world',
        text: '"I will wear the Crown to tear down the old order. Then I\'ll put it down."',
        nextScene: 'ending-reformer',
        morality: 'dark',
        statChanges: { darkness: 5, corruption: 5 },
        consequence: '"That is what they all say," the Shade whispers. "And almost none of them can do it." Its stars-for-eyes study you. "But almost none is not none."'
      },
      {
        id: 'ch4-tc-noble-death',
        text: '"There is a third option. Wear the Crown. Then destroy it — and myself — permanently."',
        nextScene: 'ch4-sacrifice-path',
        morality: 'grey',
        statChanges: { corruption: -10 },
        consequence: 'The Shade freezes. "How do you know about that?" A long silence. "You shouldn\'t know about that."'
      },
      {
        id: 'ch4-tc-bribe-shade',
        text: 'Place your remaining gold at the altar. "Every crown has a price. Name the Shade\'s."',
        nextScene: 'ch4-sacrifice-path',
        morality: 'grey',
        goldCost: 50,
        statChanges: { cunning: 3 },
        consequence: 'The gold melts into the altar. The Shade stiffens. "You... you found a way to speak to the Crown directly. Through offering." It trembles. "It is showing you the fourth path."'
      },
      {
        id: 'ch4-tc-str-forge',
        text: 'Examine the ancient forge beside the altar. With enough strength, the Crown can be reshaped.',
        nextScene: 'ch4-str-forge',
        morality: 'evil',
        requires: { strength: 20 },
        statChanges: { strength: 3 },
        consequence: 'The forge responds to your presence. The Shade looks alarmed. "No one has — that forge has been cold for a millennium—"'
      },
      {
        id: 'ch4-tc-cun-decode',
        text: 'Study the Crown\'s sigils. There is a pattern here that no one else has read.',
        nextScene: 'ch4-cun-unravel',
        morality: 'grey',
        requires: { cunning: 20 },
        statChanges: { cunning: 3 },
        consequence: 'The sigils resolve under your gaze like letters written in a language you didn\'t know you spoke.'
      },
      {
        id: 'ch4-tc-notorious',
        text: 'The Crown recoils from your touch. Your betrayals precede you even here.',
        nextScene: 'ch4-notorious-crown',
        morality: 'dark',
        minBetrayals: 3,
        statChanges: { darkness: 3 },
        consequence: 'The sigils flicker — a warning. The Shade watches with tense, knowing eyes.'
      }
    ]
  },

  'ch4-the-crown-redemption': {
    id: 'ch4-the-crown-redemption',
    chapter: 4,
    title: 'The Jailer\'s Crown',
    backgroundMood: 'ritual',
    narrative: [
      'The Crown is more beautiful than you expected. More sad.',
      'The Shade says: "Every sovereign who wore this chose conquest. They were wrong. The Crown was not built for conquest."',
      '"It was built as a key. The three seals are not power nodes. They are locks. The Pale Court is not defeated when you kill them — they disperse and reform."',
      '"But bound — bound by someone who chooses this willingly — they cannot return for a thousand years."',
      '"And you?" you ask the Shade.',
      '"I am freed," it says. "When you take the Crown, my vigil ends. I can finally... rest."',
      'Something in its voice makes the word "rest" sound like an ending rather than a pause.',
    ],
    choices: [
      {
        id: 'ch4-tcr-wear',
        text: '"Then let it be. I will be the jailer."',
        nextScene: 'ending-true-jailer',
        morality: 'grey',
        statChanges: { corruption: -20, darkness: -10 },
        consequence: 'You lift the Crown from the altar. It is lighter than a thousand years should weigh.'
      },
      {
        id: 'ch4-tcr-hesitate',
        text: '"A thousand years. I need a moment to understand what I\'m agreeing to."',
        nextScene: 'ch4-the-weight',
        morality: 'neutral',
        consequence: '"Take it," the Shade says. "I have been waiting a millennium. A moment more is nothing."'
      }
    ]
  },

  'ch4-the-weight': {
    id: 'ch4-the-weight',
    chapter: 4,
    title: 'The Weight of Always',
    backgroundMood: 'ritual',
    narrative: [
      'A thousand years.',
      'The kingdom as it is now will be unrecognizable in a century, let alone ten.',
      'Everyone you have met — Marcus, Sera, even the girl with the crow doll — all of them gone within living memory.',
      'You will watch civilization change around you like weather. You will be its guardian and its prisoner.',
      '"Ask me something," you say to the Shade.',
      '"What?"',
      '"Ask me if I regret anything I\'ve done. Before I put the Crown on. Ask me while I can still answer honestly."',
      'The Shade is quiet. Then: "Do you?"',
    ],
    choices: [
      {
        id: 'ch4-weight-yes',
        text: '"Yes. More than I expected to."',
        nextScene: 'ending-true-jailer',
        morality: 'grey',
        statChanges: { corruption: -25, darkness: -15 },
        consequence: '"Good," the Shade says. "That is the correct answer." It says it like it has been waiting a very long time for someone to say it.'
      },
      {
        id: 'ch4-weight-no',
        text: '"No. Every choice brought me here. Here is right."',
        nextScene: 'ending-true-jailer',
        morality: 'dark',
        statChanges: { corruption: -10, darkness: -5 },
        consequence: '"Also," the Shade says quietly, "a correct answer. There are multiple right answers. That is what makes it a real question."'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ENDINGS
  // ═══════════════════════════════════════════════════════

  'ending-dark-sovereign': {
    id: 'ending-dark-sovereign',
    chapter: 4,
    title: 'The Dark Sovereign',
    backgroundMood: 'throne',
    isEnding: true,
    endingType: 'dark-triumph',
    narrative: [
      'THE OBSIDIAN CROWN SETTLES ON YOUR HEAD.',
      'And the world is yours.',
      'Not metaphorically. The land itself acknowledges you. The wind carries your name. The roots of mountains know your weight.',
      'The Pale Court, deprived of their anchor, is scattered — not destroyed, but diminished. They will not threaten this realm for a generation, at least.',
      'The kingdoms kneel. Some willingly. Some not. Both categories please you.',
      'The Shade — freed by the Crown\'s acceptance — dissolves into starlight and says, just before it vanishes: "I found the right sovereign. Even if not the one I hoped for."',
      'You are Sovereign. Eternal. Terrible. Alone in the way that peaks are alone — visible from everywhere, touched by no one.',
      'The world you rule is better-organized than before. Safer from external threats.',
      'Whether it is good — that is a question you have decided not to ask.',
    ],
    choices: [
      {
        id: 'ending-ds-play-again',
        text: 'A kingdom of absolute darkness. Begin another story.',
        nextScene: 'restart',
        morality: 'evil',
        consequence: ''
      }
    ]
  },

  'ending-true-evil': {
    id: 'ending-true-evil',
    chapter: 4,
    title: 'The Void Sovereign',
    backgroundMood: 'abyss',
    isEnding: true,
    endingType: 'true-evil',
    narrative: [
      'You wore the Crown. You claimed the power. And then you kept going.',
      'The Pale Court was only the beginning.',
      'With the Crown\'s power, you reached further — into the fundamental structure of the world, into the architecture of what makes things alive.',
      'The world did not end. Endings are too clean.',
      'Instead it became something else: a place shaped entirely by your will, populated by subjects who exist at your sufferance, who have learned to want what you permit them to want.',
      'It is peaceful, in the way that a stopped heart is peaceful.',
      'The Shade, wherever it went after dissolving, is either horrified or impressed. Perhaps both. Perhaps there is no meaningful difference, from its perspective.',
      'You sit on the Obsidian Throne. The world extends to the horizon in every direction.',
      'Everything works exactly as you designed.',
      'You are never surprised.',
      'You have not been surprised in eleven hundred years.',
    ],
    choices: [
      {
        id: 'ending-te-play-again',
        text: 'An empire of perfect, terrible order. Begin another story.',
        nextScene: 'restart',
        morality: 'evil',
        consequence: ''
      }
    ]
  },

  'ending-sacrifice': {
    id: 'ending-sacrifice',
    chapter: 4,
    title: 'The Necessary Ending',
    backgroundMood: 'ritual',
    isEnding: true,
    endingType: 'neutral',
    narrative: [
      'You destroy the Crown.',
      'It takes everything you have — the seals turn on you, the power you carried tears itself free in a cascade that should kill you and very nearly does.',
      'You lie on the black stone floor for a long time. Just breathing.',
      'The Shade, somehow, is still there. It looks at you with its stars-for-eyes.',
      '"You should be dead," it says.',
      '"I know."',
      '"Why aren\'t you?"',
      'You think about this. "Because I\'m not done yet."',
      'The Crown is gone. The Pale Court cannot return — their anchors are destroyed. The seals are broken and the power dissipated.',
      'You are mortal again. Ordinary.',
      'Well. Not ordinary. Not exactly.',
      'But human, in all the important ways.',
      'Somewhere, a girl with a carved wooden crow grows up without knowing how close she came to a different world.',
      'Somewhere, a knight named Aldric rests in the silence of old stone, finally knowing what he wanted to know.',
      'The world does not know to thank you. That is, you decide, entirely fine.',
    ],
    choices: [
      {
        id: 'ending-s-play-again',
        text: 'The hardest kind of victory. Begin another story.',
        nextScene: 'restart',
        morality: 'grey',
        consequence: ''
      }
    ]
  },

  'ending-reformer': {
    id: 'ending-reformer',
    chapter: 4,
    title: 'The Reformer\'s Crown',
    backgroundMood: 'throne',
    isEnding: true,
    endingType: 'neutral',
    narrative: [
      'The Crown sits on your head for three years, four months, and eleven days.',
      'In that time, you dismantle the Pale Court\'s influence on six kingdoms. You expose the Inquisition\'s network of informants. You free the prisoners in the Catacombs\' descendants — still alive, long story.',
      'You do not enjoy it. You enjoy pieces of it. The rest is work: tedious, consuming, occasionally dark in ways you don\'t examine too closely.',
      'On the last day, you find Sera — Princess of Vael, now governing what used to be her father\'s kingdom.',
      'She looks at you with her father\'s eyes and none of her father\'s rot.',
      '"You\'re putting it down," she says. It\'s not a question.',
      '"Told you I would."',
      '"Most people who say that are lying." A pause. "Most."',
      'You place the Crown on the altar where you found it. It dims.',
      'You feel ordinary immediately, like stepping out of armor you\'ve worn for years.',
      'Sera watches you. "What now?"',
      '"I don\'t know," you say. And mean it. And find, somewhat to your surprise, that this is not unwelcome.',
    ],
    choices: [
      {
        id: 'ending-r-play-again',
        text: 'The most complicated kind of justice. Begin another story.',
        nextScene: 'restart',
        morality: 'grey',
        consequence: ''
      }
    ]
  },

  'ending-true-jailer': {
    id: 'ending-true-jailer',
    chapter: 4,
    title: 'The Eternal Vigil',
    backgroundMood: 'ritual',
    isEnding: true,
    endingType: 'redemption',
    narrative: [
      'The Crown settles on your head.',
      'You feel the Pale Court — wherever they scattered — recoil.',
      'Then: nothing. Silence. The bindings take hold. The seals, now purposeful rather than consumed, lock into place.',
      'The Shade dissolves into starlight — joyful, you think, in the way that ancient things experience joy, which is quieter than human joy and deeper.',
      '"A thousand years," you said you understood.',
      'You did. You do.',
      'The world continues. Kingdoms rise and fall around you like breath. You watch. You guard. You intervene when the seals strain and the Pale Court\'s edges press against their prison.',
      'It is not exciting. It is not what you imagined when you found yourself in that cathedral with thirty-seven arranged bodies.',
      'It is, however, yours.',
      'Three centuries in, a young scholar finds records of Thornwatch — or wherever you\'ve been, depending on your choices — and writes a thesis about "the anomalous sovereign who protected a village and vanished."',
      'She gets it wrong in all the specific ways.',
      'She gets the important thing right: something chose a harder path when an easier one was available.',
      'That, you decide, is enough.',
    ],
    choices: [
      {
        id: 'ending-tj-play-again',
        text: 'The rarest ending. The willing jailer. Begin another story.',
        nextScene: 'restart',
        morality: 'grey',
        consequence: ''
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // BLACK MARKET SHOP
  // ═══════════════════════════════════════════════════════

  'black-market': {
    id: 'black-market',
    chapter: 2,
    title: 'The Black Market',
    backgroundMood: 'dungeon',
    narrative: [
      'A network of contraband laid out on oilskin cloth: weapons forged in places that don\'t appear on maps, artifacts stolen from royal vaults, and substances that would earn their maker a hanging.',
      'The merchant — if you can call them that — is a hooded figure with three visible scars and no visible eyes.',
      '"Browse," the figure says. "Touch nothing you cannot afford. Payment is gold or... other currencies."',
      'You have gold. The question is what it buys.',
    ],
    choices: [
      {
        id: 'bm-cursed-blade',
        text: 'Purchase the Cursed Blade — a weapon that drinks blood and strengthens its wielder.',
        nextScene: 'ch2-capital-approach',
        morality: 'evil',
        goldCost: 45,
        statChanges: { strength: 4, darkness: 3, corruption: 5 },
        items: [{
          id: 'cursed-blade',
          name: 'Cursed Blade',
          description: 'A sword that hums when it tastes blood. It is always hungry.',
          type: 'weapon',
          rarity: 'cursed',
          effect: { strength: 4 },
          lore: 'Forged in a pit where screaming never stops. The smith went blind after completing it.'
        }],
        consequence: 'The blade shivers when you grip it. It knows you. It approves.'
      },
      {
        id: 'bm-plague-vial',
        text: 'Purchase the Plague Vial — a concentrated toxin for those who prefer subtlety to swords.',
        nextScene: 'ch2-capital-approach',
        morality: 'evil',
        goldCost: 35,
        statChanges: { cunning: 4, darkness: 2, corruption: 3 },
        classBonus: ['plague-doctor', 'necromancer'],
        items: [{
          id: 'plague-vial',
          name: 'Plague Vial',
          description: 'A glass vial containing something that should not exist. Handle with intent.',
          type: 'consumable',
          rarity: 'legendary',
          effect: { cunning: 3 },
          lore: 'The Plague Doctor who brewed it survived. Her patients did not.'
        }],
        consequence: 'The vial is cold. Unnaturally cold. Whatever is inside, it is patient.'
      },
      {
        id: 'bm-shadow-cloak',
        text: 'Purchase the Shadow Cloak — woven from distilled darkness.',
        nextScene: 'ch2-capital-approach',
        morality: 'dark',
        goldCost: 50,
        statChanges: { cunning: 3, darkness: 4 },
        classBonus: ['shadowblade'],
        items: [{
          id: 'shadow-cloak',
          name: 'Shadow Cloak',
          description: 'A cloak that makes you part of every shadow you stand near.',
          type: 'armor',
          rarity: 'legendary',
          effect: { cunning: 3, darkness: 2 },
          lore: 'The previous owner was never found. Perhaps that was the point.'
        }],
        consequence: 'The cloak settles over your shoulders like a second skin. The shadows around you deepen.'
      },
      {
        id: 'bm-warlords-gauntlet',
        text: 'Purchase the Warlord\'s Gauntlet — the fist of a dead conqueror, preserved and enchanted.',
        nextScene: 'ch2-capital-approach',
        morality: 'dark',
        goldCost: 40,
        statChanges: { strength: 5, darkness: 2 },
        classBonus: ['warlord'],
        items: [{
          id: 'warlords-gauntlet',
          name: 'Warlord\'s Gauntlet',
          description: 'An iron gauntlet that remembers the grip of a conqueror who never lost.',
          type: 'armor',
          rarity: 'legendary',
          effect: { strength: 5 },
          lore: 'He died in his bed. That is the cruelest irony of all.'
        }],
        consequence: 'The gauntlet fits perfectly. You make a fist. The air cracks.'
      },
      {
        id: 'bm-nothing',
        text: 'Browse and leave. Gold is more useful kept.',
        nextScene: 'ch2-capital-approach',
        morality: 'neutral',
        consequence: 'The merchant watches you go. "Come back when you\'re desperate," they say. "Everyone does."'
      }
    ]
  },

  'black-market-ch3': {
    id: 'black-market-ch3',
    chapter: 3,
    title: 'The Black Market — Between Worlds',
    backgroundMood: 'abyss',
    narrative: [
      'Somehow, impossibly, the hooded merchant is here. In the space between life and nothing.',
      '"You again," they say. The scars are different. Or perhaps the face is different. Hard to tell without eyes.',
      '"I trade in places that exist. This place exists. Therefore I trade." Their logic is impeccable and deeply unsettling.',
      'The wares are the same — and different. The same oilskin cloth, the same contraband, but new additions pulled from the edges of reality.',
    ],
    choices: [
      {
        id: 'bm3-cursed-blade',
        text: 'Purchase the Cursed Blade — a weapon that drinks blood and strengthens its wielder.',
        nextScene: 'ch3-pale-court',
        morality: 'evil',
        goldCost: 45,
        statChanges: { strength: 4, darkness: 3, corruption: 5 },
        items: [{
          id: 'cursed-blade',
          name: 'Cursed Blade',
          description: 'A sword that hums when it tastes blood. It is always hungry.',
          type: 'weapon',
          rarity: 'cursed',
          effect: { strength: 4 },
          lore: 'Forged in a pit where screaming never stops. The smith went blind after completing it.'
        }],
        consequence: 'The blade shivers when you grip it. It knows you. It approves.'
      },
      {
        id: 'bm3-void-shard',
        text: 'Purchase a Shard of the Void — condensed nothingness that amplifies dark power.',
        nextScene: 'ch3-pale-court',
        morality: 'evil',
        goldCost: 55,
        statChanges: { darkness: 6, corruption: 8, strength: 2 },
        items: [{
          id: 'void-shard',
          name: 'Shard of the Void',
          description: 'A fragment of absolute nothing. It weighs less than memory.',
          type: 'artifact',
          rarity: 'cursed',
          effect: { darkness: 5 },
          lore: 'The Void does not sell pieces of itself. This was stolen.'
        }],
        consequence: 'The shard floats between your fingers. Where it touches you, sensation ceases. Where it leaves, sensation returns sharper.'
      },
      {
        id: 'bm3-seal-breaker',
        text: 'Purchase the Seal-Breaker Amulet — designed specifically to weaken the Pale Court\'s anchors.',
        nextScene: 'ch3-pale-court',
        morality: 'grey',
        goldCost: 65,
        statChanges: { cunning: 4 },
        items: [{
          id: 'seal-breaker-amulet',
          name: 'Seal-Breaker Amulet',
          description: 'An amulet that vibrates in the presence of seals and bindings.',
          type: 'artifact',
          rarity: 'legendary',
          effect: { cunning: 4 },
          lore: 'Made by someone who understood that locks exist to be opened.'
        }],
        consequence: 'The amulet pulses against your chest. It can feel the Third Seal. It is eager.'
      },
      {
        id: 'bm3-shadow-cloak',
        text: 'Purchase the Shadow Cloak — woven from distilled darkness.',
        nextScene: 'ch3-pale-court',
        morality: 'dark',
        goldCost: 50,
        statChanges: { cunning: 3, darkness: 4 },
        classBonus: ['shadowblade'],
        items: [{
          id: 'shadow-cloak',
          name: 'Shadow Cloak',
          description: 'A cloak that makes you part of every shadow you stand near.',
          type: 'armor',
          rarity: 'legendary',
          effect: { cunning: 3, darkness: 2 },
          lore: 'The previous owner was never found. Perhaps that was the point.'
        }],
        consequence: 'The cloak settles over your shoulders like a second skin. The shadows around you deepen.'
      },
      {
        id: 'bm3-nothing',
        text: 'Leave the merchant. You have what you need.',
        nextScene: 'ch3-pale-court',
        morality: 'neutral',
        consequence: '"Until the next impossible place," the merchant says. You suspect they mean it.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // COURT BRIBE & SCHISM (New Ch3 branches)
  // ═══════════════════════════════════════════════════════

  'ch3-court-bribe-result': {
    id: 'ch3-court-bribe-result',
    chapter: 3,
    title: 'The Price of Ancients',
    backgroundMood: 'abyss',
    narrative: [
      'The seal-touched gold dissolves into the Court\'s architecture, becoming part of their grey geometry.',
      'The First is displeased. The Second is intrigued. The Third is amused.',
      '"You have bought yourself... a concession," the Second says. "Not the Seal. But information. A path the First would not have offered."',
      '"The Third Seal can be accessed through their archive. A place even the First cannot enter without the other two\'s consent."',
      'The Second looks at the First. Something passes between them that predates language.',
      '"Go," the Second says to you. "Before the First reconsiders."',
    ],
    choices: [
      {
        id: 'ch3-cbr-archive',
        text: 'Enter the archive while you have passage.',
        nextScene: 'ch3-seal-three',
        morality: 'dark',
        statChanges: { cunning: 4, corruption: 5, experience: 200 },
        consequence: 'The archive is a library of consumed souls. The Third Seal rests at its center like a pearl in an oyster. You take it before anything changes its mind.'
      }
    ]
  },

  'ch3-court-schism': {
    id: 'ch3-court-schism',
    chapter: 3,
    title: 'The Fracture Within',
    backgroundMood: 'abyss',
    narrative: [
      'The Second turns to face the First. The Third watches with what might be anticipation.',
      '"You told the aspirant about the Third Seal\'s true nature," the Second says to the First. "You said we would decide together."',
      '"I made no such—"',
      '"You always do this," the Second continues. "For twelve thousand years. Always the one who decides. We are three. Not one."',
      'The Third shifts. "The aspirant is correct. We are not... unified."',
      'You watch the oldest alliance in existence crack like ice under pressure.',
      'The Third looks at you. "I will give you the Seal," it says, "if you do something the First has always refused: end me. I am tired."',
    ],
    choices: [
      {
        id: 'ch3-cs-end-third',
        text: '"Granted. You have earned your rest."',
        nextScene: 'ch3-seal-three',
        morality: 'grey',
        statChanges: { darkness: 3, killCount: 1, cunning: 3, experience: 250 },
        consequence: 'The Third dissolves with a sound like a sigh held for millennia. The Seal falls from where its heart would have been.'
      },
      {
        id: 'ch3-cs-exploit-all',
        text: 'Use the chaos. Take the Seal while all three are distracted by their fracture.',
        nextScene: 'ch3-seal-three',
        morality: 'evil',
        statChanges: { cunning: 5, corruption: 8, betrayals: 1, experience: 200 },
        consequence: 'Three beings who have existed since before time look at you with identical expressions of betrayal. You take the Seal and run.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // NPC SUSPICION SCENES (Ch3 & Ch4)
  // ═══════════════════════════════════════════════════════

  'ch3-notorious-court': {
    id: 'ch3-notorious-court',
    chapter: 3,
    title: 'A Reputation Precedes',
    backgroundMood: 'abyss',
    narrative: [
      'The Pale Court has heard of you. Not just your power — your methods.',
      '"The Betrayer walks our halls," the First announces. "Three oaths broken. Three trusts violated. We have been watching."',
      '"Your kind is... familiar to us," the Second says. "We have consumed many like you. The flavour of broken promises is distinctive."',
      'The Third says nothing. But it moves away from you, just slightly.',
      'You notice: the usual offers and negotiations are absent. They do not trust you enough to bargain.',
    ],
    choices: [
      {
        id: 'ch3-nc-acknowledge',
        text: '"My reputation is earned. Every betrayal served a purpose."',
        nextScene: 'ch3-court-battle',
        morality: 'evil',
        statChanges: { darkness: 3, corruption: 5 },
        consequence: '"Purpose," the First repeats. "Yes. That is what they all say. Let us see if your purpose survives combat."'
      },
      {
        id: 'ch3-nc-deny',
        text: '"Betrayal implies trust existed. I never offered trust."',
        nextScene: 'ch3-pale-court-offer',
        morality: 'dark',
        statChanges: { cunning: 2 },
        consequence: 'The Third laughs — a sound like glass breaking underwater. "Pedantic. I like it. Perhaps we can work with this one."'
      }
    ]
  },

  'ch4-notorious-crown': {
    id: 'ch4-notorious-crown',
    chapter: 4,
    title: 'The Crown Remembers',
    backgroundMood: 'ritual',
    narrative: [
      'The Crown sits on the altar, and you reach for it.',
      'It recoils.',
      'Not physically — but the sigils dim. The air grows colder. The Shade watches with narrowed star-eyes.',
      '"The Crown knows," the Shade says carefully. "It has felt your choices. The broken promises. The used allies."',
      '"It will still accept you. But the binding will be... different. Harder. It will resist you at every turn."',
      '"You will wear it like a punishment rather than a crown."',
      'Somewhere, the ghosts of everyone you\'ve betrayed are watching.',
    ],
    choices: [
      {
        id: 'ch4-nc-force',
        text: '"I have never needed to be liked. Only obeyed." Seize the Crown.',
        nextScene: 'ending-dark-sovereign',
        morality: 'evil',
        statChanges: { darkness: 8, corruption: 15 },
        consequence: 'The Crown screams as you place it on your head. It fights you. You hold it there until it stops.'
      },
      {
        id: 'ch4-nc-accept-cost',
        text: '"Then let it punish me. I will carry what I\'ve earned."',
        nextScene: 'ending-dark-sovereign',
        morality: 'dark',
        statChanges: { darkness: 5, corruption: 10 },
        consequence: 'The Crown settles slowly, reluctantly. It will never be comfortable. You don\'t expect it to be.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CH3 EXPANSION SCENES
  // ═══════════════════════════════════════════════════════

  'ch3-abyss-descent': {
    id: 'ch3-abyss-descent',
    chapter: 3,
    title: 'The Descent',
    backgroundMood: 'abyss',
    narrative: [
      'The path to the Pale Court leads through layers of the Abyss, each one stranger than the last.',
      'The first layer is memory — you walk through fragments of other people\'s lives, shattered and scattered like glass.',
      'The second layer is silence — absolute, total, the kind that makes you hear your own blood.',
      'The third layer is hunger. Not yours. The Abyss itself is hungry. It knows you carry three seals\' worth of power.',
      'Something moves in the dark. Something large.',
      '"Do not look at it," the Shade warns. "It feeds on attention."',
    ],
    choices: [
      {
        id: 'ch3-ad-fight',
        text: 'Look at it deliberately. Challenge whatever lurks here.',
        nextScene: 'ch3-abyss-guardian',
        morality: 'evil',
        statChanges: { strength: 3, darkness: 4, corruption: 5 },
        consequence: 'It is vast. It is old. It was waiting for someone stupid enough to look directly at it. You are not stupid. But you are strong.'
      },
      {
        id: 'ch3-ad-sneak',
        text: 'Navigate by sound and instinct. Keep your eyes on the path.',
        nextScene: 'ch3-pale-court',
        morality: 'grey',
        requires: { cunning: 20 },
        statChanges: { cunning: 4 },
        consequence: 'You map the Abyss by its sounds, its temperatures, its smells. The creature follows. It does not catch you.'
      },
      {
        id: 'ch3-ad-feed',
        text: 'Feed it — give it a soul from your collection. The ones from the seals.',
        nextScene: 'ch3-pale-court',
        morality: 'evil',
        statChanges: { darkness: 5, corruption: 10 },
        consequence: 'It accepts the offering. It stops following. The Shade looks at you differently after. You\'ve sacrificed a soul as casually as dropping a coin.'
      },
      {
        id: 'ch3-ad-shop',
        text: 'In the darkness, you notice a familiar hooded figure. The merchant. Here.',
        nextScene: 'black-market-ch3',
        morality: 'neutral',
        consequence: '"Impossible places," the merchant says from their impossible stall. "My specialty."'
      }
    ]
  },

  'ch3-abyss-guardian': {
    id: 'ch3-abyss-guardian',
    chapter: 3,
    title: 'The Thing Below',
    backgroundMood: 'abyss',
    narrative: [
      'It has no name. Names are a courtesy extended to things that exist in the light.',
      'It is made of compressed darkness and the memories of everyone who ever looked into the Abyss and flinched.',
      'It does not speak. It communicates by changing the temperature of your fear.',
      'The battle is unlike anything you\'ve experienced — fought in a dimension where physics is a suggestion and willpower is the only weapon.',
      'When it is over, you are changed. The thing dissolves into the dark from which it came.',
      'You have proven something to the Abyss. You are not prey.',
    ],
    choices: [
      {
        id: 'ch3-ag-continue',
        text: 'Press forward to the Pale Court. Whatever comes next cannot be worse.',
        nextScene: 'ch3-pale-court',
        morality: 'evil',
        statChanges: { strength: 4, health: -25, experience: 300 },
        consequence: '"It can," the Shade says quietly. "But you\'re ready for it."'
      }
    ]
  },

  'ch3-stronghold': {
    id: 'ch3-stronghold',
    chapter: 3,
    title: 'The Fortress of Will',
    backgroundMood: 'tower',
    narrative: [
      'Between the Abyss layers, you find something unexpected: a fortress built by a previous aspirant.',
      'They never made it to the Crown. But they left behind walls, wards, and a journal.',
      'The journal describes the Pale Court\'s weakness in clinical detail. The writer was meticulous. They were also slowly going mad.',
      'The last entry reads: "They cannot be killed. They can only be bound. The Crown was never a weapon — it was a cage. I wish I had known this before I broke the second seal."',
      'Below: a cache of supplies, weapons, and a map of the Pale Court\'s domain.',
    ],
    choices: [
      {
        id: 'ch3-sf-study',
        text: 'Study the journal thoroughly. Knowledge is the sharpest weapon.',
        nextScene: 'ch3-pale-court',
        morality: 'grey',
        statChanges: { cunning: 4, experience: 150 },
        consequence: 'Hours pass. You understand the Pale Court now — their structure, their rituals, their fear. The aspirant was right about everything except themselves.'
      },
      {
        id: 'ch3-sf-loot',
        text: 'Take the weapons and supplies. Theory is for scholars.',
        nextScene: 'ch3-pale-court',
        morality: 'dark',
        statChanges: { strength: 3, gold: 40 },
        consequence: 'The cache includes gold, a reinforced blade, and something that might be dried rations or might be dried regret. Hard to tell in this light.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CH4 EXPANSION SCENES
  // ═══════════════════════════════════════════════════════

  'ch4-sacrifice-path': {
    id: 'ch4-sacrifice-path',
    chapter: 4,
    title: 'The Noble End',
    backgroundMood: 'ritual',
    narrative: [
      'There is another way. The Shade mentioned it once, briefly, as if hoping you wouldn\'t hear.',
      'The Crown can be destroyed — but not by breaking it. By wearing it and willing it to consume you instead.',
      'A sovereign who chooses death over dominion. The Crown was never designed for this. It is a vulnerability in the system.',
      '"You would die," the Shade says. "Completely. No ghost. No shade. No echo. Gone."',
      '"And the Pale Court?"',
      '"Sealed forever. Without a sovereign to break the seals, the prison becomes permanent."',
      '"The cost is you."',
    ],
    choices: [
      {
        id: 'ch4-sp-accept',
        text: '"Then let it end. Not for the kingdom. Not for redemption. Because it\'s the right thing."',
        nextScene: 'ending-fallen-sovereign',
        morality: 'grey',
        statChanges: { corruption: -30, darkness: -10 },
        consequence: 'The Shade looks at you for a long time. "In a thousand years," it says, "you are the first to say that and mean it."'
      },
      {
        id: 'ch4-sp-refuse',
        text: '"No. I did not come this far to die as a footnote. I will find another way."',
        nextScene: 'ch4-the-crown',
        morality: 'dark',
        statChanges: { corruption: 5 },
        consequence: '"There is no other way," the Shade says. But it follows you anyway. It always does.'
      }
    ]
  },

  'ch4-str-forge': {
    id: 'ch4-str-forge',
    chapter: 4,
    title: 'The Crown\'s Forge',
    backgroundMood: 'ritual',
    narrative: [
      'Before the altar, you find the forge where the Crown was made. Ancient. Dormant.',
      'With enough raw strength, you could reforge the Crown\'s binding — reshape it from a prison into a weapon.',
      'The Shade watches nervously. "That was not what the Crown was designed—"',
      '"I don\'t care what it was designed for. I care what it can become."',
      'The forge responds to your will. The metal glows. The sigils shift.',
    ],
    choices: [
      {
        id: 'ch4-sf-reforge',
        text: 'Reforge the Crown with raw power. Make it answer to strength alone.',
        nextScene: 'ending-dark-sovereign',
        morality: 'evil',
        requires: { strength: 20 },
        statChanges: { strength: 5, darkness: 8, corruption: 10 },
        consequence: 'The Crown screams as you reshape it. The Shade screams too. When it\'s done, the Crown is different. Sharper. More yours.'
      },
      {
        id: 'ch4-sf-preserve',
        text: 'Leave the forge. The Crown is what it is. You will adapt.',
        nextScene: 'ch4-the-crown',
        morality: 'grey',
        consequence: '"Wise," the Shade says with evident relief. "The Crown has broken everyone who tried to change it."'
      }
    ]
  },

  'ch4-cun-unravel': {
    id: 'ch4-cun-unravel',
    chapter: 4,
    title: 'The Hidden Architecture',
    backgroundMood: 'ritual',
    narrative: [
      'You see what no previous aspirant saw: the Crown\'s sigils are not decorative. They\'re a language.',
      'Hours of study reveal a hidden instruction set — commands embedded by the original creator.',
      'The Crown has a fourth mode. Not sovereign. Not jailer. Not destroyer.',
      '"Architect," you read aloud. The sigils pulse.',
      '"What?" the Shade says, alarmed. "That wasn\'t — I never — there was no fourth mode."',
      '"There was. You just couldn\'t read the language."',
    ],
    choices: [
      {
        id: 'ch4-cu-architect',
        text: '"I will not rule or imprison. I will rebuild. Architect mode."',
        nextScene: 'ending-reformer',
        morality: 'grey',
        requires: { cunning: 20 },
        statChanges: { cunning: 5, corruption: -15, darkness: -5 },
        consequence: 'The Crown activates differently. Not binding. Not consuming. Building. The world shifts, not under dominion but under design.'
      },
      {
        id: 'ch4-cu-share',
        text: '"Tell the Shade. Maybe they knew and forgot."',
        nextScene: 'ch4-the-crown-redemption',
        morality: 'grey',
        statChanges: { cunning: 3, corruption: -10 },
        consequence: 'The Shade reads the sigils you\'ve decoded. It is silent for a very long time. "I... did not see this. In a thousand years." It sounds ashamed. And hopeful.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // DEATH ENDINGS
  // ═══════════════════════════════════════════════════════

  'ending-void-consumption': {
    id: 'ending-void-consumption',
    chapter: 4,
    title: 'Consumed by the Void',
    backgroundMood: 'abyss',
    isEnding: true,
    endingType: 'death',
    narrative: [
      'THE CORRUPTION HAS REACHED ITS LIMIT.',
      'You feel it first as a coldness — not the cold of winter, but the cold of absence. The cold of places where nothing has ever existed.',
      'The darkness you\'ve been carrying is not your servant. It never was. You were its vessel, and the vessel is full.',
      'The Shade watches as you begin to dissolve. Not die — dissolve. Your edges blur. Your thoughts scatter like startled birds.',
      '"I warned you," it says. But there is no satisfaction in its voice. Only an old, deep sadness.',
      'The seals tear free of you one by one. The power you gathered returns to the void from which it came.',
      'You try to scream. You cannot remember what screaming is.',
      'The last thing you perceive is the Obsidian Crown, still on its altar, still waiting.',
      'It will wait for another vessel. It has waited before.',
      'You have become nothing. Not even a shadow remains.',
    ],
    choices: [
      {
        id: 'ending-vc-play-again',
        text: 'The void takes everything. Begin another story.',
        nextScene: 'restart',
        morality: 'evil',
        consequence: ''
      }
    ]
  },

  'ending-fallen-sovereign': {
    id: 'ending-fallen-sovereign',
    chapter: 4,
    title: 'The Fallen Sovereign',
    backgroundMood: 'ritual',
    isEnding: true,
    endingType: 'death',
    narrative: [
      'YOU PUT ON THE CROWN AND WILL IT TO END.',
      'Not to rule. Not to bind. To consume itself, and you with it.',
      'The Crown fights. It was not made for this. But you are stronger than a thousand-year-old artifact, in the one way that matters: you are willing to lose.',
      'The seals activate in reverse. The Pale Court\'s prison locks permanently. The key — you — is destroyed in the locking.',
      'The Shade watches you burn from the inside out. Starlight tears stream from its dark face.',
      '"You could have ruled," it says. "You could have lived."',
      '"I could have," you agree. Your voice is already fading. "But this is the right thing."',
      'The Crown shatters. The Abyss seals. The Pale Court is imprisoned for eternity.',
      'And you — the sovereign who chose to fall — become a legend that no one will quite believe.',
      'Sera will name a library after you. Marcus will write your story, getting half of it wrong.',
      'The girl with the crow doll will tell her grandchildren about a stranger who came to Thornwatch.',
      'You will not know any of this. But you suspected it, at the end, and that was enough.',
    ],
    choices: [
      {
        id: 'ending-fs-play-again',
        text: 'A sovereign who fell so others could stand. Begin another story.',
        nextScene: 'restart',
        morality: 'grey',
        consequence: ''
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // RESTART
  // ═══════════════════════════════════════════════════════

  'restart': {
    id: 'restart',
    chapter: 0,
    title: 'Begin Again',
    backgroundMood: 'ritual',
    narrative: ['A new story awaits.'],
    choices: []
  }
};
