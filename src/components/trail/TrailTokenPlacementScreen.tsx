import { useTrailStore } from '../../store/trailStore';
import { TokenLocationArt } from './TokenLocationArt';

export function TrailTokenPlacementScreen() {
  const weaknessTokenBoard = useTrailStore((s) => s.weaknessTokenBoard);
  const placementConfirmed = useTrailStore((s) => s.placementConfirmed);
  const confirmTokenPlaced = useTrailStore((s) => s.confirmTokenPlaced);
  const redrawTokenLocation = useTrailStore((s) => s.redrawTokenLocation);

  const total = weaknessTokenBoard.length;
  const confirmed = placementConfirmed.length;
  const allConfirmed = confirmed === total && total > 0;

  return (
    <div className="min-h-screen flex flex-col p-6 gap-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-amber-500">Place Weakness Tokens</h1>
      <p className="text-stone-400 text-sm">
        Place one physical token on the shown location. If a player is standing on that location,
        tap <span className="text-amber-400 font-medium">Redraw</span> to get a different one.
      </p>

      <div className="flex items-center gap-2 py-2">
        <div className="flex-1 h-2 rounded-full bg-stone-700">
          <div
            className="h-2 rounded-full bg-amber-500 transition-all"
            style={{ width: total > 0 ? `${(confirmed / total) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-sm text-stone-400 shrink-0">{confirmed} / {total} placed</span>
      </div>

      <div className="flex flex-col gap-3">
        {weaknessTokenBoard.map((token) => {
          const isConfirmed = placementConfirmed.includes(token.id);
          return (
            <div
              key={token.id}
              className={`rounded-xl border overflow-hidden transition-colors ${
                isConfirmed
                  ? 'border-stone-600 opacity-60'
                  : 'border-stone-500'
              }`}
            >
              {/* Location art strip */}
              <div className="relative">
                <TokenLocationArt token={token} />
                {isConfirmed && (
                  <div className="absolute inset-0 bg-stone-950/50 flex items-center justify-center">
                    <span className="text-emerald-400 font-bold text-3xl">✓</span>
                  </div>
                )}
              </div>

              {/* Token info + actions */}
              <div className="bg-stone-800 px-4 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs text-stone-400 uppercase tracking-wide capitalize">
                    {token.terrainType} token
                  </div>
                  <div className="text-sm font-semibold text-stone-200">
                    Weakness #{token.number}
                  </div>
                </div>
                {!isConfirmed && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => redrawTokenLocation(token.id)}
                      className="py-2 px-3 rounded-lg bg-stone-700 hover:bg-stone-600 border border-stone-500 text-stone-300 text-xs font-semibold transition-colors"
                      title="Player is on this location — get a different one"
                    >
                      Redraw
                    </button>
                    <button
                      onClick={() => confirmTokenPlaced(token.id)}
                      className="py-2 px-3 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
                    >
                      Confirm ✓
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allConfirmed && (
        <p className="text-center text-emerald-400 font-semibold pt-2">
          All tokens placed — returning to board…
        </p>
      )}
    </div>
  );
}
