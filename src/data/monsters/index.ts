import type { Monster } from '../../types';
import { dagon } from './dagon';
import { griffin } from './griffin';
import { werewolf } from './werewolf';
import { foglet } from './foglet';
import { leshen } from './leshen';
import { striga } from './striga';
import { rotfiend } from './rotfiend';
import { noonwraith } from './noonwraith';
import { wyvern } from './wyvern';
import { ekimmara } from './ekimmara';
import { drownersNest } from './drowners-nest';
import { glustyworp } from './glustyworp';
import { brewess } from './brewess';
import { troll } from './troll';
import { bruxa } from './bruxa';
import { yghern } from './yghern';
import { fiend } from './fiend';
import { nightwraith } from './nightwraith';
import { whispess } from './whispess';
import { graveHag } from './grave-hag';
import { waterHag } from './water-hag';
import { penitent } from './penitent';
import { weavess } from './weavess';
import { manticore } from './manticore';
import { nekkersNest } from './nekkers-nest';
import { arachas } from './arachas';
import { ghoulsNest } from './ghouls-nest';
import { archespore } from './archespore';
import { harpy } from './harpy';
import { barghest } from './barghest';

export const MONSTERS: Monster[] = [griffin, werewolf, foglet, leshen, striga, rotfiend, noonwraith, wyvern, ekimmara, drownersNest, glustyworp, brewess, troll, bruxa, yghern, fiend, nightwraith, whispess, graveHag, waterHag, penitent, weavess, manticore, nekkersNest, arachas, ghoulsNest, archespore, harpy, barghest];

/** Dagon is excluded from the rotating monster pool — he is always hosted at Dagon's Lair (FEAT-SKELLIGE-002). */
export { dagon };

export function getMonsterById(id: string): Monster | undefined {
  return MONSTERS.find((m) => m.id === id);
}
