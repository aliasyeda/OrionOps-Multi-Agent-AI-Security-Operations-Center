import { Card } from '@/components/ui/card'
import { RecommendationsTab } from '@/components/panels/RecommendationsTab'
import { useInvestigationStore } from '@/store/investigation-store'

export function RecommendationsPage() {
  const recommendations = useInvestigationStore((s) => s.recommendations)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Recommendations</h2>
        <p className="text-sm text-slate-400">Prioritized remediation guidance</p>
      </div>
      <Card className="p-6">
        <RecommendationsTab items={recommendations} />
      </Card>
    </div>
  )
}
