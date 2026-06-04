import React, { useState } from "react";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Compass, 
  TrendingUp, 
  Save, 
  CheckCircle2,
  Phone,
  Bookmark
} from "lucide-react";
import { Profile } from "../types";

interface ProfileEditorProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
}

export default function ProfileEditor({ profile, onUpdateProfile }: ProfileEditorProps) {
  const [profileName, setProfileName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [region, setRegion] = useState(profile.region || "US");
  const [targetRole, setTargetRole] = useState(profile.targetRole || "");
  const [domain, setDomain] = useState(profile.domain || "Tech");
  const [skills, setSkills] = useState(profile.skills.join(", "));
  const [interests, setInterests] = useState(profile.interests.join(", "));
  const [college, setCollege] = useState(profile.college || "");
  const [degree, setDegree] = useState(profile.degree || "");
  const [education, setEducation] = useState(profile.education || "");
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel || "Student");

  const [savedSuccessAlert, setSavedSuccessAlert] = useState(false);

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert("Profile name must not be blank.");
      return;
    }

    const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
    const interestsArray = interests.split(",").map(i => i.trim()).filter(Boolean);

    const updated: Profile = {
      ...profile,
      name: profileName.trim(),
      phone: phone.trim(),
      region: region.trim(),
      targetCountry: region.trim(),
      targetRole: targetRole.trim(),
      domain: domain,
      skills: skillsArray,
      interests: interestsArray,
      college: college.trim(),
      degree: degree.trim(),
      education: education.trim(),
      experienceLevel: experienceLevel
    };

    onUpdateProfile(updated);
    setSavedSuccessAlert(true);
    setTimeout(() => {
      setSavedSuccessAlert(false);
    }, 5000);
  };

  const domainOptions = ["Tech", "Business", "Design", "HR", "Finance", "Marketing"];

  return (
    <div className="space-y-6 animate-fade-in" id="profile_module">
      
      {/* Profile Header */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 rounded-2xl">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Candidate Dossier Details</span>
            <h3 className="text-xl font-bold text-slate-800 mt-1">Applicant Profile Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Manage core biography and academic criteria used for resume scoring and placement diagnostics.</p>
          </div>
        </div>
      </section>

      {/* Success alert block */}
      {savedSuccessAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-slide-up shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Profile configuration has been written to the secure SQLite server database and synced across active panels!</span>
        </div>
      )}

      {/* Profile details form cards */}
      <form onSubmit={handleSubmitProfile} className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Section: Biography Dossier */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm lg:col-span-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Administrative Identity
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Authorized Name *</label>
                <input 
                  type="text" 
                  required 
                  value={profileName} 
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="e.g. Arav Jain" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Registered Account Email (Immutable)</label>
                <div className="relative">
                  <input 
                    type="email" 
                    disabled 
                    value={profile.email} 
                    className="w-full bg-slate-100/80 border border-slate-200/60 text-slate-450 text-xs px-3 py-2.5 rounded-xl cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-450 absolute right-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Country Code (Region)</label>
                <select 
                  value={region} 
                  onChange={e => setRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none font-bold"
                >
                  <option value="US">United States (USD)</option>
                  <option value="IN">India (INR)</option>
                  <option value="UK">United Kingdom (GBP)</option>
                  <option value="CA">Canada (CAD)</option>
                  <option value="DE">Germany (EUR)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Current XP Progression Status</label>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-700 font-mono">
                <span>💎 Level {profile.level} Candidate</span>
                <span>{profile.xp} Cumulative XP Balance</span>
              </div>
            </div>
          </section>

          {/* Section: Professional Dossier */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm lg:col-span-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" /> Career Alignment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Desired Role *</label>
                <input 
                  type="text" 
                  required 
                  value={targetRole} 
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="e.g. Solutions Architect" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Functional Domain Area</label>
                <select 
                  value={domain} 
                  onChange={e => setDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none font-bold"
                >
                  {domainOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Primary Core Keywords (Comma Separated)</label>
              <textarea 
                rows={2}
                value={skills} 
                onChange={e => setSkills(e.target.value)}
                placeholder="React, Frontend, TypeScript, Webpack, Responsive Layout, REST APIs" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs p-3 rounded-xl focus:outline-none font-medium leading-normal"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Interests, Domains, Tools (Comma Separated)</label>
              <input 
                type="text" 
                value={interests} 
                onChange={e => setInterests(e.target.value)}
                placeholder="Productivity, SaaS, FinTech, Cybersecurity, Node, Next.js" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none font-medium"
              />
            </div>
          </section>

          {/* Section: Academic Background */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm lg:col-span-12 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-400" /> Academic & Experience Level
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Hiring Phase category</label>
                <select 
                  value={experienceLevel} 
                  onChange={e => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none font-bold"
                >
                  <option value="Student">Student</option>
                  <option value="Intern">Intern seeker</option>
                  <option value="Fresher">Fresher / Graduate</option>
                  <option value="Beginner Developer">Beginner / Junior Candidate</option>
                  <option value="Senior Executive">Senior Executive</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Degree Title</label>
                <input 
                  type="text" 
                  value={degree} 
                  onChange={e => setDegree(e.target.value)}
                  placeholder="e.g. Master of Computer Applications" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">University / College Enlisted</label>
                <input 
                  type="text" 
                  value={college} 
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. Stanford University" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Expected Salary Graduation</label>
                <input 
                  type="text" 
                  value={education} 
                  onChange={e => setEducation(e.target.value)}
                  placeholder="e.g. $125,000" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 mb-12">
          <button 
            type="submit" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Biography Dossier
          </button>
        </div>

      </form>

    </div>
  );
}
