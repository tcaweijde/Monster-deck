import type { RevealedCard } from '../../types';

interface MonsterCardDisplayProps {
  currentCard: RevealedCard | null;
  deckEmpty: boolean;
  onFlip: () => void;
}

export function MonsterCardDisplay({ currentCard, deckEmpty, onFlip }: MonsterCardDisplayProps) {
  if (currentCard) {
    return (
      <div className="flex flex-col items-center space-y-3">
        <div className="w-full max-w-xs bg-gray-800 border-2 border-amber-500/50 rounded-xl p-6 text-center space-y-3">
          <div className="text-5xl font-bold text-red-400">{currentCard.chosenHalf.attack}</div>
          <div className="text-sm text-gray-400 uppercase">Attack</div>
          {currentCard.chosenHalf.effect && (
            <div className="text-sm text-amber-300 bg-amber-500/10 rounded-lg px-3 py-2">
              {currentCard.chosenHalf.effect}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <button
        onClick={onFlip}
        disabled={deckEmpty}
        className={`w-full max-w-xs h-48 rounded-xl border-2 border-dashed text-lg font-semibold transition-colors ${
          deckEmpty
            ? 'border-gray-700 text-gray-600 cursor-not-allowed'
            : 'border-gray-500 text-gray-300 hover:border-amber-500 hover:text-amber-400 active:scale-95'
        }`}
      >
        {deckEmpty ? 'No cards left' : 'Tap to Flip Card'}
      </button>
    </div>
  );
}
