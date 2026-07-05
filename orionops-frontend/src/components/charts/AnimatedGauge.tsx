import { motion } from 'framer-motion'

interface AnimatedGaugeProps {
  value: number
  max?: number
  label: string
  color: string
  glowColor: string
  size?: number
}

export function AnimatedGauge({
  value,
  max = 100,
  label,
  color,
  glowColor,
  size = 140,
}: AnimatedGaugeProps) {
  const normalized = Math.min(max, Math.max(0, value))
  const percentage = normalized / max
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - percentage * circumference

  const level =
    normalized >= 75 ? 'Critical' : normalized >= 50 ? 'High' : normalized >= 25 ? 'Medium' : 'Low'

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={normalized}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-semibold tabular-nums text-white"
          >
            {Math.round(normalized)}
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">{level}</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  )
}
