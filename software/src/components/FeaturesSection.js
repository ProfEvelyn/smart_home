import React from "react";
import {
  Thermometer,
  Droplets,
  Gauge,
  FlameKindling,
  Activity,
  BarChart,
} from "lucide-react";

const features = [
  {
    icon: <Thermometer className="w-12 h-12 text-[#CFD6FF]" />,
    title: "Temperature Monitoring",
    description:
      "Track real-time temperature across rooms with precision sensors and historical trends.",
  },
  {
    icon: <Droplets className="w-12 h-12 text-[#CFD6FF]" />,
    title: "Humidity & Air Quality",
    description:
      "Monitor humidity and air quality (MQ135) for a healthier indoor environment.",
  },
  {
    icon: <Gauge className="w-12 h-12 text-[#CFD6FF]" />,
    title: "Pressure & Gas Detection",
    description:
      "Detect gas leaks (MQ2, MQ7) and track barometric pressure for weather insights.",
  },
  {
    icon: <FlameKindling className="w-12 h-12 text-[#CFD6FF]" />,
    title: "Flame Detection",
    description:
      "Instant alerts when fire hazards are detected for faster emergency response.",
  },
  {
    icon: <Activity className="w-12 h-12 text-[#CFD6FF]" />,
    title: "Motion Detection",
    description:
      "Smart motion detection helps identify unexpected activity around your home.",
  },
  {
    icon: <BarChart className="w-12 h-12 text-[#CFD6FF]" />,
    title: "Real-time Analytics",
    description:
      "Visual dashboards with real-time and historical insights into your home data.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-32 bg-black text-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-5 py-1.5 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 backdrop-blur-sm">
            <span className="text-[#CFD6FF] font-medium tracking-wide">
              Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#CFD6FF] to-white bg-clip-text text-transparent">
              Smart Monitoring Features
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-card max-w-sm w-full p-8 rounded-2xl backdrop-blur-sm bg-black/30 border border-gray-800/50 hover:border-[#CFD6FF]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#CFD6FF]/5"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-[#CFD6FF] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
