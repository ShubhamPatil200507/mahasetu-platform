@echo off
echo === Building Frontend Assets ===
call npm run build

echo === Starting MahaSetu Production Server on port 8000 ===
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
