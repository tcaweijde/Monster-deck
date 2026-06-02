# Feature Specification: Monster Placement

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

| Field           | Value                                                             |
| --------------- | ----------------------------------------------------------------- |
| Feature ID      | FEAT-001                                                          |
| Status          | Draft                                                             |
| Author          | Thomas                                                            |
| Created         | 2026-06-02                                                        |
| Last updated    | 2026-06-02                                                        |
| Epic / Parent   | 1.0 Polish — Monster placement logic (impact-map.md §5)          |
| Arc42 reference | §3 System Scope, §5 Building Block View, §6 Runtime View, §8 Crosscutting Concepts |

### 1.1 Problem Statement

Before each game session, the player must manually draw numbered tokens from a bag to place 3 monsters on the board — one per location type (water, mountain, woods). Enforcing the uniqueness constraint and repeating the token draw every time a monster is defeated is fiddly and slows down play. The app should eliminate this entirely.

### 1.2 Goal

The app manages the full board state for solo play: at game start it randomly assigns 3 distinct monsters (one at each level L1/L2/L3, one per location type) to specific numbered locations. After a monster is defeated, the app automatically spawns a unique replacement at the next level, assigned to a new random location within the same type. The player never needs to touch a token bag.

### 1.3 Non-Goals

- Trophy collection and game-over detection (player tracks 4-trophy win condition manually)
- Player stats (health, gold, etc.)
- Expansion locations 19–21
- Multiplayer level assignment (4/5 players)
- Rendering a visual board map — placement is shown as text/card UI, not a graphic
- Manual monster or level selection for initial placement

## 2. User Stories

### US-001: Game setup

**As a** solo player,
**I want** the app to randomly place 3 monsters on the board at game start (one per level, one per location type),
**so that** I never have to draw tokens or enforce placement rules manually.

### US-002: Board overview

**As a** solo player,
**I want** to see all 3 active monsters with their level and location,
**so that** I know where each monster is and can choose which one to fight next.

### US-003: Start encounter from board

**As a** solo player,
**I want** to tap a monster on the board to launch its encounter,
**so that** I can move from board management into combat without re-selecting the monster.

### US-004: Monster replacement

**As a** solo player,
**I want** the app to automatically spawn a replacement monster after I defeat one (same location type, next level, new location number),
**so that** the board is always valid and I never repeat the token-draw process mid-game.

## 3. Functional Requirements

| ID     | Requirement                                                                                          | Priority | User Story |
| ------ | ---------------------------------------------------------------------------------------------------- | -------- | ---------- |
| FR-001 | The system shall randomly select 3 distinct monsters (one per level L1/L2/L3) from the monster pool at game start | Must | US-001 |
| FR-002 | The system shall randomly assign each of the 3 monsters a distinct location type (water, mountain, woods — one each) | Must | US-001 |
| FR-003 | The system shall randomly assign each monster a specific numbered location within its assigned type  | Must     | US-001     |
| FR-004 | The system shall store the 18 base-game location names, numbers, and types as static data            | Must     | US-001, US-002 |
| FR-005 | The system shall display all active monsters showing: monster name, level, location type, location number, and location name | Must | US-002 |
| FR-006 | The system shall allow the player to start an encounter for any active monster from the board overview | Must   | US-003     |
| FR-007 | The system shall return the player to the board overview after an encounter ends (victory)            | Must     | US-003     |
| FR-008 | After a monster is defeated, the system shall automatically select a unique replacement monster not currently active on the board | Must | US-004 |
| FR-009 | The replacement monster's level shall be min(defeated level + 1, 3)                                 | Must     | US-004     |
| FR-010 | The replacement monster shall be assigned a new random numbered location within the same type as the defeated monster, distinct from the previous location number | Must | US-004 |

## 4. Acceptance Scenarios

### SC-001: Initial board placement (FR-001, FR-002, FR-003)

```gherkin
Given the monster pool has at least 3 distinct monsters
When the player starts a new game
Then 3 distinct monsters are placed on the board
  And each monster has a unique level (L1, L2, L3 — one each)
  And each monster has a unique location type (water, mountain, woods — one each)
  And each monster has a randomly selected numbered location within its assigned type
```

### SC-002: Board overview display (FR-005)

```gherkin
Given a game has been set up with 3 monsters on the board
When the player views the board overview
Then each monster entry shows its name, level, location type, location number, and location name
```

### SC-003: Launching an encounter from the board (FR-006)

```gherkin
Given the board overview shows 3 active monsters
When the player taps on a monster
Then the encounter screen opens for that monster at its assigned level
```

### SC-004: Returning to board after victory (FR-007)

```gherkin
Given the player is in an encounter and defeats the monster
When the victory state is dismissed
Then the player is returned to the board overview
```

### SC-005: Replacement monster — level escalation (FR-008, FR-009, FR-010)

```gherkin
Given a level 1 monster is defeated at a water location
When the board resolves the replacement
Then a monster not currently active on the board is randomly selected
  And it is assigned level 2
  And it is assigned a new random numbered water location (distinct from the previous one)
  And the board overview shows the replacement
```

### SC-006: Level 3 replacement stays at L3 (FR-009)

```gherkin
Given a level 3 monster is defeated
When the board resolves the replacement
Then the replacement is assigned level 3
```

### SC-007: No duplicate monster species on board (FR-008)

```gherkin
Given monsters A (active, L2) and B (active, L3) are on the board
  And monster C is defeated
When the board selects a replacement
Then neither A nor B is selected as the replacement
```

### SC-008: Replacement reuses previously-defeated species when pool is small (FR-008)

```gherkin
Given the monster pool has exactly 3 monsters: A, B, C
  And A and B are currently active on the board
  And C has just been defeated
When the board selects a replacement
Then C is selected (as it is the only monster not currently active on the board)
```

## 5. Domain Model

### 5.1 Entities

#### Location

Static data representing a single numbered location on the physical game board.

| Attribute | Type    | Constraints                     | Description                        |
| --------- | ------- | ------------------------------- | ---------------------------------- |
| id        | integer | 1–18, unique, immutable          | Location number (matches token)    |
| name      | string  | required, non-empty              | Witcher-world location name        |
| type      | enum    | water \| mountain \| woods       | Location category                  |

**Complete location data (base game):**

| id | name           | type     |
| -- | -------------- | -------- |
| 1  | Kaer Seren     | water    |
| 2  | Henfors        | mountain |
| 3  | Kaer Morhen    | mountain |
| 4  | Ban Aard       | water    |
| 5  | Cidaris        | water    |
| 6  | Novigrad       | woods    |
| 7  | Vizima         | woods    |
| 8  | Vengerberg     | woods    |
| 9  | Cintra         | mountain |
| 10 | Haern Caduch   | woods    |
| 11 | Beauclair      | mountain |
| 12 | Glenmore       | water    |
| 13 | Doldeth        | mountain |
| 14 | Loc Ichaer     | water    |
| 15 | Gorthur Gvaed  | water    |
| 16 | Dwywod         | woods    |
| 17 | Stygga         | woods    |
| 18 | Ard Modron     | mountain |

#### BoardSlot

One of the 3 active monster placements on the board. Each slot permanently holds one location type throughout the game session.

| Attribute    | Type    | Constraints                          | Description                                  |
| ------------ | ------- | ------------------------------------ | -------------------------------------------- |
| locationType | enum    | water \| mountain \| woods; unique per board | The type this slot permanently occupies |
| locationId   | integer | FK → Location; must match locationType | The specific numbered location assigned    |
| monsterId    | string  | FK → Monster; unique per board        | Which monster occupies this slot            |
| level        | enum    | 1 \| 2 \| 3                          | Current monster level at this slot          |
| status       | enum    | active \| encountering               | Whether the monster is idle or mid-combat   |

### 5.2 Relationships

- A **Board** has exactly 3 **BoardSlots** (one per location type)
- Each **BoardSlot** references exactly one **Monster** and one **Location**
- No two **BoardSlots** on the same **Board** may reference the same **Monster**

### 5.4 Domain Rules and Invariants

- **One-type-per-slot**: Each slot permanently holds a location type; this does not change when a monster is replaced.
- **Monster uniqueness**: No two active slots may hold the same monster species simultaneously.
- **Level escalation**: On replacement, new level = min(defeated level + 1, 3). Level never decreases.
- **Location reassignment**: On replacement, a new location number is drawn from the same type — it must differ from the previous number.
- **Location immutability**: Location data (id, name, type) is static and never modified at runtime.

## 6. Non-Functional Requirements

| ID      | Category    | Requirement                                                                                           |
| ------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| NFR-001 | Persistence | Board state (all 3 slots: monster, level, location, status) shall be persisted to `localStorage` and fully restored on app reload |
| NFR-002 | Performance | Board initialization (random monster + location assignment) shall complete in < 100ms on a mid-range mobile device |
| NFR-003 | Reliability | If saved board state is corrupt or unreadable, the app shall discard it and offer a fresh game start rather than crash |

## 7. Edge Cases and Error Scenarios

| ID   | Scenario                                                              | Expected Behavior                                                                                   |
| ---- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| EC-1 | Player navigates back to board overview mid-encounter                 | Monster slot reverts to `active`; encounter state is discarded; player returns to board overview    |
| EC-2 | Replacement location draw returns same number as previous             | Exclude previous location number from the candidate pool to guarantee a distinct result             |
| EC-3 | Monster pool has only 3 monsters; replacement must reuse a species    | Any monster not currently active (including previously defeated ones) is a valid replacement candidate |
| EC-4 | App refreshed or closed during an active encounter                    | Board state restored from localStorage; any slot with status `encountering` is reverted to `active` |
| EC-5 | localStorage data is missing or fails to parse on load                | Discard saved state; render the new-game start screen                                               |
| EC-6 | Monster pool grows beyond 3 in the future                             | Placement logic works for any pool size ≥ 3; no code changes needed                                |

## 8. Success Criteria

| ID     | Criterion                                                                           |
| ------ | ----------------------------------------------------------------------------------- |
| SC-001 | All acceptance scenarios pass in CI                                                 |
| SC-002 | Board state survives app refresh and is correctly restored to the board overview    |
| SC-003 | Domain invariants hold: no two active slots share a location type or monster species |
| SC-004 | Board initialization completes within 100ms on a mid-range mobile device            |

## 9. Dependencies and Constraints

### 9.1 Dependencies

- **18 base-game location names** must be authored as static data before implementation (currently undefined — see Open Questions)
- **Existing `Monster` type and `MONSTERS` pool** from `src/data/monsters/index.ts` — placement logic consumes this directly
- **Existing encounter flow** (`encounterStore`) — the board launches encounters and receives the victory event

### 9.2 Constraints

- Client-side only: no backend, no API calls. All data is static and bundled.
- Mobile-first: interactions must be touch-friendly (tap to start encounter).
- No routing library: navigation handled via state variable, consistent with the current `phase`-based approach.

### 9.3 Architecture References

| Arc42 Section                    | Relevance to This Feature                                                    |
| -------------------------------- | ---------------------------------------------------------------------------- |
| 3. Context & Scope               | Confirms client-side only, single-player scope; no external interfaces       |
| 5. Building Block View           | A new `boardStore` is introduced alongside the existing `encounterStore`     |
| 6. Runtime View                  | The encounter lifecycle is now nested inside a board lifecycle               |
| 8. Crosscutting Concepts         | `localStorage` persistence pattern; random number generation via injectable `rng` |

## 10. Open Questions

| #   | Question                                                                      | Owner  | Status | Resolution |
| --- | ----------------------------------------------------------------------------- | ------ | ------ | ---------- |
| 1   | What are the 18 Witcher-world location names for locations 1–18?              | Thomas | Resolved | See Location table in §5.1 |

---

<!--
  CHECKLIST — Complete before moving to the Plan phase
  ====================================================
  - [x] Problem statement is clear and concise
  - [x] All user stories have acceptance scenarios
  - [x] Each functional requirement traces to a user story
  - [x] Domain model covers all entities mentioned in the requirements
  - [x] Domain rules and invariants are listed
  - [x] Edge cases cover failure modes, not just happy paths
  - [x] Non-functional requirements are specific and measurable
  - [x] Arc42 references point to the right sections
  - [x] No more than 3 [NEEDS CLARIFICATION] markers remain
  - [x] Open questions are assigned and have a resolution path — OQ-1 resolved: all 18 location names are in §5.1
-->
