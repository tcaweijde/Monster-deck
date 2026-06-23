import type { Location, LocationType } from '../types';

const img = (slug: string) => `/images/locations/${slug}.png`;

export const LOCATIONS: Location[] = [
  { id: 1,  name: 'Kaer Seren',    type: 'water',    image: img('kaer-seren') },
  { id: 2,  name: 'Henfors',       type: 'mountain', image: img('henfors') },
  { id: 3,  name: 'Kaer Morhen',   type: 'mountain', image: img('kaer-morhen') },
  { id: 4,  name: 'Ban Aard',      type: 'water',    image: img('ban-aard') },
  { id: 5,  name: 'Cidaris',       type: 'water',    image: img('cidaris') },
  { id: 6,  name: 'Novigrad',      type: 'woods',    image: img('novigrad') },
  { id: 7,  name: 'Vizima',        type: 'woods',    image: img('vizima') },
  { id: 8,  name: 'Vengerberg',    type: 'woods',    image: img('vengerberg') },
  { id: 9,  name: 'Cintra',        type: 'mountain', image: img('cintra') },
  { id: 10, name: 'Haern Caduch',  type: 'woods',    image: img('haern-caduch') },
  { id: 11, name: 'Beauclair',     type: 'mountain', image: img('beauclair') },
  { id: 12, name: 'Glenmore',      type: 'water',    image: img('glenmore') },
  { id: 13, name: 'Doldeth',       type: 'mountain', image: img('doldeth') },
  { id: 14, name: 'Loc Ichaer',    type: 'water',    image: img('loc-ichaer') },
  { id: 15, name: 'Gorthur Gvaed', type: 'water',    image: img('gorthur-gvaed') },
  { id: 16, name: 'Dwywod',        type: 'woods',    image: img('dwywod') },
  { id: 17, name: 'Stygga',        type: 'woods',    image: img('stygga') },
  { id: 18, name: 'Ard Modron',    type: 'mountain', image: img('ard-modron') },

  // ── Skellige Expansion (FEAT-SKELLIGE-001) ───────────────────────────────
  { id: 19, name: 'Ard Skellig',   type: 'woods',    image: img('ard-skellig') },
  { id: 20, name: 'Eyna',          type: 'water',    image: img('eyna') },
  { id: 21, name: 'Isle of Mists', type: 'mountain', image: img('isle-of-mists') },
];

/**
 * Dagon's Lair — a permanent, fixed location used exclusively by the Skellige
 * expansion's permanent Dagon slot. Not part of the rotating LOCATIONS pool.
 */
export const DAGONS_LAIR_LOCATION: Location = {
  id: 22,
  name: "Dagon's Lair",
  type: 'water',
  image: img('dagons-lair'),
};

/** Returns all locations of a given type. Base game has 6 per type; Skellige expansion adds 1 per type. */
export function getLocationsByType(type: LocationType): Location[] {
  return LOCATIONS.filter((l) => l.type === type);
}

/** Base-game locations only (ids 1–18). */
export const BASE_LOCATIONS: Location[] = LOCATIONS.filter((l) => l.id <= 18);

/**
 * Returns the active location pool based on whether the Skellige expansion is enabled.
 * Base game: 18 locations (6 per type). Skellige: 21 locations (7 per type).
 */
export function getLocations(skelligeEnabled: boolean): Location[] {
  return skelligeEnabled ? LOCATIONS : BASE_LOCATIONS;
}
