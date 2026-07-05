import { motion } from 'framer-motion'
import { Bell, Wifi, WifiOff } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AGENT_PIPELINE } from '@/lib/constants/agents'
import { useInvestigationStore } from '@/store/investigation-store'

export function TopNavbar() {
  const connected = useInvestigationStore((s) => s.connected)
  const currentAgentId = useInvestigationStore((s) => s.currentAgentId)
  const currentIncidentTitle = useInvestigationStore((s) => s.currentIncidentTitle)
  const phase = useInvestigationStore((s) => s.phase)

  const currentAgent = AGENT_PIPELINE.find((a) => a.id === currentAgentId)

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/40 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">OrionOps</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Enterprise Incident Investigation
          </p>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <motion.div
            animate={{ scale: connected ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: connected ? Infinity : 0, duration: 2 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5"
          >
            {connected ? (
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span className="text-xs font-medium text-slate-300">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}
            />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-3 lg:flex">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Current Incident</p>
            <p className="max-w-[200px] truncate text-xs font-medium text-slate-200">
              {currentIncidentTitle ?? 'No active incident'}
            </p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Current Agent</p>
            <p className="text-xs font-medium text-cyan-300">
              {phase === 'analyzing'
                ? currentAgent?.displayName ?? 'Processing'
                : phase === 'completed'
                  ? 'Workflow Complete'
                  : 'Standby'}
            </p>
          </div>
        </div>

        {phase === 'analyzing' && (
          <Badge variant="warning" className="hidden sm:inline-flex">
            Analysis In Progress
          </Badge>
        )}

        <button
          type="button"
          className="relative rounded-lg border border-white/10 bg-slate-900/50 p-2 text-slate-400 transition-colors hover:text-cyan-300"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>

        <Avatar>
          <AvatarFallback>SA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
