import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

type ImportItem = {
  post_id: string
  author?: string
  language?: string
  grok_match?: string
  grok_summary?: string
  grok_details?: any
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function computePotentialScore(item: ImportItem) {
  // Start simple & deterministic (no placeholders):
  // - If Grok gives x/9, map it to 0..100.
  // - Otherwise 0.
  const m = item.grok_match?.match(/(\d+)\s*\/\s*(\d+)/)
  if (!m) return { score: 0, breakdown: { method: 'none' } }
  const hits = Number(m[1])
  const total = Number(m[2])
  if (!Number.isFinite(hits) || !Number.isFinite(total) || total <= 0) {
    return { score: 0, breakdown: { method: 'bad_match' } }
  }
  const score = clamp(Math.round((hits / total) * 100), 0, 100)
  return { score, breakdown: { method: 'grok_match_ratio', hits, total } }
}

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on server',
      },
      { status: 500 }
    )
  }

  const body = await req.json().catch(() => null)
  const source = (body?.source as string) || 'grok-on-x'
  const raw_text = (body?.raw_text as string) || null
  const items = (body?.items as ImportItem[]) || null

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'Body must include items: ImportItem[]' },
      { status: 400 }
    )
  }

  // 1) create run
  const runRes = await supabaseAdmin
    .from('grok_runs')
    .insert({ source, raw_text, raw_json: body })
    .select('id, run_at')
    .single()

  if (runRes.error) {
    return NextResponse.json({ ok: false, error: runRes.error.message }, { status: 500 })
  }

  const run_id = runRes.data.id

  // 2) upsert x_posts (canonical)
  const postRows = items.map((it) => ({
    post_id: it.post_id,
    author_handle: it.author ?? null,
    lang: it.language ?? null,
    updated_at: new Date().toISOString(),
  }))

  const upPosts = await supabaseAdmin
    .from('x_posts')
    .upsert(postRows, { onConflict: 'post_id' })
    .select('post_id')

  if (upPosts.error) {
    return NextResponse.json({ ok: false, error: upPosts.error.message }, { status: 500 })
  }

  // 3) insert reports
  const reportRows = items.map((it) => {
    const { score, breakdown } = computePotentialScore(it)
    return {
      run_id,
      post_id: it.post_id,
      grok_match: it.grok_match ?? null,
      grok_summary: it.grok_summary ?? null,
      grok_details: it.grok_details ?? null,
      potential_score: score,
      potential_breakdown: breakdown,
    }
  })

  const insReports = await supabaseAdmin
    .from('grok_post_reports')
    .insert(reportRows)
    .select('id, post_id, potential_score')

  if (insReports.error) {
    return NextResponse.json({ ok: false, error: insReports.error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, run: runRes.data, reports: insReports.data })
}
