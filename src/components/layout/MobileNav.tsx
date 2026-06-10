import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Brain, Puzzle, Users, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

const tabs = [
  { to: '/', icon: LayoutDashboard, label: 'Mission' },
  { to: '/memory', icon: Brain, label: 'Memory' },
  { to: '/skills', icon: Puzzle, label: 'Skills' },
  { to: '/swarm', icon: Users, label: 'Swarm' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function MobileNav() {
  return (
    <nav
      className="hidden max-md:flex items-center justify-around border-t border-border bg-surface shrink-0 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: 52 }}
      aria-label="Mobile navigation"
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-text-secondary hover:text-text-primary transition-colors duration-150 min-h-[44px]',
              isActive && 'text-primary border-t-2 border-primary pt-[calc(0.375rem_-_2px)]'
            )
          }
        >
          <Icon size={18} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
