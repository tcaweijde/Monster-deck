import type { MonsterCard } from '../../types';

/**
 * Shared generic attack card pool used by all base-game monsters.
 * Top half is always "Charge"; bottom half is always "Bite".
 *
 * Pool invariant: length >= 19 (max base-game deckSize).
 *
 * TODO: Verify all attack values and effect text against the physical
 * Witcher Old World game cards before shipping (NFR-002, FEAT-002).
 */
export const GENERIC_CARD_POOL: MonsterCard[] = [
  {
    id: 'generic-01',
    top:    { name: 'Charge', attack: 3, effect: 'Shield 1' },
    bottom: { name: 'Bite',   attack: 2 },
  },
  {
    id: 'generic-02',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   attack: 4, effect: 'Bleed 1' },
  },
  {
    id: 'generic-03',
    top:    { name: 'Charge', attack: 1, effect: 'Shield 2' },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-04',
    top:    { name: 'Charge', attack: 4 },
    bottom: { name: 'Bite',   attack: 2, effect: 'Shield 1' },
  },
  {
    id: 'generic-05',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-06',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   attack: 2 },
  },
  {
    id: 'generic-07',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   attack: 4 },
  },
  {
    id: 'generic-08',
    top:    { name: 'Charge', attack: 4 },
    bottom: { name: 'Bite',   attack: 2 },
  },
  {
    id: 'generic-09',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-10',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   attack: 2 },
  },
  {
    id: 'generic-11',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   attack: 2 },
  },
  {
    id: 'generic-12',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-13',
    top:    { name: 'Charge', attack: 4 },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-14',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   attack: 4 },
  },
  {
    id: 'generic-15',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-16',
    top:    { name: 'Charge', attack: 1, effect: 'Bleed 1' },
    bottom: { name: 'Bite',   attack: 4 },
  },
  {
    id: 'generic-17',
    top:    { name: 'Charge', attack: 4 },
    bottom: { name: 'Bite',   attack: 1, effect: 'Bleed 2' },
  },
  {
    id: 'generic-18',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   attack: 3, effect: 'Shield 1' },
  },
  {
    id: 'generic-19',
    top:    { name: 'Charge', attack: 2, effect: 'Shield 1' },
    bottom: { name: 'Bite',   attack: 4 },
  },
  {
    id: 'generic-20',
    top:    { name: 'Charge', attack: 4 },
    bottom: { name: 'Bite',   attack: 2, effect: 'Bleed 1' },
  },
];
