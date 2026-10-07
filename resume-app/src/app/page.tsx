import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";

const TemplatesSection = dynamic(() => import('@/components/landing/TemplatesSection').then(mod => mod.TemplatesSection), { ssr: true });
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection').then(mod => mod.FeaturesSection), { ssr: true });
const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection').then(mod => mod.HowItWorksSection), { ssr: true });
const PricingSection = dynamic(() => import('@/components/landing/PricingSection').then(mod => mod.PricingSection), { ssr: true });
const FaqSection = dynamic(() => import('@/components/landing/FaqSection').then(mod => mod.FaqSection), { ssr: true });
const FinalCtaSection = dynamic(() => import('@/components/landing/FinalCtaSection').then(mod => mod.FinalCtaSection), { ssr: true });
const Footer = dynamic(() => import('@/components/landing/Footer').then(mod => mod.Footer), { ssr: true });

export const metadata: Metadata = {
  title: "ResumeAI - AI-Powered Resume Builder & ATS Job Matcher",
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
