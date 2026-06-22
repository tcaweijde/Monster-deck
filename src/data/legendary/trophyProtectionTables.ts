import type { TrophyProtectionTable } from '../../types';

/** Trophy-to-protection lookup tables for both campaign sides. */
export const TROPHY_PROTECTION_TABLES: TrophyProtectionTable[] = [
  {
    side: 'A',
    entries: [
      { minTrophies: 0, maxTrophies: 0, protectionValue: 3 },
      { minTrophies: 1, maxTrophies: 1, protectionValue: 2 },
      { minTrophies: 2, maxTrophies: 2, protectionValue: 1 },
      { minTrophies: 3, maxTrophies: null, protectionValue: 0 },
    ],
  },
  {
    side: 'B',
    entries: [
      { minTrophies: 0, maxTrophies: 0, protectionValue: 4 },
      { minTrophies: 1, maxTrophies: 1, protectionValue: 3 },
      { minTrophies: 2, maxTrophies: 2, protectionValue: 2 },
      { minTrophies: 3, maxTrophies: 3, protectionValue: 1 },
      { minTrophies: 4, maxTrophies: null, protectionValue: 0 },
    ],
  },
];
