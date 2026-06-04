import { create } from 'zustand';
import type { Monster, MonsterCard, RevealedCard } from '../types';
import { generateDeck } from '../engine/deck';
import { flipCard, applyDamage } from '../engine/combat';
import { getMonsterById } from '../data/monsters';

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

  startEncounter: (monsterId: string, playerFirst?: boolean, bonusCards?: number) => void;
  /** Start an encounter with a pre-built Monster object (used for boss fights). */
  startEncounterWithMonster: (monster: Monster, playerFirst?: boolean) => void;
  flipMonsterCard: () => void;
  discardOne: () => void;
  passTurn: () => void;
  applyPlayerDamage: (damage: number) => void;
  /** Clear lastDiscardedCard — call when a discard alert has been acted on. */
  clearLastDiscardedCard: () => void;
  resetToSetup: () => void;
}

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

  startEncounter: (monsterId, playerFirst = false, bonusCards = 0) => {
    const monster = getMonsterById(monsterId);
    if (!monster) throw new Error(`Monster "${monsterId}" not found`);

    const deck = generateDeck(monster, undefined, [], bonusCards);

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
    });
  },

  startEncounterWithMonster: (monster, playerFirst = false) => {
    const deck = generateDeck(monster);
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
    });
  },

  flipMonsterCard: () => {
    const { deck } = get();
    const result = flipCard(deck);
    if (!result) return;

    set({
      currentCard: result.revealed,
      deck: result.remainingDeck,
      lastDiscardTriggered: false,
      phase: 'playing',
    });
  },

  discardOne: () => {
    const { deck, discardPile, monster } = get();
    if (deck.length === 0) return;

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
    });
  },
}));
