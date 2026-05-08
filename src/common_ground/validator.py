from dataclasses import dataclass
from pathlib import Path
from typing import Literal

from common_ground.model import TypedGraph

IssueKind = Literal["unknown-statement", "unknown-actor", "missing-data-file"]
Severity = Literal["error", "warning"]

_REGISTRY_NON_ACTOR_FILES = {"README", "schema"}


@dataclass(frozen=True)
class Issue:
    severity: Severity
    kind: IssueKind
    detail: str


def validate_graph(
    graph: TypedGraph,
    *,
    actors_dir: Path | None = None,
    topic_dir: Path | None = None,
) -> list[Issue]:
    issues: list[Issue] = []
    issues.extend(_check_edge_targets(graph))
    if actors_dir is not None:
        issues.extend(_check_actor_refs(graph, actors_dir))
    if topic_dir is not None:
        issues.extend(_check_data_refs(graph, topic_dir))
    return issues


def _check_edge_targets(graph: TypedGraph) -> list[Issue]:
    known = {s.id for s in graph.statements}
    issues: list[Issue] = []
    for edge in graph.edges:
        if edge.target not in known:
            issues.append(
                Issue(
                    severity="error",
                    kind="unknown-statement",
                    detail=(
                        f"edge {edge.source} --{edge.relation}--> {edge.target}: "
                        f"target not in graph"
                    ),
                )
            )
    return issues


def _check_actor_refs(graph: TypedGraph, actors_dir: Path) -> list[Issue]:
    if not actors_dir.is_dir():
        return []
    known = {
        p.stem for p in actors_dir.glob("*.md") if p.stem not in _REGISTRY_NON_ACTOR_FILES
    }
    issues: list[Issue] = []
    for s in graph.statements:
        for actor_id in s.endorsed_by + s.disputed_by:
            if actor_id not in known:
                issues.append(
                    Issue(
                        severity="error",
                        kind="unknown-actor",
                        detail=f"statement {s.id}: actor @{actor_id} not in {actors_dir}",
                    )
                )
    return issues


def _check_data_refs(graph: TypedGraph, topic_dir: Path) -> list[Issue]:
    if not topic_dir.is_dir():
        return []
    issues: list[Issue] = []
    for s in graph.statements:
        for ref in s.data_refs:
            if not _data_ref_resolves(ref.path, topic_dir):
                issues.append(
                    Issue(
                        severity="error",
                        kind="missing-data-file",
                        detail=(
                            f"statement {s.id}: data ref '{ref.path}' "
                            f"not found under {topic_dir}"
                        ),
                    )
                )
    return issues


def _data_ref_resolves(ref_path: str, topic_dir: Path) -> bool:
    # Statements typically live in <topic>/statements/, so a ref like
    # "../data/x.csv" resolves to <topic>/data/x.csv. Also accept refs
    # written relative to <topic> directly, and bare-name refs against
    # <topic>/data/.
    candidates = [
        topic_dir / "statements" / ref_path,
        topic_dir / ref_path,
        topic_dir / "data" / Path(ref_path).name,
    ]
    return any(c.resolve().is_file() for c in candidates)
