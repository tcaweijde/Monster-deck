import { useBoardStore } from '../../store/boardStore';

export function BoardWelcomeScreen() {
  const initNewGame = useBoardStore((s) => s.initNewGame);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-500">Monster Deck</h1>
      <p className="text-gray-400 text-center">The Witcher Old World — Solo Play</p>
      <button
        onClick={initNewGame}
        className="w-full max-w-xs py-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg transition-colors"
      >
        Start New Game
      </button>
    </div>
  );
}
