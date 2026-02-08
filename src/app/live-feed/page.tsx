import { LiveFeedDashboard } from '@/components/LiveFeedDashboard'
import { LiveFeedSupabase } from '@/components/LiveFeedSupabase'

export const dynamic = 'force-dynamic'

export default function LiveFeedPage() {
  return (
    <div>
      <LiveFeedDashboard />
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6 2xl:px-8">
        <div className="mt-6">
          <LiveFeedSupabase />
        </div>
      </div>
    </div>
  )
}
