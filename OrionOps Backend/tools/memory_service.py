import sqlite3
from pathlib import Path

# Database location
DB_PATH = Path(__file__).resolve().parent.parent / "orionops.db"


def get_connection():
    """Create a SQLite database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_database():
    """Create all OrionOps tables if they don't exist."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incidents (
        incident_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        severity TEXT,
        status TEXT DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS investigations (
        investigation_id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id INTEGER,
        findings TEXT,
        risk_score REAL,
        threat_actor TEXT,
        mitre_mapping TEXT,
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incident_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS timeline_events (
        event_id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        event TEXT,
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incident_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recommendations (
        recommendation_id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id INTEGER,
        recommendation TEXT,
        priority TEXT,
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incident_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        report_id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id INTEGER,
        pdf_path TEXT,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incident_id)
    )
    """)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    initialize_database()
    print("✅ OrionOps database initialized successfully.")