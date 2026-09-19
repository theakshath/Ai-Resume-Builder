import { z } from "zod";
import { getAIProvider } from "./provider";

// Types for evaluation
export interface EvaluationInput {
  question: string;
  answer: string;
  role: string;
  experienceLevel?: string;
  type: 'technical' | 'behavioral' | 'hr' | 'mixed' | string;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard' | string;
  resumeContextUsed?: boolean;
  resumeText?: string;
  jobDescriptionContext?: string;
  durationSeconds?: number;
}

export interface EvaluationResult {
  overallScore: number;
  technicalScore: number;
  correctnessScore: number;
  depthScore: number;
  relevanceScore: number;
  clarityScore: number;
  completenessScore: number;
  communicationScore: number;
  structureScore: number;
  starScore?: number;
  starApplicable: boolean;
  isSubstantive: boolean;
  starAnalysis?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  improvementSuggestions: string[];
  feedback?: string;
  reasoningSummary?: string;
  speakingWpm?: number;
  fillerWordCount?: number;
  pauseCount?: number;
  speechDataAvailable?: boolean;
}

// Zod Schema for Structured Evaluation Result
export const EvaluationResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  correctnessScore: z.number().min(0).max(100),
  depthScore: z.number().min(0).max(100),
  relevanceScore: z.number().min(0).max(100),
  clarityScore: z.number().min(0).max(100),
  completenessScore: z.number().min(0).max(100),
  communicationScore: z.number().min(0).max(100),
  structureScore: z.number().min(0).max(100),
  starScore: z.number().min(0).max(100).optional(),
  starApplicable: z.boolean(),
  isSubstantive: z.boolean(),
  starAnalysis: z.object({
    situation: z.boolean(),
    task: z.boolean(),
    action: z.boolean(),
    result: z.boolean(),
  }).optional(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingConcepts: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
  feedback: z.string().optional(),
  reasoningSummary: z.string().optional(),
  speakingWpm: z.number().optional(),
  fillerWordCount: z.number().optional(),
  pauseCount: z.number().optional(),
  speechDataAvailable: z.boolean().optional(),
});

/**
 * Validates whether an answer is substantive or trivial/empty.
 */
export function isSubstantiveAnswer(answer: string): boolean {
  const text = (answer || '').trim().toLowerCase();
  if (!text) return false;

  const nonSubstantivePhrases = [
    "i don't know",
    "i dont know",
    "i don't know the answer",
    "i dont know the answer",
    "idk",
    "skip",
    "pass",
    "no idea",
    "i don't understand",
    "i dont understand",
    "no answer",
    "nothing",
    "no comment",
    "na",
    "n/a",
    "dunno"
  ];

  if (nonSubstantivePhrases.includes(text)) return false;

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 2) {
    const singleWordAllowed = ["yes", "no", "maybe", "true", "false"];
    if (words.length === 1 && !singleWordAllowed.includes(words[0])) {
      return false;
    }
    if (words.length <= 2 && nonSubstantivePhrases.some(p => text.includes(p))) {
      return false;
    }
  }

  return true;
}

/**
 * Returns a low evaluation result for non-substantive answers without calling AI.
 */
export function getNonSubstantiveEvaluation(): EvaluationResult {
  return {
    overallScore: 5,
    technicalScore: 0,
    correctnessScore: 0,
    depthScore: 0,
    relevanceScore: 0,
    clarityScore: 0,
    completenessScore: 0,
    communicationScore: 0,
    structureScore: 0,
    starApplicable: false,
    isSubstantive: false,
    strengths: [],
    weaknesses: ["The candidate did not provide a substantive answer."],
    missingConcepts: ["All core concepts, definitions, and technical details for this question."],
    improvementSuggestions: ["Provide a complete, detailed response addressing the question asked."],
    feedback: "The candidate did not provide a substantive answer.",
    reasoningSummary: "No meaningful answer text was provided for evaluation.",
    speechDataAvailable: false,
  };
}

/**
 * Builds Gemini evaluation prompt containing exact candidate answer, role, rubrics, and JSON schema.
 */
export function buildEvaluationPrompt(input: EvaluationInput): string {
  const cat = (input.category || '').toLowerCase();
  const type = (input.type || '').toLowerCase();

  const isBehavioral = type === 'behavioral' || cat.includes('behavioral');
  const isTechnical = type === 'technical' || cat.includes('technical') || cat.includes('projects') || cat.includes('situational');

  const resumeCtx = input.resumeText
    ? `Resume Context: ${input.resumeText.slice(0, 400)}`
    : input.resumeContextUsed
    ? 'Resume Context: Software developer background provided.'
    : 'No resume context provided.';

  const jdCtx = input.jobDescriptionContext
    ? `Job Description: ${input.jobDescriptionContext.slice(0, 400)}`
    : 'No job description provided.';

  let rubricInstructions = '';
  if (isBehavioral) {
    rubricInstructions = `BEHAVIORAL RUBRIC (STAR Applicable):
- Situation (0-15): Context & background provided?
- Task (0-15): Clear objective or challenge?
- Action (0-20): Personal technical actions explained?
- Result (0-20): Quantifiable metric or outcome?
- Relevance (0-20): Directly answers the prompt?
- Clarity (0-10): Clear structure and narrative flow?
Set starApplicable = true. Calculate starScore (0-100) based on Situation + Task + Action + Result fulfillment.`;
  } else if (isTechnical) {
    rubricInstructions = `TECHNICAL RUBRIC (STAR Not Applicable):
- Technical Correctness (0-25): Accurate facts & concepts?
- Technical Depth (0-20): Deep architectural understanding vs surface level?
- Relevance (0-20): Addresses the specific question asked?
- Problem-Solving / Accuracy (0-15): Practical engineering logic?
- Clarity (0-10): Clear explanation?
- Completeness (0-10): Thorough coverage?
Set starApplicable = false. Set starScore = null.`;
  } else {
    rubricInstructions = `GENERAL RUBRIC (STAR Not Applicable):
- Relevance (0-30): Directly addresses the prompt?
- Clarity (0-20): Well-structured answer?
- Completeness (0-20): Covers key expected points?
- Confidence/Communication (0-15): Clear professional phrasing?
- Specificity (0-15): Concrete details vs vague statements?
Set starApplicable = false. Set starScore = null.`;
  }

  return `
EVALUATE CANDIDATE INTERVIEW ANSWER STRICTLY
============================================
Job Role: ${input.role}
Experience Level: ${input.experienceLevel || 'Not specified'}
Interview Type: ${input.type}
Question Category: ${input.category || 'General'}
Difficulty: ${input.difficulty}
${resumeCtx}
${jdCtx}

QUESTION:
"${input.question}"

CANDIDATE ANSWER (TRANSCRIPT):
"${input.answer}"

STRICT EVALUATION INSTRUCTIONS:
1. Evaluate ONLY the candidate's actual answer text given above.
2. NEVER assume the candidate said something that is not in the transcript.
3. Do NOT infer candidate knowledge from their resume alone.
4. If the candidate answer is UNRELATED to the question (e.g. talking about pizza for a programming question), set relevanceScore to 0-10 and overallScore to 0-15.
5. Use the following RUBRIC based on question category:

${rubricInstructions}

Return ONLY a valid JSON object with NO markdown or extra text matching this exact schema:
{
  "overallScore": number (0-100),
  "technicalScore": number (0-100),
  "correctnessScore": number (0-100),
  "depthScore": number (0-100),
  "relevanceScore": number (0-100),
  "clarityScore": number (0-100),
  "completenessScore": number (0-100),
  "communicationScore": number (0-100),
  "structureScore": number (0-100),
  "starApplicable": boolean,
  "starScore": number or null (0-100 if starApplicable is true, null if false),
  "starAnalysis": { "situation": boolean, "task": boolean, "action": boolean, "result": boolean },
  "isSubstantive": true,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missingConcepts": ["string"],
  "improvementSuggestions": ["string"],
  "feedback": "string concise evaluation summary",
  "reasoningSummary": "string explanation of why this score was awarded"
}
`;
}

/**
 * Calculates speech metrics from actual transcript text and elapsed seconds.
 */
export function calculateSpeechMetrics(text: string, durationSeconds?: number) {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return {
      wordCount: 0,
      speakingWpm: undefined,
      fillerWordCount: 0,
      pauseCount: 0,
      speechDataAvailable: false,
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const durationMin = durationSeconds && durationSeconds > 0 ? durationSeconds / 60 : undefined;
  const speakingWpm = durationMin ? Math.round(wordCount / durationMin) : undefined;

  const fillerRegex = /\b(um|uh|like|you know|actually|basically|so|i mean|honestly)\b/gi;
  const fillerMatches = trimmed.match(fillerRegex) || [];
  const fillerWordCount = fillerMatches.length;

  const pauseCount = (trimmed.match(/[,;:.!?]\s+/g) || []).length;

  return {
    wordCount,
    speakingWpm,
    fillerWordCount,
    pauseCount,
    speechDataAvailable: true,
  };
}

/**
 * Evaluates candidate's answer using the configured AI provider.
 * Throws error if AI evaluation fails or is unavailable.
 */
export async function evaluateAnswerWithAI(input: EvaluationInput): Promise<EvaluationResult> {
  const text = (input.answer || '').trim();

  // 1. Check if answer is substantive
  if (!isSubstantiveAnswer(text)) {
    const nonSub = getNonSubstantiveEvaluation();
    const speech = calculateSpeechMetrics(text, input.durationSeconds);
    return {
      ...nonSub,
      speakingWpm: speech.speakingWpm,
      fillerWordCount: speech.fillerWordCount,
      pauseCount: speech.pauseCount,
      speechDataAvailable: speech.speechDataAvailable,
    };
  }

  // 2. Call AI Provider for genuine evaluation
  const provider = getAIProvider();
  const prompt = buildEvaluationPrompt(input);

  try {
    const aiResponse = await provider.generateText(prompt, { temperature: 0.2, maxTokens: 1200 });

    let jsonText = aiResponse.trim();
    const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonText);

    const speech = calculateSpeechMetrics(text, input.durationSeconds);

    const cat = (input.category || '').toLowerCase();
    const type = (input.type || '').toLowerCase();
    const isBehavioral = type === 'behavioral' || cat.includes('behavioral');

    const result: EvaluationResult = {
      overallScore: Math.min(100, Math.max(0, Math.round(parsed.overallScore ?? 0))),
      technicalScore: Math.min(100, Math.max(0, Math.round(parsed.technicalScore ?? 0))),
      correctnessScore: Math.min(100, Math.max(0, Math.round(parsed.correctnessScore ?? 0))),
      depthScore: Math.min(100, Math.max(0, Math.round(parsed.depthScore ?? 0))),
      relevanceScore: Math.min(100, Math.max(0, Math.round(parsed.relevanceScore ?? 0))),
      clarityScore: Math.min(100, Math.max(0, Math.round(parsed.clarityScore ?? 0))),
      completenessScore: Math.min(100, Math.max(0, Math.round(parsed.completenessScore ?? 0))),
      communicationScore: Math.min(100, Math.max(0, Math.round(parsed.communicationScore ?? 0))),
      structureScore: Math.min(100, Math.max(0, Math.round(parsed.structureScore ?? 0))),
      starApplicable: parsed.starApplicable ?? isBehavioral,
      starScore: (parsed.starApplicable ?? isBehavioral) && typeof parsed.starScore === 'number'
        ? Math.min(100, Math.max(0, Math.round(parsed.starScore)))
        : undefined,
      starAnalysis: parsed.starAnalysis || {
        situation: /situation|context|background/i.test(text),
        task: /task|goal|objective/i.test(text),
        action: /action|built|designed|implemented|led/i.test(text),
        result: /result|outcome|metric|boosted|increased|reduced/i.test(text),
      },
      isSubstantive: true,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
      improvementSuggestions: Array.isArray(parsed.improvementSuggestions) ? parsed.improvementSuggestions : [],
      feedback: parsed.feedback || parsed.reasoningSummary || "AI evaluation completed.",
      reasoningSummary: parsed.reasoningSummary || parsed.feedback || "",
      speakingWpm: speech.speakingWpm,
      fillerWordCount: speech.fillerWordCount,
      pauseCount: speech.pauseCount,
      speechDataAvailable: speech.speechDataAvailable,
    };

    return EvaluationResultSchema.parse(result);
  } catch (err: any) {
    console.error("[evaluateAnswerWithAI] Error evaluating answer:", err);
    throw new Error("AI evaluation temporarily unavailable. Please retry.");
  }
}