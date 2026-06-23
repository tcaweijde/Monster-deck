import type { Monster } from '../../types';
import { getActiveAbilities, hasDiscardTrigger } from '../../engine/abilities';

interface AbilityPanelProps {
  monster: Monster;
  theme?: 'default' | 'frost';
  trailMode?: boolean;
}

export function AbilityPanel({ monster, theme = 'default', trailMode = false }: AbilityPanelProps) {
  const abilities = getActiveAbilities(monster);
  const showDiscardAbility = hasDiscardTrigger(monster) && trailMode;

  const headingColor = theme === 'frost' ? 'text-cyan-400' : 'text-amber-400';

  return (
    <div className="bg-stone-800/70 border border-stone-700 rounded-lg p-4 space-y-1">
      <h3 className={`text-sm font-semibold uppercase tracking-wide ${headingColor}`}>
        Abilities
      </h3>
      {abilities.map((ability) => (
        <div key={ability.name} className="text-sm">
          <span className="font-semibold text-stone-200">{ability.name}: </span>
          <span className="text-stone-400">{ability.description}</span>
        </div>
      ))}
      {showDiscardAbility && monster.discardAbility && (
        <div className="text-sm border-t border-stone-700 pt-2 mt-2">
          <span className="inline-block px-2 py-0.5 bg-red-900/50 text-red-300 rounded text-xs font-semibold mr-2">
            On Discard
          </span>
          <span className="font-semibold text-stone-200">{monster.discardAbility.name}: </span>
          <span className="text-stone-400">{monster.discardAbility.description}</span>
        </div>
      )}
    </div>
  );
}
