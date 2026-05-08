from pathlib import Path

from common_ground import (
    DataRef,
    Edge,
    Statement,
    TypedGraph,
    parse_dir,
    validate_graph,
)

ROOT = Path(__file__).parent.parent


def test_empty_graph_validates_clean():
    assert validate_graph(TypedGraph()) == []


def test_resolved_edges_validate_clean():
    graph = TypedGraph(
        statements=[
            Statement(id="f1", layer=0, text="Premise."),
            Statement(id="p1", layer=4, text="Policy."),
        ],
        edges=[Edge(source="p1", target="f1", relation="supports")],
    )
    assert validate_graph(graph) == []


def test_flags_dangling_edge_target():
    graph = TypedGraph(
        statements=[Statement(id="p1", layer=4, text="Policy.")],
        edges=[Edge(source="p1", target="f99", relation="supports")],
    )
    issues = validate_graph(graph)

    assert len(issues) == 1
    assert issues[0].kind == "unknown-statement"
    assert "f99" in issues[0].detail


def test_flags_unknown_actor_when_actors_dir_given(tmp_path: Path):
    actors_dir = tmp_path / "actors"
    actors_dir.mkdir()
    (actors_dir / "destatis.md").write_text("# Destatis\n", encoding="utf-8")
    (actors_dir / "README.md").write_text("# Registry\n", encoding="utf-8")

    graph = TypedGraph(
        statements=[
            Statement(
                id="f1",
                layer=0,
                text="Fact.",
                endorsed_by=["destatis", "phantom-actor"],
                disputed_by=["another-phantom"],
            ),
        ],
    )
    issues = validate_graph(graph, actors_dir=actors_dir)

    assert len(issues) == 2
    kinds = {i.kind for i in issues}
    assert kinds == {"unknown-actor"}
    details = " ".join(i.detail for i in issues)
    assert "phantom-actor" in details
    assert "another-phantom" in details
    assert "destatis" not in details


def test_does_not_check_actors_when_no_actors_dir_given():
    graph = TypedGraph(
        statements=[
            Statement(id="f1", layer=0, text="Fact.", endorsed_by=["anyone"]),
        ],
    )
    assert validate_graph(graph) == []


def test_flags_missing_data_file_when_topic_dir_given(tmp_path: Path):
    (tmp_path / "data").mkdir()
    (tmp_path / "data" / "real.csv").write_text("a,b\n1,2\n", encoding="utf-8")
    (tmp_path / "statements").mkdir()

    graph = TypedGraph(
        statements=[
            Statement(
                id="f1",
                layer=0,
                text="Fact.",
                data_refs=[
                    DataRef(path="../data/real.csv"),
                    DataRef(path="../data/missing.csv"),
                ],
            ),
        ],
    )
    issues = validate_graph(graph, topic_dir=tmp_path)

    assert len(issues) == 1
    assert issues[0].kind == "missing-data-file"
    assert "missing.csv" in issues[0].detail


def test_does_not_check_data_when_no_topic_dir_given():
    graph = TypedGraph(
        statements=[
            Statement(
                id="f1",
                layer=0,
                text="Fact.",
                data_refs=[DataRef(path="anywhere.csv")],
            ),
        ],
    )
    assert validate_graph(graph) == []


def test_full_example_validates_clean():
    topic_dir = ROOT / "examples" / "full"
    graph = parse_dir(topic_dir)
    issues = validate_graph(graph, topic_dir=topic_dir)
    assert issues == [], "\n".join(f"{i.kind}: {i.detail}" for i in issues)


def test_schuldenbremse_validates_clean():
    topic_dir = ROOT / "topics" / "schuldenbremse"
    graph = parse_dir(topic_dir)
    issues = validate_graph(
        graph, actors_dir=ROOT / "actors", topic_dir=topic_dir
    )
    assert issues == [], "\n".join(f"{i.kind}: {i.detail}" for i in issues)
