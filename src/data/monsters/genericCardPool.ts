import type { MonsterCard } from '../../types';

/**
 * Shared generic attack card pool used by all base-game monsters.
 * Top half is always "Charge"; bottom half is always "Bite".
 * Values transcribed from the physical Witcher Old World game cards.
 *
 * Pool invariant: length >= 19 (max base-game deckSize).
 */
export const GENERIC_CARD_POOL: MonsterCard[] = [
  {
    id: 'generic-01',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   effect: 'damage equal to Defence level' },
  },
  {
    id: 'generic-02',
    top:    { name: 'Charge', effect: 'Trash 1 card from hand (empty hand, from top of their deck)' },
    bottom: { name: 'Bite',   attack: 2 },
  },
  {
    id: 'generic-03',
    top:    { name: 'Charge', attack: 4 },
    bottom: { name: 'Bite',   effect: 'Lower the combat level by 1 and take 0,1 or 2 Damage based on the monsters level' },
  },
  {
    id: 'generic-04',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   effect: 'Lower the alchemy level by 1 and take 0,1 or 2 Damage based on the monsters level' },
  },
  {
    id: 'generic-05',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   attack: 4 },
  },
  {
    id: 'generic-06',
    top:    { name: 'Charge', attack: 2 },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-07',
    top:    { name: 'Charge', attack: 5 },
    bottom: { name: 'Bite',   effect: 'Damage equal the players Alchemy level' },
  },
  {
    id: 'generic-08',
    top:    { name: 'Charge', effect: 'Discard a number of random cards from hand (empty hand, from top of their deck) according to the monsters level (1,2,3)' },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-09',
    top:    { name: 'Charge', effect: 'Trash any 1 card from hand (empty hand, from top of their deck)' },
    bottom: { name: 'Bite',   effect: 'Damage equal to the players combat level' },
  },
  {
    id: 'generic-10',
    top:    { name: 'Charge', attack: 4 },
    bottom: { name: 'Bite',   effect: 'Damage equal to the players specialty level' },
  },
  {
    id: 'generic-11',
    top:    { name: 'Charge', effect:'Discard a number of random cards from hand (empty hand, from top of their deck) according to the monsters level (1,2,3)' },
    bottom: { name: 'Bite',   effect: 'Take 3,4 or 5 Damage based on the monsters level ' },
  },
  {
    id: 'generic-12',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   attack: 5 },
  },
  {
    id: 'generic-13',
    top:    { name: 'Charge', effect: 'Discard a number of random cards from hand (empty hand, from top of their deck) according to the monsters level (1,2,3)' },
    bottom: { name: 'Bite',   attack: 4 },
  },
  {
    id: 'generic-14',
    top:    { name: 'Charge', attack: 4 },
    bottom: { name: 'Bite',   attack: 2 },
  },
  {
    id: 'generic-15',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   attack: 4 },
  },
  {
    id: 'generic-16',
    top:    { name: 'Charge', effect: 'Trash any 1 card from hand (empty hand, from top of their deck)' },
    bottom: { name: 'Bite',   attack: 3 },
  },
  {
    id: 'generic-17',
    top:    { name: 'Charge', attack: 5 },
    bottom: { name: 'Bite',   attack: 2 },
  },
  {
    id: 'generic-18',
    top:    { name: 'Charge', attack: 3 },
    bottom: { name: 'Bite',   attack: 5 },
  },
  {
    id: 'generic-19',
    top:    { name: 'Charge', effect: 'Discard a number of random cards from hand (empty hand, from top of their deck) according to the monsters level (1,2,3)' },
    bottom: { name: 'Bite',   attack: 4 },
  },
  {
    id: 'generic-20',
    top:    { name: 'Charge', effect: 'Take 3,4 or 5 Damage based on the monsters level' },
    bottom: { name: 'Bite',   effect: 'The player lowers their Defence level by 1 and takes 0,1 or 2 Damage based on the monsters level' },
  },
];
