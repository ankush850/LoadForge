import { useEffect, useMemo, useState } from "react";
import PreviousTests from "../components/PreviousTests.jsx";
import SelectedRun from "../components/SelectedRun.jsx";

const API_BASE = "http://localhost:8000";

function History() {
  const [items, setItems] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [compareSelection, setCompareSelection] = useState([]);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const compareItems = useMemo(() => {
    return items.filter((item) => compareSelection.includes(item.id));
  }, [compareSelection, items]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`${API_BASE}/history`);
        if (!response.ok) {
          throw new Error("Unable to load history.");
        }
        const data = await response.json();
        setItems(data);
        setSelectedRun(null);
      } catch (err) {
        setError(err.message || "Unable to load history.");
      }
    };

    loadHistory();
  }, []);

  const toggleCompare = (item) => {
    setCompareSelection((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((value) => value !== item.id);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, item.id];
    });
  };

  useEffect(() => {
    if (!selectedRun) return;
    document.getElementById("selected-run")?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedRun]);

  const handleDelete = async (id) => {
    console.log("Setting delete ID:", id);
    setSelectedDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    console.log("DELETE CLICKED");
    console.log("ID:", selectedDeleteId);

    if (!selectedDeleteId) {
      console.error("No ID found");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/history/${selectedDeleteId}`, {
        method: "DELETE",
      });
      console.log("Response:", res);

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setItems((prev) =>
        prev.filter((item) => item.id !== selectedDeleteId)
      );
      setCompareSelection((prev) =>
        prev.filter((value) => value !== selectedDeleteId)
      );
      if (selectedRun?.id === selectedDeleteId) {
        setSelectedRun(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
    setShowConfirm(false);
    setSelectedDeleteId(null);
  };

  return (
    <main className="min-h-screen py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        <div className="fade-in">
          <p className="text-sm uppercase tracking-[0.3em] text-emberSoft">History</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            Test Results Archive
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Review past runs and inspect the full metric breakdown.
          </p>
        </div>
        <PreviousTests
          items={items}
          selectedRun={selectedRun}
          compareSelection={compareSelection}
          error={error}
          onSelect={setSelectedRun}
          onToggleCompare={toggleCompare}
          onClearCompare={() => setCompareSelection([])}
          onDelete={handleDelete}
        />

        {!selectedRun && (
          <div className="text-center text-sm text-slate-400 py-6">
            Select a test to view detailed metrics
          </div>
        )}

        {selectedRun && (
          <div id="selected-run" className="fade-in">
            <SelectedRun selectedRun={selectedRun} compareItems={compareItems} />
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-[400px] rounded-xl border border-white/10 bg-ink/95 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">Delete Test</h2>
            <p className="mt-2 text-sm text-slate-300">
              Are you sure you want to delete this test?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedDeleteId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default History;
