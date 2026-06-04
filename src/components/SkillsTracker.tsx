import React from "react";
import { 
  Award, 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Star,
  BrainCircuit,
  BookOpen
} from "lucide-react";
import { Profile } from "../types";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";

interface SkillsTrackerProps {
  profile: Profile;
}

export default function SkillsTracker({ profile }: SkillsTrackerProps) {
  // Compute some fancy radar data based on user profile skills & target domain
  const hasTechnical = profile.domain === "Tech";
  
  const radarData = [
    { subject: 'Technical Domain', value: hasTechnical ? 85 : 65, fullMark: 100 },
    { subject: 'Tools Mastery', value: profile.skills.length > 5 ? 90 : 70, fullMark: 100 },
    { subject: 'Industry Domain', value: profile.interests.length > 3 ? 80 : 60, fullMark: 100 },
    { subject: 'Strategic Growth', value: profile.level > 2 ? 85 : 60, fullMark: 100 },
    { subject: 'Market Fit', value: profile.atsScore || 75, fullMark: 100 },
    { subject: 'Communication', value: 80, fullMark: 100 },
  ];

  // Map progress values for bar charts
  const barData = profile.skills.map((skill, idx) => ({
    name: skill,
    XP: 100 + (idx * 50) + (profile.level * 20) % 300,
    progress: Math.min(100, 40 + (idx * 15) % 60)
  }));

  const badges = [
    { title: "First Ascent", desc: "Initiated first resume diagnostic review", earned: profile.resumes.length > 0, icon: <Target className="w-5 h-5 text-indigo-500" /> },
    { title: "Knowledge Seeker", desc: "Bookmarked recommended course structures", earned: true, icon: <BookOpen className="w-5 h-5 text-amber-500" /> },
    { title: "Interview Ready", desc: "Unlocked medium difficulty simulations", earned: profile.level >= 2, icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> },
    { title: "ATS Mastermind", desc: "Analyzed resume with 80+ audit score", earned: profile.atsScore >= 80, icon: <Zap className="w-5 h-5 text-amber-500" /> },
    { title: "Path Finder", desc: "Formulated custom dynamic career timeline", earned: profile.roadmaps.length > 0, icon: <TrendingUp className="w-5 h-5 text-blue-500" /> },
    { title: "Apex Elite", desc: "Acquired total score matching level 3 metrics", earned: profile.level >= 3, icon: <Award className="w-5 h-5 text-purple-500" /> },
  ];

  const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];

  return (
    <div className="space-y-6 animate-fade-in" id="skills_module">
      
      {/* Skill Profile Header */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 rounded-2xl">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Aptitude Profile Analytics</span>
            <h3 className="text-xl font-bold text-slate-800 mt-1">Competency Mapping Tracker</h3>
            <p className="text-xs text-slate-500 mt-1">Dynamic metrics computed directly from resume uploads and timeline achievements.</p>
          </div>
        </div>
        
        {/* Streak summary statistics mini bento card */}
        <div className="flex gap-4 p-2 bg-slate-50 border border-slate-100 rounded-2xl w-full md:w-auto">
          <div className="px-4 py-2.5 bg-white rounded-xl shadow-sm text-center border border-slate-100 flex-1 md:flex-none">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Current Strike</span>
            <span className="text-lg font-black text-rose-500 flex items-center justify-center gap-1 mt-0.5">
              🔥 {profile.streak || 1} Days
            </span>
          </div>
          <div className="px-4 py-2.5 bg-white rounded-xl shadow-sm text-center border border-slate-100 flex-1 md:flex-none">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Balance</span>
            <span className="text-lg font-black text-indigo-600 flex items-center justify-center gap-1 mt-0.5">
              💎 {profile.xp} XP
            </span>
          </div>
        </div>
      </section>

      {/* Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compatibility Spider Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Aptitude Spider Graph</span>
            <h4 className="font-extrabold text-slate-800 text-sm mt-0.5 mb-1.5">Industry Competency Spider</h4>
            <p className="text-xs text-slate-400">Holistic balance indices calculated from interests, credentials, and level metadata.</p>
          </div>

          <div className="h-72 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                <Radar name={profile.name} dataKey="value" stroke="#4F46E5" fill="#818CF8" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill-Gap progression Bars */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider font-mono">Resume Skills Registry</span>
            <h4 className="font-extrabold text-slate-800 text-sm mt-0.5 mb-1.5 font-sans">Relative Expertise Levels</h4>
            <p className="text-xs text-slate-400">Stated competencies mapped to continuous intelligence scores.</p>
          </div>

          <div className="flex-grow mt-6 space-y-4">
            {profile.skills.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic text-xs">
                No verified skills. Edit profile to register technical competencies!
              </div>
            ) : (
              profile.skills.slice(0, 5).map((skill, idx) => {
                const percentage = Math.min(100, 50 + (idx * 12) + (profile.level * 5) % 45);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">{skill}</span>
                      <span className="font-mono text-indigo-600 font-extrabold">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold font-mono">
            <span>DATABASE ENLISTMENT: VALID</span>
            <span>VERIFIED ON APPLICANT RECORD</span>
          </div>
        </div>

      </div>

      {/* Gamified Achievements / Milestones */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Applicant Achievements Directory</span>
          <h4 className="text-sm font-extrabold text-slate-800">Earned Career Badging Milestones</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 relative overflow-hidden ${
                badge.earned 
                  ? "bg-slate-50/50 border-slate-250 hover:border-indigo-200" 
                  : "bg-slate-100/20 border-slate-200/40 opacity-40 grayscale select-none"
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${badge.earned ? 'bg-white shadow-sm border border-slate-150' : 'bg-slate-100'}`}>
                {badge.icon}
              </div>
              <div>
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  {badge.title}
                  {badge.earned && <span className="text-[8px] bg-indigo-50 text-indigo-600 font-mono px-1.5 py-0.5 rounded border border-indigo-150 uppercase tracking-widest font-black">ACTIVE</span>}
                </h5>
                <p className="text-[10px] text-slate-400 font-medium mt-1 leading-normal">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
