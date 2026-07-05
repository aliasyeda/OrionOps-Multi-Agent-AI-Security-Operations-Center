import { Card } from '@/components/ui/card'
import { ThreatIntelligenceTab } from '@/components/panels/ThreatIntelligenceTab'
import { MitreAttackPanel } from '@/components/panels/MitreAttackPanel'
import { useInvestigationStore } from '@/store/investigation-store'

export function ThreatIntelPage() {
  const threatIntel = useInvestigationStore((s) => s.threatIntel)
  const mitreTechniques = useInvestigationStore((s) => s.mitreTechniques)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Threat Intelligence</h2>
        <p className="text-sm text-slate-400">Indicators and ATT&CK technique mapping</p>
      </div>
      <Card className="p-6">
        <ThreatIntelligenceTab items={threatIntel} />
      </Card>
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
          MITRE ATT&CK Coverage
        </h3>
        <MitreAttackPanel techniques={mitreTechniques} />
      </Card>
    </div>
  )
}
