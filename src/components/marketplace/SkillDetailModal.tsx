import { useEffect } from 'react'
import { X, Star, ShieldCheck, Clock, ShieldAlert, Check, Download } from 'lucide-react'
import type { SkillListing, SkillReview } from '../../types/skill'
import { cn } from '../../lib/utils'

interface Props {
  skill: SkillListing
  isOpen: boolean
  onClose: () => void
  onInstall: (id: string) => void
  reviews: SkillReview[]
}

const bumblebeeConfig = {
  passed: { icon: ShieldCheck, label: 'Security Verified', color: 'text-success bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)]' },
  pending: { icon: Clock, label: 'Security Pending', color: 'text-warning bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]' },
  failed: { icon: ShieldAlert, label: 'Security Issue', color: 'text-error bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)]' },
}

export function SkillDetailModal({ skill, isOpen, onClose, onInstall, reviews }: Props) {
  const bee = bumblebeeConfig[skill.bumblebeeStatus]
  const BeeIcon = bee.icon
  const skillReviews = reviews.filter((r) => r.skillId === skill.id)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-surface-elevated border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto shadow-xl max-sm:max-h-full max-sm:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 p-6 border-b border-border">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: `${skill.color}26` }}
          >
            {skill.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-text-primary">{skill.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-text-muted">v{skill.version}</span>
              <div className="flex items-center gap-1 text-xs text-text-secondary">
                <span>{skill.author.name}</span>
                {skill.author.verified && <Check size={10} className="text-primary" />}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface transition-colors duration-150" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={cn('flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium', bee.color)}>
            <BeeIcon size={16} />
            {bee.label}
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">{skill.description}</p>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">Capabilities</h3>
            <div className="space-y-1.5">
              {skill.capabilities.map((cap) => (
                <div key={cap} className="flex items-center gap-2 text-sm text-text-secondary">
                  <Check size={14} className="text-success shrink-0" />
                  {cap}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background border border-border rounded-md p-3 text-center">
              <div className="text-lg font-semibold text-text-primary">{skill.rating}</div>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} className={cn(i < Math.round(skill.rating) ? 'fill-warning text-warning' : 'text-text-muted')} />)}
              </div>
              <div className="text-xs text-text-muted mt-1">{skill.reviewCount} reviews</div>
            </div>
            <div className="bg-background border border-border rounded-md p-3 text-center">
              <div className="text-lg font-semibold text-text-primary">{skill.installCount.toLocaleString()}</div>
              <div className="text-xs text-text-muted mt-1">Installs</div>
            </div>
            <div className="bg-background border border-border rounded-md p-3 text-center">
              <div className="text-lg font-semibold text-text-primary">{new Date(skill.lastUpdated).toLocaleDateString()}</div>
              <div className="text-xs text-text-muted mt-1">Updated</div>
            </div>
          </div>

          {skillReviews.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Recent Reviews</h3>
              <div className="space-y-3">
                {skillReviews.slice(0, 3).map((rev) => (
                  <div key={rev.id} className="bg-background border border-border rounded-md p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-primary">{rev.author}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} className={cn(i < rev.rating ? 'fill-warning text-warning' : 'text-text-muted')} />)}
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-border">
          <span className={cn('text-sm font-medium', skill.price === 0 ? 'text-success' : 'text-text-primary')}>
            {skill.price === 0 ? 'Free' : `$${skill.price.toFixed(2)}`}
          </span>
          <button
            onClick={() => onInstall(skill.id)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors duration-150"
          >
            <Download size={14} />
            Install Skill
          </button>
        </div>
      </div>
    </div>
  )
}
