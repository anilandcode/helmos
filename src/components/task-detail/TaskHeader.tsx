import { ArrowLeft } from 'lucide-react'
import type { Task } from '../../types/task'
import { StatusBadge } from '../mission-control/StatusBadge'

interface Props {
  task: Task
  onBack?: () => void
}

export function TaskHeader({ task, onBack }: Props) {
  const formatCost = (cost: number) => `$${cost.toFixed(4)}`
  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString() : '—'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-md bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors duration-150"
            aria-label="Back to tasks"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-text-muted mb-1">Tasks / Task Detail</div>
          <h1 className="text-2xl font-semibold text-text-primary truncate">{task.title}</h1>
        </div>
        <StatusBadge status={task.status === 'in_progress' ? 'working' : task.status === 'review' ? 'idle' : task.status === 'done' ? 'online' : 'idle'} />
      </div>

      <div className="flex items-center gap-4 text-sm text-text-secondary flex-wrap">
        {task.agentName && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white">
              {task.agentName[0]}
            </div>
            <span>{task.agentName}</span>
          </div>
        )}
        {task.modelUsed && <span className="text-text-muted">{task.modelUsed}</span>}
        <span className="font-mono text-text-primary">{formatCost(task.cost ?? 0)}</span>
        <span className="text-text-muted">{formatDate(task.createdAt)}</span>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed">{task.description}</p>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-surface-elevated border border-border text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
