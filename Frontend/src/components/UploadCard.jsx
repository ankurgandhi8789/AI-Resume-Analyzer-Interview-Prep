import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";

export default function UploadCard({ onAnalyze, isAnalyzing }) {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const ok = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(f.type);
    if (!ok) { return; }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragActive ? "border-amber bg-amber/5" : "border-border hover:border-amber/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {file ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <FileText className="text-amber shrink-0" size={16} />
            <span className="text-xs truncate max-w-[160px]">{file.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              aria-label="Remove file"
              className="p-1 rounded-full hover:bg-surface-2 shrink-0"
            >
              <X size={12} className="text-muted" />
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            <UploadCloud size={24} />
            <p className="text-xs">Drop resume here or <span className="text-amber">browse</span></p>
            <p className="text-[11px] text-muted/50">PDF or DOCX · max 5 MB</p>
          </div>
        )}
      </div>

      {/* Target role */}
      <div className="mt-4">
        <label className="text-xs text-muted mb-1.5 block">
          Target role <span className="text-muted/50">(optional)</span>
        </label>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Full Stack Developer"
          className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-sm placeholder:text-muted/50 focus:border-amber outline-none"
        />
      </div>

      {/* Submit */}
      <button
        disabled={!file || isAnalyzing}
        onClick={() => onAnalyze({ file, targetRole })}
        className="mt-4 w-full py-2.5 rounded-xl bg-amber text-ink text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-soft transition-colors flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
        ) : (
          "Analyze resume"
        )}
      </button>
    </div>
  );
}
