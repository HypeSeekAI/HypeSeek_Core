'use client'

import { Bell, Grid2X2, Radar, Settings } from 'lucide-react'

export function MobileBottomNav({
  active,
  setActive,
}: {
  active: string
  setActive: (v: string) => void
}) {
  const items = [
    { key: 'live', label: 'Live', icon: <Radar className="h-5 w-5" /> },
    { key: 'watch', label: 'Watch', icon: <Grid2X2 className="h-5 w-5" /> },
    { key: 'alerts', label: 'Alerts', icon: <Bell className="h-5 w-5" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/70 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-[720px] grid-cols-4 px-2 py-2">
        {items.map((it) => {
          const selected = active === it.key
          return (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              className={`flex flex-col items-center justify-center gap-1 rounded-[14px] px-2 py-2 text-xs font-semibold transition ${
                selected
                  ? 'bg-[rgba(0,246,255,0.10)] text-white'
                  : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <span className={selected ? 'text-[var(--hs-cyan)]' : 'text-white/55'}>{it.icon}</span>
              {it.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
