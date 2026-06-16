// ─── Hound Reward Data ───────────────────────────────────────────────────────
//       physical Wild Hunt expansion reward table.

export interface HoundReward {
  id: string;
  description: string;
}

const HOUND_REWARDS: Record<1 | 2 | 3, HoundReward[]> = {
  1: [
    { id: 'lv1-r1', description: 'Draw a card from your deck' },
    { id: 'lv1-r2', description: 'Draw a trail-token' },
  ],
  2: [
    { id: 'lv2-r1', description: 'Add any 1 of the revealed Action cards of cost 0 to your discard pile' },
    { id: 'lv2-r2', description: 'Raise you lowest Attribute by 1 level' },
  ],
  3: [
    { id: 'lv3-r1', description: 'Raise any Attribute by 1 level' },
    { id: 'lv3-r2', description: 'Add any 1 of the revealed Action cards of cost 1 to your discard pile' },
  ],
};

/** Returns a random reward from the pool for the given hound level. */
export function getRandomHoundReward(level: 1 | 2 | 3): HoundReward {
  const pool = HOUND_REWARDS[level];
  return pool[Math.floor(Math.random() * pool.length)];
}
