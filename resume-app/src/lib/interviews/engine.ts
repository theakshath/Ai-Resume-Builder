export const INTERVIEW_PRACTICE_DISCLAIMER =
  "Interview scores and feedback are intended solely as AI-assisted practice metrics for career preparation. They do not represent an objective measurement of candidates' true personality, intelligence, or hiring eligibility.";

export interface InterviewQuestionItem {
  id?: string;
  question: string;
  category: string;
  order: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  expected_topics?: string[];
  evaluation_criteria?: string;
  is_follow_up?: boolean;
  time_limit_seconds?: number;
}

export interface AnswerEvaluationResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  relevanceScore: number;
  correctnessScore?: number;
  depthScore?: number;
  clarityScore?: number;
  completenessScore?: number;
  structureScore?: number;
  starApplicable?: boolean;
  starScore?: number;
  isSubstantive?: boolean;
  starAnalysis?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
  confidenceScore?: number;
  feedback?: any;
  strengths?: string[];
  improvements?: string[];
  weaknesses?: string[];
  missingConcepts?: string[];
  improvementSuggestions?: string[];
  suggestedAnswer?: string;
  technicalRelevance?: boolean;
  resumeContextUsed?: boolean;
}

/**
 * Generates personalized primary interview questions.
 */
export function generateInterviewQuestions(
  targetRole: string,
  interviewType: 'technical' | 'behavioral' | 'hr' | 'mixed' = 'mixed',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  totalQuestionsCount: number = 30,
  resumeText: string = '',
  jobDescriptionText: string = ''
): InterviewQuestionItem[] {
  const count = Math.max(30, totalQuestionsCount || 30);
  const questions: InterviewQuestionItem[] = [];

  const detectedSkills = extractSkillsFromText(resumeText + ' ' + jobDescriptionText);
  const skillA = detectedSkills[0] || 'software architecture';
  const skillB = detectedSkills[1] || 'state management';
  const skillC = detectedSkills[2] || 'database optimization';

  questions.push({
    question: `Welcome to your AI Mock Interview! To start off, please give me a brief overview of your background as a ${targetRole} and what drew you to this role.`,
    category: 'Introduction',
    order: 1,
    difficulty,
    expected_topics: ['Career summary', 'Key qualifications', 'Role alignment'],
    evaluation_criteria: 'Evaluates concise self-introduction, clarity of career narrative, and professional enthusiasm.',
    time_limit_seconds: 180,
  });

  questions.push({
    question: `What do you consider your greatest technical strength as a ${targetRole}, and how has it influenced your recent achievements?`,
    category: 'Introduction',
    order: 2,
    difficulty,
    expected_topics: ['Core competencies', 'Concrete example', 'Impact'],
    evaluation_criteria: 'Evaluates self-awareness, alignment of strengths to role, and ability to highlight real impact.',
    time_limit_seconds: 180,
  });

  questions.push({
    question: `Looking at your background, tell me about a significant project where you utilized ${skillA}. What was your specific architectural contribution?`,
    category: 'Resume & Projects',
    order: 3,
    difficulty,
    expected_topics: [skillA, 'Ownership', 'Architecture decisions'],
    evaluation_criteria: 'Evaluates deep project ownership, clarity of technical role, and explanation of design decisions.',
    time_limit_seconds: 240,
  });

  questions.push({
    question: `Can you describe a technical obstacle you encountered while working with ${skillB} and how you diagnosed and resolved it?`,
    category: 'Resume & Projects',
    order: 4,
    difficulty,
    expected_topics: [skillB, 'Root cause analysis', 'Debugging', 'Resolution'],
    evaluation_criteria: 'Evaluates systematic problem-solving skills, debugging strategy, and technical perseverance.',
    time_limit_seconds: 240,
  });

  questions.push({
    question: `How did you ensure security, data integrity, and high performance in the applications or systems you built previously?`,
    category: 'Resume & Projects',
    order: 5,
    difficulty,
    expected_topics: ['Security best practices', 'Optimization', 'Data validation'],
    evaluation_criteria: 'Evaluates awareness of production concerns including performance tuning and security hardening.',
    time_limit_seconds: 240,
  });

  questions.push({
    question: `How do you approach designing a scalable REST or GraphQL API for a high-traffic ${targetRole} application?`,
    category: 'Technical',
    order: 6,
    difficulty,
    expected_topics: ['API design', 'Versioning', 'Rate limiting', 'Caching'],
    evaluation_criteria: 'Evaluates system design principles, RESTful constraints, and scalability patterns.',
    time_limit_seconds: 300,
  });

  questions.push({
    question: `Explain how state management, asynchronous operations, and event loops work under the hood in modern JavaScript/TypeScript or Python applications.`,
    category: 'Technical',
    order: 7,
    difficulty,
    expected_topics: ['Asynchronous execution', 'Event loop', 'Promises/Async-Await'],
    evaluation_criteria: 'Evaluates core language fundamentals, concurrency mechanisms, and non-blocking execution.',
    time_limit_seconds: 300,
  });

  questions.push({
    question: `Describe a situation where you had a strong technical disagreement with a team member. How did you handle it and what was the outcome?`,
    category: 'Behavioral',
    order: 8,
    difficulty,
    expected_topics: ['Conflict resolution', 'Empathy', 'Data-driven compromise'],
    evaluation_criteria: 'Evaluates interpersonal skills, professional dialogue, and objective decision-making (STAR method).',
    time_limit_seconds: 240,
  });

  questions.push({
    question: `Tell me about a time when you missed a deadline or made a critical mistake in production. What did you learn and implement to prevent recurrence?`,
    category: 'Behavioral',
    order: 9,
    difficulty,
    expected_topics: ['Accountability', 'Post-mortem', 'Process improvement'],
    evaluation_criteria: 'Evaluates ownership of mistakes, blameless post-mortem mindset, and systemic fix creation.',
    time_limit_seconds: 240,
  });

  questions.push({
    question: `Imagine a critical API endpoint starts returning 500 errors in production during peak traffic. Walk me through your step-by-step incident response plan.`,
    category: 'Situational',
    order: 10,
    difficulty,
    expected_topics: ['Incident response', 'Log inspection', 'Rollback/Hotfix', 'Communication'],
    evaluation_criteria: 'Evaluates composure under pressure, triage prioritization, and structured incident management.',
    time_limit_seconds: 270,
  });

  for (let i = 11; i <= count; i++) {
    questions.push({
      question: `Interview Question ${i} for ${targetRole}: Explain your approach to maintaining high code quality, automated testing, and scalable architecture when delivering features under tight deadlines.`,
      category: i % 2 === 0 ? 'Technical' : 'Behavioral',
      order: i,
      difficulty,
      expected_topics: ['Quality assurance', 'Testing', 'Architecture'],
      evaluation_criteria: 'Evaluates depth of engineering practice and trade-off judgment.',
      time_limit_seconds: 240,
    });
  }

  return questions.slice(0, count);
}

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
    'GraphQL', 'REST API', 'PostgreSQL', 'Supabase', 'MongoDB', 'Docker',
    'Kubernetes', 'AWS', 'Tailwind CSS', 'Redux', 'Jest', 'CI/CD',
    'System Architecture', 'Microservices', 'Redis', 'SQL'
  ];

  const matched = commonSkills.filter(skill =>
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
  );

  return matched.length > 0 ? matched : ['React', 'TypeScript', 'Node.js'];
}

/**
 * Evaluates candidate's answer using strict heuristic guidelines.
 */
export function evaluateInterviewAnswer(
  questionText: string,
  candidateAnswerText: string,
  interviewType: 'technical' | 'behavioral' | 'hr' | 'mixed' = 'mixed'
): AnswerEvaluationResult {
  const text = (candidateAnswerText || '').trim();
  const lowerText = text.toLowerCase();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  const nonSubstantivePhrases = [
    "i don't know",
    "i dont know",
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
    "n/a"
  ];

  const isTrivial =
    wordCount === 0 ||
    nonSubstantivePhrases.includes(lowerText) ||
    (wordCount <= 2 && nonSubstantivePhrases.some(p => lowerText.includes(p)));

  if (isTrivial) {
    return {
      overallScore: 5,
      technicalScore: 0,
      communicationScore: 0,
      relevanceScore: 0,
      correctnessScore: 0,
      depthScore: 0,
      clarityScore: 0,
      completenessScore: 0,
      structureScore: 0,
      starApplicable: false,
      isSubstantive: false,
      confidenceScore: 0,
      starAnalysis: { situation: false, task: false, action: false, result: false },
      strengths: [],
      improvements: ['The candidate did not provide a substantive answer.'],
      weaknesses: ['The candidate did not provide a substantive answer.'],
      missingConcepts: ['All relevant technical concepts and explanations for this question.'],
      improvementSuggestions: ['Provide a complete and detailed answer.'],
      suggestedAnswer: 'Provide a structured response covering key technical concepts or STAR examples.',
      technicalRelevance: false,
      resumeContextUsed: false,
      feedback: {
        strengths: [],
        improvements: ['The candidate did not provide a substantive answer.'],
        summary: 'The candidate did not provide a substantive answer.',
        practice_areas: ['Substantive Explanations', 'STAR Method Structuring', 'Technical Concepts']
      }
    };
  }

  // Communication metrics
  const fillerRegex = /\b(um|uh|like|you know|actually|basically|so|i mean|honestly)\b/gi;
  const fillerMatches = text.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;

  const hasSituation = /situation|context|background|project|when|at my|role/i.test(text);
  const hasTask = /task|goal|objective|needed to|required to|challenge/i.test(text);
  const hasAction = /action|built|designed|implemented|led|created|developed|architected|resolved|solved|executed/i.test(text);
  const hasResult = /result|outcome|metric|boosted|increased|decreased|cut|reduced|achieved|percent|%|\$/i.test(text);

  const isBehavioral = interviewType === 'behavioral';
  const starCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  const starScore = isBehavioral ? Math.min(100, starCount * 25) : undefined;

  // Technical term density
  const techTermsCount = (text.match(/react|typescript|node|sql|api|system|architecture|design|performance|git|ci\/cd|cloud|aws|docker|database|state|async|component|security|wcag|scale/g) || []).length;

  const relevanceScore = techTermsCount > 0 ? Math.min(100, 40 + techTermsCount * 15) : Math.min(60, wordCount * 2);
  const technicalScore = interviewType === 'technical' ? Math.min(100, techTermsCount * 20 + Math.min(wordCount, 30)) : Math.min(80, techTermsCount * 15);
  const communicationScore = Math.min(100, Math.max(10, Math.min(wordCount * 2, 80) - fillerCount * 5));

  const overallScore = Math.round(
    technicalScore * 0.4 +
    communicationScore * 0.3 +
    relevanceScore * 0.3
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hasAction) strengths.push('Clear explanation of personal action and technical implementation.');
  if (hasResult) strengths.push('Included quantifiable results and project outcomes.');
  if (techTermsCount >= 2) strengths.push('Effective usage of role-relevant technical vocabulary.');

  if (!hasResult) improvements.push('Add specific quantifiable outcomes (e.g. "improved speed by 30%").');
  if (fillerCount >= 2) improvements.push(`Reduce filler words (${fillerCount} detected).`);
  if (wordCount < 20) improvements.push('Expand answer with further technical depth and architectural reasoning.');

  return {
    technicalScore,
    communicationScore,
    relevanceScore,
    overallScore,
    starApplicable: isBehavioral,
    starScore,
    isSubstantive: true,
    starAnalysis: {
      situation: hasSituation,
      task: hasTask,
      action: hasAction,
      result: hasResult,
    },
    strengths,
    improvements,
    weaknesses: improvements,
    missingConcepts: wordCount < 20 ? ['More detailed architectural explanations'] : [],
    improvementSuggestions: improvements,
    suggestedAnswer: `Provide a detailed response covering key concepts, actions taken, and measurable results.`,
    technicalRelevance: techTermsCount > 0,
    resumeContextUsed: true,
    feedback: {
      strengths,
      improvements,
      summary: `Answer evaluated based on transcript details provided.`,
      practice_areas: ['STAR Method Structuring', 'Quantifiable Impact Metrics', 'System Architecture Trade-offs'],
    },
  };
}
