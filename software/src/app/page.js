"use client";

import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import InstallationSection from "@/components/InstallationSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustSection />
        <InstallationSection />
      </main>
      <Footer />
    </div>
  );
}
