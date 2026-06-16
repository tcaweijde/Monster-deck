import { useEffect, useRef, useState } from 'react';
import type { MonsterAbility } from '../../types';

interface TrailDrawAlertProps {
  ability: MonsterAbility;
  cardNumber: 1 | 2 | 3 | 4;
  triggered: boolean;
  onDismiss: () => void;
}

export function TrailDrawAlert({ ability, cardNumber, triggered, onDismiss }: TrailDrawAlertProps) {
  const [visible, setVisible] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!triggered) return;
    const t1 = setTimeout(() => setVisible(true), 0);
    const t2 = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 3000);
    timersRef.current = [t1, t2];
    return () => timersRef.current.forEach(clearTimeout);
  }, [triggered]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  return (
    <div
      onClick={() => {
        setVisible(false);
        onDismiss();
      }}
      className="fixed inset-x-0 top-4 mx-auto max-w-sm bg-amber-900/90 border border-amber-500 text-amber-100 rounded-lg px-4 py-2 text-center text-sm cursor-pointer z-50"
    >
      <div className="text-xs text-amber-400 font-semibold mb-0.5">
        Special Card #{cardNumber} — Draw Trigger
      </div>
      <div className="font-semibold">{ability.name}</div>
      <div className="text-amber-300">{ability.description}</div>
    </div>
  );
}
