import type { Monster } from '../../types';
import { getActiveAbilities, hasDiscardTrigger } from '../../engine/abilities';

interface AbilityPanelProps {
  monster: Monster;
}

export function AbilityPanel({ monster }: AbilityPanelProps) {
  const abilities = getActiveAbilities(monster);
  const showDiscardAbility = hasDiscardTrigger(monster);

  return (
    <div className="bg-gray-800/80 rounded-lg p-4 space-y-1">
      <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
        Abilities
      </h3>
      {abilities.map((ability) => (
        <div key={ability.name} className="text-sm">
          <span className="font-semibold text-gray-200">{ability.name}: </span>
          <span className="text-gray-400">{ability.description}</span>
        </div>
      ))}
      {showDiscardAbility && monster.discardAbility && (
        <div className="text-sm border-t border-gray-700 pt-2 mt-2">
          <span className="inline-block px-2 py-0.5 bg-red-900/50 text-red-300 rounded text-xs font-semibold mr-2">
            On Discard
          </span>
          <span className="font-semibold text-gray-200">{monster.discardAbility.name}: </span>
          <span className="text-gray-400">{monster.discardAbility.description}</span>
        </div>
      )}
    </div>
  );
}
