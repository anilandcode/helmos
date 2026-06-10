import { Search } from 'lucide-react'

interface Props {
  onSearch: (query: string) => void
  activeTab: string
}

const placeholders: Record<string, string> = {
  semantic: 'Search knowledge base...',
  episodic: 'Search episode history...',
  procedural: 'Search procedures and skills...',
}

export function MemorySearch({ onSearch, activeTab }: Props) {
  return (
    <div className="relative" role="search">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        placeholder={placeholders[activeTab] ?? 'Search memory...'}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-2 focus:ring-primary-muted outline-none transition-colors duration-150"
        aria-label="Search memory"
      />
    </div>
  )
}
