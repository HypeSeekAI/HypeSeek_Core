# Desktop Layout Testing Checklist

## 🎯 Priority Testing (Do These First)

### Current Landing Page Testing

#### Navigation Bar (header)
- [ ] Sticky positioning works on scroll (should stay at top)
- [ ] Backdrop blur visible when scrolled over content
- [ ] Links hover states work
- [ ] No horizontal scroll on 1024-1920px viewports
- [ ] Logo + wordmark visible and aligned
- [ ] Sign In button accessible (not overlapping content)

#### Hero Section
- [ ] Pills (badges) wrap gracefully on 1024-1200px
- [ ] No awkward single pill on new line
- [ ] Radar animation performs smoothly (60fps)
- [ ] Pulse animation doesn't cause layout shift
- [ ] CTA buttons don't overlap on smaller desktops
- [ ] Font sizes readable at 1024px (min desktop size)

#### Live Preview Cards (Section 3)
- [ ] 3-column grid maintains aspect ratio
- [ ] Cards don't stretch awkwardly on wide screens (>1920px)
- [ ] Hover glow effect smooth (no janky transitions)
- [ ] ScoreBadge pulse animation visible on 90+ scores
- [ ] Badge labels ("BREAKING", etc.) don't overflow
- [ ] Velocity/Sources metrics aligned properly

#### DexScreener Comparison Table
- [ ] ✅ **CRITICAL**: No horizontal scroll on 1024-1440px
- [ ] Table rows aligned (left/right columns same height)
- [ ] Text doesn't wrap awkwardly in cells
- [ ] Border styling consistent across rows

#### Feature Grid (Section 6)
- [ ] 3-column grid on desktop
- [ ] Icons centered in circles
- [ ] Card heights uniform (no misalignment)
- [ ] Hover effects smooth

#### Footer
- [ ] Links don't wrap awkwardly
- [ ] Horizontal spacing correct on all desktop sizes

---

## 🚨 Missing Features Testing (Once Implemented)

### Live Feed Table

#### Table Structure
- [ ] Table renders without horizontal scroll at 1024px
- [ ] Minimum width set (e.g., 900px) prevents column squishing
- [ ] Columns maintain proper width ratios (40/15/15/15/15)
- [ ] Table header sticky at correct offset (below nav + filter)
- [ ] Z-index hierarchy correct (nav > filter > table header)

#### Sticky Filter Bar
- [ ] **Position**: Sticks at `top: 64px` (below nav)
- [ ] **Z-index**: Filter bar at z-40, nav at z-50
- [ ] Backdrop blur visible
- [ ] No gap between nav border and filter bar
- [ ] Filter dropdowns open **below** bar, not obscured
- [ ] Filters remain accessible when table scrolled
- [ ] Clear button appears when filters active
- [ ] Filter state persists during scroll

#### Score Labels
- [ ] Score badges color-coded correctly:
  - [ ] 90-100: Cyan with pulse animation
  - [ ] 80-89: Purple
  - [ ] 70-79: Green
  - [ ] <70: Gray
- [ ] Badge pulse animation smooth (no layout shift)
- [ ] Badge text legible (contrast ratio ≥4.5:1)
- [ ] No badge overflow on narrow columns

#### Why-Now Preview
- [ ] Tooltip appears on hover (not click)
- [ ] Tooltip positioned **below** row, left-aligned
- [ ] Tooltip doesn't overflow viewport edges
- [ ] Arrow pointer connects to button
- [ ] Fade-in animation smooth (150ms)
- [ ] Tooltip closes on mouse leave
- [ ] Z-index above table content (z-60)
- [ ] Max-width prevents excessive widening
- [ ] Text readable with proper line-height

#### Sparklines
- [ ] Sparkline renders at 150×40px
- [ ] Line smooth (no jagged edges)
- [ ] Color matches trend:
  - [ ] Green for rising
  - [ ] Yellow/gray for stable
  - [ ] Red for falling
- [ ] Sparkline scales correctly (doesn't clip)
- [ ] Performance: 50+ sparklines render without lag

---

## 📐 Responsive Breakpoint Testing

Test at these exact widths:

### Desktop Sizes
- [ ] **1024px** (min desktop) - Everything readable, no horizontal scroll
- [ ] **1280px** (common laptop) - Optimal layout
- [ ] **1440px** (large laptop) - No awkward stretching
- [ ] **1920px** (FHD monitor) - Content centered, max-width respected
- [ ] **2560px** (4K) - Max-width container prevents over-stretching

### Edge Cases
- [ ] **1023px** (just below desktop) - Should switch to tablet view
- [ ] **1366px** (common resolution) - Common laptop size
- [ ] **Portrait orientation** (rare but possible) - No layout break

---

## 🎨 Visual Regression Testing

### Color & Contrast
- [ ] Text contrast ratios meet WCAG AA (4.5:1 for small text)
- [ ] Cyan accent (#00f6ff) visible on dark backgrounds
- [ ] Purple (#a855f7) distinguishable from cyan
- [ ] Gray text (#a1a1aa) readable

### Typography
- [ ] Font rendering smooth (antialiasing on)
- [ ] Display font (headings) loads correctly
- [ ] Mono font (metrics) readable
- [ ] No FOIT (Flash of Invisible Text)

### Animations
- [ ] Radar grid animation smooth (check CPU usage)
- [ ] Pulse animations 60fps (use DevTools Performance tab)
- [ ] Badge pulse doesn't cause repaints
- [ ] Hover transitions use GPU acceleration
- [ ] Framer Motion stagger animations smooth

---

## 🚀 Performance Testing

### Rendering Performance
- [ ] Lighthouse Performance Score ≥90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3.5s
- [ ] Cumulative Layout Shift <0.1

### Scroll Performance
- [ ] Smooth scrolling at 60fps
- [ ] No jank when sticky elements activate
- [ ] Backdrop blur doesn't drop framerate

### Memory Leaks
- [ ] No memory increase after 5 minutes idle
- [ ] Animations don't accumulate event listeners
- [ ] Framer Motion components unmount cleanly

### Network
- [ ] Assets load in parallel
- [ ] No blocking resources
- [ ] Fonts load asynchronously

---

## 🔍 Overflow & Scroll Testing

### Horizontal Scroll (Should NEVER happen)
- [ ] No horizontal scroll on nav bar
- [ ] No horizontal scroll on hero section
- [ ] No horizontal scroll on comparison table (**CRITICAL**)
- [ ] No horizontal scroll on feature grids
- [ ] Wide content uses `overflow-x-auto` containers

### Vertical Scroll
- [ ] Smooth scrolling
- [ ] Anchor links scroll to correct position
- [ ] Sticky elements don't jump

### Custom Scrollbars
- [ ] Scrollbar styled (thin, themed)
- [ ] Scrollbar visible on Windows
- [ ] Scrollbar thumb hover state works

---

## 🧩 Sticky Positioning Tests

### Nav Bar (z-50)
- [ ] Stays at `top: 0` when scrolling
- [ ] Doesn't overlap filter bar
- [ ] Backdrop blur visible

### Filter Bar (z-40, when implemented)
- [ ] Stays at `top: 64px` when scrolling
- [ ] Doesn't overlap nav bar
- [ ] Doesn't overlap table header
- [ ] No flickering during scroll

### Table Header (z-30, when implemented)
- [ ] Stays at `top: 112px` when scrolling
- [ ] Column headers aligned with table columns
- [ ] Doesn't jump when filter applied

---

## 🐛 Known Issues to Watch For

### CSS Issues
- [ ] Backdrop blur not supported on older browsers (fallback?)
- [ ] Custom scrollbar styles don't work on Firefox
- [ ] `will-change` overuse causes memory issues
- [ ] CSS Grid gaps inconsistent on Safari <14

### Framer Motion Issues
- [ ] `ease` prop type errors (use string not array)
- [ ] AnimatePresence unmounting issues
- [ ] Stagger delays accumulating

### Browser-Specific
- [ ] Safari: Backdrop blur performance
- [ ] Firefox: Scrollbar styling limited
- [ ] Chrome: GPU memory with many animations

---

## 📊 Testing Tools

### Manual Testing
1. **Browser DevTools**
   - Use "Responsive Design Mode" for exact widths
   - Performance tab for frame rate
   - Layers panel for GPU acceleration

2. **Extensions**
   - Lighthouse for performance
   - WAVE for accessibility
   - WhatFont for typography debugging

### Automated Testing
```bash
# Run dev server
npm run dev

# Check bundle size
npm run build
npx vite-bundle-visualizer

# Lighthouse CI
npx lighthouse http://localhost:5173 --view
```

---

## 🎯 Acceptance Criteria

### Must Pass (Blocking Issues)
✅ No horizontal scroll at any desktop breakpoint (1024px+)  
✅ Sticky nav bar works correctly  
✅ All text readable (contrast + font size)  
✅ Performance score ≥85  
✅ No console errors  

### Should Pass (High Priority)
⭐ Animations smooth (≥55fps)  
⭐ Filter bar sticky positioning correct  
⭐ Why-now tooltips positioned correctly  
⭐ Sparklines render without lag  

### Nice to Have (Low Priority)
💎 Custom scrollbar styling  
💎 Advanced GPU optimizations  
💎 Perfect 60fps on older hardware  

---

## 📝 Issue Reporting Template

When filing bugs, include:

```markdown
**Issue**: [Brief description]
**Priority**: [Critical / High / Medium / Low]
**Browser**: [Chrome 120, Firefox 121, etc.]
**Viewport**: [1024px, 1920px, etc.]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happens]
**Screenshot**: [Attach if visual issue]
**DevTools Console**: [Any errors?]
```

---

## 🔄 Regression Testing Schedule

After any code change to:
- Layout/CSS → Re-run overflow & responsive tests
- Animations → Re-run performance tests
- Sticky elements → Re-run z-index & offset tests
- Table structure → Re-run full table test suite

---

## ✅ Sign-Off Checklist

Before deploying to production:

- [ ] All "Must Pass" criteria met
- [ ] At least 90% of "Should Pass" met
- [ ] No critical bugs open
- [ ] Performance regression test passed
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari)
- [ ] Tested on real hardware (not just DevTools)
