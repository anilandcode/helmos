import { useState, useMemo } from 'react'
import { SemanticPanel } from '../components/memory/SemanticPanel'
import { EpisodicPanel } from '../components/memory/EpisodicPanel'
import { ProcedurePanel } from '../components/memory/ProcedurePanel'
import { MemorySearch } from '../components/memory/MemorySearch'
import { ObsidianSyncStatus } from '../components/memory/ObsidianSyncStatus'
import { mockSemanticMemories, mockEpisodicMemories, mockProceduralMemories } from '../data/mockMemory'

const tabs = [
  { id: 'semantic', label: 'Knowledge' },
  { id: 'episodic', label: 'Episodes' },
  { id: 'procedural', label: 'Procedures' },
] as const

export function MemoryExplorer() {
  const [activeTab, setActiveTab] = useState('semantic')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSemantic = useMemo(() => {
    if (!searchQuery) return mockSemanticMemories
    const q = searchQuery.toLowerCase()
    return mockSemanticMemories.filter(
      (m) => m.content.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const filteredEpisodic = useMemo(() => {
    if (!searchQuery) return mockEpisodicMemories
    const q = searchQuery.toLowerCase()
    return mockEpisodicMemories.filter(
      (m) => m.content.toLowerCase().includes(q) || m.agentName.toLowerCase().includes(q) || (m.taskId ?? '').toLowerCase().includes(q)
    )
  }, [searchQuery])

  const filteredProcedural = useMemo(() => {
    if (!searchQuery) return mockProceduralMemories
    const q = searchQuery.toLowerCase()
    return mockProceduralMemories.filter(
      (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const handleSemanticEdit = (id: string, content: string) => {
    console.log(`[SemanticEdit] id=${id} content="${content}"`)
  }

  const handleProcedureEdit = (id: string, code: string) => {
    console.log(`[ProcedureEdit] id=${id} code="${code}"`)
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-text-primary">Memory Explorer</h1>
        <ObsidianSyncStatus lastSync={new Date().toISOString()} status="synced" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSearchQuery('')
              }}
              className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <MemorySearch onSearch={setSearchQuery} activeTab={activeTab} />

        {activeTab === 'semantic' && <SemanticPanel entries={filteredSemantic} onEdit={handleSemanticEdit} />}
        {activeTab === 'episodic' && <EpisodicPanel entries={filteredEpisodic} />}
        {activeTab === 'procedural' && <ProcedurePanel entries={filteredProcedural} onEdit={handleProcedureEdit} />}
      </div>
    </div>
  )
}
