import { useEncounterStore } from '../../store/encounterStore';
import { useWildHuntStore } from '../../store/wildHuntStore';
import type { WildHuntSpecialCard } from '../../types/wildHunt';
import { MonsterCardDisplay } from '../encounter/MonsterCardDisplay';
import { AbilityPanel } from '../encounter/AbilityPanel';
import { DeckTracker } from '../encounter/DeckTracker';

const BASE = import.meta.env.BASE_URL ?? '/';
const BG = `${BASE}images/monsters/wild-hunt/background.jpg`;

function isSpecialCard(card: unknown): card is WildHuntSpecialCard {
  return typeof card === 'object' && card !== null && 'discardAbility' in card;
}

export function WildHuntEncounterScreen() {
  const monster = useEncounterStore((s) => s.monster);
  const deck = useEncounterStore((s) => s.deck);
  const discardPile = useEncounterStore((s) => s.discardPile);
  const currentCard = useEncounterStore((s) => s.currentCard);
  const turn = useEncounterStore((s) => s.turn);
  const phase = useEncounterStore((s) => s.phase);
  const lastDiscardedCard = useEncounterStore((s) => s.lastDiscardedCard);
  const flipMonsterCard = useEncounterStore((s) => s.flipMonsterCard);
  const discardOne = useEncounterStore((s) => s.discardOne);
  const passTurn = useEncounterStore((s) => s.passTurn);
  const clearLastDiscardedCard = useEncounterStore((s) => s.clearLastDiscardedCard);
  const resetToSetup = useEncounterStore((s) => s.resetToSetup);

  const shieldCount = useWildHuntStore((s) => s.shieldCount);
  const absorbDamage = useWildHuntStore((s) => s.absorbDamage);
  const triggerVictory = useWildHuntStore((s) => s.triggerVictory);
  const resetWildHunt = useWildHuntStore((s) => s.resetWildHunt);

  if (!monster) return null;

  const specialCard = isSpecialCard(lastDiscardedCard) ? lastDiscardedCard : null;

  const handleVictoryClose = () => {
    triggerVictory();
    resetToSetup();
  };

  const handleConcede = () => {
    resetWildHunt();
    resetToSetup();
  };

  /** Shields absorb damage first; excess removes a card from the deck. */
  const handleSwipeDamage = () => {
    const excess = absorbDamage(1);
    if (excess > 0) {
      discardOne();
    }
    // If excess=0, shields absorbed it — no card discarded; player turn continues
  };

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }} />
      <div className="absolute inset-0 bg-stone-950/85" />

      <div className="relative h-full overflow-hidden flex flex-col p-4 space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">{monster.name}</h1>
          <p className="text-xs text-stone-500 mt-0.5">Final Battle</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-cyan-400 font-semibold">🛡️ {shieldCount}</span>
          <button
            onClick={handleConcede}
            className="text-sm text-stone-400 hover:text-red-400 transition-colors"
          >
            Concede
          </button>
        </div>
      </div>

      <AbilityPanel monster={monster} theme="frost" />

      <div
        className={`text-center py-2 px-4 rounded-lg text-sm font-semibold ${
          turn === 'monster'
            ? 'bg-red-900/40 text-red-300'
            : 'bg-blue-900/40 text-cyan-200'
        }`}
      >
        {turn === 'monster' ? "Monster's turn" : "Player's turn"}
      </div>

      <div className="flex-1 min-h-0 flex flex-col py-4">
        <MonsterCardDisplay
          currentCard={currentCard}
          deckEmpty={deck.length === 0 && !currentCard}
          deckSize={deck.length}
          turn={turn}
          cardFrontImages={monster.cardFrontImages || []}
          onFlip={flipMonsterCard}
          onSwipeDamage={handleSwipeDamage}
          onPass={passTurn}
          theme="frost"
        />
      </div>

      {/* Special card discard alert — fixed overlay, tap anywhere to dismiss */}
      {specialCard && (
        <div
          className="fixed inset-0 bg-stone-950/80 flex items-center justify-center z-50 p-6"
          onPointerDown={(e) => { e.preventDefault(); clearLastDiscardedCard(); }}
        >
          <div className="bg-stone-800 border-2 border-cyan-600 rounded-2xl p-6 space-y-4 max-w-sm w-full">
            <p className="text-cyan-300 font-semibold text-base">
              ⚡ {specialCard.discardAbility.name}
            </p>
            <p className="text-stone-300 text-sm">{specialCard.discardAbility.description}</p>
            <p className="text-stone-500 text-xs text-center">Tap anywhere to dismiss</p>
          </div>
        </div>
      )}

      {/* Boss victory overlay */}
      {phase === 'victory' && (
        <div className="fixed inset-0 bg-stone-950/90 flex items-center justify-center z-40 p-6">
          <div className="bg-stone-800 border-2 border-cyan-500 rounded-2xl p-8 text-center space-y-6 max-w-sm">
            <h2 className="text-3xl font-bold text-cyan-400">🏆 Wild Hunt Defeated!</h2>
            <p className="text-stone-300">
              {monster.name} has been vanquished. The Wild Hunt's reign of terror ends here.
            </p>
            <button
              onClick={handleVictoryClose}
              className="w-full py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-lg transition-colors"
            >
              Claim Victory
            </button>
          </div>
        </div>
      )}

      <DeckTracker deckSize={deck.length} discardSize={discardPile.length} />
      </div>
    </div>
  );
}
