import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, ScanLine } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border bg-ink/80 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl">
          <ScanLine className="text-amber" size={22} />
          <span>
            Resonance<span className="text-amber">.</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-muted hover:text-ivory transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-border"
                  />
                )}
                <span className="hidden sm:inline text-sm">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={16} className="text-muted" />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-amber text-ink text-sm font-medium hover:bg-amber-soft transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
