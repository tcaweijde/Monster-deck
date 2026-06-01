import type { Monster, MonsterLevel } from '../../types';

interface LevelPickerProps {
  monster: Monster;
  selected: MonsterLevel | null;
  onSelect: (level: MonsterLevel) => void;
}

const LEVELS: MonsterLevel[] = [1, 2, 3];

export function LevelPicker({ monster, selected, onSelect }: LevelPickerProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-200">Select Level</h2>
      <div className="grid grid-cols-3 gap-3">
        {LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`p-4 rounded-lg border-2 text-center transition-colors ${
              selected === level
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <div className="font-bold text-lg text-gray-100">Level {level}</div>
            <div className="text-sm text-gray-400 mt-1">
              {monster.deckSizes[level]} cards
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
