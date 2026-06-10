import type { Task } from '../types/task'

const now = Date.now()
const minute = 60000

export const mockTaskDetail: Task = {
  id: 'task-1',
  title: 'Analyze Q3 competitor pricing',
  description: 'Research and analyze competitor pricing strategies for Q3 to inform our pricing decisions. Focus on top 5 competitors and identify trends.',
  status: 'in_progress',
  priority: 'high',
  agentId: 'agent-2',
  agentName: 'Atlas',
  modelUsed: 'claude-3-opus',
  cost: 0.0423,
  createdAt: new Date(now - 15 * minute).toISOString(),
  updatedAt: new Date(now - 2 * minute).toISOString(),
  tags: ['research', 'pricing', 'q3'],
  estimatedCost: 0.05,
  currentCheckpointIndex: 2,
  reasoning: 'Selecting comprehensive web search to gather recent pricing data from multiple sources',
  uncertainty: 'Some competitors may have unlisted pricing or recent changes not yet indexed',
  inputRefs: ['pricing-db-2024', 'market-report-q2'],
  checkpoints: [
    {
      index: 0,
      name: 'Plan research',
      status: 'completed',
      startTime: new Date(now - 15 * minute).toISOString(),
      endTime: new Date(now - 12 * minute).toISOString(),
      cost: 0.0012,
      reasoning: 'Breaking down research into 5 key competitors with focus on pricing pages, press releases, and third-party reviews',
      toolUsed: 'decompose-task',
      confidence: 0.92,
      output: 'Identified 5 competitors: CompetitorA, CompetitorB, CompetitorC, CompetitorD, CompetitorE'
    },
    {
      index: 1,
      name: 'Search web',
      status: 'completed',
      startTime: new Date(now - 12 * minute).toISOString(),
      endTime: new Date(now - 8 * minute).toISOString(),
      cost: 0.0156,
      reasoning: 'Using comprehensive web search to find pricing pages, recent announcements, and industry reports for each competitor',
      toolUsed: 'web-search',
      confidence: 0.87,
      input: 'competitor pricing Q3 2024',
      output: 'Found 23 relevant sources with pricing data'
    },
    {
      index: 2,
      name: 'Extract data',
      status: 'active',
      startTime: new Date(now - 8 * minute).toISOString(),
      cost: 0.0189,
      reasoning: 'Extracting structured pricing data from search results, focusing on tier structures, feature comparisons, and discount patterns',
      toolUsed: 'data-extractor',
      confidence: 0.78
    },
    {
      index: 3,
      name: 'Analyze trends',
      status: 'pending'
    },
    {
      index: 4,
      name: 'Generate report',
      status: 'pending'
    }
  ]
}
