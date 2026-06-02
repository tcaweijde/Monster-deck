import type { Location, LocationType } from '../types';

export const LOCATIONS: Location[] = [
  { id: 1, name: 'Kaer Seren', type: 'water' },
  { id: 2, name: 'Henfors', type: 'mountain' },
  { id: 3, name: 'Kaer Morhen', type: 'mountain' },
  { id: 4, name: 'Ban Aard', type: 'water' },
  { id: 5, name: 'Cidaris', type: 'water' },
  { id: 6, name: 'Novigrad', type: 'woods' },
  { id: 7, name: 'Vizima', type: 'woods' },
  { id: 8, name: 'Vengerberg', type: 'woods' },
  { id: 9, name: 'Cintra', type: 'mountain' },
  { id: 10, name: 'Haern Caduch', type: 'woods' },
  { id: 11, name: 'Beauclair', type: 'mountain' },
  { id: 12, name: 'Glenmore', type: 'water' },
  { id: 13, name: 'Doldeth', type: 'mountain' },
  { id: 14, name: 'Loc Ichaer', type: 'water' },
  { id: 15, name: 'Gorthur Gvaed', type: 'water' },
  { id: 16, name: 'Dwywod', type: 'woods' },
  { id: 17, name: 'Stygga', type: 'woods' },
  { id: 18, name: 'Ard Modron', type: 'mountain' },
];

/** Returns all locations of a given type. There are always exactly 6 per type. */
export function getLocationsByType(type: LocationType): Location[] {
  return LOCATIONS.filter((l) => l.type === type);
}
