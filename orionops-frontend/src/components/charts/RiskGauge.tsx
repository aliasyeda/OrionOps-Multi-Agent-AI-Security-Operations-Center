import { AnimatedGauge } from './AnimatedGauge'

interface RiskGaugeProps {
  value: number
}

export function RiskGauge({ value }: RiskGaugeProps) {
  return (
    <AnimatedGauge
      value={value}
      label="Risk Level"
      color="#ef4444"
      glowColor="rgba(239, 68, 68, 0.5)"
    />
  )
}
