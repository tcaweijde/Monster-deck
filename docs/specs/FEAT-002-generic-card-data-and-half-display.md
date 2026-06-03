# Feature Specification: Generic Card Data + Charge/Bite Display

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

| Field           | Value                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Feature ID      | FEAT-002                                                                       |
| Status          | Implemented                                                                    |
| Author          | Thomas                                                                         |
| Created         | 2026-06-03                                                                     |
| Last updated    | 2026-06-03                                                                     |
| Epic / Parent   | 1.0 — Full Base Game (impact-map.md §5)                                        |
| Arc42 reference | §5 Building Block View, §8 Crosscutting Concepts                               |

### 1.1 Problem Statement

The app's monster cards currently show placeholder attack values and no effect text,
making encounters inaccurate to the physical game. Additionally, when a card is
flipped the player can't see which half ("Charge" or "Bite") was resolved — they
only see a number — which breaks the connection to the physical card experience.

### 1.2 Goal

All generic monster attack cards carry real attack values, effect text, and half
names from the physical game. When a card is flipped, the UI displays the resolved
half's name alongside its attack value and effect, so the player can trace the
result back to the physical card. All base-game monsters share one generic card
pool definition — no duplicated data.

### 1.3 Non-Goals

- Monster-specific cards (Monster Trail expansion — FEAT-004)
- Per-card artwork (monster artwork is FEAT-003; per-card art is FEAT-007)
- Letting the player choose which half to play — the app still resolves this via RNG
- Changing the flip, discard, or deck-generation mechanic in any way
- Single-half card support for Monster Trail (tracked as a forward constraint below;
  the type change in this feature must not make two halves mandatory for all time)

---

## 2. User Stories

### US-001: Accurate card values

**As a** solo player,
**I want** the monster's attack cards to show real values from the physical game,
**so that** the app's encounters are faithful to the board game rules.

### US-002: Half name on flip

**As a** solo player,
**I want** to see which half of the card was resolved ("Charge" or "Bite") when a
card is flipped,
**so that** I can cross-reference the result with the physical card and understand
what action the monster is taking.

---

## 3. Functional Requirements

| ID     | Requirement                                                                                          | Priority | User Story |
| ------ | ---------------------------------------------------------------------------------------------------- | -------- | ---------- |
| FR-001 | The system shall store a `name` on each `CardHalf` ("Charge" for top, "Bite" for bottom)             | Must     | US-002     |
| FR-002 | The system shall populate real attack values and effect text for all cards in the shared generic pool | Must     | US-001     |
| FR-003 | The system shall display the resolved half's name on the flipped card in the encounter UI            | Must     | US-002     |
| FR-004 | The system shall display the resolved half's effect text when an effect is present                   | Must     | US-001     |
| FR-005 | The system shall expose one shared generic card pool used by all base-game monsters                  | Should   | US-001     |
| FR-006 | The `CardHalf` type change must not break future support for single-half Monster Trail cards         | Should   | —          |

---

## 4. Acceptance Scenarios

### SC-001: Half name shown on flip (FR-003)

```gherkin
Given a monster encounter is in progress
  And it is the monster's turn
When the player taps to flip the top card
Then the revealed card displays either "Charge" or "Bite"
  And the attack value for that half is shown
```

### SC-002: "Charge" shown for top half (FR-001, FR-003)

```gherkin
Given the RNG resolves to the top half of a card
When the card is displayed
Then the label "Charge" is shown
```

### SC-003: "Bite" shown for bottom half (FR-001, FR-003)

```gherkin
Given the RNG resolves to the bottom half of a card
When the card is displayed
Then the label "Bite" is shown
```

### SC-004: Effect text shown when present (FR-004)

```gherkin
Given a card is flipped and the resolved half has an effect (e.g. "Shield 1")
When the card is displayed
Then the effect text is shown alongside the attack value
```

### SC-005: No effect text shown when absent (FR-004)

```gherkin
Given a card is flipped and the resolved half has no effect
When the card is displayed
Then no effect text or empty placeholder is rendered
```

### SC-006: Shared pool used by all base-game monsters (FR-005)

```gherkin
Given any base-game monster is selected
When its deck is generated
Then the cards are drawn from the single shared generic card pool
  And no monster file defines its own duplicate card definitions
```

---

## 5. Domain Model

### 5.1 Entities

#### CardHalf *(updated)*

| Attribute | Type    | Constraints           | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| name      | string  | required, max 40 chars | Display name: always "Charge" (top) or "Bite" (bottom) for generic cards |
| attack    | integer | optional, ≥ 0         | Attack value from the physical card; absent when the half is effect-only |
| effect    | string  | optional              | Ability text; at least one of `attack` or `effect` must be present      |

> **Forward constraint:** Monster Trail (FEAT-004) introduces cards with only one
> half. The `name` field should be added to `CardHalf` but the `top`/`bottom`
> structure on `MonsterCard` should remain optional-friendly so that a future
> `MonsterCard` variant can omit one half without breaking the base type.

#### MonsterCard *(unchanged shape)*

| Attribute | Type     | Constraints      | Description              |
| --------- | -------- | ---------------- | ------------------------ |
| id        | string   | required, unique | e.g. `generic-01`        |
| top       | CardHalf | required         | The top half of the card |
| bottom    | CardHalf | required         | The bottom half of the card |

### 5.2 Relationships

- All base-game **Monsters** reference the same shared **generic card pool** via their `cardPool` field
- A **RevealedCard** carries the resolved `CardHalf` (including `name`) via `chosenHalf` — no structural change needed

### 5.3 Domain Rules and Invariants

- **Real values required**: Every card in the generic pool must have attack values and/or effect text transcribed from the physical game; no placeholder values permitted
- **Half names are fixed for generic cards**: Top half is always "Charge"; bottom half is always "Bite"
- **Half name required**: `CardHalf.name` must not be empty
- **Each half must have content**: At least one of `attack` or `effect` must be present on every half
- **Pool size invariant**: The generic pool must contain enough unique cards to satisfy the largest base-game deck size (L3 = up to 20 cards)
- **Shared pool, not copied**: Each monster's `cardPool` references the shared pool (or a filtered subset), not a duplicate definition

---

## 6. Non-Functional Requirements

| ID      | Category    | Requirement                                                                            |
| ------- | ----------- | -------------------------------------------------------------------------------------- |
| NFR-001 | Performance | Card data is static and bundled; card display must render instantaneously on flip      |
| NFR-002 | Correctness | Attack values and effect text are transcribed from the physical game; deviation is a bug. **Satisfied: all 20 cards verified against physical game cards.** |

---

## 7. Edge Cases and Error Scenarios

| ID   | Scenario                                                         | Expected Behavior                                                      |
| ---- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| EC-1 | `CardHalf.name` is missing from a card definition                | TypeScript `string` type (not optional) makes this a compile-time error |
| EC-2 | Generic pool has fewer cards than a monster's `deckSize`         | `generateDeck` already throws — no change to existing guard           |
| EC-3 | Effect text is long (e.g. multi-word ability)                    | UI wraps or truncates gracefully; no layout overflow                   |
| EC-4 | New monster added without updating its `cardPool` to shared pool | Linting / code review catches it; no runtime fallback needed           |
| EC-5 | A half has neither `attack` nor `effect`                        | Caught by the pool invariant test; TypeScript alone does not enforce this combination |

---

## 8. Success Criteria

| ID     | Criterion                                                                               |
| ------ | --------------------------------------------------------------------------------------- |
| SC-001 | All acceptance scenarios pass                                                           |
| SC-002 | `CardHalf.name` is populated for every card in the generic pool                        |
| SC-003 | Encounter UI displays "Charge" or "Bite" label on every flipped card                   |
| SC-004 | No monster data file contains `// TODO: fill in real card values` comments             |
| SC-005 | All base-game monsters share one pool definition (grep for duplicated card ID patterns returns no hits) |

---

## 9. Dependencies and Constraints

### 9.1 Dependencies

- FEAT-001 (Monster Placement) — completed; board flow stable, no impact on card data
- Physical game cards must be manually transcribed; this is a data-entry task, not
  purely an engineering task

### 9.2 Constraints

- Card values and names must match the physical game exactly — no invented values
- `CardHalf` type change is a **breaking change** to all four existing monster data
  files; all must be updated in the same PR
- The type change must be forward-compatible with single-half cards (FEAT-004)

### 9.3 Architecture References

| Arc42 Section            | Relevance to This Feature                                        |
| ------------------------ | ---------------------------------------------------------------- |
| §5 Building Block View   | `src/engine/deck.ts`, `src/data/monsters/`, `src/types/index.ts` |
| §8 Crosscutting Concepts | Static data conventions; no runtime I/O or async loading         |

---

## 10. Open Questions

No open questions — all decisions resolved during spec review.

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
  - [x] Open questions are assigned and have a resolution path
-->
