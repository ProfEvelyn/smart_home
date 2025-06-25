import { database, db } from "./config.js";
import {
  ref,
  query,
  limitToLast,
  onValue,
  get,
  orderByChild,
  startAt,
  orderByKey,
  endAt,
} from "firebase/database";
// import { collection, getDocs, query, where, orderBy, limit, Timestamp, DocumentData } from 'firebase/firestore';
import { sensorMetricsMock } from "@/utils/mockData.js";

export const readSensorLogs = async () => {
  if (typeof window === "undefined") {
    console.warn("Firebase should run in the browser, not the server.");
    return;
  }

  const sensorRef = query(ref(database, "smart_sensors"), orderByKey());

  try {
    const snapshot = await get(sensorRef);

    if (snapshot.exists()) {
      const data = snapshot.val();

      // Sort by epoch key just in case
      const sortedData = Object.entries(data)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      return sortedData;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const listenToLatestSensorData = (callback) => {
  const logsRef = ref(database, "smart_sensors");
  const latestLogQuery = query(logsRef, orderByKey(), limitToLast(1)); // Get latest by key

  return onValue(latestLogQuery, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const lastKey = Object.keys(data)[0];
      const lastData = data[lastKey];
      callback({ key: lastKey, ...lastData }); // Include key in case it's useful
    } else {
      console.log("No data available");
      callback(null);
    }
  });
};

export const updateSensorMatrics = (lastData) => {
  if (!lastData) return sensorMetricsMock;

  // Create a NEW array instead of mutating
  return sensorMetricsMock.map((metric) => {
    const updatedMetric = { ...metric };

    // Update only the relevant fields
    switch (metric.id) {
      case "temperature":
        updatedMetric.current = lastData.temperature;
        break;
      case "humidity":
        updatedMetric.current = lastData.humidity;
        break;
      case "pressure":
        updatedMetric.current = lastData.pressure;
        break;
      case "mq135":
        updatedMetric.current = lastData.mq135; //air quality
        break;
      case "motion":
        updatedMetric.current = lastData.motionDetected ? "Detected" : "None";
        break;
      case "mq2":
        updatedMetric.current = lastData.mq2;
        break;
      case "mq7":
        updatedMetric.current = lastData.mq7;
        break;
      case "flame":
        updatedMetric.current = lastData.flameDetected ? "Yes" : "No";
        break;
      default:
      // No change
    }

    return updatedMetric;
  });
};

export const getMetricDataRange = async (
  metricId,
  startTimestamp,
  endTimestamp
) => {
  try {
    const refPath = ref(database, "smart_sensors");
    const q = query(
      refPath,
      orderByKey(),
      startAt(String(startTimestamp)),
      endAt(String(endTimestamp))
    );

    const snapshot = await get(q);
    if (!snapshot.exists()) return [];

    const rawData = snapshot.val();
    return Object.entries(rawData)
      .filter(([_, entry]) => entry[metricId] !== undefined)
      .map(([epoch, entry]) => ({
        timestamp: Number(epoch),
        value: entry[metricId],
      }));
  } catch (error) {
    console.error("Error fetching metric data:", error);
    return [];
  }
};

export const getMinuteAveragedData = async (metricId, minutes = 60) => {
  const totalPoints = minutes * 60; // 60 logs per minute
  const bucketSize = 60; // fixed bucket size of 60 logs
  const refPath = ref(database, "smart_sensors");
  const snapshot = await get(refPath);
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();
  const entries = Object.entries(rawData)
    .map(([epoch, entry]) => {
      let value;
      if (metricId === "flame") {
        value = entry.flameDetected ? "Yes" : "No";
      } else if (metricId === "motion") {
        value = entry.motionDetected ? "Detected" : "None";
      } else {
        value = entry[metricId];
      }
      return {
        timestamp: Number(epoch),
        value: value,
      };
    })
    .filter((d) => d.value !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp);

  // Find the most recent timestamp
  const mostRecentTimestamp =
    entries.length > 0
      ? entries[entries.length - 1].timestamp
      : Math.floor(Date.now() / 1000);

  // Calculate the start timestamp (exactly 'minutes' ago from the most recent)
  const startTimestamp = mostRecentTimestamp - minutes * 60;

  // Create minute-by-minute buckets regardless of data availability
  const result = [];
  for (let i = 0; i < minutes; i++) {
    // Calculate the timestamp for this minute bucket
    const bucketStartTime = startTimestamp + i * 60;
    const bucketEndTime = bucketStartTime + 60;

    // Find data points that fall within this minute
    const pointsInBucket = entries.filter(
      (entry) =>
        entry.timestamp >= bucketStartTime && entry.timestamp < bucketEndTime
    );

    if (metricId === "flame" || metricId === "motion") {
      // For boolean metrics, if any point in the bucket is true, the whole minute is true
      const hasEvent = pointsInBucket.some(
        (point) =>
          (metricId === "flame" && point.value === "Yes") ||
          (metricId === "motion" && point.value === "Detected")
      );
      result.push({
        timestamp: bucketStartTime,
        value: hasEvent
          ? metricId === "flame"
            ? "Yes"
            : "Detected"
          : metricId === "flame"
          ? "No"
          : "None",
      });
    } else {
      // For numeric metrics, only include if we have enough readings
      if (pointsInBucket.length === bucketSize) {
        const avg =
          pointsInBucket.reduce((sum, entry) => sum + entry.value, 0) /
          pointsInBucket.length;
        result.push({
          timestamp: bucketStartTime,
          value: avg,
        });
      }
    }
  }

  return result;
};
