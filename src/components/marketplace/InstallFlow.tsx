import { useEffect, useState } from 'react'
import { X, Check, ShieldCheck, ShieldAlert } from 'lucide-react'
import type { SkillListing } from '../../types/skill'
import { cn } from '../../lib/utils'

interface Props {
  skill: SkillListing
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export function InstallFlow({ skill, isOpen, onClose, onConfirm }: Props) {
  const [state, setState] = useState<'confirm' | 'success'>('confirm')

  useEffect(() => {
    if (!isOpen) { setState('confirm'); return }
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(skill.id)
    setState('success')
    setTimeout(() => onClose(), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-surface border border-border rounded-lg max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        {state === 'confirm' ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">Install {skill.name}?</h3>
              <button onClick={onClose} className="p-1 rounded-sm text-text-muted hover:text-text-primary" aria-label="Close"><X size={16} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide">Permissions</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  {skill.capabilities.slice(0, 4).map((cap) => (
                    <li key={cap} className="flex items-center gap-2"><Check size={12} className="text-success" />{cap}</li>
                  ))}
                </ul>
              </div>

              {skill.price > 0 && (
                <div className="p-2 rounded-sm bg-warning/10 border border-warning/20 text-xs text-warning">
                  This skill costs ${skill.price.toFixed(2)} per use.
                </div>
              )}

              {skill.bumblebeeStatus === 'failed' && (
                <div className="flex items-center gap-2 p-2 rounded-sm bg-error/10 border border-error/20 text-xs text-error">
                  <ShieldAlert size={14} />
                  Security scan flagged issues. Install at your own risk.
                </div>
              )}

              {skill.bumblebeeStatus === 'passed' && (
                <div className="flex items-center gap-2 p-2 rounded-sm bg-success/10 border border-success/20 text-xs text-success">
                  <ShieldCheck size={14} />
                  Passed Bumblebee security scan.
                </div>
              )}
            </div>
            <div className="flex gap-3 p-4 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-surface border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors duration-150">Cancel</button>
              <button onClick={handleConfirm} className="flex-1 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors duration-150">Install</button>
            </div>
          </>
        ) : (
          <div className={cn('flex flex-col items-center justify-center p-8 space-y-3')}>
            <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center">
              <Check size={24} className="text-success" />
            </div>
            <p className="text-sm font-medium text-text-primary">Installed successfully</p>
            <p className="text-xs text-text-muted">{skill.name} is ready to use.</p>
          </div>
        )}
      </div>
    </div>
  )
}
