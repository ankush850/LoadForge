import { useState } from "react";
import InsightsPanel from "./InsightsPanel.jsx";
import LatencyChart from "./LatencyChart.jsx";
import StatusChart from "./StatusChart.jsx";
import SuccessPie from "./SuccessPie.jsx";
import TestMetaCard from "./TestMetaCard.jsx";

const format = (value, suffix = "") =>
  value !== undefined && value !== null ? `${value}${suffix}` : "--";

function ResultsDashboard({ results, meta }) {
  const [showAverage, setShowAverage] = useState(true);

  if (!results) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-sm text-slate-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-ink/60">
          <span className="text-2xl">LF</span>
        </div>
        <div>
          <p className="text-base font-semibold">No results yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Run a test to visualize system performance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TestMetaCard meta={meta} results={results} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Success</p>
          <p className="mt-2 text-2xl font-semibold">
            {format(results.success_count)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Failures</p>
          <p className="mt-2 text-2xl font-semibold text-emberSoft">
            {format(results.failure_count)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Avg Latency</p>
          <p className="mt-2 text-2xl font-semibold">
            {format(results.avg_latency_ms, " ms")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">RPS</p>
          <p className="mt-2 text-2xl font-semibold">
            {format(results.requests_per_second)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Min Latency</p>
          <p className="mt-2 text-xl font-semibold">
            {format(results.min_latency_ms, " ms")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Max Latency</p>
          <p className="mt-2 text-xl font-semibold">
            {format(results.max_latency_ms, " ms")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Total Time</p>
          <p className="mt-2 text-xl font-semibold">
            {format(results.total_time_s, " s")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">P50</p>
          <p className="mt-2 text-xl font-semibold">
            {format(results.p50, " ms")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">P90</p>
          <p className="mt-2 text-xl font-semibold">
            {format(results.p90, " ms")}
          </p>
        </div>
        <div className="rounded-2xl border border-ember/40 bg-ink/60 p-4 shadow-[0_0_20px_rgba(255,107,74,0.15)]">
          <p className="text-xs uppercase text-slate-400">P95</p>
          <p className="mt-2 text-xl font-semibold">
            {format(results.p95, " ms")}
          </p>
          <p className="mt-2 text-xs text-emberSoft">
            95% of requests completed under this time
          </p>
        </div>
        <div className="rounded-2xl border border-ember/50 bg-ink/60 p-4 shadow-[0_0_24px_rgba(255,107,74,0.25)]">
          <p className="text-xs uppercase text-slate-400">P99</p>
          <p className="mt-2 text-xl font-semibold">
            {format(results.p99, " ms")}
          </p>
          <p className="mt-2 text-xs text-emberSoft">
            99% of requests completed under this time
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Latency Over Time</p>
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-white/20 bg-ink/60 text-ember focus:ring-ember/40"
                checked={showAverage}
                onChange={() => setShowAverage((value) => !value)}
              />
              Show moving average
            </label>
          </div>
          <LatencyChart data={results.latency_series} showAverage={showAverage} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-sm font-semibold">Success vs Failure</p>
          <SuccessPie
            success={results.success_count}
            failure={results.failure_count}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
        <p className="text-sm font-semibold">HTTP Status Distribution</p>
        <StatusChart data={results.status_codes} />
      </div>

      <InsightsPanel results={results} meta={meta} />
    </div>
  );
}

export default ResultsDashboard;
