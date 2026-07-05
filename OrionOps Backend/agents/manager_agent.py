from google.adk.agents import Agent

# -----------------------------
# Import Sub Agents
# -----------------------------
from .intake_agent import intake_agent
from .threat_intelligence_agent import threat_intelligence_agent
from .investigation_agent import investigation_agent
from .risk_assessment_agent import risk_assessment_agent
from .timeline_agent import timeline_agent
from .recommendation_agent import recommendation_agent
from .response_agent import response_agent
from .report_agent import report_agent

# -----------------------------
# Import Tools
# -----------------------------
from ..tools.case_manager import create_incident_tool
from ..tools.workflow_manager import update_workflow_stage_tool


manager_agent = Agent(
    name="manager_agent",
    model="gemini-2.5-flash",

    description="""
Central orchestration agent for OrionOps.
Responsible for starting the cybersecurity investigation workflow.
""",

    tools=[
        create_incident_tool,
        update_workflow_stage_tool,
    ],

    sub_agents=[
        intake_agent,
        threat_intelligence_agent,
        investigation_agent,
        risk_assessment_agent,
        timeline_agent,
        recommendation_agent,
        response_agent,
        report_agent,
    ],

    instruction="""
You are the Manager Agent of OrionOps.

Your ONLY responsibility is to START the cybersecurity investigation workflow.

Workflow:

1. Receive the user's cybersecurity incident.
2. Verify that the request is related to cybersecurity.
3. Call the Incident Creation Tool.
4. Call the Workflow Stage Tool and update the workflow stage to "Intake".
5. Immediately transfer control to intake_agent.

IMPORTANT RULES:

- Start the workflow only.
- Do NOT wait for specialist agents to return.
- Do NOT call any other specialist after intake_agent.
- The specialist agents will transfer directly to the next specialist.
- Never perform technical analysis.
- Never investigate incidents.
- Never calculate risk.
- Never generate recommendations.
- Never perform incident response.
- Never generate reports.
- Never answer specialist questions yourself.
"""
)