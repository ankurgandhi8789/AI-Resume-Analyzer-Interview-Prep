import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  analyzeResume,
  generateQuestions,
  generateAnswer,
  deleteAnalysis,
  getHistory,
  getAnalysisById,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/analyze", protect, upload.single("resume"), analyzeResume);
router.post("/:id/questions", protect, generateQuestions);
router.post("/:id/answer", protect, generateAnswer);
router.delete("/:id", protect, deleteAnalysis);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getAnalysisById);

export default router;
