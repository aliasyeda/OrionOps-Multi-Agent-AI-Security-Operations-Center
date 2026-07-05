import { Card } from '@/components/ui/card'
import { RiskTab } from '@/components/panels/RiskTab'
import { useInvestigationStore } from '@/store/investigation-store'

export function RiskPage() {
  const metrics = useInvestigationStore((s) => s.metrics)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Risk Assessment</h2>
        <p className="text-sm text-slate-400">Business impact and risk scoring</p>
      </div>
      <Card className="p-6">
        <RiskTab riskScore={metrics.riskScore} threatScore={metrics.threatScore} />
      </Card>
    </div>
  )
}
