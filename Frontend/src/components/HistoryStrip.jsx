import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, Clock, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api.js";

export default function HistoryStrip({ currentId, onSelect }) {
  const [history, setHistory] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    api.get("/resume/history")
      .then(({ data }) => setHistory(data.analyses))
      .catch(() => {});
  }, [currentId]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/resume/${id}`);
      setHistory((prev) => prev.filter((a) => a._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (!history.length) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-2 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Clock size={14} className="text-muted" />
          Past analyses
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-2 text-[10px] font-mono text-muted">
            {history.length}
          </span>
        </span>
        <ChevronDown
          size={14}
          className={`text-muted transition-transform ${collapsed ? "-rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Scrollable list */}
            <div className="max-h-[340px] overflow-y-auto scrollbar-thin divide-y divide-border">
              <AnimatePresence>
                {history.map((a) => {
                  const isActive = a._id === currentId;
                  const score = a.result?.atsScore;
                  const scoreColor =
                    score >= 75 ? "text-teal" : score >= 50 ? "text-amber" : "text-coral";

                  return (
                    <motion.div
                      key={a._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => onSelect(a._id)}
                      className={`relative flex items-center gap-3 px-4 py-3 cursor-pointer group transition-colors
                        ${isActive ? "bg-amber/5 border-l-2 border-l-amber" : "hover:bg-surface-2 border-l-2 border-l-transparent"}`}
                    >
                      {/* Icon */}
                      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                        ${isActive ? "bg-amber/15" : "bg-surface-2"}`}>
                        <FileText size={14} className={isActive ? "text-amber" : "text-muted"} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{a.fileName}</p>
                        <p className="text-[11px] text-muted truncate">
                          {a.targetRole || "No target role"}
                        </p>
                      </div>

                      {/* Score + date */}
                      <div className="shrink-0 text-right">
                        {score != null && (
                          <p className={`text-xs font-mono font-semibold ${scoreColor}`}>
                            {score}
                          </p>
                        )}
                        <p className="text-[10px] text-muted/50">
                          {new Date(a.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short",
                          })}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => handleDelete(e, a._id)}
                        className="shrink-0 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-coral/20 transition-all ml-1"
                        aria-label="Delete"
                      >
                        <Trash2 size={12} className="text-coral" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
