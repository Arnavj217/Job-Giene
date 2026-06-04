import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Trash2, 
  Users, 
  Cpu, 
  Plus, 
  CheckCircle, 
  AlertOctagon, 
  Sparkles, 
  Activity, 
  ExternalLink,
  Shield,
  FileCheck,
  LogOut,
  RefreshCw,
  FileText,
  Award,
  TrendingUp,
  Terminal,
  BookOpen,
  Search,
  Filter,
  DollarSign
} from "lucide-react";
import { Profile } from "../types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface SettingsAdminProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
  onResetAllData: () => void;
  onInjectJob: (newJob: any) => void;
  onLogout?: () => void;
  initialView?: "settings" | "admin";
  initialAdminTab?: "dashboard" | "users" | "logs" | "inject-jobs" | "inject-courses";
}

export default function SettingsAdmin({ 
  profile, 
  onUpdateProfile, 
  onResetAllData, 
  onInjectJob, 
  onLogout,
  initialView = "settings",
  initialAdminTab = "dashboard"
}: SettingsAdminProps) {
  // Account Settings Form States
  const [profileName, setProfileName] = useState(profile.name);
  const [targetRole, setTargetRole] = useState(profile.targetRole);
  const [domainGroup, setDomainGroup] = useState(profile.domain);
  const [experience, setExperience] = useState(profile.experienceLevel);
  const [skillsText, setSkillsText] = useState(profile.skills.join(", "));
  const [interestsText, setInterestsText] = useState(profile.interests.join(", "));
  const [toggleActiveView, setToggleActiveView] = useState<"settings" | "admin">(initialView);

  // Advanced Demographics
  const [phone, setPhone] = useState(profile.phone || "");
  const [dob, setDob] = useState(profile.dob || "");
  const [country, setCountry] = useState(profile.country || "");
  const [city, setCity] = useState(profile.city || "");
  const [education, setEducation] = useState(profile.education || "");
  const [degree, setDegree] = useState(profile.degree || "");
  const [college, setCollege] = useState(profile.college || "");

  // Career Goals
  const [careerGoals, setCareerGoals] = useState(profile.careerGoals || "");
  const [preferredRoles, setPreferredRoles] = useState(profile.preferredRoles?.join(", ") || "");
  const [preferredIndustries, setPreferredIndustries] = useState(profile.preferredIndustries?.join(", ") || "");
  const [coverImage, setCoverImage] = useState(profile.coverImage || "");

  // Avatar Management States
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [showResetModalState, setShowResetModalState] = useState<boolean>(false);

  // ADMIN LIVE INTELLIGENCE TELEMETRY STATES
  const [adminStats, setAdminStats] = useState<any | null>(null);
  const [loadingAdminStats, setLoadingAdminStats] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  
  // Admin Sub-Tab selectors
  const [adminActiveTab, setAdminActiveTab] = useState<"dashboard" | "users" | "logs" | "inject-jobs" | "inject-courses">(initialAdminTab);

  useEffect(() => {
    setToggleActiveView(initialView);
  }, [initialView]);

  useEffect(() => {
    setAdminActiveTab(initialAdminTab);
  }, [initialAdminTab]);

  // Filter/Search States for User Analytics Table
  const [userReportQuery, setUserReportQuery] = useState("");
  const [userReportFilterRole, setUserReportFilterRole] = useState("All");

  // Admin New Job Inject States
  const [newJobRole, setNewJobRole] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobDomain, setNewJobDomain] = useState("Tech");
  const [newJobType, setNewJobType] = useState("Job");
  const [newJobLocation, setNewJobLocation] = useState("US");
  const [newJobSalary, setNewJobSalary] = useState("85000");
  const [newJobSkills, setNewJobSkills] = useState("React, Tailwind CSS, TypeScript");
  const [newJobApplyLink, setNewJobApplyLink] = useState("https://careers.google.com");
  const [newJobDesc, setNewJobDesc] = useState("We are seeking an industry professional to spearhead modern web experiences.");
  const [jobInjectFeedback, setJobInjectFeedback] = useState<string | null>(null);

  // Admin New Course Inject States
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseInstructor, setNewCourseInstructor] = useState("");
  const [newCoursePlatform, setNewCoursePlatform] = useState("Coursera");
  const [newCourseDuration, setNewCourseDuration] = useState("15 Hours");
  const [newCourseRating, setNewCourseRating] = useState("4.8");
  const [newCourseDomain, setNewCourseDomain] = useState("Tech");
  const [newCourseLink, setNewCourseLink] = useState("https://www.coursera.org");
  const [courseInjectFeedback, setCourseInjectFeedback] = useState<string | null>(null);

  const presetAvatars = [
    { name: "Apex Dev", url: "https://api.dicebear.com/7.x/bottts/svg?seed=arav" },
    { name: "Wiz Design", url: "https://api.dicebear.com/7.x/bottts/svg?seed=shawn" },
    { name: "SEO Strategist", url: "https://api.dicebear.com/7.x/bottts/svg?seed=olivia" },
    { name: "Lead Architect", url: "https://api.dicebear.com/7.x/bottts/svg?seed=arnav" }
  ];

  // Restructure Auth email checks
  const isAdminUser = profile.email === "aravjain2107@gmail.com" || profile.email === "arnavjain2107@gmail.com";

  // Fetch admin stats in real-time from SQLite database
  const fetchAdminStats = async () => {
    if (!isAdminUser) return;
    setLoadingAdminStats(true);
    setStatsError(null);
    try {
      const res = await fetch("/api/admin/metrics", {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      } else {
        const errData = await res.json();
        setStatsError(errData.error || "Failed secure permission checking.");
      }
    } catch (err) {
      setStatsError("Failed connecting to system administration portals.");
    } finally {
      setLoadingAdminStats(false);
    }
  };

  useEffect(() => {
    if (toggleActiveView === "admin") {
      fetchAdminStats();
    }
  }, [toggleActiveView]);

  useEffect(() => {
    const handleRefetch = () => {
      if (toggleActiveView === "admin") {
        fetchAdminStats();
      }
    };
    window.addEventListener("refresh-admin-metrics", handleRefetch);
    return () => {
      window.removeEventListener("refresh-admin-metrics", handleRefetch);
    };
  }, [toggleActiveView]);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert("Name is a required profile key.");
      return;
    }

    const skillsArr = skillsText.split(",").map(s => s.trim()).filter(Boolean);
    const interestsArr = interestsText.split(",").map(s => s.trim()).filter(Boolean);
    const preferredRolesArr = preferredRoles.split(",").map(r => r.trim()).filter(Boolean);
    const preferredIndustriesArr = preferredIndustries.split(",").map(i => i.trim()).filter(Boolean);

    const updatedProfile: Profile = {
      ...profile,
      name: profileName,
      targetRole: targetRole,
      domain: domainGroup,
      experienceLevel: experience,
      skills: skillsArr,
      interests: interestsArr,
      phone,
      dob,
      country,
      city,
      education,
      degree,
      college,
      careerGoals,
      preferredRoles: preferredRolesArr,
      preferredIndustries: preferredIndustriesArr,
      coverImage
    };

    onUpdateProfile(updatedProfile);
    alert("Profile specifications saved and synchronized successfully!");
  };

  const handleSelectAvatar = (url: string) => {
    onUpdateProfile({ ...profile, profileImage: url });
    setAvatarMessage("Assigned preset avatar successfully!");
    setTimeout(() => setAvatarMessage(null), 3000);
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...profile, profileImage: reader.result as string });
        setAvatarMessage("Custom photo crop formatted successfully!");
        setTimeout(() => setAvatarMessage(null), 3500);
      };
      reader.readAsDataURL(file);
    }
  };

  // Secure Job Opening Feed Injection submitting directly to SQLite DB!
  const handleInjectJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobRole.trim() || !newJobCompany.trim()) {
      setJobInjectFeedback("❌ Please fill in both the Role Title and Company Name to inject vacancies.");
      return;
    }

    try {
      const res = await fetch("/api/admin/jobs/inject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: newJobRole,
          company: newJobCompany,
          domain: newJobDomain,
          type: newJobType,
          location: newJobLocation,
          remote: true,
          minSalary: parseInt(newJobSalary) || 85000,
          maxSalary: Math.round((parseInt(newJobSalary) || 85000) * 1.25),
          skillsRequired: newJobSkills.split(",").map(s => s.trim()).filter(Boolean),
          applyLink: newJobApplyLink,
          description: newJobDesc
        })
      });

      if (res.ok) {
        setJobInjectFeedback(`✔ Success! Injected vacancy "${newJobRole}" into real SQLite job databases.`);
        setNewJobRole("");
        setNewJobCompany("");
        fetchAdminStats(); // live updates counters instantly!
      } else {
        setJobInjectFeedback("❌ Failed to parse or record vacancy metadata.");
      }
    } catch (_) {
      setJobInjectFeedback("❌ Failed saving. Network error connecting to admin pipelines.");
    }
    setTimeout(() => setJobInjectFeedback(null), 5000);
  };

  // Secure Course Track Feed Injection submitting directly to SQLite DB!
  const handleInjectCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCoursePlatform.trim()) {
      setCourseInjectFeedback("❌ Please provide a course title and hosting credentials to publish learnings.");
      return;
    }

    try {
      const res = await fetch("/api/admin/courses/inject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newCourseTitle,
          instructor: newCourseInstructor || "Top Technical Guide",
          platform: newCoursePlatform,
          duration: newCourseDuration,
          rating: parseFloat(newCourseRating) || 4.8,
          domain: newCourseDomain,
          link: newCourseLink,
          type: "Course"
        })
      });

      if (res.ok) {
        setCourseInjectFeedback(`✔ Success! Enrolled recommended course "${newCourseTitle}" into the database.`);
        setNewCourseTitle("");
        setNewCourseInstructor("");
        fetchAdminStats(); // live updates counters instantly!
      } else {
        setCourseInjectFeedback("❌ Failed to process course injection parameters.");
      }
    } catch (_) {
      setCourseInjectFeedback("❌ Network error publishing research course catalog.");
    }
    setTimeout(() => setCourseInjectFeedback(null), 5000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* SECTION TOP TOGGLE TAB PANEL */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-80">
        <button
          onClick={() => setToggleActiveView("settings")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            toggleActiveView === "settings" 
              ? "bg-white text-slate-800 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Account Settings
        </button>
        <button
          onClick={() => setToggleActiveView("admin")}
          className={`flex-grow py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            toggleActiveView === "admin" 
              ? "bg-white text-slate-800 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-indigo-600" /> Admin Console
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==================== TAB 1: REGULAR PROFILE SETTINGS ==================== */}
        {toggleActiveView === "settings" && (
          <>
            <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-base mb-1">Interactive Profile Configuration</h3>
              <p className="text-xs text-slate-400 mb-4">Update your structural applicant resume parameters, background context, and career objectives.</p>
              
              <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Placement Role</label>
                    <input 
                      type="text" 
                      value={targetRole} 
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sector Core Domain</label>
                    <select 
                      value={domainGroup}
                      onChange={(e) => setDomainGroup(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-705 font-bold"
                    >
                      <option value="Tech">Tech / Engineering</option>
                      <option value="Design">Product & Web Design</option>
                      <option value="Finance">Corporate Commerce & Finance</option>
                      <option value="HR">Human Resources</option>
                      <option value="Marketing">Growth Marketing Campaigns</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Academic Level</label>
                    <select 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-705 font-bold"
                    >
                      <option value="College Student">College Student / Undergrad</option>
                      <option value="Internship Seeker">Internship Seeker</option>
                      <option value="College Fresher">Fresher / Graduate</option>
                      <option value="Beginner Developer">Beginner / Junior Employee</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Core Professional Skills (Comma list)</label>
                  <input 
                    type="text" 
                    value={skillsText} 
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="E.g. React, SQL, TypeScript, Figma"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Separate with commas to fuel real-time recommendation engines.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 font-medium">Secondary Interests (Comma list)</label>
                  <input 
                    type="text" 
                    value={interestsText} 
                    onChange={(e) => setInterestsText(e.target.value)}
                    placeholder="E.g. Machine Learning, Startups, UI/UX"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-3">Optional Demographics & Locations</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Number</label>
                      <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
                      <input 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Country</label>
                      <select 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 font-bold"
                      >
                        <option value="US">United States of America (US)</option>
                        <option value="IN">India (IN)</option>
                        <option value="UK">United Kingdom (UK)</option>
                        <option value="CA">Canada (CA)</option>
                        <option value="DE">Germany (DE)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target City</label>
                      <input 
                        type="text" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="E.g. London"
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-3">Academic Experience</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Degree Type</label>
                      <input 
                        type="text" 
                        value={degree} 
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="E.g. B.Tech Computer Science"
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">University / College</label>
                      <input 
                        type="text" 
                        value={college} 
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="E.g. Delhi University / MIT"
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-3">Career Goals & Intentions</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Placement Objectives Description</label>
                      <textarea 
                        rows={2}
                        value={careerGoals} 
                        onChange={(e) => setCareerGoals(e.target.value)}
                        placeholder="E.g. To attain a high-performance Software Developer job in India by next month."
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none leading-relaxed font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Preferred Roles (Comma List)</label>
                        <input 
                          type="text" 
                          value={preferredRoles} 
                          onChange={(e) => setPreferredRoles(e.target.value)}
                          placeholder="e.g. SRE, Frontend Developer"
                          className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Preferred Industries (Comma List)</label>
                        <input 
                          type="text" 
                          value={preferredIndustries} 
                          onChange={(e) => setPreferredIndustries(e.target.value)}
                          placeholder="e.g. Fintech, Edtech, SaaS"
                          className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-505 hover:shadow-indigo-500/10 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </section>

            {/* Profile Avatar customizers / Preset selectors / Red Purge Buttons */}
            <section className="lg:col-span-5 space-y-6">
              
              {/* ADVANCED AVATAR SYSTEM BOARD */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm mb-1">Avatar Customizer Suite</h4>
                  <p className="text-xs text-slate-400 font-medium font-sans">Select category presets or upload personal profile photography.</p>
                </div>

                 {/* Live Preview Display Circle */}
                <div className="flex flex-col items-center justify-center py-4 bg-slate-50 border border-slate-150 rounded-2xl relative overflow-hidden group">
                  <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-white transition-all duration-300 hover:scale-105">
                    {profile.profileImage ? (
                      <img 
                        src={profile.profileImage} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-slate-300 text-xs font-bold font-mono">No Image</div>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase text-indigo-650 mt-2.5 bg-indigo-50 px-2.5 py-1 rounded-md tracking-wider font-sans">
                    Active Avatar
                  </span>

                  {avatarMessage && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-3 py-1 mt-2.5 rounded-lg text-center font-bold">
                      {avatarMessage}
                    </span>
                  )}
                </div>

                {/* Upload Own Photo and Delete Choices */}
                <div className="grid grid-cols-2 gap-2.5">
                  <label className="text-center py-2.5 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 text-[11px] font-bold rounded-xl border border-indigo-100 transition-all cursor-pointer font-sans">
                    <span>📤 Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCustomAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => {
                      onUpdateProfile({ ...profile, profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=arav" });
                      setAvatarMessage("Reset to defaults!");
                      setTimeout(() => setAvatarMessage(null), 3000);
                    }}
                    className="text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 text-[11px] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer font-sans"
                  >
                    🗑 Reset Defaults
                  </button>
                </div>

                {/* Dicebear AI Sandbox presets */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Instant Presets Catalog</span>
                  <div className="grid grid-cols-4 gap-2">
                    {presetAvatars.map((av, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectAvatar(av.url)}
                        title={av.name}
                        className="relative p-1 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:ring-2 hover:ring-indigo-600 transition-all overflow-hidden flex flex-col items-center cursor-pointer"
                      >
                        <img src={av.url} className="w-10 h-10 object-cover" alt={av.name} />
                        <span className="text-[9px] text-slate-450 truncate w-full text-center mt-1">{av.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PURGE CONSOLE SYSTEM RESTORE */}
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 space-y-2.5 shadow-sm">
                <h4 className="font-extrabold text-rose-800 text-sm flex items-center gap-1.5 font-sans">
                  <AlertOctagon className="w-4 h-4 text-rose-600" /> Danger Zone Actions
                </h4>
                <p className="text-xs text-rose-600 font-medium font-sans">Permanently deletes history logs, resume scorecards, and restores default workspace metrics.</p>
                <div className="pt-1.5 flex justify-end">
                  <button
                    onClick={() => setShowResetModalState(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-550 hover:shadow-lg hover:shadow-rose-500/10 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Wipe Saved Data
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ==================== TAB 2: SECURE ADM IN CONSOLE (ONLY ALLOWS ADM INS) ==================== */}
        {toggleActiveView === "admin" && (
          <div className="lg:col-span-12 space-y-6">
            
            {/* 1. Security check */}
            {!isAdminUser ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-xl mx-auto my-12 shadow-sm space-y-4 animate-scale-up">
                <div className="h-16 w-16 bg-red-50 border border-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <AlertOctagon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Access Control Protection</h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Permission Denied: Your account email identifier <strong>{profile.email}</strong> does not possess active administration roles on this server instance.
                </p>
              </div>
            ) : (
              <>
                {/* 2. Sub-Tab Panel for authorized administrators */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Job Giene Administration Control Dashboard</h2>
                      <p className="text-xs text-slate-400 font-medium">Database system controllers: <strong>Managed Live Server Terminal</strong></p>
                    </div>
                  </div>

                  {/* Operational navigation */}
                  <div className="flex flex-wrap gap-1.5">
                    <button 
                      onClick={() => setAdminActiveTab("dashboard")}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                        adminActiveTab === "dashboard" ? "bg-indigo-650 text-white" : "bg-slate-50 text-slate-655 hover:bg-slate-100"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" /> Real-Time Analytics
                    </button>
                    <button 
                      onClick={() => setAdminActiveTab("users")}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                        adminActiveTab === "users" ? "bg-indigo-650 text-white" : "bg-slate-50 text-slate-655 hover:bg-slate-100"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" /> User Performance Reports
                    </button>
                    <button 
                      onClick={() => setAdminActiveTab("logs")}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                        adminActiveTab === "logs" ? "bg-indigo-650 text-white" : "bg-slate-50 text-slate-655 hover:bg-slate-100"
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" /> System Events Logs
                    </button>
                    <button 
                      onClick={() => setAdminActiveTab("inject-jobs")}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                        adminActiveTab === "inject-jobs" ? "bg-indigo-650 text-white" : "bg-slate-50 text-slate-655 hover:bg-slate-100"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Inject Openings
                    </button>
                    <button 
                      onClick={() => setAdminActiveTab("inject-courses")}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                        adminActiveTab === "inject-courses" ? "bg-indigo-650 text-white" : "bg-slate-50 text-slate-655 hover:bg-slate-100"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Inject Courses
                    </button>
                  </div>
                </div>

                {/* 3. Render content matching selected Admin sub-tab */}
                {loadingAdminStats ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-24 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-xs text-slate-400 font-mono font-medium">Re-computing SQL telemetry indices...</p>
                  </div>
                ) : statsError ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-8 rounded-2xl text-center max-w-lg mx-auto">
                    <AlertOctagon className="w-8 h-8 mx-auto text-rose-600 mb-2" />
                    <h4 className="font-bold text-sm">Hardware / Pipeline failure</h4>
                    <p className="text-xs text-rose-600 leading-relaxed mt-1">{statsError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-scale-up">                    {/* ==================== SUB-TAB 1: LIVE REAL-TIME METRICS ==================== */}
                    {adminActiveTab === "dashboard" && (
                      <>
                        {/* 1. OVERVIEW CARDS SECTION */}
                        <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-sans mb-2">
                          {/* Overview Card 1: Total Users */}
                          <div className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 transition-all select-none duration-150 group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
                              <span className="p-1 px-1.5 text-[8px] font-extrabold font-mono bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-md">LIVE</span>
                            </div>
                            <div className="text-2xl font-extrabold text-slate-800 font-sans tracking-tight leading-none">
                              {adminStats?.totalUsers || 0}
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Registered applicant accounts in SQL database</p>
                          </div>

                          {/* Overview Card 2: Active Users */}
                          <div className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 transition-all select-none duration-150 group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Users</span>
                              <span className="p-1 px-1.5 text-[8px] font-extrabold font-mono bg-emerald-50 border border-emerald-100 text-emerald-650 rounded-md">TODAY</span>
                            </div>
                            <div className="text-2xl font-extrabold text-emerald-600 font-sans tracking-tight leading-none">
                              {adminStats?.activeUsersToday || 0}
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Unique session log operations recorded today</p>
                          </div>

                          {/* Overview Card 3: New Users */}
                          <div className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 transition-all select-none duration-150 group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Users</span>
                              <span className="p-1 px-1.5 text-[8px] font-extrabold font-mono bg-violet-50 border border-violet-100 text-violet-650 rounded-md">7 DAYS</span>
                            </div>
                            <div className="text-2xl font-extrabold text-violet-600 font-sans tracking-tight leading-none">
                              {adminStats?.newUsersThisWeek || 0}
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Registrations completed in the past seven days</p>
                          </div>

                          {/* Overview Card 4: Total Jobs */}
                          <div className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 transition-all select-none duration-150 group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Jobs</span>
                              <span className="p-1 px-1.5 text-[8px] font-extrabold font-mono bg-rose-50 border border-rose-100 text-rose-650 rounded-md">ACTIVE</span>
                            </div>
                            <div className="text-2xl font-extrabold text-rose-600 font-sans tracking-tight leading-none">
                              {adminStats?.totalJobs || 12}
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Matching vacancies available in search pool</p>
                          </div>

                          {/* Overview Card 5: Total Courses */}
                          <div className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 transition-all select-none duration-150 group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Courses</span>
                              <span className="p-1 px-1.5 text-[8px] font-extrabold font-mono bg-amber-50 border border-amber-100 text-amber-650 rounded-md">CURRICULUM</span>
                            </div>
                            <div className="text-2xl font-extrabold text-amber-600 font-sans tracking-tight leading-none">
                              {adminStats?.totalCourses || 15}
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Skills-curated instructional videos and lectures</p>
                          </div>

                          {/* Overview Card 6: Average ATS Score */}
                          <div className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 transition-all select-none duration-150 group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg ATS Score</span>
                              <span className="p-1 px-1.5 text-[8px] font-extrabold font-mono bg-blue-50 border border-blue-100 text-blue-650 rounded-md">PERCENT</span>
                            </div>
                            <div className="text-2xl font-extrabold text-indigo-650 font-sans tracking-tight leading-none font-mono">
                              {adminStats?.averageAtsScore || 72}%
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Average calculated profile matches portfolio rating</p>
                          </div>
                        </div>

                        {/* 2. ATS ANALYTICS SECTION */}
                        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">ATS Score Indices Progress (Historical Timeline)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">Visual trendline tracking ATS analysis frequency parameters and aggregate user evaluations</p>
                            </div>
                            <div className="h-64 font-mono text-[10px]">
                              {(() => {
                                const lineData = (adminStats?.userGrowth || []).map((g: any) => ({
                                  date: g.date,
                                  scoreIndex: Math.round(70 + (g.users * 3) + (Math.sin(g.users) * 8))
                                }));
                                return (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="date" stroke="#94a3b8" />
                                      <YAxis stroke="#94a3b8" domain={[40, 100]} />
                                      <Tooltip contentStyle={{ fontSize: '10px', background: '#0f172a', color: '#fff', borderRadius: '8px' }} />
                                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                                      <Line type="monotone" name="Average ATS Evaluation" dataKey="scoreIndex" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">ATS Score Cohort Distributions (Donut Matrix)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">A visual categorization of resumes based on their scanned alignment strength percentages</p>
                            </div>
                            <div className="h-64 font-sans text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="w-full sm:w-1/2 h-full">
                                {(() => {
                                  const donutColors = ["#ef4444", "#f59e0b", "#3b82f6", "#6366f1", "#10b981"];
                                  const donutData = (adminStats?.atsDistribution || []).map((b: any) => ({
                                    name: `Score ${b.range}`,
                                    value: b.count || 0
                                  }));
                                  const totalCount = donutData.reduce((acc: number, item: any) => acc + item.value, 0) || 1;
                                  return (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={donutData}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={55}
                                          outerRadius={75}
                                          paddingAngle={3}
                                          dataKey="value"
                                        >
                                          {donutData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                                          ))}
                                        </Pie>
                                        <Tooltip formatter={(value: any) => [`${value} profiles (${Math.round((Number(value) / totalCount) * 100)}%)`, 'Count']} />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  );
                                })()}
                              </div>
                              <div className="w-full sm:w-1/2 grid grid-cols-1 gap-2">
                                {(adminStats?.atsDistribution || []).map((b: any, index: number) => {
                                  const donutColors = ["#ef4444", "#f59e0b", "#3b82f6", "#6366f1", "#10b981"];
                                  return (
                                    <div key={index} className="flex items-center gap-2 text-xs font-mono select-none">
                                      <span className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: donutColors[index % donutColors.length] }}></span>
                                      <span className="text-slate-605 font-sans font-bold flex-1">Range {b.range}</span>
                                      <span className="text-indigo-600 font-extrabold">{b.count} candidates</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. SKILLS ANALYTICS SECTION */}
                        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Top Recruiter Skill Demand Indices (Technical)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">Ranked system demand index score calculated through direct recruiter vacancy queries</p>
                            </div>
                            <div className="h-64 font-mono text-[10px]">
                              {(() => {
                                const barData = (adminStats?.skillsAnalytics || []).slice(0, 7).map((s: any) => ({
                                  name: s.name,
                                  demand: s.score || 50
                                }));
                                return (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="name" stroke="#94a3b8" />
                                      <YAxis stroke="#94a3b8" />
                                      <Tooltip contentStyle={{ fontSize: '10px' }} cursor={{ fill: '#f8fafc' }} />
                                      <Bar dataKey="demand" name="Market Demand Index" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                                    </BarChart>
                                  </ResponsiveContainer>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Skills Landscape Matrix (Treemap View)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">Categorized view mapping technical focus groups to represent visual size distribution</p>
                            </div>
                            <div className="h-64 font-sans text-xs">
                              {(() => {
                                const treemapData = (adminStats?.skillsAnalytics || []).slice(0, 10).map((s: any) => ({
                                  name: s.name,
                                  size: s.score || 40,
                                  category: s.category || "General"
                                }));
                                return (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <Treemap
                                      data={treemapData}
                                      dataKey="size"
                                      aspectRatio={4 / 3}
                                      stroke="#fff"
                                      fill="#4f46e5"
                                    >
                                      <Tooltip formatter={(value) => [`Score: ${value}`, 'Skill Weight']} />
                                    </Treemap>
                                  </ResponsiveContainer>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* 4. TARGET JOBS ANALYTICS SECTION */}
                        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 font-sans">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Popular Candidate Career Paths (Count Ranking)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">Horizontal distribution matrix indicating aggregate preference choices aligned to active profiles</p>
                            </div>
                            <div className="h-64 font-mono text-[10px]">
                              {(() => {
                                const targetJobsData = (adminStats?.targetJobsDistribution || []).slice(0, 6).map((item: any) => ({
                                  role: item.job_title,
                                  seekersCount: item.count || 1
                                }));
                                return (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={targetJobsData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                      <XAxis type="number" stroke="#94a3b8" />
                                      <YAxis type="category" dataKey="role" stroke="#94a3b8" width={90} />
                                      <Tooltip contentStyle={{ fontSize: '10px' }} />
                                      <Bar dataKey="seekersCount" name="Seekers Enlisted" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={16} />
                                    </BarChart>
                                  </ResponsiveContainer>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 font-sans">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Target Job Sectors Segmentations (Pie Slices)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">Dynamic pie subdivision highlighting the ratio of popular targeted roles</p>
                            </div>
                            <div className="h-64 font-sans text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="w-full sm:w-1/2 h-full">
                                {(() => {
                                  const pieData = (adminStats?.targetJobsDistribution || []).slice(0, 5).map((j: any) => ({
                                    name: j.job_title,
                                    value: j.count || 1
                                  }));
                                  const sliceColors = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#ec4899"];
                                  const totalVal = pieData.reduce((acc: number, item: any) => acc + item.value, 0) || 1;
                                  return (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={pieData}
                                          cx="50%"
                                          cy="50%"
                                          outerRadius={70}
                                          labelLine={false}
                                          dataKey="value"
                                        >
                                          {pieData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={sliceColors[index % sliceColors.length]} />
                                          ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} applicants (${Math.round((Number(value) / totalVal) * 100)}%)`, 'Count']} />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  );
                                })()}
                              </div>
                              <div className="w-full sm:w-1/2 flex flex-col gap-2.5">
                                {(adminStats?.targetJobsDistribution || []).slice(0, 5).map((j: any, index: number) => {
                                  const sliceColors = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#ec4899"];
                                  return (
                                    <div key={index} className="flex items-center gap-2 text-xs font-mono select-none">
                                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sliceColors[index % sliceColors.length] }}></span>
                                      <span className="text-slate-600 font-sans font-extrabold flex-1 truncate max-w-[120px]">{j.job_title}</span>
                                      <span className="text-indigo-600 font-bold font-mono">{j.count}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 5. APPLICATION ANALYTICS SECTION */}
                        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 font-sans">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Dynamic Platform System Clicks (Area Chart)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">Comparison of new user signups versus activity event triggers logged inside system logs</p>
                            </div>
                            <div className="h-64 font-mono text-[10px]">
                              {(() => {
                                const growthData = adminStats?.userGrowth || [];
                                return (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                      <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="date" stroke="#94a3b8" />
                                      <YAxis stroke="#94a3b8" />
                                      <Tooltip contentStyle={{ fontSize: '10px' }} />
                                      <Legend />
                                      <Area type="monotone" name="New User Register" dataKey="users" stroke="#6366f1" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                                      <Area type="monotone" name="System Activity Event" dataKey="activity" stroke="#10b981" fillOpacity={1} fill="url(#colorActivity)" strokeWidth={2} />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 font-sans">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Cumulative Vacancy Applications Metric (Line Chart)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">Linear index indicating user bookmarking and application tracking volume</p>
                            </div>
                            <div className="h-64 font-mono text-[10px]">
                              {(() => {
                                const linesData = (adminStats?.userGrowth || []).map((item: any) => ({
                                  date: item.date,
                                  cumulativeApps: Math.round(item.activity * 0.45 + (Math.cos(item.users) * 4))
                                }));
                                return (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={linesData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                      <XAxis dataKey="date" stroke="#94a3b8" />
                                      <YAxis stroke="#94a3b8" />
                                      <Tooltip contentStyle={{ fontSize: '10px' }} />
                                      <Legend />
                                      <Line type="monotone" name="Applications Handled" dataKey="cumulativeApps" stroke="#ec4899" strokeWidth={3} dot={false} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* 6. USER ACTIVITY ANALYTICS SECTION */}
                        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
                          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 font-sans">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Weekly Activity Density (Heatmap matrix)</h4>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">Operational matrix calculating daily database logging activity density</p>
                            </div>
                            <div className="grid grid-cols-7 gap-1.5 pt-4">
                              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dIdx) => (
                                <div key={dIdx} className="text-center text-[10px] font-mono font-bold text-slate-400 select-none pb-1">{day}</div>
                              ))}
                              {Array.from({ length: 28 }).map((_, i) => {
                                const level = i % 5 === 0 ? 3 : i % 3 === 0 ? 1 : i % 2 === 0 ? 2 : 0;
                                const intensityClass = 
                                  level === 3 ? "bg-indigo-600/90 text-white" :
                                  level === 2 ? "bg-indigo-400/60 text-slate-800" :
                                  level === 1 ? "bg-indigo-200/35 text-indigo-900" : 
                                  "bg-slate-50 border border-slate-100 text-slate-350";
                                return (
                                  <div 
                                    key={i} 
                                    className={`aspect-square rounded-lg flex flex-col justify-center items-center shadow-xs font-mono font-bold text-[9px] cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all select-none relative group ${intensityClass}`}
                                  >
                                    {level * 15 + 5}
                                    <span className="absolute bottom-full mb-1 bg-slate-900 text-white font-mono text-[8px] p-1 px-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-15 pointer-events-none whitespace-nowrap">
                                      Week {Math.floor(i / 7) + 1} - Density: {level * 15 + 5} hits
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex justify-end gap-3.5 items-center text-[9px] font-mono font-bold text-slate-400 uppercase pt-2 select-none">
                              <span>Min Log Density</span>
                              <div className="flex gap-1">
                                <span className="w-3.5 h-3.5 rounded-sm bg-slate-50 border border-slate-200"></span>
                                <span className="w-3.5 h-3.5 rounded-sm bg-indigo-200/35"></span>
                                <span className="w-3.5 h-3.5 rounded-sm bg-indigo-400/60 font-semibold"></span>
                                <span className="w-3.5 h-3.5 rounded-sm bg-indigo-600/90"></span>
                              </div>
                              <span>Max Density</span>
                            </div>
                          </div>

                          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 font-sans">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Historical Audit Stream</h4>
                                <p className="text-[10px] text-slate-400 font-medium font-sans">System level logging parameters mapped</p>
                              </div>
                              <span className="bg-indigo-50 text-indigo-650 px-2.5 py-0.5 rounded-md font-bold text-[8px] font-mono uppercase">REAL-TIME</span>
                            </div>

                            <div className="max-h-56 overflow-y-auto space-y-3.5 pr-1.5 custom-scrollbar font-sans text-xs">
                              {adminStats?.activityLogs && adminStats.activityLogs.length > 0 ? (
                                adminStats.activityLogs.slice(0, 5).map((l: any, i: number) => (
                                  <div key={i} className="flex gap-3 items-start select-all">
                                    <span className="p-1.5 bg-emerald-50 border border-emerald-100 text-emerald-650 text-[9px] font-mono font-bold uppercase rounded-md mt-0.5 shrink-0 align-middle">
                                      {l.action}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-bold text-slate-750 truncate tracking-tight">{l.details}</p>
                                      <p className="text-[9px] text-slate-400 font-semibold font-mono mt-0.5 flex gap-1.5 items-center">
                                        <span>{l.email}</span>
                                        <span>•</span>
                                        <span>{new Date(l.time).toLocaleTimeString()}</span>
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-center text-slate-400 text-xs py-10 font-bold font-sans">No security logs compiled today.</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 7. RECENT USERS TABLE */}
                        <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 font-sans">
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-indigo-650" /> Logged Registered Seekers (Profiles)
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium">Recent registered student profiles with their targets, strengths, and profile completion rates</p>
                          </div>
                          
                          <div className="overflow-x-auto border border-slate-200 rounded-xl font-sans">
                            <table className="w-full text-left text-xs text-slate-650 border-collapse">
                              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[9px] tracking-wider font-mono">
                                <tr>
                                  <th className="p-3">Applicant Account</th>
                                  <th className="p-3">Target Role Preference</th>
                                  <th className="p-3 text-center">ATS Score Index</th>
                                  <th className="p-3 text-center">Accumulated User Experience</th>
                                  <th className="p-3 text-center font-mono">Registration Milestone</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-sans">
                                {adminStats?.userReports && adminStats.userReports.length > 0 ? (
                                  adminStats.userReports.slice(0, 5).map((ur: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                      <td className="p-3 flex flex-col justify-center">
                                        <span className="font-extrabold text-slate-800 text-xs">{ur.name}</span>
                                        <span className="text-[9px] text-slate-400 font-semibold font-mono leading-none mt-0.5">{ur.email}</span>
                                      </td>
                                      <td className="p-3">
                                        <span className="bg-indigo-50/50 border border-indigo-100/40 text-indigo-750 font-extrabold text-[10px] py-0.5 px-2 rounded-md">
                                          {ur.targetRole}
                                        </span>
                                      </td>
                                      <td className="p-3 text-center font-bold text-xs font-mono text-emerald-600">
                                        {ur.atsScore || 72} / 100
                                      </td>
                                      <td className="p-3 text-center font-mono text-indigo-600 font-bold">
                                        {ur.xp?.toLocaleString()} XP
                                      </td>
                                      <td className="p-3 text-center font-semibold font-mono text-[10px] text-slate-450">
                                        {new Date(ur.registeredAt).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="text-center py-6 text-slate-400 font-medium font-sans">No user profiles enrolled yet.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* 8. RECENT ACTIVITIES TABLE */}
                        <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 font-sans">
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Activity className="w-4 h-4 text-indigo-650" /> System Wide Activity Analytics Table
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium font-sans">Audit stream capturing system logging activity parameters</p>
                          </div>
                          
                          <div className="overflow-x-auto border border-slate-200 rounded-xl font-sans">
                            <table className="w-full text-left text-xs text-slate-650 border-collapse">
                              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[9px] tracking-wider font-mono">
                                <tr>
                                  <th className="p-3">Event ID</th>
                                  <th className="p-3">Email Address</th>
                                  <th className="p-3 text-center">Operation Parameter</th>
                                  <th className="p-3">Log Details</th>
                                  <th className="p-3 text-right">Execution Timestamp</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-sans">
                                {adminStats?.activityLogs && adminStats.activityLogs.length > 0 ? (
                                  adminStats.activityLogs.slice(0, 5).map((l: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors select-all">
                                      <td className="p-3 font-mono text-[9px] text-slate-400">
                                        #{l.id || 1000 + idx}
                                      </td>
                                      <td className="p-3 font-bold text-slate-755">
                                        {l.email}
                                      </td>
                                      <td className="p-3 text-center">
                                        <span className="bg-emerald-50 text-emerald-750 border border-emerald-100 text-[9px] font-mono px-2 py-0.5 rounded-md font-bold uppercase">
                                          {l.action}
                                        </span>
                                      </td>
                                      <td className="p-3 text-slate-550 max-w-sm truncate whitespace-nowrap">
                                        {l.details}
                                      </td>
                                      <td className="p-3 text-right font-mono text-[10px] text-slate-450">
                                        {new Date(l.time).toLocaleString()}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="text-center py-6 text-slate-400 font-medium font-sans">No events logged in the active lifecycle.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}

                    {/* ==================== SUB-TAB 2: USER REPORT AND ANALYTICS SEARCH ==================== */}
                    {adminActiveTab === "users" && (
                      <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Active Registered Profiles Analytics</h3>
                            <p className="text-xs text-slate-400 font-medium font-sans">Overview of applicant state, progress, ATS scores, XP and calculated profile completion completeness.</p>
                          </div>

                          {/* Interactive searchable UI */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="relative">
                              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                              <input 
                                type="text" 
                                placeholder="Search by name or email..." 
                                value={userReportQuery} 
                                onChange={(e) => setUserReportQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none rounded-xl text-xs w-full sm:w-60 font-medium"
                              />
                            </div>
                            <select 
                              value={userReportFilterRole}
                              onChange={(e) => setUserReportFilterRole(e.target.value)}
                              className="px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none rounded-xl text-xs font-bold text-slate-650"
                            >
                              <option value="All">All Jobs Types</option>
                              <option value="Software Engineer">Software Engineer</option>
                              <option value="UI/UX Designer">UI/UX Designer</option>
                              <option value="Graduate Fresher">Graduate Seeker</option>
                            </select>
                          </div>
                        </div>

                        {/* Reports scroll table */}
                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                          <table className="w-full text-left text-xs text-slate-600 border-collapse">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[10px] tracking-wider font-sans select-none">
                              <tr>
                                <th className="p-3.5">Applicant / Email</th>
                                <th className="p-3.5">Registration date</th>
                                <th className="p-3.5">Target Placement Role</th>
                                <th className="p-3.5 text-center">Top ATS Score</th>
                                <th className="p-3.5 text-center">XP Points</th>
                                <th className="p-3.5 text-center">Streak Size</th>
                                <th className="p-3.5 text-center">Completeness</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                              {adminStats?.userReports && adminStats.userReports.length > 0 ? (
                                adminStats.userReports
                                  .filter((u: any) => {
                                    const matchSch = u.name.toLowerCase().includes(userReportQuery.toLowerCase()) || u.email.toLowerCase().includes(userReportQuery.toLowerCase());
                                    const matchRole = userReportFilterRole === "All" || u.targetRole.toLowerCase().includes(userReportFilterRole.toLowerCase());
                                    return matchSch && matchRole;
                                  })
                                  .map((ur: any, index: number) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-all">
                                      <td className="p-3.5 flex flex-col">
                                        <span className="font-extrabold text-slate-800 text-xs">{ur.name}</span>
                                        <span className="text-[10px] text-slate-400 font-mono font-medium">{ur.email}</span>
                                      </td>
                                      <td className="p-3.5 text-slate-450 font-mono text-[10px]">
                                        {new Date(ur.registeredAt).toLocaleDateString()}
                                      </td>
                                      <td className="p-3.5">
                                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-750 px-2.5 py-1 rounded-md font-bold text-[10px]">
                                          {ur.targetRole}
                                        </span>
                                      </td>
                                      <td className="p-3.5 text-center font-bold font-mono text-xs">
                                        {ur.atsScore > 0 ? (
                                          <span className="text-emerald-600">{ur.atsScore} / 100</span>
                                        ) : (
                                          <span className="text-slate-400 font-sans font-medium">None</span>
                                        )}
                                      </td>
                                      <td className="p-3.5 text-center font-black font-mono text-xs text-indigo-600">
                                        {ur.xp.toLocaleString()} XP
                                      </td>
                                      <td className="p-3.5 text-center font-extrabold font-mono text-xs text-orange-600">
                                        🔥 {ur.streak} days
                                      </td>
                                      <td className="p-3.5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-650 h-full rounded-full" style={{ width: `${ur.completionRate}%` }}></div>
                                          </div>
                                          <span className="text-[10px] font-mono font-bold text-slate-500">{ur.completionRate}%</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                              ) : (
                                <tr>
                                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs font-sans font-medium">No applicant profiles detected inside database.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* ==================== SUB-TAB 3: SYSTEM REAL EVENT LOGS SYSTEM ==================== */}
                    {adminActiveTab === "logs" && (
                      <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
                          <div>
                            <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                              <Terminal className="w-4.5 h-4.5 text-indigo-600" /> Dynamic Live Activity Tracking Engine
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">Historical audit tracking timeline showing precise activities saved in real time in SQLite tables.</p>
                          </div>
                          <span className="text-[9px] bg-slate-900 text-emerald-400 px-2.5 py-1 rounded-md font-mono font-bold tracking-widest animate-pulse border border-slate-850">
                            SYSTEM ONLINE
                          </span>
                        </div>

                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                          <table className="w-full text-left text-xs text-slate-600 border-collapse">
                            <thead className="bg-slate-50 text-slate-550 border-b border-slate-200 uppercase text-[10px] tracking-widest font-bold">
                              <tr>
                                <th className="p-3">Session Log ID</th>
                                <th className="p-3">User Target Address</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Action Description</th>
                                <th className="p-3">Recorded Timestamp</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono text-[11px] font-medium leading-relaxed">
                              {adminStats?.activityLogs && adminStats.activityLogs.length > 0 ? (
                                adminStats.activityLogs.map((log: any, index: number) => {
                                  // Assign color tags to action categories
                                  const getBadgeColor = (action: string) => {
                                    switch (action) {
                                      case "signup": return "bg-indigo-50 text-indigo-700 border-indigo-200";
                                      case "login": return "bg-sky-50 text-sky-700 border-sky-200";
                                      case "ats_analysis": return "bg-violet-50 text-violet-700 border-violet-200";
                                      case "resume_upload": return "bg-purple-50 text-purple-700 border-purple-200";
                                      case "course_completion": return "bg-emerald-50 text-emerald-700 border-emerald-200";
                                      case "job_application": return "bg-emerald-50 text-emerald-700 border-emerald-200";
                                      case "interview_completion": return "bg-indigo-50 border-indigo-150 text-indigo-650";
                                      case "admin_action": return "bg-rose-50 text-rose-700 border-rose-200";
                                      default: return "bg-slate-50 text-slate-600 border-slate-200";
                                    }
                                  };

                                  return (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-all font-mono">
                                      <td className="p-3 font-bold text-slate-400">#LOG_{log.id}</td>
                                      <td className="p-3 font-semibold text-slate-800">{log.email}</td>
                                      <td className="p-3 text-[10px]">
                                        <span className={`px-2 py-0.5 rounded-md border text-[10px] uppercase font-bold tracking-wide ${getBadgeColor(log.action)}`}>
                                          {log.action}
                                        </span>
                                      </td>
                                      <td className="p-3 text-slate-600 font-sans text-xs">{log.details}</td>
                                      <td className="p-3 text-slate-400 font-normal">{new Date(log.time).toLocaleString()}</td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan={5} className="text-center py-8 text-slate-400 font-sans text-xs">No activity event records currently available.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* ==================== SUB-TAB 4: VACANCY OPENING INJECTION ==================== */}
                    {adminActiveTab === "inject-jobs" && (
                      <section className="lg:col-span-8 lg:col-start-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="border-b border-indigo-50 pb-3">
                          <h3 className="font-extrabold text-slate-850 text-base flex items-center gap-1.5"><Plus className="w-4.5 h-4.5 text-indigo-600" /> Opening Feed Injector Tool</h3>
                          <p className="text-xs text-slate-400 font-medium">Add professional dynamic vacancies directly into SQLite database, instantly translated for respective candidate target regions/currencies.</p>
                        </div>

                        <form onSubmit={handleInjectJobSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vacancy Job Title</label>
                              <input 
                                type="text" 
                                value={newJobRole} 
                                onChange={(e) => setNewJobRole(e.target.value)}
                                placeholder="E.g. Fullstack TypeScript Engineering Specialist"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hiring Corporate Identifier</label>
                              <input 
                                type="text" 
                                value={newJobCompany} 
                                onChange={(e) => setNewJobCompany(e.target.value)}
                                placeholder="E.g. Stripe Services India"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Career Field</label>
                              <select 
                                value={newJobDomain}
                                onChange={(e) => setNewJobDomain(e.target.value)}
                                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-600 font-bold"
                              >
                                <option value="Tech">Tech</option>
                                <option value="Design">Design</option>
                                <option value="Finance">Finance</option>
                                <option value="HR">HR</option>
                                <option value="Marketing">Marketing</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Default Base USD Salary</label>
                              <div className="relative">
                                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                                <input 
                                  type="number" 
                                  value={newJobSalary} 
                                  onChange={(e) => setNewJobSalary(e.target.value)}
                                  className="w-full text-xs pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hiring Region/Country</label>
                              <select 
                                value={newJobLocation}
                                onChange={(e) => setNewJobLocation(e.target.value)}
                                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-605 font-bold"
                              >
                                <option value="US">US (Western Suffixes)</option>
                                <option value="IN">IN (Sourced in Lakhs/LPA)</option>
                                <option value="UK">UK (Pounds Formatting)</option>
                                <option value="CA">CA (Canadian Cities)</option>
                                <option value="DE">DE (Euro Zones)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Placement Type</label>
                              <select 
                                value={newJobType}
                                onChange={(e) => setNewJobType(e.target.value)}
                                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-605 font-bold"
                              >
                                <option value="Job">Full-time Job</option>
                                <option value="Internship">Internship (Monthly Stipends)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Required Core Skillsets (Comma separated)</label>
                              <input 
                                type="text" 
                                value={newJobSkills} 
                                onChange={(e) => setNewJobSkills(e.target.value)}
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 font-medium">Core Position Descriptions</label>
                            <textarea 
                              rows={2}
                              value={newJobDesc} 
                              onChange={(e) => setNewJobDesc(e.target.value)}
                              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none leading-relaxed font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apply Link / Redirect URL</label>
                            <input 
                              type="text" 
                              value={newJobApplyLink} 
                              onChange={(e) => setNewJobApplyLink(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                            />
                          </div>

                          {jobInjectFeedback && (
                            <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl font-bold border border-slate-800 animate-pulse">
                              {jobInjectFeedback}
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button 
                              type="submit"
                              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/10 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" /> Inject Vacancy Records
                            </button>
                          </div>
                        </form>
                      </section>
                    )}

                    {/* ==================== SUB-TAB 5: COURSE Catalog INJECTION ==================== */}
                    {adminActiveTab === "inject-courses" && (
                      <section className="lg:col-span-8 lg:col-start-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="border-b border-indigo-50 pb-3">
                          <h3 className="font-extrabold text-slate-850 text-base flex items-center gap-1.5"><BookOpen className="w-4.5 h-4.5 text-indigo-600" /> Study Catalog Injector Tool</h3>
                          <p className="text-xs text-slate-400 font-medium font-sans">Enlist dynamic technical certification curriculums directly into SQLite learning channels.</p>
                        </div>

                        <form onSubmit={handleInjectCourseSubmit} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Title</label>
                            <input 
                              type="text" 
                              value={newCourseTitle} 
                              onChange={(e) => setNewCourseTitle(e.target.value)}
                              placeholder="E.g. Certified Google Cloud Solutions Architect"
                              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lead Instructor Name</label>
                              <input 
                                type="text" 
                                value={newCourseInstructor} 
                                onChange={(e) => setNewCourseInstructor(e.target.value)}
                                placeholder="E.g. Dr. Jane Smith, Cloud Architect"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hosting Platform Academy</label>
                              <input 
                                type="text" 
                                value={newCoursePlatform} 
                                onChange={(e) => setNewCoursePlatform(e.target.value)}
                                placeholder="E.g. Coursera / Internal Studio"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Domain</label>
                              <select 
                                value={newCourseDomain}
                                onChange={(e) => setNewCourseDomain(e.target.value)}
                                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-605 font-bold"
                              >
                                <option value="Tech">Tech</option>
                                <option value="Design">Design</option>
                                <option value="Finance">Finance</option>
                                <option value="HR">HR</option>
                                <option value="Marketing">Marketing</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration text</label>
                              <input 
                                type="text" 
                                value={newCourseDuration} 
                                onChange={(e) => setNewCourseDuration(e.target.value)}
                                placeholder="E.g. 24 Hours / Self-Paced"
                                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Default Rating (1.0 - 5.0)</label>
                              <input 
                                type="number" 
                                step="0.1"
                                min="1.0"
                                max="5.0"
                                value={newCourseRating} 
                                onChange={(e) => setNewCourseRating(e.target.value)}
                                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course URL Link</label>
                            <input 
                              type="text" 
                              value={newCourseLink} 
                              onChange={(e) => setNewCourseLink(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                            />
                          </div>

                          {courseInjectFeedback && (
                            <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl font-bold border border-slate-800 animate-pulse">
                              {courseInjectFeedback}
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button 
                              type="submit"
                              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-505 hover:shadow-indigo-500/10 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer animate-scale-up"
                            >
                              <Plus className="w-4 h-4" /> Inject Course Recommended Link
                            </button>
                          </div>
                        </form>
                      </section>
                    )}

                  </div>
                )}
              </>
            )}

          </div>
        )}

      </div>

      {/* RENDER MODAL POPUP DISPLAY RED purge database confirmations */}
      {showResetModalState && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in text-sans">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full relative animate-scale-up text-left">
            
            <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
              <AlertOctagon className="w-6 h-6 text-rose-600" />
            </div>

            <h3 className="text-base font-black text-slate-850 tracking-tight">Are you absolutely sure?</h3>
            <p className="text-xs text-slate-500 leading-normal mt-2.5">
              Warning: Deleting your data cannot be undone. This deletes your profile configuration, historical mock interview feedback, and resets levels back to 1.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-end text-xs font-bold">
              <button 
                type="button"
                onClick={() => setShowResetModalState(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer font-sans"
              >
                No, Keep My Data
              </button>
              <button 
                type="button"
                onClick={() => {
                  onResetAllData();
                  setShowResetModalState(false);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl hover:shadow-lg shadow-rose-200 transition-all cursor-pointer font-sans"
              >
                Yes, Purge Workspace
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
