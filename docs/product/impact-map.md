# Monster-deck Impact Map

> Digital opponent for The Witcher Old World board game.
> Created: 2026-06-01 · Last updated: 2026-06-16 · Trail Mode (FEAT-020) complete.

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
| I4 | Campaign board position always visible -- no manual tracking of Legendary monster movement | Player can always see the Legendary monster's current board location in the app; does not need to write it down or remember it |

---

## 4. Epics, Features & Deliverables

Each feature traces back to a persona need, an impact, and the project goal.

### Epic 1: Monster Selection

Enables the player to pick which monster to fight.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F1.1 Random monster selection | App presents a random monster (or choice from a small random set) for the player to fight | I1 | Eliminates the need to dig through a box of monster cards | ✅ Shipped |
| F1.2 Monster level selection | Player picks the monster level (L1, L2, L3). Determines deck size: L1 = 8-12, L2 = 12-16, L3 = 16-20 cards | I1 | Different levels require different deck sizes; the app handles the count | ✅ Shipped |

> **Legendary monsters (L4, campaign mode with movement, boss fight, trophy/token mechanics):** FEAT-030 / FEAT-009 — planned for 4.0.

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

### Epic 6: Monster Trail Expansion ✅ Complete

Adds the two interlocking Trail Mode mechanics: numbered special cards with dual draw/discard triggers, and a weakness token board system. Both are enabled together via a single toggle at game start.

> **Status (2026-06-16):** All engine, store, UI, and data-model sub-features complete.
> Monster-specific `discardAbility` and `trailCards` ability text is scaffolded as `TODO` in each monster file — content to be entered manually.
>
> **Retired stubs:** F6.1–F6.3, F6.5–F6.7 (FEAT-004, 005, 006, 011, 012, 013) are replaced by FEAT-020 sub-features.
> FEAT-011 and FEAT-012 are **removed** — confirmed absent from the physical Monster Trail expansion.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F6.1 Trail Mode Toggle | Single on/off toggle at game start enabling both special cards and weakness tokens together | I2, I3 | Mechanisms are balanced against each other — must be enabled as a pair | FEAT-020-A ✅ Done |
| F6.2 Special Card Data Model | 4 numbered special cards per Trail monster, each with a draw-trigger ability and a discard-trigger ability; all 29 monsters scaffolded | I2, I3 | Extends the card model to faithfully represent Trail's dual-trigger cards | FEAT-020-B ✅ Done (content TODO) |
| F6.3 Special Card Draw-Trigger Resolution | When the monster flips a special card, app fires the monster-specific draw ability | I2, I3 | Automatic resolution — player never has to remember to look up the ability | FEAT-020-C ✅ Done |
| F6.4 Special Card Discard-Trigger Resolution | When the player discards a special card as damage, app fires the card's discard ability | I2, I3 | Extension of the existing discard-trigger pattern; Trail cards have their own per-card discard abilities | FEAT-020-D ✅ Done |
| F6.5 Weakness Token Board System | App guides terrain-type token placement at game start; player claims tokens in-app when on the same location; replacement tokens are auto-drawn | I3 | Eliminates manual token tracking and placement bookkeeping | FEAT-020-E ✅ Done |
| F6.6 Weakness Effect Pre-Fight | Before each encounter, player declares which held weakness token (if any) to apply; app resolves one of four effect types | I2, I3 | Gives the player a meaningful tactical choice while the app handles the mechanical effect | FEAT-020-F ✅ Done |
| F6.7 Weakness Post-Defeat Reset | After victory, all board tokens reset and a fresh set is drawn and displayed | I3 | Keeps board token state accurate without manual tracking | FEAT-020-G ✅ Done |
| F6.8 Weakness Token Data Model | Define the token pool: terrain type, effect type, and magnitude per token | I2, I3 | Foundation required by F6.5–F6.7 | FEAT-020-H ✅ Done |
| F6.9 Monster-Specific Card Art | Unique artwork per special card face (1–4 per Trail monster) | I2 | Visual richness; could-have dependent on art asset availability | FEAT-007 🔲 Could-have |

### Epic 7: Legendary Hunt Expansion

Adds the Legendary (L4) monster tier as a multi-round campaign mode. The Legendary monster is placed on the board at game start alongside regular monsters. The campaign goal is to defeat it within the round limit (7 / 8 / 9 rounds on hard / normal / easy). Regular monster encounters continue during the campaign — trophies earned there determine the Legendary monster's boss fight deck size. Before the final boss fight, a one-time trophy input and destruction token count collapse into a single fight deck size and initiative ruling.

| Feature | Description | Impact | Rationale | Roadmap |
|---------|-------------|--------|-----------|---------|
| F7.1 Campaign setup | Difficulty selection (easy/normal/hard → 9/8/7 round limit); Legendary monster selection; campaign state initialised (round counter, board position, token count) | I1, I4 | Entry point for the entire Legendary Hunt campaign. Without this, none of the other features are reachable | FEAT-030-A |
| F7.2 Round & stage driver | Tracks current round against the round limit; drives player through the ordered stages of each round (same structural pattern as Wild Hunt); triggers boss fight preparation on the final round | I2, I4 | The campaign scaffold — ensures the player always knows which round they're in and when the hunt ends. Round limit enforces the win/loss condition | FEAT-030-B |
| F7.3 Movement deck engine | Separate movement deck per Legendary monster; app draws a card and displays 2 target locations; monster moves toward location 1 (and continues to location 2 if reached); app updates and persistently displays current board position. Deck reshuffles when exhausted | I2, I3, I4 | Core Legendary mechanic. Replaces manual card drawing and board tracking. App must own the board position so destruction token logic and boss fight prep are accurate | FEAT-030-C |
| F7.4 Destruction token tracker | Tap-based counter in app; player taps to claim tokens when ending their movement phase (Phase 1); token count is carried into boss fight preparation and is not reset between rounds; resets only when boss fight begins | I2, I3 | Replaces physical token counting. Token count feeds directly into fight deck size reduction and initiative — accuracy is mandatory | FEAT-030-D |
| F7.5 Boss fight preparation screen | One-time trophy input before the boss fight begins; app calculates final fight deck size using the formula: `base deck size − trophy protection reduction − destruction token count = actual fight deck size`; displays initiative ruling (player goes first if token count > 0, otherwise normal initiative) | I1, I2, I3 | Distills all campaign decisions into a single, explicit pre-fight summary. Eliminates manual arithmetic and ensures the trophy/token interaction is never applied incorrectly | FEAT-030-E |
| F7.6 Legendary fight deck engine | Each Legendary monster has its own fight deck of stronger special attack cards (4 special attacks per monster, following Monster Trail card pattern); deck size reduction from FEAT-030-E is applied before the fight starts; fight uses the existing encounter engine for card flip, damage, and discard. Reaching deck size 0 = monster defeated | I2, I3 | The Legendary boss fight uses a distinct, stronger card set that cannot be mapped to the generic or Trail decks. Requires its own deck composition layer on top of the existing encounter engine | FEAT-030-F |
| F7.7 Legendary monster data | Static data for all 7 Legendary monsters: movement deck cards (2 target locations per card), fight deck cards (4 special attacks per monster with ability text and values), base deck sizes, trophy protection table, abilities, and art assets | I2, I3 | Content required to make the engine useful. Without real card data, the campaign is unplayable | FEAT-009 |

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
| 2 | Generic card data + Charge/Bite display | FEAT-002 | ✅ Done |
| 3 | Monster art on attack cards | FEAT-003 | ✅ Done |
| 4 | Swipe animations | — | ✅ Shipped |
| 5 | Card turning animations | — | ✅ Shipped |

### 2.0 — Wild Hunt Expansion *(Complete)*

| # | Feature | FEAT | Status |
|---|---------|------|--------|
| 1 | Campaign State Engine | FEAT-010-A | ✅ Done |
| 2 | Round Stage Driver | FEAT-010-B | ✅ Done |
| 3 | Wild Hunt Character Selection | FEAT-010-C | ✅ Done |
| 4 | Wild Hunt Location Tracking | FEAT-010-D | ✅ Done |
| 5 | Wild Hunt Encounter (Boss Fight) | FEAT-010-E | ✅ Done |
| 6 | Shield Counter | FEAT-010-F | ✅ Done |
| 7 | Monster Spawn System | FEAT-010-G | ✅ Done |
| 8 | Hound Enemy Type | FEAT-010-H | ✅ Done |
| 9 | Story Card Reminder | FEAT-010-I | ✅ Done |
| 10 | Wild Hunt Character Data | FEAT-010-J | ✅ Done |
| 11 | Monster Proximity Card Bonus | FEAT-010-K | ✅ Done |
| 12 | Defeat Screen | FEAT-010-L | 🔲 Todo |

### 3.0 — Monster Trail Expansion *(Complete)*

| # | Feature | FEAT | Status |
|---|---------|------|--------|
| 1 | Trail Mode Toggle | FEAT-020-A | ✅ Done |
| 2 | Special Card Data Model | FEAT-020-B | ✅ Done (content TODO) |
| 3 | Special Card Draw-Trigger Resolution | FEAT-020-C | ✅ Done |
| 4 | Special Card Discard-Trigger Resolution | FEAT-020-D | ✅ Done |
| 5 | Weakness Token Board System | FEAT-020-E | ✅ Done |
| 6 | Weakness Effect Pre-Fight | FEAT-020-F | ✅ Done |
| 7 | Weakness Post-Defeat Reset | FEAT-020-G | ✅ Done |
| 8 | Weakness Token Data Model | FEAT-020-H | ✅ Done |
| 9 | Monster-Specific Card Art | FEAT-007 | 🔲 Could-have |

### 4.0 — Legendary Hunt Expansion

| # | Feature | FEAT | Status |
|---|---------|------|--------|
| 1 | Campaign setup | FEAT-030-A | 🔲 Todo |
| 2 | Round & stage driver | FEAT-030-B | 🔲 Todo |
| 3 | Movement deck engine | FEAT-030-C | 🔲 Todo |
| 4 | Destruction token tracker | FEAT-030-D | 🔲 Todo |
| 5 | Boss fight preparation screen | FEAT-030-E | 🔲 Todo |
| 6 | Legendary fight deck engine | FEAT-030-F | 🔲 Todo |
| 7 | Legendary monster data (7 monsters) | FEAT-009 | 🔲 Todo |

### Beyond 4.0 — Future possibilities

| Feature | Why parked |
|---------|-----------|
| Multiplayer group support | Different persona entirely. Solo play comes first. |

---

## 6. Key Scope Decisions

| Decision | Rationale |
|----------|-----------|
| Top/bottom card halves display in scope for 1.0 (FEAT-002) | Originally resolved internally via RNG with no UI. Revised: the app still picks the half, but now shows the player which half (Charge / Bite) was resolved. Adds clarity without giving the player a choice. |
| Expansion abilities are IN MVP | Thomas always plays with the expansion. These are not optional for his use case. |
| Multiplayer is BEYOND 4.0 | Solo player is the only persona for MVP and 1.0. |
| Legendary Hunt is a full campaign mode, not just a monster tier (FEAT-030/009, v4.0) | Movement deck, destruction token tracking, trophy input, boss fight prep — this is equivalent complexity to Wild Hunt. Deserves its own major version. Deferred until Monster Trail expansion is complete. |
| Legendary fight deck size is variable, not fixed | Formula: `base deck size − trophy protection reduction − destruction token count`. Trophies and tokens are the player's agency mechanism in the campaign. |
| Movement deck reshuffles when exhausted | Confirmed with rulebook. FEAT-030-C reshuffles the movement deck when the last card is drawn. |
| Deck-empty = monster defeated | Confirmed with rulebook. FEAT-030-F follows existing encounter logic: deck reaching 0 ends the fight as a victory. |
| Card variety requires a real data model | Every card has different attacks/abilities. A simple random-number approach would not be faithful to the game. |
| Monster Trail is a separate 3.0 release | Trail extends the data model and card engine — not just content. Warrants its own release to keep 1.0 scope clean. |
| Wild Hunt (FEAT-010) is complete as of 2.0 | All A–L sub-features implemented. FEAT-010-L (Defeat Screen) was the final item. |
| Monster Trail shipped as release 3.0 (not 1.1) | Wild Hunt expansion (2.0) was completed first; Trail is now the third major release. |
| Monster Trail uses a single FEAT-020 with sub-features (not separate FEATs) | Early stubs (FEAT-004 through FEAT-013) were speculative. After full interviews, the mechanics resolved into two interlocking systems (special cards + weakness tokens) that are best scoped together. |
| FEAT-011 (New Attack Types) removed | Confirmed absent from the physical Trail expansion. No typed attacks exist. Speculative stub — cut entirely. |
| FEAT-012 (New Card Types) removed | Confirmed absent from the physical Trail expansion. Trail uses standard attack cards only. Speculative stub — cut entirely. |
| Trail Mode is an all-or-nothing toggle | Special cards (harder for the player) and weakness tokens (easier for the player) are mechanically balanced against each other. Enabling one without the other breaks game balance. |
| Trail monster ability content (discardAbility + trailCards text) is TODO | Engine and UI are fully wired. Ability text must be transcribed per monster from the physical expansion; scaffolded as `TODO` in each monster file. |
