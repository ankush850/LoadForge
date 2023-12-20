from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

from engine.load_tester import LoadTester
from models.schemas import TestRequest, TestResponse
from storage.history_store import append_history, delete_history_item, list_history

MAX_REQUESTS = 10000
MAX_CONCURRENCY = 500

app = FastAPI(title="LoadForge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok"}


@app.post("/test", response_model=TestResponse)
async def run_test(payload: TestRequest) -> TestResponse:
    try:
        if payload.total_requests > MAX_REQUESTS:
            raise ValueError(f"total_requests must be <= {MAX_REQUESTS}")
        if payload.concurrency > MAX_CONCURRENCY:
            raise ValueError(f"concurrency must be <= {MAX_CONCURRENCY}")
        if payload.mode == "ramp" and payload.ramp_up <= 0:
            raise ValueError("ramp_up must be greater than 0 for ramp mode")

        tester = LoadTester(
            url=str(payload.url),
            total_requests=payload.total_requests,
            concurrency=payload.concurrency,
            mode=payload.mode,
            ramp_up_s=payload.ramp_up,
        )
        result = await tester.run()
        history_record = {
            "id": str(uuid4()),
            "url": str(payload.url),
            "total_requests": payload.total_requests,
            "concurrency": payload.concurrency,
            "mode": payload.mode,
            "ramp_up": payload.ramp_up,
            "results": result,
        }
        await append_history(history_record)
        return TestResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Test failed") from exc


@app.get("/history")
async def get_history() -> list[dict]:
    return await list_history()


@app.delete("/history/{test_id}")
async def delete_history(test_id: str) -> dict:
    deleted = await delete_history_item(test_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"message": "Test deleted successfully"}
