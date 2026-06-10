import { useNavigate } from 'react-router-dom'
import type { Agent } from '../../types/agent'
import { StatusBadge } from './StatusBadge'

const roleColors: Record<string, string> = {
  coordinator: '#8B5CF6',
  researcher: '#3B82F6',
  executor: '#10B981',
  critic: '#F59E0B',
  synthesizer: '#EC4899',
}

interface Props {
  agent: Agent
}

export function AgentCard({ agent }: Props) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/agents/${agent.id}`)}
      className="w-full flex items-center gap-3 p-3 rounded-md bg-surface border border-border hover:border-border-focus hover:shadow-lg transition-all duration-150 text-left cursor-pointer"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
        style={{ backgroundColor: roleColors[agent.role] }}
        aria-hidden="true"
      >
        {agent.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary">{agent.name}</div>
        <div className="text-xs text-text-secondary capitalize">{agent.role}</div>
        {agent.currentTask && agent.status === 'working' && (
          <div className="text-xs text-primary truncate mt-0.5">{agent.currentTask}</div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <StatusBadge status={agent.status} />
        <span className="text-xs text-text-muted">{(agent.successRate * 100).toFixed(0)}%</span>
      </div>
    </button>
  )
}
