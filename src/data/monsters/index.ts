import type { Monster } from '../../types';
import { griffin } from './griffin';
import { werewolf } from './werewolf';
import { foglet } from './foglet';

export const MONSTERS: Monster[] = [griffin, werewolf, foglet,leshen];

export function getMonsterById(id: string): Monster | undefined {
  return MONSTERS.find((m) => m.id === id);
}
