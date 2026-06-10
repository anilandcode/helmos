export interface Checkpoint {
  index: number
  name: string
  status: 'pending' | 'active' | 'completed' | 'failed' | 'retrying'
  startTime?: string
  endTime?: string
  cost?: number
  reasoning?: string
  toolUsed?: string
  confidence?: number
  input?: string
  output?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedAgent?: string
  agentId?: string
  agentName?: string
  modelUsed?: string
  cost?: number
  createdAt: string
  updatedAt?: string
  completedAt?: string
  tags: string[]
  estimatedCost: number
  checkpoints?: Checkpoint[]
  currentCheckpointIndex?: number
  reasoning?: string
  uncertainty?: string
  inputRefs?: string[]
  output?: string
  error?: string
}
