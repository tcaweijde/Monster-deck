import type { MonsterAbility, MonsterCard } from '../types/index';

// ─── Phase & Difficulty ──────────────────────────────────────────────────────

/** Lifecycle phases of a Legendary Hunt campaign. */
export type LegendaryPhase =
  | 'inactive'    // no active Legendary Hunt campaign
  | 'setup'       // player is on the setup screen
  | 'playing'     // active campaign, rounds in progress
  | 'bossPrep'    // final round complete; boss fight preparation screen
  | 'bossFight'   // boss fight encounter running
  | 'victory'     // player defeated the Legendary monster
  | 'defeat';     // player failed to defeat the monster within the round limit

/** Difficulty setting for a Legendary Hunt campaign. */
export type LegendaryDifficulty = 'easy' | 'normal' | 'hard';

// ─── Movement Deck ────────────────────────────────────────────────────────────

/** A single card in the Legendary Hunt movement deck. */
export interface MovementCard {
  /** Unique identifier for this movement card. */
  id: string;
  /** Display name of the first target location. Monster moves toward this location first. */
  targetLocation1Name: string;
  /** Display name of the second target location. Used if monster reaches targetLocation1. */
  targetLocation2Name: string;
  /** Number of steps the monster moves for solo play. */
  movementDistanceSolo: number;
  /** Number of steps the monster moves for 2-player game. */
  movementDistanceBy2?: number;
  /** Number of steps the monster moves for 3-player game. */
  movementDistanceBy3?: number;
  /** Number of steps the monster moves for 4-player game. */
  movementDistanceBy4?: number;
}

// ─── Trophy Protection ────────────────────────────────────────────────────────

/** A single row in the trophy-to-protection lookup table. */
export interface TrophyProtectionEntry {
  /** Minimum trophy count for this tier to apply (inclusive). */
  minTrophies: number;
  /** Maximum trophy count for this tier to apply (inclusive). null = open-ended (this tier matches any trophy count >= minTrophies) */
  maxTrophies: number | null;
  /** Damage negation applied to every player attack during the boss fight. */
  protectionValue: number;
}

/** The full trophy-to-protection table for one campaign side. */
export interface TrophyProtectionTable {
  /** Which campaign side this table belongs to. */
  side: 'A' | 'B';
  /** Ordered list of trophy protection tiers. */
  entries: TrophyProtectionEntry[];
}

// ─── Legendary Monster ────────────────────────────────────────────────────────

/**
 * A single card in a Legendary monster's fight deck.
 * Extends MonsterCard with Legendary-specific fields.
 */
export interface LegendaryMonsterCard extends MonsterCard {
  /** True for the 4 special attack cards unique to this monster. */
  isSpecial?: boolean;
  /** Fires when this card is discarded as player damage. Only present on special cards. */
  discardAbility?: MonsterAbility;
}

/** A Legendary-level monster with a full campaign fight deck. */
export interface LegendaryMonster {
  /** Unique identifier for this monster. */
  id: string;
  /** Display name of the monster. */
  name: string;
  /** Legendary monsters are always level 4. */
  readonly level: 4;
  /** Total number of cards in the unmodified fight deck. */
  baseFightDeckSize: number;
  /** Full fight deck (baseFightDeckSize cards; 4 must have isSpecial: true). */
  fightDeck: LegendaryMonsterCard[];
  /** Always-active ability that fires at the start of or during encounters. */
  passiveAbility: MonsterAbility;
  /** Fires when any card from this monster's fight deck is discarded by the player. */
  discardAbility?: MonsterAbility;
  /** Path to the monster portrait image, relative to public/. */
  image: string;
  /** Paths to card front images, relative to public/. Picked by card index modulo array length. */
  artAssets: string[];
  /** Location name where the monster begins the campaign (physical setup hint only). */
  startingLocationName: string;
}

// ─── Campaign State ────────────────────────────────────────────────────────────

/** Complete persisted state shape for an active (or inactive) Legendary Hunt campaign. */
export interface LegendaryCampaignState {
  /** Current lifecycle phase of the campaign. */
  phase: LegendaryPhase;
  /** Chosen difficulty for the campaign. */
  difficulty: LegendaryDifficulty;
  /** Determines which trophy-to-protection table is used. */
  campaignSide: 'A' | 'B';
  /** Total rounds allowed (7/8/9 for hard/normal/easy). */
  roundLimit: number;
  /** Current round, 1–roundLimit. */
  round: number;
  /** Current stage within the round, 1–4. */
  stage: 1 | 2 | 3 | 4;
  /** ID of the active Legendary monster for this campaign. */
  legendaryMonsterId: string;
  /** Running total of destruction tokens the player has claimed. Resets at boss fight start. */
  destructionTokenCount: number;
  /** IDs of movement cards already drawn in the current shuffle cycle. */
  movementDeckDrawn: string[];
  /** IDs of movement cards not yet drawn (ordered; index 0 = top of deck). */
  movementDeckRemaining: string[];
  /** Per-attack damage negation value for the boss fight. Set by confirmBossPrep. */
  protectionValue: number;
  /** Computed fight deck size after token reduction. Set by confirmBossPrep. null until prep. */
  bossFightDeckSize: number | null;
  /** Initiative ruling for boss fight. Set by confirmBossPrep. null until prep. */
  playerGoesFirst: boolean | null;
}
