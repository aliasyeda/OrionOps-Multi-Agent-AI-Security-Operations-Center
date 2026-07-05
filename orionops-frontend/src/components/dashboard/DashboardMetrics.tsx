import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SOCMetrics } from '@/lib/types'
import { ThreatScoreGauge } from '@/components/charts/ThreatScoreGauge'
import { RiskGauge } from '@/components/charts/RiskGauge'
import { InvestigationProgress } from './InvestigationProgress'
import { LiveTimelineChart } from './LiveTimelineChart'
import { MitreCoverageChart } from './MitreCoverageChart'

interface DashboardMetricsProps {
  metrics: SOCMetrics
  loading?: boolean
}

function MetricCard({
  label,
  value,
  suffix,
  accent,
  delay,
}: {
  label: string
  value: number | string
  suffix?: string
  accent: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">{label}</p>
          <p className={`mt-2 text-3xl font-semibold tabular-nums ${accent}`}>
            {value}
            {suffix && <span className="text-lg text-slate-500">{suffix}</span>}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function DashboardMetrics({ metrics, loading }: DashboardMetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Open Incidents"
          value={metrics.openIncidents}
          accent="text-blue-400"
          delay={0}
        />
        <MetricCard
          label="Critical Alerts"
          value={metrics.criticalAlerts}
          accent="text-red-400"
          delay={0.05}
        />
        <MetricCard
          label="Threat Score"
          value={metrics.threatScore}
          suffix="/100"
          accent="text-amber-400"
          delay={0.1}
        />
        <MetricCard
          label="Risk Score"
          value={metrics.riskScore}
          suffix="/100"
          accent="text-orange-400"
          delay={0.15}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Threat Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <ThreatScoreGauge value={metrics.threatScore} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <RiskGauge value={metrics.riskScore} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Investigation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <InvestigationProgress value={metrics.investigationProgress} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Live Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveTimelineChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>MITRE ATT&CK Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <MitreCoverageChart coverage={metrics.mitreCoverage} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
