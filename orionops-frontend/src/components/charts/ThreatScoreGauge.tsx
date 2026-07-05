import { AnimatedGauge } from './AnimatedGauge'

interface ThreatScoreGaugeProps {
  value: number
}

export function ThreatScoreGauge({ value }: ThreatScoreGaugeProps) {
  return (
    <AnimatedGauge
      value={value}
      label="Threat Level"
      color="#f59e0b"
      glowColor="rgba(245, 158, 11, 0.5)"
    />
  )
}
