"""Serialize a `TypedGraph` to JSON for downstream consumers (CLI, web).

The output layers authored data (`statements`, `edges`, `metadata`) over a
`derived` block of pre-computed fields the renderer would otherwise re-derive
on every load: the deduplicated edge-pair view (with mutual flags) used by
the canvas, and per-statement transitive upstream IDs used for selection
highlighting.
"""

import json
from collections import defaultdict, deque
from dataclasses import asdict
from typing import Any

from common_ground.model import Edge, Statement, TypedGraph


def _upstream_by_id(
    statements: list[Statement], edges: list[Edge]
) -> dict[str, list[str]]:
    """Map each statement id to ids reachable via outgoing edges (excluding self).

    Every statement gets an entry — leaves and isolates map to an empty list.
    """
    adj: dict[str, list[str]] = defaultdict(list)
    for e in edges:
        adj[e.source].append(e.target)

    result: dict[str, list[str]] = {}
    for s in statements:
        start = s.id
        reached: set[str] = set()
        queue: deque[str] = deque([start])
        while queue:
            cur = queue.popleft()
            for nxt in adj.get(cur, ()):
                if nxt == start or nxt in reached:
                    continue
                reached.add(nxt)
                queue.append(nxt)
        result[start] = sorted(reached)
    return result


def _edge_pairs(edges: list[Edge]) -> list[dict[str, Any]]:
    """Deduplicate to one entry per unordered (a,b) pair; flag mutual edges with inverseRelation."""
    by_directed: dict[tuple[str, str], str] = {
        (e.source, e.target): e.relation for e in edges
    }
    seen: set[frozenset[str]] = set()
    out: list[dict[str, Any]] = []
    for e in edges:
        key = frozenset((e.source, e.target))
        if key in seen:
            continue
        seen.add(key)
        inverse = by_directed.get((e.target, e.source))
        entry: dict[str, Any] = {
            "source": e.source,
            "target": e.target,
            "relation": e.relation,
            "mutual": inverse is not None,
        }
        if inverse is not None:
            entry["inverseRelation"] = inverse
        out.append(entry)
    return out


def to_json(graph: TypedGraph, *, indent: int | None = 2) -> str:
    """Return the graph as a JSON string (UTF-8, non-ASCII preserved)."""
    payload = asdict(graph)
    payload["derived"] = {
        "edge_pairs": _edge_pairs(graph.edges),
        "upstream_by_id": _upstream_by_id(graph.statements, graph.edges),
    }
    return json.dumps(payload, indent=indent, ensure_ascii=False)
