#!/usr/bin/env bash
set -euo pipefail

export PLAYWRIGHT_BROWSERS_PATH=0

# Storybook open-in-editor uses launch-editor; Cursor CLI is often missing from PATH.
if [[ -z "${LAUNCH_EDITOR:-}" ]]; then
  if command -v cursor >/dev/null 2>&1; then
    export LAUNCH_EDITOR=cursor
  elif [[ -x "/Applications/Cursor.app/Contents/Resources/app/bin/cursor" ]]; then
    export LAUNCH_EDITOR="/Applications/Cursor.app/Contents/Resources/app/bin/cursor"
  elif command -v code >/dev/null 2>&1; then
    export LAUNCH_EDITOR=code
  fi
fi

exec storybook dev -p 6006 "$@"
