import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  Printer, 
  Layout, 
  Compass,
  CheckCircle,
  Eye,
  Settings,
  X,
  Copy,
  Briefcase,
  User,
  GraduationCap,
  RefreshCw
} from "lucide-react";
import { Profile, ResumeReport } from "../types";

interface ResumeBuilderProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
}

interface WorkHistory {
  id: string;
  role: string;
  company: string;
  dates: string;
  bullets: string;
}

interface ProjectItem {
  id: string;
  name: string;
  tech: string;
  bullets: string;
}

export default function ResumeBuilder({ profile, onUpdateProfile }: ResumeBuilderProps) {
  // Tabs "resume" or "cover-letter"
  const [activeWorkspace, setActiveWorkspace] = useState<"resume" | "cover-letter">("resume");

  // ==================== RESUME SYSTEM STATES ====================
  const [summary, setSummary] = useState(
    `Proactive solutions specialist skilled at building modern layout structures and optimizing responsive applications. Seeking a position as a Professional ${profile.targetRole || "Software Engineer"}.`
  );
  
  const [phone, setPhone] = useState(profile.phone || "+1 (555) 123-4567");
  const [degree, setDegree] = useState(profile.degree || "Bachelor of Science in Computer Science");
  const [college, setCollege] = useState(profile.college || "Stanford University");

  const [history, setHistory] = useState<WorkHistory[]>([
    { id: "h-1", role: `Junior ${profile.targetRole || "Developer"}`, company: "Innotech Corp", dates: "2024 - Present", bullets: "Built responsive layouts using React and Tailwind CSS.\nManaged internal state mechanics and integrated REST APIs safely." },
  ]);

  const [projects, setProjects] = useState<ProjectItem[]>([
    { id: "p-1", name: "Dynamic Career Portal", tech: "TypeScript, React, Node.js", bullets: "Engineered single-screen dashboard maps tracking skills milestones.\nIncreased interface load speeds by 45% using structural memoization." }
  ]);

  const [designStyle, setDesignStyle] = useState<"Modern" | "Classic" | "Mono">("Modern");
  const [isSimulatingATS, setIsSimulatingATS] = useState(false);
  const [builtSuccess, setBuiltSuccess] = useState(false);

  // ==================== COVER LETTER STATES ====================
  const [clCompany, setClCompany] = useState("Google");
  const [clRole, setClRole] = useState(profile.targetRole || "Software Engineer");
  const [clExperience, setClExperience] = useState(profile.experienceLevel || "Mid-Level Professional");
  const [clSkills, setClSkills] = useState(profile.skills.slice(0, 5).join(", ") || "TypeScript, React, Node.js, Tailwind CSS");
  
  const currentDateFormatted = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const [clText, setClText] = useState(`[Your Street Address Area]
[City, Country Placeholder]
${currentDateFormatted}

Hiring Committee
Google
Corporate Operations Division

Subject: Application for ${clRole} - ${profile.name}

Dear Hiring Team,

I am writing to express my eager interest in the ${clRole} position at Google. As a highly driven professional specializing in ${profile.skills[0] || "Software Engineering"}, I have long admired Google’s commitment to engineering high-performance user spaces and elegant tools.

During my academic and professional tenure, I focused heavily on implementing reliable architectures using ${profile.skills.join(", ") || "React & Javascript design frameworks"}. I am confident that my technical resourcefulness, paired with my active passion for UI fidelity, will prove highly valuable to your engineering lifecycle.

Thank you for your valuable time and consideration of my candidature. I would welcome the opportunity to discuss further how my developer practices can enrich Google's active product roadmaps. I look forward to your positive feedback.

Sincerely,

${profile.name}
${profile.email}`);

  const [isGeneratingCl, setIsGeneratingCl] = useState(false);
  const [clBuiltSuccess, setClBuiltSuccess] = useState(false);
  const [copiedCl, setCopiedCl] = useState(false);

  // ==================== INTERACTIVE HANDLERS ====================
  const handleAddHistory = () => {
    setHistory([...history, { id: "h-" + Date.now(), role: "", company: "", dates: "", bullets: "" }]);
  };

  const handleRemoveHistory = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const handleUpdateHistory = (id: string, key: keyof WorkHistory, value: string) => {
    setHistory(history.map(h => h.id === id ? { ...h, [key]: value } : h));
  };

  const handleAddProject = () => {
    setProjects([...projects, { id: "p-" + Date.now(), name: "", tech: "", bullets: "" }]);
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleUpdateProject = (id: string, key: keyof ProjectItem, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [key]: value } : p));
  };

  // Compile Resume to ATS
  const handleSimulateATSPush = () => {
    setIsSimulatingATS(true);
    setTimeout(() => {
      const computedScore = Math.floor(78 + Math.random() * 19); // 78 - 97
      
      const newScan: ResumeReport = {
        id: "scan-built-" + Date.now(),
        fileName: `${profile.name}_Built_CV.pdf`,
        uploadedAt: new Date().toISOString(),
        atsScore: computedScore,
        strengths: ["Strong keyword balance aligned to target role details", "Readable modern hierarchy", "Quantifiable metrics included in project descriptions"],
        weakAreas: ["Add more cloud hosting systems details", "Specify certifications link info"],
        missingSkills: ["Docker", "Kubernetes"],
        parsingContent: `Built CV: ${profile.name}\nEmail: ${profile.email}\nPhone: ${phone}\nJob Title: ${profile.targetRole}\nEducation: ${degree} - ${college}\nSummary: ${summary}`,
        suggestions: ["Incorporate more action-oriented lead verbs", "Integrate automated API validation tools on project milestones"],
        improvedProjects: ["Refactor Career Portal to optimize Redux metrics", "Leverage CDN hosting for static assets"]
      };

      const updatedProfile = {
        ...profile,
        atsScore: Math.max(profile.atsScore || 0, computedScore),
        resumes: [newScan, ...profile.resumes],
        xp: profile.xp + 150,
        level: Math.floor(1 + (profile.xp + 150) / 500)
      };

      onUpdateProfile(updatedProfile);
      setIsSimulatingATS(false);
      setBuiltSuccess(true);
    }, 2000);
  };

  // Generate Cover Letter via Backend
  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCl(true);
    setClBuiltSuccess(false);
    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: clCompany,
          jobRole: clRole,
          experienceLevel: clExperience,
          skillHighlights: clSkills
        })
      });
      if (response.ok) {
        const data = await response.json();
        setClText(data.letter || "");
        setClBuiltSuccess(true);
        // Grant minor XP for engagement
        onUpdateProfile({
          ...profile,
          xp: profile.xp + 50,
          level: Math.floor(1 + (profile.xp + 50) / 500)
        });
      } else {
        throw new Error("API Limit");
      }
    } catch (_) {
      // Fallback builder
      const generatedLetter = `Hiring Committee
${clCompany}
Corporate Recruiting Team

Subject: Application for ${clRole} - ${profile.name}

Dear Hiring Team,

I am writing to express my enthusiastic interest in the ${clRole} opening at ${clCompany}. As a results-driven professional specializing in ${clSkills.split(",")[0] || "Software Solutions"}, I am highly eager to bring my background in modern design architectures and responsive systems optimization to your product division.

During my engineering tenure, I focused heavily on implementing reliable, high-performance platforms leveraging tools like ${clSkills}. My core achievements include engineering clean visual layouts and establishing robust API pipelines which improved interface loading speeds by up to 45%. I am confident that my technical problem-solving skillset, combined with my active dedication to elegant user workflows, aligns perfectly with ${clCompany}'s mission of building outstanding products.

Thank you for your valuable time and recruitment consideration. I would welcome the opportunity to discuss further how my practical experience can help your team achieve its development milestones.

Sincerely,

${profile.name}
${profile.email}`;
      setClText(generatedLetter);
      setClBuiltSuccess(true);
    } finally {
      setIsGeneratingCl(false);
    }
  };

  // ==================== DOWNLOADING & PRINTS ====================
  const handlePrint = () => {
    window.print();
  };

  const handleCopyClToClipboard = () => {
    navigator.clipboard.writeText(clText);
    setCopiedCl(true);
    setTimeout(() => setCopiedCl(false), 2000);
  };

  const generatePlainResumeText = () => {
    return `==================================================
${profile.name ? profile.name.toUpperCase() : "CANDIDATE"}
${profile.email} | ${phone} | Location: ${profile.region || "US"}
Target Role: ${profile.targetRole || "Software Specialist"}
==================================================

SUMMARY:
${summary}

SKILLS & CORE COMPETENCIES:
${profile.skills.join(", ")}

PROFESSIONAL EXPERIENCE:
${history.map(h => `${h.role} | ${h.company} (${h.dates})\n${h.bullets}`).join("\n\n")}

ENGINEERING PROJECTS:
${projects.map(p => `${p.name} - ${p.tech}\n${p.bullets}`).join("\n\n")}

EDUCATION:
${degree} - ${college}`;
  };

  const handleDownloadTxtResume = () => {
    const text = generatePlainResumeText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadWordFriendlyCV = (htmlContent: string, fileName: string) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Dossier</title><style>body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; } h1 { font-size: 18pt; text-align: center; color: #1e1b4b; text-transform: uppercase; } h2 { font-size: 12pt; border-bottom: 2px solid #6366f1; padding-bottom: 4px; color: #312e81; text-transform: uppercase; margin-top: 18px; } ul { margin-left: 20px; }</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + htmlContent + footer;
    
    const blob = new Blob(['\uFEFF' + sourceHTML], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadDocxResume = () => {
    const htmlResume = `
      <h1>${profile.name}</h1>
      <p style="text-align: center; font-size: 10pt; color: #475569;">
        ${profile.email} &bull; ${phone} &bull; ${profile.region || "US"}
      </p>
      <p style="text-align: center; font-weight: bold; color: #4338ca;">
        Target Role: ${profile.targetRole || "Software Specialist"}
      </p>

      <h2>Summary</h2>
      <p>${summary}</p>

      <h2>Core Competencies</h2>
      <p>${profile.skills.join(", ")}</p>

      <h2>Employment History</h2>
      ${history.map(h => `
        <div style="margin-bottom: 12px;">
          <p style="margin: 0; font-weight: bold;">${h.role || "Role"} - ${h.company || "Company"} (${h.dates})</p>
          <ul>
            ${h.bullets.split("\n").filter(Boolean).map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      `).join("")}

      <h2>Engineering Projects</h2>
      ${projects.map(p => `
        <div style="margin-bottom: 12px;">
          <p style="margin: 0; font-weight: bold;">${p.name || "Project"} (${p.tech})</p>
          <ul>
            ${p.bullets.split("\n").filter(Boolean).map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      `).join("")}

      <h2>Education Credentials</h2>
      <p><strong>${degree}</strong> - ${college}</p>
    `;
    downloadWordFriendlyCV(htmlResume, `${profile.name.replace(/\s+/g, "_")}_Resume.doc`);
  };

  const handleDownloadTxtCl = () => {
    const blob = new Blob([clText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_")}_Cover_Letter.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadDocxCl = () => {
    const htmlCl = `
      <h1>Cover Letter</h1>
      <p style="font-size: 10pt; color: #475569; text-align: right;">${currentDateFormatted}</p>
      <p style="font-weight: bold;">${profile.name}</p>
      <p>${profile.email}</p>
      <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
      ${clText.replace(/\n/g, "<br/>")}
    `;
    downloadWordFriendlyCV(htmlCl, `${profile.name.replace(/\s+/g, "_")}_Cover_Letter.doc`);
  };

  // Inline styling for perfect document printing (hide other areas)
  const printStyleSheet = (
    <style dangerouslySetInnerHTML={{__html: `
      @media print {
        body { background: white ! important; color: black ! important; }
        aside, nav, header, button, select, label, input, textarea, section:not(.printable-parent), div:not(.print-canvas) {
          display: none ! important;
        }
        .printable-parent {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% ! important;
          margin: 0 ! important;
          padding: 0 ! important;
          border: none ! important;
          box-shadow: none ! important;
        }
        .print-canvas {
          margin: 0 ! important;
          padding: 2.5cm ! important;
          border: none ! important;
          box-shadow: none ! important;
          width: 100% ! important;
          min-height: auto ! important;
        }
      }
    `}} />
  );

  return (
    <div className="space-y-6 animate-fade-in" id="resume_builder_module">
      {printStyleSheet}

      {/* Builder Header */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center">
            <Layout className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-indigo-500 tracking-widest font-mono">Dynamic Placement Office</span>
            <h3 className="text-xl font-bold text-slate-800 mt-1">Interactive Documents Studio</h3>
            <p className="text-xs text-slate-500 mt-1">Build outstanding professional resumes and cover letters backed by dynamic evaluation.</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveWorkspace("resume")}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWorkspace === "resume"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Resume Creator
          </button>
          <button
            onClick={() => setActiveWorkspace("cover-letter")}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWorkspace === "cover-letter"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Cover Letter Builder
          </button>
        </div>
      </section>

      {/* Notifications */}
      {builtSuccess && activeWorkspace === "resume" && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-bold animate-slide-up shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Success! New downloadable resume generated, parsed, and logged inside ATS Document Audit scan history! (+150 XP)</span>
          </div>
          <button onClick={() => setBuiltSuccess(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {clBuiltSuccess && activeWorkspace === "cover-letter" && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-bold animate-slide-up shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Success! Personal cover letter generated with AI criteria parameters (+50 XP).</span>
          </div>
          <button onClick={() => setClBuiltSuccess(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==================== 1. RESUME WORKSPACE ==================== */}
      {activeWorkspace === "resume" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
          {/* Editor Inputs Panel */}
          <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" /> Biography Details
              </h4>
              <select 
                value={designStyle} 
                onChange={e => setDesignStyle(e.target.value as any)}
                className="text-[10px] font-black uppercase text-indigo-600 focus:outline-none bg-indigo-50 p-1.5 rounded-lg border border-indigo-150 cursor-pointer"
              >
                <option value="Modern">Typeface: Sans-Serif</option>
                <option value="Classic">Typeface: Editorial Serif</option>
                <option value="Mono">Typeface: Space Mono</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Dossier Phone</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-750 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Candidate Region</label>
                <input 
                  type="text" 
                  disabled 
                  value={profile.region || "US"} 
                  className="w-full bg-slate-100/80 border border-slate-200/50 text-slate-400 text-xs px-3 py-2 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Professional Summary Objective</label>
              <textarea 
                rows={3} 
                value={summary} 
                onChange={e => setSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-750 text-xs p-3 rounded-xl focus:outline-none focus:border-indigo-400 leading-relaxed"
              />
            </div>

            {/* Core history list editing form blocks */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-indigo-400" /> Experience Milestones
                </span>
                <button 
                  onClick={handleAddHistory}
                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 cursor-pointer bg-slate-50 hover:bg-slate-100/50 p-1 px-2 rounded-lg border border-slate-150 transition-all"
                >
                  + Add History
                </button>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {history.map((his) => (
                  <div key={his.id} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl relative space-y-2">
                    <button 
                      onClick={() => handleRemoveHistory(his.id)}
                      className="absolute right-2 top-2 text-slate-400 hover:text-rose-500 cursor-pointer text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <input 
                        type="text"
                        placeholder="Role (e.g. Lead Dev)"
                        value={his.role}
                        onChange={e => handleUpdateHistory(his.id, "role", e.target.value)}
                        className="bg-white border text-xs px-2.5 py-1.5 rounded-lg max-w-full text-slate-700"
                      />
                      <input 
                        type="text"
                        placeholder="Company"
                        value={his.company}
                        onChange={e => handleUpdateHistory(his.id, "company", e.target.value)}
                        className="bg-white border text-xs px-2.5 py-1.5 rounded-lg max-w-full text-slate-705"
                      />
                    </div>
                    <input 
                      type="text"
                      placeholder="Duration dates (e.g. 2024 - Present)"
                      value={his.dates}
                      onChange={e => handleUpdateHistory(his.id, "dates", e.target.value)}
                      className="bg-white border text-xs px-2.5 py-1.5 rounded-lg w-full text-slate-700"
                    />
                    <textarea 
                      rows={2}
                      placeholder="Bullet details (newline separated)"
                      value={his.bullets}
                      onChange={e => handleUpdateHistory(his.id, "bullets", e.target.value)}
                      className="bg-white border text-xs p-2 rounded-lg w-full text-slate-700 leading-normal"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Project additions block */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Compass className="w-3 h-3 text-indigo-400" /> Active System Projects
                </span>
                <button 
                  onClick={handleAddProject}
                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 cursor-pointer bg-slate-50 hover:bg-slate-100/50 p-1 px-2 rounded-lg border border-slate-150 transition-all"
                >
                  + Add Project
                </button>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl relative space-y-2">
                    <button 
                      onClick={() => handleRemoveProject(proj.id)}
                      className="absolute right-2 top-2 text-slate-400 hover:text-rose-500 cursor-pointer text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <input 
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={e => handleUpdateProject(proj.id, "name", e.target.value)}
                        className="bg-white border text-xs px-2.5 py-1.5 rounded-lg max-w-full text-slate-700"
                      />
                      <input 
                        type="text"
                        placeholder="Tech bundle used"
                        value={proj.tech}
                        onChange={e => handleUpdateProject(proj.id, "tech", e.target.value)}
                        className="bg-white border text-xs px-2.5 py-1.5 rounded-lg max-w-full text-slate-700"
                      />
                    </div>
                    <textarea 
                      rows={2}
                      placeholder="Milestone achievements bullet points"
                      value={proj.bullets}
                      onChange={e => handleUpdateProject(proj.id, "bullets", e.target.value)}
                      className="bg-white border text-xs p-2 rounded-lg w-full text-slate-700 leading-normal"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Academic inputs block */}
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Qualifying Degree</label>
                <input 
                  type="text" 
                  value={degree} 
                  onChange={e => setDegree(e.target.value)}
                  placeholder="Degree info" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-755 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">College/Institute</label>
                <input 
                  type="text" 
                  value={college} 
                  onChange={e => setCollege(e.target.value)}
                  placeholder="Stanford" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-755 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button 
                onClick={handleSimulateATSPush}
                disabled={isSimulatingATS}
                type="button"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-xs rounded-xl shadow border border-indigo-500 hover:border-indigo-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isSimulatingATS ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulating ATS scan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Compile Resume & Run ATS Scan
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Real-time Document Previewer Panel */}
          <section className="lg:col-span-7 printable-parent">
            <div className="bg-slate-900 rounded-3xl p-5 shadow-inner border border-slate-800 space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-bold text-slate-400 tracking-wider pb-3 border-b border-slate-800">
                <span className="uppercase select-none">🖥️ Live Document Canvas Output</span>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handlePrint}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Printer className="w-3 h-3" /> PDF / Print
                  </button>
                  <button 
                    onClick={handleDownloadDocxResume}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-emerald-400" /> DOCX
                  </button>
                  <button 
                    onClick={handleDownloadTxtResume}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-emerald-400" /> TXT
                  </button>
                </div>
              </div>

              {/* Simulated printable page canvas layout */}
              <div 
                id="resume-print-area"
                style={{ minHeight: "720px" }}
                className={`bg-white p-10 shadow-lg text-slate-950 select-all relative overflow-hidden transition-all duration-300 print-canvas rounded-xl ${
                  designStyle === "Classic" ? "font-serif" : designStyle === "Mono" ? "font-mono" : "font-sans"
                }`}
              >
                {/* Visual marker top block line */}
                <div className="absolute top-0 right-0 left-0 h-[4px] bg-indigo-600" />

                {/* Body details */}
                <div className="space-y-6">
                  {/* Header info */}
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">{profile.name}</h3>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      {profile.email} • {phone} • {profile.region || "US"}
                    </p>
                    <p className="text-xs font-extrabold text-indigo-650 tracking-wide uppercase">
                      Target Position: {profile.targetRole || "Software Specialist"}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5">
                    <h5 className="font-extrabold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 text-slate-950 leading-none">Summary</h5>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">{summary}</p>
                  </div>

                  {/* Competencies */}
                  <div className="space-y-1.5">
                    <h5 className="font-extrabold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 text-slate-950 leading-none">Core Competencies</h5>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {profile.skills.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No technical items registered.</span>
                      ) : (
                        profile.skills.map((skill, idx) => (
                          <span key={idx} className="bg-slate-50 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Experiences */}
                  <div className="space-y-2">
                    <h5 className="font-extrabold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 text-slate-950 leading-none">Employment History</h5>
                    <div className="space-y-3">
                      {history.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No job landmarks filled.</p>
                      ) : (
                        history.map((his) => (
                          <div key={his.id} className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                              <span>{his.role || "Role Designation"}</span>
                              <span className="font-mono text-[9px] text-slate-500">{his.dates || "Duration"}</span>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 block leading-none">{his.company || "Company"}</span>
                            {his.bullets && (
                              <ul className="list-disc pl-4 text-xs text-slate-600 leading-relaxed font-medium space-y-0.5">
                                {his.bullets.split("\n").filter(Boolean).map((bul, idx) => (
                                  <li key={idx}>{bul}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="space-y-2">
                    <h5 className="font-extrabold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 text-slate-950 leading-none">Engineering Projects</h5>
                    <div className="space-y-3">
                      {projects.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No projects listed.</p>
                      ) : (
                        projects.map((proj) => (
                          <div key={proj.id} className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                              <span>{proj.name || "Project Title"}</span>
                              <span className="font-mono text-[9px] text-slate-500">{proj.tech || "Stack bundle"}</span>
                            </div>
                            {proj.bullets && (
                              <ul className="list-disc pl-4 text-xs text-slate-600 leading-relaxed font-medium space-y-0.5">
                                {proj.bullets.split("\n").filter(Boolean).map((bul, idx) => (
                                  <li key={idx}>{bul}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Academics */}
                  <div className="space-y-1.5">
                    <h5 className="font-extrabold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 text-slate-950 leading-none">Education Credentials</h5>
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-extrabold text-slate-900 block">{degree || "Qualifying Degree"}</span>
                        <span className="text-[10px] font-bold text-indigo-650 block mt-0.5">{college || "Graduation Institute"}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">GRADUATED ACCREDITED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips footer */}
              <div className="text-[10px] text-slate-500 text-center select-none pt-1">
                💡 Pro Tip: For a premium single-page PDF print layout, disable page headers and footers in your web print options.
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== 2. COVER LETTER WORKSPACE ==================== */}
      {activeWorkspace === "cover-letter" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
          {/* Cover Letter Inputs Form */}
          <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest">
                AI Cover Letter Parameters
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block mb-1">Target Company</label>
                <input 
                  type="text" 
                  value={clCompany} 
                  onChange={e => setClCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-750 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-455 uppercase tracking-widest block mb-1">Target Role</label>
                <input 
                  type="text" 
                  value={clRole} 
                  onChange={e => setClRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-755 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-455 uppercase tracking-widest block mb-1">Experience Level</label>
                <input 
                  type="text" 
                  value={clExperience} 
                  onChange={e => setClExperience(e.target.value)}
                  placeholder="e.g. Entry-level Engineer, Manager" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-755 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-455 uppercase tracking-widest block mb-1">Verified Technical Skills Highlight</label>
                <input 
                  type="text" 
                  value={clSkills} 
                  onChange={e => setClSkills(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-750 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-400"
                />
                <span className="text-[9px] text-slate-400 block mt-1">Comma-separated talents used to contextually anchor paragraphs.</span>
              </div>
            </div>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingCl}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-xs rounded-xl shadow-md border border-indigo-500 hover:border-indigo-650 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isGeneratingCl ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Weaving dynamic narrative draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  Generate AI Cover Letter
                </>
              )}
            </button>

            {/* Editing field */}
            <div className="pt-2">
              <label className="text-[9px] font-bold text-slate-455 uppercase tracking-widest block mb-1">Edit Generated Document Block</label>
              <textarea 
                rows={10} 
                value={clText} 
                onChange={e => setClText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-indigo-400 leading-normal font-mono"
              />
            </div>
          </section>

          {/* Cover Letter Live Previewer Panel */}
          <section className="lg:col-span-7 printable-parent">
            <div className="bg-slate-900 rounded-3xl p-5 shadow-inner border border-slate-800 space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-bold text-slate-400 tracking-wider pb-3 border-b border-slate-800">
                <span className="uppercase select-none">🖥️ Live stationary letter printout</span>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleCopyClToClipboard}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedCl ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Letter
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Printer className="w-3 h-3" /> PDF / Print
                  </button>
                  <button 
                    onClick={handleDownloadDocxCl}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-emerald-400" /> DOCX
                  </button>
                  <button 
                    onClick={handleDownloadTxtCl}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-emerald-400" /> TXT
                  </button>
                </div>
              </div>

              {/* Simulated stationary block */}
              <div 
                id="cover-letter-print-area"
                style={{ minHeight: "720px" }}
                className="bg-white p-12 shadow-lg text-slate-950 font-serif select-all relative overflow-hidden print-canvas rounded-xl whitespace-pre-wrap leading-relaxed text-xs sm:text-sm"
              >
                {/* Visual marker top block line */}
                <div className="absolute top-0 right-0 left-0 h-[4px] bg-indigo-600" />

                <div className="space-y-4">
                  {/* Subject and body rendered faithfully */}
                  <div className="text-slate-900">
                    {clText}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center select-none pt-1">
                💡 Pro Tip: Download as DOCX to open directly in Microsoft Word or Google Docs for final submission formatting.
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
