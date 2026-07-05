"""
OrionOps Demo Backend

ADK-compatible API server that simulates the 9-agent SOC investigation pipeline
without Gemini, OpenAI, Google ADK, or any LLM.

Endpoints match the real ADK 2.x server used by orionops-frontend:
  GET  /list-apps
  POST /apps/{app_name}/users/{user_id}/sessions
  GET  /apps/{app_name}/users/{user_id}/sessions/{session_id}
  POST /run_sse
"""

from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from simulation.pipeline import run_investigation_pipeline

APP_NAME = "OrionOps"
DEFAULT_USER_ID = "soc-analyst"

app = FastAPI(title="OrionOps Demo Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_sessions: dict[str, dict[str, Any]] = {}


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class MessagePart(BaseModel):
    text: str | None = None


class NewMessage(CamelModel):
    role: str | None = None
    parts: list[MessagePart] | None = None


class RunAgentRequest(CamelModel):
    app_name: str | None = Field(default=None, alias="appName")
    user_id: str = Field(alias="userId")
    session_id: str = Field(alias="sessionId")
    new_message: NewMessage | None = Field(default=None, alias="newMessage")
    streaming: bool = False
    state_delta: dict[str, Any] | None = Field(default=None, alias="stateDelta")
    invocation_id: str | None = Field(default=None, alias="invocationId")


class SessionResponse(CamelModel):
    id: str
    app_name: str = Field(alias="appName")
    user_id: str = Field(alias="userId")
    state: dict[str, Any] = Field(default_factory=dict)
    events: list[dict[str, Any]] = Field(default_factory=list)
    last_update_time: float = Field(default=0.0, alias="lastUpdateTime")


def _session_key(app_name: str, user_id: str, session_id: str) -> str:
    return f"{app_name}:{user_id}:{session_id}"


def _build_session(app_name: str, user_id: str, session_id: str) -> SessionResponse:
    return SessionResponse(
        id=session_id,
        appName=app_name,
        userId=user_id,
        state={},
        events=[],
        lastUpdateTime=time.time(),
    )


def _extract_incident_text(req: RunAgentRequest) -> str:
    if not req.new_message or not req.new_message.parts:
        return "Suspicious activity detected on corporate endpoint."
    parts = [p.text for p in req.new_message.parts if p.text]
    return "\n".join(parts).strip() or "Suspicious activity detected on corporate endpoint."


@app.get("/list-apps")
async def list_apps() -> list[str]:
    return [APP_NAME]


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "mode": "demo"}


@app.post(
    "/apps/{app_name}/users/{user_id}/sessions",
    response_model=SessionResponse,
    response_model_by_alias=True,
)
async def create_session(
    app_name: str,
    user_id: str,
) -> SessionResponse:
    if app_name != APP_NAME:
        raise HTTPException(status_code=404, detail=f"App not found: {app_name}")

    session_id = f"session-{uuid.uuid4().hex[:16]}"
    session = _build_session(app_name, user_id, session_id)
    _sessions[_session_key(app_name, user_id, session_id)] = session.model_dump(
        by_alias=True
    )
    return session


@app.get(
    "/apps/{app_name}/users/{user_id}/sessions/{session_id}",
    response_model=SessionResponse,
    response_model_by_alias=True,
)
async def get_session(
    app_name: str,
    user_id: str,
    session_id: str,
) -> SessionResponse:
    key = _session_key(app_name, user_id, session_id)
    stored = _sessions.get(key)
    if not stored:
        raise HTTPException(status_code=404, detail="Session not found")
    return SessionResponse(**stored)


@app.post("/run_sse")
async def run_agent_sse(req: RunAgentRequest) -> StreamingResponse:
    app_name = req.app_name or APP_NAME
    key = _session_key(app_name, req.user_id, req.session_id)

    if key not in _sessions:
        raise HTTPException(
            status_code=404,
            detail=f"Session not found: {req.session_id}",
        )

    incident_text = _extract_incident_text(req)

    async def event_generator():
        async for sse_chunk in run_investigation_pipeline(incident_text):
            yield sse_chunk

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
