import { useState } from 'react';
import type { Monster } from '../../types';
import { useEncounterStore } from '../../store/encounterStore';
import { MonsterPicker } from './MonsterPicker';

export function SetupScreen() {
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [playerHasTrail, setPlayerHasTrail] = useState(false);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  const handleStart = () => {
    if (selectedMonster) {
      startEncounter(selectedMonster.id, playerHasTrail);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-500">Monster Deck</h1>
      <p className="text-stone-400 text-center">The Witcher Old World — Digital Opponent</p>

      <div className="w-full max-w-lg space-y-8">
        <MonsterPicker selected={selectedMonster} onSelect={setSelectedMonster} />

        {selectedMonster && (
          <>
            <button
              onClick={() => setPlayerHasTrail((v) => !v)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                playerHasTrail
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-stone-700 bg-stone-800/50 hover:border-stone-500'
              }`}
            >
              <div className="font-semibold text-stone-200">Trail token</div>
              <div className="text-sm text-stone-400 mt-1">
                {playerHasTrail
                  ? 'Player starts first'
                  : 'Monster starts first (default)'}
              </div>
            </button>

            <button
              onClick={handleStart}
              className="w-full py-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg transition-colors"
            >
              Start Encounter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
