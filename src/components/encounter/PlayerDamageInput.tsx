import { useState } from 'react';

interface PlayerDamageInputProps {
  maxDamage: number;
  onApply: (damage: number) => void;
}

export function PlayerDamageInput({ maxDamage, onApply }: PlayerDamageInputProps) {
  const [damage, setDamage] = useState(0);

  const handleApply = () => {
    onApply(damage);
    setDamage(0);
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-400 uppercase font-semibold">Player Damage</div>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setDamage((d) => Math.max(0, d - 1))}
          className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 text-xl font-bold text-gray-200 transition-colors"
        >
          -
        </button>
        <div className="text-3xl font-bold text-gray-100 w-12 text-center">{damage}</div>
        <button
          onClick={() => setDamage((d) => Math.min(maxDamage, d + 1))}
          className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 text-xl font-bold text-gray-200 transition-colors"
        >
          +
        </button>
      </div>
      <button
        onClick={handleApply}
        className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold transition-colors"
      >
        {damage === 0 ? 'Skip (0 damage)' : `Apply ${damage} Damage`}
      </button>
    </div>
  );
}
