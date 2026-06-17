import { useState } from 'react';
import { useLegendaryHuntStore } from '../../store/legendaryHuntStore';
import { useEncounterStore } from '../../store/encounterStore';
import { LEGENDARY_MONSTERS } from '../../data/legendary';
import { PLACEHOLDER_LEGENDARY } from '../../data/legendary/placeholder-legendary';
import { TROPHY_PROTECTION_TABLES } from '../../data/legendary';
import { buildLegendaryFightDeck, lookupProtectionValue } from '../../engine/legendaryFightDeck';
import type { Monster } from '../../types';

export function BossFightPrepScreen() {
  const [trophyCount, setTrophyCount] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const legendaryMonsterId = useLegendaryHuntStore((s) => s.legendaryMonsterId);
  const destructionTokenCount = useLegendaryHuntStore((s) => s.destructionTokenCount);
  const campaignSide = useLegendaryHuntStore((s) => s.campaignSide);
  const bossFightDeckSize = useLegendaryHuntStore((s) => s.bossFightDeckSize);
  const playerGoesFirst = useLegendaryHuntStore((s) => s.playerGoesFirst);
  const protectionValue = useLegendaryHuntStore((s) => s.protectionValue);
  const confirmBossPrep = useLegendaryHuntStore((s) => s.confirmBossPrep);
  const beginBossFight = useLegendaryHuntStore((s) => s.beginBossFight);
  const startEncounterWithDeck = useEncounterStore((s) => s.startEncounterWithDeck);

  const monster = LEGENDARY_MONSTERS.find((m) => m.id === legendaryMonsterId) ?? PLACEHOLDER_LEGENDARY;

  const liveProtection = lookupProtectionValue(TROPHY_PROTECTION_TABLES, campaignSide, trophyCount);
  const liveDeckSize = Math.max(0, monster.baseFightDeckSize - destructionTokenCount);

  const handleDecrement = () => setTrophyCount((prev) => Math.max(0, prev - 1));
  const handleIncrement = () => setTrophyCount((prev) => prev + 1);

  const handleConfirm = () => {
    confirmBossPrep(trophyCount);
    setConfirmed(true);
  };

  const handleBeginFight = () => {
    beginBossFight();
    if (bossFightDeckSize != null && bossFightDeckSize > 0) {
      const builtDeck = buildLegendaryFightDeck(monster, bossFightDeckSize);
      const syntheticMonster: Monster = {
        id: monster.id,
        name: monster.name,
        level: monster.level,
        deckSize: bossFightDeckSize,
        baseAbility: monster.passiveAbility,
        discardAbility: monster.discardAbility,
        cardPool: monster.fightDeck,
        cardFrontImages: monster.artAssets,
      };
      startEncounterWithDeck(builtDeck, syntheticMonster, playerGoesFirst ?? false);
    }
    // bossFightDeckSize === 0: beginBossFight() handles instant victory internally
  };

  return (
    <div className="relative h-dvh overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2d1a0e 0%, #1c1917 60%)' }} />
      <div className="absolute inset-0 bg-amber-950/20" />

      <div className="relative h-full overflow-y-auto flex flex-col p-6 space-y-6 max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-amber-400 tracking-wide">Boss Fight Preparation</h1>
          <p className="text-stone-400 text-sm mt-1">{monster.name}</p>
        </div>

        {/* Destruction Tokens */}
        <div className="bg-stone-900/80 border border-amber-700/40 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-stone-200 font-medium">Destruction Tokens Collected</span>
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-700/60 border border-amber-500 text-amber-300 font-bold text-lg min-w-[2.5rem]">
            {destructionTokenCount}
          </span>
        </div>

        {!confirmed ? (
          <>
            {/* Trophy Input */}
            <div className="bg-stone-900/80 border border-amber-700/40 rounded-2xl p-5 space-y-4">
              <label className="block text-stone-200 font-semibold text-sm uppercase tracking-wide">
                Trophies Earned (Side {campaignSide})
              </label>

              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={handleDecrement}
                  disabled={trophyCount === 0}
                  className="w-12 h-12 rounded-full bg-stone-800 border border-amber-700/40 text-amber-400 text-2xl font-bold hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  aria-label="Decrease trophy count"
                >
                  −
                </button>
                <span className="text-4xl font-bold text-amber-400 w-12 text-center">{trophyCount}</span>
                <button
                  onClick={handleIncrement}
                  className="w-12 h-12 rounded-full bg-stone-800 border border-amber-700/40 text-amber-400 text-2xl font-bold hover:bg-stone-700 transition-colors flex items-center justify-center"
                  aria-label="Increase trophy count"
                >
                  +
                </button>
              </div>

              {/* Live previews */}
              <div className="space-y-2 pt-2 border-t border-amber-800/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Protection value</span>
                  <span className="text-amber-300 font-semibold">{liveProtection} per attack</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Fight deck size</span>
                  <span className="text-amber-300 font-semibold">{liveDeckSize} cards</span>
                </div>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-lg transition-colors shadow-lg shadow-amber-900/40"
            >
              Confirm
            </button>
          </>
        ) : (
          <>
            {/* Summary card */}
            <div className="bg-stone-900/80 border border-amber-500 rounded-2xl p-5 space-y-3">
              <h2 className="text-amber-400 font-bold text-base uppercase tracking-wide">Fight Summary</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Monster</span>
                  <span className="text-stone-200 font-semibold">{monster.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Fight deck</span>
                  <span className="text-stone-200 font-semibold">{bossFightDeckSize} cards</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Protection per attack</span>
                  <span className="text-stone-200 font-semibold">{protectionValue}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Initiative</span>
                  <span className="text-stone-200 font-semibold">
                    {playerGoesFirst ? 'You go first' : 'Standard initiative'}
                  </span>
                </div>
              </div>
            </div>

            {/* Begin Boss Fight button */}
            <button
              onClick={handleBeginFight}
              className="w-full py-4 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-lg transition-colors shadow-lg shadow-amber-900/40"
            >
              Begin Boss Fight
            </button>
          </>
        )}
      </div>
    </div>
  );
}
