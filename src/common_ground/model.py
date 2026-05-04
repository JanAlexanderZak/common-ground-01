from dataclasses import dataclass, field


@dataclass
class TopicMetadata:
    topic: str | None = None
    title: str | None = None
    language: str | None = None
    version: str | None = None
    contributors: list[str] = field(default_factory=list)
    license: str | None = None
    actors_registry: str | None = None


@dataclass
class Source:
    url: str | None = None
    label: str | None = None
    retrieved: str | None = None
    source_type: str | None = None
    jurisdiction: str | None = None


@dataclass
class DataRef:
    path: str
    label: str | None = None
    description: str | None = None


@dataclass
class Statement:
    id: str
    layer: int
    text: str
    sources: list[Source] = field(default_factory=list)
    endorsed_by: list[str] = field(default_factory=list)
    disputed_by: list[str] = field(default_factory=list)
    data_refs: list[DataRef] = field(default_factory=list)


@dataclass
class Edge:
    source: str
    target: str
    relation: str


@dataclass
class TypedGraph:
    statements: list[Statement] = field(default_factory=list)
    edges: list[Edge] = field(default_factory=list)
    metadata: TopicMetadata = field(default_factory=TopicMetadata)
