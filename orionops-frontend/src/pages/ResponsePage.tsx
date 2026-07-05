import { Card } from '@/components/ui/card'
import { ResponseTab } from '@/components/panels/ResponseTab'
import { useInvestigationStore } from '@/store/investigation-store'

export function ResponsePage() {
  const responseActions = useInvestigationStore((s) => s.responseActions)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Response Plan</h2>
        <p className="text-sm text-slate-400">Incident response actions and phases</p>
      </div>
      <Card className="p-6">
        <ResponseTab actions={responseActions} />
      </Card>
    </div>
  )
}
