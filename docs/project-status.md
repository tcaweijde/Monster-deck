# Monster Deck — Project Status

> Last updated: 2026-06-10

---

## Feature Overview

### ✅ Done (Shipped / 1.0)

| Feature | Notes |
|---------|-------|
| MVP encounter mechanics | Card flip, damage, discard triggers, victory detection |
| Alternating turn engine | Monster ↔ player loop; 0-damage skip supported |
| 29 monsters with art | All using generic card pool; artwork on revealed cards |
| Swipe & flip animations | Framer Motion — swipe to deal damage, tap to flip |
| GitHub Pages deployment | Mobile-accessible at the table |
| FEAT-001 Monster Placement | 3-slot board, location assignment, localStorage persistence, auto-replacement spawning |
| FEAT-002 Generic Card Data + Charge/Bite Display | 20-card shared pool with real values; top/bottom half shown on reveal |
| FEAT-003 Monster Art on Attack Cards | All 29 base-game monsters have card front artwork |

---

### 🔨 Next Iteration (2.0 — Wild Hunt) — *~90% complete*

Store and all UI components are implemented. Three gaps remain before 2.0 ships.

| Sub-feature | Status | Notes |
|---|---|---|
| 010-A Campaign State Engine | ✅ Done | round/stage/phase/difficulty/persist all working |
| 010-B Round Stage Driver | ✅ Done | `advanceStage()` handles all 4 stages, wrap, final battle trigger |
| 010-C Character Selection | ✅ Done | 2-step setup screen (difficulty → character) |
| 010-D Location Tracking | ✅ Done | Location tracking is done by the player.
| 010-E Boss Fight | ✅ Done | `WildHuntEncounterScreen` — shields absorb damage, special card alerts, victory/concede |
| 010-F Shield Counter | ✅ Done | Shown on all WH screens, absorbs damage, manually adjustable |
| 010-G Monster Spawn System | ✅ Done | `spawnTable.ts`, board-full → +1 shield, spawn preview at stage 4 |
| 010-H Hound Enemy Type | ✅ Done | Full `HoundCombatModal` flow, excess damage → shield loss, inline reward popup with level-scaled reward data |
| 010-I Story Card Reminder | ✅ Done | Stage 2 shows exploration card image + "Read Story Card" |
| 010-J Character Data | ✅ Done  | `characters.ts`, `bossMonster.ts`, `bossGenericDeck.ts` validated against actual cards |
| 010-K Proximity Card Bonus | ✅ Done | `ProximitySetupScreen` with Wild Hunt nearby + hound count + Monster Trail toggle |
| 010-L Defeat Screen | ✅ Done | 

---

### 📋 Long-term Backlog

| Release | Features |
|---------|----------|
| 3.0 Monster Trail | Monster-specific cards (FEAT-004), weaknesses (FEAT-005), monster-specific discard triggers (FEAT-006), new attack types (FEAT-011), new card types (FEAT-012), special attacks (FEAT-013) |
| 4.0 Legendary Monsters | L4 tier engine with movement mechanic (FEAT-008), Legendary monster data (FEAT-009) |
| 5.0 Skellige Expansion | Skellige locations (FEAT-SKELLIGE-001), Dagon's Lair (FEAT-SKELLIGE-002), Dagon data (FEAT-SKELLIGE-003), random encounter (FEAT-SKELLIGE-004) |

---

## Codebase State

### Test Results (2026-06-16)

| Suite | Tests | Status |
|-------|-------|--------|
| `engine/abilities` | 24 | ✅ Pass |
| `engine/combat` | 32 | ✅ Pass |
| `engine/deck` | 12 | ✅ Pass |
| `engine/shuffle` | 13 | ✅ Pass |
| `engine/board` | 22 | ✅ Pass |
| `store/encounterStore` | 31 | ✅ Pass |
| `store/boardStore` | 22 | ✅ Pass |
| `store/wildHuntStore` | 44 | ✅ Pass |
| `data/genericCardPool` | 8 | ✅ Pass |
| `data/monsterPools` | 29 | ✅ Pass |
| `components/encounter` | 30 | ✅ Pass |
| `components/board` | 14 | ✅ Pass |
| `components/setup` | 13 | ✅ Pass |
| `components/wildHunt` | 61 | ✅ Pass |
| **Total** | **358** | **✅ All pass** |

**Lint:** 0 errors, 0 warnings.

---

### Strengths

- Clean 3-layer architecture: pure engine functions → Zustand stores → React UI
- Engine functions use injectable RNG — deterministic and fully testable
- All 241 tests green, ESLint clean
- Types are explicit and well-structured

---

## Issues — Priority Ranking

| Priority | Issue | Score |
|----------|-------|-------|
| 1 | ~~**Component test coverage near-zero**~~ ✅ **Resolved** — 358 tests across all 21 previously-untested components. | — |
| 2 | ~~**`wildHuntStore.ts` is 435 lines**~~ ✅ **Resolved** — split into 5 slices (`campaignSlice`, `boardSlice`, `shieldSlice`, `houndSlice`, `uiSlice`). `wildHuntStore.ts` is now a 45-line composition layer. | — |
| 3 | ~~**Roadmap not reflecting actual 2.0 progress**~~ ✅ **Resolved** — roadmap and project-status updated. | — |
| 4 | ~~**Type file fragmentation**~~ ✅ **Resolved** — `src/types/index.ts` now re-exports all Wild Hunt types so consumers import from one place. | — |
| 5 | ~~**`MonsterCardDisplay.tsx` is 229 lines**~~ ✅ **Resolved** — flip and swipe logic extracted into `useCardFlip` and `useCardSwipe` hooks; component is now a slim render-only orchestrator. | — |
| 6 | **No integration / E2E tests** — encounter flow (setup → flip → damage → victory) is only covered via store unit tests, not rendered UI. | 3/10 |
