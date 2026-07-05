import type { AgentDefinition } from '@/lib/types'

export const AGENT_PIPELINE: AgentDefinition[] = [
  {
    id: 'manager_agent',
    name: 'manager_agent',
    displayName: 'Manager Agent',
    description: 'Orchestrates investigation workflow initiation',
  },
  {
    id: 'intake_agent',
    name: 'intake_agent',
    displayName: 'Intake Agent',
    description: 'Normalizes and structures incident data',
  },
  {
    id: 'threat_intelligence_agent',
    name: 'threat_intelligence_agent',
    displayName: 'Threat Intelligence Agent',
    description: 'Correlates indicators with threat intelligence',
  },
  {
    id: 'investigation_agent',
    name: 'investigation_agent',
    displayName: 'Investigation Agent',
    description: 'Performs deep technical investigation',
  },
  {
    id: 'risk_assessment_agent',
    name: 'risk_assessment_agent',
    displayName: 'Risk Assessment Agent',
    description: 'Evaluates business and security risk',
  },
  {
    id: 'timeline_agent',
    name: 'timeline_agent',
    displayName: 'Timeline Agent',
    description: 'Constructs attack timeline sequence',
  },
  {
    id: 'recommendation_agent',
    name: 'recommendation_agent',
    displayName: 'Recommendation Agent',
    description: 'Generates prioritized remediation guidance',
  },
  {
    id: 'response_agent',
    name: 'response_agent',
    displayName: 'Response Agent',
    description: 'Defines incident response actions',
  },
  {
    id: 'report_agent',
    name: 'report_agent',
    displayName: 'Report Agent',
    description: 'Compiles final investigation report',
  },
]

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'OrionOps'
export const USER_ID = import.meta.env.VITE_USER_ID || 'soc-analyst'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/' },
  { id: 'new-investigation', label: 'New Investigation', path: '/investigate' },
  { id: 'investigations', label: 'Investigations', path: '/investigations' },
  { id: 'timeline', label: 'Timeline', path: '/timeline' },
  { id: 'threat-intelligence', label: 'Threat Intelligence', path: '/threat-intelligence' },
  { id: 'risk-assessment', label: 'Risk Assessment', path: '/risk-assessment' },
  { id: 'recommendations', label: 'Recommendations', path: '/recommendations' },
  { id: 'response-plan', label: 'Response Plan', path: '/response-plan' },
  { id: 'reports', label: 'Reports', path: '/reports' },
  { id: 'settings', label: 'Settings', path: '/settings' },
] as const
