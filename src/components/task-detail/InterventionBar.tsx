import { Pause, Play, XCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import type { Task } from '../../types/task'
import { cn } from '../../lib/utils'

interface Props {
  task: Task
  onPause: () => void
  onResume: () => void
  onKill: () => void
  onRetryFrom: (checkpointIndex: number) => void
}

export function InterventionBar({ task, onPause, onResume, onKill, onRetryFrom }: Props) {
  const [showKillModal, setShowKillModal] = useState(false)
  const [showRetryDropdown, setShowRetryDropdown] = useState(false)
  const [showRetryConfirm, setShowRetryConfirm] = useState<number | null>(null)

  const isRunning = task.status === 'in_progress'
  const isPaused = task.status === 'review'
  const hasCheckpoints = task.checkpoints && task.checkpoints.length > 0

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`
  const formatTime = (iso?: string) => {
    if (!iso) return '—'
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-surface-elevated border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-3 h-3 rounded-full',
              isRunning ? 'bg-success animate-pulse' : isPaused ? 'bg-warning' : 'bg-text-muted'
            )} />
            <span className="text-sm font-medium text-text-primary capitalize">{task.status.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPause}
              disabled={!isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-warning text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-warning/90 transition-colors duration-150"
              aria-label="Pause task"
            >
              <Pause size={14} />
              Pause
            </button>
            <button
              onClick={onResume}
              disabled={!isPaused}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors duration-150"
              aria-label="Resume task"
            >
              <Play size={14} />
              Resume
            </button>
            <button
              onClick={() => setShowKillModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors duration-150"
              aria-label="Kill task"
            >
              <XCircle size={14} />
              Kill
            </button>
            <div className="relative">
              <button
                onClick={() => setShowRetryDropdown(!showRetryDropdown)}
                disabled={!hasCheckpoints}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-elevated transition-colors duration-150"
                aria-label="Retry from checkpoint"
              >
                <RefreshCw size={14} />
                Retry from
              </button>
              {showRetryDropdown && hasCheckpoints && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-surface border border-border rounded-md shadow-lg z-20">
                  {task.checkpoints!.map((cp, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setShowRetryConfirm(i)
                        setShowRetryDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-elevated transition-colors duration-100 border-b border-border last:border-b-0"
                    >
                      {cp.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-text-muted">
          <span>Cost: <span className="font-mono text-text-primary">{formatCost(task.cost ?? 0)}</span></span>
          <span>Time: <span className="font-mono text-text-primary">{formatTime(task.createdAt)}</span></span>
        </div>
      </div>

      {showKillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowKillModal(false)}>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Kill Task</h3>
            <p className="text-sm text-text-secondary mb-6">Kill '{task.title}'? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowKillModal(false)}
                className="px-4 py-2 rounded-md bg-surface border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onKill()
                  setShowKillModal(false)
                }}
                className="px-4 py-2 rounded-md bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors duration-150"
              >
                Kill
              </button>
            </div>
          </div>
        </div>
      )}

      {showRetryConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRetryConfirm(null)}>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Retry from Checkpoint</h3>
            <p className="text-sm text-text-secondary mb-6">
              Retry from '{task.checkpoints?.[showRetryConfirm]?.name}'? All progress after this checkpoint will be lost.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRetryConfirm(null)}
                className="px-4 py-2 rounded-md bg-surface border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRetryFrom(showRetryConfirm)
                  setShowRetryConfirm(null)
                }}
                className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors duration-150"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
