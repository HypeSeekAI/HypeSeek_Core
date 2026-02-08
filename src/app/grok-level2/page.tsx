import Link from 'next/link'
import { grokLevel2Seed } from '@/lib/grokLevel2Seed'

type XPublicMetrics = {
  like_count: number
  reply_count: number
  retweet_count: number
  quote_count: number
  bookmark_count?: number
  impression_count?: number
}

type XT = {
  id: string
  text: string
  created_at: string
  lang?: string
  public_metrics: XPublicMetrics
}

async function fetchTweets(ids: string[]): Promise<Record<string, XT>> {
  const token = process.env.X_BEARER_TOKEN
  if (!token) return {}

  const url = new URL('https://api.twitter.com/2/tweets')
  url.searchParams.set('ids', ids.join(','))
  url.searchParams.set(
    'tweet.fields',
    'created_at,public_metrics,lang,author_id,conversation_id,attachments'
  )

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    // avoid Next caching stale metrics for now
    cache: 'no-store',
  })

  if (!res.ok) return {}
  const json = (await res.json()) as { data?: XT[] }
  const out: Record<string, XT> = {}
  for (const t of json.data ?? []) out[t.id] = t
  return out
}

export default async function GrokLevel2Page() {
  const ids = grokLevel2Seed.map((x) => x.postId)
  const tweets = await fetchTweets(ids)

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Grok Level 2 — Imported Posts</h1>
        <p className="mt-2 text-sm text-white/60">
          Seeded from Grok-on-X output, then verified/enriched via X API (created_at + public_metrics).
        </p>
        <p className="mt-2 text-xs text-white/40">
          If you see missing metrics, set <code className="rounded bg-white/10 px-1">X_BEARER_TOKEN</code> on the server.
        </p>
        <div className="mt-3 text-sm">
          <Link className="text-cyan-300 hover:underline" href="/live-feed">
            ← Back to Live Feed
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {grokLevel2Seed.map((row) => {
          const t = tweets[row.postId]
          const pm = t?.public_metrics
          return (
            <div
              key={row.postId}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white/90">
                    {row.authorHandle}{' '}
                    <span className="text-white/40">·</span>{' '}
                    <a
                      className="text-cyan-300 hover:underline"
                      href={`https://x.com/i/web/status/${row.postId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.postId}
                    </a>
                  </div>
                  <div className="mt-1 text-xs text-white/55">
                    Grok match: <span className="font-mono text-white/80">{row.grokMatch}</span>
                  </div>
                  <div className="mt-2 text-sm text-white/75">{row.grokSummary}</div>

                  {t ? (
                    <>
                      <div className="mt-3 text-xs text-white/45">
                        <span className="font-semibold text-white/60">Posted:</span>{' '}
                        {new Date(t.created_at).toISOString()}
                        {t.lang ? ` · lang:${t.lang}` : ''}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/70 sm:grid-cols-4">
                        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                          ❤️ <span className="font-mono">{pm.like_count}</span>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                          💬 <span className="font-mono">{pm.reply_count}</span>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                          🔁 <span className="font-mono">{pm.retweet_count}</span>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                          👁️ <span className="font-mono">{pm.impression_count ?? '—'}</span>
                        </div>
                      </div>
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs font-semibold text-white/60">
                          Raw text
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white/70">
                          {t.text}
                        </pre>
                      </details>
                    </>
                  ) : (
                    <div className="mt-3 text-xs text-white/45">
                      Not enriched (X_BEARER_TOKEN missing or lookup failed).
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
