#!/usr/bin/env bash
# Create a new video project: ./scripts/new_project.sh "project-name"
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ $# -ge 1 ] || { echo "usage: $0 <slug>"; exit 1; }
SLUG="$(echo "$1" | tr ' ' '-' )"
DIR="$ROOT/projects/$(date +%Y-%m-%d)_$SLUG"
mkdir -p "$DIR"/{raw,assets,work,exports,thumbs}
cp "$ROOT/templates/brief.md" "$DIR/brief.md"
cp "$ROOT/templates/script.md" "$DIR/script.md"
echo "$DIR"
