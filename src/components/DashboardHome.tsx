import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Award, 
  Zap, 
  CheckCircle, 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  PlusCircle, 
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Flame,
  ShieldCheck,
  Compass,
  MapPin,
  Upload,
  FileText,
  Check
} from "lucide-react";
import GenieLogo from "./GenieLogo";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from "recharts";
import { Profile, JobOpenings } from "../types";
import { checkLapsedStreak, recordActivityStreak } from "../utils/streak";

interface DashboardHomeProps {
  profile: Profile;
  jobs: JobOpenings[];
  onNavigate: (tab: string) => void;
  onUpdateProfile: (p: Profile) => void;
}

export default function DashboardHome({ profile, jobs, onNavigate, onUpdateProfile }: DashboardHomeProps) {
  const [taskMessage, setTaskMessage] = useState<string | null>(null);
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<"Overview" | "ATS & Resume" | "Skills & Growth">("Overview");

  // Onboarding Resume Paste/Upload form state
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [fileNameInput, setFileNameInput] = useState("");
  const [resumeTextInput, setResumeTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const parseFileSimulation = (file: File) => {
    const name = file.name;
    const extension = name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(extension || "")) {
      setAnalysisError("Unsupported format! System only permits official PDF, DOC, or DOCX formats.");
      return;
    }
    
    setUploadedFile({ name: file.name, size: file.size });
    setFileNameInput(file.name);
    setAnalysisError(null);

    // Prompt the user with a preconfigured template using their selected targetRole,
    // which they can easily customize in the plain text workspace.
    const customRoleName = targetRoleInput.trim() || "Software Engineer";
    const templateContent = `${profile.name ? profile.name.toUpperCase() : "CANDIDATE NAME"} - RESUME SUMMARY
Target Role: ${customRoleName}
Email: ${profile.email || "user@example.com"}

EXPERIENCE:
- Over 2 years building solutions associated with ${customRoleName} milestones.
- Managed layouts and custom interface controllers.

SKILLS & CORE COMPETENCIES:
- Frontend Core: HTML5, CSS3, JavaScript ES6
- Frameworks & tools: React, Tailwind CSS, Git, Node.js

PROJECTS:
- Specialized Portfolio: Launched personal dashboard showcasing interface mockups.
- Cloud Tracker: Configured full-stack deployment pipeline.`;

    // Only overwrite if text area is empty, allowing user fully custom experience
    if (!resumeTextInput.trim()) {
      setResumeTextInput(templateContent);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseFileSimulation(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseFileSimulation(e.target.files[0]);
    }
  };

  const handleAnalyzeResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisError(null);
    if (!resumeTextInput.trim() || resumeTextInput.length < 20) {
      setAnalysisError("Please input a valid resume text block (min 20 characters) to analyze.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileNameInput || "Pasted_Resume_Input.txt",
          resumeText: resumeTextInput,
          skills: profile.skills,
          currentRole: profile.experienceLevel,
          targetRole: targetRoleInput || "Frontend Developer"
        })
      });

      if (!response.ok) {
        throw new Error("Evaluation server was unable to parse the document successfully.");
      }

      const data = await response.json();
      
      // Grant 100 XP as career multiplier activity
      const updatedProfileWithXP = {
        ...data.profile,
        xp: data.profile.xp + 100,
        level: Math.floor(1 + (data.profile.xp + 100) / 500)
      };

      // Log active study streak since optimizer is a useful activity
      const streakResult = recordActivityStreak(updatedProfileWithXP);

      onUpdateProfile(streakResult.updatedProfile);
      setTaskMessage("Resume uploaded! ATS analysis complete and career diagnostics generated! 🎉");
      setTimeout(() => setTaskMessage(null), 5000);
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to initiate AI resume audit.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Real-time calendar day streak checking on mount
  useEffect(() => {
    const updated = checkLapsedStreak(profile);
    if (updated.streak !== profile.streak || JSON.stringify(updated.streakDates) !== JSON.stringify(profile.streakDates)) {
      onUpdateProfile(updated);
    }
  }, []);

  // Filter jobs matching user skills
  const matchingJobs = jobs.filter(job => 
    job.skillsRequired.some(skill => profile.skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase()))
  ).slice(0, 2);

  // Generate exactly 3 AI-personalized daily tasks every day based on target roles & region
  const getPersonalizedTasks = () => {
    const role = profile.targetRole || "Frontend Engineer";
    const region = profile.targetCountry || "US";
    const primarySkill = profile.skills[0] || "React";
    const secondarySkill = profile.skills[1] || "TypeScript";

    return [
      {
        id: `task_mock_ai_${region}`,
        title: `Run simulated ${role} drill matching top ${region} corporate interview structures`,
        rewardXp: 60,
        action: "mock"
      },
      {
        id: `task_scan_ai_${primarySkill}`,
        title: `Scan current resume block list to match exact ATS constraints for ${primarySkill} placement`,
        rewardXp: 50,
        action: "resume"
      },
      {
        id: `task_roadmap_ai_${secondarySkill}`,
        title: `Deep-dive study AI learning path nodes focusing on highly required ${secondarySkill} tools`,
        rewardXp: 40,
        action: "roadmaps"
      }
    ];
  };

  const dailyTasks = getPersonalizedTasks();

  const handleCompleteTask = (taskId: string, rewardXp: number) => {
    if (profile.completedTasks.includes(taskId)) {
      setTaskMessage("Task already completed today!");
      setTimeout(() => setTaskMessage(null), 3000);
      return;
    }

    const updatedTasks = [...profile.completedTasks, taskId];
    const newXp = profile.xp + rewardXp;
    
    // Earn badge for completing tasks
    const newBadges = [...profile.badges];
    if (updatedTasks.length >= 3 && !newBadges.includes("Task Master")) {
      newBadges.push("Task Master");
    }

    // Call high-fidelity calendar-day streak recorder
    const streakResult = recordActivityStreak({
      ...profile,
      completedTasks: updatedTasks,
      xp: newXp,
      badges: newBadges,
      level: Math.floor(1 + newXp / 500)
    });

    onUpdateProfile(streakResult.updatedProfile);
    
    if (!streakResult.increased) {
      setTaskMessage(`+${rewardXp} XP Reward Claimed! (Streak maintained at ${streakResult.updatedProfile.streak} days for today)`);
    } else {
      setTaskMessage(`Consistently training daily! +${rewardXp} XP & STREAK INCREASED to ${streakResult.updatedProfile.streak} Days! 🔥`);
    }
    setTimeout(() => setTaskMessage(null), 5000);
  };

  // Pre-calculated skill categories for interactive SVG growth chart
  const initialSkillGains = [
    { label: "Core Stack", value: 85, color: "bg-indigo-500 hover:bg-indigo-400" },
    { label: "Engineering Metrics", value: 60, color: "bg-cyan-500 hover:bg-cyan-400" },
    { label: "Interview Confidence", value: 75, color: "bg-emerald-500 hover:bg-emerald-400" },
    { label: "ATS Readiness", value: profile.atsScore, color: "bg-purple-500 hover:bg-purple-400" },
    { label: "Overall Comm Flow", value: 70, color: "bg-amber-500 hover:bg-amber-400" }
  ];

  const [activeChartBar, setActiveChartBar] = useState<number | null>(null);

  if (profile.resumes.length === 0) {
    return (
      <div id="dashboard-guidance-system" className="space-y-6">
        {/* Hero header */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/10 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_60%)] pointer-events-none" />
          
          <div className="z-10 max-w-lg space-y-3">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-400 bg-indigo-950/85 px-2.5 py-1 rounded-md border border-indigo-900/40">
              Welcome to JOB GIENE • Step 2: Onboarding Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Let's launch your career, {profile.name}!
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Before calculating your ATS readiness scores or unlocking direct mock interviews, we must analyze your existing credentials.
            </p>
          </div>
        </section>

        {/* Big Onboarding Box: Resume Upload to begin analysis */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <div className="mx-auto w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
            <h2 className="text-lg font-black text-slate-800">
              Upload your resume to begin AI career analysis
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drag & Drop your personal outline or select a document file. Supported formats: **PDF, DOC, DOCX**. Our AI will build your custom roadmap, assess placement metrics, and initialize competency vectors.
            </p>
          </div>

          <form onSubmit={handleAnalyzeResume} className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 font-sans">Target Job Title</label>
              <input 
                type="text" 
                required
                value={targetRoleInput} 
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="E.g. Frontend Developer, Junior UX Designer, Business Analyst" 
                className="w-full text-xs px-3.5 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-sans"
              />
            </div>

            {/* Drag and Drop Container */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("native-file-picker")?.click()}
              className={`p-8 border-2 border-dashed rounded-3xl transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden ${
                isDragging 
                  ? "bg-indigo-50 border-indigo-500 scale-[1.01]" 
                  : uploadedFile 
                    ? "bg-emerald-50/30 border-emerald-300" 
                    : "bg-slate-50/50 hover:bg-slate-50 border-slate-250 hover:border-slate-350"
              }`}
            >
              <input 
                type="file" 
                id="native-file-picker"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
              />

              {uploadedFile ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-800 truncate max-w-sm">{uploadedFile.name}</span>
                    <span className="block text-[10px] text-slate-550 font-mono mt-0.5">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Completed Import
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Upload className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-700">Drag & Drop Resume, or Click to Select File</span>
                    <span className="block text-[10px] text-slate-450 mt-1">Accepts PDF, DOC, or DOCX formats</span>
                  </div>
                </>
              )}
            </div>

            {uploadedFile && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Extracted AI Plaintext Workspace</label>
                <textarea 
                  rows={4}
                  required
                  value={resumeTextInput}
                  onChange={(e) => setResumeTextInput(e.target.value)}
                  placeholder="Review extracted resume layout detail..." 
                  className="w-full text-xs px-3.5 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-slate-350 font-mono tracking-tight"
                />
              </div>
            )}

            {analysisError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-semibold">
                ⚠️ {analysisError}
              </div>
            )}

            <button 
              type="submit"
              disabled={isAnalyzing}
              className={`w-full py-4 text-xs font-black tracking-wider uppercase text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isAnalyzing 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-100"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI Model analysis in progress...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-205" />
                  Trigger AI Resume Audit & Unlock Career Roadmap
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Dynamic Notification Top Alert */}
      {taskMessage && (
        <div className="fixed top-24 right-8 bg-slate-900 border-l-4 border-emerald-500 text-slate-100 p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{taskMessage}</span>
        </div>
      )}

      {/* Hero Header Glassmorphism Billboard */}
      <section className="bg-gradient-to-r from-indigo-900/90 via-indigo-950/80 to-slate-900 border border-indigo-500/10 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="z-10 max-w-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="shrink-0 bg-slate-950/45 p-2 rounded-2xl border border-indigo-950/60 shadow-inner">
              <GenieLogo size="lg" animate={true} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/40">
                {profile.experienceLevel} • Placement Readiness Tracker
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-white">
                Welcome back, {profile.name}!
              </h1>
            </div>
          </div>
          <p className="text-sm text-indigo-200 mt-2 leading-relaxed">
            Your placement score is tracking at <strong className="text-emerald-400 font-bold">{profile.atsScore}%</strong> capacity. Finish today's career challenges to level up your credentials.
          </p>
          
          <div className="mt-5 flex flex-wrap gap-2">
            <button 
              onClick={() => onNavigate("mock")}
              className="px-4 py-2 bg-white text-indigo-950 font-bold rounded-xl text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md shadow-indigo-950/15 cursor-pointer"
            >
              Start Practice Session
            </button>
            <button 
              onClick={() => onNavigate("roadmaps")}
              className="px-4 py-2 bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/20 font-semibold rounded-xl text-xs sm:text-sm transition-all"
            >
              Examine Learning roadmaps
            </button>
          </div>
        </div>

        {/* Highlight Score Badge */}
        <div className="z-10 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl text-center w-full md:w-36 flex flex-col justify-center items-center">
          <div className="text-[11px] uppercase text-slate-400 tracking-wider font-bold mb-1">ATS Score</div>
          <div className="text-4xl sm:text-5xl font-black text-indigo-400 tracking-tighter">
            {profile.atsScore}%
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Highest Index
          </span>
        </div>
      </section>

      {/* Main Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Experience multiplier */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Engagement Level</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">Tier {profile.level}</span>
            <span className="text-xs text-indigo-600 block mt-1 font-mono font-bold">
              {profile.xp % 500} / 500 XP to Tier {profile.level + 1}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        {/* Active Streak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Daily Active Streak</span>
              <span className="text-2xl font-black text-slate-800 mt-1 block flex items-center gap-1.5">
                <Flame className="w-6 h-6 text-orange-500 animate-[pulse_1.5s_infinite]" /> {profile.streak} Days Active
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Flame className="w-5 h-5 text-amber-600 animate-bounce" />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
              <span>Next Milestone: {profile.streak < 7 ? "7d Bronze" : profile.streak < 30 ? "30d Silver" : "100d Gold"}</span>
              <span className="text-indigo-600 font-sans">+2.4x XP Multiplier Active</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300 pointer-events-none" 
                style={{ width: `${Math.min(100, (profile.streak / (profile.streak < 7 ? 7 : profile.streak < 30 ? 30 : 100)) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px]">
            <span className="text-slate-400 font-bold">Milestones:</span>
            <div className="flex gap-1.5">
              <span className={`px-1.5 py-0.5 rounded font-black ${profile.streak >= 7 ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-slate-100 text-slate-400"}`}>Bronze</span>
              <span className={`px-1.5 py-0.5 rounded font-black ${profile.streak >= 30 ? "bg-slate-200 text-slate-700 border border-slate-400" : "bg-slate-50 text-slate-400"}`}>Silver</span>
              <span className={`px-1.5 py-0.5 rounded font-black ${profile.streak >= 100 ? "bg-yellow-100 text-yellow-800 border border-yellow-400" : "bg-slate-50 text-slate-400"}`}>Gold</span>
            </div>
          </div>
        </div>

        {/* Interviews Completed Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Drills Practiced</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">{profile.interviews.length} Sessions</span>
            <span className="text-xs text-slate-500 block mt-1">
              {profile.interviews.length > 0 ? "Consistently training" : "Start your first drill"}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

      </section>

      {/* Main Core Dashboard Sections Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column Stack */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Analytics Growth SVG Block */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-800">Placement Competency Vectors</h3>
                  <p className="text-xs text-slate-500">Live benchmark indicators derived from profile data</p>
                </div>
                <div className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1.5 select-none">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Active Tracking
                </div>
              </div>

              {/* Custom Interactive SVG Graph */}
              <div className="py-6 flex flex-col sm:flex-row items-end justify-between gap-6 min-h-[180px]">
                {initialSkillGains.map((bar, i) => (
                  <div 
                    key={i} 
                    className="w-full flex sm:flex-col items-center sm:justify-end gap-3"
                    onMouseEnter={() => setActiveChartBar(i)}
                    onMouseLeave={() => setActiveChartBar(null)}
                  >
                    {/* Laptop Vert Bar/ Mobile Horiz progress */}
                    <div className="w-full sm:w-12 h-6 sm:h-36 bg-slate-100 rounded-lg overflow-hidden relative flex justify-end items-end">
                      <div 
                        className={`w-full transition-all duration-500 rounded-lg ${bar.color} ${activeChartBar === i ? "opacity-100 scale-x-105" : "opacity-90"}`}
                        style={{ height: `${bar.value}%` }} 
                      />
                    </div>
                    <div className="text-left sm:text-center shrink-0 w-28 sm:w-auto">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-tight leading-none mb-1">
                        {bar.label}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-700">
                        {bar.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 flex items-center justify-between">
              <span>Hover bars to view live score factors.</span>
              <button onClick={() => onNavigate("settings")} className="text-indigo-600 hover:underline font-semibold flex items-center">
                Configure profile <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Embedded 6-Graph Career Analytics Workspace Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" /> Professional Career Telemetry & Diagnostic Graphs
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">ATS index, credentials, learning loops, and placement readiness indices</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto shrink-0">
                {["Overview", "ATS & Resume", "Skills & Growth"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveAnalyticsTab(tab as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                      activeAnalyticsTab === tab 
                        ? "bg-white text-slate-850 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab contents */}
            {activeAnalyticsTab === "Overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Placement Readiness Line Chart */}
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">1. Placement readiness & conversion %</span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { stage: "Baseline", placement: 35, internship: 50 },
                        { stage: "Resume Audited", placement: 55, internship: 68 },
                        { stage: "Syllabus Milestones", placement: 70, internship: 78 },
                        { stage: "Simulations Practice", placement: 85, internship: 90 }
                      ]} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <XAxis dataKey="stage" style={{ fontSize: '8px', fontWeight: 'bold' }} />
                        <YAxis style={{ fontSize: '8px' }} domain={[0, 100]} />
                        <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                        <Line type="monotone" dataKey="placement" name="Placement Conversion" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="internship" name="Internship Conversion" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. XP & Study Hours Progress Chart */}
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">2. Weekly Study Log & XP Growth Chart</span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { day: "Mon", hours: 1.5, xp: 120 },
                        { day: "Tue", hours: 2.8, xp: 340 },
                        { day: "Wed", hours: 2.0, xp: 420 },
                        { day: "Thu", hours: 3.5, xp: 680 },
                        { day: "Fri", hours: 4.2, xp: 820 }
                      ]} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <XAxis dataKey="day" style={{ fontSize: '8px', fontWeight: 'bold' }} />
                        <YAxis style={{ fontSize: '8px' }} />
                        <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                        <Bar dataKey="hours" name="Active Hours" fill="#10b981" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="xp" name="XP Gained" fill="#6366f1" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {activeAnalyticsTab === "ATS & Resume" && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">3. ATS progress & Resume Strength graph</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">Active resume metrics</span>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: "Initial Upload", score: 45, density: 30 },
                        { name: "Grammar Audit", score: 58, density: 52 },
                        { name: "Action Verbs", score: 72, density: 68 },
                        { name: "Keyword Match", score: 81, density: 78 },
                        { name: "Final Optimised", score: profile.atsScore, density: Math.min(99, profile.atsScore + 4) }
                      ]} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <defs>
                          <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="densityColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" style={{ fontSize: '8px', fontWeight: 'bold' }} />
                        <YAxis style={{ fontSize: '8px' }} domain={[0, 100]} />
                        <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                        <Legend wrapperStyle={{ fontSize: '9px' }} />
                        <Area type="monotone" dataKey="score" name="ATS Evaluation Score" stroke="#4f46e5" fillOpacity={1} fill="url(#scoreColor)" strokeWidth={2} />
                        <Area type="monotone" dataKey="density" name="Layout Strength" stroke="#10b981" fillOpacity={1} fill="url(#densityColor)" strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeAnalyticsTab === "Skills & Growth" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 5. Skill Expansion Radar */}
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">5. Skill Growth & Gap radar</span>
                  <div className="h-44 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                        { subject: "JS/TS Stack", A: 90, B: 85 },
                        { subject: "React Native", A: 85, B: 90 },
                        { subject: "Utility CSS", A: 95, B: 80 },
                        { subject: "APIs Orchestrations", A: 80, B: 85 },
                        { subject: "State Managers", A: 75, B: 70 }
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" style={{ fontSize: '7px', fontWeight: 'bold', fill: '#475569' }} />
                        <Radar name="Your Index" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
                        <Radar name="Target Demand" dataKey="B" stroke="#64748b" fill="#64748b" fillOpacity={0.05} />
                        <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '8px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 6. Cumulative Growth Index card */}
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">6. Cumulative Placement index growth</span>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      Tracking composite skills expansion score metrics against real enterprise recruiter query patterns in Q2 2026.
                    </p>
                  </div>
                  
                  <div className="space-y-2.5 mt-4">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-150 shadow-sm flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">recruiter outreach</span>
                      <span className="text-xs font-black text-indigo-650">+2.4x Multiplier</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-150 shadow-sm flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Profile integrity</span>
                      <span className="text-xs font-black text-emerald-600">95% Complete Verified</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/80 mt-4 flex justify-between items-center text-[10px] text-slate-500">
              <span>Synchronised with active {profile.targetCountry || "US"} benchmarks.</span>
              <button onClick={() => onNavigate("roadmaps")} className="text-indigo-600 hover:underline font-bold flex items-center">
                Explore recommended courses <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Task Lists Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Daily XP tasks panel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-sm">
            <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Zap className="w-5 h-5 text-amber-500" /> Daily XP Challenges
            </h3>
            <p className="text-xs text-slate-500 mb-4">Complete custom daily activities to secure XP multipliers.</p>
            
            <div className="space-y-3 flex-grow">
              {dailyTasks.map((t) => {
                const isDone = profile.completedTasks.includes(t.id);
                return (
                  <div 
                    key={t.id} 
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isDone 
                        ? "bg-emerald-50/50 border-emerald-200 text-slate-600" 
                        : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <PlusCircle className="w-4 h-4 text-indigo-400 shrink-0 hover:text-indigo-600 cursor-pointer" onClick={() => handleCompleteTask(t.id, t.rewardXp)} />
                      )}
                      <span className={`text-xs font-semibold ${isDone ? "line-through text-slate-400" : "text-slate-700"}`}>
                        {t.title}
                      </span>
                    </div>
                    
                    {!isDone ? (
                      <button 
                        onClick={() => handleCompleteTask(t.id, t.rewardXp)}
                        className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 rounded-md hover:bg-indigo-100 transition-all cursor-pointer"
                      >
                        +{t.rewardXp} XP
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md">Claimed</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] uppercase text-slate-400 font-bold">Streaks</span>
              <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1">
                🔥 {profile.streak} Days Active
              </span>
            </div>
          </div>

          {/* Core Credentials Badges */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Earned Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {profile.badges.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No badges earned yet. Complete daily challenges!</span>
              ) : (
                profile.badges.map((b, key) => (
                  <span key={key} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs rounded-xl inline-flex items-center gap-1 select-none">
                    ⭐ {b}
                  </span>
                ))
              )}
            </div>
          </div>

        </div>

      </section>

      {/* Recommended Jobs Quick Glance Section */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-800">Matching Direct Openings</h3>
            <p className="text-xs text-slate-500">Based on your skills: {profile.skills.join(", ") || "None specified"}</p>
          </div>
          <button 
            onClick={() => onNavigate("jobs")}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            Explore all listings <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchingJobs.length === 0 ? (
            <div className="col-span-2 text-center py-6 bg-slate-50 border border-slate-100 rounded-3xl">
              <p className="text-xs text-slate-500">No active job listings match your filtered skills perfectly.</p>
              <button onClick={() => onNavigate("jobs")} className="mt-2 text-xs font-bold text-indigo-600 hover:underline">
                View catalog of global roles
              </button>
            </div>
          ) : (
            matchingJobs.map(job => (
              <div 
                key={job.id}
                className="p-4 border border-slate-100 hover:border-indigo-300 hover:bg-slate-50/50 rounded-2xl transition-all cursor-pointer flex justify-between items-start"
                onClick={() => onNavigate("jobs")}
              >
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">
                    {job.type} • {job.domain}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">{job.role}</h4>
                  <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.skillsRequired.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-500 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-indigo-650 block">{job.salaryDisplay}</span>
                  <span className="text-[9px] text-slate-400 block mt-1">{job.remote ? "Remote ok" : "On-site"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
