# Feature Specification: Monster Trail Expansion

<!--
  TEMPLATE INSTRUCTIONS
  =====================
  This template follows a spec-driven development approach for AI-assisted coding.
  Fill in each section focusing on WHAT the feature does and WHY — not HOW it should
  be implemented. Implementation details belong in the technical plan, not here.

  Usage:
  - One spec per feature or functional slice
  - Store in docs/specs/ and version-control alongside your code
  - Use [NEEDS CLARIFICATION: question] markers for unresolved decisions (max 3)
  - Remove optional sections that don't apply — don't leave them as N/A
  - Reference your arc42 architecture docs where relevant rather than duplicating them

  Workflow: Specify → Plan → Tasks → Implement
  This template covers the "Specify" phase.
-->

## 1. Overview

| Field           | Value                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Feature ID      | FEAT-020                                                                                          |
| Status          | Implemented (3.0-dev)                                                                             |
| Author          | Thomas                                                                                            |
| Created         | 2026-06-16                                                                                        |
| Last updated    | 2026-06-16                                                                                        |
| Epic / Parent   | 3.0 — Monster Trail Expansion (roadmap.md, impact-map.md §5)                                      |
| Arc42 reference | §3 System Scope, §5 Building Block View, §6 Runtime View, §8 Crosscutting Concepts               |

### 1.1 Problem Statement

A player using the physical Monster Trail expansion must manually track two interlocking mechanics during every session: four numbered special cards inserted into each monster's deck (each with unique draw- and discard-triggered abilities), and a set of six weakness tokens placed around the board (which the player can claim and spend before fights for tactical advantages). Without app support the player must look up ability text in the rulebook on every trigger, track which terrain slots still have a token, manage which tokens they are holding, and remember to reset the board after each monster defeat. This overhead is slow and error-prone, and defeats the purpose of the app as a digital referee.

### 1.2 Goal

The app transparently supports all Monster Trail expansion mechanics when Trail Mode is switched on at game start. Special card draw- and discard-trigger abilities surface automatically at the right moment in the existing encounter UI. Weakness token state — placement, claiming, pre-fight declaration, and post-defeat reset — is managed entirely by the app. The player never needs to consult the expansion rulebook during a session.

### 1.3 Non-Goals

- **FEAT-011 — New Attack Types:** Confirmed absent from the physical Trail expansion. Silver / fire / poison typed attacks do not exist in this expansion and are permanently excluded from this spec.
- **FEAT-012 — New Card Types:** Confirmed absent. Trail uses standard attack cards only; no new card archetypes are introduced.
- **Multiplayer Trail Mode:** All Trail mechanics are scoped to solo play only through release 3.0.
- **Player location tracking:** The app does not know where the player's character is on the physical board. Claiming a token is always a deliberate player tap — self-reported.
- **Partial Trail activation:** It is not possible to enable special cards without weakness tokens, or vice versa. The toggle always enables both.
- **Trail Mode change mid-session:** Trail Mode cannot be toggled after a game session has started.
- **New monster records:** Trail abilities are layered onto existing monster data entries; no new monster types are introduced.

---

## 2. User Stories

### US-001: Enable Trail Mode at game start

**As a** solo player using the Monster Trail expansion,
**I want** to switch on Trail Mode once at game start,
**so that** both special card triggers and weakness token management are active for the whole session without me needing to configure them separately.

### US-002: See special cards in the monster deck

**As a** solo player in Trail Mode,
**I want** the monster's deck to include the four numbered special cards alongside the standard cards,
**so that** the physical expansion deck I am using is accurately reflected in the app.

### US-003: Resolve a special card draw trigger

**As a** solo player in Trail Mode,
**I want** the app to display the card's draw-trigger ability immediately when the monster flips a special card,
**so that** I know the exact effect without looking it up in the rulebook.

### US-004: Resolve a special card discard trigger

**As a** solo player in Trail Mode,
**I want** the app to display a special card's discard-trigger ability when I discard it as damage,
**so that** the correct effect fires without me having to cross-reference the card and rulebook manually.

### US-005: Place weakness tokens at game start

**As a** solo player in Trail Mode,
**I want** the app to draw six weakness tokens and walk me through placing them on the board one terrain type at a time,
**so that** setup is guided and I never accidentally skip a terrain type.

### US-006: Claim a weakness token during the game

**As a** solo player in Trail Mode,
**I want** to tap "Claim Token" in the app when I reach a location with a token,
**so that** the app records me holding that token and immediately assigns a replacement to that terrain slot.

### US-007: Apply a weakness token before a fight

**As a** solo player in Trail Mode,
**I want** to choose one held weakness token (or none) to apply before each encounter,
**so that** the correct tactical effect — go first, a smaller deck, a removed special card, or a bonus reward — is applied for that fight.

### US-008: Reset tokens after a monster defeat

**As a** solo player in Trail Mode,
**I want** the app to automatically reset the six board token slots and prompt me to place a fresh set after I defeat a monster,
**so that** the expansion's post-defeat reset rule is enforced without me needing to remember it.

---

## 3. Functional Requirements

| ID     | Requirement                                                                                                                                              | Priority   | User Story          |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| FR-001 | The system shall present a Trail Mode on/off toggle during the game-start setup flow                                                                      | Must Have  | US-001              |
| FR-002 | The Trail Mode toggle shall enable both the special card system and the weakness token system simultaneously; partial activation shall not be possible     | Must Have  | US-001              |
| FR-003 | Trail Mode state shall be stored in the current game session only and shall not persist to the next game session                                           | Must Have  | US-001              |
| FR-004 | When Trail Mode is off, game behaviour shall be identical to the pre-Trail baseline; no special cards, no weakness tokens                                  | Must Have  | US-001              |
| FR-005 | The `Monster` type shall support an optional `trailCards` field containing exactly four `TrailCard` entries (numbers 1–4) when present                     | Must Have  | US-002              |
| FR-006 | Each `TrailCard` shall carry: `number` (1\|2\|3\|4), `drawAbility: Ability`, and `discardAbility: Ability`                                                | Must Have  | US-002, US-003, US-004 |
| FR-007 | When Trail Mode is on and a monster has `trailCards`, deck generation shall append the four `TrailCard` entries to the monster's standard card pool        | Must Have  | US-002              |
| FR-008 | When Trail Mode is on and a monster lacks `trailCards`, deck generation shall proceed with the standard card pool only (no crash, no placeholder cards)    | Must Have  | US-002              |
| FR-009 | When the monster flips a special card (number 1–4) during an encounter in Trail Mode, the system shall immediately display the card's `drawAbility`        | Must Have  | US-003              |
| FR-010 | The draw-trigger ability display shall use the same encounter alert / ability overlay pattern currently used for other encounter alerts                     | Must Have  | US-003              |
| FR-011 | The special card's number (1–4) shall be visible on the card face during the encounter                                                                    | Must Have  | US-003              |
| FR-012 | When the player discards a special card as damage during an encounter in Trail Mode, the system shall display the card's `discardAbility`                  | Must Have  | US-004              |
| FR-013 | If the monster also has a global discard ability, both the global ability and the card's `discardAbility` shall be displayed in sequence within the same discard event | Must Have | US-004         |
| FR-014 | The discard-trigger ability display shall follow the existing `DiscardAlert` component pattern                                                            | Must Have  | US-004              |
| FR-015 | At game start with Trail Mode on, the system shall draw exactly 6 weakness tokens from the pool — one token per terrain type                              | Must Have  | US-005              |
| FR-016 | The system shall present a step-by-step placement checklist showing which terrain types still need a physical token; the player confirms each placement    | Must Have  | US-005              |
| FR-017 | No more than one weakness token shall be active per terrain type at any time                                                                              | Must Have  | US-005, US-006      |
| FR-018 | The board overview (Trail Mode on) shall show all six active board tokens with their terrain type and effect type                                          | Must Have  | US-006              |
| FR-019 | When the player taps "Claim Token" for a terrain type, the system shall: (a) move that token to the player's held tokens, (b) draw a replacement token for the same terrain type slot | Must Have | US-006 |
| FR-020 | The pre-fight screen (Trail Mode on) shall display the player's currently held weakness tokens                                                            | Must Have  | US-007              |
| FR-021 | Before starting an encounter the player shall be able to select one held token to apply, or explicitly skip                                               | Must Have  | US-007              |
| FR-022 | A `combatAdvantage` token shall override initiative so the player always acts first in that encounter                                                     | Must Have  | US-007              |
| FR-023 | A `reduceDeckSize` token shall remove `effectMagnitude` cards from the monster's deck before the encounter begins                                         | Must Have  | US-007              |
| FR-024 | A `removeSpecialCard` token shall remove the special card numbered `effectMagnitude` (1–4) from the monster's deck before the encounter begins            | Must Have  | US-007              |
| FR-025 | A `bonusReward` token shall trigger an additional reward prompt on the victory screen for that encounter                                                   | Must Have  | US-007              |
| FR-026 | Once a token is applied at the pre-fight step, it shall be consumed and removed from the player's held tokens                                             | Must Have  | US-007              |
| FR-027 | The player may hold more than one weakness token simultaneously but may apply a maximum of one per encounter                                              | Must Have  | US-007              |
| FR-028 | After a monster is defeated in Trail Mode, all six weakness token board slots shall be discarded and reset                                                | Must Have  | US-008              |
| FR-029 | After the post-defeat reset, the system shall immediately draw a fresh set of six tokens and display the placement checklist (identical to game-start flow) | Must Have | US-008             |
| FR-030 | Player-held tokens (claimed but not yet applied) shall survive the post-defeat reset unchanged                                                            | Must Have  | US-008              |
| FR-031 | Special cards shall display unique per-card artwork (per monster × card number) when the asset is available                                               | Could Have | US-002              |
| FR-032 | When per-card artwork is unavailable, the system shall fall back to the monster's portrait image without error                                            | Could Have | US-002              |

---

## 4. Acceptance Scenarios

### SC-001: Trail Mode off — identical to baseline (FR-001, FR-004)

```gherkin
Given a new game is being started
  And the player leaves the Trail Mode toggle off
When the game session begins
Then no special cards are added to any monster deck
  And no weakness token board is initialised
  And the encounter flow is identical to the pre-Trail baseline
```

### SC-002: Trail Mode on — special cards appended to deck (FR-001, FR-007)

```gherkin
Given a Trail monster with trailCards [1, 2, 3, 4] defined
  And Trail Mode is on
When a new encounter deck is generated for that monster
Then the deck contains the standard card pool
  And the four trail special cards (numbers 1–4) are appended to the deck
```

### SC-003: Non-Trail monster in Trail Mode — no crash (FR-008)

```gherkin
Given a monster without a trailCards field
  And Trail Mode is on
When a new encounter deck is generated for that monster
Then the deck contains the standard card pool only
  And no error or placeholder card is introduced
```

### SC-004: Special card draw trigger fires (FR-009, FR-010, FR-011)

```gherkin
Given an encounter is active in Trail Mode
  And the monster has special card number 2 in its deck
When the monster flips special card number 2
Then the card's drawAbility name and description are displayed in the encounter overlay
  And the card face shows the number 2
```

### SC-005: Special card discard trigger fires (FR-012, FR-014)

```gherkin
Given an encounter is active in Trail Mode
  And the player discards special card number 3 as damage
When the discard event is resolved
Then the card's discardAbility name and description are displayed in the DiscardAlert overlay
```

### SC-006: Global discard ability and card discard ability both fire (FR-013)

```gherkin
Given an encounter is active in Trail Mode
  And the monster has a global discard ability defined
  And the player discards special card number 1 as damage
When the discard event is resolved
Then the monster's global discard ability is displayed first
  And the card's discardAbility is displayed second in the same discard event sequence
```

### SC-007: Weakness token placement checklist at game start (FR-015, FR-016)

```gherkin
Given Trail Mode is on
  And the player starts a new game
When the game-start flow completes
Then exactly 6 weakness tokens are drawn — one per terrain type
  And a placement checklist is shown listing each terrain type as "needs token"
  And as the player taps to confirm each placement, that terrain type is marked as placed
  And when all 6 are confirmed the checklist is dismissed
```

### SC-008: Max one token per terrain type (FR-017)

```gherkin
Given Trail Mode is on
  And terrain type "mountain" already has an active token on the board
When the system assigns tokens
Then no second token is assigned to "mountain"
  And the board always has at most one active token per terrain type
```

### SC-009: Claiming a token draws a replacement (FR-019)

```gherkin
Given Trail Mode is on
  And the board has an active token on terrain type "woods"
When the player taps "Claim Token" for the "woods" slot
Then the woods token moves to the player's held tokens
  And a new token is immediately drawn from the pool for the "woods" terrain slot
  And the board overview shows the new woods token
```

### SC-010: Pre-fight — apply combatAdvantage (FR-021, FR-022, FR-026)

```gherkin
Given Trail Mode is on
  And the player holds a combatAdvantage weakness token
  And the player starts a new encounter
When the player selects the combatAdvantage token on the pre-fight screen and confirms
Then the encounter begins with the player acting first, regardless of normal initiative
  And the applied token is removed from the player's held tokens
```

### SC-011: Pre-fight — apply reduceDeckSize (FR-023, FR-026)

```gherkin
Given Trail Mode is on
  And the player holds a reduceDeckSize token with effectMagnitude 2
When the player applies the token before an encounter
Then 2 cards are removed from the monster's deck before the encounter begins
  And the applied token is removed from the player's held tokens
```

### SC-012: Pre-fight — apply removeSpecialCard (FR-024, FR-026)

```gherkin
Given Trail Mode is on
  And the player holds a removeSpecialCard token with effectMagnitude 3
  And the monster has special card number 3 in its deck
When the player applies the token before the encounter
Then special card number 3 is removed from the monster's deck before the encounter begins
  And the applied token is removed from the player's held tokens
```

### SC-013: Pre-fight — apply bonusReward (FR-025, FR-026)

```gherkin
Given Trail Mode is on
  And the player holds a bonusReward weakness token
  And the player applies the token before an encounter
When the player defeats the monster
Then an additional reward prompt is displayed on the victory screen
  And the applied token is consumed before the encounter
```

### SC-014: Pre-fight — skip token application (FR-021)

```gherkin
Given Trail Mode is on
  And the player holds one or more weakness tokens
When the player taps "Skip" on the pre-fight token screen
Then no token is consumed
  And the encounter begins without any weakness effect applied
```

### SC-015: Post-defeat board reset — board tokens reset, held tokens survive (FR-028, FR-029, FR-030)

```gherkin
Given Trail Mode is on
  And 6 weakness tokens are active on the board
  And the player holds 2 weakness tokens (claimed, not yet used)
When the player defeats a monster
Then all 6 board token slots are discarded
  And the placement checklist appears immediately for a fresh set of 6 tokens
  And the player's 2 held tokens remain in their hand unchanged
```

### SC-016: Trail Mode toggle is not persisted across sessions (FR-003)

```gherkin
Given a game session was played with Trail Mode on
When a new game session is started
Then the Trail Mode toggle is off by default
  And the player must explicitly re-enable it for the new session
```

---

## 5. Domain Model

### 5.1 Entities

#### TrailCard

A numbered special card belonging to a specific Trail monster. Four TrailCards form the `trailCards` tuple on a Monster. Each card has distinct abilities depending on whether the monster flips it (draw trigger) or the player discards it as damage (discard trigger).

| Attribute       | Type                | Constraints                                 | Description                                          |
| --------------- | ------------------- | ------------------------------------------- | ---------------------------------------------------- |
| number          | 1 \| 2 \| 3 \| 4   | required; unique within a monster's trailCards | Position identifier — matches the physical card number |
| drawAbility     | Ability             | required; non-null                          | Ability fired when the monster flips this card       |
| discardAbility  | Ability             | required; non-null                          | Ability fired when the player discards this card as damage |

#### WeaknessToken

A single physical weakness token from the Monster Trail expansion pool. The pool contains tokens across multiple terrain types; each token carries one of four tactical effects.

| Attribute       | Type                    | Constraints                               | Description                                                                 |
| --------------- | ----------------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| id              | string                  | required; unique within the full pool     | Stable identifier used for tracking in session state                        |
| terrainType     | TerrainType             | required; water\|mountain\|woods          | The board terrain type this token is placed on                              |
| effectType      | WeaknessEffectType      | required                                  | One of: combatAdvantage, reduceDeckSize, removeSpecialCard, bonusReward     |
| effectMagnitude | number                  | optional; present when effectType is reduceDeckSize or removeSpecialCard | Numeric parameter: cards to remove, or special card number (1–4) |

#### PlacedWeaknessToken

A `WeaknessToken` that has been drawn onto the board. Extends `WeaknessToken` with a specific `Location` assignment so the player knows exactly where to place the physical token — no manual bag draw required.

| Attribute   | Type   | Constraints                                    | Description                                                              |
| ----------- | ------ | ---------------------------------------------- | ------------------------------------------------------------------------ |
| locationId  | number | required; FK → Location.id; matches terrainType | The specific board location for this token. Redrawn on player request. |

#### TrailSession (session state additions)

Runtime state additions to the existing game session when Trail Mode is on.

| Attribute              | Type                        | Constraints                                | Description                                                              |
| ---------------------- | --------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| trailModeEnabled       | boolean                     | required; set once at game start           | Whether Trail Mode mechanics are active for this session                 |
| weaknessTokenBoard     | PlacedWeaknessToken[]       | length = 3 when Trail Mode on; one per terrain type | The tokens currently on the board, each with an assigned location |
| weaknessTokensHeld     | PlacedWeaknessToken[]       | length ≥ 0; not cleared by post-defeat reset | Tokens claimed by the player and not yet applied                    |
| pendingWeaknessEffect  | PlacedWeaknessToken \| null | null when no token declared this fight     | The token declared on the pre-fight screen; consumed when encounter begins |

### 5.2 Type Definitions

```ts
interface TrailCard {
  number: 1 | 2 | 3 | 4;
  drawAbility: Ability;       // fired when the monster flips this card
  discardAbility: Ability;    // fired when the player discards this card as damage
}

// Extension to the existing Monster interface:
// trailCards?: [TrailCard, TrailCard, TrailCard, TrailCard]

type TerrainType = 'water' | 'mountain' | 'woods';

type WeaknessEffectType =
  | 'combatAdvantage'    // player goes first regardless of initiative
  | 'reduceDeckSize'     // remove effectMagnitude cards from the monster deck
  | 'removeSpecialCard'  // remove the trail special card numbered effectMagnitude
  | 'bonusReward';       // show bonus reward prompt on victory

interface WeaknessToken {
  id: string;
  terrainType: TerrainType;
  effectType: WeaknessEffectType;
  effectMagnitude?: number;
}

// Board / held tokens carry their assigned location (drawn automatically, no bag draw needed):
type PlacedWeaknessToken = WeaknessToken & { locationId: number };
```

### 5.3 Relationships

- A **Monster** optionally has exactly 4 **TrailCards** (the `trailCards` tuple). Non-Trail monsters have none.
- A **TrailSession** holds 0–N **PlacedWeaknessTokens** in `weaknessTokensHeld` and exactly 3 in `weaknessTokenBoard` (one per terrain type, while Trail Mode is active).
- A **PlacedWeaknessToken** extends **WeaknessToken** with a `locationId` pointing to a specific `Location`; the location is assigned automatically when the token is drawn so the player never needs to pull a location token from the bag.
- A **TrailCard** references two **Ability** records (shared type with the existing ability model).
- A **WeaknessToken** on the board occupies exactly one terrain type slot; that slot may not be occupied by more than one token simultaneously.

### 5.4 Domain Rules and Invariants

- **Single toggle — all or nothing:** `trailModeEnabled` cannot be `true` for one mechanism and `false` for the other. Both special cards and weakness tokens activate together.
- **trailCards completeness:** A monster either defines exactly 4 `TrailCard` entries (one per number 1–4, in order) or defines none. A partial `trailCards` array is invalid.
- **One token per terrain type:** At any time during a Trail session, `weaknessTokenBoard` contains at most one token per terrain type value.
- **Board token count:** `weaknessTokenBoard` holds exactly 3 tokens (one per terrain type) whenever Trail Mode is active and the placement flow is complete.
- **Location assigned at draw time:** When a token is drawn onto `weaknessTokenBoard` it is immediately assigned a random `Location` whose `type` matches the token's `terrainType`. The player never draws from the physical location bag.
- **Redraw avoids the same location:** If the player taps "Redraw" (player is present on the assigned location), a new location is selected — always different from the current one, as long as at least two locations of that terrain type exist.
- **Held tokens survive reset:** `weaknessTokensHeld` is never cleared by the post-defeat reset. Only `weaknessTokenBoard` is cleared.
- **One token applied per fight:** At most one token may be moved to `pendingWeaknessEffect` per encounter. Once consumed, it is removed from `weaknessTokensHeld`; `pendingWeaknessEffect` returns to `null`.
- **Trail Mode immutable after start:** `trailModeEnabled` is set exactly once per session (at game start) and does not change mid-session.
- **Deck extension only in Trail Mode:** The 4 `TrailCard` entries are appended to a monster's deck if and only if `trailModeEnabled === true` AND `monster.trailCards` is defined.

---

## 6. Non-Functional Requirements

| ID      | Category    | Requirement                                                                                                                                              |
| ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-001 | Persistence | Full Trail session state (`trailModeEnabled`, `weaknessTokenBoard`, `weaknessTokensHeld`, `pendingWeaknessEffect`) shall be persisted to `localStorage` and fully restored on app reload |
| NFR-002 | Performance | Trail-mode deck generation (standard pool + 4 trail cards) shall complete in < 100 ms on a mid-range mobile device                                       |
| NFR-003 | Reliability | If Trail session state in `localStorage` is corrupt or unreadable, the app shall discard it and return to the new-game start screen rather than crash    |
| NFR-004 | Data integrity | Trail ability text (`drawAbility`, `discardAbility`) for all Trail monsters must be authored from the physical rulebook before the feature is playable; the build shall not ship Trail monster stubs with empty ability text |
| NFR-005 | Reliability | If the weakness token pool is exhausted during a replacement draw, the system shall log a warning and display a "No tokens remaining" notice rather than crash |

---

## 7. Edge Cases and Error Scenarios

| ID   | Scenario                                                                            | Expected Behaviour                                                                                                                                   |
| ---- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| EC-1 | Monster in Trail Mode has no `trailCards` defined                                   | Deck is generated from the standard pool only; no special cards are added; no error is thrown; the encounter proceeds normally                       |
| EC-2 | `removeSpecialCard` token applied but the target special card is not in the deck    | The effect is silently no-op (card was already absent); the token is still consumed; the encounter begins normally                                   |
| EC-3 | `reduceDeckSize` token's `effectMagnitude` exceeds the remaining deck size          | Remove all remaining cards (floor at 0); the monster starts the encounter with an empty deck; the token is consumed                                  |
| EC-4 | Token pool exhausted — no tokens available for a replacement draw                   | System logs a warning; board overview shows the terrain slot as "No token available"; placement checklist skips that slot; no crash                  |
| EC-5 | Player holds 0 weakness tokens when the pre-fight screen is shown                  | Pre-fight token step shows "No tokens held — skip"; player proceeds directly to the encounter                                                        |
| EC-6 | App is closed or refreshed during the weakness placement checklist flow             | State is restored from `localStorage`; the placement checklist re-opens at the last unconfirmed terrain type                                         |
| EC-7 | App is closed or refreshed during an encounter with `pendingWeaknessEffect` set     | `pendingWeaknessEffect` is restored from `localStorage`; the effect is (re-)applied when the encounter resumes                                       |
| EC-8 | Trail Mode was on; player navigates back to start a new game                        | New game start resets `trailModeEnabled` to `false`; player must explicitly re-enable Trail Mode for the new session                                 |

---

## 8. Success Criteria

| ID     | Criterion                                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------------------- |
| SC-001 | All acceptance scenarios (SC-001 through SC-016) pass in CI                                                        |
| SC-002 | Trail Mode off produces game state and encounter flow identical to the pre-Trail baseline (verified by existing tests) |
| SC-003 | Domain invariants hold: no two board token slots share the same terrain type; `trailCards` tuples are always length 4 or absent |
| SC-004 | Full Trail session state survives an app reload and is correctly restored at every stage (placement, mid-game, pre-fight) |
| SC-005 | Trail-mode deck generation completes within 100 ms on a mid-range mobile device                                    |
| SC-006 | Trail ability text is present for all Trail monsters before the 3.0 release build is tagged                        |

---

## 9. Dependencies and Constraints

### 9.1 Dependencies

- **Existing `Monster` type** (`src/data/monsters/index.ts`) — the `trailCards?: [TrailCard, TrailCard, TrailCard, TrailCard]` field is added to this type; Trail ability data must be authored for each Trail monster entry before the feature is playable.
- **Existing `Ability` type** — `TrailCard.drawAbility` and `TrailCard.discardAbility` both reuse the existing `Ability` structure (name + description text).
- **Existing deck generation logic (FEAT-002)** — must be extended to append trail special cards when Trail Mode is on and `monster.trailCards` is defined.
- **Existing `DiscardAlert` component (FEAT-003 / FR-3.3)** — the discard-trigger display for special cards follows this pattern; the component may require minor extension to accept a `TrailCard` discard payload.
- **Existing encounter alert / overlay** — the draw-trigger display reuses this mechanism; no new overlay component should be needed.
- **`boardStore` / `encounterStore`** — Trail session state additions (`weaknessTokenBoard`, `weaknessTokensHeld`, `pendingWeaknessEffect`) live in the existing store layer; exact placement TBD in the implementation plan.
- **`localStorage` persistence layer** (§8 Crosscutting Concepts) — Trail session state must be included in the serialised snapshot.
- **Weakness token pool data** — must be transcribed from the physical Monster Trail expansion rulebook before implementation (see Open Questions OQ-1, OQ-3, OQ-4).

### 9.2 Constraints

- **Client-side only:** No backend, no API calls. All Trail data (ability text, token pool) is static and bundled with the app.
- **Mobile-first:** All new interactions (placement checklist confirmations, "Claim Token" tap, pre-fight token selection) must be touch-friendly.
- **No routing library:** Navigation follows the existing `phase`-based state approach; Trail flows are phases within the existing session lifecycle.
- **No partial activation:** The architecture must not expose separate flags for special cards vs. weakness tokens; a single `trailModeEnabled` boolean controls both.
- **FEAT-007 (card art) must not block 3.0 launch:** The fallback to monster portrait must be in place before Trail Mode ships.

### 9.3 Architecture References

| Arc42 Section              | Relevance to This Feature                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| §3 System Scope            | Confirms client-side only, single-player scope; no external interfaces or server state          |
| §5 Building Block View     | Encounter engine, `boardStore`, and `encounterStore` are the primary affected building blocks   |
| §6 Runtime View            | Encounter lifecycle — pre-fight setup (token declaration), turn loop (card triggers), post-defeat flow (board reset) |
| §8 Crosscutting Concepts   | `localStorage` persistence pattern; injectable `rng` for token pool draws                       |

---

## 10. Open Questions

| #   | Question                                                                                                                                         | Owner                    | Status     | Resolution |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ---------- | ---------- |
| 1   | How many distinct terrain types appear in the physical weakness token pool? Is it exactly 3 (water, mountain, woods), or a different count? | Verify against rulebook  | Resolved   | 3 terrain types — water, mountain, woods — matching `LocationType`. Confirmed by product owner. |
| 2   | Can a player choose NOT to claim a token they are eligible for (i.e., is claiming voluntary), or is it mandatory when the player is on the same location? | Verify against rulebook  | Unresolved | —          |
| 3   | When a token is claimed and a replacement is drawn, is the replacement always random from the full pool, or is it restricted to the same terrain type as the claimed token? | Verify against rulebook  | Unresolved | —          |
| 4   | Does the `bonusReward` effect have a dedicated fixed reward table in the expansion, or does it draw from the standard post-fight reward pool?      | Verify against rulebook  | Unresolved | —          |

---

<!--
  CHECKLIST — Complete before moving to the Plan phase
  ====================================================
  - [x] Problem statement is clear and concise
  - [x] All user stories have acceptance scenarios
  - [x] Each functional requirement traces to a user story
  - [x] Domain model covers all entities mentioned in the requirements (TrailCard, WeaknessToken, TrailSession)
  - [x] Domain rules and invariants are listed
  - [x] Edge cases cover failure modes, not just happy paths
  - [x] Non-functional requirements are specific and measurable
  - [x] Arc42 references point to the right sections
  - [x] No more than 3 [NEEDS CLARIFICATION] markers remain
  - [ ] Open questions are assigned and have a resolution path — OQ-1 through OQ-4 are unresolved pending physical rulebook verification
-->
