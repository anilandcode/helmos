import { useState } from 'react'
import { SkillGrid } from '../components/marketplace/SkillGrid'
import { SkillDetailModal } from '../components/marketplace/SkillDetailModal'
import { InstallFlow } from '../components/marketplace/InstallFlow'
import { mockSkills, mockReviews } from '../data/mockSkills'

export function SkillMarketplace() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [installSkillId, setInstallSkillId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [installOpen, setInstallOpen] = useState(false)

  const selectedSkill = mockSkills.find((s) => s.id === selectedSkillId)
  const installSkill = mockSkills.find((s) => s.id === installSkillId)

  const handleView = (id: string) => {
    setSelectedSkillId(id)
    setDetailOpen(true)
  }

  const handleInstall = (id: string) => {
    console.log(`[Marketplace] Installed skill: ${id}`)
  }

  const handleInstallFromDetail = (id: string) => {
    setSelectedSkillId(null)
    setDetailOpen(false)
    setInstallSkillId(id)
    setInstallOpen(true)
  }

  const handleInstallConfirm = (id: string) => {
    console.log(`[Marketplace] Confirmed install: ${id}`)
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Skill Marketplace</h1>
        <p className="text-sm text-text-secondary mt-1">Discover and install agent skills with Bumblebee security badges.</p>
      </div>

      <SkillGrid skills={mockSkills} onInstall={handleInstall} onView={handleView} />

      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          onInstall={handleInstallFromDetail}
          reviews={mockReviews}
        />
      )}

      {installSkill && (
        <InstallFlow
          skill={installSkill}
          isOpen={installOpen}
          onClose={() => setInstallOpen(false)}
          onConfirm={handleInstallConfirm}
        />
      )}
    </div>
  )
}
