import { Search, Bell, ChevronDown } from 'lucide-react'

export function TopBar() {
  return (
    <header className="flex items-center h-14 px-4 border-b border-border bg-glass-bg backdrop-blur-[12px] shrink-0 gap-3" role="banner">
      <span className="text-lg font-semibold text-text-primary tracking-tight md:hidden">HelmOS</span>
      <div className="relative flex-1 max-w-md ml-auto md:ml-0">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search agents, tasks, memory..."
          className="w-full pl-9 pr-3 py-1.5 rounded-sm bg-background border border-border text-sm text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-2 focus:ring-primary-muted outline-none transition-colors duration-150"
          aria-label="Search"
        />
      </div>
      <button className="relative p-2 rounded-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors duration-150" aria-label="Notifications">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
      </button>
      <button className="flex items-center gap-2 p-1.5 rounded-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors duration-150" aria-label="User menu">
        <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">JD</div>
        <ChevronDown size={14} className="max-sm:hidden" />
      </button>
    </header>
  )
}
