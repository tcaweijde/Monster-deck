import { useWildHuntStore } from '../../store/wildHuntStore';
import { useBoardStore } from '../../store/boardStore';
import { getSpawnOutcome } from '../../data/wildHunt/spawnTable';
import { ShieldCounter } from './ShieldCounter';

const STAGE_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Movement & Action',
  2: 'Fight, Meditation & Exploration',
  3: 'Drawing & Gaining Cards',
  4: 'Add Hound & Monster',
};

export function WildHuntBoardScreen() {
  const round = useWildHuntStore((s) => s.round);
  const stage = useWildHuntStore((s) => s.stage);
  const phase = useWildHuntStore((s) => s.phase);
  const wildHuntSlots = useWildHuntStore((s) => s.wildHuntSlots);
  const wildHuntLocationId = useWildHuntStore((s) => s.wildHuntLocationId);
  const shieldCount = useWildHuntStore((s) => s.shieldCount);
  const gainShields = useWildHuntStore((s) => s.gainShields);
  const absorbDamage = useWildHuntStore((s) => s.absorbDamage);
  const houndSlots = useWildHuntStore((s) => s.houndSlots);
  const removeHound = useWildHuntStore((s) => s.removeHound);
  const advanceStage = useWildHuntStore((s) => s.advanceStage);
  const resetWildHunt = useWildHuntStore((s) => s.resetWildHunt);
  const setShowMonsters = useWildHuntStore((s) => s.setShowMonsters);
  const endGame = useBoardStore((s) => s.endGame);

  const isFinalBattle = phase === 'finalBattle';
  const isFinalStage = round === 8 && stage === 4;
  const occupiedSlots = wildHuntSlots.filter((s) => s.status !== 'empty').length;

  function handleEndRun() {
    resetWildHunt();
    endGame();
  }

  const spawnPreview = (): string | null => {
    if (stage !== 4 || isFinalBattle || round >= 8) return null;
    const outcome = getSpawnOutcome(round, occupiedSlots, wildHuntLocationId);
    const parts: string[] = [];
    if (outcome.monsterLevel !== null) {
      parts.push(
        outcome.monsterBlocked
          ? `Board full — Wild Hunt gains +1 shield (instead of L${outcome.monsterLevel} monster)`
          : `Spawn 1× L${outcome.monsterLevel} monster`,
      );
    }
    if (outcome.houndLevel !== null) {
      parts.push(`Spawn 1× L${outcome.houndLevel} hound`);
    }
    return parts.length > 0 ? parts.join('\n') : 'Nothing spawns this round.';
  };

  const stagePrompt = (): string => {
    if (isFinalBattle) return 'The Wild Hunt has arrived. Prepare for the Final Battle.';
    switch (stage) {
      case 1: return 'Move and act on the board.';
      case 2: return `Read Story Card #${round}, then continue.`;
      case 3: return 'Draw and collect your rewards.';
      case 4: return 'Spawning monsters and hounds as shown below, then advance.';
    }
  };

  const advanceLabel = (): string => {
    if (isFinalBattle) return 'Begin Final Battle';
    if (isFinalStage) return 'Begin Final Battle';
    if (stage === 4) return `Begin Round ${round + 1}`;
    return `Advance to Stage ${stage + 1}`;
  };

  const preview = spawnPreview();

  return (
    <div className="h-dvh flex flex-col p-6 gap-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-500">Wild Hunt</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMonsters(true)}
            className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
          >
            View Board
          </button>
          <button
            onClick={handleEndRun}
            className="text-sm text-stone-400 hover:text-red-400 transition-colors"
          >
            End Run
          </button>
        </div>
      </div>

      {/* Round / Stage / Shield indicator */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-lg bg-stone-800 border border-stone-600 p-3 text-center">
          <p className="text-xs text-stone-400 uppercase tracking-wide">Round</p>
          <p className="text-2xl font-bold text-amber-400">{isFinalBattle ? 8 : round}</p>
          <p className="text-xs text-stone-500">of 8</p>
        </div>
        <div className="flex-1 rounded-lg bg-stone-800 border border-stone-600 p-3 text-center">
          <p className="text-xs text-stone-400 uppercase tracking-wide">Stage</p>
          <p className="text-2xl font-bold text-amber-400">{isFinalBattle ? '—' : stage}</p>
          <p className="text-xs text-stone-500">{isFinalBattle ? 'Final Battle' : `of 4`}</p>
        </div>
        <ShieldCounter
          count={shieldCount}
          onAdd={() => gainShields(1)}
          onRemove={() => absorbDamage(1)}
        />
      </div>

      {/* Stage label */}
      {!isFinalBattle && (
        <div className="rounded-lg bg-stone-800 border border-stone-600 px-4 py-2">
          <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Stage {stage}</p>
          <p className="font-semibold text-stone-200">{STAGE_LABELS[stage]}</p>
        </div>
      )}

      {/* Stage prompt */}
      <div
        className={`rounded-lg p-4 border ${
          isFinalBattle
            ? 'bg-red-950/40 border-red-800 text-red-200'
            : 'bg-stone-900/60 border-stone-700 text-stone-300'
        }`}
      >
        <p className="text-sm leading-relaxed">{stagePrompt()}</p>
      </div>

      {/* Stage 4 spawn preview */}
      {preview !== null && (
        <div className="rounded-lg bg-amber-950/30 border border-amber-800/50 p-4">
          <p className="text-xs text-amber-500 uppercase tracking-wide mb-2 font-semibold">
            Spawn This Round
          </p>
          {preview.split('\n').map((line, i) => (
            <p key={i} className="text-sm text-amber-200 leading-relaxed">{line}</p>
          ))}
        </div>
      )}

            {preview !== null && (
        <div className="rounded-lg bg-amber-950/30 border border-amber-800/50 p-4">
          <p className="text-xs text-amber-500 uppercase tracking-wide mb-2 font-semibold">
            The Wild hunt moves up to 2 locations towards the player and activates it's ability.
          </p>
        </div>
      )}

            {/* Active hounds */}
            {houndSlots.length > 0 && (
              <div className="rounded-lg bg-stone-800 border border-stone-600 p-4 space-y-2">
                <p className="text-xs text-stone-400 uppercase tracking-wide font-semibold">
                  Active Hounds ({houndSlots.length}/3)
                </p>
                {houndSlots.map((hound) => (
                  <div
                    key={hound.id}
                    className="flex items-center justify-between bg-stone-900/60 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🐺</span>
                      <span className="text-stone-200 font-semibold">Hound</span>
                      <span className="text-xs bg-red-800/60 text-red-300 border border-red-700/50 rounded px-1.5 py-0.5 font-bold">
                        Lv.{hound.level}
                      </span>
                    </div>
                    <button
                      onClick={() => removeHound(hound.id)}
                      className="text-xs text-stone-400 hover:text-red-400 border border-stone-600 hover:border-red-700 rounded px-2 py-1 transition-colors"
                    >
                      Defeated
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1" />

      {/* Advance button */}
      {!isFinalBattle && (
        <button
          onClick={advanceStage}
          className={`w-full py-4 rounded-lg font-bold text-base transition-colors ${
            isFinalStage
              ? 'bg-red-700 hover:bg-red-600 text-white'
              : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          {advanceLabel()}
        </button>
      )}

      {isFinalBattle && (
        <div className="space-y-3">
          <p className="text-center text-xs text-stone-500">
            Boss fight coming in a future update.
          </p>
          <button
            onClick={handleEndRun}
            className="w-full py-4 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold transition-colors"
          >
            End Run
          </button>
        </div>
      )}
    </div>
  );
}
