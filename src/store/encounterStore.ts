import { create } from 'zustand';
import type { Monster, MonsterCard, MonsterLevel, RevealedCard } from '../types';
import { generateDeck } from '../engine/deck';
import { checkInitiative } from '../engine/initiative';
import { flipCard, applyDamage } from '../engine/combat';
import { getMonsterById } from '../data/monsters';

interface EncounterStore {
  monster: Monster | null;
  level: MonsterLevel | null;
  deck: MonsterCard[];
  discardPile: MonsterCard[];
  currentCard: RevealedCard | null;
  isMonsterFirst: boolean;
  phase: 'setup' | 'playing' | 'victory';
  lastDiscardTriggered: boolean;

  startEncounter: (monsterId: string, level: MonsterLevel) => void;
  flipMonsterCard: () => void;
  applyPlayerDamage: (damage: number) => void;
  rollInitiative: () => void;
  nextRound: () => void;
  resetToSetup: () => void;
}

export const useEncounterStore = create<EncounterStore>((set, get) => ({
  monster: null,
  level: null,
  deck: [],
  discardPile: [],
  currentCard: null,
  isMonsterFirst: false,
  phase: 'setup',
  lastDiscardTriggered: false,

  startEncounter: (monsterId, level) => {
    const monster = getMonsterById(monsterId);
    if (!monster) throw new Error(`Monster "${monsterId}" not found`);

    const deck = generateDeck(monster, level);
    const isMonsterFirst = checkInitiative();

    set({
      monster,
      level,
      deck,
      discardPile: [],
      currentCard: null,
      isMonsterFirst,
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
    });
  },

  applyPlayerDamage: (damage) => {
    const { deck, discardPile, monster } = get();
    if (damage <= 0) return;

    const result = applyDamage(deck, damage);
    const hasDiscardAbility = !!monster?.discardAbility;
    const newPhase = result.remainingDeck.length === 0 ? 'victory' : get().phase;

    set({
      deck: result.remainingDeck,
      discardPile: [...discardPile, ...result.discardedCards],
      currentCard: null,
      lastDiscardTriggered: hasDiscardAbility && result.discardedCards.length > 0,
      phase: newPhase as 'playing' | 'victory',
    });
  },

  rollInitiative: () => {
    set({ isMonsterFirst: checkInitiative() });
  },

  nextRound: () => {
    set({
      currentCard: null,
      isMonsterFirst: checkInitiative(),
      lastDiscardTriggered: false,
    });
  },

  resetToSetup: () => {
    set({
      monster: null,
      level: null,
      deck: [],
      discardPile: [],
      currentCard: null,
      isMonsterFirst: false,
      phase: 'setup',
      lastDiscardTriggered: false,
    });
  },
}));
