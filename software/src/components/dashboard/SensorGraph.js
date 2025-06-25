"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getMinuteAveragedData } from "@/firebase/getDtata";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement
);

const timeframes = [
  { label: "1 hour", value: 60 * 60 },
  { label: "15 minutes", value: 15 * 60 },
  // { label: "5 minutes", value: 5 * 60 },
];

const SensorGraph = ({ selectedMetric }) => {
  const [data, setData] = useState([]);
  const [selectedRange, setSelectedRange] = useState(timeframes[0].value);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState({ min: null, max: null });

  const isBooleanMetric =
    selectedMetric === "flame" || selectedMetric === "motion";

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getMinuteAveragedData(
        selectedMetric,
        selectedRange / 60
      );

      // For boolean metrics, we'll convert the data to show events
      if (isBooleanMetric) {
        const processedData = result.map((d) => ({
          timestamp: d.timestamp,
          value: d.value === "Yes" || d.value === "Detected" ? 1 : 0,
        }));
        setData(processedData);
      } else {
        setData(result);
      }

      // Calculate time range for x-axis boundaries
      const now = Math.floor(Date.now() / 1000);
      const startTime = now - selectedRange;
      setTimeRange({
        min: new Date(startTime * 1000),
        max: new Date(now * 1000),
      });
    } catch (err) {
      console.error("Failed to fetch minute-averaged data", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    console.log("Fetching data for metric:", selectedMetric);
    fetchData();
  }, [selectedMetric, selectedRange]);

  const chartData = {
    datasets: [
      {
        label: `${selectedMetric} over time`,
        data: data.map((d) => ({
          x: new Date(d.timestamp * 1000),
          y: d.value,
        })),
        borderColor: isBooleanMetric ? "#FF5400" : "#4FD1C5",
        backgroundColor: isBooleanMetric
          ? "rgba(255, 84, 0, 0.3)"
          : "rgba(79, 209, 197, 0.3)",
        tension: 0.3,
        pointRadius: isBooleanMetric ? 6 : 3,
        pointHoverRadius: isBooleanMetric ? 8 : 6,
        type: isBooleanMetric ? "bar" : "line",
        barPercentage: 0.8,
        categoryPercentage: 0.9,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: selectedRange >= 3600 ? "minute" : "second",
          tooltipFormat: "HH:mm:ss",
          displayFormats: {
            minute: "HH:mm",
            hour: "HH:mm",
            second: "HH:mm:ss",
          },
        },
        min: timeRange.min,
        max: timeRange.max,
        ticks: {
          color: "#A0AEC0",
          maxTicksLimit:
            selectedRange >= 3600 ? 12 : selectedRange >= 900 ? 8 : 5,
          source: "auto",
        },
      },
      y: {
        ticks: {
          color: "#A0AEC0",
          callback: function (value) {
            if (isBooleanMetric) {
              return value === 1 ? "Detected" : "None";
            }
            // Format number to show at most 2 decimal places if not a whole number
            return Number.isInteger(value) ? value : value.toFixed(2);
          },
        },
        min: isBooleanMetric ? 0 : undefined,
        max: isBooleanMetric ? 1 : undefined,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            if (isBooleanMetric) {
              const value = context.parsed.y === 1;
              return `${selectedMetric}: ${
                value
                  ? selectedMetric === "flame"
                    ? "Yes"
                    : "Detected"
                  : selectedMetric === "flame"
                  ? "No"
                  : "None"
              }`;
            }
            // Format number to show at most 2 decimal places if not a whole number
            const value = context.parsed.y;
            return `${selectedMetric}: ${
              Number.isInteger(value) ? value : value.toFixed(2)
            }`;
          },
          title: (context) => new Date(context[0].parsed.x).toLocaleString(),
        },
      },
      legend: {
        labels: {
          color: "#E2E8F0",
        },
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
        <button
          onClick={fetchData}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-1 rounded"
        >
          Refresh Graph
        </button>

        <div className="flex gap-2">
          {timeframes.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setSelectedRange(t.value);
                // Clear current data to avoid flashing old data
                setData([]);
                setTimeout(fetchData, 0);
              }}
              className={`px-3 py-1 rounded text-sm border transition-all duration-150 ${
                selectedRange === t.value
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-gray-800 text-gray-300 border-gray-600 hover:border-teal-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <h3 className="text-lg text-white font-semibold mb-2 capitalize">
        {selectedMetric} Readings
        {loading && (
          <span className="ml-2 text-sm text-gray-400">Loading...</span>
        )}
      </h3>

      <div style={{ height: "400px" }}>
        {data.length === 0 && !loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">
              No data available for this time range
            </p>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default SensorGraph;
