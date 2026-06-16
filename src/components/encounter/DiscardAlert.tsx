import { useEffect, useState } from 'react';
import type { MonsterAbility } from '../../types';

interface DiscardAlertProps {
  ability: MonsterAbility;
  triggered: boolean;
}

export function DiscardAlert({ ability, triggered }: DiscardAlertProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggered) setVisible(true);
  }, [triggered]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
      onClick={() => setVisible(false)}
    >
      <div
        className="bg-red-950 border-2 border-red-500 rounded-2xl px-8 py-8 text-center max-w-sm mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-4">
          Discard Trigger
        </div>
        <div className="text-xl font-bold text-red-100 mb-2">{ability.name}</div>
        <div className="text-red-300 mb-8">{ability.description}</div>
        <button
          className="w-full bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-lg"
          onClick={() => setVisible(false)}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
