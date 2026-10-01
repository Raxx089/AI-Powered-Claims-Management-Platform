import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { AlertTriangle, CheckCircle2, Info, Sparkles, X, XCircle, ThumbsDown, ThumbsUp, ExternalLink } from './icons'

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

/* ---------- Button ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai'
  size?: 'sm' | 'md'
  icon?: ReactNode
}
export function Button({ variant = 'secondary', size = 'md', icon, className, children, type = 'button', ...p }: BtnProps) {
  const v = {
    primary: 'bg-brand text-on-brand hover:bg-brand-2 border-transparent shadow-e1 hover:shadow-e2',
    secondary: 'bg-brand-soft text-brand-2 border-transparent hover:bg-secondary-soft',
    ghost: 'bg-transparent text-ink-2 border-transparent hover:bg-brand-soft/70',
    danger: 'bg-bad text-on-bad border-transparent hover:brightness-95',
    ai: 'bg-ai text-on-ai border-transparent hover:bg-ai-deep',
  }[variant]
  return (
    <button
      {...p}
      type={type}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full border font-medium whitespace-nowrap transition-[background-color,box-shadow,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-9 px-4 text-[13px]' : 'h-10 px-5 text-sm',
        v,
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function IconButton({ label, children, className, type = 'button', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...p}
      type={type}
      aria-label={label}
      title={label}
      className={cx('inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-brand-soft', className)}
    >
      {children}
    </button>
  )
}

/* ---------- Badges ---------- */
const tones = {
  neutral: 'bg-sunken text-ink-2 border-line',
  ok: 'bg-ok-soft text-ok border-ok/25',
  warn: 'bg-warn-soft text-warn border-warn/30',
  bad: 'bg-bad-soft text-bad border-bad/25',
  info: 'bg-info-soft text-info border-info/25',
  ai: 'bg-ai-soft text-ai-deep border-ai-line',
  brand: 'bg-brand-soft text-brand border-brand/20',
}
export type Tone = keyof typeof tones
export function Badge({ tone = 'neutral', children, dot }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold', tones[tone])}>
      {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function AIBadge({ children = 'AI-generated' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-ai-line bg-ai-soft px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-ai-deep uppercase">
      <Sparkles size={11} aria-hidden /> {children}
    </span>
  )
}

export function Confidence({ value, label = true }: { value: number; label?: boolean }) {
  const level = value >= 85 ? 'High' : value >= 65 ? 'Medium' : 'Low'
  return (
    <span className="inline-flex items-center gap-2" role="img" aria-label={`${level} confidence, ${value} percent`}>
      <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-ai-line/60">
        <span className="absolute inset-y-0 left-0 rounded-full bg-ai" style={{ width: `${value}%` }} />
      </span>
      {label && (
        <span className="tnum text-xs font-semibold text-ai-deep">
          {value}% · {level}
        </span>
      )}
    </span>
  )
}

export const priorityTone: Record<string, Tone> = { Critical: 'bad', High: 'warn', Medium: 'info', Low: 'neutral' }
export const statusTone: Record<string, Tone> = {
  New: 'info',
  Triage: 'info',
  Assigned: 'brand',
  'In assessment': 'brand',
  'Awaiting approval': 'warn',
  'Awaiting documents': 'warn',
  Approved: 'ok',
  Paid: 'ok',
  Closed: 'neutral',
  'Under investigation': 'bad',
}

/* ---------- Layout bits ---------- */
export function Card({ children, className, as: T = 'section', ...p }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' } & React.HTMLAttributes<HTMLElement>) {
  return (
    <T {...p} className={cx('rounded-xl border border-line/70 bg-surface shadow-e1', className)}>
      {children}
    </T>
  )
}

export function CardHeader({ title, sub, action, num }: { title: string; sub?: string; action?: ReactNode; num?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <h2 className="flex items-baseline gap-2 text-lg leading-tight">
          {num && <span className="font-mono text-[11px] text-ink-3">{num}</span>}
          {title}
        </h2>
        {sub && <p className="mt-0.5 text-[13px] text-ink-3">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function PageHeader({ eyebrow, title, sub, actions }: { eyebrow?: string; title: string; sub?: string; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">{eyebrow}</p>}
        <h1 className="text-[32px] leading-[1.1] tracking-tight">{title}</h1>
        {sub && <p className="mt-1.5 max-w-2xl text-[15px] text-ink-2">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx('skeleton', className)} />
}

export function Empty({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sunken text-ink-2">{icon}</div>
      <h3 className="text-xl">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-2">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Alert({ tone = 'info', title, children, action }: { tone?: 'info' | 'ok' | 'warn' | 'bad'; title: string; children?: ReactNode; action?: ReactNode }) {
  const Ic = { info: Info, ok: CheckCircle2, warn: AlertTriangle, bad: XCircle }[tone]
  return (
    <div role={tone === 'bad' || tone === 'warn' ? 'alert' : 'status'} className={cx('flex gap-3 rounded-lg border p-4', tones[tone])}>
      <Ic size={20} className="mt-0.5 shrink-0" aria-hidden />
      <div className="flex-1 text-ink">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-0.5 text-[13px] text-ink-2">{children}</div>}
        {action && <div className="mt-3 flex gap-2">{action}</div>}
      </div>
    </div>
  )
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: (id: string, describedBy?: string) => ReactNode }) {
  const id = useId()
  const d = error ? `${id}-e` : hint ? `${id}-h` : undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[13px] font-semibold">
        {label}
      </label>
      {children(id, d)}
      {error ? (
        <p id={`${id}-e`} className="mt-1 flex items-center gap-1 text-[13px] text-bad">
          <XCircle size={14} aria-hidden /> {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-h`} className="mt-1 text-xs text-ink-3">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
export const inputCls =
  'h-12 w-full rounded-md border border-line-strong bg-surface-container-lowest px-4 text-sm text-ink placeholder:text-ink-3 transition-shadow hover:border-ink aria-[invalid=true]:border-bad aria-[invalid=true]:bg-bad-soft/40 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand aria-[invalid=true]:focus:border-bad aria-[invalid=true]:focus:ring-bad'

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (t: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="scroll-quiet flex gap-2 overflow-x-auto border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          id={`tab-${t.id}`}
          aria-selected={value === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={value === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => {
            const i = tabs.findIndex((x) => x.id === value)
            if (e.key === 'ArrowRight') onChange(tabs[(i + 1) % tabs.length].id)
            if (e.key === 'ArrowLeft') onChange(tabs[(i - 1 + tabs.length) % tabs.length].id)
          }}
          className={cx(
            '-mb-px h-12 shrink-0 border-b-[3px] px-4 text-sm font-medium transition-colors',
            value === t.id ? 'border-brand text-brand' : 'border-transparent text-ink-3 hover:border-line-strong hover:text-ink',
          )}
        >
          {t.label}
          {t.count != null && <span className="tnum ml-1.5 rounded-full bg-sunken px-1.5 text-xs text-ink-2">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Segmented<T extends string>({ options, value, onChange, label }: { options: { id: T; label: string; icon?: ReactNode }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full border border-line-strong bg-surface-container-low p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cx('inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-colors', value === o.id ? 'bg-brand text-on-brand shadow-e1' : 'text-ink-2 hover:bg-sunken')}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      type="button"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx('relative h-8 w-[52px] shrink-0 rounded-full border-2 transition-colors', checked ? 'border-brand bg-brand' : 'border-line-strong bg-surface-container-highest')}
    >
      <span className={cx('absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full shadow transition-all', checked ? 'left-[28px] h-6 w-6 bg-on-brand' : 'left-1 bg-ink-3')} />
    </button>
  )
}

/* ---------- Focus-managed overlay (dialog / drawer) ---------- */
function useFocusTrap(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const el = ref.current
    if (!el) return
    const prevOverflow = document.body.style.overflow
    const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => (el.querySelector<HTMLElement>('[data-autofocus]') ?? el.querySelector<HTMLElement>(sel) ?? el).focus())
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        return closeRef.current()
      }
      if (e.key !== 'Tab') return
      const f = [...el.querySelectorAll<HTMLElement>(sel)].filter((item) => item.getClientRects().length > 0)
      if (!f.length) return
      const first = f[0],
        last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus())
      else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus())
    }
    document.addEventListener('keydown', key)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', key)
      document.body.style.overflow = prevOverflow
      if (prev?.isConnected) prev.focus()
    }
  }, [open])
  return ref
}

export function Overlay({ open, onClose, title, children, side, footer, width = 'max-w-md' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; side?: boolean; footer?: ReactNode; width?: string }) {
  const ref = useFocusTrap(open, onClose)
  const tid = useId()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tid}
        tabIndex={-1}
        className={cx(
          'absolute flex flex-col bg-surface shadow-e3',
          side ? `slide-in inset-y-0 right-0 w-full ${width}` : `fade-up top-1/2 left-1/2 max-h-[90vh] w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-[28px] ${width}`,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <h2 id={tid} className="text-xl">
            {title}
          </h2>
          <IconButton label="Close" onClick={onClose} className="-mt-1 -mr-2">
            <X size={18} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line bg-paper/60 px-6 py-3">{footer}</div>}
      </div>
    </div>
  )
}

/* ---------- Toasts ---------- */
const ToastCtx = createContext<(m: string, tone?: 'ok' | 'info' | 'warn') => void>(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; m: string; tone: string }[]>([])
  const push = useCallback((m: string, tone: 'ok' | 'info' | 'warn' = 'ok') => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s, { id, m, tone }])
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 4500)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed right-4 bottom-4 z-[60] flex flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className="fade-up flex items-center gap-2 rounded-lg bg-inverse-surface px-4 py-3 text-sm text-inverse-on-surface shadow-e3">
            <CheckCircle2 size={16} aria-hidden className="text-ok" /> {t.m}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Explainable AI: "Why this?" ---------- */
export type Explain = {
  title: string
  answer: string
  confidence: number
  factors: { label: string; weight: number; dir: 'up' | 'down' }[]
  evidence: { label: string; source: string }[]
  limits: string
}
export function WhyThis({ explain, label = 'Why this?' }: { explain: Explain; label?: string }) {
  const [open, setOpen] = useState(false)
  const [fb, setFb] = useState<null | 'up' | 'down'>(null)
  const toast = useToast()
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded text-[13px] font-semibold text-ai-deep underline decoration-ai-line decoration-2 underline-offset-4 hover:decoration-ai">
        <Sparkles size={13} aria-hidden /> {label}
      </button>
      <Overlay open={open} onClose={close} side title={explain.title} width="max-w-lg" footer={<Button variant="primary" onClick={close}>Done</Button>}>
        <div className="space-y-6">
          <div className="ai-surface rounded-lg p-4">
            <div className="mb-2 flex items-center justify-between">
              <AIBadge>AI reasoning</AIBadge>
              <Confidence value={explain.confidence} />
            </div>
            <p className="text-[15px] text-ink">{explain.answer}</p>
          </div>
          <section aria-labelledby="w-f">
            <h3 id="w-f" className="mb-2 text-base">What influenced this</h3>
            <ul className="space-y-2">
              {explain.factors.map((f) => (
                <li key={f.label} className="text-[13px]">
                  <div className="mb-1 flex justify-between">
                    <span>{f.label}</span>
                    <span className="tnum font-semibold">
                      {f.dir === 'up' ? 'Raises' : 'Lowers'} · {f.weight}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-sunken">
                    <div className={cx('h-2 rounded-full', f.dir === 'up' ? 'bg-ai' : 'bg-ink-3')} style={{ width: `${f.weight * 2.4}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="w-e">
            <h3 id="w-e" className="mb-2 text-base">Evidence used</h3>
            <ul className="divide-y divide-line rounded-lg border border-line">
              {explain.evidence.map((e) => (
                <li key={e.label} className="flex items-center justify-between gap-3 px-3 py-2 text-[13px]">
                  <span>
                    <span className="font-medium">{e.label}</span>
                    <span className="block text-xs text-ink-3">{e.source}</span>
                  </span>
                  <button className="inline-flex items-center gap-1 text-info hover:underline">
                    View <ExternalLink size={12} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <Alert tone="warn" title="What the AI can't tell you">
            {explain.limits}
          </Alert>
          <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3">
            <span className="text-[13px] font-medium">{fb ? 'Thanks. Your feedback improves future suggestions.' : 'Was this explanation useful?'}</span>
            <div className="flex gap-1">
              <IconButton label="Helpful" aria-pressed={fb === 'up'} className={fb === 'up' ? 'bg-ok-soft text-ok' : ''} onClick={() => (setFb('up'), toast('Feedback recorded'))}>
                <ThumbsUp size={16} />
              </IconButton>
              <IconButton label="Not helpful" aria-pressed={fb === 'down'} className={fb === 'down' ? 'bg-bad-soft text-bad' : ''} onClick={() => (setFb('down'), toast('Feedback recorded'))}>
                <ThumbsDown size={16} />
              </IconButton>
            </div>
          </div>
        </div>
      </Overlay>
    </>
  )
}

export function Meter({ value, tone }: { value: number; tone: 'ok' | 'warn' | 'bad' | 'ai' }) {
  const c = { ok: 'bg-ok', warn: 'bg-warn', bad: 'bg-bad', ai: 'bg-ai' }[tone]
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-sunken" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={cx('h-full rounded-full', c)} style={{ width: `${value}%` }} />
    </div>
  )
}

export const money = (n: number) => '$' + n.toLocaleString('en-US')
