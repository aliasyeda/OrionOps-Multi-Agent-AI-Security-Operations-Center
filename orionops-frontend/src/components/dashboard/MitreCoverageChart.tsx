import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface MitreCoverageChartProps {
  coverage: number
}

export function MitreCoverageChart({ coverage }: MitreCoverageChartProps) {
  const data = [
    { name: 'Covered', value: coverage },
    { name: 'Remaining', value: Math.max(0, 100 - coverage) },
  ]

  const COLORS = ['#22d3ee', 'rgba(255,255,255,0.05)']

  return (
    <div className="relative h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-cyan-300">{coverage}%</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">Coverage</span>
      </div>
    </div>
  )
}
