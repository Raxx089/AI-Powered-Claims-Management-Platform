import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import '@material/web/button/filled-button.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/button/text-button.js'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/select/outlined-select.js'
import '@material/web/select/select-option.js'
import '@material/web/dialog/dialog.js'
import '@material/web/chips/chip-set.js'
import '@material/web/chips/filter-chip.js'
import '@material/web/checkbox/checkbox.js'
import '@material/web/radio/radio.js'
import '@material/web/switch/switch.js'
import '@material/web/progress/linear-progress.js'
import '@material/web/progress/circular-progress.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/divider/divider.js'

type E = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'md-filled-button': E
      'md-filled-tonal-button': E
      'md-outlined-button': E
      'md-text-button': E
      'md-outlined-text-field': E
      'md-outlined-select': E
      'md-select-option': E
      'md-dialog': E
      'md-chip-set': E
      'md-filter-chip': E
      'md-checkbox': E
      'md-radio': E
      'md-switch': E
      'md-linear-progress': E
      'md-circular-progress': E
      'md-icon-button': E
      'md-divider': E
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function useEv(ref: React.RefObject<any>, type: string, fn: (e: Event) => void) {
  const f = useRef(fn)
  f.current = fn
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const h = (e: Event) => f.current(e)
    el.addEventListener(type, h)
    return () => el.removeEventListener(type, h)
  }, [ref, type])
}

export const Icon = ({ name, slot }: { name: string; slot?: string }) => (
  <span className="msym" slot={slot} aria-hidden="true">
    {name}
  </span>
)

/* ---------- Buttons ---------- */
export function MButton({ kind = 'filled', icon, children, onClick, disabled, trailing }: { kind?: 'filled' | 'tonal' | 'outlined' | 'text'; icon?: string; children: ReactNode; onClick?: () => void; disabled?: boolean; trailing?: boolean }) {
  const appearance = {
    filled: 'border-transparent bg-brand text-on-brand shadow-e1 hover:bg-brand-2 hover:shadow-e2',
    tonal: 'border-transparent bg-brand-soft text-brand-2 hover:bg-secondary-soft',
    outlined: 'border-line-strong bg-transparent text-brand hover:bg-brand-soft/60',
    text: 'border-transparent bg-transparent text-brand hover:bg-brand-soft/60',
  }[kind]
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium leading-5 transition-[background-color,box-shadow,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${appearance}`}>
      {icon && !trailing && <Icon name={icon} />}
      {children}
      {icon && trailing && <Icon name={icon} />}
    </button>
  )
}

export function MIconButton({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-sunken">
      <Icon name={icon} />
    </button>
  )
}

/* ---------- Text field ---------- */
export function TextField({ label, value, onChange, error, hint, type = 'text', rows, required, placeholder, max, prefix }: { label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string; type?: string; rows?: number; required?: boolean; placeholder?: string; max?: string; prefix?: string }) {
  const ref = useRef<any>(null)
  useEv(ref, 'input', () => onChange(ref.current.value))
  return (
    <md-outlined-text-field
      ref={ref}
      label={required ? `${label} *` : label}
      value={value}
      type={rows ? 'textarea' : type}
      rows={rows}
      error={!!error}
      error-text={error ?? ''}
      supporting-text={hint ?? ''}
      placeholder={placeholder}
      max={max}
      prefix-text={prefix}
    />
  )
}

export function Select({ label, value, onChange, options, error, hint }: { label: string; value: string; onChange: (v: string) => void; options: string[] | { value: string; label: string }[]; error?: string; hint?: string }) {
  const ref = useRef<any>(null)
  useEv(ref, 'change', () => onChange(ref.current.value))
  const opts = (options as any[]).map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <md-outlined-select ref={ref} label={label} value={value} error={!!error} error-text={error ?? ''} supporting-text={hint ?? ''}>
      {opts.map((o) => (
        <md-select-option key={o.value} value={o.value}>
          <div slot="headline">{o.label}</div>
        </md-select-option>
      ))}
    </md-outlined-select>
  )
}

/* ---------- Selection controls ---------- */
export function MCheckbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  const ref = useRef<any>(null)
  const id = useId()
  useEv(ref, 'change', () => onChange(ref.current.checked))
  return (
    <div className="flex items-start gap-3">
      <md-checkbox ref={ref} id={id} checked={checked} aria-labelledby={id + 'l'} />
      <label id={id + 'l'} htmlFor={id} className="cursor-pointer pt-3 text-sm">
        {children}
      </label>
    </div>
  )
}

export function MSwitch({ selected, onChange, label, hint }: { selected: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  const ref = useRef<any>(null)
  const id = useId()
  useEv(ref, 'change', () => onChange(ref.current.selected))
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="cursor-pointer text-sm">
        <span className="block font-medium">{label}</span>
        {hint && <span className="block text-xs text-ink-2">{hint}</span>}
      </label>
      <md-switch ref={ref} id={id} selected={selected} />
    </div>
  )
}

export function RadioGroup({ name, value, onChange, options, legend }: { name: string; value: string; onChange: (v: string) => void; options: { value: string; label: string; hint?: string }[]; legend: string }) {
  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium">{legend}</legend>
      <div className="flex flex-col">
        {options.map((o) => (
          <Radio key={o.value} name={name} checked={value === o.value} onSelect={() => onChange(o.value)} label={o.label} hint={o.hint} />
        ))}
      </div>
    </fieldset>
  )
}
function Radio({ name, checked, onSelect, label, hint }: { name: string; checked: boolean; onSelect: () => void; label: string; hint?: string }) {
  const ref = useRef<any>(null)
  const id = useId()
  useEv(ref, 'change', () => ref.current.checked && onSelect())
  return (
    <div className="flex items-start gap-3">
      <md-radio ref={ref} id={id} name={name} checked={checked} aria-label={label} />
      <label htmlFor={id} className="cursor-pointer py-3 text-sm">
        {label}
        {hint && <span className="block text-xs text-ink-2">{hint}</span>}
      </label>
    </div>
  )
}

export function ChoiceChips({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const refs = useRef<any[]>([])
  const sync = useCallback(() => refs.current.forEach((el, i) => el && (el.selected = options[i] === value)), [options, value])
  useEffect(sync, [sync])
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <md-chip-set>
        {options.map((o, i) => (
          <md-filter-chip
            key={o}
            ref={(el: any) => (refs.current[i] = el)}
            label={o}
            selected={o === value}
            onClick={() => {
              onChange(o)
              requestAnimationFrame(sync)
            }}
          />
        ))}
      </md-chip-set>
    </div>
  )
}

/* ---------- Dialog ---------- */
export function Dialog({ open, onClose, title, icon, children, actions, wide }: { open: boolean; onClose: () => void; title: string; icon?: string; children: ReactNode; actions: ReactNode; wide?: boolean }) {
  const ref = useRef<any>(null)
  const closeRef = useRef(onClose)
  const titleId = useId()
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const dialog = ref.current as HTMLDivElement | null
    if (!dialog) return
    const selector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => (dialog.querySelector<HTMLElement>('[data-autofocus]') ?? dialog.querySelector<HTMLElement>(selector) ?? dialog).focus())
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...dialog.querySelectorAll<HTMLElement>(selector)].filter((element) => element.getClientRects().length > 0)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previous?.isConnected) previous.focus()
    }
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default bg-ink/50 backdrop-blur-[2px]" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`relative flex max-h-[calc(100dvh-2rem)] w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} flex-col overflow-hidden rounded-[28px] border border-line/70 bg-surface text-ink shadow-e3 sm:max-h-[calc(100dvh-3rem)]`}>
        <header className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
          {icon && <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon name={icon} /></span>}
          <h2 id={titleId} className="min-w-0 flex-1 font-display text-xl font-medium">{title}</h2>
          <MIconButton icon="close" label="Close dialog" onClick={onClose} />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-5">{children}</div>
        </div>
        <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-line bg-surface-container-low px-5 py-4 sm:px-6">{actions}</footer>
      </div>
    </div>
  )
}

/* ---------- File uploader ---------- */
export type UFile = { id: number; name: string; size: number; progress: number; error?: string; kind?: string }
const ACCEPT = /\.(pdf|jpe?g|png|zip|docx?)$/i
const guess = (n: string) => (/police/i.test(n) ? 'Police report' : /estimate|quote|invoice/i.test(n) ? 'Repair estimate' : /policy/i.test(n) ? 'Policy schedule' : /\.(jpe?g|png)$/i.test(n) ? 'Photo' : /medical|note/i.test(n) ? 'Medical note' : 'Supporting document')
const fmt = (b: number) => (b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB')

export function FileUploader({ files, setFiles }: { files: UFile[]; setFiles: React.Dispatch<React.SetStateAction<UFile[]>> }) {
  const inp = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearInterval), [])

  const add = (list: FileList | File[]) => {
    const next: UFile[] = [...list].map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: f.size,
      progress: 0,
      error: !ACCEPT.test(f.name) ? 'This file type isn’t supported. Use PDF, JPG, PNG, DOC or ZIP.' : f.size > 25e6 ? 'This file is over 25 MB. Compress it or split it into parts.' : undefined,
    }))
    setFiles((s) => [...s, ...next])
    next
      .filter((f) => !f.error)
      .forEach((f) => {
        const t = window.setInterval(() => {
          setFiles((s) =>
            s.map((x) => {
              if (x.id !== f.id) return x
              const p = Math.min(1, x.progress + 0.12 + Math.random() * 0.15)
              if (p >= 1) clearInterval(t)
              return { ...x, progress: p, kind: p >= 1 ? guess(x.name) : undefined }
            }),
          )
        }, 260)
        timers.current.push(t)
      })
  }

  return (
    <div>
      <div
        onDragOver={(e) => (e.preventDefault(), setDrag(true))}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => (e.preventDefault(), setDrag(false), add(e.dataTransfer.files))}
        className={`flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${drag ? 'border-brand bg-brand-soft' : 'border-line-strong bg-paper'}`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Icon name="upload_file" />
        </span>
        <p className="text-sm font-medium">Drag files here, or browse</p>
        <p className="text-xs text-ink-2">PDF, JPG, PNG, DOC or ZIP · up to 25 MB each</p>
        <MButton kind="tonal" icon="folder_open" onClick={() => inp.current?.click()}>
          Browse files
        </MButton>
        <input ref={inp} type="file" multiple hidden aria-label="Choose files to upload" onChange={(e) => (e.target.files && add(e.target.files), (e.target.value = ''))} />
      </div>
      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line" aria-live="polite">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 px-3 py-2.5">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${f.error ? 'bg-bad-soft text-bad' : f.progress >= 1 ? 'bg-ok-soft text-ok' : 'bg-sunken text-ink-2'}`}>
                <Icon name={f.error ? 'error' : f.progress >= 1 ? 'check_circle' : 'description'} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{f.name}</p>
                {f.error ? (
                  <p className="text-xs text-bad">{f.error}</p>
                ) : f.progress < 1 ? (
                  <>
                    <md-linear-progress value={f.progress} aria-label={`Uploading ${f.name}`} />
                    <p className="mt-0.5 text-xs text-ink-2">Uploading… {Math.round(f.progress * 100)}%</p>
                  </>
                ) : (
                  <p className="text-xs text-ink-2">
                    {fmt(f.size)} · <span className="font-medium text-ai-deep">✦ AI detected: {f.kind}</span>
                  </p>
                )}
              </div>
              <MIconButton icon="close" label={`Remove ${f.name}`} onClick={() => setFiles((s) => s.filter((x) => x.id !== f.id))} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
