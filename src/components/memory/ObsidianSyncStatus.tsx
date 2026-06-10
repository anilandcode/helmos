import { RefreshCw, CheckCircle, AlertCircle, WifiOff } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  lastSync: string
  status: 'synced' | 'syncing' | 'error' | 'offline'
}

const statusConfig = {
  synced: { icon: CheckCircle, label: 'Synced', color: 'text-success' },
  syncing: { icon: RefreshCw, label: 'Syncing...', color: 'text-primary' },
  error: { icon: AlertCircle, label: 'Error', color: 'text-error' },
  offline: { icon: WifiOff, label: 'Offline', color: 'text-text-muted' },
}

export function ObsidianSyncStatus({ lastSync, status }: Props) {
  const cfg = statusConfig[status]
  const Icon = cfg.icon

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-surface border border-border rounded-md text-xs">
      <div className="w-6 h-6 rounded bg-surface-elevated flex items-center justify-center">
        <span className="text-sm">📝</span>
      </div>
      <span className="font-medium text-text-primary">Obsidian Vault</span>
      <div className={cn('flex items-center gap-1', cfg.color)}>
        <Icon size={12} className={status === 'syncing' ? 'animate-spin' : ''} />
        <span>{cfg.label}</span>
      </div>
      <span className="text-text-muted ml-auto">Last sync: {new Date(lastSync).toLocaleTimeString()}</span>
      {status !== 'syncing' && (
        <button className="px-2 py-1 rounded bg-surface-elevated border border-border text-text-secondary hover:bg-surface hover:text-text-primary transition-colors duration-150">
          Force Sync
        </button>
      )}
    </div>
  )
}
