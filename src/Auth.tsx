import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, ChevronLeft, Lock, Mail, ShieldCheck, Sparkles } from './icons'
import { Button, cx, inputCls } from './ui'
import type { Role } from './ctx'

const roles: Role[] = ['Adjuster', 'Claims Handler', 'Underwriting Lead', 'Supervisor']

export function LoginScreen({ onSignIn, theme, onToggleTheme }: { onSignIn: (name: string) => void; theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid work email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    const name = email.split('@')[0].split(/[._-]/).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(' ') || 'Priya Raman'
    onSignIn(name)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4 py-10 text-ink">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-brand-soft/70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -bottom-48 h-[36rem] w-[36rem] rounded-full bg-ai-soft blur-3xl" />
      <button type="button" onClick={onToggleTheme} className="absolute top-5 right-5 rounded-full border border-line bg-surface p-3 text-ink-2 hover:bg-sunken" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
        <span className="msym" aria-hidden="true">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
      </button>
      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-line/70 bg-surface shadow-e3 md:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden flex-col justify-between bg-brand p-10 text-on-brand md:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-on-brand/15"><Sparkles size={22} /></span>
            <span className="font-display text-2xl font-semibold tracking-tight">ClaimIQ</span>
          </div>
          <div className="max-w-md">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] opacity-75">Claims, made clearer</p>
            <h1 className="font-display text-4xl leading-tight tracking-tight">The right work, in focus.</h1>
            <p className="mt-4 text-base leading-relaxed opacity-80">A thoughtful workspace for people who make complex claims decisions every day.</p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-on-brand/10 p-4 text-sm">
              <ShieldCheck size={20} className="shrink-0" /> Your decisions stay yours. AI suggestions are always reviewable.
            </div>
          </div>
          <p className="text-xs opacity-65">Secure workspace · Claims operations</p>
        </div>
        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-on-brand"><Sparkles size={22} /></span>
            <span className="font-display text-2xl font-semibold tracking-tight">ClaimIQ</span>
          </div>
          <p className="text-sm font-semibold text-brand">Welcome back</p>
          <h2 className="mt-1 font-display text-3xl tracking-tight">Sign in to ClaimIQ</h2>
          <p className="mt-2 text-sm text-ink-2">Use your work email to continue to your claims workspace.</p>
          <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
            <label className="block text-sm font-medium" htmlFor="login-email">Work email</label>
            <div className="relative -mt-4">
              <Mail size={18} className="pointer-events-none absolute top-3.5 left-3 text-ink-3" aria-hidden />
              <input id="login-email" type="email" autoComplete="username" required value={email} onChange={(event) => (setEmail(event.target.value), setError(''))} placeholder="you@company.com" className={cx(inputCls, 'pl-10')} aria-invalid={!!error && !/^\S+@\S+\.\S+$/.test(email)} />
            </div>
            <label className="block text-sm font-medium" htmlFor="login-password">Password</label>
            <div className="relative -mt-4">
              <Lock size={18} className="pointer-events-none absolute top-3.5 left-3 text-ink-3" aria-hidden />
              <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => (setPassword(event.target.value), setError(''))} placeholder="Enter your password" className={cx(inputCls, 'pl-10')} aria-invalid={!!error && password.length < 6} />
            </div>
            {error && <p role="alert" className="-mt-2 text-sm font-medium text-bad">{error}</p>}
            <Button type="submit" variant="primary" className="w-full justify-between rounded-xl" icon={<ArrowRight size={18} />}>Sign in</Button>
          </form>
          <p className="mt-5 text-center text-xs text-ink-3">Demo workspace: use any valid email and a password of 6+ characters.</p>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-3"><Lock size={14} aria-hidden /> Protected enterprise workspace</div>
        </div>
      </section>
    </main>
  )
}

export function OnboardingScreen({ name, onComplete, theme, onToggleTheme }: { name: string; onComplete: (details: { name: string; role: Role; line: string }) => void; theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState(name)
  const [role, setRole] = useState<Role>('Adjuster')
  const [line, setLine] = useState('Auto')
  const [error, setError] = useState('')
  const steps = ['Your profile', 'Your work', 'Ready to go']
  const finish = () => {
    if (!fullName.trim()) return setError('Enter your name to personalize your workspace.')
    onComplete({ name: fullName.trim(), role, line })
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4 py-10 text-ink">
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-soft/70 blur-3xl" />
      <button type="button" onClick={onToggleTheme} className="absolute top-5 right-5 rounded-full border border-line bg-surface p-3 text-ink-2 hover:bg-sunken" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
        <span className="msym" aria-hidden="true">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
      </button>
      <section className="relative w-full max-w-2xl rounded-[32px] border border-line/70 bg-surface p-6 shadow-e3 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-on-brand"><Sparkles size={22} /></span>
          <span className="font-display text-xl font-semibold tracking-tight">ClaimIQ</span>
          <span className="ml-auto text-xs font-semibold text-ink-3">STEP {step + 1} OF {steps.length}</span>
        </div>
        <div className="mt-8 flex gap-2" aria-label="Onboarding progress">
          {steps.map((label, index) => <div key={label} className={cx('h-1.5 flex-1 rounded-full', index <= step ? 'bg-brand' : 'bg-sunken')} />)}
        </div>
        <p className="mt-8 text-sm font-semibold text-brand">Let’s set things up</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">{step === 0 ? 'Make this workspace yours' : step === 1 ? 'Tell us about your work' : 'You’re all set'}</h1>
        <p className="mt-2 text-sm text-ink-2">{step === 0 ? 'A few details help us tailor ClaimIQ to you.' : step === 1 ? 'We’ll use these preferences to make your starting view more relevant.' : 'Your claims workspace is ready. You can change these preferences any time.'}</p>
        <div className="mt-7 min-h-52">
          {step === 0 && <div className="max-w-md"><label className="mb-2 block text-sm font-medium" htmlFor="onboard-name">Your name</label><input id="onboard-name" autoComplete="name" value={fullName} onChange={(event) => (setFullName(event.target.value), setError(''))} className={inputCls} aria-invalid={!!error} />{error && <p role="alert" className="mt-2 text-sm text-bad">{error}</p>}</div>}
          {step === 1 && <div className="grid gap-6 sm:grid-cols-2"><fieldset><legend className="mb-2 text-sm font-semibold">Your role</legend><div className="space-y-2">{roles.map((value) => <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line p-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft/50"><input type="radio" name="onboarding-role" value={value} checked={role === value} onChange={() => setRole(value)} className="accent-brand" /><span className="text-sm">{value}</span></label>)}</div></fieldset><fieldset><legend className="mb-2 text-sm font-semibold">Your main line of business</legend><div className="grid grid-cols-2 gap-2">{['Auto', 'Property', 'Commercial', 'Travel'].map((value) => <button type="button" key={value} aria-pressed={line === value} onClick={() => setLine(value)} className={cx('min-h-12 rounded-xl border px-3 text-sm font-medium', line === value ? 'border-brand bg-brand-soft text-brand-2' : 'border-line hover:bg-sunken')}>{value}</button>)}</div></fieldset></div>}
          {step === 2 && <div className="flex max-w-md items-start gap-4 rounded-2xl bg-brand-soft/50 p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand"><Check size={20} /></span><div><p className="font-semibold">Welcome, {fullName.trim() || 'there'}.</p><p className="mt-1 text-sm text-ink-2">Your {role.toLowerCase()} workspace is configured for {line.toLowerCase()} claims. You can adjust these details in Settings.</p></div></div>}
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <button type="button" onClick={() => (setError(''), setStep((current) => Math.max(0, current - 1)))} className={cx('inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink-2 hover:bg-sunken', step === 0 && 'invisible')}><ChevronLeft size={18} />Back</button>
          {step < 2 ? <Button variant="primary" onClick={() => { if (step === 0 && !fullName.trim()) return setError('Enter your name to personalize your workspace.'); setError(''); setStep((current) => current + 1) }}>Continue <ArrowRight size={18} /></Button> : <Button variant="primary" onClick={finish}>Open workspace <ArrowRight size={18} /></Button>}
        </div>
        <p className="mt-5 text-center text-xs text-ink-3">You can update your preferences later in Settings.</p>
      </section>
    </main>
  )
}
