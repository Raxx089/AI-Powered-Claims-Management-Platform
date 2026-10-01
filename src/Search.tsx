import { useMemo, useState } from 'react'
import { Search as Ic, Sparkles, X } from './icons'
import { claims } from './data'
import { AIBadge, Badge, money, priorityTone, Overlay } from './ui'

type Chip = { id: string; label: string; test: (c: (typeof claims)[number]) => boolean }

function parse(q: string): Chip[] {
  const s = q.toLowerCase()
  const chips: Chip[] = []
  if (/high[- ]risk|risky|suspicious/.test(s)) chips.push({ id: 'risk', label: 'Risk 60+', test: (c) => c.risk >= 60 })
  if (/auto|car|vehicle|collision/.test(s)) chips.push({ id: 'auto', label: 'Type: Auto', test: (c) => /auto/i.test(c.type) })
  if (/home|property|water|fire/.test(s)) chips.push({ id: 'prop', label: 'Type: Property', test: (c) => /home|property/i.test(c.type) })
  if (/breach|overdue|late/.test(s)) chips.push({ id: 'breach', label: 'SLA breached or near', test: (c) => c.slaPct >= 90 })
  if (/unassigned|no handler/.test(s)) chips.push({ id: 'un', label: 'Unassigned', test: (c) => c.handler === 'Unassigned' })
  if (/critical/.test(s)) chips.push({ id: 'crit', label: 'Priority: Critical', test: (c) => c.priority === 'Critical' })
  const m = s.match(/(?:over|above|more than)\s*\$?(\d+(?:\.\d+)?)\s*(k|m)?/)
  if (m) {
    const v = Number(m[1]) * (m[2] === 'k' ? 1e3 : m[2] === 'm' ? 1e6 : 1)
    chips.push({ id: 'amt', label: `Over ${money(v)}`, test: (c) => c.amount > v })
  }
  return chips
}

export function SearchOverlay({ open, onClose, go }: { open: boolean; onClose: () => void; go: (p: string) => void }) {
  const [q, setQ] = useState('')
  const [off, setOff] = useState<string[]>([])
  const chips = useMemo(() => parse(q).filter((c) => !off.includes(c.id)), [q, off])
  const results = useMemo(() => {
    if (!q.trim()) return []
    const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
    return claims.filter((c) => {
      if (chips.length) return chips.every((ch) => ch.test(c))
      return terms.some((t) => [c.id, c.insured, c.type].join(' ').toLowerCase().includes(t))
    })
  }, [q, chips])

  return (
    <Overlay open={open} onClose={onClose} title="Search claims" width="max-w-2xl">
      <div className="relative">
        <Ic size={18} className="absolute top-3 left-3 text-ink-3" aria-hidden />
        <input data-autofocus aria-label="Search" value={q} onChange={(e) => (setQ(e.target.value), setOff([]))} placeholder='Try "high risk auto claims over $10k" or a claim ID' className="h-11 w-full rounded-md border border-line-strong bg-surface pl-10 text-[15px] placeholder:text-ink-3" />
      </div>
      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2" aria-live="polite">
          <AIBadge>Understood</AIBadge>
          {chips.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1 rounded-full border border-ai-line bg-ai-soft py-0.5 pr-1 pl-2.5 text-xs font-semibold text-ai-deep">
              {c.label}
              <button onClick={() => setOff([...off, c.id])} aria-label={`Remove filter ${c.label}`} className="rounded-full p-0.5 hover:bg-ai-line/50"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
      <div className="mt-4" aria-live="polite">
        {!q.trim() ? (
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-ink-3 uppercase">Ask in plain words</p>
            <ul className="space-y-1">
              {['critical claims with breached SLA', 'unassigned auto claims', 'home claims over $10k', 'high risk claims over 50k'].map((s) => (
                <li key={s}><button onClick={() => setQ(s)} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-sunken"><Sparkles size={14} className="text-ai" aria-hidden />{s}</button></li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-2">No claims found. Try fewer words, or remove a filter above.</p>
        ) : (
          <>
            <p className="mb-2 text-xs text-ink-3">{results.length} result{results.length > 1 ? 's' : ''}</p>
            <ul className="divide-y divide-line rounded-lg border border-line">
              {results.map((c) => (
                <li key={c.id}>
                  <button onClick={() => (onClose(), go('/claims/' + c.id))} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-paper">
                    <span><span className="font-mono text-[13px] text-brand">{c.id}</span> <span className="font-semibold">{c.insured}</span><span className="block text-xs text-ink-2">{c.type} · {c.status}</span></span>
                    <span className="flex flex-col items-end gap-1"><span className="tnum text-sm font-semibold">{money(c.amount)}</span><Badge tone={priorityTone[c.priority]}>{c.priority}</Badge></span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Overlay>
  )
}
