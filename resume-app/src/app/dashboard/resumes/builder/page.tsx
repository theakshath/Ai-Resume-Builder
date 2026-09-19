"use client";

import React, { useState, useEffect, Suspense } from "react";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { LiveResumePaperPreview, initialResumeState, FullResumeState } from "@/components/builder/LiveResumePaperPreview";
import { PersonalDetailsForm } from "@/components/builder/PersonalDetailsForm";
import { SummaryForm } from "@/components/builder/SummaryForm";
import { ExperienceForm } from "@/components/builder/ExperienceForm";
import { SkillsForm } from "@/components/builder/SkillsForm";
import { EducationForm } from "@/components/builder/EducationForm";
import { ProjectsForm } from "@/components/builder/ProjectsForm";
import { CertificationsForm } from "@/components/builder/CertificationsForm";

import { Accordion } from "@/components/ui/Accordion";
import { Toast } from "@/components/ui/Toast";
import { Loader2, Edit3, Eye } from "lucide-react";
import { useAuth } from "@/lib/firebase/context";
import { createResumeDoc, getResumeDocById, updateResumeDoc, ResumeDocument } from "@/lib/firebase/firestore";
import { generateResumePDFBuffer } from "@/lib/export/pdf-generator";
import { useSearchParams, useRouter } from "next/navigation";
import { resolveTemplate, DEFAULT_TEMPLATE_ID } from "@/lib/templates/registry";

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeIdParam = searchParams.get("id");
  // templateParam is the stable template ID passed from the Templates page
  // e.g. "tech-elite", "minimal-clean", "creative-sidebar"
  const templateParam = searchParams.get("template");
  const { user } = useAuth();

  const [activeResumeId, setActiveResumeId] = useState<string | null>(resumeIdParam);
  const [docName, setDocName] = useState<string>("My Resume Draft");
  const [resumeData, setResumeData] = useState<FullResumeState>(initialResumeState);

  // ─── Template ID state ──────────────────────────────────────────────────────
  // Priority:
  //   1. Explicit ?template= URL param from Templates page  ← highest priority
  //   2. Saved templateStyle on an existing resume (set in loadResumeData below)
  //   3. Default template
  //
  // We initialize directly from templateParam (no fuzzy mapping).
  // resolveTemplate validates the ID and falls back to DEFAULT_TEMPLATE_ID
  // if an unknown value is given, so it is always safe.
  const [templateStyle, setTemplateStyle] = useState<string>(
    resolveTemplate(templateParam).id
  );

  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "failed" | "unsaved">("saved");
  const [saveStatusMessage, setSaveStatusMessage] = useState<string>("Saved just now");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "personal",
    "summary",
    "experience",
    "skills",
    "education",
    "projects",
    "certifications",
  ]);

  const moveSection = (id: string, direction: "up" | "down") => {
    setSectionOrder((prevOrder) => {
      const index = prevOrder.indexOf(id);
      if (index === -1) return prevOrder;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prevOrder.length) return prevOrder;
      const newOrder = [...prevOrder];
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = temp;
      return newOrder;
    });
    setSaveStatus("unsaved");
  };

  // 1. Initial Draft Restoration
  useEffect(() => {
    async function loadResumeData() {
      if (!user) {
        setIsInitialLoad(false);
        return;
      }

      if (activeResumeId) {
        try {
          const doc = await getResumeDocById(user.uid, activeResumeId);
          if (doc) {
            setDocName(doc.title || "My Resume Draft");

            // CRITICAL: Only restore the saved template if the user did NOT
            // explicitly select a template from the Templates page.
            // templateParam (from URL) always has higher priority.
            if (!templateParam && doc.templateStyle) {
              setTemplateStyle(resolveTemplate(doc.templateStyle).id);
            }

            if (doc.sectionOrder) setSectionOrder(doc.sectionOrder);

            const restored: FullResumeState = {
              personalInfo: doc.personalInfo || initialResumeState.personalInfo,
              summary: doc.summary ?? initialResumeState.summary,
              experience: doc.experience || initialResumeState.experience,
              education: doc.education || initialResumeState.education,
              skills: doc.skills || initialResumeState.skills,
              projects: doc.projects || initialResumeState.projects,
              certifications: doc.certifications || initialResumeState.certifications,
            };
            setResumeData(restored);
            setSaveStatus("saved");
            setSaveStatusMessage("Restored from cloud draft");
          }
        } catch (err) {
          console.warn("[ResumeBuilder] Load draft error:", err);
        }
      }
      setIsInitialLoad(false);
    }

    loadResumeData();
  }, [activeResumeId, user]);


  // 2. Draft Persistence Logic (Firestore & Local)
  const persistDraft = async () => {
    if (!user) {
      setSaveStatus("saved");
      setSaveStatusMessage("Saved locally");
      return;
    }

    setSaveStatus("saving");
    setSaveStatusMessage("Saving...");

    try {
      const titleToSave = docName.trim() || resumeData.personalInfo.fullName || "My Resume Draft";

      const payload: Partial<ResumeDocument> = {
        title: titleToSave,
        templateStyle,
        personalInfo: resumeData.personalInfo || {},
        summary: resumeData.summary || "",
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || [],
        sectionOrder,
      };

      let targetId = activeResumeId;
      if (targetId) {
        await updateResumeDoc(user.uid, targetId, payload);
      } else {
        targetId = await createResumeDoc(user.uid, {
          uid: user.uid,
          ...payload,
          title: titleToSave,
        });
        setActiveResumeId(targetId);
        router.replace(`/dashboard/resumes/builder?id=${targetId}`);
      }

      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setSaveStatus("saved");
      setSaveStatusMessage(`Saved at ${nowTime}`);
    } catch (err: any) {
      console.error("[ResumeBuilder] Save error:", err);
      setSaveStatus("failed");
      setSaveStatusMessage("Save failed");
    }
  };

  // 3. Debounced Auto-Save
  useEffect(() => {
    if (isInitialLoad) return;

    setSaveStatus("unsaved");
    const timer = setTimeout(() => {
      persistDraft();
    }, 1500);

    return () => clearTimeout(timer);
  }, [resumeData, docName, templateStyle, sectionOrder]);

  // 4. Unsaved changes navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === "unsaved" || saveStatus === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveStatus]);

  // 5. PDF Download Handler
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setToastType("success");
    setToastMessage("Generating formatted PDF document...");

    try {
      // Build PDF buffer using pure PDF 1.4 binary engine
      const pdfBuffer = generateResumePDFBuffer(resumeData, templateStyle);
      const arrayBuffer = new ArrayBuffer(pdfBuffer.byteLength);
      new Uint8Array(arrayBuffer).set(
        new Uint8Array(
          pdfBuffer.buffer,
          pdfBuffer.byteOffset,
          pdfBuffer.byteLength
        )
      );
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const rawName = resumeData.personalInfo.fullName || docName || "Resume";
      const safeFilename = `${rawName.trim().replace(/[^a-zA-Z0-9]/g, "_")}_Resume.pdf`;

      const a = document.createElement("a");
      a.href = url;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setToastType("success");
      setToastMessage(`Downloaded ${safeFilename}!`);
    } catch (err: any) {
      console.error("PDF export error:", err);
      setToastType("error");
      setToastMessage("Failed to generate PDF. Please check your resume content and retry.");
    } finally {
      setIsDownloadingPdf(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const sectionMap: Record<string, { title: string; content: React.ReactNode }> = {
    personal: {
      title: "Personal Information",
      content: (
        <PersonalDetailsForm
          personalInfo={resumeData.personalInfo}
          onChange={(personalInfo) => setResumeData((prev) => ({ ...prev, personalInfo }))}
        />
      ),
    },
    summary: {
      title: "Professional Summary",
      content: (
        <SummaryForm
          summary={resumeData.summary}
          onChange={(summary) => setResumeData((prev) => ({ ...prev, summary }))}
        />
      ),
    },
    experience: {
      title: "Work Experience",
      content: (
        <ExperienceForm
          experience={resumeData.experience}
          onChange={(experience) => setResumeData((prev) => ({ ...prev, experience }))}
        />
      ),
    },
    skills: {
      title: "Skills & Competencies",
      content: (
        <SkillsForm
          skills={resumeData.skills}
          onChange={(skills) => setResumeData((prev) => ({ ...prev, skills }))}
        />
      ),
    },
    education: {
      title: "Education",
      content: (
        <EducationForm
          education={resumeData.education}
          onChange={(education) => setResumeData((prev) => ({ ...prev, education }))}
        />
      ),
    },
    projects: {
      title: "Featured Projects",
      content: (
        <ProjectsForm
          projects={resumeData.projects}
          onChange={(projects) => setResumeData((prev) => ({ ...prev, projects }))}
        />
      ),
    },
    certifications: {
      title: "Certifications & Achievements",
      content: (
        <CertificationsForm
          certifications={resumeData.certifications}
          onChange={(certifications) => setResumeData((prev) => ({ ...prev, certifications }))}
        />
      ),
    },
  };

  const editorSections = sectionOrder.map((id, index) => ({
    id,
    title: `${index + 1}. ${sectionMap[id].title}`,
    content: sectionMap[id].content,
    onMoveUp: index > 0 ? () => moveSection(id, "up") : undefined,
    onMoveDown: index < sectionOrder.length - 1 ? () => moveSection(id, "down") : undefined,
  }));

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#09090B] flex flex-col">
      {/* Top Header */}
      <BuilderHeader
        onSave={persistDraft}
        onDownloadPdf={handleDownloadPdf}
        templateStyle={templateStyle}
        onTemplateStyleChange={setTemplateStyle}
        docName={docName}
        onDocNameChange={setDocName}
        saveStatus={saveStatus}
        saveStatusMessage={saveStatusMessage}
        isDownloadingPdf={isDownloadingPdf}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white border-b border-[#E4E4E7] px-4 py-2 flex items-center justify-center sticky top-16 z-30">
        <div className="inline-flex bg-[#F4F4F5] p-1 rounded-lg w-full max-w-sm">
          <button
            onClick={() => setActiveMobileTab("edit")}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeMobileTab === "edit" ? "bg-white text-[#09090B] shadow-2xs" : "text-[#71717A]"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Resume
          </button>
          <button
            onClick={() => setActiveMobileTab("preview")}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeMobileTab === "preview" ? "bg-white text-[#09090B] shadow-2xs" : "text-[#71717A]"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#4F46E5]" /> Live Preview
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor */}
        <div
          className={`lg:col-span-7 space-y-6 ${
            activeMobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#F4F4F5] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#09090B]">Resume Editor Workspace</h2>
                <p className="text-xs text-[#71717A]">
                  Use the ▲/▼ buttons to reorder sections. Changes automatically sync with the live preview.
                </p>
              </div>
            </div>

            <Accordion items={editorSections} defaultOpenIds={["personal", "experience"]} allowMultiple />
          </div>
        </div>

        {/* Right Column: Sticky Live Paper Preview */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-24 space-y-4 ${
            activeMobileTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
              Real-Time Paper Preview ({resolveTemplate(templateStyle).name})
            </span>
            <span className="text-[11px] text-[#059669] font-medium">
              ✓ Single-Page Recruiter Layout
            </span>
          </div>

          <LiveResumePaperPreview data={resumeData} templateStyle={templateStyle} />
        </div>
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast type={toastType} title="Resume Builder" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
          <p className="text-xs font-semibold text-[#52525B]">Loading Resume Editor...</p>
        </div>
      }
    >
      <ResumeBuilderContent />
    </Suspense>
  );
}
