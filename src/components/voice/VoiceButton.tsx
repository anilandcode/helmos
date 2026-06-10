import { Mic } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  onClick: () => void
  visible?: boolean
}

export function VoiceButton({ onClick, visible = true }: Props) {
  if (!visible) return null

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-24 right-6 max-md:bottom-20 max-md:right-4 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover hover:scale-105 transition-all duration-150 z-40',
        'animate-[pulse_3s_ease-in-out_infinite]',
        'ring-2 ring-primary-muted'
      )}
      aria-label="Open voice command"
    >
      <Mic size={24} className="mx-auto" />
    </button>
  )
}
