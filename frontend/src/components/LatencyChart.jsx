import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

const buildMovingAverage = (values, windowSize = 6) => {
  if (!values.length) return [];
  return values.map((_, idx) => {
    const start = Math.max(0, idx - windowSize + 1);
    const slice = values.slice(start, idx + 1);
    const avg = slice.reduce((sum, value) => sum + value, 0) / slice.length;
    return Number(avg.toFixed(2));
  });
};

function LatencyChart({ data, showAverage }) {
  const labels = data?.map((point) => point.index) || [];
  const values = data?.map((point) => point.latency_ms) || [];
  const averages = buildMovingAverage(values);

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Latency (ms)",
            data: values,
            borderColor: "#4fb0ff",
            backgroundColor: "rgba(79, 176, 255, 0.2)",
            tension: 0.35,
            fill: true,
            pointRadius: 0,
            borderWidth: 2,
          },
          ...(showAverage
            ? [
                {
                  label: "Moving Average",
                  data: averages,
                  borderColor: "#ffb199",
                  backgroundColor: "rgba(255, 177, 153, 0.15)",
                  tension: 0.4,
                  fill: false,
                  pointRadius: 0,
                  borderWidth: 2,
                },
              ]
            : []),
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: showAverage },
          tooltip: {
            callbacks: {
              title: (items) => `Request ${items[0].label}`,
              label: (item) => `${item.dataset.label}: ${item.formattedValue} ms`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Request Index / Time",
              color: "#a3a8b8",
              font: { size: 12, weight: 500 },
            },
            ticks: { color: "#cbd5f5" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y: {
            title: {
              display: true,
              text: "Latency (ms)",
              color: "#a3a8b8",
              font: { size: 12, weight: 500 },
            },
            ticks: { color: "#cbd5f5" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      }}
    />
  );
}

export default LatencyChart;
