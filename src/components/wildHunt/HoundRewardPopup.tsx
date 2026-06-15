import type { HoundReward } from '../../data/wildHunt/houndRewards';

interface HoundRewardPopupProps {
  reward: HoundReward;
  houndLevel: 1 | 2 | 3;
  onClose: () => void;
}

export function HoundRewardPopup({ reward, houndLevel, onClose }: HoundRewardPopupProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-lg bg-amber-900/30 border border-amber-600/50 p-4 text-center space-y-1">
        <p className="text-2xl">🎁</p>
        <p className="text-amber-300 font-bold text-lg">Reward Earned!</p>
        <p className="text-xs text-stone-400">Level {houndLevel} Hound</p>
      </div>

      {/* Reward card */}
      <div className="rounded-lg bg-stone-900/70 border border-amber-700/40 p-4 space-y-2">
        <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold">Your Reward</p>
        <p className="text-sm text-stone-300 leading-relaxed">{reward.description}</p>
      </div>

      {/* Back to gameboard */}
      <button
        onClick={onClose}
        className="w-full py-3 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-bold transition-colors"
      >
        Back to Gameboard
      </button>
    </div>
  );
}
