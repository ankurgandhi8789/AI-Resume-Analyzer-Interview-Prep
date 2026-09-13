import { extractResumeText } from "../services/resumeParser.js";
import { runResumeAnalysisStream, runInterviewQuestions, runAnswerGeneration } from "../services/analysisGraph.js";
import { getDbConnection } from "../config/db.js";
import Analysis from "../models/Analysis.js";

// POST /api/resume/analyze  — SSE stream, sections arrive one by one
export const analyzeResume = async (req, res) => {
  try {
    const db = getDbConnection();
    if (!db) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: "Service unavailable - database not connected" })}\n\n`);
      res.end();
      return;
    }

    if (!req.file) return res.status(400).json({ message: "No resume file uploaded" });

    const resumeText = await extractResumeText(req.file);
    if (!resumeText || resumeText.length < 50)
      return res.status(422).json({ message: "Could not extract enough text from this file" });

    const targetRole = req.body.targetRole || "";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (event, data) =>
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

    let mergedResult = {};

    await runResumeAnalysisStream({
      resumeText,
      targetRole,
      onSection: (event, data) => {
        mergedResult = { ...mergedResult, ...data };
        send(event, data);
      },
    });

    const saved = await Analysis.create({
      user: req.user._id,
      fileName: req.file.originalname,
      targetRole,
      resumeText,
      result: mergedResult,
    });

    send("done", { analysisId: saved._id });
    res.end();
  } catch (error) {
    console.error("Analyze resume error:", error);
    res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
    res.end();
  }
};

// POST /api/resume/:id/questions
export const generateQuestions = async (req, res) => {
  try {
    const db = getDbConnection();
    if (!db) {
      return res.status(503).json({ message: "Service unavailable - database not connected" });
    }

    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id });
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });

    const questions = await runInterviewQuestions({
      resumeText: analysis.resumeText,
      targetRole: analysis.targetRole,
    });

    analysis.result.interviewQuestions = questions;
    await analysis.save();

    res.json({ interviewQuestions: questions });
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({ message: "Failed to generate questions", error: error.message });
  }
};

// POST /api/resume/:id/answer
export const generateAnswer = async (req, res) => {
  try {
    const db = getDbConnection();
    if (!db) {
      return res.status(503).json({ message: "Service unavailable - database not connected" });
    }

    const { question, category, questionIndex } = req.body;
    if (!question) return res.status(400).json({ message: "question is required" });

    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id })
      .select("resumeText targetRole");
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });

    const answer = await runAnswerGeneration({
      question, category,
      resumeText: analysis.resumeText,
      targetRole: analysis.targetRole,
    });

    // Persist answer into the question so history loads it too
    await Analysis.updateOne(
      { _id: req.params.id, user: req.user._id },
      { $set: { [`result.interviewQuestions.${questionIndex}.answer`]: answer } }
    );

    res.json({ answer });
  } catch (error) {
    console.error("Generate answer error:", error);
    res.status(500).json({ message: "Failed to generate answer", error: error.message });
  }
};

// DELETE /api/resume/:id
export const deleteAnalysis = async (req, res) => {
  try {
    const db = getDbConnection();
    if (!db) {
      return res.status(503).json({ message: "Service unavailable - database not connected" });
    }

    const deleted = await Analysis.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Analysis not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error: error.message });
  }
};

// GET /api/resume/history
export const getHistory = async (req, res) => {
  const db = getDbConnection();
  if (!db) {
    return res.status(503).json({ message: "Service unavailable - database not connected" });
  }

  const analyses = await Analysis.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-resumeText");
  res.json({ analyses });
};

// GET /api/resume/:id
export const getAnalysisById = async (req, res) => {
  const db = getDbConnection();
  if (!db) {
    return res.status(503).json({ message: "Service unavailable - database not connected" });
  }

  const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id });
  if (!analysis) return res.status(404).json({ message: "Analysis not found" });
  res.json({ analysis });
};
