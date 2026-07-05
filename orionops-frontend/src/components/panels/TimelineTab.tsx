import { motion } from 'framer-motion'
import type { TimelineEvent } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TimelineTabProps {
  events: TimelineEvent[]
}

const severityColors = {
  low: 'border-slate-500/50 bg-slate-500/10',
  medium: 'border-amber-500/50 bg-amber-500/10',
  high: 'border-orange-500/50 bg-orange-500/10',
  critical: 'border-red-500/50 bg-red-500/10',
}

export function TimelineTab({ events }: TimelineTabProps) {
  if (events.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-500">
        Investigation timeline will be constructed during analysis
      </div>
    )
  }

  return (
    <div className="relative ml-4 space-y-0 py-2">
      <div className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent" />

      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.06 }}
          className="relative flex gap-4 pb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.06 + 0.1 }}
            className={cn(
              'relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2',
              severityColors[event.severity ?? 'medium'],
            )}
          >
            <div className="absolute inset-1 rounded-full bg-cyan-400" />
          </motion.div>

          <div className="flex-1 rounded-lg border border-white/10 bg-slate-950/40 p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-200">{event.title}</p>
              <span className="shrink-0 font-mono text-[10px] text-slate-500">
                {event.timestamp}
              </span>
            </div>
            {event.description && (
              <p className="mt-1 text-xs text-slate-400">{event.description}</p>
            )}
            {event.source && (
              <p className="mt-2 text-[10px] uppercase tracking-widest text-cyan-500/70">
                {event.source}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
