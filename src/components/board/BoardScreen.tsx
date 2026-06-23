import { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { useEncounterStore } from '../../store/encounterStore';
import { useTrailStore } from '../../store/trailStore';
import { MONSTERS, dagon } from '../../data/monsters';
import { getMonsterById } from '../../data/monsters';
import { BoardSlotCard } from './BoardSlotCard';
import { TrailTokenBoard } from '../trail/TrailTokenBoard';
import { TrailPreFightModal } from '../trail/TrailPreFightModal';
import type { PlacedWeaknessToken, TrailCard } from '../../types';
import type { TrailDeckOptions } from '../../engine/deck';
import { makeDefaultTrailCards } from '../../engine/trail';
import { shuffle } from '../../engine/shuffle';

export function BoardScreen() {
  const board = useBoardStore((s) => s.board);
  const setActiveSlot = useBoardStore((s) => s.setActiveSlot);
  const setActivePermanentSlot = useBoardStore((s) => s.setActivePermanentSlot);
  const setRandomEncounterActive = useBoardStore((s) => s.setRandomEncounterActive);
  const endGame = useBoardStore((s) => s.endGame);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  const trailModeEnabled = useTrailStore((s) => s.trailModeEnabled);
  const weaknessTokensHeld = useTrailStore((s) => s.weaknessTokensHeld);
  const setPendingEffect = useTrailStore((s) => s.setPendingEffect);

  const [pendingSlotIndex, setPendingSlotIndex] = useState<0 | 1 | 2 | null>(null);

  if (!board) return null;

  const boardMonsterIds = new Set([
    ...board.slots.map((s) => s.monsterId),
    dagon.id,
  ]);

  const randomEncounterCandidates = MONSTERS.filter((m) => !boardMonsterIds.has(m.id));

  const getMonsterName = (id: string) =>
    id === dagon.id ? dagon.name : (MONSTERS.find((m) => m.id === id)?.name ?? id);

  const handleSlotTap = (index: 0 | 1 | 2) => {
    if (trailModeEnabled) {
      setPendingSlotIndex(index);
    } else {
      setActiveSlot(index);
      startEncounter(board.slots[index].monsterId);
    }
  };

  const handlePermanentSlotTap = () => {
    setActivePermanentSlot();
    startEncounter(dagon.id);
  };

  const handleRandomEncounter = () => {
    if (randomEncounterCandidates.length === 0) return;
    const monster = shuffle(randomEncounterCandidates)[0];
    setRandomEncounterActive();
    startEncounter(monster.id);
  };

  const handlePreFightConfirm = (token: PlacedWeaknessToken | null) => {
    if (pendingSlotIndex === null) return;
    const slot = board.slots[pendingSlotIndex];
    const monster = getMonsterById(slot.monsterId);

    if (token) setPendingEffect(token);

    // Always use trail cards in trail mode — authored data if available, otherwise defaults.
    const trailCards: [TrailCard, TrailCard, TrailCard, TrailCard] | null = trailModeEnabled && monster
      ? (monster.trailCards ?? makeDefaultTrailCards())
      : null;

    const trailDeckOpts: TrailDeckOptions | undefined = trailCards
      ? { trailCards }
      : undefined;

    setActiveSlot(pendingSlotIndex);
    startEncounter(
      slot.monsterId,
      false,
      0,
      trailDeckOpts,
      trailCards,
    );
    setPendingSlotIndex(null);
  };

  return (
    <div className="h-dvh flex flex-col p-6 gap-4 max-w-lg mx-auto overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-500">Board</h1>
        <button
          onClick={endGame}
          className="text-sm text-stone-400 hover:text-red-400 transition-colors"
        >
          End Game
        </button>
      </div>
      <p className="text-sm text-stone-400">Tap a monster to begin the encounter.</p>
      <div className="flex flex-col gap-3">
        {board.slots.map((slot, i) => (
          <BoardSlotCard
            key={i}
            slot={slot}
            monsterName={getMonsterName(slot.monsterId)}
            onStartEncounter={() => handleSlotTap(i as 0 | 1 | 2)}
          />
        ))}
        {board.permanentSlot && (
          <BoardSlotCard
            slot={board.permanentSlot}
            monsterName={dagon.name}
            onStartEncounter={handlePermanentSlotTap}
            permanent
          />
        )}
      </div>

      <button
        onClick={handleRandomEncounter}
        disabled={randomEncounterCandidates.length === 0}
        className="w-full rounded-xl border-2 border-dashed border-stone-600 hover:border-amber-500 disabled:border-stone-700 disabled:opacity-40 py-3 text-sm font-semibold text-stone-300 hover:text-amber-400 disabled:text-stone-500 transition-colors"
      >
        ⚔ Random Encounter
      </button>

      {trailModeEnabled && <TrailTokenBoard />}

      {pendingSlotIndex !== null && (
        <TrailPreFightModal
          heldTokens={weaknessTokensHeld}
          onConfirm={handlePreFightConfirm}
          onCancel={() => setPendingSlotIndex(null)}
        />
      )}
    </div>
  );
}
