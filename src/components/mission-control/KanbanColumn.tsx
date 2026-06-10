import { useDroppable } from '@dnd-kit/core'
import type { Agent } from '../../types/agent'
import type { Task } from '../../types/task'
import { KanbanCard } from './KanbanCard'

const columnLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
}

interface Props {
  status: string
  tasks: Task[]
  agents: Agent[]
  draggingId: string | null
}

export function KanbanColumn({ status, tasks, agents, draggingId }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-0 rounded-sm bg-[#0d1117] p-2 transition-colors duration-150 ${
        isOver ? 'border-2 border-dashed border-primary-muted' : 'border-2 border-transparent'
      }`}
      role="list"
      aria-label={columnLabels[status]}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{columnLabels[status]}</span>
        <span className="text-xs text-text-muted">{tasks.length}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-auto min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-20 border border-dashed border-border rounded-sm">
            <span className="text-xs text-text-muted">Drop tasks here</span>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              agent={task.assignedAgent ? agents.find((a) => a.id === task.assignedAgent) : undefined}
              isDragging={draggingId === task.id}
            />
          ))
        )}
      </div>
    </div>
  )
}
