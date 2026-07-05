import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

interface InvestigationProgressProps {
  value: number
}

export function InvestigationProgress({ value }: InvestigationProgressProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-end justify-between">
        <motion.span
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-semibold tabular-nums text-cyan-300"
        >
          {value}%
        </motion.span>
        <span className="text-xs text-slate-500">9-Agent Pipeline</span>
      </div>
      <Progress value={value} className="h-3" />
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Intake', threshold: 11 },
          { label: 'Analysis', threshold: 44 },
          { label: 'Report', threshold: 100 },
        ].map((stage) => (
          <div
            key={stage.label}
            className={`rounded-md border px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider ${
              value >= stage.threshold
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-white/10 bg-white/5 text-slate-500'
            }`}
          >
            {stage.label}
          </div>
        ))}
      </div>
    </div>
  )
}
