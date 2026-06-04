import type { MonsterAbility, MonsterCard } from '../types/index';

// ─── Phase & Difficulty ──────────────────────────────────────────────────────

/** Lifecycle phases of a Wild Hunt run. */
export type WildHuntPhase =
  | 'inactive'      // no active Wild Hunt run
  | 'setup'         // player is on the setup / character-selection screen
  | 'playing'       // active run, rounds 1–8
  | 'finalBattle'   // boss fight triggered
  | 'victory'       // player won the boss fight
  | 'defeat';       // placeholder — defeat condition TBD from physical rulebook

/** Difficulty setting for a Wild Hunt run. */
export type WildHuntDifficulty = 'easy' | 'normal' | 'hard' | 'very-hard';

// ─── Special Cards ───────────────────────────────────────────────────────────

/**
 * A Wild Hunt character's special card.
 *
 * Extends `MonsterCard` because special cards share the same attack format
 * (top/bottom halves with optional attack values), but carry a per-card
 * discard-trigger ability — something the base `MonsterCard` type does not
 * model (discard abilities live on `Monster`, not on individual cards).
 */
export interface WildHuntSpecialCard extends MonsterCard {
  discardAbility: MonsterAbility;
}

// ─── Character ───────────────────────────────────────────────────────────────

/** A selectable Wild Hunt player character. */
export interface WildHuntCharacter {
  id: string;
  name: string;
  passiveAbility: MonsterAbility;
  /** Exactly 4 special cards, each carrying its own discard-trigger ability. */
  specialCards: WildHuntSpecialCard[];
  /** Path to the character portrait image (relative to public/). */
  image?: string;
}

// ─── Board Representation ────────────────────────────────────────────────────

/** A single Wild Hunt Hound token placed on the board. */
export interface HoundSlot {
  /** Unique identifier, e.g. `'hound-0'`. */
  id: string;
  level: 1 | 2 | 3;
  /** ID of the Wild Hunt location where this hound spawned. */
  locationId: number;
}

/**
 * One of the three fixed monster slots on the Wild Hunt board.
 * A slot is always present; it is `'empty'` until a monster spawns into it.
 */
export interface WildHuntBoardSlot {
  monsterId: string | null;
  level: (1 | 2 | 3) | null;
  locationType: import('./index').LocationType | null;
  locationId: number | null;
  status: 'empty' | 'active' | 'encountering';
}

// ─── Full Run State ──────────────────────────────────────────────────────────

/** Complete persisted state shape for an active (or inactive) Wild Hunt run. */
export interface WildHuntState {
  phase: WildHuntPhase;
  /** Current round number, 1–8. */
  round: number;
  /** Current stage within the run, 1–4. */
  stage: 1 | 2 | 3 | 4;
  /** ID of the chosen character, or `null` before selection. */
  characterId: string | null;
  difficulty: WildHuntDifficulty;
  shieldCount: number;
  /** Location ID (1–18) of the Wild Hunt unit, or `null` when not yet placed. */
  wildHuntLocationId: number | null;
  /** Location ID of the player's current board position, or `null` when not placed. */
  playerLocationId: number | null;
  houndSlots: HoundSlot[];
  /** Three fixed board slots. Slots are 'empty' until a monster spawns into them. */
  wildHuntSlots: [WildHuntBoardSlot, WildHuntBoardSlot, WildHuntBoardSlot];
  /** Index of the slot currently in an encounter, or `null` when idle. */
  activeWildHuntSlotIndex: 0 | 1 | 2 | null;
  /** Whether the player is viewing the monster board sub-screen. */
  showMonsters: boolean;
  /** Whether the proximity bonus setup screen is shown before an encounter. */
  showProximitySetup: boolean;
}
