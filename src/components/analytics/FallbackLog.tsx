import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { FallbackEvent } from '../../types/router'
import { cn } from '../../lib/utils'

interface Props {
  events: FallbackEvent[]
}

export function FallbackLog({ events }: Props) {
  const unresolved = events.filter((e) => !e.resolved).length

  const grouped = events.reduce((acc, e) => {
    const date = new Date(e.timestamp).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(e)
    return acc
  }, {} as Record<string, FallbackEvent[]>)

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString()
  }

  if (events.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Fallback Events</h2>
        <div className="py-8 text-center text-sm text-text-muted">No fallbacks. All models healthy.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-text-primary">Fallback Events</h2>
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-elevated text-text-muted">{events.length}</span>
        {unresolved > 0 && (
          <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-[rgba(245,158,11,0.15)] text-warning">
            <AlertTriangle size={10} />
            {unresolved} unresolved
          </span>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{formatDateLabel(date)}</h3>
            <div className="space-y-2">
              {items.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'bg-surface border rounded-md p-3 space-y-2 hover:border-border-focus transition-colors duration-150',
                    !event.resolved && 'border-warning/30'
                  )}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={cn('w-2 h-2 rounded-full', event.resolved ? 'bg-success' : 'bg-warning')} />
                    <span className="text-xs font-medium text-text-primary">{event.originalModel}</span>
                    <span className="text-xs text-text-muted">→</span>
                    <span className="text-xs font-medium text-primary">{event.fallbackModel}</span>
                    <span className="text-xs text-text-muted ml-auto">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{event.reason}</p>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><RefreshCw size={10} />{event.retryCount} retries</span>
                    <span>{event.taskId}</span>
                    {!event.resolved && (
                      <button className="ml-auto px-2 py-0.5 rounded-sm bg-warning/10 text-warning text-xs font-medium hover:bg-warning/20 transition-colors duration-150">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
