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

  startEncounter: (monsterId: string, playerFirst?: boolean) => void;
  flipMonsterCard: () => void;
  discardOne: () => void;
  passTurn: () => void;
  applyPlayerDamage: (damage: number) => void;
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

  startEncounter: (monsterId, playerFirst = false) => {
    const monster = getMonsterById(monsterId);
    if (!monster) throw new Error(`Monster "${monsterId}" not found`);

    const deck = generateDeck(monster, undefined);

    set({
      monster,
      deck,
      discardPile: [],
      currentCard: null,
      turn: playerFirst ? 'player' : 'monster',
      phase: 'playing',
      lastDiscardTriggered: false,
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
      turn: 'monster',
      phase: newPhase,
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
    });
  },
}));
