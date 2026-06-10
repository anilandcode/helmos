import type { ReactNode } from 'react'

interface Props {
  number: number
  icon: ReactNode
  title: string
  description: string
}

export function StepCard({ number, icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 relative">
      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold shadow-lg">
        {icon ?? number}
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs leading-relaxed">{description}</p>
    </div>
  )
}
