import { useState } from 'react';
import { useLegendaryHuntStore } from '../../store/legendaryHuntStore';

export function DestructionTokenCounter(): React.JSX.Element {
  const [claimAmount, setClaimAmount] = useState(0);
  const count = useLegendaryHuntStore((s) => s.destructionTokenCount);
  const claimTokens = useLegendaryHuntStore((s) => s.claimTokens);

  function handleClaim(): void {
    claimTokens(claimAmount);
    setClaimAmount(0);
  }

  function decrement(): void {
    setClaimAmount((prev) => Math.max(0, prev - 1));
  }

  function increment(): void {
    setClaimAmount((prev) => prev + 1);
  }

  return (
    <div className="bg-stone-900/80 border border-amber-700/40 rounded-xl p-4 space-y-3">
      <div className="text-amber-400 font-semibold text-base">
        Destruction Tokens: <span className="text-amber-300 text-xl font-bold">{count}</span>
      </div>

      <p className="text-stone-400 text-xs">
        Claim tokens from locations the monster departed
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={decrement}
          className="w-9 h-9 rounded-lg bg-stone-800 border border-amber-700/40 text-stone-200 text-lg font-bold flex items-center justify-center active:bg-stone-700 disabled:opacity-40"
          disabled={claimAmount === 0}
          aria-label="Decrease claim amount"
        >
          −
        </button>

        <span className="text-stone-100 font-bold text-lg w-8 text-center" aria-live="polite">
          {claimAmount}
        </span>

        <button
          onClick={increment}
          className="w-9 h-9 rounded-lg bg-stone-800 border border-amber-700/40 text-stone-200 text-lg font-bold flex items-center justify-center active:bg-stone-700"
          aria-label="Increase claim amount"
        >
          +
        </button>

        <button
          onClick={handleClaim}
          disabled={claimAmount === 0}
          className="ml-auto px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-100 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Claim
        </button>
      </div>
    </div>
  );
}
