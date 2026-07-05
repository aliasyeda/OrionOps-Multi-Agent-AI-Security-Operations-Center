import { motion } from 'framer-motion'
import { AlertTriangle, Globe, Hash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ThreatIntelItem } from '@/lib/types'

interface ThreatIntelligenceTabProps {
  items: ThreatIntelItem[]
}

const typeIcons: Record<string, React.ReactNode> = {
  'IP Address': <Globe className="h-4 w-4" />,
  Hash: <Hash className="h-4 w-4" />,
  default: <AlertTriangle className="h-4 w-4" />,
}

export function ThreatIntelligenceTab({ items }: ThreatIntelligenceTabProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-500">
        Threat intelligence findings will appear after analysis
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.04 }}
          className="flex items-start gap-4 rounded-lg border border-white/10 bg-slate-950/40 p-4"
        >
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-400">
            {typeIcons[item.type] ?? typeIcons.default}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-slate-200">{item.indicator}</span>
              <Badge
                variant={
                  item.severity === 'Critical' || item.severity === 'High'
                    ? 'danger'
                    : 'warning'
                }
              >
                {item.severity}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {item.type} | Source: {item.source}
            </p>
            {item.description && (
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
