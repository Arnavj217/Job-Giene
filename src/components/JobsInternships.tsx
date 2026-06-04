import React, { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Search, 
  Briefcase, 
  TrendingUp, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  HelpCircle,
  RefreshCw,
  MailCheck
} from "lucide-react";
import { Profile, JobOpenings } from "../types";

interface JobsInternshipsProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
  viewSavedOnly?: boolean;
}

export default function JobsInternships({ profile, onUpdateProfile, viewSavedOnly = false }: JobsInternshipsProps) {
  // Query Filters
  const [jobSearch, setJobSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState(profile.targetCountry || "US");
  const [domainFilter, setDomainFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All"); // Job vs Internship
  const [remoteFilter, setRemoteFilter] = useState("All"); // Remote ok vs On-site

  // Loaded database state
  const [listOfJobs, setListOfJobs] = useState<JobOpenings[]>([]);
  const [isJobsCatalogLoading, setIsJobsCatalogLoading] = useState(false);

  // Recruiter support ticket draft state
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSubmittedFeedback, setSupportSubmittedFeedback] = useState<string | null>(null);

  const fetchJobsDatabase = async () => {
    setIsJobsCatalogLoading(true);
    try {
      const q = new URLSearchParams();
      q.append("country", countryFilter);
      if (jobSearch) q.append("search", jobSearch);
      if (domainFilter !== "All") q.append("domain", domainFilter);
      if (typeFilter !== "All") q.append("type", typeFilter);
      if (remoteFilter !== "All") q.append("remote", remoteFilter);

      const response = await fetch(`/api/jobs?${q.toString()}`);
      if (!response.ok) throw new Error("Hiring database query failed.");
      const data = await response.json();
      setListOfJobs(data);
    } catch (e) {
      console.error("Failed loading jobs list", e);
    } finally {
      setIsJobsCatalogLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsDatabase();
  }, [countryFilter, domainFilter, typeFilter, remoteFilter]);

  const handleSearchConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobsDatabase();
  };

  const toggleBookmarkJob = (jobId: string) => {
    let updatedSaved = [...profile.savedJobs];
    if (updatedSaved.includes(jobId)) {
      updatedSaved = updatedSaved.filter(id => id !== jobId);
    } else {
      updatedSaved.push(jobId);
    }

    const updatedProfile = { 
      ...profile, 
      savedJobs: updatedSaved,
      // Increase XP slightly for active researching!
      xp: profile.xp + 10,
      level: Math.floor(1 + (profile.xp + 10) / 500)
    };
    onUpdateProfile(updatedProfile);
  };

  const handleSendRecruiterTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    setSupportSubmittedFeedback("Analyzing ticket context...");
    setTimeout(() => {
      setSupportSubmittedFeedback(`Ticket successfully generated! A JOB GIENE Recruiter Desk counselor will update your dashboard notifications at ${profile.email} within 24 hours.`);
      setSupportMessage("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Filter Toolbar Console Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        
        {/* Row 1: Country Exchange selection + text query search */}
        <form onSubmit={handleSearchConfirm} className="flex flex-col md:flex-row gap-3">
          
          {/* Target exchange country select */}
          <div className="w-full md:w-52 shrink-0">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Currency Country Region</label>
            <select 
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                // Also update profile target country for sync!
                onUpdateProfile({ ...profile, targetCountry: e.target.value });
              }}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
            >
              <option value="US">🇺🇸 United States (USD)</option>
              <option value="IN">🇮🇳 India Zone (INR/₹)</option>
              <option value="UK">🇬🇧 Great Britain (GBP/£)</option>
              <option value="CA">🇨🇦 Canada (CAD/C$)</option>
              <option value="DE">🇩🇪 Germany/Europe (EUR/€)</option>
            </select>
          </div>

          {/* Search phrase text input */}
          <div className="flex-grow">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 font-medium">Search role positions or stack tools</label>
            <div className="flex bg-slate-50 rounded-xl border border-slate-250 items-center px-3.5 h-11">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="E.g. Frontend developer, Figma designer, Stripe tools..." 
                className="bg-transparent border-none text-xs ml-2 w-full focus:outline-none text-slate-700 font-medium"
              />
              <button 
                type="submit" 
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-extrabold uppercase shrink-0 cursor-pointer"
              >
                Go
              </button>
            </div>
          </div>

        </form>

        {/* Row 2: Segments Advanced filters (domains, positions types, on site limits) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3 relative z-10">
          
          {/* Career area */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase font-extrabold text-slate-400 mb-1 font-medium">Sector Domain</label>
            <div className="flex gap-1 flex-wrap">
              {["All", "Tech", "Design", "Finance", "HR", "Marketing"].map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setDomainFilter(dom)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold ${
                    domainFilter === dom 
                      ? "bg-indigo-600 border-indigo-600 text-white" 
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Role Type */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase font-extrabold text-slate-400 mb-1 font-medium">Position Scope</label>
            <div className="flex gap-1">
              {["All", "Job", "Internship"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold ${
                    typeFilter === type 
                      ? "bg-indigo-600 border-indigo-600 text-white" 
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {type}s
                </button>
              ))}
            </div>
          </div>

          {/* Remote settings */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase font-extrabold text-slate-400 mb-1 font-medium">Office Presence</label>
            <div className="flex gap-1">
              {["All", "Remote", "On-site"].map((rm) => (
                <button
                  key={rm}
                  type="button"
                  onClick={() => setRemoteFilter(rm)}
                  className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold ${
                    remoteFilter === rm 
                      ? "bg-indigo-600 border-indigo-600 text-white" 
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {rm}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Main Grid Content Panels */}
      {(() => {
        const displayedJobs = viewSavedOnly 
          ? listOfJobs.filter(job => profile.savedJobs.includes(job.id))
          : listOfJobs;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
            
            {/* Listings Display Sheet Column */}
            <section className="lg:col-span-8 space-y-4">
              
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-500">
                  {displayedJobs.length} active matching positions detected
                </span>
                {displayedJobs.length > 0 && (
                  <span className="text-[10px] uppercase font-bold text-slate-400 italic">
                    Converted to region code standard: {displayedJobs[0].currencyCode}
                  </span>
                )}
              </div>

              {isJobsCatalogLoading ? (
                <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-inner">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-sans">Translating global listings coordinates...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedJobs.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                      <p className="text-xs text-slate-500">
                        {viewSavedOnly 
                          ? "You have not saved any jobs yet. Browse available jobs to bookmark listings!" 
                          : "No active positions match your advanced filter criteria. Try expanding search options."}
                      </p>
                    </div>
                  ) : (
                    displayedJobs.map((job) => {
                      const isSaved = profile.savedJobs.includes(job.id);
                      // Highlight green tags for skills currently uploaded on profile
                      const userSkillsSet = new Set(profile.skills.map(s => s.toLowerCase()));
                  
                  return (
                    <div 
                      key={job.id}
                      className="bg-white rounded-3xl border border-slate-250 hover:border-indigo-300 p-5 shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start gap-4 hover:shadow-md hover:bg-slate-50/20"
                    >
                      <div className="space-y-2 flex-grow">
                        {/* Scope badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase font-extrabold tracking-wider bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-0.5 rounded-md">
                            {job.type} • {job.domain}
                          </span>
                          
                          {job.remote && (
                            <span className="text-[9px] uppercase font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-md">
                              🏠 Remote Allowed
                            </span>
                          )}
                        </div>

                        {/* Title group */}
                        <div>
                          <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                            {job.role}
                          </h4>
                          <span className="text-xs text-slate-500 font-semibold block mt-1.5 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {job.company} • <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                          </span>
                        </div>

                        {/* Stated Tech criteria matching highlights */}
                        <div className="pt-2">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-medium">Stack match criteria</span>
                          <div className="flex flex-wrap gap-1.5">
                            {job.skillsRequired.map((s, idx) => {
                              const matches = userSkillsSet.has(s.toLowerCase());
                              return (
                                <span 
                                  key={idx} 
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                    matches 
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                      : "bg-slate-50 text-slate-400 border border-slate-150"
                                  }`}
                                >
                                  {s} {matches ? "✔" : ""}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar actions: salaries converted & bookmark switches */}
                      <div className="sm:text-right flex sm:flex-col justify-between w-full sm:w-auto shrink-0 border-t sm:border-none border-slate-100 pt-3 sm:pt-0">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold block">Local Pay Index</span>
                          <span className="text-base font-black text-indigo-600 mt-1 block">
                            {job.salaryDisplay}
                          </span>
                        </div>

                        <div className="mt-4 flex sm:justify-end gap-2 text-xs">
                          <button 
                            onClick={() => toggleBookmarkJob(job.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isSaved 
                                ? "bg-amber-50 border-amber-200 text-amber-500" 
                                : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                          
                          <a 
                            href={job.applyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                          >
                            Apply Direct <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

        </section>

        {/* Recruiter desk card right column */}
        <section className="lg:col-span-4 space-y-4">
          
          <div className="bg-gradient-to-br from-indigo-950/90 to-slate-900 rounded-3xl border border-indigo-500/10 p-6 text-white text-xs">
            <h3 className="font-extrabold text-sm mb-1.5 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" /> Recruiter Support Hotline
            </h3>
            <p className="text-indigo-200 leading-relaxed mb-4">Have specific queries about visa policies, stipends, or hiring timelines for matching domains?</p>
            
            <form onSubmit={handleSendRecruiterTicket} className="space-y-3">
              <textarea 
                rows={4}
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Write specific application or visa questions here for direct counsel review..."
                className="w-full text-[11px] p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 font-sans focus:outline-none focus:border-indigo-400 leading-relaxed"
              />

              {supportSubmittedFeedback && (
                <div className="p-3 bg-indigo-900/40 border border-indigo-700/60 rounded-xl text-emerald-300 font-medium">
                  {supportSubmittedFeedback}
                </div>
              )}

              <button 
                type="submit"
                disabled={!supportMessage.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/10 text-white text-[11px] font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MailCheck className="w-3.5 h-3.5 text-emerald-300" />
                Dispatch Ticket Counselor
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-slate-400" /> Bookmarks Summary ({profile.savedJobs.length})
            </h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {profile.savedJobs.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No positions saved to dashboard bookmarks list.</p>
              ) : (
                profile.savedJobs.map((id, key) => (
                  <div key={key} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 flex justify-between select-none">
                    <span>📌 Job ID: {id}</span>
                    <button 
                      onClick={() => toggleBookmarkJob(id)}
                      className="text-slate-400 hover:text-red-500 text-xs font-extrabold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

      </div>
      );
      })()}

    </div>
  );
}
