import type { NotifSettings } from '../../types/settings'

interface Props {
  settings: NotifSettings
  onUpdate: (settings: NotifSettings) => void
}

const alertToggles: { key: keyof NotifSettings; label: string }[] = [
  { key: 'agentBlocked', label: 'Agent blocked' },
  { key: 'taskCompleted', label: 'Task completed' },
  { key: 'costThreshold', label: 'Cost threshold exceeded' },
  { key: 'fallback', label: 'Model fallback triggered' },
  { key: 'securityAlert', label: 'Security alert' },
  { key: 'swarmDeadlock', label: 'Swarm deadlock detected' },
]

export function NotificationSettings({ settings, onUpdate }: Props) {
  const toggle = (key: keyof NotifSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Alert Types</h3>
        {alertToggles.map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between py-2.5 cursor-pointer">
            <span className="text-sm text-text-primary">{label}</span>
            <button
              role="switch"
              aria-checked={!!settings[key]}
              onClick={() => toggle(key)}
              className={`w-9 h-5 rounded-full transition-colors duration-150 ${settings[key] ? 'bg-primary' : 'bg-surface-elevated border border-border'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${settings[key] ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </button>
          </label>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-text-secondary">Delivery Methods</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={settings.emailEnabled} onChange={(e) => onUpdate({ ...settings, emailEnabled: e.target.checked })} className="w-4 h-4 rounded-sm accent-primary" />
            <span className="text-sm text-text-primary">Email</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={settings.slackEnabled} onChange={(e) => onUpdate({ ...settings, slackEnabled: e.target.checked })} className="w-4 h-4 rounded-sm accent-primary" />
            <span className="text-sm text-text-primary">Slack</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={settings.webhookEnabled} onChange={(e) => onUpdate({ ...settings, webhookEnabled: e.target.checked })} className="w-4 h-4 rounded-sm accent-primary" />
            <span className="text-sm text-text-primary">Webhook</span>
          </label>
        </div>
        {settings.webhookEnabled && (
          <div>
            <label className="text-xs font-medium text-text-muted">Webhook URL</label>
            <input
              type="url"
              value={settings.webhookUrl}
              onChange={(e) => onUpdate({ ...settings, webhookUrl: e.target.value })}
              placeholder="https://hooks.example.com/..."
              className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 font-mono text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus"
            />
          </div>
        )}
      </div>
    </div>
  )
}
