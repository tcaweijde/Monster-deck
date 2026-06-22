# FEAT-030 — Legendary Hunt Campaign Engine

> Status: In Progress · Last updated: 2026-06-22

---

## 1. Overview

| Field           | Value                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Feature ID      | FEAT-030                                                                       |
| Status          | In Progress                                                                    |
| Author          | Thomas                                                                         |
| Created         | 2026-06-17                                                                     |
| Last updated    | 2026-06-22                                                                     |
| Epic / Parent   | 3.0 Roadmap — Legendary Hunt expansion                                        |
| Arc42 reference | §3 System Scope, §5 Building Block View, §6 Runtime View, §8 Crosscutting Concepts |

### Child features

| ID         | Name                          |
| ---------- | ----------------------------- |
| FEAT-030-A | Campaign Setup                |
| FEAT-030-B | Round & Stage Driver          |
| FEAT-030-C | Movement Deck Engine          |
| FEAT-030-D | Destruction Token Tracker     |
| FEAT-030-E | Boss Fight Preparation Screen |
| FEAT-030-F | Legendary Fight Deck Engine   |
| FEAT-009   | Legendary Monster Data        |

---

### 1.1 Problem Statement

The Legendary Hunt expansion introduces a multi-round campaign against a single powerful Legendary monster that moves across the board. Without app support, the player must manually track:

- Campaign setup choices that affect boss fight rules (selected monster, difficulty, and campaign side A/B)
- The Legendary monster's location each round using the shared movement deck
- A running destruction token count that spans the whole campaign, plus the correct round timing for claiming those tokens
- A final boss setup calculation that uses trophy count to derive a persistent protection value and destruction tokens to reduce the fight deck size

Managing these separate bookkeeping tracks alongside the normal board state (3 regular monsters, combat, trophies, and player turn phases) creates enough cognitive overhead that players routinely lose track mid-campaign or make calculation errors that invalidate the final boss fight. The app should own this entirely.

### 1.2 Goal

The app manages the full Legendary Hunt campaign lifecycle: setup (including campaign side A/B), simplified round progression around the 3 physical player phases, end-of-round movement card draws and monster location updates, destruction token accumulation, and a boss fight preparation calculation that derives both fight deck size and a persistent protection value for the encounter — all persisted across app refreshes. The player interacts with physical components (tokens, fight cards, and the board) but the app tracks all state and prompts every action.

### 1.3 Non-Goals

- Multiplayer Legendary Hunt (scoped to solo play only; multiplayer variant is a future consideration)
- **Monster position tracking** — the app does not know the board topology or track the Legendary monster's current location. The player moves the physical token and counts steps themselves. The app's role during movement is to draw the movement card and display its instructions.
- **Board topology / pathfinding** — encoding location connections is a future option (see §9 Out of Scope); deferred because the player has the physical board in front of them.
- Auto-tracking trophies during the campaign — trophy count is self-reported by the player during Boss Fight Preparation
- Tracking the player's own health, gold, or cards during the campaign
- Automated combat resolution — FEAT-030-F feeds the existing encounter engine; card flipping and damage are handled there
---

## 2. Feature Breakdown

### FEAT-030-A — Campaign Setup

The player configures a new Legendary Hunt campaign before the first round begins.

- **Difficulty selection**: Easy, Normal, or Hard. Difficulty directly sets the total round limit:

  | Difficulty | Round Limit |
  | ---------- | ----------- |
  | Easy       | 9 rounds    |
  | Normal     | 8 rounds    |
  | Hard       | 7 rounds    |

- **Legendary monster selection**: Player selects a Legendary monster from the available list. The shipping target is all 7 monsters; until FEAT-009 transcription is complete, development may expose a single placeholder monster. Each option is shown with its name and art.
- **Campaign side selection**: Player selects **Side A** or **Side B**. This side determines which shared trophy-to-protection table is used later during Boss Fight Preparation (FEAT-030-E).
- **Initial campaign state** created on confirmation:
  - `round = 1`
  - `stage = 1` (first stage of the round driver — see FEAT-030-B)
  - `destructionTokenCount = 0`
  - `campaignSide = 'A' | 'B'` (selected by the player)
  - `protectionValue = 0` (placeholder until FEAT-030-E computes the boss fight value)
  - `phase = 'playing'`
- All state is immediately persisted to `localStorage`.
- Only one Legendary Hunt campaign can be active at a time. If an existing campaign is in progress, the setup screen must warn the player before overwriting it.

**Effort: S**

---

### FEAT-030-B — Round & Stage Driver

The app drives the player through each round's simplified app stages, displaying the current round number and round limit prominently at all times.

**Physical round structure (solo play):**

- Each player turn still follows the base game's 3 phases:
  1. **Phase 1 — Movement**
  2. **Phase 2 — Fighting / Meditation / Exploring**
  3. **Phase 3 — Training**
- After all players have taken their turn, the **Legendary monster moves**.

**App stages (in order):**

1. **Player Phase 1** — App reminds the player that this is the phase in which destruction tokens may be claimed from the board. At the end of this stage, the player records the number claimed (FEAT-030-D).
2. **Player Phase 2** — App shows a prompt for fighting, meditation, or exploration. Standard encounter engine applies.
3. **Player Phase 3** — App shows a prompt for training and any remaining physical upkeep.
4. **End of Round — Legendary Movement** — After the player's turn is complete, the app draws the shared movement card (FEAT-030-C) and displays its instructions to the player.

> **Note:** The app intentionally models only the timing that matters for Legendary Hunt bookkeeping: destruction token claiming during Player Phase 1 and Legendary monster movement at end of round.

**Round advancement rules:**

- Each stage advances on explicit player confirmation tap.
- After the final stage of a non-final round, the app increments `round` and returns to Stage 1.
- If the Legendary monster is **defeated** at any point during the fight stage (FEAT-030-F deck exhausted): the campaign ends in **victory** immediately (see §4 SC-004), regardless of the current round.

**Effort: M**

---

### FEAT-030-C — Movement Deck Engine

Legendary Hunt uses **one shared movement deck** for all Legendary monsters, separate from each monster's fight deck. The shared movement deck is defined in `src/data/legendary/movementDeck.ts`.

**Drawing a movement card:**

- App draws the top card from the in-memory **shared** movement deck (shuffled at campaign start).
- Each movement card specifies **2 target locations** and a movement distance.
- App displays the card to the player: **"Move toward [Location 1 name], then toward [Location 2 name] — N steps."**
- The player physically moves the monster token on the board, following those instructions.
- The app does not track the monster's resulting position — the player handles counting steps and resolving movement against the physical board.

**Destruction token reminder:**

- After displaying the movement card, the app shows a reminder: **"Place one destruction token at each location you depart from during this move (not the landing spot)."**
- The player places physical tokens on the board. The app does not auto-count or auto-place tokens.

**Deck exhaustion & reshuffle:**

- When the last card is drawn from the shared movement deck, the app immediately reshuffles all drawn movement cards back into a new randomised deck and continues from it.
- There is no notification shown to the player for the reshuffle; it is transparent.

**Effort: M**

---

### FEAT-030-D — Destruction Token Tracker

A persistent +/− counter displayed throughout the campaign, representing the destruction tokens the player has claimed.

**Claiming tokens:**

- At the end of **Player Phase 1** of any round, the player taps a "Claim Tokens" button (or equivalent) in the app.
- The app shows a stepper allowing the player to enter how many physical destruction tokens they are collecting from the board (from locations the Legendary monster departed during prior end-of-round movement, plus any previous uncollected tokens).
- The entered amount is added to `destructionTokenCount` in campaign state.

**Persistence:**

- `destructionTokenCount` carries forward between rounds unchanged.
- It is never auto-decremented by the app during the campaign.

**Reset:**

- When the Boss Fight Preparation screen is confirmed (FEAT-030-E), `destructionTokenCount` is consumed in the fight deck size formula. The counter resets to `0` at that point and is not displayed during the fight itself.

**Effort: S**

---

### FEAT-030-E — Boss Fight Preparation Screen

Shown exactly once, after the end-of-round movement of the final round (`round === roundLimit`), before the boss fight begins. This screen collects the trophy count, looks up the resulting protection value, and calculates the actual fight deck size.

**Trophy input:**

- Player enters the total number of **trophies earned during the campaign** (from defeating regular monsters and meditating). This is self-reported; the app does not track trophies during the campaign.
- Input is a non-negative integer. The app validates: value must be ≥ 0.

**Protection lookup:**

- The app looks up `protectionValue` from the shared trophy protection table using:
  - `campaignSide` selected at campaign setup (`'A'` or `'B'`)
  - Entered trophy count
- `protectionValue` is stored in `LegendaryCampaignState` for use throughout the boss fight (FEAT-030-F).
- This value is a **persistent per-attack damage negation value** during the fight. It does **not** reduce deck size.

**Fight deck size formula:**

``` 
actualFightDeckSize = baseDeckSize − destructionTokenCount
```

- `baseDeckSize`: from `LegendaryMonster.baseFightDeckSize` (FEAT-009 static data).
- `destructionTokenCount`: current value from `LegendaryCampaignState`.
- `actualFightDeckSize` is clamped to a minimum of `0`. If the result is `0`, the monster is considered immediately defeated upon entering the fight (see §6 Behaviour Rules).

**Initiative ruling:**

- If `destructionTokenCount > 0` at the time of calculation: the player goes first in the boss fight.
- If `destructionTokenCount === 0`: standard initiative applies (not determined by the app; player follows physical rulebook rules).

**Display:**

The screen shows:
- Legendary monster name and art
- Selected campaign side (`A` or `B`)
- `baseDeckSize`
- Trophy count entered and the resulting `protectionValue`
- `destructionTokenCount` (read-only, from campaign state)
- Calculated `actualFightDeckSize`
- Initiative ruling ("You go first" or "Standard initiative")
- A "Begin Boss Fight" confirmation tap

**Effort: S**

---

### FEAT-030-F — Legendary Fight Deck Engine

The boss fight uses a dedicated Legendary fight deck — a set of stronger special attack cards per monster — fed into the existing encounter engine.

**Deck preparation:**

- The fight deck is built from the `LegendaryMonster.fightDeck` (FEAT-009 static data): `baseDeckSize` total cards including 4 special attack cards.
- Before the encounter starts, `(baseDeckSize − actualFightDeckSize)` cards are **silently removed from the front of the deck** (not revealed to the player). The remaining `actualFightDeckSize` cards form the active fight deck.
- The fight deck is then shuffled and handed to `encounterStore` as the active deck.

**Fight mechanics:**

- Card flip, damage, and discard follow the existing encounter engine, with one Legendary-specific modifier: `protectionValue`.
- On **every player damage action**, the app applies:

  ```
  effectiveDamage = max(0, declaredDamage − protectionValue)
  ```

  Only `effectiveDamage` cards are discarded from the Legendary fight deck.
- `protectionValue` is **persistent for the entire fight**. It is not a counter and does not deplete after blocking damage.
- If `declaredDamage <= protectionValue`, no cards are discarded for that action.
- The 4 special attack cards follow the same discard-trigger ability pattern as Wild Hunt special cards (`WildHuntSpecialCard`): each card has an ability that fires when it enters the discard pile.
- Regular board monster encounters continue to be available during the campaign during the normal player phases and use the standard encounter engine independently.

**Win condition:**

- When the Legendary fight deck is exhausted (all cards discarded), the encounter engine signals victory.
- The campaign state transitions to `phase = 'victory'`.
- A victory screen is shown (see FEAT-030-B win path).

**Effort: M**

---

### FEAT-009 — Legendary Monster Data

Static data definitions for Legendary Hunt live under `src/data/legendary/`.

Each monster entry must supply:

| Field                       | Type                       | Description                                              |
| --------------------------- | -------------------------- | -------------------------------------------------------- |
| `id`                        | `string`                   | Unique identifier, e.g. `'leshen-ancient'`              |
| `name`                      | `string`                   | Display name                                             |
| `startingLocationId`        | `number`                   | FK → Location.id; where the monster begins on the board |
| `baseFightDeckSize`         | `number`                   | Total number of cards in the full fight deck (≥ 20)     |
| `fightDeck`                 | `LegendaryMonsterCard[]`   | All fight cards including the 4 special attack cards    |
| `passiveAbility`            | `MonsterAbility`           | Always-on ability (same model as existing `Monster`)    |
| `discardAbility?`           | `MonsterAbility`           | Optional: fires when a fight card enters the discard pile |
| `image`                     | `string`                   | Path to card art, e.g. `public/images/legendary/<id>/portrait.webp` |
| `artAssets`                 | `string[]`                 | Paths to card front images (same pattern as `Monster.cardFrontImages`) |

Shared data is defined separately:

- `src/data/legendary/movementDeck.ts` — the single shared `MovementCard[]`
- `src/data/legendary/trophyProtectionTables.ts` — the shared Side A / Side B trophy-to-protection lookup tables

> ⚠️ **Data gap:** All 7 real Legendary monsters must still be transcribed from the physical rulebook for FEAT-009. Until then, development proceeds with **one placeholder monster only**. No real monster stats or card text are required in this spec revision.

**Effort: M**

---

## 3. User Stories

### US-030-1: Starting a Legendary Hunt campaign (FEAT-030-A)

**As a** solo player,  
**I want** to select a difficulty, a campaign side (A/B), and a Legendary monster to set up a new Legendary Hunt campaign,  
**so that** the app initialises all campaign state and I can begin the first round immediately.

### US-030-2: Following the round structure (FEAT-030-B)

**As a** solo player,  
**I want** the app to guide me through the 3 player phases and the end-of-round Legendary movement timing, always showing the current round and the total round limit,  
**so that** I never lose track of where I am in the campaign.

### US-030-3: Drawing movement cards (FEAT-030-C)

**As a** solo player,  
**I want** the app to draw a movement card each round and tell me where to move the Legendary monster and which locations receive destruction tokens,  
**so that** I don't have to manage a physical movement deck or track the monster's route manually.

### US-030-4: Claiming destruction tokens (FEAT-030-D)

**As a** solo player,  
**I want** to tap the app to claim destruction tokens I've picked up from the board at the end of Player Phase 1 each round,  
**so that** my running token total is always correct without manual bookkeeping.

### US-030-5: Calculating the boss fight deck (FEAT-030-E)

**As a** solo player,  
**I want** the app to ask for my trophy count before the boss fight and calculate the exact fight deck size, initiative ruling, and protection value,  
**so that** I can set up the boss fight correctly without doing the arithmetic myself.

### US-030-6: Fighting the Legendary monster (FEAT-030-F)

**As a** solo player,  
**I want** to fight the Legendary monster using the app's existing encounter engine with the correctly-sized fight deck and persistent protection applied to every attack,  
**so that** the boss fight follows the same familiar card-flip flow I use for regular monsters, with the Legendary-specific protection rule enforced automatically.

### US-009-1: Accessing Legendary monster data (FEAT-009)

**As a** developer,  
**I want** static data definitions for a placeholder Legendary monster plus shared movement/protection lookup data,  
**so that** FEAT-030 can be developed now while the 7 real monsters remain marked as rulebook transcription work.

---

## 4. Acceptance Scenarios

### SC-030-A-1: Campaign setup with valid inputs

```gherkin
Given the player is on the Campaign Setup screen
  And no active Legendary Hunt campaign exists
When the player selects difficulty "Normal", campaign side "B", and Legendary monster "Placeholder Legendary"
  And taps "Start Campaign"
Then a new campaign state is created with round = 1, stage = 1, phase = 'playing'
  And campaignSide = 'B'
  And protectionValue = 0
  And destructionTokenCount = 0
  And roundLimit = 8
  And the state is persisted to localStorage
  And the Round Stage Driver (FEAT-030-B) is shown for Round 1, Stage 1
```

### SC-030-A-2: Setup warns before overwriting an existing campaign

```gherkin
Given an active Legendary Hunt campaign is in progress (round 4 of 8)
When the player navigates to Campaign Setup and selects a new monster and difficulty
  And taps "Start Campaign"
Then the app shows a confirmation dialog: "This will end your current campaign. Continue?"
  And only if the player confirms does the app overwrite the existing campaign state
```

### SC-030-A-3: Correct round limits per difficulty

```gherkin
Given the player is on the Campaign Setup screen
When the player selects "Easy"
Then the displayed round limit preview shows "9 rounds"

When the player selects "Normal"
Then the displayed round limit preview shows "8 rounds"

When the player selects "Hard"
Then the displayed round limit preview shows "7 rounds"
```

### SC-030-B-1: Stage advances on confirmation

```gherkin
Given an active campaign on Round 2, Stage 1 (Player Phase 1)
When the player taps "Next Stage"
Then the campaign advances to Round 2, Stage 2
  And the round indicator still shows "Round 2 / 8"
```

### SC-030-B-2: Round advances after final stage

```gherkin
Given an active campaign on Round 3, Stage 4 (End of Round — Legendary Movement)
When the player taps "Complete Round"
Then the campaign advances to Round 4, Stage 1
  And the round indicator shows "Round 4 / 8"
```

### SC-030-B-3: Final round triggers Boss Fight Preparation

```gherkin
Given an active campaign on Round 8 (the final round), reaching Stage 4 (End of Round — Legendary Movement)
When the player taps the final stage confirmation
Then the Boss Fight Preparation screen (FEAT-030-E) is shown
  And the round does NOT advance to Round 9
```

### SC-030-B-4: Defeat when round limit is reached without defeating the Legendary monster

```gherkin
Given an active campaign on Round 8 (roundLimit = 8) and the Legendary monster has NOT been defeated
When the Boss Fight ends without the monster's deck being exhausted
Then the campaign transitions to phase = 'defeat'
  And a defeat screen is shown
```

### SC-030-B-5: Victory screen on Legendary monster defeated

```gherkin
Given an active boss fight (FEAT-030-F)
When the Legendary fight deck is exhausted (last card discarded)
Then the encounter engine signals victory
  And the campaign transitions to phase = 'victory'
  And a victory screen is shown
```

### SC-030-C-1: Movement card drawn and instructions displayed

```gherkin
Given an active campaign at Round 3, Stage 4 (End of Round — Legendary Movement)
  And the top shared movement card has targetLocation1Name = "Oxenfurt", targetLocation2Name = "Novigrad", movementDistanceSolo = 2
When the app draws the movement card
Then the drawn card is displayed showing "Move toward: Oxenfurt, then toward: Novigrad — 2 steps"
  And a reminder is shown: "Place one destruction token at each location you depart from (not the landing spot)"
  And the app does not update any position state
```

### SC-030-C-2: Movement deck reshuffles on exhaustion

```gherkin
Given the shared movement deck has 1 card remaining
When the End of Round — Legendary Movement stage draws the last card
Then the app draws that final card and displays it normally
  And immediately after drawing, all previously drawn movement cards are reshuffled into a new deck
  And no notification is shown to the player about the reshuffle
  And the next draw on the following round draws from the newly shuffled deck
```

### SC-030-D-1: Claiming destruction tokens adds to counter

```gherkin
Given an active campaign with destructionTokenCount = 3
  And it is the end of Stage 1 (Player Phase 1)
When the player taps "Claim Tokens" and enters 2
Then destructionTokenCount becomes 5
  And the updated total is displayed in the campaign header
```

### SC-030-D-2: Token count persists across rounds

```gherkin
Given destructionTokenCount = 5 at the end of Round 4
When the app advances to Round 5
Then destructionTokenCount remains 5 at the start of Round 5
```

### SC-030-D-3: Token counter resets after Boss Fight Preparation confirmation

```gherkin
Given destructionTokenCount = 4 on the Boss Fight Preparation screen
When the player taps "Begin Boss Fight"
Then destructionTokenCount is consumed in the deck formula
  And the counter is reset to 0 before the encounter starts
```

### SC-030-E-1: Fight deck size formula — normal case

```gherkin
Given the Legendary monster has baseFightDeckSize = 25
  And destructionTokenCount = 4
  And campaignSide = 'A'
  And the player enters trophy count = 1
When the player taps "Begin Boss Fight"
Then protectionValue = 2
  And actualFightDeckSize = 25 − 4 = 21
  And the app confirms "Fight deck: 21 cards"
  And the app displays "Protection: 2"
  And the initiative ruling shows "You go first" (because destructionTokenCount > 0)
```

### SC-030-E-2: Initiative ruling — no tokens

```gherkin
Given destructionTokenCount = 0 on the Boss Fight Preparation screen
When the player views the initiative ruling
Then the app shows "Standard initiative"
```

### SC-030-E-3: Fight deck size formula — result clamped to zero

```gherkin
Given baseFightDeckSize = 20
  And destructionTokenCount = 25
  And campaignSide = 'B'
  And the player enters trophy count = 0
  And computed value = 20 − 25 = −5
When the player taps "Begin Boss Fight"
Then actualFightDeckSize is clamped to 0
  And protectionValue = 4
  And the app shows "Fight deck: 0 cards — Legendary monster immediately defeated"
  And no encounter is launched; the campaign transitions directly to phase = 'victory'
```

### SC-030-F-1: Fight deck built with correct size

```gherkin
Given actualFightDeckSize = 21 and baseFightDeckSize = 25
When the boss fight encounter is prepared
Then 4 cards are silently removed from the front of the unshuffled fight deck (not revealed)
  And the remaining 21 cards are shuffled and passed to encounterStore as the active deck
  And the encounter deck tracker shows "21 cards remaining"
```

### SC-030-F-2: Special attack cards trigger discard ability

```gherkin
Given the Legendary fight deck contains a special attack card "Spectral Roar" with discardAbility "Lose 1 Gold"
When "Spectral Roar" enters the discard pile during the encounter
Then the discard ability alert fires: "Spectral Roar — Lose 1 Gold"
  And the encounter continues normally
```

### SC-030-F-3: Protection reduces player damage on every attack

```gherkin
Given an active boss fight with protectionValue = 2
When the player declares 5 damage
Then effectiveDamage = 3
  And exactly 3 cards are discarded from the Legendary fight deck
  And protectionValue remains 2 for the next attack
```

### SC-030-F-4: Protection can fully negate a small attack

```gherkin
Given an active boss fight with protectionValue = 3
When the player declares 2 damage
Then effectiveDamage = 0
  And no cards are discarded from the Legendary fight deck
  And the encounter continues normally
```

---

## 5. Domain Model

### 5.1 New Types

#### `LegendaryDifficulty`

```typescript
export type LegendaryDifficulty = 'easy' | 'normal' | 'hard';
```

#### `LegendaryPhase`

```typescript
export type LegendaryPhase =
  | 'inactive'     // no active campaign
  | 'setup'        // player is on the setup screen
  | 'playing'      // active campaign, rounds 1–N
  | 'bossPrep'     // Boss Fight Preparation screen is shown
  | 'bossFight'    // Legendary encounter is in progress
  | 'victory'      // Legendary monster defeated
  | 'defeat';      // round limit reached without defeating the monster
```

#### `MovementCard`

Represents one card in the shared Legendary Hunt movement deck.

| Field                   | Type                     | Constraints              | Description                                                            |
| ----------------------- | -------- | ------------------------ | ---------------------------------------------------------------------- |
| `id`                    | `string` | unique in shared deck    | e.g. `'legendary-move-01'`                                            |
| `targetLocation1Name`   | `string` | non-empty                | Display name of the first target location                              |
| `targetLocation2Name`   | `string` | non-empty                | Display name of the second target location (used if target1 is reached) |
| `movementDistanceSolo`  | `number` | ≥ 1, integer             | Number of steps the monster moves for solo play                       |
| `movementDistanceBy2?`  | `number` | ≥ 1, integer, optional   | Future multiplayer support                                            |
| `movementDistanceBy3?`  | `number` | ≥ 1, integer, optional   | Future multiplayer support                                            |
| `movementDistanceBy4?`  | `number` | ≥ 1, integer, optional   | Future multiplayer support                                            |

#### `SharedMovementDeck`

```typescript
export type SharedMovementDeck = MovementCard[];
```

#### `TrophyProtectionTable`

Shared lookup table used by Boss Fight Preparation.

```typescript
export interface TrophyProtectionTable {
  side: 'A' | 'B';
  entries: {
    minTrophies: number;
    maxTrophies: number | null;
    protectionValue: number;
  }[];
}
```

#### `TrophyProtectionEntry`

One row in a side-based trophy protection lookup table.

| Field             | Type                 | Constraints                       | Description                                                         |
| ----------------- | -------------------- | --------------------------------- | ------------------------------------------------------------------- |
| `minTrophies`     | `number`             | ≥ 0, integer                      | Minimum trophy count for this tier (inclusive)                      |
| `maxTrophies`     | `number \| null`     | ≥ minTrophies or null             | Maximum trophy count (inclusive). `null` = no upper bound (top tier) |
| `protectionValue` | `number`             | ≥ 0, integer                      | Persistent damage negation applied on every player attack           |

#### `LegendaryMonsterCard`

Extends the existing `MonsterCard` with an optional discard-trigger ability (matching `WildHuntSpecialCard`).

```typescript
export interface LegendaryMonsterCard extends MonsterCard {
  /** Present on all 4 special attack cards; absent on standard fight cards. */
  discardAbility?: MonsterAbility;
  /** True for the 4 special attack cards in the fight deck. */
  isSpecial?: boolean;
}
```

#### `LegendaryMonster`

Top-level static definition for a Legendary monster.

| Field                   | Type                        | Constraints              | Description                                                      |
| ----------------------- | --------------------------- | ------------------------ | ---------------------------------------------------------------- |
| `id`                    | `string`                    | unique                   | e.g. `'leshen-ancient'`                                         |
| `name`                  | `string`                    | non-empty                | Display name                                                     |
| `startingLocationId`    | `number`                    | FK → Location.id         | Location where the monster begins the campaign                  |
| `baseFightDeckSize`     | `number`                    | ≥ 20, integer            | Total cards in the full fight deck before any reduction          |
| `fightDeck`             | `LegendaryMonsterCard[]`    | length = baseFightDeckSize; exactly 4 with `isSpecial = true` | All fight deck cards |
| `passiveAbility`        | `MonsterAbility`            | required                 | Always-active ability during the boss fight                      |
| `discardAbility?`       | `MonsterAbility`            | optional                 | Fires when any fight card enters the discard pile                |
| `image`                 | `string`                    | valid public/ path       | Portrait art, e.g. `public/images/legendary/leshen-ancient/portrait.webp` |
| `artAssets`             | `string[]`                  | length ≥ 1               | Card front images (same pattern as `Monster.cardFrontImages`)   |

#### `LegendaryCampaignState`

Complete persisted state for an active (or inactive) Legendary Hunt campaign.

| Field                   | Type                     | Description                                                                          |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `phase`                 | `LegendaryPhase`         | Lifecycle state of the campaign                                                      |
| `difficulty`            | `LegendaryDifficulty`    | Selected difficulty                                                                  |
| `campaignSide`          | `'A' \| 'B'`            | Selected campaign side; determines which shared trophy protection table is used     |
| `roundLimit`            | `number`                 | Total rounds allowed (derived from difficulty; stored for display)                  |
| `round`                 | `number`                 | Current round, 1–`roundLimit`                                                       |
| `stage`                 | `number`                 | Current stage within the round (1-indexed)                                          |
| `legendaryMonsterId`    | `string`                 | FK → `LegendaryMonster.id`                                                          |
| `destructionTokenCount` | `number`                 | Running total of destruction tokens claimed                                          |
| `movementDeckDrawn`     | `string[]`               | IDs of shared movement cards already drawn from the current shuffle cycle           |
| `movementDeckRemaining` | `string[]`               | IDs of shared movement cards not yet drawn this cycle (ordered; top = index 0)     |
| `protectionValue`       | `number`                 | Boss fight damage negation value computed in FEAT-030-E; `0` until then            |
| `bossFightDeckSize`     | `number \| null`         | Set by FEAT-030-E; null until Boss Prep screen is confirmed                         |
| `playerGoesFirst`       | `boolean \| null`        | Set by FEAT-030-E initiative ruling; null until Boss Prep screen is confirmed       |

#### `LegendaryEncounterState`

Lightweight overlay on `EncounterState` for the boss fight. Extends the existing state with Legendary-specific display needs.

| Field                   | Type                     | Description                                                       |
| ----------------------- | ------------------------ | ----------------------------------------------------------------- |
| `monsterId`             | `string`                 | FK → `LegendaryMonster.id`                                       |
| `playerGoesFirst`       | `boolean`                | Initiative ruling from FEAT-030-E                                 |
| `activeSpecialCards`    | `LegendaryMonsterCard[]` | The 4 special attack cards; used to render discard alerts inline  |

> **Implementation note:** The actual deck, discard pile, and turn tracking live in the existing `EncounterState`/`encounterStore`. `LegendaryEncounterState` is additional metadata displayed alongside it — it does not replace `encounterStore`.

---

## 6. Data Shape

Example data structure for one placeholder Legendary monster plus the shared movement deck and shared protection tables.

```typescript
// src/data/legendary/placeholder-legendary.ts

import type {
  LegendaryMonster,
  SharedMovementDeck,
  TrophyProtectionTable,
} from '../../types/legendary';

export const PLACEHOLDER_LEGENDARY: LegendaryMonster = {
  id: 'placeholder-legendary',
  name: 'Placeholder Legendary',
  startingLocationId: 6, // Placeholder only — real monster data remains in FEAT-009 backlog
  baseFightDeckSize: 22,
  image: 'images/legendary/placeholder/portrait.webp',
  artAssets: [
    'images/legendary/placeholder/card-front-1.webp',
    'images/legendary/placeholder/card-front-2.webp',
  ],

  passiveAbility: {
    name: 'Root Network',
    description: 'TODO: fill from rulebook',
    trigger: 'passive',
  },

  discardAbility: {
    name: 'Entangle',
    description: 'TODO: fill from rulebook',
    trigger: 'discard',
  },

  fightDeck: [
    // 18 standard fight cards
    {
      id: 'leshen-fight-01',
      top: { name: 'Claw Strike', attack: 3 },
      bottom: { name: 'Root Lash', attack: 2, effect: 'TODO' },
    },
    // … more standard cards …

    // 4 special attack cards (isSpecial = true, each with a discardAbility)
    {
      id: 'leshen-special-01',
      isSpecial: true,
      top: { name: 'Spectral Wolves', attack: 5 },
      bottom: { name: 'Bind', attack: 3, effect: 'TODO' },
      discardAbility: {
        name: 'Spectral Wolves',
        description: 'TODO: fill from rulebook',
        trigger: 'discard',
      },
    },
    // … 3 more special cards …
  ],
};

// src/data/legendary/movementDeck.ts

export const LEGENDARY_MOVEMENT_DECK: SharedMovementDeck = [
  {
    id: 'legendary-move-01',
    targetLocation1Name: 'Oxenfurt',
    targetLocation2Name: 'Novigrad',
    movementDistanceSolo: 2,
    movementDistanceBy2: 3,
    movementDistanceBy3: 3,
    movementDistanceBy4: 4,
  },
  {
    id: 'legendary-move-02',
    targetLocation1Name: 'Bald Mountain',
    targetLocation2Name: 'Velen',
    movementDistanceSolo: 2,
  },
  // … remaining shared movement cards from the physical deck
];

// src/data/legendary/trophyProtectionTables.ts

export const TROPHY_PROTECTION_TABLES: TrophyProtectionTable[] = [
  {
    side: 'A',
    entries: [
      { minTrophies: 0, maxTrophies: 0, protectionValue: 3 },
      { minTrophies: 1, maxTrophies: 1, protectionValue: 2 },
      { minTrophies: 2, maxTrophies: 2, protectionValue: 1 },
      { minTrophies: 3, maxTrophies: null, protectionValue: 0 },
    ],
  },
  {
    side: 'B',
    entries: [
      { minTrophies: 0, maxTrophies: 0, protectionValue: 4 },
      { minTrophies: 1, maxTrophies: 1, protectionValue: 3 },
      { minTrophies: 2, maxTrophies: 2, protectionValue: 2 },
      { minTrophies: 3, maxTrophies: 3, protectionValue: 1 },
      { minTrophies: 4, maxTrophies: null, protectionValue: 0 },
    ],
  },
];
```

---

## 7. Behaviour Rules

### Rule 1 — Trophy input maps to protection via the selected campaign side

The app must resolve `protectionValue` by matching the entered trophy count against the shared table for the selected `campaignSide`. Trophies never reduce deck size directly.

### Rule 2 — Actual fight deck size reaches zero

If `actualFightDeckSize = 0` after the Boss Fight Preparation formula (`baseFightDeckSize − destructionTokenCount`), the Legendary monster is considered **immediately defeated**. The encounter is not launched. The campaign transitions directly to `phase = 'victory'` and the victory screen is shown.

### Rule 3 — Protection reduces every player damage action

For each player damage action during the boss fight, the app computes `effectiveDamage = max(0, declaredDamage − protectionValue)`. Only `effectiveDamage` cards are discarded. `protectionValue` is passive and permanent; it is never decremented or consumed.

### Rule 4 — Trophy count exceeds the top tier of the protection table

The shared protection tables must have a final tier with `maxTrophies = null` (open-ended). Any trophy count above the highest explicit threshold is matched to this tier. If the data is malformed (no open-ended tier), the app must fall back to using the protection value of the highest defined tier and log a console warning during development.

### Rule 5 — The app does not track monster board position

The app draws and displays movement cards but does not maintain the Legendary monster's current board location. The player moves the physical token and counts steps on the board. The app shows the movement card instructions and a token placement reminder — nothing more. Board topology encoding (location connections, pathfinding) is deferred to a future option.

### Rule 6 — Destruction tokens are placed on departed locations only

During a movement stage, exactly one destruction token is placed on each location the Legendary monster **departs from**. The landing location never receives a token for that stage unless it was also departed earlier in the same move.

### Rule 7 — Regular board monsters when the Legendary monster is defeated

Defeating the Legendary monster ends the **campaign** (victory) but does not remove or modify the regular board monsters currently active via `boardStore`. After the victory screen is dismissed, the regular board should be in whatever state it was last saved in. The player can continue exploring the board in a non-campaign mode, or start a new game. The Legendary campaign state transitions to `phase = 'victory'` and is retained in `localStorage` until the player starts a new campaign or resets.

### Rule 8 — Legendary monster defeated before the final round

If the Legendary fight deck somehow reaches 0 cards mid-campaign (not expected under normal rules, but possible in edge cases such as a `baseFightDeckSize` data error resulting in a 0-card deck at setup), the victory condition (deck = 0) immediately triggers. The app must handle this defensively: if `encounterStore` receives an empty deck at encounter start, it should transition to `victory` immediately without requiring a card flip.

### Rule 9 — Single active campaign constraint

Only one `LegendaryCampaignState` with `phase !== 'inactive'` may exist at a time. Starting a new campaign (FEAT-030-A) overwrites the previous state after player confirmation. This matches the `WildHuntState` single-session pattern.

### Rule 10 — App refresh during a campaign

If the app is closed or refreshed at any point during the campaign, `LegendaryCampaignState` is restored from `localStorage`. If the `phase` is `'bossFight'` on restore, the encounter is re-initialised using `bossFightDeckSize` (already set in state). The movement deck's remaining order is restored from `movementDeckRemaining`. No campaign progress is lost.

---

## 8. Dependencies

| Depends on                      | Why                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| FEAT-001 (Board Management)     | Regular board activity (boardStore, 3 monster slots) continues throughout the Legendary Hunt campaign |
| Existing encounter engine (`encounterStore`) | FEAT-030-F feeds the fight deck into the existing encounter loop                |
| FEAT-010-B (Round Stage Driver) | FEAT-030-B follows the same structural pattern; the implementation should extract a shared `RoundStageDriver` component if one does not already exist |
| Wild Hunt `WildHuntSpecialCard` type | FEAT-030-F's `LegendaryMonsterCard` follows the same discard-ability pattern; share or mirror the interface |
| FEAT-009 (Legendary Monster Data) | All FEAT-030 sub-features are blocked until at least one monster's data is defined      |

---

## 9. Out of Scope

- **Multiplayer Legendary Hunt** — solo play only; multiplayer scaling TBD
- **Monster position tracking** — the app does not track the Legendary monster's board location; the player moves the physical token. Board topology (location connections, pathfinding) is a potential future feature (Option 2) that would enable app-driven position tracking and automatic destruction token counting.
- **Visual board map** — no graphic of the physical board; movement instructions are text only
- **In-app trophy tracking** — the app does not count trophies earned during the campaign; the player self-reports at the Boss Fight Preparation screen
- **Player stats** (health, gold, equipment) — these are tracked physically
- **Visual route rendering** — the player moves the physical token on the board; the app shows instructions only
- **Expansion locations 19–21** — base game 18 locations only (consistent with FEAT-001)
- **Post-campaign statistics** — no win/loss history is stored beyond the current or most recent campaign

---

## 10. Non-Functional Requirements

| ID      | Category    | Requirement                                                                                           |
| ------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| NFR-001 | Persistence | Full `LegendaryCampaignState` (including movement deck order) shall be persisted to `localStorage` and fully restored on app reload |
| NFR-002 | Reliability | If saved campaign state is corrupt or unreadable, the app shall discard it, transition to `phase = 'inactive'`, and show the campaign setup screen |
| NFR-003 | Performance | Movement card draw and display shall complete in < 50ms                                      |
| NFR-004 | Performance | Boss Fight Preparation calculation shall complete in < 50ms                                          |
| NFR-005 | Offline     | All Legendary monster data is static and bundled; no network requests are made                       |

---

## 11. Open Questions

| #   | Question                                                                                           | Owner  | Status      | Resolution |
| --- | -------------------------------------------------------------------------------------------------- | ------ | ----------- | ---------- |
| OQ-1 | What are the exact trophy-to-protection mappings? | Thomas | Resolved | Protection is a persistent per-attack damage negation value during the boss fight, not deck size reduction. Side A: 0→3, 1→2, 2→1, 3+→0. Side B: 0→4, 1→3, 2→2, 3→1, 4+→0. |
| OQ-2 | What round structure matters for the app? | Thomas | Resolved | The physical game keeps the base 3 player phases. For the app, the important timing is Phase 1 token claiming and Legendary monster movement after all players have taken their turn (end of round). |
| OQ-3 | Is movement deck data shared or per-monster, and how is movement distance stored? | Thomas | Resolved | There is one shared movement deck for all Legendary monsters. `MovementCard` stores per-player-count movement values as `movementDistanceSolo` (and optional multiplayer fields). |
| OQ-4 | What monster data is available now? | Thomas | Resolved | FEAT-009 remains placeholder-only for now. Development proceeds with a single placeholder Legendary monster; all 7 real monsters remain rulebook transcription work. |
| OQ-5 | What if the monster is already at the first target location? | Thomas | Resolved | Irrelevant to the app — the app does not track board position. The player handles movement physically, including this edge case. |
| OQ-6 | Where are destruction tokens placed during movement? | Thomas | Resolved | One token is placed on each location the monster departs during the movement stage. The final landing location does not receive a token for that move. |

---

<!--
  CHECKLIST — Complete before moving to the Plan phase
  ====================================================
  - [x] Problem statement is clear and concise
  - [x] All user stories have acceptance scenarios
  - [x] Domain model covers all new entities
  - [x] Domain rules and invariants are listed (§7)
  - [x] Edge cases cover failure modes, not just happy paths
  - [x] Non-functional requirements are specific and measurable
  - [x] Open questions are listed with owners
  - [x] Out of scope section is explicit
  - [x] OQ-1 through OQ-6 resolved
-->
