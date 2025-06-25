import React from "react";
import { Shield, AlertTriangle, Bell } from "lucide-react";

const TrustSection = () => {
  return (
    <section id="trust" className="relative py-32 bg-black text-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-5 py-1.5 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 backdrop-blur-sm">
            <span className="text-[#CFD6FF] font-medium tracking-wide">
              Safety
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#CFD6FF] to-white bg-clip-text text-transparent">
              Protecting What Matters Most
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Our smart home system doesn't just add convenience—it can help save
            lives and prevent disasters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Emergency Detection */}
          <div className="group glass-card rounded-2xl p-8 backdrop-blur-sm bg-black/30 border border-gray-800/50 hover:border-[#CFD6FF]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#CFD6FF]/5">
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-14 h-14 text-[#CFD6FF]" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-[#CFD6FF] transition-colors duration-300">
              Emergency Detection
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Instant detection of fire, gas leaks, and other emergencies
              through our advanced sensor network.
            </p>
            <div className="rounded-xl overflow-hidden h-48 transform group-hover:scale-105 transition-transform duration-300">
              <img
                src="/landing/emergencyDetection.png"
                alt="Home safety sensors at night"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Medical Response */}
          <div className="group glass-card rounded-2xl p-8 backdrop-blur-sm bg-black/30 border border-gray-800/50 hover:border-[#CFD6FF]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#CFD6FF]/5">
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <Bell className="w-14 h-14 text-[#CFD6FF]" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-[#CFD6FF] transition-colors duration-300">
              Emergency Response
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Critical alerts sent directly to your devices and you can contact
              emergency services as soon as possible.
            </p>
            <div className="rounded-xl overflow-hidden h-48 transform group-hover:scale-105 transition-transform duration-300">
              <img
                src="/landing/emergencyResponse.jpg"
                alt="Family receiving alert notification"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Remote Monitoring */}
          <div className="group glass-card rounded-2xl p-8 backdrop-blur-sm bg-black/30 border border-gray-800/50 hover:border-[#CFD6FF]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#CFD6FF]/5">
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-14 h-14 text-[#CFD6FF]" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-[#CFD6FF] transition-colors duration-300">
              Peace of Mind
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Rest easy knowing your home and loved ones are protected around
              the clock with real-time monitoring.
            </p>
            <div className="rounded-xl overflow-hidden h-48 transform group-hover:scale-105 transition-transform duration-300">
              <img
                src="/landing/peaceOfMind.png"
                alt="Smart home monitoring"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-block glass-card rounded-full px-8 py-4 backdrop-blur-sm bg-black/30 border border-gray-800/50 hover:border-[#CFD6FF]/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-[#CFD6FF] rounded-full animate-pulse"></div>
              <span className="text-lg font-medium text-gray-300">
                HomePulse systems can help prevent over 1,000 home emergencies
                in TRNC
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
