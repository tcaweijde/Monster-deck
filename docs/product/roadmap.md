# Monster Deck — Roadmap

> Digital opponent for The Witcher Old World solo play.
> Last updated: 2026-06-23 · Living document — update at each release milestone.
> Trail Mode (FEAT-020) fully implemented; all monster ability content authored.
> Roguelite Run Mode (FEAT-040) added — impact-map-driven release targeting replayable story runs.
> Quest Mode (FEAT-044, FEAT-045) added — short village quests (7.0) and long political campaigns (7.1).

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
| FEAT-004 | Monster-Specific Attack Cards | — | ~~Subsumed by FEAT-020-B~~ |
| FEAT-005 | Monster Weaknesses | — | ~~Subsumed by FEAT-020-E/F~~ |
| FEAT-006 | Monster-Specific Discard-Trigger Abilities | — | ~~Subsumed by FEAT-020-D~~ |
| FEAT-007 | Monster-Specific Card Art | 3.0 | 🔲 Could-have |
| FEAT-011 | New Attack Types | — | ~~Removed — not in Trail expansion~~ |
| FEAT-012 | New Card Types | — | ~~Removed — not in Trail expansion~~ |
| FEAT-013 | Special Attacks | — | ~~Subsumed by FEAT-020-B/C/D~~ |
| FEAT-020-A | Trail Mode Toggle | 3.0 | ✅ Done |
| FEAT-020-B | Special Card Data Model | 3.0 | ✅ Done |
| FEAT-020-C | Special Card Draw-Trigger Resolution | 3.0 | ✅ Done |
| FEAT-020-D | Special Card Discard-Trigger Resolution | 3.0 | ✅ Done |
| FEAT-020-E | Weakness Token Board System | 3.0 | ✅ Done |
| FEAT-020-F | Weakness Effect Pre-Fight | 3.0 | ✅ Done |
| FEAT-020-G | Weakness Post-Defeat Reset | 3.0 | ✅ Done |
| FEAT-020-H | Weakness Token Data Model | 3.0 | ✅ Done |
| FEAT-SKELLIGE-001 | Skellige Locations | 5.0 | ✅ Done |
| FEAT-SKELLIGE-002 | Dagon's Lair | 5.0 | ✅ Done |
| FEAT-SKELLIGE-003 | Dagon Monster Data | 5.0 | ✅ Done |
| FEAT-SKELLIGE-004 | Random Encounter | 5.0 | 🔲 Todo |
| FEAT-030 | Legendary Hunt — Campaign Engine (umbrella) | 3.0 | ✅ Done |
| FEAT-030-A | Campaign Setup | 3.0 | ✅ Done |
| FEAT-030-B | Round & Stage Driver | 3.0 | ✅ Done |
| FEAT-030-C | Movement Deck Engine | 3.0 | ✅ Done |
| FEAT-030-D | Destruction Token Tracker | 3.0 | ✅ Done |
| FEAT-030-E | Boss Fight Preparation Screen | 3.0 | ✅ Done |
| FEAT-030-F | Legendary Fight Deck Engine | 3.0 | ✅ Done |
| FEAT-009 | Legendary Monster Data (7 monsters) | 3.0 | 🔨 In Progress (1/7) |
| FEAT-010-A | Campaign State Engine | 2.0 | ✅ Done |
| FEAT-010-B | Round Stage Driver | 2.0 | ✅ Done |
| FEAT-010-C | Wild Hunt Character Selection | 2.0 | ✅ Done |
| FEAT-010-D | Wild Hunt Location Tracking | 2.0 | ✅ Done|
| FEAT-010-E | Wild Hunt Encounter (Boss Fight) | 2.0 | ✅ Done |
| FEAT-010-F | Shield Counter | 2.0 | ✅ Done |
| FEAT-010-G | Monster Spawn System | 2.0 | ✅ Done |
| FEAT-010-H | Hound Enemy Type | 2.0 | ✅ Done |
| FEAT-010-I | Story Card Reminder | 2.0 | ✅ Done |
| FEAT-010-J | Wild Hunt Character Data | 2.0 | ✅ Done |
| FEAT-010-K | Monster Proximity Card Bonus | 2.0 | ✅ Done |
| FEAT-010-L | Defeat Screen & Auto-Detect | 2.0 | 🔲 Todo |
| FEAT-040 | Roguelite Run Mode — campaign engine (umbrella) | 6.0 | 🔲 Todo |
| FEAT-040-A | Run Mode Engine | 6.0 | 🔲 Todo |
| FEAT-040-B | Story Event Cards | 6.0 | 🔲 Todo |
| FEAT-040-C | Companion NPC System | 6.0 | 🔲 Todo |
| FEAT-040-D | Run Summary / Trophy Screen | 6.0 | 🔲 Todo |
| FEAT-040-E | Run Modifiers | 6.1 | 🔲 Todo |
| FEAT-040-F | Artifacts / Run Relics | 6.1 | 🔲 Todo |
| FEAT-041 | Rare Monster Variants | 6.2 | 🔲 Todo |
| FEAT-042 | Meta-progression / Lore Entries | 6.2 | 🔲 Todo |
| FEAT-043 | Story Puzzle Mode | 6.2 | 🔲 Todo |
| FEAT-044 | Short Quest Mode | 7.0 | 🔲 Todo |
| FEAT-044-A | Location Map & World State Engine | 7.0 | 🔲 Todo |
| FEAT-044-B | Dialogue & Clue Investigation System | 7.0 | 🔲 Todo |
| FEAT-044-C | Resource Tracking (coin, potions, reputation) | 7.0 | 🔲 Todo |
| FEAT-044-D | Bribe / Negotiate as Combat Alternative | 7.0 | 🔲 Todo |
| FEAT-044-E | Branching Climax & Quest Resolution | 7.0 | 🔲 Todo |
| FEAT-045 | Long Quest Mode | 7.1 | 🔲 Todo |

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

## 2.0 — Wild Hunt Expansion *(Complete)*

> **Goal:** Support the Wild Hunt expansion — an 8-round campaign mode with a boss fight
> against one of 4 Wild Hunt characters. Introduces campaign state, round stage tracking,
> a shield counter, hound enemies, and a monster spawn system. Largest scope expansion in
> the roadmap. Full spec: [`docs/specs/FEAT-010-wild-hunt.md`](../specs/FEAT-010-wild-hunt.md)
>
> **Status (2026-06-15):** All sub-features complete.

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

### ✅ FEAT-010-L — Defeat Screen *(S)*
- `triggerDefeat()` exists in the store and the `'defeat'` phase is defined, but:
  - **No `WildHuntDefeatScreen` component** — `App.tsx` falls back to `wh-board` with a `// TODO` comment
- Required to make losing a run a complete, intentional UX flow

---

## ✅ 3.0 — Monster Trail Expansion *(Complete)*

> **Goal:** Support the Monster Trail expansion, which adds two interlocking opt-in
> mechanisms to every monster encounter: numbered special cards with dual draw/discard
> triggers, and a weakness token board system that grants pre-fight advantages. Both
> are toggled together at game start. Full spec: [`docs/specs/FEAT-020-monster-trail.md`](../specs/FEAT-020-monster-trail.md)
>
> **Status (2026-06-22):** All engine, store, and UI sub-features complete.
> All monster `discardAbility` and `trailCards` draw-ability text authored for all 29
> monsters. `TrailCard.discardAbility` was removed as a design revision — when a trail
> special card is discarded, the monster's global `discardAbility` fires (same as any
> other discarded card). See FEAT-020-D.
>
> **Retired stubs:** FEAT-004, FEAT-005, FEAT-006, FEAT-013 are subsumed by FEAT-020.
> FEAT-011 and FEAT-012 are **removed** — confirmed absent from the physical expansion.

### MoSCoW

| Priority | Features |
|----------|---------|
| **Must Have** | FEAT-020-A, FEAT-020-B, FEAT-020-C, FEAT-020-D, FEAT-020-E, FEAT-020-F, FEAT-020-G, FEAT-020-H |
| **Could Have** | FEAT-007 (asset-dependent) |
| **Won't Have** | FEAT-011 (removed), FEAT-012 (removed), multiplayer, player location tracking |

---

### ✅ FEAT-020-A — Trail Mode Toggle *(S)*
- Single on/off toggle at game start; enables both the special card system and weakness token system together
- No partial activation — both mechanisms are always on or always off
- Stored in session state; does not persist across sessions

### ✅ FEAT-020-B — Special Card Data Model *(M)*
- Extend the `Monster` type with an optional `trailCards` field: exactly 4 `TrailCard` entries when present
- Each `TrailCard` has a `number` (1–4) and a `drawAbility` (fires on monster flip)
- When a trail special card is discarded as damage, the monster's global `discardAbility` fires — trail cards do not carry a separate discard ability
- Both abilities follow the existing `Ability` structure (name + description)
- When Trail Mode is on, deck generation appends the 4 special cards to the monster's standard deck
- All 29 monsters have `discardAbility` and `trailCards` authored with full ability text
- Spec: [`docs/specs/FEAT-020-monster-trail.md`](../specs/FEAT-020-monster-trail.md)

### ✅ FEAT-020-C — Special Card Draw-Trigger Resolution *(M)*
- During an encounter, when the monster flips a special card (number 1–4), the app fires the card's `drawAbility`
- Displayed via the existing encounter alert overlay (same UX pattern as `DiscardAlert`)

### ✅ FEAT-020-D — Special Card Discard-Trigger Resolution *(M)*
- During an encounter, when the player discards a trail special card as damage, the monster's global `discardAbility` fires (identical to any other discarded card)
- No separate per-card discard ability exists on `TrailCard`; `TrailDiscardAlert` was removed in favour of the existing `DiscardAlert`

### ✅ FEAT-020-E — Weakness Token Board System *(M)*
- At game start, app draws 6 weakness tokens and shows a terrain-type checklist to guide physical token placement (max 1 token per terrain type)
- During the game, player can tap "Claim Token" in the app when on the same board location as a token
- On claim: token moves to player's held set; a replacement is auto-drawn and added to the board
- Board overview shows active tokens and their terrain types

### ✅ FEAT-020-F — Weakness Effect Pre-Fight *(M)*
- Pre-fight screen shows the player's held tokens and offers an optional weakness declaration
- Applying a token triggers one of four effects: combat advantage (player goes first), reduce deck size (remove N cards), remove a specific special card (#1–4) from the deck, or bonus reward on victory
- Consumed token is removed from the player's hand after declaration

### ✅ FEAT-020-G — Weakness Post-Defeat Reset *(S)*
- After monster victory: all 6 board token slots reset; app draws and displays a fresh token set
- Player-held tokens (claimed but unused) are NOT reset — player keeps them

### ✅ FEAT-020-H — Weakness Token Data Model *(S)*
- Define the `WeaknessToken` type: `id`, `terrainType`, `effectType` (`combatAdvantage | reduceDeckSize | removeSpecialCard | bonusReward`), `effectMagnitude?`
- Token pool contents transcribed from physical rulebook

### FEAT-007 — Monster-Specific Card Art *(S — could-have)*
- Display unique artwork per individual special card face (card numbers 1–4 per monster)
- Falls back to the existing monster portrait if assets are unavailable
- Does not block Trail Mode launch; ships when assets are ready

---

## 🔨 3.0 — Legendary Hunt Expansion *(In Progress)*

> **Goal:** Add the Legendary (L4) monster tier as a full campaign mode. The player places
> the Legendary monster on the board at game start alongside regular monsters and must defeat
> it within a round limit (7 / 8 / 9 rounds on hard / normal / easy). Regular encounters
> continue during the campaign — trophies earned there determine the boss fight deck size.
> Destruction tokens earned during the monster's movement phases further reduce the deck and
> grant initiative. Equivalent complexity to Wild Hunt; warrants its own major version.
>
> **Rulebook confirmations:**
> - ✅ Movement deck reshuffles when exhausted
> - ✅ Fight deck reaching 0 = monster defeated

### FEAT-030 — Legendary Hunt Campaign Engine *(umbrella — L)*

Umbrella for all campaign engine sub-features. Tracks campaign state (round, board position, token count, trophy count) with persistence across refresh.

### FEAT-030-A — Campaign Setup *(S)*
- Difficulty selection screen: **Easy** (9 rounds) / **Normal** (8 rounds) / **Hard** (7 rounds)
- Legendary monster selection: pick one of the 7 available Legendary monsters
- App initialises campaign state: round counter = 1, board position = starting location, destruction token count = 0
- Campaign state persisted to `localStorage`

### FEAT-030-B — Round & Stage Driver *(M)*
- Drives player through the ordered stages of each round (same structural pattern as Wild Hunt FEAT-010-B)
- Round counter incremented at end of each round; displayed prominently with round limit
- Final round: stage driver triggers **Boss Fight Preparation** (FEAT-030-E) instead of a new round
- Win condition: Legendary monster defeated within round limit → victory screen
- Loss condition: Round limit reached without defeating the monster → defeat screen

### FEAT-030-C — Movement Deck Engine *(M)*
- Each Legendary monster has its own movement deck; cards are separate from the fight deck
- During the movement stage: app draws the top card and displays **2 target locations**
  - Monster moves toward **Location 1**; if it reaches Location 1, it continues toward **Location 2**
  - Movement distance is fixed for solo play
- App updates and persistently displays the monster's **current board location**
- Player places physical destruction tokens at each location the monster passes through; app drives the reminder
- ✅ When movement deck is exhausted: deck reshuffles

### FEAT-030-D — Destruction Token Tracker *(S)*
- Tap-based **+/− counter** in app displayed throughout the campaign
- Player taps to claim tokens when ending their movement phase (Phase 1 of each round)
- Token count **carries forward** between rounds; resets only when the boss fight begins
- Counter feeds directly into FEAT-030-E (deck size reduction) and FEAT-030-E (initiative)

### FEAT-030-E — Boss Fight Preparation Screen *(M)*
- Shown at the start of the final round before the fight begins
- **One-time trophy input**: player enters the number of trophies earned during the campaign
- App calculates final fight deck size using the formula:
  ```
  base deck size − trophy protection reduction − destruction token count = actual fight deck size
  ```
- Displays **initiative ruling**: player goes first if destruction token count > 0; otherwise normal initiative
- Confirmation tap transitions to the boss fight (FEAT-030-F)

### FEAT-030-F — Legendary Fight Deck Engine *(M)*
- Each Legendary monster has a dedicated fight deck of **stronger special attack cards**
- **4 special attacks per monster**, following the Monster Trail card pattern (FEAT-013)
- Fight deck size reduction from FEAT-030-E is applied before the fight starts (cards removed from deck, not revealed)
- Fight uses the existing encounter engine for card flip, damage, and discard
- ✅ Deck reaching 0 = monster defeated
- Distinct from the movement deck; movement deck is never used in the boss fight

### FEAT-009 — Legendary Monster Data *(M)*
- Static data for all **7 Legendary monsters**, each requiring:
  - **Movement deck cards**: 2 target location names per card
  - **Fight deck cards**: 4 special attacks with ability text, attack values, and trigger conditions
  - **Base deck size** and **trophy protection table** (how many cards are removed per trophy bracket)
  - **Monster abilities** (base + any special)
  - **Art assets**: card front images per monster
- Data model extends the existing `Monster` type with `legendaryData: { movementDeck, fightDeck, baseDeckSize, trophyTable }`

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

## 6.0 — Roguelite Run Mode *(Planned)*

> **Goal:** Make Monster Deck a replayable, story-rich roguelite that feels different every run
> and rewards exploration with meaningful narrative progression. Each run is a self-contained
> session — a random sequence of encounters, story events, and rewards — with a persistent
> companion and a trophy screen that captures the choices made along the way.
>
> **Actors:** Solo player (wants fresh self-contained runs) · Group at a table (shared stakes
> and memorable moments) · Returning player (wants unlockable content that rewards past runs).
>
> **Design principle:** Ship the run loop and narrative backbone first (FEAT-040-A through
> FEAT-040-D); mechanical variance (modifiers, relics) and long-term unlocks follow once the
> core loop is proven.

### MoSCoW

| Priority | Features |
|----------|---------|
| **Must Have** | FEAT-040-A, FEAT-040-B, FEAT-040-C, FEAT-040-D |
| **Should Have** | FEAT-040-E, FEAT-040-F |
| **Could Have** | FEAT-041 (content-dependent), FEAT-043 (story puzzle mode — depends on FEAT-040-B) |
| **Won't Have (this release)** | FEAT-042 (meta-progression — deferred until run loop is stable) |

---

### Phase 1 — Run Loop Foundation *(6.0 MVP)*

> These four features form an indivisible core. The run engine is the container; story events
> and companions are the narrative engine that makes each run feel different; the trophy screen
> is the satisfying close of the loop. None of them deliver value without the others.

#### FEAT-040-A — Run Mode Engine *(L)*

- New top-level mode alongside the existing single-encounter mode; player chooses at startup
- A run is a self-contained session: randomly ordered sequence of **encounters** and
  **story events** (see FEAT-040-B), drawn from a run-length pool (e.g. 5–8 encounters)
- Run state tracked in Zustand: current node (encounter / event / reward), run history,
  companion slot (see FEAT-040-C), accumulated trophies
- Run state **persisted to `localStorage`** — survives app refresh mid-run
- On run end (all encounters defeated, or player defeated): navigate to Run Summary (FEAT-040-D)
- Sits alongside the existing board mode; no existing flow is removed or broken

#### FEAT-040-B — Story Event Cards *(M)*

- A small deck of **narrative event cards** (suggested: 12–16) that fire at random between
  encounters during a run
- Each event card presents a short situation and **2–3 decision branches**
- Branch outcomes affect the remainder of the run — examples:
  - Modify the next encounter (add a weakness token, adjust starting deck size)
  - Unlock a companion (gate for FEAT-040-C)
  - Grant or remove a run trophy
  - Set a flag that alters a later event's branch options (light branching / callback system)
- Cards are authored as static data (`eventCards[]`), sampled without replacement per run
- Event screen replaces the board overview mid-run; player taps a choice, outcome resolves,
  run advances to next node
- **Companion unlock events must be present** — at least 3 events that can grant a companion,
  so the companion slot (FEAT-040-C) is reachable in a typical run

#### FEAT-040-C — Companion NPC System *(M)*

- Each run has **one companion slot**; companions are acquired via story events (FEAT-040-B)
- Each companion is a named NPC with a **passive fight effect** that applies for every
  remaining encounter in the run — examples:
  - *"First discard ability each fight is negated"*
  - *"Player always goes first in the opening encounter of each round"*
  - *"Monster deck starts with 1 card already discarded"*
- Companion is displayed persistently on the run HUD (name + effect summary)
- If the player already holds a companion when a new one is offered, they must choose to
  swap or keep — no stacking
- Passive effects are applied via the existing encounter engine hooks (pre-fight / on-discard);
  companion data structure: `id`, `name`, `flavourText`, `effectType`, `effectMagnitude?`
- **Initial roster:** 5–6 companions (enough variety for runs to feel different day-to-day)

#### FEAT-040-D — Run Summary / Trophy Screen *(S)*

- Displayed automatically at run end (victory or defeat)
- Shows:
  - **Trophies earned** — encounters defeated and any awarded by story events
  - **Companion met** — name, portrait placeholder, and passive effect
  - **Key choices made** — a timeline of story event decisions (branch label only; not full text)
  - **Run outcome** — victory banner or defeated message
- No persistence into future runs (meta-progression is FEAT-042, deferred)
- Share / screenshot affordance: trophy screen is laid out for a single clean screenshot

---

### Phase 2 — Mechanical Variance *(6.1)*

> Once the run loop is live and stable, these features layer in mechanical variety that makes
> the strategic texture of each run feel distinct. They are deliberately separated from Phase 1
> to keep launch scope lean — neither is required for the core roguelite experience to work.

#### FEAT-040-E — Run Modifiers *(M)*

- At run start, 1–2 **run modifier cards** are drawn from a pool and applied globally for the
  entire run — examples:
  - *"Monster decks are reshuffled every 3 turns"*
  - *"Deal 2 damage on swipe instead of 1"*
  - *"All encounter decks start 2 cards smaller"*
- Modifier cards shown on a "This Run" screen before the first encounter; accessible from
  the run HUD at any time
- Authored as static data (`runModifiers[]`); ~10 modifiers in the initial pool
- Implementation: modifier flags on run state; encounter engine reads them at fight start

#### FEAT-040-F — Artifacts / Run Relics *(M)*

- Rewards available from specific story event outcomes (FEAT-040-B) or as post-encounter
  bonus drops (low probability)
- Each artifact **permanently alters one game rule** for the rest of the run — examples:
  - *"Deal 2 damage on swipe"*
  - *"Skip the monster's first flip"*
  - *"Weakness tokens cost 0 — always apply for free"*
- Player can hold **up to 3 artifacts** simultaneously; a 4th requires discarding one
- Displayed in the run HUD alongside the companion slot
- Artifacts stack with run modifiers but not with each other (no duplicate artifact IDs
  allowed on the same run)
- Initial pool: 8–10 artifacts

---

### Phase 3 — Content Depth *(6.2)*

> Long-tail content features that reward returning players and deepen the lore of the world.
> Dependent on Phase 1 being stable and Phase 2 being shipped.

#### FEAT-041 — Rare Monster Variants *(M)*

- A small set of **named rare variants** of existing monsters with a unique deck composition
  and a short lore entry (2–3 sentences)
- Unlocked by reaching specific story branch outcomes (e.g., choosing a particular path
  in a story event triggers the rare variant as the next encounter)
- Variant monsters use the existing encounter engine; differences are in their card pool and
  ability text
- Lore entries displayed on the encounter start screen ("You face *Garkain the Pale*…")
- Initial set: 3–5 rare variants across existing monster types

#### FEAT-043 — Story Puzzle Mode *(M)*

- A standalone mode presenting **hand-authored puzzles** tied to story moments
- Each puzzle opens with a narrative scenario (e.g., *"Eskel is bleeding out — raise 3 shields
  and 2 dodge symbols before he falls"*) with a **turn limit** and a **symbol goal**
- Symbols (⚔️ damage, 🛡️ defence, dodge, draw-modifier) mirror the physical player card types
  from the board game (fast attack / strong attack / offensive sign / defensive sign / dodge)
- Player keeps their **physical cards on the table**; the app acts as a tracker: tap symbols
  on-screen to log what has been played from the hand
- Card color context (blue, red, purple, yellow, green) may constrain which cards count toward
  the combo goal
- **Single-combo constraint**: all required symbols must be achieved within a contiguous sequence
  of turns — partial progress resets if the window expires
- Win / fail resolution shows a narrative branch outcome; failure has a story consequence,
  not just a retry screen
- Initial set: 1–2 curated puzzles per monster (covers all 3 existing monsters = ~6 puzzles)
- Depends on FEAT-040-B (story event system provides the narrative scaffolding)

#### FEAT-042 — Meta-progression / Lore Entries *(L)*

- Permanent unlocks that carry forward across runs: lore entries discovered in one run
  appear in a **Codex** accessible from the main menu in future runs
- Lore entries are cosmetic / flavour only — no mechanical advantage in future runs
- Seed mechanism: run summary (FEAT-040-D) writes a compact run-seed string to
  `localStorage`; Codex reads and aggregates across seeds to build the lore library
- Codex UI: scrollable list of unlocked entries grouped by monster / companion / event
- **Deliberately deferred** — introduces cross-run state complexity; only worth building
  once the single-run experience is proven and stable

---

## 7.0 — Short Quest Mode *(Planned)*

> Village-scale narrative quests playable in a single 45–60 min session.
> The app acts as world-master — managing world state, dialogue, investigation, and consequences —
> while physical cards handle individual player actions.
> Depends on the Roguelite Run Mode (FEAT-040) story infrastructure being stable.

### MoSCoW

| Priority | Features |
|----------|---------|
| **Must Have** | FEAT-044-A, FEAT-044-B, FEAT-044-C, FEAT-044-D, FEAT-044-E |
| **Should Have** | Co-op group encounter support (multi-player battles) |
| **Could Have** | 2nd starter quest at launch |
| **Won't Have (this release)** | Save/resume mid-quest, long-form political arcs (FEAT-045) |

---

### FEAT-044-A — Location Map & World State Engine *(L)*

- Each quest defines **4–6 named locations** (e.g., village square, herbalist's hut, old ruin)
- Players navigate between locations; each location surfaces available actions contextually
  based on current world state flags (e.g., "question innkeeper" only available after finding
  a clue at the mill)
- World state is a flat key-value store of **quest flags** (booleans + counters) tracked in
  the Zustand store; actions read and write flags to open/close paths
- Location UI: simple tappable map or named list — no graphical board rendering

### FEAT-044-B — Dialogue & Clue Investigation System *(M)*

- **Dialogue trees**: tap conversation options when questioning NPCs; available options depend
  on flags (reputation level, items held, clues already found)
- **Clue card system**: certain locations surface "investigate" actions that draw from a small
  clue deck; connecting enough clues unlocks new dialogue branches or skips encounters
- Both systems share the same flag-read/write infrastructure from FEAT-044-A

### FEAT-044-C — Resource Tracking: Coin, Potions & Reputation *(S)*

- Three tracked resources displayed persistently during a quest session:
  - **Coin** — integer counter; earned from defeated enemies, spent on bribes/trades
  - **Potions** — integer counter; found at specific locations, spent for combat buffs or bribes
  - **Reputation** — integer counter (e.g., 0–5); rises/falls based on quest choices; gates
    certain dialogue options and determines NPC willingness to deal
- Resource changes are triggered by quest events and shown with a brief UI flash

### FEAT-044-D — Bribe / Negotiate as Combat Alternative *(S)*

- Before each encounter the app presents a **negotiation screen** (if the enemy type supports it)
  offering one or more alternatives to fighting: spend coin, spend a potion, or expend reputation
- Each alternative has a cost and a stated outcome (e.g., "Pay 3 coin → bandit stands down,
  quest flag `bandit_bribed` set")
- Outcome may have downstream consequences (bribed bandits may reappear as allies or
  obstacles later in the quest depending on other flags)
- Fight option always available as fallback

### FEAT-044-E — Branching Climax & Quest Resolution *(M)*

- Each quest has a **climax scene** reached after sufficient investigation/path completion
- 2–3 resolution variants determined by accumulated flags (which path was taken, which
  resources were spent, which characters were helped or harmed)
- All branches converge at the climax — the outcome text and any mechanical result (bonus
  trophies, unlocked content) differ by variant
- Resolution screen shows a short narrative summary of the quest outcome
- **Starter quest**: "Lift the Curse of Downwarren" — 4 locations, 2 enemy encounters,
  3 resolution variants

---

## 7.1 — Long Quest Mode *(Planned)*

> Regional-scale political quests spanning multiple sessions with persistent save state.
> World events triggered by player choices can break pathing, change location actions,
> and escalate threats — including starting wars or shifting faction power.
> Depends on Short Quest Mode (FEAT-044) being proven stable.

### FEAT-045 — Long Quest Mode *(XL)*

- Extends the Short Quest engine with **multi-session save state** (`zustand/persist` to
  `localStorage`): players can pause and resume a quest across separate play sessions
- **Regional location map**: 10–15 locations across a wider geography; locations can change
  state permanently (e.g., a village burns down, a road becomes impassable after a faction war)
- **Escalating world events**: a background event clock advances each time players rest or
  move between major zones; if ignored too long, threats escalate and close off solution paths
- **Faction system**: two or more factions with independent reputation tracks; siding with one
  affects NPC availability and prices across all their locations
- **Consequence propagation at scale**: a choice early in the quest (e.g., exposing a spy,
  bribing a count) can trigger a war arc that adds new encounter locations and removes others
- **Group encounter support**: co-op battles with coordinated multi-player turns, shared
  resource pool, and combined reputation track
- Starter long quest: political intrigue arc — players must navigate a brewing conflict between
  two noble houses while investigating a deeper supernatural threat

---

## Parked / Future Considerations

| Feature | Why parked |
|---------|-----------|
| Multiplayer group support | Different persona entirely. Solo play is the only supported use case for the foreseeable future. |
| Persistence (save/resume mid-encounter) | Low-complexity add (`zustand/persist` middleware), but not a felt pain point yet. Revisit post-1.0. |
| Visual board map | Graphical board rendering. High effort, low priority — text-based placement is sufficient. |
| Sound effects | Nice-to-have atmosphere. Not planned. |
| Meta-progression / Lore Entries (FEAT-042) | Deferred from 6.0 — cross-run state complexity is only worth tackling once the single-run loop (FEAT-040-A through D) is proven stable. Tracked in Phase 3 above. |

---

## Effort Key

| Label | Meaning |
|-------|---------|
| S | Small — 1–2 days |
| M | Medium — 3–5 days |
| L | Large — 1–2 weeks |
