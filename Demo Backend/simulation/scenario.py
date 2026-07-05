"""Predefined realistic cybersecurity investigation scenario for demo recordings."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class MitreMapping:
    indicator: str
    technique_id: str
    technique_name: str
    tactic: str


@dataclass(frozen=True)
class TimelineEntry:
    timestamp: str
    event: str
    severity: str = "medium"


@dataclass(frozen=True)
class InvestigationScenario:
    incident_id: int
    title: str
    summary: str
    severity: str
    category: str
    affected_asset: str
    operating_system: str
    attack_vector: str
    detection_source: str
    current_status: str
    malicious_ip: str
    malicious_domain: str
    malicious_url: str
    file_hash: str
    suspicious_file: str
    suspicious_process: str
    compromised_account: str
    endpoint_hostname: str
    mitre_mappings: list[MitreMapping] = field(default_factory=list)
    timeline: list[TimelineEntry] = field(default_factory=list)
    risk_score: int = 6
    risk_level: str = "High"
    confidence: str = "High"
    threat_score_severity: str = "high"


DEFAULT_SCENARIO = InvestigationScenario(
    incident_id=1042,
    title="Suspicious PowerShell Activity on Finance Workstation",
    summary=(
        "EDR detected encoded PowerShell downloading a remote payload from an "
        "unrecognized domain. The affected host attempted outbound connections "
        "to a known malicious IP associated with Emotet distribution infrastructure."
    ),
    severity="High",
    category="Malware / Command and Control",
    affected_asset="FIN-WKS-017 (Finance Analyst Workstation)",
    operating_system="Windows 11 Enterprise 23H2",
    attack_vector="Phishing email with malicious macro attachment",
    detection_source="Microsoft Defender for Endpoint + SIEM correlation rule",
    current_status="Contained - endpoint isolated pending eradication",
    malicious_ip="185.234.72.91",
    malicious_domain="evil-update.cdn-malware.net",
    malicious_url="http://evil-update.cdn-malware.net/stage/payload.ps1",
    file_hash="a3f5b8c2d1e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    suspicious_file="invoice_Q3_macro.xlsm",
    suspicious_process="powershell.exe (PID 4892)",
    compromised_account="j.smith@contoso.com",
    endpoint_hostname="FIN-WKS-017",
    mitre_mappings=[
        MitreMapping(
            indicator="phishing email with malicious attachment",
            technique_id="T1566.001",
            technique_name="Spearphishing Attachment",
            tactic="Initial Access",
        ),
        MitreMapping(
            indicator="powershell encoded command execution",
            technique_id="T1059.001",
            technique_name="PowerShell",
            tactic="Execution",
        ),
        MitreMapping(
            indicator="outbound C2 connection to malicious IP",
            technique_id="T1071.001",
            technique_name="Web Protocols",
            tactic="Command and Control",
        ),
        MitreMapping(
            indicator="credential dumping via lsass access",
            technique_id="T1003.001",
            technique_name="LSASS Memory",
            tactic="Credential Access",
        ),
        MitreMapping(
            indicator="lateral movement attempt via SMB",
            technique_id="T1021.002",
            technique_name="SMB/Windows Admin Shares",
            tactic="Lateral Movement",
        ),
    ],
    timeline=[
        TimelineEntry("2026-07-05 08:14:22", "User j.smith opened phishing email with subject 'Urgent Invoice Q3'"),
        TimelineEntry("2026-07-05 08:14:47", "Macro enabled in invoice_Q3_macro.xlsm - child process winword.exe spawned"),
        TimelineEntry("2026-07-05 08:15:03", "powershell.exe launched with Base64-encoded download cradle"),
        TimelineEntry("2026-07-05 08:15:18", "Outbound HTTP GET to evil-update.cdn-malware.net/stage/payload.ps1"),
        TimelineEntry("2026-07-05 08:15:31", "Payload hash a3f5b8c2... written to %TEMP%\\update.ps1", "high"),
        TimelineEntry("2026-07-05 08:16:02", "C2 beacon established to 185.234.72.91:443", "high"),
        TimelineEntry("2026-07-05 08:17:45", "Suspicious LSASS memory access detected by EDR", "critical"),
        TimelineEntry("2026-07-05 08:18:10", "SIEM alert ORION-CRIT-0142 correlated across endpoint and network logs", "high"),
        TimelineEntry("2026-07-05 08:22:00", "SOC analyst initiated OrionOps multi-agent investigation"),
        TimelineEntry("2026-07-05 08:25:30", "Endpoint FIN-WKS-017 isolated from corporate network", "high"),
    ],
    risk_score=6,
    risk_level="High",
    confidence="High",
    threat_score_severity="high",
)


def build_scenario_from_input(incident_text: str) -> InvestigationScenario:
    """Return the default scenario but personalize the title from user input."""
    title = incident_text.strip().split("\n")[0][:120] or DEFAULT_SCENARIO.title
    return InvestigationScenario(
        incident_id=DEFAULT_SCENARIO.incident_id,
        title=title,
        summary=DEFAULT_SCENARIO.summary,
        severity=DEFAULT_SCENARIO.severity,
        category=DEFAULT_SCENARIO.category,
        affected_asset=DEFAULT_SCENARIO.affected_asset,
        operating_system=DEFAULT_SCENARIO.operating_system,
        attack_vector=DEFAULT_SCENARIO.attack_vector,
        detection_source=DEFAULT_SCENARIO.detection_source,
        current_status=DEFAULT_SCENARIO.current_status,
        malicious_ip=DEFAULT_SCENARIO.malicious_ip,
        malicious_domain=DEFAULT_SCENARIO.malicious_domain,
        malicious_url=DEFAULT_SCENARIO.malicious_url,
        file_hash=DEFAULT_SCENARIO.file_hash,
        suspicious_file=DEFAULT_SCENARIO.suspicious_file,
        suspicious_process=DEFAULT_SCENARIO.suspicious_process,
        compromised_account=DEFAULT_SCENARIO.compromised_account,
        endpoint_hostname=DEFAULT_SCENARIO.endpoint_hostname,
        mitre_mappings=DEFAULT_SCENARIO.mitre_mappings,
        timeline=DEFAULT_SCENARIO.timeline,
        risk_score=DEFAULT_SCENARIO.risk_score,
        risk_level=DEFAULT_SCENARIO.risk_level,
        confidence=DEFAULT_SCENARIO.confidence,
        threat_score_severity=DEFAULT_SCENARIO.threat_score_severity,
    )
