export interface ActivityEntry {
  id: string
  type: 'task_completed' | 'agent_blocked' | 'swarm_started' | 'cost_alert' | 'skill_installed'
  agentName?: string
  taskName?: string
  swarmName?: string
  agentCount?: number
  skillName?: string
  author?: string
  reason?: string
  percent?: number
  timestamp: string
}
