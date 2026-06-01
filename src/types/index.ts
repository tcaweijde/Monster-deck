export interface CardHalf {
  attack: number;
  effect?: string;
}

export interface MonsterCard {
  id: string;
  top: CardHalf;
  bottom: CardHalf;
}

export interface RevealedCard {
  cardId: string;
  chosenHalf: CardHalf;
  source: 'top' | 'bottom';
}

export type AbilityTrigger = 'passive' | 'discard';

export interface MonsterAbility {
  name: string;
  description: string;
  trigger: AbilityTrigger;
}

export type MonsterLevel = 1 | 2 | 3;

export interface Monster {
  id: string;
  name: string;
  deckSizes: Record<MonsterLevel, number>;
  baseAbility: MonsterAbility;
  secondaryAbility?: MonsterAbility;
  discardAbility?: MonsterAbility;
  cardPool: MonsterCard[];
}

export interface EncounterState {
  monster: Monster;
  level: MonsterLevel;
  deck: MonsterCard[];
  discardPile: MonsterCard[];
  currentCard: RevealedCard | null;
  isMonsterFirst: boolean;
  phase: 'setup' | 'playing' | 'victory';
}
