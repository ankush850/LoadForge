const formatValue = (value, fallback = "N/A") =>
  value !== undefined && value !== null && value !== "" ? value : fallback;

function TestMetaCard({ meta, results }) {
  const target = meta?.url || "N/A";
  const totalRequests = formatValue(
    meta?.total_requests ?? results?.total_requests
  );
  const concurrency = formatValue(meta?.concurrency ?? results?.concurrency);
  const mode = formatValue(meta?.mode ?? results?.mode);
  const rampUp =
    mode === "ramp" ? formatValue(meta?.ramp_up ?? results?.ramp_up) : "N/A";

  return (
    <div className="rounded-2xl border border-white/10 bg-ink/60 p-4">
      <div className="grid grid-cols-5 gap-4 text-xs text-slate-400">
        <div>
          <p className="uppercase tracking-[0.2em]">Target</p>
          <p
            className="mt-1 truncate text-sm font-semibold text-slate-100"
            title={target}
          >
            {target}
          </p>
        </div>
        <div>
          <p className="uppercase tracking-[0.2em]">Requests</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {totalRequests}
          </p>
        </div>
        <div>
          <p className="uppercase tracking-[0.2em]">Concurrency</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {concurrency}
          </p>
        </div>
        <div>
          <p className="uppercase tracking-[0.2em]">Mode</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{mode}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.2em]">Ramp Up</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {rampUp}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestMetaCard;
