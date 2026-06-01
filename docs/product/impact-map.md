# Monster-deck Impact Map

> Digital opponent for The Witcher Old World board game.
> Created: 2026-06-01

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

| Feature | Description | Impact | Rationale |
|---------|-------------|--------|-----------|
| F1.1 Random monster selection | App presents a random monster (or choice from a small random set) for the player to fight | I1 | Eliminates the need to dig through a box of monster cards |
| F1.2 Monster level selection | Player picks the monster level (L1, L2, L3). Determines deck size: L1 = 8-12, L2 = 12-16, L3 = 16-20 cards | I1 | Different levels require different deck sizes; the app handles the count |

> **Legendary monsters (L4, 20+ stronger cards, can move):** Beyond 1.0. Parked.

### Epic 2: Card Data Model

The foundation that makes varied encounters possible. Every card has unique content.

| Feature | Description | Impact | Rationale |
|---------|-------------|--------|-----------|
| F2.1 Card definitions | A data model where each card is individually defined with its own attack value, effect, and/or ability text | I2, I3 | Cards in the physical game all have DIFFERENT attacks and abilities. The app must represent this variety, not just generate random numbers |
| F2.2 Deck generation | Given a monster and level, generate a shuffled deck of the correct size by selecting from the card pool | I1 | Replaces the manual process of counting out and shuffling physical cards |

> **Design note -- top/bottom halves:** In the physical game, each card has a top and bottom half the player can choose from. This is OUT OF SCOPE. Since the app IS the opponent, it resolves the top/bottom choice internally (random or rule-based). No UI is needed for this. This is a deliberate scope reduction.

### Epic 3: Monster Abilities

Abilities are applied per monster and affect the entire encounter.

| Feature | Description | Impact | Rationale |
|---------|-------------|--------|-----------|
| F3.1 Base ability | Each monster has a base ability applied at the start of the encounter | I3 | Core game mechanic. Without this, encounters are incomplete |
| F3.2 Secondary ability (expansion) | Expansion monsters have a second ability active during the encounter | I3 | Thomas always plays with the expansion. This is MVP, not optional |
| F3.3 Discard-trigger ability (expansion) | Some abilities trigger when cards are discarded | I2, I3 | Easy to forget in the physical game. The app handles it automatically |

### Epic 4: Encounter Flow

The core turn-by-turn gameplay loop.

| Feature | Description | Impact | Rationale |
|---------|-------------|--------|-----------|
| F4.1 Initiative check | At the start of each round, determine who acts first | I2 | Core game mechanic |
| F4.2 Monster attacks (card flip) | Tap to flip the top card of the monster's deck, revealing the attack/effect | I2 | The core interaction. Replaces physically flipping a card |
| F4.3 Player attacks (damage/discard) | Player declares X damage; app discards X cards from the monster's deck | I1, I2 | Replaces manually counting and discarding cards |
| F4.4 Deck tracking | App shows remaining deck size. Encounter ends when deck is empty | I2, I3 | No more miscounting. Player always knows how close the monster is to defeat |
| F4.5 Ability display | Monster ability is persistently visible on screen during the encounter | I3 | Solves the "forgot the ability" problem directly |

---

## 5. Roadmap

### MVP -- The minimum to replace the physical deck

The product fails without every feature listed here. Each one was challenged and defended.

| Feature | Why it cannot be cut |
|---------|---------------------|
| F1.1 Random monster selection | Without this, the player can't pick a monster. There is no encounter. |
| F1.2 Monster level selection | Deck size varies by level. Without this, the deck is wrong. |
| F2.1 Card definitions | Cards have varied content. Without individual definitions, encounters are generic and inaccurate to the game. |
| F2.2 Deck generation | This IS the core value proposition -- no more shuffling. |
| F3.1 Base ability | Every monster has one. Skipping it makes encounters incomplete. |
| F3.2 Secondary ability (expansion) | Thomas always plays with expansion. Non-negotiable for his use case. |
| F3.3 Discard-trigger ability (expansion) | These trigger automatically. Forgetting them is a key pain point the app solves. |
| F4.1 Initiative check | Core game mechanic. Cannot skip. |
| F4.2 Monster attacks (card flip) | The primary interaction of the encounter. |
| F4.3 Player attacks (damage/discard) | Without this, the player cannot damage the monster. |
| F4.4 Deck tracking | Without this, the player doesn't know when the encounter ends. |
| F4.5 Ability display | Solves the "forgot the ability" problem. Central to Impact I3. |

### 1.0 Polish -- Makes it feel good (priority order)

| # | Feature | Why deferred |
|---|---------|-------------|
| 1 | Monster art on attack cards | Visual polish. Encounter works without it. Highest user priority for 1.0. |
| 2 | Swipe animations | Feel, not function. |
| 3 | Card turning animations | Feel, not function. |
| 4 | Monster placement logic | Convenience feature for board positioning. |

### Beyond 1.0 -- Future possibilities

| Feature | Why parked |
|---------|-----------|
| New card types | Expands content, not core mechanics. |
| New attack types | Same. |
| Special attacks | Same. |
| Legendary monsters (L4, can move) | Adds a new monster tier with movement mechanics. Significant complexity. |
| Multiplayer group support | Different persona entirely. Solo play comes first. |

---

## 6. Key Scope Decisions

| Decision | Rationale |
|----------|-----------|
| Top/bottom card halves are OUT OF SCOPE | The app is the opponent -- it resolves the choice internally. No UI needed. Significant scope reduction. |
| Expansion abilities are IN MVP | Thomas always plays with the expansion. These are not optional for his use case. |
| Multiplayer is BEYOND 1.0 | Solo player is the only persona for MVP and 1.0. |
| Legendary monsters are BEYOND 1.0 | Movement mechanics add significant complexity for a tier that isn't the common case. |
| Card variety requires a real data model | Every card has different attacks/abilities. A simple random-number approach would not be faithful to the game. |
