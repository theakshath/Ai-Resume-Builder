import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { createdResponse, successResponse } from "@/lib/responses";
import { getCurrentUser } from "@/lib/auth/get-session";
import { parseRequestBody } from "@/lib/validations";
import { createInterviewSchema } from "@/lib/validations/interview";
import { createInterviewDoc, getUserInterviewsDocs, InterviewSessionDocument } from "@/lib/firebase/firestore";

/**
 * GET /api/interviews
 * Lists mock interview sessions belonging strictly to the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication session expired or invalid.",
            retryable: false,
          },
        },
        { status: 401 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[ResumeAI Interview] Fetching interviews for authenticated user: ${user.id}`);
    }

    const interviews = await getUserInterviewsDocs(user.id);
    return successResponse(interviews);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ResumeAI Interview] Error fetching interviews:", error);
    }
    return handleApiError(error);
  }
}

/**
 * POST /api/interviews
 * Creates a new mock interview session setup.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication session expired or invalid. Please log in.",
            retryable: false,
          },
        },
        { status: 401 }
      );
    }

    const body = await parseRequestBody(request, createInterviewSchema);

    if (process.env.NODE_ENV === "development") {
      console.log(`[ResumeAI Interview] Creating session for user: ${user.id}, role: ${body.target_role}`);
    }

    // Read raw body if possible to capture fields not in the Zod schema
    let rawBody: any = body;
    try {
      // If parseRequestBody preserved extra fields, they are in body, else we use body properties
    } catch {}

    const now = new Date().toISOString();
    
    // Explicitly provide safe defaults for optional fields per requirements
    const targetRole = rawBody.target_role?.trim() || "Software Developer";
    const experienceLevel = rawBody.experience_level?.trim() || "Entry Level";
    const interviewType = rawBody.interview_type?.trim() || "mixed";
    const difficulty = rawBody.difficulty?.trim() || "medium";
    const jobDescription = rawBody.job_description?.trim();
    const resumeId = rawBody.resume_id?.trim();

    const interviewData: InterviewSessionDocument = {
      uid: user.id,
      jobRole: targetRole,
      experienceLevel: experienceLevel,
      interviewType: interviewType,
      difficulty: difficulty,
      questionCount: rawBody.questions_count || 30,
      status: "setup",
      createdAt: now,
      ...(jobDescription ? { jobDescription } : {}),
      ...(resumeId ? { resumeId } : {}),
    };

    if (process.env.NODE_ENV === "development") {
      console.log("[ResumeAI Interview] Final sanitized payload before addDoc:", JSON.stringify(interviewData, null, 2));
    }

    // Save session in Firestore / Local Auth Storage
    const interviewId = await createInterviewDoc(user.id, interviewData);

    const createdInterview = {
      id: interviewId,
      ...interviewData,
      target_role: interviewData.jobRole,
      interview_type: interviewData.interviewType,
    };

    return createdResponse(createdInterview);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ResumeAI Interview] Error creating interview session:", error);
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERVIEW_CREATION_FAILED",
          message: "Unable to start your interview right now. Please try again.",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
