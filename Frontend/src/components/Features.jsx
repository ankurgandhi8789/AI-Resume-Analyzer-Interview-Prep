import { motion } from "framer-motion";
import { Gauge, ListChecks, Target, MessageCircleQuestion } from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "ATS readiness score",
    copy: "A 0-100 estimate of how your resume would survive an applicant tracking system and a recruiter's first skim.",
  },
  {
    icon: ListChecks,
    title: "Skills extraction",
    copy: "Every technology, tool, and competency the model can find - pulled straight from your own wording.",
  },
  {
    icon: Target,
    title: "Skill gap analysis",
    copy: "Retrieval-augmented comparison against real expectations for your target role, not generic advice.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Tailored interview questions",
    copy: "Eight technical, behavioral, and system-design questions written around what's actually on your resume.",
  },
];

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 border-t border-border">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-3xl md:text-4xl mb-14 max-w-lg"
      >
        Everything you'd want a mentor to tell you, on demand.
      </motion.h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-surface border border-border hover:border-amber/40 transition-colors"
          >
            <f.icon className="text-amber mb-4" size={26} />
            <h3 className="font-display text-lg mb-2">{f.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{f.copy}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
