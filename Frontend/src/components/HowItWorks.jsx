import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Upload your resume",
    copy: "Drop in a PDF or DOCX. Nothing leaves your account until you hit analyze.",
  },
  {
    n: "02",
    title: "The AI reads it in context",
    copy: "A retrieval-augmented pipeline compares your resume against real role expectations, not just keywords.",
  },
  {
    n: "03",
    title: "Get your report",
    copy: "Skills, strengths, gaps, and 8 tailored interview questions - ready in seconds.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-3xl md:text-4xl mb-2"
      >
        A three-step reading, not a black box.
      </motion.h2>
      <p className="text-muted mb-14 max-w-lg">
        Every analysis follows the same pipeline, in this order, every time.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative p-6 rounded-2xl border border-border bg-surface"
          >
            <span className="font-mono text-amber/60 text-sm">{step.n}</span>
            <h3 className="font-display text-xl mt-3 mb-2">{step.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{step.copy}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
