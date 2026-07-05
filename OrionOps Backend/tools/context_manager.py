"""
Context Manager
OrionOps
"""

_case_context = {}


def update_case_context(incident_id: int, section: str, data):
    """
    Updates one section of the shared case context.
    """

    if incident_id not in _case_context:
        _case_context[incident_id] = {}

    _case_context[incident_id][section] = data

    return {
        "success": True,
        "incident_id": incident_id,
        "updated_section": section
    }


def get_case_context(incident_id: int):
    """
    Returns the complete case context.
    """

    return _case_context.get(incident_id, {})


def append_case_note(incident_id: int, note: str):
    """
    Appends an investigation note.
    """

    if incident_id not in _case_context:
        _case_context[incident_id] = {}

    notes = _case_context[incident_id].setdefault("notes", [])
    notes.append(note)

    return {
        "success": True,
        "notes_count": len(notes)
    }


if __name__ == "__main__":

    update_case_context(
        1,
        "threat_analysis",
        {"technique": "T1059.001"}
    )

    append_case_note(
        1,
        "PowerShell executed from Downloads folder."
    )

    print(get_case_context(1))