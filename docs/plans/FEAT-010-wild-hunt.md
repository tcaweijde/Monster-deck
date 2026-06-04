# Implementation Plan: FEAT-010 Wild Hunt

**Spec:** `docs/specs/FEAT-010-wild-hunt.md`
**Created:** 2026-06-04
**Status:** Draft

---

## Summary

The Wild Hunt expansion adds a separate 8-round game mode launched from the welcome screen. It introduces a new `wildHuntStore` (persisted), a round/stage driver, a boss fight that extends the existing encounter engine with shield-first damage resolution, location-based movement, hound enemies, and a proximity bonus mechanic. All 11 sub-features (A–K) are implemented across three focused iterations, each delivering a playable slice.

---

## Key Design Decisions

1. **Wild Hunt is a separate game mode, not a layer on top of board mode.** `App.tsx` derives which screen to show from store state (same pattern as `board === null → welcome`): if `wildHuntStore.phase !== 'inactive'`, show Wild Hunt screens. No extra `mode` useState needed.

2. **`boardStore` is reused in Wild Hunt mode for the 3 regular monster slots.** The spec lists FEAT-001 as a dependency. `boardStore.initNewGame()` is called at Wild Hunt start to populate the board; however, `boardStore.handleVictory()` (auto-spawn) is NOT called after monster defeats in Wild Hunt mode — spawning is driven by the round stage driver (FEAT-010-G). The `WildHuntBoardScreen` reads from both `boardStore` and `wildHuntStore`.

3. **`encounterStore` is reused as-is for boss fight and regular encounter deck/flip logic.** Stores do not import each other (project convention). Shield-first damage coordination for the boss fight is handled in `WildHuntEncounterScreen` (the component layer): it calls `wildHuntStore.absorbDamage(n)` first, then passes the excess to `encounterStore.applyPlayerDamage(excess)`.

4. **All Wild Hunt types go in `src/types/wildHunt.ts`.** Keeps `src/types/index.ts` (shared domain types) clean. The `WildHuntCharacter` type uses `MonsterAbility` and `MonsterCard` from the existing types — no duplication.

5. **Special cards are `MonsterCard` values.** The existing `MonsterCard` / `MonsterAbility` types are sufficient for special cards. A special card has a `discardAbility` that maps to the same `DiscardAlert` component already used for regular monsters. No new types needed for the card model.

6. **`generateDeck` gets a `bonusCount: number = 0` parameter for FEAT-010-K.** The existing third parameter `genericCards` serves a different purpose. `bonusCount` increases the number of cards *selected* from the pool (i.e., `deckSize + bonusCount` cards picked), which is exactly what the proximity bonus requires. The existing signature becomes `generateDeck(monster, rng?, genericCards?, bonusCount?)`.

7. **Location pathfinding in `src/engine/location.ts`.** Pure BFS function: `bfsPath(graph, from, to)` returning location IDs. Pure function, no rng needed. The adjacency graph is static data at `src/data/wildHunt/locationGraph.ts`. Player location is stored in `wildHuntStore.playerLocationId` — the player selects it at Wild Hunt setup start.

8. **Hound shield loss = excess damage, not a flat 1.** The spec states: "Wild Hunt loses shields equal to the excess damage" (declared damage − threshold). The `wildHuntStore.resolveHoundCombat(houndId, declaredDamage)` action computes this.

---

## Iteration 1 — Wild Hunt Skeleton

> **Goal:** Fully navigable 8-round Wild Hunt game mode with character selection, stage prompts, story card reminders. No combat — just the round flow.
>
> **Sub-features:** FEAT-010-J, FEAT-010-C, FEAT-010-A, FEAT-010-B, FEAT-010-I

### Phase 1 — Types

**File: `src/types/wildHunt.ts`** (new)

```ts
export type WildHuntPhase = 'inactive' | 'setup' | 'playing' | 'finalBattle' | 'victory' | 'defeat';
export type WildHuntDifficulty = 'normal' | 'hard'; // 'hard' is a stub; effect TBD

export interface WildHuntCharacter {
  id: string;
  name: string;
  passiveAbility: MonsterAbility;      // imported from src/types/index.ts
  startingShields: number;             // TBD from rulebook; default 0 if unknown
  specialCards: MonsterCard[];         // 4 cards with discardAbility set
}

export interface HoundSlot {
  id: string;                          // e.g. 'hound-0'
  level: 1 | 2 | 3;
  locationId: number;                  // where it spawned (Wild Hunt location at spawn time)
}

export interface WildHuntState {
  phase: WildHuntPhase;
  round: number;                       // 1–8
  stage: 1 | 2 | 3 | 4;
  characterId: string | null;
  difficulty: WildHuntDifficulty;
  shieldCount: number;
  wildHuntLocationId: number | null;   // current location of Wild Hunt unit
  playerLocationId: number | null;     // set at setup; updated if player moves (out of scope for iter 1)
  houndSlots: HoundSlot[];
  occupiedBoardSlots: number;          // 0–3; used for overflow check
}
```

### Phase 2 — Character Data

**File: `src/data/wildHunt/characters.ts`** (new)

Stub file with 4 `WildHuntCharacter` objects. Names and stats are placeholders until physical rulebook data is available — mark with `// TODO: fill from rulebook`.

Each character has 4 special `MonsterCard` entries with a `discardAbility` populated.

### Phase 3 — Store

**File: `src/store/wildHuntStore.ts`** (new)

Zustand store with `persist` middleware, key: `monster-deck-wh-v1`.

Actions:
- `startRun(characterId, difficulty)` — sets phase to `'playing'`, round 1, stage 1, initializes shields from character data; also calls `boardStore.initNewGame()` from the component layer (not from the store — stores don't import each other)
- `advanceStage()` — increments stage 1→2→3→4, then round; handles round 8/stage 4 → sets phase to `'finalBattle'`
- `endRun()` — resets to initial state (phase `'inactive'`)
- `adjustShields(delta: number)` — adds delta to shieldCount (manual +/− buttons)

`onRehydrateStorage`: if `phase === 'finalBattle'` revert to `'playing'` with stage 4 (same EC-4 pattern as `boardStore`).

### Phase 4 — Screens

**File: `src/components/wildHunt/WildHuntSetupScreen.tsx`** (new)

Single multi-step setup screen (no separate CharacterSelectScreen file): step 1 selects difficulty, step 2 selects character. On confirm: calls `wildHuntStore.startRun(characterId, difficulty)` and `boardStore.initNewGame()`.

**File: `src/components/wildHunt/WildHuntBoardScreen.tsx`** (new)

Shows: round/stage indicator, stage-specific prompt text, "Advance" button, "End Run" button.

Stage text:
- Stage 1: "Movement & Action — move and act on the board."
- Stage 2: "Fight, Meditation & Exploration — Read Story Card #N" (N = round number) + "Done"
- Stage 3: "Drawing & Gaining Cards — draw and collect rewards."
- Stage 4: Spawn prompt (Iteration 3 — placeholder in Iteration 1) + "Advance" — or "Begin Final Battle" in round 8

### Phase 5 — App Routing

**Modified: `src/App.tsx`**

Add `wildHuntPhase` selector. Derive screen:
```ts
const wildHuntPhase = useWildHuntStore((s) => s.phase);
const board = useBoardStore((s) => s.board);
const activeSlotIndex = useBoardStore((s) => s.activeSlotIndex);

const inWildHunt = wildHuntPhase !== 'inactive';
const screen = inWildHunt
  ? (wildHuntPhase === 'setup' ? 'wh-setup' : activeSlotIndex !== null ? 'encounter' : 'wh-board')
  : (!board ? 'welcome' : activeSlotIndex !== null ? 'encounter' : 'board');
```

**Modified: `src/components/board/BoardWelcomeScreen.tsx`**

Add "Start Wild Hunt" button below the existing "Start New Game" button. It calls `wildHuntStore` to set phase to `'setup'` (no new action needed — `startRun` will be called from the setup screen on confirm).

---

## Iteration 2 — Combat Layer

> **Goal:** Full boss fight with shield counter and location tracking. A complete Wild Hunt run can be played through to the Final Battle.
>
> **Sub-features:** FEAT-010-F, FEAT-010-D, FEAT-010-E

### Phase 1 — Location Engine

**File: `src/engine/location.ts`** (new)

```ts
export type LocationGraph = Record<number, number[]>; // locationId → adjacent ids

export function bfsPath(graph: LocationGraph, from: number, to: number): number[]
// Returns shortest path as array of location IDs including `from` and `to`.
// Returns [] if no path exists.
```

**File: `src/data/wildHunt/locationGraph.ts`** (new)

Static `LocationGraph` constant encoding adjacency for all 18 base-game locations. **Requires physical board map data — BLOCKER.** Starting Wild Hunt location and player starting location are also needed.

### Phase 2 — Shield-First Damage Engine

**File: `src/engine/wildHuntCombat.ts`** (new)

```ts
export function applyDamageWithShields(
  deck: MonsterCard[],
  shields: number,
  damage: number,
): { remainingDeck: MonsterCard[]; remainingShields: number; discardedCards: MonsterCard[] }
```

Absorbs damage into shields first; calls `applyDamage` from `combat.ts` with the excess. Pure function, injectable rng not needed here.

### Phase 3 — Store: Location + Shields

**Modified: `src/store/wildHuntStore.ts`**

New state fields (already typed in Iteration 1): `wildHuntLocationId`, `playerLocationId`, `shieldCount`.

New actions:
- `initLocations(wildHuntStart, playerStart)` — called from setup screen after `startRun`
- `advanceWildHuntLocation(graph)` — moves Wild Hunt 2 steps toward player via BFS; updates `wildHuntLocationId`; if new location equals `playerLocationId`, sets `phase = 'finalBattle'`
- `absorbDamage(damage)` — applies shield-first logic inline (not via engine function — too simple to need isolation): `Math.max(0, damage - shieldCount)` = excess; updates `shieldCount`; returns excess to caller
- `adjustShields(delta)` — already in Iteration 1; also used for auto-increment on board overflow

### Phase 4 — Boss Encounter Screen

**Modified: `src/data/wildHunt/characters.ts`**

Fill in full special card definitions for all 4 characters (requires rulebook data; use stubs until available). Each special card is a `MonsterCard` with `discardAbility` set.

**File: `src/components/wildHunt/WildHuntEncounterScreen.tsx`** (new)

Uses existing `encounterStore` for deck/flip/card management. Wraps `encounterStore.applyPlayerDamage` with shield-first coordination:

```ts
const handlePlayerDamage = (damage: number) => {
  const excess = wildHuntStore.absorbDamage(damage);   // updates shields in wildHuntStore
  encounterStore.applyPlayerDamage(excess);              // discards from deck
};
```

Shows: shield counter widget (read-only during combat), existing `DiscardAlert` pattern for special card discard abilities, existing `DeckTracker` and `MonsterCardDisplay`.

**Modified: `src/components/wildHunt/WildHuntBoardScreen.tsx`**

Add: shield counter with +/− buttons (calls `wildHuntStore.adjustShields`), Wild Hunt location display ("The Wild Hunt is at: Loc Name"), "Advance Wild Hunt" confirmation on round start.

**Modified: `src/App.tsx`**

Wire `wildHuntPhase === 'finalBattle'` → render `<WildHuntEncounterScreen>`. Wrap with the same `slideUp` animation used for regular `EncounterScreen`.

Start encounter in boss fight: call `encounterStore.startEncounter` with a synthetic Wild Hunt "monster" built from character data (character's `specialCards` + `GENERIC_CARD_POOL` as `cardPool`, with `deckSize = specialCards.length + genericPoolDeckSize`).

---

## Iteration 3 — Enemies & Proximity

> **Goal:** Full Wild Hunt game mode — monster spawns, hound enemies, overflow shield logic, proximity bonuses. Completes FEAT-010 to 100%.
>
> **Sub-features:** FEAT-010-G, FEAT-010-H, FEAT-010-K

### Phase 1 — Spawn Table Data

**File: `src/data/wildHunt/spawnTable.ts`** (new)

```ts
export interface SpawnRule {
  monsterLevel: 1 | 2 | 3 | null;  // null = no regular monster this round
  houndLevel: 1 | 2 | 3 | null;    // null = no hound this round
}
export const SPAWN_TABLE: Record<number, SpawnRule> = { 1: ..., 2: ..., ... }; // rounds 1–8
```

**Requires physical rulebook data — BLOCKER.**

**File: `src/data/wildHunt/houndRewards.ts`** (new)

Stub array of reward strings. **Requires physical expansion data — BLOCKER.** Placeholder: `['Draw 1 card', 'Gain 1 gold', 'Gain 1 ability token']`.

### Phase 2 — Store: Spawn + Hound Tracking

**Modified: `src/store/wildHuntStore.ts`**

New state fields: `houndSlots: HoundSlot[]`, `occupiedBoardSlots: number`.

New actions:
- `spawnHound(level)` — appends a new `HoundSlot` at `wildHuntLocationId`; generates unique ID
- `removeHound(id)` — removes a hound from `houndSlots` on defeat
- `setOccupiedBoardSlots(count)` — updated from component layer when monsters are defeated/spawned
- `resolveHoundCombat(houndId, declaredDamage)`:
  - Look up hound level → threshold (L1=2, L2=3, L3=4)
  - If damage < threshold → return `{ defeated: false }`
  - If damage ≥ threshold → `excess = damage - threshold`; call `adjustShields(-excess)`; remove hound; return `{ defeated: true, reward: randomReward() }`

### Phase 3 — Stage 4 Spawn UI

**Modified: `src/components/wildHunt/WildHuntBoardScreen.tsx`**

Stage 4 content (replace placeholder from Iteration 1):
- Read spawn rule for current round from `SPAWN_TABLE`
- If regular monster would spawn AND `occupiedBoardSlots >= 3`: show "Board full — Wild Hunt gains +1 shield" prompt; call `wildHuntStore.adjustShields(1)` on confirm
- Otherwise: show spawn prompt ("Spawn 1× L2 monster, 1× hound at [WH Location Name]")
- Hound entries get an "Add Hound" button that calls `wildHuntStore.spawnHound(level)`

Add hound slot display list (from `wildHuntStore.houndSlots`): each row shows level + location + "Fight" button.

### Phase 4 — Hound Combat

**File: `src/components/wildHunt/HoundCombatScreen.tsx`** (new)

Flow:
1. Show pre-attack bonus reminder ("You receive a combat bonus for this attack — apply it now.")
2. Numeric input for declared damage
3. On submit: call `wildHuntStore.resolveHoundCombat(houndId, damage)`
4. If defeated: show reward text + "Wild Hunt lost N shields" notification; button to close
5. If survived: show "Hound survived" and close

### Phase 5 — Proximity Bonus

**Modified: `src/engine/deck.ts`**

Add `bonusCount: number = 0` to `generateDeck`:

```ts
export function generateDeck(
  monster: Monster,
  rng?: () => number,
  genericCards: MonsterCard[] = [],
  bonusCount: number = 0,
): MonsterCard[] {
  const size = monster.deckSize + bonusCount;
  ...
}
```

**Modified: `src/store/encounterStore.ts`**

`startEncounter(monsterId, playerFirst?, bonusCards?)` — passes `bonusCards` to `generateDeck` as `bonusCount`.

**File: `src/components/wildHunt/ProximitySetupScreen.tsx`** (new)

Shown before every regular monster encounter in Wild Hunt mode. Two controls:
- "Is the Wild Hunt on or adjacent to this location?" — Yes/No toggle
- "How many hounds are on or adjacent?" — stepper 0/1/2/3

Displays calculated bonus ("+ N cards"). "Start Encounter" calls `encounterStore.startEncounter(monsterId, playerFirst, bonusCount)`.

**Modified: `src/App.tsx`**

In Wild Hunt mode, tapping a board monster goes to `ProximitySetupScreen` (not directly to encounter). Add `wh-proximity` screen to the routing derivation.

---

## File Inventory

### New Files

**Types**
- `src/types/wildHunt.ts` — `WildHuntPhase`, `WildHuntDifficulty`, `WildHuntCharacter`, `HoundSlot`, `WildHuntState`

**Data**
- `src/data/wildHunt/characters.ts` — 4 Wild Hunt character definitions (stubs → fill from rulebook)
- `src/data/wildHunt/locationGraph.ts` — 18-location adjacency map (requires physical board map)
- `src/data/wildHunt/spawnTable.ts` — round → spawn rules (requires physical rulebook)
- `src/data/wildHunt/houndRewards.ts` — stub reward pool

**Engine**
- `src/engine/location.ts` — `bfsPath(graph, from, to)` pure function
- `src/engine/wildHuntCombat.ts` — `applyDamageWithShields(deck, shields, damage)` pure function
- `src/engine/location.__tests__/location.test.ts` — BFS unit tests
- `src/engine/__tests__/wildHuntCombat.test.ts` — shield-first damage unit tests

**Store**
- `src/store/wildHuntStore.ts` — Zustand + persist
- `src/store/__tests__/wildHuntStore.test.ts` — integration tests

**Components**
- `src/components/wildHunt/WildHuntSetupScreen.tsx`
- `src/components/wildHunt/WildHuntBoardScreen.tsx`
- `src/components/wildHunt/WildHuntEncounterScreen.tsx`
- `src/components/wildHunt/HoundCombatScreen.tsx`
- `src/components/wildHunt/ProximitySetupScreen.tsx`

### Modified Files

- `src/App.tsx` — add Wild Hunt screen routing (derived from store state)
- `src/components/board/BoardWelcomeScreen.tsx` — add "Start Wild Hunt" button
- `src/engine/deck.ts` — add `bonusCount: number = 0` parameter to `generateDeck`
- `src/store/encounterStore.ts` — add `bonusCards?: number` to `startEncounter`
- `src/store/wildHuntStore.ts` — iterative additions across 3 iterations
- `src/data/wildHunt/characters.ts` — fill from stubs → full definitions in Iteration 2

---

## Testing Strategy

### Engine tests (unit, pure functions)

**`location.test.ts`**
- BFS on a 3-node linear graph: path found correctly
- BFS on a disconnected graph: returns `[]`
- Wild Hunt moves 2 steps: test with `bfsPath` returning 3-node path, taking index 2

**`wildHuntCombat.test.ts`**
- Damage ≤ shields: all absorbed, no cards discarded, shields reduced
- Damage = shields: shields drained to 0, no cards discarded
- Damage > shields: shields drain to 0, excess cards discarded from deck
- Damage to empty deck with 0 shields: returns empty deck (no crash)

### Store tests (integration, `renderHook` + `act`)

**`wildHuntStore.test.ts`** — mock `localStorage` via `vi.hoisted` (same pattern as `boardStore.test.ts`)
- `startRun`: sets phase `'playing'`, round 1, stage 1, shields = character's `startingShields`
- `advanceStage` × 4: round increments, stage wraps 1→4 then resets
- `advanceStage` on round 8, stage 4: phase becomes `'finalBattle'`
- `adjustShields`: clamps at 0 (no negative shields)
- `resolveHoundCombat`: damage < threshold → not defeated; damage ≥ threshold → defeated, excess removed from shields; excess never makes shields negative
- `endRun`: resets to initial inactive state

### Component-level (manual verification — no automated component tests)

Follow existing project convention: no automated component tests. Manual playtesting covers `WildHuntBoardScreen` stage flow and `WildHuntEncounterScreen` combat.

---

## Open Questions (blockers)

These must be resolved before the indicated iteration can be completed:

| Question | Iteration Blocked |
|----------|------------------|
| Wild Hunt character names, passive abilities, starting shield counts, 4 special cards each | Iteration 1 (data stubs OK, but final values needed before ship) |
| Location adjacency graph (physical board map) | Iteration 2 |
| Wild Hunt starting location + player starting location | Iteration 2 |
| Round spawn table (round → monster level, hound level) | Iteration 3 |
| Hound reward table | Iteration 3 |
| Player defeat condition in boss fight | Iteration 2 (can ship "placeholder defeat screen" but needs resolution) |
| Does difficulty affect spawn table, shields, or starting position? | Iteration 3 |

---

## Migration Notes

No data migration needed — this is a greenfield addition to a client-side app. The new `wildHuntStore` uses a fresh `localStorage` key (`monster-deck-wh-v1`). If the `WildHuntState` shape changes between iterations, bump the version to `monster-deck-wh-v2` and add a migration function in `onRehydrateStorage`. Follow the same versioning convention used in `boardStore` (`monster-deck-board-v1`).
