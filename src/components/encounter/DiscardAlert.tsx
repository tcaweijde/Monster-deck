import { useEffect, useState } from 'react';
import type { MonsterAbility } from '../../types';

interface DiscardAlertProps {
  ability: MonsterAbility;
  triggered: boolean;
}

export function DiscardAlert({ ability, triggered }: DiscardAlertProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggered) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [triggered]);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className="fixed inset-x-0 top-4 mx-auto max-w-sm bg-red-900/90 border border-red-500 text-red-100 rounded-lg px-4 py-2 text-center text-sm cursor-pointer z-50"
    >
      <div className="font-semibold">{ability.name}</div>
      <div className="text-red-300">{ability.description}</div>
    </div>
  );
}
