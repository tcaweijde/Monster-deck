import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { RevealedCard } from '../../types';

const BASE = import.meta.env.BASE_URL ?? '/';
const CARD_BACK_IMAGE = `${BASE}images/card-back.png`;

function resolvePublicUrl(path: string): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}

interface MonsterCardDisplayProps {
  currentCard: RevealedCard | null;
  deckEmpty: boolean;
  deckSize: number;
  turn: 'monster' | 'player';
  cardFrontImages: string[];
  onFlip: () => void;
  onSwipeDamage: () => void;
  onPass: () => void;
  theme?: 'default' | 'frost';
}

function getCardFrontImage(cardId: string, images: string[]): string {
  if (images.length === 0) return '';
  const num = parseInt(cardId.split('-').pop() ?? '0', 10);
  return resolvePublicUrl(images[num % images.length]);
}

export function MonsterCardDisplay({
  currentCard,
  deckEmpty,
  deckSize,
  turn,
  cardFrontImages,
  onFlip,
  onSwipeDamage,
  onPass,
  theme = 'default',
}: MonsterCardDisplayProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [justRevealed, setJustRevealed] = useState(false);
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

  const handleTap = () => {
    if (swiping.current) return;
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

    // Player turn tap: flip out then pass back to monster.
    setTimeout(() => {
      onPass();
      setJustRevealed(false);
    }, 10);
  };

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

  const isPlayerTurn = turn === 'player';
  const backgroundImage = deckEmpty
    ? undefined
    : `url(${currentCard ? getCardFrontImage(currentCard.cardId, cardFrontImages) : CARD_BACK_IMAGE})`;

  // Show up to 2 ghost cards behind the main card to suggest a physical deck.
  const stackCount = deckEmpty ? 0 : Math.min(2, deckSize - 1);
  const cardBackStyle = {
    backgroundImage: `url(${CARD_BACK_IMAGE})`,
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="relative h-full aspect-[283/438] max-w-full mx-auto">
        {stackCount >= 2 && (
          <div
            className="absolute inset-0 rounded-xl border-2 border-stone-600/40"
            style={{ ...cardBackStyle, transform: 'translate(-8px, -8px)', opacity: 0.35 }}
          >
            {theme === 'frost' && (
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 45%, rgba(6,182,212,0.2) 75%, rgba(8,145,178,0.4) 100%)',
                  boxShadow: 'inset 0 0 20px rgba(6,182,212,0.25)',
                }}
              />
            )}
          </div>
        )}
        {stackCount >= 1 && (
          <div
            className="absolute inset-0 rounded-xl border-2 border-stone-500/50"
            style={{ ...cardBackStyle, transform: 'translate(-4px, -4px)', opacity: 0.6 }}
          >
            {theme === 'frost' && (
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 45%, rgba(6,182,212,0.2) 75%, rgba(8,145,178,0.4) 100%)',
                  boxShadow: 'inset 0 0 20px rgba(6,182,212,0.25)',
                }}
              />
            )}
          </div>
        )}
        <motion.div
          drag={isPlayerTurn ? 'x' : false}
          dragConstraints={isPlayerTurn ? { left: 0, right: 0 } : undefined}
          dragElastic={0.8}
          onDragStart={isPlayerTurn ? () => { swiping.current = true; } : undefined}
          onDragEnd={isPlayerTurn ? handleDragEnd : undefined}
          onClick={handleTap}
          style={{
            x,
            rotate,
            opacity,
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className={`absolute inset-0 rounded-xl border-2 flex flex-col items-center justify-end pb-4 select-none ${
            deckEmpty
              ? 'border-stone-700 bg-stone-800/30'
              : isPlayerTurn
                ? theme === 'frost'
                  ? 'border-cyan-500/50 cursor-grab active:cursor-grabbing touch-none'
                  : 'border-amber-500/50 cursor-grab active:cursor-grabbing touch-none'
                : theme === 'frost'
                  ? 'border-stone-500 hover:border-cyan-500 cursor-pointer'
                  : 'border-stone-500 hover:border-amber-500 cursor-pointer'
          }`}
          whileTap={!isPlayerTurn && !deckEmpty ? { scale: 0.95 } : {}}
          animate={isFlipping ? { rotateY: 90 } : justRevealed ? { rotateY: [90, 0] } : { rotateY: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => setJustRevealed(false)}
        >
          {theme === 'frost' && !deckEmpty && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 45%, rgba(6,182,212,0.25) 75%, rgba(8,145,178,0.5) 100%)',
                boxShadow: 'inset 0 0 30px rgba(6,182,212,0.35)',
              }}
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {deckEmpty ? (
            <span className="text-stone-600 text-lg">No cards left</span>
          ) : currentCard ? (
            <div className="text-center flex flex-col items-center bg-stone-950/80 rounded-lg px-4 py-2 w-full">
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">
                {currentCard.chosenHalf.name}
              </div>
              {currentCard.chosenHalf.attack && (
                <div className="text-3xl sm:text-5xl font-bold text-red-400">{currentCard.chosenHalf.attack} damage</div>
              )}
              {currentCard.chosenHalf.effect && (
                <div className={`text-sm rounded-lg px-3 py-1.5 mt-3 ${
                  theme === 'frost'
                    ? 'text-cyan-300 bg-cyan-500/20'
                    : 'text-amber-300 bg-amber-500/20'
                }`}>
                  {currentCard.chosenHalf.effect}
                </div>
              )}
            </div>
          ) : isPlayerTurn ? (
            <div className="text-center bg-stone-950/80 rounded-lg px-4 py-2 w-full">
              <div className={`text-2xl font-bold mb-1 ${theme === 'frost' ? 'text-cyan-200' : 'text-amber-200'}`}>Your turn</div>
              <span className="text-stone-200 text-sm">Swipe to deal damage</span>
            </div>
          ) : (
            <div className="text-center bg-stone-950/80 rounded-lg px-4 py-2 w-full">
              <div className="text-4xl mb-2 text-stone-100">?</div>
              <span className="text-stone-200 text-sm">Tap to flip</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
