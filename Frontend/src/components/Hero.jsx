import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import DocumentScanArt from "./DocumentScanArt.jsx";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-glow">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-mono text-teal mb-6">
            <Sparkles size={14} />
            AI-powered resume intelligence
          </div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
            Read your resume the way a{" "}
            <span className="text-gradient italic">recruiter</span> actually does.
          </h1>
          <p className="text-muted text-lg mb-8 max-w-md">
            Upload your resume and get an instant breakdown of your skills, gaps
            against your target role, and interview questions tailored to what's
            actually written on the page.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber text-ink font-medium hover:bg-amber-soft transition-colors"
            >
              Analyze my resume
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="#how-it-works"
              className="text-sm text-muted hover:text-ivory transition-colors"
            >
              See how it works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DocumentScanArt />
        </motion.div>
      </div>
    </section>
  );
}
