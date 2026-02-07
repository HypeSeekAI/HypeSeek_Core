import { type Variants } from 'framer-motion'

// Motion system: terminal-fast, premium, non-gimmicky
export const easeOut = [0.2, 0.8, 0.2, 1] as const

export const springPanel = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 36,
  mass: 0.8,
}

export const springSoft = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 26,
  mass: 0.9,
}

export const micro = { duration: 0.14, ease: easeOut }
export const standard = { duration: 0.22, ease: easeOut }
export const emphasis = { duration: 0.36, ease: easeOut }

export const staggerIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
}

export const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { ...standard } },
}

// Tick flash helpers (for live data later)
export const tickFlashUp: Variants = {
  idle: { backgroundColor: 'rgba(34, 197, 94, 0.00)' },
  flash: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    transition: { duration: 0.32, ease: 'easeOut' },
  },
}

export const tickFlashDown: Variants = {
  idle: { backgroundColor: 'rgba(239, 68, 68, 0.00)' },
  flash: {
    backgroundColor: 'rgba(239, 68, 68, 0.16)',
    transition: { duration: 0.32, ease: 'easeOut' },
  },
}
