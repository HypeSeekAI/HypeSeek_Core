'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Modal } from '@/components/ui/Modal'

type TrendingPost = {
  id: string
  post_id: string
  author_handle: string
  content_snippet: string | null
  initial_engagement: any | null
  predicted_at: string | null
  prediction_confidence: number | null
  reasoning: string | null
  content_type: string | null
  has_media: boolean | null
  media_type: string | null
  status: string | null
  reddit_confirmed: boolean | null
  google_trends_confirmed: boolean | null
  hype_score: number | null
  velocity: number | null
  metadata: any | null
  created_at: string | null
  updated_at: string | null
}

function toXUrl(postId: string) {
  // We don't always have username/handle-to-url mapping. Use a stable intent URL.
  return `https://x.com/i/web/status/${postId}`
}

export function LiveFeedSupabase() {
  const [rows, setRows] = useState<TrendingPost[]>([])
  const [selected, setSelected] = useState<TrendingPost | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const res = await supabase
        .from('trending_posts')
        .select('*')
        .order('predicted_at', { ascending: false })
        .limit(200)

      if (res.error) {
        if (!cancelled) setRows([])
        return
      }

      if (!cancelled) setRows(res.data ?? [])
    }

    load()
    const t = setInterval(load, 30_000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  const list = useMemo(() => rows, [rows])

  return (
    <div className="hs-card rounded-[18px] overflow-hidden">
      <div className="border-b border-white/10 bg-black/35 px-4 py-3">
        <div className="text-sm font-semibold text-white/85">Live Feed</div>
        <div className="text-xs text-white/45">Pulled from Supabase (no hardcoded UI seed).</div>
      </div>

      {list.length === 0 ? (
        <div className="p-6 text-sm text-white/60">No rows yet in <span className="font-mono">trending_posts</span>.</div>
      ) : (
        <div className="divide-y divide-white/5">
          {list.map((p) => {
            const score = p.hype_score ?? 0
            const conf = p.prediction_confidence
            const vel = p.velocity
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="w-full text-left px-4 py-4 hover:bg-white/5 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white/90 truncate">
                      @{p.author_handle}
                      <span className="text-white/35"> · </span>
                      <span className="font-mono text-white/65">{p.post_id}</span>
                    </div>
                    <div className="mt-1 text-xs text-white/55 line-clamp-2">
                      {p.content_snippet ?? p.reasoning ?? ''}
                    </div>
                    <div className="mt-2 text-[11px] text-white/40">
                      {p.predicted_at ? `predicted: ${new Date(p.predicted_at).toISOString()}` : 'predicted: —'}
                      {p.status ? ` · ${p.status}` : ''}
                      {p.content_type ? ` · ${p.content_type}` : ''}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="font-mono text-lg font-bold text-[var(--hs-cyan)]">{score}</div>
                    <div className="text-[11px] text-white/45">
                      {typeof conf === 'number' ? `conf ${conf}` : 'conf —'}
                      {typeof vel === 'number' ? ` · vel ${vel}` : ''}
                    </div>
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
        title={selected ? `@${selected.author_handle} · ${selected.post_id}` : ''}
      >
        {selected ? (
          <div className="space-y-4">
            <a
              href={toXUrl(selected.post_id)}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[var(--hs-cyan)] hover:underline"
            >
              Open on X →
            </a>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">Hype score</div>
              <div className="mt-1 font-mono text-3xl font-bold text-[var(--hs-cyan)]">
                {selected.hype_score ?? 0}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-[var(--hs-cyan)] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, selected.hype_score ?? 0))}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-white/55">
                confidence: <span className="font-mono">{selected.prediction_confidence ?? '—'}</span>
                {selected.velocity != null ? (
                  <>
                    {' '}
                    · velocity: <span className="font-mono">{selected.velocity}</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">Why now</div>
              <div className="mt-2 text-sm text-white/80">{selected.reasoning ?? '—'}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">Signals</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/70">
                  reddit: <span className="font-mono">{String(!!selected.reddit_confirmed)}</span>
                </span>
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/70">
                  trends: <span className="font-mono">{String(!!selected.google_trends_confirmed)}</span>
                </span>
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/70">
                  media: <span className="font-mono">{String(!!selected.has_media)}</span>
                </span>
                {selected.media_type ? (
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/70">
                    media_type: <span className="font-mono">{selected.media_type}</span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/50">Raw engagement snapshot</div>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/50 p-3 text-xs text-white/70">
                {JSON.stringify(selected.initial_engagement ?? {}, null, 2)}
              </pre>
            </div>

            <details className="rounded-xl border border-white/10 bg-black/30 p-4">
              <summary className="cursor-pointer text-xs font-semibold text-white/60">raw metadata</summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/50 p-3 text-xs text-white/70">
                {JSON.stringify(selected.metadata ?? {}, null, 2)}
              </pre>
            </details>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
