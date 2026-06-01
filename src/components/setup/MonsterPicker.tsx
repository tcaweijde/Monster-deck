import { MONSTERS } from '../../data/monsters';
import type { Monster } from '../../types';

interface MonsterPickerProps {
  selected: Monster | null;
  onSelect: (monster: Monster) => void;
}

export function MonsterPicker({ selected, onSelect }: MonsterPickerProps) {
  const pickRandom = () => {
    const monster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    onSelect(monster);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-200">Choose a Monster</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MONSTERS.map((monster) => (
          <button
            key={monster.id}
            onClick={() => onSelect(monster)}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selected?.id === monster.id
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <div className="font-bold text-lg text-gray-100">{monster.name}</div>
            <div className="text-sm text-gray-400 mt-1">{monster.baseAbility.name}</div>
          </button>
        ))}
      </div>
      <button
        onClick={pickRandom}
        className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
      >
        Random Monster
      </button>
    </div>
  );
}
