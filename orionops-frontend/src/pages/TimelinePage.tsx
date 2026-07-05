import { Card } from '@/components/ui/card'
import { TimelineTab } from '@/components/panels/TimelineTab'
import { useInvestigationStore } from '@/store/investigation-store'

export function TimelinePage() {
  const timelineEvents = useInvestigationStore((s) => s.timelineEvents)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Investigation Timeline</h2>
        <p className="text-sm text-slate-400">Chronological event sequence</p>
      </div>
      <Card className="p-6">
        <TimelineTab events={timelineEvents} />
      </Card>
    </div>
  )
}
