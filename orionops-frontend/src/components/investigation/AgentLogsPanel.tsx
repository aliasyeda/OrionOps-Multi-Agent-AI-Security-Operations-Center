import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, Loader2, Wrench } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useInvestigationStore } from '@/store/investigation-store'
import { formatDuration } from '@/lib/utils'
import type { AgentLogEntry } from '@/lib/types'

function LogItem({ log }: { log: AgentLogEntry }) {
  const statusIcon = {
    started: <Clock className="h-3 w-3 text-blue-400" />,
    running: <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />,
    completed: <CheckCircle2 className="h-3 w-3 text-emerald-400" />,
    error: <Clock className="h-3 w-3 text-red-400" />,
  }

  const statusVariant = {
    started: 'secondary' as const,
    running: 'default' as const,
    completed: 'success' as const,
    error: 'danger' as const,
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-lg border border-white/10 bg-slate-950/40 p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {statusIcon[log.status]}
          <span className="text-xs font-medium text-slate-200">{log.agentName}</span>
        </div>
        <Badge variant={statusVariant[log.status]}>{log.status}</Badge>
      </div>

      {log.toolUsed && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-cyan-400/80">
          <Wrench className="h-3 w-3" />
          <span className="font-mono">{log.toolUsed}</span>
        </div>
      )}

      {log.executionTimeMs !== undefined && (
        <p className="mt-1 text-[10px] text-slate-500">
          Execution: {formatDuration(log.executionTimeMs)}
        </p>
      )}

      {log.message && (
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
          {log.message}
        </p>
      )}

      <p className="mt-2 text-[10px] font-mono text-slate-600">{log.timestamp}</p>
    </motion.div>
  )
}

export function AgentLogsPanel() {
  const agentLogs = useInvestigationStore((s) => s.agentLogs)
  const phase = useInvestigationStore((s) => s.phase)

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Live Agent Logs</CardTitle>
          {phase === 'analyzing' && (
            <span className="flex items-center gap-1.5 text-[10px] text-cyan-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              LIVE
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden pb-4">
        <ScrollArea className="h-[480px] pr-3">
          <AnimatePresence>
            {agentLogs.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-xs text-slate-500">
                Agent execution logs will stream here
              </div>
            ) : (
              <div className="space-y-2">
                {agentLogs.map((log) => (
                  <LogItem key={log.id} log={log} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
