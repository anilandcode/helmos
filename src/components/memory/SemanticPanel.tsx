import { useState } from 'react'
import { Edit2, Save, X, ExternalLink } from 'lucide-react'
import type { SemanticMemory } from '../../types/memory'

interface Props {
  entries: SemanticMemory[]
  onEdit: (id: string, content: string) => void
}

export function SemanticPanel({ entries, onEdit }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)

  const startEdit = (entry: SemanticMemory) => {
    setEditingId(entry.id)
    setEditContent(entry.content)
  }

  const saveEdit = (id: string) => {
    onEdit(id, editContent)
    setEditingId(null)
    setSavedId(id)
    setTimeout(() => setSavedId(null), 500)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-text-secondary">No semantic memories yet. Agents build knowledge as they work.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="tabpanel">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={`bg-surface border rounded-md p-4 space-y-3 transition-all duration-150 ${
            savedId === entry.id ? 'border-success' : 'border-border hover:border-border-focus hover:shadow-lg'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
              {entry.category}
            </span>
            {editingId !== entry.id && (
              <button
                onClick={() => startEdit(entry)}
                className="p-1.5 rounded bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors duration-150"
                aria-label="Edit entry"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>

          {editingId === entry.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 bg-background border border-border rounded-sm text-sm text-text-primary font-mono resize-none focus:border-border-focus focus:ring-2 focus:ring-primary-muted outline-none"
                rows={4}
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
            <p className="text-sm text-text-secondary leading-relaxed">{entry.content}</p>
          )}

          {entry.sourceUrl && (
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink size={12} />
              View source
            </a>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Confidence</span>
              <span className="text-text-secondary">{Math.round(entry.confidence * 100)}%</span>
            </div>
            <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-250"
                style={{ width: `${entry.confidence * 100}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-text-muted">
            Verified: {new Date(entry.lastVerified).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
