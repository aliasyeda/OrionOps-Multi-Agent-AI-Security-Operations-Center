from .memory_service import get_connection, initialize_database

# Ensure database exists
initialize_database()


def create_case(title, description, severity):
    """Create a new security incident."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO incidents (title, description, severity)
        VALUES (?, ?, ?)
    """, (title, description, severity))

    conn.commit()

    incident_id = cursor.lastrowid

    conn.close()

    return incident_id


def get_case(incident_id):
    """Retrieve one incident."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM incidents
        WHERE incident_id = ?
    """, (incident_id,))

    incident = cursor.fetchone()

    conn.close()

    return incident


def list_cases():
    """Return all incidents."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM incidents
        ORDER BY created_at DESC
    """)

    incidents = cursor.fetchall()

    conn.close()

    return incidents


def update_case_status(incident_id, status):
    """Update the incident status."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE incidents
        SET status = ?
        WHERE incident_id = ?
    """, (status, incident_id))

    conn.commit()

    conn.close()


def delete_case(incident_id):
    """Delete an incident."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM incidents
        WHERE incident_id = ?
    """, (incident_id,))

    conn.commit()

    conn.close()


# ====================================================
# ADK TOOL
# ====================================================

def create_incident_tool(
    title: str,
    description: str,
    severity: str = "Medium",
):
    """
    Creates a new cybersecurity incident in the OrionOps database.
    """

    incident_id = create_case(
        title=title,
        description=description,
        severity=severity,
    )

    return {
        "incident_id": incident_id,
        "status": "Open",
        "message": "Incident created successfully."
    }


# ====================================================
# TESTING
# ====================================================

if __name__ == "__main__":

    case_id = create_case(
        "Suspicious PowerShell Activity",
        "PowerShell downloaded an unknown payload.",
        "High",
    )

    print("Created Case ID:", case_id)

    incident = get_case(case_id)
    print(dict(incident))

    print("\nAll Cases:")

    for case in list_cases():
        print(dict(case))