import { useState } from 'react'
import { ChevronDown, Save, X, Shield } from 'lucide-react'
import type { ProceduralMemory } from '../../types/memory'
import { cn } from '../../lib/utils'

interface Props {
  entries: ProceduralMemory[]
  onEdit: (id: string, code: string) => void
}

export function ProcedurePanel({ entries, onEdit }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCode, setEditCode] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)

  const startEdit = (entry: ProceduralMemory) => {
    setEditingId(entry.id)
    setEditCode(entry.code)
    setExpandedId(entry.id)
  }

  const saveEdit = (id: string) => {
    onEdit(id, editCode)
    setEditingId(null)
    setSavedId(id)
    setTimeout(() => setSavedId(null), 500)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditCode('')
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-text-secondary">No custom skills. Install from marketplace or let agents evolve their own.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3" role="tabpanel">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            'bg-surface border rounded-md overflow-hidden transition-all duration-150',
            savedId === entry.id ? 'border-success' : 'border-border hover:border-border-focus'
          )}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary">{entry.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-secondary">
                    v{entry.version}
                  </span>
                  <Shield size={12} className="text-success" />
                </div>
                <p className="text-xs text-text-secondary">{entry.description}</p>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="p-1.5 rounded bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors duration-150"
                aria-label="Expand procedure"
              >
                <ChevronDown size={14} className={cn('transition-transform duration-150', expandedId === entry.id && 'rotate-180')} />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Success Rate</span>
                  <span className="text-text-secondary">{Math.round(entry.successRate * 100)}%</span>
                </div>
                <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-250"
                    style={{ width: `${entry.successRate * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-text-muted">
                <span className="font-medium text-text-secondary">{entry.usageCount}</span> uses
              </div>
            </div>
          </div>

          {expandedId === entry.id && (
            <div className="border-t border-border p-4 space-y-3 bg-background">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide">Code</h4>
                {editingId !== entry.id && (
                  <button
                    onClick={() => startEdit(entry)}
                    className="text-xs px-2 py-1 rounded bg-surface border border-border text-text-secondary hover:bg-surface-elevated transition-colors duration-150"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingId === entry.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-sm text-xs text-text-primary font-mono resize-none focus:border-border-focus focus:ring-2 focus:ring-primary-muted outline-none"
                    rows={8}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(entry.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors duration-150"
                    >
                      <Save size={12} />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-surface border border-border text-text-secondary text-xs font-medium hover:bg-surface-elevated transition-colors duration-150"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <pre className="text-xs font-mono text-text-secondary bg-surface border border-border rounded-sm p-3 overflow-x-auto">
                  {entry.code}
                </pre>
              )}

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide">Schema</h4>
                <pre className="text-xs font-mono text-text-secondary bg-surface border border-border rounded-sm p-3 overflow-x-auto">
                  {JSON.stringify(JSON.parse(entry.schema), null, 2)}
                </pre>
              </div>

              <div className="text-xs text-text-muted space-y-1">
                <div>Created: {new Date(entry.createdAt).toLocaleString()}</div>
                <div>Updated: {new Date(entry.updatedAt).toLocaleString()}</div>
                {entry.parentVersion && <div>Evolved from: v{entry.parentVersion}</div>}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
