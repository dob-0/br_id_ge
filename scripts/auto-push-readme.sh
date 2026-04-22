#!/usr/bin/env bash

set -euo pipefail

# Watches README.md and auto-commits + pushes whenever it changes.
# Usage: ./scripts/auto-push-readme.sh [branch] [interval_seconds]

BRANCH="${1:-main}"
INTERVAL="${2:-2}"
README_FILE="README.md"

if [[ ! -d .git ]]; then
  echo "Error: run this script from the repository root."
  exit 1
fi

if [[ ! -f "$README_FILE" ]]; then
  echo "Error: README.md not found in repository root."
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is required."
  exit 1
fi

last_mtime="$(stat -c %Y "$README_FILE")"

echo "Auto-push watcher started for $README_FILE on branch $BRANCH"
echo "Checking every ${INTERVAL}s. Press Ctrl+C to stop."

while true; do
  sleep "$INTERVAL"

  current_mtime="$(stat -c %Y "$README_FILE")"
  if [[ "$current_mtime" == "$last_mtime" ]]; then
    continue
  fi
  last_mtime="$current_mtime"

  # Give editors a moment to complete atomic save operations.
  sleep 1

  if git diff --quiet -- "$README_FILE"; then
    continue
  fi

  timestamp="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
  message="chore(readme): auto-update ${timestamp}"

  echo "Change detected in $README_FILE"

  git add "$README_FILE"

  # Commit can fail if there are no staged changes after normalization.
  if git commit -m "$message" >/dev/null 2>&1; then
    echo "Committed: $message"
  else
    echo "Skipped commit (nothing to commit)."
    continue
  fi

  if git push origin "$BRANCH"; then
    echo "Pushed to origin/$BRANCH"
  else
    echo "Push failed. Leaving commit local; retry push manually."
  fi
done