const buildInsights = (results, meta) => {
  if (!results) return [];
  const insights = [];

  const variance = results.max_latency_ms - results.min_latency_ms;
  if (variance > results.avg_latency_ms * 1.5) {
    insights.push("High variance detected in response times.");
  }

  if (meta?.mode === "spike" && results.p95 > results.avg_latency_ms * 1.4) {
    insights.push("Spike load increased latency significantly.");
  }

  if (meta?.mode === "ramp" && results.p95 < results.avg_latency_ms * 1.2) {
    insights.push("System appears stable under ramp load.");
  }

  if (results.failure_count > 0) {
    insights.push("Failures detected. Review status code distribution.");
  }

  if (insights.length === 0) {
    insights.push("Performance looks consistent for this run.");
  }

  return insights;
};

function InsightsPanel({ results, meta }) {
  const insights = buildInsights(results, meta);

  return (
    <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
      <p className="text-sm font-semibold">Insights</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {insights.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-ember" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InsightsPanel;
