export interface SecurityScan {
  id: string
  type: 'skill' | 'dependency' | 'full'
  target: string
  status: 'passed' | 'failed' | 'warning'
  issues: number
  timestamp: string
  details?: string
}

export interface GuardrailConfig {
  blockUnknownDomains: boolean
  requireApprovalHighCost: boolean
  limitFileAccess: boolean
  sanitizeOutputs: boolean
  logAllToolCalls: boolean
  approvalThreshold: number
}

export interface AuditLogEntry {
  id: string
  eventType: string
  agentId: string
  agentName: string
  description: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  timestamp: string
}
