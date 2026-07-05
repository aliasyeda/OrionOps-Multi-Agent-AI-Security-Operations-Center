import { RiskGauge } from '@/components/charts/RiskGauge'
import { ThreatScoreGauge } from '@/components/charts/ThreatScoreGauge'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface RiskTabProps {
  riskScore: number
  threatScore: number
}

export function RiskTab({ riskScore, threatScore }: RiskTabProps) {
  const chartData = [
    { category: 'Confidentiality', score: Math.min(100, riskScore + 5) },
    { category: 'Integrity', score: Math.min(100, riskScore - 3) },
    { category: 'Availability', score: Math.min(100, riskScore - 8) },
    { category: 'Compliance', score: Math.min(100, riskScore + 2) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-12">
        <RiskGauge value={riskScore} />
        <ThreatScoreGauge value={threatScore} />
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
