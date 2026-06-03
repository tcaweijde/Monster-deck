# Implementation Plan: Generic Card Data + Charge/Bite Display

**Spec:** `docs/specs/FEAT-002-generic-card-data-and-half-display.md`
**Created:** 2026-06-03
**Status:** Draft

---

## Summary

This feature adds a `name` field to `CardHalf`, creates a shared `GENERIC_CARD_POOL` (20 cards with real values transcribed from the physical game), updates all 29 base-game monster files to reference the shared pool, and renders the resolved half's name ("Charge" or "Bite") in `MonsterCardDisplay`. The type change is a single-PR breaking change that eliminates all 29 TODO placeholders in one sweep. `MonsterCard.top`/`bottom` remain required to avoid premature null-handling in engine code; the forward constraint for single-half Monster Trail cards (FEAT-004) is addressed by a code comment only.

---

## Key Design Decisions

1. **`name: string` on `CardHalf` — required, not optional.** The spec mandates it is never empty (EC-1). Making it optional would defer the invariant enforcement to runtime; making it required gives a compile-time error for any `CardHalf` defined without it — which is exactly what EC-1 demands. Every existing fixture and mock in tests must add the field too.

2. **`MonsterCard.top`/`bottom` stay required for now.** The spec says these must remain "optional-friendly" for FEAT-004, not optional *today*. Making them `top?: CardHalf` would cascade null-checks into `flipCard` and `applyDamage` — premature work for a future feature. A `// FEAT-004` comment in `types/index.ts` documents the intent without touching engine code.

3. **Single shared `GENERIC_CARD_POOL` exported from `src/data/monsters/genericCardPool.ts`.** All 29 monster files will `import { GENERIC_CARD_POOL } from './genericCardPool'` and set `cardPool: GENERIC_CARD_POOL`. Card IDs change from monster-scoped (`griffin-01`) to pool-scoped (`generic-01`). Deck generation already relies only on `card.id` uniqueness and pool size — no engine changes needed.

4. **Pool must contain exactly 20 cards.** The maximum `deckSize` across all base-game monsters is 19 (leshen, troll). 20 cards gives one spare to satisfy the `generateDeck` pool-size guard while matching the spec's "L3 = up to 20 cards" reference.

5. **Half name rendered as a header label above the attack number in `MonsterCardDisplay`.** This is the simplest change that satisfies SC-001–SC-003: add a `<div>` with `chosenHalf.name` immediately inside the revealed-card block, above the existing attack row. No new component is needed — `MonsterCardDisplay` already owns the revealed half layout.

6. **Real card values are a data-entry prerequisite, not an engineering one.** The plan scaffolds the pool file structure, but the physical game must be consulted to fill in accurate `attack` values and `effect` strings. Shipping with invented values violates NFR-002 and is treated as a bug. The plan marks this dependency explicitly.

7. **All 29 monster files must be updated in one PR.** The `CardHalf.name` addition is a breaking type change; partial migration leaves the build broken. TypeScript will surface every remaining violation immediately after the type is updated.

---

## Implementation Steps

### Phase 1: Type Update

**Step 1.1 — Add `name` to `CardHalf` in `src/types/index.ts`**

Change:
```ts
export interface CardHalf {
  attack: number;
  effect?: string;
}
```
To:
```ts
export interface CardHalf {
  /** Display name of this half. "Charge" for top, "Bite" for bottom on generic cards. */
  name: string;
  attack: number;
  effect?: string;
}
```

Also add a comment above `MonsterCard.top`/`bottom` documenting the forward constraint:
```ts
export interface MonsterCard {
  id: string;
  // FEAT-004: top and bottom will become optional to support single-half Monster Trail cards.
  top: CardHalf;
  bottom: CardHalf;
}
```

After saving, run `npm run build` to enumerate all TypeScript errors. Every broken site is a location that needs a `name` field added — use this as a checklist.

---

### Phase 2: Shared Generic Card Pool

**Step 2.1 — Create `src/data/monsters/genericCardPool.ts`**

Create a new file exporting the 20-card shared pool. The structure must match the physical game exactly (NFR-002). The skeleton below shows the shape; the actual `attack` values and `effect` strings must be transcribed from the physical Witcher Old World game cards before shipping.

```ts
import type { MonsterCard } from '../../types';

/**
 * Shared generic attack card pool used by all base-game monsters.
 * Values must match the physical Witcher Old World game cards exactly.
 * Top half is always "Charge"; bottom half is always "Bite".
 *
 * Pool invariant: length >= 19 (max base-game deckSize).
 */
export const GENERIC_CARD_POOL: MonsterCard[] = [
  {
    id: 'generic-01',
    top:    { name: 'Charge', attack: /* TODO: transcribe */ 0 },
    bottom: { name: 'Bite',   attack: /* TODO: transcribe */ 0 },
  },
  {
    id: 'generic-02',
    top:    { name: 'Charge', attack: /* TODO: transcribe */ 0, effect: /* TODO */ undefined },
    bottom: { name: 'Bite',   attack: /* TODO: transcribe */ 0 },
  },
  // … cards 03–20 following the same pattern …
];
```

Rules for filling in values:
- Top half `name` is always `"Charge"`.
- Bottom half `name` is always `"Bite"`.
- `effect` is only present when the physical card has text on that half (e.g. `"Shield 1"`, `"Bleed 1"`). Omit the field entirely (not `undefined`) when absent.
- IDs are `generic-01` through `generic-20` (zero-padded).

---

### Phase 3: Update All Monster Files

**Step 3.1 — Update all 29 monster files**

For every file in `src/data/monsters/` (except `index.ts` and `genericCardPool.ts`):

1. Add the import at the top:
   ```ts
   import { GENERIC_CARD_POOL } from './genericCardPool';
   ```
2. Replace the entire inline `cardPool: [ ... ]` array with:
   ```ts
   cardPool: GENERIC_CARD_POOL,
   ```
3. Remove the `// TODO: fill in real card values` comment.

Files to update (29 total):
`arachas.ts`, `archespore.ts`, `barghest.ts`, `brewess.ts`, `bruxa.ts`,
`drowners-nest.ts`, `ekimmara.ts`, `fiend.ts`, `foglet.ts`, `ghouls-nest.ts`,
`glustyworp.ts`, `grave-hag.ts`, `griffin.ts`, `harpy.ts`, `leshen.ts`,
`manticore.ts`, `nekkers-nest.ts`, `nightwraith.ts`, `noonwraith.ts`,
`penitent.ts`, `rotfiend.ts`, `striga.ts`, `troll.ts`, `water-hag.ts`,
`weavess.ts`, `werewolf.ts`, `whispess.ts`, `wyvern.ts`, `yghern.ts`

No changes to `src/data/monsters/index.ts` — it only imports `Monster` objects and does not reference cards directly.

---

### Phase 4: Update `MonsterCardDisplay`

**Step 4.1 — Render `chosenHalf.name` in `src/components/encounter/MonsterCardDisplay.tsx`**

Inside the `currentCard ? (` branch, add the half name as a prominent header label above the attack number. Replace:

```tsx
<div className="text-center flex flex-col items-center bg-black/70 rounded-lg px-4 py-2 w-full">
  <div className="text-3xl sm:text-5xl font-bold text-red-400">{currentCard.chosenHalf.attack}</div>
  <div className="text-sm text-gray-300 uppercase mt-1">Attack</div>
  {currentCard.chosenHalf.effect && (
    <div className="text-sm text-amber-300 bg-amber-500/20 rounded-lg px-3 py-1.5 mt-3">
      {currentCard.chosenHalf.effect}
    </div>
  )}
</div>
```

With:

```tsx
<div className="text-center flex flex-col items-center bg-black/70 rounded-lg px-4 py-2 w-full">
  <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
    {currentCard.chosenHalf.name}
  </div>
  <div className="text-3xl sm:text-5xl font-bold text-red-400">{currentCard.chosenHalf.attack}</div>
  <div className="text-sm text-gray-300 uppercase mt-1">Attack</div>
  {currentCard.chosenHalf.effect && (
    <div className="text-sm text-amber-300 bg-amber-500/20 rounded-lg px-3 py-1.5 mt-3">
      {currentCard.chosenHalf.effect}
    </div>
  )}
</div>
```

No other changes to `MonsterCardDisplay.tsx`.

---

### Phase 5: Fix Broken Test Fixtures

The `name` field addition breaks three existing test files that construct `CardHalf` objects directly. These must be updated so the build and test suite pass.

**Step 5.1 — `src/engine/__tests__/combat.test.ts`**

Update `makeCard` to include `name` on both halves:
```ts
function makeCard(id: string, topAttack = 1, bottomAttack = 2): MonsterCard {
  return {
    id,
    top:    { name: 'Charge', attack: topAttack,    effect: `top-effect-${id}` },
    bottom: { name: 'Bite',   attack: bottomAttack, effect: `bottom-effect-${id}` },
  };
}
```

**Step 5.2 — `src/engine/__tests__/deck.test.ts`**

Update `makeCard` to include `name`:
```ts
function makeCard(id: string): MonsterCard {
  return { id, top: { name: 'Charge', attack: 1 }, bottom: { name: 'Bite', attack: 2 } };
}
```

**Step 5.3 — `src/store/__tests__/encounterStore.test.ts`**

Update `MOCK_CARDS` to include `name` on each `CardHalf`:
```ts
const MOCK_CARDS: MonsterCard[] = [
  { id: 'c-01', top: { name: 'Charge', attack: 3, effect: 'Shield 1' }, bottom: { name: 'Bite', attack: 2 } },
  { id: 'c-02', top: { name: 'Charge', attack: 2 },                     bottom: { name: 'Bite', attack: 4, effect: 'Bleed 1' } },
  { id: 'c-03', top: { name: 'Charge', attack: 1 },                     bottom: { name: 'Bite', attack: 3 } },
  { id: 'c-04', top: { name: 'Charge', attack: 4 },                     bottom: { name: 'Bite', attack: 1 } },
];
```

---

### Phase 6: New Tests

**Step 6.1 — Create `src/data/monsters/__tests__/genericCardPool.test.ts`**

Test the pool-level invariants (SC-002, SC-005, SC-006, domain rules):

```ts
import { describe, it, expect } from 'vitest';
import { GENERIC_CARD_POOL } from '../genericCardPool';

const MAX_BASE_GAME_DECK_SIZE = 19; // leshen / troll

describe('GENERIC_CARD_POOL', () => {
  it('has at least MAX_BASE_GAME_DECK_SIZE cards', () => {
    expect(GENERIC_CARD_POOL.length).toBeGreaterThanOrEqual(MAX_BASE_GAME_DECK_SIZE);
  });

  it('has unique card IDs', () => {
    const ids = GENERIC_CARD_POOL.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every top half has name "Charge"', () => {
    for (const card of GENERIC_CARD_POOL) {
      expect(card.top.name).toBe('Charge');
    }
  });

  it('every bottom half has name "Bite"', () => {
    for (const card of GENERIC_CARD_POOL) {
      expect(card.bottom.name).toBe('Bite');
    }
  });

  it('every half has a non-negative integer attack value', () => {
    for (const card of GENERIC_CARD_POOL) {
      expect(card.top.attack).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(card.top.attack)).toBe(true);
      expect(card.bottom.attack).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(card.bottom.attack)).toBe(true);
    }
  });

  it('every half has a non-empty name', () => {
    for (const card of GENERIC_CARD_POOL) {
      expect(card.top.name.length).toBeGreaterThan(0);
      expect(card.bottom.name.length).toBeGreaterThan(0);
    }
  });

  it('effect is a non-empty string when present (never empty string)', () => {
    for (const card of GENERIC_CARD_POOL) {
      if (card.top.effect !== undefined)    expect(card.top.effect.length).toBeGreaterThan(0);
      if (card.bottom.effect !== undefined) expect(card.bottom.effect.length).toBeGreaterThan(0);
    }
  });
});
```

**Step 6.2 — Create `src/data/monsters/__tests__/monsterPools.test.ts`**

Verify every registered monster uses the shared pool (SC-006, FR-005):

```ts
import { describe, it, expect } from 'vitest';
import { MONSTERS } from '../index';
import { GENERIC_CARD_POOL } from '../genericCardPool';

describe('all base-game monsters share the generic card pool', () => {
  for (const monster of MONSTERS) {
    it(`${monster.id} uses GENERIC_CARD_POOL by reference`, () => {
      expect(monster.cardPool).toBe(GENERIC_CARD_POOL);
    });
  }
});
```

> **Note:** Using `toBe` (reference equality) enforces "shared, not copied." If a monster file accidentally spreads or slices the pool, this test fails.

**Step 6.3 — Create `src/components/encounter/__tests__/MonsterCardDisplay.test.tsx`**

Test the UI rendering of the half name (SC-002, SC-003, SC-004, SC-005):

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonsterCardDisplay } from '../MonsterCardDisplay';
import type { RevealedCard } from '../../../types';

function makeRevealedCard(
  name: string,
  source: 'top' | 'bottom',
  effect?: string,
): RevealedCard {
  return {
    cardId: 'generic-01',
    source,
    chosenHalf: { name, attack: 3, ...(effect ? { effect } : {}) },
  };
}

const noop = () => {};
const baseProps = {
  deckEmpty: false,
  turn: 'player' as const,
  cardFrontImages: [],
  onFlip: noop,
  onSwipeDamage: noop,
  onPass: noop,
};

describe('MonsterCardDisplay — revealed half name', () => {
  it('shows "Charge" when the top half is resolved', () => {
    render(
      <MonsterCardDisplay
        {...baseProps}
        currentCard={makeRevealedCard('Charge', 'top')}
      />,
    );
    expect(screen.getByText('Charge')).toBeInTheDocument();
  });

  it('shows "Bite" when the bottom half is resolved', () => {
    render(
      <MonsterCardDisplay
        {...baseProps}
        currentCard={makeRevealedCard('Bite', 'bottom')}
      />,
    );
    expect(screen.getByText('Bite')).toBeInTheDocument();
  });

  it('shows effect text when the half has an effect', () => {
    render(
      <MonsterCardDisplay
        {...baseProps}
        currentCard={makeRevealedCard('Charge', 'top', 'Shield 1')}
      />,
    );
    expect(screen.getByText('Shield 1')).toBeInTheDocument();
  });

  it('does not render an effect element when effect is absent', () => {
    render(
      <MonsterCardDisplay
        {...baseProps}
        currentCard={makeRevealedCard('Bite', 'bottom')}
      />,
    );
    expect(screen.queryByText(/shield|bleed/i)).not.toBeInTheDocument();
  });
});
```

---

## File Inventory

### New Files

| Path | Purpose |
|------|---------|
| `src/data/monsters/genericCardPool.ts` | Shared 20-card pool; single source of truth for generic card values |
| `src/data/monsters/__tests__/genericCardPool.test.ts` | Pool invariants: size, unique IDs, name correctness, valid attack values |
| `src/data/monsters/__tests__/monsterPools.test.ts` | Asserts every registered monster references the shared pool by identity |
| `src/components/encounter/__tests__/MonsterCardDisplay.test.tsx` | UI tests: Charge/Bite label renders, effect present/absent |

### Modified Files

| Path | Change |
|------|--------|
| `src/types/index.ts` | Add `name: string` to `CardHalf`; add FEAT-004 comment on `MonsterCard` |
| `src/components/encounter/MonsterCardDisplay.tsx` | Render `chosenHalf.name` label above attack value |
| `src/engine/__tests__/combat.test.ts` | Add `name: 'Charge'`/`'Bite'` to `makeCard` fixture |
| `src/engine/__tests__/deck.test.ts` | Add `name: 'Charge'`/`'Bite'` to `makeCard` fixture |
| `src/store/__tests__/encounterStore.test.ts` | Add `name: 'Charge'`/`'Bite'` to `MOCK_CARDS` |
| `src/data/monsters/arachas.ts` | Replace inline `cardPool` with `GENERIC_CARD_POOL`; remove TODO |
| `src/data/monsters/archespore.ts` | ″ |
| `src/data/monsters/barghest.ts` | ″ |
| `src/data/monsters/brewess.ts` | ″ |
| `src/data/monsters/bruxa.ts` | ″ |
| `src/data/monsters/drowners-nest.ts` | ″ |
| `src/data/monsters/ekimmara.ts` | ″ |
| `src/data/monsters/fiend.ts` | ″ |
| `src/data/monsters/foglet.ts` | ″ |
| `src/data/monsters/ghouls-nest.ts` | ″ |
| `src/data/monsters/glustyworp.ts` | ″ |
| `src/data/monsters/grave-hag.ts` | ″ |
| `src/data/monsters/griffin.ts` | ″ |
| `src/data/monsters/harpy.ts` | ″ |
| `src/data/monsters/leshen.ts` | ″ |
| `src/data/monsters/manticore.ts` | ″ |
| `src/data/monsters/nekkers-nest.ts` | ″ |
| `src/data/monsters/nightwraith.ts` | ″ |
| `src/data/monsters/noonwraith.ts` | ″ |
| `src/data/monsters/penitent.ts` | ″ |
| `src/data/monsters/rotfiend.ts` | ″ |
| `src/data/monsters/striga.ts` | ″ |
| `src/data/monsters/troll.ts` | ″ |
| `src/data/monsters/water-hag.ts` | ″ |
| `src/data/monsters/weavess.ts` | ″ |
| `src/data/monsters/werewolf.ts` | ″ |
| `src/data/monsters/whispess.ts` | ″ |
| `src/data/monsters/wyvern.ts` | ″ |
| `src/data/monsters/yghern.ts` | ″ |

`src/data/monsters/index.ts` — **no change needed**.

---

## Testing Strategy

### Compile-time validation

Run `npm run build` immediately after Phase 1. TypeScript will report every `CardHalf` construction missing `name`. This acts as a machine-generated task list for Phases 2–5.

### Engine layer

Existing engine tests (`combat.test.ts`, `deck.test.ts`, `shuffle.test.ts`) require only the fixture patch from Phase 5 — no logic changes. The `deck.test.ts` "real monster data" integration tests will automatically pick up the new pool once Phase 3 is complete.

### Data layer

`genericCardPool.test.ts` enforces all domain invariants (FR-001, FR-002, domain rules §5.3) without requiring knowledge of the physical game values — it checks structure and types. `monsterPools.test.ts` enforces FR-005/SC-006 (shared, not copied) via reference identity.

### Store layer

`encounterStore.test.ts` uses fully mocked engine functions and mock cards — no real pool involved. After the Phase 5 fixture patch, all existing assertions continue to pass unchanged.

### UI layer

`MonsterCardDisplay.test.tsx` covers all four acceptance scenarios (SC-002, SC-003, SC-004, SC-005) with direct `@testing-library/react` rendering. The component is tested in isolation via `render` — no Zustand store or Framer Motion interaction is required for these assertions.

### Running the suite

```bash
# Single file during development
npx vitest run src/data/monsters/__tests__/genericCardPool.test.ts

# Full suite before PR
npm run test:run
```

---

## Migration Notes

**This is a breaking type change.** All 29 monster files plus 3 test fixtures must be updated in the same commit/PR that updates `CardHalf`. A partial migration leaves `tsc` failing and the CI build red.

**Card ID change:** Monster-scoped IDs (`griffin-01`, `werewolf-03`, …) are replaced with `generic-01`–`generic-20`. The `cardFrontImages` lookup in `getCardFrontImage` uses `parseInt(cardId.split('-').pop())` — this continues to work correctly with `generic-01` style IDs (parses to `1`, `2`, … `20`).

**No runtime data migration:** All card data is static TypeScript. No database or localStorage migration is needed.

**Forward compatibility (FEAT-004):** When Monster Trail single-half cards are introduced, `MonsterCard.top` and `MonsterCard.bottom` will need to become optional (`top?: CardHalf; bottom?: CardHalf`). At that point, `flipCard` in `src/engine/combat.ts` will require guard clauses to handle absent halves. No changes are needed now — the `// FEAT-004` comment in `types/index.ts` records the intent.

**Data-entry gate:** The pool file can be scaffolded with `attack: 0` placeholders to keep TypeScript satisfied, but the feature must not be shipped until every value is transcribed from the physical cards. A failing build is not acceptable; a failing NFR-002 is equally unacceptable. Recommend a PR checklist item: *"All attack values confirmed against physical game cards."*
