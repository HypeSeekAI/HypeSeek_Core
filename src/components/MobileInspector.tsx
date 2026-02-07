'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'

export function MobileInspectorDrawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      className={`${open ? '' : 'pointer-events-none'} fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm lg:hidden`}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 22, opacity: 0 }}
        animate={{ y: open ? 0 : 22, opacity: open ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="absolute bottom-0 left-0 right-0 rounded-t-[22px] border-t border-white/10 bg-black/85 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Sparkles className="h-4 w-4 text-[var(--hs-lime)]" />
            {title}
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70"
          >
            Close <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </motion.div>
    </motion.div>
  )
}
