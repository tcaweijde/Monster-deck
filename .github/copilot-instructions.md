# Copilot Instructions

## Commands

```bash
npm run dev          # start dev server
npm run build        # tsc + vite build
npm run lint         # eslint
npm test             # vitest in watch mode
npm run test:run     # vitest single run (CI)
```

Run a single test file:
```bash
npx vitest run src/engine/__tests__/combat.test.ts
```

## Architecture

This is a mobile-first card game companion app (React 19, TypeScript, Vite, Tailwind v4, Zustand, Framer Motion). It simulates monster encounters where damage dealt equals cards discarded from the monster's deck.

Three distinct layers:

### 1. `src/engine/` — Pure functions, no side effects
- `shuffle.ts` — Fisher-Yates shuffle with injectable `rng`
- `deck.ts` — `generateDeck(monster)`: shuffles `cardPool`, picks `deckSize` cards, shuffles again
- `combat.ts` — `flipCard(deck, rng)`: draws top card, randomly picks `top` or `bottom` half; `applyDamage(deck, n)`: removes `n` cards from front of deck
- `abilities.ts` — helpers for reading passive/discard abilities from a `Monster`

All engine functions accept an optional `rng: () => number` parameter for deterministic testing — never use `Math.random` directly in engine code.

### 2. `src/store/encounterStore.ts` — Single Zustand store
Manages the full encounter lifecycle. Phase flows: `setup → playing → victory`. Key state: `deck`, `discardPile`, `currentCard`, `turn` (`'monster' | 'player'`), `phase`, `lastDiscardTriggered`.

- `lastDiscardTriggered` is a one-shot boolean flag: set `true` when a discard ability fires, cleared on next action. Used only to trigger the `DiscardAlert` UI flash.
- `applyPlayerDamage(0)` means "skip" — no cards discarded, turn returns to monster.
- `passTurn()` on monster turn moves the revealed card to the discard pile.

### 3. `src/components/` — React UI
- **`App.tsx`** — renders `<SetupScreen>` or `<EncounterScreen>` based on `phase` from store. No router.
- **`components/setup/`** — monster selection UI
- **`components/encounter/`** — active encounter UI; `MonsterCardDisplay` is the main interactive element (tap to flip on monster turn, swipe left/right to deal 1 damage on player turn)
- **`components/shared/`** — shared primitives

Encounter-screen components read store state individually via selectors (`useEncounterStore((s) => s.x)`) — not as a single object destructure.

### 4. `src/data/monsters/`
Static monster definitions. Each file exports one `Monster` object and is registered in `index.ts`:
```ts
export const MONSTERS: Monster[] = [griffin, werewolf, foglet];
```

### 5. `src/types/index.ts`
Single source of truth for all shared types: `MonsterCard`, `CardHalf`, `RevealedCard`, `Monster`, `MonsterAbility`, `EncounterState`.

## Key Conventions

**Adding a monster:** Create `src/data/monsters/<name>.ts` implementing `Monster`, then add it to the `MONSTERS` array in `src/data/monsters/index.ts`. The `cardPool` must have at least `deckSize` cards. `cardFrontImages` are picked by `cardId` numeric suffix modulo the array length.

**Tests are in `__tests__/` subdirectories** colocated with the code they test. Vitest globals are enabled — no need to import `describe`, `it`, `expect`. Engine tests inject a deterministic `rng` lambda. Store tests use `vi.mock` for `../../data/monsters` and `../../engine/*`, then import the store after mocking. Use `renderHook` + `act` for hook assertions.

**Tailwind v4** — configured via the `@tailwindcss/vite` plugin. There is no `tailwind.config.js`. All styling is utility-class-only in JSX.

**Framer Motion** — used in `MonsterCardDisplay` for card flip animation (`rotateY`) and swipe gesture (`useMotionValue`, `useTransform`, `drag="x"`). The `swiping` ref prevents tap handlers from firing at the end of a drag.
