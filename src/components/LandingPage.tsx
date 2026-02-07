'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  Bell,
  BookOpen,
  ChevronRight,
  Gauge,
  Grid2X2,
  Radar,
  Sparkles,
  Timer,
  TrendingUp,
} from 'lucide-react'

const navItems = [
  { label: 'Live Feed', href: '/live-feed' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Alerts', href: '#alerts' },
  { label: 'Docs', href: '#docs' },
]

// Framer Motion variants (typed loosely to avoid version-specific easing typings)
const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
}

const item: any = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
      {children}
    </span>
  )
}

function GlowButton({
  variant,
  children,
  href,
}: {
  variant: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
  href: string
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition will-change-transform focus:outline-none focus:ring-2 focus:ring-[var(--hs-cyan)]/40'

  if (variant === 'primary') {
    return (
      <a
        href={href}
        className={`${base} bg-[var(--hs-cyan)] text-black shadow-[0_0_0_1px_rgba(0,246,255,0.28),0_18px_60px_rgba(0,246,255,0.12)] hover:shadow-[0_0_0_1px_rgba(0,246,255,0.40),0_22px_70px_rgba(0,246,255,0.16)] hover:-translate-y-0.5`}
      >
        {children}
        <ChevronRight className="h-4 w-4" />
      </a>
    )
  }

  if (variant === 'secondary') {
    return (
      <a
        href={href}
        className={`${base} bg-white/7 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.10)] hover:bg-white/10 hover:-translate-y-0.5`}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      className={`${base} border border-white/14 bg-transparent text-white/90 hover:border-white/22 hover:bg-white/5`}
    >
      {children}
    </a>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="text-xs text-[var(--hs-gray)]">{label}</div>
      <div className="font-mono text-sm tracking-tight text-white/90">{value}</div>
    </div>
  )
}

function Sparkline({ points }: { points: number[] }) {
  const w = 84
  const h = 22
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = Math.max(1, max - min)
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((p - min) / span) * h
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={d} fill="none" stroke="rgba(0,246,255,0.95)" strokeWidth="1.8" />
      <path d={d} fill="none" stroke="rgba(0,246,255,0.20)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function scoreStatusLabel(score?: number) {
  if (typeof score !== 'number' || Number.isNaN(score)) return '—'
  if (score >= 90) return 'BREAKING'
  if (score >= 75) return 'EARLY SIGNAL'
  if (score >= 50) return 'WATCH'
  return 'QUIET'
}

function scoreStatusTone(label: string) {
  if (label === 'BREAKING') {
    return 'badgePulse border-[var(--hs-green)]/35 bg-[rgba(0,255,133,0.10)] text-[var(--hs-green)] shadow-[0_0_0_1px_rgba(0,255,133,0.18),0_18px_70px_rgba(0,255,133,0.10)]'
  }
  if (label === 'EARLY SIGNAL') {
    return 'border-[var(--hs-cyan)]/35 bg-[rgba(0,246,255,0.10)] text-[var(--hs-cyan)]'
  }
  if (label === 'WATCH') {
    return 'border-[var(--hs-amber)]/30 bg-[rgba(255,184,0,0.10)] text-[var(--hs-amber)]'
  }
  return 'border-white/14 bg-white/5 text-white/70'
}

function ScoreBadge({ score }: { score?: number }) {
  const label = scoreStatusLabel(score)
  const safeScore = typeof score === 'number' && !Number.isNaN(score) ? Math.round(score) : null

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${scoreStatusTone(
        label,
      )}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {safeScore === null ? '—' : `${safeScore}/100`} • {label}
    </span>
  )
}

function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {kicker ? (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
          <Sparkles className="h-4 w-4 text-[var(--hs-lime)]" />
          {kicker}
        </div>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--hs-gray)] md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="noise relative z-10 min-h-screen">
      {/* SECTION 1 — TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <a href="#" className="flex items-center gap-3">
            <span className="relative inline-flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[rgba(0,246,255,0.10)] blur" />
              <img
                src="/brand/hypeseek-icon.jpg"
                alt="HypeSeek"
                className="relative h-8 w-8 rounded-full object-cover"
              />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-white">
              HypeSeek
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {navItems.map((it) => (
              <a key={it.href} href={it.href} className="transition hover:text-white">
                {it.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#sign-in"
              className="text-sm font-semibold text-white/55 transition hover:text-white/75"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* SECTION 2 — HERO (Above the Fold) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="radar" />
          <div className="pulse" style={{ left: '65%', top: '45%' }} />
        </div>

        <div className="mx-auto flex min-h-[92vh] max-w-6xl items-center px-4 py-16 md:px-6">
          <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 w-full">
            {/* Integrated banner strip */}
            <motion.div
              variants={item}
              className="mb-7 inline-flex w-full items-center gap-4 rounded-[18px] border border-white/10 bg-gradient-to-r from-black/70 via-white/4 to-black/40 px-4 py-3 backdrop-blur-xl md:w-auto md:px-5"
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-[rgba(0,246,255,0.12)] blur" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-black/60">
                  <img
                    src="/brand/hypeseek-icon.jpg"
                    alt="HypeSeek"
                    className="h-8 w-8 rounded-xl object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="font-display text-2xl font-semibold tracking-tight text-white md:text-[28px]">
                  <span className="bg-gradient-to-r from-white via-white to-[var(--hs-cyan)] bg-clip-text text-transparent">
                    Hype
                  </span>
                  <span className="bg-gradient-to-r from-[var(--hs-cyan)] to-[var(--hs-lime)] bg-clip-text text-transparent">
                    Seek
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] font-semibold tracking-[0.28em] text-white/55 md:text-xs">
                  STOP TRADING CANDLES. START TRADING CULTURE.
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="mb-6 flex flex-wrap items-center gap-2">
              <Pill>
                <Radar className="h-4 w-4 text-[var(--hs-cyan)]" />
                Futuristic virality intelligence
              </Pill>
              <Pill>
                <Activity className="h-4 w-4 text-[var(--hs-green)]" />
                Updated every few minutes
              </Pill>
              <Pill>
                <Gauge className="h-4 w-4 text-[var(--hs-lime)]" />
                Explainable scoring
              </Pill>
            </motion.div>

            <motion.h1 variants={item} className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Stop trading candles.
              <br />
              Start trading culture.
            </motion.h1>

            <motion.p variants={item} className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              HypeSeek is a real-time virality terminal that detects emerging narratives 1–2 hours before they hit mainstream crypto.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <GlowButton variant="primary" href="/live-feed">
                ✅ View Live Feed (No Wallet Needed)
              </GlowButton>
              <div className="flex flex-col gap-2">
                <GlowButton variant="secondary" href="#alerts">
                  ⭐️ Unlock Alerts (Optional)
                </GlowButton>
                <div className="max-w-[320px] text-xs text-white/55">
                  Wallet is only used for alerts + watchlists. Not required to view trends.
                </div>
              </div>
            </motion.div>

            <motion.p variants={item} className="mt-5 text-sm text-[var(--hs-gray)]">
              Built for narrative traders, memecoin hunters, and cultural signal analysts.
            </motion.p>

            <motion.div variants={item} className="mt-10 grid max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
              <div className="hs-card rounded-[18px] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <TrendingUp className="h-4 w-4 text-[var(--hs-cyan)]" />
                  Predictive
                </div>
                <div className="mt-2 text-xs text-[var(--hs-gray)]">Narrative velocity before price reacts.</div>
              </div>
              <div className="hs-card rounded-[18px] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <Grid2X2 className="h-4 w-4 text-[var(--hs-lime)]" />
                  Multi-source
                </div>
                <div className="mt-2 text-xs text-[var(--hs-gray)]">X + Reddit + Google Trends confirmation.</div>
              </div>
              <div className="hs-card rounded-[18px] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <Timer className="h-4 w-4 text-[var(--hs-green)]" />
                  Real-time
                </div>
                <div className="mt-2 text-xs text-[var(--hs-gray)]">24/7 cron-driven terminal updates.</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — LIVE PREVIEW */}
      <section id="live-feed" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          kicker="Instant proof"
          title="Live Narratives Breaking Now"
          subtitle="Updated every few minutes from X + Reddit + Google Trends."
        />

        {/* 1) Context explainer block (between hero and live feed) */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="hs-card rounded-[18px] border border-white/10 bg-black/35 p-5">
            <div className="font-display text-base font-semibold text-white/90">What You’re Seeing</div>
            <div className="mt-2 text-sm leading-relaxed text-[var(--hs-gray)]">
              HypeSeek scans X, Reddit, and Google Trends every few minutes to detect narratives accelerating before price reacts.
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hs-cyan)]" />Hype Score = momentum index (0–100)</li>
              <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hs-lime)]" />Velocity = growth rate in the last hour</li>
              <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hs-amber)]" />Sources = cross-platform confirmation</li>
            </ul>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            {
              title: 'AI Agents + Solana Meta',
              score: 92,
              velocity: '+340% last 45m',
              sources: 'X • Reddit • Trends',
              spark: [12, 14, 16, 18, 24, 28, 26, 31, 36, 42, 48, 55],
              whyNow: 'Engagement burst in the last 18 minutes + confirmed Reddit spike.',
            },
            {
              title: 'Trump Meme Resurgence',
              score: 88,
              velocity: '+210%',
              sources: 'X • Trends',
              spark: [10, 11, 13, 15, 16, 17, 21, 24, 29, 31, 33, 35],
              whyNow: 'Quote-tweet chains accelerating + Trends breakout confirmed.',
            },
            {
              title: 'Epstein Files Coin Wave',
              score: 81,
              velocity: '+160%',
              sources: 'X • Reddit',
              spark: [9, 10, 10, 11, 12, 14, 16, 18, 18, 20, 21, 22],
              whyNow: 'Reddit mention density rising + re-share cascade detected.',
            },
          ].map((c) => (
            <motion.a
              key={c.title}
              variants={item}
              href="/live-feed"
              className="hs-card hs-glow group rounded-[18px] p-5 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-display text-lg font-semibold text-white/95">{c.title}</div>
                  <div className="mt-2">
                    <ScoreBadge score={c.score} />
                  </div>
                </div>
                <div className="mt-1 shrink-0">
                  <Sparkline points={c.spark} />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Metric label="Velocity" value={c.velocity} />
                <Metric label="Sources" value={c.sources} />

                {/* 2) Why Now preview (hover reveal) */}
                <div className="pt-1 text-xs">
                  <div className="text-white/45">Why this is moving →</div>
                  <div className="mt-1 line-clamp-2 text-white/55 italic opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {c.whyNow}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-white/55">
                  <span className="font-mono">click to inspect</span>
                  <ChevronRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* SECTION 3.5 — TRACK RECORD PROOF STRIP */}
      <section className="mx-auto max-w-6xl px-4 pb-6 md:px-6">
        <SectionHeading kicker="Proof" title="Recent Signals That Hit" subtitle="Static examples for now — used to show what ‘working’ looks like." />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: 'AI Agents Meta', body: 'exploded 2h later', out: '+420% narrative volume' },
            { title: 'Trump Meme Spike', body: 'top narrative in 6h', out: '+310% velocity' },
            { title: 'Solana Frog Wave', body: 'confirmed breakout', out: '+190% cross-platform mentions' },
          ].map((c) => (
            <div key={c.title} className="hs-card rounded-[18px] p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="font-display text-base font-semibold text-white/95">{c.title} → {c.body}</div>
                <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">
                  outcome
                </span>
              </div>
              <div className="mt-3 text-sm text-[var(--hs-gray)]">{c.out}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading kicker="Method" title="The Virality Engine" subtitle="Terminal-grade signals, built for narrative traders." />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            {
              icon: <TrendingUp className="h-5 w-5 text-[var(--hs-cyan)]" />,
              title: '🔥 Hype Score',
              body: 'We measure narrative velocity, engagement bursts, and breakout momentum.',
            },
            {
              icon: <Grid2X2 className="h-5 w-5 text-[var(--hs-lime)]" />,
              title: '🌍 Cross-Platform Confirmation',
              body: 'Signals are verified across X, Reddit, and Google Trends.',
            },
            {
              icon: <Sparkles className="h-5 w-5 text-[var(--hs-green)]" />,
              title: '🧠 AI Explanation',
              body: 'Every spike includes a “Why Now” breakdown, not just raw numbers.',
            },
          ].map((p) => (
            <motion.div key={p.title} variants={item} className="hs-card rounded-[18px] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  {p.icon}
                </div>
                <div className="font-display text-lg font-semibold text-white/95">{p.title}</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--hs-gray)]">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 5 — COMPARISON */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
            DexScreener tracks tokens.{' '}
            <span className="text-[var(--hs-cyan)]">HypeSeek tracks what moves them.</span>
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[18px] border border-white/10 bg-white/3">
          <div className="grid grid-cols-2 gap-0 border-b border-white/10">
            <div className="px-5 py-4 font-display text-sm font-semibold text-white/85">DexScreener</div>
            <div className="px-5 py-4 font-display text-sm font-semibold text-white/85">HypeSeek</div>
          </div>

          {[
            ['Price charts', 'Narrative velocity'],
            ['Token volume', 'Meme momentum'],
            ['On-chain data', 'Cultural intelligence'],
            ['Reactive', 'Predictive'],
          ].map(([a, b]) => (
            <div key={a} className="grid grid-cols-2 border-b border-white/7 last:border-b-0">
              <div className="px-5 py-4 text-sm text-[var(--hs-gray)]">{a}</div>
              <div className="px-5 py-4 text-sm text-white/85">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading kicker="Toolkit" title="Built for Signal Hunters" subtitle="A Bloomberg-terminal vibe with DexScreener-grade trust." />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            { icon: <Radar className="h-5 w-5 text-[var(--hs-cyan)]" />, title: 'Early narrative detection', body: 'Spot cultural moves 1–2 hours before they trend.' },
            { icon: <TrendingUp className="h-5 w-5 text-[var(--hs-amber)]" />, title: 'Velocity trend charts', body: 'Terminal-grade momentum curves for every narrative.' },
            { icon: <Bell className="h-5 w-5 text-[var(--hs-green)]" />, title: 'Watchlists & alerts', body: 'Track narratives, creators, and meme cycles—hands-free.' },
            { icon: <Sparkles className="h-5 w-5 text-[var(--hs-cyan)]" />, title: 'AI breakout reasoning', body: 'Every spike includes a “Why Now” explanation.' },
            { icon: <Grid2X2 className="h-5 w-5 text-[var(--hs-cyan)]" />, title: 'Multi-source validation', body: 'Cross-check X, Reddit, and Google Trends confirmation.' },
            { icon: <Gauge className="h-5 w-5 text-[var(--hs-green)]" />, title: 'Meme cycle tracking', body: 'Detect repeats, remixes, and second-wave revivals.' },
          ].map((f) => (
            <motion.div key={f.title} variants={item} className="hs-card hs-glow rounded-[18px] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  {f.icon}
                </div>
                <div className="font-display text-base font-semibold text-white/95">{f.title}</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--hs-gray)]">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 7 — WALLET OPTIONAL */}
      <section id="alerts" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="hs-card rounded-[18px] p-8 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-white">Wallet is optional.</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--hs-gray)] md:text-base">
                HypeSeek does not require wallet connection to explore trends. Wallet unlocks:
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--hs-cyan)]" />Custom alerts</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--hs-lime)]" />Personal watchlists</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--hs-green)]" />Anti-bot protection</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white/60" />Future automated execution tools</li>
              </ul>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              <GlowButton variant="secondary" href="#alerts">⭐️ Unlock Alerts</GlowButton>
              <div className="text-xs text-white/55">No wallet gating on the live feed.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-white/6 to-white/2 p-10">
          <div className="absolute inset-0 opacity-60"><div className="radar" /></div>
          <div className="relative z-10">
            <h3 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Culture moves before charts. Don’t trade late.
            </h3>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <GlowButton variant="primary" href="/live-feed">✅ View Live Feed</GlowButton>
              <GlowButton variant="secondary" href="#alerts">⭐️ Unlock Alerts</GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FOOTER */}
      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="text-sm text-white/70">HypeSeek © 2026</div>
          <div className="flex items-center gap-5 text-sm text-white/60">
            <a href="#docs" className="inline-flex items-center gap-2 hover:text-white">
              <BookOpen className="h-4 w-4" /> Docs
            </a>
            <a href="https://x.com/HypeSeekAI" target="_blank" rel="noreferrer" className="hover:text-white">
              X/Twitter
            </a>
            <a href="#privacy" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>

      <div id="docs" />
      <div id="sign-in" />
    </div>
  )
}
