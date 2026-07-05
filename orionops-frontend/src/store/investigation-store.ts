import { create } from 'zustand'
import { AGENT_PIPELINE } from '@/lib/constants/agents'
import { createSession, runAgentSSE, checkBackendHealth } from '@/lib/api/adk-client'
import { parseAdkEvent } from '@/lib/parsers/event-parser'
import { downloadReportAsPdf } from '@/lib/report/pdf-export'
import type {
  AgentLogEntry,
  AgentStatus,
  BottomTab,
  InvestigationPhase,
  InvestigationReport,
  MitreTechnique,
  RecommendationItem,
  ResponseAction,
  SOCMetrics,
  ThreatIntelItem,
  TimelineEvent,
} from '@/lib/types'

interface AgentState {
  id: string
  status: AgentStatus
  startedAt?: number
  completedAt?: number
}

interface InvestigationStore {
  connected: boolean
  phase: InvestigationPhase
  sessionId: string | null
  incidentInput: string
  currentAgentId: string | null
  currentIncidentTitle: string | null
  agents: AgentState[]
  agentLogs: AgentLogEntry[]
  mitreTechniques: MitreTechnique[]
  timelineEvents: TimelineEvent[]
  threatIntel: ThreatIntelItem[]
  recommendations: RecommendationItem[]
  responseActions: ResponseAction[]
  report: InvestigationReport | null
  metrics: SOCMetrics
  activeBottomTab: BottomTab
  error: string | null
  abortController: AbortController | null

  setIncidentInput: (input: string) => void
  setActiveBottomTab: (tab: BottomTab) => void
  checkConnection: () => Promise<void>
  startInvestigation: () => Promise<void>
  resetInvestigation: () => void
  downloadReport: () => void
}

const initialMetrics: SOCMetrics = {
  openIncidents: 12,
  criticalAlerts: 3,
  threatScore: 0,
  riskScore: 0,
  investigationProgress: 0,
  mitreCoverage: 0,
}

function createInitialAgents(): AgentState[] {
  return AGENT_PIPELINE.map((a) => ({ id: a.id, status: 'pending' as AgentStatus }))
}

function computeProgress(agents: AgentState[]): number {
  const completed = agents.filter((a) => a.status === 'completed').length
  return Math.round((completed / agents.length) * 100)
}

function computeMitreCoverage(techniques: MitreTechnique[]): number {
  return Math.min(100, techniques.length * 18)
}

export const useInvestigationStore = create<InvestigationStore>((set, get) => ({
  connected: false,
  phase: 'idle',
  sessionId: null,
  incidentInput: '',
  currentAgentId: null,
  currentIncidentTitle: null,
  agents: createInitialAgents(),
  agentLogs: [],
  mitreTechniques: [],
  timelineEvents: [],
  threatIntel: [],
  recommendations: [],
  responseActions: [],
  report: null,
  metrics: initialMetrics,
  activeBottomTab: 'threat-intelligence',
  error: null,
  abortController: null,

  setIncidentInput: (input) => set({ incidentInput: input }),

  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),

  checkConnection: async () => {
    const connected = await checkBackendHealth()
    set({ connected })
  },

  resetInvestigation: () => {
    const { abortController } = get()
    abortController?.abort()
    set({
      phase: 'idle',
      sessionId: null,
      currentAgentId: null,
      currentIncidentTitle: null,
      agents: createInitialAgents(),
      agentLogs: [],
      mitreTechniques: [],
      timelineEvents: [],
      threatIntel: [],
      recommendations: [],
      responseActions: [],
      report: null,
      metrics: { ...initialMetrics },
      error: null,
      abortController: null,
    })
  },

  startInvestigation: async () => {
    const { incidentInput, abortController: existing } = get()
    if (!incidentInput.trim()) return

    existing?.abort()
    const abortController = new AbortController()
    const agentStartTimes = new Map<string, number>()

    set({
      phase: 'connecting',
      error: null,
      abortController,
      agents: createInitialAgents(),
      agentLogs: [],
      mitreTechniques: [],
      timelineEvents: [],
      threatIntel: [],
      recommendations: [],
      responseActions: [],
      report: null,
      currentIncidentTitle: incidentInput.slice(0, 80),
      metrics: { ...initialMetrics, openIncidents: 13, criticalAlerts: 4 },
    })

    try {
      const session = await createSession()
      set({ sessionId: session.id, phase: 'analyzing', connected: true })

      const reportSections: Array<{ title: string; content: string }> = []
      let reportSummary = ''

      await runAgentSSE({
        sessionId: session.id,
        message: incidentInput,
        signal: abortController.signal,
        onEvent: (event) => {
          const author = event.author
          if (!author || author === 'user') return

          const parsed = parseAdkEvent(event, agentStartTimes)

          set((state) => {
            const agents = [...state.agents]
            const agentIndex = agents.findIndex((a) => a.id === author)

            if (agentIndex >= 0) {
              if (agents[agentIndex].status === 'pending') {
                agents[agentIndex] = {
                  ...agents[agentIndex],
                  status: 'active',
                  startedAt: Date.now(),
                }
                agentStartTimes.set(author, Date.now())
              }
            }

            if (parsed.transferToAgent) {
              const currentIdx = agents.findIndex((a) => a.id === author)
              if (currentIdx >= 0 && agents[currentIdx].status === 'active') {
                agents[currentIdx] = {
                  ...agents[currentIdx],
                  status: 'completed',
                  completedAt: Date.now(),
                }
              }

              const nextIdx = agents.findIndex((a) => a.id === parsed.transferToAgent)
              if (nextIdx >= 0) {
                agents[nextIdx] = {
                  ...agents[nextIdx],
                  status: 'active',
                  startedAt: Date.now(),
                }
                agentStartTimes.set(parsed.transferToAgent!, Date.now())
              }
            }

            const mitreTechniques = [...state.mitreTechniques]
            for (const t of parsed.mitreTechniques) {
              if (!mitreTechniques.some((m) => m.id === t.id)) {
                mitreTechniques.push(t)
              }
            }

            const timelineEvents = [...state.timelineEvents, ...parsed.timelineEvents]
            const threatIntel = [...state.threatIntel, ...parsed.threatIntel]
            const recommendations = [...state.recommendations, ...parsed.recommendations]
            const responseActions = [...state.responseActions, ...parsed.responseActions]
            const agentLogs = [...state.agentLogs, ...parsed.agentLogs]

            let threatScore = state.metrics.threatScore
            let riskScore = state.metrics.riskScore
            if (parsed.threatScore !== undefined) threatScore = parsed.threatScore
            if (parsed.riskScore !== undefined) riskScore = parsed.riskScore

            if (parsed.reportText.length > 0) {
              reportSections.push({
                title: formatAgentName(author),
                content: parsed.reportText.join('\n'),
              })
              reportSummary = parsed.reportText[0]?.slice(0, 300) ?? reportSummary
            }

            const progress = computeProgress(agents)
            const mitreCoverage = computeMitreCoverage(mitreTechniques)

            return {
              agents,
              currentAgentId: parsed.transferToAgent ?? author,
              agentLogs,
              mitreTechniques,
              timelineEvents,
              threatIntel,
              recommendations,
              responseActions,
              metrics: {
                ...state.metrics,
                threatScore: threatScore || Math.min(95, progress + mitreTechniques.length * 8),
                riskScore: riskScore || Math.min(90, progress + 10),
                investigationProgress: progress,
                mitreCoverage,
              },
            }
          })
        },
        onComplete: () => {
          set((state) => {
            const agents = state.agents.map((a) =>
              a.status === 'active' || a.status === 'pending'
                ? { ...a, status: 'completed' as AgentStatus, completedAt: Date.now() }
                : a,
            )

            const report: InvestigationReport = {
              title: state.currentIncidentTitle ?? 'Incident Investigation Report',
              summary:
                reportSummary ||
                'Multi-agent investigation completed. Review detailed findings in each section.',
              sections:
                reportSections.length > 0
                  ? reportSections
                  : [
                      {
                        title: 'Investigation Summary',
                        content: state.incidentInput,
                      },
                      {
                        title: 'Threat Analysis',
                        content:
                          state.mitreTechniques
                            .map((t) => `${t.id}: ${t.name}`)
                            .join('\n') || 'No techniques mapped.',
                      },
                      {
                        title: 'Risk Assessment',
                        content: `Risk Score: ${state.metrics.riskScore}/100`,
                      },
                      {
                        title: 'Recommendations',
                        content:
                          state.recommendations.map((r) => `- ${r.title}`).join('\n') ||
                          'See agent output for recommendations.',
                      },
                    ],
              generatedAt: new Date().toISOString(),
            }

            return {
              phase: 'completed',
              agents,
              report,
              currentAgentId: null,
              metrics: {
                ...state.metrics,
                investigationProgress: 100,
              },
              activeBottomTab: 'report',
            }
          })
        },
        onError: (error) => {
          set({ error: error.message, phase: 'error' })
        },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Investigation failed'
      set({ error: message, phase: 'error', connected: false })
    }
  },

  downloadReport: () => {
    const { report } = get()
    if (!report) return
    downloadReportAsPdf(report)
  },
}))

function formatAgentName(agentId: string): string {
  return agentId
    .replace(/_agent$/, '')
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') + ' Agent'
}
