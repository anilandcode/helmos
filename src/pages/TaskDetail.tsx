import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TaskHeader } from '../components/task-detail/TaskHeader'
import { CheckpointTimeline } from '../components/task-detail/CheckpointTimeline'
import { InterventionBar } from '../components/task-detail/InterventionBar'
import { ReasoningPanel } from '../components/task-detail/ReasoningPanel'
import { mockTaskDetail } from '../data/mockTaskDetail'

export function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedCheckpointIndex, setSelectedCheckpointIndex] = useState(
    mockTaskDetail.currentCheckpointIndex ?? 0
  )

  if (id !== 'task-1' && id !== '1') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-lg text-text-primary">Task not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors duration-150"
        >
          Back to Mission Control
        </button>
      </div>
    )
  }

  const task = mockTaskDetail
  const selectedCheckpoint = task.checkpoints?.[selectedCheckpointIndex]
  const hasCheckpoints = task.checkpoints && task.checkpoints.length > 0

  const handlePause = () => {
    console.log('Task paused:', task.id)
  }

  const handleResume = () => {
    console.log('Task resumed:', task.id)
  }

  const handleKill = () => {
    console.log('Task killed:', task.id)
    navigate('/')
  }

  const handleRetryFrom = (checkpointIndex: number) => {
    console.log('Retrying from checkpoint:', checkpointIndex, task.checkpoints?.[checkpointIndex]?.name)
    setSelectedCheckpointIndex(checkpointIndex)
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <TaskHeader task={task} onBack={() => navigate('/')} />

          {hasCheckpoints && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">Timeline</h2>
              <CheckpointTimeline
                checkpoints={task.checkpoints!}
                currentIndex={selectedCheckpointIndex}
                onSelect={setSelectedCheckpointIndex}
              />
            </div>
          )}

          <InterventionBar
            task={task}
            onPause={handlePause}
            onResume={handleResume}
            onKill={handleKill}
            onRetryFrom={handleRetryFrom}
          />

          {selectedCheckpoint && (
            <div className="space-y-4 p-4 bg-surface border border-border rounded-lg">
              <ReasoningPanel
                checkpoint={selectedCheckpoint}
                task={task}
                isActive={selectedCheckpointIndex === task.currentCheckpointIndex}
              />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="p-4 bg-surface border border-border rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Task Activity</h3>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="p-2 bg-background rounded-sm border border-border">
                <span className="text-text-muted">Task created</span>
                <div className="text-text-primary mt-0.5">{new Date(task.createdAt).toLocaleTimeString()}</div>
              </div>
              {task.checkpoints?.filter(cp => cp.status === 'completed').map((cp) => (
                <div key={cp.index} className="p-2 bg-background rounded-sm border border-border">
                  <span className="text-success">{cp.name} completed</span>
                  <div className="text-text-primary mt-0.5">{cp.endTime ? new Date(cp.endTime).toLocaleTimeString() : '—'}</div>
                </div>
              ))}
              {task.checkpoints?.filter(cp => cp.status === 'active').map((cp) => (
                <div key={cp.index} className="p-2 bg-background rounded-sm border border-border border-primary">
                  <span className="text-primary">{cp.name} in progress</span>
                  <div className="text-text-primary mt-0.5">{cp.startTime ? new Date(cp.startTime).toLocaleTimeString() : '—'}</div>
                </div>
              ))}
            </div>
          </div>

          {task.inputRefs && task.inputRefs.length > 0 && (
            <div className="p-4 bg-surface border border-border rounded-lg space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">Input References</h3>
              <div className="flex flex-wrap gap-1.5">
                {task.inputRefs.map((ref, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-surface-elevated border border-border text-text-secondary">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
