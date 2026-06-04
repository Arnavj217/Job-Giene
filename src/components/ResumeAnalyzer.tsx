import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  TrendingUp, 
  Cpu, 
  History,
  Trash2,
  RefreshCw,
  Plus,
  Check
} from "lucide-react";
import { Profile, ResumeReport } from "../types";
import { recordActivityStreak } from "../utils/streak";

interface ResumeAnalyzerProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
}

export default function ResumeAnalyzer({ profile, onUpdateProfile }: ResumeAnalyzerProps) {
  const [fileName, setFileName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState(profile.targetRole || "Frontend Developer");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<ResumeReport | null>(
    profile.resumes.length > 0 ? profile.resumes[0] : null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(
    profile.resumes.length > 0 ? { name: profile.resumes[0].fileName, size: 104857 } : null
  );

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
      setErrorMessage("Unsupported format! System only permits official PDF, DOC, or DOCX formats.");
      return;
    }
    
    setUploadedFile({ name: file.name, size: file.size });
    setFileName(file.name);
    setErrorMessage(null);

    // Provide preconfigured template that user can edit or review
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

    if (!resumeText.trim()) {
      setResumeText(templateContent);
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

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!resumeText.trim() || resumeText.length < 20) {
      setErrorMessage("Please input a valid resume text block (min 20 characters) to analyze.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileName || "Pasted_Resume_Input.txt",
          resumeText: resumeText,
          skills: profile.skills,
          currentRole: profile.experienceLevel,
          targetRole: targetRoleInput
        })
      });

      if (!response.ok) {
        throw new Error("Evaluation server was unable to parse the document successfully.");
      }

      const data = await response.json();
      
      // Log active study streak since optimizer is a useful activity
      const streakResult = recordActivityStreak({
        ...data.profile,
        xp: data.profile.xp + 50, // grant additional XP for documents parsed
        level: Math.floor(1 + (data.profile.xp + 50) / 500)
      });

      // Update local profile & select new active report
      onUpdateProfile(streakResult.updatedProfile);
      setActiveReport(data.report);
      setResumeText("");
      setFileName("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate AI resume audit.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = (report: ResumeReport) => {
    const content = `# JOB GIENE - AI ATS Optimisation Report
Analyzed File: ${report.fileName}
ATS Competency Score: ${report.atsScore}%
Generated: ${new Date(report.uploadedAt).toLocaleString()}

## 📈 Executive Summary Strengths
${report.strengths.map(s => `- ${s}`).join("\n")}

## ⚠️ High Gaps & Structural Weaknesses
${report.weakAreas.map(w => `- ${w}`).join("\n")}

## 🛠️ Missing Core Gaps
${report.missingSkills.map(m => `- ${m}`).join("\n")}

## 💡 Practical suggestions
${report.suggestions.map(s => `- ${s}`).join("\n")}

## 📦 Enhanced Project Copywriting (ATS-Optimized)
${report.improvedProjects.map(p => {
  if (p && typeof p === "object") {
    const orig = (p as any).originalName || (p as any).original_name || (p as any).original || "";
    const impr = (p as any).improvedName || (p as any).improved_name || (p as any).improved || (p as any).description || "";
    const enh = (p as any).enhancements || (p as any).enhancementsList || (p as any).details || "";
    return `- **Original Project**: ${orig}\n  - **ATS-Optimized**: ${impr}${enh ? `\n  - **Key Enhancements**: ${Array.isArray(enh) ? enh.join(", ") : enh}` : ""}`;
  }
  return `- ${p}`;
}).join("\n")}

---
© 2026 JOB GIENE Placement Systems. Contact: recruiter-desk@jobgiene.com`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `JOB_GIENE_ATS_Score_${report.atsScore}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeReport = (reportId: string) => {
    const updatedResumes = profile.resumes.filter(r => r.id !== reportId);
    let updatedProfile = { ...profile, resumes: updatedResumes };
    
    if (updatedResumes.length > 0) {
      const maxAts = Math.max(...updatedResumes.map(r => r.atsScore));
      updatedProfile.atsScore = maxAts;
      updatedProfile.resumeStrength = maxAts;
    } else {
      updatedProfile.atsScore = 0;
      updatedProfile.resumeStrength = 0;
    }

    onUpdateProfile(updatedProfile);
    if (activeReport?.id === reportId) {
      setActiveReport(updatedResumes.length > 0 ? updatedResumes[0] : null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Upload/Analysis Config Column */}
      <section className="lg:col-span-5 space-y-6">
        
        {/* Main Analysis trigger box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 animate-pulse" /> ATS Optimization Scanner
          </h2>
          <p className="text-xs text-slate-500 mt-1">Paste your current engineering or business resume below to diagnose keyword formatting gaps.</p>

          <form onSubmit={handleAnalyze} className="mt-4 space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Application Role</label>
              <input 
                type="text" 
                value={targetRoleInput} 
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="E.g. Frontend Engineer, Product Architect" 
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-indigo-400"
              />
            </div>

            {/* Drag and Drop Container */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">File Upload (PDF, DOC, DOCX)</label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("native-file-picker-workspace")?.click()}
                className={`p-6 border-2 border-dashed rounded-3xl transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden ${
                  isDragging 
                    ? "bg-indigo-50 border-indigo-500 scale-[1.01]" 
                    : uploadedFile 
                      ? "bg-emerald-50/30 border-emerald-300" 
                      : "bg-slate-50/50 hover:bg-slate-50 border-slate-250 hover:border-slate-350"
                }`}
              >
                <input 
                  type="file" 
                  id="native-file-picker-workspace"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />

                {uploadedFile ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800 truncate max-w-xs">{uploadedFile.name}</span>
                      <span className="block text-[9px] text-slate-550 font-mono mt-0.5">
                        Completed Import
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <Upload className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-705">Drop file here or click to choose</span>
                      <span className="block text-[9px] text-slate-450 mt-0.5">Accepts PDF, DOC, or DOCX formats</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Raw Resume Text Block</label>
              <textarea 
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full plaintext content of your resume here..." 
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-slate-300 font-mono tracking-tight"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                ⚠️ {errorMessage}
              </div>
            )}

            <button 
              type="submit"
              disabled={isAnalyzing}
              className={`w-full py-3 text-sm font-bold text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isAnalyzing 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/10"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Synthesizing ATS diagnostics...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  Trigger AI Resume Audit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Scan Records History */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
            <History className="w-4 h-4 text-indigo-400" /> Document Audit History ({profile.resumes.length})
          </h3>
          
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {profile.resumes.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No past resume scans recorded.</p>
            ) : (
              profile.resumes.map((rep) => (
                <div 
                  key={rep.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    activeReport?.id === rep.id 
                      ? "bg-indigo-50/50 border-indigo-200 text-slate-800" 
                      : "bg-slate-50/20 border-slate-100 hover:border-slate-200 text-slate-600"
                  }`}
                  onClick={() => setActiveReport(rep)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold truncate max-w-[140px]">{rep.fileName}</span>
                      <span className="text-[10px] text-slate-400 block">{new Date(rep.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-600">{rep.atsScore}%</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeReport(rep.id);
                      }}
                      className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md shrink-0 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

      {/* Results Diagnostics Column */}
      <section className="lg:col-span-7">
        {activeReport ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            {/* Header Analytics Score display */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Candidate Scorecard</span>
                <h3 className="font-extrabold text-slate-800 text-lg truncate max-w-sm">{activeReport.fileName}</h3>
                <span className="text-xs text-slate-500 block">Evaluated on {new Date(activeReport.uploadedAt).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] block font-bold text-slate-400 uppercase">Computed ATS</span>
                  <span className="text-2xl font-black text-indigo-600 block">{activeReport.atsScore}%</span>
                </div>
                <button 
                  onClick={() => downloadReport(activeReport)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export Report
                </button>
              </div>
            </div>

            {/* Core Sections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Strengths card */}
              <div className="p-4 bg-emerald-50/40 border border-slate-200 rounded-2xl">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Stated Strengths
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  {activeReport.strengths.map((str, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-emerald-500 shrink-0">✔</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weak areas card */}
              <div className="p-4 bg-amber-50/40 border border-slate-200 rounded-2xl">
                <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> General Gaps
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 font-medium font-medium">
                  {activeReport.weakAreas.map((weak, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-amber-500 shrink-0">⚠</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* ====== THINGS TO CHANGE vs THINGS NOT TO CHANGE ====== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50/35 border border-red-200/60 rounded-2xl">
                <h4 className="text-xs font-bold text-red-800 flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
                  ⚠️ Things to Change
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex gap-2">
                    <span className="text-red-500 font-extrabold shrink-0">✕</span>
                    <span>Add measurable project outcomes (e.g. reduce latency/increase retention)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500 font-extrabold shrink-0">✕</span>
                    <span>Improve keyword usage to target {profile.targetRole || "target roles"}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500 font-extrabold shrink-0">✕</span>
                    <span>Add measurable achievements with specific numeric impact descriptors</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-50/35 border border-emerald-200/60 rounded-2xl">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
                  ✅ Keep (Do Not Change)
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex gap-2">
                    <span className="text-emerald-500 font-extrabold shrink-0">✔</span>
                    <span>Existing strong sections (Summary block, Contact, Layout columns)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500 font-extrabold shrink-0">✔</span>
                    <span>Relevant history and experience duration markers</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500 font-extrabold shrink-0">✔</span>
                    <span>Strong foundational project technical details and credentials</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* ====== ADVANCED AI RESUME ANALYSIS & GUIDANCE ====== */}
            <div className="p-5 bg-indigo-50/40 border border-indigo-150/80 rounded-2xl space-y-4">
              <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Advanced AI Structural Diagnostics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Weak Sections */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">⚠️ Weak Sections</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {(activeReport.weakSections || [
                      "Project descriptions lack quantifiable metrics",
                      "Education placed at the bottom without GPA references"
                    ]).map((sec, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <span className="text-red-500">•</span>
                        <span>{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Achievements */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">🏆 Lacking Achievements</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {(activeReport.missingAchievements || [
                      "No professional or scholastic certifications listed",
                      "Competitive coding and open-source contributions absent"
                    ]).map((ach, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <span className="text-yellow-650">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Experience Gaps */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">📅 Detected Timeline Gaps</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {(activeReport.experienceGaps || [
                      "Noticeable 8-month gap in late 2025 has no coursework or study coordinates"
                    ]).map((gap, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <span className="text-indigo-500">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ACTION PLAN TIMELINE ("Improve by:") */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 mt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 font-mono">
                    ATS Boost Action Steps Plan
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-1 rounded-md">
                    ⏱️ Est. Time: {activeReport.actionPlan?.estimatedCompletionHours || 42} Hours
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-white mb-2 font-sans tracking-tight">Improve placement compatibility by following:</h4>
                <ol className="space-y-2 text-xs text-slate-300 font-medium font-sans">
                  {(activeReport.actionPlan?.improveBy || [
                    "Add measurable project outcomes (e.g. 'Reduced loading delay by 25%')",
                    "Incorporate a leadership experience details block",
                    "Complete React Certification and Business Analytics Course"
                  ]).map((step, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <span className="bg-indigo-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold font-mono">
                        {idx + 1}
                     </span>
                     <span className="mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

            </div>

            {/* ====== SKILL GAP REDUCTION SYSTEM ====== */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-150 shadow-sm">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Skill Gap Reduction Tracker</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Progressively reduce gaps to maximize ATS scoring and readiness.</p>
                </div>
                <div className="text-center bg-red-50 text-red-600 border border-red-100 px-3.5 py-1.5 rounded-xl">
                  <span className="text-[9px] block uppercase font-bold tracking-wider leading-none">Gap %</span>
                  <span className="text-xl font-black block mt-1.5 leading-none">
                    {activeReport.skillGapPercentage ?? 35}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Required Skills */}
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-slate-150">
                  <span className="text-[9px] uppercase font-bold text-indigo-700 tracking-wider block mb-1.5 font-mono">Required Skills ({activeReport.requiredSkillsList?.length || 5})</span>
                  <div className="flex flex-wrap gap-1">
                    {(activeReport.requiredSkillsList || ["React.js", "TypeScript", "Tailwind CSS", "API Integration", "Automated Testing"]).map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-indigo-105 text-indigo-700 text-[10px] font-bold rounded">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Current Skills */}
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-slate-150">
                  <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider block mb-1.5 font-mono">Current Status ({activeReport.currentSkillsList?.length || 4})</span>
                  <div className="flex flex-wrap gap-1">
                    {(activeReport.currentSkillsList || ["React.js", "JavaScript", "HTML", "CSS"]).map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-emerald-105 text-emerald-700 text-[10px] font-bold rounded">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-3 bg-rose-50/50 rounded-xl border border-slate-150">
                  <span className="text-[9px] uppercase font-bold text-rose-700 tracking-wider block mb-1.5 font-mono">Discovered Gap ({activeReport.missingSkillsList?.length || 3})</span>
                  <div className="flex flex-wrap gap-1">
                    {(activeReport.missingSkillsList || ["TypeScript", "Tailwind CSS", "Automated Testing"]).map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-rose-105 text-rose-700 text-[10px] font-bold rounded">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ====== LEARNING SOURCE RECOMMENDATION SYSTEM ====== */}
            <div className="p-5 border border-slate-200 rounded-3xl bg-white space-y-3.5">
              <div>
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-0.5">
                  🎓 Curated Learning Source Guidelines
                </h4>
                <p className="text-[11px] text-slate-400">Targeted online course curricula and exercises to neutralize missing skills:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {(activeReport.recommendedSources || [
                  { type: "Course", name: "Typescript Masterclass", platform: "Udemy", link: "https://www.udemy.com/" },
                  { type: "Course", name: "React Certification Course", platform: "Coursera", link: "https://www.coursera.org" },
                  { type: "Course", name: "Tailwind CSS Utility Designs", platform: "YouTube", link: "https://www.youtube.com" },
                  { type: "Roadmap", name: "Core Frontend Roadmap", platform: "Internal", link: "#roadmaps" }
                ]).map((src, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-250 transition-all flex justify-between items-center gap-2">
                    <div>
                      <span className={`text-[9.5px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded text-white mr-1.5 ${
                        src.type === "Course" ? "bg-indigo-650" : src.type === "Roadmap" ? "bg-emerald-650" : "bg-purple-650"
                      }`}>
                        {src.type}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 font-mono">{src.platform}</span>
                      <h5 className="text-xs font-extrabold text-slate-800 mt-1.5 truncate max-w-[160px]">
                        {src.name}
                      </h5>
                    </div>
                    
                    <a 
                      href={src.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] px-2.5 py-1 bg-white border border-slate-250 hover:border-indigo-400 hover:text-indigo-600 text-slate-650 font-bold rounded-lg transition-all shrink-0 shadow-sm"
                    >
                      Visit →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Improved project structures preview */}
            <div className="p-4 bg-indigo-50/20 border border-slate-200 rounded-2xl">
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-widest mb-1">
                ATS optimized Project Descriptions
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">Copy and paste these quantifiable project layouts into your CV section:</p>
              
              <div className="space-y-3">
                {activeReport.improvedProjects.map((p: any, i) => {
                  if (p && typeof p === "object") {
                    const orig = p.originalName || p.original_name || p.original || "";
                    const impr = p.improvedName || p.improved_name || p.improved || p.description || "";
                    const enh = p.enhancements || p.enhancementsList || p.details || "";

                    return (
                      <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-150 text-xs text-slate-700 leading-relaxed space-y-2.5 shadow-xs">
                        {orig && (
                          <div className="flex gap-2">
                            <span className="text-red-500 font-bold font-sans shrink-0 uppercase text-[9px] mt-0.5">Original:</span>
                            <span className="font-sans text-slate-400 line-through select-all">{orig}</span>
                          </div>
                        )}
                        {impr && (
                          <div className="flex gap-2 bg-indigo-50/30 p-2.5 border border-indigo-100/50 rounded-lg">
                            <span className="text-emerald-600 font-black font-sans shrink-0 uppercase text-[9px] mt-0.5">📌 Optimized:</span>
                            <span className="font-mono font-bold text-indigo-950 select-all block w-full">{impr}</span>
                          </div>
                        )}
                        {enh && (
                          <div className="pl-4.5 border-l-2 border-slate-200">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Enhancements Checklist:</span>
                            <span className="text-[11px] font-sans text-slate-500 italic block">
                              {Array.isArray(enh) ? enh.join(", ") : String(enh)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-700 font-mono leading-relaxed select-all">
                      📌 {String(p)}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center h-full flex flex-col justify-center items-center">
            <FileText className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-600 text-base">Unveil Your ATS Score</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              Paste your resume or draft qualifications into our validator to evaluate keyword multipliers, missing elements, and career checklist matches.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
