import type { MonsterCard, TrailCard, TerrainType, WeaknessToken, PlacedWeaknessToken } from '../types';
import { LOCATIONS } from '../data/locations';

// ─── Trail card ID convention ─────────────────────────────────────────────────

export const TRAIL_CARD_ID_PREFIX = 'trail-special-';

export function isTrailSpecialCard(cardId: string): boolean {
  return cardId.startsWith(TRAIL_CARD_ID_PREFIX);
}

/** Returns 1–4, or null if the cardId does not follow the trail special card convention. */
export function getTrailCardNumber(cardId: string): 1 | 2 | 3 | 4 | null {
  if (!isTrailSpecialCard(cardId)) return null;
  const n = parseInt(cardId.slice(TRAIL_CARD_ID_PREFIX.length), 10);
  return n >= 1 && n <= 4 ? (n as 1 | 2 | 3 | 4) : null;
}

/** Converts a TrailCard to a MonsterCard for inclusion in the encounter deck. */
export function trailCardToMonsterCard(tc: TrailCard): MonsterCard {
  return {
    id: `${TRAIL_CARD_ID_PREFIX}${tc.number}`,
    top: {
      name: `Special Card ${tc.number}`,
      effect: tc.drawAbility.description,
    },
    // bottom is absent — single-half trail card
  };
}

/**
 * Generates 4 default TrailCards for a monster that has no authored trail data yet.
 * Draw ability prompts the player to use the numbered special attack.
 */
export function makeDefaultTrailCards(): [TrailCard, TrailCard, TrailCard, TrailCard] {
  return [1, 2, 3, 4].map((n) => ({
    number: n as 1 | 2 | 3 | 4,
    drawAbility: {
      name: `Special Attack #${n}`,
      description: `Use special attack #${n}`,
      trigger: 'passive' as const,
    },
  })) as [TrailCard, TrailCard, TrailCard, TrailCard];
}

// ─── Weakness token draw ──────────────────────────────────────────────────────

/** All terrain types used in the Trail expansion. One token per type on the board. */
export const ALL_TERRAIN_TYPES: TerrainType[] = ['water', 'mountain', 'woods'];

/**
 * Draws one random token of the given terrain type from the pool.
 * Returns `token: null` if the pool has no token for that terrain type.
 */
export function drawTokenForTerrain(
  pool: WeaknessToken[],
  terrainType: TerrainType,
  rng: () => number = Math.random,
): { token: WeaknessToken | null; remainingPool: WeaknessToken[] } {
  const candidates = pool.filter((t) => t.terrainType === terrainType);
  if (candidates.length === 0) return { token: null, remainingPool: pool };
  const idx = Math.floor(rng() * candidates.length);
  const token = candidates[idx];
  return { token, remainingPool: pool.filter((t) => t.id !== token.id) };
}

/**
 * Picks a random `Location` id whose type matches `terrainType`.
 * Pass `excludeLocationId` to avoid reselecting the same location (e.g. on redraw).
 * Falls back to the full set if all candidates are excluded.
 */
export function drawLocationForTerrain(
  terrainType: TerrainType,
  excludeLocationId: number | null = null,
  rng: () => number = Math.random,
): number {
  const byTerrain = LOCATIONS.filter((l) => l.type === terrainType);
  const candidates = excludeLocationId !== null
    ? byTerrain.filter((l) => l.id !== excludeLocationId)
    : byTerrain;
  // Fallback: if only one location of this type exists, reuse it.
  const pool = candidates.length > 0 ? candidates : byTerrain;
  return pool[Math.floor(rng() * pool.length)].id;
}

/**
 * Draws one token from the pool for the given terrain type AND assigns it a random
 * matching location. Returns a ready-to-place `PlacedWeaknessToken`.
 */
export function drawPlacedToken(
  pool: WeaknessToken[],
  terrainType: TerrainType,
  rng: () => number = Math.random,
): { token: PlacedWeaknessToken | null; remainingPool: WeaknessToken[] } {
  const { token, remainingPool } = drawTokenForTerrain(pool, terrainType, rng);
  if (!token) return { token: null, remainingPool };
  const locationId = drawLocationForTerrain(terrainType, null, rng);
  return { token: { ...token, locationId }, remainingPool };
}

/**
 * Returns a copy of `token` with a freshly drawn location of the same terrain type,
 * excluding the current location so the player always gets a different one.
 */
export function redrawPlacedTokenLocation(
  token: PlacedWeaknessToken,
  rng: () => number = Math.random,
): PlacedWeaknessToken {
  const newLocationId = drawLocationForTerrain(token.terrainType, token.locationId, rng);
  return { ...token, locationId: newLocationId };
}

/**
 * Initialises a fresh token board by drawing one `PlacedWeaknessToken` per terrain type.
 * If the pool is exhausted for a terrain type, that slot is omitted and a warning is logged.
 * Returns the board tokens and the remaining pool (mutually exclusive with board).
 */
export function initWeaknessTokenBoard(
  pool: WeaknessToken[],
  rng: () => number = Math.random,
): { board: PlacedWeaknessToken[]; remainingPool: WeaknessToken[] } {
  let remaining = [...pool];
  const board: PlacedWeaknessToken[] = [];
  for (const terrainType of ALL_TERRAIN_TYPES) {
    const result = drawPlacedToken(remaining, terrainType, rng);
    if (result.token) {
      board.push(result.token);
      remaining = result.remainingPool;
    } else {
      console.warn(`[Trail] Token pool exhausted for terrain "${terrainType}" — slot skipped.`);
    }
  }
  return { board, remainingPool: remaining };
}
