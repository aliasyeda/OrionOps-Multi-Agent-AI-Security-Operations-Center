"""
Risk Calculator Tool
OrionOps
"""


def calculate_risk_tool(
    severity: str,
    confidence: str
):
    """
    Calculates the overall incident risk.
    """

    severity = severity.lower()
    confidence = confidence.lower()

    severity_score = {
        "critical": 4,
        "high": 3,
        "medium": 2,
        "low": 1
    }

    confidence_score = {
        "high": 3,
        "medium": 2,
        "low": 1
    }

    score = (
        severity_score.get(severity, 1)
        + confidence_score.get(confidence, 1)
    )

    if score >= 7:
        risk = "Critical"
    elif score >= 5:
        risk = "High"
    elif score >= 3:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "risk_score": score,
        "risk_level": risk
    }


if __name__ == "__main__":

    result = calculate_risk_tool(
        severity="High",
        confidence="High"
    )

    print(result)