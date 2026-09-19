"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Send,
  Bot,
  User,
  FileText,
  Target,
  Mic,
  Search,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Paperclip,
  Briefcase,
  MessageSquare,
  BookOpen,
  Compass,
  Plus,
  Clock,
  Quote,
} from "lucide-react";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/firebase/context";
import { getUserResumesDocs, ResumeDocument } from "@/lib/firebase/firestore";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AiAssistantPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Core chat state (PRESERVED from existing implementation) ──
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello! I am your AI Resume Assistant. I can analyze your resume, optimize bullet points for target job descriptions, or prepare custom mock interview questions. What would you like to work on today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // ── Resume context ──
  const [latestResume, setLatestResume] = useState<ResumeDocument | null>(null);
  const [resumeLoading, setResumeLoading] = useState(true);

  useEffect(() => {
    async function loadLatestResume() {
      if (!user) { setResumeLoading(false); return; }
      try {
        const docs = await getUserResumesDocs(user.uid);
        if (docs.length > 0) {
          // Sort by updatedAt descending, pick latest
          const sorted = docs.sort((a, b) =>
            (b.updatedAt || "").localeCompare(a.updatedAt || "")
          );
          setLatestResume(sorted[0]);
        }
      } catch { /* silent */ }
      setResumeLoading(false);
    }
    loadLatestResume();
  }, [user]);

  // ── Auto-scroll to bottom on new messages ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Send handler (PRESERVED — exact same business logic) ──
  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      let actionType: "improve_summary" | "rewrite_experience" | "improve_project" | "generate_skills" | "improve_achievement" | "general_qa" = "general_qa";

      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes("summary") && (lowerText.includes("rewrite") || lowerText.includes("improve"))) {
        actionType = "improve_summary";
      } else if (lowerText.includes("bullet") && (lowerText.includes("rewrite") || lowerText.includes("experience"))) {
        actionType = "rewrite_experience";
      } else if (lowerText.includes("project") && lowerText.includes("improve")) {
        actionType = "improve_project";
      } else if (lowerText.includes("achievement") && lowerText.includes("improve")) {
        actionType = "improve_achievement";
      } else if (lowerText.includes("skill") && lowerText.includes("list")) {
        actionType = "generate_skills";
      }

      // Call live AI endpoint
      const aiRes = await fetchApi<any>("/api/ai/resume-assistant", {
        method: "POST",
        body: JSON.stringify({
          action_type: actionType,
          current_content: textToSend,
        }),
      });

      const responseText =
        aiRes.success && aiRes.data?.suggested_content
          ? aiRes.data.suggested_content
          : `I evaluated your request regarding "${textToSend}". Here is an optimized recommendation based on your active resume structure:\n\n• Quantify achievements using concrete impact metrics (e.g. "+42% latency reduction" or "scaled to 500k active users").\n• Align bullet points with key industry ATS terms: CI/CD, Microservices, TypeScript, PostgreSQL, and Automated Testing.`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI assistant error:", err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "I encountered a temporary issue generating a response. Please check your network connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // ── Quick prompt chips shown below first AI message ──
  const promptChips = [
    { label: "Optimize my resume", icon: Sparkles },
    { label: "Find missing keywords", icon: Search },
    { label: "Generate interview questions", icon: Mic },
    { label: "Review my cover letter", icon: FileText },
    { label: "Suggest career growth tips", icon: BookOpen },
    { label: "Analyze this job description", icon: Target },
  ];

  // ── Quick action cards for hero section ──
  const quickActions = [
    { label: "Improve Resume", desc: "Get AI-powered suggestions", icon: FileText, color: "#4F46E5" },
    { label: "Find Keywords", desc: "Target the right skills", icon: Search, color: "#7C3AED" },
    { label: "Prepare for Interviews", desc: "Practice with AI", icon: Mic, color: "#10B981" },
    { label: "Career Guidance", desc: "Get personalized advice", icon: Compass, color: "#F59E0B" },
  ];

  // ── Right sidebar quick actions ──
  const sidebarActions = [
    { label: "Optimize Resume", desc: "Improve with AI", icon: Sparkles, query: "Optimize my resume for ATS compatibility" },
    { label: "Analyze Job Description", desc: "Get tailored advice", icon: Target, query: "Analyze this job description for key requirements" },
    { label: "Generate Questions", desc: "Mock interview prep", icon: MessageSquare, query: "Generate 3 behavioral interview questions" },
    { label: "Career Advice", desc: "Get expert insights", icon: Compass, query: "Give me career growth suggestions for a software engineer" },
  ];

  // ── Derived user data ──
  const displayName = !authLoading
    ? (profile?.fullName || user?.displayName || (user?.email ? user.email.split("@")[0] : ""))
    : "";
  const userInitials = getInitials(displayName);
  const resumeTitle = latestResume?.title || latestResume?.personalInfo?.fullName || null;

  return (
    <div className="space-y-0 text-left">
      {/* ════════════════════════════════════════════════════════════════════
          1. HERO BANNER
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF9FF] border border-[#E0E0F0] p-6 sm:p-8 mb-6">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C7D2FE]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-gradient-to-tr from-[#DDD6FE]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                AI Career Assistant
              </h1>
              <Badge variant="indigo" size="sm" className="gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                Active Session
              </Badge>
            </div>
            <p className="text-sm text-[#64748B] max-w-lg">
              Your personal AI career coach — optimized for real opportunities.
            </p>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.label)}
                    className="group flex flex-col items-start gap-1.5 p-3 bg-white/70 backdrop-blur-sm border border-[#E5E7EB] rounded-xl hover:border-[#4F46E5]/40 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-200 text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${action.color}15`, color: action.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827]">{action.label}</span>
                    <span className="text-[10px] text-[#64748B] leading-snug">{action.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hero right — decorative AI robot illustration */}
          <div className="hidden lg:flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              {/* AI robot character */}
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-14 h-14 text-white" />
              </div>
              {/* Floating decoration badges */}
              <div className="absolute -top-3 -right-6 px-2 py-1 bg-white border border-[#E5E7EB] rounded-lg shadow-sm text-[10px] font-bold text-[#4F46E5] rotate-3 whitespace-nowrap">
                Ask. Improve. Get Hired. ✨
              </div>
              <div className="absolute -bottom-2 -left-8 px-2 py-1 bg-white border border-[#E5E7EB] rounded-lg shadow-sm text-[10px] font-bold text-[#7C3AED] -rotate-6 whitespace-nowrap italic">
                Same Skills. Bigger Opportunities.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          2. MAIN WORKSPACE — Two Column Layout
         ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT: Chat Workspace (8/12) ── */}
        <div className="lg:col-span-8 space-y-0">
          {/* Chat Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ minHeight: "520px" }}>
            {/* Chat Header */}
            <div className="px-5 py-3.5 border-b border-[#F4F4F5] flex items-center justify-between bg-[#FAFAFC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#6366F1] flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#111827]">AI Career Assistant</span>
                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-[#10B981] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
                    Active Session
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" style={{ maxHeight: "420px" }}>
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.sender === "ai"
                        ? "bg-gradient-to-tr from-[#4F46E5] to-[#6366F1] text-white shadow-sm"
                        : "bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E0F0]"
                    }`}
                  >
                    {msg.sender === "ai" ? <Bot className="w-4 h-4" /> : (
                      user?.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold">{userInitials}</span>
                      )
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[85%] space-y-1 ${msg.sender === "user" ? "items-end" : ""}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                        msg.sender === "ai"
                          ? "bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-md shadow-sm"
                          : "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white rounded-tr-md shadow-md shadow-indigo-500/20"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    <span className={`text-[10px] block ${msg.sender === "user" ? "text-right" : ""} text-[#A1A1AA]`}>
                      {msg.timestamp}
                    </span>

                    {/* Prompt chips — shown below first AI message only */}
                    {msg.sender === "ai" && idx === 0 && messages.length <= 1 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {promptChips.map((chip) => {
                          const ChipIcon = chip.icon;
                          return (
                            <button
                              key={chip.label}
                              onClick={() => handleSend(chip.label)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3FF] border border-[#DDD6FE] rounded-full text-[11px] font-semibold text-[#4F46E5] hover:bg-[#EEF2FF] hover:border-[#4F46E5]/50 hover:shadow-sm transition-all"
                            >
                              <ChipIcon className="w-3 h-3" />
                              {chip.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#6366F1] text-white flex items-center justify-center shadow-sm shrink-0">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-md shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="border-t border-[#F4F4F5] px-4 py-3 bg-[#FAFAFC]">
              <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/10 transition-all">
                <button
                  type="button"
                  className="p-1.5 text-[#94A3B8] hover:text-[#4F46E5] rounded-lg hover:bg-[#EEF2FF] transition-colors"
                  aria-label="Attach file"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask your AI Career Assistant anything about your resume, cover letter, or interviews..."
                  className="flex-1 text-[13px] text-[#111827] placeholder:text-[#94A3B8] bg-transparent focus:outline-none py-2"
                />

                <button
                  type="button"
                  className="p-1.5 text-[#94A3B8] hover:text-[#4F46E5] rounded-lg hover:bg-[#EEF2FF] transition-colors"
                  aria-label="Voice input"
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSend()}
                  isLoading={loading}
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                  className="font-bold shadow-sm text-xs px-4 h-9 shrink-0 rounded-lg"
                >
                  Send
                </Button>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-1.5 px-1">
                Be specific for better results. You can also upload your resume or job description.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar (4/12) ── */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Actions Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-black text-[#111827] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {sidebarActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.query)}
                    className="group flex flex-col items-start gap-1.5 p-3 bg-[#FAFAFC] border border-[#E5E7EB] rounded-xl hover:border-[#4F46E5]/40 hover:bg-[#EEF2FF]/40 hover:shadow-sm transition-all text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#111827] leading-tight">{action.label}</span>
                    <span className="text-[10px] text-[#64748B] leading-tight">{action.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Resume Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-black text-[#111827] mb-3">Current Resume</h3>
            {resumeLoading ? (
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <div className="w-4 h-4 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                Loading resume...
              </div>
            ) : latestResume ? (
              <div className="flex items-center gap-3 p-3 bg-[#FAFAFC] border border-[#E5E7EB] rounded-xl">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#111827] truncate">
                    {resumeTitle || "Untitled Resume"}.pdf
                  </p>
                  <p className="text-[10px] text-[#64748B] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last updated {latestResume.updatedAt
                      ? new Date(latestResume.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })
                      : "recently"}
                  </p>
                </div>
                <button
                  onClick={() => handleSend("Analyze my resume and provide optimization suggestions")}
                  className="px-3 py-1.5 bg-[#4F46E5] text-white text-[10px] font-bold rounded-lg hover:bg-[#4338CA] transition-colors shadow-sm shrink-0"
                >
                  Analyze Resume
                </button>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs text-[#64748B] mb-2">No resume found yet.</p>
                <a
                  href="/dashboard/resumes/builder"
                  className="text-[11px] font-bold text-[#4F46E5] hover:underline"
                >
                  Create your first resume →
                </a>
              </div>
            )}
          </div>

          {/* Target Job Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-black text-[#111827] mb-2">Target Job (Optional)</h3>
            <p className="text-[11px] text-[#64748B] mb-3 leading-relaxed">
              Add a job description to get personalized recommendations.
            </p>
            <button
              onClick={() => handleSend("I'd like to add a target job description for personalized recommendations")}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Job Description
            </button>
          </div>

          {/* Career Goals Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-black text-[#111827] mb-2">Your Goals</h3>
            <p className="text-[11px] text-[#64748B] mb-3 leading-relaxed">
              Tell us your career goals. Get more relevant suggestions.
            </p>
            <button
              onClick={() => handleSend("Help me set career goals and create a growth plan")}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
            >
              <Target className="w-3.5 h-3.5" />
              Set Career Goals
            </button>
          </div>

          {/* Motivational Footer Card */}
          <div className="bg-gradient-to-br from-[#EEF2FF] via-[#F5F3FF] to-[#FAF9FF] border border-[#E0E0F0] rounded-2xl p-5">
            <div className="flex items-start gap-2 mb-2">
              <Quote className="w-5 h-5 text-[#4F46E5] shrink-0 opacity-50" />
            </div>
            <p className="text-sm font-bold text-[#4F46E5] italic leading-relaxed">
              Small steps today
              <br />
              lead to big opportunities tomorrow.
            </p>
            <p className="text-[10px] text-[#7C3AED] font-semibold mt-2">
              — Your AI Career Assistant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
