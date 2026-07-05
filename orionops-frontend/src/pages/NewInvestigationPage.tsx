import { useEffect } from 'react'
import { IncidentForm } from '@/components/investigation/IncidentForm'
import { WorkflowVisualization } from '@/components/investigation/WorkflowVisualization'
import { AgentLogsPanel } from '@/components/investigation/AgentLogsPanel'
import { BottomTabs } from '@/components/panels/BottomTabs'
import { useInvestigationStore } from '@/store/investigation-store'

export function NewInvestigationPage() {
  const checkConnection = useInvestigationStore((s) => s.checkConnection)

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">New Investigation</h2>
        <p className="text-sm text-slate-400">
          Submit a new security incident for multi-agent analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <IncidentForm />
        </div>
        <div className="lg:col-span-1">
          <WorkflowVisualization />
        </div>
        <div className="lg:col-span-1">
          <AgentLogsPanel />
        </div>
      </div>

      <BottomTabs />
    </div>
  )
}
