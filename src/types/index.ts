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

export interface Monster {
  id: string;
  name: string;
  level: number;
  deckSize: number;
  baseAbility: MonsterAbility;
  secondaryAbility?: MonsterAbility;
  discardAbility?: MonsterAbility;
  cardPool: MonsterCard[];
}

export interface EncounterState {
  monster: Monster;
  deck: MonsterCard[];
  discardPile: MonsterCard[];
  currentCard: RevealedCard | null;
  turn: 'monster' | 'player';
  phase: 'setup' | 'playing' | 'victory';
}
