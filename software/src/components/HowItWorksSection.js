import React from "react";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Sensor Data Collection",
    description:
      "ESP32-based sensors monitor your home, collecting data on temperature, humidity, motion, and more.",
  },
  {
    number: "02",
    title: "Secure Data Transmission",
    description:
      "Sensor data is encrypted and transmitted securely via Firebase Cloud to your personal website.",
  },
  {
    number: "03",
    title: "Intelligent Processing",
    description:
      "Our cloud engine analyzes data in real time to detect anomalies, patterns, and important events.",
  },
  {
    number: "04",
    title: "User Alerts & Control",
    description:
      "Receive insights, alerts, and real-time notifications through your dashboard and mobile devices.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-32 bg-black text-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-5 py-1.5 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 backdrop-blur-sm">
            <span className="text-[#CFD6FF] font-medium tracking-wide">
              Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#CFD6FF] to-white bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Our ESP32 integration ensures seamless communication between your
            smart devices and the HomePulse cloud.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative w-full max-w-md bg-black/30 backdrop-blur-sm border border-gray-800/50 p-8 rounded-2xl hover:border-[#CFD6FF]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#CFD6FF]/5"
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#CFD6FF]/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-[#CFD6FF]/20">
                <span className="text-2xl font-bold text-[#CFD6FF]">
                  {step.number}
                </span>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-[#CFD6FF] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting Arrow */}
              {index % 2 === 0 && index + 1 < steps.length && (
                <div className="hidden lg:block absolute right-[-40px] top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 flex items-center justify-center">
                    <ArrowRight className="text-[#CFD6FF]" size={20} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
