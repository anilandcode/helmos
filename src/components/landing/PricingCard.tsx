import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  plan: string
  price: string
  features: string[]
  cta: string
  ctaVariant: 'primary' | 'secondary'
  popular?: boolean
  icon: ReactNode
}

export function PricingCard({ plan, price, features, cta, ctaVariant, popular, icon }: Props) {
  return (
    <div className={cn('relative bg-surface border rounded-xl p-6 space-y-4 transition-all duration-150', popular ? 'border-primary shadow-lg' : 'border-border hover:border-border-focus hover:shadow-lg')} aria-label={`${plan} plan — ${price}`}>
      {popular && (
        <span className="absolute -top-2.5 right-4 text-xs px-3 py-1 rounded-full bg-primary text-white font-medium">
          Most Popular
        </span>
      )}
      <div className="w-8 h-8 rounded-lg bg-primary-muted text-primary flex items-center justify-center">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary">{plan}</h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-bold text-text-primary">{price}</span>
          {price !== 'Custom' && <span className="text-sm text-text-muted">/mo</span>}
        </div>
      </div>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-success mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        className={cn(
          'w-full py-2.5 rounded-md text-sm font-medium transition-colors duration-150',
          ctaVariant === 'primary' ? 'bg-primary text-white hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-surface border border-border text-text-secondary hover:bg-surface-elevated'
        )}
      >
        {cta}
      </button>
    </div>
  )
}
