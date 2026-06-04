import React, { useState } from "react";
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  CheckCircle, 
  Award, 
  Users, 
  Zap, 
  HelpCircle, 
  Briefcase, 
  GraduationCap
} from "lucide-react";
import GenieLogo from "./GenieLogo";

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (view: string) => void;
}

export default function LandingPage({ onStart, onNavigate }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "94%", label: "Average ATS Boost" },
    { value: "220K+", label: "Mock Drills Completed" },
    { value: "4.9★", label: "User Satisfaction" },
    { value: "© 2026", label: "JOB GIENE Ecosystem" }
  ];

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      title: "AI ATS Optimization Engine",
      desc: "Instantly parse your resume, compare against target domains, and receive concrete keyword recommendations to get past automated screening systems."
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
      title: "Voice Interview Simulator",
      desc: "Experience simulated technical and behavioral panels. Speaks questions vocally and uses speech-to-text to evaluate your communication pacing and confidence."
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      title: "Placement Readiness XP Tracker",
      desc: "Stay consistent with daily diagnostic practice tasks. Level up your profile, earn exclusive skills badges, and raise your placement probability score."
    },
    {
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      title: "Global Openings & Salary Converter",
      desc: "Browse tech, finance, and design openings worldwide. Auto-converts and translates salary figures to exchange rates of your selected country instantly."
    }
  ];

  const steps = [
    { num: "01", title: "Upload Resumes / Profile Settings", desc: "Share your skills, targeted roles, and experience levels with our secure express database." },
    { num: "02", title: "Analyze ATS and Gaps", desc: "AI instantly lists missing technologies, grammar suggestions, and designs learning roadmaps." },
    { num: "03", title: "Drill on Interative Panels", desc: "Practice answering vocally with micro-evaluation metrics to test conversational fluency." },
    { num: "04", title: "Apply with High Credentials", desc: "Deploy AI cover letters and search real-time open positions converted to your target parameters." }
  ];

  const faqItems = [
    {
      q: "How does the ATS score calculation work?",
      a: "Our ATS parser evaluates layout readability, core keywords, action-verbs, and your profile skills stack. Adding suggested target technologies directly improves your score, while daily XP tasks increase your leveling badge tier!"
    },
    {
      q: "Is there any cost associated with these analysis systems?",
      a: "No! All analysis features are pre-configured through server-side caching and standard authorization pipelines. You can use the mentor chatbot, cover letter builder, and resume parser completely free of charge."
    },
    {
      q: "Can I practice interviews for non-technical careers?",
      a: "Yes! JOB GIENE is programmed to handle all domains, including Marketing, Business/Finance, Design, HR, and MBA management disciplines at customizable difficulties."
    },
    {
      q: "How does the country exchange rate salary conversion work?",
      a: "When you update your preferred country (US, UK, IN, CA, DE), our system automatically converts and formats global target earnings to your local currency index based on real-time exchange scales."
    }
  ];

  return (
    <div id="landing-page-layout" className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900 select-none">
      
      {/* Decorative Grid Light Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#fff_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Light Ambient Glows */}
      <div className="absolute top-[5%] left-[10%] w-80 h-80 bg-indigo-200/40 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute top-[35%] right-[10%] w-96 h-96 bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Premium Header Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-250 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <GenieLogo size="md" animate={true} />
            <span className="font-sans font-black text-slate-900 text-lg tracking-wider">
              JOB GIENE
            </span>
          </div>

          <nav className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">Methodology</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ Hub</a>
          </nav>

          <button 
            id="btn_nav_login"
            onClick={onStart}
            className="px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-900/10 hover:bg-indigo-500 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            Access Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Primary Landing Hero Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 w-full">
        
        {/* Animated Hero Branding Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 border border-indigo-200 rounded-full text-xs text-indigo-700 font-extrabold mb-6 uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Intelligent Placement Systems
          </div>

          <h1 className="text-4xl sm:text-6xl font-sans font-black tracking-tight text-slate-900 mb-6 leading-tight">
            The Complete Full-Stack{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
              Career Ecosystem
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-10 leading-relaxed font-sans max-w-2xl mx-auto">
            Designed especially for college graduates, junior engineers, and internship seekers. Calibrate resumes with ATS guidelines, drill on voice mock panels, and map your training coordinates completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button 
              id="cta_start_free"
              onClick={onStart} 
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-650/20 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer active:scale-95"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-350 rounded-xl text-slate-700 hover:text-slate-900 font-bold transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Elegant Statistics Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm mb-24 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
          {stats.map((st, i) => (
            <div key={i} className="text-center relative z-10 p-2 border-r last:border-r-0 border-slate-100">
              <span className="block text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                {st.value}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider font-mono">
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* Features Card Showcase Grid */}
        <div id="features" className="mb-24 scroll-mt-20">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">Enterprise AI Utilities</h2>
            <p className="text-sm text-slate-500">Every single-view panel uses authentic metrics and pathways to upgrade your active hiring index.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="p-8 bg-white border border-slate-200/80 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all flex gap-5 group"
              >
                <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-xl h-12 w-12 flex items-center justify-center border border-indigo-100 transition-transform group-hover:scale-105">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Step Timeline Coordinates */}
        <div id="how-it-works" className="mb-24 py-16 bg-slate-50 border-y border-slate-200 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-[10px] text-indigo-600 font-black tracking-widest font-mono uppercase block mb-2">Workspace Flow</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Four Steps to Competency</h2>
              <p className="text-sm text-slate-500 mt-2">How JOB GIENE converts background credentials into active hiring responses.</p>
            </div>

            <div className="space-y-12">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <span className="text-3xl sm:text-4xl font-black text-indigo-600/15 font-mono tracking-tighter shrink-0 select-none">
                    {s.num}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-950 mb-1">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium interactive FAQ foldouts */}
        <div id="faq" className="max-w-3xl mx-auto mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500 mt-2">Answers to generic topics regarding your workspace dashboard.</p>
          </div>

          <div className="space-y-3.5">
            {faqItems.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div 
                  key={i} 
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-sm"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between text-slate-800 hover:text-indigo-600 font-bold text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-indigo-600 text-xs transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>＋</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3.5 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Clean Call To Action Section Banner */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-slate-800 text-white shadow-xl shadow-slate-900/10">
          <div className="absolute top-[-40%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-black mb-4 relative z-10 font-sans tracking-tight">
            Build your professional future with intention.
          </h2>
          <p className="text-xs sm:text-sm text-slate-350 max-w-lg mx-auto mb-8 relative z-10 leading-relaxed">
            Stop guessing application parameters. Target exact role configurations, drill on vocal prompts, and download diagnostic scoring reports.
          </p>
          <button 
            onClick={onStart}
            className="relative z-10 px-8 py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-indigo-500 transition-all inline-flex items-center gap-2 shadow-md shadow-indigo-950/40 cursor-pointer active:scale-95"
          >
            Launch Free Analyzer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Recruiter Support footer */}
      <footer className="border-t border-slate-200 bg-white py-12 relative z-15 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <GenieLogo size="sm" animate={false} />
            <span className="text-slate-900 font-extrabold text-xs uppercase tracking-widest">
              JOB GIENE
            </span>
            <span className="text-[10px] text-slate-400 font-mono">v1.4.0</span>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">
              © 2026 JOB GIENE Ecosystem. All rights optimized.
            </div>
            <div className="text-[10px] text-slate-400">
              Recruiter Support Hotlink: <span className="underline font-mono text-indigo-650 font-bold hover:text-indigo-500 cursor-pointer">recruiter-desk@jobgiene.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
