import { useState } from 'react'
import { AIBadge, Card, PageHeader, useToast } from '../ui'
import { useApp } from '../ctx'
import { FileUploader, Icon, MButton, MCheckbox, RadioGroup, Select, TextField, type UFile } from '../material'

const steps = ['Policy & insured', 'Loss details', 'Documents', 'Review']
const types = ['Auto collision', 'Auto glass', 'Home water damage', 'Commercial property', 'Travel cancellation', 'Business interruption']

export default function NewClaim() {
  const { nav } = useApp()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState<string | null>(null)
  const [files, setFiles] = useState<UFile[]>([])
  const [f, setF] = useState({ policy: '', insured: '', phone: '', email: '', type: 'Auto collision', date: '', loc: '', amount: '', desc: '', injuries: 'no', police: false, confirm: false })
  const [err, setErr] = useState<Record<string, string>>({})
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }))

  const validate = (s: number) => {
    const e: Record<string, string> = {}
    if (s === 0) {
      if (!/^POL-\d{5,}$/i.test(f.policy)) e.policy = 'Enter a policy number like POL-204817.'
      if (f.insured.trim().length < 2) e.insured = 'Enter the insured’s full name.'
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter an email like name@example.com.'
    }
    if (s === 1) {
      if (!f.date) e.date = 'Choose the date of loss.'
      else if (new Date(f.date) > new Date()) e.date = 'Date of loss can’t be in the future.'
      if (!f.loc.trim()) e.loc = 'Where did it happen?'
      if (f.desc.trim().length < 20) e.desc = 'Describe what happened in at least a sentence (20+ characters).'
    }
    if (s === 3 && !f.confirm) e.confirm = 'Confirm the details before submitting.'
    setErr(e)
    return !Object.keys(e).length
  }
  const next = () => validate(step) && (step === 3 ? submit() : setStep(step + 1))
  const submit = () => {
    const id = 'CLM-' + (48300 + Math.floor(Math.random() * 99))
    setDone(id)
    toast(`Claim ${id} registered`)
  }
  const uploading = files.some((x) => !x.error && x.progress < 1)

  if (done)
    return (
      <div className="mx-auto max-w-xl pt-10 text-center" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok-soft text-ok"><Icon name="check_circle" /></span>
        <h1 className="mt-4 text-[28px]">Claim registered</h1>
        <p className="mt-2 text-ink-2"><span className="font-mono font-medium text-ink">{done}</span> is in triage. AI is reading {files.filter((x) => !x.error).length} document(s) and will suggest a handler and priority within a minute.</p>
        <div className="mt-6 flex justify-center gap-2">
          <MButton kind="outlined" onClick={() => nav('/claims')}>Back to queue</MButton>
          <MButton onClick={() => nav('/claims/' + done)}>Open claim</MButton>
        </div>
      </div>
    )

  return (
    <div>
      <PageHeader eyebrow="Intake · New claim" title="Register a new claim" sub="Four short steps. Your progress is kept if you leave and come back." actions={<MButton kind="text" icon="close" onClick={() => nav('/claims')}>Cancel</MButton>} />
      <ol className="mb-6 flex flex-wrap gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${i === step ? 'border-brand bg-brand text-on-brand' : i < step ? 'border-ok/40 bg-ok-soft text-ok' : 'border-line bg-surface text-ink-2'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-on-brand/20 text-[11px] font-semibold">{i < step ? '✓' : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="grid gap-5 p-6">
          {step === 0 && (
            <>
              <TextField label="Policy number" required value={f.policy} onChange={(v) => set('policy', v)} error={err.policy} hint="Found on the insured’s policy schedule" placeholder="POL-204817" />
              <TextField label="Insured name" required value={f.insured} onChange={(v) => set('insured', v)} error={err.insured} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Phone" type="tel" value={f.phone} onChange={(v) => set('phone', v)} />
                <TextField label="Email" type="email" value={f.email} onChange={(v) => set('email', v)} error={err.email} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select label="Claim type" value={f.type} onChange={(v) => set('type', v)} options={types} />
                <TextField label="Date of loss" required type="date" value={f.date} onChange={(v) => set('date', v)} error={err.date} />
              </div>
              <TextField label="Location" required value={f.loc} onChange={(v) => set('loc', v)} error={err.loc} />
              <TextField label="Estimated amount" type="number" prefix="$" value={f.amount} onChange={(v) => set('amount', v)} hint="Optional. An estimate is fine." />
              <TextField label="What happened?" required rows={4} value={f.desc} onChange={(v) => set('desc', v)} error={err.desc} />
              <RadioGroup legend="Were there any injuries?" name="inj" value={f.injuries} onChange={(v) => set('injuries', v)} options={[{ value: 'no', label: 'No injuries' }, { value: 'yes', label: 'Yes', hint: 'A bodily injury specialist will be assigned' }]} />
              <MCheckbox checked={f.police} onChange={(v) => set('police', v)}>A police report was filed</MCheckbox>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-sm text-ink-2">Add the police report, estimates or photos. Optional now, and you can add more later.</p>
              <FileUploader files={files} setFiles={setFiles} />
            </>
          )}
          {step === 3 && (
            <>
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {[['Policy', f.policy], ['Insured', f.insured], ['Type', f.type], ['Date of loss', f.date], ['Location', f.loc], ['Estimate', f.amount ? '$' + Number(f.amount).toLocaleString() : 'Not given'], ['Injuries', f.injuries === 'yes' ? 'Yes' : 'None'], ['Documents', files.filter((x) => !x.error).length + ' attached']].map(([k, v]) => (
                  <div key={k}><dt className="text-xs text-ink-3">{k}</dt><dd className="font-medium">{v || '—'}</dd></div>
                ))}
                <div className="sm:col-span-2"><dt className="text-xs text-ink-3">Description</dt><dd>{f.desc}</dd></div>
              </dl>
              <div>
                <MCheckbox checked={f.confirm} onChange={(v) => set('confirm', v)}>I confirm these details are accurate to the best of my knowledge</MCheckbox>
                {err.confirm && <p role="alert" className="ml-1 text-xs text-bad">{err.confirm}</p>}
              </div>
            </>
          )}
          <div className="flex justify-between border-t border-line pt-4">
            <MButton kind="text" icon="arrow_back" disabled={step === 0} onClick={() => (setErr({}), setStep(step - 1))}>Back</MButton>
            <MButton disabled={uploading} icon={step === 3 ? 'check' : 'arrow_forward'} trailing={step !== 3} onClick={next}>{step === 3 ? 'Submit claim' : 'Continue'}</MButton>
          </div>
        </Card>
        <aside className="ai-surface rounded-xl p-4" aria-label="AI assistance">
          <AIBadge>AI assist</AIBadge>
          <p className="mt-3 text-sm">{['Enter a policy number and we’ll check coverage and prior claims once you submit.', 'The more specific the description, the better the triage suggestion. Include who, what and where.', 'Documents are read automatically. Detected types appear next to each file for you to confirm.', 'AI will suggest a priority and handler after submission. A person always makes the final call.'][step]}</p>
        </aside>
      </div>
    </div>
  )
}
