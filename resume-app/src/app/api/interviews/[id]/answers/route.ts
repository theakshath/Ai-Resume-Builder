import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { createdResponse } from "@/lib/responses";
import { getCurrentUser } from "@/lib/auth/get-session";
import { evaluateAnswerWithAI } from "@/lib/ai/interview-evaluator";
import { saveInterviewAnswerDoc, saveInterviewEvaluationDoc, getUserInterviewsDocs } from "@/lib/firebase/firestore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/interviews/[id]/answers
 * Submits an answer text for a question, evaluates it via AI engine, and saves feedback.
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

    const body = await request.json();
    const questionId = body.question_id || body.questionId || crypto.randomUUID();
    const questionText = body.question_text || body.questionText || "Interview Question";
    const answerText = (body.answer_text || body.answerText || "").trim();
    const interviewType = body.interview_type || body.interviewType || "mixed";
    const category = body.category || "General";
    const durationSeconds = body.duration_seconds || body.durationSeconds || 0;

    // Fetch interview details to get role, experience level, and difficulty for AI context
    const interviews = await getUserInterviewsDocs(user.id);
    const session = interviews.find((i: any) => i.id === id);
    const targetRole = session?.jobRole || "Software Developer";
    const experienceLevel = session?.experienceLevel || "Entry Level";
    const difficulty = (session?.difficulty || "medium") as any;
    const jobDescriptionContext = session?.jobDescription || "";

    if (process.env.NODE_ENV === "development") {
      console.log(`[ResumeAI Interview] Submitting answer for session ${id}, question ${questionId}`);
    }

    // Evaluate candidate answer with actual AI evaluator
    const evalResult = await evaluateAnswerWithAI({
      question: questionText,
      answer: answerText,
      role: targetRole,
      experienceLevel,
      type: interviewType as any,
      category,
      difficulty,
      jobDescriptionContext,
      durationSeconds,
    });

    // Save answer and evaluation in Firestore
    const answerId = await saveInterviewAnswerDoc(user.id, id, {
      questionId,
      answerText,
      durationSeconds,
      technicalScore: evalResult.technicalScore,
      correctnessScore: evalResult.correctnessScore,
      depthScore: evalResult.depthScore,
      relevanceScore: evalResult.relevanceScore,
      clarityScore: evalResult.clarityScore,
      completenessScore: evalResult.completenessScore,
      communicationScore: evalResult.communicationScore,
      structureScore: evalResult.structureScore,
      starScore: evalResult.starScore,
      starApplicable: evalResult.starApplicable,
      isSubstantive: evalResult.isSubstantive,
      overallScore: evalResult.overallScore,
      submittedAt: new Date().toISOString(),
    });

    await saveInterviewEvaluationDoc(user.id, id, {
      questionId,
      answerId,
      evalResult,
      evaluatedAt: new Date().toISOString(),
    });

    const createdAnswer = {
      id: answerId,
      interview_id: id,
      question_id: questionId,
      answer_text: answerText,
      duration_seconds: durationSeconds,
      technical_score: evalResult.technicalScore,
      correctness_score: evalResult.correctnessScore,
      depth_score: evalResult.depthScore,
      relevance_score: evalResult.relevanceScore,
      clarity_score: evalResult.clarityScore,
      completeness_score: evalResult.completenessScore,
      communication_score: evalResult.communicationScore,
      structure_score: evalResult.structureScore,
      star_score: evalResult.starScore,
      star_applicable: evalResult.starApplicable,
      is_substantive: evalResult.isSubstantive,
      overall_score: evalResult.overallScore,
      eval_result: evalResult,
      ai_feedback: {
        strengths: evalResult.strengths,
        improvements: evalResult.improvementSuggestions.length > 0 ? evalResult.improvementSuggestions : evalResult.weaknesses,
        missing_concepts: evalResult.missingConcepts,
        summary: evalResult.feedback || evalResult.reasoningSummary,
      },
      created_at: new Date().toISOString(),
    };

    return createdResponse(createdAnswer);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ResumeAI Interview] Error saving answer evaluation:", error);
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ANSWER_SUBMISSION_FAILED",
          message: error.message || "AI evaluation temporarily unavailable. Please retry.",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}

