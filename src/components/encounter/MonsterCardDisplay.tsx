import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { RevealedCard } from '../../types';

interface MonsterCardDisplayProps {
  currentCard: RevealedCard | null;
  deckEmpty: boolean;
  turn: 'monster' | 'player';
  onFlip: () => void;
  onSwipeDamage: () => void;
  onPass: () => void;
}

export function MonsterCardDisplay({
  currentCard,
  deckEmpty,
  turn,
  onFlip,
  onSwipeDamage,
  onPass,
}: MonsterCardDisplayProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [justRevealed, setJustRevealed] = useState(false);
  const swiping = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleTap = () => {
    if (swiping.current) return;

    if (turn === 'monster' && !deckEmpty && !isFlipping) {
      setIsFlipping(true);
      setJustRevealed(false);
      setTimeout(() => {
        onFlip();
        setJustRevealed(true);
        setIsFlipping(false);
      }, 300);
    } else if (turn === 'player') {
      onPass();
      setJustRevealed(false);
    }
  };

  const handleDragEnd = () => {
    const currentX = x.get();
    if (Math.abs(currentX) > 80 && turn === 'player' && !deckEmpty) {
      swiping.current = true;
      const direction = currentX > 0 ? 300 : -300;
      animate(x, direction, { duration: 0.15 }).then(() => {
        onSwipeDamage();
        x.set(0);
        swiping.current = false;
      });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  };

  // Monster's turn: show face-down card to tap
  if (turn === 'monster') {
    return (
      <div className="flex flex-col items-center">
        <motion.div
          onClick={handleTap}
          className={`w-full max-w-xs h-52 rounded-xl border-2 flex items-center justify-center cursor-pointer select-none ${
            deckEmpty
              ? 'border-gray-700 bg-gray-800/30'
              : 'border-gray-500 bg-gray-800 hover:border-amber-500'
          }`}
          whileTap={deckEmpty ? {} : { scale: 0.95 }}
          animate={isFlipping ? { rotateY: 90 } : { rotateY: 0 }}
          transition={{ duration: 0.3 }}
          style={{ perspective: 800 }}
        >
          {deckEmpty ? (
            <span className="text-gray-600 text-lg">No cards left</span>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2 text-gray-500">?</div>
              <span className="text-gray-400 text-sm">Tap to flip</span>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Player's turn: show swipeable card
  return (
    <div className="flex flex-col items-center">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        style={{ x, rotate, opacity }}
        className="w-full max-w-xs h-52 rounded-xl border-2 border-amber-500/50 bg-gray-800 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none touch-pan-y"
        animate={justRevealed ? { rotateY: [90, 0] } : undefined}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => setJustRevealed(false)}
      >
        {currentCard ? (
          <>
            <div className="text-5xl font-bold text-red-400">{currentCard.chosenHalf.attack}</div>
            <div className="text-sm text-gray-400 uppercase mt-1">Attack</div>
            {currentCard.chosenHalf.effect && (
              <div className="text-sm text-amber-300 bg-amber-500/10 rounded-lg px-3 py-1.5 mt-3">
                {currentCard.chosenHalf.effect}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">Your turn</div>
            <span className="text-gray-400 text-sm">Swipe to deal damage</span>
          </div>
        )}
      </motion.div>
      <p className="text-xs text-gray-500 mt-3">
        {deckEmpty ? 'Tap to pass' : 'Swipe to deal damage · Tap to pass'}
      </p>
    </div>
  );
}
