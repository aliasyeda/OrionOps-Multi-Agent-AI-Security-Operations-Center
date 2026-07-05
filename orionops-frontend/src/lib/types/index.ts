export type AgentStatus = 'pending' | 'active' | 'completed' | 'error'

export interface AgentDefinition {
  id: string
  name: string
  displayName: string
  description: string
}

export interface AgentLogEntry {
  id: string
  agentId: string
  agentName: string
  status: 'started' | 'running' | 'completed' | 'error'
  toolUsed?: string
  executionTimeMs?: number
  message?: string
  timestamp: string
}

export interface MitreTechnique {
  id: string
  name: string
  tactic?: string
  confidence?: number
}

export interface TimelineEvent {
  id: string
  timestamp: string
  title: string
  description?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  source?: string
}

export interface ThreatIntelItem {
  id: string
  indicator: string
  type: string
  severity: string
  source: string
  description?: string
}

export interface RecommendationItem {
  id: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
}

export interface ResponseAction {
  id: string
  phase: string
  action: string
  status: 'planned' | 'in-progress' | 'completed'
}

export interface InvestigationReport {
  title: string
  summary: string
  sections: ReportSection[]
  generatedAt: string
}

export interface ReportSection {
  title: string
  content: string
}

export interface SOCMetrics {
  openIncidents: number
  criticalAlerts: number
  threatScore: number
  riskScore: number
  investigationProgress: number
  mitreCoverage: number
}

export interface AdkEvent {
  id?: string
  author?: string
  invocationId?: string
  timestamp?: number
  content?: {
    role?: string
    parts?: Array<{
      text?: string
      functionCall?: { name: string; args?: Record<string, unknown> }
      functionResponse?: { name: string; response?: Record<string, unknown> }
    }>
  }
  actions?: {
    transferToAgent?: string
    stateDelta?: Record<string, unknown>
  }
}

export interface SessionResponse {
  id: string
  appName: string
  userId: string
  state?: Record<string, unknown>
  events?: AdkEvent[]
}

export type InvestigationPhase =
  | 'idle'
  | 'connecting'
  | 'analyzing'
  | 'completed'
  | 'error'

export type BottomTab =
  | 'threat-intelligence'
  | 'timeline'
  | 'risk'
  | 'recommendations'
  | 'response'
  | 'report'

export type NavRoute =
  | 'dashboard'
  | 'new-investigation'
  | 'investigations'
  | 'timeline'
  | 'threat-intelligence'
  | 'risk-assessment'
  | 'recommendations'
  | 'response-plan'
  | 'reports'
  | 'settings'
