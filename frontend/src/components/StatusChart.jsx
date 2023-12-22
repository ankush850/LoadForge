import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const buildBuckets = (data = {}) => {
  const buckets = { "200": 0, "400": 0, "500": 0 };
  Object.entries(data).forEach(([status, count]) => {
    const numeric = Number(status);
    if (Number.isNaN(numeric)) return;
    if (numeric >= 200 && numeric < 300) buckets["200"] += count;
    if (numeric >= 400 && numeric < 500) buckets["400"] += count;
    if (numeric >= 500 && numeric < 600) buckets["500"] += count;
  });
  return buckets;
};

function StatusChart({ data }) {
  const buckets = buildBuckets(data);
  const labels = Object.keys(buckets);
  const values = Object.values(buckets);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Responses",
            data: values,
            backgroundColor: [
              "rgba(79, 176, 255, 0.6)",
              "rgba(255, 177, 153, 0.6)",
              "rgba(255, 107, 74, 0.6)",
            ],
            borderRadius: 6,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: "#cbd5f5" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y: {
            ticks: { color: "#cbd5f5" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      }}
    />
  );
}

export default StatusChart;
