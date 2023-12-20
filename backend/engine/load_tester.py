from __future__ import annotations

import asyncio
import math
import time
from typing import Any, Dict, List

import aiohttp


class LoadTester:
    def __init__(
        self,
        url: str,
        total_requests: int,
        concurrency: int,
        mode: str = "normal",
        ramp_up_s: float = 0.0,
        timeout_s: float = 10.0,
        max_requests: int = 10000,
    ) -> None:
        if total_requests <= 0:
            raise ValueError("total_requests must be greater than 0")
        if total_requests > max_requests:
            raise ValueError(f"total_requests must be <= {max_requests}")
        if concurrency <= 0:
            raise ValueError("concurrency must be greater than 0")

        if mode not in {"normal", "spike", "ramp"}:
            raise ValueError("mode must be one of: normal, spike, ramp")
        if ramp_up_s < 0:
            raise ValueError("ramp_up must be >= 0")
        if mode == "ramp" and ramp_up_s == 0:
            raise ValueError("ramp_up must be greater than 0 for ramp mode")

        self.url = url
        self.total_requests = total_requests
        self.concurrency = min(concurrency, total_requests)
        self.mode = mode
        self.ramp_up_s = ramp_up_s
        self.timeout_s = timeout_s

    async def _single_request(
        self,
        session: aiohttp.ClientSession,
        semaphore: asyncio.Semaphore,
        index: int,
        records: List[Dict[str, Any]],
    ) -> None:
        async with semaphore:
            start = time.perf_counter()
            ok = False
            status = None
            try:
                async with session.get(self.url) as response:
                    status = response.status
                    await response.read()
                    ok = 200 <= response.status < 400
            except Exception:
                ok = False

            latency_ms = (time.perf_counter() - start) * 1000
            records[index] = {
                "index": index + 1,
                "latency_ms": round(latency_ms, 2),
                "ok": ok,
                "status": status,
            }

    def _percentile(self, sorted_latencies: List[float], percentile: float) -> float:
        if not sorted_latencies:
            return 0.0
        rank = math.ceil((percentile / 100) * len(sorted_latencies)) - 1
        rank = min(max(rank, 0), len(sorted_latencies) - 1)
        return round(sorted_latencies[rank], 2)

    async def _schedule_tasks(
        self,
        session: aiohttp.ClientSession,
        semaphore: asyncio.Semaphore,
        records: List[Dict[str, Any]],
    ) -> None:
        tasks = []
        if self.mode == "ramp":
            # Spread task creation over ramp_up_s seconds.
            interval = self.ramp_up_s / self.total_requests
            for index in range(self.total_requests):
                tasks.append(
                    asyncio.create_task(
                        self._single_request(session, semaphore, index, records)
                    )
                )
                if interval > 0:
                    await asyncio.sleep(interval)
        else:
            tasks = [
                asyncio.create_task(
                    self._single_request(session, semaphore, index, records)
                )
                for index in range(self.total_requests)
            ]

        await asyncio.gather(*tasks)

    async def run(self) -> Dict[str, Any]:
        records: List[Dict[str, Any]] = [None] * self.total_requests
        timeout = aiohttp.ClientTimeout(total=self.timeout_s)
        effective_concurrency = (
            self.total_requests if self.mode == "spike" else self.concurrency
        )
        connector = aiohttp.TCPConnector(limit=effective_concurrency)
        semaphore = asyncio.Semaphore(effective_concurrency)

        start_time = time.perf_counter()
        async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
            await self._schedule_tasks(session, semaphore, records)

        total_time_s = time.perf_counter() - start_time
        latencies = [record["latency_ms"] for record in records if record]
        sorted_latencies = sorted(latencies)
        success_count = sum(1 for record in records if record and record["ok"])
        failure_count = self.total_requests - success_count

        avg_latency_ms = round(sum(latencies) / len(latencies), 2) if latencies else 0.0
        min_latency_ms = round(min(latencies), 2) if latencies else 0.0
        max_latency_ms = round(max(latencies), 2) if latencies else 0.0
        requests_per_second = (
            round(self.total_requests / total_time_s, 2) if total_time_s > 0 else 0.0
        )

        status_counts: Dict[str, int] = {}
        for record in records:
            if not record:
                continue
            status = record.get("status")
            status_key = str(status) if status is not None else "error"
            status_counts[status_key] = status_counts.get(status_key, 0) + 1

        return {
            "total_requests": self.total_requests,
            "success_count": success_count,
            "failure_count": failure_count,
            "avg_latency_ms": avg_latency_ms,
            "min_latency_ms": min_latency_ms,
            "max_latency_ms": max_latency_ms,
            "p50": self._percentile(sorted_latencies, 50),
            "p90": self._percentile(sorted_latencies, 90),
            "p95": self._percentile(sorted_latencies, 95),
            "p99": self._percentile(sorted_latencies, 99),
            "total_time_s": round(total_time_s, 2),
            "requests_per_second": requests_per_second,
            "status_codes": status_counts,
            "latency_series": [
                {"index": record["index"], "latency_ms": record["latency_ms"]}
                for record in records
                if record
            ],
        }
