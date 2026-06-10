import { useState } from 'react'
import { Wifi } from 'lucide-react'
import type { ModelPref } from '../../types/settings'

interface Props {
  preferences: ModelPref
  onUpdate: (prefs: ModelPref) => void
}

export function ModelPreferences({ preferences, onUpdate }: Props) {
  const [testing, setTesting] = useState(false)
  const [dailyLimit, setDailyLimit] = useState(String(preferences.dailyLimit))
  const [monthlyLimit, setMonthlyLimit] = useState(String(preferences.monthlyLimit))

  const handleNumericChange = (value: string, setter: (v: string) => void, field: 'dailyLimit' | 'monthlyLimit') => {
    setter(value)
    const num = parseFloat(value)
    if (!isNaN(num) && num >= 0) {
      onUpdate({ ...preferences, [field]: num })
    }
  }

  const testConnection = () => {
    setTesting(true)
    setTimeout(() => setTesting(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Model Preferences</h2>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-text-muted">Router Strategy</label>
          <select
            value={preferences.strategy}
            onChange={(e) => onUpdate({ ...preferences, strategy: e.target.value as ModelPref['strategy'] })}
            className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 text-text-primary outline-none focus:border-border-focus"
          >
            <option value="auto">Auto</option>
            <option value="cost">Cost-Optimized</option>
            <option value="quality">Quality-First</option>
            <option value="speed">Speed-First</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={preferences.autoFallback} onChange={(e) => onUpdate({ ...preferences, autoFallback: e.target.checked })} className="w-4 h-4 rounded-sm accent-primary" />
            <span className="text-sm text-text-primary">Auto-fallback on error</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={preferences.notifyOnFallback} onChange={(e) => onUpdate({ ...preferences, notifyOnFallback: e.target.checked })} className="w-4 h-4 rounded-sm accent-primary" />
            <span className="text-sm text-text-primary">Notify on fallback</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-secondary">Cost Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-text-muted">Daily Limit ($)</label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => handleNumericChange(e.target.value, setDailyLimit, 'dailyLimit')}
              min={0}
              className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 font-mono text-text-primary outline-none focus:border-border-focus"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted">Monthly Limit ($)</label>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => handleNumericChange(e.target.value, setMonthlyLimit, 'monthlyLimit')}
              min={0}
              className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 font-mono text-text-primary outline-none focus:border-border-focus"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted">Warning Threshold (%)</label>
            <input
              type="number"
              value={preferences.warningThreshold}
              onChange={(e) => { const v = parseInt(e.target.value); if (v >= 0 && v <= 100) onUpdate({ ...preferences, warningThreshold: v }) }}
              min={0}
              max={100}
              className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 font-mono text-text-primary outline-none focus:border-border-focus"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-secondary">Local Model (Ollama)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-text-muted">URL</label>
            <input
              type="text"
              value={preferences.ollamaUrl}
              onChange={(e) => onUpdate({ ...preferences, ollamaUrl: e.target.value })}
              className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 font-mono text-text-primary outline-none focus:border-border-focus"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted">Model Name</label>
            <input
              type="text"
              value={preferences.ollamaModel}
              onChange={(e) => onUpdate({ ...preferences, ollamaModel: e.target.value })}
              className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 font-mono text-text-primary outline-none focus:border-border-focus"
            />
          </div>
        </div>
        <button onClick={testConnection} disabled={testing} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary text-xs font-medium hover:bg-surface-elevated disabled:opacity-50 transition-colors duration-150">
          <Wifi size={12} className={testing ? 'animate-pulse' : ''} />
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-secondary">Per-Task Model Preferences</h3>
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-border text-xs text-text-muted uppercase tracking-wider">
              <th className="text-left py-2 px-2">Task Type</th>
              <th className="text-left py-2 px-2">Model</th>
              <th className="text-right py-2 px-2">Max Cost</th>
            </tr>
          </thead>
          <tbody>
            {preferences.taskModels.map((tm) => (
              <tr key={tm.taskType} className="border-b border-border">
                <td className="py-2 px-2 text-text-primary">{tm.taskType}</td>
                <td className="py-2 px-2 text-text-secondary">{tm.model}</td>
                <td className="py-2 px-2 text-right font-mono text-text-muted">${tm.maxCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
