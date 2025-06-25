"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white border-t border-gray-800/50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <Link
              href="/"
              className="group flex items-center gap-3 mb-6 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#CFD6FF] to-purple-400 group-hover:from-purple-400 group-hover:to-[#CFD6FF] transition-all duration-300" />
              <span className="bg-gradient-to-r from-[#CFD6FF] to-purple-300 text-transparent bg-clip-text text-2xl font-bold group-hover:from-purple-300 group-hover:to-[#CFD6FF] transition-all duration-300">
                HomePulse
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Making homes smarter, safer, and more efficient with 
              IoT technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#features"
                  className="group flex items-center text-gray-300 hover:text-[#CFD6FF] transition-all duration-300"
                >
                  <span className="w-0 h-0.5 bg-[#CFD6FF] group-hover:w-4 mr-2 transition-all duration-300"></span>
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="group flex items-center text-gray-300 hover:text-[#CFD6FF] transition-all duration-300"
                >
                  <span className="w-0 h-0.5 bg-[#CFD6FF] group-hover:w-4 mr-2 transition-all duration-300"></span>
                  How It Works
                </a>
              </li>
              <li>
                <Link
                  href="/login"
                  className="group flex items-center text-gray-300 hover:text-[#CFD6FF] transition-all duration-300"
                >
                  <span className="w-0 h-0.5 bg-[#CFD6FF] group-hover:w-4 mr-2 transition-all duration-300"></span>
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="group">
                <a
                  href="mailto:info@homepulse.com"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#CFD6FF] transition-all duration-300"
                >
                  <div className="p-2 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 group-hover:scale-110 transition-transform duration-300">
                    <Mail size={16} className="text-[#CFD6FF]" />
                  </div>
                  info@homepulse.com
                </a>
              </li>

              <li className="group">
                <div className="flex items-start gap-3 text-gray-300">
                  <div className="p-2 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 group-hover:scale-110 transition-transform duration-300">
                    <MapPin size={16} className="text-[#CFD6FF]" />
                  </div>
                  <span className="leading-snug">
                    European University of Lefke
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/50 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} HomePulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
