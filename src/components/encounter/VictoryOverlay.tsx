interface VictoryOverlayProps {
  monsterName: string;
  onClose: () => void;
}

export function VictoryOverlay({ monsterName, onClose }: VictoryOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-6">
      <div className="bg-gray-800 border-2 border-amber-500 rounded-2xl p-8 text-center space-y-6 max-w-sm">
        <h2 className="text-3xl font-bold text-amber-400">Victory!</h2>
        <p className="text-gray-300 text-lg">{monsterName} defeated</p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg transition-colors"
        >
          Return to Board
        </button>
      </div>
    </div>
  );
}
