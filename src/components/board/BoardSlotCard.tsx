import type { BoardSlot } from '../../types';
import { LOCATIONS } from '../../data/locations';

const TYPE_ICON: Record<string, string> = {
  water: '🌊',
  mountain: '⛰️',
  woods: '🌲',
};

interface BoardSlotCardProps {
  slot: BoardSlot;
  monsterName: string;
  onStartEncounter: () => void;
}

export function BoardSlotCard({ slot, monsterName, onStartEncounter }: BoardSlotCardProps) {
  const location = LOCATIONS.find((l) => l.id === slot.locationId);
  const isEncountering = slot.status === 'encountering';

  return (
    <button
      onClick={onStartEncounter}
      disabled={isEncountering}
      className={`w-full text-left p-4 rounded-xl border-2 transition-colors space-y-1 ${
        isEncountering
          ? 'border-red-700 bg-red-900/20 opacity-60'
          : 'border-gray-700 bg-gray-800/50 hover:border-amber-600 active:bg-gray-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-100 text-lg">{monsterName}</span>
        <span className="text-sm font-semibold text-amber-400">Lv.{slot.level}</span>
      </div>
      <div className="text-sm text-gray-400">
        {TYPE_ICON[slot.locationType]} {location?.name ?? '—'}{' '}
        <span className="text-gray-500">#{slot.locationId}</span>
      </div>
      {isEncountering && (
        <div className="text-xs text-red-400 font-semibold">In combat</div>
      )}
    </button>
  );
}
