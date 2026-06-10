import { useState } from 'react'
import { Star, Download, ShieldCheck, Clock, ShieldAlert, Check, Loader2 } from 'lucide-react'
import type { SkillListing } from '../../types/skill'
import { cn } from '../../lib/utils'

interface Props {
  skill: SkillListing
  onInstall: (id: string) => void
  onView: (id: string) => void
}

const bumblebeeConfig = {
  passed: { icon: ShieldCheck, label: 'Verified', color: 'text-success bg-[rgba(16,185,129,0.15)] border-[rgba(16,185,129,0.3)]' },
  pending: { icon: Clock, label: 'Pending', color: 'text-warning bg-[rgba(245,158,11,0.15)] border-[rgba(245,158,11,0.3)]' },
  failed: { icon: ShieldAlert, label: 'Flagged', color: 'text-error bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.3)]' },
}

const categoryColors: Record<string, string> = {
  research: 'bg-[rgba(59,130,246,0.15)] text-primary',
  coding: 'bg-[rgba(16,185,129,0.15)] text-success',
  data: 'bg-[rgba(139,92,246,0.15)] text-[#8B5CF6]',
  security: 'bg-[rgba(239,68,68,0.15)] text-error',
  communication: 'bg-[rgba(245,158,11,0.15)] text-warning',
  automation: 'bg-[rgba(236,72,153,0.15)] text-[#EC4899]',
  creative: 'bg-[rgba(6,182,212,0.15)] text-[#06B6D4]',
}

export function SkillCard({ skill, onInstall, onView }: Props) {
  const [installState, setInstallState] = useState<'idle' | 'installing' | 'installed'>('idle')
  const bee = bumblebeeConfig[skill.bumblebeeStatus]
  const BeeIcon = bee.icon

  const handleInstall = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (installState !== 'idle') return
    setInstallState('installing')
    setTimeout(() => {
      setInstallState('installed')
      onInstall(skill.id)
    }, 1200)
  }

  return (
    <div
      onClick={() => onView(skill.id)}
      className="bg-surface border border-border rounded-lg p-4 space-y-3 hover:border-border-focus hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', categoryColors[skill.category])}>
          {skill.category}
        </span>
        <span className={cn('flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium', bee.color)}>
          <BeeIcon size={10} />
          {bee.label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${skill.color}26` }}
          aria-hidden="true"
        >
          {skill.icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate">{skill.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span>{skill.author.name}</span>
            {skill.author.verified && <Check size={10} className="text-primary" />}
          </div>
        </div>
      </div>

      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{skill.shortDescription}</p>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={cn(i < Math.round(skill.rating) ? 'fill-warning text-warning' : 'text-text-muted')} />
          ))}
          <span className="ml-1 text-text-muted">({skill.reviewCount})</span>
        </div>
        <span className="text-text-muted">{skill.installCount.toLocaleString()} installs</span>
      </div>

      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skill.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <span className={cn('text-xs font-medium', skill.price === 0 ? 'text-success' : 'text-text-primary')}>
          {skill.price === 0 ? 'Free' : `$${skill.price.toFixed(2)}`}
        </span>
        <button
          onClick={handleInstall}
          disabled={installState !== 'idle'}
          className={cn(
            'ml-auto flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-medium transition-all duration-150',
            installState === 'idle' && 'bg-primary text-white hover:bg-primary-hover',
            installState === 'installing' && 'bg-primary/50 text-white/70 cursor-wait',
            installState === 'installed' && 'bg-success/15 text-success cursor-default'
          )}
        >
          {installState === 'idle' && <Download size={12} />}
          {installState === 'installing' && <Loader2 size={12} className="animate-spin" />}
          {installState === 'installed' && <Check size={12} />}
          {installState === 'idle' ? 'Install' : installState === 'installing' ? 'Installing...' : 'Installed'}
        </button>
      </div>
    </div>
  )
}
