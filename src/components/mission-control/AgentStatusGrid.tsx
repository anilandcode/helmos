import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import type { Agent } from '../../types/agent'
import { AgentCard } from './AgentCard'

type FilterValue = 'all' | 'online' | 'working' | 'idle' | 'error'

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'online', label: 'Online' },
  { value: 'working', label: 'Working' },
  { value: 'idle', label: 'Idle' },
  { value: 'error', label: 'Error' },
]

interface Props {
  agents: Agent[]
}

export function AgentStatusGrid({ agents }: Props) {
  const [filter, setFilter] = useState<FilterValue>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? agents : agents.filter((a) => a.status === filter)),
    [agents, filter]
  )

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm text-text-secondary mb-3">No agents deployed</p>
        <button className="px-4 py-2 rounded-sm bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors duration-150">
          Deploy First Agent
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-secondary">Agents</span>
          <span className="px-1.5 py-px rounded-full bg-surface-elevated text-xs text-text-muted">{agents.length}</span>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterValue)}
          className="text-xs bg-surface border border-border rounded-sm px-2 py-1 text-text-secondary outline-none focus:border-border-focus"
          aria-label="Filter agents by status"
        >
          {filterOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-auto px-2 pb-2 space-y-1.5">
        {filtered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
      <div className="px-2 pb-2 shrink-0">
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-sm text-xs text-text-muted hover:text-text-secondary hover:bg-surface-elevated transition-colors duration-150">
          <Plus size={14} />
          Add Agent
        </button>
      </div>
    </div>
  )
}
