import CompareView from "./CompareView.jsx";
import ResultsDashboard from "./ResultsDashboard.jsx";

function SelectedRun({ selectedRun, compareItems }) {
  const showCompare = compareItems.length === 2;

  return (
    <section className="rounded-3xl border border-white/10 bg-steel/50 p-6 backdrop-blur fade-in">
      <h2 className="text-lg font-semibold">
        {showCompare ? "Compare Runs" : "Selected Run"}
      </h2>
      <div className="mt-4">
        {showCompare ? (
          <CompareView left={compareItems[0]} right={compareItems[1]} />
        ) : (
          <ResultsDashboard
            results={selectedRun.results}
            meta={{
              url: selectedRun.url,
              total_requests: selectedRun.total_requests,
              concurrency: selectedRun.concurrency,
              mode: selectedRun.mode,
              ramp_up: selectedRun.ramp_up,
            }}
          />
        )}
      </div>
    </section>
  );
}

export default SelectedRun;
