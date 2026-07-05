"""
Security Validation Tool
OrionOps
"""

VALID_SEVERITIES = [
    "Low",
    "Medium",
    "High",
    "Critical"
]


def validate_incident_tool(
    title: str,
    description: str,
    severity: str
):
    """
    Validates an incident before it enters the OrionOps workflow.
    """

    errors = []

    if not title.strip():
        errors.append("Incident title is required.")

    if not description.strip():
        errors.append("Incident description is required.")

    if severity not in VALID_SEVERITIES:
        errors.append(
            f"Severity must be one of {VALID_SEVERITIES}"
        )

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }


if __name__ == "__main__":

    result = validate_incident_tool(
        title="PowerShell Malware",
        description="PowerShell downloaded a malicious payload.",
        severity="High"
    )

    print(result)