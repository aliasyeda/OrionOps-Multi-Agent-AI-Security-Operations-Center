# 🛡️ OrionOps – Multi-Agent AI Security Operations Center (SOC)

> An AI-powered Security Operations Center (SOC) platform that performs automated incident investigation using a multi-agent architecture, generates threat intelligence, risk assessments, response recommendations, and comprehensive incident reports.

---
## Google AI Agents Capstone Project

This project was developed as part of Google's **5-Day AI Agents: Intensive Vibe Coding Course** Capstone Project, demonstrating a multi-agent cybersecurity investigation workflow with a modern SOC dashboard.

## 🚀 Demo

🎥 **Demo Video**
> https://youtu.be/7CZQ2ha5Ntk

📂 **GitHub Repository**
> https://github.com/aliasyeda/OrionOps-Multi-Agent-AI-Security-Operations-Center

---

# Overview

OrionOps is a cybersecurity incident investigation platform designed to simulate how a modern SOC can automate security investigations using multiple AI agents.

The system analyzes security incidents, coordinates specialized agents, enriches threat intelligence, evaluates risk, generates mitigation recommendations, builds investigation timelines, and produces downloadable incident reports.

The project demonstrates how multiple specialized AI agents can collaborate to automate enterprise security workflows.

---

# Key Features

✅ Multi-Agent Investigation Workflow

✅ Interactive SOC Dashboard

✅ Incident Intake

✅ Threat Intelligence Enrichment

✅ MITRE ATT&CK Mapping

✅ Risk Assessment Dashboard

✅ Investigation Timeline

✅ Automated Recommendations

✅ Incident Response Planning

✅ PDF Report Generation

✅ SQLite Memory Support

---

# Multi-Agent Architecture

The investigation pipeline consists of specialized agents:

1. Manager Agent
   - Coordinates the complete investigation workflow.

2. Intake Agent
   - Parses and structures incoming security incidents.

3. Threat Intelligence Agent
   - Enriches indicators of compromise (IOCs).

4. Investigation Agent
   - Correlates evidence and identifies attack activity.

5. Risk Assessment Agent
   - Calculates overall incident risk.

6. Timeline Agent
   - Builds chronological investigation events.

7. Recommendation Agent
   - Suggests containment and remediation actions.

8. Response Agent
   - Generates incident response plans.

9. Report Agent
   - Produces the final investigation report.

---

# Memory Architecture

OrionOps includes a SQLite-backed memory layer for maintaining investigation context.

Memory Components:

- SQLite Database
- Incident Storage
- Investigation Context
- Agent State Management
- Workflow Tracking

Benefits:

- Persistent investigation history
- Structured incident records
- Context sharing between workflow stages
- Local lightweight storage
- Easy deployment without external databases

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite

## Backend

- Python
- FastAPI
- SQLite

## Security

- MITRE ATT&CK Mapping
- IOC Processing
- Risk Scoring
- Threat Intelligence Simulation

## Reporting

- PDF Report Generation

---

# Project Structure

```
OrionOps Frontend/
    React + TypeScript Dashboard

OrionOps Backend/
    Multi-Agent Backend
    Memory
    Tools
    Agents
    SQLite Database

Demo Backend/
    Simulation Backend
    Demo Investigation Pipeline
```

---

# Workflow

Incident Submitted

↓

Manager Agent

↓

Intake Agent

↓

Threat Intelligence

↓

Investigation

↓

Risk Assessment

↓

Timeline Generation

↓

Recommendations

↓

Incident Response

↓

Final PDF Report

---

# Example Outputs

The platform automatically generates:

- Executive Summary

- Threat Intelligence Report

- MITRE ATT&CK Mapping

- Risk Assessment

- Investigation Timeline

- Response Plan

- Containment Strategy

- PDF Incident Report

---

# Example Incident Types

✔ Phishing

✔ PowerShell Malware

✔ Ransomware

✔ Credential Theft

✔ Command & Control

✔ Suspicious Login Activity

✔ USB Data Exfiltration

✔ Brute Force Attacks

---

# Screenshots

Add screenshots here:

- Dashboard
- Investigation Workflow
- Threat Intelligence
- Risk Assessment
- Timeline
- Final Report

---

# Future Improvements

- Live Threat Intelligence APIs
- Real-time SIEM Integration
- SOAR Automation
- Azure Sentinel Integration
- Splunk Integration
- VirusTotal Integration
- CrowdStrike Integration
- Multi-user Authentication
- Cloud Deployment

---

# Repository

GitHub

https://github.com/aliasyeda/OrionOps-Multi-Agent-AI-Security-Operations-Center

---

# Author

**Syeda Alia Samia**

AI • Machine Learning • Cybersecurity
