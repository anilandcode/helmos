import type { ApiKey, ModelPref, NotifSettings, AppearanceSettings } from '../types/settings'
import type { SecurityScan, GuardrailConfig, AuditLogEntry } from '../types/security'

const now = Date.now()
const hour = 3600000
const day = 86400000

export const mockApiKeys: ApiKey[] = [
  { id: 'key-1', provider: 'Anthropic', label: 'Production', keyPreview: 'sk-ant-...X4k9', status: 'active', lastUsed: new Date(now - hour).toISOString(), createdAt: new Date(now - 30 * day).toISOString() },
  { id: 'key-2', provider: 'OpenAI', label: 'Production', keyPreview: 'sk-...7mP2', status: 'active', lastUsed: new Date(now - 2 * hour).toISOString(), createdAt: new Date(now - 25 * day).toISOString() },
  { id: 'key-3', provider: 'Google', label: 'Research', keyPreview: 'AIza...9vB1', status: 'expired', lastUsed: new Date(now - 7 * day).toISOString(), createdAt: new Date(now - 90 * day).toISOString() },
  { id: 'key-4', provider: 'Perplexity', label: 'Search', keyPreview: 'pplx-...3dF8', status: 'active', lastUsed: new Date(now - 3 * hour).toISOString(), createdAt: new Date(now - 14 * day).toISOString() },
  { id: 'key-5', provider: 'OpenAI', label: 'Legacy', keyPreview: 'sk-...0zW5', status: 'revoked', lastUsed: new Date(now - 60 * day).toISOString(), createdAt: new Date(now - 120 * day).toISOString() },
]

export const mockModelPref: ModelPref = {
  strategy: 'auto',
  autoFallback: true,
  notifyOnFallback: true,
  dailyLimit: 50,
  monthlyLimit: 1000,
  warningThreshold: 80,
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.1:8b',
  taskModels: [
    { taskType: 'Analysis', model: 'Claude 4 Sonnet', maxCost: 0.10 },
    { taskType: 'Coding', model: 'DeepSeek V4', maxCost: 0.05 },
    { taskType: 'Research', model: 'GPT-5', maxCost: 0.08 },
    { taskType: 'Generation', model: 'Llama 4 Scout', maxCost: 0.00 },
  ],
}

export const mockNotifSettings: NotifSettings = {
  agentBlocked: true,
  taskCompleted: false,
  costThreshold: true,
  fallback: true,
  securityAlert: true,
  swarmDeadlock: true,
  emailEnabled: true,
  slackEnabled: false,
  webhookEnabled: false,
  webhookUrl: '',
}

export const mockAppearanceSettings: AppearanceSettings = {
  theme: 'dark',
  density: 'comfortable',
  fontSize: 16,
  reduceAnimations: false,
}

export const mockSecurityScans: SecurityScan[] = [
  { id: 'scan-1', type: 'skill', target: 'Perplexity Research', status: 'passed', issues: 0, timestamp: new Date(now - hour).toISOString() },
  { id: 'scan-2', type: 'skill', target: 'Code Refactorer', status: 'passed', issues: 0, timestamp: new Date(now - 3 * hour).toISOString() },
  { id: 'scan-3', type: 'dependency', target: 'npm audit', status: 'warning', issues: 3, timestamp: new Date(now - 6 * hour).toISOString(), details: '3 moderate vulnerabilities in dev dependencies' },
  { id: 'scan-4', type: 'skill', target: 'Data Pipeline Builder', status: 'failed', issues: 2, timestamp: new Date(now - day).toISOString(), details: 'Outbound requests to unverified domains' },
  { id: 'scan-5', type: 'full', target: 'Full system scan', status: 'passed', issues: 1, timestamp: new Date(now - 2 * day).toISOString(), details: '1 informational finding' },
  { id: 'scan-6', type: 'skill', target: 'Email Composer', status: 'warning', issues: 1, timestamp: new Date(now - 3 * day).toISOString(), details: 'Pending verification' },
]

export const mockGuardrailConfig: GuardrailConfig = {
  blockUnknownDomains: true,
  requireApprovalHighCost: true,
  limitFileAccess: true,
  sanitizeOutputs: true,
  logAllToolCalls: true,
  approvalThreshold: 1.00,
}

export const mockAuditLog: AuditLogEntry[] = [
  { id: 'log-1', eventType: 'task_executed', agentId: 'agent-1', agentName: 'Nova', description: 'Completed competitor pricing analysis', severity: 'info', timestamp: new Date(now - hour).toISOString() },
  { id: 'log-2', eventType: 'fallback_triggered', agentId: 'agent-3', agentName: 'Echo', description: 'Gemini rate limited, fell back to DeepSeek V4', severity: 'warning', timestamp: new Date(now - 5 * hour).toISOString() },
  { id: 'log-3', eventType: 'security_scan', agentId: 'system', agentName: 'System', description: 'Skill scan completed: Data Pipeline Builder failed (2 issues)', severity: 'error', timestamp: new Date(now - day).toISOString() },
  { id: 'log-4', eventType: 'guardrail_blocked', agentId: 'agent-2', agentName: 'Atlas', description: 'Blocked outbound request to unverified domain api.unknown-service.com', severity: 'critical', timestamp: new Date(now - day - 2 * hour).toISOString() },
  { id: 'log-5', eventType: 'key_rotated', agentId: 'user', agentName: 'Admin', description: 'Rotated Anthropic API key (Production)', severity: 'info', timestamp: new Date(now - 2 * day).toISOString() },
  { id: 'log-6', eventType: 'approval_required', agentId: 'agent-1', agentName: 'Nova', description: 'Task cost exceeded $1.00 threshold, awaiting approval', severity: 'warning', timestamp: new Date(now - 2 * day - 3 * hour).toISOString() },
  { id: 'log-7', eventType: 'swarm_deadlock', agentId: 'swarm-1', agentName: 'Market Research Collective', description: 'Deadlock in round 3: unable to reach consensus', severity: 'warning', timestamp: new Date(now - 3 * day).toISOString() },
]
