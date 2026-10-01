import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Columns3, Download, FilterX, LayoutList, Search, Sparkles, Table2, UserPlus } from '../icons'
import { claims, type Claim } from '../data'
import { AIBadge, Badge, Button, Card, Empty, Overlay, PageHeader, Segmented, money, priorityTone, statusTone, useToast, inputCls } from '../ui'
import { useApp } from '../ctx'

type SortKey = 'ai' | 'risk' | 'amount' | 'slaPct' | 'id'
const COLS = ['New', 'Triage', 'Assigned', 'In assessment', 'Awaiting approval']

export default function Queue() {
  const { nav } = useApp()
  const toast = useToast()
  const [view, setView] = useState<'table' | 'list' | 'kanban'>('table')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [pri, setPri] = useState('All')
  const [mine, setMine] = useState(false)
  const [sort, setSort] = useState<{ k: SortKey; dir: 1 | -1 }>({ k: 'ai', dir: -1 })
  const [sel, setSel] = useState<string[]>([])
  const [confirm, setConfirm] = useState<null | 'assign' | 'escalate'>(null)
  const [claimRows, setClaimRows] = useState(claims)
  const [assignee, setAssignee] = useState('Marcus Bell')
  const [escalated, setEscalated] = useState<string[]>([])

  const rows = useMemo(() => {
    const s = q.toLowerCase()
    return claimRows
      .filter((c) => (status === 'All' || c.status === status) && (pri === 'All' || c.priority === pri) && (!mine || c.handler === 'Priya Raman'))
      .filter((c) => !s || [c.id, c.insured, c.type, c.handler].join(' ').toLowerCase().includes(s))
      .sort((a, b) => {
        const x = a[sort.k],
          y = b[sort.k]
        return (x > y ? 1 : x < y ? -1 : 0) * sort.dir
      })
  }, [claimRows, q, status, pri, mine, sort])

  const active = status !== 'All' || pri !== 'All' || mine || q
  const reset = () => (setQ(''), setStatus('All'), setPri('All'), setMine(false))
  const allSel = rows.length > 0 && rows.every((r) => sel.includes(r.id))
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const applyBulkAction = () => {
    if (confirm === 'assign') {
      setClaimRows((current) => current.map((claim) => (sel.includes(claim.id) ? { ...claim, handler: assignee } : claim)))
      toast(`${sel.length} claims assigned to ${assignee}`)
    } else if (confirm === 'escalate') {
      setEscalated((current) => [...new Set([...current, ...sel])])
      toast(`${sel.length} claims escalated to a supervisor`)
    }
    setConfirm(null)
    setSel([])
  }
  const th = (k: SortKey, l: string, right?: boolean) => (
    <th scope="col" aria-sort={sort.k === k ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'} className={`px-3 py-2.5 font-semibold ${right ? 'text-right' : ''}`}>
      <button onClick={() => setSort({ k, dir: sort.k === k ? (sort.dir === 1 ? -1 : 1) : -1 })} className="inline-flex items-center gap-1 hover:text-ink">
        {l}
        {sort.k === k && (sort.dir === 1 ? <ArrowUp size={12} aria-hidden /> : <ArrowDown size={12} aria-hidden />)}
      </button>
    </th>
  )

  return (
    <div>
      <PageHeader
        eyebrow="Claims · Work queue"
        title="Claims queue"
        sub={`${rows.length} of ${claims.length} claims shown. Sorted by ${sort.k === 'ai' ? 'AI priority' : sort.k}.`}
        actions={
          <>
            <Button icon={<Download size={16} />} onClick={() => toast('Export started. You will get a file in a moment.')}>
              Export
            </Button>
            <Button variant="primary" onClick={() => nav('/claims/new')}>
              New claim
            </Button>
          </>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute top-3 left-3 text-ink-3" aria-hidden />
            <input aria-label="Search claims" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, name, type or handler" className={inputCls + ' pl-9'} />
          </div>
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls + ' !w-auto'}>
            {['All', ...COLS, 'Awaiting documents', 'Under investigation', 'Approved'].map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All statuses' : s}
              </option>
            ))}
          </select>
          <select aria-label="Priority" value={pri} onChange={(e) => setPri(e.target.value)} className={inputCls + ' !w-auto'}>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All priorities' : s}
              </option>
            ))}
          </select>
          <label className="flex h-10 items-center gap-2 text-[13px] font-medium">
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} className="h-4 w-4 accent-brand" />
            My claims
          </label>
          {active && (
            <Button variant="ghost" size="sm" icon={<FilterX size={14} />} onClick={reset}>
              Clear filters
            </Button>
          )}
          <div className="ml-auto">
            <Segmented
              label="View"
              value={view}
              onChange={setView}
              options={[
                { id: 'table', label: 'Table', icon: <Table2 size={14} aria-hidden /> },
                { id: 'list', label: 'List', icon: <LayoutList size={14} aria-hidden /> },
                { id: 'kanban', label: 'Board', icon: <Columns3 size={14} aria-hidden /> },
              ]}
            />
          </div>
        </div>

        {sel.length > 0 && (
          <div role="region" aria-label="Bulk actions" className="flex flex-wrap items-center gap-3 border-b border-brand/20 bg-brand-soft px-4 py-2.5">
            <span className="text-[13px] font-semibold">{sel.length} selected</span>
            <Button size="sm" icon={<UserPlus size={14} />} onClick={() => setConfirm('assign')}>
              Assign
            </Button>
            <Button size="sm" onClick={() => setConfirm('escalate')}>
              Escalate
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSel([])}>
              Clear
            </Button>
          </div>
        )}

        {rows.length === 0 ? (
          <Empty
            icon={<Search size={22} />}
            title="No claims match these filters"
            body="Try removing a filter or searching by claim ID. Claims you don't have permission to view are never shown."
            action={<Button onClick={reset}>Clear all filters</Button>}
          />
        ) : view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-[13px]">
              <caption className="sr-only">Claims work queue</caption>
              <thead className="border-b border-line bg-paper/60 text-ink-2">
                <tr>
                  <th scope="col" className="w-10 px-3">
                    <input type="checkbox" aria-label="Select all claims" checked={allSel} onChange={() => setSel(allSel ? [] : rows.map((r) => r.id))} className="h-4 w-4 accent-brand" />
                  </th>
                  {th('id', 'Claim')}
                  <th scope="col" className="px-3 py-2.5 font-semibold">Status</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">Priority</th>
                  {th('amount', 'Amount', true)}
                  {th('risk', 'Risk', true)}
                  {th('ai', 'AI priority', true)}
                  {th('slaPct', 'SLA')}
                  <th scope="col" className="px-3 py-2.5 font-semibold">Handler</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className={`border-b border-line/70 hover:bg-paper/70 ${sel.includes(c.id) ? 'bg-brand-soft/60' : ''}`}>
                    <td className="px-3">
                      <input type="checkbox" aria-label={`Select ${c.id}`} checked={sel.includes(c.id)} onChange={() => toggle(c.id)} className="h-4 w-4 accent-brand" />
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={() => nav('/claims/' + c.id)} className="text-left">
                        <span className="block font-mono text-[13px] font-medium text-brand underline-offset-2 hover:underline">{c.id}</span>
                        <span className="block text-ink-2">
                          {c.insured} · {c.type}
                        </span>
                      </button>
                    </td>
                    <td className="px-3"><Badge tone={statusTone[c.status]}>{c.status}</Badge></td>
                    <td className="px-3"><div className="flex flex-wrap items-center gap-1"><Badge tone={priorityTone[c.priority]} dot>{c.priority}</Badge>{escalated.includes(c.id) && <Badge tone="bad">Escalated</Badge>}</div></td>
                    <td className="tnum px-3 text-right font-medium">{money(c.amount)}</td>
                    <td className="tnum px-3 text-right"><RiskPill v={c.risk} /></td>
                    <td className="tnum px-3 text-right">
                      <span className="inline-flex items-center gap-1 font-semibold text-ai-deep"><Sparkles size={12} aria-hidden />{c.ai}</span>
                    </td>
                    <td className={`px-3 ${c.slaPct >= 90 ? 'font-semibold text-bad' : 'text-ink-2'}`}>{c.sla}</td>
                    <td className={`px-3 ${c.handler === 'Unassigned' ? 'italic text-ink-3' : ''}`}>{c.handler}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : view === 'list' ? (
          <ul>
            {rows.map((c) => (
              <li key={c.id} className="border-b border-line/70 last:border-0">
                <button onClick={() => nav('/claims/' + c.id)} className="flex w-full flex-col gap-1 px-5 py-3.5 text-left hover:bg-paper/70">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[13px] font-medium text-brand">{c.id}</span>
                    <span className="font-semibold">{c.insured}</span>
                    <Badge tone={priorityTone[c.priority]} dot>{c.priority}</Badge>
                    <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                    {escalated.includes(c.id) && <Badge tone="bad">Escalated</Badge>}
                    <span className="tnum ml-auto font-semibold">{money(c.amount)}</span>
                  </span>
                  <span className="flex items-center gap-2 text-[13px] text-ink-2">
                    <AIBadge>AI</AIBadge>
                    {c.reason}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="scroll-quiet flex gap-4 overflow-x-auto bg-paper/50 p-4">
            {COLS.map((col) => {
              const items = rows.filter((r) => r.status === col)
              return (
                <section key={col} aria-label={col} className="w-72 shrink-0">
                  <h3 className="mb-2 flex items-center justify-between font-sans text-[13px] font-semibold">
                    {col}
                    <span className="tnum rounded-full bg-sunken px-2 text-xs text-ink-2">{items.length}</span>
                  </h3>
                  <ul className="space-y-2">
                    {items.map((c: Claim) => (
                      <li key={c.id}>
                        <button onClick={() => nav('/claims/' + c.id)} className="w-full rounded-lg border border-line bg-surface p-3 text-left shadow-e1 hover:border-brand">
                          <span className="flex items-center justify-between">
                            <span className="font-mono text-xs font-medium text-brand">{c.id}</span>
                            <Badge tone={priorityTone[c.priority]} dot>{c.priority}</Badge>
                          </span>
                          <span className="mt-1 block font-semibold">{c.insured}</span>
                          {escalated.includes(c.id) && <Badge tone="bad">Escalated</Badge>}
                          <span className="block text-xs text-ink-3">{c.type}</span>
                          <span className="mt-2 flex items-center justify-between text-xs">
                            <span className="tnum font-semibold">{money(c.amount)}</span>
                            <span className={c.slaPct >= 90 ? 'font-semibold text-bad' : 'text-ink-3'}>{c.sla}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                    {items.length === 0 && <li className="rounded-lg border border-dashed border-line-strong p-4 text-center text-xs text-ink-3">No claims here</li>}
                  </ul>
                </section>
              )
            })}
          </div>
        )}
      </Card>

      <Overlay
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm === 'assign' ? `Assign ${sel.length} claims` : `Escalate ${sel.length} claims to a supervisor?`}
        footer={
          <>
            <Button onClick={() => setConfirm(null)}>Cancel</Button>
            <Button variant="primary" onClick={applyBulkAction}>
              {confirm === 'assign' ? 'Assign claims' : 'Escalate'}
            </Button>
          </>
        }
      >
        {confirm === 'assign' ? (
          <div className="space-y-4">
            <div className="ai-surface rounded-lg p-3 text-[13px]">
              <AIBadge>Suggestion</AIBadge>
              <p className="mt-1.5">Marcus Bell has the most free capacity (5 slots) and handled similar claims in the past 90 days.</p>
            </div>
            <label className="block text-[13px] font-semibold">
              Assign to
              <select data-autofocus value={assignee} onChange={(e) => setAssignee(e.target.value)} className={inputCls + ' mt-1'}>
                {['Marcus Bell', 'Sam Whitlock', 'Lucía Ferrer', 'Priya Raman'].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <p className="text-sm text-ink-2">Supervisors will be notified immediately and these claims will be flagged in their queue. You can add a note after escalating.</p>
        )}
      </Overlay>
    </div>
  )
}

export function RiskPill({ v }: { v: number }) {
  const t = v >= 70 ? 'bg-bad-soft text-bad' : v >= 45 ? 'bg-warn-soft text-warn' : 'bg-ok-soft text-ok'
  const l = v >= 70 ? 'High' : v >= 45 ? 'Medium' : 'Low'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-semibold ${t}`}>
      {v} <span className="font-medium">{l}</span>
    </span>
  )
}
