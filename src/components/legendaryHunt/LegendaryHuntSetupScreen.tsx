import { useState } from 'react';
import type { LegendaryDifficulty } from '../../types';
import { useLegendaryHuntStore } from '../../store/legendaryHuntStore';
import { useWildHuntStore } from '../../store/wildHuntStore';
import { useBoardStore } from '../../store/boardStore';
import { useTrailStore } from '../../store/trailStore';
import { LEGENDARY_MONSTERS } from '../../data/legendary';
import { TrailModeToggle } from '../trail/TrailModeToggle';
import { SkelligeModeToggle } from '../skellige/SkelligeModeToggle';

type Step = 'difficulty' | 'side' | 'monster' | 'confirm';

const DIFFICULTY_OPTIONS: { value: LegendaryDifficulty; label: string; rounds: number; description: string }[] = [
  { value: 'easy',   label: 'Easy',   rounds: 9, description: 'More time to prepare for the boss.' },
  { value: 'normal', label: 'Normal', rounds: 8, description: 'The intended challenge.' },
  { value: 'hard',   label: 'Hard',   rounds: 7, description: 'A gruelling race against time.' },
];

export function LegendaryHuntSetupScreen(): React.JSX.Element {
  const [step, setStep] = useState<Step>('difficulty');
  const [difficulty, setDifficulty] = useState<LegendaryDifficulty>('normal');
  const [side, setSide] = useState<'A' | 'B'>('A');
  const [monsterId, setMonsterId] = useState<string>(LEGENDARY_MONSTERS[0].id);
  const [trailMode, setTrailMode] = useState(false);

  const startCampaign = useLegendaryHuntStore((s) => s.startCampaign);
  const legendaryPhase = useLegendaryHuntStore((s) => s.phase);
  const legendaryRound = useLegendaryHuntStore((s) => s.round);
  const wildHuntPhase = useWildHuntStore((s) => s.phase);
  const initBoard = useBoardStore((s) => s.initNewGame);
  const dagonsLairEnabled = useBoardStore((s) => s.dagonsLairEnabled);
  const enableDagonsLair = useBoardStore((s) => s.enableDagonsLair);
  const disableDagonsLair = useBoardStore((s) => s.disableDagonsLair);

  const resetTrailSession = useTrailStore((s) => s.resetTrailSession);
  const startTrailSession = useTrailStore((s) => s.startTrailSession);

  const handleSkelligeChange = (enabled: boolean) => {
    if (enabled) enableDagonsLair();
    else disableDagonsLair();
  };

  const selectedMonster = LEGENDARY_MONSTERS.find((m) => m.id === monsterId) ?? LEGENDARY_MONSTERS[0];
  const selectedDifficulty = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty)!;
  const isWildHuntActive = wildHuntPhase !== 'inactive';
  const isCampaignActive = legendaryPhase !== 'inactive' && legendaryPhase !== 'setup';

  function handleStart(): void {
    if (isWildHuntActive) return;
    resetTrailSession();
    if (trailMode) startTrailSession();
    initBoard();
    startCampaign(monsterId, difficulty, side, wildHuntPhase);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2d1a0e 0%, #1c1917 60%)' }} />
      <div className="absolute inset-0 bg-amber-950/20" />

      <div className="relative flex flex-col min-h-screen px-4 py-8 max-w-lg mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-amber-400 font-bold text-2xl tracking-wide uppercase">
            Legendary Hunt
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {step === 'difficulty' && 'Choose Difficulty'}
            {step === 'side' && 'Choose Side'}
            {step === 'monster' && 'Choose Your Quarry'}
            {step === 'confirm' && 'Confirm Setup'}
          </p>
        </div>

        {/* Step content */}
        <div className="flex-1 space-y-3">
          {step === 'difficulty' && (
            <DifficultyStep
              selected={difficulty}
              onSelect={setDifficulty}
            />
          )}
          {step === 'side' && (
            <SideStep selected={side} onSelect={setSide} />
          )}
          {step === 'monster' && (
            <MonsterStep selected={monsterId} onSelect={setMonsterId} />
          )}
          {step === 'confirm' && (
            <ConfirmStep
              difficulty={selectedDifficulty}
              side={side}
              monsterName={selectedMonster.name}
              startingLocationName={selectedMonster.startingLocationName}
              roundLimit={selectedDifficulty.rounds}
              isCampaignActive={isCampaignActive}
              currentRound={legendaryRound}
              isWildHuntActive={isWildHuntActive}
              trailMode={trailMode}
              onTrailModeChange={setTrailMode}
              skelligeMode={dagonsLairEnabled}
              onSkelligeModeChange={handleSkelligeChange}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="pt-5 space-y-3">
          {step === 'confirm' ? (
            <button
              onClick={handleStart}
              disabled={isWildHuntActive}
              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold text-base transition-colors active:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Hunt
            </button>
          ) : (
            <button
              onClick={() => setStep(nextStep(step))}
              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold text-base transition-colors active:bg-amber-500"
            >
              Next →
            </button>
          )}

          {step !== 'difficulty' && (
            <button
              onClick={() => setStep(prevStep(step))}
              className="w-full py-2 text-stone-400 text-sm underline underline-offset-2 hover:text-stone-300 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function DifficultyStep({
  selected,
  onSelect,
}: {
  selected: LegendaryDifficulty;
  onSelect: (d: LegendaryDifficulty) => void;
}): React.JSX.Element {
  return (
    <div className="space-y-3">
      {DIFFICULTY_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={[
            'w-full text-left rounded-xl border p-4 transition-colors',
            selected === option.value
              ? 'bg-amber-900/40 border-amber-500 text-stone-100'
              : 'bg-stone-900/60 border-amber-700/40 text-stone-300 hover:border-amber-600',
          ].join(' ')}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-base">{option.label}</span>
            <span className="text-amber-400 text-sm font-medium">{option.rounds} rounds</span>
          </div>
          <p className="text-stone-400 text-sm mt-1">{option.description}</p>
        </button>
      ))}
    </div>
  );
}

function SideStep({
  selected,
  onSelect,
}: {
  selected: 'A' | 'B';
  onSelect: (s: 'A' | 'B') => void;
}): React.JSX.Element {
  const sides: { value: 'A' | 'B'; label: string; protection: string }[] = [
    {
      value: 'A',
      label: 'Side A',
      protection: '0 trophies → 3, 1 → 2, 2 → 1, 3+ → 0',
    },
    {
      value: 'B',
      label: 'Side B',
      protection: '0 trophies → 4, 1 → 3, 2 → 2, 3 → 1, 4+ → 0',
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-stone-400 text-sm">
        Protection reduces damage dealt per attack during the boss fight.
      </p>
      {sides.map((s) => (
        <button
          key={s.value}
          onClick={() => onSelect(s.value)}
          className={[
            'w-full text-left rounded-xl border p-4 transition-colors',
            selected === s.value
              ? 'bg-amber-900/40 border-amber-500 text-stone-100'
              : 'bg-stone-900/60 border-amber-700/40 text-stone-300 hover:border-amber-600',
          ].join(' ')}
        >
          <div className="font-semibold text-base mb-1">{s.label}</div>
          <div className="text-stone-400 text-sm">
            <span className="text-amber-400 font-medium">Trophy Protection: </span>
            {s.protection}
          </div>
        </button>
      ))}
    </div>
  );
}

function MonsterStep({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}): React.JSX.Element {
  return (
    <div className="space-y-3">
      {LEGENDARY_MONSTERS.map((monster) => (
        <button
          key={monster.id}
          onClick={() => onSelect(monster.id)}
          className={[
            'w-full text-left rounded-xl border p-4 transition-colors',
            selected === monster.id
              ? 'bg-amber-900/40 border-amber-500 text-stone-100'
              : 'bg-stone-900/60 border-amber-700/40 text-stone-300 hover:border-amber-600',
          ].join(' ')}
        >
          <div className="font-semibold text-base">{monster.name}</div>
          <div className="text-stone-400 text-sm mt-1">
            Starting location:{' '}
            <span className="text-amber-400">{monster.startingLocationName}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

interface ConfirmStepProps {
  difficulty: { label: string; rounds: number };
  side: 'A' | 'B';
  monsterName: string;
  startingLocationName: string;
  roundLimit: number;
  isCampaignActive: boolean;
  currentRound: number;
  isWildHuntActive: boolean;
  trailMode: boolean;
  onTrailModeChange: (v: boolean) => void;
  skelligeMode: boolean;
  onSkelligeModeChange: (v: boolean) => void;
}

function ConfirmStep({
  difficulty,
  side,
  monsterName,
  startingLocationName,
  roundLimit,
  isCampaignActive,
  currentRound,
  isWildHuntActive,
  trailMode,
  onTrailModeChange,
  skelligeMode,
  onSkelligeModeChange,
}: ConfirmStepProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <div className="bg-stone-900/80 border border-amber-700/40 rounded-xl p-4 space-y-3">
        <SummaryRow label="Difficulty" value={difficulty.label} />
        <SummaryRow label="Side" value={`Side ${side}`} />
        <SummaryRow label="Monster" value={monsterName} />
        <SummaryRow label="Round limit" value={`${roundLimit} rounds`} />
        <SummaryRow label="Starts at" value={startingLocationName} />
      </div>

      <TrailModeToggle enabled={trailMode} onChange={onTrailModeChange} />
      <SkelligeModeToggle enabled={skelligeMode} onChange={onSkelligeModeChange} />

      {isCampaignActive && (
        <div className="bg-amber-900/30 border border-amber-600/40 rounded-xl p-3">
          <p className="text-amber-300 text-sm">
            ⚠ This will overwrite your current campaign (Round {currentRound}).
          </p>
        </div>
      )}

      {isWildHuntActive && (
        <div className="bg-red-900/30 border border-red-600/40 rounded-xl p-3">
          <p className="text-red-300 text-sm">
            ✗ A Wild Hunt run is in progress. Finish or reset it first.
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-400 text-sm">{label}</span>
      <span className="text-stone-100 font-medium text-sm">{value}</span>
    </div>
  );
}

// ─── Step navigation helpers ──────────────────────────────────────────────────

const STEP_ORDER: Step[] = ['difficulty', 'side', 'monster', 'confirm'];

function nextStep(current: Step): Step {
  const index = STEP_ORDER.indexOf(current);
  return STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)];
}

function prevStep(current: Step): Step {
  const index = STEP_ORDER.indexOf(current);
  return STEP_ORDER[Math.max(index - 1, 0)];
}
