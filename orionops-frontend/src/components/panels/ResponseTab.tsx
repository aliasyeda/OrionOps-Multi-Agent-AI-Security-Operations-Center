import { motion } from 'framer-motion'
import { Siren } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ResponseAction } from '@/lib/types'

interface ResponseTabProps {
  actions: ResponseAction[]
}

const statusVariant = {
  planned: 'secondary' as const,
  'in-progress': 'warning' as const,
  completed: 'success' as const,
}

export function ResponseTab({ actions }: ResponseTabProps) {
  if (actions.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-500">
        Response plan will be defined by the Response Agent
      </div>
    )
  }

  const phases = [...new Set(actions.map((a) => a.phase))]

  return (
    <div className="space-y-6">
      {phases.map((phase) => (
        <div key={phase}>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            {phase}
          </h4>
          <div className="space-y-2">
            {actions
              .filter((a) => a.phase === phase)
              .map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-slate-950/40 p-3"
                >
                  <Siren className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{action.action}</p>
                  </div>
                  <Badge variant={statusVariant[action.status]}>{action.status}</Badge>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
