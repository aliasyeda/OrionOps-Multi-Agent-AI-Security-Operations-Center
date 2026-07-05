import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileSearch,
  FolderSearch,
  Clock,
  Shield,
  AlertTriangle,
  Lightbulb,
  Siren,
  FileText,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants/agents'

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4" />,
  'new-investigation': <FileSearch className="h-4 w-4" />,
  investigations: <FolderSearch className="h-4 w-4" />,
  timeline: <Clock className="h-4 w-4" />,
  'threat-intelligence': <Shield className="h-4 w-4" />,
  'risk-assessment': <AlertTriangle className="h-4 w-4" />,
  recommendations: <Lightbulb className="h-4 w-4" />,
  'response-plan': <Siren className="h-4 w-4" />,
  reports: <FileText className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-slate-950/60 backdrop-blur-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/20">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">OrionOps</p>
          <p className="text-[10px] uppercase tracking-widest text-cyan-400/80">SOC Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <NavLink
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/10 text-cyan-300 shadow-inner shadow-cyan-500/5 border border-cyan-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent',
                )
              }
            >
              {iconMap[item.id]}
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50" />
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-slate-900/50 p-3">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Environment</p>
          <p className="mt-1 text-xs font-medium text-slate-300">Production SOC</p>
          <p className="text-[10px] text-slate-500">v1.0.0 Enterprise</p>
        </div>
      </div>
    </aside>
  )
}
