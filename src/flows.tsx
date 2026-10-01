import { useState } from 'react'
import { claims, tasks } from './data'
import { Dialog, FileUploader, MButton, MCheckbox, Select, TextField, ChoiceChips, type UFile } from './material'

export type Task = (typeof tasks)[number]
const people = ['Priya Raman', 'Sam Whitlock', 'Daniel Okafor', 'Elena Marsh', 'Unassigned']
const claimIds = claims.map((c) => c.id)

export function NewTaskDialog({ open, onClose, onCreate, claim }: { open: boolean; onClose: () => void; onCreate: (t: Task) => void; claim?: string }) {
  const blank = { title: '', claim: claim ?? claimIds[0], type: 'Follow-up', pri: 'Medium', assignee: 'Priya Raman', due: '', notes: '', notify: true }
  const [f, setF] = useState(blank)
  const [err, setErr] = useState<{ title?: string; due?: string }>({})
  const set = <K extends keyof typeof blank>(k: K, v: (typeof blank)[K]) => setF((s) => ({ ...s, [k]: v }))
  const close = () => (setF(blank), setErr({}), onClose())
  const submit = () => {
    const e: typeof err = {}
    if (f.title.trim().length < 3) e.title = 'Give the task a short title, like “Request repair invoice”.'
    if (!f.due) e.due = 'Choose a due date so the SLA can be tracked.'
    setErr(e)
    if (Object.keys(e).length) return
    const d = new Date(f.due + 'T12:00')
    onCreate({ id: 'T-' + (2100 + Math.floor(Math.random() * 800)), title: f.title.trim(), claim: f.claim, pri: f.pri, type: f.type, assignee: f.assignee, due: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), sla: 'on track', done: false })
    close()
  }
  return (
    <Dialog open={open} onClose={close} icon="add_task" title="New task" actions={<><MButton kind="text" onClick={close}>Cancel</MButton><MButton onClick={submit}>Create task</MButton></>}>
      <TextField label="Title" required value={f.title} onChange={(v) => set('title', v)} error={err.title} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Claim" value={f.claim} onChange={(v) => set('claim', v)} options={claimIds} />
        <Select label="Type" value={f.type} onChange={(v) => set('type', v)} options={['Follow-up', 'Approval', 'Investigation', 'Inspection', 'Review']} />
        <Select label="Assign to" value={f.assignee} onChange={(v) => set('assignee', v)} options={people} />
        <TextField label="Due date" required type="date" value={f.due} onChange={(v) => set('due', v)} error={err.due} />
      </div>
      <ChoiceChips label="Priority" value={f.pri} onChange={(v) => set('pri', v)} options={['Low', 'Medium', 'High', 'Critical']} />
      <TextField label="Notes" rows={3} value={f.notes} onChange={(v) => set('notes', v)} hint="Optional. Visible to everyone on the claim." />
      <MCheckbox checked={f.notify} onChange={(v) => set('notify', v)}>Notify the assignee</MCheckbox>
    </Dialog>
  )
}

export function UploadDialog({ open, onClose, onDone, claim }: { open: boolean; onClose: () => void; onDone: (n: number, claimId: string) => void; claim?: string }) {
  const [files, setFiles] = useState<UFile[]>([])
  const [target, setTarget] = useState(claim ?? claimIds[0])
  const [auto, setAuto] = useState(true)
  const ready = files.filter((x) => !x.error && x.progress >= 1)
  const busy = files.some((x) => !x.error && x.progress < 1)
  const close = () => (setFiles([]), onClose())
  return (
    <Dialog open={open} onClose={close} icon="upload_file" title="Upload documents" actions={<><MButton kind="text" onClick={close}>Cancel</MButton><MButton disabled={!ready.length || busy} onClick={() => (onDone(ready.length, target), close())}>{busy ? 'Uploading…' : `Add ${ready.length || ''} ${ready.length === 1 ? 'document' : 'documents'}`.replace('  ', ' ')}</MButton></>}>
      <Select label="Attach to claim" value={target} onChange={setTarget} options={claimIds} />
      <FileUploader files={files} setFiles={setFiles} />
      <MCheckbox checked={auto} onChange={setAuto}>Read documents automatically and pre-fill claim fields (you review before anything is saved)</MCheckbox>
    </Dialog>
  )
}
