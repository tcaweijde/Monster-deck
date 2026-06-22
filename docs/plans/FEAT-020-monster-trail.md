# Implementation Plan: Monster Trail Expansion

**Spec:** [`docs/specs/FEAT-020-monster-trail.md`](../specs/FEAT-020-monster-trail.md)
**Created:** 2026-06-16
**Status:** Implemented

---

## Implementation Notes (post-plan changes)

The following design decisions were made or refined during implementation and differ from or extend the original plan:

- **`PlacedWeaknessToken`** — A new type `PlacedWeaknessToken = WeaknessToken & { locationId: number }` was introduced. When a token is drawn onto the board it is automatically assigned a specific `Location` (same terrain type). This replaces the original plan of "player picks a matching terrain location themselves". The placement screen shows the location art, number, and name — identical to the `BoardSlotCard` image pattern. A **Redraw** button lets the player get a different location if their character is standing there.
- **`TerrainType` = 3 values** — Confirmed as `'water' | 'mountain' | 'woods'`, matching `LocationType` exactly. The original plan left this open; it was resolved before implementation.
- **`weaknessTokenBoard` length = 3** — One token per terrain type (not 6 as originally estimated). The pool has 2 tokens per terrain type; the board draws 1 per type.
- **Image loading** — All location images use `import.meta.env.BASE_URL` + `onError` fallback to `fallback.png`, matching the `BoardSlotCard` convention.
- **`redrawTokenLocation` action** — Added to `trailStore`; reassigns a new location to a board token without changing the token's effect. Resets `placementConfirmed` for that token so the player must re-confirm after redrawing.

---

## Summary

FEAT-020 layers the Monster Trail expansion onto the existing board+encounter loop via a single `trailModeEnabled` toggle set once at game start. A new dedicated `trailStore` (persisted, key `monster-deck-trail-v1`) owns all Trail session state — weakness token board, player-held tokens, pending pre-fight effects, and placement progress. The encounter engine's `generateDeck` is extended with an optional `TrailDeckOptions` parameter to inject trail special cards and apply weakness effects; `encounterStore` gains lightweight trail fields that propagate draw- and discard-triggers into the UI. Eight new components handle the four Trail UI surfaces: game-start toggle, placement checklist, board token panel, pre-fight selection modal, and in-encounter ability alerts. When Trail Mode is off the feature is completely invisible — zero branching in the engine, zero UI change.

---

## Key Design Decisions

1. **Trail state lives in a new `trailStore`, not folded into `boardStore` or `encounterStore`.** Trail mechanics span both the board phase (token claiming, pre-fight declaration) and the encounter phase (card triggers, bonus reward). Folding Trail state into either existing store would introduce cross-phase coupling. A dedicated store mirrors the existing Wild Hunt store pattern (`wildHuntStore.ts`) and keeps all three stores independently testable.

2. **Trail special cards enter the deck as regular `MonsterCard` entries with the naming convention `trail-special-{n}` (`trail-special-1` … `trail-special-4`).** Detection at flip/discard time is a single `startsWith` check; no union type is required in the deck; the engine stays purely `MonsterCard[]`. The draw and discard abilities are looked up at the moment of the event from `encounterStore.activeTrailCards` (a copy of the monster's `trailCards` tuple stored at encounter start).

3. **Trail special cards are appended to the standard deck selection, then the combined deck is re-shuffled once.** `reduceDeckSize` is applied to the standard selection only (before trail cards are added). `removeSpecialCard` filters out the targeted trail card before it is appended. This matches physical play and means the two weakness effects can be applied independently.

4. **`generateDeck` is extended with a trailing optional `trailOptions?: TrailDeckOptions` parameter.** All four existing callers pass positional arguments and continue to compile unchanged. Using an options object rather than more positional params avoids a six-argument signature.

5. **The pre-fight token screen is local React state inside `BoardScreen`, not a new app-level screen.** `BoardScreen` tracks `pendingSlotIndex: 0|1|2|null` in `useState`. When set in trail mode, it renders the `TrailPreFightModal` overlay; on confirm it calls `boardStore.setActiveSlot` + `encounterStore.startEncounter` in the correct order. This keeps App.tsx clean and avoids storing UI flow state in any store.

6. **`bonusRewardActive` lives in `encounterStore`, not `trailStore`.** The bonus reward flag is per-encounter and must survive only until the victory screen is dismissed. `encounterStore` owns all per-encounter flags; `resetToSetup` clears it. Storing it in the persisted `trailStore` would create a stale-flag hazard on app reload.

7. **App.tsx adds a single new `'trail-placement'` screen.** Condition: `trailModeEnabled && weaknessTokenBoard.length > 0 && placementConfirmed.length < weaknessTokenBoard.length`. This fires at two moments — immediately after `initNewGame` with trail mode on, and immediately after each `handleVictoryReset` — with no additional state machine needed.

8. **`DiscardAlert` (global monster ability) handles all discard events including trail special cards.** `TrailDiscardAlert` was removed — trail cards do not carry a separate `discardAbility`; when a trail special card is discarded, the monster's global `discardAbility` fires through the existing `DiscardAlert` path. This simplifies the discard flow and eliminates a redundant alert component.

9. **`TerrainType` (3 values: water, mountain, woods) is distinct from the existing `LocationType` (3 values: water, mountain, woods).** They model different physical concepts: `LocationType` is the digital board slot biome; `TerrainType` is the physical token placement terrain from the Trail expansion. They intentionally overlap for 3 values and are never conflated in code.

10. **`useEncounterHandlers.ts` is the single place that calls `trailStore.handleVictoryReset()` on base-game victory.** The hook already orchestrates multi-store calls for Wild Hunt vs base game; adding the trail store call there is consistent with the established pattern and avoids duplicating victory logic in components.

11. **Monster `trailCards` data authoring is complete.** All 29 monsters have `discardAbility` and `trailCards` draw-ability text authored. `TrailCard.discardAbility` was removed as a design revision — trail cards only carry a `drawAbility`; discard events on trail cards are handled by the monster's global `discardAbility`.

---

## Implementation Steps

### Phase 1: Types

**Step 1.1 — Add Trail types to `src/types/index.ts`**

Append after the existing `BoardState` interface. Do not modify any existing types.

```ts
// ─── Monster Trail types (FEAT-020) ──────────────────────────────────────────

export type TerrainType =
  | 'water'
  | 'mountain'
  | 'woods';

export type WeaknessEffectType =
  | 'combatAdvantage'    // player goes first regardless of initiative
  | 'reduceDeckSize'     // remove effectMagnitude cards from the standard deck
  | 'removeSpecialCard'  // remove trail card numbered effectMagnitude
  | 'bonusReward';       // show bonus reward prompt on victory

export interface WeaknessToken {
  id: string;
  terrainType: TerrainType;
  effectType: WeaknessEffectType;
  /** Present for reduceDeckSize (cards to remove) and removeSpecialCard (trail card number 1–4). */
  effectMagnitude?: number;
}

export interface TrailCard {
  number: 1 | 2 | 3 | 4;
  /** Shown immediately when the monster flips this card (draw trigger). */
  drawAbility: MonsterAbility;
  // Note: discardAbility was removed — when a trail card is discarded,
  // the monster's global discardAbility fires through the standard DiscardAlert path.
}
```

**Step 1.2 — Extend the `Monster` interface**

Add one optional field inside the existing `Monster` interface (after `cardFrontImages?`):

```ts
/**
 * Monster Trail expansion: exactly 4 numbered special cards.
 * Present only for monsters that appear in the Trail expansion.
 * When Trail Mode is on and this field is defined, all four cards are appended to the encounter deck.
 */
trailCards?: [TrailCard, TrailCard, TrailCard, TrailCard];
```

No existing fields change. No existing callers need updating.

---

### Phase 2: Engine — `src/engine/trail.ts`

New file of pure functions. All random draws accept an injectable `rng: () => number = Math.random`.

```ts
import type { MonsterCard, TrailCard, TerrainType, WeaknessToken } from '../types';

// ─── Trail card ID convention ─────────────────────────────────────────────────

export const TRAIL_CARD_ID_PREFIX = 'trail-special-';

export function isTrailSpecialCard(cardId: string): boolean {
  return cardId.startsWith(TRAIL_CARD_ID_PREFIX);
}

/** Returns 1–4, or null if the cardId does not follow the trail special card convention. */
export function getTrailCardNumber(cardId: string): 1 | 2 | 3 | 4 | null {
  if (!isTrailSpecialCard(cardId)) return null;
  const n = parseInt(cardId.slice(TRAIL_CARD_ID_PREFIX.length), 10);
  return n >= 1 && n <= 4 ? (n as 1 | 2 | 3 | 4) : null;
}

/**
 * Converts a TrailCard to a MonsterCard for inclusion in the encounter deck.
 * The card has only a `top` half (no `bottom`) — a single-half card per the FEAT-004 comment
 * on the MonsterCard interface.
 */
export function trailCardToMonsterCard(tc: TrailCard): MonsterCard {
  return {
    id: `${TRAIL_CARD_ID_PREFIX}${tc.number}`,
    top: {
      name: `Special Card ${tc.number}`,
      effect: tc.drawAbility.description,
    },
    // bottom is absent — MonsterCard.bottom is already optional
  };
}

// ─── Weakness token draw ──────────────────────────────────────────────────────

/**
 * Draws one random token of the given terrain type from the pool.
 * Returns { token: null } if the pool has no token for that terrain type (NFR-005 / EC-4).
 */
export function drawTokenForTerrain(
  pool: WeaknessToken[],
  terrainType: TerrainType,
  rng: () => number = Math.random,
): { token: WeaknessToken | null; remainingPool: WeaknessToken[] } {
  const candidates = pool.filter((t) => t.terrainType === terrainType);
  if (candidates.length === 0) return { token: null, remainingPool: pool };
  const idx = Math.floor(rng() * candidates.length);
  const token = candidates[idx];
  return { token, remainingPool: pool.filter((t) => t.id !== token.id) };
}

/** All terrain types used in the Trail expansion. One token per type on the board. */
export const ALL_TERRAIN_TYPES: TerrainType[] = [
  'water', 'mountain', 'woods', 'plains', 'city', 'ruins',
];

/**
 * Initialises a fresh 6-token board by drawing one token per terrain type from the pool.
 * If the pool is exhausted for a terrain type, that slot is omitted and a warning is logged (NFR-005).
 * Returns the board tokens and the remaining pool (mutually exclusive with board).
 */
export function initWeaknessTokenBoard(
  pool: WeaknessToken[],
  rng: () => number = Math.random,
): { board: WeaknessToken[]; remainingPool: WeaknessToken[] } {
  let remaining = [...pool];
  const board: WeaknessToken[] = [];
  for (const terrainType of ALL_TERRAIN_TYPES) {
    const result = drawTokenForTerrain(remaining, terrainType, rng);
    if (result.token) {
      board.push(result.token);
      remaining = result.remainingPool;
    } else {
      console.warn(`[Trail] Token pool exhausted for terrain "${terrainType}" — slot skipped.`);
    }
  }
  return { board, remainingPool: remaining };
}
```

---

### Phase 3: Engine — Extend `src/engine/deck.ts`

**Step 3.1 — Add `TrailDeckOptions` interface and import `trailCardToMonsterCard`**

```ts
import { trailCardToMonsterCard } from './trail';
import type { TrailCard } from '../types';

export interface TrailDeckOptions {
  /**
   * The monster's 4 Trail special cards.
   * They are appended to the final shuffled deck (FR-007).
   */
  trailCards?: [TrailCard, TrailCard, TrailCard, TrailCard];
  /**
   * Remove this many cards from the standard card selection (reduceDeckSize effect).
   * Capped at the selection size — EC-3: monster starts encounter with empty standard deck.
   */
  removeCount?: number;
  /**
   * Exclude these trail card numbers from the appended cards (removeSpecialCard effect).
   * If a number is listed but the card was not going to be included anyway, this is a silent no-op (EC-2).
   */
  excludeTrailNumbers?: (1 | 2 | 3 | 4)[];
}
```

**Step 3.2 — Extend `generateDeck` signature with optional fifth parameter**

The existing four positional parameters are unchanged. All current callers continue to compile without modification.

```ts
export function generateDeck(
  monster: Monster,
  rng?: () => number,
  genericCards: MonsterCard[] = [],
  bonusCount: number = 0,
  trailOptions?: TrailDeckOptions,
): MonsterCard[] {
  const size = monster.deckSize + bonusCount;
  const pool = [...monster.cardPool, ...genericCards];

  if (pool.length < size) {
    throw new Error(`Monster "${monster.id}" has ${pool.length} cards but needs ${size}`);
  }

  const shuffledPool = shuffle(pool, rng);
  let selected = shuffledPool.slice(0, size);

  // Apply reduceDeckSize weakness effect (EC-3: floor at 0)
  if (trailOptions?.removeCount && trailOptions.removeCount > 0) {
    const count = Math.min(trailOptions.removeCount, selected.length);
    selected = selected.slice(count);
  }

  // Append trail special cards, excluding any filtered by removeSpecialCard effect (EC-2: silent no-op)
  if (trailOptions?.trailCards) {
    const excluded = new Set(trailOptions.excludeTrailNumbers ?? []);
    const trailMonsterCards = trailOptions.trailCards
      .filter((tc) => !excluded.has(tc.number))
      .map(trailCardToMonsterCard);
    selected = [...selected, ...trailMonsterCards];
  }

  // Re-shuffle the full combined deck (trail cards distributed throughout, matching physical play)
  return shuffle(selected, rng);
}
```

---

### Phase 4: Static Data

**Step 4.1 — Create `src/data/weaknessTokenPool.ts`**

This file defines the complete static pool of `WeaknessToken` objects transcribed from the physical Monster Trail expansion rulebook.

> ⚠️ **Authoring required before 3.0 ships.** The content of this file is blocked on OQ-1 (terrain type count) and OQ-4 (bonusReward reward pool). Use the structure below; populate exact tokens from the physical rulebook.

```ts
import type { WeaknessToken } from '../types';

/**
 * Full pool of weakness tokens from the Monster Trail expansion.
 * AUTHORING REQUIRED: transcribe all tokens from the physical rulebook before 3.0.
 */
export const WEAKNESS_TOKEN_POOL: WeaknessToken[] = [
  // Example entries — replace with actual rulebook content:
  { id: 'wt-w-01', terrainType: 'water',    effectType: 'combatAdvantage' },
  { id: 'wt-m-01', terrainType: 'mountain', effectType: 'reduceDeckSize',  effectMagnitude: 2 },
  { id: 'wt-o-01', terrainType: 'woods',    effectType: 'removeSpecialCard', effectMagnitude: 1 },
  { id: 'wt-p-01', terrainType: 'plains',   effectType: 'bonusReward' },
  { id: 'wt-c-01', terrainType: 'city',     effectType: 'combatAdvantage' },
  { id: 'wt-r-01', terrainType: 'ruins',    effectType: 'reduceDeckSize',  effectMagnitude: 3 },
  // ... all tokens from all terrain types
];
```

**Step 4.2 — Author `trailCards` for each Trail expansion monster**

For each monster file in `src/data/monsters/` that appears in the physical Trail expansion, add the `trailCards` field. Import `TrailCard` from `../../types`.

> ⚠️ **Authoring required before 3.0 ships (NFR-004).** Ability text must be transcribed from the physical rulebook — do not ship empty strings. The structure below is a template only.

```ts
// Excerpt from e.g. src/data/monsters/griffin.ts
import type { Monster, TrailCard } from '../../types';

const trailCards: [TrailCard, TrailCard, TrailCard, TrailCard] = [
  {
    number: 1,
    drawAbility: { name: '...', description: '...', trigger: 'passive' },
  },
  // numbers 2, 3, 4 ...
];

export const griffin: Monster = {
  // ... all existing fields unchanged
  trailCards,
};
```

> ✅ **Authoring complete (2026-06-22).** All 29 monsters have full ability text.
> All 29 monsters in `src/data/monsters/index.ts` carry `trailCards`.

---

### Phase 5: Trail Store — `src/store/trailStore.ts`

New file. Persisted via Zustand `persist` middleware (localStorage key `monster-deck-trail-v1`). Manages the entire Trail session lifecycle. Does not import `boardStore` or `encounterStore`.

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeaknessToken, TerrainType } from '../types';
import { WEAKNESS_TOKEN_POOL } from '../data/weaknessTokenPool';
import { initWeaknessTokenBoard, drawTokenForTerrain } from '../engine/trail';

interface TrailStore {
  trailModeEnabled: boolean;
  /** Tokens not yet drawn onto the board. */
  tokenPool: WeaknessToken[];
  /** The 6 tokens currently placed on the physical board (one per terrain type). */
  weaknessTokenBoard: WeaknessToken[];
  /** Token IDs the player has physically confirmed placing. Drives the placement checklist. */
  placementConfirmed: string[];
  /** Tokens in the player's hand (claimed but not yet applied to a fight). */
  weaknessTokensHeld: WeaknessToken[];
  /** Token declared before the current fight; consumed immediately after encounter starts. */
  pendingWeaknessEffect: WeaknessToken | null;

  /** Call at new game start (before boardStore.initNewGame). Resets all trail state to defaults. */
  resetTrailSession: () => void;
  /** Enable trail mode and draw the initial 6-token board. Call after resetTrailSession. */
  startTrailSession: (rng?: () => number) => void;
  /** Player confirms a board token has been physically placed on the table. */
  confirmTokenPlaced: (tokenId: string) => void;
  /** Player claims a board token; a replacement is immediately drawn for the same terrain slot. */
  claimToken: (tokenId: string, rng?: () => number) => void;
  /** Move a held token to pendingWeaknessEffect (pre-fight declaration). Removes it from weaknessTokensHeld. */
  setPendingEffect: (token: WeaknessToken) => void;
  /** Consume pendingWeaknessEffect. Call immediately after encounterStore.startEncounter. */
  clearPendingEffect: () => void;
  /** Post-defeat board reset: discard board tokens back to pool, re-draw 6 fresh tokens. Held tokens are NOT cleared (FR-030). */
  handleVictoryReset: (rng?: () => number) => void;
}

const INITIAL_STATE = {
  trailModeEnabled: false,
  tokenPool: [...WEAKNESS_TOKEN_POOL],
  weaknessTokenBoard: [] as WeaknessToken[],
  placementConfirmed: [] as string[],
  weaknessTokensHeld: [] as WeaknessToken[],
  pendingWeaknessEffect: null as WeaknessToken | null,
};

export const useTrailStore = create<TrailStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      resetTrailSession: () =>
        set({ ...INITIAL_STATE, tokenPool: [...WEAKNESS_TOKEN_POOL] }),

      startTrailSession: (rng = Math.random) => {
        const { tokenPool } = get();
        const { board, remainingPool } = initWeaknessTokenBoard(tokenPool, rng);
        set({
          trailModeEnabled: true,
          tokenPool: remainingPool,
          weaknessTokenBoard: board,
          placementConfirmed: [],
        });
      },

      confirmTokenPlaced: (tokenId) => {
        const { placementConfirmed } = get();
        if (placementConfirmed.includes(tokenId)) return; // idempotent
        set({ placementConfirmed: [...placementConfirmed, tokenId] });
      },

      claimToken: (tokenId, rng = Math.random) => {
        const { weaknessTokenBoard, weaknessTokensHeld, tokenPool, placementConfirmed } = get();
        const token = weaknessTokenBoard.find((t) => t.id === tokenId);
        if (!token) return;

        // Draw replacement for the same terrain slot (FR-019, OQ-3 resolved as same-terrain)
        const { token: replacement, remainingPool } = drawTokenForTerrain(tokenPool, token.terrainType, rng);
        if (!replacement) {
          console.warn(`[Trail] Token pool exhausted for terrain "${token.terrainType}" — slot empty (EC-4).`);
        }

        const newBoard = weaknessTokenBoard
          .filter((t) => t.id !== tokenId)
          .concat(replacement ? [replacement] : []);

        set({
          weaknessTokenBoard: newBoard,
          tokenPool: remainingPool,
          weaknessTokensHeld: [...weaknessTokensHeld, token],
          // Replacement needs physical placement confirmation — remove old confirmed entry
          placementConfirmed: placementConfirmed.filter((id) => id !== tokenId),
        });
      },

      setPendingEffect: (token) => {
        const { weaknessTokensHeld } = get();
        set({
          pendingWeaknessEffect: token,
          weaknessTokensHeld: weaknessTokensHeld.filter((t) => t.id !== token.id),
        });
      },

      clearPendingEffect: () => set({ pendingWeaknessEffect: null }),

      handleVictoryReset: (rng = Math.random) => {
        const { tokenPool, weaknessTokenBoard } = get();
        // FR-028: discard board tokens; return them to pool for redraw
        const returnedPool = [...tokenPool, ...weaknessTokenBoard];
        const { board, remainingPool } = initWeaknessTokenBoard(returnedPool, rng);
        set({
          tokenPool: remainingPool,
          weaknessTokenBoard: board,
          placementConfirmed: [],
          pendingWeaknessEffect: null,
          // weaknessTokensHeld is intentionally NOT cleared (FR-030)
        });
      },
    }),
    {
      name: 'monster-deck-trail-v1',
      onRehydrateStorage: () => (_state) => {
        // NFR-003: Zustand's persist middleware silently falls back to INITIAL_STATE if JSON.parse
        // throws (corrupt data). No additional guard needed here.
      },
    },
  ),
);
```

---

### Phase 6: EncounterStore — `src/store/encounterStore.ts`

**Step 6.1 — Add trail fields to the `EncounterStore` interface**

```ts
/** The 4 Trail special cards for this encounter. null when trail mode is off or monster has none. */
activeTrailCards: [TrailCard, TrailCard, TrailCard, TrailCard] | null;
/** Set when the monster flips a trail special card. Cleared by clearTrailDrawAbility(). */
pendingTrailDrawAbility: MonsterAbility | null;
/** Set when the player discards a trail special card. Cleared alongside lastDiscardedCard. */
lastTrailDiscardAbility: MonsterAbility | null;
/** True for this encounter when a bonusReward weakness token was applied. */
bonusRewardActive: boolean;

clearTrailDrawAbility: () => void;
```

Add to imports: `import type { TrailCard, TrailDeckOptions } from '../types';` and `import { TrailDeckOptions } from '../engine/deck';` and `import { isTrailSpecialCard, getTrailCardNumber } from '../engine/trail';`.

**Step 6.2 — Add to initial state**

```ts
activeTrailCards: null,
pendingTrailDrawAbility: null,
lastTrailDiscardAbility: null,
bonusRewardActive: false,
```

**Step 6.3 — Extend `startEncounter` with trail parameters**

The extended signature (all new params are optional with defaults; existing callers unaffected):

```ts
startEncounter: (
  monsterId: string,
  playerFirst?: boolean,
  bonusCards?: number,
  trailDeckOptions?: TrailDeckOptions,
  activeTrailCards?: [TrailCard, TrailCard, TrailCard, TrailCard] | null,
  bonusRewardActive?: boolean,
) => void
```

In the implementation body, pass `trailDeckOptions` as the fifth argument to `generateDeck`:
```ts
const deck = generateDeck(monster, undefined, [], bonusCards ?? 0, trailDeckOptions);
```

And extend the `set()` call:
```ts
set({
  // ... all existing fields
  activeTrailCards: activeTrailCards ?? null,
  pendingTrailDrawAbility: null,
  lastTrailDiscardAbility: null,
  bonusRewardActive: bonusRewardActive ?? false,
});
```

**Step 6.4 — Add a module-level helper (not exported)**

```ts
/** Returns the discardAbility of the first trail special card found in discardedCards, or null. */
function findTrailDiscardAbility(
  discardedCards: MonsterCard[],
  activeTrailCards: [TrailCard, TrailCard, TrailCard, TrailCard] | null,
): MonsterAbility | null {
  if (!activeTrailCards) return null;
  for (const card of discardedCards) {
    if (isTrailSpecialCard(card.id)) {
      const num = getTrailCardNumber(card.id);
      const tc = num !== null ? activeTrailCards.find((c) => c.number === num) : undefined;
      if (tc) return tc.discardAbility;
    }
  }
  return null;
}
```

**Step 6.5 — Extend `flipMonsterCard`**

After `set({ currentCard: result.revealed, ... })`, add trail draw-trigger detection:

```ts
flipMonsterCard: () => {
  const { deck, activeTrailCards } = get();
  const result = flipCard(deck);
  if (!result) return;

  let pendingTrailDrawAbility: MonsterAbility | null = null;
  if (activeTrailCards && isTrailSpecialCard(result.revealed.cardId)) {
    const num = getTrailCardNumber(result.revealed.cardId);
    const tc = num !== null ? activeTrailCards.find((c) => c.number === num) : undefined;
    if (tc) pendingTrailDrawAbility = tc.drawAbility;
  }

  set({
    currentCard: result.revealed,
    deck: result.remainingDeck,
    lastDiscardTriggered: false,
    phase: 'playing',
    pendingTrailDrawAbility,
  });
},
```

**Step 6.6 — Extend `discardOne` and `applyPlayerDamage`**

In both actions, after `const result = applyDamage(...)`, add:

```ts
const lastTrailDiscardAbility = findTrailDiscardAbility(result.discardedCards, get().activeTrailCards);
```

Then include `lastTrailDiscardAbility` in the `set()` call alongside the existing fields.

**Step 6.7 — Extend `passTurn` and `resetToSetup`**

`passTurn`: add `pendingTrailDrawAbility: null` to the `set()` call.

`resetToSetup`: add all four trail fields to the `set()` call:
```ts
activeTrailCards: null,
pendingTrailDrawAbility: null,
lastTrailDiscardAbility: null,
bonusRewardActive: false,
```

**Step 6.8 — Add `clearTrailDrawAbility` action**

```ts
clearTrailDrawAbility: () => set({ pendingTrailDrawAbility: null }),
```

---

### Phase 7: New Trail Components

All components live in `src/components/trail/`. Follow the mobile-first touch target size convention (min 44×44 px interactive areas).

**Step 7.1 — `TrailModeToggle.tsx`**

Simple controlled toggle. Props: `enabled: boolean`, `onChange: (v: boolean) => void`. Renders a labelled toggle button with clear "Trail Mode ON / OFF" visual state. No store access — purely presentational.

**Step 7.2 — `TrailTokenPlacementScreen.tsx`**

Reads `useTrailStore`. Renders a full-screen checklist with one row per `weaknessTokenBoard` entry, showing: terrain type (with emoji), effect type label, and a "Confirm placed ✓" button. Each tap calls `trailStore.confirmTokenPlaced(token.id)`. Already-confirmed tokens show a checkmark and a muted style. A progress indicator shows "N of 6 placed". When `placementConfirmed.length === weaknessTokenBoard.length`, App.tsx automatically transitions to `'board'` — no navigation call needed from this component.

**Step 7.3 — `TrailTokenBoard.tsx`**

Reads `useTrailStore`. Renders two sections below the board slot list in `BoardScreen`:
1. **"Weakness Tokens on Board"** — a compact card-style list showing each board token's terrain type, effect type, and a "Claim" button. Tapping "Claim" calls `trailStore.claimToken(token.id)`.
2. **"Tokens Held: N"** — a count badge, expandable to show the list of held tokens (terrain + effect).

When `weaknessTokenBoard.length === 0`, this section is hidden.

**Step 7.4 — `TrailPreFightModal.tsx`**

Full-screen overlay rendered inside `BoardScreen` when `pendingSlotIndex !== null` in trail mode.

Props:
```ts
interface TrailPreFightModalProps {
  heldTokens: WeaknessToken[];
  onConfirm: (token: WeaknessToken | null) => void; // null = skip
  onCancel: () => void;
}
```

Layout:
- Header: "Pre-Fight — Apply Weakness Token?"
- If `heldTokens.length === 0`: shows "No tokens held" message; only "Start Fight" button (EC-5).
- If tokens exist: list of tappable token rows (one selection at a time); "Apply Token" confirm button; "Skip" button.

Internally manages `selectedToken: WeaknessToken | null` state. On "Apply Token": calls `onConfirm(selectedToken)`. On "Skip": calls `onConfirm(null)`. On cancel/back: calls `onCancel()` (resets `pendingSlotIndex` without starting the encounter).

**Step 7.5 — `TrailDrawAlert.tsx`**

Identical lifecycle to `DiscardAlert` (show on trigger, auto-dismiss after 3000ms, dismissible by tap). Styled in amber/gold to distinguish draw triggers from discard reactions.

Props:
```ts
interface TrailDrawAlertProps {
  ability: MonsterAbility;
  cardNumber: 1 | 2 | 3 | 4;
  triggered: boolean;
  onDismiss: () => void; // calls encounterStore.clearTrailDrawAbility
}
```

Displays: `"Special Card #N"` header in amber, `ability.name` in bold, `ability.description` in muted text.

**Step 7.6 — `TrailDiscardAlert.tsx`**

Same lifecycle as `TrailDrawAlert`. Props identical to `DiscardAlert` (`ability: MonsterAbility`, `triggered: boolean`). Styled with a red tint matching `DiscardAlert` but with a `"Special Card: Discard"` sub-header. Positioned slightly below `DiscardAlert` in the stacking order (via `top-20` instead of `top-4`) so both are visible simultaneously (FR-013).

---

### Phase 8: Modified Components

**Step 8.1 — `src/components/board/BoardWelcomeScreen.tsx`**

Add:
1. `const [trailMode, setTrailMode] = useState(false)` local state.
2. Import `useTrailStore` and extract `resetTrailSession` and `startTrailSession`.
3. Import `TrailModeToggle`.
4. Render `<TrailModeToggle enabled={trailMode} onChange={setTrailMode} />` between the title and the "Start New Game" button.
5. Update the button `onClick` handler:

```ts
const handleStartGame = () => {
  resetTrailSession();          // clear any previous session state (FR-003 / EC-8)
  if (trailMode) startTrailSession();  // draw initial token board
  initNewGame();                // initialise board (boardStore)
};
```

**Step 8.2 — `src/App.tsx`**

Add trail placement routing. The base-game path in the `screen` computation changes from:
```ts
!board ? 'welcome' : activeSlotIndex !== null ? 'encounter' : 'board'
```
to:
```ts
!board
  ? 'welcome'
  : trailPlacementPending
    ? 'trail-placement'
    : activeSlotIndex !== null
      ? 'encounter'
      : 'board'
```

Add to store reads:
```ts
const trailModeEnabled = useTrailStore((s) => s.trailModeEnabled);
const weaknessTokenBoard = useTrailStore((s) => s.weaknessTokenBoard);
const placementConfirmed = useTrailStore((s) => s.placementConfirmed);
const trailPlacementPending =
  trailModeEnabled &&
  weaknessTokenBoard.length > 0 &&
  placementConfirmed.length < weaknessTokenBoard.length;
```

Add `TrailTokenPlacementScreen` to the board-layer render block:
```tsx
{screen === 'trail-placement' && <TrailTokenPlacementScreen />}
```

No changes to Wild Hunt routing logic.

**Step 8.3 — `src/components/board/BoardScreen.tsx`**

Add:
1. `const [pendingSlotIndex, setPendingSlotIndex] = useState<0|1|2|null>(null)` local state.
2. Import `useTrailStore`, extract `trailModeEnabled`, `weaknessTokensHeld`, `setPendingEffect`, `clearPendingEffect`.
3. Import `useTrailStore`, `TrailPreFightModal`, `TrailTokenBoard`, `TrailDeckOptions` from `../engine/deck`, `getMonsterById` from `../data/monsters`.
4. Replace the existing `handleSlotTap` with trail-aware version:

```ts
const handleSlotTap = (index: 0 | 1 | 2) => {
  if (trailModeEnabled) {
    setPendingSlotIndex(index); // show pre-fight modal
  } else {
    boardStore.setActiveSlot(index);
    startEncounter(board.slots[index].monsterId);
  }
};
```

5. Add `handlePreFightConfirm`:

```ts
const handlePreFightConfirm = (token: WeaknessToken | null) => {
  if (pendingSlotIndex === null) return;
  const slot = board.slots[pendingSlotIndex];
  const monster = getMonsterById(slot.monsterId);

  let playerFirst = false;
  const trailDeckOpts: TrailDeckOptions = {};

  if (token) {
    setPendingEffect(token); // moves token from weaknessTokensHeld → pendingWeaknessEffect
    switch (token.effectType) {
      case 'combatAdvantage':
        playerFirst = true;
        break;
      case 'reduceDeckSize':
        if (token.effectMagnitude != null) trailDeckOpts.removeCount = token.effectMagnitude;
        break;
      case 'removeSpecialCard':
        if (token.effectMagnitude != null)
          trailDeckOpts.excludeTrailNumbers = [token.effectMagnitude as 1 | 2 | 3 | 4];
        break;
      // bonusReward: no deck effect; passed via bonusRewardActive to encounterStore
    }
  }

  if (monster?.trailCards) trailDeckOpts.trailCards = monster.trailCards;

  boardStore.setActiveSlot(pendingSlotIndex);
  startEncounter(
    slot.monsterId,
    playerFirst,
    0,
    Object.keys(trailDeckOpts).length > 0 ? trailDeckOpts : undefined,
    monster?.trailCards ?? null,
    token?.effectType === 'bonusReward',
  );
  clearPendingEffect(); // token was already moved to pendingWeaknessEffect; clear it now that encounter is starting
  setPendingSlotIndex(null);
};
```

6. Render `<TrailTokenBoard />` below the slot list when `trailModeEnabled`.
7. Render `<TrailPreFightModal>` when `pendingSlotIndex !== null`.

**Step 8.4 — `src/components/encounter/EncounterScreen.tsx`**

Add:
1. Import `useTrailStore` and read `trailModeEnabled`.
2. Read from `useEncounterStore`: `pendingTrailDrawAbility`, `lastTrailDiscardAbility`, `bonusRewardActive`, `clearTrailDrawAbility`, `activeTrailCards`.
3. Derive `trailCardNumber` from `currentCard?.cardId` using `getTrailCardNumber`.
4. Add `<TrailDrawAlert>` below the existing `<DiscardAlert>`:

```tsx
{pendingTrailDrawAbility && activeTrailCards && (
  <TrailDrawAlert
    ability={pendingTrailDrawAbility}
    cardNumber={getTrailCardNumber(currentCard?.cardId ?? '') ?? 1}
    triggered={!!pendingTrailDrawAbility}
    onDismiss={clearTrailDrawAbility}
  />
)}
```

5. Add `<TrailDiscardAlert>` below `TrailDrawAlert`:

```tsx
{lastTrailDiscardAbility && (
  <TrailDiscardAlert
    ability={lastTrailDiscardAbility}
    triggered={!!lastTrailDiscardAbility}
  />
)}
```

6. Pass `bonusRewardActive` to `VictoryOverlay`:
```tsx
<VictoryOverlay bonusRewardActive={bonusRewardActive} ... />
```

**Step 8.5 — `src/components/encounter/VictoryOverlay.tsx`**

Add optional `bonusRewardActive?: boolean` prop. When true, render a bonus reward notice between the defeat message and the "Return to Board" button:

```tsx
{bonusRewardActive && (
  <div className="text-emerald-300 text-sm font-semibold border border-emerald-700 rounded-lg p-3 bg-emerald-900/30">
    🎁 Bonus Reward — draw an additional reward from the Trail reward pool.
  </div>
)}
```

This is a non-breaking prop addition; the existing test mock does not need `bonusRewardActive`.

**Step 8.6 — `src/hooks/useEncounterHandlers.ts`**

Import `useTrailStore` and extend `completeEncounter`:

```ts
const trailModeEnabled = useTrailStore((s) => s.trailModeEnabled);
const handleTrailVictoryReset = useTrailStore((s) => s.handleVictoryReset);

const completeEncounter = () => {
  if (inWildHunt && activeWildHuntSlotIndex !== null) {
    // ... existing Wild Hunt logic unchanged
  } else {
    handleBoardVictory();
    if (trailModeEnabled) handleTrailVictoryReset(); // FR-028/FR-029: reset board, redraw tokens
  }
  resetToSetup();
};
```

---

## File Inventory

### New Files

| Path | Purpose |
|---|---|
| `src/engine/trail.ts` | Pure functions: trail card ID convention, token draw, board initialisation |
| `src/engine/__tests__/trail.test.ts` | Unit tests for all `trail.ts` functions |
| `src/data/weaknessTokenPool.ts` | Static weakness token pool (authoring required from rulebook) |
| `src/store/trailStore.ts` | Zustand + persist store for all Trail session state |
| `src/store/__tests__/trailStore.test.ts` | Trail store action and domain invariant tests |
| `src/components/trail/TrailModeToggle.tsx` | On/off toggle displayed on BoardWelcomeScreen |
| `src/components/trail/TrailTokenPlacementScreen.tsx` | Step-by-step 6-token placement checklist |
| `src/components/trail/TrailTokenBoard.tsx` | Board token panel + held tokens summary for BoardScreen |
| `src/components/trail/TrailPreFightModal.tsx` | Pre-fight token selection overlay |
| `src/components/trail/TrailDrawAlert.tsx` | Draw-trigger ability notification (amber, auto-dismissing) |
| `src/components/trail/TrailDiscardAlert.tsx` | Discard-trigger ability notification (red, offset from DiscardAlert) |
| `src/components/trail/__tests__/TrailDrawAlert.test.tsx` | Timing and rendering tests for draw alert |
| `src/components/trail/__tests__/TrailTokenPlacementScreen.test.tsx` | Placement checklist interaction tests |

### Modified Files

| Path | What Changes |
|---|---|
| `src/types/index.ts` | Add `TerrainType`, `WeaknessEffectType`, `WeaknessToken`, `TrailCard`; extend `Monster` with `trailCards?` |
| `src/engine/deck.ts` | Export `TrailDeckOptions` interface; add optional `trailOptions?` fifth param to `generateDeck`; import `trailCardToMonsterCard` |
| `src/engine/__tests__/deck.test.ts` | Add `describe('generateDeck with trailOptions')` test group |
| `src/store/encounterStore.ts` | Add `activeTrailCards`, `pendingTrailDrawAbility`, `lastTrailDiscardAbility`, `bonusRewardActive`; extend `startEncounter`, `flipMonsterCard`, `discardOne`, `applyPlayerDamage`, `passTurn`, `resetToSetup`; add `clearTrailDrawAbility` |
| `src/store/__tests__/encounterStore.test.ts` | Add trail draw/discard trigger test groups |
| `src/hooks/useEncounterHandlers.ts` | Import `useTrailStore`; call `handleTrailVictoryReset` on base game victory |
| `src/App.tsx` | Add `useTrailStore` reads; add `'trail-placement'` to screen map; render `TrailTokenPlacementScreen` |
| `src/components/board/BoardWelcomeScreen.tsx` | Add `TrailModeToggle`; update start handler to call `resetTrailSession` + `startTrailSession` |
| `src/components/board/BoardScreen.tsx` | Add `pendingSlotIndex` state; add trail-aware `handleSlotTap`; render `TrailPreFightModal` and `TrailTokenBoard` |
| `src/components/encounter/EncounterScreen.tsx` | Read trail store/encounter fields; render `TrailDrawAlert` and `TrailDiscardAlert`; pass `bonusRewardActive` to `VictoryOverlay` |
| `src/components/encounter/VictoryOverlay.tsx` | Add optional `bonusRewardActive?` prop; render bonus reward notice |
| `src/data/monsters/griffin.ts` (and others) | Add `trailCards: [...]` for each Trail expansion monster (authoring task) |

---

## Testing Strategy

### Engine Layer

**`src/engine/__tests__/trail.test.ts`** — no mocks, pure functions only. Construct minimal `WeaknessToken` stubs (id + terrainType + effectType) and use `() => 0` / `() => 0.999` rng stubs for determinism.

```
describe('isTrailSpecialCard')
  ├─ true for 'trail-special-1' through 'trail-special-4'
  └─ false for 'c-01', '', 'trail-special-5', 'trail-special-0'

describe('getTrailCardNumber')
  ├─ returns 1–4 for valid trail card IDs
  └─ returns null for non-trail or out-of-range IDs

describe('trailCardToMonsterCard')
  ├─ id = 'trail-special-{number}'
  ├─ top.name = 'Special Card {number}'
  └─ bottom is undefined (single-half card)

describe('drawTokenForTerrain')
  ├─ returns a token of the requested terrain type
  ├─ removes the drawn token from remainingPool
  ├─ is deterministic for a given rng sequence
  └─ returns { token: null, remainingPool: pool } when no matching terrain type in pool

describe('initWeaknessTokenBoard')
  ├─ returns 6 tokens when pool has all 6 terrain types covered
  ├─ each returned token has a distinct terrain type (SC-008 / domain invariant)
  ├─ remainingPool does not contain any drawn token
  ├─ logs console.warn and omits terrain slot when pool is empty for a type (NFR-005 / EC-4)
  └─ deterministic for a given rng sequence
```

**`src/engine/__tests__/deck.test.ts` additions:**

```
describe('generateDeck with trailOptions')
  ├─ SC-002: monster with trailCards + trailOptions.trailCards → deck contains 4 trail card IDs
  ├─ SC-003: monster without trailCards, no trailOptions → standard deck; no trail card IDs
  ├─ reduceDeckSize: deck has (deckSize - removeCount) standard cards + 4 trail cards
  ├─ EC-3: removeCount > deckSize → 0 standard cards + 4 trail cards (no throw)
  ├─ removeSpecialCard: specified card number absent from deck; others present
  ├─ EC-2: removeSpecialCard for a number not in trailCards → silent no-op; deck unchanged
  └─ existing tests still pass unchanged (no regression)
```

### Store Layer

**`src/store/__tests__/trailStore.test.ts`** — mock `../../engine/trail` and `../../data/weaknessTokenPool` to return controlled values. Use `useTrailStore.getState()` for direct action calls; `act` for state mutation assertions.

```
describe('resetTrailSession')
  └─ all state fields return to INITIAL_STATE values

describe('startTrailSession')
  ├─ trailModeEnabled becomes true
  ├─ weaknessTokenBoard has 6 entries (one per terrain type from mock)
  └─ tokenPool is reduced by the number of drawn tokens

describe('confirmTokenPlaced')
  ├─ adds tokenId to placementConfirmed
  └─ idempotent: calling twice does not duplicate the entry

describe('claimToken')
  ├─ token moves from weaknessTokenBoard to weaknessTokensHeld
  ├─ replacement drawn for same terrain type (mock-verified)
  ├─ claimed token removed from placementConfirmed
  └─ logs warning and leaves board slot empty when pool exhausted (EC-4)

describe('setPendingEffect / clearPendingEffect')
  ├─ setPendingEffect: token removed from weaknessTokensHeld; appears in pendingWeaknessEffect
  └─ clearPendingEffect: pendingWeaknessEffect becomes null

describe('handleVictoryReset')
  ├─ weaknessTokenBoard is replaced with fresh 6 tokens
  ├─ placementConfirmed is empty after reset
  ├─ weaknessTokensHeld is unchanged (FR-030)
  └─ board tokens are returned to pool before redraw (token not permanently lost)
```

**`src/store/__tests__/encounterStore.test.ts` additions:**

```
describe('trail draw trigger (flipMonsterCard)')
  ├─ flipping trail-special-2 → pendingTrailDrawAbility = card 2's drawAbility
  ├─ flipping non-trail card → pendingTrailDrawAbility remains null
  └─ clearTrailDrawAbility → pendingTrailDrawAbility becomes null

describe('trail discard trigger (discardOne, applyPlayerDamage)')
  ├─ discardOne: discarding trail-special-3 → lastTrailDiscardAbility = card 3's discardAbility
  ├─ applyPlayerDamage: discarding trail-special-1 among multiple → lastTrailDiscardAbility set
  └─ discarding non-trail card → lastTrailDiscardAbility stays null

describe('startEncounter with trail options')
  ├─ activeTrailCards stored in state when provided
  ├─ bonusRewardActive = true when passed
  └─ generateDeck called with trailDeckOptions (verify via mock)
```

### Component Layer

**`TrailDrawAlert.test.tsx`** — follow `DiscardAlert.test.tsx` exactly:
- Use `vi.useFakeTimers()`
- Assert hidden when `triggered = false`
- Assert visible with ability name + description when `triggered = true`
- Assert auto-dismiss after 3000ms
- Assert tap-to-dismiss
- Assert `onDismiss` called on tap and after timer

**`TrailTokenPlacementScreen.test.tsx`** — mock `useTrailStore`:
- Renders one row per board token
- "Confirm placed" button calls `confirmTokenPlaced(tokenId)`
- Confirmed tokens render in a completed/checked state
- Progress text updates correctly

### Integration Verification (manual, not automated for this plan)

| # | Scenario |
|---|---|
| 1 | Start game with Trail Mode off → no placement checklist, no token board, standard encounter deck |
| 2 | Start game with Trail Mode on → placement checklist for 6 terrain types |
| 3 | Confirm all 6 → BoardScreen with token board visible |
| 4 | Claim a token → token moves to "held", replacement drawn for same terrain |
| 5 | Tap monster slot → pre-fight modal with held tokens |
| 6 | Apply `combatAdvantage` → encounter starts with player turn first |
| 7 | Apply `reduceDeckSize` → monster's standard card pool is shorter |
| 8 | Apply `removeSpecialCard` → target trail card absent from deck |
| 9 | Skip token → no token consumed; encounter starts normally |
| 10 | Monster flips trail special card → `TrailDrawAlert` fires with correct ability |
| 11 | Player discards trail special card → `TrailDiscardAlert` fires; if monster has global discard ability, both alerts appear |
| 12 | Victory with `bonusReward` active → VictoryOverlay shows bonus reward notice |
| 13 | Defeat monster → board token slots reset; placement checklist reappears; held tokens survive |
| 14 | App reload during placement checklist → checklist resumes at last unconfirmed token (EC-6) |
| 15 | App reload mid-encounter → `boardStore.onRehydrateStorage` reverts to BoardScreen; trail state preserved (EC-7) |
| 16 | Start new game after a trail session → TrailMode toggle is off; no trail state leaks (FR-003 / EC-8) |

---

## Migration Notes

- **New localStorage key `monster-deck-trail-v1`.** No migration from any existing key is needed. The existing `monster-deck-board-v1` key is untouched and its version is not bumped.
- **NFR-003 (corrupt state):** Zustand's `persist` middleware silently falls back to `INITIAL_STATE` if `JSON.parse` throws. No additional guard code is required; the user lands on the welcome screen with trail mode off.
- **FR-003 (no cross-session persistence):** `trailStore.resetTrailSession()` is called at the start of every new game. Even though the key persists in localStorage, the new game call resets `trailModeEnabled` to `false`. The player must explicitly re-enable the toggle for each new session.
- **`monster-deck-board-v1` version is NOT bumped.** The `BoardState` shape is unchanged; no board rehydration guard change is needed.
- **Monster data authoring is a separate commit.** Ship the code, type infrastructure, and engine changes first. Gate the 3.0 release on a confirmed complete `weaknessTokenPool.ts` and authored `trailCards` on all relevant monster files. The build does not fail with empty `trailCards` fields — monsters without them degrade gracefully (standard deck only, no trail triggers).

---

## Open Questions

| # | Question | Impact on This Plan | Recommendation |
|---|---|---|---|
| OQ-1 | How many distinct terrain types appear in the physical weakness token pool? Is it exactly 6 (water, mountain, woods, plains, city, ruins), or a different count? | Affects `TerrainType` union values, `ALL_TERRAIN_TYPES` array length, and the expected board size of 6. If fewer or more than 6, update the type, array, and board size constant. | This plan implements 6 as specified in the spec §5.1 domain model. Verify against rulebook before finalising `weaknessTokenPool.ts`. No architectural change required if the count differs — update the type and array only. |
| OQ-2 | Is claiming a weakness token voluntary or mandatory when the player is on the same location? | If mandatory, `TrailTokenBoard` needs a "must claim" prompt rather than a passive "Claim" button, and the board overview must surface unclaimed tokens prominently. | Treat as voluntary (FR-019 explicitly says "player taps 'Claim Token'"). No code change if confirmed voluntary. |
| OQ-3 | When a token is claimed, is the replacement drawn from the full pool, or restricted to the same terrain type as the claimed token? | `trailStore.claimToken` currently uses `drawTokenForTerrain` (same-terrain replacement) to uphold the one-token-per-terrain-type invariant (FR-017). If replacement is from the full pool, the invariant must be loosened and the replacement draw logic rewritten. | This plan implements same-terrain replacement as the only approach compatible with FR-017. If full-pool replacement is confirmed, the terrain-one-per-slot invariant is relaxed and `claimToken` calls `drawTokenForTerrain` with the full pool instead. |
| OQ-4 | Does the `bonusReward` effect reference a dedicated Trail reward table, or the standard post-fight reward pool? | Affects the text in `VictoryOverlay` bonus reward notice. Currently shows a generic prompt. If a dedicated table exists, it must be authored as static data and displayed directly. | Ship the generic prompt now. If a dedicated table is confirmed, author it as a small static array (e.g. `src/data/trailRewardTable.ts`) and update `VictoryOverlay` to show the drawn reward text. No architectural change required. |
