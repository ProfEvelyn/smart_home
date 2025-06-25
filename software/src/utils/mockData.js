import { getLatestSensorData } from "@/firebase/getDtata";

export const generateMockData = (base, range, count) => {
    return Array.from({ length: count }, (_, i) => {
      const hour = 9 + i;
      return {
        time: `${hour}:00`,
        value: parseFloat((base + (Math.random() * range - range/2)).toFixed(1)),
      };
    });
  };
  
  export const temperatureData = generateMockData(24, 10, 10);
  export const humidityData = generateMockData(65, 15, 10);
  export const pressureData = generateMockData(1013, 20, 10);
  export const gasData = generateMockData(450, 100, 10);
  export const motionData = generateMockData(5, 10, 10);
  export const mq2Data = generateMockData(3879, 400, 10);
  export const mq7Data = generateMockData(3472, 350, 10);
  export const flameData = Array.from({ length: 10 }, (_, i) => ({
    time: `${9 + i}:00`,
    value: Math.random() > 0.8 ? "Yes" : "No",
  }));
  
  
  export const sensorMetricsMock = [
    { id: 'flame', name: 'Flame Detected', icon: 'Flame', unit: '', color: '#FF5400', data: flameData, min: 0, max: 1, current: "No" },
    { id: 'humidity', name: 'Humidity', icon: 'Droplets', unit: '%', color: '#5DA9E9', data: humidityData, min: 40, max: 80, current: 65.7 },
    { id: 'motion', name: 'Motion', icon: 'Activity', unit: 'events', color: '#A8DADC', data: motionData, min: 0, max: 20, current: 5 },
    { id: 'mq135', name: 'Air Quality', icon: 'Flame', unit: 'ppm', color: '#F4A261', data: gasData, min: 350, max: 700, current: 450.5 },
    { id: 'mq2', name: 'Gas Sensor (MQ2)', icon: 'Wind', unit: 'ppm', color: '#FF9F1C', data: mq2Data, min: 3500, max: 4200, current: 3879 },
    { id: 'mq7', name: 'Carbon Monoxide (MQ7)', icon: 'Wind', unit: 'ppm', color: '#F94144', data: mq7Data, min: 3200, max: 3800, current: 3472 },
    { id: 'pressure', name: 'Air Pressure', icon: 'Gauge', unit: 'hPa', color: '#E76F51', data: pressureData, min: 990, max: 1030, current: 1013.2 },
    { id: 'temperature', name: 'Temperature', icon: 'Thermometer', unit: '°C', color: '#8BD8BD', data: temperatureData, min: 16, max: 32, current: 24.7},
  ];

  