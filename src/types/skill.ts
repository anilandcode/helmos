export interface SkillListing {
  id: string
  name: string
  description: string
  shortDescription: string
  category: 'research' | 'coding' | 'data' | 'security' | 'communication' | 'automation' | 'creative'
  author: {
    name: string
    avatar?: string
    verified: boolean
  }
  version: string
  rating: number
  reviewCount: number
  installCount: number
  price: number
  tags: string[]
  capabilities: string[]
  bumblebeeStatus: 'passed' | 'pending' | 'failed'
  lastUpdated: string
  icon: string
  color: string
}

export interface SkillReview {
  id: string
  skillId: string
  author: string
  rating: number
  text: string
  helpful: number
  timestamp: string
}
