-- HypeSeek: Grok human-in-the-loop import tables
-- Apply in Supabase SQL Editor.

-- 1) Each manual Grok run (every ~30min)
create table if not exists public.grok_runs (
  id uuid primary key default gen_random_uuid(),
  run_at timestamptz not null default now(),
  source text not null default 'grok-on-x',
  raw_text text,
  raw_json jsonb,
  created_at timestamptz not null default now()
);

-- 2) Canonical X post snapshot (latest known)
create table if not exists public.x_posts (
  post_id text primary key,
  url text generated always as ('https://x.com/i/web/status/' || post_id) stored,
  author_handle text,
  lang text,
  post_created_at timestamptz,
  text text,
  public_metrics jsonb, -- like_count, reply_count, retweet_count, quote_count, impression_count, etc.
  has_media boolean,
  last_fetched_at timestamptz,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists x_posts_updated_at_idx on public.x_posts (updated_at desc);
create index if not exists x_posts_post_created_at_idx on public.x_posts (post_created_at desc);

-- 3) Grok's report for a post in a specific run (what Grok said + our computed potential)
create table if not exists public.grok_post_reports (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.grok_runs(id) on delete cascade,
  post_id text not null references public.x_posts(post_id) on delete cascade,
  grok_match text, -- e.g. "6/9"
  grok_summary text,
  grok_details jsonb, -- keep whatever Grok gave (reasons, velocities, etc.)
  potential_score int, -- 0..100
  potential_breakdown jsonb,
  inserted_at timestamptz not null default now()
);

create index if not exists grok_post_reports_post_id_idx on public.grok_post_reports(post_id);
create index if not exists grok_post_reports_run_id_idx on public.grok_post_reports(run_id);
create index if not exists grok_post_reports_inserted_at_idx on public.grok_post_reports(inserted_at desc);

-- RLS (public read-only feed)
alter table public.grok_runs enable row level security;
alter table public.x_posts enable row level security;
alter table public.grok_post_reports enable row level security;

-- Allow anyone (anon) to read the public feed
create policy if not exists "public read grok_runs" on public.grok_runs
for select using (true);

create policy if not exists "public read x_posts" on public.x_posts
for select using (true);

create policy if not exists "public read grok_post_reports" on public.grok_post_reports
for select using (true);

-- IMPORTANT: do NOT add insert/update policies for anon.
-- Writes should be done only via Supabase service role key on the server.
