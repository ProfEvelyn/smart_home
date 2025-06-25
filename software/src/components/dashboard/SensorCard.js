"use client";

import { use, useEffect, useMemo } from "react";
import {
  Thermometer,
  Droplets,
  Gauge,
  Flame,
  Activity,
  Wind,
} from "lucide-react";

//thresholds for the sensorcard checks whether is safe, warning or danger
const METRIC_THRESHOLDS = {
  temperature: {
    safe: [0, 30],
    warning: [30, 40],
    danger: [40, Infinity],
  },
  humidity: {
    safe: [30, 60],
    warning: [60, 70],
    danger: [70, Infinity],
  },
  pressure: {
    safe: [0, 1020],
    warning: [1020, 1040],
    danger: [1040, Infinity],
  },
  mq2: {
    safe: [2000, Infinity],
    warning: [1500, 2000],
    danger: [0, 1500],
  },
  mq7: {
    safe: [1500, Infinity],
    warning: [700, 1500],
    danger: [0, 700],
  },
  mq135: {
    safe: [1500, Infinity],
    warning: [700, 1500],
    danger: [0, 700],
  },
};

const SensorCard = ({ metric, isSelected, onClick }) => {
  const Icon = useMemo(() => getIconComponent(metric.icon), [metric.icon]);
  const status = getStatusLabel(metric);
  const barColor = getStatusBarColor(metric);

  useEffect(() => {
    async function sendEmailNotification() {
      try {
        const response = await fetch("/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "sibanaevelyn2528@gmail.com", //send email when there is flame and motion detected
            alertType: metric.id === 'flame' ? 'flame' : 'motion',
            details: '',
          }),
        });
  
        const result = await response.json();
      } catch (error) {
        console.error("Error sending email notification:", error);
      }
    }
  
    if (
      metric?.id === "flame" && metric.current === "Yes" ||
      metric?.id === "motion" && metric.current === "Detected"
    ) {
      sendEmailNotification();
    }
  }, [metric]);
  

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 border transition-all duration-300 cursor-pointer 
      ${
        isSelected
          ? "border-[#CFD6FF] bg-gray-800"
          : "border-gray-700 hover:bg-gray-800/50"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div
          className="p-2 rounded-full"
          style={{ backgroundColor: `${metric.color}30` }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
          {status.label}
        </span>
      </div>

      <h3 className="text-sm text-gray-300">{metric.name}</h3>

      <div className="text-xl font-bold text-[#CFD6FF]">
        {metric.current}
        <span className="text-sm ml-1">{metric.unit}</span>
      </div>

      {/* Full-width status bar */}
      <div className={`w-full rounded-full h-2 mt-3 ${barColor}`}></div>
    </div>
  );
};

function getStatusLabel(metric) {
  if (metric.id === "flame") {
    return metric.current === "Yes"
      ? { label: "Alert", color: "bg-red-500/20 text-red-400" }
      : { label: "Safe", color: "bg-green-500/20 text-green-400" };
  }
  if (metric.id === "motion") {
    return metric.current === "Detected"
      ? { label: "Motion Detected", color: "bg-red-500/20 text-red-400" }
      : { label: "No Motion", color: "bg-green-500/20 text-green-400" };
  }

  const thresholds = METRIC_THRESHOLDS[metric.id];
  const val = metric.current;

  if (!thresholds || val == null)
    return { label: "Unknown", color: "bg-gray-500/20 text-gray-300" };

  // Special handling for MQ sensors (inverse logic)
  if (['mq2', 'mq7', 'mq135'].includes(metric.id)) {
    if (val <= thresholds.danger[1])
      return { label: "Danger", color: "bg-red-500/20 text-red-400" };
    if (val <= thresholds.warning[1])
      return { label: "Warning", color: "bg-yellow-500/20 text-yellow-400" };
    return { label: "Safe", color: "bg-green-500/20 text-green-400" };
  }

  // Normal sensors (temperature, humidity, etc.)
  if (val >= thresholds.danger[0])
    return { label: "Danger", color: "bg-red-500/20 text-red-400" };
  if (val >= thresholds.warning[0])
    return { label: "Warning", color: "bg-yellow-500/20 text-yellow-400" };
  return { label: "Safe", color: "bg-green-500/20 text-green-400" };
}

function getStatusBarColor(metric) {
  if (metric.id === "flame") {
    return metric.current === "Yes"
      ? "bg-red-500 animate-pulse"
      : "bg-green-500";
  }

  const thresholds = METRIC_THRESHOLDS[metric.id];
  const val = metric.current;

  if (!thresholds || val == null) return "bg-gray-500";

  // Special handling for MQ sensors (inverse logic)
  if (['mq2', 'mq7', 'mq135'].includes(metric.id)) {
    if (val <= thresholds.danger[1]) return "bg-red-500";
    if (val <= thresholds.warning[1]) return "bg-yellow-500";
    return "bg-green-500";
  }

  // Normal sensors (temperature, humidity, etc.)
  if (val >= thresholds.danger[0]) return "bg-red-500";
  if (val >= thresholds.warning[0]) return "bg-yellow-500";
  return "bg-green-500";
}


function getIconComponent(iconName) {
  switch (iconName) {
    case "Thermometer":
      return Thermometer;
    case "Droplets":
      return Droplets;
    case "Gauge":
      return Gauge;
    case "Flame":
      return Flame;
    case "Activity":
      return Activity;
    case "Wind":
      return Wind;
    default:
      return Thermometer;
  }
}

export default SensorCard;
