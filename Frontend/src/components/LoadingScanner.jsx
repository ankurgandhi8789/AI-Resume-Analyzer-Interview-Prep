import { motion } from "framer-motion";

const messages = [
  "Extracting text from your resume...",
  "Retrieving role expectations...",
  "Scoring skills against the target role...",
  "Drafting interview questions...",
];

export default function LoadingScanner() {
  return (
    <div className="p-10 rounded-2xl border border-border bg-surface flex flex-col items-center text-center">
      <div className="relative w-40 h-52 rounded-lg bg-surface-2 border border-border overflow-hidden mb-6">
        <motion.div
          className="absolute left-0 right-0 h-16"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(232,183,90,0.4), transparent)",
          }}
          animate={{ top: ["-10%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="p-4 space-y-2">
          <div className="w-3/4 h-2 rounded bg-ivory/10" />
          <div className="w-full h-2 rounded bg-ivory/10" />
          <div className="w-2/3 h-2 rounded bg-ivory/10" />
          <div className="w-1/2 h-2 rounded bg-ivory/10" />
        </div>
      </div>

      <motion.p
        key={Math.floor(Date.now() / 1800) % messages.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted font-mono"
      >
        Analyzing with AI - this can take up to 20 seconds
      </motion.p>
    </div>
  );
}
