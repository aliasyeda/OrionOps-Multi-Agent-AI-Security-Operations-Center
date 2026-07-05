import { motion } from 'framer-motion'
import { Loader2, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useInvestigationStore } from '@/store/investigation-store'

const SAMPLE_INCIDENT = `INCIDENT REPORT - IR-2026-0847

Severity: High
Affected Asset: WORKSTATION-DC-042 (Finance Department)

Description:
Multiple suspicious PowerShell executions detected on endpoint WORKSTATION-DC-042.
Process spawned from Outlook attachment "Q4_Report.xlsm" at 14:23 UTC.

Indicators:
- IP Address: 185.234.72.19
- Domain: secure-update-cdn.net
- File Hash: a3f5c8d9e2b1...

Suspicious Processes:
- powershell.exe -enc JABjAGwAaQBlAG4AdAA...
- rundll32.exe connecting to external C2

Initial Assessment:
Potential phishing delivery with PowerShell-based payload execution.
Possible credential access and lateral movement attempt.`

export function IncidentForm() {
  const incidentInput = useInvestigationStore((s) => s.incidentInput)
  const phase = useInvestigationStore((s) => s.phase)
  const error = useInvestigationStore((s) => s.error)
  const setIncidentInput = useInvestigationStore((s) => s.setIncidentInput)
  const startInvestigation = useInvestigationStore((s) => s.startInvestigation)
  const resetInvestigation = useInvestigationStore((s) => s.resetInvestigation)

  const isAnalyzing = phase === 'connecting' || phase === 'analyzing'

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Incident Input</CardTitle>
        <p className="text-xs text-slate-400">
          Submit incident details for multi-agent investigation analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={incidentInput}
          onChange={(e) => setIncidentInput(e.target.value)}
          placeholder="Describe the security incident including affected assets, indicators, suspicious processes, and observed behavior..."
          disabled={isAnalyzing}
          className="min-h-[220px]"
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => startInvestigation()}
            disabled={isAnalyzing || !incidentInput.trim()}
            size="lg"
            className="min-w-[180px]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Incident
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Analyze Incident
              </>
            )}
          </Button>

          {phase !== 'idle' && (
            <Button variant="secondary" onClick={resetInvestigation} disabled={isAnalyzing}>
              <Square className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}

          {phase === 'idle' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIncidentInput(SAMPLE_INCIDENT)}
            >
              Load Sample Incident
            </Button>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
            <p className="mt-1 text-xs text-red-400/80">
              Ensure the ADK backend is running on port 8000
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
