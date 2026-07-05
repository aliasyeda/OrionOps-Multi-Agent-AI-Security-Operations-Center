"""
Workflow Manager Tool
OrionOps
"""


def update_workflow_stage_tool(
    incident_id: int,
    stage: str
):
    """
    Updates the current investigation stage.
    """

    valid_stages = [
        "Intake",
        "Threat Analysis",
        "Investigation",
        "Risk Assessment",
        "Timeline",
        "Recommendations",
        "Response",
        "Report",
        "Closed"
    ]

    if stage not in valid_stages:
        return {
            "success": False,
            "message": "Invalid workflow stage."
        }

    return {
        "success": True,
        "incident_id": incident_id,
        "current_stage": stage
    }


if __name__ == "__main__":

    result = update_workflow_stage_tool(
        incident_id=1,
        stage="Threat Analysis"
    )

    print(result)