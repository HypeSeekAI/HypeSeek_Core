# Live Feed Table Implementation Guide

## Missing Features That Need Implementation

### 1. Live Feed Table (Priority: CRITICAL)

**Current State**: Only 3 static preview cards exist in `#live-feed` section.

**What Needs Building**:

#### File Structure
```
src/
├── components/
│   ├── LiveFeedTable.tsx       # Main table component
│   ├── StickyFilterBar.tsx     # Filter bar with sticky positioning
│   ├── ScoreCell.tsx            # Score badge cell
│   ├── WhyNowPreview.tsx       # Expandable "why now" tooltip
│   ├── Sparkline.tsx            # Mini velocity chart
│   └── TableRow.tsx             # Individual row component
├── hooks/
│   ├── useLiveFeed.ts          # Data fetching hook
│   └── useTableFilters.ts      # Filter state management
└── types/
    └── narrative.ts             # TypeScript types
```

#### Data Model
```typescript
interface Narrative {
  id: string
  title: string
  score: number
  velocity: string
  velocityData: number[] // For sparkline
  sources: string[]
  badge: 'BREAKING' | 'EARLY SIGNAL' | 'WATCH'
  whyNow: string
  timestamp: number
  engagement: number
  momentum: 'rising' | 'stable' | 'falling'
}
```

---

### 2. Sticky Filter Bar Implementation

**Requirements**:
- Fixed at `top: 64px` (below nav bar which is 60px + 4px border)
- Must account for nav bar height
- Filters: Score range, Source type, Badge type, Time range
- z-index must be below nav (nav=50, filter=40)

**Code Template**:
```tsx
// src/components/StickyFilterBar.tsx
import { useState } from 'react'
import { Filter, X } from 'lucide-react'

interface FilterState {
  minScore: number
  sources: string[]
  badges: string[]
  timeRange: '1h' | '6h' | '24h' | '7d'
}

export function StickyFilterBar({ onChange }: { onChange: (filters: FilterState) => void }) {
  const [filters, setFilters] = useState<FilterState>({
    minScore: 0,
    sources: [],
    badges: [],
    timeRange: '24h'
  })

  return (
    <div className="sticky top-[64px] z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Filter className="h-4 w-4" />
            Filters:
          </div>
          
          {/* Score Range */}
          <select 
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white"
            value={filters.minScore}
            onChange={(e) => {
              const newFilters = { ...filters, minScore: Number(e.target.value) }
              setFilters(newFilters)
              onChange(newFilters)
            }}
          >
            <option value="0">All Scores</option>
            <option value="70">70+ Hot</option>
            <option value="80">80+ Very Hot</option>
            <option value="90">90+ Breaking</option>
          </select>

          {/* Add more filter controls */}
          
          {/* Clear Filters */}
          {(filters.minScore > 0 || filters.sources.length > 0) && (
            <button 
              onClick={() => {
                const reset = { minScore: 0, sources: [], badges: [], timeRange: '24h' as const }
                setFilters(reset)
                onChange(reset)
              }}
              className="flex items-center gap-1 text-sm text-[var(--hs-cyan)] hover:text-[var(--hs-cyan)]/80"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

### 3. Table Columns Layout

**Desktop Layout (>1024px)**:
```
┌──────────────────────────────────────────────────────────────────────┐
│ Narrative Title (40%) │ Score (15%) │ Velocity (15%) │ Sources (15%) │ Sparkline (15%) │
└──────────────────────────────────────────────────────────────────────┘
```

**Responsive Breakpoints**:
- **< 768px**: Stack cards vertically (like current preview)
- **768-1023px**: 2-column grid, hide sparklines
- **≥1024px**: Full table with all columns

**Implementation**:
```tsx
// src/components/LiveFeedTable.tsx
export function LiveFeedTable({ data }: { data: Narrative[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]"> {/* Minimum width prevents squishing */}
        <thead className="border-b border-white/10 bg-white/3">
          <tr>
            <th className="w-[40%] px-4 py-3 text-left text-sm font-semibold text-white/85">
              Narrative
            </th>
            <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold text-white/85">
              Score
            </th>
            <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold text-white/85">
              Velocity
            </th>
            <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold text-white/85">
              Sources
            </th>
            <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold text-white/85">
              Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((narrative) => (
            <TableRow key={narrative.id} narrative={narrative} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

### 4. Sparkline Component

**Requirements**:
- Mini line chart (150px × 40px)
- Shows last 12 data points
- Color-coded: Green (rising), Yellow (stable), Red (falling)

**Implementation**:
```tsx
// src/components/Sparkline.tsx
interface SparklineProps {
  data: number[]
  trend: 'rising' | 'stable' | 'falling'
}

export function Sparkline({ data, trend }: SparklineProps) {
  const width = 150
  const height = 40
  const padding = 4
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding
    const y = height - padding - ((value - min) / range) * (height - 2 * padding)
    return `${x},${y}`
  }).join(' ')
  
  const color = trend === 'rising' 
    ? 'var(--hs-green)' 
    : trend === 'falling' 
    ? '#ff4444' 
    : 'var(--hs-gray)'
  
  return (
    <svg width={width} height={height} className="opacity-80">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
```

---

### 5. Why-Now Preview Component

**Requirements**:
- Tooltip/popover on hover
- Max 200 characters preview
- Fade-in animation
- Position: Below row, left-aligned

**Implementation**:
```tsx
// src/components/WhyNowPreview.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'

interface WhyNowPreviewProps {
  whyNow: string
}

export function WhyNowPreview({ whyNow }: WhyNowPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center gap-1 text-xs text-[var(--hs-cyan)] hover:text-[var(--hs-cyan)]/80"
      >
        <Info className="h-3.5 w-3.5" />
        Why now?
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border border-white/20 bg-black/95 p-4 text-sm leading-relaxed text-white/85 shadow-2xl backdrop-blur-sm"
          >
            {whyNow}
            <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 border-l border-t border-white/20 bg-black/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

### 6. Overflow & Performance Considerations

**Horizontal Scroll Prevention**:
```css
/* Add to index.css */
.live-feed-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 246, 255, 0.3) rgba(255, 255, 255, 0.05);
}

.live-feed-container::-webkit-scrollbar {
  height: 8px;
}

.live-feed-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.live-feed-container::-webkit-scrollbar-thumb {
  background: rgba(0, 246, 255, 0.3);
  border-radius: 4px;
}

.live-feed-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 246, 255, 0.5);
}
```

**Performance Optimizations**:
1. **Virtualization**: Use `@tanstack/react-virtual` for 100+ rows
2. **Debounce filters**: 300ms delay on filter changes
3. **Memoize rows**: `React.memo(TableRow)` to prevent re-renders
4. **Lazy load sparklines**: Only render in viewport
5. **CSS containment**:
```css
.table-row {
  contain: layout style paint;
  will-change: transform;
}
```

---

### 7. Sticky Offset Conflicts Prevention

**Z-index hierarchy**:
```css
:root {
  --z-modal: 100;
  --z-nav: 50;
  --z-filter-bar: 40;
  --z-table-header: 30;
  --z-tooltip: 60;
}
```

**Nav bar + Filter bar stacking**:
```tsx
// Nav bar
<header className="sticky top-0 z-50 ...">

// Filter bar
<div className="sticky top-[64px] z-40 ...">
  {/* 64px = nav height (60px) + border (4px) */}
</div>

// Table (if sticky headers needed)
<thead className="sticky top-[112px] z-30 ...">
  {/* 112px = nav (64px) + filter bar (~48px) */}
</thead>
```

---

### 8. Data Fetching Hook

```typescript
// src/hooks/useLiveFeed.ts
import { useEffect, useState } from 'react'
import type { Narrative } from '../types/narrative'

export function useLiveFeed() {
  const [data, setData] = useState<Narrative[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/narratives')
        if (!response.ok) throw new Error('Failed to fetch')
        const narratives = await response.json()
        setData(narratives)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 120000) // 2 minutes
    
    return () => clearInterval(interval)
  }, [])
  
  return { data, loading, error }
}
```

---

## Testing Priorities

See `TESTING_CHECKLIST.md` for full testing plan.
