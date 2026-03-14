#!/usr/bin/env bash
# Simple script to run the React portfolio on macOS/Linux/Termux

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Installing dependencies..."
npm install

echo
echo "Starting portfolio dev server on http://localhost:3000 ..."
echo "(Press CTRL+C to stop)"
echo
npm start

echo
echo "To run the admin dashboard (in another session):"
echo "  cd \"$SCRIPT_DIR\""
echo "  npm run admin   # then open http://localhost:4000/admin"
echo

