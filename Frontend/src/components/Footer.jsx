import { ScanLine } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted text-sm">
          <ScanLine size={16} className="text-amber" />
          Resonance - built with React, Express &amp; LangGraph
        </div>
        <p className="text-muted text-xs">
          Your resume is analyzed on demand and never shared with third parties.
        </p>
      </div>
    </footer>
  );
}
