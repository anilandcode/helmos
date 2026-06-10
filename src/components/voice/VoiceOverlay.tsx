import { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, X, Loader2, Check, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCommand: (command: string) => void
}

type State = 'idle' | 'listening' | 'processing' | 'success' | 'error'

export function VoiceOverlay({ isOpen, onClose, onCommand }: Props) {
  const [state, setState] = useState<State>('idle')
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setState('idle')
    setTranscript('')
    const timer = setTimeout(() => {
      setState('listening')
      const simTimer = setTimeout(() => {
        setState('processing')
        const doneTimer = setTimeout(() => {
          const mock = 'Run security audit'
          setTranscript(mock)
          setState('success')
          onCommand(mock)
          setTimeout(() => { onClose(); setState('idle') }, 2000)
        }, 2000)
        return () => clearTimeout(doneTimer)
      }, 3000)
      return () => clearTimeout(simTimer)
    }, 500)
    return () => clearTimeout(timer)
  }, [isOpen, onClose, onCommand])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === ' ' && state === 'idle') setState('listening')
  }, [onClose, state])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-20 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Voice command">
      <div className="bg-surface-elevated border border-border rounded-xl p-8 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">Voice Command</h2>
          <button onClick={onClose} className="p-1 rounded-sm text-text-muted hover:text-text-primary" aria-label="Close"><X size={18} /></button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300',
            state === 'listening' ? 'bg-primary animate-status-pulse' :
            state === 'processing' ? 'bg-warning' :
            state === 'success' ? 'bg-success' :
            state === 'error' ? 'bg-error' : 'bg-surface-elevated'
          )}>
            {state === 'listening' && <Mic size={24} className="text-white" />}
            {state === 'processing' && <Loader2 size={24} className="text-white animate-spin" />}
            {state === 'success' && <Check size={24} className="text-white" />}
            {state === 'error' && <AlertTriangle size={24} className="text-white" />}
            {state === 'idle' && <MicOff size={24} className="text-text-muted" />}
          </div>

          <div className="flex items-center gap-1 h-12">
            {state === 'listening' && (
              <>
                <div className="w-1 rounded-full bg-primary animate-[pulse_0.8s_ease-in-out_infinite]" style={{ height: '20px' }} />
                <div className="w-1 rounded-full bg-primary animate-[pulse_0.6s_ease-in-out_infinite]" style={{ height: '36px' }} />
                <div className="w-1 rounded-full bg-primary animate-[pulse_1s_ease-in-out_infinite]" style={{ height: '52px' }} />
                <div className="w-1 rounded-full bg-primary animate-[pulse_0.7s_ease-in-out_infinite]" style={{ height: '44px' }} />
                <div className="w-1 rounded-full bg-primary animate-[pulse_0.9s_ease-in-out_infinite]" style={{ height: '28px' }} />
              </>
            )}
          </div>

          <p className={cn('text-sm font-medium',
            state === 'listening' ? 'text-primary' :
            state === 'processing' ? 'text-warning' :
            state === 'success' ? 'text-success' : 'text-text-secondary'
          )}>
            {state === 'idle' && 'Press Space to start'}
            {state === 'listening' && 'Listening...'}
            {state === 'processing' && 'Processing...'}
            {state === 'success' && `Heard: "${transcript}"`}
            {state === 'error' && 'Could not understand. Try again.'}
          </p>

          <p className="text-xs text-text-muted pt-4 text-center">
            Try saying: "Run security audit", "Check agent health"
          </p>
        </div>
      </div>
    </div>
  )
}
