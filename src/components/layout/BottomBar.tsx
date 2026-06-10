import { CommandBar } from '../mission-control/CommandBar'

export function BottomBar() {
  const used = 12.40
  const limit = 50
  const pct = Math.min((used / limit) * 100, 100)

  const handleSubmit = async (command: string, model: string) => {
    console.log(`[CommandBar] model=${model} command="${command}"`)
    await new Promise((r) => setTimeout(r, 600))
  }

  return (
    <footer className="flex flex-col shrink-0" role="contentinfo">
      <div className="flex items-center h-8 px-4 bg-surface border-t border-border gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-text-muted shrink-0">Cost</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-250"
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-xs text-text-secondary shrink-0">
              ${used.toFixed(2)} / ${limit.toFixed(0)} today
            </span>
          </div>
        </div>
      </div>
      <CommandBar onSubmit={handleSubmit} />
    </footer>
  )
}
