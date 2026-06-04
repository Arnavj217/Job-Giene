import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  ExternalLink,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Inbox,
  Filter
} from "lucide-react";
import { Profile } from "../types";

interface ApplicationEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  salary: string;
  status: "Applied" | "Interviewing" | "Offered" | "Rejected";
  appliedDate: string;
  link?: string;
}

interface ApplicationsManagerProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
}

export default function ApplicationsManager({ profile, onUpdateProfile }: ApplicationsManagerProps) {
  const [apps, setApps] = useState<ApplicationEntry[]>(profile.applications || []);
  const [formOpen, setFormOpen] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [locInput, setLocInput] = useState("Remote");
  const [salaryInput, setSalaryInput] = useState("");
  const [statusInput, setStatusInput] = useState<"Applied" | "Interviewing" | "Offered" | "Rejected">("Applied");
  const [linkInput, setLinkInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Applied" | "Interviewing" | "Offered" | "Rejected">("All");

  useEffect(() => {
    if (profile.applications) {
      setApps(profile.applications);
    }
  }, [profile.applications]);

  const handleAddApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim() || !companyInput.trim()) {
      alert("Role and Company are required parameters.");
      return;
    }

    const newApp: ApplicationEntry = {
      id: "app-custom-" + Date.now(),
      role: roleInput.trim(),
      company: companyInput.trim(),
      location: locInput.trim() || "Remote",
      salary: salaryInput.trim() || "N/A",
      status: statusInput,
      appliedDate: new Date().toISOString().split("T")[0],
      link: linkInput.trim() || undefined
    };

    const nextApps = [newApp, ...apps];
    setApps(nextApps);

    // Increment profile XP to reward user!
    const updatedProfile = {
      ...profile,
      xp: profile.xp + 100,
      level: Math.floor(1 + (profile.xp + 100) / 500),
      applications: nextApps
    };
    onUpdateProfile(updatedProfile);

    // Clear Form & close
    setRoleInput("");
    setCompanyInput("");
    setLocInput("Remote");
    setSalaryInput("");
    setStatusInput("Applied");
    setLinkInput("");
    setFormOpen(false);
  };

  const handleDeleteApplication = (id: string, role: string) => {
    const nextApps = apps.filter(a => a.id !== id);
    setApps(nextApps);
    onUpdateProfile({
      ...profile,
      applications: nextApps
    });
  };

  const handleStatusChange = (id: string, newStatus: "Applied" | "Interviewing" | "Offered" | "Rejected") => {
    const nextApps = apps.map(a => {
      if (a.id === id) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    setApps(nextApps);

    // Reward XP on offer!
    let nextXp = profile.xp;
    if (newStatus === "Offered") {
      nextXp += 200;
    }
    onUpdateProfile({
      ...profile,
      xp: nextXp,
      level: Math.floor(1 + nextXp / 500),
      applications: nextApps
    });
  };

  const filteredApps = statusFilter === "All" ? apps : apps.filter(a => a.status === statusFilter);

  // Statistics summaries
  const totalCount = apps.length;
  const inProgress = apps.filter(a => a.status === "Interviewing").length;
  const offered = apps.filter(a => a.status === "Offered").length;
  const appliedCount = apps.filter(a => a.status === "Applied").length;

  return (
    <div className="space-y-6 animate-fade-in" id="applications_module">
      
      {/* Applications Header */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 rounded-2xl">
            <CheckSquare className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Active Applications Desk</span>
            <h3 className="text-xl font-bold text-slate-800 mt-1">Hiring Applications Pipeline</h3>
            <p className="text-xs text-slate-500 mt-1">Submit, follow up, and update career application steps in real time.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setFormOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow flex items-center gap-1.5 transition-all cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Log Applied Position
        </button>
      </section>

      {/* Bento Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Logged Entries", count: totalCount, color: "text-slate-700 bg-slate-50 border-slate-200" },
          { label: "Submitted", count: appliedCount, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
          { label: "Interviewing", count: inProgress, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { label: "Offers Acquired", count: offered, color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
        ].map((stat, idx) => (
          <div key={idx} className={`rounded-2xl border p-4 shadow-sm flex flex-col ${stat.color}`}>
            <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono tracking-wider">{stat.label}</span>
            <span className="text-2xl font-black mt-2">{stat.count}</span>
          </div>
        ))}
      </div>

      {/* Drawer Mode Form Modal popup */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 w-full max-w-lg shadow-xl animate-scale-in">
            <h4 className="text-base font-extrabold text-slate-800 mb-2">Log Job Proposal Enlistment</h4>
            <p className="text-xs text-slate-400 mb-6">Enlist newly targeted candidate status vacancy details to synchronize database indexes.</p>

            <form onSubmit={handleAddApplicationSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Role *</label>
                  <input 
                    type="text" 
                    required 
                    value={roleInput} 
                    onChange={e => setRoleInput(e.target.value)}
                    placeholder="e.g. UX Designer" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Company Host *</label>
                  <input 
                    type="text" 
                    required 
                    value={companyInput} 
                    onChange={e => setCompanyInput(e.target.value)}
                    placeholder="e.g. Airbnb" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Salary Range</label>
                  <input 
                    type="text" 
                    value={salaryInput} 
                    onChange={e => setSalaryInput(e.target.value)}
                    placeholder="e.g. $120,000/Yr" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Office / Remote Location</label>
                  <input 
                    type="text" 
                    value={locInput} 
                    onChange={e => setLocInput(e.target.value)}
                    placeholder="e.g. Austin, TX or Remote" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status Phase</label>
                  <select 
                    value={statusInput} 
                    onChange={e => setStatusInput(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none font-bold"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Listing Link</label>
                  <input 
                    type="url" 
                    value={linkInput} 
                    onChange={e => setLinkInput(e.target.value)}
                    placeholder="https://example.com/job" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-bold text-xs"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow"
                >
                  Log Account (+100 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Table segment */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Filters menu bar */}
        <div className="p-5 border-b border-slate-250 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 leading-none">
            <Filter className="w-4 h-4 text-slate-400" /> Filter pipeline status:
          </span>
          
          <div className="flex gap-1">
            {["All", "Applied", "Interviewing", "Offered", "Rejected"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f as any)}
                className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold ${
                  statusFilter === f 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic text-xs space-y-4">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="max-w-sm mx-auto">No listed career applications match state filters. Begin logger registry submissions to follow progress!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-400 uppercase tracking-widest text-[9px] font-black">
                  <th className="py-3 px-5">Target Vacancy</th>
                  <th className="py-3 px-5">Hosting Company</th>
                  <th className="py-3 px-5">Office Region</th>
                  <th className="py-3 px-5">Expected Salary</th>
                  <th className="py-3 px-5">Submission Date</th>
                  <th className="py-3 px-5">Job Phase</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredApps.map((ap) => (
                  <tr key={ap.id} className="hover:bg-slate-100/20 select-text transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-800">
                      {ap.role}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-indigo-500 flex items-center gap-1.5">
                      {ap.company}
                      {ap.link && (
                        <a href={ap.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 font-semibold">{ap.location}</td>
                    <td className="py-3.5 px-5 text-slate-500 font-bold font-mono">{ap.salary}</td>
                    <td className="py-3.5 px-5 text-slate-400 font-semibold">{ap.appliedDate}</td>
                    <td className="py-3.5 px-5">
                      <select
                        value={ap.status}
                        onChange={e => handleStatusChange(ap.id, e.target.value as any)}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg border focus:outline-none transition-all uppercase tracking-wider bg-transparent ${
                          ap.status === "Offered" ? "text-emerald-600 border-emerald-200 bg-emerald-50/10" :
                          ap.status === "Interviewing" ? "text-blue-600 border-blue-200 bg-blue-50/10" :
                          ap.status === "Rejected" ? "text-rose-600 border-rose-250 bg-rose-50/10" :
                          "text-slate-600 border-slate-200 bg-slate-50/10"
                        }`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interview Phase</option>
                        <option value="Offered">Offered Awarded</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button 
                        onClick={() => handleDeleteApplication(ap.id, ap.role)}
                        className="p-1 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 cursor-pointer inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
