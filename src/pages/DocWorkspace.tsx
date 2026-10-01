import { useState } from 'react'
import { AlertTriangle, Check, FileText, Image as Img, Pencil, ScanText, X } from '../icons'
import { docs, extracted } from '../data'
import { AIBadge, Badge, Button, Card, CardHeader, Confidence, Skeleton, useToast, inputCls } from '../ui'

const boxes: Record<string, { top: string; left: string; w: string }> = {
  'Incident date': { top: '18%', left: '12%', w: '38%' },
  Location: { top: '26%', left: '12%', w: '52%' },
  Vehicle: { top: '36%', left: '12%', w: '58%' },
  'Total estimate': { top: '72%', left: '52%', w: '34%' },
  'Labour hours': { top: '58%', left: '12%', w: '28%' },
  'Parts supplier': { top: '48%', left: '12%', w: '46%' },
}

export function DocWorkspace({ compact }: { compact?: boolean }) {
  const toast = useToast()
  const [sel, setSel] = useState(docs[1].id)
  const [active, setActive] = useState<string | null>('Labour hours')
  const [vals, setVals] = useState<Record<string, string>>(Object.fromEntries(extracted.map((e) => [e.k, e.v])))
  const [confirmed, setConfirmed] = useState<string[]>(['Incident date', 'Location', 'Vehicle', 'Total estimate'])
  const [editing, setEditing] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const doc = docs.find((d) => d.id === sel)!

  const rescan = () => {
    setScanning(true)
    setTimeout(() => (setScanning(false), toast('Re-read complete. 2 fields updated.')), 1600)
  }

  return (
    <div className={`grid gap-4 ${compact ? 'xl:grid-cols-[200px_1fr_320px]' : 'lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_340px]'}`}>
      <Card>
        <CardHeader title="Documents" sub={`${docs.length} files`} />
        <ul>
          {docs.map((d) => (
            <li key={d.id}>
              <button
                onClick={() => setSel(d.id)}
                aria-current={sel === d.id}
                className={`flex w-full items-start gap-2.5 border-b border-line/70 px-4 py-3 text-left hover:bg-paper/70 ${sel === d.id ? 'bg-brand-soft/60' : ''}`}
              >
                {d.name.endsWith('zip') || d.name.endsWith('jpg') ? <Img size={16} className="mt-0.5 text-ink-3" aria-hidden /> : <FileText size={16} className="mt-0.5 text-ink-3" aria-hidden />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">{d.kind}</span>
                  <span className="block truncate font-mono text-[11px] text-ink-3">{d.name}</span>
                  <span className="mt-1 flex items-center gap-1.5">
                    <Badge tone={d.status === 'Processed' ? 'ok' : 'warn'}>{d.status}</Badge>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="text-[13px] font-semibold">{doc.kind}</p>
            <p className="font-mono text-[11px] text-ink-3">
              {doc.name} · {doc.pages} pages
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge>OCR + NLP</AIBadge>
            <Button size="sm" icon={<ScanText size={14} />} onClick={rescan} disabled={scanning}>
              {scanning ? 'Reading…' : 'Re-read'}
            </Button>
          </div>
        </div>
        <div className="bg-sunken p-4">
          <div className="relative mx-auto aspect-[8.5/11] max-w-md rounded bg-white p-6 shadow-e2">
            {scanning ? (
              <div className="space-y-3" role="status" aria-label="Reading document">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-3" />
                ))}
                <p className="pt-2 text-center text-xs text-ai-deep">
                  <span className="pulse-dot mr-1.5 inline-block h-2 w-2 rounded-full bg-ai" />
                  Reading page 2 of {doc.pages}…
                </p>
              </div>
            ) : (
              <>
                <p className="font-display text-lg">Apex Collision Repair</p>
                <p className="text-[11px] text-ink-3">Estimate #AC-90417 · Sep 23, 2026</p>
                <div className="mt-4 space-y-2.5 text-[11px] text-ink-3" aria-hidden>
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="h-1.5 rounded bg-sunken" style={{ width: `${55 + ((i * 37) % 40)}%` }} />
                  ))}
                </div>
                {extracted.map((e) => {
                  const b = boxes[e.k]
                  const on = active === e.k
                  return (
                    <button
                      key={e.k}
                      onClick={() => setActive(e.k)}
                      aria-label={`Highlight ${e.k}`}
                      className={`absolute h-6 rounded-sm border-2 transition ${on ? 'border-ai bg-ai/20' : e.c < 75 ? 'border-warn/70 bg-warn/10' : 'border-ai-line bg-ai/5 hover:bg-ai/15'}`}
                      style={{ top: b.top, left: b.left, width: b.w }}
                    />
                  )
                })}
              </>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-ink-2">Select a highlight to see what the AI read. Amber boxes need a human check.</p>
        </div>
      </Card>

      <Card className="lg:col-span-2 xl:col-span-1">
        <CardHeader title="Extracted information" sub="Confirm or correct each field" action={<AIBadge />} />
        <ul>
          {extracted.map((e) => {
            const done = confirmed.includes(e.k)
            const low = e.c < 75
            return (
              <li key={e.k} className={`border-b border-line/70 px-4 py-3 ${active === e.k ? 'bg-ai-soft/60' : ''}`}>
                <button onClick={() => setActive(e.k)} className="flex w-full items-center justify-between text-left">
                  <span className="text-xs font-semibold tracking-wide text-ink-3 uppercase">{e.k}</span>
                  <Confidence value={e.c} label={false} />
                </button>
                {editing === e.k ? (
                  <div className="mt-1.5 flex gap-1.5">
                    <input data-autofocus aria-label={e.k} className={inputCls + ' h-8'} value={vals[e.k]} onChange={(x) => setVals({ ...vals, [e.k]: x.target.value })} />
                    <Button size="sm" variant="primary" aria-label="Save" onClick={() => (setEditing(null), setConfirmed([...confirmed, e.k]), toast(`${e.k} updated. Your correction helps the AI learn.`))}>
                      <Check size={14} />
                    </Button>
                  </div>
                ) : (
                  <p className="mt-1 flex items-center justify-between gap-2 text-sm font-medium">
                    {vals[e.k]}
                    <span className="flex shrink-0 items-center gap-1">
                      {done ? (
                        <Badge tone="ok">Confirmed</Badge>
                      ) : (
                        <button onClick={() => setConfirmed([...confirmed, e.k])} className="rounded p-1 text-ok hover:bg-ok-soft" aria-label={`Confirm ${e.k}`} title="Confirm">
                          <Check size={16} />
                        </button>
                      )}
                      <button onClick={() => setEditing(e.k)} className="rounded p-1 text-ink-2 hover:bg-sunken" aria-label={`Edit ${e.k}`} title="Edit">
                        <Pencil size={14} />
                      </button>
                    </span>
                  </p>
                )}
                {low && !done && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-warn">
                    <AlertTriangle size={12} aria-hidden /> Text is faint on the scan. Please check it against the document.
                  </p>
                )}
              </li>
            )
          })}
        </ul>
        <div className="flex items-center justify-between p-4 text-xs text-ink-3">
          <span>
            {confirmed.length} of {extracted.length} confirmed
          </span>
          <Button size="sm" onClick={() => (setConfirmed(extracted.map((e) => e.k)), toast('All fields confirmed'))}>
            Confirm all
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function DocSummaryNlp() {
  return (
    <Card className="ai-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg">Document insights</h3>
        <AIBadge>NLP</AIBadge>
      </div>
      <ul className="space-y-1.5 text-[13px]">
        <li className="flex gap-2"><X size={14} className="mt-0.5 shrink-0 text-bad" aria-hidden />Medical note scan is too blurry to read (58%). Ask the insured to re-upload.</li>
        <li className="flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-warn" aria-hidden />Labour hours on the estimate (64.5) differ from the summary line (58).</li>
        <li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-ok" aria-hidden />Police report date and location match the first notice of loss.</li>
      </ul>
    </Card>
  )
}
