# Implementation Plan: Monster-deck MVP

**Spec:** [`docs/product/impact-map.md`](../product/impact-map.md)
**Created:** 2026-06-01
**Status:** Draft
**Scope:** All 12 MVP features across 4 epics (F1.1 through F4.5)

---

## Summary

Build a client-side-only web app using React + TypeScript + Vite that replaces the physical monster card deck for solo play of The Witcher Old World. All game data lives in static JSON files bundled with the app -- no backend, no database, no API. The app is a single-page encounter manager: pick a monster, pick a level, and the app handles deck generation, card flipping, damage/discard, initiative, and persistent ability display.

## Key Design Decisions

1. **Client-side only (no backend).** This is a single-player personal tool, not a service. All game data is static and known at build time. A backend adds deployment complexity, hosting cost, and latency for zero benefit. Ship a static site.

2. **React + TypeScript + Vite.** React because Thomas works at a company (a .NET/Java/JS shop) and React is the dominant frontend framework in that ecosystem -- minimizing learning curve for a side project. TypeScript for type safety on the card data model (the most complex part of the app). Vite for fast dev experience and zero-config deployment.

3. **Zustand for state management.** The encounter state (deck, discard pile, current card, abilities, deck size) is the core of the app. Zustand is minimal, TypeScript-friendly, and avoids Redux boilerplate. A single `useEncounterStore` manages all encounter state. No global state needed beyond the active encounter.

4. **Static JSON for card/monster data.** Monster definitions and card pools are authored as TypeScript constants (not fetched from an API). This gives compile-time type checking on the data, instant loading, and zero runtime errors from malformed data. Data files live in `src/data/`.

5. **Domain logic in pure functions, separate from UI.** Deck generation, shuffling, initiative resolution, damage/discard, and ability triggers are pure TypeScript functions in `src/engine/`. This makes the game logic unit-testable without rendering anything. The React layer calls these functions; it does not contain game logic.

6. **Vitest + React Testing Library for testing.** Vitest integrates natively with Vite. Engine functions get unit tests. Components get integration tests with React Testing Library. No E2E framework for MVP -- the app is a single page with minimal navigation.

7. **Mobile-first responsive design with Tailwind CSS.** This app will be used at a table with a phone or tablet propped up. Mobile-first is the correct default. Tailwind for rapid utility-class styling without a component library dependency.

8. **Top/bottom card resolution: random choice, internal.** Per the spec, the app resolves the top/bottom card half internally. Implement as a coin flip (50/50 random) at card-flip time. No UI. Each card definition includes both halves; the engine picks one when the card is revealed.

9. **Deck sizes are hard-coupled to each monster.** Each monster definition includes its own `deckSizes: Record<MonsterLevel, number>` (e.g., Griffin might be `{ 1: 8, 2: 12, 3: 16 }` while Werewolf is `{ 1: 10, 2: 14, 3: 18 }`). No generic level-to-size mapping. This matches the physical game where different monsters have different deck sizes per level.

10. **No routing library.** The app has two screens: setup (pick monster + level) and encounter (the gameplay loop). Use a simple state variable (`phase: 'setup' | 'encounter'`) instead of React Router. Adding a router for two screens is overhead.

---

## Implementation Steps

### Phase 1: Project Scaffolding

Set up the project, tooling, and empty structure so everything builds and tests run.

**Step 1.1: Initialize the Vite + React + TypeScript project**
- Run `npm create vite@latest . -- --template react-ts` in the project root
- This creates `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, and the `src/` directory
- Remove the default Vite boilerplate (`App.tsx` content, `App.css`, Vite logo assets)

**Step 1.2: Install dependencies**
- Production: `zustand`, `tailwindcss @tailwindcss/vite`
- Dev: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`

**Step 1.3: Configure Tailwind CSS**
- Add the Tailwind Vite plugin to `vite.config.ts`
- Add `@import "tailwindcss"` to `src/index.css`

**Step 1.4: Configure Vitest**
- Add vitest config to `vite.config.ts` (test environment: `jsdom`, setup file: `src/test/setup.ts`)
- Create `src/test/setup.ts` that imports `@testing-library/jest-dom`
- Add `"test": "vitest"` and `"test:run": "vitest run"` scripts to `package.json`

**Step 1.5: Create the directory structure**
```
src/
  components/      # React components
    setup/         # Monster/level selection screen
    encounter/     # Encounter gameplay screen
    shared/        # Shared UI components
  data/            # Static monster/card definitions
  engine/          # Pure game logic functions
  store/           # Zustand store
  types/           # TypeScript type definitions
  test/            # Test setup and utilities
```

**Step 1.6: Verify the scaffold**
- `npm run dev` serves the app
- `npm run build` produces a production bundle
- `npm run test:run` exits cleanly with no tests

---

### Phase 2: Type Definitions & Data Model (Epic 2: F2.1)

Define the TypeScript types that represent the entire domain. This is the foundation everything else builds on.

**Step 2.1: Define core types in `src/types/index.ts`**

```typescript
/** A single card half (top or bottom of a physical card) */
export interface CardHalf {
  attack: number;           // damage value
  effect?: string;          // text description of the effect (e.g., "Shield 2")
}

/** A card in the monster's pool -- has two halves */
export interface MonsterCard {
  id: string;               // unique within the monster, e.g., "griffin-01"
  top: CardHalf;
  bottom: CardHalf;
}

/** A revealed card after the engine picks a half */
export interface RevealedCard {
  cardId: string;
  chosenHalf: CardHalf;
  source: 'top' | 'bottom';
}

/** Ability trigger type */
export type AbilityTrigger = 'passive' | 'discard';

/** A monster ability */
export interface MonsterAbility {
  name: string;
  description: string;
  trigger: AbilityTrigger;  // 'passive' = always active, 'discard' = triggers on discard
}

/** Monster level */
export type MonsterLevel = 1 | 2 | 3;

/** Complete monster definition */
export interface Monster {
  id: string;               // e.g., "griffin"
  name: string;             // display name, e.g., "Griffin"
  deckSizes: Record<MonsterLevel, number>;  // deck size per level, e.g., { 1: 8, 2: 12, 3: 16 }
  baseAbility: MonsterAbility;
  secondaryAbility?: MonsterAbility;    // expansion -- present on most monsters
  discardAbility?: MonsterAbility;      // expansion -- triggers on card discard
  cardPool: MonsterCard[];              // all possible cards for this monster
  artworkId?: string;                   // key for artwork lookup (future use)
}

/** The encounter state */
export interface EncounterState {
  monster: Monster;
  level: MonsterLevel;
  deck: MonsterCard[];          // remaining cards (face down)
  discardPile: MonsterCard[];   // discarded cards
  currentCard: RevealedCard | null;  // currently revealed card
  isMonsterFirst: boolean;      // initiative result for current round
  phase: 'setup' | 'playing' | 'victory';
}
```

**Step 2.2: Write type tests / compile check**
- Create `src/types/__tests__/types.test.ts` that imports all types and constructs sample objects
- This is a compile-time validation that the types are consistent and usable

---

### Phase 3: Static Monster Data (Epic 2: F2.1)

Author the actual monster definitions. Start with 3 monsters for MVP (enough to validate variety), with the data structure supporting unlimited future additions.

**Step 3.1: Create `src/data/monsters/griffin.ts`**
- Define the Griffin monster with its own `deckSizes` (e.g., `{ 1: 8, 2: 12, 3: 16 }`), full card pool (enough cards to support L3), base ability, secondary ability, and discard-trigger ability
- Each card has distinct top/bottom halves with different attack values and effects

**Step 3.2: Create `src/data/monsters/werewolf.ts`**
- Same structure, its own `deckSizes`, different abilities and card pool

**Step 3.3: Create `src/data/monsters/foglet.ts`**
- Same structure, its own `deckSizes`, different abilities and card pool

**Step 3.4: Create `src/data/monsters/index.ts` (Monster Registry)**
- Export a `MONSTERS` array of all monster definitions -- this is the internal master list used to organize monsters, their artwork references, abilities, and card pools
- Export a `getMonsterById(id: string): Monster | undefined` lookup helper
- The registry is the single source of truth for all monster data. Adding a monster = adding a file + registering it here.

**Note on data accuracy:** The card attack values and ability text should approximate the real game data. Exact transcription from the physical game is a data-entry task that can be refined iteratively. The data structure is what matters for the MVP code -- the values can be corrected later without code changes.

---

### Phase 4: Game Engine (Epics 2, 3, 4: F2.2, F3.1-F3.3, F4.1-F4.4)

Pure functions that implement all game logic. No React, no side effects, no randomness (randomness is injected).

**Step 4.1: Create `src/engine/shuffle.ts`**
- `shuffle<T>(array: T[], rng?: () => number): T[]` -- Fisher-Yates shuffle with injectable RNG for testability
- Default RNG is `Math.random`

**Step 4.2: Create `src/engine/deck.ts` (F2.2 - Deck Generation)**
- `generateDeck(monster: Monster, level: MonsterLevel, rng?: () => number): MonsterCard[]`
  - Selects `monster.deckSizes[level]` cards from the monster's card pool
  - If pool has more cards than needed, randomly select a subset, then shuffle
  - If pool has exactly enough, shuffle the full pool
  - Throws if pool has fewer cards than needed (data error)

**Step 4.3: Create `src/engine/initiative.ts` (F4.1 - Initiative Check)**
- `checkInitiative(rng?: () => number): boolean`
  - Returns `true` if the monster acts first, `false` if the player acts first
  - Simple 50/50 coin flip (the physical game uses card color -- we simplify to random for MVP)

**Step 4.4: Create `src/engine/combat.ts` (F4.2, F4.3 - Card Flip & Damage)**
- `flipCard(deck: MonsterCard[], rng?: () => number): { revealed: RevealedCard; remainingDeck: MonsterCard[] }`
  - Takes the top card, randomly picks top or bottom half, returns the revealed card and the new deck without that card
  - Returns `null` if deck is empty
- `applyDamage(deck: MonsterCard[], damage: number): { discardedCards: MonsterCard[]; remainingDeck: MonsterCard[] }`
  - Discards `damage` cards from the top of the deck
  - If damage exceeds deck size, discards all remaining cards
  - Returns both the discarded cards and the remaining deck

**Step 4.5: Create `src/engine/abilities.ts` (F3.1, F3.2, F3.3 - Ability Handling)**
- `getActiveAbilities(monster: Monster): MonsterAbility[]`
  - Returns the list of all abilities that should be displayed (base + secondary if present)
- `getDiscardAbilities(monster: Monster): MonsterAbility[]`
  - Returns abilities that trigger on discard (for F3.3)
- `hasDiscardTrigger(monster: Monster): boolean`
  - Quick check used by the UI to show a discard notification

**Step 4.6: Create `src/engine/index.ts`**
- Re-export all engine functions from a single entry point

**Step 4.7: Write comprehensive engine tests**
- `src/engine/__tests__/shuffle.test.ts` -- deterministic shuffle with seeded RNG, preserves elements, changes order
- `src/engine/__tests__/deck.test.ts` -- correct deck size per level, subset selection, error on insufficient pool
- `src/engine/__tests__/initiative.test.ts` -- returns boolean, respects injected RNG
- `src/engine/__tests__/combat.test.ts` -- flip removes card from deck, damage discards correct count, empty deck handling
- `src/engine/__tests__/abilities.test.ts` -- returns correct abilities for monsters with/without expansion abilities

---

### Phase 5: State Management (Zustand Store)

Bridge between the pure engine and the React UI.

**Step 5.1: Create `src/store/encounterStore.ts`**

The store holds the encounter state and exposes actions that call engine functions:

```typescript
interface EncounterActions {
  // Setup
  startEncounter: (monsterId: string, level: MonsterLevel) => void;
  
  // Gameplay
  flipMonsterCard: () => void;
  applyPlayerDamage: (damage: number) => void;
  rollInitiative: () => void;
  nextRound: () => void;
  
  // Navigation
  resetToSetup: () => void;
}
```

- `startEncounter`: looks up monster, generates deck, rolls initial initiative, sets phase to `'playing'`
- `flipMonsterCard`: calls `flipCard` on the current deck, updates `currentCard` and `deck`
- `applyPlayerDamage`: calls `applyDamage`, checks for discard-trigger abilities, updates `deck` and `discardPile`. If deck is empty, sets phase to `'victory'`
- `rollInitiative`: calls `checkInitiative`, updates `isMonsterFirst`
- `nextRound`: clears `currentCard`, rolls new initiative for the next round
- `resetToSetup`: clears all encounter state

**Step 5.2: Write store tests in `src/store/__tests__/encounterStore.test.ts`**
- Test the full lifecycle: start -> flip -> damage -> victory
- Test initiative re-roll on nextRound
- Test discard-trigger ability notification
- Test resetToSetup clears state

---

### Phase 6: UI Components -- Setup Screen (Epic 1: F1.1, F1.2)

**Step 6.1: Create `src/components/setup/MonsterPicker.tsx` (F1.1)**
- Displays a grid/list of available monsters (from `MONSTERS` array)
- Each monster shows its name and base ability name as a preview
- "Random" button picks a random monster
- Selecting a monster highlights it and enables the level picker
- Mobile-first: large tap targets, single-column on small screens, grid on tablet

**Step 6.2: Create `src/components/setup/LevelPicker.tsx` (F1.2)**
- Three large buttons: Level 1, Level 2, Level 3
- Each shows the deck size for the selected monster (e.g., "Level 1 -- 8 cards") — reads from `monster.deckSizes`
- Selecting a level enables the "Start Encounter" button

**Step 6.3: Create `src/components/setup/SetupScreen.tsx`**
- Composes `MonsterPicker` and `LevelPicker`
- "Start Encounter" button calls `encounterStore.startEncounter(monsterId, level)`
- Transitions to the encounter screen when the store phase changes to `'playing'`

**Step 6.4: Write component tests**
- `src/components/setup/__tests__/MonsterPicker.test.tsx` -- renders monsters, selection works, random button works
- `src/components/setup/__tests__/LevelPicker.test.tsx` -- renders levels, shows deck size, selection works
- `src/components/setup/__tests__/SetupScreen.test.tsx` -- full flow: pick monster, pick level, start encounter

---

### Phase 7: UI Components -- Encounter Screen (Epic 4: F4.1-F4.5, Epic 3: F3.1-F3.3)

**Step 7.1: Create `src/components/encounter/AbilityPanel.tsx` (F4.5, F3.1, F3.2)**
- Permanently visible panel at the top of the encounter screen
- Shows all active abilities: base ability name + description, secondary ability if present
- Visually distinct from the card area (e.g., a colored banner)
- Discard-trigger ability shown with a distinct icon/badge indicating it triggers on discard

**Step 7.2: Create `src/components/encounter/DeckTracker.tsx` (F4.4)**
- Shows remaining deck size as a prominent number (e.g., "Cards remaining: 12")
- Shows discard pile size
- Updates reactively as cards are flipped or discarded

**Step 7.3: Create `src/components/encounter/InitiativeDisplay.tsx` (F4.1)**
- Shows who acts first this round: "Monster acts first" or "Player acts first"
- Visual indicator (color/icon) to make it immediately clear

**Step 7.4: Create `src/components/encounter/MonsterCardDisplay.tsx` (F4.2)**
- When no card is revealed: shows a face-down card back with a "Flip Card" button
- When a card is revealed: shows the attack value and effect text
- Large tap target for the flip action
- Discard-trigger notification: if the monster has a discard ability, show a brief alert/toast when cards are discarded via player damage

**Step 7.5: Create `src/components/encounter/PlayerDamageInput.tsx` (F4.3)**
- Numeric input (buttons: +1, -1, or stepper) for the player to declare damage
- "Apply Damage" button calls `encounterStore.applyPlayerDamage(damage)`
- Minimum damage: 1, maximum: remaining deck size
- After applying, resets the input to 1

**Step 7.6: Create `src/components/encounter/VictoryOverlay.tsx`**
- Shown when the deck is empty (phase === 'victory')
- "Monster defeated!" message
- "New Encounter" button calls `encounterStore.resetToSetup()`

**Step 7.7: Create `src/components/encounter/EncounterScreen.tsx`**
- Composes all encounter components in a mobile-friendly layout:
  - Top: `AbilityPanel` (always visible)
  - Middle: `InitiativeDisplay` + `MonsterCardDisplay`
  - Bottom: `DeckTracker` + `PlayerDamageInput`
- `VictoryOverlay` appears on top when encounter ends

**Step 7.8: Create `src/components/encounter/DiscardAlert.tsx` (F3.3)**
- A transient notification that appears when player damage triggers the discard ability
- Shows the discard-trigger ability name and description
- Auto-dismisses after 3 seconds or on tap
- Only renders when the monster has a discard-trigger ability

**Step 7.9: Write component tests**
- `src/components/encounter/__tests__/AbilityPanel.test.tsx` -- renders base, secondary, and discard abilities correctly
- `src/components/encounter/__tests__/DeckTracker.test.tsx` -- shows correct counts
- `src/components/encounter/__tests__/MonsterCardDisplay.test.tsx` -- flip interaction, displays attack/effect
- `src/components/encounter/__tests__/PlayerDamageInput.test.tsx` -- increment/decrement, apply damage, bounds checking
- `src/components/encounter/__tests__/EncounterScreen.test.tsx` -- integration test of the full encounter flow

---

### Phase 8: App Shell & Integration

**Step 8.1: Create `src/App.tsx`**
- Reads `phase` from the encounter store
- Renders `SetupScreen` when phase is `'setup'` (or store is empty)
- Renders `EncounterScreen` when phase is `'playing'` or `'victory'`
- Wraps in a minimal layout container (max-width, centered, padding)

**Step 8.2: Update `src/main.tsx`**
- Standard React 18 entry point rendering `<App />`

**Step 8.3: Update `src/index.css`**
- Tailwind imports
- Minimal global styles: dark background (thematic for Witcher), light text
- Mobile viewport meta already handled by Vite's `index.html`

**Step 8.4: Update `index.html`**
- Set title to "Monster Deck -- The Witcher Old World"
- Add appropriate meta tags for mobile (viewport, theme-color)

**Step 8.5: End-to-end smoke test (manual)**
- Verify the full flow: open app -> pick monster -> pick level -> start encounter -> flip cards -> apply damage -> defeat monster -> new encounter

---

## File Inventory

### New Files

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript type definitions for the domain |
| `src/data/monsters/griffin.ts` | Griffin monster definition + card pool |
| `src/data/monsters/werewolf.ts` | Werewolf monster definition + card pool |
| `src/data/monsters/foglet.ts` | Foglet monster definition + card pool |
| `src/data/monsters/index.ts` | Monster registry and lookup |
| `src/engine/shuffle.ts` | Fisher-Yates shuffle with injectable RNG |
| `src/engine/deck.ts` | Deck generation from card pool |
| `src/engine/initiative.ts` | Initiative coin flip |
| `src/engine/combat.ts` | Card flip and damage/discard logic |
| `src/engine/abilities.ts` | Ability querying helpers |
| `src/engine/index.ts` | Engine barrel export |
| `src/store/encounterStore.ts` | Zustand encounter state + actions |
| `src/components/setup/MonsterPicker.tsx` | Monster selection grid |
| `src/components/setup/LevelPicker.tsx` | Level selection buttons |
| `src/components/setup/SetupScreen.tsx` | Setup screen composition |
| `src/components/encounter/AbilityPanel.tsx` | Persistent ability display |
| `src/components/encounter/DeckTracker.tsx` | Remaining deck / discard count |
| `src/components/encounter/InitiativeDisplay.tsx` | Initiative result display |
| `src/components/encounter/MonsterCardDisplay.tsx` | Card flip interaction + revealed card |
| `src/components/encounter/PlayerDamageInput.tsx` | Damage stepper + apply button |
| `src/components/encounter/VictoryOverlay.tsx` | Encounter victory screen |
| `src/components/encounter/DiscardAlert.tsx` | Discard-trigger ability notification |
| `src/components/encounter/EncounterScreen.tsx` | Encounter screen composition |
| `src/test/setup.ts` | Vitest + Testing Library setup |
| `src/types/__tests__/types.test.ts` | Type compile-check tests |
| `src/engine/__tests__/shuffle.test.ts` | Shuffle unit tests |
| `src/engine/__tests__/deck.test.ts` | Deck generation unit tests |
| `src/engine/__tests__/initiative.test.ts` | Initiative unit tests |
| `src/engine/__tests__/combat.test.ts` | Combat unit tests |
| `src/engine/__tests__/abilities.test.ts` | Abilities unit tests |
| `src/store/__tests__/encounterStore.test.ts` | Store integration tests |
| `src/components/setup/__tests__/MonsterPicker.test.tsx` | MonsterPicker tests |
| `src/components/setup/__tests__/LevelPicker.test.tsx` | LevelPicker tests |
| `src/components/setup/__tests__/SetupScreen.test.tsx` | SetupScreen integration tests |
| `src/components/encounter/__tests__/AbilityPanel.test.tsx` | AbilityPanel tests |
| `src/components/encounter/__tests__/DeckTracker.test.tsx` | DeckTracker tests |
| `src/components/encounter/__tests__/MonsterCardDisplay.test.tsx` | MonsterCardDisplay tests |
| `src/components/encounter/__tests__/PlayerDamageInput.test.tsx` | PlayerDamageInput tests |
| `src/components/encounter/__tests__/EncounterScreen.test.tsx` | EncounterScreen integration tests |

### Modified Files

| File | Changes |
|------|---------|
| `src/App.tsx` | Replace Vite boilerplate with phase-based screen switching |
| `src/main.tsx` | Minimal changes (may already be correct from scaffold) |
| `src/index.css` | Replace Vite defaults with Tailwind imports + dark theme globals |
| `index.html` | Update title and meta tags |
| `package.json` | Add dependencies and test scripts |
| `vite.config.ts` | Add Tailwind plugin and Vitest config |

---

## Testing Strategy

### Engine Layer (Pure Unit Tests)
- Every function in `src/engine/` gets its own test file
- Use injectable RNG to make tests deterministic -- pass a seeded `rng` function instead of relying on `Math.random`
- Test edge cases: empty deck, damage exceeding deck size, monster with no secondary ability, monster with no discard ability
- Test that shuffle preserves all elements and changes order (with deterministic RNG)
- Test that deck generation produces the correct size for each level

### Store Layer (Integration Tests)
- Test the full encounter lifecycle: setup -> playing -> victory
- Test that actions correctly update all derived state
- Test that discard-trigger abilities are flagged when damage is applied
- Use `act()` from React Testing Library for store updates

### Component Layer (React Testing Library)
- Test user interactions: clicking, tapping, selecting
- Test that components render the correct data from the store
- Test conditional rendering: victory overlay appears when deck is empty, discard alert appears when triggered
- SetupScreen integration test: simulates the full setup flow and verifies the store transitions
- EncounterScreen integration test: simulates flip, damage, and verifies the UI updates

### What NOT to test for MVP
- No E2E tests (Playwright/Cypress). The app is a single page -- manual testing suffices for MVP.
- No visual regression tests. Styling is not the MVP concern.
- No performance tests. The data set is tiny (max 20 cards).

---

## Migration Notes

There is no existing code, database, or deployment. No migration is needed.

### Future considerations
- **Adding monsters:** Drop a new `.ts` file in `src/data/monsters/`, register it in the index. No code changes needed beyond the data file. The monster registry keeps artwork, abilities, and deck sizes organized per monster.
- **Adjusting deck sizes:** Change the `deckSizes` field on the specific monster definition. Per-monster, not global.
- **Top/bottom resolution strategy:** Currently random. Could be changed to a rule-based strategy (e.g., always pick the higher attack) by swapping the logic in `flipCard`. The `RevealedCard` type already tracks which half was chosen.
- **Legendary monsters (L4):** Add `4` to the `MonsterLevel` type, add a deck size entry, author monster data. Movement mechanics would need a new engine module.
- **Persistence:** If encounter state should survive page refresh, add Zustand's `persist` middleware with `localStorage`. One-line change to the store.

---

## Dependency Summary

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19 | UI framework |
| `react-dom` | ^19 | React DOM renderer |
| `zustand` | ^5 | State management |
| `tailwindcss` | ^4 | Utility-first CSS |
| `@tailwindcss/vite` | ^4 | Tailwind Vite integration |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.7 | Type checking |
| `vite` | ^6 | Build tool + dev server |
| `@vitejs/plugin-react` | ^4 | React Fast Refresh |
| `vitest` | ^3 | Test runner |
| `jsdom` | ^26 | DOM environment for tests |
| `@testing-library/react` | ^16 | Component testing |
| `@testing-library/jest-dom` | ^6 | DOM assertion matchers |
| `@testing-library/user-event` | ^14 | User interaction simulation |

---

## Phase Summary

| Phase | Features Covered | Estimated Effort |
|-------|-----------------|-----------------|
| 1. Project Scaffolding | -- | Small (setup) |
| 2. Type Definitions | F2.1 | Small |
| 3. Static Monster Data | F2.1 | Medium (data entry) |
| 4. Game Engine | F2.2, F3.1-F3.3, F4.1-F4.4 | Medium (core logic) |
| 5. State Management | All features | Medium |
| 6. UI -- Setup Screen | F1.1, F1.2 | Medium |
| 7. UI -- Encounter Screen | F4.1-F4.5, F3.1-F3.3 | Large (most components) |
| 8. App Shell & Integration | All features | Small (wiring) |
