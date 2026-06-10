import { useState } from 'react'
import { SwarmLauncher } from '../components/swarm/SwarmLauncher'
import { SwarmLiveView } from '../components/swarm/SwarmLiveView'
import { mockSwarmConfigs, mockSwarmExecution } from '../data/mockSwarm'
import { cn } from '../lib/utils'

type Mode = 'launcher' | 'live' | 'history'

export function SwarmOrchestrator() {
  const [mode, setMode] = useState<Mode>('launcher')

  const handleLaunch = (configId: string) => {
    console.log(`[Swarm] Launched config: ${configId}`)
    setMode('live')
  }

  const handleCreate = () => {
    console.log('[Swarm] Create new config (stub)')
  }

  const handleStop = () => {
    console.log('[Swarm] Stopped execution')
    setMode('launcher')
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Swarm Orchestrator</h1>

      <div className="flex gap-1 border-b border-border">
        {(['launcher', 'live', 'history'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px capitalize',
              mode === m
                ? 'text-primary border-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border'
            )}
            role="tab"
            aria-selected={mode === m}
          >
            {m === 'launcher' ? 'Configs' : m === 'live' ? 'Live View' : 'History'}
          </button>
        ))}
      </div>

      {mode === 'launcher' && (
        <SwarmLauncher configs={mockSwarmConfigs} onLaunch={handleLaunch} onCreate={handleCreate} />
      )}

      {mode === 'live' && (
        <SwarmLiveView execution={mockSwarmExecution} onStop={handleStop} />
      )}

      {mode === 'history' && (
        <div className="py-12 text-center text-sm text-text-muted">
          No completed swarms yet. Launch a swarm to see execution history.
        </div>
      )}
    </div>
  )
}
