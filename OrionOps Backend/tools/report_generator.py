"""
Report Generation Tool
OrionOps
"""


def generate_report_tool(
    incident,
    threat_analysis,
    risk_assessment,
    timeline,
    recommendations,
    response_actions
):
    """
    Generates a structured incident report.
    """

    report = {
        "Incident": incident,
        "Threat Analysis": threat_analysis,
        "Risk Assessment": risk_assessment,
        "Timeline": timeline,
        "Recommendations": recommendations,
        "Response Actions": response_actions
    }

    return report


if __name__ == "__main__":

    report = generate_report_tool(
        incident={"title": "PowerShell Malware"},
        threat_analysis={"technique": "T1059.001"},
        risk_assessment={"risk": "High"},
        timeline=["PowerShell executed"],
        recommendations=["Isolate endpoint"],
        response_actions=["Blocked process"]
    )

    print(report)