import { useState, useMemo, useCallback } from 'react'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import type { Task } from '../types/task'

const columns = ['todo', 'in_progress', 'review', 'done'] as const

export function useKanban(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)

  const tasksByColumn = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const col of columns) map[col] = []
    for (const t of tasks) {
      if (map[t.status]) map[t.status].push(t)
    }
    return map
  }, [tasks])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const taskId = String(active.id)
    const newStatus = String(over.id)

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t))
    )
  }, [])

  return { tasksByColumn, activeId, handleDragStart, handleDragEnd }
}
