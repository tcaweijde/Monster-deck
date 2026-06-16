import { useState } from 'react';
import { useWildHuntStore } from '../../store/wildHuntStore';
import { useEncounterStore } from '../../store/encounterStore';
import { MONSTERS } from '../../data/monsters';

const BASE = import.meta.env.BASE_URL ?? '/';
const BG = `${BASE}images/monsters/wild-hunt/background.jpg`;

export function ProximitySetupScreen() {
  const wildHuntSlots = useWildHuntStore((s) => s.wildHuntSlots);
  const activeWildHuntSlotIndex = useWildHuntStore((s) => s.activeWildHuntSlotIndex);
  const clearActiveWildHuntSlot = useWildHuntStore((s) => s.clearActiveWildHuntSlot);
  const setShowProximitySetup = useWildHuntStore((s) => s.setShowProximitySetup);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  const [wildHuntNearby, setWildHuntNearby] = useState(false);
  const [houndCount, setHoundCount] = useState(0);
  const [hasMonsterTrail, setHasMonsterTrail] = useState(false);

  const slot = activeWildHuntSlotIndex !== null ? wildHuntSlots[activeWildHuntSlotIndex] : null;
  const monster = slot?.monsterId ? MONSTERS.find((m) => m.id === slot.monsterId) : null;

  const MAX_DECK_SIZE = 20;
  const bonusCount = Math.min(
    (wildHuntNearby ? 1 : 0) + houndCount,
    MAX_DECK_SIZE - (monster?.deckSize ?? 0),
  );

  function handleStart() {
    if (!slot?.monsterId) return;
    setShowProximitySetup(false);
    startEncounter(slot.monsterId, hasMonsterTrail, bonusCount);
  }

  function handleBack() {
    clearActiveWildHuntSlot();
    setShowProximitySetup(false);
  }

  if (!slot || !monster) return null;

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }} />
      <div className="absolute inset-0 bg-stone-950/80" />

      <div className="relative h-full flex flex-col p-6 gap-6 max-w-lg mx-auto overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-cyan-400">{monster.name}</h1>
            <p className="text-xs text-stone-400">Lv.{slot.level} — Pre-fight setup</p>
          </div>
          <button
            onClick={handleBack}
            className="text-sm text-stone-400 hover:text-cyan-400 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Explanation */}
        <div className="rounded-lg bg-stone-900/80 border border-stone-700 p-4 text-sm text-stone-300 space-y-1">
          <p className="text-xs text-cyan-400 uppercase tracking-wide font-semibold mb-2">
            Proximity Bonus
          </p>
          <p>Nearby Wild Hunt and hound units add extra cards to the monster's deck.</p>
          <p className="text-stone-400 text-xs">
            +1 card if the Wild Hunt is on or adjacent · +1 card per adjacent hound
          </p>
        </div>

        {/* Wild Hunt proximity toggle */}
        <div className="rounded-lg bg-stone-900/80 border border-stone-700 p-4">
          <p className="text-sm text-stone-300 mb-3">
            Is the Wild Hunt on this location or 1 step away?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setWildHuntNearby(false)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors border ${
                !wildHuntNearby
                  ? 'bg-blue-700 border-cyan-500 text-white'
                  : 'bg-stone-700/80 border-stone-600 text-stone-300 hover:border-stone-500'
              }`}
            >
              No
            </button>
            <button
              onClick={() => setWildHuntNearby(true)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors border ${
                wildHuntNearby
                  ? 'bg-blue-700 border-cyan-500 text-white'
                  : 'bg-stone-700/80 border-stone-600 text-stone-300 hover:border-stone-500'
              }`}
            >
              Yes (+1 card)
            </button>
          </div>
        </div>

        {/* Hound stepper */}
        <div className="rounded-lg bg-stone-900/80 border border-stone-700 p-4">
          <p className="text-sm text-stone-300 mb-3">
            How many hounds are on this location or adjacent?
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setHoundCount((n) => Math.max(0, n - 1))}
              disabled={houndCount === 0}
              className="w-12 h-12 rounded-lg bg-stone-700 hover:bg-stone-600 disabled:opacity-30 text-white text-2xl font-bold transition-colors"
            >
              −
            </button>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{houndCount}</p>
              {houndCount > 0 && (
                <p className="text-xs text-cyan-400">+{houndCount} card{houndCount !== 1 ? 's' : ''}</p>
              )}
            </div>
            <button
              onClick={() => setHoundCount((n) => n + 1)}
              className="w-12 h-12 rounded-lg bg-stone-700 hover:bg-stone-600 text-white text-2xl font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Monster trail toggle */}
        <div className="rounded-lg bg-stone-900/80 border border-stone-700 p-4">
          <p className="text-sm text-stone-300 mb-1">Do you have the Monster Trail?</p>
          <p className="text-xs text-stone-500 mb-3">You go first this encounter.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setHasMonsterTrail(false)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors border ${
                !hasMonsterTrail
                  ? 'bg-blue-700 border-cyan-500 text-white'
                  : 'bg-stone-700/80 border-stone-600 text-stone-300 hover:border-stone-500'
              }`}
            >
              No
            </button>
            <button
              onClick={() => setHasMonsterTrail(true)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors border ${
                hasMonsterTrail
                  ? 'bg-blue-700 border-cyan-500 text-white'
                  : 'bg-stone-700/80 border-stone-600 text-stone-300 hover:border-stone-500'
              }`}
            >
              Yes (you go first)
            </button>
          </div>
        </div>

        <div className="flex-1" />

        {/* Bonus summary + start button */}
        <div className="space-y-3">
          <div className={`rounded-lg p-3 text-center border transition-colors ${
            bonusCount > 0
              ? 'bg-blue-950/40 border-blue-700/50'
              : 'bg-stone-900/80 border-stone-700'
          }`}>
            {bonusCount > 0 ? (
              <p className="text-cyan-300 font-semibold">
                +{bonusCount} bonus card{bonusCount !== 1 ? 's' : ''} added to deck
                <span className="text-cyan-500 text-xs block mt-0.5">
                  {monster.deckSize} base + {bonusCount} = {monster.deckSize + bonusCount} cards total
                  {monster.deckSize + bonusCount === MAX_DECK_SIZE && ' (max)'}
                </span>
              </p>
            ) : (
              <p className="text-stone-500 text-sm">No proximity bonus — standard deck</p>
            )}
          </div>
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-lg transition-colors"
          >
            Start Encounter
          </button>
        </div>
      </div>
    </div>
  );
}
