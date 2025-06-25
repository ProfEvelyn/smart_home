"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { sensorMetricsMock } from "@/utils/mockData";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import { useState } from "react";
import ProtectedRoute from "../context/ProtectedRoute";
import { getAuth } from "firebase/auth";

// Dasghboard page which shows all the sensor data and esp32 statu
const Dashboard = () => {
  const auth = getAuth();

  // Check if user is logged in
  
  const [selectedMetric, setSelectedMetric] = useState("temperature");
  const currentMetric =
    sensorMetricsMock.find((metric) => metric.id === selectedMetric) ||
    sensorMetricsMock[0];

  const handleSensorCardClick = (metricId) => {  // Updates selected metric when a sensor card is clicked
    setSelectedMetric(metricId);
  };

  return (
<div className="min-h-screen bg-black text-white px-4 md:px-8 py-6">

      <ProtectedRoute>
        <DashboardHeader />
        <WelcomeSection
          selectedMetric={selectedMetric}
          onSensorCardClick={handleSensorCardClick}
        />
      </ProtectedRoute>
    </div>
  );
};

export default Dashboard;
