import { useState, useMemo } from 'react'
import { Shield, ShieldCheck, AlertTriangle, FileText } from 'lucide-react'
import { BumblebeeBadge } from '../security/BumblebeeBadge'
import type { SecurityScan, GuardrailConfig, AuditLogEntry } from '../../types/security'
import { cn } from '../../lib/utils'

interface Props {
  scans: SecurityScan[]
  guardrails: GuardrailConfig
  auditLog: AuditLogEntry[]
  onUpdateGuardrails: (config: GuardrailConfig) => void
}

const statusColors: Record<string, string> = {
  passed: 'text-success bg-[rgba(16,185,129,0.15)]',
  failed: 'text-error bg-[rgba(239,68,68,0.15)]',
  warning: 'text-warning bg-[rgba(245,158,11,0.15)]',
}

const severityColors: Record<string, string> = {
  info: 'text-info',
  warning: 'text-warning',
  error: 'text-error',
  critical: 'text-error font-semibold',
}

const guardrailToggles: { key: keyof GuardrailConfig; label: string }[] = [
  { key: 'blockUnknownDomains', label: 'Block outbound requests to unknown domains' },
  { key: 'requireApprovalHighCost', label: 'Require human approval for high-cost tasks' },
  { key: 'limitFileAccess', label: 'Limit agent file access to workspace directory' },
  { key: 'sanitizeOutputs', label: 'Sanitize all LLM outputs before execution' },
  { key: 'logAllToolCalls', label: 'Log all tool calls to audit trail' },
]

export function SecurityAudit({ scans, guardrails, auditLog, onUpdateGuardrails }: Props) {
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredScans = useMemo(() => {
    if (statusFilter === 'all') return scans
    return scans.filter((s) => s.status === statusFilter)
  }, [scans, statusFilter])

  const totalScans = scans.length
  const passRate = totalScans > 0 ? (scans.filter((s) => s.status === 'passed').length / totalScans) * 100 : 0
  const activeGuardrails = guardrailToggles.filter((g) => guardrails[g.key]).length
  const lastScan = scans[0]

  const groupedLog = auditLog.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {} as Record<string, AuditLogEntry[]>)

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Security & Audit</h1>
        <BumblebeeBadge status="passed" size="md" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Scans', value: totalScans.toString(), icon: Shield },
          { label: 'Pass Rate', value: `${passRate.toFixed(0)}%`, icon: ShieldCheck },
          { label: 'Active Guardrails', value: `${activeGuardrails}/${guardrailToggles.length}`, icon: AlertTriangle },
          { label: 'Last Scan', value: lastScan ? new Date(lastScan.timestamp).toLocaleDateString() : '—', icon: FileText },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-md p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <s.icon size={12} />
              {s.label}
            </div>
            <div className="text-sm font-semibold text-text-primary">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Scan History</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-surface border border-border rounded-sm px-2 py-1 text-text-secondary outline-none focus:border-border-focus"
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="warning">Warning</option>
          </select>
        </div>
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-border text-xs text-text-muted uppercase tracking-wider">
              <th className="text-left py-2 px-2">Timestamp</th>
              <th className="text-left py-2 px-2">Type</th>
              <th className="text-left py-2 px-2">Target</th>
              <th className="text-center py-2 px-2">Status</th>
              <th className="text-right py-2 px-2">Issues</th>
            </tr>
          </thead>
          <tbody>
            {filteredScans.map((scan) => (
              <tr key={scan.id} className="border-b border-border hover:bg-surface-elevated transition-colors duration-100">
                <td className="py-2 px-2 text-text-muted text-xs">{new Date(scan.timestamp).toLocaleString()}</td>
                <td className="py-2 px-2 text-text-secondary capitalize">{scan.type}</td>
                <td className="py-2 px-2 text-text-primary">{scan.target}</td>
                <td className="py-2 px-2 text-center">
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize', statusColors[scan.status])}>{scan.status}</span>
                </td>
                <td className="py-2 px-2 text-right font-mono text-text-muted">{scan.issues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Guardrails</h2>
        <div className="space-y-1">
          {guardrailToggles.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between py-2.5 cursor-pointer">
              <span className="text-sm text-text-primary">{label}</span>
              <button
                role="switch"
                aria-checked={!!guardrails[key]}
                onClick={() => onUpdateGuardrails({ ...guardrails, [key]: !guardrails[key] })}
                className={`w-9 h-5 rounded-full transition-colors duration-150 ${guardrails[key] ? 'bg-primary' : 'bg-surface-elevated border border-border'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${guardrails[key] ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Audit Log</h2>
        <div className="space-y-4">
          {Object.entries(groupedLog).map(([date, entries]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{formatDateLabel(date)}</h3>
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-2.5 bg-surface border border-border rounded-md">
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', severityColors[entry.severity]?.includes('error') ? 'bg-error' : severityColors[entry.severity]?.includes('warning') ? 'bg-warning' : 'bg-info')} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-text-primary">{entry.eventType.replace(/_/g, ' ')}</span>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize', severityColors[entry.severity], entry.severity === 'info' ? 'bg-info/10' : entry.severity === 'warning' ? 'bg-warning/10' : 'bg-error/10')}>{entry.severity}</span>
                        <span className="text-[10px] text-text-muted ml-auto">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">{entry.description}</p>
                      <span className="text-[10px] text-text-muted">{entry.agentName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
