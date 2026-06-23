interface SkelligeModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function SkelligeModeToggle({ enabled, onChange }: SkelligeModeToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-stone-800 border border-stone-600">
      <div>
        <div className="font-semibold text-stone-200">Skellige</div>
        <div className="text-xs text-stone-400">Dagon's Lair permanent slot</div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-amber-600' : 'bg-stone-600'
        }`}
        aria-pressed={enabled}
        aria-label="Toggle Skellige expansion"
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
