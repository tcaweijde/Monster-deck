import type { Monster } from '../../types';
import type { WildHuntCharacter } from '../../types/wildHunt';
import { BOSS_GENERIC_DECK } from './bossGenericDeck';

/**
 * Build a synthetic `Monster` for a Wild Hunt boss encounter.
 *
 * Deck = 16 generic cards + 4 character special cards (20 total).
 * The boss level is always 3 (max) for solo play.
 */
export function buildBossMonster(character: WildHuntCharacter): Monster {
  const cardPool = [...BOSS_GENERIC_DECK, ...character.specialCards];
  return {
    id: `boss-${character.id}`,
    name: character.name,
    level: 3,
    deckSize: 20,
    baseAbility: character.passiveAbility,
    cardPool,
    ...(character.image ? { cardFrontImages: [character.image] } : {}),
  };
}
