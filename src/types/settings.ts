export interface ApiKey {
  id: string
  provider: string
  label: string
  keyPreview: string
  status: 'active' | 'expired' | 'revoked'
  lastUsed: string
  createdAt: string
}

export interface ModelPref {
  strategy: 'auto' | 'cost' | 'quality' | 'speed' | 'custom'
  autoFallback: boolean
  notifyOnFallback: boolean
  dailyLimit: number
  monthlyLimit: number
  warningThreshold: number
  ollamaUrl: string
  ollamaModel: string
  taskModels: { taskType: string; model: string; maxCost: number }[]
}

export interface NotifSettings {
  agentBlocked: boolean
  taskCompleted: boolean
  costThreshold: boolean
  fallback: boolean
  securityAlert: boolean
  swarmDeadlock: boolean
  emailEnabled: boolean
  slackEnabled: boolean
  webhookEnabled: boolean
  webhookUrl: string
}

export interface AppearanceSettings {
  theme: 'dark' | 'light' | 'system'
  density: 'compact' | 'comfortable' | 'spacious'
  fontSize: number
  reduceAnimations: boolean
}
