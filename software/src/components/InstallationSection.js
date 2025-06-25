"use client";

import React from "react";
import { Calendar, HomeIcon, PhoneCall } from "lucide-react";

const InstallationSection = () => {
  return (
    <section className="relative py-32 px-4">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1551703599-bd66336ce60d')",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95"></div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <div className="inline-block mb-4 px-5 py-1.5 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 backdrop-blur-sm">
          <span className="text-[#CFD6FF] font-medium tracking-wide">
            Installation
          </span>
        </div>

        <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
          <HomeIcon className="w-12 h-12 text-[#CFD6FF] mx-auto" />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-[#CFD6FF] to-white text-transparent bg-clip-text">
            Ready to Experience HomePulse in Your Home?
          </span>
        </h2>

        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Our professional technicians will handle everything from installation
          to setup, ensuring your home is protected with our cutting-edge
          technology.
        </p>

        <div className="group glass-card rounded-2xl p-8 md:p-10 mb-12 max-w-2xl mx-auto backdrop-blur-sm bg-black/30 border border-gray-800/50 hover:border-[#CFD6FF]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#CFD6FF]/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="flex items-center group/item">
              <div className="p-4 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 mr-5 group-hover/item:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-[#CFD6FF]" />
              </div>
              <span className="text-lg text-white group-hover/item:text-[#CFD6FF] transition-colors duration-300">
                Schedule at your convenience
              </span>
            </div>

            <div className="flex items-center group/item">
              <div className="p-4 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 mr-5 group-hover/item:scale-110 transition-transform duration-300">
                <PhoneCall className="w-6 h-6 text-[#CFD6FF]" />
              </div>
              <span className="text-lg text-white group-hover/item:text-[#CFD6FF] transition-colors duration-300">
                Free consultation included
              </span>
            </div>
          </div>

          <a
            href="mailto:sibanaevelyn2528@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto group/button"
          >
            <button className="w-full sm:w-auto py-4 px-10 text-lg bg-[#CFD6FF] text-black rounded-full hover:bg-opacity-90 transition-all duration-300 font-semibold hover:shadow-lg hover:shadow-[#CFD6FF]/20 hover:scale-105 active:scale-95">
              Book Your Installation
            </button>
          </a>
        </div>

        {/* Testimonial */}
      </div>
    </section>
  );
};

export default InstallationSection;
