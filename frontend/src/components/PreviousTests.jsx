const formatTimestamp = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatValue = (value) => (value === undefined || value === null ? "N/A" : value);

function PreviousTests({
  items,
  selectedRun,
  compareSelection,
  error,
  onSelect,
  onToggleCompare,
  onClearCompare,
  onDelete,
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-steel/70 p-6 backdrop-blur fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Previous Tests</h2>
        <button
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:text-white"
          onClick={onClearCompare}
        >
          Selected: {compareSelection.length} / 2
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Select a run to view details or pick two for comparison.
      </p>
      {error && (
        <div className="mt-4 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-emberSoft">
          {error}
        </div>
      )}
      {!error && items.length === 0 && (
        <p className="mt-4 text-sm text-slate-400">No history yet.</p>
      )}
      {items.length > 0 && (
        <div className="mt-4 max-h-[520px] overflow-auto">
          <div className="w-full text-sm text-slate-300">
            <div className="grid grid-cols-[180px_1.5fr_100px_120px_100px_80px_100px] px-4 py-3 text-xs uppercase text-slate-400">
              <div>Timestamp</div>
              <div>URL</div>
              <div className="text-center">Requests</div>
              <div className="text-center">Concurrency</div>
              <div className="text-center">Mode</div>
              <div className="text-center">Select</div>
              <div className="text-center">Delete</div>
            </div>
            {items.map((item, index) => {
              console.log("Run data:", item);
              const isSelected = selectedRun?.id === item.id;
              const isCompared = compareSelection.includes(item.id);
              const isDisabled = !isCompared && compareSelection.length >= 2;
              const [datePart, timePart] = formatTimestamp(item.timestamp).split(", ");

              return (
                <div
                  key={`${item.timestamp}-${index}`}
                  className={`grid grid-cols-[180px_1.5fr_100px_120px_100px_80px_100px] items-center border-b border-gray-700 px-4 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-800 ${
                    isSelected
                      ? "border border-orange-500 bg-gray-800"
                      : ""
                  }`}
                  onClick={() => {
                    if (isSelected) {
                      onSelect(null);
                    } else {
                      onSelect(item);
                    }
                  }}
                >
                  <div className="flex flex-col text-sm text-gray-400">
                    <span>{datePart || "N/A"}</span>
                    <span className="text-xs text-gray-500">
                      {timePart || ""}
                    </span>
                  </div>
                  <div className="truncate text-white" title={item.url}>
                    {item.url}
                  </div>
                  <div className="text-center text-gray-300">
                    {formatValue(item.total_requests)}
                  </div>
                  <div className="text-center text-gray-300">
                    {formatValue(item.concurrency)}
                  </div>
                  <div className="text-center text-gray-300">
                    {formatValue(item.mode)}
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-ink/60 text-ember focus:ring-ember/40 disabled:cursor-not-allowed disabled:opacity-50"
                      checked={isCompared}
                      disabled={isDisabled}
                      onChange={(event) => {
                        event.stopPropagation();
                        onToggleCompare(item);
                      }}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="text-red-400 hover:text-red-500 transition"
                      onClick={(event) => {
                        event.stopPropagation();
                        console.log("Setting delete ID:", item.id);
                        onDelete(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default PreviousTests;
