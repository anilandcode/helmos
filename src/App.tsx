import { useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AppShell } from './components/layout/AppShell'
import { VoiceOverlay } from './components/voice/VoiceOverlay'
import { VoiceButton } from './components/voice/VoiceButton'
import { AppRoutes } from './routes'

function AppContent() {
  const [voiceOpen, setVoiceOpen] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/landing'

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-sm focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <AppShell>
        <AppRoutes />
      </AppShell>
      {!isLanding && <VoiceButton onClick={() => setVoiceOpen(true)} />}
      <VoiceOverlay
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onCommand={(cmd) => console.log(`[Voice] ${cmd}`)}
      />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
