import { useState } from 'react'
import { SecurityAudit } from '../components/security/SecurityAuditPanel'
import { mockSecurityScans, mockGuardrailConfig, mockAuditLog } from '../data/mockSettings'
import type { GuardrailConfig } from '../types/security'

export function SecurityAuditPage() {
  const [guardrails, setGuardrails] = useState<GuardrailConfig>(mockGuardrailConfig)

  return (
    <div className="h-full overflow-auto p-6">
      <SecurityAudit
        scans={mockSecurityScans}
        guardrails={guardrails}
        auditLog={mockAuditLog}
        onUpdateGuardrails={setGuardrails}
      />
    </div>
  )
}
