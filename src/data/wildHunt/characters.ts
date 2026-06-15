import type { WildHuntCharacter } from '../../types/wildHunt';

// ---------------------------------------------------------------------------
// Wild Hunt character definitions
// All ability descriptions and card stats are stubs.
// Replace every line marked "// TODO: fill from rulebook" once the physical
// rulebook data is transcribed.
// ---------------------------------------------------------------------------

const eredin: WildHuntCharacter = {
  id: 'wh-eredin',
  name: 'Eredin',
  image: 'images/monsters/wild-hunt/eredin.jpg',
  passiveAbility: {
    name: 'Ghastly pursuit',
    description: 'Before creating the Life pool, all players who are not on Eredins location trash any 1 card from their deck, discard pile, or hand.',
    trigger: 'passive',
  },
  locationAbility: {
    name: 'Freeze',
    description: 'When Eredin enters the Location with any Player(s), each Player on that location lowers their Shield level by 1. If they cannot lower their Shield level, they trash any 1 card from their deck, discard pile of hand and raise their Shield level up to their Defense level ', // TODO: fill from rulebook
    trigger: 'passive',
  },
  specialCards: [
    {
      id: 'wh-eredin-special-1',
      top: { name: 'Magic Shock Wave', effect: 'All players discard 1 random card from their hand (empty hand: from the top of your discard pile', attack: 3 },         
      discardAbility: {
        name: 'Master Teleportation',
        description: 'Ignore any further damage in this player\'s Fight turn',      
        trigger: 'discard',
      },
    },
    {
      id: 'wh-eredin-special-2',
      top: { name: 'Magic Shock Wave', effect: 'All players discard 1 random card from their hand (empty hand: from the top of your discard pile', attack: 4 },         
      discardAbility: {
        name: 'Master Teleportation',
        description: 'Ignore any further damage in this player\'s Fight turn',      
        trigger: 'discard',
      },
    },
    {
      id: 'wh-eredin-special-3',
      top: { name: 'Exploding Energy', effect:'All Players lower their Shield level to 0', attack: 4 },         
      discardAbility: {
        name: 'Master Teleportation',
        description: 'Ignore any further damage in this player\'s Fight turn',      
        trigger: 'discard',
      },
    },
    {
      id: 'wh-eredin-special-4',
      top: { name: 'Exploding Energy', effect:'All Players lower their Shield level to 0', attack: 3 },          
      discardAbility: {
        name: 'Master Teleportation',
        description: 'Ignore any further damage in this player\'s Fight turn',      
        trigger: 'discard',
      },
    },
  ],
};

const caranthir: WildHuntCharacter = {
  id: 'wh-caranthir',
  name: 'Caranthir',
  image: 'images/monsters/wild-hunt/caranthir.jpg',
  passiveAbility: {
    name: 'Defensive Formation',
    description: 'Caranthir gains 1 shield per each Trophy card gained by the Players.',
    trigger: 'passive',
  },
  locationAbility: {
    name: 'Teleportation',
    description: 'When Caranthir enters the Location with any Player(s), each Player on that Locations draws 1 location token and discards all their potions. If they do not have any Potion, they lower any Attribute by 1. After, each players moves to the drawn location. They do not perform that location action',
    trigger: 'passive',
  },
  specialCards: [
    {
      id: 'wh-caranthir-special-1',
      top: { name: 'White Frost', attack: 4, effect:'All Players lower their Combat level by 1' },           
      discardAbility: {
        name: 'Teleportation',
        description: 'Before the next Player\'s Fight turn: all Players place 2 randomly chosen cards from their hands on the top of their decks',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-caranthir-special-2',
      top: { name: 'White Frost', attack: 6, effect:'All Players lower the level of any Attribute by 1' },           
      discardAbility: {
        name: 'Teleportation',
        description: 'Before the next Player\'s Fight turn: all Players place 2 randomly chosen cards from their hands on the top of their decks',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-caranthir-special-3',
      top: { name: 'White Frost', attack: 5, effect:'All Players lower their highest Attribute level by 1' },           
      discardAbility: {
        name: 'Teleportation',
        description: 'Before the next Player\'s Fight turn: all Players place 2 randomly chosen cards from their hands on the top of their decks',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-caranthir-special-4',
      top: { name: 'White Frost', attack: 3, effect:'All Players lower all Attributes levels by 1' },           
      discardAbility: {
        name: 'Teleportation',
        description: 'Before the next Player\'s Fight turn: all Players place 2 randomly chosen cards from their hands on the top of their decks',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
  ],
};

const imlerith: WildHuntCharacter = {
  id: 'wh-imlerith',
  name: 'Imlerith',
  image: 'images/monsters/wild-hunt/imlerith.jpg',
  passiveAbility: {
    name: 'Wild Hhunt Terror',
    description: 'Before creating the Life pool: each Players lowers the level of any Attribute by 1 per each Quest token on the Game Board and on Monster cards. The player may lower levels of one or more Attributes',
    trigger: 'passive',
  },
  locationAbility: {
    name: 'Mark of the Spectre',
  description: 'When Imlerith enters the Location with any Player(s), choose any 1 monster on the Game |Board and place 1 Quest-token (if available) on it\s card per each Player on Imlerith\'s location. Fighting this monster, after creating the Life Pool, the fighting player takes Damage equal to the numer of Quest-tokens on the Monster\'s card. When the monster is Defeated or Driven Away, discard the Quest token(s)',
    trigger: 'passive',
  },
  specialCards: [
    {
      id: 'wh-imlerith-special-1',
      top: { name: 'Freeze', attack: 4, effect:'During each Player\'s next Fight turn: they cannot raise their Shield level (Mages cannot gather protection, they can raise their enery level)' },          
      discardAbility: {
        name: 'Frost Armor',
        description: 'Before the next Player\'s Fight turn: Imlerith gains 1 shield per each player',
        trigger: 'discard',
      },
    },
    {
      id: 'wh-imlerith-special-2',
      top: { name: 'Freeze', attack: 6, effect:'During each Player\'s next Fight turn: they cannot raise their Shield level (Mages cannot gather protection, they can raise their enery level)' },          
      discardAbility: {
        name: 'Frost Armor',
        description: 'Before the next Player\'s Fight turn: Imlerith gains 1 shield per each player',
        trigger: 'discard',
      },
    },
    {
      id: 'wh-imlerith-special-3',
      top: { name: 'Freeze', attack: 3, effect:'During each Player\'s next Fight turn: they cannot raise their Shield level (Mages cannot gather protection, they can raise their enery level)' },          
      discardAbility: {
        name: 'Frost Armor',
        description: 'Before the next Player\'s Fight turn: Imlerith gains 1 shield per each player',
        trigger: 'discard',
      },
    },
    {
      id: 'wh-imlerith-special-4',
      top: { name: 'Freeze', attack: 5, effect:'During each Player\'s next Fight turn: they cannot raise their Shield level (Mages cannot gather protection, they can raise their enery level)' },          
      discardAbility: {
        name: 'Frost Armor',
        description: 'Before the next Player\'s Fight turn: Imlerith gains 1 shield per each player',
        trigger: 'discard',
      },
    },
  ],
};

const nithral: WildHuntCharacter = {
  id: 'wh-nithral',
  name: 'Nithral',
  image: 'images/monsters/wild-hunt/nithral.jpg',
  passiveAbility: {
    name: 'Summoning the Hounds',
    description: 'Place all Hounds from the Game Board next to Nithral\'s character card. If any Hound has Shields, add them to Nithral\'s shield count.',
    trigger: 'passive',
  },
  locationAbility: {
    name: 'Strenghening the Hound',
    description: 'When Nithral enters the Location with any Player(s), choose any 1 Hound on the Game Board and place 1 Wild Hunt Shield next to it, per each player on Nitral\'s location. The Hounds Life Pool is increased by the amount of Shields.',
    trigger: 'passive',
  },
  specialCards: [
    {
      id: 'wh-nithral-special-1',
      top: { name: 'Lance Charge', attack: 4 },         // TODO: fill from rulebook
      bottom: { name: 'Spectral Shield', effect: 'Block' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Vanguard',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-nithral-special-2',
      top: { name: 'Blade Flurry', attack: 3 },         // TODO: fill from rulebook
      bottom: { name: 'Frozen Lance', attack: 2, effect: 'Pierce' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Spectral Charge',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-nithral-special-3',
      top: { name: 'Parry', attack: 1, effect: 'Deflect' }, // TODO: fill from rulebook
      bottom: { name: 'Counter Thrust', attack: 3 },    // TODO: fill from rulebook
      discardAbility: {
        name: 'Knight\'s Oath',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-nithral-special-4',
      top: { name: 'Frost Bolt', attack: 2, effect: 'Chill' }, // TODO: fill from rulebook
      bottom: { name: 'Spectral Slash', attack: 4 },    // TODO: fill from rulebook
      discardAbility: {
        name: 'Phantom Ride',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Public exports
// ---------------------------------------------------------------------------

export const WILD_HUNT_CHARACTERS: WildHuntCharacter[] = [
  eredin,
  caranthir,
  imlerith,
  nithral,
];

export function getWildHuntCharacterById(id: string): WildHuntCharacter | undefined {
  return WILD_HUNT_CHARACTERS.find((c) => c.id === id);
}
