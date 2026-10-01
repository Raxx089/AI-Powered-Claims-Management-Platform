import { useState } from 'react'
import { AlertOctagon, ArrowLeft, Bot, Check, ChevronDown, Clock, Download, Flag, Pencil, RefreshCw, Search, ShieldAlert, ThumbsDown, ThumbsUp, User } from '../icons'
import { STAGES, audit, claims, explainRisk, explainSummary } from '../data'
import { AIBadge, Badge, Button, Card, CardHeader, Confidence, Empty, Field, Overlay, Tabs, WhyThis, cx, inputCls, money, priorityTone, statusTone, useToast, Alert } from '../ui'
import { useApp } from '../ctx'
import { DocSummaryNlp, DocWorkspace } from './DocWorkspace'
import { Assessment } from './Assessment'
import { Decision } from './Decision'

type Tab = 'overview' | 'documents' | 'assessment' | 'decision' | 'audit'

export function RiskPanel() {
  const toast = useToast()
  const [modal, setModal] = useState<null | 'investigate' | 'escalate' | 'dismiss'>(null)
  const [reason, setReason] = useState('')
  const [err, setErr] = useState('')
  const score = 78
  const R = 44,
    Cc = 2 * Math.PI * R
  const close = () => (setModal(null), setReason(''), setErr(''))
  const titles = { investigate: 'Start an investigation', escalate: 'Escalate to Special Investigations', dismiss: 'Mark risk as reviewed' }
  return (
    <Card className="border-bad/30">
      <div className="flex items-start justify-between border-b border-line px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg">
            <ShieldAlert size={18} className="text-bad" aria-hidden />
            Risk intelligence
          </h2>
          <p className="text-[13px] text-ink-3">Signals to review, not a verdict</p>
        </div>
        <AIBadge />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4">
          <svg width="104" height="104" viewBox="0 0 104 104" role="img" aria-label={`Risk score ${score} out of 100, High`}>
            <circle cx="52" cy="52" r={R} fill="none" stroke="var(--color-sunken)" strokeWidth="9" />
            <circle cx="52" cy="52" r={R} fill="none" stroke="var(--color-bad)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(score / 100) * Cc} ${Cc}`} transform="rotate(-90 52 52)" />
            <text x="52" y="53" textAnchor="middle" className="fill-ink font-display" fontSize="30">
              {score}
            </text>
            <text x="52" y="70" textAnchor="middle" fontSize="10" className="fill-ink-3">
              of 100
            </text>
          </svg>
          <div>
            <Badge tone="bad" dot>High risk</Badge>
            <div className="mt-2">
              <Confidence value={86} />
            </div>
            <div className="mt-2">
              <WhyThis explain={explainRisk} />
            </div>
          </div>
        </div>
        <h3 className="mt-5 mb-2 font-sans text-[13px] font-semibold">Top factors</h3>
        <ul className="space-y-2 text-[13px]">
          {explainRisk.factors.map((f) => (
            <li key={f.label} className="flex items-start gap-2">
              <span className={cx('mt-1 h-2 w-2 shrink-0 rounded-full', f.dir === 'up' ? 'bg-bad' : 'bg-ok')} aria-hidden />
              <span className="flex-1">{f.label}</span>
              <span className="tnum text-xs font-semibold text-ink-2">
                {f.dir === 'up' ? '+' : '−'}
                {f.weight}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-2">
          <Button variant="primary" icon={<Search size={15} />} onClick={() => setModal('investigate')}>Start investigation</Button>
          <Button icon={<Flag size={15} />} onClick={() => setModal('escalate')}>Escalate to SIU</Button>
          <Button variant="ghost" onClick={() => setModal('dismiss')}>Mark as reviewed, no action</Button>
        </div>
      </div>
      <Overlay
        open={!!modal}
        onClose={close}
        title={modal ? titles[modal] : ''}
        footer={
          <>
            <Button onClick={close}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (reason.trim().length < 10) return setErr('Add a short note (at least 10 characters) so the reason is on record.')
                toast(modal === 'dismiss' ? 'Risk marked as reviewed' : modal === 'escalate' ? 'Escalated to SIU' : 'Investigation opened')
                close()
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <Field label="Note for the record" error={err} hint="Recorded in the audit trail with your name.">
          {(id, d) => <textarea id={id} data-autofocus aria-describedby={d} aria-invalid={!!err} rows={4} value={reason} onChange={(e) => (setReason(e.target.value), setErr(''))} className={inputCls + ' h-auto py-2'} />}
        </Field>
        {modal === 'dismiss' && <p className="mt-3 text-[13px] text-ink-2">Dismissing does not delete the score. It records that you reviewed it and disagree with taking action.</p>}
      </Overlay>
    </Card>
  )
}

export function AuditList({ items = audit }: { items?: typeof audit }) {
  const icon = { human: <User size={14} />, ai: <Bot size={14} />, override: <Pencil size={14} />, system: <Clock size={14} /> }
  const tone = { human: 'bg-brand-soft text-brand', ai: 'bg-ai-soft text-ai-deep', override: 'bg-warn-soft text-warn', system: 'bg-sunken text-ink-2' }
  return (
    <ol className="relative">
      {items.map((e, i) => (
        <li key={i} className="flex gap-3 border-b border-line/70 px-5 py-3.5 last:border-0">
          <span className={cx('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', tone[e.kind as keyof typeof tone])}>{icon[e.kind as keyof typeof icon]}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{e.act}</p>
            <p className="text-[13px] text-ink-2">{e.detail}</p>
            <p className="mt-0.5 text-xs text-ink-3">
              {e.who} · {e.role}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <time className="tnum text-xs whitespace-nowrap text-ink-3">{e.t}</time>
            {e.kind === 'override' && <Badge tone="warn">Override</Badge>}
            {e.kind === 'ai' && <AIBadge>AI</AIBadge>}
          </div>
        </li>
      ))}
    </ol>
  )
}

function Summary() {
  const toast = useToast()
  const [fb, setFb] = useState<'up' | 'down' | null>(null)
  const [regen, setRegen] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const regenerate = () => {
    setRegen(true)
    setTimeout(() => (setRegen(false), toast('Summary refreshed with latest documents')), 1500)
  }
  const cite = (n: number) => (
    <sup>
      <a href="#ev" className="ml-0.5 rounded bg-ai-line/50 px-1 font-mono text-[10px] font-semibold text-ai-deep no-underline hover:bg-ai-line">
        {n}
      </a>
    </sup>
  )
  return (
    <section aria-labelledby="sum" className="ai-surface rounded-xl p-5 shadow-e1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 id="sum" className="text-xl">Claim summary</h2>
          <AIBadge />
        </div>
        <div className="flex items-center gap-3">
          <Confidence value={89} />
          <WhyThis explain={explainSummary} label="How was this written?" />
        </div>
      </div>
      {regen ? (
        <div role="status" className="mt-4 space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-11/12" />
          <div className="skeleton h-4 w-3/4" />
          <p className="text-xs text-ai-deep"><span className="pulse-dot mr-1.5 inline-block h-2 w-2 rounded-full bg-ai" />Re-reading 5 documents…</p>
        </div>
      ) : (
        <div className="mt-3 max-w-3xl space-y-2 text-[15px] leading-relaxed">
          <p>
            Marguerite Ellsworth reports a collision with a fixed object on Sep 22 at 1420 Larkspur Ave, Denver. The vehicle, a 2022 Subaru Outback, has front-left damage and airbag deployment{cite(1)}. A police report was filed the same day and matches the insured&apos;s account{cite(2)}.
          </p>
          <p>
            The repair estimate totals <strong className="tnum">$38,450</strong>, which is <strong>41% above the regional median</strong> for similar repairs{cite(3)}. Aftermarket wheels ($5,300) may not be covered under endorsement E-14{cite(4)}.
          </p>
          {showMore && (
            <p className="fade-up">
              The insured has two previous auto claims within 18 months (both closed, both paid){cite(5)}. Witness contact details were not provided; without them, liability cannot be independently confirmed.
            </p>
          )}
          <button onClick={() => setShowMore(!showMore)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-ai-deep hover:underline" aria-expanded={showMore}>
            {showMore ? 'Show less' : 'Show more'} <ChevronDown size={14} className={showMore ? 'rotate-180' : ''} aria-hidden />
          </button>
        </div>
      )}
      <div className="mt-4 rounded-lg border border-ai-line bg-surface/70 p-3">
        <p className="mb-1 text-xs font-semibold tracking-wide text-ai-deep uppercase">Suggested next steps</p>
        <ul className="grid gap-1 text-[13px] sm:grid-cols-3">
          <li className="flex gap-1.5"><Check size={14} className="mt-0.5 shrink-0 text-ai" aria-hidden />Request witness details</li>
          <li className="flex gap-1.5"><Check size={14} className="mt-0.5 shrink-0 text-ai" aria-hidden />Ask Apex to justify labour hours</li>
          <li className="flex gap-1.5"><Check size={14} className="mt-0.5 shrink-0 text-ai" aria-hidden />Review partial approval</li>
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ai-line pt-3">
        <p id="ev" className="text-xs text-ai-deep">
          <strong>Sources:</strong> 1 First notice · 2 Police report · 3 Apex estimate · 4 Policy wording · 5 Claim history
        </p>
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-ink-2">{fb ? 'Thanks for the feedback' : 'Accurate?'}</span>
          <button type="button" aria-label="Summary is accurate" aria-pressed={fb === 'up'} onClick={() => setFb('up')} className={cx('rounded p-2 hover:bg-sunken', fb === 'up' && 'bg-ok-soft text-ok')}><ThumbsUp size={15} /></button>
          <button type="button" aria-label="Summary has errors" aria-pressed={fb === 'down'} onClick={() => setFb('down')} className={cx('rounded p-2 hover:bg-sunken', fb === 'down' && 'bg-bad-soft text-bad')}><ThumbsDown size={15} /></button>
          <Button size="sm" variant="ghost" icon={<RefreshCw size={13} />} onClick={regenerate}>Regenerate</Button>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-ink-3">AI can make mistakes. It read uploaded documents only, not phone notes. Edit anything that is wrong.</p>
    </section>
  )
}

export default function ClaimDetail({ id }: { id: string }) {
  const { nav } = useApp()
  const [tab, setTab] = useState<Tab>('overview')
  const claim = claims.find((c) => c.id === id)
  const toast = useToast()

  if (!claim)
    return (
      <Card>
        <Empty icon={<AlertOctagon size={22} />} title="We couldn't find that claim" body={`No claim with ID ${id} exists, or you may not have permission to view it. Check the ID or ask your supervisor for access.`} action={<Button onClick={() => nav('/claims')}>Back to claims</Button>} />
      </Card>
    )

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-4 mb-6 border-b border-line bg-paper/95 px-4 pt-2 backdrop-blur md:-mx-8 md:px-8">
        <button onClick={() => nav('/claims')} className="mb-1 inline-flex items-center gap-1 text-[13px] text-ink-2 hover:text-ink">
          <ArrowLeft size={14} aria-hidden /> Claims queue
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[26px] leading-tight">{claim.insured}</h1>
              <span className="font-mono text-[13px] text-ink-2">{claim.id}</span>
              <Badge tone={statusTone[claim.status]}>{claim.status}</Badge>
              <Badge tone={priorityTone[claim.priority]} dot>{claim.priority}</Badge>
            </div>
            <p className="text-[13px] text-ink-2">
              {claim.type} · <span className="tnum font-semibold text-ink">{money(claim.amount)}</span> · Handler {claim.handler} ·{' '}
              <span className={claim.slaPct >= 90 ? 'font-semibold text-bad' : ''}>SLA {claim.sla}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" icon={<Download size={14} />} onClick={() => toast('Claim file export started')}>Export</Button>
            <Button size="sm" onClick={() => toast('Note added', 'info')}>Add note</Button>
            <Button size="sm" variant="primary" onClick={() => setTab('decision')}>Make decision</Button>
          </div>
        </div>
        <ol aria-label="Claim lifecycle" className="scroll-quiet my-3 flex gap-1 overflow-x-auto">
          {STAGES.map((s, i) => (
            <li key={s} aria-current={i === claim.stage ? 'step' : undefined} className={cx('flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold', i < claim.stage ? 'border-ok/30 bg-ok-soft text-ok' : i === claim.stage ? 'border-brand bg-brand text-on-brand' : 'border-line text-ink-3')}>
              {i < claim.stage && <Check size={12} aria-hidden />}
              {s}
            </li>
          ))}
        </ol>
        <Tabs
          label="Claim sections"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'documents', label: 'Documents', count: 5 },
            { id: 'assessment', label: 'Assessment' },
            { id: 'decision', label: 'Decision' },
            { id: 'audit', label: 'Audit trail' },
          ]}
        />
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'overview' && (
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              <Summary />
              <Card>
                <CardHeader num="01" title="Claim details" />
                <dl className="grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2">
                  {[
                    ['Policy', 'POL-771204 · Comprehensive'],
                    ['Loss date', 'Sep 22, 2026'],
                    ['Reported', claim.filed + ', 2026 via web portal'],
                    ['Loss location', '1420 Larkspur Ave, Denver CO'],
                    ['Deductible', '$1,000'],
                    ['Reserve', '$33,150 (AI suggested)'],
                    ['Insured contact', 'm.ellsworth@mail.com · (303) 555-0142'],
                    ['Repairer', 'Apex Collision Repair'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs font-semibold tracking-wide text-ink-3 uppercase">{k}</dt>
                      <dd className="mt-0.5 text-sm">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
              <DocSummaryNlp />
            </div>
            <div className="space-y-6 xl:col-span-4">
              <RiskPanel />
              <Card>
                <CardHeader title="Recent activity" action={<Button size="sm" variant="ghost" onClick={() => setTab('audit')}>See all</Button>} />
                <AuditList items={audit.slice(0, 3)} />
              </Card>
            </div>
          </div>
        )}
        {tab === 'documents' && (
          <div className="space-y-4">
            <DocWorkspace compact />
          </div>
        )}
        {tab === 'assessment' && <Assessment />}
        {tab === 'decision' && <Decision />}
        {tab === 'audit' && (
          <Card>
            <CardHeader title="Audit trail" sub="Every AI suggestion, human edit and override" action={<Button size="sm" icon={<Download size={14} />} onClick={() => toast('Audit export ready')}>Export</Button>} />
            <AuditList />
          </Card>
        )}
      </div>
      {tab !== 'overview' && claim.risk >= 70 && (
        <div className="mt-6">
          <Alert tone="warn" title="This claim has a High risk score">
            Review risk factors before you finalise anything.{' '}
            <button className="font-semibold underline" onClick={() => setTab('overview')}>Open risk intelligence</button>
          </Alert>
        </div>
      )}
    </div>
  )
}
