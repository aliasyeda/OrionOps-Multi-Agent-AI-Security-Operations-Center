"""Simulated multi-agent investigation pipeline (no LLM)."""

from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator

from .events import EventBuilder
from .scenario import InvestigationScenario, build_scenario_from_input

# Realistic pacing for demo video — agents appear to work sequentially.
AGENT_DELAY_SECONDS = 0.55
TOOL_DELAY_SECONDS = 0.25


async def _pause(seconds: float) -> None:
    await asyncio.sleep(seconds)


async def run_investigation_pipeline(incident_text: str) -> AsyncIterator[str]:
    """Yield SSE-formatted ADK events for the full 9-agent pipeline."""
    scenario = build_scenario_from_input(incident_text)
    builder = EventBuilder()

    async for event in _manager_agent(builder, scenario):
        yield event

    async for event in _intake_agent(builder, scenario):
        yield event

    async for event in _threat_intelligence_agent(builder, scenario):
        yield event

    async for event in _investigation_agent(builder, scenario):
        yield event

    async for event in _risk_assessment_agent(builder, scenario):
        yield event

    async for event in _timeline_agent(builder, scenario):
        yield event

    async for event in _recommendation_agent(builder, scenario):
        yield event

    async for event in _response_agent(builder, scenario):
        yield event

    async for event in _report_agent(builder, scenario):
        yield event


async def _manager_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "manager_agent"
    await _pause(AGENT_DELAY_SECONDS)

    yield builder.to_sse(
        builder.function_call_event(
            author,
            "create_incident_tool",
            {
                "title": scenario.title,
                "description": scenario.summary,
                "severity": scenario.severity,
            },
        )
    )
    await _pause(TOOL_DELAY_SECONDS)

    yield builder.to_sse(
        builder.function_response_event(
            author,
            "create_incident_tool",
            {
                "incident_id": scenario.incident_id,
                "status": "Open",
                "message": "Incident created successfully.",
            },
        )
    )
    await _pause(TOOL_DELAY_SECONDS)

    yield builder.to_sse(
        builder.function_call_event(
            author,
            "update_workflow_stage_tool",
            {"incident_id": scenario.incident_id, "stage": "Intake"},
        )
    )
    await _pause(TOOL_DELAY_SECONDS)

    yield builder.to_sse(
        builder.function_response_event(
            author,
            "update_workflow_stage_tool",
            {
                "success": True,
                "incident_id": scenario.incident_id,
                "current_stage": "Intake",
            },
        )
    )
    await _pause(TOOL_DELAY_SECONDS)

    yield builder.to_sse(
        builder.text_event(
            author,
            (
                f"Investigation workflow initiated for incident #{scenario.incident_id}. "
                f"Severity: {scenario.severity}. Routing to Intake Agent for structured "
                "data normalization."
            ),
            transfer_to="intake_agent",
        )
    )


async def _intake_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "intake_agent"
    await _pause(AGENT_DELAY_SECONDS)

    intake_text = f"""Incident Title: {scenario.title}
Incident Summary: {scenario.summary}
Severity: {scenario.severity}
Incident Category: {scenario.category}
Affected Asset: {scenario.affected_asset}
Operating System: {scenario.operating_system}
Attack Vector: {scenario.attack_vector}
Indicators of Compromise:
  - IP: {scenario.malicious_ip}
  - Domain: {scenario.malicious_domain}
  - URL: {scenario.malicious_url}
  - File Hash (SHA-256): {scenario.file_hash}
Suspicious Files: {scenario.suspicious_file}
Suspicious Processes: {scenario.suspicious_process}
IP Addresses: {scenario.malicious_ip}
Domains: {scenario.malicious_domain}
URLs: {scenario.malicious_url}
File Hashes: {scenario.file_hash}
User Actions: Opened phishing attachment and enabled macros
Detection Source: {scenario.detection_source}
Current Status: {scenario.current_status}"""

    yield builder.to_sse(
        builder.text_event(author, intake_text, transfer_to="threat_intelligence_agent")
    )


async def _threat_intelligence_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "threat_intelligence_agent"
    await _pause(AGENT_DELAY_SECONDS)

    for mapping in scenario.mitre_mappings:
        yield builder.to_sse(
            builder.function_call_event(
                author,
                "map_to_mitre_tool",
                {"indicator": mapping.indicator},
            )
        )
        await _pause(TOOL_DELAY_SECONDS)

        yield builder.to_sse(
            builder.function_response_event(
                author,
                "map_to_mitre_tool",
                {
                    "technique_id": mapping.technique_id,
                    "technique_name": mapping.technique_name,
                    "tactic": mapping.tactic,
                },
            )
        )
        await _pause(TOOL_DELAY_SECONDS)

    threat_text = f"""Threat Type: Emotet-derived malware delivery with C2 beaconing
Threat Category: Malware / Command and Control
Confidence: {scenario.confidence}

IOC Analysis:
- Malicious IP {scenario.malicious_ip}: Known Emotet C2 infrastructure (VirusTotal score 92/95, AbuseIPDB 100% confidence)
- Malicious Domain {scenario.malicious_domain}: Registered 3 days ago, flagged by 14 threat feeds
- File Hash {scenario.file_hash}: Matches Emotet loader variant (Hybrid Analysis malicious)
- URL {scenario.malicious_url}: Hosts PowerShell download cradle

Likely MITRE ATT&CK Techniques: T1566.001, T1059.001, T1071.001, T1003.001, T1021.002
Possible Malware: Emotet loader / QakBot dropper chain
Attacker Objective: Initial foothold, credential theft, and lateral movement preparation
Potential Impact: Finance workstation compromise, credential exposure, potential ransomware staging

Threat Analysis:
The combination of spearphishing delivery, encoded PowerShell execution, and outbound
connections to {scenario.malicious_ip} strongly indicates an active intrusion. The
malicious domain {scenario.malicious_domain} is associated with recent Emotet campaigns
targeting financial services organizations."""

    yield builder.to_sse(
        builder.text_event(author, threat_text, transfer_to="investigation_agent")
    )


async def _investigation_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "investigation_agent"
    await _pause(AGENT_DELAY_SECONDS)

    investigation_text = f"""Investigation Summary

Confirmed Findings:
- Phishing email delivered macro-enabled document {scenario.suspicious_file} to {scenario.compromised_account}
- {scenario.suspicious_process} executed with encoded download command (Base64 cradle confirmed in EDR telemetry)
- Outbound connection from {scenario.endpoint_hostname} to {scenario.malicious_ip}:443 within 60 seconds of macro execution
- Payload retrieved from {scenario.malicious_url} matches hash {scenario.file_hash[:16]}...
- LSASS memory access attempt consistent with credential dumping (T1003.001)

Possible Attack Path:
- User opened phishing attachment -> macro spawned PowerShell -> payload downloaded -> C2 established -> credential access attempted

Evidence:
- Microsoft Defender alert ID 0x8F2A91BC
- Proxy logs showing HTTP GET to {scenario.malicious_domain}
- Process creation chain: WINWORD.EXE -> POWERSHELL.EXE -> CMD.EXE
- Network flow: {scenario.endpoint_hostname} -> {scenario.malicious_ip}:443 (TLS, JA3 fingerprint matches known botnet)

Additional Evidence Required:
- Full memory dump from {scenario.endpoint_hostname}
- Email header analysis for phishing origin
- Authentication logs for {scenario.compromised_account} (last 72 hours)

Confidence Level: High"""

    yield builder.to_sse(
        builder.text_event(author, investigation_text, transfer_to="risk_assessment_agent")
    )


async def _risk_assessment_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "risk_assessment_agent"
    await _pause(AGENT_DELAY_SECONDS)

    yield builder.to_sse(
        builder.function_call_event(
            author,
            "calculate_risk_tool",
            {"severity": scenario.severity, "confidence": scenario.confidence},
        )
    )
    await _pause(TOOL_DELAY_SECONDS)

    yield builder.to_sse(
        builder.function_response_event(
            author,
            "calculate_risk_tool",
            {
                "risk_score": scenario.risk_score,
                "risk_level": scenario.risk_level,
                "severity": scenario.severity,
                "confidence": scenario.confidence,
            },
        )
    )
    await _pause(TOOL_DELAY_SECONDS)

    risk_text = f"""Risk Level: {scenario.risk_level}
Confidence: {scenario.confidence}
Threat Score: 78
Risk Score: {scenario.risk_score}
Likelihood of Compromise: High - active C2 and credential access indicators confirmed
Business Impact: High - finance department workstation with access to payment processing systems
Confidentiality Impact: High - potential credential theft from {scenario.compromised_account}
Integrity Impact: Medium - no confirmed data modification yet
Availability Impact: Low - endpoint isolated before ransomware deployment
Critical Assets: {scenario.affected_asset}, Active Directory credentials, payment approval workflows
Risk Justification: Active malware with C2 communication and credential dumping attempts on a
finance workstation warrants High risk classification with High confidence."""

    yield builder.to_sse(
        builder.text_event(author, risk_text, transfer_to="timeline_agent")
    )


async def _timeline_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "timeline_agent"
    await _pause(AGENT_DELAY_SECONDS)

    for entry in scenario.timeline:
        yield builder.to_sse(
            builder.function_call_event(
                author,
                "log_timeline_event_tool",
                {"incident_id": scenario.incident_id, "event": entry.event},
            )
        )
        await _pause(TOOL_DELAY_SECONDS * 0.6)

        yield builder.to_sse(
            builder.function_response_event(
                author,
                "log_timeline_event_tool",
                {
                    "incident_id": scenario.incident_id,
                    "timestamp": entry.timestamp,
                    "event": entry.event,
                },
            )
        )
        await _pause(TOOL_DELAY_SECONDS * 0.4)

    timeline_text = "Investigation Timeline\n\n" + "\n".join(
        f"- [{entry.timestamp}] {entry.event}" for entry in scenario.timeline
    )

    yield builder.to_sse(
        builder.text_event(author, timeline_text, transfer_to="recommendation_agent")
    )


async def _recommendation_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "recommendation_agent"
    await _pause(AGENT_DELAY_SECONDS)

    recommendations_text = f"""Immediate Actions:
- Isolate endpoint {scenario.endpoint_hostname} from all network segments (COMPLETED)
- Block outbound connections to {scenario.malicious_ip} at perimeter firewall
- Block DNS resolution for {scenario.malicious_domain} across all DNS servers
- Disable compromised account {scenario.compromised_account} and force password reset
- Reset all active sessions for affected user

Short-Term Remediation:
- Reimage {scenario.endpoint_hostname} from known-good gold image
- Deploy updated EDR signatures for hash {scenario.file_hash[:16]}...
- Scan all finance department endpoints for matching IOCs
- Review email gateway rules to block similar phishing templates

Long-Term Improvements:
- Enable Attack Surface Reduction (ASR) rules to block Office macro execution
- Implement application allowlisting on finance workstations
- Deploy phishing-resistant MFA for all finance department accounts

Monitoring Recommendations:
- Create SIEM correlation rule for PowerShell + outbound C2 pattern
- Enable enhanced PowerShell script block logging (Event ID 4104)
- Monitor for lateral movement from finance VLAN to domain controllers

Preventive Controls:
- Mandatory security awareness training focused on macro-enabled documents
- Implement email attachment sandboxing for external senders

Priority: Critical"""

    yield builder.to_sse(
        builder.text_event(author, recommendations_text, transfer_to="response_agent")
    )


async def _response_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "response_agent"
    await _pause(AGENT_DELAY_SECONDS)

    response_text = f"""Containment:
- Isolate endpoint {scenario.endpoint_hostname} from corporate network (COMPLETED)
- Block malicious IP {scenario.malicious_ip} at firewall and proxy (IN PROGRESS)
- Block malicious domain {scenario.malicious_domain} at DNS and web proxy
- Disable compromised account {scenario.compromised_account} in Active Directory

Eradication:
- Collect forensic evidence: full disk image and memory dump from {scenario.endpoint_hostname}
- Remove malicious payload matching hash {scenario.file_hash[:16]}... from all scanned endpoints
- Terminate persistent scheduled tasks and registry run keys on affected host
- Purge cached credentials and revoke all OAuth tokens for {scenario.compromised_account}

Recovery:
- Reimage {scenario.endpoint_hostname} from hardened gold image
- Restore user access with new credentials after MFA re-enrollment
- Validate clean state with EDR full scan before returning to production VLAN
- Monitor reconnected endpoint for 72 hours with heightened alerting

Validation:
- Confirm no remaining C2 connections to {scenario.malicious_ip}
- Verify no lateral movement indicators across finance subnet
- Conduct post-incident tabletop review within 5 business days

Response Priority: Critical
Estimated Response Complexity: High"""

    yield builder.to_sse(
        builder.text_event(author, response_text, transfer_to="report_agent")
    )


async def _report_agent(
    builder: EventBuilder, scenario: InvestigationScenario
) -> AsyncIterator[str]:
    author = "report_agent"
    await _pause(AGENT_DELAY_SECONDS)

    yield builder.to_sse(
        builder.function_call_event(
            author,
            "generate_report_tool",
            {"incident_id": scenario.incident_id, "format": "markdown"},
        )
    )
    await _pause(TOOL_DELAY_SECONDS)

    yield builder.to_sse(
        builder.function_response_event(
            author,
            "generate_report_tool",
            {
                "incident_id": scenario.incident_id,
                "status": "generated",
                "format": "markdown",
            },
        )
    )
    await _pause(TOOL_DELAY_SECONDS)

    report_text = f"""# OrionOps Incident Investigation Report

## 1. Executive Summary
On 2026-07-05, the OrionOps SOC initiated a multi-agent investigation into suspicious
PowerShell activity on finance workstation {scenario.endpoint_hostname}. The investigation
confirmed an Emotet-derived malware delivery via phishing, active C2 communication to
{scenario.malicious_ip}, and attempted credential dumping. The endpoint has been isolated
and response actions are underway.

## 2. Incident Overview
- **Incident ID:** {scenario.incident_id}
- **Title:** {scenario.title}
- **Severity:** {scenario.severity}
- **Category:** {scenario.category}
- **Affected Asset:** {scenario.affected_asset}
- **Compromised Account:** {scenario.compromised_account}
- **Detection Source:** {scenario.detection_source}

## 3. Technical Findings
Macro-enabled phishing document ({scenario.suspicious_file}) spawned encoded PowerShell
({scenario.suspicious_process}) which downloaded a payload from {scenario.malicious_url}.
The payload hash {scenario.file_hash} matches known Emotet loader variants. C2 beaconing
to {scenario.malicious_ip} was confirmed within 60 seconds of initial execution.

## 4. Threat Intelligence Summary
| Indicator | Type | Reputation |
|-----------|------|------------|
| {scenario.malicious_ip} | IP Address | Malicious (Emotet C2) |
| {scenario.malicious_domain} | Domain | Malicious (14 threat feeds) |
| {scenario.file_hash[:16]}... | SHA-256 | Malicious (Emotet loader) |

MITRE ATT&CK: T1566.001, T1059.001, T1071.001, T1003.001, T1021.002

## 5. Risk Assessment
- **Risk Level:** {scenario.risk_level}
- **Risk Score:** {scenario.risk_score} (composite: {scenario.risk_score * 12}/100)
- **Threat Score:** 78/100
- **Confidence:** {scenario.confidence}
- **Business Impact:** High (finance department, payment processing access)

## 6. Investigation Timeline
{chr(10).join(f"- [{e.timestamp}] {e.event}" for e in scenario.timeline)}

## 7. Recommended Actions
1. Maintain isolation of {scenario.endpoint_hostname}
2. Block {scenario.malicious_ip} and {scenario.malicious_domain} organization-wide
3. Disable and reset {scenario.compromised_account}
4. Reimage affected endpoint from gold image
5. Deploy enhanced monitoring for PowerShell + C2 patterns

## 8. Incident Response Plan
**Containment:** Network isolation, IP/domain blocking, account disable (in progress)
**Eradication:** Forensic collection, payload removal, persistence cleanup
**Recovery:** Reimage, credential reset, MFA re-enrollment, 72-hour enhanced monitoring
**Validation:** C2 verification, lateral movement scan, post-incident review

## 9. Conclusion
This incident represents a confirmed compromise of a finance workstation via phishing-delivered
malware with active C2 and credential access attempts. Immediate containment has been
effective. Full eradication and recovery should be completed within 24-48 hours. Long-term
improvements should focus on macro blocking and phishing-resistant authentication for
finance department users.

---
Report generated by OrionOps Report Agent | Incident #{scenario.incident_id}"""

    yield builder.to_sse(builder.text_event(author, report_text))
