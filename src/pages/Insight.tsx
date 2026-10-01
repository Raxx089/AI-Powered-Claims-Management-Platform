import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Network } from '../icons'
import { byType, claims, riskBands, team, trend } from '../data'
import { AIBadge, Badge, Button, Card, CardHeader, Meter, PageHeader, Segmented, WhyThis, money, priorityTone, useToast } from '../ui'
import { ChartCard, C, axisProps } from '../charts'
import { RiskPanel } from './Claim'
import { RiskPill } from './Queue'
import { explainRisk } from '../data'
import { useApp } from '../ctx'

/* ---------- Risk & Fraud ---------- */
export function RiskPage() {
  const { nav } = useApp()
  const flagged = claims.filter((c) => c.risk >= 45).sort((a, b) => b.risk - a.risk)
  return (
    <div>
      <PageHeader eyebrow="Risk & Fraud" title="Risk intelligence" sub="Claims where something looks unusual. A high score is a reason to look closer, never a finding on its own." />
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <ChartCard num="01" title="Open claims by risk score" sub="Distribution across 1,046 open and recent claims" data={riskBands} cols={[{ key: 'band', label: 'Risk score' }, { key: 'n', label: 'Claims' }]} summary="Most claims score under 40. 129 claims score above 60 and are eligible for review." height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBands} margin={{ left: -16, top: 8 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="band" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip cursor={{ fill: 'var(--color-sunken)' }} />
                <Bar dataKey="n" name="Claims" radius={[3, 3, 0, 0]}>
                  {riskBands.map((_, i) => <Cell key={i} fill={i >= 3 ? 'var(--color-bad)' : i === 2 ? C.ochre : C.brand} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <Card>
            <CardHeader num="02" title="Flagged claims" sub={`${flagged.length} need review`} action={<AIBadge>AI-scored</AIBadge>} />
            <ul>
              {flagged.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 border-b border-line/70 px-5 py-3.5 last:border-0">
                  <RiskPill v={c.risk} />
                  <button onClick={() => nav('/claims/' + c.id)} className="min-w-[200px] flex-1 text-left">
                    <span className="font-mono text-[13px] text-brand">{c.id}</span> <span className="font-semibold">{c.insured}</span>
                    <span className="block text-[13px] text-ink-2">{c.reason}</span>
                  </button>
                  <span className="tnum text-sm font-semibold">{money(c.amount)}</span>
                  <WhyThis explain={explainRisk} label="Why" />
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="space-y-6 xl:col-span-4">
          <Card className="ai-surface p-5">
            <div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg"><Network size={18} aria-hidden />Linked entities</h2><AIBadge /></div>
            <p className="text-[13px]">Apex Collision Supply appears on 3 open claims totalling <strong className="tnum">$91,200</strong>. Estimates from this supplier average 38% above the regional median.</p>
            <p className="mt-2 text-xs text-ai-deep">Pattern only. It may have an innocent explanation, such as a specialised repair niche.</p>
            <Button className="mt-3" size="sm" onClick={() => nav('/claims')}>View 3 linked claims</Button>
          </Card>
          <RiskPanel />
        </div>
      </div>
    </div>
  )
}

/* ---------- Analytics ---------- */
export function AnalyticsPage() {
  const [range, setRange] = useState<'6m' | '3m'>('6m')
  const d = range === '6m' ? trend : trend.slice(3)
  const toast = useToast()
  const k = [
    ['Claims received', '1,046', '+3.4%', 'up', true],
    ['Claims closed', '1,031', '+5.2%', 'up', true],
    ['Avg. cycle time', '7.9 d', '-9.2%', 'down', true],
    ['Suspected fraud rate', '3.1%', '-0.2 pts', 'down', true],
  ] as const
  return (
    <div>
      <PageHeader eyebrow="Analytics" title="Claims analytics" sub="How the operation is performing, and where AI is making a difference." actions={<><Segmented label="Date range" value={range} onChange={setRange} options={[{ id: '3m', label: 'Last 3 months' }, { id: '6m', label: 'Last 6 months' }]} /><Button onClick={() => toast('Report exported')}>Export</Button></>} />
      <section aria-label="Key metrics" className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {k.map(([l, v, dl, dir, good]) => (
          <Card key={l} className="p-4"><p className="text-[13px] font-medium text-ink-2">{l}</p><p className="tnum mt-1 font-display text-[32px] leading-none">{v}</p>
            <p className={`mt-2 inline-flex items-center gap-1 text-[13px] font-semibold ${good ? 'text-ok' : 'text-bad'}`}>{dir === 'up' ? <ArrowUpRight size={14} aria-hidden /> : <ArrowDownRight size={14} aria-hidden />}{dl}<span className="sr-only">{good ? ', improving' : ', worsening'}</span></p></Card>
        ))}
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard num="01" title="Intake vs. closed" sub="Claims per month" data={d} cols={[{ key: 'm', label: 'Month' }, { key: 'intake', label: 'Received' }, { key: 'closed', label: 'Closed' }]} summary="Closures have kept pace with intake since July; backlog is shrinking.">
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={d} margin={{ left: -8, top: 8 }}><CartesianGrid stroke={C.grid} vertical={false} /><XAxis dataKey="m" {...axisProps} /><YAxis {...axisProps} domain={[600, 1100]} /><Tooltip /><Legend iconType="plainline" /><Area dataKey="intake" name="Received" stroke={C.brand} fill={C.brand} fillOpacity={0.12} strokeWidth={2} /><Area dataKey="closed" name="Closed" stroke={C.teal} fill={C.teal} fillOpacity={0.12} strokeWidth={2} strokeDasharray="5 3" /></AreaChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard num="02" title="Cycle time (days)" sub="Average time from intake to closure" data={d} cols={[{ key: 'm', label: 'Month' }, { key: 'cycle', label: 'Days' }]} summary="Cycle time fell from 11.8 to 7.9 days in six months, a 33% improvement.">
          <ResponsiveContainer width="100%" height="100%"><LineChart data={d} margin={{ left: -16, top: 8 }}><CartesianGrid stroke={C.grid} vertical={false} /><XAxis dataKey="m" {...axisProps} /><YAxis {...axisProps} domain={[6, 13]} /><Tooltip /><Line dataKey="cycle" name="Days" stroke={C.ai} strokeWidth={2.5} dot={{ r: 4, fill: C.ai }} /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard num="03" title="Claims by type" sub="Open claims" data={byType} cols={[{ key: 't', label: 'Type' }, { key: 'n', label: 'Claims' }]} summary="Auto makes up 39% of open claims, followed by property at 27%.">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={byType} layout="vertical" margin={{ left: 16 }}><CartesianGrid stroke={C.grid} horizontal={false} /><XAxis type="number" {...axisProps} /><YAxis type="category" dataKey="t" {...axisProps} width={70} /><Tooltip cursor={{ fill: 'var(--color-sunken)' }} /><Bar dataKey="n" name="Claims" fill={C.brand} radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <Card>
          <CardHeader num="04" title="AI impact" sub="How often people follow and change AI suggestions" action={<AIBadge />} />
          <div className="space-y-4 p-5">
            {[['Suggestions accepted as-is', 68, 'ai'], ['Accepted after editing', 21, 'ok'], ['Overridden by human', 11, 'warn']].map(([l, v, t]) => (
              <div key={l as string}><div className="mb-1 flex justify-between text-[13px]"><span>{l}</span><span className="tnum font-semibold">{v}%</span></div><Meter value={v as number} tone={t as 'ai'} /></div>
            ))}
            <p className="text-xs text-ink-3">Overrides are healthy: they show people are exercising judgement. Review them in Compliance.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ---------- Underwriter ---------- */
export function UnderwriterPage() {
  const lossRatio = [
    { m: 'Apr', auto: 61, property: 54 }, { m: 'May', auto: 63, property: 52 }, { m: 'Jun', auto: 66, property: 55 },
    { m: 'Jul', auto: 68, property: 58 }, { m: 'Aug', auto: 71, property: 57 }, { m: 'Sep', auto: 74, property: 56 },
  ]
  return (
    <div>
      <PageHeader eyebrow="Role view · Underwriting Lead" title="Portfolio risk" sub="Where claims trends are moving, and which policies may need a pricing or wording review." />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[['Auto loss ratio', '74%', 'Up 13 pts in 6 months', 'bad'], ['Repeat claimants', '128', '12% of open claims', 'warn'], ['Suspected fraud exposure', '$1.8M', '31 claims under review', 'warn']].map(([l, v, s, t]) => (
          <Card key={l} className="p-4"><p className="text-[13px] font-medium text-ink-2">{l}</p><p className="tnum mt-1 font-display text-[32px] leading-none">{v}</p><p className="mt-2"><Badge tone={t as 'bad'}>{s}</Badge></p></Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ChartCard num="01" title="Loss ratio by line (%)" sub="Auto is trending toward the 75% review threshold" data={lossRatio} cols={[{ key: 'm', label: 'Month' }, { key: 'auto', label: 'Auto %' }, { key: 'property', label: 'Property %' }]} summary="Auto loss ratio rose from 61% to 74%; property remains stable near 56%.">
            <ResponsiveContainer width="100%" height="100%"><LineChart data={lossRatio} margin={{ left: -16, top: 8 }}><CartesianGrid stroke={C.grid} vertical={false} /><XAxis dataKey="m" {...axisProps} /><YAxis {...axisProps} domain={[40, 80]} /><Tooltip /><Legend iconType="plainline" /><Line dataKey="auto" name="Auto" stroke={C.ai} strokeWidth={2.5} dot={{ r: 3 }} /><Line dataKey="property" name="Property" stroke={C.brand} strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 3 }} /></LineChart></ResponsiveContainer>
          </ChartCard>
        </div>
        <Card className="xl:col-span-5">
          <CardHeader num="02" title="AI trend insights" action={<AIBadge />} />
          <ul className="divide-y divide-line text-[13px]">
            {['Claims within 30 days of a coverage upgrade are 2.4× more likely to be flagged. Consider a waiting-period review.', 'Denver metro auto claims show repair costs 19% above state average, driven by 3 repairers.', 'Water damage claims from policies issued before 2005 pay out 31% more on average.'].map((t) => (
              <li key={t} className="flex gap-3 p-4"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-ai" aria-hidden /><div>{t}<p className="mt-1 text-xs text-ink-3">Confidence: Medium · Correlation, not proven cause</p></div></li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ---------- Supervisor ---------- */
export function SupervisorPage() {
  const { nav } = useApp()
  const toast = useToast()
  const [pending, setPending] = useState(claims.filter((c) => c.status === 'Awaiting approval' || c.priority === 'Critical').slice(0, 3))
  return (
    <div>
      <PageHeader eyebrow="Role view · Supervisor" title="Team overview" sub="Workload, SLA risk and approvals waiting on you." />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[['SLA breaches today', '5', 'bad'], ['Approvals pending', String(pending.length), 'warn'], ['Team capacity used', '87%', 'info']].map(([l, v, t]) => (
          <Card key={l} className="p-4"><p className="text-[13px] font-medium text-ink-2">{l}</p><p className="tnum mt-1 font-display text-[32px] leading-none">{v}</p><p className="mt-2"><Badge tone={t as 'bad'}>{t === 'bad' ? 'Needs attention' : t === 'warn' ? 'Waiting on you' : 'Near limit'}</Badge></p></Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader num="01" title="Team workload" sub="Open claims vs. capacity" action={<AIBadge>Rebalance idea</AIBadge>} />
          <ul className="divide-y divide-line">
            {team.map((m) => {
              const p = Math.round((m.open / m.cap) * 100)
              return (
                <li key={m.name} className="px-5 py-3.5">
                  <div className="mb-1 flex items-center justify-between text-[13px]"><span><span className="font-semibold">{m.name}</span> <span className="text-ink-3">· {m.role}</span></span><span className="tnum">{m.open}/{m.cap}{m.breach > 0 && <Badge tone="bad">{m.breach} breach{m.breach > 1 ? 'es' : ''}</Badge>}</span></div>
                  <Meter value={Math.min(p, 100)} tone={p > 100 ? 'bad' : p > 85 ? 'warn' : 'ok'} />
                  {p > 100 && <p className="mt-1 text-xs text-bad">Over capacity by {m.open - m.cap}. AI suggests moving 2 claims to Sam Whitlock.</p>}
                </li>
              )
            })}
          </ul>
          <div className="border-t border-line p-4"><Button size="sm" onClick={() => toast('2 claims reassigned to Sam Whitlock')}>Apply suggestion</Button> <span className="ml-2 text-xs text-ink-3">You'll see a preview before anything moves.</span></div>
        </Card>
        <Card className="xl:col-span-5">
          <CardHeader num="02" title="Pending approvals" />
          {pending.length === 0 ? <p className="p-8 text-center text-sm text-ink-2">No approvals waiting. Nice work.</p> : (
            <ul className="divide-y divide-line">
              {pending.map((c) => (
                <li key={c.id} className="p-4">
                  <button onClick={() => nav('/claims/' + c.id)} className="text-left"><span className="font-mono text-[13px] text-brand">{c.id}</span> <span className="font-semibold">{c.insured}</span></button>
                  <p className="tnum text-[13px] text-ink-2">{money(c.amount)} · <Badge tone={priorityTone[c.priority]}>{c.priority}</Badge> · {c.sla}</p>
                  <div className="mt-2 flex gap-2"><Button size="sm" variant="primary" onClick={() => nav('/claims/' + c.id)}>Review and approve</Button><Button size="sm" onClick={() => (setPending(pending.filter((p) => p.id !== c.id)), toast('Snoozed until tomorrow', 'info'))}>Snooze</Button></div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
