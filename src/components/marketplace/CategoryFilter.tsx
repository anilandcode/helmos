import { cn } from '../../lib/utils'

const categories = [
  { id: 'all', label: 'All', color: '#6B7280' },
  { id: 'research', label: 'Research', color: '#3B82F6' },
  { id: 'coding', label: 'Coding', color: '#10B981' },
  { id: 'data', label: 'Data', color: '#8B5CF6' },
  { id: 'security', label: 'Security', color: '#EF4444' },
  { id: 'communication', label: 'Communication', color: '#F59E0B' },
  { id: 'automation', label: 'Automation', color: '#EC4899' },
  { id: 'creative', label: 'Creative', color: '#06B6D4' },
]

interface Props {
  active: string
  onSelect: (id: string) => void
}

export function CategoryFilter({ active, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by category">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          role="tab"
          aria-selected={active === cat.id}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors duration-150',
            active === cat.id ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary hover:border-border-focus hover:text-text-primary'
          )}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
          {cat.label}
        </button>
      ))}
    </div>
  )
}
