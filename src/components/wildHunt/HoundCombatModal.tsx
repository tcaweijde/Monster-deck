import { useState } from 'react';
import { useWildHuntStore } from '../../store/wildHuntStore';
import type { HoundSlot } from '../../types/wildHunt';
import { getRandomHoundReward, type HoundReward } from '../../data/wildHunt/houndRewards';

const BASE = import.meta.env.BASE_URL ?? '/';
const PLAYER_COUNT = 1; // solo — update when multi-player support is added

const THRESHOLD: Record<1 | 2 | 3, number> = { 1: 2, 2: 3, 3: 4 };

interface HoundCombatModalProps {
  hound: HoundSlot;
  onClose: () => void;
}

type Phase = 'reminder' | 'input' | 'result';

interface CombatResult {
  defeated: boolean;
  excessDamage: number;
}

export function HoundCombatModal({ hound, onClose }: HoundCombatModalProps) {
  const resolveHoundCombat = useWildHuntStore((s) => s.resolveHoundCombat);
  const [phase, setPhase] = useState<Phase>('reminder');
  const [damage, setDamage] = useState(0);
  const [result, setResult] = useState<CombatResult | null>(null);
  const [reward, setReward] = useState<HoundReward | null>(null);

  const threshold = THRESHOLD[hound.level];
  const houndBg = `${BASE}images/monsters/wild-hunt/hound/${hound.level}.jpg`;
  const overviewImg = `${BASE}images/monsters/wild-hunt/hound/hound-overview-${PLAYER_COUNT}.png`;

  function handleResolve() {
    const res = resolveHoundCombat(hound.id, damage);
    setResult(res);
    if (res.defeated) setReward(getRandomHoundReward(hound.level));
    setPhase('result');
  }

  return (
    <div
      className="fixed inset-0 bg-stone-950/80 flex items-end justify-center z-50 p-4 pb-8"
      onPointerDown={(e) => { e.preventDefault(); onClose(); }}
    >
      {/* Card — stop propagation so inner taps don't close */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-cyan-700/60"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-cover bg-top" style={{ backgroundImage: `url(${houndBg})` }} />
        <div className="absolute inset-0 bg-stone-950/80" />

        {/* Content */}
        <div className="relative p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-cyan-300">Hound Combat</h2>
              <p className="text-xs text-stone-400">Level {hound.level} — defeat at {threshold}+ damage</p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-300 text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Phase: pre-attack reminder */}
          {phase === 'reminder' && (
            <>
              <div className="rounded-xl overflow-hidden border border-cyan-800/50">
                <img
                  src={overviewImg}
                  alt="Pre-attack bonus overview"
                  className="w-full object-cover"
                />
              </div>
              <div className="rounded-lg bg-stone-900/70 border border-cyan-800/40 p-3 text-sm text-stone-300 space-y-1">
                <p>
                  Any <span className="text-red-300 font-semibold">excess damage</span> beyond
                  the threshold reduces the Wild Hunt's shields.
                </p>
              </div>
              <button
                onClick={() => setPhase('input')}
                className="w-full py-3 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold transition-colors"
              >
                Declare Damage
              </button>
            </>
          )}

          {/* Phase: damage input */}
          {phase === 'input' && (
            <>
              <div className="rounded-lg bg-stone-900/70 border border-stone-600 p-4 space-y-1 text-sm text-stone-300">
                <p>Defeat threshold: <span className="text-white font-bold">{threshold}</span></p>
                <p>Excess damage beyond {threshold} removes Wild Hunt shields.</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-stone-400 text-center">Total combo damage dealt:</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setDamage((n) => Math.max(0, n - 1))}
                    disabled={damage === 0}
                    className="w-12 h-12 rounded-lg bg-stone-700 hover:bg-stone-600 disabled:opacity-30 text-white text-2xl font-bold transition-colors"
                  >
                    −
                  </button>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">{damage}</p>
                    {damage >= threshold && (
                      <p className="text-xs text-cyan-400 mt-1">
                        +{damage - threshold} excess → {damage - threshold} shield{damage - threshold !== 1 ? 's' : ''} lost
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setDamage((n) => n + 1)}
                    className="w-12 h-12 rounded-lg bg-stone-700 hover:bg-stone-600 text-white text-2xl font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPhase('reminder')}
                  className="flex-1 py-3 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleResolve}
                  className="flex-1 py-3 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold transition-colors"
                >
                  Resolve
                </button>
              </div>
            </>
          )}

          {/* Phase: result */}
          {phase === 'result' && result && (
            <>
              {result.defeated ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-cyan-900/30 border border-cyan-700/50 p-4 text-center space-y-1">
                    <p className="text-cyan-300 font-bold text-lg">Hound Defeated!</p>
                  </div>
                  {result.excessDamage > 0 ? (
                    <div className="rounded-lg bg-red-900/30 border border-red-700/50 p-3 text-sm text-red-200 text-center">
                      Wild Hunt loses <span className="font-bold">{result.excessDamage} shield{result.excessDamage !== 1 ? 's' : ''}</span> from excess damage.
                    </div>
                  ) : (
                    <p className="text-center text-sm text-stone-400">No excess damage — shields unaffected.</p>
                  )}
                  {reward && (
                    <div className="rounded-lg bg-stone-900/70 border border-amber-700/40 p-4 space-y-2">
                      <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold">Reward</p>
                      <p className="text-sm text-stone-300 leading-relaxed">{reward.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-stone-900/60 border border-stone-600 p-4 text-center space-y-2">
                  <p className="text-2xl">💨</p>
                  <p className="text-stone-200 font-bold">Hound Survives</p>
                  <p className="text-sm text-stone-400">
                    Damage was below the threshold of {threshold}. The hound remains.
                  </p>
                </div>
              )}
            </>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
