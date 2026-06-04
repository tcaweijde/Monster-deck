import { useEncounterStore } from '../../store/encounterStore';
import { useEncounterHandlers } from '../../hooks/useEncounterHandlers';
import { AbilityPanel } from './AbilityPanel';
import { DeckTracker } from './DeckTracker';
import { MonsterCardDisplay } from './MonsterCardDisplay';
import { DiscardAlert } from './DiscardAlert';
import { VictoryOverlay } from './VictoryOverlay';

export function EncounterScreen() {
  const monster = useEncounterStore((s) => s.monster);
  const deck = useEncounterStore((s) => s.deck);
  const discardPile = useEncounterStore((s) => s.discardPile);
  const currentCard = useEncounterStore((s) => s.currentCard);
  const turn = useEncounterStore((s) => s.turn);
  const phase = useEncounterStore((s) => s.phase);
  const lastDiscardTriggered = useEncounterStore((s) => s.lastDiscardTriggered);
  const flipMonsterCard = useEncounterStore((s) => s.flipMonsterCard);
  const discardOne = useEncounterStore((s) => s.discardOne);
  const passTurn = useEncounterStore((s) => s.passTurn);

  const { displayLevel, quitEncounter, completeEncounter } = useEncounterHandlers();

  if (!monster) return null;

  return (
    <div className="h-dvh overflow-hidden flex flex-col p-4 space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-amber-500">{monster.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">Lv.{displayLevel ?? monster.level}</span>
          <button
            onClick={quitEncounter}
            className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
          >
            Quit
          </button>
        </div>
      </div>

      <AbilityPanel monster={monster} />

      <div
        className={`text-center py-2 px-4 rounded-lg text-sm font-semibold ${
          turn === 'monster'
            ? 'bg-red-900/40 text-red-300'
            : 'bg-amber-900/30 text-amber-200'
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
          onSwipeDamage={discardOne}
          onPass={passTurn}
        />
      </div>

      {monster.discardAbility && (
        <DiscardAlert ability={monster.discardAbility} triggered={lastDiscardTriggered} />
      )}

      {phase === 'victory' && (
        <VictoryOverlay
          monsterName={monster.name}
          onClose={completeEncounter}
        />
      )}
      <DeckTracker deckSize={deck.length} discardSize={discardPile.length} />
    </div>
  );
}
