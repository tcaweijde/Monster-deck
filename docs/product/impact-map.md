# Monster-deck Impact Map

> Digital opponent for The Witcher Old World board game.
> Created: 2026-06-01 · Last updated: 2026-06-03

---

## 1. Goal

| Goal | Why | Success Criteria |
|------|-----|-----------------|
| Replace the physical monster card deck with a digital opponent | Setting up and shuffling monster cards is tedious and slows down play. A digital version removes that friction and makes encounters more engaging. | Monster encounter setup in under 10 seconds. Player never has to shuffle, count, or track cards manually. |

---

## 2. Personas

### Solo Player (MVP target)

| Attribute | Detail |
|-----------|--------|
| Who | A solo player sitting down with The Witcher Old World, using the app as the monster opponent |
| Needs | Start a monster encounter instantly; have the app handle all card flipping, damage tracking, and ability resolution |
| Problems | Preparing and shuffling monster decks is slow and error-prone; easy to forget monster abilities mid-fight; managing discard piles and deck counts breaks immersion |
| Related Goal | Replace physical deck with digital opponent |

### Multiplayer Group (parked -- Beyond 1.0)

Not in scope for MVP or 1.0. The app works for solo play. Multiplayer support (passing the device, shared state) is a future concern only.

---

## 3. Impacts

These are the behavior changes we want to cause for the Solo Player:

| # | Impact | How we will know |
|---|--------|-----------------|
| I1 | Instant encounter setup -- no shuffling, no counting cards | Setup takes under 10 seconds from "start encounter" to "ready to play" |
| I2 | Faster turn resolution -- app handles flipping, discarding, tracking deck size | Turns require only a single tap to resolve the monster's action |
| I3 | Reliable ability tracking -- monster abilities are always applied, never forgotten | Monster ability is visible on screen at all times during the encounter |

---

## 4. Epics, Features & Deliverables

Each feature traces back to a persona need, an impact, and the project goal.

### Epic 1: Monster Selection

Enables the player to pick which monster to fight.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F1.1 Random monster selection | App presents a random monster (or choice from a small random set) for the player to fight | I1 | Eliminates the need to dig through a box of monster cards | ✅ Shipped |
| F1.2 Monster level selection | Player picks the monster level (L1, L2, L3). Determines deck size: L1 = 8-12, L2 = 12-16, L3 = 16-20 cards | I1 | Different levels require different deck sizes; the app handles the count | ✅ Shipped |

> **Legendary monsters (L4, 20+ stronger cards, can move):** FEAT-008 / FEAT-009 — planned for 2.0.

### Epic 2: Card Data Model

The foundation that makes varied encounters possible. Every card has unique content.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F2.1 Card definitions | A data model where each card is individually defined with its own attack value, effect, and/or ability text | I2, I3 | Cards in the physical game all have DIFFERENT attacks and abilities. The app must represent this variety, not just generate random numbers | ✅ Shipped (model); FEAT-002 (real data) |
| F2.2 Deck generation | Given a monster and level, generate a shuffled deck of the correct size by selecting from the card pool | I1 | Replaces the manual process of counting out and shuffling physical cards | ✅ Shipped |

> **Design note -- top/bottom halves:** In the physical game, each card has a top and bottom half (Charge / Bite). Originally out of scope — the app resolved the choice internally via RNG. **Revised in FEAT-002 (1.0):** the resolved half is now displayed to the player. The app still picks the half; the player sees the result.

### Epic 3: Monster Abilities

Abilities are applied per monster and affect the entire encounter.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F3.1 Base ability | Each monster has a base ability applied at the start of the encounter | I3 | Core game mechanic. Without this, encounters are incomplete | ✅ Shipped |
| F3.2 Secondary ability (expansion) | Expansion monsters have a second ability active during the encounter | I3 | Thomas always plays with the expansion. This is MVP, not optional | ✅ Shipped |
| F3.3 Discard-trigger ability (expansion) | Some abilities trigger when cards are discarded | I2, I3 | Easy to forget in the physical game. The app handles it automatically | ✅ Shipped (generic); FEAT-006 (monster-specific, Trail) |

### Epic 4: Encounter Flow

The core turn-by-turn gameplay loop.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F4.1 Initiative check | At the start of each round, determine who acts first | I2 | Core game mechanic | ✅ Shipped |
| F4.2 Monster attacks (card flip) | Tap to flip the top card of the monster's deck, revealing the attack/effect | I2 | The core interaction. Replaces physically flipping a card | ✅ Shipped |
| F4.3 Player attacks (damage/discard) | Player declares X damage; app discards X cards from the monster's deck | I1, I2 | Replaces manually counting and discarding cards | ✅ Shipped |
| F4.4 Deck tracking | App shows remaining deck size. Encounter ends when deck is empty | I2, I3 | No more miscounting. Player always knows how close the monster is to defeat | ✅ Shipped |
| F4.5 Ability display | Monster ability is persistently visible on screen during the encounter | I3 | Solves the "forgot the ability" problem directly | ✅ Shipped |

### Epic 5: Board Management

Replaces the physical token bag and board setup entirely.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F5.1 Board setup | Randomly assign 3 monsters (one per level, one per location type) to numbered locations at game start | I1 | Eliminates token-bag draws and placement rule enforcement | FEAT-001 ✅ Done |
| F5.2 Board overview | Display all 3 active monsters with level, location type, and location name | I2 | Player always knows what's on the board without tracking it manually | FEAT-001 ✅ Done |
| F5.3 Launch encounter from board | Tap a monster on the board to start its encounter | I2 | Seamless flow from board management into combat | FEAT-001 ✅ Done |
| F5.4 Monster replacement | After a defeat, auto-spawn a replacement at the next level in the same location type | I1, I2 | Eliminates the mid-game token redraw that breaks immersion | FEAT-001 ✅ Done |
| F5.5 Board persistence | Board state survives app refresh via localStorage | I1 | Session continuity; player can close and return without losing state | FEAT-001 ✅ Done |

### Epic 6: Monster Trail Expansion

Adds monster-specific cards, weaknesses, and richer discard mechanics from the Monster Trail expansion.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F6.1 Monster-specific attack cards | Each Monster Trail monster has unique cards in addition to the shared generic pool | I2, I3 | Faithfully represents the expansion's card variety | FEAT-004 |
| F6.2 Monster weaknesses | Each monster has one or more weaknesses (e.g., silver, fire) visible during the encounter | I3 | Player needs to know which attack types are effective | FEAT-005 |
| F6.3 Monster-specific discard trigger | Abilities that fire specifically when a monster-specific card is discarded | I2, I3 | Extension of F3.3 — more precise trigger conditions for Trail monsters | FEAT-006 |
| F6.4 Monster-specific card art | Unique artwork per monster-specific card | I2 | Visual richness; could-have dependent on art availability | FEAT-007 |
| F6.5 New attack types | Cards can carry a typed attack (e.g., silver, fire, poison) that interacts with monster weaknesses | I2, I3 | Required to make weakness (F6.2) mechanically meaningful at the card level | FEAT-011 |
| F6.6 New card types | Monster Trail introduces new card archetypes beyond standard attack cards (e.g., special, event) | I2, I3 | Expands encounter variety and faithfully represents the Trail expansion's card set | FEAT-012 |
| F6.7 Special attacks | Cards with multiple ability definitions — e.g., a card that triggers differently depending on context | I2, I3 | Needed to represent Trail cards that have compound or conditional effects | FEAT-013 |

### Epic 7: Legendary Monsters

Adds the L4 monster tier with movement mechanics.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F7.1 Legendary monster engine | Level 4 tier with 20+ card decks and movement between board locations | I2 | New monster class with fundamentally different behavior | FEAT-008 |
| F7.2 Legendary monster data | Card definitions, abilities, and art for each Legendary monster | I2, I3 | Content required to make the engine useful | FEAT-009 |

### Epic 8: Wild Hunt Expansion

Adds the Wild Hunt expansion as a major new epic. Scope to be defined.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F8.1 Wild Hunt expansion | New monster types, mechanics, and board interactions from the Wild Hunt expansion | I1, I2, I3 | Significant content and mechanic expansion | FEAT-010 (needs spec) |

### Epic 9: Skellige Expansion

Extends the board with 3 new Skellige locations, a permanent lair for the boss monster Dagon, and a random encounter mechanic for off-board fights.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F9.1 Skellige locations | 3 new named locations added to the board location pool | I1 | Expands the board variety available during setup | FEAT-SKELLIGE-001 |
| F9.2 Dagon's Lair | A permanent dedicated board location that always hosts the monster Dagon; never replaced | I2, I3 | Unique boss encounter site — distinct from the normal rotating monster placement | FEAT-SKELLIGE-002 |
| F9.3 Dagon monster data | Card definitions, abilities, and art for Dagon | I2, I3 | Content required to make Dagon's Lair functional | FEAT-SKELLIGE-003 |
| F9.4 Random encounter | Player can trigger a fight against a random monster not currently on the board; one-off, no board state impact | I1, I2 | Adds an opportunistic encounter option without disrupting active board monsters | FEAT-SKELLIGE-004 |

---

## 5. Roadmap

See [`docs/product/roadmap.md`](roadmap.md) for the full versioned roadmap with FEAT IDs and status.

### MVP — The minimum to replace the physical deck ✅ Shipped

The product fails without every feature listed here. Each one was challenged and defended.

| Feature | Why it cannot be cut | Status |
|---------|---------------------|--------|
| F1.1 Random monster selection | Without this, the player can't pick a monster. There is no encounter. | ✅ Shipped |
| F1.2 Monster level selection | Deck size varies by level. Without this, the deck is wrong. | ✅ Shipped |
| F2.1 Card definitions | Cards have varied content. Without individual definitions, encounters are generic and inaccurate to the game. | ✅ Shipped |
| F2.2 Deck generation | This IS the core value proposition -- no more shuffling. | ✅ Shipped |
| F3.1 Base ability | Every monster has one. Skipping it makes encounters incomplete. | ✅ Shipped |
| F3.2 Secondary ability (expansion) | Thomas always plays with expansion. Non-negotiable for his use case. | ✅ Shipped |
| F3.3 Discard-trigger ability (expansion) | These trigger automatically. Forgetting them is a key pain point the app solves. | ✅ Shipped |
| F4.1 Initiative check | Core game mechanic. Cannot skip. | ✅ Shipped |
| F4.2 Monster attacks (card flip) | The primary interaction of the encounter. | ✅ Shipped |
| F4.3 Player attacks (damage/discard) | Without this, the player cannot damage the monster. | ✅ Shipped |
| F4.4 Deck tracking | Without this, the player doesn't know when the encounter ends. | ✅ Shipped |
| F4.5 Ability display | Solves the "forgot the ability" problem. Central to Impact I3. | ✅ Shipped |

### 1.0 — Full Base Game

| # | Feature | FEAT | Status |
|---|---------|------|--------|
| 1 | Monster placement logic | FEAT-001 | ✅ Done |
| 2 | Generic card data + Charge/Bite display | FEAT-002 | 🔲 Todo |
| 3 | Monster art on attack cards | FEAT-003 | 🔲 Todo |
| 4 | Swipe animations | — | ✅ Shipped |
| 5 | Card turning animations | — | ✅ Shipped |

### 1.1 — Monster Trail Expansion

| # | Feature | FEAT | Status |
|---|---------|------|--------|
| 1 | Monster-specific attack cards | FEAT-004 | 🔲 Todo |
| 2 | Monster weaknesses | FEAT-005 | 🔲 Todo |
| 3 | Monster-specific discard-trigger abilities | FEAT-006 | 🔲 Todo |
| 4 | Monster-specific card art | FEAT-007 | 🔲 Could-have |
| 5 | New attack types | FEAT-011 | 🔲 Todo |
| 6 | New card types | FEAT-012 | 🔲 Todo |
| 7 | Special attacks | FEAT-013 | 🔲 Todo |

### 1.2 — Skellige Expansion

| # | Feature | FEAT | Status |
|---|---------|------|--------|
| 1 | Skellige locations | FEAT-SKELLIGE-001 | 🔲 Todo |
| 2 | Dagon's Lair | FEAT-SKELLIGE-002 | 🔲 Todo |
| 3 | Dagon monster data | FEAT-SKELLIGE-003 | 🔲 Todo |
| 4 | Random encounter | FEAT-SKELLIGE-004 | 🔲 Todo |

### 2.0 — Legendary Monsters

| # | Feature | FEAT | Status |
|---|---------|------|--------|
| 1 | Legendary monster engine | FEAT-008 | 🔲 Todo |
| 2 | Legendary monster data | FEAT-009 | 🔲 Todo |

### 3.0 — Wild Hunt Expansion

| # | Feature | FEAT | Status |
|---|---------|------|--------|
| 1 | Wild Hunt expansion | FEAT-010 | 🔲 Needs spec |

### Beyond 3.0 — Future possibilities

| Feature | Why parked |
|---------|-----------|
| Multiplayer group support | Different persona entirely. Solo play comes first. |

---

## 6. Key Scope Decisions

| Decision | Rationale |
|----------|-----------|
| Top/bottom card halves display in scope for 1.0 (FEAT-002) | Originally resolved internally via RNG with no UI. Revised: the app still picks the half, but now shows the player which half (Charge / Bite) was resolved. Adds clarity without giving the player a choice. |
| Expansion abilities are IN MVP | Thomas always plays with the expansion. These are not optional for his use case. |
| Multiplayer is BEYOND 3.0 | Solo player is the only persona for MVP and 1.0. |
| Legendary monsters planned for 2.0 (FEAT-008/009) | Movement mechanics add significant complexity. Deferred until base game and Trail expansion are complete. |
| Card variety requires a real data model | Every card has different attacks/abilities. A simple random-number approach would not be faithful to the game. |
| Monster Trail is a separate 1.1 release | Trail extends the data model and card engine — not just content. Warrants its own release to keep 1.0 scope clean. |
| Wild Hunt requires a spec before planning (FEAT-010) | Mechanics are not yet understood well enough to estimate or commit. |
