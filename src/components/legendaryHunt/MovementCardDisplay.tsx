import type { MovementCard } from '../../types';

export function MovementCardDisplay({ card }: { card: MovementCard | null }): React.JSX.Element {
  if (!card) {
    return (
      <div className="bg-stone-800/60 border border-amber-800/30 rounded-xl p-6 text-center text-stone-500">
        Drawing movement card...
      </div>
    );
  }

  return (
    <div className="bg-stone-900/80 border border-amber-700/50 rounded-xl p-5 space-y-4">
      <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
        Movement Card
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-stone-400 text-sm w-20 shrink-0">Move toward</span>
          <span className="text-stone-100 font-medium">{card.targetLocation1Name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-400 text-sm w-20 shrink-0">Then toward</span>
          <span className="text-stone-100 font-medium">{card.targetLocation2Name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-400 text-sm w-20 shrink-0">Distance</span>
          <span className="text-amber-300 font-bold text-lg">
            {card.movementDistanceSolo} steps
          </span>
        </div>
      </div>
    </div>
  );
}
