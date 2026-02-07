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
import { MobileBottomNav } from '@/components/MobileNav'
import { MobileInspectorDrawer } from '@/components/MobileInspector'
import { Modal } from '@/components/ui/Modal'

type Narrative = {
  id: string
  title: string
  score?: number
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

function badgeTone(label: string) {
  if (label === 'BREAKING') {
    return 'bg-[rgba(0,255,133,0.12)] text-[var(--hs-green)] border-[var(--hs-green)]/25'
  }
  if (label === 'EARLY SIGNAL') {
    return 'bg-[rgba(0,246,255,0.12)] text-[var(--hs-cyan)] border-[var(--hs-cyan)]/25'
  }
  if (label === 'WATCH') {
    return 'bg-[rgba(255,184,0,0.10)] text-[var(--hs-amber)] border-[var(--hs-amber)]/25'
  }
  return 'bg-white/5 text-white/70 border-white/14'
}

function safeScore(score?: number) {
  if (typeof score !== 'number' || Number.isNaN(score)) return null
  return Math.round(score)
}

function scoreLabel(score?: number) {
  const s = safeScore(score)
  if (s === null) return '—'
  if (s >= 90) return 'BREAKING'
  if (s >= 75) return 'EARLY SIGNAL'
  if (s >= 50) return 'WATCH'
  return 'QUIET'
}

function scoreTone(score?: number) {
  const s = safeScore(score)
  if (s === null) return 'text-white/55'
  if (s >= 90) return 'text-[var(--hs-green)]'
  if (s >= 75) return 'text-[var(--hs-cyan)]'
  if (s >= 50) return 'text-[var(--hs-amber)]'
  return 'text-white/70'
}

function scoreBadgeTone(label: string) {
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

function PulsingDot({ tone = 'cyan' }: { tone?: 'cyan' | 'green' | 'amber' }) {
  const c =
    tone === 'green'
      ? 'bg-[var(--hs-green)]'
      : tone === 'amber'
        ? 'bg-[var(--hs-amber)]'
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
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-white/10 bg-black/45 backdrop-blur-xl lg:block">
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
              <PulsingDot tone={authed ? 'green' : 'cyan'} />
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
            <Sparkles className="h-4 w-4 text-[var(--hs-lime)]" />
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
              {(() => {
                const s = safeScore(n.score)
                const label = scoreLabel(n.score)
                const dotTone = label === 'BREAKING' ? 'green' : label === 'WATCH' ? 'amber' : 'cyan'
                return (
                  <>
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(label)}`}>
                      <PulsingDot tone={dotTone} />
                      {label}
                    </span>
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${scoreBadgeTone(label)}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                      {s === null ? '—' : `${s}/100`} • {label}
                    </span>
                  </>
                )
              })()}
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                +{n.velocityPct}% / {n.window}
              </span>
            </div>

            <div className="mt-4 rounded-[18px] border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">Mini momentum</div>
              <div className="mt-3 h-16 rounded bg-gradient-to-r from-[rgba(0,246,255,0.18)] via-white/6 to-[rgba(0,255,133,0.18)]" />
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
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-90">
      <path d={d} fill="none" stroke="rgba(0,246,255,0.95)" strokeWidth="1.8" />
      <path d={d} fill="none" stroke="rgba(0,246,255,0.18)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function mockSpark(n: Narrative) {
  const base = (safeScore(n.score) ?? 50) / 10
  const vel = n.velocityPct / 50
  const pts = Array.from({ length: 12 }, (_, i) => {
    const drift = i * (0.12 + vel * 0.02)
    const wobble = Math.sin(i * 0.9) * 0.8 + Math.cos(i * 0.35) * 0.6
    return base + drift + wobble
  })
  return pts
}

function MobileNarrativeCard({
  n,
  selected,
  onSelect,
}: {
  n: Narrative
  selected: boolean
  onSelect: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const s = safeScore(n.score)
  const label = scoreLabel(n.score)
  const hot = label === 'BREAKING'
  const vel = n.velocityPct
  const velTone = vel >= 250 ? 'text-[var(--hs-cyan)]' : vel >= 180 ? 'text-[var(--hs-amber)]' : 'text-white/80'

  return (
    <div
      className={`group relative mb-3 overflow-hidden rounded-[18px] border transition-all ${
        selected ? 'border-[var(--hs-cyan)]/40 bg-[rgba(0,246,255,0.06)]' : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="p-4" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30">
              <Flame className={`h-4 w-4 ${hot ? 'text-[var(--hs-cyan)]' : 'text-white/55'}`} />
            </span>
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold text-white/90 truncate">
                {n.title}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-white/50">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">{n.chain ?? '—'}</span>
                <span className="truncate">{n.tags.slice(0, 2).join(' · ')}</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`font-mono text-sm font-bold ${scoreTone(n.score)}`}>
              {s === null ? '—' : `${s}/100`}
            </div>
            <div className="text-[10px] font-bold text-white/40">{label}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 items-center gap-4">
          <div>
            <div className="text-[10px] font-bold tracking-wider text-white/30">VELOCITY</div>
            <div className={`font-mono text-lg font-bold ${velTone}`}>+{n.velocityPct}%</div>
          </div>
          <div className="flex justify-end">
            <Sparkline points={mockSpark(n)} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <Search className="h-3 w-3 shrink-0 text-white/30" />
            <div className="truncate text-[10px] text-white/50">{n.sources.join(' • ')}</div>
          </div>
          <div className="text-[10px] text-white/30">{n.updatedAgo}</div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
        }}
        className="flex w-full items-center justify-between border-t border-white/5 bg-white/[0.02] px-4 py-2 text-[10px] font-bold text-white/40 hover:text-white/70"
      >
        <span>WHY THIS IS MOVING</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        className="overflow-hidden bg-black/20"
      >
        <div className="p-4 pt-2">
          <ul className="space-y-2 text-[11px] leading-relaxed text-white/70">
            {n.whyNow.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--hs-cyan)]" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
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
  const s = safeScore(n.score)
  const label = scoreLabel(n.score)
  const hot = label === 'BREAKING'
  const vel = n.velocityPct
  const velTone = vel >= 250 ? 'text-[var(--hs-cyan)]' : vel >= 180 ? 'text-[var(--hs-amber)]' : 'text-white/80'

  return (
    <motion.button
      onClick={onSelect}
      className={`group grid w-full min-w-[1100px] grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,0.9fr)] items-center border-t border-white/6 px-3 py-3 text-left transition hover:bg-white/4 ${
        selected ? 'bg-[rgba(0,246,255,0.06)]' : ''
      }`}
      whileHover={{ x: 2 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30">
          <Flame className={`h-4 w-4 ${hot ? 'text-[var(--hs-cyan)]' : 'text-white/55'}`} />
        </span>
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold text-white/90 truncate">
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

      <div className="flex min-w-0 flex-col">
        <div className={`font-mono text-sm font-semibold ${scoreTone(n.score)}`}>{s === null ? '—' : `${s}/100`}</div>
        <div className="text-[11px] font-semibold text-white/45">{label}</div>
      </div>

      <div className={`font-mono text-sm font-semibold ${velTone}`}>+{n.velocityPct}%</div>

      <div className="flex items-center">
        <Sparkline points={mockSpark(n)} />
      </div>

      <div className="min-w-0">
        <div className="text-xs text-white/60 truncate">{n.sources.join(' • ')}</div>
        <div className="mt-1 text-[11px] text-white/45">Why this is moving →</div>
        <div className="mt-0.5 line-clamp-2 text-[11px] text-white/55 italic opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Engagement burst in the last 18 minutes + confirmed Reddit spike.
        </div>
      </div>

      <div className="font-mono text-xs text-white/55">{n.updatedAgo}</div>

      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(label)}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
          {label}
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
  const [platform, setPlatform] = useState<'ALL' | 'X' | 'Reddit' | 'Trends'>('ALL')
  const [status, setStatus] = useState<'ALL' | 'BREAKING' | 'EARLY SIGNAL' | 'WATCH'>('ALL')
  const [sortVel, setSortVel] = useState<'DESC' | 'ASC'>('DESC')
  const [selectedId, setSelectedId] = useState<string | null>('n1')
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [proOpen, setProOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 850)
    return () => clearTimeout(t)
  }, [])

  const data = useMemo(() => {
    const q = query.trim().toLowerCase()
    return seed
      .filter((n) => (chain === 'ALL' ? true : (n.chain ?? '—') === chain))
      .filter((n) => {
        if (platform === 'ALL') return true
        return n.sources.includes(platform)
      })
      .filter((n) => {
        if (status === 'ALL') return true
        return scoreLabel(n.score) === status
      })
      .filter((n) => {
        if (!q) return true
        return (
          n.title.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.sources.some((s) => s.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (sortVel === 'ASC') return a.velocityPct - b.velocityPct
        return b.velocityPct - a.velocityPct
      })
  }, [query, status, chain, platform, sortVel])

  const selected = useMemo(() => seed.find((n) => n.id === selectedId) ?? null, [selectedId])

  const bannerX = useMotionValue(0)
  const bannerY = useMotionValue(0)
  const bx = useSpring(bannerX, { stiffness: 160, damping: 18 })
  const by = useSpring(bannerY, { stiffness: 160, damping: 18 })
  const rotateX = useTransform(by, [-40, 40], [6, -6])
  const rotateY = useTransform(bx, [-40, 40], [-6, 6])

  return (
    <div className="relative z-10 min-h-screen pb-24 lg:pb-0">
      <Preloader done={ready} />

      <AuthModal
        open={activeTab === 'auth'}
        onClose={() => setActiveTab('live')}
        onAuthed={() => setAuthed(true)}
      />

      <div className="flex min-w-0 overflow-x-hidden">
        <Sidebar
          active={activeTab}
          setActive={(v) => setActiveTab(v as any)}
          authed={authed}
          signOut={() => setAuthed(false)}
        />

        <div className="min-h-screen w-full min-w-0 overflow-x-hidden">
          {/* Top bar */}
          <div className="sticky top-0 z-40 border-b border-white/10 bg-black/55 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-full items-center justify-between gap-3 px-3 py-3 md:px-6 2xl:px-8">
              {/* Mobile branding */}
              <div className="flex items-center gap-2 md:hidden">
                <img
                  src="/brand/hypeseek-icon.jpg"
                  alt="HypeSeek"
                  className="h-8 w-8 rounded-lg border border-white/10 object-cover"
                />
                <div>
                  <div className="text-xs font-semibold text-white">HypeSeek</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                    <PulsingDot tone="cyan" />
                    <span>LIVE</span>
                  </div>
                </div>
              </div>

              {/* Desktop branding */}
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-2">
                  <PulsingDot tone="cyan" />
                  <div className="text-sm font-semibold text-white/85">Live Feed</div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                  <TrendingUp className="h-4 w-4 text-[var(--hs-cyan)]" />
                  Updated every few minutes
                </div>
              </div>

              {/* Search bar - responsive */}
              <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 md:max-w-xl md:px-4">
                <Search className="h-4 w-4 shrink-0 text-white/55" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full min-w-0 bg-transparent text-sm text-white/85 placeholder:text-white/35 focus:outline-none"
                />
              </div>

              {/* Desktop theme button */}
              <div className="hidden items-center gap-2 md:flex">
                <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/7">
                  <Moon className="h-4 w-4" />
                  Theme
                </button>
              </div>
            </div>
            <Marquee text="TRADE CULTURE BEFORE CHARTS" />
          </div>

          <main className="mx-auto w-full max-w-full px-4 py-6 md:px-6 2xl:px-8">
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
                  style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
                  className="hs-card relative overflow-hidden rounded-[18px] p-4 md:p-6"
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
                        <Flame className="h-4 w-4 text-[var(--hs-amber)]" />
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
              <motion.div variants={item} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
                {/* Mobile feed */}
                <div className="hs-card overflow-hidden rounded-[18px] lg:hidden">
                  <div className="border-b border-white/8 bg-black/35 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                        <Radar className="h-4 w-4 text-[var(--hs-cyan)]" />
                        Narratives
                      </div>
                      <button
                        onClick={() => setProOpen(true)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75"
                      >
                        ⭐️ Alerts
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {(['ALL', 'X', 'Reddit', 'Trends'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlatform(p)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            platform === p
                              ? 'border-[var(--hs-cyan)]/30 bg-[rgba(0,246,255,0.10)] text-white'
                              : 'border-white/10 bg-white/5 text-white/70'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      {(['ALL', 'BREAKING', 'EARLY SIGNAL', 'WATCH'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(s)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            status === s
                              ? 'border-[var(--hs-cyan)]/30 bg-[rgba(0,246,255,0.10)] text-white'
                              : 'border-white/10 bg-white/5 text-white/70'
                          }`}
                        >
                          {s === 'EARLY SIGNAL' ? 'EARLY' : s}
                        </button>
                      ))}
                      <button
                        onClick={() => setSortVel((v) => (v === 'DESC' ? 'ASC' : 'DESC'))}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80"
                      >
                        Vel {sortVel === 'DESC' ? '↓' : '↑'}
                      </button>
                    </div>

                    <div className="relative mt-3">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search narratives"
                        className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:border-[var(--hs-cyan)]/35"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-white/6">
                    {data.map((n) => {
                      const s = safeScore(n.score)
                      const label = scoreLabel(n.score)
                      return (
                        <button
                          key={n.id}
                          onClick={() => {
                            setSelectedId(n.id)
                            setMobileInspectorOpen(true)
                          }}
                          className="w-full px-4 py-4 text-left hover:bg-white/4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-display text-sm font-semibold text-white/90">{n.title}</div>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${scoreBadgeTone(label)}`}>
                                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                                  {s === null ? '—' : `${s}/100`} • {label}
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                                  +{n.velocityPct}%
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0">
                              <Sparkline points={mockSpark(n)} />
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-white/60">{n.sources.join(' • ')}</div>

                          <div className="mt-2 text-[11px] text-white/45">Why this is moving →</div>
                          <div className="mt-0.5 line-clamp-2 text-[11px] text-white/55 italic">
                            Engagement burst in the last 18 minutes + confirmed Reddit spike.
                          </div>
                        </button>
                      )
                    })}

                    {data.length === 0 ? (
                      <div className="px-4 py-10 text-sm text-[var(--hs-gray)]">No results.</div>
                    ) : null}
                  </div>
                </div>

                {/* Desktop table */}
                <div className="hs-card relative hidden overflow-hidden rounded-[18px] lg:block">
                  <div className="border-b border-white/8 bg-black/35">
                    <div className="flex items-center justify-between px-3 py-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                        <Radar className="h-4 w-4 text-[var(--hs-cyan)]" />
                        Narratives
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setColumnsOpen(true)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/7"
                        >
                          <Settings className="h-4 w-4" />
                          Columns
                        </button>
                        <button
                          onClick={() => setProOpen(true)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/7"
                        >
                          <Lock className="h-4 w-4" />
                          Pro
                        </button>
                      </div>
                    </div>

                    {/* 5) Filter + sort bar (Dex-style) */}
                    <div className="border-t border-white/8 bg-black/35 px-3 py-3">
                      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75">
                            Platform
                            <ChevronDown className="h-4 w-4 text-white/50" />
                          </div>
                          {(['ALL', 'X', 'Reddit', 'Trends'] as const).map((p) => (
                            <button
                              key={p}
                              onClick={() => setPlatform(p)}
                              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                platform === p
                                  ? 'border-[var(--hs-cyan)]/30 bg-[rgba(0,246,255,0.10)] text-white'
                                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/7'
                              }`}
                            >
                              {p}
                            </button>
                          ))}

                          <div className="ml-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 lg:ml-2">
                            Status
                            <ChevronDown className="h-4 w-4 text-white/50" />
                          </div>
                          {(['ALL', 'BREAKING', 'EARLY SIGNAL', 'WATCH'] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => setStatus(s)}
                              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                status === s
                                  ? 'border-[var(--hs-cyan)]/30 bg-[rgba(0,246,255,0.10)] text-white'
                                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/7'
                              }`}
                            >
                              {s}
                            </button>
                          ))}

                          <button
                            onClick={() => setSortVel((v) => (v === 'DESC' ? 'ASC' : 'DESC'))}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/7"
                            title="Sort by velocity"
                          >
                            Velocity {sortVel === 'DESC' ? '↓' : '↑'}
                          </button>
                        </div>

                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                          <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search narratives"
                            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white/85 placeholder:text-white/35 outline-none transition focus:border-[var(--hs-cyan)]/35 focus:shadow-[0_0_0_3px_rgba(0,246,255,0.10)] lg:w-[320px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid min-w-[1100px] grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,0.9fr)] border-t border-white/8">
                      <TableHeader label="NARRATIVE" />
                      <TableHeader label="SCORE" />
                      <TableHeader label="VELOCITY" />
                      <TableHeader label="TREND" />
                      <TableHeader label="SOURCES / WHY" />
                      <TableHeader label="UPDATED" />
                      <TableHeader label="STATUS" />
                    </div>
                  </div>

                  <motion.div variants={container} initial="hidden" animate="show" className="min-w-[1100px] overflow-x-auto">
                    {data.map((n) => (
                      <Row
                        key={n.id}
                        n={n}
                        selected={selectedId === n.id}
                        onSelect={() => {
                          setSelectedId(n.id)
                          setMobileInspectorOpen(true)
                        }}
                      />
                    ))}

                    {data.length === 0 ? (
                      <div className="px-6 py-10 text-sm text-[var(--hs-gray)]">No results.</div>
                    ) : null}
                  </motion.div>
                </div>

                <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
                  <RightPanel n={selected} />
                </div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Modals (UI-only) */}
      <Modal open={columnsOpen} onClose={() => setColumnsOpen(false)} title="Columns">
        <div className="space-y-3">
          <div className="text-white/70">UI-only for now. Backend wiring later.</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Score', 'Velocity', 'Trend', 'Sources', 'Updated', 'Status'].map((c) => (
              <div key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/80">
                {c}
              </div>
            ))}
          </div>
          <div className="text-xs text-white/45">(Coming next: persist column prefs in local storage.)</div>
        </div>
      </Modal>

      <Modal open={proOpen} onClose={() => setProOpen(false)} title="Unlock Alerts (Optional)">
        <div className="space-y-3">
          <div className="text-white/80">
            Wallet is only used for alerts + watchlists. Not required to view trends.
          </div>
          <ul className="space-y-2 text-sm text-white/75">
            <li>• Alerts</li>
            <li>• Personal watchlists</li>
            <li>• Anti-bot protection</li>
            <li>• Future automation tools</li>
          </ul>
          <button
            onClick={() => {
              setProOpen(false)
              setActiveTab('alerts')
            }}
            className="w-full rounded-full bg-[var(--hs-cyan)] px-4 py-3 text-sm font-semibold text-black"
          >
            Go to Alerts
          </button>
        </div>
      </Modal>

      {/* Mobile inspector drawer */}
      <MobileInspectorDrawer
        open={mobileInspectorOpen}
        onClose={() => setMobileInspectorOpen(false)}
        title={selected ? selected.title : 'Narrative'}
      >
        {/* reuse the right panel content on mobile */}
        <div className="hs-card rounded-[18px] p-4">
          <RightPanel n={selected} />
        </div>
      </MobileInspectorDrawer>

      {/* Mobile bottom nav */}
      <MobileBottomNav active={activeTab} setActive={(v) => setActiveTab(v as any)} />

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
