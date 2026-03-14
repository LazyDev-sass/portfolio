#!/usr/bin/env bash
# Simple script to run the React portfolio on macOS/Linux

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Installing dependencies..."
npm install

echo
echo "Starting development server on http://localhost:3000 ..."
echo "(Press CTRL+C to stop)"
echo
npm start

