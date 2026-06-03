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
      <h2 className="text-xl font-semibold text-stone-200">Choose a Monster</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MONSTERS.map((monster) => (
          <button
            key={monster.id}
            onClick={() => onSelect(monster)}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selected?.id === monster.id
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-stone-700 bg-stone-800/50 hover:border-stone-500'
            }`}
          >
            <div className="font-bold text-lg text-stone-100">{monster.name}</div>
            <div className="text-sm text-stone-400 mt-1">
              Level {monster.level} — {monster.deckSize} cards
            </div>
            <div className="text-sm text-stone-500 mt-1">{monster.baseAbility.name}</div>
          </button>
        ))}
      </div>
      <button
        onClick={pickRandom}
        className="w-full sm:w-auto px-6 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 transition-colors"
      >
        Random Monster
      </button>
    </div>
  );
}
