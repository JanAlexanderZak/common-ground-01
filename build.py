"""Parse a topic directory and emit JSON to stdout.

Usage: python build.py <topic-path>
"""

import sys
from pathlib import Path

from common_ground import parse_dir, to_json


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(f"usage: {argv[0]} <topic-path>", file=sys.stderr)
        return 2

    print(to_json(parse_dir(Path(argv[1]))))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
