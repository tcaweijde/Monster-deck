import { useState } from 'react';
import type { Monster, MonsterLevel } from '../../types';
import { useEncounterStore } from '../../store/encounterStore';
import { MonsterPicker } from './MonsterPicker';
import { LevelPicker } from './LevelPicker';

export function SetupScreen() {
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<MonsterLevel | null>(null);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  const handleStart = () => {
    if (selectedMonster && selectedLevel) {
      startEncounter(selectedMonster.id, selectedLevel);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-500">Monster Deck</h1>
      <p className="text-gray-400 text-center">The Witcher Old World — Digital Opponent</p>

      <div className="w-full max-w-lg space-y-8">
        <MonsterPicker selected={selectedMonster} onSelect={setSelectedMonster} />

        {selectedMonster && (
          <LevelPicker
            monster={selectedMonster}
            selected={selectedLevel}
            onSelect={setSelectedLevel}
          />
        )}

        {selectedMonster && selectedLevel && (
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg transition-colors"
          >
            Start Encounter
          </button>
        )}
      </div>
    </div>
  );
}
