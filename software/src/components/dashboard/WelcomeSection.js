"use client";

import { useEffect, useState } from "react";
import SensorCard from "./SensorCard";
import { listenToLatestSensorData } from "@/firebase/getDtata";
import { updateSensorMatrics } from "@/firebase/getDtata";
import SensorGraph from "./SensorGraph";

const WelcomeSection = ({ selectedMetrics, onSensorCardClick }) => {
  const [sensorMetrics, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setConnected] = useState(false);
  const [lastUpdateEpoch, setLastUpdateEpoch] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("temperature");

  // Format timestamp to readable string (date only, no timezone)
  const formatDate = (epoch) => {
    if (!epoch) return "Never";
    const date = new Date(parseInt(epoch) * 1000);
    return date
      .toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/ GMT.*$/, "");
  };

  // Monitor connection every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastUpdateEpoch) {
        setConnected(false);
        return;
      }
      const diff = Date.now() - parseInt(lastUpdateEpoch) * 1000;
      setConnected(diff <= 3000);// if the difference btwn the current data and current time is 3sec then it is disconnected 
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdateEpoch]);

  // Listen to latest Firebase entry
  useEffect(() => {
    const unsubscribe = listenToLatestSensorData((latestData) => {
      if (latestData && latestData.key) {
        setLastUpdateEpoch(latestData.key); // key is epoch timestamp
        setSensorData(updateSensorMatrics(latestData));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-8">
      <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#CFD6FF] mb-2 md:mb-0">
              {getCurrentGreeting()}, Evelyn!
            </h2>

            <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full mr-2 ${
                    isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-300 mr-2">Status:</span>
                <span
                  className={`text-sm font-semibold ${
                    isConnected ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              <div className="hidden sm:block h-4 w-px bg-gray-600"></div>

              <div className="flex items-center text-gray-400 text-xs">
                <span>Last seen: {formatDate(lastUpdateEpoch)}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-lg">
            Your home is safe and all systems are monitored.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {loading ? (
              <div className="col-span-full text-center">
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : (
              sensorMetrics.map((metric) => (
                <SensorCard
                  key={metric.id}
                  metric={metric}
                  isSelected={selectedMetric === metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                />
              ))
            )}
          </div>

          <SensorGraph selectedMetric={selectedMetric} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
