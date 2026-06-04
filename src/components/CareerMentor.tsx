import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Briefcase, 
  FileText, 
  GraduationCap, 
  ArrowRight, 
  Download, 
  HelpCircle,
  Cpu,
  Trash2,
  RefreshCw,
  Edit3
} from "lucide-react";
import GenieLogo from "./GenieLogo";
import { Profile } from "../types";

interface CareerMentorProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function CareerMentor({ profile, onUpdateProfile }: CareerMentorProps) {
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: `Hello ${profile.name}! 👋 I am your **JOB GIENE Career Mentor**. I have analyzed your target career aspirations as a **${profile.targetRole}**.\n\nAsk me anything! For example, I can:\n- Recommend custom project architectures to list on your resume.\n- Structure your technical interview elevator pitch using the STAR strategy.\n- Pinpoint how to raise your ATS score above 85% with specific tags.\n\nSelect a quick topic below or write your specific obstacle! 🚀`
    }
  ]);
  const [isChatting, setIsChatting] = useState(false);

  // Load persistent conversation logs on mount from SQLite
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch("/api/mentor/chat/history");
        if (response.ok) {
          const data = await response.json();
          if (data.history && data.history.length > 0) {
            setChatMessages(data.history);
          } else {
            setChatMessages([
              {
                role: "model",
                text: `Hello ${profile.name}! 👋 I am your **JOB GIENE Career Mentor**. I have analyzed your target career aspirations as a **${profile.targetRole || "chosen developer tracks"}**.\n\nAsk me anything! For example, I can:\n- Recommend custom project architectures to list on your resume.\n- Structure your technical interview elevator pitch using the STAR strategy.\n- Pinpoint how to raise your ATS score above 85% with specific tags.\n\nSelect a quick topic below or write your specific obstacle! 🚀`
              }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed loading SQLite chat history:", err);
      }
    };
    fetchChatHistory();
  }, [profile.email, profile.targetRole]);

  // Cover Letter state
  const [companyName, setCompanyName] = useState("");
  const [jobPosition, setJobPosition] = useState(profile.targetRole || "Frontend Engineer");
  const [expGroup, setExpGroup] = useState(profile.experienceLevel || "College Student");
  const [skillHighlight, setSkillHighlight] = useState(profile.skills.join(", ") || "React, CSS, web layouts");
  
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const [mentorActiveTab, setMentorActiveTab] = useState<"coach" | "letter">("coach");

  const quickPrompts = [
    { label: "React + TS Project ideas", text: "Suggest 3 unique non-generic project ideas using React and TypeScript that will impress technical interviewers." },
    { label: "Elevator pitch structure", text: "How do I structure my 'Tell me about yourself' self-introduction slide for a Frontend position?" },
    { label: "Best remote domains", text: "What career domains are seeing the highest growth for remote freshman entry-level roles?" }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: ChatMessage = { role: "user", text: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatting(true);

    try {
      // Map history payload
      const historyPayload = chatMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      if (!response.ok) throw new Error("Advisor system is taking a quick break. Try sending your query again.");
      const data = await response.json();

      setChatMessages(prev => [...prev, { role: "model", text: data.reply }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { 
        role: "model", 
        text: `⚠️ **Recruiter AI Coach Error:** ${err.message || "Connection timed out."}` 
      }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleGenerateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert("Please designate a target company name to personalize your Cover Letter.");
      return;
    }

    setIsGeneratingLetter(true);
    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          jobRole: jobPosition,
          experienceLevel: expGroup,
          skillHighlights: skillHighlight
        })
      });

      if (!response.ok) throw new Error("Hiring template engine failed.");
      const data = await response.json();
      setGeneratedLetter(data.letter);
    } catch (err: any) {
      alert(err.message || "Could not synthesize cover letter.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const downloadCoverLetterText = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Cover_Letter_for_${companyName.replace(/\s+/g, "_")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Mentor Tab Nav buttons - Sleek segmented control */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-80">
        <button
          onClick={() => setMentorActiveTab("coach")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mentorActiveTab === "coach" 
              ? "bg-white text-slate-800 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          AI Career Advisor Desk
        </button>
        <button
          onClick={() => setMentorActiveTab("letter")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mentorActiveTab === "letter" 
              ? "bg-white text-slate-800 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Pro Cover Letter Generator
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: AI CAREER COACH */}
        {mentorActiveTab === "coach" && (
          <>
            {/* Quick Suggestions Left Block */}
            <section className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" /> Consult pre-configured topics
                </h3>
                <p className="text-xs text-slate-500 mb-4">Click any option to prompt the advisor naturally.</p>
                
                <div className="space-y-2">
                  {quickPrompts.map((pt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(pt.text)}
                      className="w-full p-3 bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-200 border border-slate-100 text-left rounded-2xl text-xs font-semibold text-slate-700 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="max-w-[180px] truncate">{pt.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Advise metrics</span>
                <h4 className="text-xs font-extrabold text-slate-700 mt-2">Active Recruiter Context</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Our system automatically passes your target role <strong className="text-indigo-600">({profile.targetRole})</strong> and current skills <strong className="text-indigo-600">({profile.skills.join(", ") || "None"})</strong> with every chat thread so suggestions stay completely personalized.
                </p>
              </div>
            </section>

            {/* Main Interactive Chat Panel */}
            <section className="lg:col-span-8">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden justify-between">
                
                {/* Chat Panel Title header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <GenieLogo size="sm" animate={true} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        GIENE Career Advisor
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                      </h4>
                      <span className="text-[10px] text-slate-400">Generative insights active • Live context</span>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (window.confirm("Clear active coaching session logs?")) {
                        try {
                          await fetch("/api/mentor/chat/clear", { method: "POST" });
                        } catch (e) {
                          console.error("Could not clear logs on server:", e);
                        }
                        setChatMessages([{
                          role: "model",
                          text: `Session reset! Speak your target career barriers to initiate a brand-new tutor track.`
                        }]);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Messages scroll area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/20 font-sans text-xs">
                  {chatMessages.map((msg, index) => {
                    const isBot = msg.role === "model";
                    return (
                      <div 
                        key={index} 
                        className={`flex items-start gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
                      >
                        {isBot && (
                          <div className="shrink-0 mt-0.5">
                            <GenieLogo size="sm" animate={false} />
                          </div>
                        )}
                        <div className={`p-3.5 max-w-[85%] rounded-2xl ${
                          isBot 
                            ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none leading-relaxed font-semibold whitespace-pre-line shadow-sm" 
                            : "bg-indigo-600 text-white rounded-tr-none font-medium text-xs shadow-inner shadow-indigo-700"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}

                  {isChatting && (
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="shrink-0">
                        <GenieLogo size="sm" isSpeaking={true} />
                      </div>
                      <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                        <span className="text-[10px] text-slate-400 pl-1 font-medium italic">Brainstorming mentoring path...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Prompt Entry Box */}
                <div className="p-3 border-t border-slate-100 flex gap-2 bg-white">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage(chatInput);
                    }}
                    placeholder="Search careers, project code gaps, or resume structures..."
                    className="flex-grow text-xs px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-medium"
                  />
                  <button 
                    onClick={() => handleSendMessage(chatInput)}
                    disabled={isChatting}
                    className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </section>
          </>
        )}

        {/* TAB 2: PRO COVER LETTER GENERATOR */}
        {mentorActiveTab === "letter" && (
          <>
            {/* Input Parameters panel */}
            <section className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-base mb-1 flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-indigo-500 animate-pulse" /> Letter Blueprint
                </h3>
                <p className="text-xs text-slate-500 mb-4 font-medium">Auto-synthesizes aligned corporate letters to insert into hiring pipelines.</p>
                
                <form onSubmit={handleGenerateCoverLetter} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Company Name</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="E.g. Stripe, Google, Acme Labs" 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Role Position</label>
                    <input 
                      type="text" 
                      value={jobPosition}
                      onChange={(e) => setJobPosition(e.target.value)}
                      placeholder="E.g. Associate Web Architect" 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Experience Level</label>
                    <input 
                      type="text" 
                      value={expGroup}
                      onChange={(e) => setExpGroup(e.target.value)}
                      placeholder="E.g. College Fresher, Internship seeker" 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Core Tech Gained Highlights</label>
                    <input 
                      type="text" 
                      value={skillHighlight}
                      onChange={(e) => setSkillHighlight(e.target.value)}
                      placeholder="Highlight skills..." 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingLetter}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    {isGeneratingLetter ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Weaving professional credentials...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        Autogenerate Cover Letter
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Output preview / copy area */}
            <section className="lg:col-span-7">
              {generatedLetter ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Output preview document</span>
                    <button 
                      onClick={downloadCoverLetterText}
                      className="py-1.5 px-3 bg-indigo-50 border border-indigo-100 hover:bg-indigo-150 text-indigo-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download Letter (.txt)
                    </button>
                  </div>

                  {/* Fully editable printable paper letter layout */}
                  <textarea 
                    rows={16}
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs text-slate-700 leading-relaxed font-mono focus:outline-none focus:border-slate-300"
                  />
                  <div className="text-[10px] text-slate-400 italic">
                    Tip: The draft text box is completely editable. Highlight any words or replace dates directly on the screen before downloading.
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center h-[460px] flex flex-col justify-center items-center">
                  <FileText className="w-12 h-12 text-slate-300 mb-3" />
                  <h3 className="font-bold text-slate-600">Personalize Your Letter Layout</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                    Enter the company and target role parameters in the blueprint block to auto-compile highly persuasive letters matching standard corporate credentials formats.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

      </div>

    </div>
  );
}
