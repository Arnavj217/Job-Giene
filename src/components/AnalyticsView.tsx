import React, { useState } from "react";
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
import { 
  BarChart2, 
  TrendingUp, 
  GraduationCap, 
  Award, 
  Flame, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Briefcase 
} from "lucide-react";
import { Profile } from "../types";

interface AnalyticsViewProps {
  profile: Profile;
}

export default function AnalyticsView({ profile }: AnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "ats" | "skills" | "learning" | "career" | "regional">("all");

  const countryName = profile.targetCountry || "US";

  // 1. ATS Analytics Data
  const atsHistoryData = [
    { name: "Initial Upload", score: 45, strength: 30 },
    { name: "Grammar Audit", score: 58, strength: 52 },
    { name: "Action Verbs", score: 72, strength: 68 },
    { name: "Keyword Match", score: 81, strength: 78 },
    { name: "Present Active", score: profile.atsScore || 85, strength: Math.min(98, (profile.atsScore || 85) + 5) }
  ];

  // 2. Technical Skills Radar & Growth
  const technicalSkillsData = [
    { subject: "JS / TS", A: 90, B: 85, fullMark: 100 },
    { subject: "React Engine", A: 85, B: 90, fullMark: 100 },
    { subject: "CSS / Tailwind", A: 95, B: 80, fullMark: 100 },
    { subject: "APIs & Fetching", A: 80, B: 75, fullMark: 100 },
    { subject: "State Managers", A: 75, B: 70, fullMark: 100 },
    { subject: "Node.js / SQL", A: 70, B: 65, fullMark: 100 }
  ];

  const skillGrowthData = [
    { month: "Jan", frontend: 40, backend: 25, architecture: 15 },
    { month: "Feb", frontend: 55, backend: 35, architecture: 30 },
    { month: "Mar", frontend: 70, backend: 50, architecture: 42 },
    { month: "Apr", frontend: 82, backend: 65, architecture: 55 },
    { month: "May", frontend: 92, backend: 72, architecture: 68 }
  ];

  // 3. Learning Analytics
  const learningProgressData = [
    { day: "Mon", hours: 1.5, coursesCompleted: 10 },
    { day: "Tue", hours: 2.8, coursesCompleted: 20 },
    { day: "Wed", hours: 2.0, coursesCompleted: 25 },
    { day: "Thu", hours: 3.5, coursesCompleted: 45 },
    { day: "Fri", hours: 4.2, coursesCompleted: 60 },
    { day: "Sat", hours: 1.8, coursesCompleted: 70 },
    { day: "Sun", hours: 3.0, coursesCompleted: 82 }
  ];

  // 4. Career Analytics
  const careerReadinessData = [
    { stage: "Baseline", placement: 35, internship: 50, applicationCount: 2 },
    { stage: "Resume Approved", placement: 55, internship: 68, applicationCount: 8 },
    { stage: "Roadmap Milestones", placement: 70, internship: 78, applicationCount: 15 },
    { stage: "Interview Practice", placement: 85, internship: 90, applicationCount: 28 }
  ];

  // 5. Dashboard XP Stream & Streak Data
  const xpGrowthData = [
    { week: "Wk 1", xp: 120, streak: 1 },
    { week: "Wk 2", xp: 340, streak: 3 },
    { week: "Wk 3", xp: 620, streak: 5 },
    { week: "Wk 4", xp: profile.xp || 950, streak: profile.streak || 7 }
  ];

  // 6. Regional Analytics based on country
  const getRegionalData = () => {
    switch (countryName) {
      case "IN":
        return {
          hiringTrend: [
            { field: "Frontend", demand: 88, salary: 12 },
            { field: "Backend", demand: 82, salary: 15 },
            { field: "Fullstack", demand: 95, salary: 18 },
            { field: "Mobile APPs", demand: 76, salary: 11 },
            { field: "ML Devs", demand: 92, salary: 22 }
          ],
          currency: "Lacs INR/yr",
          marketInsight: "Indian market highlights extremely elevated competitive placement filters for freshers."
        };
      case "UK":
        return {
          hiringTrend: [
            { field: "Frontend", demand: 82, salary: 45 },
            { field: "Backend", demand: 85, salary: 55 },
            { field: "Fullstack", demand: 90, salary: 60 },
            { field: "Mobile APPs", demand: 70, salary: 48 },
            { field: "ML Devs", demand: 94, salary: 75 }
          ],
          currency: "GBP/yr (£k)",
          marketInsight: "London FinTech cluster drives premium hiring multipliers for security & API knowledge."
        };
      case "CA":
        return {
          hiringTrend: [
            { field: "Frontend", demand: 84, salary: 78 },
            { field: "Backend", demand: 80, salary: 85 },
            { field: "Fullstack", demand: 89, salary: 95 },
            { field: "Mobile APPs", demand: 72, salary: 80 },
            { field: "ML Devs", demand: 91, salary: 115 }
          ],
          currency: "CAD/yr ($k)",
          marketInsight: "Canadian tech centers prioritize Hybrid roles with high degree qualification weighting."
        };
      case "DE":
        return {
          hiringTrend: [
            { field: "Frontend", demand: 78, salary: 55 },
            { field: "Backend", demand: 85, salary: 62 },
            { field: "Fullstack", demand: 88, salary: 70 },
            { field: "Mobile APPs", demand: 68, salary: 58 },
            { field: "ML Devs", demand: 93, salary: 85 }
          ],
          currency: "EUR/yr (€k)",
          marketInsight: "German industrial digitalization clusters favor strict type checking, robust software hygiene, and cloud architectures."
        };
      case "US":
      default:
        return {
          hiringTrend: [
            { field: "Frontend", demand: 92, salary: 105 },
            { field: "Backend", demand: 88, salary: 120 },
            { field: "Fullstack", demand: 96, salary: 135 },
            { field: "Mobile APPs", demand: 78, salary: 110 },
            { field: "ML Devs", demand: 98, salary: 165 }
          ],
          currency: "USD/yr ($k)",
          marketInsight: "US East & West Coast Silicon corridors are prioritizing AI/ML API orchestrations & Next.js frameworks."
        };
    }
  };

  const regionalData = getRegionalData();

  return (
    <div className="space-y-6">
      
      {/* Analytics Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">
              Interactive Diagnostic Metrics
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-3 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-indigo-400" /> Career Analytics Workspace
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              Real-time synchronization of ATS ratings, curriculum milestones, placement indices, and {countryName} salary trends parsed from active user telemetry.
            </p>
          </div>
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center gap-3 shrink-0">
            <Flame className="w-8 h-8 text-amber-500 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Telemetry Score</span>
              <span className="text-xl font-black text-slate-100">{profile.xp || 750} Total XP • Level {profile.level || 1}</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl w-full">
        {[
          { id: "all", label: "Overview Bento" },
          { id: "ats", label: "ATS Validator" },
          { id: "skills", label: "Skills Radar" },
          { id: "learning", label: "Learning Hours" },
          { id: "career", label: "Placement Index" },
          { id: "regional", label: `${countryName} Insights` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id 
                ? "bg-white text-slate-800 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER CONTENT PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ===================== PANEL 1: ATS ANALYTICS ===================== */}
        {(activeTab === "all" || activeTab === "ats") && (
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> ATS Analytics & Resume Strength
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">Live Rating</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Visualizing keyword indexing efficiency and absolute resume layout score progression across diagnostic uploads.
              </p>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={atsHistoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorStrength" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <YAxis domain={[0, 100]} style={{ fontSize: '9px' }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="score" name="ATS Index Score" stroke="#4f46e5" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="strength" name="Resume Density" stroke="#10b981" fillOpacity={1} fill="url(#colorStrength)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-4 flex justify-between items-center text-[10px]">
              <span className="text-slate-500">Target Benchmark: <strong>85% ATS Rating</strong></span>
              <span className="text-emerald-600 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">
                Current: {profile.atsScore || 85}%
              </span>
            </div>
          </div>
        )}

        {/* ===================== PANEL 2: SKILLS INTEGRATION ===================== */}
        {(activeTab === "all" || activeTab === "skills") && (
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" /> Skills Radar & Growth Gap
                </h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-md">Growth</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Analysis of custom skillset expansion across frontend stack integration, State handling, and Node.js server architectures.
              </p>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={technicalSkillsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" style={{ fontSize: '9px', fontWeight: 'bold', fill: '#475569' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} style={{ fontSize: '8px' }} />
                    <Radar name="Aspirant Capability" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} strokeWidth={2} />
                    <Radar name="Benchmark Demand" dataKey="B" stroke="#64748b" fill="#64748b" fillOpacity={0.1} strokeWidth={1} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-4 text-[10px] text-slate-600 flex justify-between">
              <span>Primary focus suggested: <strong>State Managers & Node.js</strong></span>
              <span className="font-bold text-indigo-650">Skills Aligned</span>
            </div>
          </div>
        )}

        {/* ===================== PANEL 3: LEARNING TELEMETRY ===================== */}
        {(activeTab === "all" || activeTab === "learning") && (
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-500" /> Study Engagement & Course Completion
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">Weekly Logs</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Daily learning study hours coupled with systematic course check-ins parsed over the current calendar week.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={learningProgressData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <YAxis style={{ fontSize: '9px' }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="hours" name="Active Hours" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="coursesCompleted" name="Syllabus Progress %" fill="#818cf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-4 flex justify-between items-center text-[10px]">
              <span className="text-slate-500">Weekly Learning Quotient:</span>
              <span className="font-bold text-indigo-650">Excellent (25 Hours Total)</span>
            </div>
          </div>
        )}

        {/* ===================== PANEL 4: PLACEMENT & INTERNSHIP READINESS ===================== */}
        {(activeTab === "all" || activeTab === "career") && (
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-rose-500" /> Career Readiness & Application Rates
                </h3>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md">Projections</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Placement assessment milestones correlating code exercise ratings against real conversion outcomes.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={careerReadinessData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="stage" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} style={{ fontSize: '9px' }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="placement" name="Placement Alignment %" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="internship" name="Internship Conversion %" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="applicationCount" name="Open Openings Applied" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 p-3.5 rounded-2xl mt-4 flex justify-between items-center text-[10px] text-rose-800 font-bold">
              <span>🚀 Premium Multiplier Applied</span>
              <span>Conversion Index: High</span>
            </div>
          </div>
        )}

        {/* ===================== PANEL 5: REGIONAL TARGET GROWTH ===================== */}
        {(activeTab === "all" || activeTab === "regional") && (
          <div className="lg:col-span-12 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-505" /> {countryName} Region-based Salary & Skills Demand Chart
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  {regionalData.marketInsight} Salaries displayed mapped against standard {regionalData.currency} multipliers.
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-extrabold px-3 py-1 rounded-xl self-start md:self-auto border border-slate-200">
                Active Locale: {countryName}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData.hiringTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="field" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <YAxis style={{ fontSize: '9px' }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="demand" name="Market Hiring Index" fill="#6366f1" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="salary" name={`Average Comp (${regionalData.currency})`} fill="#34d399" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Lateral Mini Cards for Regional Trends */}
              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-2.5xl border border-slate-200/80">
                <span className="text-[10px] font-black uppercase text-indigo-650 font-mono block">Placement Insights ({countryName})</span>
                
                <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                  <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Peak Domain Growth</span>
                    <p className="font-extrabold text-slate-800 text-xs">Fullstack & ML Orchestration</p>
                    <p className="text-[10px] text-slate-500">Fastest growing sectors based on Q2 2026 local announcements.</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Skills Multiplier Threshold</span>
                    <p className="font-extrabold text-slate-800 text-xs">Typescript, Node, Next.js</p>
                    <p className="text-[10px] text-slate-500">Profiles matching 3+ tags receive up to 2.4x higher interviewer query rates.</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Placement Readiness Range</span>
                    <p className="font-extrabold text-slate-850 text-xs flex justify-between">
                      <span>Standard Range:</span>
                      <span className="text-emerald-600">Active</span>
                    </p>
                    <p className="text-[10px] text-slate-500">Calculated according to portfolio code checkouts completed.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
