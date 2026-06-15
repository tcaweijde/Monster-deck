import { useWildHuntStore } from '../../store/wildHuntStore';

const BASE = import.meta.env.BASE_URL ?? '/';
const BG = `${BASE}images/monsters/wild-hunt/background.jpg`;
const EREDIN = `${BASE}images/monsters/wild-hunt/eredin.jpg`;

export function WildHuntDefeatScreen() {
  const resetWildHunt = useWildHuntStore((s) => s.resetWildHunt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={resetWildHunt}
    >
      {/* Icy background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }} />
      <div className="absolute inset-0 bg-cyan-950/60" />
      <div className="absolute inset-0 bg-stone-950/50" />

      {/* Popup card */}
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-cyan-700/50 shadow-2xl shadow-cyan-950/80">
        {/* Wild Hunt art */}
        <div className="relative h-72 overflow-hidden">
          <img
            src={EREDIN}
            alt="Eredin, King of the Wild Hunt"
            className="w-full h-full object-cover object-top"
          />
          {/* Frost gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
          <div className="absolute inset-0 bg-cyan-900/15" />
        </div>

        {/* Content */}
        <div className="bg-stone-950 px-6 py-6 space-y-3 text-center border-t border-cyan-800/30">
          <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">Defeated</h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            The Wild Hunt has broken through your defences.<br />
            Tedd Deireadh is upon the world.
          </p>
          <p className="text-xs text-cyan-700 uppercase tracking-widest pt-2">
            Tap anywhere to return
          </p>
        </div>
      </div>
    </div>
  );
}
