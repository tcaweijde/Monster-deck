export interface CardHalf {
  /** Display name of this half. "Charge" for top, "Bite" for bottom on generic cards. */
  name: string;
  attack?: number;
  effect?: string;
}

export interface MonsterCard {
  id: string;
  // FEAT-004: top and bottom will become optional to support single-half Monster Trail cards.
  top: CardHalf;
  bottom?: CardHalf;
}

export interface RevealedCard {
  cardId: string;
  chosenHalf: CardHalf;
  source: 'top' | 'bottom';
}

export type AbilityTrigger = 'passive' | 'discard' | 'reveal';

export interface MonsterAbility {
  name: string;
  description: string;
  trigger: AbilityTrigger;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  deckSize: number;
  baseAbility: MonsterAbility;
  secondaryAbility?: MonsterAbility;
  discardAbility?: MonsterAbility;
  cardPool: MonsterCard[];
  /** Images shown on the card front face. One is picked per card based on the card's position. */
  cardFrontImages?: string[];
}

export interface EncounterState {
  monster: Monster;
  deck: MonsterCard[];
  discardPile: MonsterCard[];
  currentCard: RevealedCard | null;
  turn: 'monster' | 'player';
  phase: 'setup' | 'playing' | 'victory';
}

export type LocationType = 'water' | 'mountain' | 'woods';

export interface Location {
  id: number; // 1–18
  name: string;
  type: LocationType;
  /** Path to location background image, relative to public/. Falls back to generic if absent. */
  image?: string;
}

export interface BoardSlot {
  locationType: LocationType; // permanent for this slot's lifetime
  locationId: number; // FK → Location.id; matches locationType
  monsterId: string; // FK → Monster.id; unique across all slots
  level: 1 | 2 | 3; // board-assigned level; escalates on defeat
  status: 'active' | 'encountering';
}

export interface BoardState {
  slots: [BoardSlot, BoardSlot, BoardSlot]; // always exactly 3
}

// Re-export Wild Hunt types so consumers can import from one place.
export type {
  WildHuntPhase,
  WildHuntDifficulty,
  WildHuntSpecialCard,
  WildHuntCharacter,
  HoundSlot,
  WildHuntBoardSlot,
  WildHuntState,
} from './wildHunt';

// Re-export Legendary Hunt types so consumers can import from one place.
export type {
  LegendaryPhase,
  LegendaryDifficulty,
  MovementCard,
  TrophyProtectionEntry,
  TrophyProtectionTable,
  LegendaryMonsterCard,
  LegendaryMonster,
  LegendaryCampaignState,
} from './legendary';
