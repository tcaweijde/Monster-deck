import { useWildHuntStore } from '../../store/wildHuntStore';
import { getWildHuntCharacterById } from '../../data/wildHunt/characters';

const BASE = import.meta.env.BASE_URL ?? '/';
const BG = `${BASE}images/Belleteyn.jpg`;

export function WildHuntVictoryScreen() {
  const characterId = useWildHuntStore((s) => s.characterId);
  const resetWildHunt = useWildHuntStore((s) => s.resetWildHunt);

  const character = characterId ? getWildHuntCharacterById(characterId) : undefined;

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }} />
      <div className="absolute inset-0 bg-stone-950/75" />

      <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-8 max-w-lg mx-auto text-center">
        {/* Character portrait */}
        {character?.image && (
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/60 shadow-lg shadow-cyan-900/50">
            <img
              src={`${BASE}${character.image.replace(/^\//, '')}`}
              alt={character.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
          </div>
        )}

        <div className="bg-stone-900/80 border border-cyan-800/40 rounded-2xl p-6 space-y-3 w-full">
          <p className="text-cyan-300 font-semibold">🛡️ The Wild Hunt has been defeated!</p>
          <p className="text-stone-400 text-sm">
            The portals are sealed. Tedd Deireadh has been averted.
          </p>
        </div>

        <button
          onClick={resetWildHunt}
          className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-lg transition-colors"
        >
          New Run
        </button>
      </div>
    </div>
  );
}
