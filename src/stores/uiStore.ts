import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  rightPanelOpen: boolean
  mobileDrawerOpen: boolean
  toggleSidebar: () => void
  toggleRightPanel: () => void
  setMobileDrawerOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  rightPanelOpen: true,
  mobileDrawerOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
}))
