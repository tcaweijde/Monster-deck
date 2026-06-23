import { useState } from 'react';
import type { PlacedWeaknessToken } from '../../types';

interface TrailPreFightModalProps {
  heldTokens: PlacedWeaknessToken[];
  onConfirm: (token: PlacedWeaknessToken | null) => void;
  onCancel: () => void;
}

export function TrailPreFightModal({ heldTokens, onConfirm, onCancel }: TrailPreFightModalProps) {
  const [selected, setSelected] = useState<PlacedWeaknessToken | null>(null);

  return (
    <div className="fixed inset-0 bg-stone-950/85 flex items-center justify-center z-40 p-6">
      <div className="bg-stone-800 border-2 border-amber-700 rounded-2xl p-6 space-y-5 max-w-sm w-full">
        <h2 className="text-xl font-bold text-amber-400">Pre-Fight</h2>
        <p className="text-stone-400 text-sm">Apply a weakness token before this encounter?</p>

        {heldTokens.length === 0 ? (
          <p className="text-stone-500 text-sm italic">No tokens held.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {heldTokens.map((token) => {
              const isSelected = selected?.id === token.id;
              return (
                <button
                  key={token.id}
                  onClick={() => setSelected(isSelected ? null : token)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'bg-amber-900/50 border-amber-500'
                      : 'bg-stone-700 border-stone-600 hover:border-stone-400'
                  }`}
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-stone-200 capitalize">
                      {token.terrainType}
                    </div>
                    <div className="text-xs text-stone-400">Weakness #{token.number}</div>
                  </div>
                  {isSelected && <span className="text-amber-400 font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(null)}
            className="flex-1 py-2.5 rounded-lg bg-stone-700 hover:bg-stone-600 border border-stone-500 text-stone-200 font-semibold text-sm transition-colors"
          >
            Skip
          </button>
          {selected && (
            <button
              onClick={() => onConfirm(selected)}
              className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-colors"
            >
              Apply
            </button>
          )}
          {!selected && heldTokens.length > 0 && (
            <button
              onClick={() => onConfirm(null)}
              className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-colors"
            >
              Fight!
            </button>
          )}
          {heldTokens.length === 0 && (
            <button
              onClick={() => onConfirm(null)}
              className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-colors"
            >
              Start Fight
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
