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
    name: 'Frost Commander',
    description: 'TODO: fill from rulebook', // TODO: fill from rulebook
    trigger: 'passive',
  },
  specialCards: [
    {
      id: 'wh-eredin-special-1',
      top: { name: 'Frost Strike', attack: 3 },         // TODO: fill from rulebook
      bottom: { name: 'Ice Blast', attack: 2, effect: 'Freeze' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Eternal Winter',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-eredin-special-2',
      top: { name: 'Spectral Command', attack: 4 },     // TODO: fill from rulebook
      bottom: { name: 'Dark Portal', effect: 'Teleport' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Red Rider',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-eredin-special-3',
      top: { name: 'Wild Charge', attack: 3 },          // TODO: fill from rulebook
      bottom: { name: 'Frost Aura', attack: 1, effect: 'Chill' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Elven Curse',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-eredin-special-4',
      top: { name: 'Void Slash', attack: 5 },           // TODO: fill from rulebook
      bottom: { name: 'Spectral Step', effect: 'Evade' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Icy Grip',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
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
    name: 'Sea Fog',
    description: 'TODO: fill from rulebook', // TODO: fill from rulebook
    trigger: 'passive',
  },
  specialCards: [
    {
      id: 'wh-caranthir-special-1',
      top: { name: 'Helm Smash', attack: 3 },           // TODO: fill from rulebook
      bottom: { name: 'Sea Fog', effect: 'Blind' },      // TODO: fill from rulebook
      discardAbility: {
        name: 'Steer the Storm',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-caranthir-special-2',
      top: { name: 'Course Correction', attack: 2 },    // TODO: fill from rulebook
      bottom: { name: 'Rift Open', attack: 3, effect: 'Pull' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Spatial Rift',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-caranthir-special-3',
      top: { name: 'Spectral Wake', attack: 2 },        // TODO: fill from rulebook
      bottom: { name: 'Frozen Current', attack: 1, effect: 'Slow' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Dead Water',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-caranthir-special-4',
      top: { name: 'Icy Gale', attack: 4 },             // TODO: fill from rulebook
      bottom: { name: 'Navigator\'s Mark', effect: 'Mark' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Into the Void',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
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
    name: 'Crushing Presence',
    description: 'TODO: fill from rulebook', // TODO: fill from rulebook
    trigger: 'passive',
  },
  specialCards: [
    {
      id: 'wh-imlerith-special-1',
      top: { name: 'Shield Bash', attack: 4 },          // TODO: fill from rulebook
      bottom: { name: 'Brutal Strike', attack: 3 },     // TODO: fill from rulebook
      discardAbility: {
        name: 'Relentless',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-imlerith-special-2',
      top: { name: 'Mace Sweep', attack: 5 },           // TODO: fill from rulebook
      bottom: { name: 'Armour Crush', attack: 2, effect: 'Break' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Iron Will',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-imlerith-special-3',
      top: { name: 'Frost Mace', attack: 3, effect: 'Freeze' }, // TODO: fill from rulebook
      bottom: { name: 'Ground Slam', attack: 4 },       // TODO: fill from rulebook
      discardAbility: {
        name: 'Undying Rage',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
        trigger: 'discard',
      },
    },
    {
      id: 'wh-imlerith-special-4',
      top: { name: 'Charge', attack: 3 },               // TODO: fill from rulebook
      bottom: { name: 'Overwhelm', attack: 2, effect: 'Stagger' }, // TODO: fill from rulebook
      discardAbility: {
        name: 'Carnage',
        description: 'TODO: fill from rulebook',         // TODO: fill from rulebook
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
    name: 'Hunt Commander',
    description: 'TODO: fill from rulebook', // TODO: fill from rulebook
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
