import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MitreAttackPanel } from './MitreAttackPanel'
import { ThreatIntelligenceTab } from './ThreatIntelligenceTab'
import { TimelineTab } from './TimelineTab'
import { RiskTab } from './RiskTab'
import { RecommendationsTab } from './RecommendationsTab'
import { ResponseTab } from './ResponseTab'
import { ReportTab } from './ReportTab'
import { useInvestigationStore } from '@/store/investigation-store'
import type { BottomTab } from '@/lib/types'

const TAB_ITEMS: { value: BottomTab; label: string }[] = [
  { value: 'threat-intelligence', label: 'Threat Intelligence' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'risk', label: 'Risk' },
  { value: 'recommendations', label: 'Recommendations' },
  { value: 'response', label: 'Response' },
  { value: 'report', label: 'Final Report' },
]

export function BottomTabs() {
  const activeBottomTab = useInvestigationStore((s) => s.activeBottomTab)
  const setActiveBottomTab = useInvestigationStore((s) => s.setActiveBottomTab)
  const mitreTechniques = useInvestigationStore((s) => s.mitreTechniques)
  const timelineEvents = useInvestigationStore((s) => s.timelineEvents)
  const threatIntel = useInvestigationStore((s) => s.threatIntel)
  const recommendations = useInvestigationStore((s) => s.recommendations)
  const responseActions = useInvestigationStore((s) => s.responseActions)
  const report = useInvestigationStore((s) => s.report)
  const metrics = useInvestigationStore((s) => s.metrics)
  const phase = useInvestigationStore((s) => s.phase)
  const downloadReport = useInvestigationStore((s) => s.downloadReport)

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Investigation Results</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs
          value={activeBottomTab}
          onValueChange={(v) => setActiveBottomTab(v as BottomTab)}
        >
          <TabsList className="flex h-auto w-full flex-wrap gap-1">
            {TAB_ITEMS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-[11px]">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threat-intelligence">
            <div className="space-y-6">
              <ThreatIntelligenceTab items={threatIntel} />
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  MITRE ATT&CK Techniques
                </h4>
                <MitreAttackPanel techniques={mitreTechniques} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineTab events={timelineEvents} />
          </TabsContent>

          <TabsContent value="risk">
            <RiskTab riskScore={metrics.riskScore} threatScore={metrics.threatScore} />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsTab items={recommendations} />
          </TabsContent>

          <TabsContent value="response">
            <ResponseTab actions={responseActions} />
          </TabsContent>

          <TabsContent value="report">
            <ReportTab
              report={report}
              loading={phase === 'analyzing'}
              onDownload={downloadReport}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
