#!/usr/bin/env bash

set -euo pipefail

# Watches the repo and auto-commits + pushes whenever project files change.
# Usage: ./scripts/auto-push-space.sh [branch] [interval_seconds]

BRANCH="${1:-main}"
INTERVAL="${2:-2}"

if [[ ! -d .git ]]; then
  echo "Error: run this script from the repository root."
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is required."
  exit 1
fi

WATCHED_PATHS=(
  "README.md"
  "DEVELOPMENT.md"
  "docs"
  "index.html"
  "references"
  "scripts"
  "serverXR"
  "src"
  ".github"
  ".vscode"
  ".nojekyll"
  ".env.example"
  "package.json"
  "package-lock.json"
)

FORBIDDEN_PATTERNS=(
  "api[_-]?key"
  "password"
  "secret"
  "token"
  "credentials"
  "private[_-]?key"
  "aws[_-]?secret"
  "DATABASE[_-]?URL"
  "STRIPE[_-]"
  "GITHUB[_-]?TOKEN"
)

matches_sensitive_content() {
  local file="$1"
  for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    if grep -qi "$pattern" "$file" 2>/dev/null; then
      echo "⚠️  WARNING: Possible sensitive data detected in $file"
      echo "   Pattern: $pattern"
      return 0
    fi
  done
  return 1
}

list_changed_files() {
  local status_files
  status_files="$(
    {
      git diff --name-only -- "${WATCHED_PATHS[@]}"
      git ls-files --others --exclude-standard -- "${WATCHED_PATHS[@]}"
    } | sort -u
  )"
  printf '%s\n' "$status_files"
}

check_for_secrets() {
  local file
  while IFS= read -r file; do
    [[ -n "$file" ]] || continue
    if matches_sensitive_content "$file"; then
      echo "❌ Commit BLOCKED for security. Remove sensitive data and try again."
      return 1
    fi
  done < <(list_changed_files)
}

echo "Auto-push watcher started for multi-file repo sync on branch $BRANCH"
echo "Watching: ${WATCHED_PATHS[*]}"
echo "Checking every ${INTERVAL}s. Press Ctrl+C to stop."

last_snapshot=""

while true; do
  sleep "$INTERVAL"

  current_snapshot="$(
    git status --porcelain -- "${WATCHED_PATHS[@]}" || true
  )"

  if [[ "$current_snapshot" == "$last_snapshot" ]]; then
    continue
  fi
  last_snapshot="$current_snapshot"

  # Give editors a moment to complete atomic save operations.
  sleep 1

  if [[ -z "$(list_changed_files)" ]]; then
    continue
  fi

  if ! check_for_secrets; then
    continue
  fi

  timestamp="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
  message="chore(sync): auto-update ${timestamp}"

  echo "Change detected in watched project files"

  git add -- "${WATCHED_PATHS[@]}"

  if git diff --cached --quiet; then
    continue
  fi

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
