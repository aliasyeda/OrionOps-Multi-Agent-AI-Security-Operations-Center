import { useEffect } from 'react'
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { IncidentForm } from '@/components/investigation/IncidentForm'
import { WorkflowVisualization } from '@/components/investigation/WorkflowVisualization'
import { AgentLogsPanel } from '@/components/investigation/AgentLogsPanel'
import { BottomTabs } from '@/components/panels/BottomTabs'
import { useInvestigationStore } from '@/store/investigation-store'

export function DashboardPage() {
  const metrics = useInvestigationStore((s) => s.metrics)
  const phase = useInvestigationStore((s) => s.phase)
  const checkConnection = useInvestigationStore((s) => s.checkConnection)

  useEffect(() => {
    checkConnection()
    const interval = setInterval(checkConnection, 15000)
    return () => clearInterval(interval)
  }, [checkConnection])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Security Operations Dashboard</h2>
        <p className="text-sm text-slate-400">
          Real-time incident metrics and investigation overview
        </p>
      </div>

      <DashboardMetrics
        metrics={metrics}
        loading={phase === 'connecting'}
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <IncidentForm />
        </div>
        <div className="xl:col-span-4">
          <WorkflowVisualization />
        </div>
        <div className="xl:col-span-4">
          <AgentLogsPanel />
        </div>
      </div>

      <BottomTabs />
    </div>
  )
}
