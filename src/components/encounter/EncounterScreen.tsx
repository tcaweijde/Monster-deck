import { useEncounterStore } from '../../store/encounterStore';
import { AbilityPanel } from './AbilityPanel';
import { DeckTracker } from './DeckTracker';
import { InitiativeDisplay } from './InitiativeDisplay';
import { MonsterCardDisplay } from './MonsterCardDisplay';
import { PlayerDamageInput } from './PlayerDamageInput';
import { DiscardAlert } from './DiscardAlert';
import { VictoryOverlay } from './VictoryOverlay';

export function EncounterScreen() {
  const monster = useEncounterStore((s) => s.monster);
  const deck = useEncounterStore((s) => s.deck);
  const discardPile = useEncounterStore((s) => s.discardPile);
  const currentCard = useEncounterStore((s) => s.currentCard);
  const isMonsterFirst = useEncounterStore((s) => s.isMonsterFirst);
  const phase = useEncounterStore((s) => s.phase);
  const lastDiscardTriggered = useEncounterStore((s) => s.lastDiscardTriggered);
  const flipMonsterCard = useEncounterStore((s) => s.flipMonsterCard);
  const applyPlayerDamage = useEncounterStore((s) => s.applyPlayerDamage);
  const nextRound = useEncounterStore((s) => s.nextRound);
  const resetToSetup = useEncounterStore((s) => s.resetToSetup);

  if (!monster) return null;

  return (
    <div className="min-h-screen flex flex-col p-4 space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-amber-500">{monster.name}</h1>
        <button
          onClick={resetToSetup}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Quit
        </button>
      </div>

      <AbilityPanel monster={monster} />
      <InitiativeDisplay isMonsterFirst={isMonsterFirst} />
      <DeckTracker deckSize={deck.length} discardSize={discardPile.length} />

      <div className="flex-1 flex flex-col justify-center py-4">
        <MonsterCardDisplay
          currentCard={currentCard}
          deckEmpty={deck.length === 0}
          onFlip={flipMonsterCard}
        />
      </div>

      <div className="space-y-3">
        <PlayerDamageInput maxDamage={deck.length} onApply={applyPlayerDamage} />
        {currentCard && (
          <button
            onClick={nextRound}
            className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-colors"
          >
            Next Round
          </button>
        )}
      </div>

      {monster.discardAbility && (
        <DiscardAlert ability={monster.discardAbility} triggered={lastDiscardTriggered} />
      )}

      {phase === 'victory' && (
        <VictoryOverlay monsterName={monster.name} onNewEncounter={resetToSetup} />
      )}
    </div>
  );
}
