import { motion } from "framer-motion";

const chips = [
  { label: "React", top: "12%", left: "-14%", delay: 0 },
  { label: "Node.js", top: "34%", left: "104%", delay: 0.4 },
  { label: "System Design", top: "58%", left: "-18%", delay: 0.8 },
  { label: "Leadership", top: "78%", left: "100%", delay: 1.2 },
];

/**
 * Signature element: a large, animated resume document being "scanned" by
 * an amber beam, with floating skill chips popping out as it's read.
 * Purely vector/CSS - no external image dependency, renders crisp at any size.
 */
export default function DocumentScanArt() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/5]">
      {/* ambient glow */}
      <div className="absolute inset-0 bg-amber/10 blur-3xl rounded-full scale-90" />

      {/* floating skill chips */}
      {chips.map((chip) => (
        <motion.div
          key={chip.label}
          className="hidden md:block absolute z-20 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-xs font-mono text-teal shadow-lg"
          style={{ top: chip.top, left: chip.left }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [10, -6, 10] }}
          transition={{
            opacity: { delay: chip.delay, duration: 0.6 },
            y: { delay: chip.delay, duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {chip.label}
        </motion.div>
      ))}

      {/* document card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full h-full rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden"
      >
        {/* document header */}
        <div className="p-8 space-y-4">
          <div className="w-2/3 h-4 rounded bg-ivory/20" />
          <div className="w-1/3 h-2.5 rounded bg-ivory/10" />
          <div className="pt-4 space-y-2">
            <div className="w-full h-2 rounded bg-ivory/10" />
            <div className="w-11/12 h-2 rounded bg-ivory/10" />
            <div className="w-4/5 h-2 rounded bg-ivory/10" />
          </div>
          <div className="pt-6 space-y-2">
            <div className="w-1/4 h-2.5 rounded bg-amber/40" />
            <div className="w-full h-2 rounded bg-ivory/10" />
            <div className="w-3/4 h-2 rounded bg-ivory/10" />
          </div>
          <div className="pt-6 space-y-2">
            <div className="w-1/3 h-2.5 rounded bg-amber/40" />
            <div className="w-full h-2 rounded bg-ivory/10" />
            <div className="w-5/6 h-2 rounded bg-ivory/10" />
            <div className="w-2/3 h-2 rounded bg-ivory/10" />
          </div>
        </div>

        {/* scanning beam */}
        <motion.div
          className="absolute left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(232,183,90,0.35), transparent)",
          }}
          animate={{ top: ["-10%", "100%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-amber shadow-[0_0_20px_4px_rgba(232,183,90,0.6)] pointer-events-none"
          animate={{ top: ["-2%", "98%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
