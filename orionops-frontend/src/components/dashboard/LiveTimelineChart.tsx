import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useInvestigationStore } from '@/store/investigation-store'

export function LiveTimelineChart() {
  const timelineEvents = useInvestigationStore((s) => s.timelineEvents)
  const phase = useInvestigationStore((s) => s.phase)

  const data = useMemo(() => {
    if (timelineEvents.length === 0) {
      return [
        { time: '00:00', events: 0 },
        { time: '00:15', events: 0 },
        { time: '00:30', events: 0 },
        { time: '00:45', events: 0 },
        { time: '01:00', events: 0 },
      ]
    }

    return timelineEvents.slice(-8).map((event, i) => ({
      time: event.timestamp.slice(-8, -3) || `T${i}`,
      events: i + 1,
    }))
  }, [timelineEvents])

  return (
    <div className="h-[180px] w-full">
      {phase === 'idle' && timelineEvents.length === 0 ? (
        <div className="flex h-full items-center justify-center text-xs text-slate-500">
          Timeline events will appear during investigation
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="events"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#timelineGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
