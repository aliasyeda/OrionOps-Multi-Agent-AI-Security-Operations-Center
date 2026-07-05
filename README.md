# 🛡️ OrionOps – Multi-Agent AI Security Operations Center (SOC)

> An AI-powered Multi-Agent Security Operations Center (SOC) that automates cyber incident investigation, threat intelligence analysis, risk assessment, response planning, and executive report generation using modern AI agent orchestration.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)
![SQLite](https://img.shields.io/badge/SQLite-Memory-blue)
![Google ADK](https://img.shields.io/badge/Google-ADK-red)
![MITRE ATT&CK](https://img.shields.io/badge/MITRE-ATT%26CK-darkred)
![License](https://img.shields.io/badge/Status-Capstone-success)

---

# 🚀 Project Overview

OrionOps is a modern **AI-powered Security Operations Center (SOC)** designed to automate cyber incident investigations using a collaborative **multi-agent architecture**.

Instead of relying on a single AI model, OrionOps coordinates specialized agents responsible for investigation, threat intelligence, timeline reconstruction, risk analysis, response planning, and executive reporting.

The platform demonstrates how AI agents can work together to reduce analyst workload while improving investigation speed and consistency.

This project was developed as part of the **Google AI Agents: Intensive Vibe Coding Capstone Project (Kaggle 2026).**

---

# 🎯 Capstone Highlights

This project demonstrates several concepts explored during the Google AI Agents program, including:

✅ Multi-Agent Architecture

✅ Agent Coordination

✅ Google ADK Project Structure

✅ Persistent Memory (SQLite)

✅ Threat Intelligence Automation

✅ Risk Assessment

✅ Incident Response Planning

✅ Executive Report Generation

✅ Modern React Dashboard

---

# 🏗 System Architecture

```text
                   ┌─────────────────────┐
                   │   SOC Analyst/User  │
                   └──────────┬──────────┘
                              │
                              ▼
                  OrionOps Frontend Dashboard
                              │
                              ▼
                  Investigation Manager Agent
                              │
      ┌─────────┬────────┬────────┬─────────┬─────────┐
      ▼         ▼        ▼        ▼         ▼
 Intake     Threat     Timeline   Risk   Response
 Agent       Intel      Agent     Agent    Agent
 Agent       Agent
      └──────────┬───────────────┬──────────────┘
                 ▼
            Report Agent
                 │
                 ▼
       Executive PDF Incident Report
```

---

# 🔄 Investigation Workflow

```text
SOC Alert
    │
    ▼
Incident Intake
    │
    ▼
Threat Investigation
    │
    ▼
Timeline Reconstruction
    │
    ▼
Risk Assessment
    │
    ▼
Recommendations
    │
    ▼
Response Planning
    │
    ▼
Executive PDF Report
```

---

# 🤖 Multi-Agent Workflow

| AI Agent | Responsibility |
|----------|----------------|
| Intake Agent | Receives and validates incident information |
| Investigation Agent | Coordinates investigation workflow |
| Threat Intelligence Agent | Identifies IOCs and threat intelligence |
| Timeline Agent | Builds chronological attack timeline |
| Risk Assessment Agent | Calculates business & technical risk |
| Recommendation Agent | Suggests mitigation strategies |
| Response Agent | Generates containment & recovery plan |
| Report Agent | Produces executive PDF report |

---

# 🧠 Persistent Memory

OrionOps includes a lightweight **SQLite-based memory layer** for maintaining investigation state.

The memory stores:

- Investigation context
- Historical incidents
- Case metadata
- Agent workflow progress
- Investigation state
- Conversation context

SQLite was selected because it provides lightweight local persistence without requiring an external database server, making it ideal for demonstrations and rapid development.

---

# ⚙ Google ADK Integration

This repository contains the original **Google Agent Development Kit (ADK)** implementation developed during the capstone project.

The project includes:

- Modular ADK agent architecture
- Individual AI agents
- Agent manager
- Memory services
- Security tools
- Report generation pipeline
- SQLite persistence

Due to API quota limitations encountered during development, a lightweight **Demo Backend** was also created to simulate realistic multi-agent execution while preserving the complete frontend experience.

This repository therefore contains both:

- **Original ADK Backend**
- **Demo Backend used for demonstration**

---

# ✨ Features

- Multi-Agent Investigation Pipeline
- AI-powered Threat Intelligence
- MITRE ATT&CK Mapping
- Risk Assessment Dashboard
- Investigation Timeline
- Executive Report Generation
- Automated Recommendations
- Response Planning
- Downloadable PDF Reports
- Interactive SOC Dashboard
- SQLite Investigation Memory

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Modern Dashboard UI

## Backend

- Python
- FastAPI
- Google Agent Development Kit (ADK)
- SQLite
- Modular Multi-Agent Architecture

## AI Components

- Multi-Agent Workflow
- Threat Intelligence
- Risk Analysis
- Report Generation
- Incident Response

---

# 📂 Repository Structure

```text
OrionOps/
│
├── orionops-frontend/
│      React + TypeScript Dashboard
│
├── OrionOps Backend/
│      Google ADK Multi-Agent Backend
│      Agents
│      Memory
│      SQLite
│      Security Tools
│
├── Demo Backend/
│      Lightweight Demonstration Backend
│      Scenario Simulator
│      Report Generator
│
└── README.md
```

---

# 📊 Dashboard

The dashboard provides:

- Live SOC Overview
- Investigation Progress
- Threat Score
- Risk Assessment
- MITRE ATT&CK Coverage
- Timeline
- Threat Intelligence
- Recommendations
- Response Plan
- Executive Report

---

# 📄 Executive Report

Every investigation automatically generates a professional incident report containing:

- Executive Summary
- Incident Overview
- Technical Findings
- Threat Intelligence
- MITRE ATT&CK Mapping
- Risk Assessment
- Investigation Timeline
- Recommendations
- Response Plan
- Final Conclusion

Reports are downloadable as PDF.

---

# 🔐 Security Concepts Demonstrated

- Security Operations Center (SOC)
- AI Agent Collaboration
- Threat Intelligence
- Incident Investigation
- Risk Analysis
- MITRE ATT&CK Mapping
- Security Automation
- Persistent Memory
- Cybersecurity Workflow Orchestration

---

# 📸 Screenshots

<img width="958" height="503" alt="Screenshot 2026-07-06 004454" src="https://github.com/user-attachments/assets/84a646d1-49e3-4f16-9b4f-61af64a9b48c" />

<img width="959" height="502" alt="Screenshot 2026-07-06 010241" src="https://github.com/user-attachments/assets/0a1f8c1d-b27b-4471-9bed-ea240ed1fd56" />

<img width="959" height="468" alt="Screenshot 2026-07-06 010307" src="https://github.com/user-attachments/assets/4d8f39e1-fb11-4e02-800a-ae3b7f2877e8" />

---

# 🎥 Demo Video

https://youtu.be/7CZQ2ha5Ntk

---

# 📝 Kaggle Write-up

Complete project write-up:

https://kaggle.com/competitions/vibecoding-agents-capstone-project/writeups/orionops-multi-agent-ai-security-operations-cente

---

# 💻 GitHub Repository

https://github.com/aliasyeda/OrionOps-Multi-Agent-AI-Security-Operations-Center

---

# 🚀 Future Improvements

- Live SIEM Integration
- MCP Server Integration
- Real-time Threat Intelligence APIs
- Cloud Deployment
- Multi-user Authentication
- Long-Term Agent Memory
- RAG-powered Investigation
- LLM Threat Hunting
- Automated Playbooks
- Enterprise SOC Integrations

---

# 👨‍💻 Developed By

**Syeda Alia Samia**

This project was independently designed and developed for the **Google AI Agents: Intensive Vibe Coding Capstone Project (2026)**, showcasing a multi-agent cybersecurity workflow for automated SOC investigation
