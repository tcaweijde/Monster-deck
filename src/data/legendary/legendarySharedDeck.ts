import type { LegendaryMonsterCard } from '../../types';

/**
 * The 20-card fight deck shared by all Legendary monsters.
 *
 * Card halves use the following effect values to reference monster-specific abilities:
 *   effect: "special:N"  — monster performs its Nth special attack (1-indexed)
 *   effect: "The player discards the top 3 cards from their deck (empty deck: from their hand)"  — player discards 3 cards from the top of their deck
 *                          (empty deck: chosen cards from their hand)
 *
 * Damage halves use `attack: N` with no `effect`.
 */
export const LEGENDARY_SHARED_DECK: LegendaryMonsterCard[] = [
  {
    id: 'lg-shared-01',
    top:    { name: 'Attack', attack: 4 },
    bottom: { name: 'Attack', attack: 5 },
  },
  {
    id: 'lg-shared-02',
    top:    { name: 'Special Attack', effect: 'special:3' },
    bottom: { name: 'Attack', attack: 6 },
  },
  {
    id: 'lg-shared-03',
    top:    { name: 'Special Attack', effect: 'special:2' },
    bottom: { name: 'Attack', attack: 5 },
  },
  {
    id: 'lg-shared-04',
    top:    { name: 'Special Attack', effect: 'special:3' },
    bottom: { name: 'Attack', attack: 5 },
  },
  {
    id: 'lg-shared-05',
    top:    { name: 'Special Attack', effect: 'special:2' },
    bottom: { name: 'Attack', attack: 6 },
  },
  {
    id: 'lg-shared-06',
    top:    { name: 'Special Attack', effect: 'special:1' },
    bottom: { name: 'Attack', attack: 4 },
  },
  {
    id: 'lg-shared-07',
    top:    { name: 'Special Attack', effect: 'special:1' },
    bottom: { name: 'Discard', effect: 'The player discards the top 3 cards from their deck (empty deck: from their hand)' },
  },
  {
    id: 'lg-shared-08',
    top:    { name: 'Special Attack', effect: 'special:4' },
    bottom: { name: 'Attack', attack: 4 },
  },
  {
    id: 'lg-shared-09',
    top:    { name: 'Attack', attack: 5 },
    bottom: { name: 'Special Attack', effect: 'special:4' },
  },
  {
    id: 'lg-shared-10',
    top:    { name: 'Attack', attack: 5 },
    bottom: { name: 'Special Attack', effect: 'special:1' },
  },
  {
    id: 'lg-shared-11',
    top:    { name: 'Attack', attack: 6 },
    bottom: { name: 'Special Attack', effect: 'special:1' },
  },
  {
    id: 'lg-shared-12',
    top:    { name: 'Discard', effect: 'The player discards the top 3 cards from their deck (empty deck: from their hand)' },
    bottom: { name: 'Attack', attack: 6 },
  },
  {
    id: 'lg-shared-13',
    top:    { name: 'Attack', attack: 6 },
    bottom: { name: 'Special Attack', effect: 'special:4' },
  },
  {
    id: 'lg-shared-14',
    top:    { name: 'Attack', attack: 5 },
    bottom: { name: 'Attack', attack: 4 },
  },
  {
    id: 'lg-shared-15',
    top:    { name: 'Special Attack', effect: 'special:4' },
    bottom: { name: 'Discard', effect: 'The player discards the top 3 cards from their deck (empty deck: from their hand)' },
  },
  {
    id: 'lg-shared-16',
    top:    { name: 'Attack', attack: 4 },
    bottom: { name: 'Special Attack', effect: 'special:2' },
  },
  {
    id: 'lg-shared-17',
    top:    { name: 'Discard', effect: 'The player discards the top 3 cards from their deck (empty deck: from their hand)' },
    bottom: { name: 'Special Attack', effect: 'special:2' },
  },
  {
    id: 'lg-shared-18',
    top:    { name: 'Discard', effect: 'The player discards the top 3 cards from their deck (empty deck: from their hand)' },
    bottom: { name: 'Special Attack', effect: 'special:3' },
  },
  {
    id: 'lg-shared-19',
    top:    { name: 'Attack', attack: 4 },
    bottom: { name: 'Special Attack', effect: 'special:3' },
  },
  {
    id: 'lg-shared-20',
    top:    { name: 'Attack', attack: 6 },
    bottom: { name: 'Discard', effect: 'The player discards the top 3 cards from their deck (empty deck: from their hand)' },
  },
];
