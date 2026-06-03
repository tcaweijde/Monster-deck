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
];

/** Returns all locations of a given type. There are always exactly 6 per type. */
export function getLocationsByType(type: LocationType): Location[] {
  return LOCATIONS.filter((l) => l.type === type);
}
