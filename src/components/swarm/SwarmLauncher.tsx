import { Play, Copy, Edit2, Users } from 'lucide-react'
import type { SwarmConfig } from '../../types/swarm'

const roleColors: Record<string, string> = {
  coordinator: '#8B5CF6',
  researcher: '#3B82F6',
  executor: '#10B981',
  critic: '#F59E0B',
  synthesizer: '#EC4899',
}

interface Props {
  configs: SwarmConfig[]
  onLaunch: (id: string) => void
  onCreate: () => void
}

const consensusLabels: Record<string, string> = {
  majority: 'Majority',
  unanimous: 'Unanimous',
  weighted: 'Weighted',
}

export function SwarmLauncher({ configs, onLaunch, onCreate }: Props) {
  if (configs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <Users size={32} className="text-text-muted" />
        <p className="text-sm text-text-secondary">No swarm configs. Create your first multi-agent team.</p>
        <button onClick={onCreate} className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors duration-150">
          New Swarm
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">Swarm Configs</h2>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-elevated text-text-muted">{configs.length}</span>
        </div>
        <button onClick={onCreate} className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors duration-150">
          New Swarm
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {configs.map((config) => (
          <div key={config.id} className="bg-surface border border-border rounded-md p-4 space-y-3 hover:border-border-focus transition-colors duration-150">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-text-primary">{config.name}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{config.description}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted shrink-0">
                {consensusLabels[config.consensusMode]}
              </span>
            </div>

            <div className="p-2 bg-background rounded-sm border border-border">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">Goal</span>
              <p className="text-xs text-text-primary mt-0.5">{config.goal}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {config.agents.map((agent) => (
                  <div
                    key={agent.agentId}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white border-2 border-surface"
                    style={{ backgroundColor: roleColors[agent.role] }}
                    title={`${agent.role} — ${agent.model}`}
                  >
                    {agent.role[0].toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="text-xs text-text-muted">{config.agents.length} agents</span>
              <span className="text-xs text-text-muted ml-auto">Max {config.maxRounds} rounds</span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={() => onLaunch(config.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors duration-150"
              >
                <Play size={12} />
                Launch
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary text-xs font-medium hover:bg-surface-elevated transition-colors duration-150">
                <Edit2 size={12} />
                Edit
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary text-xs font-medium hover:bg-surface-elevated transition-colors duration-150">
                <Copy size={12} />
                Duplicate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
