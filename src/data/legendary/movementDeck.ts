import type { MovementCard } from '../../types';

/** The full movement deck used in the Legendary Hunt campaign. */
export const LEGENDARY_MOVEMENT_DECK: MovementCard[] = [
  {
    id: 'mv-01',
    targetLocation1Name: 'Oxenfurt',
    targetLocation2Name: 'Novigrad',
    movementDistanceSolo: 2,
    movementDistanceBy2: 2,
    movementDistanceBy3: 3,
    movementDistanceBy4: 3,
  },
  {
    id: 'mv-02',
    targetLocation1Name: 'Novigrad',
    targetLocation2Name: 'Velen',
    movementDistanceSolo: 2,
    movementDistanceBy2: 3,
  },
  {
    id: 'mv-03',
    targetLocation1Name: 'Velen',
    targetLocation2Name: 'Crow\'s Perch',
    movementDistanceSolo: 2,
    movementDistanceBy2: 2,
    movementDistanceBy3: 3,
  },
  {
    id: 'mv-04',
    targetLocation1Name: 'Crow\'s Perch',
    targetLocation2Name: 'Bald Mountain',
    movementDistanceSolo: 2,
    movementDistanceBy2: 3,
    movementDistanceBy3: 3,
    movementDistanceBy4: 4,
  },
  {
    id: 'mv-05',
    targetLocation1Name: 'Bald Mountain',
    targetLocation2Name: 'Kaer Morhen',
    movementDistanceSolo: 2,
    movementDistanceBy2: 2,
  },
  {
    id: 'mv-06',
    targetLocation1Name: 'Kaer Morhen',
    targetLocation2Name: 'Hindarsfjall',
    movementDistanceSolo: 2,
    movementDistanceBy2: 3,
    movementDistanceBy3: 3,
  },
  {
    id: 'mv-07',
    targetLocation1Name: 'Hindarsfjall',
    targetLocation2Name: 'Kaer Trolde',
    movementDistanceSolo: 2,
    movementDistanceBy2: 2,
    movementDistanceBy3: 3,
    movementDistanceBy4: 4,
  },
  {
    id: 'mv-08',
    targetLocation1Name: 'Kaer Trolde',
    targetLocation2Name: 'Oxenfurt',
    movementDistanceSolo: 2,
    movementDistanceBy2: 3,
  },
];
