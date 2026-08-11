export const SUMMARY_SYSTEM_PROMPT = `You are an expert technical recruiter. Analyze the resume and return ONLY this JSON, no markdown:
{
  "summary": "2-3 sentence overview of the candidate",
  "atsScore": <0-100 integer>
}`;

export const SKILLS_SYSTEM_PROMPT = `You are an expert technical recruiter. Extract skills from the resume and return ONLY this JSON, no markdown:
{
  "skills": ["skill1", "skill2", ...]
}
Return 6-10 skills.`;

export const STRENGTHS_SYSTEM_PROMPT = `You are an expert technical recruiter. Analyze the resume and return ONLY this JSON, no markdown:
{
  "strengths": ["strength1", ...],
  "weaknesses": ["weakness1", ...]
}
Return 3-5 strengths and 3-5 weaknesses.`;

export const SKILL_GAPS_SYSTEM_PROMPT = `You are an expert technical recruiter. Identify skill gaps and return ONLY this JSON, no markdown:
{
  "skillGaps": ["gap1", ...]
}
Return 3-6 gaps relative to the target role.`;

export const INTERVIEW_SYSTEM_PROMPT = `You are an expert technical interviewer.
Return ONLY a JSON array, no markdown:
[
  { "question": "...", "category": "technical|behavioral|system-design", "difficulty": "easy|medium|hard" }
]
Return exactly 8 questions (mix of technical, behavioral, system-design) tailored to the resume and target role.`;

const base = ({ resumeText, targetRole, ragContext }) => `
TARGET ROLE: ${targetRole || "Not specified - infer from resume"}
${ragContext ? `\nROLE KNOWLEDGE:\n${ragContext}` : ""}
RESUME:
"""
${resumeText}
"""
Return ONLY the JSON described. No extra text.`;

export const buildSummaryPrompt = base;
export const buildSkillsPrompt = base;
export const buildStrengthsPrompt = base;
export const buildSkillGapsPrompt = base;

export const buildInterviewUserPrompt = ({ resumeText, targetRole }) => `
TARGET ROLE: ${targetRole || "Not specified"}
RESUME:
"""
${resumeText}
"""
Generate 8 tailored interview questions. Return ONLY the JSON array.`;

export const ANSWER_SYSTEM_PROMPT = `You are a senior software engineer and interview coach.
Give a concise, practical model answer (4-8 sentences) for the interview question based on the candidate's resume.
Return ONLY plain text — no JSON, no markdown, no bullet points.`;

export const buildAnswerPrompt = ({ question, category, resumeText, targetRole }) => `
TARGET ROLE: ${targetRole || "Not specified"}
QUESTION CATEGORY: ${category}
INTERVIEW QUESTION: ${question}
RESUME (for context):
"""
${resumeText.slice(0, 3000)}
"""
Write a model answer the candidate could give in an interview. Plain text only.`;
export const ANALYSIS_SYSTEM_PROMPT = SUMMARY_SYSTEM_PROMPT;
export const buildAnalysisUserPrompt = base;
