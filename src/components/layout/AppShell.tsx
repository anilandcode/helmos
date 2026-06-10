import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomBar } from './BottomBar'
import { MobileNav } from './MobileNav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto max-md:pb-0 pb-0" id="main-content">
          {children}
        </main>
      </div>
      <MobileNav />
      <BottomBar />
    </div>
  )
}
