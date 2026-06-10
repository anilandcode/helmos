import { useState, useEffect, useRef, useCallback } from 'react'
import { Circle, AlertTriangle, Square } from 'lucide-react'
import type { SwarmExecution } from '../../types/swarm'
import { SwarmMessageCard } from './SwarmMessageCard'
import { ConsensusChart } from './ConsensusChart'
import { cn } from '../../lib/utils'

interface Props {
  execution: SwarmExecution
  onStop: () => void
}

export function SwarmLiveView({ execution, onStop }: Props) {
  const [showStopConfirm, setShowStopConfirm] = useState(false)
  const [userScrolledUp, setUserScrolledUp] = useState(false)
  const streamRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.scrollTo({ top: streamRef.current.scrollHeight, behavior: 'smooth' })
      setUserScrolledUp(false)
    }
  }, [])

  useEffect(() => {
    if (!userScrolledUp && streamRef.current) {
      streamRef.current.scrollTo({ top: streamRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [execution.messages, userScrolledUp])

  const handleScroll = useCallback(() => {
    const el = streamRef.current
    if (!el) return
    const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setUserScrolledUp(fromBottom > 50)
  }, [])

  const groupedMessages = execution.messages.reduce((acc, msg) => {
    if (!acc[msg.round]) acc[msg.round] = []
    acc[msg.round].push(msg)
    return acc
  }, {} as Record<number, typeof execution.messages>)

  const elapsed = execution.startTime ? Math.floor((Date.now() - new Date(execution.startTime).getTime()) / 1000) : 0
  const formatTime = (sec: number) => sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`

  const statusColors: Record<string, string> = {
    running: 'text-success',
    paused: 'text-warning',
    completed: 'text-primary',
    failed: 'text-error',
    stopped: 'text-text-muted',
  }

  const latestDecision = execution.decisions[execution.decisions.length - 1]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-text-primary">Live Execution</h2>
        <span className={cn('flex items-center gap-1 text-xs font-medium', statusColors[execution.status])}>
          {execution.status === 'running' && <Circle size={6} className="fill-success animate-status-pulse" />}
          {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted">
          Round {execution.currentRound}/{execution.maxRounds}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-secondary">Message Stream</h3>
          <div
            ref={streamRef}
            onScroll={handleScroll}
            className="h-[500px] overflow-auto space-y-3 rounded-md bg-background border border-border p-3"
            role="log"
            aria-live="polite"
            aria-atomic="false"
          >
            {Object.entries(groupedMessages).map(([round, messages]) => (
              <div key={round}>
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-1.5 mb-2 border-b border-border">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Round {round}</span>
                </div>
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <SwarmMessageCard key={msg.id} message={msg} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {userScrolledUp && (
            <button
              onClick={scrollToBottom}
              className="text-xs px-3 py-1 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors duration-150"
            >
              Scroll to latest ↓
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-secondary">Consensus</h3>

          {latestDecision && (
            <div className="bg-surface border border-border rounded-md p-3">
              <ConsensusChart decision={latestDecision} />
            </div>
          )}

          {!latestDecision && (
            <div className="bg-surface border border-border rounded-md p-4 text-center text-sm text-text-muted">
              No decisions yet. Voting begins after proposals.
            </div>
          )}

          {execution.decisions.some((d) => d.result === 'deadlocked') && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-warning/10 border border-warning/20">
              <AlertTriangle size={14} className="text-warning shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-warning font-medium">Deadlock detected</p>
                <p className="text-[10px] text-text-muted mt-0.5">Agents cannot reach consensus.</p>
              </div>
              <button className="text-xs px-2 py-1 rounded-sm bg-warning text-white font-medium hover:bg-warning/90 transition-colors duration-150">
                Force
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-surface border border-border rounded-md">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span>Cost: <span className="font-mono text-text-primary">${execution.cost.toFixed(4)}</span></span>
          <span>Time: <span className="font-mono text-text-primary">{formatTime(elapsed)}</span></span>
          <span>Messages: <span className="text-text-primary">{execution.messages.length}</span></span>
        </div>
        <button
          onClick={() => setShowStopConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-error text-white text-xs font-medium hover:bg-error/90 transition-colors duration-150"
        >
          <Square size={12} />
          Stop Swarm
        </button>
      </div>

      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowStopConfirm(false)}>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Stop Swarm?</h3>
            <p className="text-sm text-text-secondary mb-6">This will halt all agents immediately. Progress up to this point will be saved.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowStopConfirm(false)} className="px-4 py-2 rounded-md bg-surface border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors duration-150">Cancel</button>
              <button onClick={() => { onStop(); setShowStopConfirm(false) }} className="px-4 py-2 rounded-md bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors duration-150">Stop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
