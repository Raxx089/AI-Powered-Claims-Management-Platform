import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { BarChart3, Bell, ChevronsLeft, ChevronsRight, ClipboardCheck, DarkMode, FileText, GitBranch, LayoutDashboard, Layers, LightMode, ListChecks, Menu, Scale, Search, Settings, ShieldAlert, Sparkles, Users, X } from './icons'
import { AppCtx, type Role } from './ctx'
import { ToastProvider, cx } from './ui'
import { LoginScreen, OnboardingScreen } from './Auth'
import { SearchOverlay } from './Search'
import Dashboard from './pages/Dashboard'
import Queue from './pages/Queue'
import ClaimDetail from './pages/Claim'
import Tasks from './pages/Tasks'
import Documents from './pages/Documents'
import Notifications from './pages/Notifications'
import { AnalyticsPage, RiskPage, SupervisorPage, UnderwriterPage } from './pages/Insight'
import { CompliancePage, SettingsPage, WorkflowPage } from './pages/Admin'
import System from './pages/System'
import NewClaim from './pages/NewClaim'

const groups: { label: string; items: { path: string; label: string; icon: ReactNode; badge?: number }[] }[] = [
  {
    label: 'Work',
    items: [
      { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { path: '/claims', label: 'Claims', icon: <Layers size={18} />, badge: 10 },
      { path: '/tasks', label: 'Tasks', icon: <ListChecks size={18} />, badge: 6 },
      { path: '/documents', label: 'Documents', icon: <FileText size={18} /> },
      { path: '/risk', label: 'Risk & Fraud', icon: <ShieldAlert size={18} /> },
      { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    ],
  },
  {
    label: 'Role views',
    items: [
      { path: '/underwriter', label: 'Underwriting', icon: <Scale size={18} /> },
      { path: '/supervisor', label: 'Supervisor', icon: <Users size={18} /> },
    ],
  },
  {
    label: 'Administration',
    items: [
      { path: '/workflow', label: 'Workflow', icon: <GitBranch size={18} /> },
      { path: '/compliance', label: 'Compliance & audit', icon: <ClipboardCheck size={18} /> },
      { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    ],
  },
]

const roles: Role[] = ['Adjuster', 'Claims Handler', 'Underwriting Lead', 'Supervisor']
const rolePath: Record<Role, string> = { Adjuster: '/', 'Claims Handler': '/', 'Underwriting Lead': '/underwriter', Supervisor: '/supervisor' }
type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('claimiq-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Use the system preference when browser storage is unavailable.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const readStorage = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

const getPath = () => location.hash.replace(/^#/, '') || '/'

export default function App() {
  const [path, setPath] = useState(getPath)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [role, setRole] = useState<Role>(() => {
    const saved = readStorage('claimiq-role', 'Adjuster')
    return roles.includes(saved as Role) ? saved as Role : 'Adjuster'
  })
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [signedIn, setSignedIn] = useState(() => readStorage('claimiq-signed-in', 'false') === 'true')
  const [onboardingComplete, setOnboardingComplete] = useState(() => readStorage('claimiq-onboarding-complete', 'false') === 'true')
  const [displayName, setDisplayName] = useState(() => readStorage('claimiq-name', 'Priya Raman'))

  useEffect(() => {
    const h = () => (setPath(getPath()), setMobileNav(false), window.scrollTo(0, 0))
    addEventListener('hashchange', h)
    return () => removeEventListener('hashchange', h)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('claimiq-theme', theme)
    } catch {
      // Theme remains active for this session if browser storage is unavailable.
    }
  }, [theme])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') (e.preventDefault(), setSearchOpen(true))
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])

  const nav = useCallback((p: string) => {
    location.hash = p
  }, [])
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  const toggleTheme = useCallback(() => setTheme((current) => (current === 'light' ? 'dark' : 'light')), [])
  const signIn = (name: string) => {
    setDisplayName(name)
    setSignedIn(true)
    setOnboardingComplete(false)
    try {
      localStorage.setItem('claimiq-name', name)
      localStorage.setItem('claimiq-signed-in', 'true')
      localStorage.setItem('claimiq-onboarding-complete', 'false')
    } catch {
      // Continue in memory when storage is unavailable.
    }
  }
  const completeOnboarding = ({ name, role: selectedRole }: { name: string; role: Role; line: string }) => {
    setDisplayName(name)
    setRole(selectedRole)
    setOnboardingComplete(true)
    try {
      localStorage.setItem('claimiq-name', name)
      localStorage.setItem('claimiq-role', selectedRole)
      localStorage.setItem('claimiq-onboarding-complete', 'true')
    } catch {
      // Continue in memory when storage is unavailable.
    }
  }
  const signOut = () => {
    setSignedIn(false)
    setOnboardingComplete(false)
    try {
      localStorage.removeItem('claimiq-signed-in')
      localStorage.removeItem('claimiq-onboarding-complete')
    } catch {
      // Sign out for this session even if storage is unavailable.
    }
  }

  if (!signedIn) return <LoginScreen onSignIn={signIn} theme={theme} onToggleTheme={toggleTheme} />
  if (!onboardingComplete) return <OnboardingScreen name={displayName} onComplete={completeOnboarding} theme={theme} onToggleTheme={toggleTheme} />

  let page: ReactNode
  const claimId = path.startsWith('/claims/') ? path.split('/')[2] : null
  if (path === '/claims/new') page = <NewClaim />
  else if (claimId) page = <ClaimDetail key={claimId} id={claimId} />
  else
    page =
      {
        '/': <Dashboard />,
        '/claims': <Queue />,
        '/tasks': <Tasks />,
        '/documents': <Documents />,
        '/risk': <RiskPage />,
        '/analytics': <AnalyticsPage />,
        '/underwriter': <UnderwriterPage />,
        '/supervisor': <SupervisorPage />,
        '/workflow': <WorkflowPage />,
        '/compliance': <CompliancePage />,
        '/settings': <SettingsPage />,
        '/system': <System />,
        '/notifications': <Notifications />,
      }[path] ?? <Dashboard />

  const active = (p: string) => (p === '/' ? path === '/' : path.startsWith(p))
  const renderNav = (mobile?: boolean) => {
    const c = collapsed && !mobile
    return (
      <nav aria-label="Primary" className="flex h-full flex-col">
        <div className={cx('flex h-16 shrink-0 items-center gap-2 border-b border-line/70', c ? 'justify-center' : 'px-5')}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-on-brand"><Sparkles size={18} aria-hidden /></span>
          {!c && <span className="font-display text-[22px] tracking-tight text-ink">Claim<span className="text-brand">IQ</span></span>}
        </div>
        <div className="scroll-quiet flex-1 overflow-y-auto px-3 py-4">
          {groups.map((g) => (
            <div key={g.label} className="mb-5">
              {!c && <p className="mb-1.5 px-3 font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">{g.label}</p>}
              <ul className="space-y-0.5">
                {g.items.map((i) => (
                  <li key={i.path}>
                    <a
                      href={'#' + i.path}
                      aria-current={active(i.path) ? 'page' : undefined}
                      title={c ? i.label : undefined}
                      className={cx('flex h-11 items-center gap-3 rounded-full text-sm font-medium transition-colors', c ? 'justify-center' : 'px-3', active(i.path) ? 'bg-brand-soft text-brand-2' : 'text-ink-2 hover:bg-sunken/80')}
                    >
                      {i.icon}
                      {c ? <span className="sr-only">{i.label}</span> : <span className="flex-1">{i.label}</span>}
                      {!c && i.badge && <span className={cx('tnum rounded-full px-1.5 text-xs', active(i.path) ? 'bg-brand-soft' : 'bg-white/15')}>{i.badge}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} className="flex h-12 shrink-0 items-center gap-2 border-t border-line/70 px-5 text-sm text-ink-2 hover:bg-sunken/80">
            {collapsed ? <ChevronsRight size={18} /> : <><ChevronsLeft size={18} /> Collapse</>}
          </button>
        )}
      </nav>
    )
  }

  return (
    <AppCtx.Provider value={{ nav, role, openSearch }}>
      <ToastProvider>
        <a href="#main" onClick={(e) => (e.preventDefault(), document.getElementById('main')?.focus())} className="sr-only z-[70] rounded bg-brand p-3 text-on-brand focus:not-sr-only focus:fixed focus:top-2 focus:left-2">Skip to content</a>
        <div className="flex min-h-full">
          <aside className={cx('sticky top-0 hidden h-screen shrink-0 bg-surface-container-low transition-[width] duration-200 lg:block', collapsed ? 'w-[80px]' : 'w-64')}>
            {renderNav()}
          </aside>
          {mobileNav && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileNav(false)} />
              <div className="slide-in absolute inset-y-0 left-0 w-72 bg-surface-container-low">{renderNav(true)}</div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-line/70 bg-surface/95 px-4 backdrop-blur md:px-8">
              <button className="rounded-full p-2 text-ink-2 hover:bg-sunken lg:hidden" aria-label={mobileNav ? 'Close menu' : 'Open menu'} onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X size={20} /> : <Menu size={20} />}</button>
              <button onClick={openSearch} className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-line-strong bg-surface-container-low px-4 text-left text-sm text-ink-3 hover:border-ink-3 md:max-w-md">
                <Search size={16} aria-hidden /> <span className="truncate">Search or ask in plain words…</span>
                <kbd className="ml-auto hidden rounded border border-line-strong bg-surface px-1.5 font-mono text-[11px] md:block">Ctrl K</kbd>
              </button>
              <div className="ml-auto flex items-center gap-1 md:gap-3">
                <label className="hidden items-center gap-2 text-xs text-ink-2 md:flex">
                  Viewing as
                  <select value={role} onChange={(e) => (setRole(e.target.value as Role), nav(rolePath[e.target.value as Role]))} className="h-9 rounded-md border border-line-strong bg-surface px-2 text-[13px] font-medium text-ink">
                    {roles.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </label>
                <button
                  type="button"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                  aria-pressed={theme === 'dark'}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                  onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
                  className="rounded-full p-2 text-ink-2 hover:bg-sunken"
                >
                  {theme === 'light' ? <DarkMode size={20} /> : <LightMode size={20} />}
                </button>
                <a href="#/notifications" aria-label="Notifications, 3 unread" className="relative rounded-full p-2 text-ink-2 hover:bg-sunken">
                  <Bell size={20} />
                  <span aria-hidden className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-bad" />
                </a>
                <button type="button" onClick={signOut} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-on-brand" aria-label={`Sign out ${displayName}`} title={`Signed in as ${displayName}. Select to sign out.`}>{displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</button>
              </div>
            </header>
            <main id="main" tabIndex={-1} className="mx-auto max-w-[1440px] px-4 py-6 outline-none md:px-8 md:py-8">
              {page}
            </main>
          </div>
        </div>
        <SearchOverlay open={searchOpen} onClose={closeSearch} go={nav} />
      </ToastProvider>
    </AppCtx.Provider>
  )
}
