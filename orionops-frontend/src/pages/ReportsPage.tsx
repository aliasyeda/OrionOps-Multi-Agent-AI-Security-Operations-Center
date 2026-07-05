import { Card } from '@/components/ui/card'
import { ReportTab } from '@/components/panels/ReportTab'
import { useInvestigationStore } from '@/store/investigation-store'

export function ReportsPage() {
  const report = useInvestigationStore((s) => s.report)
  const phase = useInvestigationStore((s) => s.phase)
  const downloadReport = useInvestigationStore((s) => s.downloadReport)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Reports</h2>
        <p className="text-sm text-slate-400">Investigation reports and documentation</p>
      </div>
      <Card className="p-6">
        <ReportTab
          report={report}
          loading={phase === 'analyzing'}
          onDownload={downloadReport}
        />
      </Card>
    </div>
  )
}
