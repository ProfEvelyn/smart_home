"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={goToHome}
              className="flex items-center gap-2 group transition-all duration-300"
            >
              <span className="bg-gradient-to-r from-[#CFD6FF] to-purple-300 text-transparent bg-clip-text text-2xl font-bold tracking-tight group-hover:from-purple-300 group-hover:to-[#CFD6FF] transition-all duration-300">
                HomePulse
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm text-gray-400 hover:text-[#CFD6FF] transition-all duration-300 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#CFD6FF] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-gray-400 hover:text-[#CFD6FF] transition-all duration-300 relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#CFD6FF] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#trust"
              className="text-sm text-gray-400 hover:text-[#CFD6FF] transition-all duration-300 relative group"
            >
              Safety
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#CFD6FF] group-hover:w-full transition-all duration-300"></span>
            </a>
            <button
              onClick={() => router.push("/login")}
              className="bg-[#CFD6FF] text-black hover:bg-opacity-90 text-sm px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#CFD6FF]/20 hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-400 hover:text-[#CFD6FF] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50 px-6 py-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <a
              href="#features"
              className="text-gray-300 hover:text-[#CFD6FF] transition-all duration-300 py-2 border-b border-gray-800/50 hover:border-[#CFD6FF]/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-[#CFD6FF] transition-all duration-300 py-2 border-b border-gray-800/50 hover:border-[#CFD6FF]/30"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#trust"
              className="text-gray-300 hover:text-[#CFD6FF] transition-all duration-300 py-2 border-b border-gray-800/50 hover:border-[#CFD6FF]/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Safety
            </a>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/login");
              }}
              className="bg-[#CFD6FF] text-black hover:bg-opacity-90 text-sm px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#CFD6FF]/20 hover:scale-105 active:scale-95 mt-2"
            >
              Sign In
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
