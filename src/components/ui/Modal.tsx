'use client'

import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Modal({
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
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[520px] rounded-[18px] border border-white/10 bg-black/85 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.8 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="font-display text-base font-semibold text-white">{title}</div>
              <button
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/8"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4 text-sm text-white/80">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
