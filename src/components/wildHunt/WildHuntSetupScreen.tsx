import { useState } from 'react';
import { useWildHuntStore } from '../../store/wildHuntStore';
import { WILD_HUNT_CHARACTERS } from '../../data/wildHunt/characters';
import type { WildHuntDifficulty } from '../../types/wildHunt';

const BASE = import.meta.env.BASE_URL ?? '/';
const BG = `${BASE}images/monsters/wild-hunt/background.jpg`;

type Step = 'difficulty' | 'character';

const DIFFICULTIES: { value: WildHuntDifficulty; label: string; detail: string }[] = [
  { value: 'easy',      label: 'Easy',      detail: '1× L1 monster · 5 shields' },
  { value: 'normal',    label: 'Normal',    detail: '1× L1 monster · 7 shields' },
  { value: 'hard',      label: 'Hard',      detail: '1× L2 monster · 9 shields' },
  { value: 'very-hard', label: 'Very Hard', detail: '1× L3 monster · 11 shields' },
];

export function WildHuntSetupScreen() {
  const [step, setStep] = useState<Step>('difficulty');
  const [difficulty, setDifficulty] = useState<WildHuntDifficulty>('normal');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    WILD_HUNT_CHARACTERS[0].id,
  );

  const startWildHunt = useWildHuntStore((s) => s.startWildHunt);
  const confirmSetup = useWildHuntStore((s) => s.confirmSetup);
  const resetWildHunt = useWildHuntStore((s) => s.resetWildHunt);
  const initWildHuntBoard = useWildHuntStore((s) => s.initWildHuntBoard);

  const handleConfirm = () => {
    startWildHunt(selectedCharacterId, difficulty);
    initWildHuntBoard();
    confirmSetup();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }} />
      <div className="absolute inset-0 bg-stone-950/80" />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 space-y-8 max-w-lg mx-auto">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">Wild Hunt</h1>
          <p className="text-stone-400 text-sm">8-Round Campaign</p>
        </div>

        {step === 'difficulty' && (
          <div className="w-full space-y-4">
            <h2 className="text-lg font-semibold text-stone-200 text-center">Choose Difficulty</h2>
            <div className="flex flex-col gap-3">
              {DIFFICULTIES.map(({ value, label, detail }) => (
                <button
                  key={value}
                  onClick={() => setDifficulty(value)}
                  className={`w-full py-3 px-4 rounded-lg text-left transition-colors border ${
                    difficulty === value
                      ? 'bg-blue-800/70 border-cyan-500 text-white'
                      : 'bg-stone-800/80 border-stone-600 text-stone-300 hover:border-cyan-700'
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  <span className={`ml-3 text-sm ${difficulty === value ? 'text-cyan-200' : 'text-stone-500'}`}>
                    {detail}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={resetWildHunt}
                className="flex-1 py-3 rounded-lg bg-stone-700/80 text-stone-300 hover:bg-stone-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('character')}
                className="flex-1 py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 'character' && (
          <div className="w-full space-y-4">
            <h2 className="text-lg font-semibold text-stone-200 text-center">Choose Character</h2>
            <div className="flex flex-col gap-3">
              {WILD_HUNT_CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacterId(char.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors border flex items-center gap-4 ${
                    selectedCharacterId === char.id
                      ? 'bg-blue-900/60 border-cyan-500'
                      : 'bg-stone-800/80 border-stone-600 hover:border-cyan-700'
                  }`}
                >
                  {char.image && (
                    <img
                      src={`${BASE}${char.image.replace(/^\//, '')}`}
                      alt={char.name}
                      className="w-16 h-16 rounded-lg object-cover object-top flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-bold text-stone-100">{char.name}</p>
                    <p className="text-xs text-stone-400 mt-1">{char.passiveAbility.name}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep('difficulty')}
                className="flex-1 py-3 rounded-lg bg-stone-700/80 text-stone-300 hover:bg-stone-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold transition-colors"
              >
                Begin Campaign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
