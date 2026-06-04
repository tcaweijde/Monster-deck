import { useEncounterStore } from '../../store/encounterStore';
import { useEncounterHandlers } from '../../hooks/useEncounterHandlers';
import { AbilityPanel } from './AbilityPanel';
import { DeckTracker } from './DeckTracker';
import { MonsterCardDisplay } from './MonsterCardDisplay';
import { DiscardAlert } from './DiscardAlert';
import { VictoryOverlay } from './VictoryOverlay';

const BASE = import.meta.env.BASE_URL ?? '/';
const BG = `${BASE}images/monsters/wild-hunt/background.jpg`;

export function EncounterScreen() {
  const monster = useEncounterStore((s) => s.monster);
  const deck = useEncounterStore((s) => s.deck);
  const discardPile = useEncounterStore((s) => s.discardPile);
  const currentCard = useEncounterStore((s) => s.currentCard);
  const turn = useEncounterStore((s) => s.turn);
  const phase = useEncounterStore((s) => s.phase);
  const lastDiscardTriggered = useEncounterStore((s) => s.lastDiscardTriggered);
  const proximityBonus = useEncounterStore((s) => s.proximityBonus);
  const flipMonsterCard = useEncounterStore((s) => s.flipMonsterCard);
  const discardOne = useEncounterStore((s) => s.discardOne);
  const passTurn = useEncounterStore((s) => s.passTurn);

  const { displayLevel, inWildHunt, quitEncounter, completeEncounter } = useEncounterHandlers();

  const frost = proximityBonus > 0;

  if (!monster) return null;

  return (
    <div className="relative h-dvh overflow-hidden">
      {frost && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }} />
          <div className="absolute inset-0 bg-stone-950/80" />
        </>
      )}
      <div className={`relative h-full flex flex-col p-4 space-y-4 max-w-lg mx-auto`}>
        <div className="flex items-center justify-between">
          <h1 className={`text-xl font-bold ${frost ? 'text-cyan-400' : 'text-amber-500'}`}>{monster.name}</h1>
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

        <AbilityPanel monster={monster} theme={frost ? 'frost' : 'default'} />

        <div
          className={`text-center py-2 px-4 rounded-lg text-sm font-semibold ${
            turn === 'monster'
              ? 'bg-red-900/40 text-red-300'
              : frost
                ? 'bg-blue-900/40 text-blue-200'
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
            theme={frost ? 'frost' : 'default'}
          />
        </div>

        {monster.discardAbility && (
          <DiscardAlert ability={monster.discardAbility} triggered={lastDiscardTriggered} />
        )}

        {phase === 'victory' && (
          <VictoryOverlay
            monsterName={monster.name}
            wildHuntShieldLoss={inWildHunt ? (displayLevel ?? undefined) : undefined}
            onClose={completeEncounter}
          />
        )}
        <DeckTracker deckSize={deck.length} discardSize={discardPile.length} />
      </div>
    </div>
  );
}
