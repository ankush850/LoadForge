import { useState } from "react";
import { motion } from "framer-motion";
import History from "./pages/History.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const [active, setActive] = useState("test");

  return (
    <div>
      <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 transform">
        <div className="relative flex w-[600px] items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-orange-500/10 via-white/5 to-transparent px-6 py-3 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <span className="text-sm tracking-widest text-gray-300">LOADFORGE</span>
          <div className="relative flex rounded-full bg-white/5 p-1">
            <div className="relative flex w-[160px]">
              {active === "test" && (
                <motion.div
                  layoutId="pill"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute left-0 top-0 h-full w-1/2 rounded-full bg-orange-500 shadow-md"
                />
              )}
              {active === "history" && (
                <motion.div
                  layoutId="pill"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute left-1/2 top-0 h-full w-1/2 rounded-full bg-orange-500 shadow-md"
                />
              )}
              <button
                className={`relative z-10 flex-1 rounded-full px-4 py-1.5 text-sm transition ${
                  active === "test" ? "text-white" : "text-gray-300"
                }`}
                onClick={() => setActive("test")}
              >
                Test
              </button>
              <button
                className={`relative z-10 flex-1 rounded-full px-4 py-1.5 text-sm transition ${
                  active === "history" ? "text-white" : "text-gray-300"
                }`}
                onClick={() => setActive("history")}
              >
                History
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-24">
        {active === "test" ? <Home /> : <History />}
      </div>
    </div>
  );
}

export default App;
