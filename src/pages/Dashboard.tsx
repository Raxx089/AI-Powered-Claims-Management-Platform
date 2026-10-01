import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownRight, ArrowUpRight, ChevronRight, FilePlus2, ListChecks, Search, Sparkles, UserPlus } from '../icons'
import { claims, explainRisk } from '../data'
import { AIBadge, Badge, Button, Card, CardHeader, Confidence, PageHeader, Skeleton, WhyThis, money, priorityTone } from '../ui'
import { ChartCard, Spark, axisProps, C } from '../charts'
import { useApp } from '../ctx'

const kpis = [
  { label: 'Open claims', value: '342', delta: '-4.2%', good: true, down: true, spark: [380, 372, 369, 361, 355, 342] },
  { label: 'Avg. cycle time', value: '7.9 days', delta: '-0.8 d', good: true, down: true, spark: [11.8, 11.2, 10.4, 9.6, 8.7, 7.9] },
  { label: 'SLA compliance', value: '94.2%', delta: '+1.6 pts', good: true, down: false, spark: [89, 90, 92, 91, 93, 94.2] },
  { label: 'Straight-through', value: '31%', delta: '+5 pts', good: true, down: false, spark: [18, 21, 24, 26, 29, 31] },
]

const daily = [
  { d: 'Mon', closed: 41, reopened: 3 },
  { d: 'Tue', closed: 48, reopened: 2 },
  { d: 'Wed', closed: 52, reopened: 4 },
  { d: 'Thu', closed: 46, reopened: 1 },
  { d: 'Fri', closed: 58, reopened: 2 },
]

export default function Dashboard() {
  const { nav, openSearch } = useApp()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])
  const top = [...claims].sort((a, b) => b.risk * 0.5 + b.slaPct * 0.5 - (a.risk * 0.5 + a.slaPct * 0.5)).slice(0, 5)

  return (
    <div>
      <PageHeader
        eyebrow="Wednesday, Sep 30 · Claims Operations"
        title="Good morning, Priya"
        sub="Five claims need you first today. The AI has ordered them by urgency, value and risk."
        actions={
          <>
            <Button icon={<Search size={16} />} onClick={openSearch}>
              Search claims
            </Button>
            <Button variant="primary" icon={<FilePlus2 size={16} />} onClick={() => nav('/claims/new')}>
              New claim
            </Button>
          </>
        }
      />

      <section aria-label="Key metrics" className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <p className="text-[13px] font-medium text-ink-2">{k.label}</p>
            {loading ? (
              <Skeleton className="mt-3 h-9 w-28" />
            ) : (
              <p className="tnum mt-1 font-display text-[34px] leading-none">{k.value}</p>
            )}
            <div className="mt-3 flex items-center justify-between">
              {loading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${k.good ? 'text-ok' : 'text-bad'}`}>
                  {k.down ? <ArrowDownRight size={14} aria-hidden /> : <ArrowUpRight size={14} aria-hidden />}
                  {k.delta}
                  <span className="sr-only">{k.good ? ', improving' : ', worsening'}</span>
                </span>
              )}
              <Spark data={k.spark} />
            </div>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-8" aria-labelledby="prio">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <h2 id="prio" className="flex items-center gap-2 text-lg">
                <span className="font-mono text-[11px] text-ink-3">01</span>Prioritised for you
                <AIBadge>AI-ranked</AIBadge>
              </h2>
              <p className="mt-0.5 text-[13px] text-ink-3">Ranked by SLA pressure, claim value and risk. You decide what to open.</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => nav('/claims')}>
              All claims <ChevronRight size={14} />
            </Button>
          </div>
          <ol>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-0">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </li>
                ))
              : top.map((c, i) => (
                  <li key={c.id} className="group flex items-center gap-4 border-b border-line px-5 py-3.5 last:border-0 hover:bg-paper/70">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-on-brand">{i + 1}</span>
                    <button onClick={() => nav('/claims/' + c.id)} className="min-w-0 flex-1 text-left">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[13px] font-medium">{c.id}</span>
                        <span className="font-semibold">{c.insured}</span>
                        <Badge tone={priorityTone[c.priority]} dot>
                          {c.priority}
                        </Badge>
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-2">
                        <Sparkles size={12} className="shrink-0 text-ai" aria-hidden />
                        <span className="truncate">{c.reason}</span>
                      </span>
                    </button>
                    <div className="hidden text-right sm:block">
                      <p className="tnum font-semibold">{money(c.amount)}</p>
                      <p className={`text-xs ${c.slaPct >= 90 ? 'font-semibold text-bad' : 'text-ink-3'}`}>{c.sla}</p>
                    </div>
                    <div className="hidden md:block">
                      <WhyThis explain={explainRisk} label="Why" />
                    </div>
                  </li>
                ))}
          </ol>
          <div className="flex items-center justify-between border-t border-line bg-ai-soft/50 px-5 py-2.5 text-xs text-ai-deep">
            <span>AI priority is advisory. Reordering or pinning a claim teaches the model your preferences.</span>
            <Confidence value={87} label={false} />
          </div>
        </Card>

        <div className="space-y-6 xl:col-span-4">
          <Card>
            <CardHeader num="02" title="Quick actions" />
            <div className="grid grid-cols-2 gap-2 p-4">
              {[
                { i: <FilePlus2 size={18} />, l: 'Register claim', p: '/claims/new' },
                { i: <UserPlus size={18} />, l: 'Assign unassigned (3)', p: '/claims' },
                { i: <ListChecks size={18} />, l: 'My tasks (6)', p: '/tasks' },
                { i: <Search size={18} />, l: 'Ask in plain words', p: 'search' },
              ].map((a) => (
                <button
                  key={a.l}
                  onClick={() => (a.p === 'search' ? openSearch() : nav(a.p))}
                  className="flex flex-col items-start gap-2 rounded-lg border border-line p-3 text-left text-[13px] font-semibold transition hover:border-brand hover:bg-brand-soft"
                >
                  <span className="text-brand">{a.i}</span>
                  {a.l}
                </button>
              ))}
            </div>
          </Card>
          <Card className="ai-surface border-ai-line p-5" aria-labelledby="brief">
            <div className="mb-2 flex items-center justify-between">
              <h2 id="brief" className="text-lg">
                Morning briefing
              </h2>
              <AIBadge />
            </div>
            <ul className="space-y-2 text-[13px] text-ink">
              <li>• 1 claim has breached SLA; 3 more could before 17:00.</li>
              <li>• 3 new claims look eligible for straight-through payment.</li>
              <li>• A repair supplier appears across 3 claims. Worth a look.</li>
            </ul>
            <p className="mt-3 text-xs text-ai-deep">Based on activity since yesterday 17:00. Always verify before acting.</p>
          </Card>
        </div>

        <div className="xl:col-span-7">
          <ChartCard
            num="03"
            title="Productivity this week"
            sub="Claims closed and reopened per day, team"
            data={daily}
            cols={[
              { key: 'd', label: 'Day' },
              { key: 'closed', label: 'Closed' },
              { key: 'reopened', label: 'Reopened' },
            ]}
            summary="Closures peaked Friday at 58. Reopened claims stayed under 5 per day."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ left: -16, top: 8 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="d" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip cursor={{ fill: 'var(--color-sunken)' }} />
                <Bar dataKey="closed" name="Closed" fill={C.brand} radius={[3, 3, 0, 0]} />
                <Bar dataKey="reopened" name="Reopened" fill={C.ochre} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <Card className="xl:col-span-5">
          <CardHeader num="04" title="Your workload" sub="Capacity 16 open claims" />
          <div className="space-y-4 p-5">
            {[
              ['In assessment', 6, 'bg-brand'],
              ['Awaiting documents', 4, 'bg-warn'],
              ['Awaiting approval', 3, 'bg-ai'],
              ['New / triage', 1, 'bg-ink-3'],
            ].map(([l, n, c]) => (
              <div key={l as string}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span>{l}</span>
                  <span className="tnum font-semibold">{n}</span>
                </div>
                <div className="h-2 rounded-full bg-sunken">
                  <div className={`h-2 rounded-full ${c}`} style={{ width: `${(n as number) * 10}%` }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-ink-3">14 of 16 capacity used. You can take 2 more.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
