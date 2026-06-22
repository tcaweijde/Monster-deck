# Implementation Plan: FEAT-030 — Legendary Hunt Campaign Engine

**Spec:** `docs/specs/FEAT-030-legendary-hunt.md`
**Created:** 2026-06-17
**Last audited:** 2026-06-22
**Status:** In Progress — engine/store/UI complete; FEAT-009 monster data 1/7 done

---

## Implementation Status

| Sub-feature | Description | Status |
|-------------|-------------|--------|
| FEAT-030-A | Campaign Setup screen | ✅ Done |
| FEAT-030-B | Round & Stage Driver (4 stages × N rounds) | ✅ Done |
| FEAT-030-C | Movement Deck Engine (draw, display, reshuffle) | ✅ Done |
| FEAT-030-D | Destruction Token Tracker (+/− counter) | ✅ Done |
| FEAT-030-E | Boss Fight Preparation Screen | ✅ Done |
| FEAT-030-F | Legendary Fight Deck Engine (size reduction + protection) | ✅ Done |
| FEAT-009 | Legendary Monster Data (real monsters) | 🔴 In Progress — Ice Giant complete; 6 monsters pending |

### File-level audit (2026-06-22)

| File | Status | Notes |
|------|--------|-------|
| `src/types/index.ts` | ✅ Complete | `AbilityTrigger` extended with `'reveal'` |
| `src/types/legendary.ts` | ✅ Complete | `LegendaryMonster.specialAttacks`, `MovementCard.movementDistanceBy5` added |
| `src/data/legendary/movementDeck.ts` | ✅ Complete | 12 real movement cards with correct board location names; 5-player distances included |
| `src/data/legendary/legendarySharedDeck.ts` | ✅ Complete | 20-card shared fight deck used by all Legendary monsters; `special:N` and `discard:3` effect tokens |
| `src/data/legendary/ice-giant.ts` | ✅ Complete | Ice Giant — passive + 4 special attacks (Rock Throw, Ice Armor, Ice Blast, Powerful Hold); starts at Cidaris |
| `src/data/legendary/trophyProtectionTables.ts` | ✅ Complete | Side A + B tables |
| `src/data/legendary/placeholder-legendary.ts` | ✅ Complete | 22-card deck; retained for dev/testing only |
| `src/data/legendary/legendaryMonsters.ts` | 🔴 In Progress | Ice Giant + placeholder registered; 6 real monsters pending |
| `src/data/legendary/index.ts` | ✅ Complete | Re-exports all data modules |
| `src/engine/legendaryFightDeck.ts` | ✅ Complete | `buildLegendaryFightDeck` + `lookupProtectionValue` |
| `src/engine/__tests__/legendaryFightDeck.test.ts` | ✅ Complete | Full coverage |
| `src/engine/movementDeck.ts` | ✅ Complete | `drawMovementCard` with transparent reshuffle |
| `src/engine/__tests__/movementDeck.test.ts` | ✅ Complete | 11 tests |
| `src/store/legendaryHuntStore.ts` | ✅ Complete | All actions implemented |
| `src/store/__tests__/legendaryHuntStore.test.ts` | ✅ Complete | 40 tests |
| `src/store/encounterStore.ts` | ✅ Complete | `applyPlayerDamageWithProtection` + `startEncounterWithDeck` added |
| `src/components/encounter/MonsterCardDisplay.tsx` | ✅ Complete | `cardBackImage` prop (legendary card back); `specialAttacks` prop + `resolveSpecialEffect()` resolves `special:N` tokens to ability name + description at render time |
| `src/components/legendaryHunt/LegendaryHuntSetupScreen.tsx` | ✅ Complete | Multi-step setup with overwrite/WH guard |
| `src/components/legendaryHunt/LegendaryHuntBoardScreen.tsx` | ✅ Complete | |
| `src/components/legendaryHunt/MovementCardDisplay.tsx` | ✅ Complete | |
| `src/components/legendaryHunt/DestructionTokenCounter.tsx` | ✅ Complete | |
| `src/components/legendaryHunt/BossFightPrepScreen.tsx` | ✅ Complete | |
| `src/components/legendaryHunt/LegendaryEncounterScreen.tsx` | ✅ Complete | Legendary card back; `special:N` effects resolved via monster `specialAttacks`; protection badge + discard alerts |
| `src/components/legendaryHunt/LegendaryHuntVictoryScreen.tsx` | ✅ Complete | |
| `src/components/legendaryHunt/LegendaryHuntDefeatScreen.tsx` | ✅ Complete | |
| `src/components/board/BoardWelcomeScreen.tsx` | ✅ Complete | Legendary Hunt button added |
| `src/App.tsx` | ✅ Complete | All LH routing in place |

**Test suite:** 429 tests passing, TypeScript compiles clean (audited 2026-06-22).

### Remaining work

1. 🔴 Add 6 remaining Legendary monster fight decks (`src/data/legendary/<name>.ts` × 6, register in `legendaryMonsters.ts`) — FEAT-009
2. 🔴 Add art assets for Ice Giant (`images/legendary/ice-giant/portrait.webp`, `card-front-1.webp`) and future monsters

---

## Key Design Decisions

1. **Flat single-file store, no slices.** `legendaryHuntStore.ts` is a single Zustand + persist file. Wild Hunt's slice architecture was necessary because it has orthogonal sub-systems (campaign, board, shields, hounds, UI). Legendary Hunt has one cohesive state machine — a flat file is cleaner and faster to write and test.

2. **All new types in `src/types/legendary.ts`, re-exported from `src/types/index.ts`.** This follows the `wildHunt.ts` precedent exactly. Consumers always import from `'../types'`.

3. **Two new engine files: `movementDeck.ts` and `legendaryFightDeck.ts`.** Movement card draw (with transparent reshuffle) and fight deck preparation (remove-from-front + shuffle) are pure functions that accept an optional `rng` for deterministic testing. They live in `src/engine/` per the architectural constraint that engine code is free of side effects.

4. **Protection is a new `applyPlayerDamageWithProtection(declared, protection)` action on `encounterStore`.** It computes `effectiveDamage = max(0, declared − protection)` and delegates to the existing `applyDamage` engine. Adding one method to the existing store avoids duplicating the victory-detection and discard-pile logic, and keeps the encounter store as the single source of truth for deck state. The existing `applyPlayerDamage` is not modified.

5. **The Legendary fight is launched via `startEncounterWithMonster` with a synthetic `Monster` object built from `LegendaryMonster`.** This reuses the existing encounter loop unchanged. The synthetic object maps `fightDeck → cardPool`, `bossFightDeckSize → deckSize`, and leaves `discardAbility` unset (discard-ability alerts are handled by `LegendaryEncounterScreen` reading `lastDiscardedCard` directly — see Decision 6).

6. **Discard-ability alerts for special cards are rendered by `LegendaryEncounterScreen`, not via `monster.discardAbility`.** The screen reads `lastDiscardedCard` from `encounterStore` and cross-references it against the known `LegendaryMonster.fightDeck`. If the discarded card has `isSpecial: true`, the screen shows the card's `discardAbility` inline. This mirrors the pattern in `WildHuntEncounterScreen` without requiring changes to `encounterStore` logic.

7. **Legendary Hunt routing in `App.tsx` is inserted above Wild Hunt routing.** They are mutually exclusive game modes. The priority chain becomes: `legendaryPhase !== 'inactive'` → LH screens, then `wildHuntPhase !== 'inactive'` → WH screens, then board/welcome. Setup guards prevent starting LH while a WH run is active (and vice versa).

8. **Regular board encounters during a Legendary Hunt campaign reuse `boardStore.activeSlotIndex` exactly as in normal board mode.** When `legendaryPhase === 'playing'` and `boardStore.activeSlotIndex !== null`, `App.tsx` routes to the standard `EncounterScreen`. After the encounter ends, the player returns to the Legendary Hunt board screen. No changes to `boardStore` or `encounterStore` are needed for this.

9. **Movement deck state persisted as `movementDeckRemaining: string[]` and `movementDeckDrawn: string[]` (card IDs).** On draw, the engine pops from `remaining` and pushes to `drawn`. When `remaining` is empty, it reshuffles: shuffle all IDs (drawn + new remaining), set `remaining = shuffled`, `drawn = []`. This is transparent to the player and fully restores on app reload.

10. **`phase: 'bossPrep'` is an explicit lifecycle state** (per spec §5 `LegendaryPhase`). It sits between `'playing'` (final round completed) and `'bossFight'` (encounter running). This avoids a boolean flag and makes the routing unambiguous.

11. **`actualFightDeckSize = 0` triggers immediate victory without launching an encounter.** The `beginBossFight()` store action checks the computed size. If 0, it calls `triggerVictory()` directly; if > 0, it transitions to `'bossFight'` and the component calls `startEncounterWithMonster`.

12. **On rehydration with `phase === 'bossFight'`, the encounter is re-initialised from `bossFightDeckSize`.** The `onRehydrateStorage` callback in the persist config calls the encounter setup equivalent via the Legendary monster data. Since `encounterStore` is not persisted, a rehydration to `'bossFight'` re-launches the encounter with the stored `bossFightDeckSize` and `playerGoesFirst`. The deck will differ from the mid-fight state, but progress is not lost — the player sees a fresh deck at the same size. This matches the Wild Hunt boss-fight rehydration behaviour (Decision 4 in FEAT-010).

---

## Architecture

### Routing (`App.tsx`)

```
legendaryPhase !== 'inactive'
  legendaryPhase === 'setup'                              → lh-setup
  legendaryPhase === 'victory'                            → lh-victory
  legendaryPhase === 'defeat'                             → lh-defeat
  legendaryPhase === 'bossPrep'                           → lh-boss-prep
  legendaryPhase === 'bossFight'
    + encounterPhase !== 'setup'                          → lh-boss
    + encounterPhase === 'setup'                          → lh-board (Begin Boss Fight button)
  boardStore.activeSlotIndex !== null                     → encounter  (standard EncounterScreen)
  default                                                 → lh-board   (stage driver)

wildHuntPhase !== 'inactive'                              → (existing WH routing unchanged)

default                                                   → board / welcome / encounter
```

### Store interactions

```
LegendaryHuntSetupScreen
  reads:  legendaryHuntStore (phase, for overwrite warning)
  reads:  wildHuntStore (phase, to block setup if WH active)
  calls:  legendaryHuntStore.startCampaign(monsterId, difficulty, side)

LegendaryHuntBoardScreen   (stage driver — phases 1–4 each round)
  reads:  legendaryHuntStore (round, stage, roundLimit, destructionTokenCount, phase)
  reads:  boardStore (slots, for Stage 2 monster list)
  calls:  legendaryHuntStore.advanceStage()
  calls:  legendaryHuntStore.claimTokens(amount)    ← Stage 1 stepper
  calls:  legendaryHuntStore.drawMovementCard()     ← Stage 4, uses engine
  calls:  boardStore.setActiveSlot(index)           ← Stage 2 encounter entry

LegendaryEncounterScreen   (boss fight)
  reads:  encounterStore (deck, turn, phase, lastDiscardedCard)
  reads:  legendaryHuntStore (protectionValue, legendaryMonsterId)
  calls:  encounterStore.flipMonsterCard / discardOne / passTurn
  calls:  encounterStore.applyPlayerDamageWithProtection(damage, protection)
  calls:  encounterStore.clearLastDiscardedCard()
  calls:  legendaryHuntStore.triggerVictory() on encounterPhase === 'victory'

BossFightPrepScreen
  reads:  legendaryHuntStore (destructionTokenCount, bossFightDeckSize, playerGoesFirst, legendaryMonsterId)
  calls:  legendaryHuntStore.confirmBossPrep(trophyCount)  ← sets protection + deck size
  calls:  legendaryHuntStore.beginBossFight()             ← transitions phase + launches encounter
  calls:  encounterStore.startEncounterWithMonster(...)   ← after beginBossFight if size > 0
```

---

## Implementation Phases

### Phase 1 — Types + Data Foundations

**Deliverable:** All new TypeScript types and static data structures in place. No UI or logic yet.

**Files to create:**

**`src/types/legendary.ts`** — New file. Contains all Legendary Hunt types:
- `LegendaryDifficulty = 'easy' | 'normal' | 'hard'`
- `LegendaryPhase = 'inactive' | 'setup' | 'playing' | 'bossPrep' | 'bossFight' | 'victory' | 'defeat'`
- `MovementCard` interface (7 fields per spec §5)
- `TrophyProtectionEntry` interface
- `TrophyProtectionTable` interface
- `LegendaryMonsterCard extends MonsterCard` — adds `isSpecial?: boolean` and `discardAbility?: MonsterAbility`
- `LegendaryMonster` interface — `id`, `name`, `startingLocationId: number`, `baseFightDeckSize`, `fightDeck: LegendaryMonsterCard[]`, `passiveAbility: MonsterAbility`, `discardAbility?: MonsterAbility`, `image: string`, `artAssets: string[]`
- `LegendaryCampaignState` interface (all 11 fields from spec §5 domain model)

**`src/types/index.ts`** — Add re-export block at the bottom:
```ts
export type {
  LegendaryDifficulty, LegendaryPhase, MovementCard,
  TrophyProtectionEntry, TrophyProtectionTable,
  LegendaryMonsterCard, LegendaryMonster, LegendaryCampaignState,
} from './legendary';
```

**`src/data/legendary/movementDeck.ts`** — Exports `LEGENDARY_MOVEMENT_DECK: MovementCard[]`. Contains all shared movement cards transcribed from the physical deck. Placeholder entries are acceptable until FEAT-009 physical transcription; minimum 5 cards required for reshuffle logic to be exercisable in tests.

**`src/data/legendary/trophyProtectionTables.ts`** — Exports `TROPHY_PROTECTION_TABLES: TrophyProtectionTable[]` with exactly two entries (Side A and Side B), using the values resolved in OQ-1:
- Side A: 0→3, 1→2, 2→1, 3+→0
- Side B: 0→4, 1→3, 2→2, 3→1, 4+→0

**`src/data/legendary/placeholder-legendary.ts`** — Exports `PLACEHOLDER_LEGENDARY: LegendaryMonster`. Full fight deck of 22 cards (18 standard + 4 special). Use `'placeholder-legendary'` as id. Standard cards have minimal but valid `top`/`bottom` halves. All 4 special cards have `isSpecial: true` and a `discardAbility`. Art asset paths use `'images/legendary/placeholder/portrait.webp'` and `'images/legendary/placeholder/card-front-1.webp'` etc. — these paths do not need to resolve to real files yet.

**`src/data/legendary/index.ts`** — Exports `LEGENDARY_MONSTERS: LegendaryMonster[]` (array containing only `PLACEHOLDER_LEGENDARY` for now). Also re-exports `LEGENDARY_MOVEMENT_DECK` and `TROPHY_PROTECTION_TABLES`.

**Dependencies:** None. Independently completable.

---

### Phase 2 — Engine Functions

**Deliverable:** Two pure engine files with unit tests.

**Files to create:**

**`src/engine/movementDeck.ts`**

Exports one function:
```ts
export function drawMovementCard(
  remaining: string[],
  drawn: string[],
  allCards: MovementCard[],
  rng?: () => number,
): {
  card: MovementCard;
  newRemaining: string[];
  newDrawn: string[];
}
```
Logic:
1. If `remaining.length === 0`: reshuffle — `newRemaining = shuffle([...drawn], rng)`, `newDrawn = []`, then draw from `newRemaining`.
2. Pop index 0 from `remaining` → that card's id.
3. Look up card by id in `allCards`. Throw if not found (data integrity check).
4. Return `{ card, newRemaining: remaining.slice(1), newDrawn: [...drawn, id] }`.

Note: Reshuffle is transparent — no flag returned, no caller notification.

**`src/engine/legendaryFightDeck.ts`**

Exports two functions:

```ts
export function buildLegendaryFightDeck(
  monster: LegendaryMonster,
  actualSize: number,
  rng?: () => number,
): MonsterCard[]
```
Logic:
1. `removeCount = monster.baseFightDeckSize - actualSize` (clamped ≥ 0)
2. Take `monster.fightDeck.slice(removeCount)` — removes from the front (never revealed)
3. Return `shuffle(sliced, rng)`

```ts
export function lookupProtectionValue(
  tables: TrophyProtectionTable[],
  side: 'A' | 'B',
  trophies: number,
): number
```
Logic:
1. Find `table` where `table.side === side`. Throw if not found.
2. Find entry where `trophies >= entry.minTrophies && (entry.maxTrophies === null || trophies <= entry.maxTrophies)`.
3. If no entry found: `console.warn` in development, return the highest-defined `protectionValue` as fallback (per Rule 4 in spec §7).
4. Return `entry.protectionValue`.

**`src/engine/__tests__/movementDeck.test.ts`**

Tests:
- `drawMovementCard` returns correct card and pops from remaining
- `drawMovementCard` with `remaining = []` reshuffles drawn into new remaining and draws
- Deterministic with injected `rng`
- Throws if card id is not found in `allCards`

**`src/engine/__tests__/legendaryFightDeck.test.ts`**

Tests:
- `buildLegendaryFightDeck` returns deck of `actualSize`
- Removes `baseFightDeckSize - actualSize` cards from the front before shuffling
- `actualSize === baseFightDeckSize` returns all cards (shuffled)
- `actualSize === 0` returns empty array
- Deterministic with injected `rng`
- `lookupProtectionValue` returns correct value for Side A tiers
- `lookupProtectionValue` returns correct value for Side B tiers
- `lookupProtectionValue` matches the open-ended top tier (null maxTrophies)
- `lookupProtectionValue` warns and falls back on malformed table

**Dependencies:** Phase 1 (types + data).

---

### Phase 3 — Campaign Store

**Deliverable:** Full `legendaryHuntStore` with all actions, persistence, and tests.

**Files to create:**

**`src/store/legendaryHuntStore.ts`**

Flat Zustand store with `zustand/persist`. Persist key: `'monster-deck-lh-v1'`.

State shape exactly matches `LegendaryCampaignState` from Phase 1, plus `currentMovementCard: MovementCard | null` (not persisted — display-only, cleared on rehydration).

Initial state:
```ts
const INITIAL_STATE: LegendaryCampaignState & { currentMovementCard: MovementCard | null } = {
  phase: 'inactive',
  difficulty: 'normal',
  campaignSide: 'A',
  roundLimit: 8,
  round: 1,
  stage: 1,
  legendaryMonsterId: '',
  destructionTokenCount: 0,
  movementDeckDrawn: [],
  movementDeckRemaining: [],
  protectionValue: 0,
  bossFightDeckSize: null,
  playerGoesFirst: null,
  currentMovementCard: null,
};
```

Actions:
- **`initiateSetup()`** — sets `phase = 'setup'`. Called from welcome screen "Start Legendary Hunt" button. Does not clear existing campaign data yet (overwrite happens in `startCampaign`).
- **`startCampaign(monsterId, difficulty, side, whPhase)`** — builds initial state, shuffles movement deck (all card IDs shuffled → `movementDeckRemaining`, `movementDeckDrawn = []`), sets `phase = 'playing'`. **No-ops if `whPhase !== 'inactive'`** (WH phase passed in as a parameter; stores do not import each other).
- **`advanceStage()`** — increments stage 1→4. At stage 4: if `round >= roundLimit`, set `phase = 'bossPrep'`; otherwise increment `round`, reset `stage = 1`. Does NOT execute movement card draw — that happens via `drawMovementCard()` in the Stage 4 component before calling `advanceStage`.
- **`claimTokens(amount: number)`** — `destructionTokenCount += amount`. No-op if `amount <= 0`.
- **`drawMovementCard()`** — calls `drawMovementCard` engine function with current `movementDeckRemaining`, `movementDeckDrawn`, and `LEGENDARY_MOVEMENT_DECK`. Updates state with `newRemaining`, `newDrawn`, and sets `currentMovementCard`.
- **`confirmBossPrep(trophyCount: number)`** — calls `lookupProtectionValue`, computes `actualFightDeckSize = max(0, baseFightDeckSize - destructionTokenCount)`, sets `protectionValue`, `bossFightDeckSize`, `playerGoesFirst`, resets `destructionTokenCount = 0`.
- **`beginBossFight()`** — if `bossFightDeckSize === 0`, calls `triggerVictory()`; otherwise sets `phase = 'bossFight'`.
- **`triggerVictory()`** — `phase = 'victory'`.
- **`triggerDefeat()`** — `phase = 'defeat'`.
- **`resetCampaign()`** — resets to `INITIAL_STATE`.

`onRehydrateStorage`:
- Clear `currentMovementCard` (display-only, not meaningful after reload)
- If `phase === 'bossFight'`: leave as `'bossFight'` — the `BossFightPrepScreen`/`LegendaryEncounterScreen` re-launches the encounter on mount

**`src/store/__tests__/legendaryHuntStore.test.ts`**

Mirrors `wildHuntStore.test.ts` structure: `vi.hoisted` localStorage mock, mock `LEGENDARY_MOVEMENT_DECK` and engine functions, then test all actions.

Tests:
- `startCampaign` produces correct initial state per difficulty (round limits: easy=9, normal=8, hard=7)
- `startCampaign` with existing active campaign: store overwrites (warning is also enforced at UI-level)
- `startCampaign` no-ops if `whPhase !== 'inactive'` (passed in as parameter)
- `advanceStage` stage 1→2→3→4 within a non-final round
- `advanceStage` at stage 4, non-final round → increments round, resets stage to 1
- `advanceStage` at stage 4, final round → sets `phase = 'bossPrep'`
- `claimTokens` increments `destructionTokenCount`
- `claimTokens(0)` is a no-op
- `confirmBossPrep` computes correct `protectionValue` and `bossFightDeckSize`
- `confirmBossPrep` clamps `bossFightDeckSize` to minimum 0
- `confirmBossPrep` resets `destructionTokenCount = 0`
- `beginBossFight` with `bossFightDeckSize = 0` → `phase = 'victory'` (Rule 2)
- `beginBossFight` with `bossFightDeckSize > 0` → `phase = 'bossFight'`
- `triggerVictory` / `triggerDefeat` set correct phase
- Persistence round-trip: state survives serialize/deserialize

**Dependencies:** Phases 1 + 2.

---

### Phase 4 — Round & Stage Driver UI + Token Counter

**Deliverable:** Main campaign screen showing current round/stage with advance controls. Destruction token stepper visible during Stage 1. Stage 4 draws and displays the movement card (built on Phase 6 component). This phase delivers FEAT-030-B and FEAT-030-D end-to-end.

**Files to create:**

**`src/components/legendaryHunt/LegendaryHuntBoardScreen.tsx`**

Main campaign screen. Reads `round`, `stage`, `roundLimit`, `destructionTokenCount` from `legendaryHuntStore`.

Stage rendering:
- **Stage 1 (Player Phase 1 — Movement):** Heading "Player Phase 1 — Movement". Reminder text: "Claim any destruction tokens from locations the Legendary monster departed." `DestructionTokenCounter` component visible. "Next Stage" button calls `advanceStage()`.
- **Stage 2 (Player Phase 2 — Fight / Meditation / Explore):** Heading "Player Phase 2 — Fight / Meditate / Explore". Prompt text for the active phase. Board monster list (from `boardStore.board.slots`) shown so the player can tap to start an encounter. "Next Stage" button calls `advanceStage()`. "Next Stage" is disabled while `boardStore.activeSlotIndex !== null` (encounter in progress — rare, App.tsx handles routing away, but guard defensively).
- **Stage 3 (Player Phase 3 — Training):** Heading "Player Phase 3 — Training". Reminder: "Complete training and any remaining physical upkeep." "Next Stage" button calls `advanceStage()`.
- **Stage 4 (End of Round — Legendary Movement):** Heading "End of Round — Legendary Monster Moves". On mount (when stage becomes 4), auto-calls `legendaryHuntStore.drawMovementCard()`. Renders `MovementCardDisplay` with `currentMovementCard`. Destruction token reminder shown below card. "Complete Round" button calls `advanceStage()`. Button label changes to "Proceed to Boss Fight" on the final round.

Round indicator: persistent header showing `Round {round} / {roundLimit}`.

**`src/components/legendaryHunt/DestructionTokenCounter.tsx`**

Reads `destructionTokenCount` from `legendaryHuntStore`. Displays current total prominently. "Claim Tokens" button opens an inline stepper (integer input, ≥ 0). On confirm, calls `claimTokens(amount)`. Stepper resets to 0 after each claim.

**Dependencies:** Phase 3 (store).

---

### Phase 5 — Campaign Setup UI

**Deliverable:** Setup screen for choosing difficulty, monster, and campaign side. Entry point wired into welcome screen.

**Files to create:**

**`src/components/legendaryHunt/LegendaryHuntSetupScreen.tsx`**

Three-step form (can be a single scrollable screen):
1. **Monster selection** — Cards for each monster in `LEGENDARY_MONSTERS`. Tap to select. Shows name and art (`monster.image`). With only the placeholder, a single selectable card is shown.
2. **Difficulty selection** — Three buttons: Easy (9 rounds), Normal (8 rounds), Hard (7 rounds). Shows round count preview. Default: Normal.
3. **Campaign side** — Two toggle buttons: Side A / Side B. Default: A.

"Start Campaign" button at bottom. If `legendaryHuntStore.phase !== 'inactive'` (existing active campaign), shows a confirmation dialog: _"This will end your current campaign (Round X of Y). Continue?"_ Only calls `startCampaign()` after confirmation. If `wildHuntStore.phase !== 'inactive'`, shows a different warning: _"A Wild Hunt run is in progress. Legendary Hunt cannot be started at the same time."_ — button disabled (does not allow override).

**Files to modify:**

**`src/components/board/BoardWelcomeScreen.tsx`** — Add "Start Legendary Hunt" button below the existing "Start Wild Hunt" button. Calls `legendaryHuntStore.initiateSetup()`.

**`src/App.tsx`** — Insert Legendary Hunt routing block before Wild Hunt routing (see Architecture section). Import `useLegendaryHuntStore` and new screen components. Add `lh-setup`, `lh-board`, `lh-victory`, `lh-defeat`, `lh-boss-prep`, `lh-boss` screen values to the `screen` derivation. Add `{screen === 'lh-setup' && <LegendaryHuntSetupScreen />}` etc. in the render block. Wire `lh-boss` into the encounter slide-up animation layer (same as `wh-boss`).

**Dependencies:** Phases 3 + 4.

---

### Phase 6 — Movement Card Display

**Deliverable:** Movement card component shown in Stage 4 of each round.

**Files to create:**

**`src/components/legendaryHunt/MovementCardDisplay.tsx`**

Props: `card: MovementCard | null`.

When `card` is null: shows a loading/drawing indicator (movement card is auto-drawn on stage 4 mount, so null state is momentary).

When `card` is present: displays:
- **"Move toward: {targetLocation1Name}"**
- **"then toward: {targetLocation2Name}"**
- **"{movementDistanceSolo} steps"**
- Destruction token reminder: _"Place one destruction token at each location you depart from (not the landing spot)."_

Destruction token reminder is always shown after the card, regardless of movement distance.

**Dependencies:** Phase 4 (used within `LegendaryHuntBoardScreen`).

---

### Phase 7 — Boss Fight Preparation Screen

**Deliverable:** Screen that computes protection value and fight deck size from trophy count.

**Files to create:**

**`src/components/legendaryHunt/BossFightPrepScreen.tsx`**

Reads from `legendaryHuntStore`: `legendaryMonsterId`, `destructionTokenCount`, `campaignSide`, `bossFightDeckSize`, `protectionValue`, `playerGoesFirst`.

Looks up `LegendaryMonster` from `LEGENDARY_MONSTERS` by `legendaryMonsterId`.

UI:
- Monster name + art
- Campaign Side badge (A or B)
- Trophy count input (number input, `min=0`, integer only). Live preview computes and displays `protectionValue` and `actualFightDeckSize` as the player types.
- Display: `baseDeckSize`, `destructionTokenCount` (read-only), `protectionValue`, `actualFightDeckSize`
- Initiative ruling: "You go first" if `destructionTokenCount > 0` (computed before confirm); "Standard initiative" otherwise
- If computed `actualFightDeckSize === 0`: special message "Legendary monster immediately defeated — no fight needed"
- "Begin Boss Fight" button calls `confirmBossPrep(trophyCount)` then `beginBossFight()`. If `bossFightDeckSize > 0`, also calls `encounterStore.startEncounterWithMonster(syntheticMonster, playerGoesFirst)`.

Building the synthetic Monster for `startEncounterWithMonster`:
```ts
const syntheticMonster: Monster = {
  id: legendary.id,
  name: legendary.name,
  level: 4,
  deckSize: state.bossFightDeckSize,
  baseAbility: legendary.passiveAbility,
  discardAbility: undefined,   // per-card alerts handled by LegendaryEncounterScreen
  cardPool: buildLegendaryFightDeck(legendary, state.bossFightDeckSize, Math.random),
  cardFrontImages: legendary.artAssets,
};
```

Note: `buildLegendaryFightDeck` returns the already-trimmed-and-shuffled deck. This is passed as `cardPool`. `generateDeck` is called by `startEncounterWithMonster` with `deckSize === cardPool.length`, so it selects all cards and shuffles them once more — acceptable (the deck is already the correct size and shuffled; a second shuffle introduces no bias).

Actually, to avoid the double-shuffle and guarantee exact deck composition, `startEncounterWithMonster` should be called with a deck that bypasses `generateDeck`. **Preferred: build the deck before calling the store, and use `encounterStore`'s internal `set` to initialise directly.** However, since `encounterStore` does not expose a `startEncounterWithDeck` method, the cleanest path is to add one:

**`src/store/encounterStore.ts`** — Add `startEncounterWithDeck(deck: MonsterCard[], monster: Monster, playerFirst?: boolean)`. This sets deck directly without calling `generateDeck`. This is a minimal surgical addition that does not alter existing methods.

**Dependencies:** Phases 3 + 2 (engine) + 5 (App routing for `lh-boss-prep` screen).

---

### Phase 8 — Legendary Fight Integration

**Deliverable:** Full boss fight screen with protection mechanic and special card alerts.

**Files to modify:**

**`src/store/encounterStore.ts`** — Add `applyPlayerDamageWithProtection(declared: number, protection: number)`:
```ts
applyPlayerDamageWithProtection: (declared, protection) => {
  const effective = Math.max(0, declared - protection);
  get().applyPlayerDamage(effective);
},
```
This delegates entirely to the existing `applyPlayerDamage`. No duplication of victory detection.

**Files to create:**

**`src/components/legendaryHunt/LegendaryEncounterScreen.tsx`**

Composition strategy: wraps or mirrors `EncounterScreen` rather than rewriting it. Reads:
- `encounterStore`: `deck`, `turn`, `phase`, `currentCard`, `lastDiscardedCard`
- `legendaryHuntStore`: `protectionValue`, `legendaryMonsterId`, `playerGoesFirst`
- Looks up `LegendaryMonster` from `LEGENDARY_MONSTERS`

Differences from standard `EncounterScreen`:
1. **Player damage input:** Renders a damage number input + "Apply Damage" button. On submit, calls `applyPlayerDamageWithProtection(input, protectionValue)` instead of `applyPlayerDamage`. Displays: _"Protection: {protectionValue} — Effective damage: {max(0, input - protectionValue)}"_ as a live preview.
2. **Special card discard alerts:** After each discard action, reads `lastDiscardedCard`. Cross-references against `legendary.fightDeck` — if a card with matching id has `isSpecial: true`, renders the card's `discardAbility.description` in an alert overlay. Player must dismiss the alert. On dismiss, calls `clearLastDiscardedCard()`.
3. **Victory handling:** When `encounterPhase === 'victory'`, calls `legendaryHuntStore.triggerVictory()`.
4. **Header:** Shows monster name, `protectionValue` badge, current deck size, and `playerGoesFirst` initiative badge.

`LegendaryEncounterScreen` does **not** inherit `EncounterScreen` via component composition — it is a standalone screen for clarity and because the protection overlay and damage input differ enough from the standard screen that composing would be awkward.

**Dependencies:** Phase 7 (boss fight prep sets deck in encounterStore).

---

### Phase 9 — Victory / Defeat Screens

**Deliverable:** Terminal screens for campaign end states.

**Files to create:**

**`src/components/legendaryHunt/LegendaryHuntVictoryScreen.tsx`**

Reads `legendaryMonsterId`, `round`, `roundLimit`, `difficulty` from `legendaryHuntStore`. Displays: monster name, round reached, difficulty, congratulations text. Two buttons: "New Campaign" → calls `resetCampaign()` then `initiateSetup()`; "Return to Board" → calls `resetCampaign()` (returns to board mode).

**`src/components/legendaryHunt/LegendaryHuntDefeatScreen.tsx`**

Reads same fields. Displays: monster name, round limit reached, defeat message. Two buttons: "Try Again" → calls `resetCampaign()` then `initiateSetup()`; "Return to Board" → calls `resetCampaign()`.

**Dependencies:** Phase 5 (App.tsx routing).

---

## File Inventory

### New Files

**Types**
- `src/types/legendary.ts` — All Legendary Hunt types

**Data**
- `src/data/legendary/movementDeck.ts` — Shared `LEGENDARY_MOVEMENT_DECK: MovementCard[]`
- `src/data/legendary/trophyProtectionTables.ts` — `TROPHY_PROTECTION_TABLES: TrophyProtectionTable[]`
- `src/data/legendary/placeholder-legendary.ts` — `PLACEHOLDER_LEGENDARY: LegendaryMonster` (22-card fight deck, 4 special)
- `src/data/legendary/index.ts` — `LEGENDARY_MONSTERS` array + re-exports

**Engine**
- `src/engine/movementDeck.ts` — `drawMovementCard()` pure function
- `src/engine/legendaryFightDeck.ts` — `buildLegendaryFightDeck()` + `lookupProtectionValue()` pure functions
- `src/engine/__tests__/movementDeck.test.ts` — Unit tests
- `src/engine/__tests__/legendaryFightDeck.test.ts` — Unit tests

**Store**
- `src/store/legendaryHuntStore.ts` — Zustand + persist (key: `monster-deck-lh-v1`)
- `src/store/__tests__/legendaryHuntStore.test.ts` — Store integration tests

**Components**
- `src/components/legendaryHunt/LegendaryHuntSetupScreen.tsx` — FEAT-030-A
- `src/components/legendaryHunt/LegendaryHuntBoardScreen.tsx` — FEAT-030-B main driver
- `src/components/legendaryHunt/DestructionTokenCounter.tsx` — FEAT-030-D
- `src/components/legendaryHunt/MovementCardDisplay.tsx` — FEAT-030-C card display
- `src/components/legendaryHunt/BossFightPrepScreen.tsx` — FEAT-030-E
- `src/components/legendaryHunt/LegendaryEncounterScreen.tsx` — FEAT-030-F boss fight
- `src/components/legendaryHunt/LegendaryHuntVictoryScreen.tsx` — Victory screen
- `src/components/legendaryHunt/LegendaryHuntDefeatScreen.tsx` — Defeat screen

### Modified Files

- `src/types/index.ts` — Add `export type { ... } from './legendary'` block
- `src/store/encounterStore.ts` — Add `applyPlayerDamageWithProtection(declared, protection)` and `startEncounterWithDeck(deck, monster, playerFirst?)`
- `src/App.tsx` — Insert LH routing block (priority above Wild Hunt), import new screens
- `src/components/board/BoardWelcomeScreen.tsx` — Add "Start Legendary Hunt" button

---

## Testing Strategy

### Phase 1 — Types + Data (no tests, validation only)
TypeScript compilation confirms type shapes. `PLACEHOLDER_LEGENDARY.fightDeck.length === PLACEHOLDER_LEGENDARY.baseFightDeckSize` checked manually. Exactly 4 cards with `isSpecial: true`.

### Phase 2 — Engine (unit tests)

**`movementDeck.test.ts`:** Pure function tests with `rng = () => 0` for determinism. Key cases: normal draw, reshuffle on empty, missing-card throw.

**`legendaryFightDeck.test.ts`:** `buildLegendaryFightDeck` with `actualSize = baseFightDeckSize` (full deck), `actualSize = 0` (empty), `actualSize = baseFightDeckSize - 4` (removes 4 from front). `lookupProtectionValue` with both sides, all trophy tiers, and the null-max (open-ended) tier.

### Phase 3 — Store (integration tests)

Follow `wildHuntStore.test.ts` pattern: `vi.hoisted` localStorage mock, mock data imports with `vi.mock`, import store after all mocks. Test all action paths including edge cases (zero bossFightDeckSize → immediate victory, round advancement at limit → bossPrep).

### Phase 4–9 — Components (manual smoke testing)

No automated component tests per project convention. Verify via `npm run dev` on a feature branch:
- Full campaign run: setup → 3 rounds → boss prep → boss fight → victory
- Overwrite warning when campaign exists
- Token claim and persistence (force-close and reopen app)
- Movement card display and reshuffle (run through all cards)
- Protection calculation preview on boss prep screen
- Damage protection on boss fight (declare 2 with protection 3 → 0 effective)
- Special card discard alert fires correctly
- Defeat path (use Hard difficulty with placeholder, advance to final round without winning)
- Rehydration to `bossFight` phase re-launches encounter cleanly

---

## Phase Dependencies

```
Phase 1 (Types + Data)
    └─ Phase 2 (Engine)
          └─ Phase 3 (Store)
                ├─ Phase 4 (Stage Driver UI + Token Counter)
                │     ├─ Phase 5 (Setup UI + App.tsx routing)
                │     │     └─ Phase 6 (Movement Card Display) [can ship with Phase 4]
                │     │     └─ Phase 7 (Boss Prep Screen)
                │     │           └─ Phase 8 (Legendary Fight Integration)
                │     │                 └─ Phase 9 (Victory / Defeat Screens)
                │     └─ Phase 9 (can stub screens earlier for routing smoke test)
```

Phases 4 and 6 can be developed concurrently — `MovementCardDisplay` is a pure presentational component with no store dependency. Phase 9 screens are simple and can be stubbed early to unblock routing smoke tests.

---

## Migration Notes

- No database migrations. All state is client-side `localStorage`.
- Persist key `'monster-deck-lh-v1'` is new — no conflict with existing `'monster-deck-wh-v2'`.
- `encounterStore` is not persisted and requires no migration.
- The two new `encounterStore` methods (`startEncounterWithDeck`, `applyPlayerDamageWithProtection`) are additive and do not alter existing method signatures — no breaking change for Wild Hunt encounters.
- `boardStore` is untouched.

---

## Uncertainty Flags

These items require confirmation or clarification during implementation:

| # | Flag | Impact | Decision |
|---|------|--------|----------|
| UF-1 | **Movement deck card count.** How many cards are in the physical shared movement deck? The placeholder uses 5–10 cards; the actual transcription is FEAT-009 backlog. Low impact on architecture — only affects `movementDeck.ts` data content. | Low | Defer to FEAT-009 backlog |
| UF-2 | **`startEncounterWithDeck` vs double-shuffle.** Adding `startEncounterWithDeck` to `encounterStore` is the cleanest path and avoids double-shuffle of a pre-built deck. | Low | ✅ **Add `startEncounterWithDeck`** — confirmed |
| UF-3 | **Placeholder monster art assets.** `LegendaryEncounterScreen` and `BossFightPrepScreen` reference art paths (`images/legendary/placeholder/*.webp`) that don't exist yet. Component should gracefully fall back to a placeholder image or hide the `<img>` if the asset 404s. | Low | Defer to FEAT-009 backlog; implement graceful fallback in Phase 8 |
| UF-4 | **`stage` type.** Wild Hunt stores `stage` as `1 | 2 | 3 | 4` (union literal). Legendary Hunt also has exactly 4 stages. Use the same union literal type in `LegendaryCampaignState.stage`. | Low | Apply in Phase 1 types |
| UF-5 | **LH and WH mutual exclusion enforcement.** Guard in **both** the UI (`LegendaryHuntSetupScreen` disables Start if WH is active) **and** the store (`startCampaign` no-ops if `wildHuntStore.phase !== 'inactive'`). Stores don't import each other — pass the WH phase as a parameter to `startCampaign(config, whPhase)` and guard on it. | Medium | ✅ **UI + store guard** — confirmed |
| UF-6 | **Regular board encounters during Legendary Hunt Stage 2.** `LegendaryHuntBoardScreen` lists board monsters from `boardStore`. Tapping one sets `boardStore.activeSlotIndex`. App.tsx routes to `EncounterScreen`. On encounter end, `boardStore.activeSlotIndex` returns to null and App.tsx re-routes to `lh-board`. Confirm this flow works without a dedicated WH-style `activeWildHuntSlotIndex` mechanism. The key question: does the standard encounter victory flow (which may call `boardStore.handleVictory`) interfere with the Legendary Hunt campaign state? It should not — `boardStore.handleVictory` only modifies `boardStore`, which is independent of `legendaryHuntStore`. | Medium | Verify in Phase 5 during App.tsx routing wiring |

---

## Backlog / Known Issues

| ID | Description | Priority |
|----|-------------|----------|
| `lh-monster-data` | Transcribe all 7 real Legendary monsters from physical rulebook (FEAT-009) | High — blocks real gameplay |
| `lh-movement-deck-data` | Transcribe complete shared movement deck from physical deck | High — blocks real gameplay |
| `lh-styling` | Legendary Hunt visual theme (golden/dark accent, monster portrait backgrounds) | Medium |
| `lh-multiplayer-distance` | Movement card display for multiplayer (show `movementDistanceBy2/3/4` if present) | Low — solo only for now |
| `lh-board-topology` | App-tracked monster position + automatic destruction token counting (deferred per spec §9 Out of Scope) | Backlog |