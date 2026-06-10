import { ShieldCheck, Clock, ShieldAlert, Shield } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  status: 'passed' | 'pending' | 'failed' | 'not_scanned'
  size?: 'sm' | 'md' | 'lg'
}

const config = {
  passed: { icon: ShieldCheck, label: 'Security Verified', color: 'text-success', bg: 'bg-[rgba(16,185,129,0.15)]', border: 'border-[rgba(16,185,129,0.3)]' },
  pending: { icon: Clock, label: 'Pending Scan', color: 'text-warning', bg: 'bg-[rgba(245,158,11,0.15)]', border: 'border-[rgba(245,158,11,0.3)]' },
  failed: { icon: ShieldAlert, label: 'Security Issue', color: 'text-error', bg: 'bg-[rgba(239,68,68,0.15)]', border: 'border-[rgba(239,68,68,0.3)]' },
  not_scanned: { icon: Shield, label: 'Not Scanned', color: 'text-text-muted', bg: 'bg-surface-elevated', border: 'border-border' },
}

const sizeClasses = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-sm px-3 py-1.5',
}

const iconSizes = { sm: 10, md: 14, lg: 18 }

export function BumblebeeBadge({ status, size = 'md' }: Props) {
  const c = config[status]
  const Icon = c.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-medium',
      c.bg, c.border, c.color, sizeClasses[size],
      status === 'pending' && 'animate-pulse-slow'
    )}>
      <Icon size={iconSizes[size]} />
      {c.label}
    </span>
  )
}
