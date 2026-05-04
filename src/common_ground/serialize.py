import json
from dataclasses import asdict

from common_ground.model import TypedGraph


def to_json(graph: TypedGraph, *, indent: int | None = 2) -> str:
    return json.dumps(asdict(graph), indent=indent, ensure_ascii=False)
