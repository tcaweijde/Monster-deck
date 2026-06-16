import { useState } from 'react';
import { useTrailStore } from '../../store/trailStore';

const TERRAIN_EMOJI: Record<string, string> = {
  water: '🌊',
  mountain: '⛰️',
  woods: '🌲',
};

export function TrailTokenBoard() {
  const weaknessTokenBoard = useTrailStore((s) => s.weaknessTokenBoard);
  const weaknessTokensHeld = useTrailStore((s) => s.weaknessTokensHeld);
  const placementConfirmed = useTrailStore((s) => s.placementConfirmed);
  const claimToken = useTrailStore((s) => s.claimToken);

  const [heldExpanded, setHeldExpanded] = useState(false);

  if (weaknessTokenBoard.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
        Weakness Tokens
      </h2>

      <div className="flex flex-col gap-2">
        {weaknessTokenBoard.map((token) => {
          const isPlaced = placementConfirmed.includes(token.id);
          return (
            <div
              key={token.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-stone-800 border border-stone-600"
            >
              <span className="text-xl">{TERRAIN_EMOJI[token.terrainType] ?? '📍'}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-stone-200 capitalize">
                  {token.terrainType}
                </div>
                <div className="text-xs text-stone-400">Weakness #{token.number}</div>
              </div>
              {isPlaced ? (
                <button
                  onClick={() => claimToken(token.id)}
                  className="py-1.5 px-3 rounded-lg bg-stone-700 hover:bg-stone-600 border border-stone-500 text-stone-200 text-xs font-semibold transition-colors"
                >
                  Claim
                </button>
              ) : (
                <span className="text-xs text-stone-500 italic">not placed</span>
              )}
            </div>
          );
        })}
      </div>

      {weaknessTokensHeld.length > 0 && (
        <div className="mt-1">
          <button
            onClick={() => setHeldExpanded((e) => !e)}
            className="flex items-center gap-2 text-sm text-amber-300 font-semibold"
          >
            <span className="bg-amber-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {weaknessTokensHeld.length}
            </span>
            Held tokens {heldExpanded ? '▲' : '▼'}
          </button>
          {heldExpanded && (
            <div className="mt-2 flex flex-col gap-1.5 pl-2">
              {weaknessTokensHeld.map((token) => (
                <div key={token.id} className="flex items-center gap-2 text-xs text-stone-400">
                  <span>{TERRAIN_EMOJI[token.terrainType] ?? '📍'}</span>
                  <span className="capitalize">{token.terrainType}</span>
                  <span>—</span>
                  <span>Weakness #{token.number}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
