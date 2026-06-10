import { useState } from 'react'
import { Key, Settings, Bell, Monitor, Zap } from 'lucide-react'
import { ApiKeyManager } from './ApiKeyManager'
import { ModelPreferences } from './ModelPreferences'
import { NotificationSettings } from './NotificationSettings'
import { AppearanceSettings } from './AppearanceSettings'
import { cn } from '../../lib/utils'
import { mockApiKeys, mockModelPref, mockNotifSettings, mockAppearanceSettings } from '../../data/mockSettings'

const categories = [
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'models', label: 'Model Preferences', icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Monitor },
  { id: 'advanced', label: 'Advanced', icon: Settings },
]

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('api-keys')
  const [modelPref, setModelPref] = useState(mockModelPref)
  const [notifSettings, setNotifSettings] = useState(mockNotifSettings)
  const [appearance, setAppearance] = useState(mockAppearanceSettings)

  const handleAddKey = (provider: string, label: string, _key: string) => {
    console.log(`[Settings] Add key: ${provider} / ${label}`)
  }

  const handleDeleteKey = (id: string) => {
    console.log(`[Settings] Delete key: ${id}`)
  }

  const handleRotateKey = (id: string) => {
    console.log(`[Settings] Rotate key: ${id}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
      <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm whitespace-nowrap transition-colors duration-150',
              activeTab === id
                ? 'bg-primary-muted text-primary border-l-2 border-primary'
                : 'text-text-secondary hover:bg-surface-elevated border-l-2 border-transparent'
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="min-w-0">
        {activeTab === 'api-keys' && <ApiKeyManager keys={mockApiKeys} onAdd={handleAddKey} onDelete={handleDeleteKey} onRotate={handleRotateKey} />}
        {activeTab === 'models' && <ModelPreferences preferences={modelPref} onUpdate={setModelPref} />}
        {activeTab === 'notifications' && <NotificationSettings settings={notifSettings} onUpdate={setNotifSettings} />}
        {activeTab === 'appearance' && <AppearanceSettings settings={appearance} onUpdate={setAppearance} />}
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Advanced</h2>
            <div className="p-4 bg-surface border border-border rounded-md text-sm text-text-secondary">
              Advanced configuration options including custom Temporal workflows, MCP server registry, and debug logging will appear here.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
