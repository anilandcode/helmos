import { useState } from 'react'
import type { ModelRegistryEntry } from '../../types/router'
import { cn } from '../../lib/utils'

interface Props {
  models: ModelRegistryEntry[]
}

const capabilities: { key: keyof ModelRegistryEntry['capabilities']; label: string }[] = [
  { key: 'reasoning', label: 'Reasoning' },
  { key: 'coding', label: 'Coding' },
  { key: 'longContext', label: 'Long Context' },
  { key: 'toolUse', label: 'Tool Use' },
  { key: 'speed', label: 'Speed' },
  { key: 'costEfficiency', label: 'Cost Efficiency' },
]

const statusColors: Record<string, string> = {
  available: 'text-success',
  degraded: 'text-warning',
  unavailable: 'text-error',
  deprecated: 'text-text-muted',
}

function CapabilityBar({ value }: { value: number }) {
  return (
    <div className="w-[60px] h-1 rounded-full bg-surface-elevated overflow-hidden">
      <div className="h-full rounded-full bg-primary" style={{ width: `${value * 100}%` }} />
    </div>
  )
}

function SuccessBadge({ rate }: { rate: number }) {
  const color = rate >= 0.9 ? 'text-success bg-[rgba(16,185,129,0.15)]' : rate >= 0.7 ? 'text-warning bg-[rgba(245,158,11,0.15)]' : 'text-error bg-[rgba(239,68,68,0.15)]'
  return (
    <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', color)}>
      {(rate * 100).toFixed(0)}%
    </span>
  )
}

export function ModelRegistryTable({ models }: Props) {
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const providers = [...new Set(models.map((m) => m.provider))]
  const filtered = filter === 'all' ? models : models.filter((m) => m.provider === filter)

  const formatContext = (ctx: number) => ctx >= 1000000 ? `${(ctx / 1000000).toFixed(0)}M` : `${(ctx / 1000).toFixed(0)}K`
  const formatCost = (c: number) => `$${c.toFixed(3)}/1K`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Model Registry</h2>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs bg-surface border border-border rounded-sm px-2 py-1 text-text-secondary outline-none focus:border-border-focus"
            aria-label="Filter by provider"
          >
            <option value="all">All Providers</option>
            {providers.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-2 px-2">Model</th>
              {capabilities.map((c) => <th key={c.key} className="text-left py-2 px-2">{c.label}</th>)}
              <th className="text-right py-2 px-2">Cost</th>
              <th className="text-right py-2 px-2">Context</th>
              <th className="text-center py-2 px-2">Status</th>
              <th className="text-right py-2 px-2">Success</th>
              <th className="text-right py-2 px-2">Latency</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((model) => (
              <tr key={model.id} className="border-b border-border hover:bg-surface-elevated transition-colors duration-100">
                <td className="py-2.5 px-2">
                  <div className="font-medium text-text-primary">{model.name}</div>
                  <div className="text-xs text-text-muted">{model.provider}</div>
                </td>
                {capabilities.map((c) => (
                  <td key={c.key} className="py-2.5 px-2"><CapabilityBar value={model.capabilities[c.key]} /></td>
                ))}
                <td className="py-2.5 px-2 text-right font-mono text-xs text-text-secondary">{formatCost(model.costPer1kOutput)}</td>
                <td className="py-2.5 px-2 text-right text-xs text-text-secondary">{formatContext(model.contextWindow)}</td>
                <td className="py-2.5 px-2 text-center">
                  <span className={cn('text-xs font-medium capitalize', statusColors[model.status])}>{model.status}</span>
                </td>
                <td className="py-2.5 px-2 text-right"><SuccessBadge rate={model.successRate7d} /></td>
                <td className="py-2.5 px-2 text-right font-mono text-xs text-text-muted">{model.avgLatencyMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((model) => (
          <button
            key={model.id}
            onClick={() => setExpandedId(expandedId === model.id ? null : model.id)}
            className="w-full text-left bg-surface border border-border rounded-md p-3 space-y-2 hover:border-border-focus transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-primary">{model.name}</div>
                <div className="text-xs text-text-muted">{model.provider}</div>
              </div>
              <div className="flex items-center gap-2">
                <SuccessBadge rate={model.successRate7d} />
                <span className={cn('text-xs font-medium capitalize', statusColors[model.status])}>{model.status}</span>
              </div>
            </div>
            {expandedId === model.id && (
              <div className="space-y-2 pt-2 border-t border-border">
                {capabilities.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-text-muted">{c.label}</span>
                    <CapabilityBar value={model.capabilities[c.key]} />
                  </div>
                ))}
                <div className="flex justify-between text-xs text-text-muted pt-2">
                  <span>Cost: <span className="font-mono text-text-secondary">{formatCost(model.costPer1kOutput)}</span></span>
                  <span>Context: <span className="text-text-secondary">{formatContext(model.contextWindow)}</span></span>
                  <span>Latency: <span className="font-mono text-text-secondary">{model.avgLatencyMs}ms</span></span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
