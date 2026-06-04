import React, { useState } from "react";
import { Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, RefreshCw, Compass, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import GenieLogo from "./GenieLogo";

interface AuthScreenProps {
  onAuthSuccess: (session: { email: string; name: string; token: string }, profile: any) => void;
  onBackToLanding: () => void;
}

export default function AuthScreen({ onAuthSuccess, onBackToLanding }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [interests, setInterests] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot / Reset password parameters
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSentText, setForgotSentText] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!email || !password) {
      setErrorMsg("Please fill in all standard credentials.");
      return;
    }

    // Password rules validation (6-128 characters)
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }
    if (password.length > 128) {
      setErrorMsg("Password must be at most 128 characters long");
      return;
    }

    if (isRegister) {
      if (!name) {
        setErrorMsg("Please specify your name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match. Please verify your passwords.");
        return;
      }
    }

    setIsLoading(true);
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister 
      ? { email, name, password, region, interests } 
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || "Authentication session initialization rejected.");
      } else {
        setSuccessMsg(isRegister ? "Profile created! Initializing session..." : "Credentials verified! Welcome back.");
        setTimeout(() => {
          onAuthSuccess(data.session, data.profile);
        }, 800);
      }
    } catch (err) {
      setErrorMsg("Failed to establish secure handshake with full-stack Node container.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSentText("");
    if (!forgotEmail) return;

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setForgotSentText("A dynamic simulation recover token was successfully compiled. Please input security confirmation and details to set your new credentials.");
        setResetStep(2);
      } else {
        setForgotSentText(data.error || "Failed to issue password recovery link.");
      }
    } catch (err) {
      setForgotSentText("Handshake failed with recovery servers.");
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSentText("");

    if (!resetPassword) {
      setForgotSentText("Password is required.");
      return;
    }
    // Password rules validation (6-128 characters)
    if (resetPassword.length < 6) {
      setForgotSentText("Password must be at least 6 characters long");
      return;
    }
    if (resetPassword.length > 128) {
      setForgotSentText("Password must be at most 128 characters long");
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      setForgotSentText("Passwords do not match. Please verify.");
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, password: resetPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setForgotSentText("Password successfully reset! You can now close this modal and log in.");
        setPassword(resetPassword); // auto-fill Login field
        setResetStep(1);
      } else {
        setForgotSentText(data.error || "Failed to update security credentials.");
      }
    } catch (err) {
      setForgotSentText("Handshake failed with reset servers.");
    }
  };

  return (
    <div id="auth-screen-layout" className="min-h-screen grid lg:grid-cols-12 bg-slate-900 text-slate-100 font-sans relative overflow-hidden select-none">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* LEFT COLUMN: Visual Brand Panel (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-[#12162B] p-12 flex-col justify-between border-r border-slate-800 relative">
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10 cursor-pointer" onClick={onBackToLanding}>
          <GenieLogo size="md" animate={true} />
          <span className="text-sm font-black text-white uppercase tracking-wider">JOB GIENE</span>
        </div>

        {/* Feature Highlights Showcase */}
        <div className="my-auto space-y-8 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block font-mono">
              Unified Career Sandbox
            </span>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
              Perfect your resumes and master real-world AI interviews.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-sans max-w-sm mt-3">
              One central account matches your target roles with active workspace directories, custom pathways, and diagnostic review reports.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-start gap-3 text-xs leading-normal">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-200 block">Personal Profile Sync</span>
                <span className="text-slate-400 mt-1 block">Your bookmarks, XP records, resume edits, and speech answers stay synchronized.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs leading-normal">
              <Compass className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-200 block">Course Tracking Pathway</span>
                <span className="text-slate-400 mt-1 block">Gain badges and customized guidelines designed specifically for junior applicants.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="text-slate-600 text-[10px] tracking-wide font-mono relative z-10">
          SECURE ENCRYPTED HANDSHAKES PORT 3000
        </div>
      </div>

      {/* RIGHT COLUMN: Form Sheet Panel */}
      <div className="col-span-12 lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 md:p-16 relative z-10 bg-slate-900/40 backdrop-blur-md">
        
        {/* Top Header Panel controls */}
        <div className="flex justify-between items-center sm:px-4">
          <button 
            onClick={onBackToLanding}
            className="text-xs font-black text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1"
          >
            ← Back to Home
          </button>
          
          <div className="text-xs text-slate-400">
            {isRegister ? "Have an account?" : "New to Job Giene?"}{" "}
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-indigo-400 font-extrabold hover:underline ml-1 cursor-pointer"
            >
              {isRegister ? "Log In" : "Sign up Free"}
            </button>
          </div>
        </div>

        {/* Form Container Wrapper */}
        <div className="max-w-md w-full mx-auto my-auto py-10 sm:px-4">
          
          {/* Section Headers */}
          <div className="space-y-2 mb-8">
            <h3 className="text-2xl font-black text-white font-sans tracking-tight">
              {isRegister ? "Build your placement profile" : "Log in to your workspace"}
            </h3>
            <p className="text-xs text-slate-400">
              {isRegister 
                ? "Enter your target settings to generate personalized mock schedules."
                : "Manage your existing resumes, course certificates, and feedback metrics."
              }
            </p>
          </div>

          {/* Validation Messages alerts */}
          {errorMsg && (
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl mb-6 font-medium"
            >
              ⚠ {errorMsg}
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl mb-6 font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              {successMsg}
            </motion.div>
          )}

          {/* Standard Form Sheet */}
          <form onSubmit={handleSubmit} className="space-y-4">
                     {isRegister && (
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5 font-mono">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800/60 hover:bg-slate-800/80 focus:bg-slate-800 border border-slate-700/80 focus:border-indigo-500 rounded-xl p-3.5 pl-10 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500 font-sans"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5 font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="Enter secure email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/60 hover:bg-slate-800/80 focus:bg-slate-800 border border-slate-700/80 focus:border-indigo-500 rounded-xl p-3.5 pl-10 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500 font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block font-mono">Password</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSentText("");
                      setResetStep(1);
                      setForgotEmail("");
                      setResetPassword("");
                      setResetConfirmPassword("");
                      setShowForgotModal(true);
                    }}
                    className="text-[10px] text-indigo-400 font-extrabold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/60 hover:bg-slate-800/80 focus:bg-slate-800 border border-slate-700/80 focus:border-indigo-500 rounded-xl p-3.5 pl-10 pr-10 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5 font-mono">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Verify secure password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-800/60 hover:bg-slate-800/80 focus:bg-slate-800 border border-slate-700/80 focus:border-indigo-500 rounded-xl p-3.5 pl-10 pr-10 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors p-1"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5 font-mono">Region</label>
                  <div className="relative">
                    <select
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-slate-800/60 hover:bg-slate-800/80 focus:bg-slate-800 border border-slate-700/80 focus:border-indigo-500 rounded-xl p-3.5 pr-10 text-xs text-slate-100 outline-none transition-all font-sans appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-slate-900 text-slate-400">Select your region</option>
                      <option value="Asia Pacific & India" className="bg-slate-900 text-slate-105">Asia Pacific (APAC) & India</option>
                      <option value="North America" className="bg-slate-900 text-slate-105">North America (NA)</option>
                      <option value="Europe" className="bg-slate-900 text-slate-105">Europe & UK (EMEA)</option>
                      <option value="Latin America & Rest of World" className="bg-slate-900 text-slate-105">Latin America & Rest of World</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 font-bold">
                      ▼
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5 font-mono">Interests</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="E.g. Fullstack Developer, Artificial Intelligence, Fintech"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      className="w-full bg-slate-800/60 hover:bg-slate-800/80 focus:bg-slate-800 border border-slate-700/80 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500 font-sans"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit buttons */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold leading-none cursor-pointer transition-all shadow-md shadow-indigo-950/40 flex items-center justify-center gap-2 mt-6 active:scale-98 disabled:opacity-50"
            >
              <span>{isRegister ? "Construct Account Pipeline" : "Secure Launch Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

        </div>

        {/* Small security footer */}
        <div className="text-center">
          <span className="text-[9px] text-slate-600 font-mono">
            SSL CRYPTO Handshake verified • Safe placement database • Multi-user isolated sandbox
          </span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 relative"
          >
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 font-extrabold cursor-pointer text-xs"
            >
              ✕
            </button>
            
            <h4 className="text-lg font-black text-white mb-2">Reset Password credentials</h4>
            <p className="text-xs text-slate-400 leading-normal mb-6">
              {resetStep === 1
                ? "Enter your registered profile email. Our container will dispatch real simulated token instructions."
                : "Type in your new matching passwords of 6 to 128 characters to reset your credentials."}
            </p>

            {forgotSentText && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-xl mb-4 leading-normal font-medium">
                {forgotSentText}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold leading-none cursor-pointer tracking-wider"
                >
                  Dispatched Simulated Reset
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1 font-mono">Email Coordinates</label>
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={forgotEmail}
                    className="w-full bg-slate-800/60 border border-slate-750 rounded-xl p-3.5 text-xs text-slate-400 outline-none select-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">New Password</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      required
                      placeholder="Enter new credentials"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 pr-10 text-xs text-slate-100 outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-355 transition-colors p-1"
                      title={showResetPassword ? "Hide password" : "Show password"}
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">Verify Password</label>
                  <div className="relative">
                    <input
                      type={showResetConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Repeat new credentials"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 pr-10 text-xs text-slate-100 outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-355 transition-colors p-1"
                      title={showResetConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showResetConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResetStep(1)}
                    className="w-1/3 py-3 bg-slate-805 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold leading-none cursor-pointer tracking-wider"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold leading-none cursor-pointer tracking-wider"
                  >
                    Set Password
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
