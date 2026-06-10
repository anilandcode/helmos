import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { Checkpoint, Task } from '../../types/task'
import { cn } from '../../lib/utils'

interface Props {
  checkpoint: Checkpoint
  task: Task
  isActive?: boolean
}

export function ReasoningPanel({ checkpoint, task, isActive }: Props) {
  const [expanded, setExpanded] = useState(isActive ?? false)

  if (!checkpoint.reasoning && !checkpoint.toolUsed && !checkpoint.input && !checkpoint.output) {
    return (
      <div className="text-sm text-text-muted italic">Reasoning appears when agent reaches this step</div>
    )
  }

  const ConfidenceBadge = () => {
    if (checkpoint.confidence === undefined) return null
    const color = checkpoint.confidence >= 0.8 ? 'text-success bg-success/10 border-success/20' :
                  checkpoint.confidence >= 0.5 ? 'text-warning bg-warning/10 border-warning/20' :
                  'text-error bg-error/10 border-error/20'
    return (
      <span className={cn('text-xs px-2 py-0.5 rounded-full border', color)}>
        {Math.round(checkpoint.confidence * 100)}% confidence
      </span>
    )
  }

  return (
    <div className="space-y-3" role="tabpanel">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left"
        aria-expanded={expanded}
      >
        <h3 className="text-sm font-semibold text-text-primary">Reasoning</h3>
        <ConfidenceBadge />
        <ChevronDown
          size={16}
          className={cn('text-text-muted ml-auto transition-transform duration-150', expanded && 'rotate-180')}
        />
      </button>

      {expanded && (
        <div className="space-y-4 text-sm">
          {checkpoint.reasoning && (
            <p className="text-text-secondary leading-relaxed">{checkpoint.reasoning}</p>
          )}

          {checkpoint.toolUsed && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                {checkpoint.toolUsed}
              </span>
            </div>
          )}

          {task.inputRefs && task.inputRefs.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wide">Input References</div>
              <div className="flex flex-wrap gap-1.5">
                {task.inputRefs.map((ref, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-surface-elevated border border-border text-text-secondary">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {checkpoint.output && (
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wide">Output</div>
              <pre className="text-xs font-mono text-text-secondary bg-background border border-border rounded-sm p-3 overflow-x-auto">
                {checkpoint.output}
              </pre>
            </div>
          )}

          {task.uncertainty && (
            <div className="space-y-1.5 p-3 bg-warning/10 border border-warning/20 rounded-md">
              <div className="text-xs font-medium text-warning uppercase tracking-wide">Uncertainty</div>
              <p className="text-sm text-text-secondary">{task.uncertainty}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
