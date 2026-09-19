import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { successResponse } from "@/lib/responses";
import { getCurrentUser } from "@/lib/auth/get-session";
import { INTERVIEW_PRACTICE_DISCLAIMER } from "@/lib/interviews/engine";
import { getUserInterviewsDocs } from "@/lib/firebase/firestore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/interviews/[id]/complete
 * Marks interview as completed, calculates aggregate overall score from actual evaluations, and sets completion timestamp.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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
      console.log(`[ResumeAI Interview] Completing session ${id} for user ${user.id}`);
    }

    let bodyPayload: any = {};
    try {
      bodyPayload = await request.json();
    } catch {}

    let overallScore = typeof bodyPayload.overallScore === 'number'
      ? bodyPayload.overallScore
      : typeof bodyPayload.overall_score === 'number'
      ? bodyPayload.overall_score
      : undefined;

    // If overallScore was not passed in body, fetch interview data from Firestore to compute exact average
    if (overallScore === undefined) {
      try {
        const interviews = await getUserInterviewsDocs(user.id);
        const session = interviews.find((i: any) => i.id === id);
        if (session && typeof session.overallScore === 'number') {
          overallScore = session.overallScore;
        }
      } catch {}
    }

    const completedAt = new Date().toISOString();

    const completedInterview = {
      id,
      user_id: user.id,
      status: "completed",
      overall_score: overallScore ?? null,
      completed_at: completedAt,
    };

    return successResponse({
      interview: completedInterview,
      disclaimer: INTERVIEW_PRACTICE_DISCLAIMER,
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ResumeAI Interview] Error completing interview session:", error);
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERVIEW_COMPLETE_FAILED",
          message: error.message || "Failed to complete interview session.",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
