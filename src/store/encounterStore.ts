import { create } from 'zustand';
import type { Monster, MonsterCard, RevealedCard, MonsterAbility, TrailCard } from '../types';
import { generateDeck, type TrailDeckOptions } from '../engine/deck';
import { flipCard, applyDamage } from '../engine/combat';
import { getMonsterById } from '../data/monsters';
import { isTrailSpecialCard, getTrailCardNumber } from '../engine/trail';

interface EncounterStore {
  monster: Monster | null;
  deck: MonsterCard[];
  discardPile: MonsterCard[];
  currentCard: RevealedCard | null;
  turn: 'monster' | 'player';
  phase: 'setup' | 'playing' | 'victory';
  lastDiscardTriggered: boolean;
  /** The most recently discarded card (from player damage). One-shot — cleared on next flip/pass or when consumed. */
  lastDiscardedCard: MonsterCard | null;
  /** Extra cards added due to Wild Hunt / hound proximity. >0 means frost theme applies. */
  proximityBonus: number;
  /** Cards from the monster's pool that were not dealt into the initial deck. Can be added mid-encounter. */
  undealtPool: MonsterCard[];

  // Trail fields (FEAT-020)
  /** The 4 Trail special cards for this encounter. null when trail mode is off or monster has none. */
  activeTrailCards: [TrailCard, TrailCard, TrailCard, TrailCard] | null;
  /** Set when the monster flips a trail special card. Cleared by clearTrailDrawAbility(). */
  pendingTrailDrawAbility: MonsterAbility | null;

  startEncounter: (
    monsterId: string,
    playerFirst?: boolean,
    bonusCards?: number,
    trailDeckOptions?: TrailDeckOptions,
    activeTrailCards?: [TrailCard, TrailCard, TrailCard, TrailCard] | null,
  ) => void;
  /** Start an encounter with a pre-built Monster object (used for boss fights). */
  startEncounterWithMonster: (monster: Monster, playerFirst?: boolean) => void;
  /**
   * Start an encounter with a pre-built deck (used for Legendary Hunt boss fights
   * where deck size has been reduced before the encounter starts).
   * Does NOT call generateDeck — uses the provided deck directly.
   */
  startEncounterWithDeck: (deck: MonsterCard[], monster: Monster, playerFirst?: boolean) => void;
  flipMonsterCard: () => void;
  discardOne: () => void;
  passTurn: () => void;
  applyPlayerDamage: (damage: number) => void;
  /** Clear lastDiscardedCard — call when a discard alert has been acted on. */
  clearLastDiscardedCard: () => void;
  /** Clear pendingTrailDrawAbility — call when the draw-trigger alert is dismissed. */
  clearTrailDrawAbility: () => void;
  /** Move a card from the active deck to the discard pile. */
  removeCardFromDeck: (cardId: string) => void;
  /** Move a card from the discard pile back into the deck (appended to end). */
  addCardFromDiscard: (cardId: string) => void;
  /** Move a card from the undealt pool into the deck (appended to end). */
  addCardFromPool: (cardId: string) => void;
  resetToSetup: () => void;
}

/** Returns true when a trail special card is found among discardedCards. */

export const useEncounterStore = create<EncounterStore>((set, get) => ({
  monster: null,
  deck: [],
  discardPile: [],
  currentCard: null,
  turn: 'monster',
  phase: 'setup',
  lastDiscardTriggered: false,
  lastDiscardedCard: null,
  proximityBonus: 0,
  undealtPool: [],
  activeTrailCards: null,
  pendingTrailDrawAbility: null,

  startEncounter: (
    monsterId,
    playerFirst = false,
    bonusCards = 0,
    trailDeckOptions,
    activeTrailCards = null,
  ) => {
    const monster = getMonsterById(monsterId);
    if (!monster) throw new Error(`Monster "${monsterId}" not found`);

    const deck = generateDeck(monster, undefined, [], bonusCards, trailDeckOptions);
    // Cards from the monster's pool that weren't dealt into the deck
    const undealtPool = monster.cardPool.filter((c) => !deck.some((d) => d.id === c.id));

    set({
      monster,
      deck,
      discardPile: [],
      currentCard: null,
      turn: playerFirst ? 'player' : 'monster',
      phase: 'playing',
      lastDiscardTriggered: false,
      lastDiscardedCard: null,
      proximityBonus: bonusCards,
      undealtPool,
      activeTrailCards,
      pendingTrailDrawAbility: null,
    });
  },

  startEncounterWithMonster: (monster, playerFirst = false) => {
    const deck = generateDeck(monster);
    const undealtPool = monster.cardPool.filter((c) => !deck.some((d) => d.id === c.id));
    set({
      monster,
      deck,
      discardPile: [],
      currentCard: null,
      turn: playerFirst ? 'player' : 'monster',
      phase: 'playing',
      lastDiscardTriggered: false,
      lastDiscardedCard: null,
      proximityBonus: 0,
      undealtPool,
      activeTrailCards: null,
      pendingTrailDrawAbility: null,
    });
  },

  flipMonsterCard: () => {
    const { deck, activeTrailCards } = get();
    const result = flipCard(deck);
    if (!result) return;

    let pendingTrailDrawAbility: MonsterAbility | null = null;
    if (activeTrailCards && isTrailSpecialCard(result.revealed.cardId)) {
      const num = getTrailCardNumber(result.revealed.cardId);
      const tc = num !== null ? activeTrailCards.find((c) => c.number === num) : undefined;
      if (tc) pendingTrailDrawAbility = tc.drawAbility;
    }

    set({
      currentCard: result.revealed,
      deck: result.remainingDeck,
      lastDiscardTriggered: false,
      phase: 'playing',
      pendingTrailDrawAbility,
    });
  },

  discardOne: () => {
    const { deck, discardPile, monster } = get();

    const result = applyDamage(deck, 1);
    const hasDiscardAbility = !!monster?.discardAbility;

    set({
      deck: result.remainingDeck,
      discardPile: [...discardPile, ...result.discardedCards],
      lastDiscardTriggered: hasDiscardAbility,
      lastDiscardedCard: result.discardedCards[0] ?? null,
      phase: result.remainingDeck.length === 0 ? 'victory' : 'playing',
    });
  },

  passTurn: () => {
    const { turn, currentCard, monster, discardPile, deck } = get();
    const fullPool = [...(monster?.cardPool ?? [])];
    const revealedMonsterCard =
      turn === 'monster' && currentCard
        ? fullPool.find((card) => card.id === currentCard.cardId)
        : undefined;

    const newDiscardPile = revealedMonsterCard ? [...discardPile, revealedMonsterCard] : discardPile;

    set({
      discardPile: newDiscardPile,
      currentCard: null,
      lastDiscardTriggered: false,
      lastDiscardedCard: null,
      pendingTrailDrawAbility: null,
      turn: turn === 'monster' ? 'player' : 'monster',
      phase: deck.length === 0 ? 'victory' : 'playing',
    });
  },

  applyPlayerDamage: (damage) => {
    const { deck, discardPile, monster } = get();
    if (damage < 0) return;

    if (damage === 0) {
      set({
        currentCard: null,
        lastDiscardTriggered: false,
        lastDiscardedCard: null,
        turn: 'monster',
      });
      return;
    }

    const result = applyDamage(deck, damage);
    const hasDiscardAbility = !!monster?.discardAbility;
    const newPhase = result.remainingDeck.length === 0 ? 'victory' : 'playing';

    set({
      deck: result.remainingDeck,
      discardPile: [...discardPile, ...result.discardedCards],
      currentCard: null,
      lastDiscardTriggered: hasDiscardAbility && result.discardedCards.length > 0,
      lastDiscardedCard: result.discardedCards[0] ?? null,
      turn: 'monster',
      phase: newPhase,
    });
  },

  clearLastDiscardedCard: () => {
    set({ lastDiscardedCard: null });
  },

  clearTrailDrawAbility: () => set({ pendingTrailDrawAbility: null }),

  removeCardFromDeck: (cardId) => {
    const { deck, discardPile } = get();
    const idx = deck.findIndex((c) => c.id === cardId);
    if (idx === -1) return;
    const card = deck[idx];
    const newDeck = deck.filter((_, i) => i !== idx);
    set({
      deck: newDeck,
      discardPile: [...discardPile, card],
      phase: newDeck.length === 0 ? 'victory' : 'playing',
    });
  },

  addCardFromDiscard: (cardId) => {
    const { deck, discardPile } = get();
    const card = discardPile.find((c) => c.id === cardId);
    if (!card) return;
    set({
      deck: [...deck, card],
      discardPile: discardPile.filter((c) => c.id !== cardId),
      phase: 'playing',
    });
  },

  addCardFromPool: (cardId) => {
    const { deck, undealtPool } = get();
    const card = undealtPool.find((c) => c.id === cardId);
    if (!card) return;
    set({
      deck: [...deck, card],
      undealtPool: undealtPool.filter((c) => c.id !== cardId),
    });
  },

  startEncounterWithDeck: (deck, monster, playerFirst = false) => {
    set({
      monster,
      deck: [...deck],
      discardPile: [],
      currentCard: null,
      turn: playerFirst ? 'player' : 'monster',
      phase: deck.length === 0 ? 'victory' : 'playing',
      lastDiscardTriggered: false,
      lastDiscardedCard: null,
      proximityBonus: 0,
    });
  },

  resetToSetup: () => {
    set({
      monster: null,
      deck: [],
      discardPile: [],
      currentCard: null,
      turn: 'monster',
      phase: 'setup',
      lastDiscardTriggered: false,
      lastDiscardedCard: null,
      proximityBonus: 0,
      undealtPool: [],
      activeTrailCards: null,
      pendingTrailDrawAbility: null,
    });
  },
}));
