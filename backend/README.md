# LoadForge Backend

## Overview
FastAPI service that runs async load tests with aiohttp and returns latency and throughput metrics.

## Setup
1. Create and activate a Python virtual environment.
2. Install dependencies:
   - `pip install -r requirements.txt`

## Run
- Development server:
  - `uvicorn api.main:app --reload --port 8000`

## API
- `GET /health` -> `{ "status": "ok" }`
- `POST /test` -> JSON metrics
