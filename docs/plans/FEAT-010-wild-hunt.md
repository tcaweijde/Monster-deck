# Implementation Plan: FEAT-010 Wild Hunt

**Spec:** `docs/specs/FEAT-010-wild-hunt.md`
**Created:** 2026-06-04
**Last Updated:** 2026-06-10
**Status:** Active — All planned iterations complete; open TODOs remain (see below)

---

## Implementation Status

| Sub-feature | Description | Status |
|-------------|-------------|--------|
| FEAT-010-A | Wild Hunt setup screen (character + difficulty) | ✅ Done |
| FEAT-010-B | Round/stage driver (8 rounds × 4 stages) | ✅ Done |
| FEAT-010-C | `wildHuntStore` (persisted Zustand store) | ✅ Done |
| FEAT-010-D | Location tracking (Wild Hunt + player) | ✅ Done (manual — no BFS engine) |
| FEAT-010-E | Boss fight encounter | ✅ Done |
| FEAT-010-F | Shield counter (board + monsters screen) | ✅ Done |
| FEAT-010-G | Stage 4 spawn prompts (monster + hound) | ✅ Done |
| FEAT-010-H | Hound combat modal (3-phase, threshold, shield loss) | ✅ Done |
| FEAT-010-I | Wild Hunt monster board slots (3 slots, WH slot cards) | ✅ Done |
| FEAT-010-J | Character data (4 characters + 4 special cards each) | ✅ Done |
| FEAT-010-K | Proximity bonus cards (pre-fight setup screen, +1/hound) | ✅ Done |
| `wh-defeat-rewards` | Add rewards for defeating Wild Hunt monsters/hounds | ✅ Done|
| — | Fill in all character abilities & special card stats | ✅ Done |
| — | Add `WildHuntDefeatScreen` (currently falls back to `wh-board`) |  ✅ Done  |


### Open TODOs

| ID | Description | Blocked on |
|----|-------------|------------|

---

## Key Design Decisions

1. **Wild Hunt is a separate game mode, not a layer on top of board mode.** `App.tsx` derives which screen to show from store state: if `wildHuntStore.phase !== 'inactive'`, show Wild Hunt screens. No extra `mode` useState needed.

2. **`boardStore` is reused in Wild Hunt mode for the 3 regular monster slots.** `boardStore.initNewGame()` is called at Wild Hunt start to populate the board; however, `boardStore.handleVictory()` (auto-spawn) is NOT called after monster defeats in Wild Hunt mode — spawning is driven by the round stage driver. The `WildHuntBoardScreen` reads from both `boardStore` and `wildHuntStore`.

3. **`encounterStore` is reused as-is for both regular and boss encounters.** Stores do not import each other (project convention). `WildHuntEncounterScreen` uses `startEncounterWithMonster(monster)` to start the boss encounter with a synthetic boss `Monster` object.

4. **No `showBossFight` flag.** Boss routing is derived from `wildHuntPhase === 'finalBattle' && encounterPhase !== 'setup'`. On rehydration, `encounterStore` (not persisted) resets to `'setup'`, so the user sees the board with "Begin Final Battle" again — this is acceptable.

5. **`lastDiscardedCard` is one-shot.** Set on card discard, cleared on next flip/pass/skip or when `clearLastDiscardedCard()` is called. Used in boss fight to show per-card discard alerts; the "Gain Shield" button consumes it to prevent repeated gains.

6. **Boss deck = 16 generic + 4 character special = 20 cards.** Defined in `src/data/wildHunt/bossGenericDeck.ts` (cards `generic-01` to `generic-16` from the shared pool). Built in `src/data/wildHunt/bossMonster.ts` via `buildBossMonster(character)`.

7. **`generateDeck` gets a `bonusCount: number = 0` parameter for FEAT-010-K.** Proximity bonus increases the number of cards selected from the pool. Capped at 20 total in `ProximitySetupScreen`.

8. **Hound shield loss = excess damage over threshold (L1=2, L2=3, L3=4).** Excess never makes shields negative (clamped at 0).

9. **`triggerDefeat()` sets `phase = 'defeat'`** (does not call `resetWildHunt` — lets a future defeat screen handle that).

---

## Architecture

### Routing (App.tsx)

```
wildHuntPhase === 'inactive'               → board mode (welcome / board / encounter)
wildHuntPhase === 'setup'                  → wh-setup
wildHuntPhase === 'victory'                → wh-victory
wildHuntPhase === 'defeat'                 → wh-board  (TODO: wh-defeat screen)
wildHuntPhase === 'finalBattle'
  + encounterPhase !== 'setup'             → wh-boss
  + encounterPhase === 'setup'             → wh-board  (Begin Final Battle button)
activeWildHuntSlotIndex !== null
  + showProximitySetup                     → wh-proximity
  + !showProximitySetup                    → encounter  (regular EncounterScreen)
showMonsters                               → wh-monsters
default                                    → wh-board
```

### Store interactions

```
WildHuntBoardScreen
  reads: wildHuntStore (round/stage/phase/shields/hounds/slots)
  reads: boardStore (wildHuntSlots monster data)
  calls: wildHuntStore.advanceStage(), wildHuntStore.setShowMonsters()
  calls: encounterStore.startEncounterWithMonster()   ← boss fight start

WildHuntEncounterScreen   (boss fight)
  reads: encounterStore (deck/turn/phase/lastDiscardedCard)
  reads: wildHuntStore (shieldCount)
  calls: encounterStore.flipMonsterCard/discardOne/passTurn
  calls: encounterStore.clearLastDiscardedCard()
  calls: wildHuntStore.gainShields(), triggerVictory(), resetWildHunt()

EncounterScreen + useEncounterHandlers  (regular WH monster)
  calls: wildHuntStore.absorbDamage(level) on victory → defeatWildHuntSlot()
```

---

## File Inventory

### New Files (this feature)

**Types**
- `src/types/wildHunt.ts` — all Wild Hunt types: `WildHuntPhase`, `WildHuntDifficulty`, `WildHuntCharacter`, `WildHuntSpecialCard`, `HoundSlot`, `WildHuntBoardSlot`, `WildHuntState`

**Data**
- `src/data/wildHunt/characters.ts` — 4 Wild Hunt characters with 4 special cards each
- `src/data/wildHunt/spawnTable.ts` — round × occupied → spawn outcome
- `src/data/wildHunt/bossGenericDeck.ts` — explicit 16-card WH generic pool
- `src/data/wildHunt/bossMonster.ts` — `buildBossMonster(character)` helper

**Store**
- `src/store/wildHuntStore.ts` — Zustand + persist (key: `monster-deck-wh-v2`)
- `src/store/__tests__/wildHuntStore.test.ts` — integration tests

**Components**
- `src/components/wildHunt/WildHuntSetupScreen.tsx`
- `src/components/wildHunt/WildHuntBoardScreen.tsx`
- `src/components/wildHunt/WildHuntMonstersScreen.tsx`
- `src/components/wildHunt/WildHuntEncounterScreen.tsx` — boss fight screen
- `src/components/wildHunt/WildHuntVictoryScreen.tsx` — end-of-run victory
- `src/components/wildHunt/WildHuntSlotCard.tsx`
- `src/components/wildHunt/ShieldCounter.tsx`
- `src/components/wildHunt/HoundCombatModal.tsx`
- `src/components/wildHunt/ProximitySetupScreen.tsx`

### Modified Files

- `src/App.tsx` — Wild Hunt screen routing
- `src/engine/deck.ts` — `bonusCount` parameter
- `src/store/encounterStore.ts` — `startEncounterWithMonster`, `lastDiscardedCard`, `clearLastDiscardedCard`
- `src/hooks/useEncounterHandlers.ts` — exports `inWildHunt`, calls `absorbDamage` on WH monster defeat
- `src/components/encounter/VictoryOverlay.tsx` — `wildHuntShieldLoss` prop
- `src/components/encounter/EncounterScreen.tsx` — passes `inWildHunt`/`displayLevel`
- `src/components/board/BoardWelcomeScreen.tsx` — "Start Wild Hunt" button

---

## Testing Strategy

### Engine tests (unit, pure functions)

All existing engine tests pass. Boss deck generation covered by `generateDeck` existing tests.

### Store tests

**`wildHuntStore.test.ts`** covers: `startWildHunt`, `advanceStage`, `absorbDamage`, `resolveHoundCombat`, `defeatWildHuntSlot`, `resetWildHunt`, `triggerVictory`, shield gain/loss boundaries.

### Component-level

Manual smoke testing via dev server / feature branch preview deployment. No automated component tests (project convention).


---

## Backlog / Known Issues

From smoke testing and design review (post-implementation):

| ID | Description | Priority | Blocked on |
|----|-------------|----------|------------|
| `wh-defeat-screen` | Dedicated defeat screen (round reached, New Run + Quit) | High | — |
| `stage2-exploration-type` | Stage 2 prompt: show Exploration Card I (rounds 1–4) vs II (rounds 5–7) + image asset | Medium | Card image assets |
| `wh-location-ability` | Stage 1: "Wild Hunt moved to my space" button → shows character passive ability | Medium | — |
| `spawn-show-location` | Stage 4 spawn preview: include Wild Hunt location name | Medium | — |
| `nithral-hound-shields` | Nithral: each board hound adds shields before boss fight | Medium | Physical game data |
| `character-hound-decksize` | Hounds affect board monster deck size (character-specific) | Medium | Physical game data |
| `wh-styling` | Wild Hunt visual theme + images (frost/blue accent, character portraits, background image) | Medium | — |

### Boss fight notes

- **Shield-first damage**: confirmed correct — each swipe absorbs 1 damage into shields first; excess removes a card from the deck. Shields can reach 0; subsequent damage hits the deck directly.
- **Special card discard alerts**: text-only (no action buttons). Player reads ability and applies effects manually. The alert fires when a special card is discarded as excess damage.
- **Hound character-specific behavior**: hounds depend on the character and affect board monster deck sizes. Nithral's hounds add shields before the boss fight. Both are blocked on physical game data.
