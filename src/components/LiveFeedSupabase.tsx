'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Modal } from '@/components/ui/Modal'

type XPost = {
  post_id: string
  url: string
  author_handle: string | null
  lang: string | null
  post_created_at: string | null
  text: string | null
  public_metrics: any | null
  has_media: boolean | null
  updated_at: string
}

type GrokReport = {
  id: string
  run_id: string
  post_id: string
  grok_match: string | null
  grok_summary: string | null
  grok_details: any | null
  potential_score: number | null
  inserted_at: string
}

export function LiveFeedSupabase() {
  const [posts, setPosts] = useState<(XPost & { latestReport?: GrokReport })[]>([])
  const [selected, setSelected] = useState<(XPost & { latestReport?: GrokReport }) | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      // Load latest reports, then join posts client-side (simple v1).
      const reportsRes = await supabase
        .from('grok_post_reports')
        .select('*')
        .order('inserted_at', { ascending: false })
        .limit(200)

      if (reportsRes.error) return

      const latestByPost = new Map<string, GrokReport>()
      for (const r of reportsRes.data ?? []) {
        if (!latestByPost.has(r.post_id)) latestByPost.set(r.post_id, r)
      }

      const ids = [...latestByPost.keys()].slice(0, 60)
      if (ids.length === 0) {
        if (!cancelled) setPosts([])
        return
      }

      const postsRes = await supabase
        .from('x_posts')
        .select('*')
        .in('post_id', ids)

      if (postsRes.error) return

      const merged = (postsRes.data ?? [])
        .map((p) => ({ ...p, latestReport: latestByPost.get(p.post_id) }))
        .sort((a, b) => {
          const ap = a.latestReport?.potential_score ?? 0
          const bp = b.latestReport?.potential_score ?? 0
          return bp - ap
        })

      if (!cancelled) setPosts(merged)
    }

    load()
    const t = setInterval(load, 30_000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  const rows = useMemo(() => posts, [posts])

  return (
    <div className="hs-card rounded-[18px] overflow-hidden">
      <div className="border-b border-white/10 bg-black/35 px-4 py-3">
        <div className="text-sm font-semibold text-white/85">Live Feed (Real Data)</div>
        <div className="text-xs text-white/45">No placeholders. Pulled from Supabase.</div>
      </div>

      {rows.length === 0 ? (
        <div className="p-6 text-sm text-white/60">
          No imported posts yet. Run a Grok scan and paste the IDs → we import.
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {rows.map((p) => {
            const score = p.latestReport?.potential_score ?? 0
            const match = p.latestReport?.grok_match ?? '—'
            return (
              <button
                key={p.post_id}
                onClick={() => setSelected(p)}
                className="w-full text-left px-4 py-4 hover:bg-white/5 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white/90 truncate">
                      {p.author_handle ?? '—'}
                      <span className="text-white/35"> · </span>
                      <span className="font-mono text-white/65">{p.post_id}</span>
                    </div>
                    <div className="mt-1 text-xs text-white/55 line-clamp-2">
                      {p.latestReport?.grok_summary ?? p.text ?? ''}
                    </div>
                    <div className="mt-2 text-[11px] text-white/40">
                      {p.post_created_at ? new Date(p.post_created_at).toISOString() : 'timestamp: —'}
                      {p.lang ? ` · lang:${p.lang}` : ''}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-lg font-bold text-[var(--hs-cyan)]">{score}</div>
                    <div className="text-[11px] text-white/45">match {match}</div>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[var(--hs-cyan)]"
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.author_handle ?? '—'} · ${selected.post_id}` : ''}
      >
        {selected ? (
          <div className="space-y-4">
            <a
              href={selected.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[var(--hs-cyan)] hover:underline"
            >
              Open on X →
            </a>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">Potential</div>
              <div className="mt-1 font-mono text-3xl font-bold text-[var(--hs-cyan)]">
                {selected.latestReport?.potential_score ?? 0}/100
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-[var(--hs-cyan)] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, selected.latestReport?.potential_score ?? 0))}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">Grok report</div>
              <div className="mt-2 text-sm text-white/80">
                {selected.latestReport?.grok_summary ?? '—'}
              </div>
              <div className="mt-2 text-xs text-white/55">
                match: <span className="font-mono">{selected.latestReport?.grok_match ?? '—'}</span>
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-semibold text-white/60">raw grok_details</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/50 p-3 text-xs text-white/70">
                  {JSON.stringify(selected.latestReport?.grok_details ?? {}, null, 2)}
                </pre>
              </details>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">X snapshot</div>
              <div className="mt-2 text-xs text-white/55">
                posted_at: {selected.post_created_at ? new Date(selected.post_created_at).toISOString() : '—'}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/70 sm:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">❤️ <span className="font-mono">{selected.public_metrics?.like_count ?? '—'}</span></div>
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">💬 <span className="font-mono">{selected.public_metrics?.reply_count ?? '—'}</span></div>
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">🔁 <span className="font-mono">{selected.public_metrics?.retweet_count ?? '—'}</span></div>
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">👁️ <span className="font-mono">{selected.public_metrics?.impression_count ?? '—'}</span></div>
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-semibold text-white/60">raw post text</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/50 p-3 text-xs text-white/70">
                  {selected.text ?? ''}
                </pre>
              </details>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
