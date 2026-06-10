# Monster Deck — Roadmap

> Digital opponent for The Witcher Old World solo play.
> Last updated: 2026-06-03 · Living document — update at each release milestone.

---

## Vision

Replace the physical monster card deck with a seamless digital opponent that handles
encounter setup, card flipping, damage tracking, ability resolution, and board management
— so the player can focus on the game, not the bookkeeping.

---

## Feature Index

| ID | Feature | Release | Status |
|----|---------|---------|--------|
| FEAT-000 | MVP encounter mechanics | Shipped | ✅ Done |
| FEAT-000 | Alternating turn engine | Shipped | ✅ Done |
| FEAT-000 | Monster data (4 monsters) | Shipped | ✅ Done |
| FEAT-000 | Swipe & flip animations | Shipped | ✅ Done |
| FEAT-000 | GitHub Pages deployment | Shipped | ✅ Done |
| FEAT-001 | Monster Placement | 1.0 | ✅ Done |
| FEAT-002 | Generic Card Data + Charge/Bite Display | 1.0 | ✅ Done |
| FEAT-003 | Monster Art on Attack Cards | 1.0 | ✅ Done |
| FEAT-004 | Monster-Specific Attack Cards | 3.0 | 🔲 Todo |
| FEAT-005 | Monster Weaknesses | 3.0 | 🔲 Todo |
| FEAT-006 | Monster-Specific Discard-Trigger Abilities | 3.0 | 🔲 Todo |
| FEAT-007 | Monster-Specific Card Art | 3.0 | 🔲 Could-have |
| FEAT-011 | New Attack Types | 6.0 | 🔲 Todo |
| FEAT-012 | New Card Types | 6.0 | 🔲 Todo |
| FEAT-013 | Special Attacks | 6.0 | 🔲 Todo |
| FEAT-SKELLIGE-001 | Skellige Locations | 5.0 | 🔲 Todo |
| FEAT-SKELLIGE-002 | Dagon's Lair | 5.0 | 🔲 Todo |
| FEAT-SKELLIGE-003 | Dagon Monster Data | 5.0 | 🔲 Todo |
| FEAT-SKELLIGE-004 | Random Encounter | 5.0 | 🔲 Todo |
| FEAT-008 | Legendary Monster Engine | 4.0 | 🔲 Todo |
| FEAT-009 | Legendary Monster Data | 4.0 | 🔲 Todo |
| FEAT-010-A | Campaign State Engine | 2.0 | ✅ Done |
| FEAT-010-B | Round Stage Driver | 2.0 | ✅ Done |
| FEAT-010-C | Wild Hunt Character Selection | 2.0 | ✅ Done |
| FEAT-010-D | Wild Hunt Location Tracking | 2.0 | ✅ Done|
| FEAT-010-E | Wild Hunt Encounter (Boss Fight) | 2.0 | ✅ Done |
| FEAT-010-F | Shield Counter | 2.0 | ✅ Done |
| FEAT-010-G | Monster Spawn System | 2.0 | ✅ Done |
| FEAT-010-H | Hound Enemy Type | 2.0 | ⚠️ Partially Done |
| FEAT-010-I | Story Card Reminder | 2.0 | ✅ Done |
| FEAT-010-J | Wild Hunt Character Data | 2.0 | ⚠️ Partially Done |
| FEAT-010-K | Monster Proximity Card Bonus | 2.0 | ✅ Done |
| FEAT-010-L | Defeat Screen & Auto-Detect | 2.0 | 🔲 Todo |

---

## ✅ Shipped

| Feature | Notes |
|---------|-------|
| MVP encounter mechanics | Monster selection, card flip, damage/discard, discard-trigger abilities, victory detection |
| Alternating turn engine | Monster turn → player turn loop; 0-damage skip supported |
| Monster data (4 monsters) | Griffin, Werewolf, Foglet, Rotfiend — abilities correct, generic card values placeholder |
| Swipe & flip animations | Framer Motion — swipe to deal damage, tap to flip card |
| GitHub Pages deployment | App accessible on mobile at the table |
| FEAT-001 Monster Placement | 3-monster board, location assignment, persistence, replacement spawning |
| FEAT-002 Generic Card Data + Charge/Bite Display | 20-card shared pool with real values; Charge/Bite label shown on flip; `CardHalf.attack` optional for effect-only halves |
| FEAT-003 Monster Art on Attack Cards | Card front images for all 29 base-game monsters; `cardFrontImages` paths aligned to `1.jpg` convention |

---

## ✅ 1.0 — Full Base Game *(Released)*

> **Goal:** A complete, polished solo experience for the base game. No placeholders.
> Every interaction should feel accurate to the physical game.

### ✅ FEAT-001 — Monster Placement *(L)*
- At game start, randomly assigns 3 distinct monsters (L1/L2/L3, one per location type: water/mountain/woods) to numbered locations from the 18-location base-game board
- Board overview screen: shows all 3 active monsters with name, level, location type, and location name
- Tap a monster on the board to launch its encounter directly
- After victory, return to board overview and automatically spawn a replacement monster (same location type, next level, distinct location number)
- Board state persisted to `localStorage` — survives app refresh
- Spec: [`docs/specs/FEAT-001-monster-placement.md`](../specs/FEAT-001-monster-placement.md) · Plan: [`docs/plans/FEAT-001-monster-placement.md`](../plans/FEAT-001-monster-placement.md)

### ✅ FEAT-002 — Generic Card Data + Charge/Bite Display *(M)*
- Fill in real attack values and effect text for all shared (generic) monster attack cards
- Reveal the top/bottom half of each card (Charge / Bite) — currently resolved by internal RNG; the result should now be displayed to the player
- All 20+ monsters use the same generic card pool; this benefits every monster in the app at once
- Spec: [`docs/specs/FEAT-002-generic-card-data-and-half-display.md`](../specs/FEAT-002-generic-card-data-and-half-display.md)

### ✅ FEAT-003 — Monster Art on Attack Cards *(M)*
- Display monster artwork on the revealed card during an encounter
- One image per monster (not per card)
- Assets stored in `public/images/<monster>/`, referenced via `cardFrontImages` on `Monster`
- All 29 base-game monsters have artwork

---

## 2.0 — Wild Hunt Expansion *(In Progress — ~90% complete)*

> **Goal:** Support the Wild Hunt expansion — an 8-round campaign mode with a boss fight
> against one of 4 Wild Hunt characters. Introduces campaign state, round stage tracking,
> a shield counter, hound enemies, and a monster spawn system. Largest scope expansion in
> the roadmap. Full spec: [`docs/specs/FEAT-010-wild-hunt.md`](../specs/FEAT-010-wild-hunt.md)
>
> **Status (2026-06-10):** Largely implemented. Store (`wildHuntStore.ts`), all UI screens,
> and data files exist. Three gaps remain before 2.0 can ship — see below.

### ✅ FEAT-010-A — Campaign State Engine *(M)*
- Track an 8-round campaign session with persistent state (survives refresh)
- Round counter, stage progress, win/boss-fight trigger at round 8 stage 4
- **Campaign setup**: player count (solo for now) + difficulty level selection

### ✅ FEAT-010-B — Round Stage Driver *(M)*
- App drives player through 4 ordered stages each round:
  1. **Movement & Action** (player acts physically; app shows prompt)
  2. **Fight, Meditation & Exploration** (story card reminder shown here — see FEAT-010-I)
  3. **Drawing & Gaining Cards** (player acts physically; app shows prompt)
  4. **Add Hound & Monster** (spawn phase) — **round 8: triggers Final Battle instead**

### ✅ FEAT-010-C — Wild Hunt Character Selection *(S)*
- Campaign-start screen: pick one of 4 pre-built characters
- Each character has a fixed name and passive ability

### ✅ FEAT-010-D — Wild Hunt Location *(M)*
- Wild Hunt has a board position; moves **2 spaces toward player** each round (shortest path)
- Round 8 stage 4 triggers Final Battle

### ✅ FEAT-010-E — Wild Hunt Encounter (Boss Fight) *(L)*
- Uses existing encounter engine + 4 character-specific special cards
- Special cards have discard-trigger abilities (fire when discarded as player damage)
- Shield counter absorbs damage before cards are discarded (see FEAT-010-F)

### ✅ FEAT-010-F — Shield Counter *(M)*
- Numeric counter displayed on Wild Hunt board card and in encounter screen
- Player damage depletes shields first; overflow discards deck cards
- **Manually adjustable (+/−)** — story card events can add or remove shields at any time
- Auto-increments when monster spawn overflows (see FEAT-010-G)

### ✅ FEAT-010-G — Monster Spawn System *(M)*
- Per-round spawn table defines what level monsters and/or hounds to spawn
- App shows spawn prompt during stage 4; player handles physical placement
- Board-full overflow: Wild Hunt gains +1 shield instead of spawning

###  FEAT-010-H — Hound Enemy Type *(M)*
- L1/L2/L3 one-off enemy; tracked outside the 3 regular board slots; spawns at Wild Hunt's location
- **Pre-attack**: app shows player bonus reminder before combo is declared
- **Combo resolution**: player declares a single damage value; threshold is 2/3/4 per level (solo) — if met → hound defeated + Wild Hunt loses 1 shield
- On defeat: app displays a random reward (reward table TBD)

### ✅ FEAT-010-I — Story Card Reminder *(S)*
- Prompt shown during **stage 2** of each round: "Read Story Card #N"
- No story card content in app; all narrative lives on physical cards

### ✅ FEAT-010-J — Wild Hunt Character Data *(S)*
- Static data: 4 characters × name, ability, starting shield count, 4 special cards

### ✅ FEAT-010-K — Monster Proximity Card Bonus *(M)*
- Pre-fight screen before every regular monster encounter: asks if Wild Hunt is nearby and how many hounds are adjacent
- Each nearby Wild Hunt/hound unit adds +1 card drawn from the monster's card pool to the deck before the fight starts

### 🔲 FEAT-010-L — Defeat Screen & Auto-Detect *(S)*
- `triggerDefeat()` exists in the store and the `'defeat'` phase is defined, but:
  - **No `WildHuntDefeatScreen` component** — `App.tsx` falls back to `wh-board` with a `// TODO` comment
- Required to make losing a run a complete, intentional UX flow

---

## 3.0 — Monster Trail Expansion

> **Goal:** Support the Monster Trail expansion, which introduces monster-specific attack
> cards, weaknesses, and richer discard mechanics. Scoped as a separate release because
> it extends the core data model and card engine — not just content.

### FEAT-004 — Monster-Specific Attack Cards *(M)*
- Extend the card data model to support monster-specific cards alongside generic cards
- Each monster's deck contains a mix of generic and monster-specific cards
- Fill in real card values and effect text for all Monster Trail cards

### FEAT-005 — Monster Weaknesses *(S)*
- Each Monster Trail monster has one or more weaknesses (e.g., silver, fire)
- Display weakness during encounter so the player knows which card types are effective
- Store as static data on the `Monster` type

### FEAT-006 — Monster-Specific Discard-Trigger Abilities *(M)*
- Some abilities trigger specifically when a *monster-specific* card is discarded (distinct from the existing generic discard trigger)
- Extend the ability model to differentiate trigger conditions: `onAnyDiscard` vs `onMonsterCardDiscard`
- Show a trigger alert in the UI (same `DiscardAlert` pattern as today)

### FEAT-007 — Monster-Specific Card Art *(S — could-have)*
- Display unique artwork per individual monster-specific card (not just per monster)
- Dependent on asset availability; can ship without if art is unavailable

### FEAT-011 — New Attack Types *(M)*
- Cards can carry a typed attack (e.g., silver, fire, poison) stored on the card definition
- Required to make FEAT-005 (Monster Weaknesses) mechanically meaningful — weakness checks need a typed attack to compare against
- Extend the `MonsterCard` data model with an optional `attackType` field

### FEAT-012 — New Card Types *(M)*
- Monster Trail introduces card archetypes beyond standard attack cards (e.g., special, event)
- Extend the card data model to support a `cardType` discriminator
- Encounter UI handles non-attack card types correctly (different display / effect resolution)

### FEAT-013 — Special Attacks *(M)*
- Cards with compound or conditional effects — e.g., a card that triggers differently depending on context or has multiple named ability entries
- Extend the ability model on `MonsterCard` to support multiple definitions per card
- Required for faithful Trail card representation where some cards have dual or context-dependent effects

---

## 4.0 — Legendary Monsters

> **Goal:** Add the Legendary (L4) monster tier. This is a meaningful scope increase —
> Legendary monsters have movement mechanics, larger decks, and stronger cards —
> warranting a major version.

### FEAT-008 — Legendary Monster Engine *(L)*
- New `level: 4` tier with deck sizes of 20+ cards
- Movement mechanic: Legendary monsters can move between board locations
- New engine module for movement resolution (location-to-location rules)
- Update `boardStore` to handle movement events

### FEAT-009 — Legendary Monster Data *(M)*
- Define Legendary-tier cards and abilities for each Legendary monster
- Fill in art assets

---

## 5.0 — Skellige Expansion

> **Goal:** Support the Skellige expansion — 3 new board locations, a permanent lair
> for the boss monster Dagon, and a random encounter mechanic for off-board fights.
> Primarily a board and content extension; no deep card engine changes required.

### FEAT-SKELLIGE-001 — Skellige Locations *(S)*
- Add 3 new named Skellige locations to the board location pool
- Available at game setup alongside the 18 base-game locations
- Data-only change; board setup logic (FEAT-001) handles them automatically

### FEAT-SKELLIGE-002 — Dagon's Lair *(M)*
- A permanent dedicated board location that always hosts Dagon — never replaced after defeat
- Distinct from the normal rotating monster placement: Dagon's slot is fixed and always present
- Update `boardStore` to support a permanent/fixed location slot alongside the 3 rotating ones

### FEAT-SKELLIGE-003 — Dagon Monster Data *(S)*
- Card definitions, abilities, and art for Dagon
- Required content to make Dagon's Lair functional
- Follows the same monster data pattern as existing monsters

### FEAT-SKELLIGE-004 — Random Encounter *(M)*
- Player can trigger a fight against a randomly selected monster that is not currently on the board
- One-off encounter: no board state changes after the fight (win or lose)
- New entry point in the UI distinct from tapping a board monster

---

## Parked / Future Considerations

| Feature | Why parked |
|---------|-----------|
| Multiplayer group support | Different persona entirely. Solo play is the only supported use case for the foreseeable future. |
| Persistence (save/resume mid-encounter) | Low-complexity add (`zustand/persist` middleware), but not a felt pain point yet. Revisit post-1.0. |
| Visual board map | Graphical board rendering. High effort, low priority — text-based placement is sufficient. |
| Sound effects | Nice-to-have atmosphere. Not planned. |

---

## Effort Key

| Label | Meaning |
|-------|---------|
| S | Small — 1–2 days |
| M | Medium — 3–5 days |
| L | Large — 1–2 weeks |
