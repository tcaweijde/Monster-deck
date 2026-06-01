export function checkInitiative(rng: () => number = Math.random): boolean {
  return rng() < 0.5;
}
