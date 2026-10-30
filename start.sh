#!/usr/bin/env bash
set -e

echo "=== Building Frontend Assets ==="
npm run build

echo "=== Starting MahaSetu Production Server on port ${PORT:-8000} ==="
exec uvicorn backend.main:app --host 0.0.0.0 --port "${PORT:-8000}"
