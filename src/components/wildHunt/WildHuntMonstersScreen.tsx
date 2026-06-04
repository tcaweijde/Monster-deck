import { useState } from 'react';
import { useEncounterStore } from '../../store/encounterStore';
import { useWildHuntStore } from '../../store/wildHuntStore';
import { MONSTERS } from '../../data/monsters';
import { LOCATIONS } from '../../data/locations';
import type { WildHuntBoardSlot } from '../../types/wildHunt';

interface SlotCardProps {
  slot: WildHuntBoardSlot;
  monsterName: string;
  onStartEncounter: () => void;
}
const BASE = import.meta.env.BASE_URL ?? '/';
const resolveUrl = (path: string) => `${BASE}${path.replace(/^\//, '')}`;
const FALLBACK_IMAGE = resolveUrl('/images/locations/fallback.png');


function WildHuntSlotCard({ slot, monsterName, onStartEncounter }: SlotCardProps) {
  const isEncountering = slot.status === 'encountering';
  const isEmpty = slot.status === 'empty';
  const location = LOCATIONS.find((l) => l.id === slot.locationId);
  const [imgSrc, setImgSrc] = useState(
    location?.image ? resolveUrl(location.image) : FALLBACK_IMAGE
  );

  return (
    <button
      onClick={onStartEncounter}
      disabled={isEmpty || isEncountering}
      className={`relative w-full flex-1 min-h-0 text-left rounded-xl border-2 overflow-hidden transition-colors ${
        isEmpty
          ? 'border-stone-700 bg-stone-900/40 opacity-40 cursor-default'
          : isEncountering
            ? 'border-red-700 opacity-60 cursor-default'
            : 'border-stone-700 hover:border-amber-600'
      }`}
    >
      {isEmpty ? (
        <p className="text-stone-500 text-sm italic p-4">Empty slot</p>
      ) : (
        <>
          {/* Background image */}
          <img
            src={imgSrc}
            alt={location?.name ?? ''}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-between h-full p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-lg drop-shadow">{monsterName}</span>
              <span className="text-sm font-semibold text-amber-400 drop-shadow">Lv.{slot.level}</span>
            </div>
            <div className="flex items-center justify-end">
              {isEncountering && (
                <span className="text-xs text-red-400 font-semibold drop-shadow">In combat</span>
              )}
            </div>
          </div>
        </>
      )}
    </button>
  );
}

/**
 * Monster board sub-screen within the Wild Hunt game mode.
 * Shows the 3 fixed board slots; navigates back to the Wild Hunt board screen
 * instead of ending the game.
 */
export function WildHuntMonstersScreen() {
  const wildHuntSlots = useWildHuntStore((s) => s.wildHuntSlots);
  const setActiveWildHuntSlot = useWildHuntStore((s) => s.setActiveWildHuntSlot);
  const setShowMonsters = useWildHuntStore((s) => s.setShowMonsters);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  const getMonsterName = (id: string | null) =>
    id ? (MONSTERS.find((m) => m.id === id)?.name ?? id) : '';

  const handleSlotTap = (index: 0 | 1 | 2) => {
    const slot = wildHuntSlots[index];
    if (slot.status === 'empty' || !slot.monsterId) return;
    setActiveWildHuntSlot(index);
    startEncounter(slot.monsterId);
  };

  return (
    <div className="h-dvh flex flex-col p-6 gap-4 max-w-lg mx-auto overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-500">Board</h1>
        <button
          onClick={() => setShowMonsters(false)}
          className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
        >
          ← Back to Run
        </button>
      </div>
      <p className="text-sm text-stone-400">Tap a monster to begin the encounter.</p>
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        {wildHuntSlots.map((slot, i) => (
          <WildHuntSlotCard
            key={i}
            slot={slot}
            monsterName={getMonsterName(slot.monsterId)}
            onStartEncounter={() => handleSlotTap(i as 0 | 1 | 2)}
          />
        ))}
      </div>
    </div>
  );
}
