export interface SwarmAgentConfig {
  agentId: string
  role: 'coordinator' | 'researcher' | 'executor' | 'critic' | 'synthesizer'
  model: string
  instructions: string
  weight?: number
}

export interface SwarmConfig {
  id: string
  name: string
  description: string
  goal: string
  agents: SwarmAgentConfig[]
  consensusMode: 'majority' | 'unanimous' | 'weighted'
  maxRounds: number
  timeoutMinutes: number
  createdAt: string
}

export interface SwarmMessage {
  id: string
  round: number
  agentId: string
  agentName: string
  agentRole: 'coordinator' | 'researcher' | 'executor' | 'critic' | 'synthesizer'
  content: string
  timestamp: string
  messageType: 'proposal' | 'feedback' | 'vote' | 'consensus' | 'system'
}

export interface SwarmDecision {
  round: number
  proposal: string
  votes: {
    agentId: string
    vote: 'approve' | 'reject' | 'abstain'
    reasoning: string
    confidence: number
  }[]
  result: 'approved' | 'rejected' | 'deadlocked'
  consensusReached: boolean
}

export interface SwarmExecution {
  id: string
  configId: string
  status: 'running' | 'paused' | 'completed' | 'failed' | 'stopped'
  currentRound: number
  maxRounds: number
  startTime: string
  endTime?: string
  messages: SwarmMessage[]
  decisions: SwarmDecision[]
  finalOutput?: string
  cost: number
}
