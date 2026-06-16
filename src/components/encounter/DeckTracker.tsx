interface DeckTrackerProps {
  deckSize: number;
  discardSize: number;
  onOpenEditor?: () => void;
}

export function DeckTracker({ deckSize, discardSize, onOpenEditor }: DeckTrackerProps) {
  return (
    <div className="flex justify-between items-center bg-stone-800/60 border border-stone-700 rounded-lg px-4 py-2">
      {onOpenEditor ? (
        <button
          onClick={onOpenEditor}
          className="text-center group"
          aria-label="Edit deck"
        >
          <div className="text-2xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
            {deckSize}
          </div>
          <div className="text-xs text-stone-400 uppercase group-hover:text-amber-500 transition-colors">
            Remaining ✎
          </div>
        </button>
      ) : (
        <div className="text-center">
          <div className="text-2xl font-bold text-stone-100">{deckSize}</div>
          <div className="text-xs text-stone-400 uppercase">Remaining</div>
        </div>
      )}
      <div className="text-center">
        <div className="text-2xl font-bold text-stone-500">{discardSize}</div>
        <div className="text-xs text-stone-400 uppercase">Discarded</div>
      </div>
    </div>
  );
}
