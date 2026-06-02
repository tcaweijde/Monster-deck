# Implementation Plan: Monster Placement

**Spec:** [`docs/specs/FEAT-001-monster-placement.md`](../specs/FEAT-001-monster-placement.md)
**Created:** 2026-06-02
**Status:** Draft

---

## Summary

This plan implements a persistent board layer that sits above the existing encounter flow. A new `boardStore` manages 3 active `BoardSlot` entries (one per location type: water, mountain, woods), each tracking a monster, an independently-assigned level (1/2/3), and a numbered location. The existing `encounterStore` is unchanged — coordination happens in the component layer. `App.tsx` is rewired to use `boardStore` as the primary navigation driver, replacing the old manual `SetupScreen` flow. Board state persists to `localStorage` via Zustand's `persist` middleware.

---

## Key Design Decisions

1. **`BoardSlot.level` is fully independent of `Monster.level`.** The two are unrelated concepts. `Monster.level` (e.g., foglet = 1, griffin = 2) reflects the monster's design tier; `BoardSlot.level` (1/2/3) is the board assignment that escalates on defeat. `initBoard` assigns levels 1, 2, 3 to the three slots and picks any 3 distinct monsters per level. This is confirmed by SC-008 (pool of exactly 3 monsters, replacement selected regardless of intrinsic level) and by the current data (griffin and werewolf both have `level: 2`).

2. **`boardStore` is independent of `encounterStore`.** Stores do not import each other. The component layer (specifically `BoardScreen`, `EncounterScreen`, and `App.tsx`) calls both stores and orchestrates transitions. This keeps both stores unit-testable in isolation and avoids circular dependencies.

3. **`boardStore` drives top-level navigation; `encounterStore.phase` drives only in-encounter state.** `App.tsx` now reads from `boardStore` first: `!board` → welcome; `activeSlotIndex !== null` → encounter; otherwise → board overview. The existing `encounterStore` `'setup' | 'playing' | 'victory'` phase continues to control the encounter lifecycle as-is.

4. **`setActiveSlot` in `boardStore` marks the slot as `'encountering'`; `clearActiveSlot` reverts it.** This is the mechanism for EC-4 (app refresh mid-encounter reverts slot to `active` on rehydration) and EC-1 (player navigates back mid-combat).

5. **Rehydration guard for `'encountering'` slots is applied in `onRehydrateStorage`.** Zustand's `persist` middleware's `onRehydrateStorage` hook normalises any persisted `'encountering'` slot back to `'active'` and resets `activeSlotIndex` to `null` before the store becomes live.

6. **`EncounterScreen` reads the board level from `boardStore`, not `monster.level`.** The header currently shows `Lv.{monster.level}`. After this change it reads `boardStore.board?.slots[activeSlotIndex]?.level`. The `monster.level` field is no longer shown in the encounter UI for board-mode play.

7. **`shuffle` from `src/engine/shuffle.ts` is reused** for all random selection in `src/engine/board.ts` — picking 3 monsters, assigning location types to slots, and choosing location numbers. Never call `Math.random` directly in engine code.

8. **`VictoryOverlay` button label changes to "Return to Board".** Its `onNewEncounter` prop is renamed to `onClose`. The callback in `EncounterScreen` calls `boardStore.handleVictory()` then `encounterStore.resetToSetup()`. This is a non-breaking prop rename since `VictoryOverlay` is only used in `EncounterScreen`.

9. **`BoardWelcomeScreen` replaces `SetupScreen` as the app entry point.** `SetupScreen`, `MonsterPicker`, and related setup components are left in place but become unreachable through normal navigation. They are not deleted (they may be reused or removed in a future cleanup task).

10. **No changes to `src/engine/` barrel `index.ts`** at this step — `board.ts` is imported directly by `boardStore`. Add it to `src/engine/index.ts` only if a consumer other than the store needs it.

---

## Implementation Steps

### Phase 1: Types

**Step 1.1 — Add new types to `src/types/index.ts`**

Append the following after the existing `EncounterState` interface. Do not modify existing types.

```ts
export type LocationType = 'water' | 'mountain' | 'woods';

export interface Location {
  id: number;       // 1–18
  name: string;
  type: LocationType;
}

export interface BoardSlot {
  locationType: LocationType;    // permanent for this slot's lifetime
  locationId: number;            // FK → Location.id; matches locationType
  monsterId: string;             // FK → Monster.id; unique across all slots
  level: 1 | 2 | 3;             // board-assigned level; escalates on defeat
  status: 'active' | 'encountering';
}

export interface BoardState {
  slots: [BoardSlot, BoardSlot, BoardSlot]; // always exactly 3
}
```

Use a fixed-length tuple `[BoardSlot, BoardSlot, BoardSlot]` to make the "exactly 3 slots" invariant explicit at the type level.

---

### Phase 2: Static Data

**Step 2.1 — Create `src/data/locations.ts`**

```ts
import type { Location } from '../types';

export const LOCATIONS: Location[] = [
  { id:  1, name: 'Kaer Seren',    type: 'water'    },
  { id:  2, name: 'Henfors',       type: 'mountain' },
  { id:  3, name: 'Kaer Morhen',   type: 'mountain' },
  { id:  4, name: 'Ban Aard',      type: 'water'    },
  { id:  5, name: 'Cidaris',       type: 'water'    },
  { id:  6, name: 'Novigrad',      type: 'woods'    },
  { id:  7, name: 'Vizima',        type: 'woods'    },
  { id:  8, name: 'Vengerberg',    type: 'woods'    },
  { id:  9, name: 'Cintra',        type: 'mountain' },
  { id: 10, name: 'Haern Caduch',  type: 'woods'    },
  { id: 11, name: 'Beauclair',     type: 'mountain' },
  { id: 12, name: 'Glenmore',      type: 'water'    },
  { id: 13, name: 'Doldeth',       type: 'mountain' },
  { id: 14, name: 'Loc Ichaer',    type: 'water'    },
  { id: 15, name: 'Gorthur Gvaed', type: 'water'    },
  { id: 16, name: 'Dwywod',        type: 'woods'    },
  { id: 17, name: 'Stygga',        type: 'woods'    },
  { id: 18, name: 'Ard Modron',    type: 'mountain' },
];

/** Returns all locations of a given type. There are always exactly 6 per type. */
export function getLocationsByType(type: LocationType): Location[] {
  return LOCATIONS.filter((l) => l.type === type);
}
```

Add `import type { LocationType } from '../types';` at the top.

---

### Phase 3: Engine

**Step 3.1 — Create `src/engine/board.ts`**

Two pure functions; both accept `rng: () => number = Math.random`.

```ts
import type { Monster, BoardSlot, BoardState, LocationType } from '../types';
import { LOCATIONS } from '../data/locations';
import { shuffle } from './shuffle';

const LOCATION_TYPES: LocationType[] = ['water', 'mountain', 'woods'];

/**
 * Initialises a new board by:
 * 1. Selecting 3 distinct monsters at random from the pool.
 * 2. Shuffling and assigning location types [water, mountain, woods] across the 3 slots.
 * 3. Assigning levels [1, 2, 3] across the 3 slots (shuffled).
 * 4. Picking a random numbered location within each slot's type.
 *
 * Requires monsters.length >= 3.
 */
export function initBoard(
  monsters: Monster[],
  rng: () => number = Math.random,
): BoardState {
  if (monsters.length < 3) {
    throw new Error(`initBoard requires at least 3 monsters, got ${monsters.length}`);
  }

  const selectedMonsters = shuffle(monsters, rng).slice(0, 3);
  const assignedTypes = shuffle([...LOCATION_TYPES], rng) as [LocationType, LocationType, LocationType];
  const assignedLevels = shuffle([1, 2, 3] as (1 | 2 | 3)[], rng) as [1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3];

  const slots = selectedMonsters.map((monster, i): BoardSlot => {
    const locationType = assignedTypes[i];
    const locationsOfType = LOCATIONS.filter((l) => l.type === locationType);
    const location = shuffle(locationsOfType, rng)[0];

    return {
      locationType,
      locationId: location.id,
      monsterId: monster.id,
      level: assignedLevels[i],
      status: 'active',
    };
  }) as [BoardSlot, BoardSlot, BoardSlot];

  return { slots };
}

/**
 * Spawns a replacement monster for a defeated slot:
 * - New level = min(defeated level + 1, 3).
 * - New monster = any monster NOT currently active in the OTHER two slots.
 *   (The defeated monster's slot is vacated, so it IS a valid candidate — SC-008.)
 * - New location = random location within the same type, distinct from the previous location id.
 *
 * Returns a new BoardState; input is not mutated.
 */
export function spawnReplacement(
  board: BoardState,
  slotIndex: 0 | 1 | 2,
  monsters: Monster[],
  rng: () => number = Math.random,
): BoardState {
  const defeated = board.slots[slotIndex];
  const newLevel = Math.min(defeated.level + 1, 3) as 1 | 2 | 3;

  // The defeated slot is being replaced, so only the OTHER two slots block a monster.
  const otherActiveIds = new Set(
    board.slots.filter((_, i) => i !== slotIndex).map((s) => s.monsterId),
  );
  const candidates = monsters.filter((m) => !otherActiveIds.has(m.id));

  if (candidates.length === 0) {
    throw new Error('spawnReplacement: no valid replacement monster candidates');
  }

  const newMonster = shuffle(candidates, rng)[0];

  // New location must be within the same type and differ from the previous location id.
  const locationsOfType = LOCATIONS.filter((l) => l.type === defeated.locationType);
  const locationCandidates = locationsOfType.filter((l) => l.id !== defeated.locationId);
  // locationCandidates always has ≥ 5 entries (6 per type) so this never throws.
  const newLocation = shuffle(locationCandidates, rng)[0];

  const newSlots = board.slots.map((slot, i): BoardSlot =>
    i === slotIndex
      ? {
          locationType: slot.locationType, // permanent — does NOT change
          locationId: newLocation.id,
          monsterId: newMonster.id,
          level: newLevel,
          status: 'active',
        }
      : slot,
  ) as [BoardSlot, BoardSlot, BoardSlot];

  return { slots: newSlots };
}
```

**Gotcha:** `shuffle` is called multiple times with the same `rng` reference. Each call advances the rng state, so the order of `shuffle` calls matters for deterministic tests. Tests must construct a fresh rng sequence that accounts for all shuffle calls in sequence.

---

### Phase 4: Board Store

**Step 4.1 — Create `src/store/boardStore.ts`**

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoardState } from '../types';
import { MONSTERS } from '../data/monsters';
import { initBoard, spawnReplacement } from '../engine/board';

interface BoardStore {
  board: BoardState | null;
  activeSlotIndex: 0 | 1 | 2 | null;

  /** Initialises a new game board with random placement. Overwrites any existing board. */
  initNewGame: () => void;

  /**
   * Marks the slot as 'encountering' and records the active slot index.
   * Call this before launching the encounter in encounterStore.
   */
  setActiveSlot: (index: 0 | 1 | 2) => void;

  /**
   * Reverts the active slot to 'active' and clears activeSlotIndex.
   * Used for EC-1: player navigates back mid-encounter (quit).
   */
  clearActiveSlot: () => void;

  /**
   * Called on encounter victory. Spawns a replacement monster for the active slot,
   * then clears activeSlotIndex.
   */
  handleVictory: () => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      board: null,
      activeSlotIndex: null,

      initNewGame: () => {
        set({ board: initBoard(MONSTERS), activeSlotIndex: null });
      },

      setActiveSlot: (index) => {
        const { board } = get();
        if (!board) return;

        const newSlots = board.slots.map((slot, i) =>
          i === index ? { ...slot, status: 'encountering' as const } : slot,
        ) as BoardState['slots'];

        set({ board: { slots: newSlots }, activeSlotIndex: index });
      },

      clearActiveSlot: () => {
        const { board, activeSlotIndex } = get();
        if (!board || activeSlotIndex === null) return;

        const newSlots = board.slots.map((slot, i) =>
          i === activeSlotIndex ? { ...slot, status: 'active' as const } : slot,
        ) as BoardState['slots'];

        set({ board: { slots: newSlots }, activeSlotIndex: null });
      },

      handleVictory: () => {
        const { board, activeSlotIndex } = get();
        if (!board || activeSlotIndex === null) return;

        const newBoard = spawnReplacement(board, activeSlotIndex, MONSTERS);
        set({ board: newBoard, activeSlotIndex: null });
      },
    }),
    {
      name: 'monster-deck-board-v1',
      onRehydrateStorage: () => (state) => {
        // EC-4: if the app was closed mid-encounter, revert all 'encountering' slots to 'active'.
        if (!state) return;
        if (state.board) {
          state.board = {
            slots: state.board.slots.map((slot) =>
              slot.status === 'encountering' ? { ...slot, status: 'active' } : slot,
            ) as BoardState['slots'],
          };
        }
        state.activeSlotIndex = null;
      },
    },
  ),
);
```

**Gotcha (Zustand v5 persist):** The `onRehydrateStorage` callback mutates the `state` object in-place before it's applied to the store. This is the correct pattern for Zustand v5 — do NOT call `set()` inside `onRehydrateStorage`, as the store is not fully initialised at that point.

**Gotcha (localStorage corruption — EC-5):** Zustand's `persist` middleware silently falls back to the initial state if `JSON.parse` throws. This handles EC-5 with no additional code needed.

---

### Phase 5: New Components

**Step 5.1 — Create `src/components/board/BoardWelcomeScreen.tsx`**

Simple entry point. Single "Start New Game" button.

```tsx
import { useBoardStore } from '../../store/boardStore';

export function BoardWelcomeScreen() {
  const initNewGame = useBoardStore((s) => s.initNewGame);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-500">Monster Deck</h1>
      <p className="text-gray-400 text-center">The Witcher Old World — Solo Play</p>
      <button
        onClick={initNewGame}
        className="w-full max-w-xs py-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg transition-colors"
      >
        Start New Game
      </button>
    </div>
  );
}
```

**Step 5.2 — Create `src/components/board/BoardSlotCard.tsx`**

Displays one slot. Tapping the card triggers the encounter. The `locationType` icon is rendered as a colour-coded text badge (🌊 water / ⛰️ mountain / 🌲 woods) since the spec explicitly says no graphical board map. The `status === 'encountering'` state shows a visual indicator (dimmed + "In combat" label) — though in normal flow the encounter screen covers this immediately, it's visible for the split-second of state transition and during rehydration.

```tsx
import type { BoardSlot } from '../../types';
import { LOCATIONS } from '../../data/locations';

const TYPE_ICON: Record<string, string> = {
  water: '🌊',
  mountain: '⛰️',
  woods: '🌲',
};

interface BoardSlotCardProps {
  slot: BoardSlot;
  monsterName: string;
  onStartEncounter: () => void;
}

export function BoardSlotCard({ slot, monsterName, onStartEncounter }: BoardSlotCardProps) {
  const location = LOCATIONS.find((l) => l.id === slot.locationId);
  const isEncountering = slot.status === 'encountering';

  return (
    <button
      onClick={onStartEncounter}
      disabled={isEncountering}
      className={`w-full text-left p-4 rounded-xl border-2 transition-colors space-y-1 ${
        isEncountering
          ? 'border-red-700 bg-red-900/20 opacity-60'
          : 'border-gray-700 bg-gray-800/50 hover:border-amber-600 active:bg-gray-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-100 text-lg">{monsterName}</span>
        <span className="text-sm font-semibold text-amber-400">Lv.{slot.level}</span>
      </div>
      <div className="text-sm text-gray-400">
        {TYPE_ICON[slot.locationType]} {location?.name ?? '—'}{' '}
        <span className="text-gray-500">#{slot.locationId}</span>
      </div>
      {isEncountering && (
        <div className="text-xs text-red-400 font-semibold">In combat</div>
      )}
    </button>
  );
}
```

**Step 5.3 — Create `src/components/board/BoardScreen.tsx`**

Reads board state from `boardStore` and monster names from the `MONSTERS` array. Calls both `boardStore.setActiveSlot` and `encounterStore.startEncounter` on tap — the component layer coordinates both stores.

```tsx
import { useBoardStore } from '../../store/boardStore';
import { useEncounterStore } from '../../store/encounterStore';
import { MONSTERS } from '../../data/monsters';
import { BoardSlotCard } from './BoardSlotCard';

export function BoardScreen() {
  const board = useBoardStore((s) => s.board);
  const setActiveSlot = useBoardStore((s) => s.setActiveSlot);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  if (!board) return null;

  const getMonsterName = (id: string) =>
    MONSTERS.find((m) => m.id === id)?.name ?? id;

  const handleSlotTap = (index: 0 | 1 | 2) => {
    const slot = board.slots[index];
    setActiveSlot(index);
    startEncounter(slot.monsterId);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-amber-500">Board</h1>
      <p className="text-sm text-gray-400">Tap a monster to begin the encounter.</p>
      <div className="space-y-3">
        {board.slots.map((slot, i) => (
          <BoardSlotCard
            key={slot.locationType}
            slot={slot}
            monsterName={getMonsterName(slot.monsterId)}
            onStartEncounter={() => handleSlotTap(i as 0 | 1 | 2)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### Phase 6: Wire Up App.tsx and EncounterScreen

**Step 6.1 — Update `src/App.tsx`**

Replace the `encounterStore`-driven navigation with `boardStore`-driven navigation.

```tsx
import { useBoardStore } from './store/boardStore';
import { BoardWelcomeScreen } from './components/board/BoardWelcomeScreen';
import { BoardScreen } from './components/board/BoardScreen';
import { EncounterScreen } from './components/encounter/EncounterScreen';

export default function App() {
  const board = useBoardStore((s) => s.board);
  const activeSlotIndex = useBoardStore((s) => s.activeSlotIndex);

  if (!board) return <BoardWelcomeScreen />;
  if (activeSlotIndex !== null) return <EncounterScreen />;
  return <BoardScreen />;
}
```

**Step 6.2 — Update `src/components/encounter/VictoryOverlay.tsx`**

Rename the `onNewEncounter` prop to `onClose` and update the button label. The new label "Return to Board" better reflects the post-board flow.

```tsx
interface VictoryOverlayProps {
  monsterName: string;
  onClose: () => void;  // was: onNewEncounter
}

export function VictoryOverlay({ monsterName, onClose }: VictoryOverlayProps) {
  return (
    // ... existing layout ...
    <button onClick={onClose} className="...">
      Return to Board
    </button>
  );
}
```

**Step 6.3 — Update `src/components/encounter/EncounterScreen.tsx`**

Three changes:
1. Read the board-assigned level for the header (`Lv.X`).
2. Update the `VictoryOverlay` callback: call `boardStore.handleVictory()` then `encounterStore.resetToSetup()`.
3. Update the "Quit" button callback: call `boardStore.clearActiveSlot()` then `encounterStore.resetToSetup()`.

```tsx
// Add to existing imports:
import { useBoardStore } from '../../store/boardStore';

// Inside EncounterScreen():
const activeSlotIndex = useBoardStore((s) => s.activeSlotIndex);
const boardSlots = useBoardStore((s) => s.board?.slots);
const handleVictory = useBoardStore((s) => s.handleVictory);
const clearActiveSlot = useBoardStore((s) => s.clearActiveSlot);

// Derive the level to display — falls back to monster.level if board is not active
// (graceful fallback for any future standalone-encounter use):
const displayLevel =
  activeSlotIndex !== null ? (boardSlots?.[activeSlotIndex]?.level ?? monster?.level) : monster?.level;

// Replace resetToSetup reference in Quit button:
const handleQuit = () => {
  clearActiveSlot();
  resetToSetup();
};

// Replace VictoryOverlay usage:
<VictoryOverlay
  monsterName={monster.name}
  onClose={() => {
    handleVictory();
    resetToSetup();
  }}
/>

// Replace header level display:
<span className="text-sm text-gray-500">Lv.{displayLevel}</span>
```

---

### Phase 7: Tests

**Step 7.1 — Create `src/engine/__tests__/board.test.ts`**

Use the same deterministic-`rng` pattern as `deck.test.ts`. Key test groups:

```
describe('initBoard')
  ├─ picks exactly 3 distinct monsters from the pool
  ├─ assigns each slot a unique location type (water/mountain/woods — one each)
  ├─ assigns each slot a valid location id that matches its type
  ├─ assigns levels 1, 2, 3 — one each (order may vary)
  ├─ throws when pool has fewer than 3 monsters
  └─ produces consistent output for the same rng sequence (determinism)

describe('spawnReplacement')
  ├─ level 1 → replacement is level 2
  ├─ level 2 → replacement is level 3
  ├─ level 3 → replacement stays level 3 (SC-006)
  ├─ new location id differs from previous (EC-2)
  ├─ new location type is the same as the defeated slot's type
  ├─ replacement monster is not one of the other two active monsters (SC-007)
  ├─ pool of exactly 3: defeated monster is a valid candidate (SC-008)
  └─ other two slots are unchanged after replacement
```

**Testing pattern for `initBoard` invariants:** With a pool of 4+ monsters and a seeded rng, capture the result and assert the invariants structurally (distinct monsterId, distinct locationType, level set = {1,2,3}).

**Testing pattern for `spawnReplacement` SC-008:** Create a board with monsters A and B on the two non-target slots; C on the target slot. Defeat C. Assert that one of {A, B, C} is selected and it is not A or B.

**Step 7.2 — Create `src/store/__tests__/boardStore.test.ts`**

Follow the exact pattern from `encounterStore.test.ts`:
- `vi.mock('../../data/monsters', ...)` with 4 deterministic test monsters (so replacement always has a valid candidate)
- `vi.mock('../../engine/board', ...)` to control `initBoard` and `spawnReplacement` return values
- Import the store AFTER `vi.mock` calls
- Use `renderHook` + `act` for hook assertions
- Call `.getState()` for direct store action tests

Key test groups:
```
describe('initial state')
  └─ board is null, activeSlotIndex is null

describe('initNewGame')
  ├─ sets board from initBoard mock
  └─ clears any previous activeSlotIndex

describe('setActiveSlot')
  ├─ sets activeSlotIndex
  └─ marks target slot status to 'encountering'

describe('clearActiveSlot')
  ├─ clears activeSlotIndex to null
  └─ reverts slot status to 'active'

describe('handleVictory')
  ├─ calls spawnReplacement with correct slotIndex
  ├─ updates board from spawnReplacement result
  └─ clears activeSlotIndex

describe('rehydration (EC-4)')
  └─ any slot with status 'encountering' is reverted to 'active' on load
```

For the rehydration test: call `onRehydrateStorage` directly by constructing a fake state object and passing it through the callback, then asserting the mutation. Do NOT use `localStorage` directly in tests.

---

## File Inventory

### New Files

| Path | Purpose |
|---|---|
| `src/data/locations.ts` | 18 static location records + `getLocationsByType` helper |
| `src/engine/board.ts` | `initBoard(monsters, rng)` and `spawnReplacement(board, slotIndex, monsters, rng)` |
| `src/engine/__tests__/board.test.ts` | Unit tests for both engine functions |
| `src/store/boardStore.ts` | Zustand store with `persist` middleware; manages `BoardState` and `activeSlotIndex` |
| `src/store/__tests__/boardStore.test.ts` | Store action tests + rehydration guard test |
| `src/components/board/BoardWelcomeScreen.tsx` | App entry point; "Start New Game" button |
| `src/components/board/BoardScreen.tsx` | Board overview; lists 3 `BoardSlotCard` entries |
| `src/components/board/BoardSlotCard.tsx` | Single slot card; tap to start encounter |

### Modified Files

| Path | What Changes |
|---|---|
| `src/types/index.ts` | Append `LocationType`, `Location`, `BoardSlot`, `BoardState` |
| `src/App.tsx` | Replace `encounterStore`-driven phase check with `boardStore`-driven 3-way render |
| `src/components/encounter/EncounterScreen.tsx` | Read level from board slot; updated Quit and Victory callbacks |
| `src/components/encounter/VictoryOverlay.tsx` | Rename `onNewEncounter` → `onClose`; relabel button "Return to Board" |

---

## Testing Strategy

### Engine Tests (`src/engine/__tests__/board.test.ts`)

Test `initBoard` and `spawnReplacement` as pure functions with no mocks. Construct minimal `Monster` stubs (id + name only needed) and use deterministic rng lambdas (`() => 0`, `() => 0.999`, cycling sequences). Assert structural invariants (set equality, range checks) rather than specific output values, except for determinism tests where exact output is expected.

For `spawnReplacement` edge cases, directly construct `BoardState` objects — no store needed.

### Store Tests (`src/store/__tests__/boardStore.test.ts`)

Mock both `../../data/monsters` (return 4 test monsters) and `../../engine/board` (return controlled `BoardState` values). This keeps store tests fast and independent of engine logic. Store tests assert state transitions only; correctness of replacement logic is covered by engine tests.

For EC-4 rehydration, extract and call the `onRehydrateStorage` function inline — this avoids any need to interact with `localStorage` in tests.

### Integration Verification (manual, not automated for this plan)

1. Start app → `BoardWelcomeScreen` shown.
2. "Start New Game" → `BoardScreen` shows 3 slots with distinct types and levels.
3. Tap slot → `EncounterScreen` shows correct monster name and board level.
4. Defeat monster → `BoardScreen` shows replacement with escalated level and new location.
5. Refresh app mid-encounter → board restored, slot reverted to `active`.
6. Refresh app after a game → board state fully restored.

---

## Migration Notes

- **No data migration needed.** This is a net-new `localStorage` key (`monster-deck-board-v1`). The existing encounterStore does not persist; it has no key to migrate.
- **Backwards compatibility:** The old `encounterStore.phase === 'setup'` navigation path in `App.tsx` is removed. Any previously bookmarked/cached state in the encounter store is irrelevant on first load (the encounter store starts fresh; its `phase` is no longer the App routing gate).
- **`SetupScreen` and `MonsterPicker`:** Left in place but unreachable via normal navigation. No import cleanup is required for this plan. Schedule removal as a follow-up task once the board flow is confirmed stable.
- **localStorage key versioning:** The key `monster-deck-board-v1` is intentionally versioned. If the `BoardState` shape changes in a future release, bump to `v2` to force a clean rehydration rather than attempting a migration.
