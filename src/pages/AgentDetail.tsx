export function AgentDetail() {
  return (
    <div className="h-full p-6">
      <h1 className="text-2xl font-semibold text-text-primary">Agent Profile</h1>
      <p className="text-text-secondary mt-1 mb-6">Inspect and manage individual agent behavior.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-md border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-text-secondary mb-3">Identity</h2>
          <div className="space-y-2">
            <div className="h-4 w-2/3 rounded-sm bg-surface-elevated animate-pulse" />
            <div className="h-4 w-1/2 rounded-sm bg-surface-elevated animate-pulse" />
          </div>
        </div>
        <div className="rounded-md border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-text-secondary mb-3">Performance</h2>
          <div className="h-32 rounded-sm bg-surface-elevated animate-pulse" />
        </div>
        <div className="rounded-md border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-text-secondary mb-3">Skill Inventory</h2>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 rounded-sm bg-surface-elevated animate-pulse" />
            ))}
          </div>
        </div>
        <div className="rounded-md border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-text-secondary mb-3">Memory</h2>
          <div className="h-32 rounded-sm bg-surface-elevated animate-pulse" />
        </div>
      </div>
    </div>
  )
}
