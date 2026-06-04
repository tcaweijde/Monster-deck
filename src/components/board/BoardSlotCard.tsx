import { useState } from 'react';
import type { BoardSlot } from '../../types';
import { LOCATIONS } from '../../data/locations';

const BASE = import.meta.env.BASE_URL ?? '/';
const resolveUrl = (path: string) => `${BASE}${path.replace(/^\//, '')}`;
const FALLBACK_IMAGE = resolveUrl('/images/locations/fallback.png');

interface BoardSlotCardProps {
  slot: BoardSlot;
  monsterName: string;
  onStartEncounter: () => void;
}

export function BoardSlotCard({ slot, monsterName, onStartEncounter }: BoardSlotCardProps) {
  const location = LOCATIONS.find((l) => l.id === slot.locationId);
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
          <span className="text-sm font-semibold text-amber-400 drop-shadow">Lv.{slot.level}</span>
        </div>
        <div className="flex items-center justify-end">
          {isEncountering && (
            <span className="text-xs text-red-400 font-semibold drop-shadow">In combat</span>
          )}
        </div>
      </div>
    </button>
  );
}
