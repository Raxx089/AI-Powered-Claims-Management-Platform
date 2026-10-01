import { useState, type ReactNode } from 'react'
import { Card, CardHeader, Segmented } from './ui'
import { BarChart3, Table2 } from './icons'

export const C = {
  brand: 'var(--color-brand)',
  ai: 'var(--color-ai)',
  ochre: 'var(--color-warn)',
  teal: 'var(--color-info)',
  grid: 'var(--color-line)',
  ink: 'var(--color-ink-2)',
}

export const axisProps = { tick: { fill: C.ink, fontSize: 12 }, axisLine: { stroke: C.grid }, tickLine: false as const }

export function ChartCard({
  title,
  sub,
  num,
  data,
  cols,
  children,
  summary,
  height = 240,
}: {
  title: string
  sub?: string
  num?: string
  data: Record<string, string | number>[]
  cols: { key: string; label: string }[]
  children: ReactNode
  summary: string
  height?: number
}) {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  return (
    <Card>
      <CardHeader
        num={num}
        title={title}
        sub={sub}
        action={
          <Segmented
            label={`${title} view`}
            value={view}
            onChange={setView}
            options={[
              { id: 'chart', label: 'Chart', icon: <BarChart3 size={14} aria-hidden /> },
              { id: 'table', label: 'Table', icon: <Table2 size={14} aria-hidden /> },
            ]}
          />
        }
      />
      <div className="p-5">
        {view === 'chart' ? (
          <div role="img" aria-label={`${title}. ${summary}`} style={{ height }}>
            {children}
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ maxHeight: height }}>
            <table className="w-full text-left text-[13px]">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr className="border-b border-line text-ink-3">
                  {cols.map((c) => (
                    <th key={c.key} scope="col" className="py-1.5 pr-4 font-semibold">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((r, i) => (
                  <tr key={i} className="border-b border-line/60">
                    {cols.map((c) => (
                      <td key={c.key} className="tnum py-1.5 pr-4">
                        {r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-ink-3">{summary}</p>
      </div>
    </Card>
  )
}

export function Spark({ data, color = C.brand }: { data: number[]; color?: string }) {
  const max = Math.max(...data),
    min = Math.min(...data)
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 80},${24 - ((d - min) / (max - min || 1)) * 22 - 1}`).join(' ')
  return (
    <svg width="80" height="24" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
