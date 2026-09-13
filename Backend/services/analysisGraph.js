import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getChatModel } from "./modelProvider.js";
import { retrieveRoleContext } from "./vectorStore.js";
import {
  SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt,
  SKILLS_SYSTEM_PROMPT, buildSkillsPrompt,
  STRENGTHS_SYSTEM_PROMPT, buildStrengthsPrompt,
  SKILL_GAPS_SYSTEM_PROMPT, buildSkillGapsPrompt,
  INTERVIEW_SYSTEM_PROMPT, buildInterviewUserPrompt,
  ANSWER_SYSTEM_PROMPT, buildAnswerPrompt,
} from "../utils/prompts.js";

const parseJSON = (raw) => {
  if (!raw) return {};
  const cleaned = String(raw).trim()
    .replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("Failed to parse JSON response:", cleaned);
    return {};
  }
};

const llmCall = async (systemPrompt, userPrompt) => {
  const model = getChatModel();
  try {
    const res = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);
    return parseJSON(res.content);
  } catch (error) {
    console.error("LLM call error:", error);
    throw error;
  }
};

/**
 * Streaming analysis — calls LLM 4 times sequentially, emitting each
 * section as an SSE event so the frontend can render progressively.
 * @param {object} params
 * @param {string} params.resumeText
 * @param {string} params.targetRole
 * @param {function} params.onSection  called with (eventName, data) after each LLM call
 */
export const runResumeAnalysisStream = async ({ resumeText, targetRole, onSection }) => {
  const ragContext = await retrieveRoleContext(
    `${targetRole || ""} ${resumeText.slice(0, 500)}`
  );
  const ctx = { resumeText, targetRole, ragContext };

  // Run all 4 sections in parallel — each emits as soon as it finishes
  const sections = [
    { event: "summary",   system: SUMMARY_SYSTEM_PROMPT,   prompt: buildSummaryPrompt(ctx) },
    { event: "skills",    system: SKILLS_SYSTEM_PROMPT,    prompt: buildSkillsPrompt(ctx) },
    { event: "strengths", system: STRENGTHS_SYSTEM_PROMPT, prompt: buildStrengthsPrompt(ctx) },
    { event: "skillGaps", system: SKILL_GAPS_SYSTEM_PROMPT, prompt: buildSkillGapsPrompt(ctx) },
  ];

  let merged = {};
  await Promise.all(
    sections.map(async ({ event, system, prompt }) => {
      const data = await llmCall(system, prompt);
      merged = { ...merged, ...data };
      onSection(event, data);
    })
  );

  return merged;
};

export const runInterviewQuestions = async ({ resumeText, targetRole }) => {
  const model = getChatModel();
  const res = await model.invoke([
    new SystemMessage(INTERVIEW_SYSTEM_PROMPT),
    new HumanMessage(buildInterviewUserPrompt({ resumeText, targetRole })),
  ]);
  return parseJSON(res.content);
};

export const runAnswerGeneration = async ({ question, category, resumeText, targetRole }) => {
  const model = getChatModel();
  const res = await model.invoke([
    new SystemMessage(ANSWER_SYSTEM_PROMPT),
    new HumanMessage(buildAnswerPrompt({ question, category, resumeText, targetRole })),
  ]);
  return String(res.content).trim();
};

// kept so history/getById routes still work
export const runResumeAnalysis = async ({ resumeText, targetRole }) => {
  let merged = {};
  await runResumeAnalysisStream({
    resumeText, targetRole,
    onSection: (_, data) => { merged = { ...merged, ...data }; },
  });
  return merged;
};
