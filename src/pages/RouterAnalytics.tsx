import { useCallback } from 'react'
import { Download } from 'lucide-react'
import { ModelRegistryTable } from '../components/analytics/ModelRegistryTable'
import { RoutingLog } from '../components/analytics/RoutingLog'
import { CostChart } from '../components/analytics/CostChart'
import { FallbackLog } from '../components/analytics/FallbackLog'
import { mockModels, mockRoutingDecisions, mockFallbackEvents } from '../data/mockRouter'

export function RouterAnalytics() {
  const exportCSV = useCallback(() => {
    const headers = ['timestamp', 'taskType', 'selectedModel', 'confidence', 'estimatedCost', 'actualCost', 'actualTokens', 'latencyMs', 'fallbackFrom', 'fallbackReason']
    const rows = mockRoutingDecisions.map((d) => headers.map((h) => String(d[h as keyof typeof d] ?? '')))
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `router-decisions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Router Analytics</h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated hover:text-text-primary transition-colors duration-150"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        <div className="space-y-6">
          <RoutingLog decisions={mockRoutingDecisions} />
          <FallbackLog events={mockFallbackEvents} />
        </div>
        <div className="space-y-6">
          <CostChart decisions={mockRoutingDecisions} />
          <ModelRegistryTable models={mockModels} />
        </div>
      </div>
    </div>
  )
}
