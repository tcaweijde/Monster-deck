import { useState } from 'react';
import { useWildHuntStore } from '../../store/wildHuntStore';
import { useEncounterStore } from '../../store/encounterStore';
import { useBoardStore } from '../../store/boardStore';
import { getSpawnOutcome } from '../../data/wildHunt/spawnTable';
import { getWildHuntCharacterById } from '../../data/wildHunt/characters';
import { buildBossMonster } from '../../data/wildHunt/bossMonster';
import { ShieldCounter } from './ShieldCounter';
import { HoundCombatModal } from './HoundCombatModal';
import type { HoundSlot } from '../../types/wildHunt';

const BASE = import.meta.env.BASE_URL ?? '/';
const BG = `${BASE}images/monsters/wild-hunt/background.jpg`;

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
  const advanceStage = useWildHuntStore((s) => s.advanceStage);

  const [activeHound, setActiveHound] = useState<HoundSlot | null>(null);
  const [confirmingBattle, setConfirmingBattle] = useState(false);
  const resetWildHunt = useWildHuntStore((s) => s.resetWildHunt);
  const setShowMonsters = useWildHuntStore((s) => s.setShowMonsters);
  const characterId = useWildHuntStore((s) => s.characterId);
  const startEncounterWithMonster = useEncounterStore((s) => s.startEncounterWithMonster);
  const endGame = useBoardStore((s) => s.endGame);

  const isFinalBattle = phase === 'finalBattle';
  const isFinalStage = round === 8 && stage === 4;
  const occupiedSlots = wildHuntSlots.filter((s) => s.status !== 'empty').length;

  function handleEndRun() {
    resetWildHunt();
    endGame();
  }

  function handleBeginFinalBattle(playerFirst = false) {
    if (!characterId) return;
    const character = getWildHuntCharacterById(characterId);
    if (!character) return;
    const bossMonster = buildBossMonster(character);
    startEncounterWithMonster(bossMonster, playerFirst);
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
      case 3: return 'Draw cards and train.';
      case 4: return 'Spawning monsters and hounds as shown below.';
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
    <div className="relative h-dvh overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }} />
      <div className="absolute inset-0 bg-stone-950/80" />

      <div className="relative h-full flex flex-col p-6 gap-6 max-w-lg mx-auto overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400">Wild Hunt</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMonsters(true)}
              className="text-sm text-stone-400 hover:text-cyan-400 transition-colors"
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
          <div className="flex-1 rounded-lg bg-stone-900/80 border border-stone-700 p-3 text-center">
            <p className="text-xs text-stone-400 uppercase tracking-wide">Round</p>
            <p className="text-2xl font-bold text-cyan-400">{isFinalBattle ? 8 : round}</p>
            <p className="text-xs text-stone-500">of 8</p>
          </div>
          <div className="flex-1 rounded-lg bg-stone-900/80 border border-stone-700 p-3 text-center">
            <p className="text-xs text-stone-400 uppercase tracking-wide">Stage</p>
            <p className="text-2xl font-bold text-cyan-400">{isFinalBattle ? '—' : stage}</p>
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
          <div className="rounded-lg bg-stone-900/80 border border-stone-700 px-4 py-2">
            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Stage {stage}</p>
            <p className="font-semibold text-stone-200">{STAGE_LABELS[stage]}</p>
          </div>
        )}

        {/* Stage prompt */}
        <div
          className={`rounded-lg p-4 border ${
            isFinalBattle
              ? 'bg-red-950/50 border-red-800 text-red-200'
              : 'bg-stone-900/70 border-stone-700 text-stone-300'
          }`}
        >
          <p className="text-sm leading-relaxed">{stagePrompt()}</p>
        </div>

        {/* Stage 4 spawn preview */}
        {preview !== null && (
          <div className="rounded-lg bg-blue-950/40 border border-blue-800/50 p-4">
            <p className="text-xs text-cyan-500 uppercase tracking-wide mb-2 font-semibold">
              Spawn This Round
            </p>
            {preview.split('\n').map((line, i) => (
              <p key={i} className="text-sm text-cyan-200 leading-relaxed">{line}</p>
            ))}
          </div>
        )}

        {preview !== null && (
          <div className="rounded-lg bg-blue-950/40 border border-blue-800/50 p-4">
            <p className="text-xs text-cyan-500 uppercase tracking-wide mb-2 font-semibold">
              Wild Hunt Movement
            </p>
            <p className="text-sm text-cyan-200">
              The Wild Hunt moves up to 2 locations towards the player and activates its ability.
            </p>
          </div>
        )}

        {/* Active hounds */}
        {houndSlots.length > 0 && (
          <div className="rounded-lg bg-stone-900/80 border border-stone-700 p-4 space-y-2">
            <p className="text-xs text-stone-400 uppercase tracking-wide font-semibold">
              Active Hounds ({houndSlots.length})
            </p>
            {houndSlots.map((hound) => (
              <button
                key={hound.id}
                onClick={() => setActiveHound(hound)}
                className="relative w-full h-16 rounded-lg overflow-hidden flex items-center px-3 gap-2 text-left"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-top"
                  style={{ backgroundImage: `url(${BASE}images/monsters/wild-hunt/hound/${hound.level}.jpg)` }}
                />
                <div className="absolute inset-0 bg-stone-950/50" />
                {/* Content */}
                <span className="relative text-xs bg-red-800/70 text-red-200 border border-red-600/60 rounded px-1.5 py-0.5 font-bold">
                  Lv.{hound.level}
                </span>
                <span className="relative text-xs text-stone-300 font-semibold">Tap to fight</span>
              </button>
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
                : 'bg-blue-700 hover:bg-blue-600 text-white'
            }`}
          >
            {advanceLabel()}
          </button>
        )}

        {isFinalBattle && (
          <div className="space-y-3">
            <button
              onClick={() => setConfirmingBattle(true)}
              className="w-full py-4 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-lg transition-colors"
            >
              ⚔️ Begin Final Battle
            </button>
          </div>
        )}

        {/* Location confirmation modal */}
        {confirmingBattle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-stone-950/80" onPointerDown={(e) => { e.preventDefault(); setConfirmingBattle(false); }} />
            <div className="relative bg-stone-900 border border-red-800 rounded-2xl p-6 space-y-4 max-w-sm w-full text-center">
              <h2 className="text-xl font-bold text-red-300">Final Battle</h2>
              <p className="text-stone-300 text-sm">
                Are you at the Wild Hunt's location on the board?
              </p>
              <p className="text-stone-500 text-xs">
                You must be on the same space as the Wild Hunt to begin this fight.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setConfirmingBattle(false); handleBeginFinalBattle(false); }}
                  className="flex-1 py-2.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300 font-semibold text-sm transition-colors"
                >
                  Not yet
                </button>
                <button
                  onClick={() => { setConfirmingBattle(false); handleBeginFinalBattle(true); }}
                  className="flex-1 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-sm transition-colors"
                >
                  Yes, begin!
                </button>
              </div>
            </div>
          </div>
        )}

        {activeHound && (
          <HoundCombatModal
            hound={activeHound}
            onClose={() => setActiveHound(null)}
          />
        )}
      </div>
    </div>
  );
}

