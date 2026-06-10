// ─── Hound Reward Data ───────────────────────────────────────────────────────
// TODO: Replace all placeholder entries with actual reward data from the
//       physical Wild Hunt expansion reward table.

export interface HoundReward {
  id: string;
  name: string;
  description: string;
}

const HOUND_REWARDS: Record<1 | 2 | 3, HoundReward[]> = {
  1: [
    { id: 'lv1-r1', name: 'TODO: Reward L1-A', description: 'TODO: Fill with actual reward description from the expansion.' },
    { id: 'lv1-r2', name: 'TODO: Reward L1-B', description: 'TODO: Fill with actual reward description from the expansion.' },
    { id: 'lv1-r3', name: 'TODO: Reward L1-C', description: 'TODO: Fill with actual reward description from the expansion.' },
  ],
  2: [
    { id: 'lv2-r1', name: 'TODO: Reward L2-A', description: 'TODO: Fill with actual reward description from the expansion.' },
    { id: 'lv2-r2', name: 'TODO: Reward L2-B', description: 'TODO: Fill with actual reward description from the expansion.' },
    { id: 'lv2-r3', name: 'TODO: Reward L2-C', description: 'TODO: Fill with actual reward description from the expansion.' },
  ],
  3: [
    { id: 'lv3-r1', name: 'TODO: Reward L3-A', description: 'TODO: Fill with actual reward description from the expansion.' },
    { id: 'lv3-r2', name: 'TODO: Reward L3-B', description: 'TODO: Fill with actual reward description from the expansion.' },
    { id: 'lv3-r3', name: 'TODO: Reward L3-C', description: 'TODO: Fill with actual reward description from the expansion.' },
  ],
};

/** Returns a random reward from the pool for the given hound level. */
export function getRandomHoundReward(level: 1 | 2 | 3): HoundReward {
  const pool = HOUND_REWARDS[level];
  return pool[Math.floor(Math.random() * pool.length)];
}
