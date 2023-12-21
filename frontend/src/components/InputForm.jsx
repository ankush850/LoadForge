import { useEffect, useState } from "react";

function InputForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState("");
  const [totalRequests, setTotalRequests] = useState(500);
  const [concurrency, setConcurrency] = useState(50);
  const [mode, setMode] = useState("normal");
  const [rampUp, setRampUp] = useState(5);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      url,
      total_requests: Number(totalRequests),
      concurrency: Number(concurrency),
      mode,
      ramp_up: Number(rampUp),
    });
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleUrlBlur = () => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    if (!/^https?:\/\//i.test(cleanUrl)) {
      setUrl(`https://${cleanUrl}`);
      return;
    }
    if (cleanUrl !== url) {
      setUrl(cleanUrl);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm text-slate-300">
        Target URL
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-ink/70 px-4 py-3 text-sm text-white focus:border-ember focus:outline-none"
          type="url"
          value={url}
          onChange={handleUrlChange}
          onBlur={handleUrlBlur}
          placeholder="https://api.yourdomain.com/health"
          autoFocus
          required
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-300">
          Total Requests
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-ink/70 px-4 py-3 text-sm text-white focus:border-ember focus:outline-none"
            type="number"
            min="1"
            max="10000"
            value={totalRequests}
            onChange={(event) => setTotalRequests(event.target.value)}
          />
        </label>
        <label className="block text-sm text-slate-300">
          Concurrency
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-ink/70 px-4 py-3 text-sm text-white focus:border-ember focus:outline-none"
            type="number"
            min="1"
            max="500"
            value={concurrency}
            onChange={(event) => setConcurrency(event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-300">
          Test Mode
          <div className="relative w-full dropdown-container mt-2">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-left text-sm text-white"
            >
              <span className="capitalize">{mode}</span>
              <span aria-hidden="true">▾</span>
            </button>
            {isOpen && (
              <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 shadow-lg">
                {["normal", "spike", "ramp"].map((item) => (
                  <div
                    key={item}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setMode(item);
                      setIsOpen(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setMode(item);
                        setIsOpen(false);
                      }
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm capitalize hover:bg-gray-800 ${
                      mode === item ? "text-orange-400" : "text-white"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </label>
        <label className="block text-sm text-slate-300">
          Ramp Up (seconds)
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-ink/70 px-4 py-3 text-sm text-white focus:border-ember focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            type="number"
            min="1"
            value={rampUp}
            onChange={(event) => setRampUp(event.target.value)}
            disabled={mode !== "ramp"}
          />
        </label>
      </div>

      <button
        className="w-full rounded-xl bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-ember/90 disabled:cursor-not-allowed disabled:bg-ember/40"
        type="submit"
        disabled={isLoading}
      >
        Start Test
      </button>
    </form>
  );
}

export default InputForm;
