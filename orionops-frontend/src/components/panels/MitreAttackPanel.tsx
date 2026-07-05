import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MitreTechnique } from '@/lib/types'

interface MitreAttackPanelProps {
  techniques: MitreTechnique[]
}

export function MitreAttackPanel({ techniques }: MitreAttackPanelProps) {
  if (techniques.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-slate-500">
        No MITRE ATT&CK techniques detected yet
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {techniques.map((technique, index) => (
        <motion.div
          key={technique.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="border-cyan-500/20 bg-cyan-500/5 transition-colors hover:border-cyan-500/40">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-sm font-semibold text-cyan-300">
                    {technique.id}
                  </span>
                </div>
                {technique.confidence && (
                  <Badge variant="secondary">{technique.confidence}%</Badge>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-slate-200">{technique.name}</p>
              {technique.tactic && (
                <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
                  {technique.tactic}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
