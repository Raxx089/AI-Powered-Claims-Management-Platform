import { useState } from 'react'
import { Bell, CheckCheck, Sparkles } from '../icons'
import { notifications } from '../data'
import { Badge, Button, Card, CardHeader, Empty, PageHeader, Tabs, Toggle, cx, type Tone } from '../ui'

const cats = ['All', 'SLA', 'Approval', 'AI insight', 'Mention', 'System']

export default function Notifications() {
  const [items, setItems] = useState(notifications)
  const [cat, setCat] = useState('All')
  const [prefs, setPrefs] = useState<Record<string, [boolean, boolean]>>({ SLA: [true, true], Approval: [true, true], 'AI insight': [true, false], Mention: [true, false], System: [false, false] })
  const list = items.filter((n) => cat === 'All' || n.cat === cat)
  return (
    <div>
      <PageHeader eyebrow="Inbox" title="Notifications" sub="Alerts sorted by how soon you need to act." actions={<Button icon={<CheckCheck size={16} />} onClick={() => setItems(items.map((i) => ({ ...i, unread: false })))}>Mark all as read</Button>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="px-2">
            <Tabs label="Notification categories" value={cat} onChange={setCat} tabs={cats.map((c) => ({ id: c, label: c, count: c === 'All' ? items.filter((i) => i.unread).length : undefined }))} />
          </div>
          {list.length === 0 ? (
            <Empty icon={<Bell size={22} />} title="Nothing here" body="You have no notifications in this category. We'll alert you when something needs attention." />
          ) : (
            <ul>
              {list.map((n) => (
                <li key={n.id} className={cx('flex items-start gap-3 border-b border-line/70 px-5 py-4 last:border-0', n.unread && 'bg-brand-soft/30')}>
                  <span className={cx('mt-2 h-2 w-2 shrink-0 rounded-full', n.unread ? 'bg-brand' : 'bg-transparent')} aria-hidden />
                  <div className="flex-1">
                    <p className={cx('text-sm', n.unread && 'font-semibold')}>
                      {n.unread && <span className="sr-only">Unread: </span>}
                      {n.title}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-ink-3">
                      <Badge tone={n.tone as Tone}>{n.cat === 'AI insight' ? '✦ AI insight' : n.cat}</Badge>
                      {n.time}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setItems(items.map((i) => (i.id === n.id ? { ...i, unread: !i.unread } : i)))}>
                    {n.unread ? 'Mark read' : 'Mark unread'}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader title="Preferences" sub="Choose how each type reaches you" />
          <table className="w-full text-[13px]">
            <caption className="sr-only">Notification delivery preferences</caption>
            <thead><tr className="text-left text-ink-3"><th scope="col" className="px-5 py-2 font-semibold">Type</th><th scope="col" className="px-2 py-2 font-semibold">In-app</th><th scope="col" className="px-2 py-2 font-semibold">Email</th></tr></thead>
            <tbody>
              {Object.entries(prefs).map(([k, [a, b]]) => (
                <tr key={k} className="border-t border-line/70">
                  <th scope="row" className="px-5 py-3 text-left font-medium">{k === 'AI insight' && <Sparkles size={12} className="mr-1 inline text-ai" aria-hidden />}{k}</th>
                  <td className="px-2"><Toggle label={`${k} in-app`} checked={a} onChange={(v) => setPrefs({ ...prefs, [k]: [v, b] })} /></td>
                  <td className="px-2"><Toggle label={`${k} email`} checked={b} onChange={(v) => setPrefs({ ...prefs, [k]: [a, v] })} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="p-5 text-xs text-ink-3">SLA and approval alerts can't be fully disabled for regulatory reasons.</p>
        </Card>
      </div>
    </div>
  )
}
