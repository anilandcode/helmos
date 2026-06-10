import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import type { RoutingDecision } from '../../types/router'
import { cn } from '../../lib/utils'

interface Props {
  decisions: RoutingDecision[]
}

type Period = 'day' | 'week' | 'month'

const periodLabels: Record<Period, string> = { day: 'Day', week: 'Week', month: 'Month' }

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export function CostChart({ decisions }: Props) {
  const [period, setPeriod] = useState<Period>('week')

  const totalSpent = decisions.reduce((sum, d) => sum + d.actualCost, 0)
  const totalTasks = decisions.length
  const avgCost = totalTasks > 0 ? totalSpent / totalTasks : 0
  const fallbackCount = decisions.filter((d) => d.fallbackFrom).length
  const fallbackRate = totalTasks > 0 ? (fallbackCount / totalTasks) * 100 : 0

  const barData = decisions.map((d) => ({
    name: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    cost: d.actualCost,
    model: d.selectedModel,
  }))

  const pieData = decisions.reduce((acc, d) => {
    const existing = acc.find((x) => x.name === d.taskType)
    if (existing) existing.value += d.actualCost
    else acc.push({ name: d.taskType, value: d.actualCost })
    return acc
  }, [] as { name: string; value: number }[])

  const lineData = decisions.map((d, i) => ({
    name: `Task ${i + 1}`,
    cost: d.actualCost,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Cost Analytics</h2>
        <div className="flex gap-1">
          {(['day', 'week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-sm transition-colors duration-100',
                period === p ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary hover:bg-surface-elevated'
              )}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Spent', value: `$${totalSpent.toFixed(4)}` },
          { label: 'Tasks Completed', value: totalTasks.toString() },
          { label: 'Avg Cost/Task', value: `$${avgCost.toFixed(4)}` },
          { label: 'Fallback Rate', value: `${fallbackRate.toFixed(1)}%` },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-md p-3 space-y-1" tabIndex={0} role="group" aria-label={s.label}>
            <div className="text-xs text-text-muted">{s.label}</div>
            <div className="text-sm font-semibold font-mono text-text-primary">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-md p-3">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Cost by Model Over Time</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={(v) => `$${v.toFixed(2)}`} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="cost" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-surface border border-border rounded-md p-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Cost by Task Type</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} innerRadius={30} dataKey="value" label={({ name }) => name} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 4, fontSize: 12 }} formatter={(v: unknown) => `$${(Number(v) || 0).toFixed(4)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface border border-border rounded-md p-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Cost per Task</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={(v) => `$${v.toFixed(2)}`} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 4, fontSize: 12 }} />
                <Line type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
