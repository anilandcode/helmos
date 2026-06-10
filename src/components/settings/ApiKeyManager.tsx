import { useState } from 'react'
import { Plus, RotateCw, Trash2, Eye, EyeOff, X, Key } from 'lucide-react'
import type { ApiKey } from '../../types/settings'
import { cn } from '../../lib/utils'

interface Props {
  keys: ApiKey[]
  onAdd: (provider: string, label: string, key: string) => void
  onDelete: (id: string) => void
  onRotate: (id: string) => void
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'text-success bg-[rgba(16,185,129,0.15)]' },
  expired: { label: 'Expired', color: 'text-warning bg-[rgba(245,158,11,0.15)]' },
  revoked: { label: 'Revoked', color: 'text-error bg-[rgba(239,68,68,0.15)]' },
}

const providers = ['Anthropic', 'OpenAI', 'Google', 'Perplexity', 'DeepSeek', 'Ollama']

export function ApiKeyManager({ keys, onAdd, onDelete, onRotate }: Props) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [showKey, setShowKey] = useState<string | null>(null)
  const [newProvider, setNewProvider] = useState(providers[0])
  const [newLabel, setNewLabel] = useState('')
  const [newKey, setNewKey] = useState('')
  const [showNewKey, setShowNewKey] = useState(false)

  if (keys.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">API Keys</h2>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors duration-150">
            <Plus size={14} /> Add Key
          </button>
        </div>
        <div className="py-12 text-center">
          <Key size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">No API keys configured. Add your first key to enable agent execution.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">API Keys</h2>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors duration-150">
          <Plus size={14} /> Add Key
        </button>
      </div>

      <div className="p-2.5 rounded-sm bg-warning/10 border border-warning/20 text-xs text-warning">
        Keys are encrypted at rest. Never share or commit them.
      </div>

      <div className="space-y-2">
        {keys.map((key) => {
          const sc = statusConfig[key.status]
          return (
            <div key={key.id} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-md hover:border-border-focus transition-colors duration-150">
              <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-semibold text-text-secondary">
                {key.provider[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{key.provider}</span>
                  <span className="text-xs text-text-muted">{key.label}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-mono text-text-muted">
                    {showKey === key.id ? key.keyPreview : key.keyPreview.replace(/\.{3}/, '••••••')}
                  </span>
                  <button onClick={() => setShowKey(showKey === key.id ? null : key.id)} className="text-text-muted hover:text-text-secondary" aria-label="Toggle key visibility">
                    {showKey === key.id ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                </div>
              </div>
              <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', sc.color)}>{sc.label}</span>
              <span className="text-[10px] text-text-muted hidden sm:block">{new Date(key.lastUsed).toLocaleDateString()}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => onRotate(key.id)} className="p-1.5 rounded-sm text-text-muted hover:text-text-secondary hover:bg-surface-elevated transition-colors duration-150" aria-label="Rotate key">
                  <RotateCw size={12} />
                </button>
                <button onClick={() => setDeleteTarget(key.id)} className="p-1.5 rounded-sm text-text-muted hover:text-error hover:bg-surface-elevated transition-colors duration-150" aria-label="Delete key">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary">Add API Key</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-sm text-text-muted hover:text-text-primary"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-muted">Provider</label>
                <select value={newProvider} onChange={(e) => setNewProvider(e.target.value)} className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 text-text-primary outline-none focus:border-border-focus">
                  {providers.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted">Label</label>
                <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g., Production" className="w-full mt-1 text-sm bg-background border border-border rounded-sm px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted">API Key</label>
                <div className="relative mt-1">
                  <input type={showNewKey ? 'text' : 'password'} value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="sk-..." className="w-full text-sm bg-background border border-border rounded-sm px-3 py-2 pr-9 font-mono text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus" />
                  <button onClick={() => setShowNewKey(!showNewKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                    {showNewKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { if (newLabel && newKey) { onAdd(newProvider, newLabel, newKey); setShowAddModal(false); setNewLabel(''); setNewKey('') } }} className="flex-1 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors duration-150">Save</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-md bg-surface border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-text-primary mb-2">Delete API Key?</h3>
            <p className="text-sm text-text-secondary mb-4">This action cannot be undone. Agents using this key will lose access.</p>
            <div className="flex gap-3">
              <button onClick={() => { onDelete(deleteTarget); setDeleteTarget(null) }} className="flex-1 px-4 py-2 rounded-md bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors duration-150">Delete</button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 rounded-md bg-surface border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
