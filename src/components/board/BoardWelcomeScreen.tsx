import { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { useWildHuntStore } from '../../store/wildHuntStore';
import { useLegendaryHuntStore } from '../../store/legendaryHuntStore';
import { useTrailStore } from '../../store/trailStore';
import { TrailModeToggle } from '../trail/TrailModeToggle';
import { SkelligeModeToggle } from '../skellige/SkelligeModeToggle';

export function BoardWelcomeScreen() {
  const initNewGame = useBoardStore((s) => s.initNewGame);
  const initiateSetup = useWildHuntStore((s) => s.initiateSetup);
  const initiateLegendarySetup = useLegendaryHuntStore((s) => s.initiateSetup);
  const resetTrailSession = useTrailStore((s) => s.resetTrailSession);
  const startTrailSession = useTrailStore((s) => s.startTrailSession);
  const dagonsLairEnabled = useBoardStore((s) => s.dagonsLairEnabled);
  const enableDagonsLair = useBoardStore((s) => s.enableDagonsLair);
  const disableDagonsLair = useBoardStore((s) => s.disableDagonsLair);

  const [trailMode, setTrailMode] = useState(false);

  const handleSkelligeChange = (enabled: boolean) => {
    if (enabled) enableDagonsLair();
    else disableDagonsLair();
  };

  const handleStartGame = () => {
    resetTrailSession();
    if (trailMode) startTrailSession();
    initNewGame();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-500">Monster Deck</h1>
      <p className="text-stone-400 text-center">The Witcher Old World — Solo Play</p>
      <div className="w-full max-w-xs space-y-3">
        <TrailModeToggle enabled={trailMode} onChange={setTrailMode} />
        <SkelligeModeToggle enabled={dagonsLairEnabled} onChange={handleSkelligeChange} />
        <button
          onClick={handleStartGame}
          className="w-full py-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg transition-colors"
        >
          Start New Game
        </button>
        <button
          onClick={initiateSetup}
          className="w-full py-4 rounded-lg bg-stone-700 hover:bg-stone-600 border border-stone-500 text-stone-200 font-bold text-lg transition-colors"
        >
          Wild Hunt mode
        </button>
        <button
          onClick={initiateLegendarySetup}
          className="w-full py-4 rounded-lg bg-stone-700 hover:bg-stone-600 border border-stone-500 text-stone-200 font-bold text-lg transition-colors"
        >
          Legendary Hunt mode
        </button>
      </div>
    </div>
  );
}
