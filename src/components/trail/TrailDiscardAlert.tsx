import { useEffect, useState } from 'react';
import type { MonsterAbility } from '../../types';

interface TrailDiscardAlertProps {
  ability: MonsterAbility;
  triggered: boolean;
}

export function TrailDiscardAlert({ ability, triggered }: TrailDiscardAlertProps) {
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
        className="bg-amber-950 border-2 border-amber-500 rounded-2xl px-8 py-8 text-center max-w-sm mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-4">
          Special Card — Discard Trigger
        </div>
        <div className="text-amber-300 mb-8">{ability.description}</div>
        <button
          className="w-full bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-lg"
          onClick={() => setVisible(false)}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
