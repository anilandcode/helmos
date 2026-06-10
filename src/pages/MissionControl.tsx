import { AgentStatusGrid } from '../components/mission-control/AgentStatusGrid'
import { KanbanBoard } from '../components/mission-control/KanbanBoard'
import { ActivityFeed } from '../components/mission-control/ActivityFeed'
import { agents, tasks, mockActivity } from '../data/mockData'

export function MissionControl() {
  return (
    <div className="h-full flex gap-4 p-4 overflow-hidden">
      <div className="w-[280px] shrink-0 rounded-md border border-border bg-surface overflow-hidden max-lg:hidden">
        <AgentStatusGrid agents={agents} />
      </div>
      <div className="flex-1 rounded-md border border-border bg-surface p-3 min-w-0 overflow-hidden">
        <KanbanBoard tasks={tasks} agents={agents} />
      </div>
      <div className="w-80 shrink-0 rounded-md border border-border bg-surface overflow-hidden max-lg:hidden">
        <ActivityFeed entries={mockActivity} />
      </div>
      <div className="hidden max-lg:flex flex-1 items-center justify-center gap-4">
        {['Agents', 'Board', 'Feed'].map((tab) => (
          <button key={tab} className="px-4 py-2 rounded-sm bg-surface border border-border text-sm text-text-secondary hover:text-text-primary transition-colors duration-150">
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
