import { Send, Loader2 } from 'lucide-react'
import { useCommandBar } from '../../hooks/useCommandBar'
import { CommandSuggestions } from './CommandSuggestions'

interface Props {
  onSubmit: (command: string, model: string) => void | Promise<void>
}

export function CommandBar({ onSubmit }: Props) {
  const {
    value,
    setValue,
    model,
    setModel,
    isSubmitting,
    flash,
    selectedIndex,
    suggestions,
    models,
    inputRef,
    handleSubmit,
    handleKeyDown,
    selectSuggestion,
  } = useCommandBar(onSubmit)

  const canSubmit = value.trim().length > 0 && !isSubmitting

  return (
    <div className="relative">
      <CommandSuggestions
        suggestions={suggestions}
        selectedIndex={selectedIndex}
        onSelect={selectSuggestion}
        visible={value.length >= 2}
      />
      <div
        className={`flex items-center gap-3 px-4 py-2 bg-surface border-t border-border transition-colors duration-150 ${
          flash === 'success' ? 'border-success' : flash === 'error' ? 'border-error' : ''
        }`}
      >
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="text-xs bg-surface-elevated border border-border rounded-full px-2.5 py-1.5 text-text-secondary outline-none focus:border-border-focus shrink-0"
          aria-label="Model selector"
        >
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <textarea
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Command your agents... (e.g., 'Research Q3 competitors and draft email')"
          disabled={isSubmitting}
          rows={1}
          className="flex-1 bg-background border border-border rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-2 focus:ring-primary-muted outline-none resize-none transition-colors duration-150 disabled:opacity-50"
          aria-label="Command input"
          style={{ minHeight: 36 }}
        />
        <div className="flex items-center gap-2 shrink-0">
          {value.length > 0 && (
            <span className="text-[10px] text-text-muted">{value.length}</span>
          )}
          <button
            onClick={() => handleSubmit()}
            disabled={!canSubmit}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            aria-label={isSubmitting ? 'Processing...' : 'Submit command'}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
