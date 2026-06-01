interface InitiativeDisplayProps {
  isMonsterFirst: boolean;
}

export function InitiativeDisplay({ isMonsterFirst }: InitiativeDisplayProps) {
  return (
    <div
      className={`text-center py-2 px-4 rounded-lg text-sm font-semibold ${
        isMonsterFirst
          ? 'bg-red-900/40 text-red-300'
          : 'bg-green-900/40 text-green-300'
      }`}
    >
      {isMonsterFirst ? 'Monster acts first' : 'Player acts first'}
    </div>
  );
}
