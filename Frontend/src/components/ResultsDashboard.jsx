import { useState } from "react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  ChevronDown,
  Sparkles,
  Loader2,
} from "lucide-react";
import api from "../utils/api.js";

const difficultyColor = {
  easy: "text-teal",
  medium: "text-amber",
  hard: "text-coral",
};

function ScoreGauge({ score = 0 }) {
  const data = [{ name: "score", value: score, fill: "#E8B75A" }];
  return (
    <div className="relative w-40 h-40">
      <RadialBarChart
        width={160}
        height={160}
        cx={80}
        cy={80}
        innerRadius={58}
        outerRadius={74}
        barSize={12}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background={{ fill: "#1B2740" }} dataKey="value" cornerRadius={12} />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl">{score}</span>
        <span className="text-[11px] text-muted font-mono">ATS SCORE</span>
      </div>
    </div>
  );
}

function QuestionAccordion({ questions = [], analysisId }) {
  const [open, setOpen] = useState(-1);
  const [answers, setAnswers] = useState({});   // { [index]: string }
  const [loading, setLoading] = useState({});   // { [index]: bool }

  const handleOpen = async (i) => {
    const next = open === i ? -1 : i;
    setOpen(next);
    if (next === -1 || answers[next] || loading[next]) return;

    // answer not cached yet — fetch it
    setLoading((p) => ({ ...p, [i]: true }));
    try {
      const { data } = await api.post(`/resume/${analysisId}/answer`, {
        question: questions[i].question,
        category: questions[i].category,
        questionIndex: i,
      });
      setAnswers((p) => ({ ...p, [i]: data.answer }));
    } catch {
      setAnswers((p) => ({ ...p, [i]: "Could not generate answer. Please try again." }));
    } finally {
      setLoading((p) => ({ ...p, [i]: false }));
    }
  };

  return (
    <div className="space-y-2">
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface-2 overflow-hidden">
          <button
            onClick={() => handleOpen(i)}
            className="w-full flex items-center justify-between gap-4 p-4 text-left"
          >
            <span className="text-sm">{q.question}</span>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[11px] font-mono uppercase ${difficultyColor[q.difficulty] || "text-muted"}`}>
                {q.difficulty}
              </span>
              <span className="text-[10px] font-mono text-muted/60 uppercase">{q.category}</span>
              <ChevronDown
                size={16}
                className={`text-muted transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </div>
          </button>

          {open === i && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="px-4 pb-4"
            >
              {loading[i] ? (
                <div className="flex items-center gap-2 text-muted text-sm py-2">
                  <Loader2 size={14} className="animate-spin text-amber" />
                  Generating model answer...
                </div>
              ) : (
                <div className="border-t border-border pt-3 mt-1">
                  <p className="text-[11px] font-mono text-amber uppercase mb-2">Model answer</p>
                  <p className="text-sm text-muted leading-relaxed">
                    {answers[i] || q.answer || ""}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ResultsDashboard({ result, analysisId, streamDone, onGenerateQuestions }) {
  const [loadingQ, setLoadingQ] = useState(false);
  if (!result) return null;
  const {
    summary,
    atsScore,
    skills = [],
    strengths = [],
    weaknesses = [],
    skillGaps = [],
    interviewQuestions = [],
  } = result;

  const handleGenerate = async () => {
    setLoadingQ(true);
    await onGenerateQuestions();
    setLoadingQ(false);
  };

  const Section = ({ show, children }) =>
    show ? (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {children}
      </motion.div>
    ) : (
      <div className="p-6 rounded-2xl border border-border bg-surface animate-pulse">
        <div className="h-4 w-1/3 bg-surface-2 rounded mb-4" />
        <div className="h-3 w-full bg-surface-2 rounded mb-2" />
        <div className="h-3 w-2/3 bg-surface-2 rounded" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Summary + ATS Score */}
      <Section show={!!summary}>
        <div className="p-6 md:p-8 rounded-2xl border border-border bg-surface grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <ScoreGauge score={atsScore} />
          <div>
            <h3 className="font-display text-xl mb-2">Summary</h3>
            <p className="text-muted text-sm leading-relaxed">{summary}</p>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section show={skills.length > 0}>
        <div className="p-6 md:p-8 rounded-2xl border border-border bg-surface">
          <h3 className="font-display text-xl mb-4">Extracted skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-surface-2 border border-border text-xs font-mono text-teal">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Strengths + Weaknesses */}
      <Section show={strengths.length > 0}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-surface">
            <h3 className="font-display text-xl mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-teal" size={20} /> Strengths
            </h3>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="text-sm text-muted leading-relaxed">- {s}</li>
              ))}
            </ul>
          </div>
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-surface">
            <h3 className="font-display text-xl mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber" size={20} /> Weaknesses
            </h3>
            <ul className="space-y-2">
              {weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-muted leading-relaxed">- {w}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Skill Gaps */}
      <Section show={skillGaps.length > 0}>
        <div className="p-6 md:p-8 rounded-2xl border border-border bg-surface">
          <h3 className="font-display text-xl mb-4 flex items-center gap-2">
            <TrendingDown className="text-coral" size={20} /> Skill gaps for this role
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((g) => (
              <span key={g} className="px-3 py-1.5 rounded-full bg-coral/10 border border-coral/30 text-xs font-mono text-coral">
                {g}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Interview Questions — on-demand */}
      {streamDone && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">Interview questions</h3>
              {interviewQuestions.length === 0 && (
                <button
                  onClick={handleGenerate}
                  disabled={loadingQ}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber text-ink text-sm font-medium disabled:opacity-50 hover:bg-amber-soft transition-colors"
                >
                  {loadingQ ? (
                    <><Loader2 size={14} className="animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles size={14} /> Generate questions</>
                  )}
                </button>
              )}
            </div>
            {interviewQuestions.length > 0 ? (
              <QuestionAccordion questions={interviewQuestions} analysisId={analysisId} />
            ) : !loadingQ ? (
              <p className="text-sm text-muted">Click "Generate questions" to get 8 tailored interview questions.</p>
            ) : (
              <div className="flex items-center gap-3 text-muted text-sm py-4">
                <Loader2 size={16} className="animate-spin text-amber" />
                AI is crafting your questions...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
