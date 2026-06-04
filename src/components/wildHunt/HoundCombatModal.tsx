import { useState } from 'react';
import { useWildHuntStore } from '../../store/wildHuntStore';
import type { HoundSlot } from '../../types/wildHunt';

const BASE = import.meta.env.BASE_URL ?? '/';
const HOUND_IMG = `${BASE}images/monsters/wild-hunt/hound/1.jpg`;

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
  const [damageInput, setDamageInput] = useState('');
  const [result, setResult] = useState<CombatResult | null>(null);

  const threshold = THRESHOLD[hound.level];

  function handleResolve() {
    const damage = parseInt(damageInput, 10);
    if (isNaN(damage) || damage < 0) return;
    const res = resolveHoundCombat(hound.id, damage);
    setResult(res);
    setPhase('result');
  }

  return (
    <div className="fixed inset-0 bg-stone-950/85 flex items-center justify-center z-50 p-6">
      <div className="bg-stone-800 border-2 border-red-700/70 rounded-2xl p-6 w-full max-w-sm space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            src={HOUND_IMG}
            alt="Hound"
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <h2 className="text-xl font-bold text-red-300">Hound Combat</h2>
            <p className="text-xs text-stone-400">Level {hound.level} — threshold: {threshold} damage</p>
          </div>
        </div>

        {/* Phase: pre-attack reminder */}
        {phase === 'reminder' && (
          <>
            <div className="rounded-lg bg-amber-950/40 border border-amber-700/50 p-4 space-y-2">
              <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold">⚔️ Pre-Attack Bonus</p>
              <p className="text-sm text-amber-100">
                Before declaring your combo, apply the <strong>pre-attack bonus</strong> from your Wild Hunt
                character card (check your physical card for the exact bonus).
              </p>
            </div>
            <div className="rounded-lg bg-stone-700/40 border border-stone-600 p-4 space-y-2 text-sm text-stone-300">
              <p>
                Deal at least <span className="text-white font-bold">{threshold} damage</span> to defeat
                this Lv.{hound.level} hound.
              </p>
              <p>
                Any <span className="text-red-300 font-semibold">excess damage</span> above {threshold} will
                reduce the Wild Hunt's shields by that amount.
              </p>
            </div>
            <button
              onClick={() => setPhase('input')}
              className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold transition-colors"
            >
              Declare Damage
            </button>
          </>
        )}

        {/* Phase: damage input */}
        {phase === 'input' && (
          <>
            <div className="rounded-lg bg-stone-700/40 border border-stone-600 p-4 space-y-1 text-sm text-stone-300">
              <p>Defeat threshold: <span className="text-white font-bold">{threshold}</span></p>
              <p>Excess damage beyond {threshold} removes Wild Hunt shields.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-stone-400">Total combo damage dealt:</label>
              <input
                type="number"
                min={0}
                value={damageInput}
                onChange={(e) => setDamageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
                className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-3 text-2xl font-bold text-white text-center focus:outline-none focus:border-amber-500"
                placeholder="0"
                autoFocus
              />
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
                disabled={damageInput === ''}
                className="flex-1 py-3 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-bold transition-colors"
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
                <div className="rounded-lg bg-green-900/40 border border-green-700/50 p-4 text-center space-y-1">
                  <p className="text-2xl">✅</p>
                  <p className="text-green-300 font-bold text-lg">Hound Defeated!</p>
                </div>
                {result.excessDamage > 0 ? (
                  <div className="rounded-lg bg-red-900/30 border border-red-700/50 p-3 text-sm text-red-200 text-center">
                    🛡️ Wild Hunt loses <span className="font-bold">{result.excessDamage} shield{result.excessDamage !== 1 ? 's' : ''}</span> from excess damage.
                  </div>
                ) : (
                  <p className="text-center text-sm text-stone-400">No excess damage — shields unaffected.</p>
                )}
                <div className="rounded-lg bg-amber-950/30 border border-amber-700/40 p-3 text-sm text-amber-200">
                  <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold mb-1">Reward</p>
                  <p>Draw your reward from the physical expansion reward table.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-stone-700/40 border border-stone-600 p-4 text-center space-y-2">
                <p className="text-2xl">💨</p>
                <p className="text-stone-200 font-bold">Hound Survives</p>
                <p className="text-sm text-stone-400">
                  Damage was below the threshold of {threshold}. The hound remains.
                </p>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold transition-colors"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
