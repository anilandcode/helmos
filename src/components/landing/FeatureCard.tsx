import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: Props) {
  return (
    <div className="bg-surface border border-border rounded-md p-6 space-y-3 hover:border-border-focus hover:shadow-lg transition-all duration-150">
      <div className="w-10 h-10 rounded-lg bg-primary-muted text-primary flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  )
}
