import { useState } from 'react'
import { CheckCircle, AlertTriangle, Users, DollarSign, Puzzle, ChevronDown } from 'lucide-react'
import type { ActivityEntry } from '../../types/activity'
import { relativeTime } from '../../lib/utils'

const typeConfig: Record<string, { icon: typeof CheckCircle; label: string; color: string; bg: string }> = {
  task_completed: {
    icon: CheckCircle,
    label: 'Task completed',
    color: 'text-success',
    bg: 'bg-[rgba(16,185,129,0.15)]',
  },
  agent_blocked: {
    icon: AlertTriangle,
    label: 'Agent blocked',
    color: 'text-warning',
    bg: 'bg-[rgba(245,158,11,0.15)]',
  },
  swarm_started: {
    icon: Users,
    label: 'Swarm launched',
    color: 'text-primary',
    bg: 'bg-[rgba(59,130,246,0.15)]',
  },
  cost_alert: {
    icon: DollarSign,
    label: 'Budget warning',
    color: 'text-error',
    bg: 'bg-[rgba(239,68,68,0.15)]',
  },
  skill_installed: {
    icon: Puzzle,
    label: 'Skill installed',
    color: 'text-info',
    bg: 'bg-[rgba(96,165,250,0.15)]',
  },
}

function buildBody(entry: ActivityEntry): string {
  switch (entry.type) {
    case 'task_completed':
      return `${entry.agentName ?? 'Agent'} completed '${entry.taskName ?? 'task'}'`
    case 'agent_blocked':
      return `${entry.agentName ?? 'Agent'}: ${entry.reason ?? 'unknown error'}`
    case 'swarm_started':
      return `${entry.swarmName ?? 'Swarm'} with ${entry.agentCount ?? 0} agents`
    case 'cost_alert':
      return `Daily spend at ${entry.percent ?? 0}%`
    case 'skill_installed':
      return `${entry.skillName ?? 'Skill'} by ${entry.author ?? 'unknown'}`
  }
}

interface Props {
  entry: ActivityEntry
}

export function ActivityItem({ entry }: Props) {
  const [expanded, setExpanded] = useState(false)
  const c = typeConfig[entry.type]
  const Icon = c.icon

  return (
    <button
      onClick={() => setExpanded((e) => !e)}
      className="w-full flex items-start gap-3 p-2.5 rounded-md text-left hover:bg-surface-elevated transition-colors duration-150 group"
      aria-expanded={expanded}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${c.bg} ${c.color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-text-primary">{c.label}</span>
          <span className="text-[10px] text-text-muted shrink-0">{relativeTime(entry.timestamp)}</span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{buildBody(entry)}</p>
        {entry.type === 'agent_blocked' && (
          <span className="inline-block mt-1.5 text-[10px] font-medium text-primary hover:underline">Resolve →</span>
        )}
        {entry.type === 'cost_alert' && (
          <span className="inline-block mt-1.5 text-[10px] font-medium text-primary hover:underline">View →</span>
        )}
        <div
          className={`grid transition-all duration-150 ${
            expanded ? 'grid-rows-[1fr] mt-2 opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <pre className="text-[10px] text-text-muted bg-background rounded-sm p-2 font-mono whitespace-pre-wrap break-all">
              {JSON.stringify(entry, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      <ChevronDown
        size={12}
        className={`text-text-muted mt-1 shrink-0 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
      />
    </button>
  )
}
