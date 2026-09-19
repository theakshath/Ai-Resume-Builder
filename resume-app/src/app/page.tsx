import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TemplatesSection } from "@/components/landing/TemplatesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume Builder & ATS Job Matcher",
  description:
    "Build ATS-friendly resumes, optimize bullet points for target job posts, and practice mock interviews with AI.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF9FD] text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar />
      <main>
        <Hero />
        <TemplatesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <div id="faq">
          <FaqSection />
        </div>
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
