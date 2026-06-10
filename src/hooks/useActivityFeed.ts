import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { ActivityEntry } from '../types/activity'

const generators: (() => ActivityEntry)[] = [
  () => ({
    id: crypto.randomUUID(),
    type: 'task_completed',
    agentName: ['Athena', 'Hermes', 'Babbage', 'Critias', 'Synthia'][Math.floor(Math.random() * 5)],
    taskName: ['Q2 pricing analysis', 'Email campaign', 'Security audit', 'API debug', 'Financial review'][Math.floor(Math.random() * 5)],
    timestamp: new Date().toISOString(),
  }),
  () => ({
    id: crypto.randomUUID(),
    type: 'agent_blocked',
    agentName: 'Synthia',
    reason: ['API rate limit exceeded', 'Permission denied', 'Invalid token', 'Memory overflow'][Math.floor(Math.random() * 4)],
    timestamp: new Date().toISOString(),
  }),
  () => ({
    id: crypto.randomUUID(),
    type: 'swarm_started',
    swarmName: ['Market Analysis Swarm', 'Code Review Swarm', 'Research Collective'][Math.floor(Math.random() * 3)],
    agentCount: Math.floor(Math.random() * 5) + 3,
    timestamp: new Date().toISOString(),
  }),
  () => ({
    id: crypto.randomUUID(),
    type: 'cost_alert',
    percent: Math.floor(Math.random() * 30) + 70,
    timestamp: new Date().toISOString(),
  }),
  () => ({
    id: crypto.randomUUID(),
    type: 'skill_installed',
    skillName: ['Perplexity Research', 'GitHub Scanner', 'Email Composer', 'SQL Analyst'][Math.floor(Math.random() * 4)],
    author: ['@devops-team', '@athena-creator', '@community'][Math.floor(Math.random() * 3)],
    timestamp: new Date().toISOString(),
  }),
]

export function useActivityFeed(initial: ActivityEntry[]) {
  const [entries, setEntries] = useState<ActivityEntry[]>(initial)
  const [filter, setFilter] = useState<string>('all')
  const [hasNewEntries, setHasNewEntries] = useState(false)
  const [userScrolledUp, setUserScrolledUp] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return entries
    const map: Record<string, string[]> = {
      tasks: ['task_completed'],
      agents: ['agent_blocked', 'swarm_started'],
      system: ['cost_alert', 'skill_installed'],
    }
    const types = map[filter] ?? []
    return entries.filter((e) => types.includes(e.type))
  }, [entries, filter])

  const scrollToBottom = useCallback(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
      setHasNewEntries(false)
      setUserScrolledUp(false)
    }
  }, [])

  const handleScroll = useCallback(() => {
    const el = feedRef.current
    if (!el) return
    const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (fromBottom < 50) {
      setUserScrolledUp(false)
      setHasNewEntries(false)
    } else {
      setUserScrolledUp(true)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const gen = generators[Math.floor(Math.random() * generators.length)]
        const entry = gen()
        setEntries((prev) => [entry, ...prev])
        if (userScrolledUp) {
          setHasNewEntries(true)
        } else {
          requestAnimationFrame(() => scrollToBottom())
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [userScrolledUp, scrollToBottom])

  return { entries: filtered, filter, setFilter, hasNewEntries, scrollToBottom, feedRef, handleScroll, userScrolledUp }
}
