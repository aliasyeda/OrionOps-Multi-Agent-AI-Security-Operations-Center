"""
Timeline Logger Tool
OrionOps
"""

from datetime import datetime


def log_timeline_event_tool(
    incident_id: int,
    event: str
):
    """
    Logs a timeline event for an investigation.
    """

    return {
        "incident_id": incident_id,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "event": event
    }


def add_timeline_event_tool(
    incident_id: int,
    event: str,
    timestamp: str = None
):
    """
    Adds a timeline event. If no timestamp is provided,
    the current time is used.
    """

    if timestamp is None:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "incident_id": incident_id,
        "timestamp": timestamp,
        "event": event,
        "status": "Timeline event added successfully."
    }


if __name__ == "__main__":

    print(
        log_timeline_event_tool(
            incident_id=1,
            event="PowerShell process detected"
        )
    )

    print(
        add_timeline_event_tool(
            incident_id=1,
            event="User downloaded malicious script"
        )
    )