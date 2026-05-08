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
