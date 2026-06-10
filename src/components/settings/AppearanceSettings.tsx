import type { AppearanceSettings as AppearanceConfig } from '../../types/settings'

interface Props {
  settings: AppearanceConfig
  onUpdate: (settings: AppearanceConfig) => void
}

export function AppearanceSettings({ settings, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>

      <div className="space-y-3">
        <label className="text-xs font-medium text-text-muted">Theme</label>
        <div className="flex gap-2">
          {(['dark', 'light', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onUpdate({ ...settings, theme: t })}
              className={`px-4 py-2 rounded-sm text-sm font-medium capitalize transition-colors duration-150 ${
                settings.theme === t ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary hover:bg-surface-elevated'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-text-muted">Density</label>
        <div className="flex gap-2">
          {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
            <button
              key={d}
              onClick={() => onUpdate({ ...settings, density: d })}
              className={`px-4 py-2 rounded-sm text-sm font-medium capitalize transition-colors duration-150 ${
                settings.density === d ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary hover:bg-surface-elevated'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-text-muted">Font Size: {settings.fontSize}px</label>
        <input
          type="range"
          min={12}
          max={20}
          value={settings.fontSize}
          onChange={(e) => onUpdate({ ...settings, fontSize: parseInt(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-text-muted">
          <span>12px</span>
          <span>20px</span>
        </div>
      </div>

      <label className="flex items-center justify-between py-2 cursor-pointer">
        <span className="text-sm text-text-primary">Reduce animations</span>
        <button
          role="switch"
          aria-checked={settings.reduceAnimations}
          onClick={() => onUpdate({ ...settings, reduceAnimations: !settings.reduceAnimations })}
          className={`w-9 h-5 rounded-full transition-colors duration-150 ${settings.reduceAnimations ? 'bg-primary' : 'bg-surface-elevated border border-border'}`}
        >
          <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${settings.reduceAnimations ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
        </button>
      </label>

      <div className="space-y-2 pt-4 border-t border-border">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">Preview</h3>
        <div className="bg-surface border border-border rounded-md p-4 space-y-2" style={{ fontSize: settings.fontSize }}>
          <p className="text-text-primary font-semibold">Agent Status</p>
          <p className="text-text-secondary">Athena is processing Q3 competitor analysis.</p>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.15)] text-success">Online</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-muted text-primary">Working</span>
          </div>
        </div>
      </div>
    </div>
  )
}
