import { useState } from 'react'
import { AlertTriangle, ArrowUpRight, CheckCircle2, Circle, Clock } from '../icons'
import { tasks as seed } from '../data'
import { AIBadge, Badge, Button, Card, Empty, Overlay, PageHeader, Segmented, priorityTone, useToast, inputCls, Tabs } from '../ui'
import { useApp } from '../ctx'
import { NewTaskDialog } from '../flows'

export default function Tasks() {
  const { nav } = useApp()
  const toast = useToast()
  const [items, setItems] = useState(seed)
  const [newOpen, setNewOpen] = useState(false)
  const [f, setF] = useState<'open' | 'mine' | 'all'>('open')
  const [modal, setModal] = useState<null | { id: string; kind: 'assign' | 'escalate' }>(null)
  const [assignee, setAssignee] = useState('Priya Raman')
  const [escalated, setEscalated] = useState<string[]>([])
  const list = items.filter((t) => (f === 'open' ? !t.done : f === 'mine' ? t.assignee === 'Priya Raman' && !t.done : true))
  const slaTone = (s: string) => (s === 'breached' || s.startsWith('breach') ? 'bad' : s === 'at risk' ? 'warn' : 'ok')

  return (
    <div>
      <PageHeader eyebrow="Work · Tasks" title="Tasks" sub="Everything waiting on someone, in order of what will hurt first if it slips." actions={<Button variant="primary" onClick={() => setNewOpen(true)}>New task</Button>} />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <Segmented label="Task filter" value={f} onChange={setF} options={[{ id: 'open', label: `Open (${items.filter((i) => !i.done).length})` }, { id: 'mine', label: 'Assigned to me' }, { id: 'all', label: 'All' }]} />
          <p className="flex items-center gap-2 text-xs text-ink-2"><AIBadge>AI order</AIBadge> Sorted by priority and SLA risk</p>
        </div>
        {list.length === 0 ? (
          <Empty icon={<CheckCircle2 size={22} />} title="You're all caught up" body="No open tasks match this view. New tasks appear here when claims move to your stage." action={<Button onClick={() => setF('all')}>Show completed tasks</Button>} />
        ) : (
          <ul>
            {list.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line/70 px-5 py-3.5 last:border-0">
                <button type="button" role="checkbox" aria-checked={t.done} aria-label={`Mark "${t.title}" ${t.done ? 'not done' : 'done'}`} onClick={() => (setItems((current) => current.map((i) => (i.id === t.id ? { ...i, done: !i.done } : i))), !t.done && toast('Task completed'))} className="rounded-full text-ink-3 hover:text-ok">
                  {t.done ? <CheckCircle2 size={22} className="text-ok" /> : <Circle size={22} />}
                </button>
                <div className="min-w-[220px] flex-1">
                  <p className={`font-semibold ${t.done ? 'text-ink-3 line-through' : ''}`}>{t.title}</p>
                  <p className="text-[13px] text-ink-2">
                    <button onClick={() => nav('/claims/' + t.claim)} className="font-mono text-brand hover:underline">{t.claim}</button> · {t.type} · {t.assignee === 'Unassigned' ? <em>Unassigned</em> : t.assignee}
                  </p>
                </div>
                <Badge tone={priorityTone[t.pri]} dot>{t.pri}</Badge>
                {escalated.includes(t.id) && <Badge tone="bad">Escalated</Badge>}
                <div className="w-36 text-[13px]">
                  <p className="flex items-center gap-1 text-ink-2"><Clock size={13} aria-hidden />{t.due}</p>
                  <Badge tone={slaTone(t.sla)}>SLA {t.sla}</Badge>
                </div>
                {!t.done && (
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => (setAssignee(t.assignee === 'Unassigned' ? 'Priya Raman' : t.assignee), setModal({ id: t.id, kind: 'assign' }))}>Assign</Button>
                    <Button size="sm" variant="ghost" icon={<ArrowUpRight size={14} />} onClick={() => setModal({ id: t.id, kind: 'escalate' })}>Escalate</Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <NewTaskDialog open={newOpen} onClose={() => setNewOpen(false)} onCreate={(t) => (setItems((s) => [t, ...s]), setF('open'), toast(`Task ${t.id} created`))} />
      <Overlay
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.kind === 'assign' ? 'Assign task' : 'Escalate task'}
        footer={<><Button onClick={() => setModal(null)}>Cancel</Button><Button variant="primary" onClick={() => {
          if (!modal) return
          if (modal.kind === 'assign') {
            setItems((current) => current.map((task) => task.id === modal.id ? { ...task, assignee } : task))
            toast(`Task assigned to ${assignee}`)
          } else {
            setItems((current) => current.map((task) => task.id === modal.id && task.sla === 'on track' ? { ...task, sla: 'at risk' } : task))
            setEscalated((current) => current.includes(modal.id) ? current : [...current, modal.id])
            toast('Task escalated to supervisor')
          }
          setModal(null)
        }}>{modal?.kind === 'assign' ? 'Assign' : 'Escalate'}</Button></>}
      >
        {modal?.kind === 'assign' ? (
          <label className="block text-[13px] font-semibold">Assign to<select data-autofocus value={assignee} onChange={(e) => setAssignee(e.target.value)} className={inputCls + ' mt-1'}>{['Priya Raman', 'Sam Whitlock', 'Daniel Okafor', 'Marcus Bell', 'Lucía Ferrer'].map((n) => <option key={n}>{n}</option>)}</select></label>
        ) : (
          <div className="flex gap-3 text-sm text-ink-2"><AlertTriangle className="shrink-0 text-warn" aria-hidden />Escalating notifies Elena Marsh and marks the task as at risk in team reports.</div>
        )}
      </Overlay>
    </div>
  )
}
