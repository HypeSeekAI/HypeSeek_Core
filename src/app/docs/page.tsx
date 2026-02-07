import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-12 md:px-6">
      <div className="hs-card rounded-[18px] p-8">
        <div className="font-display text-2xl font-semibold text-white">Docs</div>
        <p className="mt-2 text-sm text-[var(--hs-gray)]">
          A quick primer for how HypeSeek scores narratives. (We’ll expand this into full docs + FAQ.)
        </p>

        <div className="mt-8 space-y-6 text-sm text-white/80">
          <section>
            <h2 className="font-display text-lg font-semibold text-white">What is HypeSeek?</h2>
            <p className="mt-2 text-[var(--hs-gray)]">
              HypeSeek is a virality intelligence terminal. It tracks narratives across X, Reddit, and Google Trends and
              ranks them by velocity + breakout momentum.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-white">What is a Hype Score?</h2>
            <p className="mt-2 text-[var(--hs-gray)]">
              A composite score (0–100) measuring how likely a narrative is to break out soon. It’s explainable — every
              spike comes with a “Why Now”.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-white">Go back</h2>
            <Link className="text-[var(--hs-cyan)] underline" href="/live-feed">
              Open Live Feed
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
