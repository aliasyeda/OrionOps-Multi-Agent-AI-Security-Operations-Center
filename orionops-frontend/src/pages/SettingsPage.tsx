import { AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="text-sm text-slate-400">Platform configuration</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/40 p-4">
            <div>
              <p className="text-sm font-medium text-slate-200">API Endpoint</p>
              <p className="text-xs text-slate-500">
                {import.meta.env.VITE_API_URL || '/api'}
              </p>
            </div>
            <Badge variant="secondary">ADK Backend</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/40 p-4">
            <div>
              <p className="text-sm font-medium text-slate-200">Application Name</p>
              <p className="text-xs text-slate-500">
                {import.meta.env.VITE_APP_NAME || 'OrionOps'}
              </p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/40 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-slate-200">Alert Threshold</p>
                <p className="text-xs text-slate-500">Critical alerts trigger at score 75+</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
