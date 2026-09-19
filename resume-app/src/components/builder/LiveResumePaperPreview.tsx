"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Mail, Phone, MapPin, Globe, Share2, ShieldCheck } from "lucide-react";
import { getVisualStyle } from "@/lib/templates/registry";

export interface FullResumeState {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    title: string;
    description: string;
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
  }>;
}

export const initialResumeState: FullResumeState = {
  personalInfo: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Product Designer & Systems Architect",
    email: "alex.morgan@career.ai",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "alexmorgan.design",
    linkedin: "linkedin.com/in/alexmorgan",
  },
  summary:
    "Product designer & frontend engineer with 7+ years building enterprise SaaS platforms. Specialized in scalable design systems, UX conversion optimization, and modern React/TypeScript web applications.",
  experience: [
    {
      id: "exp-1",
      role: "Lead Staff Product Designer",
      company: "Apex Tech Labs",
      period: "2022 — Present",
      bullets: [
        "Architected scalable design system adopted across 14 micro-frontends, cutting design-to-code velocity by 42%.",
        "Engineered AI-driven candidate workflow engine generating $2.4M ARR in new seat upgrades.",
        "Mentored cross-functional team of 6 designers and frontend engineers across US & EU timezones.",
      ],
    },
    {
      id: "exp-2",
      role: "Senior UI/UX Engineer",
      company: "Vanguard Systems",
      period: "2019 — 2022",
      bullets: [
        "Led redesign of core B2B analytics platform resulting in +18% increase in 30-day retention.",
        "Created custom component library with 100% WCAG 2.1 AA accessibility compliance.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science & Human-Computer Interaction",
      institution: "Stanford University",
      year: "2015 — 2019",
    },
  ],
  skills: [
    "Design Systems",
    "React / Next.js",
    "TypeScript",
    "Tailwind CSS",
    "User Research",
    "CRO & Analytics",
    "Figma",
  ],
  projects: [
    {
      id: "proj-1",
      title: "Antigravity Design Token Generator",
      description: "Open-source Figma plugin auto-exporting CSS design tokens directly into Tailwind CSS code.",
      link: "github.com/alexmorgan/token-gen",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "NN/g UX Master Certification",
      issuer: "Nielsen Norman Group",
      year: "2021",
    },
  ],
};

export interface LiveResumePaperPreviewProps {
  data?: FullResumeState;
  /** Accepts any template ID (e.g. "tech-elite") OR a legacy visual style ("modern"). */
  templateStyle?: string;
  className?: string;
}

export const LiveResumePaperPreview: React.FC<LiveResumePaperPreviewProps> = ({
  data = initialResumeState,
  templateStyle = "modern-professional",
  className,
}) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

  // Resolve any template ID to the 4 visual rendering themes.
  // This makes the preview work with "tech-elite", "minimal-clean", etc.
  const resolvedStyle = getVisualStyle(templateStyle);

  // Theme styling rules — keyed by the 4 canonical visual styles
  const themeMap = {
    modern: {
      container: "font-sans bg-white border-[#E4E4E7]",
      accentText: "text-[#4F46E5]",
      accentBg: "bg-[#EEF2FF]",
      border: "border-[#E4E4E7]",
      headerTitle: "text-2xl font-bold text-[#09090B]",
      sectionHeader: "text-xs font-bold uppercase tracking-wider text-[#52525B] border-b border-[#F4F4F5] pb-1 mb-2",
      badgeVariant: "indigo" as const,
    },
    executive: {
      container: "font-serif bg-[#FCFCFD] border-[#CBD5E1]",
      accentText: "text-[#0F172A]",
      accentBg: "bg-[#F1F5F9]",
      border: "border-[#CBD5E1]",
      headerTitle: "text-2xl font-serif font-bold text-[#0F172A] uppercase tracking-wide",
      sectionHeader: "text-xs font-serif font-bold uppercase tracking-widest text-[#0F172A] border-b-2 border-[#0F172A] pb-1 mb-2",
      badgeVariant: "neutral" as const,
    },
    minimalist: {
      container: "font-mono bg-white border-[#E4E4E7]",
      accentText: "text-[#18181B]",
      accentBg: "bg-[#F4F4F5]",
      border: "border-[#E4E4E7]",
      headerTitle: "text-xl font-bold text-[#18181B] tracking-tight",
      sectionHeader: "text-xs font-bold uppercase tracking-wider text-[#18181B] border-b border-[#E4E4E7] pb-1 mb-2",
      badgeVariant: "neutral" as const,
    },
    creative: {
      container: "font-sans bg-white border-[#DDD6FE]",
      accentText: "text-[#7C3AED]",
      accentBg: "bg-[#F3E8FF]",
      border: "border-[#DDD6FE]",
      headerTitle: "text-2xl font-black text-[#6D28D9] tracking-tight",
      sectionHeader: "text-xs font-bold uppercase tracking-wider text-[#7C3AED] border-b-2 border-[#DDD6FE] pb-1 mb-2",
      badgeVariant: "indigo" as const,
    },
  };
  const themeClasses = themeMap[resolvedStyle];

  return (
    <div
      className={`w-full border rounded-xl p-8 shadow-sm text-[#09090B] space-y-6 text-left transition-all ${themeClasses.container} ${className}`}
    >
      {/* Header */}
      <div className={`border-b ${themeClasses.border} pb-5`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className={themeClasses.headerTitle}>{personalInfo.fullName || "Your Name"}</h1>
            <p className={`text-sm font-semibold ${themeClasses.accentText} mt-0.5`}>
              {personalInfo.jobTitle || "Target Job Title"}
            </p>
          </div>
          <Badge variant={themeClasses.badgeVariant} size="sm" className="gap-1">
            <ShieldCheck className="w-3 h-3 text-[#10B981]" /> ATS 92% Parsable
          </Badge>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-[#52525B]">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#A1A1AA]" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#A1A1AA]" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#A1A1AA]" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#A1A1AA]" /> {personalInfo.website}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Share2 className="w-3 h-3 text-[#A1A1AA]" /> {personalInfo.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div>
          <h2 className={themeClasses.sectionHeader}>
            Professional Summary
          </h2>
          <p className="text-xs text-[#52525B] leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div>
          <h2 className={themeClasses.sectionHeader}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-[#09090B]">{exp.role}</span>
                  <span className="text-[11px] text-[#A1A1AA]">{exp.period}</span>
                </div>
                <span className={`text-xs font-medium ${themeClasses.accentText}`}>{exp.company}</span>
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 space-y-1 pl-4 list-disc text-xs text-[#52525B]">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className={themeClasses.sectionHeader}>
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className={`px-2 py-0.5 text-[11px] rounded ${themeClasses.accentBg} text-[#52525B] border ${themeClasses.border} font-medium`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2 className={themeClasses.sectionHeader}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-[#09090B]">{edu.degree}</span>
                  <span className="text-[#52525B] ml-2">• {edu.institution}</span>
                </div>
                <span className="text-[11px] text-[#A1A1AA]">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className={themeClasses.sectionHeader}>
            Featured Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[#09090B]">
                  <span>{proj.title}</span>
                  {proj.link && <span className={`text-[11px] font-normal ${themeClasses.accentText}`}>{proj.link}</span>}
                </div>
                <p className="text-[#52525B]">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className={themeClasses.sectionHeader}>
            Certifications & Training
          </h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between text-xs text-[#52525B]">
                <span className="font-medium text-[#09090B]">
                  {cert.name} <span className="text-[#71717A]">({cert.issuer})</span>
                </span>
                <span className="text-[11px] text-[#A1A1AA]">{cert.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
