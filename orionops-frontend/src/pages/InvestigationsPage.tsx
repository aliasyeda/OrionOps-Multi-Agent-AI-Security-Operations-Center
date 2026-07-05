import { FolderSearch, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useInvestigationStore } from '@/store/investigation-store'

const MOCK_INVESTIGATIONS = [
  { id: 'IR-2026-0847', title: 'Suspicious PowerShell Activity', severity: 'High', status: 'Open' },
  { id: 'IR-2026-0846', title: 'Phishing Campaign Detection', severity: 'Critical', status: 'Investigating' },
  { id: 'IR-2026-0845', title: 'Lateral Movement Attempt', severity: 'High', status: 'Contained' },
  { id: 'IR-2026-0844', title: 'Ransomware Indicators', severity: 'Critical', status: 'Open' },
]

export function InvestigationsPage() {
  const currentIncidentTitle = useInvestigationStore((s) => s.currentIncidentTitle)
  const phase = useInvestigationStore((s) => s.phase)

  const investigations = currentIncidentTitle && phase !== 'idle'
    ? [
        {
          id: 'IR-ACTIVE',
          title: currentIncidentTitle,
          severity: 'High',
          status: phase === 'completed' ? 'Completed' : 'Investigating',
        },
        ...MOCK_INVESTIGATIONS,
      ]
    : MOCK_INVESTIGATIONS

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Investigations</h2>
        <p className="text-sm text-slate-400">Active and historical incident investigations</p>
      </div>

      <div className="grid gap-4">
        {investigations.map((inv) => (
          <Card key={inv.id} className="transition-colors hover:border-cyan-500/20">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg border border-white/10 bg-slate-900/50 p-3">
                <FolderSearch className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{inv.id}</span>
                  <Badge variant={inv.severity === 'Critical' ? 'danger' : 'warning'}>
                    {inv.severity}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-200">{inv.title}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Active
                </span>
                <Badge variant="secondary">{inv.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
