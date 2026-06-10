import { Circle } from 'lucide-react'
import type { ActivityEntry } from '../../types/activity'
import { useActivityFeed } from '../../hooks/useActivityFeed'
import { ActivityItem } from './ActivityItem'

const filterOptions = ['all', 'tasks', 'agents', 'system'] as const

interface Props {
  entries: ActivityEntry[]
}

export function ActivityFeed({ entries: initial }: Props) {
  const { entries, filter, setFilter, hasNewEntries, scrollToBottom, feedRef, handleScroll } =
    useActivityFeed(initial)

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="flex items-center justify-between px-3 py-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-secondary">Activity</span>
          <span className="flex items-center gap-1 text-[10px] text-success">
            <Circle size={6} className="fill-success animate-status-pulse" />
            Live
          </span>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs bg-surface border border-border rounded-sm px-2 py-1 text-text-secondary outline-none focus:border-border-focus"
          aria-label="Filter activity"
        >
          {filterOptions.map((f) => (
            <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
          ))}
        </select>
      </div>
      <div
        ref={feedRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto px-2 pb-2 space-y-1"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-20">
            <span className="text-xs text-text-muted">No recent activity</span>
          </div>
        ) : (
          entries.map((entry) => <ActivityItem key={entry.id} entry={entry} />)
        )}
      </div>
      {hasNewEntries && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium shadow-lg hover:bg-primary-hover transition-colors duration-150 z-10"
        >
          New activity ↓
        </button>
      )}
      <div className="px-3 py-2 border-t border-border shrink-0">
        <span className="text-xs text-text-muted hover:text-text-secondary cursor-pointer transition-colors duration-150">
          View All History →
        </span>
      </div>
    </div>
  )
}
