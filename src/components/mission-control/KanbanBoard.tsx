import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import { useKanban } from '../../hooks/useKanban'
import type { Agent } from '../../types/agent'
import type { Task } from '../../types/task'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'

interface Props {
  tasks: Task[]
  agents: Agent[]
}

export function KanbanBoard({ tasks: initialTasks, agents }: Props) {
  const { tasksByColumn, activeId, handleDragStart, handleDragEnd } = useKanban(initialTasks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const activeTask = initialTasks.find((t) => t.id === activeId)

  const onDragStart = (event: DragStartEvent) => handleDragStart(event)
  const onDragEnd = (event: DragEndEvent) => handleDragEnd(event)

  const columns = [
    { id: 'todo', tasks: tasksByColumn.todo },
    { id: 'in_progress', tasks: tasksByColumn.in_progress },
    { id: 'review', tasks: tasksByColumn.review },
    { id: 'done', tasks: tasksByColumn.done },
  ]

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="h-full grid grid-cols-4 gap-2 overflow-hidden max-lg:flex max-lg:overflow-x-auto max-lg:gap-2">
        {columns.map((col) => (
          <div key={col.id} className="min-h-0 max-lg:w-[280px] max-lg:shrink-0">
            <KanbanColumn status={col.id} tasks={col.tasks} agents={agents} draggingId={activeId} />
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} agent={activeTask.assignedAgent ? agents.find((a) => a.id === activeTask.assignedAgent) : undefined} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
