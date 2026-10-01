import { useState } from 'react'
import { Check, RotateCcw, Sparkles } from '../icons'
import { AIBadge, Alert, Badge, Button, Card, CardHeader, Confidence, Field, useToast, inputCls } from '../ui'

type F = { key: string; label: string; ai: string; conf: number; hint?: string; type?: 'text' | 'number' | 'select'; opts?: string[] }
const fields: F[] = [
  { key: 'cause', label: 'Cause of loss', ai: 'Collision with fixed object', conf: 93, type: 'select', opts: ['Collision with fixed object', 'Collision with vehicle', 'Weather', 'Theft', 'Vandalism'] },
  { key: 'liability', label: 'Liability split, insured (%)', ai: '100', conf: 78, type: 'number', hint: 'Between 0 and 100' },
  { key: 'labour', label: 'Labour hours', ai: '58', conf: 72, type: 'number', hint: 'Estimate says 64.5; benchmark is 52' },
  { key: 'parts', label: 'Parts total ($)', ai: '21400', conf: 90, type: 'number' },
  { key: 'reserve', label: 'Recommended reserve ($)', ai: '33150', conf: 82, type: 'number', hint: 'Excludes $5,300 aftermarket upgrades' },
  { key: 'notes', label: 'Assessor notes', ai: 'Front-left impact, airbag deployed, structural inspection required before repair sign-off.', conf: 85 },
]

export function Assessment() {
  const toast = useToast()
  const [vals, setVals] = useState<Record<string, string>>(Object.fromEntries(fields.map((f) => [f.key, f.ai])))
  const [state, setState] = useState<Record<string, 'ai' | 'accepted' | 'edited'>>(Object.fromEntries(fields.map((f) => [f.key, 'ai'])))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    const l = Number(vals.liability)
    if (vals.liability === '' || isNaN(l) || l < 0 || l > 100) e.liability = 'Enter a number from 0 to 100.'
    if (!vals.labour || Number(vals.labour) <= 0) e.labour = 'Labour hours are required and must be above 0.'
    if (!vals.notes.trim()) e.notes = 'Add a short note so the next person knows your reasoning.'
    setErrors(e)
    return !Object.keys(e).length
  }
  const save = () => {
    if (!validate()) return toast('Some fields need attention. See the messages below.', 'warn')
    toast('Assessment saved')
  }
  const unreviewed = Object.values(state).filter((s) => s === 'ai').length

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader
          title="Assessment"
          sub="Pre-filled from documents. Review each field, then save."
          action={
            <Button size="sm" onClick={() => (setState(Object.fromEntries(fields.map((f) => [f.key, state[f.key] === 'edited' ? 'edited' : 'accepted']))), toast('All AI values accepted'))} icon={<Check size={14} />}>
              Accept all AI values
            </Button>
          }
        />
        {Object.keys(errors).length > 0 && (
          <div className="px-5 pt-4">
            <Alert tone="bad" title={`${Object.keys(errors).length} fields need your attention`}>
              Fix the highlighted fields, then save again. Nothing was lost.
            </Alert>
          </div>
        )}
        <div className="grid gap-5 p-5 md:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.key === 'notes' ? 'md:col-span-2' : ''}>
              <Field label={f.label} hint={f.hint} error={errors[f.key]}>
                {(id, d) =>
                  f.type === 'select' ? (
                    <select id={id} aria-describedby={d} className={inputCls} value={vals[f.key]} onChange={(e) => (setVals({ ...vals, [f.key]: e.target.value }), setState({ ...state, [f.key]: 'edited' }))}>
                      {f.opts!.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : f.key === 'notes' ? (
                    <textarea id={id} aria-describedby={d} aria-invalid={!!errors[f.key]} rows={3} className={inputCls + ' h-auto py-2'} value={vals[f.key]} onChange={(e) => (setVals({ ...vals, [f.key]: e.target.value }), setState({ ...state, [f.key]: 'edited' }))} />
                  ) : (
                    <input id={id} aria-describedby={d} aria-invalid={!!errors[f.key]} inputMode="decimal" className={inputCls + ' tnum'} value={vals[f.key]} onChange={(e) => (setVals({ ...vals, [f.key]: e.target.value }), setState({ ...state, [f.key]: 'edited' }))} />
                  )
                }
              </Field>
              <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
                {state[f.key] === 'edited' ? (
                  <span className="flex items-center gap-2">
                    <Badge tone="brand">Edited by you</Badge>
                    <button className="inline-flex items-center gap-1 text-ai-deep hover:underline" onClick={() => (setVals({ ...vals, [f.key]: f.ai }), setState({ ...state, [f.key]: 'ai' }))}>
                      <RotateCcw size={11} aria-hidden /> Restore AI value
                    </button>
                  </span>
                ) : state[f.key] === 'accepted' ? (
                  <Badge tone="ok">Accepted</Badge>
                ) : (
                  <span className="flex items-center gap-2">
                    <AIBadge>AI pre-filled</AIBadge>
                    <button className="font-semibold text-ok hover:underline" onClick={() => setState({ ...state, [f.key]: 'accepted' })}>
                      Accept
                    </button>
                  </span>
                )}
                <Confidence value={f.conf} label={false} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-line bg-paper/60 px-5 py-3">
          <span className="text-[13px] text-ink-2">{unreviewed} of {fields.length} AI values not yet reviewed</span>
          <div className="flex gap-2">
            <Button onClick={() => toast('Draft saved')}>Save draft</Button>
            <Button variant="primary" onClick={save}>Save assessment</Button>
          </div>
        </div>
      </Card>

      <aside className="space-y-4">
        <Card className="ai-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg">Assessment check</h3>
            <AIBadge />
          </div>
          <ul className="space-y-2 text-[13px]">
            <li className="flex gap-2"><Sparkles size={14} className="mt-0.5 shrink-0 text-ai" aria-hidden />Labour hours are 22% above the regional benchmark of 52.</li>
            <li className="flex gap-2"><Sparkles size={14} className="mt-0.5 shrink-0 text-ai" aria-hidden />Liability is lowest-confidence (78%). Consider the witness statement once received.</li>
          </ul>
        </Card>
        <Card className="p-4 text-[13px]">
          <h3 className="mb-1 text-lg">Help the AI improve</h3>
          <p className="text-ink-2">When you edit a value, we record it as feedback. It never changes the claim record without your save.</p>
        </Card>
      </aside>
    </div>
  )
}
