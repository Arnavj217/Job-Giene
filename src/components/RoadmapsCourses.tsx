import React, { useState, useEffect } from "react";
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  CheckCircle2,
  Award, 
  Search, 
  ArrowRight, 
  ExternalLink,
  Cpu,
  RefreshCw,
  FolderLock,
  Clock,
  Users,
  Bookmark
} from "lucide-react";
import { Profile, CourseMaterial, CareerRoadmap } from "../types";
import { recordActivityStreak } from "../utils/streak";

interface RoadmapsCoursesProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
  initialTab?: "roadmaps" | "courses" | "saved";
}

export default function RoadmapsCourses({ profile, onUpdateProfile, initialTab = "roadmaps" }: RoadmapsCoursesProps) {
  const [activeSubSection, setActiveSubSection] = useState<"roadmaps" | "courses" | "saved" >(initialTab);
  
  // Roadmaps States
  const [targetRoleGoals, setTargetRoleGoals] = useState(profile.targetRole || "Frontend Developer");
  const [customSkillsInput, setCustomSkillsInput] = useState(profile.skills.join(", "));
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState<CareerRoadmap | null>(
    profile.roadmaps.length > 0 ? profile.roadmaps[0] : null
  );
  
  // Selected timeline node key tracking for active detailed visualization card
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(0);

  // Courses States
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourseDomain, setSelectedCourseDomain] = useState("All");
  const [courses, setCourses] = useState<CourseMaterial[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);

  // Saved and completed courses tracking states
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(profile.savedCourses || []);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>(profile.completedCourses || []);

  useEffect(() => {
    if (profile.savedCourses) {
      setSavedCourseIds(profile.savedCourses);
    }
  }, [profile.savedCourses]);

  useEffect(() => {
    if (profile.completedCourses) {
      setCompletedCourseIds(profile.completedCourses);
    }
  }, [profile.completedCourses]);

  const toggleSaveCourse = (id: string) => {
    const next = savedCourseIds.includes(id)
      ? savedCourseIds.filter(item => item !== id)
      : [...savedCourseIds, id];
    setSavedCourseIds(next);
    onUpdateProfile({
      ...profile,
      savedCourses: next
    });
  };

  const toggleCompleteCourse = (id: string, title: string) => {
    const isNowCompleted = !completedCourseIds.includes(id);
    const next = isNowCompleted
      ? [...completedCourseIds, id]
      : completedCourseIds.filter(item => item !== id);
    setCompletedCourseIds(next);

    // Provide immediate gamified reward feedback on student profile!
    const rewardXp = 150;
    const prevCompleted = profile.completedNodes || [];
    const courseTaskKey = `course-done-${id}`;
    
    let newCompletedList = [...prevCompleted];
    let newXp = profile.xp;
    
    if (isNowCompleted) {
      if (!newCompletedList.includes(courseTaskKey)) {
        newCompletedList.push(courseTaskKey);
        newXp += rewardXp;
      }
    } else {
      if (newCompletedList.includes(courseTaskKey)) {
        newCompletedList = newCompletedList.filter(k => k !== courseTaskKey);
        newXp = Math.max(0, newXp - rewardXp);
      }
    }

    onUpdateProfile({
      ...profile,
      xp: newXp,
      level: Math.floor(1 + newXp / 500),
      completedNodes: newCompletedList,
      completedCourses: next
    });
  };

  // Helper domains mapping
  const domains = ["All", "Tech", "Finance", "Marketing", "HR", "MBA/Business", "Commerce"];

  // Reward overlay animations keys
  const [showRewardAnimation, setShowRewardAnimation] = useState<{ xpAdded: number; activeNodeTitle: string } | null>(null);
  const [animateXpValue, setAnimateXpValue] = useState(0);

  const handleCompleteRoadmapNode = (nodeId: string, nodeTitle: string, index: number) => {
    if (!activeRoadmap) return;
    
    const combinedKey = `${activeRoadmap.id}-${nodeId}`;
    const alreadyCompleted = profile.completedNodes?.includes(combinedKey);
    if (alreadyCompleted) {
      alert("This phase is already marked as completed!");
      return;
    }

    // Determine specific XP thresholds based on difficulty/phase index
    let rewardXp = 100; // Medium default
    if (nodeTitle.toLowerCase().includes("beginner") || nodeTitle.toLowerCase().includes("fundamental") || index === 0) {
      rewardXp = 50;
    } else if (nodeTitle.toLowerCase().includes("advanced") || nodeTitle.toLowerCase().includes("expert") || index >= 2) {
      rewardXp = 250;
    }

    // Initialize the count up award overlay
    setShowRewardAnimation({
      xpAdded: rewardXp,
      activeNodeTitle: nodeTitle
    });
    setAnimateXpValue(0);

    let startVal = 0;
    const increment = Math.max(1, Math.floor(rewardXp / 12));
    const timer = setInterval(() => {
      startVal += increment;
      if (startVal >= rewardXp) {
        setAnimateXpValue(rewardXp);
        clearInterval(timer);
        setTimeout(() => setShowRewardAnimation(null), 3000);
      } else {
        setAnimateXpValue(startVal);
      }
    }, 40);

    const prevCompleted = profile.completedNodes || [];
    const newCompletedList = [...prevCompleted, combinedKey];
    const newXp = profile.xp + rewardXp;
    
    // Complete correspond task item representing this developmental step
    const newCompletedTasks = [...profile.completedTasks];
    const taskKeyword = `Complete ${activeRoadmap.targetRole} Phase: ${nodeTitle}`;
    if (!newCompletedTasks.includes(taskKeyword)) {
      newCompletedTasks.push(taskKeyword);
    }

    // Grant premium ATS index boost mapping
    const nextAts = Math.min(99, (profile.atsScore || 70) + 2);

    const updatedProfile = {
      ...profile,
      xp: newXp,
      level: Math.floor(1 + newXp / 500),
      completedNodes: newCompletedList,
      completedTasks: newCompletedTasks,
      atsScore: nextAts,
      resumeStrength: nextAts
    };

    const streakResult = recordActivityStreak(updatedProfile);
    onUpdateProfile(streakResult.updatedProfile);
  };

  // Sync activeSubSection state with initialTab prop when navigation triggers
  useEffect(() => {
    setActiveSubSection(initialTab);
  }, [initialTab]);

  // Load courses whenever search queries or domain badge parameters shift
  useEffect(() => {
    const fetchCourses = async () => {
      setIsCoursesLoading(true);
      try {
        const query = new URLSearchParams();
        if (courseSearch) query.append("search", courseSearch);
        if (selectedCourseDomain !== "All") query.append("domain", selectedCourseDomain);

        const response = await fetch(`/api/courses?${query.toString()}`);
        if (!response.ok) throw new Error("Course search was unable to finalize.");
        const data = await response.json();
        setCourses(data);
      } catch (e) {
        console.error("Courses failed loading", e);
      } finally {
        setIsCoursesLoading(false);
      }
    };

    if (activeSubSection === "courses" || activeSubSection === "saved") {
      fetchCourses();
    }
  }, [courseSearch, selectedCourseDomain, activeSubSection]);

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRoleGoals.trim()) {
      alert("Please design a target career role to create your study map.");
      return;
    }

    setIsGeneratingRoadmap(true);
    try {
      const skillsArray = customSkillsInput.split(",").map(s => s.trim()).filter(Boolean);

      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: targetRoleGoals,
          skills: skillsArray
        })
      });

      if (!response.ok) throw new Error("Roadmap compiler failed setup.");
      const data = await response.json();

      onUpdateProfile(data.profile);
      setActiveRoadmap(data.roadmap);
      setSelectedNodeIdx(0);
    } catch (e: any) {
      alert(e.message || "Failed to organize custom AI learning roadmap.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Timeline sub segment buttons */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-80">
        <button
          onClick={() => setActiveSubSection("roadmaps")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === "roadmaps" 
              ? "bg-white text-slate-800 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Learning Roadmaps
        </button>
        <button
          onClick={() => setActiveSubSection("courses")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === "courses" 
              ? "bg-white text-slate-800 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Courses & Credentials
        </button>
      </div>

      {/* ROADMAPS PANEL VIEW */}
      {activeSubSection === "roadmaps" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Create AI Path Panel */}
          <section className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-base mb-1 flex items-center gap-1.5">
                <Cpu className="w-5 h-5 text-indigo-500 animate-pulse" /> Custom Career Architect
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">Bridges the gap between your present skills and targeted career milestones using chronological study tracks.</p>

              <form onSubmit={handleGenerateRoadmap} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Aligned Career Goal</label>
                  <input 
                    type="text" 
                    value={targetRoleGoals}
                    onChange={(e) => setTargetRoleGoals(e.target.value)}
                    placeholder="E.g. AI/ML Engineer, Fullstack Freelancer" 
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Present Skills Inventory</label>
                  <input 
                    type="text" 
                    value={customSkillsInput}
                    onChange={(e) => setCustomSkillsInput(e.target.value)}
                    placeholder="Separated with commas..." 
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingRoadmap}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isGeneratingRoadmap ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Weaving study sequence paths...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                      Build Custom Career Blueprint
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated roadmaps history */}
            {profile.roadmaps.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h4 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase mb-3 text-slate-400">Created Blueprints ({profile.roadmaps.length})</h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {profile.roadmaps.map((rdm) => (
                    <div 
                      key={rdm.id}
                      onClick={() => {
                        setActiveRoadmap(rdm);
                        setSelectedNodeIdx(0);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs font-bold truncate ${
                        activeRoadmap?.id === rdm.id 
                          ? "bg-indigo-50/50 border-indigo-200 text-slate-800" 
                          : "bg-slate-50/20 border-slate-100 hover:border-slate-200 text-slate-500"
                      }`}
                    >
                      🗺️ Target: {rdm.targetRole}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Chronological Flow Node visualization map */}
          <section className="lg:col-span-7">
            {activeRoadmap ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 relative">
                
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md tracking-wider">
                      Interactive Flow Blueprint
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-lg mt-1.5">Learning Roadmap for {activeRoadmap.targetRole}</h3>
                    <p className="text-xs text-slate-500">Chronological checklist segments to transition from: {activeRoadmap.currentSkills.join(", ") || "Fundamentals"}</p>
                  </div>

                  {/* Dynamic Progress indicator */}
                  {(() => {
                    const totalN = activeRoadmap.nodes.length;
                    const doneN = activeRoadmap.nodes.filter(n => profile.completedNodes?.includes(`${activeRoadmap.id}-${n.id}`)).length;
                    const percentN = totalN > 0 ? Math.round((doneN / totalN) * 100) : 0;
                    return (
                      <div className="w-full sm:w-48 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1">
                          <span>Progress</span>
                          <span className="text-indigo-600">{percentN}% Done</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-505 to-emerald-450 rounded-full transition-all duration-[800ms] ease-out"
                            style={{ width: `${percentN}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Nodes Horizontal/Vertical flow map connecting segments */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/60 relative overflow-hidden">
                  <div className="absolute top-[50%] left-6 right-6 h-0.5 bg-slate-200 hidden sm:block z-0" />
                  
                  {activeRoadmap.nodes.map((node, i) => {
                    const isSelected = selectedNodeIdx === i;
                    const isFinished = profile.completedNodes?.includes(`${activeRoadmap.id}-${node.id}`);
                    return (
                      <div 
                        key={node.id}
                        onClick={() => setSelectedNodeIdx(i)}
                        className={`relative z-10 w-full sm:w-28 p-2.5 text-center rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 scale-105" 
                            : isFinished
                              ? "bg-emerald-50/50 border-emerald-250 text-slate-700"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {isFinished && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black z-20 shadow-sm border border-white">✓</div>
                        )}
                        <span className="block text-[9px] uppercase font-bold opacity-80 leading-none">{node.duration}</span>
                        <span className="block text-xs font-black mt-1.5 truncate max-w-[100px] mx-auto">{node.title.split(":")[0]}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Highlighted active Node Detail display card */}
                {activeRoadmap.nodes[selectedNodeIdx] && (
                  <div className="p-5 border border-slate-150 rounded-2xl space-y-4 bg-slate-50/20">
                    <div>
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                        {activeRoadmap.nodes[selectedNodeIdx].duration} Checklist
                      </span>
                      <h4 className="text-base font-bold text-slate-800 mt-2 flex items-center gap-1.5">
                        {activeRoadmap.nodes[selectedNodeIdx].title}
                        {profile.completedNodes?.includes(`${activeRoadmap.id}-${activeRoadmap.nodes[selectedNodeIdx].id}`) && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">Completed ✓</span>
                        )}
                      </h4>
                    </div>

                    {/* Topics bullet checklists */}
                    <div>
                      <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Detailed Tech Concepts</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeRoadmap.nodes[selectedNodeIdx].topics.map((item, idx) => (
                          <div key={idx} className="p-2 bg-white rounded-xl border border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 select-none">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highly relevant suggested custom repo portfolio capstone project */}
                    <div>
                      <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Capstone Practise Portfolio Project</h5>
                      {activeRoadmap.nodes[selectedNodeIdx].suggestedProjects.map((p, idx) => (
                        <div key={idx} className="p-3 bg-indigo-50/30 border border-indigo-100/60 rounded-xl text-xs font-mono text-slate-700 leading-normal pl-4 border-l-4 border-indigo-500 select-all">
                          🛠️ {p}
                        </div>
                      ))}
                    </div>

                    {/* Suggested credentials classes resources */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-slate-200/60">
                      <div>
                        <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Recommended credentials Modules</h5>
                        <div className="flex flex-wrap gap-2">
                          {activeRoadmap.nodes[selectedNodeIdx].recommendedCourses.map((c, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold bg-indigo-50/50 px-2.5 py-1 rounded-lg border border-indigo-100/40">
                              📖 {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {profile.completedNodes?.includes(`${activeRoadmap.id}-${activeRoadmap.nodes[selectedNodeIdx].id}`) ? (
                        <div className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 select-none">
                          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" /> Finished (Claimed)
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCompleteRoadmapNode(activeRoadmap.nodes[selectedNodeIdx].id, activeRoadmap.nodes[selectedNodeIdx].title, selectedNodeIdx)}
                          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 self-end"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          Mark Node Finished ({selectedNodeIdx === 0 ? "+50 XP" : selectedNodeIdx >= 2 ? "+250 XP" : "+100 XP"})
                        </button>
                      )}
                    </div>

                  </div>
                )}

                {/* GORGEOUS COUNT-UP AWARD MODAL OVERLAY */}
                {showRewardAnimation && (
                  <div className="absolute inset-0 z-[100] bg-slate-950/70 backdrop-blur-md rounded-3xl flex items-center justify-center p-6 text-center">
                    <div className="space-y-4 max-w-sm flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-amber-500 relative animate-bounce">
                        <Award className="w-8 h-8" />
                        <div className="absolute inset-0 rounded-full bg-amber-400 opacity-20 filter blur-lg animate-ping" />
                      </div>
                      
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                          Phase Completed!
                        </span>
                        <h4 className="font-extrabold text-white text-base leading-tight">
                          {showRewardAnimation.activeNodeTitle}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          XP score, progress graphs, skill charts, and placement metrics updated instantly
                        </p>
                      </div>

                      <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 flex flex-col items-center min-w-[150px]">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Acquired Boost</span>
                        <span className="text-3xl font-black text-amber-400 font-mono tracking-wider">
                          +{animateXpValue} <span className="text-sm font-bold text-amber-300">XP</span>
                        </span>
                      </div>
                      
                      <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                        Synchronizing recruiter vectors...
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center h-[420px] flex flex-col justify-center items-center">
                <Compass className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="font-extrabold text-slate-700">Chronological Study Paths</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                  Stated skill elements lacking in your profile options can be auto-scheduled into visual month-by-month targets here to transition seamlessly into senior role thresholds.
                </p>
              </div>
            )}
          </section>

        </div>
      )}

      {/* RECOMMENDED COURSES VIEW PANEL */}
      {(activeSubSection === "courses" || activeSubSection === "saved") && (
        <div className="space-y-6">
          
          {/* Header Search and filter line */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Input Search box */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search responsive layouts, DSA matrices..." 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs w-full ml-2 text-slate-600 font-medium"
              />
            </div>

            {/* Badges segment lists to toggle domain filters */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {domains.map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedCourseDomain(dom)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-extrabold uppercase transition-all cursor-pointer ${
                    selectedCourseDomain === dom 
                      ? "bg-indigo-600 border-indigo-600 text-white" 
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

          </div>

          {/* Courses grid catalog fetch cards */}
          {isCoursesLoading ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium font-sans">Retrieved matching certifications...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const displayedCourses = activeSubSection === "saved"
                  ? courses.filter(cur => savedCourseIds.includes(cur.id))
                  : courses;

                if (displayedCourses.length === 0) {
                  return (
                    <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-slate-200">
                      <p className="text-xs text-slate-500">
                        {activeSubSection === "saved" 
                          ? "You have no saved courses yet. Browse and save recommended courses!" 
                          : "No recommended courses matching your filtered keywords."}
                      </p>
                    </div>
                  );
                }

                return displayedCourses.map((cur) => {
                  const isSaved = savedCourseIds.includes(cur.id);
                  const isCompleted = completedCourseIds.includes(cur.id);

                  return (
                    <div 
                      key={cur.id}
                      className={`relative overflow-hidden bg-white border ${
                        cur.isAiRecommended 
                          ? "border-amber-300 shadow-[0_4px_25px_rgba(245,158,11,0.08)] bg-gradient-to-b from-amber-50/10 via-white to-white" 
                          : "border-slate-200 shadow-sm"
                      } hover:shadow-[0_12px_30px_rgba(99,102,241,0.12)] hover:border-indigo-300 hover:bg-slate-50/10 rounded-3xl p-5 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group`}
                    >
                      {/* Radial Accent Glow for AI Recommended */}
                      {cur.isAiRecommended && (
                        <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-500" />
                      )}

                      <div>
                        {/* Top Meta info */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[9px] font-extrabold uppercase text-indigo-600 rounded-md shadow-2xs">
                              ⚡ {cur.platform}
                            </span>
                            {cur.subDomain && (
                              <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-[9px] font-extrabold text-slate-500 rounded-md">
                                🏷️ {cur.subDomain}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5 select-none bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                              ⭐ {cur.rating}
                            </span>
                            <button
                              onClick={() => toggleSaveCourse(cur.id)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isSaved 
                                  ? "bg-amber-500 border-amber-500 text-white shadow-xs" 
                                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                              }`}
                              title={isSaved ? "Saved to Course Bench" : "Save Course"}
                            >
                              <Bookmark className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        </div>

                        {/* Artificial Intelligence Recommendation banner */}
                        {cur.isAiRecommended && cur.recommendReason && (
                          <div className="mt-2.5 bg-amber-50/70 border border-amber-100 text-[10px] text-amber-800 font-extrabold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
                            <span className="leading-tight">{cur.recommendReason}</span>
                          </div>
                        )}

                        {/* Course title and Instructor */}
                        <div className="mt-3">
                          <h4 className="text-sm font-extrabold text-slate-800 leading-snug group-hover:text-indigo-900 transition-colors">
                            {cur.title}
                          </h4>
                          {cur.instructor && (
                            <p className="text-[11px] text-slate-400 mt-1 font-medium">
                              By <span className="text-slate-600 font-bold">{cur.instructor}</span>
                            </p>
                          )}
                        </div>

                        {/* Quantitative metric details bullet grid */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-4 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-semibold text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{cur.duration || "Self-study"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{cur.learners || "Over 5,000+"} learners</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <Award className="w-3.5 h-3.5 text-violet-500" />
                            <span className="truncate">{cur.certificate || "Includes Certificate"}</span>
                          </div>
                        </div>

                        {/* Skill badges chips */}
                        <div className="flex flex-wrap gap-1 mt-3.5">
                          {cur.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-0.5 bg-slate-100/80 border border-slate-150 text-[10px] font-medium text-slate-500 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions: Progress slider/checkbox & Direct URL button */}
                      <div className="border-t border-slate-100 mt-4 pt-3.5 flex items-center justify-between gap-2.5">
                        <button
                          onClick={() => toggleCompleteCourse(cur.id, cur.title)}
                          className={`flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                            isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              Saved & Passed (+150 XP)
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                              Mark Complete
                            </>
                          )}
                        </button>

                        <a 
                          href={cur.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] uppercase font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-1 transition-all"
                        >
                          Direct Visit <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
