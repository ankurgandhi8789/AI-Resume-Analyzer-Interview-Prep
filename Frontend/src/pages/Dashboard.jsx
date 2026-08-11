import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import UploadCard from "../components/UploadCard.jsx";
import LoadingScanner from "../components/LoadingScanner.jsx";
import ResultsDashboard from "../components/ResultsDashboard.jsx";
import HistoryStrip from "../components/HistoryStrip.jsx";
import api from "../utils/api.js";
import { ScanLine } from "lucide-react";

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [streamDone, setStreamDone] = useState(false);

  const handleAnalyze = async ({ file, targetRole }) => {
    setIsAnalyzing(true);
    setResult(null);
    setAnalysisId(null);
    setStreamDone(false);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", targetRole);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "/api"}/resume/analyze`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Analysis failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop();

        for (const part of parts) {
          const eventMatch = part.match(/^event: (\w+)/);
          const dataMatch = part.match(/^data: (.+)/m);
          if (!eventMatch || !dataMatch) continue;

          const event = eventMatch[1];
          const data = JSON.parse(dataMatch[1]);

          if (event === "done") {
            setAnalysisId(data.analysisId);
            setStreamDone(true);
            setIsAnalyzing(false);
            toast.success("Analysis complete");
          } else if (event === "error") {
            throw new Error(data.message);
          } else {
            setResult((prev) => ({ ...(prev || {}), ...data }));
            if (event === "summary") setIsAnalyzing(false);
          }
        }
      }
    } catch (err) {
      toast.error(err.message || "Analysis failed, please try again");
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistory = async (id) => {
    try {
      const { data } = await api.get(`/resume/${id}`);
      setResult(data.analysis.result);
      setAnalysisId(id);
      setStreamDone(true);
    } catch {
      toast.error("Failed to load analysis");
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      const { data } = await api.post(`/resume/${analysisId}/questions`);
      setResult((prev) => ({ ...prev, interviewQuestions: data.interviewQuestions }));
      toast.success("Interview questions ready");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate questions");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 lg:px-10 py-8">

        {/* ── Desktop: 2-col │ Mobile: stack ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT PANEL ── */}
          <aside className="w-full lg:w-[380px] xl:w-[420px] lg:sticky lg:top-24 flex flex-col gap-6">

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ScanLine size={20} className="text-amber" />
                <h1 className="font-display text-2xl">Resume Analyzer</h1>
              </div>
              <p className="text-muted text-sm">
                Upload a resume, pick a target role, get instant AI feedback.
              </p>
            </div>

            {/* Upload card */}
            <UploadCard onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

            {/* History */}
            <HistoryStrip currentId={analysisId} onSelect={handleSelectHistory} />
          </aside>

          {/* ── RIGHT PANEL ── */}
          <section className="flex-1 min-w-0">
            {!result && !isAnalyzing && (
              <EmptyState />
            )}
            {isAnalyzing && !result && <LoadingScanner />}
            {result && (
              <ResultsDashboard
                result={result}
                analysisId={analysisId}
                streamDone={streamDone}
                onGenerateQuestions={handleGenerateQuestions}
              />
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-surface/40 p-12">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-5">
        <ScanLine size={28} className="text-amber/60" />
      </div>
      <p className="font-display text-xl mb-2 text-ivory/80">No analysis yet</p>
      <p className="text-muted text-sm max-w-xs">
        Upload your resume on the left and hit <span className="text-amber">Analyze resume</span> to see your full AI breakdown here.
      </p>
    </div>
  );
}
