import { useState } from 'react'
import { ArrowRight, Download, Lock, Pencil, Plus, Zap } from '../icons'
import { audit, team } from '../data'
import { AIBadge, Alert, Badge, Button, Card, CardHeader, Field, PageHeader, Tabs, Toggle, cx, inputCls, useToast } from '../ui'
import { AuditList } from './Claim'
import { useApp } from '../ctx'

/* ---------- Workflow ---------- */
const nodes = [
  { t: 'Intake', d: 'Claim registered', ai: false },
  { t: 'AI triage', d: 'Score urgency and risk', ai: true },
  { t: 'Route', d: 'Match to handler by skill and capacity', ai: true },
  { t: 'Assess', d: 'Human reviews AI pre-fill', ai: false },
  { t: 'Approve', d: 'Supervisor if > $25,000', ai: false },
  { t: 'Pay', d: 'Finance releases funds', ai: false },
]
export function WorkflowPage() {
  const toast = useToast()
  const [rules, setRules] = useState([
    { id: 1, on: true, when: 'Claim value is under $1,000 and risk is under 15', then: 'Approve for straight-through payment', ai: true },
    { id: 2, on: true, when: 'Risk score is 70 or higher', then: 'Notify SIU and pause payment', ai: true },
    { id: 3, on: true, when: 'SLA is under 4 hours from breach', then: 'Alert handler and supervisor', ai: false },
    { id: 4, on: false, when: 'Document confidence is under 60%', then: 'Ask insured to re-upload', ai: true },
  ])
  return (
    <div>
      <PageHeader eyebrow="Administration · Workflow" title="Workflow automation" sub="See how a claim moves, and control which steps automation may take on its own." actions={<Button variant="primary" icon={<Plus size={16} />} onClick={() => toast('Rule builder would open', 'info')}>New rule</Button>} />
      <Card className="mb-6">
        <CardHeader num="01" title="Standard claim flow" sub="Purple steps use AI. Every AI step can be reviewed and overridden." />
        <ol className="scroll-quiet flex items-stretch gap-2 overflow-x-auto p-5">
          {nodes.map((n, i) => (
            <li key={n.t} className="flex items-center gap-2">
              <div className={cx('w-40 shrink-0 rounded-lg border p-3', n.ai ? 'ai-surface' : 'border-line-strong bg-surface')}>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-3">STEP {i + 1}{n.ai && <AIBadge>AI</AIBadge>}</p>
                <p className="mt-1 font-display text-lg leading-tight">{n.t}</p>
                <p className="mt-0.5 text-xs text-ink-2">{n.d}</p>
              </div>
              {i < nodes.length - 1 && <ArrowRight size={18} className="shrink-0 text-ink-3" aria-hidden />}
            </li>
          ))}
        </ol>
      </Card>
      <Card>
        <CardHeader num="02" title="Automation rules" sub={`${rules.filter((r) => r.on).length} active`} />
        <ul className="divide-y divide-line">
          {rules.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <Zap size={18} className={r.on ? 'text-brand' : 'text-ink-3'} aria-hidden />
              <div className="min-w-[260px] flex-1 text-sm">
                <p><strong>When</strong> {r.when}</p>
                <p><strong>Then</strong> {r.then} {r.ai && <AIBadge>Uses AI</AIBadge>}</p>
              </div>
              <Toggle label={`Rule ${r.id}: ${r.then}`} checked={r.on} onChange={(v) => (setRules(rules.map((x) => (x.id === r.id ? { ...x, on: v } : x))), toast(v ? 'Rule turned on' : 'Rule turned off'))} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

/* ---------- Compliance ---------- */
export function CompliancePage() {
  const toast = useToast()
  const [k, setK] = useState<'all' | 'ai' | 'override'>('all')
  const items = audit.filter((a) => k === 'all' || a.kind === k)
  return (
    <div>
      <PageHeader eyebrow="Compliance & Audit" title="AI decisions and oversight" sub="A complete record of what the AI suggested, what people changed, and why." actions={<Button icon={<Download size={16} />} onClick={() => toast('Audit export (CSV) prepared')}>Export audit log</Button>} />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[['AI decisions this month', '4,812'], ['Human overrides', '11.2%'], ['Overrides with reason', '100%'], ['Model version', 'v4.2']].map(([l, v]) => (
          <Card key={l} className="p-4"><p className="text-[13px] font-medium text-ink-2">{l}</p><p className="tnum mt-1 font-display text-[30px] leading-none">{v}</p></Card>
        ))}
      </div>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
          <Tabs label="Audit filter" value={k} onChange={setK} tabs={[{ id: 'all', label: 'All events' }, { id: 'ai', label: 'AI decisions' }, { id: 'override', label: 'Human overrides' }]} />
          <p className="text-xs text-ink-3">Immutable · retained 7 years</p>
        </div>
        <AuditList items={items} />
      </Card>
    </div>
  )
}

/* ---------- Settings ---------- */
export function SettingsPage() {
  const toast = useToast()
  const { role } = useApp()
  const [t, setT] = useState<'profile' | 'notifications' | 'ai' | 'rules' | 'team' | 'security'>('profile')
  const [ai, setAi] = useState({ summaries: true, prefill: true, auto: false, explain: true })
  const [level, setLevel] = useState('balanced')
  const [name, setName] = useState('Priya Raman')
  const [email, setEmail] = useState('priya.raman@claimiq')
  const [err, setErr] = useState('')
  const admin = role === 'Supervisor'
  return (
    <div>
      <PageHeader eyebrow="Administration" title="Settings" />
      <Card>
        <div className="px-3"><Tabs label="Settings sections" value={t} onChange={setT} tabs={[{ id: 'profile', label: 'Profile' }, { id: 'notifications', label: 'Notifications' }, { id: 'ai', label: 'AI preferences' }, { id: 'rules', label: 'Workflow rules' }, { id: 'team', label: 'Team' }, { id: 'security', label: 'Security' }]} /></div>
        <div role="tabpanel" id={`panel-${t}`} aria-labelledby={`tab-${t}`} className="max-w-2xl p-6">
          {t === 'profile' && (
            <div className="space-y-4">
              <Field label="Full name">{(id) => <input id={id} className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />}</Field>
              <Field label="Work email" error={err} hint="We use this for approvals and alerts.">{(id, d) => <input id={id} aria-describedby={d} aria-invalid={!!err} className={inputCls} value={email} onChange={(e) => (setEmail(e.target.value), setErr(''))} />}</Field>
              <Button variant="primary" onClick={() => (/^\S+@\S+\.\S+$/.test(email) ? toast('Profile saved') : setErr('Enter a full email address, for example name@company.com.'))}>Save profile</Button>
            </div>
          )}
          {t === 'notifications' && <p className="text-sm text-ink-2">Manage channels per alert type in the <strong>Notifications</strong> centre. Digest emails are sent at 08:00 local time.</p>}
          {t === 'ai' && (
            <div className="space-y-5">
              <Alert tone="info" title="You stay in control">These settings change what AI shows you. They never remove the ability to review or override.</Alert>
              {([['summaries', 'Show AI claim summaries'], ['prefill', 'Pre-fill assessment fields'], ['explain', 'Always show "Why this?" links'], ['auto', 'Allow straight-through approval under $1,000']] as const).map(([k, l]) => (
                <div key={k} className="flex items-center justify-between gap-4 border-b border-line pb-4"><span className="text-sm font-medium">{l}{k === 'auto' && <span className="block text-xs font-normal text-ink-3">Requires supervisor permission</span>}</span><Toggle label={l} checked={ai[k]} onChange={(v) => setAi({ ...ai, [k]: v })} /></div>
              ))}
              <fieldset><legend className="mb-2 text-[13px] font-semibold">Suggestion style</legend>
                {[['cautious', 'Cautious', 'Only show high-confidence suggestions'], ['balanced', 'Balanced', 'Show all with confidence labels'], ['proactive', 'Proactive', 'Include exploratory insights']].map(([v, l, d]) => (
                  <label key={v} className="mb-1.5 flex items-start gap-2 rounded-md border border-line p-3 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-soft/50"><input type="radio" name="lvl" checked={level === v} onChange={() => setLevel(v)} className="mt-1 accent-brand" /><span><strong>{l}</strong><span className="block text-xs text-ink-2">{d}</span></span></label>
                ))}
              </fieldset>
              <Button variant="primary" onClick={() => toast('AI preferences saved')}>Save preferences</Button>
            </div>
          )}
          {t === 'rules' && <p className="text-sm text-ink-2">Rules are managed in <strong>Workflow</strong>. Changes to automated approval rules need supervisor permission.</p>}
          {t === 'team' && (
            admin ? (
              <table className="w-full text-[13px]"><caption className="sr-only">Team members</caption><thead><tr className="border-b border-line text-left text-ink-3"><th scope="col" className="py-2 font-semibold">Name</th><th scope="col" className="py-2 font-semibold">Role</th><th scope="col" className="py-2"><span className="sr-only">Actions</span></th></tr></thead><tbody>{team.map((m) => <tr key={m.name} className="border-b border-line/70"><td className="py-2.5 font-medium">{m.name}</td><td>{m.role}</td><td className="text-right"><Button size="sm" variant="ghost" icon={<Pencil size={12} />} onClick={() => toast('Role editor would open', 'info')}>Edit</Button></td></tr>)}</tbody></table>
            ) : (
              <Alert tone="warn" title="Only supervisors can manage the team"><span className="flex items-center gap-1"><Lock size={12} aria-hidden /> You are signed in as {role}.</span> Switch to Supervisor in the top bar to preview this screen, or ask Elena Marsh for access.</Alert>
            )
          )}
          {t === 'security' && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-line p-4"><span><strong>Two-step verification</strong><span className="block text-xs text-ink-2">Authenticator app is on</span></span><Badge tone="ok">On</Badge></div>
              <div className="flex items-center justify-between rounded-lg border border-line p-4"><span><strong>Active sessions</strong><span className="block text-xs text-ink-2">2 devices · Denver, US</span></span><Button size="sm" onClick={() => toast('Signed out of other sessions')}>Sign out others</Button></div>
              <p className="text-xs text-ink-3">Claim data is encrypted at rest. Access to personal data is logged.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

