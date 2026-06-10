import { cn } from '../../lib/utils'

const config: Record<string, { dot: string; label: string; bg: string; border: string; text: string }> = {
  online: { dot: 'bg-success', label: 'Online', bg: 'bg-[rgba(16,185,129,0.15)]', border: 'border-[rgba(16,185,129,0.3)]', text: 'text-success' },
  idle: { dot: 'bg-[#6B7280]', label: 'Idle', bg: 'bg-[rgba(107,114,128,0.15)]', border: 'border-[rgba(107,114,128,0.3)]', text: 'text-[#9CA3AF]' },
  working: { dot: 'bg-primary', label: 'Working', bg: 'bg-[rgba(59,130,246,0.15)]', border: 'border-[rgba(59,130,246,0.3)]', text: 'text-primary' },
  error: { dot: 'bg-error', label: 'Error', bg: 'bg-[rgba(239,68,68,0.15)]', border: 'border-[rgba(239,68,68,0.3)]', text: 'text-error' },
}

interface Props {
  status: 'online' | 'idle' | 'working' | 'error'
}

export function StatusBadge({ status }: Props) {
  const c = config[status]
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border', c.bg, c.border, c.text)}
      role="status"
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot, status === 'working' && 'animate-status-pulse')} />
      {c.label}
    </span>
  )
}
