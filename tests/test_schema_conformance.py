import json
from pathlib import Path

import jsonschema
import pytest

from common_ground import parse_dir, to_json

ROOT = Path(__file__).parent.parent
SCHEMA = json.loads((ROOT / "src" / "format" / "schema.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize(
    "topic_path",
    [
        ROOT / "tests" / "fixtures" / "minimal",
        ROOT / "tests" / "fixtures" / "edges",
        ROOT / "tests" / "fixtures" / "full",
        ROOT / "src" / "topics" / "schuldenbremse",
    ],
    ids=lambda p: p.relative_to(ROOT).as_posix(),
)
def test_to_json_conforms_to_schema(topic_path: Path) -> None:
    graph = parse_dir(topic_path)
    payload = json.loads(to_json(graph))
    jsonschema.validate(instance=payload, schema=SCHEMA)
