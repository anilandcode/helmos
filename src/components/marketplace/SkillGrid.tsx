import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { SkillListing } from '../../types/skill'
import { SkillCard } from './SkillCard'
import { CategoryFilter } from './CategoryFilter'

interface Props {
  skills: SkillListing[]
  onInstall: (id: string) => void
  onView: (id: string) => void
}

type SortOption = 'popular' | 'newest' | 'highest' | 'price'

export function SkillGrid({ skills, onInstall, onView }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortOption>('popular')

  const filtered = useMemo(() => {
    let result = skills
    if (category !== 'all') result = result.filter((s) => s.category === category)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q)) || s.author.name.toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'popular': return [...result].sort((a, b) => b.installCount - a.installCount)
      case 'newest': return [...result].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      case 'highest': return [...result].sort((a, b) => b.rating - a.rating)
      case 'price': return [...result].sort((a, b) => a.price - b.price)
    }
  }, [skills, category, search, sort])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-2 focus:ring-primary-muted outline-none transition-colors duration-150"
            aria-label="Search skills"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-text-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-xs bg-surface border border-border rounded-sm px-2 py-1.5 text-text-secondary outline-none focus:border-border-focus"
            aria-label="Sort skills"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="price">Price: Low to High</option>
          </select>
        </div>
      </div>

      <CategoryFilter active={category} onSelect={setCategory} />

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">No skills match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} onInstall={onInstall} onView={onView} />
          ))}
        </div>
      )}
    </div>
  )
}
