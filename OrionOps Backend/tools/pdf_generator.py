"""
PDF Generator Tool
OrionOps
"""

from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf_tool(report: dict, output_file="incident_report.pdf"):
    """
    Generates a PDF incident report.
    """

    doc = SimpleDocTemplate(output_file)
    styles = getSampleStyleSheet()

    elements = []

    elements.append(Paragraph("<b>OrionOps Incident Report</b>", styles["Title"]))

    for section, content in report.items():

        elements.append(Paragraph(f"<br/><b>{section}</b>", styles["Heading2"]))

        elements.append(
            Paragraph(str(content), styles["BodyText"])
        )

    doc.build(elements)

    return {
        "status": "success",
        "pdf_file": output_file
    }


if __name__ == "__main__":

    sample_report = {
        "Incident": "PowerShell Malware",
        "Threat": "MITRE T1059.001",
        "Risk": "High",
        "Recommendation": "Isolate endpoint"
    }

    result = generate_pdf_tool(sample_report)

    print(result)