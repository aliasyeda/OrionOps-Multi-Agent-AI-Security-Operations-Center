import type {
  AdkEvent,
  AgentLogEntry,
  MitreTechnique,
  RecommendationItem,
  ResponseAction,
  ThreatIntelItem,
  TimelineEvent,
} from '@/lib/types'
import { formatTimestamp } from '@/lib/utils'

let logCounter = 0

function nextId(): string {
  logCounter += 1
  return `log-${logCounter}-${Date.now()}`
}

function extractText(event: AdkEvent): string {
  return (
    event.content?.parts
      ?.map((p) => p.text)
      .filter(Boolean)
      .join('\n') ?? ''
  )
}

function extractFunctionCalls(event: AdkEvent): Array<{ name: string; args?: Record<string, unknown> }> {
  return (
    event.content?.parts
      ?.filter((p) => p.functionCall?.name)
      .map((p) => ({
        name: p.functionCall!.name,
        args: p.functionCall!.args,
      })) ?? []
  )
}

function extractFunctionResponses(event: AdkEvent): Array<{ name: string; response?: Record<string, unknown> }> {
  return (
    event.content?.parts
      ?.filter((p) => p.functionResponse?.name)
      .map((p) => ({
        name: p.functionResponse!.name,
        response: p.functionResponse!.response,
      })) ?? []
  )
}

export interface ParsedEventData {
  agentLogs: AgentLogEntry[]
  mitreTechniques: MitreTechnique[]
  timelineEvents: TimelineEvent[]
  threatIntel: ThreatIntelItem[]
  recommendations: RecommendationItem[]
  responseActions: ResponseAction[]
  reportText: string[]
  riskScore?: number
  threatScore?: number
  transferToAgent?: string
  currentAgent?: string
}

export function parseAdkEvent(event: AdkEvent, agentStartTimes: Map<string, number>): ParsedEventData {
  const result: ParsedEventData = {
    agentLogs: [],
    mitreTechniques: [],
    timelineEvents: [],
    threatIntel: [],
    recommendations: [],
    responseActions: [],
    reportText: [],
  }

  const author = event.author
  if (!author || author === 'user') return result

  result.currentAgent = author

  if (event.actions?.transferToAgent) {
    result.transferToAgent = event.actions.transferToAgent
  }

  const text = extractText(event)
  const calls = extractFunctionCalls(event)
  const responses = extractFunctionResponses(event)

  for (const call of calls) {
    if (!agentStartTimes.has(author)) {
      agentStartTimes.set(author, Date.now())
    }

    result.agentLogs.push({
      id: nextId(),
      agentId: author,
      agentName: formatAgentName(author),
      status: 'running',
      toolUsed: call.name,
      timestamp: formatTimestamp(),
      message: `Invoking ${call.name}`,
    })

    if (call.name.includes('mitre') || call.name.includes('map_to_mitre')) {
      const indicator = String(call.args?.indicator ?? '')
      if (indicator) {
        result.threatIntel.push({
          id: nextId(),
          indicator,
          type: 'Behavior',
          severity: 'High',
          source: 'MITRE Mapper',
        })
      }
    }

    if (call.name.includes('timeline') || call.name.includes('log_timeline')) {
      const eventText = String(call.args?.event ?? '')
      if (eventText) {
        result.timelineEvents.push({
          id: nextId(),
          timestamp: String(call.args?.timestamp ?? formatTimestamp()),
          title: eventText,
          source: formatAgentName(author),
          severity: 'medium',
        })
      }
    }

    if (call.name.includes('risk') || call.name.includes('calculate_risk')) {
      const severity = String(call.args?.severity ?? 'medium')
      result.threatScore = severityToScore(severity)
    }

    if (call.name.includes('create_incident')) {
      result.timelineEvents.push({
        id: nextId(),
        timestamp: formatTimestamp(),
        title: 'Incident case created',
        description: String(call.args?.title ?? 'New incident'),
        source: 'Case Manager',
        severity: 'high',
      })
    }
  }

  for (const resp of responses) {
    const startTime = agentStartTimes.get(author) ?? Date.now()
    const executionTimeMs = Date.now() - startTime

    result.agentLogs.push({
      id: nextId(),
      agentId: author,
      agentName: formatAgentName(author),
      status: 'completed',
      toolUsed: resp.name,
      executionTimeMs,
      timestamp: formatTimestamp(),
      message: `Completed ${resp.name}`,
    })

    const data = resp.response ?? {}

    if (resp.name.includes('mitre') || data.technique_id) {
      result.mitreTechniques.push({
        id: String(data.technique_id ?? nextId()),
        name: String(data.technique_name ?? 'Unknown Technique'),
        tactic: 'Execution',
        confidence: 85,
      })
      result.threatScore = Math.min(100, (result.threatScore ?? 40) + 15)
    }

    if (resp.name.includes('risk') || data.risk_score !== undefined) {
      result.riskScore = Number(data.risk_score ?? 0) * 12
    }

    if (resp.name.includes('timeline') || data.event) {
      result.timelineEvents.push({
        id: nextId(),
        timestamp: String(data.timestamp ?? formatTimestamp()),
        title: String(data.event),
        source: formatAgentName(author),
        severity: 'medium',
      })
    }

    if (resp.name.includes('create_incident') || data.incident_id) {
      result.timelineEvents.push({
        id: nextId(),
        timestamp: formatTimestamp(),
        title: `Incident #${data.incident_id} registered`,
        description: String(data.message ?? ''),
        source: 'Case Manager',
        severity: 'high',
      })
    }
  }

  if (text) {
    result.agentLogs.push({
      id: nextId(),
      agentId: author,
      agentName: formatAgentName(author),
      status: 'running',
      timestamp: formatTimestamp(),
      message: text.slice(0, 200),
    })

    if (author.includes('threat')) {
      parseThreatIntelFromText(text, result)
    }
    if (author.includes('risk')) {
      parseRiskFromText(text, result)
    }
    if (author.includes('timeline')) {
      parseTimelineFromText(text, result)
    }
    if (author.includes('recommendation')) {
      parseRecommendationsFromText(text, result)
    }
    if (author.includes('response')) {
      parseResponseFromText(text, result)
    }
    if (author.includes('report')) {
      result.reportText.push(text)
    }
  }

  return result
}

function formatAgentName(agentId: string): string {
  return agentId
    .replace(/_agent$/, '')
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') + ' Agent'
}

function severityToScore(severity: string): number {
  const map: Record<string, number> = {
    critical: 95,
    high: 78,
    medium: 52,
    low: 28,
  }
  return map[severity.toLowerCase()] ?? 50
}

function parseThreatIntelFromText(text: string, result: ParsedEventData): void {
  const mitrePattern = /T\d{4}(?:\.\d{3})?/g
  const matches = text.match(mitrePattern) ?? []
  for (const id of matches) {
    if (!result.mitreTechniques.some((t) => t.id === id)) {
      result.mitreTechniques.push({
        id,
        name: `MITRE Technique ${id}`,
        tactic: 'Detected',
        confidence: 80,
      })
    }
  }

  const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
  const ips = text.match(ipPattern) ?? []
  for (const ip of ips) {
    result.threatIntel.push({
      id: nextId(),
      indicator: ip,
      type: 'IP Address',
      severity: 'High',
      source: 'Threat Intelligence',
    })
  }
}

function parseRiskFromText(text: string, result: ParsedEventData): void {
  const riskMatch = text.match(/risk[:\s]+(critical|high|medium|low)/i)
  if (riskMatch) {
    result.riskScore = severityToScore(riskMatch[1])
  }
  const scoreMatch = text.match(/risk\s*score[:\s]+(\d+)/i)
  if (scoreMatch) {
    result.riskScore = Math.min(100, Number(scoreMatch[1]) * 12)
  }
}

function parseTimelineFromText(text: string, result: ParsedEventData): void {
  const lines = text.split('\n').filter((l) => l.trim().length > 10)
  for (const line of lines.slice(0, 8)) {
    const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim()
    if (cleaned.length > 5) {
      result.timelineEvents.push({
        id: nextId(),
        timestamp: formatTimestamp(),
        title: cleaned.slice(0, 120),
        source: 'Timeline Agent',
        severity: 'medium',
      })
    }
  }
}

function parseRecommendationsFromText(text: string, result: ParsedEventData): void {
  const lines = text.split('\n').filter((l) => /^[-*•\d]/.test(l.trim()))
  for (const line of lines) {
    const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim()
    if (cleaned.length > 5) {
      result.recommendations.push({
        id: nextId(),
        priority: cleaned.toLowerCase().includes('immediate') ? 'critical' : 'high',
        title: cleaned.slice(0, 80),
        description: cleaned,
      })
    }
  }
}

function parseResponseFromText(text: string, result: ParsedEventData): void {
  const phases = ['Containment', 'Eradication', 'Recovery', 'Lessons Learned']
  const lines = text.split('\n').filter((l) => l.trim().length > 5)
  lines.forEach((line, i) => {
    const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim()
    if (cleaned.length > 5) {
      result.responseActions.push({
        id: nextId(),
        phase: phases[i % phases.length],
        action: cleaned,
        status: 'planned',
      })
    }
  })
}
