"use client";

import React from "react";

export const TrustSection: React.FC = () => {
  const companies = [
    { name: "Google", font: "font-semibold tracking-tight" },
    { name: "Microsoft", font: "font-medium tracking-tight" },
    { name: "amazon", font: "font-bold lowercase tracking-normal" },
    { name: "TCS", font: "font-bold tracking-wider" },
    { name: "Infosys", font: "font-medium tracking-wide" },
    { name: "accenture", font: "font-semibold lowercase tracking-tight" },
  ];

  return (
    <section className="py-10 border-y border-slate-200/70 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Trusted by students and professionals at
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          {companies.map((company, idx) => (
            <div
              key={idx}
              className={`text-slate-600 hover:text-slate-900 text-lg sm:text-xl ${company.font} transition-colors select-none`}
            >
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
