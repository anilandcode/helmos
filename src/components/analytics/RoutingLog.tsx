import { useState, useMemo } from 'react'
import { ChevronDown, AlertTriangle } from 'lucide-react'
import type { RoutingDecision } from '../../types/router'
import { cn } from '../../lib/utils'

interface Props {
  decisions: RoutingDecision[]
}

const taskTypes = ['all', 'analysis', 'coding', 'research', 'generation']

export function RoutingLog({ decisions }: Props) {
  const [taskFilter, setTaskFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = decisions
    if (taskFilter !== 'all') result = result.filter((d) => d.taskType === taskFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((d) => d.selectedModel.toLowerCase().includes(q) || d.reasoning.toLowerCase().includes(q) || d.taskId.toLowerCase().includes(q))
    }
    return result
  }, [decisions, taskFilter, searchQuery])

  const formatCost = (c: number) => `$${c.toFixed(4)}`
  const formatTokens = (t: number) => t.toLocaleString() + ' tokens'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">Routing Decisions</h2>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-elevated text-text-muted">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className="text-xs bg-surface border border-border rounded-sm px-2 py-1 text-text-secondary outline-none focus:border-border-focus"
            aria-label="Filter by task type"
          >
            {taskTypes.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decisions..."
            className="text-xs bg-background border border-border rounded-sm px-2 py-1 text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus w-40"
            aria-label="Search routing decisions"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-text-muted">No routing decisions yet. Run a task to see model selection.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => {
            const overrun = d.actualCost > d.estimatedCost
            return (
              <div
                key={d.id}
                className={cn(
                  'bg-surface border rounded-md p-3 space-y-2 hover:border-border-focus transition-colors duration-150',
                  d.fallbackFrom && 'border-warning/30'
                )}
              >
                {d.fallbackFrom && (
                  <div className="flex items-center gap-1.5 text-xs text-warning bg-[rgba(245,158,11,0.1)] px-2 py-1 rounded-sm">
                    <AlertTriangle size={12} />
                    <span>Fallback: {d.fallbackFrom} → {d.selectedModel}</span>
                    <span className="text-text-muted ml-auto">{d.fallbackReason}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-text-muted">{new Date(d.timestamp).toLocaleTimeString()}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-elevated border border-border text-text-secondary capitalize">{d.taskType}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">{d.selectedModel}</span>
                  <span className="text-xs text-text-muted ml-auto">{d.taskId}</span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{d.reasoning}</p>

                <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
                  <span>Confidence: <span className="text-text-secondary">{(d.confidence * 100).toFixed(0)}%</span></span>
                  <span>Cost: <span className={cn('font-mono', overrun ? 'text-error' : 'text-text-secondary')}>{formatCost(d.actualCost)}</span>
                    {overrun && <span className="text-error ml-1">+{formatCost(d.actualCost - d.estimatedCost)}</span>}
                  </span>
                  <span>Tokens: <span className="font-mono text-text-secondary">{formatTokens(d.actualTokens)}</span></span>
                  <span>Latency: <span className="font-mono text-text-secondary">{d.latencyMs.toLocaleString()}ms</span></span>
                  {d.inputSample && (
                    <button
                      onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                      className="flex items-center gap-1 text-primary hover:underline ml-auto"
                    >
                      <ChevronDown size={12} className={cn(expandedId === d.id && 'rotate-180')} />
                      Input
                    </button>
                  )}
                </div>

                {expandedId === d.id && d.inputSample && (
                  <pre className="text-xs font-mono text-text-muted bg-background border border-border rounded-sm p-2 overflow-x-auto">{d.inputSample}</pre>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
