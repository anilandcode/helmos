import type { SwarmMessage } from '../../types/swarm'
import { cn } from '../../lib/utils'

const roleColors: Record<string, string> = {
  coordinator: '#8B5CF6',
  researcher: '#3B82F6',
  executor: '#10B981',
  critic: '#F59E0B',
  synthesizer: '#EC4899',
}

const messageTypeConfig: Record<string, { label: string; color: string }> = {
  proposal: { label: 'Proposal', color: 'bg-primary/10 text-primary border-primary/20' },
  feedback: { label: 'Feedback', color: 'bg-info/10 text-info border-info/20' },
  vote: { label: 'Vote', color: 'bg-warning/10 text-warning border-warning/20' },
  consensus: { label: 'Consensus', color: 'bg-success/10 text-success border-success/20' },
  system: { label: 'System', color: 'bg-text-muted/10 text-text-muted border-border' },
}

interface Props {
  message: SwarmMessage
  isHighlighted?: boolean
}

export function SwarmMessageCard({ message, isHighlighted }: Props) {
  const borderColor = roleColors[message.agentRole] || '#6B7280'
  const typeCfg = messageTypeConfig[message.messageType]

  return (
    <div
      className={cn(
        'flex gap-3 p-3 rounded-md bg-surface border-l-[3px] border border-border transition-colors duration-150',
        isHighlighted && 'ring-1 ring-primary-muted'
      )}
      style={{ borderLeftColor: borderColor }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 mt-0.5"
        style={{ backgroundColor: borderColor }}
        aria-hidden="true"
      >
        {message.agentName[0]}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-text-primary">{message.agentName}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted capitalize">
            {message.agentRole}
          </span>
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', typeCfg.color)}>
            {typeCfg.label}
          </span>
          <span className="text-[10px] text-text-muted ml-auto">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{message.content}</p>
      </div>
    </div>
  )
}
