import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { InvestigationReport } from '@/lib/types'

interface ReportTabProps {
  report: InvestigationReport | null
  loading?: boolean
  onDownload: () => void
}

export function ReportTab({ report, loading, onDownload }: ReportTabProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/10 text-sm text-slate-500">
        <FileText className="h-8 w-8 text-slate-600" />
        Final report will be available after investigation completes
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{report.title}</h3>
          <p className="text-xs text-slate-500">
            Generated: {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>
        <Button onClick={onDownload} variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-1">
        <div className="rounded-md bg-[#0c1424] p-6 shadow-inner">
          <div className="mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-cyan-400">
                  OrionOps Incident Report
                </p>
                <p className="text-sm font-medium text-white">CONFIDENTIAL</p>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[320px] pr-4">
            <div className="space-y-6 font-mono text-sm leading-relaxed text-slate-300">
              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                  Executive Summary
                </h4>
                <p className="text-slate-400">{report.summary}</p>
              </section>

              {report.sections.map((section) => (
                <section key={section.title}>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                    {section.title}
                  </h4>
                  <pre className="whitespace-pre-wrap font-mono text-xs text-slate-400">
                    {section.content}
                  </pre>
                </section>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 border-t border-white/10 pt-4 text-center text-[10px] uppercase tracking-widest text-slate-600">
            End of Report — Classification: Confidential
          </div>
        </div>
      </div>
    </motion.div>
  )
}
