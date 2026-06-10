export interface SemanticMemory {
  id: string
  category: string
  content: string
  sourceUrl?: string
  confidence: number
  lastVerified: string
  embedding?: number[]
}

export interface EpisodicMemory {
  id: string
  episodeType: string
  taskId?: string
  agentId: string
  agentName: string
  content: string
  outcome: 'success' | 'failure' | 'partial'
  timestamp: string
  cost?: number
  durationMs?: number
}

export interface ProceduralMemory {
  id: string
  name: string
  description: string
  code: string
  schema: string
  version: string
  parentVersion?: string
  successRate: number
  usageCount: number
  createdAt: string
  updatedAt: string
}
