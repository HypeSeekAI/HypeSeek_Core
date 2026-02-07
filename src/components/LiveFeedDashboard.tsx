'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Flame,
  Grid2X2,
  Lock,
  LogOut,
  Moon,
  Radar,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Narrative = {
  id: string
  title: string
  score: number
  velocityPct: number
  window: string
  sources: string[]
  status: 'BREAKING' | 'EARLY SIGNAL' | 'WATCH'
  whyNow: string[]
  tags: string[]
  updatedAgo: string
  chain?: string
}

// Static seed (UI first). Next step: Supabase wiring.
const seed: Narrative[] = [
  {
    id: 'n1',
    title: 'AI Agents + Solana Meta',
    score: 92,
    velocityPct: 340,
    window: '45m',
    sources: ['X', 'Reddit', 'Trends'],
    status: 'BREAKING',
    whyNow: [
      'Spike in repost velocity + reply density on Tier-1 accounts',
      'Cross-platform confirmation: Reddit thread + Trends breakout',
      'Format signal: short caption + screenshot meme variant',
    ],
    tags: ['ai', 'solana', 'agents'],
    updatedAgo: '2m',
    chain: 'SOL',
  },
  {
    id: 'n2',
    title: 'Trump Meme Resurgence',
    score: 88,
    velocityPct: 210,
    window: '60m',
    sources: ['X', 'Trends'],
    status: 'EARLY SIGNAL',
    whyNow: [
      'High engagement per impression on political humor posts',
      'Format signal: quote-tweet chains accelerating',
      'Trend confirmation: short-lived dip then renewed climb',
    ],
    tags: ['meme', 'politics', 'culture'],
    updatedAgo: '4m',
    chain: 'ETH',
  },
  {
    id: 'n3',
    title: 'Epstein Files Coin Wave',
    score: 81,
    velocityPct: 160,
    window: '90m',
    sources: ['X', 'Reddit'],
    status: 'WATCH',
    whyNow: [
      'New documentary clip causing re-share cascade',
      'Reddit mentions increasing across multiple subs',
      'Tokenized narrative chatter detected (memecoin tickers)',
    ],
    tags: ['meme', 'news', 'attention'],
    updatedAgo: '7m',
    chain: 'SOL',
  },
  {
    id: 'n4',
    title: 'Streamer Clip: “One Frame” Challenge',
    score: 77,
    velocityPct: 120,
    window: '2h',
    sources: ['X', 'Trends'],
    status: 'WATCH',
    whyNow: [
      'Short-form clip format performing unusually well',
      'Influencer graph overlap suggests second-wave amplification',
    ],
    tags: ['streamers', 'clips', 'challenge'],
    updatedAgo: '10m',
    chain: 'BASE',
  },
]

const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
}

const item: any = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

function badgeTone(status: Narrative['status']) {
  if (status === 'BREAKING') {
    return 'bg-[rgba(0,246,255,0.14)] text-[var(--hs-cyan)] border-[var(--hs-cyan)]/25'
  }
  if (status === 'EARLY SIGNAL') {
    return 'bg-[rgba(168,85,247,0.16)] text-[var(--hs-purple)] border-[var(--hs-purple)]/25'
  }
  return 'bg-[rgba(0,255,133,0.12)] text-[var(--hs-green)] border-[var(--hs-green)]/25'
}

function scoreTone(score: number) {
  if (score >= 90) return 'text-[var(--hs-cyan)]'
  if (score >= 85) return 'text-[var(--hs-purple)]'
  return 'text-white/80'
}

function PulsingDot({ tone = 'cyan' }: { tone?: 'cyan' | 'purple' | 'green' }) {
  const c =
    tone === 'purple'
      ? 'bg-[var(--hs-purple)]'
      : tone === 'green'
        ? 'bg-[var(--hs-green)]'
        : 'bg-[var(--hs-cyan)]'
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full rounded-full opacity-40 ${c} animate-ping`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${c}`} />
    </span>
  )
}

function Magnetic({
  children,
  strength = 14,
}: {
  children: React.ReactNode
  strength?: number
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.9 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.9 })

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
        const dx = e.clientX - (rect.left + rect.width / 2)
        const dy = e.clientY - (rect.top + rect.height / 2)
        x.set((dx / rect.width) * strength)
        y.set((dy / rect.height) * strength)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  )
}

function Marquee({ text }: { text: string }) {
  return (
    <div className="relative overflow-hidden border-y border-white/8 bg-black/35">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      <div className="flex gap-10 whitespace-nowrap py-2 text-[11px] font-semibold tracking-[0.34em] text-white/45">
        <div className="animate-[marquee_28s_linear_infinite]">{text} • {text} • {text} • {text} • {text}</div>
        <div className="animate-[marquee_28s_linear_infinite]" aria-hidden>
          {text} • {text} • {text} • {text} • {text}
        </div>
      </div>
    </div>
  )
}

function Preloader({ done }: { done: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black ${done ? 'pointer-events-none' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: done ? 0 : 1, y: done ? 10 : 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="flex flex-col items-center gap-3"
      >
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-[rgba(0,246,255,0.12)] blur" />
          <img
            src="/brand/hypeseek-icon.jpg"
            alt="HypeSeek"
            className="relative h-14 w-14 rounded-2xl border border-white/10 object-cover"
          />
        </div>
        <div className="font-display text-xl font-semibold tracking-tight text-white">HypeSeek Terminal</div>
        <div className="text-xs text-white/50">Loading live narratives…</div>
        <div className="mt-2 h-1 w-44 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-1 w-24 rounded-full bg-[var(--hs-cyan)]"
            initial={{ x: -120 }}
            animate={{ x: 180 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

function Sidebar({
  active,
  setActive,
  authed,
  signOut,
}: {
  active: string
  setActive: (v: string) => void
  authed: boolean
  signOut: () => void
}) {
  const tabs = [
    { key: 'live', label: 'Live Feed', icon: <Radar className="h-4 w-4" /> },
    { key: 'watch', label: 'Watchlist', icon: <Grid2X2 className="h-4 w-4" />, locked: true },
    { key: 'alerts', label: 'Alerts', icon: <Bell className="h-4 w-4" />, locked: true },
    { key: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" />, locked: true },
  ] as const

  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 border-r border-white/10 bg-black/45 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="relative inline-flex h-10 w-10 items-center justify-center">
          <span className="absolute inset-0 rounded-2xl bg-[rgba(0,246,255,0.10)] blur" />
          <img
            src="/brand/hypeseek-icon.jpg"
            alt="HypeSeek"
            className="relative h-10 w-10 rounded-2xl border border-white/10 object-cover"
          />
        </span>
        <div>
          <div className="font-display text-sm font-semibold text-white">HypeSeek</div>
          <div className="text-xs text-white/45">Trade culture before charts</div>
        </div>
      </div>

      <div className="px-3">
        {tabs.map((t) => {
          const locked = ('locked' in t ? t.locked : false) && !authed
          const selected = active === t.key
          return (
            <button
              key={t.key}
              onClick={() => {
                if (locked) return
                setActive(t.key)
              }}
              className={`group mb-2 flex w-full items-center justify-between rounded-[18px] border px-4 py-3 text-left text-sm font-semibold transition ${
                selected
                  ? 'border-[var(--hs-cyan)]/30 bg-[rgba(0,246,255,0.10)] text-white'
                  : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/7'
              } ${locked ? 'opacity-60' : ''}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-white/70 group-hover:text-white">{t.icon}</span>
                {t.label}
              </span>
              {locked ? (
                <span className="inline-flex items-center gap-1 text-xs text-white/50">
                  <Lock className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="mt-4 px-5">
        <div className="hs-card rounded-[18px] p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/55">Session</div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
              <PulsingDot tone={authed ? 'green' : 'purple'} />
              {authed ? 'Signed in' : 'Guest'}
            </span>
          </div>
          <div className="mt-3 text-sm font-semibold text-white/85">
            {authed ? 'HypeSeekAI' : 'Public terminal'}
          </div>
          <div className="mt-1 text-xs text-white/50">
            {authed ? 'Watchlist + alerts unlocked' : 'Explore without wallet'}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {!authed ? (
              <Magnetic>
                <button
                  onClick={() => setActive('auth')}
                  className="w-full rounded-full bg-[var(--hs-cyan)] px-4 py-2 text-sm font-semibold text-black"
                >
                  Sign in
                </button>
              </Magnetic>
            ) : (
              <button
                onClick={signOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/7"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-xs text-white/40">
          HypeSeek Live Feed is a UI shell for now. Next we connect Supabase.
        </div>
      </div>
    </aside>
  )
}

function AuthModal({ open, onClose, onAuthed }: { open: boolean; onClose: () => void; onAuthed: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      className={`${open ? '' : 'pointer-events-none'} fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm`}
    >
      <motion.div
        initial={{ y: 18, opacity: 0, scale: 0.98 }}
        animate={{ y: open ? 0 : 18, opacity: open ? 1 : 0, scale: open ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="hs-card w-[92vw] max-w-md rounded-[18px] p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-display text-lg font-semibold text-white">Secure sign in</div>
            <div className="mt-1 text-sm text-[var(--hs-gray)]">
              This is a UI stub. We will wire Supabase Auth next.
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/7"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
            <div className="text-xs text-white/50">Provider</div>
            <div className="mt-1 text-sm font-semibold text-white/85">Supabase Auth (email / magic link)</div>
          </div>
          <Magnetic>
            <button
              onClick={() => {
                onAuthed()
                onClose()
              }}
              className="w-full rounded-full bg-[var(--hs-cyan)] px-4 py-3 text-sm font-semibold text-black"
            >
              Continue (demo)
            </button>
          </Magnetic>
        </div>

        <div className="mt-4 text-xs text-white/45">
          Later: add email + magic link, session persistence, and global sign out.
        </div>
      </motion.div>
    </motion.div>
  )
}

function RightPanel({ n }: { n: Narrative | null }) {
  return (
    <div className="space-y-4">
      <div className="hs-card rounded-[18px] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Sparkles className="h-4 w-4 text-[var(--hs-purple)]" />
            Narrative
          </div>
          <span className="text-xs text-white/45">Inspector</span>
        </div>

        {!n ? (
          <div className="mt-4 text-sm text-[var(--hs-gray)]">Select a narrative row to inspect.</div>
        ) : (
          <div className="mt-4">
            <div className="font-display text-lg font-semibold text-white/95">{n.title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(n.status)}`}>
                <PulsingDot tone={n.status === 'WATCH' ? 'green' : n.status === 'EARLY SIGNAL' ? 'purple' : 'cyan'} />
                {n.status}
              </span>
              <span className={`font-mono text-sm ${scoreTone(n.score)}`}>{n.score}/100</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                +{n.velocityPct}% / {n.window}
              </span>
            </div>

            <div className="mt-4 rounded-[18px] border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">Mini momentum</div>
              <div className="mt-3 h-16 rounded bg-gradient-to-r from-[rgba(0,246,255,0.18)] via-white/6 to-[rgba(168,85,247,0.18)]" />
              <div className="mt-2 text-xs text-white/45">(Chart wiring next)</div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                <Sparkles className="h-4 w-4 text-[var(--hs-cyan)]" />
                Why Now
              </div>
              <ul className="mt-2 space-y-2 text-sm text-white/80">
                {n.whyNow.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--hs-cyan)]" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="hs-card rounded-[18px] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Bell className="h-4 w-4 text-[var(--hs-cyan)]" />
            Alerts
          </div>
          <span className="text-xs text-white/45">Optional</span>
        </div>
        <div className="mt-3 text-sm text-[var(--hs-gray)]">
          Set score + velocity thresholds. (Locked until auth wiring)
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/7">
            ⭐️ Unlock Alerts
          </button>
        </div>
      </div>
    </div>
  )
}

function TableHeader({ label }: { label: string }) {
  return <div className="px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-white/45">{label}</div>
}

function Row({
  n,
  selected,
  onSelect,
}: {
  n: Narrative
  selected: boolean
  onSelect: () => void
}) {
  const hot = n.score >= 90
  const vel = n.velocityPct
  const velTone = vel >= 250 ? 'text-[var(--hs-cyan)]' : vel >= 180 ? 'text-[var(--hs-purple)]' : 'text-white/80'

  return (
    <motion.button
      onClick={onSelect}
      className={`group grid w-full grid-cols-[1.6fr_0.7fr_0.9fr_0.9fr_0.7fr_0.9fr] items-center border-t border-white/6 px-3 py-3 text-left transition hover:bg-white/4 ${
        selected ? 'bg-[rgba(0,246,255,0.06)]' : ''
      }`}
      whileHover={{ x: 2 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30">
          <Flame className={`h-4 w-4 ${hot ? 'text-[var(--hs-cyan)]' : 'text-white/55'}`} />
        </span>
        <div>
          <div className="font-display text-sm font-semibold text-white/90">
            {n.title}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">
              {n.chain ?? '—'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">
              {n.tags.slice(0, 2).join(' · ')}
            </span>
          </div>
        </div>
      </div>

      <div className={`font-mono text-sm font-semibold ${scoreTone(n.score)}`}>{n.score}</div>

      <div className={`font-mono text-sm font-semibold ${velTone}`}>+{n.velocityPct}%</div>

      <div className="text-xs text-white/60">{n.sources.join(' • ')}</div>

      <div className="font-mono text-xs text-white/55">{n.updatedAgo}</div>

      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(n.status)}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
          {n.status}
        </span>
        <ChevronRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-0.5" />
      </div>
    </motion.button>
  )
}

export function LiveFeedDashboard() {
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<'live' | 'watch' | 'alerts' | 'settings' | 'auth'>('live')
  const [authed, setAuthed] = useState(false)
  const [query, setQuery] = useState('')
  const [chain, setChain] = useState<'ALL' | 'SOL' | 'ETH' | 'BASE'>('ALL')
  const [status, setStatus] = useState<'ALL' | Narrative['status']>('ALL')
  const [selectedId, setSelectedId] = useState<string | null>('n1')

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 850)
    return () => clearTimeout(t)
  }, [])

  const data = useMemo(() => {
    const q = query.trim().toLowerCase()
    return seed
      .filter((n) => (chain === 'ALL' ? true : (n.chain ?? '—') === chain))
      .filter((n) => (status === 'ALL' ? true : n.status === status))
      .filter((n) => {
        if (!q) return true
        return (
          n.title.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.sources.some((s) => s.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => b.score - a.score)
  }, [query, status, chain])

  const selected = useMemo(() => seed.find((n) => n.id === selectedId) ?? null, [selectedId])

  const bannerX = useMotionValue(0)
  const bannerY = useMotionValue(0)
  const bx = useSpring(bannerX, { stiffness: 160, damping: 18 })
  const by = useSpring(bannerY, { stiffness: 160, damping: 18 })
  const rotateX = useTransform(by, [-40, 40], [6, -6])
  const rotateY = useTransform(bx, [-40, 40], [-6, 6])

  return (
    <div className="relative z-10 min-h-screen">
      <Preloader done={ready} />

      <AuthModal
        open={activeTab === 'auth'}
        onClose={() => setActiveTab('live')}
        onAuthed={() => setAuthed(true)}
      />

      <div className="flex">
        <Sidebar
          active={activeTab}
          setActive={(v) => setActiveTab(v as any)}
          authed={authed}
          signOut={() => setAuthed(false)}
        />

        <div className="min-h-screen w-full">
          {/* Top bar */}
          <div className="sticky top-0 z-40 border-b border-white/10 bg-black/55 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 md:flex">
                  <PulsingDot tone="cyan" />
                  <div className="text-sm font-semibold text-white/85">Live Feed</div>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 md:inline-flex">
                  <TrendingUp className="h-4 w-4 text-[var(--hs-cyan)]" />
                  Updated every few minutes
                </div>
              </div>

              <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Search className="h-4 w-4 text-white/55" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search narratives / tags / sources"
                  className="w-full bg-transparent text-sm text-white/85 placeholder:text-white/35 focus:outline-none"
                />
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/7">
                  <Moon className="h-4 w-4" />
                  Theme
                </button>
              </div>
            </div>
            <Marquee text="TRADE CULTURE BEFORE CHARTS" />
          </div>

          <main className="mx-auto max-w-[1480px] px-4 py-8">
            {/* Dex-like header strip */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6"
            >
              <motion.div variants={item} className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
                <motion.div
                  onMouseMove={(e) => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                    bannerX.set(e.clientX - (rect.left + rect.width / 2))
                    bannerY.set(e.clientY - (rect.top + rect.height / 2))
                  }}
                  onMouseLeave={() => {
                    bannerX.set(0)
                    bannerY.set(0)
                  }}
                  style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                  className="hs-card relative overflow-hidden rounded-[18px] p-6"
                >
                  <div className="absolute inset-0 opacity-60">
                    <div className="radar" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="relative inline-flex h-10 w-10 items-center justify-center">
                          <span className="absolute inset-0 rounded-2xl bg-[rgba(0,246,255,0.10)] blur" />
                          <img
                            src="/brand/hypeseek-icon.jpg"
                            alt="HypeSeek"
                            className="relative h-10 w-10 rounded-2xl border border-white/10 object-cover"
                          />
                        </span>
                        <div>
                          <div className="font-display text-2xl font-semibold text-white">HypeSeek Terminal</div>
                          <div className="mt-1 text-sm text-white/55">DexScreener layout — for viral narratives</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-semibold text-white/70">
                        <PulsingDot tone="cyan" />
                        LIVE
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80">
                        <Flame className="h-4 w-4 text-[var(--hs-purple)]" />
                        Breakouts: {seed.filter((s) => s.status === 'BREAKING').length}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80">
                        <Sparkles className="h-4 w-4 text-[var(--hs-cyan)]" />
                        Explainable scoring
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80">
                        <Grid2X2 className="h-4 w-4 text-[var(--hs-green)]" />
                        Multi-source confirmation
                      </span>
                    </div>

                    <div className="mt-5 text-sm text-[var(--hs-gray)]">
                      This is a full UI overhaul. Next step: connect Supabase tables and stream live rows.
                    </div>
                  </div>
                </motion.div>

                {/* Sticky card stack (modules) */}
                <div className="space-y-4">
                  <div className="hs-card rounded-[18px] p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white/85">Filters</div>
                      <span className="text-xs text-white/45">Dex-style</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
                        <span className="text-white/55">Chain</span>
                        <span className="font-mono text-sm text-white/85">{chain}</span>
                        <ChevronDown className="h-4 w-4 text-white/50" />
                      </div>
                      {(['ALL', 'SOL', 'ETH', 'BASE'] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => setChain(c)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            chain === c
                              ? 'border-[var(--hs-cyan)]/30 bg-[rgba(0,246,255,0.10)] text-white'
                              : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/7'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
                        Status
                      </span>
                      {(['ALL', 'BREAKING', 'EARLY SIGNAL', 'WATCH'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(s as any)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            status === s
                              ? 'border-[var(--hs-cyan)]/30 bg-[rgba(0,246,255,0.10)] text-white'
                              : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/7'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="hs-card rounded-[18px] p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white/85">Security</div>
                      <span className="text-xs text-white/45">Auth (next)</span>
                    </div>
                    <div className="mt-3 text-sm text-[var(--hs-gray)]">
                      Public feed is open. Watchlist + alerts will require secure auth.
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {!authed ? (
                        <Magnetic>
                          <button
                            onClick={() => setActiveTab('auth')}
                            className="w-full rounded-full bg-[var(--hs-cyan)] px-4 py-2 text-sm font-semibold text-black"
                          >
                            Sign in
                          </button>
                        </Magnetic>
                      ) : (
                        <button
                          onClick={() => setAuthed(false)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/7"
                        >
                          <LogOut className="h-4 w-4" />
                          Global sign out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Dex-like grid: table + right panel */}
              <motion.div variants={item} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
                <div className="hs-card overflow-hidden rounded-[18px]">
                  <div className="border-b border-white/8 bg-black/35">
                    <div className="flex items-center justify-between px-3 py-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                        <Radar className="h-4 w-4 text-[var(--hs-cyan)]" />
                        Narratives
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/7">
                          <Settings className="h-4 w-4" />
                          Columns
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/7">
                          <Lock className="h-4 w-4" />
                          Pro
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-[1.6fr_0.7fr_0.9fr_0.9fr_0.7fr_0.9fr] border-t border-white/8">
                      <TableHeader label="NARRATIVE" />
                      <TableHeader label="SCORE" />
                      <TableHeader label="VELOCITY" />
                      <TableHeader label="SOURCES" />
                      <TableHeader label="UPDATED" />
                      <TableHeader label="STATUS" />
                    </div>
                  </div>

                  <motion.div variants={container} initial="hidden" animate="show">
                    {data.map((n) => (
                      <Row
                        key={n.id}
                        n={n}
                        selected={selectedId === n.id}
                        onSelect={() => setSelectedId(n.id)}
                      />
                    ))}

                    {data.length === 0 ? (
                      <div className="px-6 py-10 text-sm text-[var(--hs-gray)]">No results.</div>
                    ) : null}
                  </motion.div>
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                  <RightPanel n={selected} />
                </div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* keyframes for marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
