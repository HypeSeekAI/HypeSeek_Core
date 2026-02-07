'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChevronRight,
  Grid2X2,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { rise, staggerIn } from '@/lib/motion'

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">
      {children}
    </span>
  )
}

function ButtonPrimary({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--hs-cyan)] px-5 py-3 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(0,246,255,0.28),0_18px_60px_rgba(0,246,255,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(0,246,255,0.36),0_22px_70px_rgba(0,246,255,0.14)]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

function ButtonGhost({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/8"
    >
      {children}
    </Link>
  )
}

function Surface({ children }: { children: React.ReactNode }) {
  return <div className="hs-card rounded-[18px]">{children}</div>
}

function TerminalMock() {
  return (
    <Surface>
      <div className="relative overflow-hidden rounded-[18px]">
        <div className="absolute inset-0 opacity-70">
          <div className="radar" />
        </div>

        {/* slow scan */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(0,255,133,0.10)] to-transparent"
          initial={{ y: -120, opacity: 0.0 }}
          animate={{ y: 420, opacity: 1 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
              <Radar className="h-4 w-4 text-[var(--hs-cyan)]" />
              Live Narratives
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-semibold text-white/70">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hs-green)] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--hs-green)]" />
              </span>
              updated 0.3s ago
            </span>
          </div>

          <div className="mt-4 rounded-[18px] border border-white/10 bg-black/35 p-4">
            <div className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.7fr] gap-3 border-b border-white/8 pb-3 text-[11px] font-semibold tracking-[0.2em] text-white/45">
              <div>NARRATIVE</div>
              <div>SCORE</div>
              <div>VELOCITY</div>
              <div>SOURCES</div>
            </div>
            <div className="divide-y divide-white/6">
              {[
                { t: 'AI Agents + Solana Meta', s: '92', v: '+340%', src: 'X • Reddit • Trends' },
                { t: 'Trump Meme Resurgence', s: '88', v: '+210%', src: 'X • Trends' },
                { t: 'Epstein Files Coin Wave', s: '81', v: '+160%', src: 'X • Reddit' },
              ].map((r) => (
                <div
                  key={r.t}
                  className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.7fr] gap-3 py-3 text-sm"
                >
                  <div className="truncate font-semibold text-white/85">{r.t}</div>
                  <div className="font-mono font-semibold text-[var(--hs-cyan)]">{r.s}</div>
                  <div className="font-mono font-semibold text-[var(--hs-green)]">{r.v}</div>
                  <div className="truncate text-xs text-white/55">{r.src}</div>
                </div>
              ))}
            </div>
          </div>

          {/* tape */}
          <div className="mt-4 flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/60">
            <span className="font-mono text-[var(--hs-green)]">BUY</span>
            <span className="font-mono">AIAGENT</span>
            <span className="text-white/35">•</span>
            <span className="font-mono">+12.4%</span>
            <span className="text-white/35">•</span>
            <span className="font-mono">0.8s</span>
            <span className="mx-2 h-3 w-px bg-white/10" />
            <span className="font-mono text-[var(--hs-red)]">SELL</span>
            <span className="font-mono">TREND</span>
            <span className="text-white/35">•</span>
            <span className="font-mono">-3.1%</span>
            <span className="text-white/35">•</span>
            <span className="font-mono">1.2s</span>
          </div>
        </div>
      </div>
    </Surface>
  )
}

export function LandingPage() {
  return (
    <div className="noise relative z-10">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-4 py-3 md:px-6 2xl:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center">
              <span className="absolute inset-0 rounded-2xl bg-[rgba(0,246,255,0.10)] blur" />
              <img
                src="/brand/hypeseek-icon.jpg"
                alt="HypeSeek"
                className="relative h-9 w-9 rounded-2xl border border-white/10 object-cover"
              />
            </span>
            <span className="font-display text-lg font-semibold text-white">HypeSeek</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-white/70 md:flex">
            <Link href="/live-feed" className="hover:text-white">
              Live Feed
            </Link>
            <Link href="#how" className="hover:text-white">
              How It Works
            </Link>
            <Link href="/alerts" className="hover:text-white">
              Alerts
            </Link>
            <Link href="/docs" className="hover:text-white">
              Docs
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="rounded-full border border-white/14 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/8"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="radar" />
        </div>

        <div className="mx-auto w-full max-w-[1480px] px-4 py-14 md:px-6 2xl:px-8">
          <motion.div variants={staggerIn} initial="hidden" animate="show" className="grid gap-10 lg:grid-cols-[1.05fr_1fr]">
            <div className="relative z-10">
              <motion.div variants={rise} className="flex flex-wrap items-center gap-2">
                <Chip>
                  <Sparkles className="h-4 w-4 text-[var(--hs-lime)]" />
                  Virality intelligence terminal
                </Chip>
                <Chip>
                  <ShieldCheck className="h-4 w-4 text-[var(--hs-cyan)]" />
                  Explainable score
                </Chip>
                <Chip>
                  <TrendingUp className="h-4 w-4 text-[var(--hs-green)]" />
                  Updated every few minutes
                </Chip>
              </motion.div>

              <motion.h1 variants={rise} className="mt-6 font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Trade culture
                <span className="text-white/60"> before charts.</span>
              </motion.h1>

              <motion.p variants={rise} className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                HypeSeek is a real-time virality terminal that detects emerging narratives 1–2 hours before they hit mainstream crypto.
              </motion.p>

              <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonPrimary href="/live-feed">View Live Feed (No Wallet Needed)</ButtonPrimary>
                <ButtonGhost href="/alerts">Unlock Alerts (Optional)</ButtonGhost>
              </motion.div>

              <motion.div variants={rise} className="mt-6 text-sm text-[var(--hs-gray)]">
                Built for narrative traders, memecoin hunters, and cultural signal analysts.
              </motion.div>

              {/* credibility strip */}
              <motion.div variants={rise} className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { icon: <Radar className="h-4 w-4 text-[var(--hs-cyan)]" />, t: 'Realtime scanner' },
                  { icon: <Grid2X2 className="h-4 w-4 text-[var(--hs-green)]" />, t: 'Cross-platform' },
                  { icon: <Bell className="h-4 w-4 text-[var(--hs-amber)]" />, t: 'Alerts' },
                  { icon: <BookOpen className="h-4 w-4 text-white/70" />, t: 'Docs + proofs' },
                ].map((b) => (
                  <div key={b.t} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80">
                    <div className="flex items-center gap-2">{b.icon}{b.t}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div variants={rise} className="relative z-10">
              <TerminalMock />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive demo blocks */}
      <section id="how" className="mx-auto w-full max-w-[1480px] px-4 py-14 md:px-6 2xl:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            <Sparkles className="h-4 w-4 text-[var(--hs-lime)]" />
            Instant proof
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">
            DexScreener-grade trust. Narrative-grade alpha.
          </h2>
          <p className="mt-3 text-sm text-[var(--hs-gray)] md:text-base">
            Familiar layout, better signal: velocity, confirmation, and an explainable “Why Now”.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              title: 'Scanner',
              body: 'Filter by chain, status, and velocity. Spot breakouts fast.',
              icon: <Search className="h-5 w-5 text-[var(--hs-cyan)]" />,
              href: '/live-feed',
            },
            {
              title: 'Why Now',
              body: 'Every spike includes reasoning, not just raw numbers.',
              icon: <Sparkles className="h-5 w-5 text-[var(--hs-lime)]" />,
              href: '/live-feed',
            },
            {
              title: 'Alerts',
              body: 'Get pinged when a narrative crosses your thresholds.',
              icon: <Bell className="h-5 w-5 text-[var(--hs-amber)]" />,
              href: '/alerts',
            },
          ].map((c) => (
            <div key={c.title} className="hs-card hs-glow rounded-[18px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/30">
                    {c.icon}
                  </div>
                  <div className="font-display text-lg font-semibold text-white">{c.title}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/35" />
              </div>
              <div className="mt-3 text-sm text-[var(--hs-gray)]">{c.body}</div>
              <Link href={c.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
                Open <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6 2xl:px-8">
          <div className="text-sm text-white/70">HypeSeek © 2026</div>
          <div className="flex items-center gap-5 text-sm text-white/60">
            <Link href="/docs" className="hover:text-white">Docs</Link>
            <a href="https://x.com/HypeSeekAI" target="_blank" rel="noreferrer" className="hover:text-white">
              X/Twitter
            </a>
            <Link href="#privacy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
