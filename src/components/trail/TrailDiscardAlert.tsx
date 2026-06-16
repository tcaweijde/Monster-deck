import { useEffect, useRef, useState } from 'react';
import type { MonsterAbility } from '../../types';

interface TrailDiscardAlertProps {
  ability: MonsterAbility;
  triggered: boolean;
}

export function TrailDiscardAlert({ ability, triggered }: TrailDiscardAlertProps) {
  const [visible, setVisible] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!triggered) return;
    const t1 = setTimeout(() => setVisible(true), 0);
    const t2 = setTimeout(() => setVisible(false), 3000);
    timersRef.current = [t1, t2];
    return () => timersRef.current.forEach(clearTimeout);
  }, [triggered]);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      // Offset below DiscardAlert so both are visible simultaneously
      className="fixed inset-x-0 top-20 mx-auto max-w-sm bg-red-900/90 border border-red-400 text-red-100 rounded-lg px-4 py-2 text-center text-sm cursor-pointer z-50"
    >
      <div className="text-xs text-red-400 font-semibold mb-0.5">Special Card — Discard Trigger</div>
      <div className="font-semibold">{ability.name}</div>
      <div className="text-red-300">{ability.description}</div>
    </div>
  );
}
