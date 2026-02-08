# Pre-takeoff heuristics (NOT official thresholds)

These are **heuristics** to help you detect posts that are *approaching* takeoff.
They are **not guaranteed**, and the open-source repo does **not** publish exact thresholds.

## Why exact thresholds are hard

- Ranking is a **weighted combination of multiple predicted actions** (not a single metric)
- Retrieval + filtering gates differ by user, region, safety, freshness, and session context
- A post can be “viral” in one community and never cross into other audiences

## A practical scoring approach (HypeSeek-style)

Treat pre-takeoff as a **composite score** of observable signals:

### 1) Observable engagement + freshness
- `like_count`, `reply_count`, `retweet_count`, `quote_count`
- `age_minutes`
- Simple velocity proxies:
  - `likes_per_hour = like_count / age_hours`
  - `replies_per_hour = reply_count / age_hours`
  - `reposts_per_hour = retweet_count / age_hours`

### 2) Format signals
- media present (image/video)
- thread participation (conversation size)

### 3) Quality amplifiers (best-effort)
- verified author
- high-follower author
- repost/reply diversity (many distinct accounts interacting)

## Suggested “50–80% to takeoff” bucket (heuristic)

Instead of a single threshold, label a post as “pre-takeoff” when it hits (example):

- **2 of 3 velocity checks** are strong for its age cohort
- **AND** at least one amplifier is present (media OR high-authority author OR growing thread)
- **AND** negative feedback isn’t dominant (hard to measure directly; approximate by report rate if available)

## What to store per post snapshot
For honest, auditable tracking, store:
- post_id + created_at
- metrics snapshot (likes/replies/reposts/quotes/impressions if available)
- derived velocities
- why-it-scored (breakdown)
- timestamp of when HypeSeek observed it

## Source
These heuristics are derived from the *architecture described* in xai-org/x-algorithm, not from unpublished internal thresholds.
