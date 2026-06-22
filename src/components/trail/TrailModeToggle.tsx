interface TrailModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function TrailModeToggle({ enabled, onChange }: TrailModeToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-stone-800 border border-stone-600">
      <div>
        <div className="font-semibold text-stone-200">Monster Trail</div>
        <div className="text-xs text-stone-400">Special cards + weakness tokens</div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-amber-600' : 'bg-stone-600'
        }`}
        aria-pressed={enabled}
        aria-label="Toggle Monster Trail mode"
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
