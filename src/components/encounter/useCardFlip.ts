import { useState } from 'react';
import type { RefObject } from 'react';
import { MotionValue, animate } from 'framer-motion';
import type { RevealedCard } from '../../types';

interface UseCardFlipOptions {
  turn: 'monster' | 'player';
  currentCard: RevealedCard | null;
  deckEmpty: boolean;
  /** Shared ref from useCardSwipe — prevents tap firing at the end of a drag. */
  swiping: RefObject<boolean>;
  /** Shared x MotionValue from useCardSwipe — used to animate card off-screen on pass. */
  x: MotionValue<number>;
  onFlip: () => void;
  onPass: () => void;
}

export function useCardFlip({
  turn,
  currentCard,
  deckEmpty,
  swiping,
  x,
  onFlip,
  onPass,
}: UseCardFlipOptions) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [justRevealed, setJustRevealed] = useState(false);

  const handleTap = () => {
    if (swiping.current === true) return;
    if (isFlipping) return;

    if (turn === 'monster') {
      if (!currentCard && deckEmpty) return;

      if (currentCard) {
        // Second tap on monster turn: swipe card right and hand over to player.
        animate(x, 300, { duration: 0.2 }).then(() => {
          onPass();
          x.set(0);
        });
      } else {
        // First tap on monster turn: reveal card but keep monster turn.
        setIsFlipping(true);
        setTimeout(() => {
          onFlip();
          setJustRevealed(false);
          setIsFlipping(false);
        }, 300);
      }
      return;
    }

    // Player turn tap: pass back to monster.
    setTimeout(() => {
      onPass();
      setJustRevealed(false);
    }, 10);
  };

  return { isFlipping, justRevealed, setJustRevealed, handleTap };
}
