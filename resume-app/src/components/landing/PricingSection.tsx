"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      description: "Essential resume builder to start your application process.",
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        "1 ATS-Friendly Resume Template",
        "Basic Bullet Point Editor",
        "PDF Export with ResumeAI Watermark",
        "1 Job Match Scan / month",
      ],
      cta: "Start Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      description: "Everything you need to tailor resumes and ace interviews.",
      priceMonthly: 19,
      priceYearly: 14,
      features: [
        "Unlimited Professional Templates",
        "Unlimited AI Bullet Quantifier & Rewrites",
        "Unlimited ATS Job Description Matcher",
        "5 AI Mock Interview Practice Sessions",
        "PDF & Word DOCX Clean Exports",
      ],
      cta: "Start Pro 7-Day Trial",
      variant: "primary" as const,
      popular: true,
    },
    {
      name: "Premium",
      description: "Maximum AI power for aggressive career transitions.",
      priceMonthly: 39,
      priceYearly: 29,
      features: [
        "Everything in Pro Plan",
        "Unlimited AI Mock Interview Sessions",
        "Priority Voice Interview AI Processing",
        "1-on-1 AI Salary Negotiation Prompts",
        "Dedicated Email & Chat Support",
      ],
      cta: "Get Premium",
      variant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase tracking-wider text-indigo-700">
            Simple, Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Invest in your career with clear plans.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Start completely free or unlock unlimited AI optimization and mock interviews with Pro.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-slate-200/70 p-1 rounded-full flex items-center gap-1 border border-slate-300/50">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Yearly Billing
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => {
            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

            return (
              <div
                key={idx}
                className={`bg-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative text-left ${
                  plan.popular
                    ? "border-2 border-indigo-600 shadow-xl shadow-indigo-500/10 scale-102 lg:-translate-y-2"
                    : "border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{plan.description}</p>
                    </div>
                  </div>

                  <div className="my-6 pb-6 border-b border-slate-100 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                      ${price}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      / month {billingCycle === "yearly" && "(billed annually)"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      What's Included:
                    </span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/signup" className="w-full">
                  <Button
                    variant={plan.variant}
                    size="lg"
                    className={`w-full rounded-full font-semibold transition-all ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                        : "border-slate-300 hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
