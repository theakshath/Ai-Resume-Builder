"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-2.5"
          : "bg-white/90 backdrop-blur-xs border-b border-slate-100 py-3"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <div className="w-8 h-8 rounded-xl bg-[#4338CA] text-white flex items-center justify-center shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
            Resume<span className="text-[#4338CA]">AI</span>
          </span>
        </Link>

        {/* Center: Clean Nav Links (plain text without bulky pill) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          <a
            href="#features"
            className="text-[13px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[13px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#templates"
            className="text-[13px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Templates
          </a>
          <a
            href="#pricing"
            className="text-[13px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/design-system"
            className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-[#4338CA] border border-indigo-100/80 rounded-md hover:bg-indigo-100 transition-colors"
          >
            Design System UI
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/login"
            className="text-[13px] font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 bg-[#4338CA] hover:bg-[#3730A3] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 py-1.5 border-b border-slate-100"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 py-1.5 border-b border-slate-100"
          >
            How It Works
          </a>
          <a
            href="#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 py-1.5 border-b border-slate-100"
          >
            Templates
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 py-1.5 border-b border-slate-100"
          >
            Pricing
          </a>
          <Link
            href="/design-system"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-semibold py-1.5 text-[#4338CA]"
          >
            Design System UI
          </Link>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold bg-[#4338CA] text-white rounded-full shadow-xs"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
