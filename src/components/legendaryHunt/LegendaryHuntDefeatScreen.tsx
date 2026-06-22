import { useLegendaryHuntStore } from '../../store/legendaryHuntStore';
import { useBoardStore } from '../../store/boardStore';
import { LEGENDARY_MONSTERS } from '../../data/legendary';

const BASE = import.meta.env.BASE_URL ?? '/';

export function LegendaryHuntDefeatScreen() {
  const legendaryMonsterId = useLegendaryHuntStore((s) => s.legendaryMonsterId);
  const round = useLegendaryHuntStore((s) => s.round);
  const roundLimit = useLegendaryHuntStore((s) => s.roundLimit);
  const resetCampaign = useLegendaryHuntStore((s) => s.resetCampaign);
  const endGame = useBoardStore((s) => s.endGame);

  const monster = LEGENDARY_MONSTERS.find((m) => m.id === legendaryMonsterId);

  if (!monster) {
    return null;
  }

  return (
    <div className="relative h-dvh overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2d1a0e 0%, #1c1917 60%)' }} />
      <div className="absolute inset-0 bg-amber-950/20" />
      {/* Defeat tint */}
      <div className="absolute inset-0 bg-red-900/20" />

      <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-8 max-w-lg mx-auto text-center">
        {/* Monster portrait */}
        {monster.image && (
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-red-700/60 shadow-lg shadow-red-900/50">
            <img
              src={`${BASE}${monster.image.replace(/^\//, '')}`}
              alt={monster.name}
              className="w-full h-full object-cover object-top"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
          </div>
        )}

        <div className="bg-stone-900/80 border border-red-900/40 rounded-2xl p-6 space-y-3 w-full">
          <h1 className="text-2xl font-bold text-red-400 tracking-wide">The Hunt Has Failed</h1>
          <p className="text-stone-300 text-sm">
            {monster.name} remains at large. The hunt lasted {round} of {roundLimit} rounds.
          </p>
        </div>

        <button
          onClick={() => { resetCampaign(); endGame(); }}
          className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
