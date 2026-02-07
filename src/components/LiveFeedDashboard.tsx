'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Filter,
  Flame,
  Grid2X2,
  Radar,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'

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
}

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
    updatedAgo: '2m ago',
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
    updatedAgo: '4m ago',
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
    updatedAgo: '7m ago',
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
    updatedAgo: '10m ago',
  },
]

const container: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

const item: any = {
  hidden: { opacity: 0, y: 12 },
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

function SkeletonRow() {
  return (
    <div className="hs-card rounded-[18px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="h-4 w-2/3 rounded bg-white/8" />
          <div className="mt-3 h-3 w-1/2 rounded bg-white/6" />
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="h-10 rounded bg-white/6" />
            <div className="h-10 rounded bg-white/6" />
            <div className="h-10 rounded bg-white/6" />
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-white/6" />
      </div>
    </div>
  )
}

function TopBar({
  query,
  setQuery,
}: {
  query: string
  setQuery: (v: string) => void
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/7"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
          <div className="hidden items-center gap-2 md:flex">
            <span className="relative inline-flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[rgba(0,246,255,0.10)] blur" />
              <img
                src="/brand/hypeseek-icon.jpg"
                alt="HypeSeek"
                className="relative h-8 w-8 rounded-full object-cover"
              />
            </span>
            <div className="font-display text-sm font-semibold text-white/90">HypeSeek Live Feed</div>
          </div>
        </div>

        <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <Search className="h-4 w-4 text-white/55" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search narratives, tags, sources…"
            className="w-full bg-transparent text-sm text-white/85 placeholder:text-white/35 focus:outline-none"
          />
          <span className="hidden rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[11px] text-white/60 md:inline-flex">
            ⌘K
          </span>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#alerts"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/7"
          >
            <Bell className="h-4 w-4 text-[var(--hs-cyan)]" />
            Alerts
          </a>
        </div>
      </div>
    </header>
  )
}

function DetailPanel({ narrative }: { narrative: Narrative | null }) {
  if (!narrative) {
    return (
      <div className="hs-card rounded-[18px] p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Radar className="h-4 w-4 text-[var(--hs-cyan)]" />
          Narrative Inspector
        </div>
        <div className="mt-3 text-sm text-[var(--hs-gray)]">
          Select a narrative to see “Why Now”, sources, and score breakdown.
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-10 rounded bg-white/6" />
          <div className="h-10 rounded bg-white/6" />
          <div className="h-10 rounded bg-white/6" />
        </div>
      </div>
    )
  }

  return (
    <div className="hs-card rounded-[18px] p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-xl font-semibold text-white/95">{narrative.title}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(
                narrative.status
              )}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
              {narrative.status}
            </span>
            <span className={`font-mono text-sm ${scoreTone(narrative.score)}`}>
              {narrative.score}/100
            </span>
          </div>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/7"
        >
          Open thread <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
          <div className="text-xs text-[var(--hs-gray)]">Velocity</div>
          <div className="mt-1 font-mono text-sm text-white/90">
            +{narrative.velocityPct}% / {narrative.window}
          </div>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
          <div className="text-xs text-[var(--hs-gray)]">Sources</div>
          <div className="mt-1 font-mono text-sm text-white/90">{narrative.sources.join(' • ')}</div>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
          <div className="text-xs text-[var(--hs-gray)]">Updated</div>
          <div className="mt-1 font-mono text-sm text-white/90">{narrative.updatedAgo}</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Sparkles className="h-4 w-4 text-[var(--hs-purple)]" />
          Why Now
        </div>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          {narrative.whyNow.map((w, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--hs-cyan)]" />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Grid2X2 className="h-4 w-4 text-[var(--hs-green)]" />
          Tags
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {narrative.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div id="alerts" className="mt-8 rounded-[18px] border border-white/10 bg-gradient-to-b from-white/6 to-white/2 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-lg font-semibold text-white">Unlock alerts (optional)</div>
            <div className="mt-1 text-sm text-[var(--hs-gray)]">
              Get notified when a narrative crosses your score/velocity thresholds.
            </div>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--hs-cyan)] px-4 py-2 text-sm font-semibold text-black"
          >
            <Bell className="h-4 w-4" /> ⭐️ Unlock Alerts
          </a>
        </div>
      </div>
    </div>
  )
}

export function LiveFeedDashboard() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'ALL' | Narrative['status']>('ALL')
  const [selectedId, setSelectedId] = useState<string | null>('n1')

  const data = useMemo(() => {
    const q = query.trim().toLowerCase()
    return seed
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
  }, [query, status])

  const selected = useMemo(
    () => seed.find((n) => n.id === selectedId) ?? null,
    [selectedId]
  )

  return (
    <div className="relative z-10 min-h-screen">
      <TopBar query={query} setQuery={setQuery} />

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                <Flame className="h-4 w-4 text-[var(--hs-purple)]" />
                Live narratives (preview)
              </div>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                View Live Feed
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[var(--hs-gray)] md:text-base">
                DexScreener-grade trust, but for viral narratives. This is a UI shell with static examples — next we wire Supabase.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
                <TrendingUp className="h-4 w-4 text-[var(--hs-cyan)]" />
                Updated every few minutes
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
                <SlidersHorizontal className="h-4 w-4 text-[var(--hs-green)]" />
                Explainable scoring
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="hs-card rounded-[18px] p-6">
              <div className="text-xs text-[var(--hs-gray)]">Breakouts</div>
              <div className="mt-2 font-display text-3xl font-semibold text-white">{seed.filter((s) => s.status === 'BREAKING').length}</div>
              <div className="mt-3 text-sm text-white/65">90+ score narratives right now</div>
            </div>
            <div className="hs-card rounded-[18px] p-6">
              <div className="text-xs text-[var(--hs-gray)]">Early signals</div>
              <div className="mt-2 font-display text-3xl font-semibold text-white">{seed.filter((s) => s.status === 'EARLY SIGNAL').length}</div>
              <div className="mt-3 text-sm text-white/65">Before the chart reacts</div>
            </div>
            <div className="hs-card rounded-[18px] p-6">
              <div className="text-xs text-[var(--hs-gray)]">Watchlist</div>
              <div className="mt-2 font-display text-3xl font-semibold text-white">12</div>
              <div className="mt-3 text-sm text-white/65">(demo) Save narratives & creators</div>
            </div>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
              <Filter className="h-4 w-4" />
              Status:
            </div>
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
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr]">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {data.length === 0 ? (
                <motion.div variants={item} className="hs-card rounded-[18px] p-8">
                  <div className="font-display text-lg font-semibold text-white">No results</div>
                  <div className="mt-2 text-sm text-[var(--hs-gray)]">Try a different query or filter.</div>
                </motion.div>
              ) : (
                data.map((n) => (
                  <motion.button
                    key={n.id}
                    variants={item}
                    onClick={() => setSelectedId(n.id)}
                    className={`hs-card hs-glow w-full rounded-[18px] p-5 text-left transition ${
                      selectedId === n.id ? 'border-[var(--hs-cyan)]/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-display text-lg font-semibold text-white/95">{n.title}</div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(
                              n.status
                            )}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                            {n.status}
                          </span>
                          <span className={`font-mono text-sm ${scoreTone(n.score)}`}>{n.score}/100</span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                            +{n.velocityPct}% / {n.window}
                          </span>
                          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-semibold text-white/55">
                            {n.updatedAgo}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-2 text-xs text-white/55">
                        <span className="font-mono">inspect</span>
                        <ChevronRight className="h-4 w-4 opacity-60" />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-[var(--hs-gray)]">Sources</div>
                        <div className="mt-1 font-mono text-xs text-white/85">{n.sources.join(' • ')}</div>
                      </div>
                      <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-[var(--hs-gray)]">Signal</div>
                        <div className="mt-1 text-xs text-white/80">Format + emotion + graph</div>
                      </div>
                      <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-[var(--hs-gray)]">Action</div>
                        <div className="mt-1 text-xs text-white/80">Watch / Alert / Share</div>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}

              {/* Skeleton loaders (demo of loading states) */}
              <motion.div variants={item} className="hidden">
                <SkeletonRow />
              </motion.div>
            </motion.div>

            <motion.div variants={item} initial="hidden" animate="show" className="lg:sticky lg:top-24 lg:self-start">
              <DetailPanel narrative={selected} />
            </motion.div>
          </div>

          <motion.div variants={item} className="mt-10 hs-card rounded-[18px] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-display text-lg font-semibold text-white">Next: wire real data</div>
                <div className="mt-1 text-sm text-[var(--hs-gray)]">
                  We’ll connect Supabase, stream live rows, and add a narrative detail drawer + charts.
                </div>
              </div>
              <a
                href="https://github.com/HypeSeekAI/HypeSeek_Core"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/7"
              >
                Repo <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
