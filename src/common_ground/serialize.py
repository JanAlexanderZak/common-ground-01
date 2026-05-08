"""Serialize a `TypedGraph` to JSON for downstream consumers (CLI, web)."""

import json
from dataclasses import asdict

from common_ground.model import TypedGraph


def to_json(graph: TypedGraph, *, indent: int | None = 2) -> str:
    """Return the graph as a JSON string (UTF-8, non-ASCII preserved)."""
    return json.dumps(asdict(graph), indent=indent, ensure_ascii=False)
