import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AGENT_PIPELINE } from '@/lib/constants/agents'
import { useInvestigationStore } from '@/store/investigation-store'
import type { AgentStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

function AgentNode({
  displayName,
  status,
  isLast,
}: {
  displayName: string
  status: AgentStatus
  isLast: boolean
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'relative flex w-full items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-500',
          status === 'completed' &&
            'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          status === 'active' &&
            'border-cyan-400/60 bg-cyan-500/15 shadow-[0_0_30px_rgba(34,211,238,0.25)]',
          status === 'pending' && 'border-white/10 bg-white/[0.02]',
          status === 'error' && 'border-red-500/40 bg-red-500/10',
        )}
      >
        {status === 'active' && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-cyan-400/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}

        <div className="relative z-10">
          {status === 'completed' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          {status === 'active' && <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />}
          {status === 'pending' && <Circle className="h-5 w-5 text-slate-600" />}
          {status === 'error' && <Circle className="h-5 w-5 text-red-400" />}
        </div>

        <div className="relative z-10 flex-1">
          <p
            className={cn(
              'text-sm font-medium',
              status === 'completed' && 'text-emerald-300',
              status === 'active' && 'text-cyan-300',
              status === 'pending' && 'text-slate-500',
            )}
          >
            {displayName}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            {status === 'completed' && 'Completed'}
            {status === 'active' && 'Processing'}
            {status === 'pending' && 'Pending'}
            {status === 'error' && 'Error'}
          </p>
        </div>
      </motion.div>

      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="flex h-6 flex-col items-center justify-center"
        >
          <div
            className={cn(
              'h-full w-px',
              status === 'completed' ? 'bg-emerald-500/50' : 'bg-white/10',
            )}
          />
          <span className="text-slate-600">↓</span>
        </motion.div>
      )}
    </div>
  )
}

export function WorkflowVisualization() {
  const agents = useInvestigationStore((s) => s.agents)
  const phase = useInvestigationStore((s) => s.phase)

  const agentStatusMap = new Map(agents.map((a) => [a.id, a.status]))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Workflow Visualization</CardTitle>
        <p className="text-xs text-slate-400">Multi-agent investigation pipeline</p>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {phase === 'idle' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-white/10 bg-slate-950/30"
            >
              <p className="text-center text-sm text-slate-500">
                Submit an incident to initiate
                <br />
                the agent workflow pipeline
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="workflow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-h-[500px] space-y-0 overflow-y-auto pr-2"
            >
              {AGENT_PIPELINE.map((agent, index) => (
                <AgentNode
                  key={agent.id}
                  displayName={agent.displayName}
                  status={agentStatusMap.get(agent.id) ?? 'pending'}
                  isLast={index === AGENT_PIPELINE.length - 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
