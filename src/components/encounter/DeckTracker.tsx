interface DeckTrackerProps {
  deckSize: number;
  discardSize: number;
}

export function DeckTracker({ deckSize, discardSize }: DeckTrackerProps) {
  return (
    <div className="flex justify-between items-center bg-gray-800/50 rounded-lg px-4 py-2">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-100">{deckSize}</div>
        <div className="text-xs text-gray-400 uppercase">Remaining</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-500">{discardSize}</div>
        <div className="text-xs text-gray-400 uppercase">Discarded</div>
      </div>
    </div>
  );
}
