import { useRef, useEffect } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';

interface UseCardSwipeOptions {
  turn: 'monster' | 'player';
  deckEmpty: boolean;
  onSwipeDamage: () => void;
}

export function useCardSwipe({ turn, deckEmpty, onSwipeDamage }: UseCardSwipeOptions) {
  const swiping = useRef(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Reset drag position when turn returns to monster so the card stays still.
  useEffect(() => {
    if (turn === 'monster') {
      x.set(0);
    }
  }, [turn, x]);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (Math.abs(currentX) > 80 && turn === 'player' && !deckEmpty) {
      const direction = currentX > 0 ? 300 : -300;
      animate(x, direction, { duration: 0.15 }).then(() => {
        onSwipeDamage();
        x.set(0);
        swiping.current = false;
      });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 }).then(() => {
        swiping.current = false;
      });
    }
  };

  return { x, rotate, opacity, swiping, handleDragEnd };
}
