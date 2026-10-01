import { createContext, useContext } from 'react'

export type Role = 'Claims Handler' | 'Adjuster' | 'Underwriting Lead' | 'Supervisor'

export const AppCtx = createContext<{
  nav: (path: string) => void
  role: Role
  openSearch: () => void
}>({ nav: () => {}, role: 'Adjuster', openSearch: () => {} })

export const useApp = () => useContext(AppCtx)
