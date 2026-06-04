const BASE = import.meta.env.BASE_URL ?? '/';
const SHIELD_IMG = `${BASE}images/monsters/wild-hunt/shield.png`;

interface ShieldCounterProps {
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  /** When true, renders a compact inline badge instead of the full tile. */
  compact?: boolean;
}

/**
 * Displays the Wild Hunt shield count with manual +/− adjustment buttons.
 * Story card events can add or remove shields at any point during a run.
 */
export function ShieldCounter({ count, onAdd, onRemove, compact = false }: ShieldCounterProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={onRemove}
          disabled={count <= 0}
          className="w-6 h-6 rounded bg-stone-700 text-stone-300 hover:bg-stone-600 disabled:opacity-30 text-sm font-bold leading-none"
        >
          −
        </button>
        <span className="text-sm font-bold text-white min-w-[1rem] text-center">{count}</span>
        <img src={SHIELD_IMG} alt="shields" className="w-5 h-5 object-contain" />

        <button
          onClick={onAdd}
          className="w-6 h-6 rounded bg-stone-700 text-stone-300 hover:bg-stone-600 text-sm font-bold leading-none"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex-1 rounded-lg border border-stone-600 p-3 text-center flex flex-col items-center justify-center gap-1 bg-center bg-contain bg-no-repeat"
      style={{ backgroundImage: `url(${SHIELD_IMG})`, backgroundColor: 'rgba(28,25,23,0.85)', backgroundBlendMode: 'multiply' }}
    >
      <p className="text-xs text-stone-400 uppercase tracking-wide">Shields</p>
      <span className="text-2xl font-bold text-white">{count}</span>
      <div className="flex justify-center gap-2">
        <button
          onClick={onRemove}
          disabled={count <= 0}
          className="w-6 h-5 rounded bg-stone-700 text-stone-300 hover:bg-stone-600 disabled:opacity-30 text-xs font-bold leading-none"
        >
          −
        </button>
        <button
          onClick={onAdd}
          className="w-6 h-5 rounded bg-stone-700 text-stone-300 hover:bg-stone-600 text-xs font-bold leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
