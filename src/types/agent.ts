export interface Agent {
  id: string
  name: string
  role: 'coordinator' | 'researcher' | 'executor' | 'critic' | 'synthesizer'
  status: 'online' | 'idle' | 'working' | 'error'
  currentTask?: string
  model: string
  lastHeartbeat: string
  successRate: number
  costToday: number
}
