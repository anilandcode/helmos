import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

const MissionControl = lazy(() => import('./pages/MissionControl').then((m) => ({ default: m.MissionControl })))
const AgentDetail = lazy(() => import('./pages/AgentDetail').then((m) => ({ default: m.AgentDetail })))
const TaskDetail = lazy(() => import('./pages/TaskDetail').then((m) => ({ default: m.TaskDetail })))
const MemoryExplorer = lazy(() => import('./pages/MemoryExplorer').then((m) => ({ default: m.MemoryExplorer })))
const SkillMarketplace = lazy(() => import('./pages/SkillMarketplace').then((m) => ({ default: m.SkillMarketplace })))
const SwarmOrchestrator = lazy(() => import('./pages/SwarmOrchestrator').then((m) => ({ default: m.SwarmOrchestrator })))
const RouterAnalytics = lazy(() => import('./pages/RouterAnalytics').then((m) => ({ default: m.RouterAnalytics })))
const SecurityAudit = lazy(() => import('./pages/SecurityAudit').then((m) => ({ default: m.SecurityAuditPage })))
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })))
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })))

function PageFallback() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-text-muted">Loading...</span>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<MissionControl />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/memory" element={<MemoryExplorer />} />
        <Route path="/skills" element={<SkillMarketplace />} />
        <Route path="/swarm" element={<SwarmOrchestrator />} />
        <Route path="/analytics" element={<RouterAnalytics />} />
        <Route path="/security" element={<SecurityAudit />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </Suspense>
  )
}
