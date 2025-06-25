import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=3270')",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/70"></div>
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className="text-center md:text-left animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="inline-block mb-6 px-5 py-1.5 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 backdrop-blur-sm">
              <span className="text-[#CFD6FF] font-medium tracking-wide">
                Smart Living Made Simple
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-[#CFD6FF] to-white bg-clip-text text-transparent">
                Smart Home,
              </span>
              <br />
              <span className="text-white">Smarter Living</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-xl leading-relaxed">
              Take complete control of your home environment. Monitor, secure,
              and automate your living space from anywhere, anytime with our
              ESP32-powered smart home system.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 md:justify-start justify-center">
              <button
                onClick={handleGetStarted}
                className="group bg-[#CFD6FF] text-black hover:bg-opacity-90 h-14 px-8 py-3 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-[#CFD6FF]/20 hover:scale-105 active:scale-95"
              >
                Get Started
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
              <button
                onClick={scrollToFeatures}
                className="h-14 px-8 py-3 rounded-full border border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Learn More
              </button>
            </div>
          </div>

          <div
            className="hidden md:flex justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="glass-card p-8 rounded-3xl w-full max-w-md backdrop-blur-sm bg-black/30 border border-gray-800/50 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/30 p-6 rounded-2xl flex flex-col items-center border border-gray-700/50 hover:border-[#CFD6FF]/30 transition-all duration-300">
                  <div className="text-[#CFD6FF] text-5xl font-bold mb-2">
                    21°C
                  </div>
                  <div className="text-gray-400 text-sm">Living Room</div>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-2xl flex flex-col items-center border border-gray-700/50 hover:border-[#CFD6FF]/30 transition-all duration-300">
                  <div className="text-green-400 text-5xl font-bold mb-2">
                    Safe
                  </div>
                  <div className="text-gray-400 text-sm">Air Quality</div>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-2xl flex flex-col items-center border border-gray-700/50 hover:border-[#CFD6FF]/30 transition-all duration-300">
                  <div className="text-[#CFD6FF] text-5xl font-bold mb-2">
                    42%
                  </div>
                  <div className="text-gray-400 text-sm">Humidity</div>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-2xl flex flex-col items-center border border-gray-700/50 hover:border-[#CFD6FF]/30 transition-all duration-300">
                  <div className="text-[#CFD6FF] text-5xl font-bold mb-2">
                    On
                  </div>
                  <div className="text-gray-400 text-sm">Security</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Blurs */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#CFD6FF]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#CFD6FF]/10 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#CFD6FF]/5 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </section>
  );
};

export default HeroSection;
