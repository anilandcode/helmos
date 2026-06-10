import { SettingsPanel } from '../components/settings/SettingsPanel'

export function Settings() {
  return (
    <div className="h-full overflow-auto p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Settings</h1>
      <SettingsPanel />
    </div>
  )
}
