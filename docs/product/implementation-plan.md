# Implementation Plan: Monster Deck

**Spec:** [`docs/product/impact-map.md`](./impact-map.md)
**Created:** 2026-06-01
**Status:** MVP implemented, playtesting phase
**Scope:** MVP encounter manager + 1.0 polish + future expansions

---

## Summary

Client-side-only web app (React + TypeScript + Vite + Tailwind + Zustand) that replaces the physical monster card deck for solo play of The Witcher Old World. All game data is static TypeScript — no backend, no database. The app is a single-page encounter manager: pick a monster, optionally claim the trail token, and the app handles deck generation, alternating turns (card flip / player damage), ability display, and victory detection.

---

## Current State

### What's built (MVP)

All core encounter mechanics are implemented and tested (111 tests passing).

| Layer | Files | Status |
|-------|-------|--------|
| Types | `src/types/index.ts` | Done |
| Monster data | `src/data/monsters/` (griffin, werewolf, foglet + registry) | Done — placeholder values |
| Game engine | `src/engine/` (shuffle, deck, combat, abilities) | Done |
| State store | `src/store/encounterStore.ts` | Done |
| Setup UI | `src/components/setup/` (MonsterPicker, SetupScreen) | Done |
| Encounter UI | `src/components/encounter/` (AbilityPanel, DeckTracker, MonsterCardDisplay, PlayerDamageInput, DiscardAlert, VictoryOverlay, EncounterScreen) | Done |
| App shell | `src/App.tsx`, `src/main.tsx`, `index.html` | Done |

### Key design decisions (implemented)

1. **Client-side only** — static site, no backend
2. **React + TypeScript + Vite** — familiar stack, fast dev loop
3. **Zustand** — single `useEncounterStore` for all encounter state
4. **Static TypeScript for data** — compile-time type checking on monster/card definitions
5. **Domain logic in pure functions** — `src/engine/` is unit-testable without React
6. **Vitest + React Testing Library** — engine gets unit tests, store gets integration tests
7. **Mobile-first with Tailwind CSS** — large tap targets, single-column on phone
8. **Top/bottom card resolution** — random 50/50 pick at flip time, no UI
9. **Fixed level and deck size per monster** — each monster has one level and one deck size
10. **Alternating turns** — monster flips a card, then player applies damage (or skips with 0)
11. **Trail token** — setup toggle lets the player start first
12. **No routing library** — phase state variable switches between setup and encounter screens

### What changed from the original plan

| Original | Current | Why |
|----------|---------|-----|
| Level selection (L1/L2/L3) per monster | Fixed level + deck size per monster | Level is a property of the monster, not a player choice |
| Round-based with initiative rolls | Alternating monster/player turns | The board game is back-and-forth, not discrete rounds |
| Minimum 1 damage | 0 damage allowed (skip) | Player may not deal damage on a turn |
| Victory only on player damage | Victory also on last-card flip | If monster flips the last card, it's defeated |
| Trail token not in scope | Trail token toggle on setup screen | Player can start first if they have the trail token |

---

## What's Next

### Phase 1: Playtesting & Bug Fixes 

Playtest the app in a browser and fix issues that come up.

**Steps:**
- Run `npm run dev` from WSL and play through full encounters with each monster
- Verify: monster selection, trail token toggle, card flip, damage application, 0-damage skip, discard ability alerts, victory on last flip, victory on player damage, quit and restart
- Fix any UX or logic bugs found during playtesting
- Verify mobile layout works on phone/tablet screen sizes (browser dev tools)

### Phase 2: Real Monster Data (current)

The current card values and ability text are approximations. Replace with real data from the physical game.

**Steps:**
- Cross-reference each monster file with the physical cards
- Update attack values, effects, and ability descriptions in `src/data/monsters/griffin.ts`, `werewolf.ts`, `foglet.ts`
- Verify deck sizes match the physical game
- Add any missing card effects or ability nuances

**Files:** `src/data/monsters/*.ts`

### Phase 3: Add More Monsters

Each monster is a single `.ts` file. No code changes needed — just data.

**Steps:**
- For each new monster:
  1. Create `src/data/monsters/<monster-name>.ts` with level, deckSize, abilities, and cardPool
  2. Import and add to the `MONSTERS` array in `src/data/monsters/index.ts`
- Prioritize monsters Thomas plays with most often
- Validate card pool size >= deck size for each monster

**Files:** `src/data/monsters/<new>.ts`, `src/data/monsters/index.ts`

### Phase 4: Monster Art on Attack Cards (1.0 polish — highest priority)

Add artwork to the revealed card display. This is the #1 user priority for 1.0.

**Steps:**
- Decide on art source: original illustrations, AI-generated, or sourced from the board game community
- Add image assets to `public/monsters/` (e.g., `griffin.webp`)
- Add `artworkUrl` field to the `Monster` type
- Display artwork in `MonsterCardDisplay.tsx` behind/above the attack value when a card is revealed
- Optimize images for mobile (compressed, appropriately sized)

**Files:** `src/types/index.ts`, `src/data/monsters/*.ts`, `src/components/encounter/MonsterCardDisplay.tsx`, `public/monsters/`

### Phase 5: Card & Swipe Animations (1.0 polish)

Make the encounter feel physical — card flips and swipe interactions.

**Steps:**
- Add a card-flip CSS animation when "Tap to Flip Card" is pressed (rotate/fade transition)
- Add a slide-out animation when cards are discarded via player damage
- Consider a swipe gesture (left/right) as an alternative to the flip button on mobile
- Keep animations short (200-300ms) so they don't slow down gameplay
- Use CSS transitions or a lightweight library (e.g., framer-motion) — evaluate bundle size impact

**Files:** `src/components/encounter/MonsterCardDisplay.tsx`, `src/components/encounter/EncounterScreen.tsx`, potentially `src/index.css`

### Phase 6: Monster Placement Logic (1.0 polish)

Help the player position the monster on the board.

**Steps:**
- Define placement rules per monster (or per monster type) as data
- Add a placement hint to the setup screen or encounter screen header
- This is a convenience feature — keep it simple (text-based, not graphical)

**Files:** `src/types/index.ts` (add placement field), `src/data/monsters/*.ts`, new UI component or addition to `SetupScreen.tsx`

### Phase 7: Deployment

Ship the app so it's accessible on a phone at the table without running a dev server.

**Steps:**
- Choose hosting: GitHub Pages (free, simple), Vercel, or Netlify
- Configure `vite.config.ts` with the correct `base` path if using GitHub Pages
- Add a build + deploy script or GitHub Action
- Test on actual mobile device

**Files:** `vite.config.ts`, potentially `.github/workflows/deploy.yml`

---

## Beyond 1.0 (Parked)

These are not planned for implementation. Listed for reference.

| Feature | Complexity | Notes |
|---------|-----------|-------|
| Legendary monsters (L4, can move) | High | New movement mechanics, larger deck sizes, stronger cards. Needs a new engine module for movement. |
| New card types | Medium | Extends the `CardHalf` type with new effect categories. |
| New attack types | Medium | Similar to above. |
| Special attacks | Medium | Monster-specific card effects beyond the current attack + effect model. |
| Multiplayer group support | High | Different persona entirely. Shared state, device passing, or network sync. |
| Persistence (save/resume) | Low | Add Zustand `persist` middleware with `localStorage`. One-line store change. |

---

## Architecture Overview

```
src/
  types/index.ts            — Domain types (Monster, MonsterCard, CardHalf, etc.)
  data/monsters/            — Static monster definitions (one file per monster)
  engine/                   — Pure game logic (shuffle, deck gen, combat, abilities)
  store/encounterStore.ts   — Zustand store bridging engine and UI
  components/
    setup/                  — Monster selection + trail token + start button
    encounter/              — Card display, damage input, abilities, deck tracker, victory
  App.tsx                   — Phase-based screen switching
  main.tsx                  — React entry point
```

**Data flow:** User action → Store action → Engine function → State update → React re-render

**Adding a monster:** Create `src/data/monsters/<name>.ts` → register in `index.ts`. No code changes.

---

## Testing Strategy

| Layer | Approach | Coverage |
|-------|----------|----------|
| Engine (`src/engine/`) | Unit tests with injectable RNG for determinism | All functions |
| Store (`src/store/`) | Integration tests with mocked engine | Full lifecycle, turn flow, edge cases |
| Components | Not yet — manual playtesting for MVP | Planned for 1.0 if needed |
| E2E | Not planned for MVP or 1.0 | Single-page app, manual testing suffices |

**Test count:** 111 passing (5 test files)

**Run tests:** `npm run test:run`
