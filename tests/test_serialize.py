import json
from pathlib import Path

from common_ground import parse_dir, to_json

EXAMPLES_DIR = Path(__file__).parent / "fixtures"


def test_to_json_round_trips_full_example():
    graph = parse_dir(EXAMPLES_DIR / "full")
    payload = to_json(graph)
    data = json.loads(payload)

    assert data["metadata"]["topic"] == "full-example"
    assert data["metadata"]["title"] == "Full example"

    assert len(data["statements"]) == 2
    f1 = next(s for s in data["statements"] if s["id"] == "f1")
    assert f1["layer"] == 0
    assert f1["sources"][0]["url"] == "https://example.org/gdp-2023"
    assert f1["endorsed_by"] == ["example-stats-agency"]
    assert f1["data_refs"][0]["path"] == "../data/gdp.csv"

    assert data["edges"] == [
        {"source": "p1", "target": "f1", "relation": "supports"},
    ]


def test_to_json_compact_when_indent_none():
    graph = parse_dir(EXAMPLES_DIR / "minimal")
    payload = to_json(graph, indent=None)

    assert "\n" not in payload
    json.loads(payload)


def test_derived_upstream_by_id_transitive_and_excludes_self():
    # edges fixture: p1 -> c1, p1 -> p2, p2 -> p1, c1 -> f1, c1 -> f2.
    graph = parse_dir(EXAMPLES_DIR / "edges")
    upstream = json.loads(to_json(graph))["derived"]["upstream_by_id"]

    assert upstream["c1"] == ["f1", "f2"]
    # p1 reaches everything except itself; p2 is reached via the mutual edge.
    assert upstream["p1"] == ["c1", "f1", "f2", "p2"]
    assert upstream["p2"] == ["c1", "f1", "f2", "p1"]
    # Every statement gets an entry, even leaves with no outgoing edges.
    assert upstream["f1"] == []
    assert upstream["f2"] == []


def test_derived_edge_pairs_dedup_and_mutual():
    graph = parse_dir(EXAMPLES_DIR / "edges")
    pairs = json.loads(to_json(graph))["derived"]["edge_pairs"]

    # 5 directed edges in fixture but p1<->p2 collapses to one pair: 4 entries.
    assert len(pairs) == 4

    mutual = [p for p in pairs if p["mutual"]]
    assert len(mutual) == 1
    m = mutual[0]
    assert {m["source"], m["target"]} == {"p1", "p2"}
    assert {m["relation"], m["inverseRelation"]} == {"attacks", "attacked-by"}

    # Non-mutual entries omit inverseRelation entirely.
    for p in pairs:
        if not p["mutual"]:
            assert "inverseRelation" not in p
