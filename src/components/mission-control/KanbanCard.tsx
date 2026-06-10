import type { Agent } from '../../types/agent'
import type { Task } from '../../types/task'

const roleColors: Record<string, string> = {
  coordinator: '#8B5CF6',
  researcher: '#3B82F6',
  executor: '#10B981',
  critic: '#F59E0B',
  synthesizer: '#EC4899',
}

const priorityConfig = {
  low: { bg: 'bg-[rgba(107,114,128,0.15)]', text: 'text-[#9CA3AF]', label: 'Low' },
  medium: { bg: 'bg-[rgba(245,158,11,0.15)]', text: 'text-warning', label: 'Medium' },
  high: { bg: 'bg-[rgba(239,68,68,0.15)]', text: 'text-error', label: 'High' },
  critical: { bg: 'bg-[rgba(239,68,68,0.15)]', text: 'text-error', label: 'Critical', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.3)]' },
}

interface Props {
  task: Task
  agent?: Agent
  isDragging?: boolean
}

export function KanbanCard({ task, agent, isDragging }: Props) {
  const p = priorityConfig[task.priority]
  const cost = task.estimatedCost < 1 ? `$${task.estimatedCost.toFixed(2)}` : `$${task.estimatedCost.toFixed(2)}`

  return (
    <div
      className={`rounded-md bg-surface border border-border p-3 space-y-2 cursor-grab active:cursor-grabbing hover:border-border-focus hover:shadow-lg transition-all duration-150 ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      role="listitem"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-medium uppercase tracking-wider ${p.bg} ${p.text} ${'glow' in p ? p.glow : ''}`}>
          {p.label}
        </span>
        <span className="text-[11px] text-text-muted tabular-nums">{cost}</span>
      </div>
      <h4 className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">{task.title}</h4>
      {agent && (
        <div className="flex items-center gap-2 pt-0.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
            style={{ backgroundColor: roleColors[agent.role] }}
            aria-hidden="true"
          >
            {agent.name[0]}
          </div>
          <span className="text-xs text-text-secondary truncate">{agent.name}</span>
        </div>
      )}
    </div>
  )
}
