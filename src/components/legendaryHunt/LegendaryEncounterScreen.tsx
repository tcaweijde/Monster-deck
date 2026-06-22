import { useEncounterStore } from '../../store/encounterStore';
import { useLegendaryHuntStore } from '../../store/legendaryHuntStore';
import type { LegendaryMonsterCard } from '../../types';
import { MonsterCardDisplay } from '../encounter/MonsterCardDisplay';
import { AbilityPanel } from '../encounter/AbilityPanel';
import { DeckTracker } from '../encounter/DeckTracker';
import { LEGENDARY_MONSTERS } from '../../data/legendary';

const BASE = import.meta.env.BASE_URL ?? '/';
const BG = `${BASE}images/monsters/wild-hunt/background.jpg`;
const LEGENDARY_CARD_BACK = `${BASE}images/legendary/card-back-legendary.png`;

function isLegendarySpecialCard(card: unknown): card is LegendaryMonsterCard {
  return (
    typeof card === 'object' &&
    card !== null &&
    'isSpecial' in card &&
    'discardAbility' in card
  );
}

export function LegendaryEncounterScreen() {
  const monster = useEncounterStore((s) => s.monster);
  const deck = useEncounterStore((s) => s.deck);
  const discardPile = useEncounterStore((s) => s.discardPile);
  const currentCard = useEncounterStore((s) => s.currentCard);
  const turn = useEncounterStore((s) => s.turn);
  const phase = useEncounterStore((s) => s.phase);
  const lastDiscardedCard = useEncounterStore((s) => s.lastDiscardedCard);
  const flipMonsterCard = useEncounterStore((s) => s.flipMonsterCard);
  const passTurn = useEncounterStore((s) => s.passTurn);
  const discardOneWithProtection = useEncounterStore((s) => s.discardOneWithProtection);
  const clearLastDiscardedCard = useEncounterStore((s) => s.clearLastDiscardedCard);
  const resetToSetup = useEncounterStore((s) => s.resetToSetup);

  const protectionValue = useLegendaryHuntStore((s) => s.protectionValue);
  const legendaryMonsterId = useLegendaryHuntStore((s) => s.legendaryMonsterId);
  const triggerVictory = useLegendaryHuntStore((s) => s.triggerVictory);
  const abandonBossFight = useLegendaryHuntStore((s) => s.abandonBossFight);

  if (!monster) return null;

  const legendaryMonster =
    LEGENDARY_MONSTERS.find((m) => m.id === legendaryMonsterId);

  const specialCard = isLegendarySpecialCard(lastDiscardedCard) ? lastDiscardedCard : null;

  const handleVictoryClose = () => {
    triggerVictory();
    resetToSetup();
  };

  const handleConcede = () => {
    abandonBossFight();
    resetToSetup();
  };

  const handleSwipeDamage = () => {
    discardOneWithProtection(protectionValue);
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
            <h1 className="text-xl font-bold text-amber-400">{monster.name}</h1>
            <p className="text-xs text-stone-500 mt-0.5">Legendary Hunt</p>
          </div>
          <div className="flex items-center gap-3">
            {protectionValue > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-900/50 border border-amber-700/40 text-amber-300 text-xs font-semibold">
                🛡 {protectionValue}/attack
              </span>
            )}
            <button
              onClick={handleConcede}
              className="text-sm text-stone-400 hover:text-red-400 transition-colors"
            >
              Concede
            </button>
          </div>
        </div>

        <AbilityPanel monster={monster} />

        <div
          className={`text-center py-2 px-4 rounded-lg text-sm font-semibold ${
            turn === 'monster'
              ? 'bg-red-900/40 text-red-300'
              : 'bg-amber-900/40 text-amber-200'
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
            cardFrontImages={monster.cardFrontImages ?? []}
            onFlip={flipMonsterCard}
            onSwipeDamage={handleSwipeDamage}
            onPass={passTurn}
            cardBackImage={LEGENDARY_CARD_BACK}
            specialAttacks={legendaryMonster?.specialAttacks}
          />
        </div>

        {/* Special card discard alert — fixed overlay, tap anywhere to dismiss */}
        {specialCard && specialCard.discardAbility && (
          <div
            className="fixed inset-0 bg-stone-950/80 flex items-center justify-center z-50 p-6"
            onPointerDown={(e) => { e.preventDefault(); clearLastDiscardedCard(); }}
          >
            <div className="bg-stone-800 border-2 border-amber-600 rounded-2xl p-6 space-y-4 max-w-sm w-full">
              <p className="text-amber-300 font-semibold text-base">
                {specialCard.discardAbility.name}
              </p>
              <p className="text-stone-300 text-sm">{specialCard.discardAbility.description}</p>
              <p className="text-stone-500 text-xs text-center">Tap anywhere to dismiss</p>
            </div>
          </div>
        )}

        {/* Legendary victory overlay */}
        {phase === 'victory' && (
          <div className="fixed inset-0 bg-stone-950/90 flex items-center justify-center z-40 p-6">
            <div className="bg-stone-800 border-2 border-amber-500 rounded-2xl p-8 text-center space-y-6 max-w-sm">
              <h2 className="text-3xl font-bold text-amber-400">Legendary Monster Defeated!</h2>
              <p className="text-stone-300">
                {monster.name} has been vanquished. The hunt is over.
              </p>
              <button
                onClick={handleVictoryClose}
                className="w-full py-3 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-bold text-lg transition-colors"
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
