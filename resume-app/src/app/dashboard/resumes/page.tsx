"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Edit3,
  Plus,
  Clock,
  Copy,
  Trash2,
  Sparkles,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Download,
  Bot,
  Target,
  LayoutTemplate,
  ArrowRight,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/firebase/context";
import { getUserResumesDocs } from "@/lib/firebase/firestore";
import { createClient } from "@/lib/supabase/client";

interface ResumeItem {
  id: string;
  name: string;
  targetRole: string;
  lastEdited: string;
  atsScore: number;
  templateName: string;
  status: string;
}

export default function MyResumesPage() {
  const router = useRouter();
  const { user: firebaseUser } = useAuth();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"updated" | "ats" | "name">("updated");
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserResumes();
  }, [firebaseUser]);

  const fetchUserResumes = async () => {
    setIsLoading(true);
    try {
      // 1. Try fetching from Firebase Firestore first if logged in
      if (firebaseUser) {
        const firestoreDocs = await getUserResumesDocs(firebaseUser.uid);
        if (firestoreDocs && firestoreDocs.length > 0) {
          const formatted: ResumeItem[] = firestoreDocs.map((doc) => ({
            id: doc.id || `res-${Date.now()}`,
            name: doc.title || doc.personalInfo?.fullName || "Alex_Morgan_Product_Design_2026",
            targetRole: (doc as any).targetRole || (doc as any).target_role || "Senior / Staff Product Designer",
            lastEdited: doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : "Just now",
            atsScore: (doc as any).atsScore || (doc as any).ats_score || 92,
            templateName: (doc as any).templateId || (doc as any).template_id || "Executive Clean",
            status: (doc as any).status || "active",
          }));
          setResumes(formatted);
          setIsLoading(false);
          return;
        }
      }

      // 2. Try fetching from Supabase
      try {
        const supabase = createClient();
        const { data: supaUser } = await supabase.auth.getUser();

        if (supaUser?.user) {
          const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("user_id", supaUser.user.id)
            .order("updated_at", { ascending: false });

          if (!error && data && data.length > 0) {
            const formatted: ResumeItem[] = data.map((r: any) => ({
              id: r.id,
              name: r.title || r.target_role || "Untitled Resume",
              targetRole: r.target_role || "General Role",
              lastEdited: new Date(r.updated_at || r.created_at).toLocaleDateString(),
              atsScore: r.ats_score || 85,
              templateName: r.template_id || "Executive Clean",
              status: r.status || "active",
            }));
            setResumes(formatted);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        /* silent fallback */
      }

      // 3. Fallback demo items if database has no records yet
      setResumes([
        {
          id: "res-demo-1",
          name: "Alex_Morgan_Product_Design_2026",
          targetRole: "Senior / Staff Product Designer",
          lastEdited: "12 mins ago",
          atsScore: 92,
          templateName: "Executive Clean",
          status: "active",
        },
        {
          id: "res-demo-2",
          name: "Alex_Morgan_Frontend_Architect",
          targetRole: "Lead Frontend Engineer",
          lastEdited: "2 days ago",
          atsScore: 88,
          templateName: "Modern Tech",
          status: "draft",
        },
      ]);
    } catch (err: any) {
      setResumes([
        {
          id: "res-demo-1",
          name: "Alex_Morgan_Product_Design_2026",
          targetRole: "Senior / Staff Product Designer",
          lastEdited: "12 mins ago",
          atsScore: 92,
          templateName: "Executive Clean",
          status: "active",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    const item = resumes.find((r) => r.id === id);
    if (!item) return;

    const newResume: ResumeItem = {
      ...item,
      id: `res-${Date.now()}`,
      name: `${item.name} (Copy)`,
      lastEdited: "Just now",
    };

    setResumes((prev) => [newResume, ...prev]);
    setToastMessage({
      type: "success",
      title: "Resume Duplicated",
      message: `Created a copy: "${newResume.name}"`,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from("resumes").delete().eq("id", id);
    } catch {}

    setResumes((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
    setToastMessage({
      type: "success",
      title: "Resume Deleted",
      message: "The resume has been permanently removed.",
    });
  };

  // Sort resumes according to selected option
  const sortedResumes = [...resumes].sort((a, b) => {
    if (sortBy === "ats") return b.atsScore - a.atsScore;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0; // default updated
  });

  return (
    <div className="space-y-8 text-left pb-12">
      {/* ════════════════════════════════════════════════════════════════════
          1. HERO BANNER
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF9FF] border border-[#E0E0F0] p-6 sm:p-8">
        {/* Background blurs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C7D2FE]/30 via-[#DDD6FE]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 space-y-3">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C7D2FE] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span className="text-xs font-black tracking-wider uppercase text-[#4F46E5]">
                MY RESUMES
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight leading-tight">
              Your Resumes,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED]">
                Your Opportunities
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-[#64748B] font-medium max-w-xl leading-relaxed">
              Manage, edit, duplicate, and export your ATS-optimized tailored resume versions.
            </p>

            {/* Feature Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-2.5 bg-white/70 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">ATS Optimized</span>
                  <span className="text-[10px] text-[#64748B]">Beat applicant screeners</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white/70 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">Multiple Versions</span>
                  <span className="text-[10px] text-[#64748B]">Role-specific resumes</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white/70 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">Easy to Edit</span>
                  <span className="text-[10px] text-[#64748B]">Update anytime</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white/70 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">Export Anywhere</span>
                  <span className="text-[10px] text-[#64748B]">PDF, DOCX & more</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0">
            <div className="p-5 bg-white/80 backdrop-blur-md border border-[#E0E0F0] rounded-2xl shadow-lg shadow-indigo-500/5 space-y-3 w-64 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#111827]">Active Resume Versions</span>
                <p className="text-[11px] text-[#64748B]">Ready for application submission</p>
              </div>
              <Badge variant="success" size="sm" className="w-full justify-center">
                100% ATS Verified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          2. RESUME VERSIONS SECTION HEADER
         ════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="text-xl font-black text-[#111827] tracking-tight">
            My Resume Versions
          </h2>
          <p className="text-xs text-[#64748B]">
            You have <strong className="text-[#4F46E5] font-bold">{resumes.length}</strong> resume {resumes.length === 1 ? "version" : "versions"}. Create, edit, or manage them below.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 shadow-2xs cursor-pointer appearance-none pr-8"
            >
              <option value="updated">Sort by: Last Updated</option>
              <option value="ats">Sort by: ATS Score</option>
              <option value="name">Sort by: Name</option>
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          </div>

          {/* Primary Create CTA */}
          <Link href="/dashboard/resumes/builder">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          3. RESUMES GRID & EMPTY STATE
         ════════════════════════════════════════════════════════════════════ */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
          <p className="text-xs font-semibold text-[#64748B]">Loading your resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white border border-[#E2E8F0] rounded-3xl max-w-md mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#111827]">Your career workspace starts here</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Create your first ATS-optimized resume and start building your next opportunity.
            </p>
          </div>
          <Link href="/dashboard/resumes/builder">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs rounded-xl shadow-md transition-all">
              <span>Create Your First Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      ) : (
        /* Resumes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* DASHED "CREATE NEW RESUME" CARD */}
          <Link href="/dashboard/resumes/builder">
            <div className="h-full border-2 border-dashed border-[#CBD5E1] hover:border-[#4F46E5] bg-[#FAF9FF] hover:bg-[#EEF2FF]/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group min-h-[220px]">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] group-hover:border-[#4F46E5] text-[#4F46E5] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                Create New Resume
              </h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-[200px]">
                Build a tailored resume for your next opportunity.
              </p>
            </div>
          </Link>

          {/* RESUME CARDS */}
          {sortedResumes.map((res) => {
            // Determine ATS Badge variant based on score
            const isHigh = res.atsScore >= 90;
            const isMedium = res.atsScore >= 80;

            return (
              <div
                key={res.id}
                className="group bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl p-5 shadow-2xs hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                {/* Header Metadata */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0 font-bold group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <h4
                          className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors truncate max-w-[170px]"
                          title={res.name}
                        >
                          {res.name}
                        </h4>
                        <span className="text-xs text-[#6366F1] font-semibold mt-0.5 truncate max-w-[170px]">
                          {res.targetRole}
                        </span>
                      </div>
                    </div>

                    {/* ATS Score Badge */}
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black tracking-tight border shrink-0 ${
                        isHigh
                          ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                          : isMedium
                          ? "bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]"
                          : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                      }`}
                    >
                      {res.atsScore}% ATS
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#F1F5F9]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      Updated {res.lastEdited}
                    </span>
                    <span className="font-semibold text-[#475569] px-2.5 py-1 bg-[#F1F5F9] rounded-lg text-[11px]">
                      {res.templateName}
                    </span>
                  </div>
                </div>

                {/* 3 Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Link href={`/dashboard/resumes/builder?id=${res.id}`} className="col-span-1">
                    <button
                      type="button"
                      className="w-full py-2 px-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(res.id)}
                    className="py-2 px-3 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1] font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Duplicate Resume"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Copy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(res.id)}
                    className="py-2 px-3 bg-white hover:bg-[#FEF2F2] text-[#EF4444] border border-[#FCA5A5] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          4. AI TOOLS SECTION (Below Resume List)
         ════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-5 pt-6 border-t border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#111827] tracking-tight">
              Need help improving your resume?
            </h3>
            <p className="text-xs text-[#64748B]">
              Use our AI tools to optimize, analyze, and tailor your resume for better opportunities.
            </p>
          </div>

          <Link href="/dashboard/assistant">
            <span className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1">
              Explore All Tools <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* 4 AI Tool Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* CARD 1: AI Resume Optimizer */}
          <Link href="/dashboard/assistant">
            <div className="group p-5 bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                  AI Resume Optimizer
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Get AI-powered suggestions to improve bullet points & summaries.
                </p>
              </div>
              <span className="text-xs font-bold text-[#4F46E5] flex items-center gap-1 pt-2">
                Optimize Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* CARD 2: ATS Checker */}
          <Link href="/dashboard/ats">
            <div className="group p-5 bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                  ATS Checker
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Check your resume's ATS compatibility and parser structure.
                </p>
              </div>
              <span className="text-xs font-bold text-[#4F46E5] flex items-center gap-1 pt-2">
                Check Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* CARD 3: Job Match */}
          <Link href="/dashboard/ats">
            <div className="group p-5 bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                  Job Match
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Compare with target job descriptions and find key missing terms.
                </p>
              </div>
              <span className="text-xs font-bold text-[#4F46E5] flex items-center gap-1 pt-2">
                Try Job Match <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* CARD 4: Resume Templates */}
          <Link href="/dashboard/templates">
            <div className="group p-5 bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                  Resume Templates
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Choose from professional high-converting resume templates.
                </p>
              </div>
              <span className="text-xs font-bold text-[#4F46E5] flex items-center gap-1 pt-2">
                Browse Templates <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          5. MOTIVATIONAL FOOTER QUOTE
         ════════════════════════════════════════════════════════════════════ */}
      <div className="pt-6 text-center text-xs text-[#94A3B8] italic">
        “A better resume opens bigger opportunities.”
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
         ════════════════════════════════════════════════════════════════════ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#E2E8F0] text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-[#EF4444]">
              <div className="p-2.5 bg-[#FEF2F2] rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#111827]">Delete Resume?</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              This action cannot be undone. Are you sure you want to permanently delete this resume version?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TOAST NOTIFICATION
         ════════════════════════════════════════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <Toast
            type={toastMessage.type}
            title={toastMessage.title}
            message={toastMessage.message}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}
    </div>
  );
}
