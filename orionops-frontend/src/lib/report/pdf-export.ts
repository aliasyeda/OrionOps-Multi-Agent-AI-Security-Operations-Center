import { jsPDF } from 'jspdf'
import type { InvestigationReport } from '@/lib/types'

export function downloadReportAsPdf(report: InvestigationReport): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = 20

  const addLine = (text: string, fontSize = 10, style: 'normal' | 'bold' = 'normal') => {
    doc.setFont('helvetica', style)
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, contentWidth)

    for (const line of lines) {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(line, margin, y)
      y += fontSize * 0.5 + 2
    }
  }

  doc.setFillColor(10, 22, 40)
  doc.rect(0, 0, pageWidth, 35, 'F')
  doc.setTextColor(34, 211, 238)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('OrionOps Incident Report', margin, 18)
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.text('CONFIDENTIAL — Enterprise SOC Investigation Platform', margin, 26)

  y = 45
  doc.setTextColor(30, 41, 59)

  addLine(report.title, 14, 'bold')
  y += 4
  addLine(`Generated: ${new Date(report.generatedAt).toLocaleString()}`, 9)
  y += 6

  addLine('EXECUTIVE SUMMARY', 11, 'bold')
  addLine(report.summary, 10)
  y += 4

  for (const section of report.sections) {
    addLine(section.title.toUpperCase(), 11, 'bold')
    addLine(section.content, 10)
    y += 4
  }

  y += 6
  addLine('Classification: CONFIDENTIAL', 8)
  addLine('End of Report', 8)

  doc.save(`orionops-report-${Date.now()}.pdf`)
}

export function generateReportPdfContent(report: {
  title: string
  summary: string
  sections: Array<{ title: string; content: string }>
}): string {
  const lines = [
    'ORIONOPS INCIDENT INVESTIGATION REPORT',
    '='.repeat(50),
    '',
    `Title: ${report.title}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'EXECUTIVE SUMMARY',
    '-'.repeat(30),
    report.summary,
    '',
  ]

  for (const section of report.sections) {
    lines.push(section.title.toUpperCase())
    lines.push('-'.repeat(30))
    lines.push(section.content)
    lines.push('')
  }

  lines.push('END OF REPORT')
  lines.push('Classification: CONFIDENTIAL')
  return lines.join('\n')
}
