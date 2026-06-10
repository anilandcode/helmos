import { Clock, DollarSign, Zap } from 'lucide-react'
import type { EpisodicMemory } from '../../types/memory'

interface Props {
  entries: EpisodicMemory[]
}

export function EpisodicPanel({ entries }: Props) {
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const grouped = sorted.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {} as Record<string, EpisodicMemory[]>)

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'bg-success'
      case 'failure': return 'bg-error'
      case 'partial': return 'bg-warning'
      default: return 'bg-text-muted'
    }
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-text-secondary">No episodes recorded. Run an agent task to see history.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" role="tabpanel">
      {Object.entries(grouped).map(([date, episodes]) => (
        <div key={date}>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
            {formatDateLabel(date)}
          </h3>
          <div className="space-y-3">
            {episodes.map((episode) => (
              <div key={episode.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getOutcomeColor(episode.outcome)} mt-1.5`} />
                  <div className="w-0.5 flex-1 bg-surface-elevated mt-1" />
                </div>
                <div className="flex-1 bg-surface border border-border rounded-md p-3 space-y-2 hover:border-border-focus hover:shadow-lg transition-all duration-150">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white">
                        {episode.agentName[0]}
                      </div>
                      <span className="text-sm font-medium text-text-primary">{episode.agentName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-secondary">
                        {episode.episodeType.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(episode.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{episode.content}</p>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    {episode.cost !== undefined && (
                      <span className="flex items-center gap-1">
                        <DollarSign size={10} />
                        ${episode.cost.toFixed(4)}
                      </span>
                    )}
                    {episode.durationMs !== undefined && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {(episode.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                    {episode.taskId && (
                      <span className="flex items-center gap-1">
                        <Zap size={10} />
                        {episode.taskId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
