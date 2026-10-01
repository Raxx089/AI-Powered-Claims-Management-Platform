import { useState } from 'react'
import { CloudOff, FileSearch, Lock, RefreshCw, ShieldOff } from '../icons'
import { AIBadge, Alert, Badge, Button, Card, CardHeader, Confidence, Empty, Field, Meter, PageHeader, Skeleton, Tabs, Toggle, WhyThis, inputCls, type Tone } from '../ui'
import { explainRisk } from '../data'

const colors: [string, string, string][] = [
  ['paper', '#f7f2fa', 'Page ground'], ['surface', '#fdf8fd', 'Cards, inputs'], ['sunken', '#e8e1ea', 'Wells, tracks'], ['ink', '#1c1b1f', 'On-surface text'], ['ink-2', '#49454f', 'Secondary text'], ['ink-3', '#625d67', 'Captions'],
  ['brand', '#6750a4', 'Primary actions'], ['brand-soft', '#eaddff', 'Primary container'], ['secondary', '#625b71', 'Secondary actions'], ['tertiary', '#7d5260', 'Expressive accent'], ['ai', '#7654c8', 'AI accent'], ['ai-soft', '#f1edfa', 'AI surface'],
  ['ok', '#386a20', 'Success'], ['warn', '#7a5900', 'Caution'], ['bad', '#ba1a1a', 'Error, critical'], ['info', '#386a9b', 'Information'],
]

function Sec({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader num={n} title={title} />
      <div className="p-5">{children}</div>
    </Card>
  )
}

export default function System() {
  const [t, setT] = useState<'foundations' | 'components' | 'ai' | 'states'>('foundations')
  const [on, setOn] = useState(true)
  const [retry, setRetry] = useState(false)
  return (
    <div>
      <PageHeader eyebrow="Material 3 · expressive system" title="CLAIMIQ design system" sub="Material 3 foundations, expressive components, and Google Material Symbols. Tuned for clear claim workflows, accessible contrast, and responsive enterprise use." />
      <Card className="mb-6 px-3">
        <Tabs label="Design system sections" value={t} onChange={setT} tabs={[{ id: 'foundations', label: 'Foundations' }, { id: 'components', label: 'Components' }, { id: 'ai', label: 'AI language' }, { id: 'states', label: 'States' }]} />
      </Card>
      <div role="tabpanel" id={`panel-${t}`} aria-labelledby={`tab-${t}`} className="space-y-6">
        {t === 'foundations' && (
          <>
            <Sec n="01" title="Color tokens">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {colors.map(([n, h, u]) => (
                  <div key={n}>
                    <div className="h-14 rounded-md border border-line" style={{ background: h }} />
                    <p className="mt-1 font-mono text-xs font-medium">--color-{n}</p>
                    <p className="font-mono text-[11px] text-ink-3">{h}</p>
                    <p className="text-[11px] text-ink-2">{u}</p>
                  </div>
                ))}
              </div>
            </Sec>
            <div className="grid gap-6 lg:grid-cols-2">
              <Sec n="02" title="Typography">
                <div className="space-y-3">
                  {[['Display 34', 'font-display text-[34px] leading-none', 'Google Sans 500'], ['Heading 26', 'font-display text-[26px] leading-tight', 'Google Sans 500'], ['Title 18', 'font-display text-lg', 'Google Sans 500'], ['Body 14 / 20', 'text-sm', 'Google Sans 400'], ['Label 13', 'text-[13px] font-semibold', 'Google Sans 600'], ['CLM-48213', 'font-mono text-[13px]', 'Google Sans 400']].map(([s, c, f]) => (
                    <div key={s} className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-2"><span className={c}>{s}</span><span className="font-mono text-[11px] text-ink-3">{f}</span></div>
                  ))}
                </div>
              </Sec>
              <div className="space-y-6">
                <Sec n="03" title="Spacing · 8px scale">
                  <div className="flex items-end gap-3">
                    {[4, 8, 16, 24, 32, 48].map((s) => (
                      <div key={s} className="text-center"><div className="bg-brand" style={{ width: s, height: s }} /><p className="mt-1 font-mono text-[11px]">{s}</p></div>
                    ))}
                  </div>
                </Sec>
                <Sec n="04" title="Elevation">
                  <div className="flex gap-4">
                    {['e1', 'e2', 'e3'].map((e) => (
                      <div key={e} className="flex h-16 flex-1 items-center justify-center rounded-lg bg-surface font-mono text-xs" style={{ boxShadow: `var(--shadow-${e})` }}>{e}</div>
                    ))}
                  </div>
                </Sec>
              </div>
            </div>
            <Sec n="05" title="Responsive grid">
              {[['Desktop ≥1024', 12], ['Tablet 640-1023', 8], ['Mobile <640', 4]].map(([l, n]) => (
                <div key={l as string} className="mb-3 last:mb-0"><p className="mb-1 text-xs font-semibold">{l} · {n} columns · gutter {n === 12 ? 24 : n === 8 ? 16 : 16}px</p>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>{Array.from({ length: n as number }).map((_, i) => <div key={i} className="h-6 rounded-sm bg-brand-soft" />)}</div></div>
              ))}
            </Sec>
          </>
        )}
        {t === 'components' && (
          <>
            <Sec n="01" title="Buttons">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button><Button>Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button><Button variant="ai">AI action</Button><Button variant="primary" disabled>Disabled</Button><Button size="sm">Small</Button>
              </div>
            </Sec>
            <div className="grid gap-6 lg:grid-cols-2">
              <Sec n="02" title="Inputs">
                <div className="space-y-4">
                  <Field label="Default" hint="Helper text">{(id, d) => <input id={id} aria-describedby={d} className={inputCls} placeholder="Claim reference" />}</Field>
                  <Field label="Error" error="Enter a valid claim ID, like CLM-48213.">{(id, d) => <input id={id} aria-describedby={d} aria-invalid className={inputCls} defaultValue="48213" />}</Field>
                  <div className="flex items-center gap-3 text-sm"><Toggle label="Sample toggle" checked={on} onChange={setOn} /> Toggle {on ? 'on' : 'off'}</div>
                </div>
              </Sec>
              <Sec n="03" title="Badges & claim components">
                <div className="flex flex-wrap gap-2">
                  {(['neutral', 'ok', 'warn', 'bad', 'info', 'brand'] as Tone[]).map((x) => <Badge key={x} tone={x} dot>{x}</Badge>)}
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm"><Badge tone="bad" dot>Critical</Badge> Priority <Badge tone="warn">SLA 2h left</Badge> SLA</div>
                  <div><p className="mb-1 text-xs text-ink-2">Progress meter</p><Meter value={68} tone="ok" /></div>
                </div>
              </Sec>
            </div>
          </>
        )}
        {t === 'ai' && (
          <>
            <Sec n="01" title="The AI visual language">
              <ul className="grid gap-4 text-[13px] sm:grid-cols-3">
                <li><strong className="block text-sm">Distinct AI accent</strong>AI panels use a brighter violet accent over a clearly differentiated surface.</li>
                <li><strong className="block text-sm">Always labelled</strong>A Material sparkle symbol and badge mark AI output. Colour alone never carries the meaning.</li>
                <li><strong className="block text-sm">Always challengeable</strong>Every AI output shows confidence, a &ldquo;Why this?&rdquo; link, and a way to edit or reject.</li>
              </ul>
            </Sec>
            <div className="grid gap-6 lg:grid-cols-2">
              <Sec n="02" title="Indicators">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3"><AIBadge /><AIBadge>Suggested</AIBadge><AIBadge>AI pre-filled</AIBadge></div>
                  <div className="space-y-2"><Confidence value={94} /><Confidence value={72} /><Confidence value={48} /></div>
                  <WhyThis explain={explainRisk} />
                </div>
              </Sec>
              <Sec n="03" title="AI surface & processing">
                <div className="ai-surface rounded-lg p-4"><AIBadge /><p className="mt-2 text-sm">AI panels use a soft violet wash and a violet hairline.</p></div>
                <p role="status" className="mt-4 flex items-center gap-2 text-sm text-ai-deep"><span className="pulse-dot h-2 w-2 rounded-full bg-ai" />Analysing 5 documents…</p>
              </Sec>
            </div>
          </>
        )}
        {t === 'states' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader num="01" title="Empty state" /><Empty icon={<FileSearch size={22} />} title="No documents yet" body="Upload a police report, estimate or photos. We'll read them and pre-fill the claim for you." action={<Button variant="primary">Upload documents</Button>} /></Card>
            <Card>
              <CardHeader num="02" title="Error state" />
              <div className="space-y-3 p-5">
                <Alert tone="bad" title="We couldn't load the policy record" action={<Button size="sm" icon={<RefreshCw size={13} className={retry ? 'animate-spin' : ''} />} onClick={() => (setRetry(true), setTimeout(() => setRetry(false), 1500))}>{retry ? 'Trying again…' : 'Try again'}</Button>}>
                  The policy system didn&apos;t respond (code PS-504). Your work is saved. Claim data below may be out of date as of 09:41.
                </Alert>
                <Alert tone="warn" title="AI summary unavailable"><span className="flex items-center gap-1"><CloudOff size={13} aria-hidden /></span>You can continue manually. We&apos;ll add the summary when the service is back.</Alert>
              </div>
            </Card>
            <Card>
              <CardHeader num="03" title="Loading state" />
              <div className="space-y-3 p-5" role="status" aria-label="Loading claim">
                <Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><Skeleton className="h-20 w-full" />
                <p className="text-xs text-ai-deep"><span className="pulse-dot mr-1.5 inline-block h-2 w-2 rounded-full bg-ai" />AI is preparing the summary. This usually takes 5 seconds.</p>
              </div>
            </Card>
            <Card>
              <CardHeader num="04" title="Permission state" />
              <Empty icon={<ShieldOff size={22} />} title="You can't approve this payment" body="Payments over $25,000 need a supervisor. You can send it for approval instead." action={<Button icon={<Lock size={14} />}>Request approval</Button>} />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
