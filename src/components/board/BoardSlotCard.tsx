import { useState } from 'react';
import type { BoardSlot } from '../../types';
import { LOCATIONS, DAGONS_LAIR_LOCATION } from '../../data/locations';

const BASE = import.meta.env.BASE_URL ?? '/';
const resolveUrl = (path: string) => `${BASE}${path.replace(/^\//, '')}`;
const FALLBACK_IMAGE = resolveUrl('/images/locations/fallback.png');

interface BoardSlotCardProps {
  slot: BoardSlot;
  monsterName: string;
  onStartEncounter: () => void;
  /** Marks this as the permanent Dagon's Lair slot — applies a distinct visual style. */
  permanent?: boolean;
}

export function BoardSlotCard({ slot, monsterName, onStartEncounter, permanent }: BoardSlotCardProps) {
  const location = slot.locationId === DAGONS_LAIR_LOCATION.id
    ? DAGONS_LAIR_LOCATION
    : LOCATIONS.find((l) => l.id === slot.locationId);
  const isEncountering = slot.status === 'encountering';
  const [imgSrc, setImgSrc] = useState(
    location?.image ? resolveUrl(location.image) : FALLBACK_IMAGE
  );

  return (
    <button
      onClick={onStartEncounter}
      disabled={isEncountering}
      className={`relative w-full text-left rounded-xl border-2 overflow-hidden flex-1 min-h-0 transition-colors ${
        isEncountering
          ? 'border-red-700 opacity-60'
          : permanent
            ? 'border-cyan-700 hover:border-cyan-500'
            : 'border-stone-700 hover:border-amber-600'
      }`}
    >
      {/* Background image */}
      <img
        src={imgSrc}
        alt={location?.name ?? ''}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-lg drop-shadow">{monsterName}</span>
          <div className="flex items-center gap-2">
            {permanent && (
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/70 rounded px-1.5 py-0.5">
                Lair
              </span>
            )}
            <span className="text-sm font-semibold text-amber-400 drop-shadow">Lv.{slot.level}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {location && (
            <span className="text-xs text-stone-300 font-medium bg-stone-950/60 rounded px-1.5 py-0.5 drop-shadow">
              {location.name}
            </span>
          )}
          {isEncountering && (
            <span className="text-xs text-red-400 font-semibold drop-shadow ml-auto">In combat</span>
          )}
        </div>
      </div>
    </button>
  );
}
