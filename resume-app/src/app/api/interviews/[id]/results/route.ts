import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { uuidSchema } from '@/lib/validations';
import { verifyMockInterviewOwnership } from '@/lib/security/resource-ownership';
import { INTERVIEW_PRACTICE_DISCLAIMER } from '@/lib/interviews/engine';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/interviews/[id]/results
 * Aggregates scores, strengths, improvement areas, AI feedback, practice topics, and practice disclaimer.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifyMockInterviewOwnership(id, user.id);

    const { data: interview, error: fetchErr } = await (supabase as any)
      .from('mock_interviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchErr || !interview) {
      throw ApiError.notFound('Mock interview session not found');
    }

    const { data: questions } = await (supabase as any)
      .from('interview_questions')
      .select('id, question, category')
      .eq('interview_id', id);

    const questionIds = (questions || []).map((q: any) => q.id);

    let answers: any[] = [];
    if (questionIds.length > 0) {
      const { data: answersData } = await (supabase as any)
        .from('interview_answers')
        .select('*')
        .in('question_id', questionIds);
      answers = answersData || [];
    }

    // Compute average dimension scores from actual answers
    const answersCount = answers.length;
    let overallScore: number | null = null;
    let technicalScore: number | null = null;
    let communicationScore: number | null = null;
    let relevanceScore: number | null = null;
    let starScore: number | null = null;

    if (answersCount > 0) {
      technicalScore = Math.round(answers.reduce((s, a) => s + (a.technical_score ?? 0), 0) / answersCount);
      communicationScore = Math.round(answers.reduce((s, a) => s + (a.communication_score ?? 0), 0) / answersCount);
      relevanceScore = Math.round(answers.reduce((s, a) => s + (a.relevance_score ?? 0), 0) / answersCount);
      
      const starAnswers = answers.filter((a) => typeof a.star_score === 'number');
      if (starAnswers.length > 0) {
        starScore = Math.round(starAnswers.reduce((s, a) => s + a.star_score, 0) / starAnswers.length);
      }

      overallScore = Math.round(answers.reduce((s, a) => s + (a.overall_score ?? 0), 0) / answersCount);
    } else if (typeof interview.overall_score === 'number') {
      overallScore = interview.overall_score;
    }

    // Aggregate strengths, improvements, and practice areas
    const strengthsSet = new Set<string>();
    const improvementsSet = new Set<string>();
    const missingConceptsSet = new Set<string>();

    answers.forEach((a) => {
      const fb = a.ai_feedback || a.eval_result || {};
      if (Array.isArray(fb.strengths)) fb.strengths.forEach((s: string) => strengthsSet.add(s));
      if (Array.isArray(fb.improvements)) fb.improvements.forEach((i: string) => improvementsSet.add(i));
      if (Array.isArray(fb.weaknesses)) fb.weaknesses.forEach((w: string) => improvementsSet.add(w));
      if (Array.isArray(fb.missing_concepts)) fb.missing_concepts.forEach((m: string) => missingConceptsSet.add(m));
      if (Array.isArray(fb.missingConcepts)) fb.missingConcepts.forEach((m: string) => missingConceptsSet.add(m));
    });

    return successResponse({
      interview_id: id,
      status: interview.status,
      target_role: interview.target_role || interview.jobRole,
      interview_type: interview.interview_type || interview.interviewType,
      difficulty: interview.difficulty,
      scores: {
        overall_score: overallScore,
        technical_score: technicalScore,
        communication_score: communicationScore,
        relevance_score: relevanceScore,
        star_score: starScore,
      },
      strengths: Array.from(strengthsSet),
      areas_for_improvement: Array.from(improvementsSet),
      missing_concepts: Array.from(missingConceptsSet),
      submitted_answers_count: answersCount,
      total_questions_count: questions?.length || 0,
      answers,
      disclaimer: INTERVIEW_PRACTICE_DISCLAIMER,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
