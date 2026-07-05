"""
MITRE ATT&CK Mapping Tool
OrionOps
"""

MITRE_TECHNIQUES = {
    "powershell": {
        "id": "T1059.001",
        "name": "PowerShell"
    },
    "phishing": {
        "id": "T1566",
        "name": "Phishing"
    },
    "ransomware": {
        "id": "T1486",
        "name": "Data Encrypted for Impact"
    },
    "brute force": {
        "id": "T1110",
        "name": "Brute Force"
    },
    "credential dumping": {
        "id": "T1003",
        "name": "Credential Dumping"
    },
    "command and control": {
        "id": "T1071",
        "name": "Application Layer Protocol"
    }
}


def map_to_mitre_tool(indicator: str):
    """
    Maps a threat indicator to a MITRE ATT&CK technique.
    """

    indicator = indicator.lower()

    for key, technique in MITRE_TECHNIQUES.items():
        if key in indicator:
            return {
                "technique_id": technique["id"],
                "technique_name": technique["name"]
            }

    return {
        "technique_id": "Unknown",
        "technique_name": "No MITRE mapping found"
    }


if __name__ == "__main__":

    print(map_to_mitre_tool("PowerShell downloaded malware"))