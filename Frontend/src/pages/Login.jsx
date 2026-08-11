import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ScanLine } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success("Signed in successfully");
      navigate("/dashboard");
    } catch {
      toast.error("Sign in failed, please try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-glow px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm p-8 rounded-2xl border border-border bg-surface text-center"
      >
        <ScanLine className="text-amber mx-auto mb-4" size={32} />
        <h1 className="font-display text-2xl mb-2">Welcome to Resonance</h1>
        <p className="text-muted text-sm mb-8">
          Sign in with Google to analyze your resume and save your history.
        </p>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error("Google sign in failed")}
            theme="filled_black"
            shape="pill"
          />
        </div>
      </motion.div>
    </div>
  );
}
