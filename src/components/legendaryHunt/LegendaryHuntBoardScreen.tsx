import { useEffect, useState } from 'react';
import { useLegendaryHuntStore } from '../../store/legendaryHuntStore';
import { useBoardStore } from '../../store/boardStore';
import { useEncounterStore } from '../../store/encounterStore';
import { useTrailStore } from '../../store/trailStore';
import { LEGENDARY_MONSTERS } from '../../data/legendary';
import { getMonsterById } from '../../data/monsters';
import { makeDefaultTrailCards } from '../../engine/trail';
import { DestructionTokenCounter } from './DestructionTokenCounter';
import { MovementCardDisplay } from './MovementCardDisplay';
import { TrailPreFightModal } from '../trail/TrailPreFightModal';
import type { PlacedWeaknessToken, TrailCard } from '../../types';
import type { TrailDeckOptions } from '../../engine/deck';

export function LegendaryHuntBoardScreen(): React.JSX.Element {
  const round = useLegendaryHuntStore((s) => s.round);
  const stage = useLegendaryHuntStore((s) => s.stage);
  const roundLimit = useLegendaryHuntStore((s) => s.roundLimit);
  const destructionTokenCount = useLegendaryHuntStore((s) => s.destructionTokenCount);
  const currentMovementCard = useLegendaryHuntStore((s) => s.currentMovementCard);
  const legendaryMonsterId = useLegendaryHuntStore((s) => s.legendaryMonsterId);
  const advanceStage = useLegendaryHuntStore((s) => s.advanceStage);
  const doDrawMovementCard = useLegendaryHuntStore((s) => s.drawMovementCard);
  const goToBossPrep = useLegendaryHuntStore((s) => s.goToBossPrep);
  const resetCampaign = useLegendaryHuntStore((s) => s.resetCampaign);

  const slots = useBoardStore((s) => s.board?.slots);
  const setActiveSlot = useBoardStore((s) => s.setActiveSlot);
  const endGame = useBoardStore((s) => s.endGame);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  const trailModeEnabled = useTrailStore((s) => s.trailModeEnabled);
  const weaknessTokensHeld = useTrailStore((s) => s.weaknessTokensHeld);
  const setPendingEffect = useTrailStore((s) => s.setPendingEffect);
  const clearPendingEffect = useTrailStore((s) => s.clearPendingEffect);

  const [pendingSlotIndex, setPendingSlotIndex] = useState<0 | 1 | 2 | null>(null);

  function handleSelectSlot(index: 0 | 1 | 2): void {
    if (trailModeEnabled) {
      setPendingSlotIndex(index);
    } else {
      const slot = slots?.[index];
      if (!slot) return;
      setActiveSlot(index);
      startEncounter(slot.monsterId);
    }
  }

  function handlePreFightConfirm(token: PlacedWeaknessToken | null): void {
    if (pendingSlotIndex === null) return;
    const slot = slots?.[pendingSlotIndex];
    if (!slot) return;
    const monster = getMonsterById(slot.monsterId);

    if (token) setPendingEffect(token);

    const trailCards: [TrailCard, TrailCard, TrailCard, TrailCard] | null =
      trailModeEnabled && monster
        ? (monster.trailCards ?? makeDefaultTrailCards(monster))
        : null;
    const trailDeckOpts: TrailDeckOptions | undefined = trailCards ? { trailCards } : undefined;

    setActiveSlot(pendingSlotIndex);
    startEncounter(slot.monsterId, false, 0, trailDeckOpts, trailCards);
    clearPendingEffect();
    setPendingSlotIndex(null);
  }

  const legendaryMonster =
    LEGENDARY_MONSTERS.find((m) => m.id === legendaryMonsterId);

  // Draw movement card when stage 4 begins
  useEffect(() => {
    if (stage === 4) {
      doDrawMovementCard();
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const isOvertime = round > roundLimit;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 " style={{ background: 'linear-gradient(160deg, #2d1a0e 0%, #1c1917 60%)' }} />
      <div className="absolute inset-0 bg-amber-950/20" />

      <div className="relative flex flex-col min-h-screen max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-3 border-b border-amber-700/40">
          <div>
            <h1 className="text-amber-400 font-bold text-lg tracking-wide uppercase">
              Legendary Hunt
            </h1>
            <p className="text-stone-400 text-sm">
              Round <span className="text-stone-200 font-semibold">{round}</span>
              {' / '}
              <span className="text-stone-200 font-semibold">{roundLimit}</span>
              {isOvertime && (
                <span className="ml-2 text-amber-500 font-semibold text-xs uppercase tracking-wide">
                  Overtime
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-stone-900/80 border border-amber-700/40 rounded-lg px-3 py-1.5">
            <span className="text-stone-400 text-xs">Tokens</span>
            <span className="text-amber-300 font-bold text-base">{destructionTokenCount}</span>
          </div>
        </div>

        {/* Stage content */}
        <div className="flex-1 px-4 py-5 space-y-5 overflow-y-auto">
          {stage === 1 && <StageOne />}
          {stage === 2 && (
            <StageTwo
              slots={slots}
              onSelectSlot={handleSelectSlot}
              legendaryMonsterName={legendaryMonster!.name}
              onFightLegendary={goToBossPrep}
            />
          )}
          {stage === 3 && <StageThree />}
          {stage === 4 && (
            <StageFour currentMovementCard={currentMovementCard} />
          )}
        </div>

        {/* Footer actions */}
        <div className="px-4 pb-8 pt-3 space-y-3 border-t border-amber-700/40">
          <button
            onClick={advanceStage}
            className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold text-base transition-colors active:bg-amber-500"
          >
            {stage === 4 ? 'Complete Round' : 'Next Stage →'}
          </button>

          <button
            onClick={() => { resetCampaign(); endGame(); }}
            className="w-full py-2 text-stone-500 text-sm underline underline-offset-2 hover:text-stone-400 transition-colors"
          >
            Concede Hunt
          </button>
        </div>
      </div>
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

function StageOne(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <StageBadge stage={1} />
      <h2 className="text-amber-400 font-bold text-xl">Phase 1 — Movement</h2>
      <p className="text-stone-300 text-sm leading-relaxed">
        Claim any destruction tokens from locations the Legendary monster departed during its
        last move.
      </p>
      <DestructionTokenCounter />
    </div>
  );
}

interface StageTwoProps {
  slots: readonly { monsterId: string; level: 1 | 2 | 3; status: string }[] | undefined;
  onSelectSlot: (index: 0 | 1 | 2) => void;
  legendaryMonsterName: string;
  onFightLegendary: () => void;
}

function StageTwo({ slots, onSelectSlot, legendaryMonsterName, onFightLegendary }: StageTwoProps): React.JSX.Element {
  const activeSlots = slots
    ? slots
        .map((slot, index) => ({ slot, index: index as 0 | 1 | 2 }))
        .filter(({ slot }) => slot.status === 'active')
    : [];

  return (
    <div className="space-y-4">
      <StageBadge stage={2} />
      <h2 className="text-amber-400 font-bold text-xl">Phase 2 — Fight / Meditate / Explore</h2>
      <p className="text-stone-300 text-sm leading-relaxed">
        Complete your actions. You may fight a board monster, meditate, or explore.
      </p>

      <div className="space-y-2">
        <p className="text-stone-400 text-xs uppercase tracking-wider">Legendary Monster</p>
        <button
          onClick={onFightLegendary}
          className="w-full flex items-center justify-between bg-amber-900/30 border border-amber-600/60 rounded-xl px-4 py-3 text-left hover:border-amber-400 hover:bg-amber-900/50 transition-colors active:bg-amber-900/70"
        >
          <div>
            <span className="text-amber-200 font-semibold">{legendaryMonsterName}</span>
            <p className="text-amber-500/80 text-xs mt-0.5">Challenge the boss</p>
          </div>
          <span className="text-amber-400 text-sm font-semibold">Level 4 ⚔</span>
        </button>
      </div>

      {activeSlots.length > 0 && (
        <div className="space-y-2">
          <p className="text-stone-400 text-xs uppercase tracking-wider">Board Monsters</p>
          {activeSlots.map(({ slot, index }) => (
            <button
              key={`slot-${index}`}
              onClick={() => onSelectSlot(index)}
              className="w-full flex items-center justify-between bg-stone-900/80 border border-amber-700/40 rounded-xl px-4 py-3 text-left hover:border-amber-500 transition-colors active:bg-stone-800"
            >
              <span className="text-stone-200 font-medium">{slot.monsterId}</span>
              <span className="text-amber-400 text-sm font-semibold">Level {slot.level}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StageThree(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <StageBadge stage={3} />
      <h2 className="text-amber-400 font-bold text-xl">Phase 3 — Training</h2>
      <p className="text-stone-300 text-sm leading-relaxed">
        Complete training and any remaining physical upkeep.
      </p>
    </div>
  );
}

interface StageFourProps {
  currentMovementCard: import('../../types').MovementCard | null;
}

function StageFour({ currentMovementCard }: StageFourProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <StageBadge stage={4} />
      <h2 className="text-amber-400 font-bold text-xl">End of Round — Legendary Monster Moves</h2>

      <MovementCardDisplay card={currentMovementCard} />

      <div className="bg-stone-900/60 border border-amber-800/30 rounded-xl p-4">
        <p className="text-stone-300 text-sm leading-relaxed">
          <span className="text-amber-400 font-semibold">Destruction tokens: </span>
          Place one physical destruction token at each location the monster departed (not the
          landing spot).
        </p>
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: 1 | 2 | 3 | 4 }): React.JSX.Element {
  return (
    <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 rounded-lg px-3 py-1">
      <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
        Stage {stage} of 4
      </span>
    </div>
  );
}
