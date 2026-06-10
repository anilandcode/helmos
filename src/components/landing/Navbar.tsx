import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'



const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'GitHub', href: 'https://github.com' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-250',
        scrolled ? 'bg-glass-bg backdrop-blur-[12px] border-b border-glass-border' : 'bg-transparent'
      )}
      role="navigation"
      aria-label="Main"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
        <a href="/" className="text-lg font-semibold text-text-primary tracking-tight">
          HelmOS
        </a>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden md:block px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150">
            Sign In
          </button>
          <button className="hidden md:block px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-150">
            Get Started
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-sm text-text-secondary hover:text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block text-sm text-text-secondary hover:text-text-primary py-1">
              {link.label}
            </a>
          ))}
          <button className="block w-full px-4 py-2 rounded-md bg-primary text-white text-sm font-medium mt-2">
            Get Started
          </button>
        </div>
      )}
    </nav>
  )
}
