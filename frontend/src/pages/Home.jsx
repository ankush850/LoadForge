import { useState } from "react";
import InputForm from "../components/InputForm.jsx";
import ResultsDashboard from "../components/ResultsDashboard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const API_BASE = "http://localhost:8000";
const MAX_REQUESTS = 10000;

function Home() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState(null);

  const handleStart = async ({
    url,
    total_requests,
    concurrency,
    mode,
    ramp_up,
  }) => {
    setError(null);
    setResults(null);
    setMeta(null);

    try {
      const parsed = new URL(url);
      if (!parsed.protocol.startsWith("http")) {
        throw new Error("URL must start with http or https");
      }
    } catch (err) {
      setError({
        type: "warning",
        message: "Please provide a valid URL with http or https.",
      });
      return;
    }

    if (total_requests <= 0 || total_requests > MAX_REQUESTS) {
      setError({
        type: "warning",
        message: `Total requests must be between 1 and ${MAX_REQUESTS}.`,
      });
      return;
    }

    if (concurrency <= 0) {
      setError({
        type: "warning",
        message: "Concurrency must be greater than 0.",
      });
      return;
    }

    if (mode === "ramp" && ramp_up <= 0) {
      setError({
        type: "warning",
        message: "Ramp up must be greater than 0 for ramp mode.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, total_requests, concurrency, mode, ramp_up }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.detail || "Server error");
      }

      const data = await response.json();
      setResults(data);
      setMeta({
        url,
        total_requests,
        concurrency,
        mode,
        ramp_up,
      });
    } catch (err) {
      const message = err.message || "Unable to run test.";
      const isTimeout = message.toLowerCase().includes("timeout");
      setError({
        type: isTimeout ? "timeout" : "error",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-ember/20 blur-3xl float-slow" />
      <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-sky/20 blur-3xl float-slow" />

      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
        <header className="fade-in">
          <p className="text-sm uppercase tracking-[0.3em] text-emberSoft">LoadForge</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            Stress Testing & Website Analyzer Tool
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Push your endpoints with controlled concurrency and visualize real-time
            latency, throughput, and success ratios.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-steel/70 p-8 shadow-glow backdrop-blur fade-in">
            <h2 className="text-xl font-semibold">Run a Test</h2>
            <p className="mt-2 text-sm text-slate-300">
              Configure your target and launch up to 10,000 requests with safety
              checks and timeouts.
            </p>
            <div className="mt-6">
              <InputForm onSubmit={handleStart} isLoading={isLoading} />
            </div>
            {error && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                  error.type === "warning"
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                    : error.type === "timeout"
                    ? "border-sky/40 bg-sky/10 text-sky-200"
                    : "border-ember/40 bg-ember/10 text-emberSoft"
                }`}
              >
                {error.message}
              </div>
            )}
            {isLoading && (
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-300">
                <LoadingSpinner /> Running test...
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-steel/50 p-8 backdrop-blur fade-in">
            <ResultsDashboard results={results} meta={meta} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
