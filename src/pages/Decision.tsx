import { useState } from 'react'
import { AlertTriangle, Lock, ShieldCheck } from '../icons'
import { explainDecision } from '../data'
import { AIBadge, Alert, Badge, Button, Card, CardHeader, Confidence, Field, Overlay, WhyThis, cx, inputCls, money, useToast } from '../ui'
import { useApp } from '../ctx'

const options = [
  { id: 'full', label: 'Approve in full', amount: 38450, sub: 'Pay the full estimate' },
  { id: 'partial', label: 'Approve partially', amount: 33150, sub: 'Excludes aftermarket upgrades', rec: true },
  { id: 'deny', label: 'Deny claim', amount: 0, sub: 'Requires written reason' },
  { id: 'refer', label: 'Refer to investigation', amount: 0, sub: 'Pauses payment' },
] as const

export function Decision() {
  const { role } = useApp()
  const toast = useToast()
  const [choice, setChoice] = useState<(typeof options)[number]['id']>('partial')
  const [reason, setReason] = useState('')
  const [ack, setAck] = useState(false)
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const opt = options.find((o) => o.id === choice)!
  const isOverride = choice !== 'partial'
  const needsSup = opt.amount > 25000
  const canApprove = role === 'Supervisor'

  const submit = () => {
    if (isOverride && reason.trim().length < 20) return setErr('Please explain your decision in at least 20 characters. This is recorded in the audit trail.')
    if (!ack) return setErr('Confirm that you have reviewed the evidence.')
    setErr('')
    setOpen(true)
  }

  if (done)
    return (
      <Alert tone="ok" title={needsSup && !canApprove ? 'Sent to Elena Marsh for approval' : 'Decision recorded'}>
        {needsSup && !canApprove ? 'Payment is on hold until a supervisor approves it. You will be notified.' : `${opt.label}${opt.amount ? ' · ' + money(opt.amount) : ''}. The audit trail has been updated.`}
      </Alert>
    )

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <Card>
        <CardHeader title="Your decision" sub="The AI recommends. You decide." />
        <div className="space-y-5 p-5">
          <div className="ai-surface rounded-lg p-4">
            <div className="mb-2 flex items-center justify-between">
              <AIBadge>Recommendation</AIBadge>
              <Confidence value={82} />
            </div>
            <p className="font-display text-xl">Approve partially for {money(33150)}</p>
            <p className="mt-1 text-[13px] text-ink-2">Aftermarket wheel upgrades ($5,300) fall outside endorsement E-14, and labour hours look high.</p>
            <div className="mt-2">
              <WhyThis explain={explainDecision} />
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold">Choose an outcome</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {options.map((o) => (
                <label key={o.id} className={cx('flex cursor-pointer gap-3 rounded-lg border p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ai', choice === o.id ? 'border-brand bg-brand-soft/50 ring-1 ring-brand' : 'border-line-strong hover:bg-paper')}>
                  <input type="radio" name="outcome" className="mt-1 accent-brand" checked={choice === o.id} onChange={() => (setChoice(o.id), setErr(''))} />
                  <span>
                    <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      {o.label}
                      {'rec' in o && <AIBadge>Suggested</AIBadge>}
                    </span>
                    <span className="block text-xs text-ink-3">
                      {o.sub}
                      {o.amount ? ` · ${money(o.amount)}` : ''}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {isOverride && (
            <div className="fade-up">
              <Alert tone="warn" title="You are choosing differently from the AI">
                That is fine. Your reason is stored with the decision for compliance and helps improve recommendations.
              </Alert>
              <div className="mt-3">
                <Field label="Reason for your decision" error={err.startsWith('Please') ? err : undefined} hint="Plain language. Visible to supervisors and auditors.">
                  {(id, d) => <textarea id={id} aria-describedby={d} aria-invalid={err.startsWith('Please')} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls + ' h-auto py-2'} />}
                </Field>
              </div>
            </div>
          )}

          {needsSup && !canApprove && (
            <Alert tone="info" title="This needs supervisor approval">
              Payments over $25,000 require a second pair of eyes. Your role ({role}) can submit, not approve.
            </Alert>
          )}

          <label className="flex items-start gap-2 text-[13px]">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand" />
            <span>I have reviewed the documents, risk factors and policy wording for this claim.</span>
          </label>
          {err && !err.startsWith('Please') && (
            <p role="alert" className="text-[13px] text-bad">
              {err}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button onClick={() => toast('Draft decision saved')}>Save draft</Button>
            <Button variant="primary" icon={needsSup && !canApprove ? <Lock size={14} /> : <ShieldCheck size={16} />} onClick={submit}>
              {needsSup && !canApprove ? 'Request approval' : 'Submit decision'}
            </Button>
          </div>
        </div>
      </Card>

      <aside className="space-y-4">
        <Card className="p-4 text-[13px]">
          <h3 className="mb-2 text-lg">Before you decide</h3>
          <ul className="space-y-2">
            <li className="flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-warn" aria-hidden />Risk is High (78). Police report verified.</li>
            <li className="flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-warn" aria-hidden />Witness details are still missing.</li>
            <li className="flex gap-2"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-ok" aria-hidden />Policy active and comprehensive cover applies.</li>
          </ul>
        </Card>
        <Card className="p-4 text-[13px]">
          <h3 className="mb-1 text-lg">Approval path</h3>
          <ol className="mt-2 space-y-2">
            <li className="flex items-center justify-between">Adjuster decision <Badge tone="brand">You</Badge></li>
            <li className="flex items-center justify-between">Supervisor approval <Badge tone={needsSup ? 'warn' : 'neutral'}>{needsSup ? 'Required' : 'Not needed'}</Badge></li>
            <li className="flex items-center justify-between">Payment release <Badge>Finance</Badge></li>
          </ol>
        </Card>
      </aside>

      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        title={`Confirm: ${opt.label}`}
        footer={
          <>
            <Button data-autofocus onClick={() => setOpen(false)}>Go back</Button>
            <Button variant={choice === 'deny' ? 'danger' : 'primary'} onClick={() => (setOpen(false), setDone(true), toast('Decision submitted'))}>
              {choice === 'deny' ? 'Yes, deny claim' : needsSup && !canApprove ? 'Send for approval' : 'Confirm decision'}
            </Button>
          </>
        }
      >
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-ink-2">Claim</dt><dd className="font-mono">CLM-48213</dd></div>
          <div className="flex justify-between"><dt className="text-ink-2">Outcome</dt><dd className="font-semibold">{opt.label}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-2">Payment</dt><dd className="tnum font-semibold">{money(opt.amount)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-2">Differs from AI</dt><dd>{isOverride ? 'Yes, reason recorded' : 'No'}</dd></div>
        </dl>
        <p className="mt-4 text-[13px] text-ink-2">{choice === 'deny' ? 'Denials cannot be undone without supervisor review. The insured will be notified in writing.' : 'This action is logged and cannot be edited afterwards.'}</p>
      </Overlay>
    </div>
  )
}
