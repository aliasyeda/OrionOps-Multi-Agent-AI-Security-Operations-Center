"""Helpers to build ADK-compatible SSE event payloads."""

from __future__ import annotations

import json
import time
import uuid
from typing import Any


def _new_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


class EventBuilder:
    """Builds camelCase ADK Event JSON objects."""

    def __init__(self) -> None:
        self.invocation_id = f"inv-{uuid.uuid4().hex[:16]}"
        self._event_counter = 0

    def _base(self, author: str) -> dict[str, Any]:
        self._event_counter += 1
        return {
            "id": _new_id("evt"),
            "invocationId": self.invocation_id,
            "author": author,
            "timestamp": time.time(),
            "actions": {},
        }

    def text_event(self, author: str, text: str, transfer_to: str | None = None) -> dict[str, Any]:
        event = self._base(author)
        event["content"] = {
            "role": "model",
            "parts": [{"text": text}],
        }
        if transfer_to:
            event["actions"] = {"transferToAgent": transfer_to}
        return event

    def function_call_event(
        self,
        author: str,
        name: str,
        args: dict[str, Any],
    ) -> dict[str, Any]:
        event = self._base(author)
        event["content"] = {
            "role": "model",
            "parts": [{"functionCall": {"name": name, "args": args}}],
        }
        return event

    def function_response_event(
        self,
        author: str,
        name: str,
        response: dict[str, Any],
        transfer_to: str | None = None,
    ) -> dict[str, Any]:
        event = self._base(author)
        event["content"] = {
            "role": "model",
            "parts": [{"functionResponse": {"name": name, "response": response}}],
        }
        if transfer_to:
            event["actions"] = {"transferToAgent": transfer_to}
        return event

    def transfer_event(self, author: str, transfer_to: str) -> dict[str, Any]:
        event = self._base(author)
        event["actions"] = {"transferToAgent": transfer_to}
        return event

    @staticmethod
    def to_sse(event: dict[str, Any]) -> str:
        return f"data: {json.dumps(event, separators=(',', ':'))}\n\n"
