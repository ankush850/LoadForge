from typing import Literal

from pydantic import AnyHttpUrl, BaseModel, Field


class TestRequest(BaseModel):
    url: AnyHttpUrl
    total_requests: int = Field(..., gt=0, le=10000)
    concurrency: int = Field(..., gt=0, le=500)
    mode: Literal["normal", "spike", "ramp"] = "normal"
    ramp_up: float = Field(0, ge=0)


class LatencyPoint(BaseModel):
    index: int
    latency_ms: float


class TestResponse(BaseModel):
    total_requests: int
    success_count: int
    failure_count: int
    avg_latency_ms: float
    min_latency_ms: float
    max_latency_ms: float
    p50: float
    p90: float
    p95: float
    p99: float
    total_time_s: float
    requests_per_second: float
    status_codes: dict[str, int]
    latency_series: list[LatencyPoint]
