const format = (value, suffix = "") =>
  value !== undefined && value !== null ? `${value}${suffix}` : "--";

const diffLabel = (left, right, suffix = "") => {
  if (left === undefined || right === undefined) return "--";
  const diff = right - left;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff.toFixed(2)}${suffix}`;
};

function CompareView({ left, right }) {
  const leftResults = left?.results || {};
  const rightResults = right?.results || {};

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Compare Runs</h2>
        <p className="text-xs text-slate-400">Diff = Right - Left</p>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Left Run</p>
          <p className="mt-2 text-sm text-slate-300">{left?.url}</p>
          <p className="mt-1 text-xs text-slate-500">{left?.timestamp}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Right Run</p>
          <p className="mt-2 text-sm text-slate-300">{right?.url}</p>
          <p className="mt-1 text-xs text-slate-500">{right?.timestamp}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Difference Snapshot</p>
          <p className="mt-2 text-sm text-slate-300">
            P95: {diffLabel(leftResults.p95, rightResults.p95, " ms")}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            P99: {diffLabel(leftResults.p99, rightResults.p99, " ms")}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            RPS: {diffLabel(leftResults.requests_per_second, rightResults.requests_per_second)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Left Metrics</p>
          <div className="mt-2 space-y-2 text-sm text-slate-300">
            <p>Avg Latency: {format(leftResults.avg_latency_ms, " ms")}</p>
            <p>P95: {format(leftResults.p95, " ms")}</p>
            <p>P99: {format(leftResults.p99, " ms")}</p>
            <p>RPS: {format(leftResults.requests_per_second)}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
          <p className="text-xs uppercase text-slate-400">Right Metrics</p>
          <div className="mt-2 space-y-2 text-sm text-slate-300">
            <p>Avg Latency: {format(rightResults.avg_latency_ms, " ms")}</p>
            <p>P95: {format(rightResults.p95, " ms")}</p>
            <p>P99: {format(rightResults.p99, " ms")}</p>
            <p>RPS: {format(rightResults.requests_per_second)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareView;
