import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Bot, ClipboardList, Brain, Puzzle, Users, BarChart3, Shield, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { cn } from '../../lib/utils'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Mission Control' },
  { to: '/agents/1', icon: Bot, label: 'Agent Profile' },
  { to: '/tasks/1', icon: ClipboardList, label: 'Task Detail' },
  { to: '/memory', icon: Brain, label: 'Memory Explorer' },
  { to: '/skills', icon: Puzzle, label: 'Skill Marketplace' },
  { to: '/swarm', icon: Users, label: 'Swarm Orchestrator' },
  { to: '/analytics', icon: BarChart3, label: 'Router Analytics' },
  { to: '/security', icon: Shield, label: 'Security Audit' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-surface shrink-0 transition-all duration-250 max-md:hidden',
        sidebarCollapsed ? 'w-16' : 'w-[280px]'
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center h-14 px-4 border-b border-border">
        {!sidebarCollapsed && (
          <span className="text-lg font-semibold text-text-primary tracking-tight">HelmOS</span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn('ml-auto p-1 rounded-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-primary', sidebarCollapsed && 'ml-0')}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="flex-1 py-2" role="navigation">
        {links.map(({ to, icon: Icon, label }, i) => (
          <div key={to} className="relative" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors duration-150 border-l-2 border-transparent focus-visible:ring-2 focus-visible:ring-primary',
                  isActive && 'bg-primary-muted text-primary border-l-2 border-primary',
                  sidebarCollapsed && 'justify-center px-2'
                )
              }
              aria-label={sidebarCollapsed ? label : undefined}
            >
              <Icon size={20} strokeWidth={1.5} />
              {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
            </NavLink>
            {sidebarCollapsed && hoveredIndex === i && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 bg-surface-elevated border border-border rounded-sm text-xs text-text-primary whitespace-nowrap shadow-lg pointer-events-none">
                {label}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
