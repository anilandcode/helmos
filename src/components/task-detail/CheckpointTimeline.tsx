import { Check, X, RefreshCw } from 'lucide-react'
import type { Checkpoint } from '../../types/task'
import { cn } from '../../lib/utils'

interface Props {
  checkpoints: Checkpoint[]
  currentIndex: number
  onSelect: (index: number) => void
}

export function CheckpointTimeline({ checkpoints, currentIndex, onSelect }: Props) {
  const getDotContent = (checkpoint: Checkpoint, index: number) => {
    if (checkpoint.status === 'completed') return <Check size={12} className="text-white" />
    if (checkpoint.status === 'failed') return <X size={12} className="text-white" />
    if (checkpoint.status === 'retrying') return <RefreshCw size={12} className="text-white animate-spin" />
    if (checkpoint.status === 'active' || index === currentIndex) return <div className="w-2 h-2 rounded-full bg-white" />
    return null
  }

  const getDotStyles = (checkpoint: Checkpoint, index: number) => {
    const base = 'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 cursor-pointer'
    if (checkpoint.status === 'completed') return cn(base, 'bg-success border-success')
    if (checkpoint.status === 'failed') return cn(base, 'bg-error border-error')
    if (checkpoint.status === 'retrying') return cn(base, 'bg-warning border-warning')
    if (checkpoint.status === 'active' || index === currentIndex) return cn(base, 'bg-primary border-primary ring-4 ring-primary-muted animate-pulse-slow')
    return cn(base, 'bg-transparent border-border text-text-muted hover:border-text-secondary')
  }

  const getLineStyle = (index: number) => {
    if (index >= checkpoints.length - 1) return ''
    const current = checkpoints[index]
    const next = checkpoints[index + 1]
    if (current.status === 'completed' && next.status !== 'pending') return 'bg-success'
    return 'bg-surface-elevated'
  }

  const formatDuration = (start?: string, end?: string) => {
    if (!start) return ''
    const startTime = new Date(start).getTime()
    const endTime = end ? new Date(end).getTime() : Date.now()
    const seconds = Math.floor((endTime - startTime) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="space-y-4" role="tablist" aria-label="Checkpoint timeline">
      <div className="flex items-center gap-0 max-md:flex-col max-md:items-start max-md:gap-4">
        {checkpoints.map((checkpoint, index) => (
          <div key={index} className="flex items-center max-md:w-full">
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => onSelect(index)}
                className={getDotStyles(checkpoint, index)}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`${checkpoint.name}: ${checkpoint.status}`}
                title={`${checkpoint.name} - ${checkpoint.status}${checkpoint.startTime ? ` (${formatDuration(checkpoint.startTime, checkpoint.endTime)})` : ''}`}
              >
                {getDotContent(checkpoint, index)}
              </button>
              <div className="text-xs text-text-secondary text-center whitespace-nowrap max-md:text-left max-md:w-full">
                {checkpoint.name}
              </div>
            </div>
            {index < checkpoints.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-2 max-md:hidden', getLineStyle(index))} />
            )}
            {index < checkpoints.length - 1 && (
              <div className={cn('w-0.5 h-4 my-1 md:hidden', getLineStyle(index))} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
