import type { Suggestion } from '../../hooks/useCommandBar'

interface Props {
  suggestions: Suggestion[]
  selectedIndex: number
  onSelect: (text: string) => void
  visible: boolean
}

export function CommandSuggestions({ suggestions, selectedIndex, onSelect, visible }: Props) {
  if (!visible || suggestions.length === 0) return null

  const grouped: Record<string, typeof suggestions> = {}
  for (const s of suggestions) {
    if (!grouped[s.category]) grouped[s.category] = []
    grouped[s.category].push(s)
  }

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 rounded-md bg-surface-elevated border border-border shadow-lg max-h-48 overflow-auto z-50">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <div className="px-3 py-1.5 text-[10px] font-semibold text-text-muted uppercase tracking-wider">{category}</div>
          {items.map((s, i) => {
            const globalIndex = suggestions.indexOf(s)
            return (
              <button
                key={`${s.text}-${i}`}
                onClick={() => onSelect(s.text)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm text-text-secondary hover:bg-primary-muted transition-colors duration-100 ${
                  globalIndex === selectedIndex ? 'bg-primary-muted border-l-2 border-primary' : 'border-l-2 border-transparent'
                }`}
              >
                <span className="text-xs">{s.icon}</span>
                <span className="truncate">{s.text}</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
