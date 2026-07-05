import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { NewInvestigationPage } from '@/pages/NewInvestigationPage'
import { InvestigationsPage } from '@/pages/InvestigationsPage'
import { TimelinePage } from '@/pages/TimelinePage'
import { ThreatIntelPage } from '@/pages/ThreatIntelPage'
import { RiskPage } from '@/pages/RiskPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { ResponsePage } from '@/pages/ResponsePage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="investigate" element={<NewInvestigationPage />} />
          <Route path="investigations" element={<InvestigationsPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="threat-intelligence" element={<ThreatIntelPage />} />
          <Route path="risk-assessment" element={<RiskPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="response-plan" element={<ResponsePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
