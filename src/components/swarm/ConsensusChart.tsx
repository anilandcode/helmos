import type { SwarmDecision } from '../../types/swarm'
import { cn } from '../../lib/utils'

interface Props {
  decision: SwarmDecision
}

export function ConsensusChart({ decision }: Props) {
  const total = decision.votes.length
  const approveCount = decision.votes.filter((v) => v.vote === 'approve').length
  const rejectCount = decision.votes.filter((v) => v.vote === 'reject').length
  const abstainCount = decision.votes.filter((v) => v.vote === 'abstain').length

  const approvePct = (approveCount / total) * 100
  const rejectPct = (rejectCount / total) * 100
  const abstainPct = (abstainCount / total) * 100

  const avgConfidence = decision.votes.reduce((sum, v) => sum + v.confidence, 0) / total

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">Round {decision.round} Vote</h3>
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full font-medium',
          decision.consensusReached ? 'text-success bg-[rgba(16,185,129,0.15)]' : 'text-warning bg-[rgba(245,158,11,0.15)]'
        )}>
          {decision.result === 'approved' ? 'Approved' : decision.result === 'rejected' ? 'Rejected' : 'Deadlocked'}
        </span>
      </div>

      <p className="text-xs text-text-secondary">{decision.proposal}</p>

      <div className="h-3 bg-surface-elevated rounded-full overflow-hidden flex" role="progressbar" aria-label="Vote distribution">
        <div className="bg-success transition-all duration-500" style={{ width: `${approvePct}%` }} />
        <div className="bg-error transition-all duration-500" style={{ width: `${rejectPct}%` }} />
        <div className="bg-text-muted transition-all duration-500" style={{ width: `${abstainPct}%` }} />
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" />{approveCount} Approve</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error" />{rejectCount} Reject</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-text-muted" />{abstainCount} Abstain</span>
        <span className="ml-auto text-text-muted">Confidence: {(avgConfidence * 100).toFixed(0)}%</span>
      </div>

      <div className="space-y-2">
        {decision.votes.map((vote) => (
          <div key={vote.agentId} className="flex items-center gap-2 text-xs">
            <div className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0',
              vote.vote === 'approve' ? 'bg-success' : vote.vote === 'reject' ? 'bg-error' : 'bg-text-muted'
            )}>
              {vote.vote === 'approve' ? '✓' : vote.vote === 'reject' ? '✗' : '–'}
            </div>
            <span className="text-text-secondary w-16 truncate">{vote.agentId.replace('agent-', 'Agent ')}</span>
            <span className="text-text-muted flex-1 truncate">{vote.reasoning}</span>
            <span className="text-text-muted">{(vote.confidence * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
