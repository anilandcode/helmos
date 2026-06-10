export interface ModelRegistryEntry {
  id: string
  name: string
  provider: string
  capabilities: {
    reasoning: number
    coding: number
    longContext: number
    toolUse: number
    speed: number
    costEfficiency: number
  }
  costPer1kInput: number
  costPer1kOutput: number
  contextWindow: number
  status: 'available' | 'degraded' | 'unavailable' | 'deprecated'
  lastUsed: string
  successRate7d: number
  avgLatencyMs: number
}

export interface RoutingDecision {
  id: string
  taskId: string
  taskType: string
  selectedModel: string
  selectedModelId: string
  reasoning: string
  confidence: number
  estimatedCost: number
  actualCost: number
  estimatedTokens: number
  actualTokens: number
  latencyMs: number
  fallbackFrom?: string
  fallbackReason?: string
  timestamp: string
  inputSample?: string
}

export interface FallbackEvent {
  id: string
  originalModel: string
  fallbackModel: string
  reason: string
  taskId: string
  timestamp: string
  resolved: boolean
  retryCount: number
}
