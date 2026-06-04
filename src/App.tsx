import React, { useState, useEffect } from "react";
import { 
  Shield,
  Building2, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  CheckCircle, 
  Award, 
  Users, 
  Zap, 
  Terminal, 
  Briefcase, 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Settings, 
  MessageSquare,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Signpost,
  LogOut,
  BarChart2,
  Home,
  User,
  CheckSquare,
  Activity
} from "lucide-react";
import LandingPage from "./components/LandingPage";
import DashboardHome from "./components/DashboardHome";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import InterviewTrainer from "./components/InterviewTrainer";
import CareerMentor from "./components/CareerMentor";
import AIGenie from "./components/AIGenie";
import RoadmapsCourses from "./components/RoadmapsCourses";
import JobsInternships from "./components/JobsInternships";
import SettingsAdmin from "./components/SettingsAdmin";
import SkillsTracker from "./components/SkillsTracker";
import ApplicationsManager from "./components/ApplicationsManager";
import ProfileEditor from "./components/ProfileEditor";
import ResumeBuilder from "./components/ResumeBuilder";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";
import AnalyticsView from "./components/AnalyticsView";
import GenieLogo from "./components/GenieLogo";
import { Profile, JobOpenings } from "./types";

export default function App() {
  // Opening Splash & Auth controls
  const [showSplash, setShowSplash] = useState(true);
  const [userSession, setUserSession] = useState<{ email: string; name: string; token: string } | null>(() => {
    const saved = localStorage.getItem("userSession");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global theme state persistent toggle (Standard off-whites / Charcoal grays)
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Unified global databases
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<JobOpenings[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const isAdmin = !!(profile?.email && (profile.email === "aravjain2107@gmail.com" || profile.email === "arnavjain2107@gmail.com"));

  // Fetch initial profile & jobs from real Express endpoints with session awareness
  const loadInitialState = async () => {
    if (!userSession?.email) {
      setProfile(null);
      setIsAppLoading(false);
      return;
    }
    setIsAppLoading(true);
    const headers: Record<string, string> = { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userSession.token}`
    };
    try {
      const profileRes = await fetch("/api/profile", { headers });
      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData);
      }

      const jobsRes = await fetch("/api/jobs", { headers });
      if (jobsRes.ok) {
        const jData = await jobsRes.json();
        setJobs(jData);
      }
    } catch (e) {
      console.error("Critical: Failed loading database states from Node server", e);
    } finally {
      setIsAppLoading(false);
    }
  };

  useEffect(() => {
    if (!showSplash) {
      loadInitialState();
    }
  }, [showSplash, userSession]);

  // Persistent autosave back to database
  const handleUpdateProfile = async (updatedProfile: Profile) => {
    setProfile(updatedProfile); // Immediate render update
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (userSession?.token) {
      headers["Authorization"] = `Bearer ${userSession.token}`;
    }
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers,
        body: JSON.stringify(updatedProfile)
      });
    } catch (err) {
      console.error("Autosave database sync failed in background", err);
    }
  };

  // Restores standard default parameters
  const handleResetData = async () => {
    setIsAppLoading(true);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (userSession?.token) {
      headers["Authorization"] = `Bearer ${userSession.token}`;
    }
    try {
      const res = await fetch("/api/profile/reset", { method: "POST", headers });
      if (res.ok) {
        const resetProfile = await res.json();
        setProfile(resetProfile);
        setActiveTab("dashboard");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAppLoading(false);
    }
  };

  // Authentication Handlers
  const handleAuthSuccess = (session: { email: string; name: string; token: string }, freshProfile: Profile) => {
    localStorage.setItem("userSession", JSON.stringify(session));
    setUserSession(session);
    setProfile(freshProfile);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setUserSession(null);
    setProfile(null);
    setActiveTab("landing");
  };

  // Direct injection from admin
  const handleInjectJob = (newJob: JobOpenings) => {
    setJobs(prev => [newJob, ...prev]);
  };

  // Nav routing dispatcher
  const renderTabContent = () => {
    if (!profile) return null;
    switch (activeTab) {
      // User Tabs
      case "dashboard":
        return (
          <DashboardHome 
            profile={profile} 
            jobs={jobs} 
            onNavigate={setActiveTab} 
            onUpdateProfile={handleUpdateProfile} 
          />
        );
      case "jobs":
        return <JobsInternships profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case "courses":
        return <RoadmapsCourses profile={profile} onUpdateProfile={handleUpdateProfile} initialTab="courses" />;
      case "roadmaps":
        return <RoadmapsCourses profile={profile} onUpdateProfile={handleUpdateProfile} initialTab="roadmaps" />;
      case "ats-analyzer":
        return <ResumeAnalyzer profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case "resume-builder":
        return <ResumeBuilder profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case "interview-session":
        return <InterviewTrainer profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case "ai-genie":
        return <AIGenie profile={profile} onUpdateProfile={handleUpdateProfile} onNavigate={setActiveTab} />;
      case "saved-jobs":
        return <JobsInternships profile={profile} onUpdateProfile={handleUpdateProfile} viewSavedOnly={true} />;
      case "saved-courses":
        return <RoadmapsCourses profile={profile} onUpdateProfile={handleUpdateProfile} initialTab="saved" />;
      case "settings":
        return (
          <SettingsAdmin 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
            onResetAllData={handleResetData}
            onInjectJob={handleInjectJob}
            onLogout={handleLogout}
            initialView="settings"
          />
        );

      // Admin Tabs
      case "admin-dashboard":
        return (
          <SettingsAdmin 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
            onResetAllData={handleResetData}
            onInjectJob={handleInjectJob}
            onLogout={handleLogout}
            initialView="admin"
            initialAdminTab="dashboard"
          />
        );
      case "admin-users":
        return (
          <SettingsAdmin 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
            onResetAllData={handleResetData}
            onInjectJob={handleInjectJob}
            onLogout={handleLogout}
            initialView="admin"
            initialAdminTab="users"
          />
        );
      case "admin-jobs-mgmt":
        return (
          <SettingsAdmin 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
            onResetAllData={handleResetData}
            onInjectJob={handleInjectJob}
            onLogout={handleLogout}
            initialView="admin"
            initialAdminTab="inject-jobs"
          />
        );
      case "admin-courses-mgmt":
        return (
          <SettingsAdmin 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
            onResetAllData={handleResetData}
            onInjectJob={handleInjectJob}
            onLogout={handleLogout}
            initialView="admin"
            initialAdminTab="inject-courses"
          />
        );
      case "admin-ats-analytics":
      case "admin-skills-analytics":
      case "admin-target-jobs-analytics":
      case "admin-applications-analytics":
        return (
          <SettingsAdmin 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
            onResetAllData={handleResetData}
            onInjectJob={handleInjectJob}
            onLogout={handleLogout}
            initialView="admin"
            initialAdminTab="dashboard"
          />
        );
      case "admin-activity-tracking":
      case "admin-reports":
      case "admin-audit-logs":
        return (
          <SettingsAdmin 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
            onResetAllData={handleResetData}
            onInjectJob={handleInjectJob}
            onLogout={handleLogout}
            initialView="admin"
            initialAdminTab="logs"
          />
        );

      default:
        return (
          <DashboardHome 
            profile={profile} 
            jobs={jobs} 
            onNavigate={setActiveTab} 
            onUpdateProfile={handleUpdateProfile} 
          />
        );
    }
  };

  // 1. Rendering Premium Opening Splash Animation
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // 2. Loading state while database handshakes compile
  if (isAppLoading && userSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-8">
        <Sparkles className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-wider font-sans bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          JOB GIENE SECURE WORKSPACE
        </h2>
        <p className="text-xs text-slate-500 mt-2">Connecting secure express pipeline nodes...</p>
      </div>
    );
  }

  // 3. Render Landing Page
  if (activeTab === "landing") {
    return (
      <LandingPage 
        onStart={() => {
          if (userSession) {
            setActiveTab("dashboard");
          } else {
            setActiveTab("auth");
          }
        }} 
        onNavigate={(sect) => {
          if (sect === "features") {
            if (userSession) {
              setActiveTab("dashboard");
            } else {
              setActiveTab("auth");
            }
          }
        }} 
      />
    );
  }

  // 4. Render Authentication Screen
  if (activeTab === "auth" && !userSession) {
    return (
      <AuthScreen 
        onAuthSuccess={handleAuthSuccess}
        onBackToLanding={() => setActiveTab("landing")}
      />
    );
  }

  return (
    <div className={`min-h-screen flex text-slate-800 font-sans transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100 dark" : "bg-[#F1F5F9]"}`}>
      
      {/* 1. DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#0F172A] flex-col border-r border-slate-800 text-slate-300 shrink-0 select-none">
        
        {/* Brand Banner */}
        <div 
          className="p-6 flex items-center gap-3 border-b border-slate-800/60 cursor-pointer group" 
          onClick={() => setActiveTab("dashboard")}
        >
          <div className="relative shrink-0">
            <GenieLogo size="sm" animate={true} />
          </div>
          <div>
            <span className="text-sm uppercase tracking-widest font-black text-white block group-hover:text-indigo-400 transition-colors">
              JOB GIENE
            </span>
            <span className="text-[9px] text-indigo-400 font-bold block mt-0.5 font-mono">
              AI CAREER GENIE
            </span>
          </div>
        </div>

        {/* Sidebar Nav anchors */}
        <nav className="flex-grow px-4 py-4 space-y-1 overflow-y-auto">
          {(() => {
            const currentLinks = isAdmin ? [
              { tab: "admin-dashboard", icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />, label: "Dashboard" },
              { tab: "admin-users", icon: <Users className="w-4 h-4" />, label: "Users" },
              { tab: "admin-jobs-mgmt", icon: <Briefcase className="w-4 h-4" />, label: "Jobs Management" },
              { tab: "admin-courses-mgmt", icon: <GraduationCap className="w-4 h-4" />, label: "Courses Management" },
              { tab: "admin-audit-logs", icon: <Terminal className="w-4 h-4" />, label: "Audit Logs" },
              { tab: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings" }
            ] : [
              { tab: "dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
              { tab: "jobs", icon: <Briefcase className="w-4 h-4" />, label: "Jobs" },
              { tab: "courses", icon: <GraduationCap className="w-4 h-4" />, label: "Courses" },
              { tab: "roadmaps", icon: <Compass className="w-4 h-4" />, label: "Roadmaps" },
              { tab: "ats-analyzer", icon: <FileText className="w-4 h-4" />, label: "ATS Analyzer" },
              { tab: "resume-builder", icon: <Sparkles className="w-4 h-4" />, label: "Resume Builder" },
              { tab: "interview-session", icon: <Zap className="w-4 h-4 text-emerald-400" />, label: "Interview Session" },
              { tab: "ai-genie", icon: <Sparkles className="w-4 h-4 text-indigo-400" />, label: "AI Genie" },
              { tab: "saved-jobs", icon: <Briefcase className="w-4 h-4 text-emerald-500" />, label: "Saved Jobs" },
              { tab: "saved-courses", icon: <GraduationCap className="w-4 h-4 text-emerald-500" />, label: "Saved Courses" },
              { tab: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings" }
            ];

            return currentLinks.map((lnk, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTab(lnk.tab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === lnk.tab 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/45" 
                    : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                {lnk.icon}
                <span>{lnk.label}</span>
              </button>
            ));
          })()}
        </nav>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* 2. MOBILE FLOATING SIDEBAR DRAWER INTERACTIVE MENU */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/45 backdrop-blur-sm animate-fade-in">
          <aside className="w-64 bg-[#0F172A] p-6 flex flex-col border-r border-slate-850 text-slate-300">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GenieLogo size="sm" animate={true} />
                <span className="text-sm font-black text-white">JOB GIENE</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1 flex-grow overflow-y-auto">
              {(() => {
                const currentLinks = isAdmin ? [
                  { tab: "admin-dashboard", icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />, label: "Dashboard" },
                  { tab: "admin-users", icon: <Users className="w-4 h-4" />, label: "Users" },
                  { tab: "admin-jobs-mgmt", icon: <Briefcase className="w-4 h-4" />, label: "Jobs Management" },
                  { tab: "admin-courses-mgmt", icon: <GraduationCap className="w-4 h-4" />, label: "Courses Management" },
                  { tab: "admin-audit-logs", icon: <Terminal className="w-4 h-4" />, label: "Audit Logs" },
                  { tab: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings" }
                 ] : [
                  { tab: "dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
                  { tab: "jobs", icon: <Briefcase className="w-4 h-4" />, label: "Jobs" },
                  { tab: "courses", icon: <GraduationCap className="w-4 h-4" />, label: "Courses" },
                  { tab: "roadmaps", icon: <Compass className="w-4 h-4" />, label: "Roadmaps" },
                  { tab: "ats-analyzer", icon: <FileText className="w-4 h-4" />, label: "ATS Analyzer" },
                  { tab: "resume-builder", icon: <Sparkles className="w-4 h-4" />, label: "Resume Builder" },
                  { tab: "interview-session", icon: <Zap className="w-4 h-4 text-emerald-400" />, label: "Interview Session" },
                  { tab: "ai-genie", icon: <Sparkles className="w-4 h-4 text-indigo-400" />, label: "AI Genie" },
                  { tab: "saved-jobs", icon: <Briefcase className="w-4 h-4 text-emerald-500" />, label: "Saved Jobs" },
                  { tab: "saved-courses", icon: <GraduationCap className="w-4 h-4 text-emerald-500" />, label: "Saved Courses" },
                  { tab: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings" }
                ];
                return currentLinks.map((lnk, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(lnk.tab);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === lnk.tab ? "bg-indigo-600 text-white" : "hover:bg-slate-800/40 text-slate-400"
                    }`}
                  >
                    <div className="shrink-0">{lnk.icon}</div>
                    <span>{lnk.label}</span>
                  </button>
                ));
              })()}
            </nav>

            <div className="pt-4 border-t border-slate-800/60 mt-auto">
              <button 
                onClick={() => {
                  setMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-950/20 text-rose-400 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. CORE ADAPTIVE WORKSPACE WRAPPER */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Header toolbar */}
        <header className="h-20 bg-white border-b border-slate-200 shrink-0 px-6 sm:px-8 flex items-center justify-between z-20 select-none">
          
          {/* Menu triggers for mobile layouts */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 lg:hidden text-slate-500 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Structural Title Section */}
            <div>
              <span className="text-xs uppercase text-slate-400 font-bold tracking-widest block leading-none font-sans select-none">
                WORKPLACE CODES
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-850 truncate max-w-[150px] sm:max-w-xs mt-1.5 leading-none select-all capitalize">
                {activeTab === "dashboard" && "Performance Panel"}
                {activeTab === "resume" && "ATS Optimizer Parser"}
                {activeTab === "mock" && "Interview Session"}
                {activeTab === "advisor" && "Career Coach Desk"}
                {activeTab === "roadmaps" && "Training Schedules"}
                {activeTab === "jobs" && "Openings Converter"}
                {activeTab === "recruiter-hub" && "Indeed Recruiter Hub"}
                {activeTab === "settings" && "Platform options"}
              </h2>
            </div>
          </div>

          {/* Seeker stats presets block */}
          {profile && (
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              
              {/* Home Return toggle button */}
              <button 
                onClick={() => setActiveTab("landing")}
                className="bg-slate-100/80 p-2 sm:px-4 border border-slate-200/40 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                Signpost <Signpost className="w-3.5 h-3.5" />
              </button>

              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-slate-800">{profile.name}</span>
                <span className="text-[10px] text-indigo-500 font-bold tracking-wide mt-0.5">
                  XP Level {profile.level} • {profile.xp} total XP
                </span>
              </div>

              {/* Seeker Profile image/avatar preset */}
              <div 
                onClick={() => setActiveTab("settings")}
                className="h-9 w-9 bg-slate-100 rounded-full border border-indigo-100 flex items-center justify-center p-1 cursor-pointer hover:border-indigo-400 hover:shadow-inner shrink-0"
              >
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="User Avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border border-white p-1" />
                )}
              </div>

            </div>
          )}

        </header>

        {/* Dynamic workspace context scroll sheet panels */}
        <div className="flex-grow p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </div>

      </main>

    </div>
  );
}
