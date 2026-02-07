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
  { label: 'Live Feed', href: '#live-feed' },
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

function ScoreBadge({ score }: { score: number }) {
  const hot = score >= 90
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        hot
          ? 'badgePulse border-[var(--hs-cyan)]/35 bg-[rgba(0,246,255,0.10)] text-[var(--hs-cyan)]'
          : 'border-white/14 bg-white/5 text-white/80'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      Hype Score: {score}/100
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
          <Sparkles className="h-4 w-4 text-[var(--hs-purple)]" />
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

export default function App() {
  return (
    <div className="relative z-10 min-h-screen">
      {/* SECTION 1 — TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <a href="#" className="flex items-center gap-2">
            <span className="relative inline-flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[rgba(0,246,255,0.12)] blur" />
              <span className="pulse" aria-hidden />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-white">
              HypeSeek
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {navItems.map((it) => (
              <a
                key={it.href}
                href={it.href}
                className="transition hover:text-white"
              >
                {it.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#sign-in"
              className="hidden rounded-full border border-white/14 bg-transparent px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-white/22 hover:bg-white/5 md:inline-flex"
            >
              Sign In
            </a>
            <a
              href="#sign-in"
              className="inline-flex rounded-full border border-white/14 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/8 md:hidden"
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
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 w-full"
          >
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
                <Gauge className="h-4 w-4 text-[var(--hs-purple)]" />
                Explainable scoring
              </Pill>
            </motion.div>

            <motion.h1
              variants={item}
              className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-white md:text-6xl"
            >
              Stop trading candles.
              <br />
              Start trading culture.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg"
            >
              HypeSeek is a real-time virality terminal that detects emerging narratives
              1–2 hours before they hit mainstream crypto.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <GlowButton variant="primary" href="#live-feed">
                ✅ View Live Feed (No Wallet Needed)
              </GlowButton>
              <GlowButton variant="secondary" href="#alerts">
                ⭐️ Unlock Alerts (Optional Wallet)
              </GlowButton>
            </motion.div>

            <motion.p variants={item} className="mt-5 text-sm text-[var(--hs-gray)]">
              Built for narrative traders, memecoin hunters, and cultural signal analysts.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 grid max-w-3xl grid-cols-1 gap-3 md:grid-cols-3"
            >
              <div className="hs-card rounded-[18px] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <TrendingUp className="h-4 w-4 text-[var(--hs-cyan)]" />
                  Predictive
                </div>
                <div className="mt-2 text-xs text-[var(--hs-gray)]">
                  Narrative velocity before price reacts.
                </div>
              </div>
              <div className="hs-card rounded-[18px] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <Grid2X2 className="h-4 w-4 text-[var(--hs-purple)]" />
                  Multi-source
                </div>
                <div className="mt-2 text-xs text-[var(--hs-gray)]">
                  X + Reddit + Google Trends confirmation.
                </div>
              </div>
              <div className="hs-card rounded-[18px] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <Timer className="h-4 w-4 text-[var(--hs-green)]" />
                  Real-time
                </div>
                <div className="mt-2 text-xs text-[var(--hs-gray)]">
                  24/7 cron-driven terminal updates.
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — LIVE PREVIEW (Instant Proof) */}
      <section id="live-feed" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          kicker="Instant proof"
          title="Live Narratives Breaking Now"
          subtitle="Updated every few minutes from X + Reddit + Google Trends."
        />

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
              badge: 'BREAKING',
              badgeTone: 'bg-[rgba(0,246,255,0.14)] text-[var(--hs-cyan)] border-[var(--hs-cyan)]/25',
            },
            {
              title: 'Trump Meme Resurgence',
              score: 88,
              velocity: '+210%',
              sources: 'X • Trends',
              badge: 'EARLY SIGNAL',
              badgeTone: 'bg-[rgba(168,85,247,0.16)] text-[var(--hs-purple)] border-[var(--hs-purple)]/25',
            },
            {
              title: 'Epstein Files Coin Wave',
              score: 81,
              velocity: '+160%',
              sources: 'X • Reddit',
              badge: 'WATCH',
              badgeTone: 'bg-[rgba(0,255,133,0.12)] text-[var(--hs-green)] border-[var(--hs-green)]/25',
            },
          ].map((c) => (
            <motion.a
              key={c.title}
              variants={item}
              href="#"
              className="hs-card hs-glow group rounded-[18px] p-5 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-semibold text-white/95">
                    {c.title}
                  </div>
                  <div className="mt-2">
                    <ScoreBadge score={c.score} />
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${c.badgeTone}`}
                >
                  {c.badge}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <Metric label="Velocity" value={c.velocity} />
                <Metric label="Sources" value={c.sources} />
                <div className="flex items-center justify-between pt-2 text-xs text-white/55">
                  <span className="font-mono">click to inspect</span>
                  <ChevronRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* SECTION 4 — HOW HYPESEEK WORKS (3 Pillars) */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          kicker="Method"
          title="The Virality Engine"
          subtitle="Terminal-grade signals, built for narrative traders."
        />

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
              icon: <Grid2X2 className="h-5 w-5 text-[var(--hs-purple)]" />,
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
                <div className="font-display text-lg font-semibold text-white/95">
                  {p.title}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--hs-gray)]">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 5 — DEXSCREENER COMPARISON BLOCK */}
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

      {/* SECTION 6 — FEATURE GRID (6 Cards) */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          kicker="Toolkit"
          title="Built for Signal Hunters"
          subtitle="A Bloomberg-terminal vibe with DexScreener-grade trust."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            {
              icon: <Radar className="h-5 w-5 text-[var(--hs-cyan)]" />,
              title: 'Early narrative detection',
              body: 'Spot cultural moves 1–2 hours before they trend.',
            },
            {
              icon: <TrendingUp className="h-5 w-5 text-[var(--hs-purple)]" />,
              title: 'Velocity trend charts',
              body: 'Terminal-grade momentum curves for every narrative.',
            },
            {
              icon: <Bell className="h-5 w-5 text-[var(--hs-green)]" />,
              title: 'Watchlists & alerts',
              body: 'Track narratives, creators, and meme cycles—hands-free.',
            },
            {
              icon: <Sparkles className="h-5 w-5 text-[var(--hs-cyan)]" />,
              title: 'AI breakout reasoning',
              body: 'Every spike includes a “Why Now” explanation.',
            },
            {
              icon: <Grid2X2 className="h-5 w-5 text-[var(--hs-purple)]" />,
              title: 'Multi-source validation',
              body: 'Cross-check X, Reddit, and Google Trends confirmation.',
            },
            {
              icon: <Gauge className="h-5 w-5 text-[var(--hs-green)]" />,
              title: 'Meme cycle tracking',
              body: 'Detect repeats, remixes, and second-wave revivals.',
            },
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

      {/* SECTION 7 — OPTIONAL WALLET EXPLANATION (Trust Fix) */}
      <section id="alerts" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="hs-card rounded-[18px] p-8 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                Wallet is optional.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--hs-gray)] md:text-base">
                HypeSeek does not require wallet connection to explore trends. Wallet unlocks:
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--hs-cyan)]" />
                  Custom alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--hs-purple)]" />
                  Personal watchlists
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--hs-green)]" />
                  Anti-bot protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  Future automated execution tools
                </li>
              </ul>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              <GlowButton variant="secondary" href="#alerts">
                ⭐️ Unlock Alerts
              </GlowButton>
              <div className="text-xs text-white/55">
                No wallet gating on the live feed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA (Strong Close) */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-white/6 to-white/2 p-10">
          <div className="absolute inset-0 opacity-60">
            <div className="radar" />
          </div>
          <div className="relative z-10">
            <h3 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Culture moves before charts. Don’t trade late.
            </h3>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <GlowButton variant="primary" href="#live-feed">
                ✅ View Live Feed
              </GlowButton>
              <GlowButton variant="secondary" href="#alerts">
                ⭐️ Unlock Alerts
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FOOTER */}
      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="text-sm text-white/70">HypeSeek © 2026</div>
          <div className="flex items-center gap-5 text-sm text-white/60">
            <a id="docs" href="#docs" className="inline-flex items-center gap-2 hover:text-white">
              <BookOpen className="h-4 w-4" /> Docs
            </a>
            <a
              href="https://x.com/HypeSeekAI"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              X/Twitter
            </a>
            <a href="#privacy" className="hover:text-white">
              Privacy
            </a>
          </div>
        </div>
      </footer>

      {/* invisible anchors for completeness */}
      <div id="docs" />
      <div id="sign-in" />
    </div>
  )
}
