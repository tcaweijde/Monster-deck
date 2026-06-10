# FEAT-010 — Wild Hunt Expansion

> Status: In Progress · Last updated: 2026-06-10

---

## Overview

The Wild Hunt expansion is a **game mode** (not a campaign) that replaces the standard open-ended game loop with an **8-round sequence**. Each round has a fixed sequence of 4 stages driven by the app. In round 8, stage 4 triggers the **Final Battle** against the Wild Hunt boss instead of the normal spawn phase. The game mode always ends after the Final Battle — it cannot end early.

The setup is configurable by **player count** (solo for now; multiplayer variant is a future consideration — see Multiplayer feature) and **difficulty level** selected at the start.

- **Difficulty** affects: starting monster(s) on the board and the Wild Hunt's starting shield count
- **Player count** also affects starting shield count (values TBD from rulebook)

The Wild Hunt character moves **2 spaces toward the player** each round on a location graph.

This is the largest scope expansion in the roadmap. It touches the board engine, the encounter engine, a new game-mode state layer, and new monster/enemy types.

---

## Feature Breakdown

### FEAT-010-A — Game Mode State Engine

The app must track a Wild Hunt game mode session distinct from a single encounter.

- Game mode has 8 rounds; the app tracks the current round
- Each round has 4 ordered stages (see FEAT-010-B)
- **Round 8, Stage 4** triggers the Final Battle instead of the normal spawn phase
- The game mode always ends after the Final Battle — it cannot end before round 8
- Game mode state must persist across app refresh (like board state today)
- Only one game mode session can be active at a time
- **Setup screen** configures:
  - Player count (solo for now; future: multiplayer variant)
  - Difficulty level (affects starting monsters on the board and Wild Hunt starting shield count)

**Effort: M**

---

### FEAT-010-B — Round Stage Driver

The app drives the player through each round's 4 stages in order:

1. **Movement & Action** — player movement and actions (app shows round/stage indicator; player acts physically)
2. **Fight, Meditation & Exploration** — player fights, meditates, or explores; **story card is read here** (app shows "Read Story Card #N" prompt; see FEAT-010-I)
3. **Drawing & Gaining Cards** — player draws and collects cards/rewards (app shows prompt; player acts physically)
4. **Add Hound & Monster** — spawn phase (see FEAT-010-G/H); **in round 8 this stage triggers the Final Battle instead**

App shows current round and stage at all times. Each stage advances on player confirmation. Stage 4 of round 8 shows a "Final Battle" call-to-action that launches the Wild Hunt encounter.

**Effort: M**

---

### FEAT-010-C — Wild Hunt Character Selection

At campaign start, the player selects one of 4 Wild Hunt characters.

- 4 pre-built characters, each with a fixed name and passive ability
- Selection screen shown once at campaign start
- Selected character is stored in campaign state

**Effort: S**

---

### FEAT-010-D — Wild Hunt Location Tracking

The Wild Hunt has a position on the board and moves each round.

- Starts at a designated starting location
- Moves **2 spaces toward the player** each round
- The player is notified when to move the Wild hunt in a specific round
- When the Wild hunt reaches the player's location, a special ability is triggered (depending on the Boss)

**Status: ✅ Built** — The "Wild Hunt Movement" card on the board screen is tappable and opens a bottom-sheet popup showing the character's `locationAbility` (name + description) with the character's portrait art as background and a gradient overlay. The popup closes on tap.

> ⚠️ **Data gap:** Each `WildHuntCharacter` now has a `locationAbility` field, but all four characters currently carry `"TODO: fill from rulebook"` as the ability description. These must be transcribed from the physical Wild Hunt expansion rulebook before the feature is fully playable.

**Effort: M**

---

### FEAT-010-E — Wild Hunt Encounter (Boss Fight)

Encountering the Wild Hunt uses a modified version of the existing encounter engine.

- Wild Hunt deck = standard generic deck + 4 character-specific special cards
- The 4 special cards have the same attack format as standard cards, but each has a **discard-trigger ability** that fires when the card is discarded as part of player damage
- Wild Hunt has a **shield counter** (see FEAT-010-F)
- The encounter ends when the Wild Hunt's deck is exhausted (player wins). The player's own deck running out is their defeat condition — this is not tracked by the app; the player declares defeat manually.
- UI must show: shield counter, current special card discard abilities (same `DiscardAlert` pattern)

**Effort: L**

---

### FEAT-010-F — Shield Counter

The Wild Hunt has a shield counter that absorbs incoming damage.

- Shields displayed as a counter on the Wild Hunt's board card and encounter screen
- Player damage hits shields first; only excess damage discards cards from the Wild Hunt deck
- **Manually adjustable via +/− buttons** — story card events can add or remove shields at any point during the game mode; this is the primary way shields change outside of combat
- Shields are also auto-incremented when a monster fails to spawn due to a full board (see FEAT-010-G)
- Initial shield count is determined by **difficulty level and player count** (solo values below; multiplayer TBD)

**Solo play starting setup:**

| Difficulty | Starting monster | Starting shields |
|------------|-----------------|-----------------|
| Easy       | 1× Level 1      | 5               |
| Normal     | 1× Level 1      | 7               |
| Hard       | 1× Level 2      | 9               |
| Very Hard  | 1× Level 3      | 11              |

**Effort: M**

---

### FEAT-010-G — Monster Spawn System

Each round, the app determines what monsters and hounds to spawn based on round triggers.

- Round spawn table: specifies which round spawns which level monster(s) and/or a hound
- App shows a spawn prompt listing what needs to be placed (e.g. "Spawn 1× L2 monster, 1× hound")
- Player draws from the token bag and places normally; app doesn't automate the physical placement
- **Board-full overflow:** if a regular monster would spawn but all 3 board slots are occupied, Wild Hunt gains +1 shield instead — app prompts and auto-increments shield counter
- Hounds spawn at the Wild Hunt's current location (displayed in prompt)

**Effort: M**

---

### FEAT-010-H — Hound Enemy Type

Hounds are a new one-off enemy type with a **unique one-shot combo resolution** mechanic — distinct from the standard card-flip encounter flow.

- Tracked separately from the 3 regular board slots (max 3 regular monsters + any number of hounds)
- Spawns at the Wild Hunt's current location
- Hounds come in **3 levels (L1 / L2 / L3)**

**Hound combat flow:**
1. **Pre-attack bonus reminder** — before the player declares their combo, the app shows a reminder that the player receives a bonus for this attack (exact bonus TBD from physical expansion; app shows a prompt, player applies it physically)
2. **Player declares combo damage** — a single value
3. **Threshold check** — damage threshold per level (solo play):
   | Hound Level | Damage Threshold |
   |-------------|-----------------|
   | L1 | 2 |
   | L2 | 3 |
   | L3 | 4 |
4. If declared damage ≥ threshold → hound is defeated AND Wild Hunt loses shields equal to the excess damage
5. If declared damage < threshold → hound survives
6. **On defeat**: app displays a random reward (reward table TBD — to be filled at implementation from physical expansion contents)

> **Note:** Damage thresholds above are for solo play. Multiplayer variants may differ — define when multiplayer support is added.
> ⚠️ **Data gap:** the rewards are still placeholder and should be updated before finishing this feature
**Effort: M**

---

### FEAT-010-I — Story Card Reminder

Prompt shown during **stage 2 (Fight, Meditation & Exploration)** of each round.

- App shows: "Read Story Card #N" during stage 2
- No story card content is stored in the app; all narrative lives on the physical cards
- Player taps "Done" to continue through stage 2

**Effort: S**

---

### FEAT-010-J — Wild Hunt Character Data

Static data definitions for the 4 Wild Hunt characters.

- Name, passive ability, starting shield count
- 4 special card definitions per character (attack value + discard-trigger ability text)
- Art assets (if available)

**Effort: S**

---

### FEAT-010-K — Monster Proximity Card Bonus

Before starting a regular monster encounter, the app checks how many Wild Hunt / hound units are nearby and inflates the monster's deck accordingly.

**Proximity rules (stacking):**
- Wild Hunt is on the same location or 1 location away → +1 card
- Each hound on the same or adjacent location → +1 card per hound
- Example: Wild Hunt nearby + 2 hounds nearby → +3 cards added before the fight

**Encounter setup flow:**
- When launching a monster encounter, a new pre-fight screen shows:
  - "Is the Wild Hunt on this location or 1 away?" (Yes / No toggle)
  - "How many hounds are on this location or adjacent?" (0 / 1 / 2 / … stepper)
- App calculates the bonus card count and draws that many extra cards from the monster's card pool, shuffling them into the deck before the encounter starts
- The deck tracker reflects the inflated deck size

**Effort: M**

## Data Model Changes

| Change | Why |
|--------|-----|
| New `CampaignState` store | Tracks round, stage, Wild Hunt position, shield count, active character, hound slots |
| New `WildHuntCharacter` type | Fixed name, ability, shield count, special cards |
| New `Hound` monster subtype | L1 only, reward table reference |
| `BoardState` extended | Supports hound slots alongside 3 regular slots |
| Round spawn table | Static data: round → spawn rules |

---

## Open Questions

- What is the hound reward table? (needs transcription from physical expansion)
- What are the exact starting shield counts per difficulty and player count? (needs physical rulebook)
- What are the starting monsters per difficulty? (needs physical rulebook)
- Does the location graph have a fixed structure, or does it vary by setup?

## Future Considerations

- **Multiplayer variant**: Setup currently scoped to solo only. When multiplayer support is added (separate roadmap item), the Wild Hunt game mode setup should support multiple player counts — starting shield counts and difficulty scaling will differ.

---

## Dependencies

| Depends on | Why |
|-----------|-----|
| FEAT-001 (Board Management) | Game mode uses the board system as its foundation |
| Existing encounter engine | Wild Hunt boss fight is an extended encounter |
