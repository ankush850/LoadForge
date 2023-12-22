import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function SuccessPie({ success, failure }) {
  return (
    <Pie
      data={{
        labels: ["Success", "Failure"],
        datasets: [
          {
            data: [success, failure],
            backgroundColor: ["#43f2b1", "#ff6b4a"],
            borderWidth: 0,
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            labels: { color: "#e2e8f0" },
            position: "bottom",
          },
        },
      }}
    />
  );
}

export default SuccessPie;
