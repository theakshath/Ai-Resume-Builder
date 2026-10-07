import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { successResponse } from "@/lib/responses";
import { getCurrentUser } from "@/lib/auth/get-session";
import { generateInterviewQuestions } from "@/lib/interviews/engine";
import { saveInterviewQuestionDoc } from "@/lib/firebase/firestore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/interviews/[id]/start
 * Initializes interview session, generates 30+ structured primary questions, and updates status to 'in_progress'.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid interview session identifier.",
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

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

    if (process.env.NODE_ENV === "development") {
      console.log(`[ResumeAI Interview] Starting session ${id} for user ${user.id}`);
    }

    // Read payload parameters if passed in body
    let bodyPayload: any = {};
    try {
      bodyPayload = await request.json();
    } catch {}

    const targetRole = bodyPayload.target_role || bodyPayload.jobRole || "Software Developer";
    const interviewType = bodyPayload.interview_type || bodyPayload.interviewType || "mixed";
    const difficulty = bodyPayload.difficulty || "medium";
    const questionCount = bodyPayload.question_count || bodyPayload.questionCount || 30;
    const resumeText = bodyPayload.resume_text || bodyPayload.resumeText || "";
    const jobDescriptionText = bodyPayload.job_description || bodyPayload.jobDescription || "";

    // Generate 30+ personalized questions
    const generatedQuestions = generateInterviewQuestions(
      targetRole,
      interviewType as any,
      difficulty as any,
      questionCount,
      resumeText,
      jobDescriptionText
    );

    // Save questions in Firestore
    const createdQuestions = await Promise.all(
      generatedQuestions.map(async (q) => {
        const qId = await saveInterviewQuestionDoc(user.id, id, {
          interviewId: id,
          question: q.question,
          category: q.category,
          questionOrder: q.order,
          difficulty: q.difficulty,
        });

        return {
          id: qId,
          interview_id: id,
          question: q.question,
          category: q.category,
          question_order: q.order,
          difficulty: q.difficulty,
          time_limit_seconds: q.time_limit_seconds || 180,
          created_at: new Date().toISOString(),
        };
      })
    );

    const updatedInterview = {
      id,
      user_id: user.id,
      target_role: targetRole,
      interview_type: interviewType,
      difficulty,
      status: "in_progress",
      question_count: createdQuestions.length,
      started_at: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === "development") {
      console.log(`[ResumeAI Interview] Successfully generated ${createdQuestions.length} questions for session ${id}`);
    }

    return successResponse({
      interview: updatedInterview,
      questions: createdQuestions || [],
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ResumeAI Interview] Error starting interview session:", error);
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERVIEW_START_FAILED",
          message: "Unable to start your interview right now. Please try again.",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
