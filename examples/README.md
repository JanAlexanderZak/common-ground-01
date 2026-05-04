# Examples

Three reference topics that exercise the format from minimal to full coverage. Each is a self-contained topic directory parseable via `parse_dir(path)`.

| Topic | What it shows |
|---|---|
| [minimal/](minimal/) | Single L0 statement, no edges, no metadata. The smallest valid topic. |
| [edges/](edges/) | Multiple layers, multiple files, edges across files (`evidence`, `supports`, `attacks`, `attacked-by`). |
| [full/](full/) | Every Phase-A primitive: enriched citations, actor endorsements + disputes, data references against committed CSVs. |

These doubles as conformance fixtures: the test suite parses each one and asserts on statement and edge counts.
