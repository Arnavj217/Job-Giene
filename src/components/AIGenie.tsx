import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  Download, 
  Check, 
  Loader2, 
  Bot, 
  User, 
  Compass, 
  Briefcase, 
  FileText, 
  GraduationCap, 
  ArrowRight,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import GenieLogo from "./GenieLogo";
import { Profile } from "../types";

interface AIGenieProps {
  profile: Profile;
  onUpdateProfile: (p: Profile) => void;
  onNavigate: (tab: string) => void;
}

interface ChatSession {
  conversation_id: string;
  user_id: string;
  title: string;
  timestamp: string;
}

interface ChatMessage {
  id?: number;
  question: string;
  response: string;
  timestamp: string;
}

export default function AIGenie({ profile, onUpdateProfile, onNavigate }: AIGenieProps) {
  // Session list controls
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionSearch, setSessionSearch] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Input fields and statuses
  const [inputVal, setInputVal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccessId, setCopySuccessId] = useState<number | null>(null);
  const [copyAllSuccess, setCopyAllSuccess] = useState(false);
  
  // Voice controls
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  const [voiceOutputActive, setVoiceOutputActive] = useState(true);
  const [latestVoiceRecognized, setLatestVoiceRecognized] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Quick action templates
  const quickActions = [
    { label: "Generate Resume", prompt: "I want to generate/review my resume. Provide bullet points and structural advice aligned with my profile and experience.", icon: <FileText className="w-3.5 h-3.5" /> },
    { label: "Improve ATS Score", prompt: "Can you review my resume analysis and tell me exactly how to improve my ATS score to 90+?", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "Find Jobs", prompt: "Summarize top roles and opening strategies aligned with my target role and key skills.", icon: <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: "Recommend Courses", prompt: "Based on my missing skill gaps, recommend a list of training courses, certifications, and resources.", icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: "Generate Roadmap", prompt: "Please detail a 4-phase learning roadmap for mastering my target stack.", icon: <Compass className="w-3.5 h-3.5 text-pink-400" /> },
    { label: "Mock Interview Prep", prompt: "Generate structured technical and behavioral interview preparation steps for my target sector.", icon: <Mic className="w-3.5 h-3.5 text-sky-400" /> },
    { label: "Career Guidance", prompt: "Analyze my background and provide personalized advice on setting realistic high-income tech career objectives.", icon: <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> },
    { label: "Project Ideas", prompt: "Suggest 3 custom, high-impact project ideas for my portfolio that combine my skills with industry-standard benchmarks.", icon: <Sparkles className="w-3.5 h-3.5 text-rose-400" /> }
  ];

  // Fetch conversations history on load
  const loadSessions = async (selectLatest = true) => {
    try {
      const res = await fetch("/api/ai-genie/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        
        if (selectLatest && data.sessions && data.sessions.length > 0) {
          const latestId = data.sessions[0].conversation_id;
          setActiveSessionId(latestId);
          loadSessionMessages(latestId);
        } else if (data.sessions && data.sessions.length === 0) {
          // No sessions on record, launch default welcome screen
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to load sessions list", err);
    }
  };

  const loadSessionMessages = async (sid: string) => {
    try {
      const res = await fetch(`/api/ai-genie/session/${sid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load session messages", err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Voice recognition init
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setVoiceInputActive(true);
        setLatestVoiceRecognized("");
      };

      rec.onresult = (e: any) => {
        const resultText = e.results[0][0].transcript;
        if (resultText) {
          setInputVal(prev => prev ? prev + " " + resultText : resultText);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setVoiceInputActive(false);
      };

      rec.onend = () => {
        setVoiceInputActive(false);
      };

      setRecognitionInstance(rec);
    }
  }, []);

  // Voice synthesizer read aloud
  const speakText = (text: string) => {
    if (!voiceOutputActive || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown syntax for natural speech
      const cleanString = text
        .replace(/[\#\*\_`\-\+\[\]\(\)]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300); // speaks the greeting or highlight paragraph

      const utterance = new SpeechSynthesisUtterance(cleanString);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Voice output synthesizer failed", err);
    }
  };

  const handleToggleVoiceInput = () => {
    if (!recognitionInstance) {
      alert("Speech recognition is not natively supported in your browser. Please use Chrome or Edge.");
      return;
    }
    if (voiceInputActive) {
      recognitionInstance.stop();
    } else {
      window.speechSynthesis.cancel(); // Mute currently reading genie before listing
      recognitionInstance.start();
    }
  };

  const handleNewChat = () => {
    window.speechSynthesis.cancel();
    setActiveSessionId(null);
    setMessages([]);
    setInputVal("");
  };

  const handleDeleteSession = async (e: React.MouseEvent, sid: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/ai-genie/session/${sid}`, { method: "DELETE" });
      if (res.ok) {
        if (activeSessionId === sid) {
          setActiveSessionId(null);
          setMessages([]);
        }
        loadSessions(false);
      }
    } catch (err) {
      console.error("Error deleting session", err);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isGenerating) return;

    window.speechSynthesis.cancel(); // Stop talking on active send
    setIsGenerating(true);

    // Create a temporary message record for immediate display
    const tempUserMsg: ChatMessage = {
      question: trimmed,
      response: "",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempUserMsg]);
    setInputVal("");

    const targetSessionId = activeSessionId; // Copy anchor values

    try {
      const payload: any = {
        message: trimmed
      };
      if (targetSessionId) {
        payload.conversationId = targetSessionId;
      }

      const response = await fetch("/api/ai-genie/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update messages with real response
        setMessages(prev => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1].response = data.response;
          }
          return next;
        });

        // Speak aloud text
        speakText(data.response);

        // Fetch session lists to update title triggers
        if (!targetSessionId) {
          setActiveSessionId(data.conversationId);
          await loadSessions(false);
          setActiveSessionId(data.conversationId);
        } else {
          loadSessions(false);
        }
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.error("Failed calling dynamic AI Genie pipeline", err);
      setMessages(prev => {
        const next = [...prev];
        if (next.length > 0) {
          next[next.length - 1].response = "AI Genie is currently maintaining server resources. Please attempt in a few moments.";
        }
        return next;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopySuccessId(idx);
    setTimeout(() => setCopySuccessId(null), 2000);
  };

  const handleDownloadSession = () => {
    if (messages.length === 0) return;
    const separator = "=".repeat(60) + "\n";
    let output = `JOB GIENE AI GENIE CONVERSATION LOG\nDate: ${new Date().toLocaleDateString()}\n${separator}\n`;
    messages.forEach((msg, idx) => {
      output += `[Q${idx + 1}] USER QUESTION:\n${msg.question}\n\n`;
      output += `[A${idx + 1}] AI GENIE RESPONSE:\n${msg.response}\n\n`;
      output += `${separator}\n`;
    });

    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-genie-session-${activeSessionId || "new"}.md`;
    link.click();
    URL.revokeObjectURL(url);
    
    setCopyAllSuccess(true);
    setTimeout(() => setCopyAllSuccess(false), 2000);
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(sessionSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-250/20 overflow-hidden min-h-[580px] grid grid-cols-1 lg:grid-cols-4 select-none">
      
      {/* 1. CHAT HISTORY SIDEBAR PANELS */}
      <div className="lg:col-span-1 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-950/80 select-none">
        
        {/* Banner triggers */}
        <div className="p-4 border-b border-slate-800/80 shrink-0">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-950/45 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>New Discussion</span>
          </button>
        </div>

        {/* Search tool block */}
        <div className="px-4 py-3 border-b border-slate-800/40 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search chat history..." 
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 hover:bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Scrollable history lists */}
        <div className="flex-1 p-3 overflow-y-auto space-y-1 select-none">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 italic">No matched dialogue found.</div>
          ) : (
            filteredSessions.map((s) => {
              const isActive = activeSessionId === s.conversation_id;
              return (
                <div 
                  key={s.conversation_id}
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    setActiveSessionId(s.conversation_id);
                    loadSessionMessages(s.conversation_id);
                  }}
                  className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer select-none ${
                    isActive 
                      ? "bg-slate-800 border-l-4 border-indigo-500 text-white" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-600"}`} />
                    <span className="text-[11px] font-bold truncate select-none leading-normal">{s.title}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDeleteSession(e, s.conversation_id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-950 transition-all cursor-pointer"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer details */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none">
          <span>SQL CLIENT PIPELINES</span>
          <span className="text-indigo-400 font-bold font-sans">LIVE</span>
        </div>

      </div>

      {/* 2. CHAT FEED & MESSAGE AREA */}
      <div className="lg:col-span-3 flex flex-col bg-[#F8FAFC]">
        
        {/* Header controller panels */}
        <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xs z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
              <GenieLogo size="sm" animate={isGenerating} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">AI Career Genie</h3>
                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-[9px] text-indigo-600 font-black tracking-widest rounded-full uppercase">Assistant</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Customized with SQLite profile & analytics filters</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Speak audio */}
            <button 
              onClick={() => {
                setVoiceOutputActive(!voiceOutputActive);
                if (voiceOutputActive) window.speechSynthesis.cancel();
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                voiceOutputActive 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" 
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
              }`}
              title={voiceOutputActive ? "Mute Voice Out" : "Enable Voice Response"}
            >
              {voiceOutputActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Print/Download Log Button */}
            {messages.length > 0 && (
              <button 
                onClick={handleDownloadSession}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Download conversation history (.md)"
              >
                {copyAllSuccess ? <Check className="w-4 h-4 text-emerald-500 animate-bounce" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">Export Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Core feeds panel scroll */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-10 space-y-8 select-none">
              
              {/* Introduction greetings */}
              <div className="text-center space-y-3">
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center p-3 text-white shadow-lg shadow-indigo-500/25">
                  <Sparkles className="w-9 h-9 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight font-sans">
                  Welcome to AI Genie, {profile.name}! ✨
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  I am connected directly with your personal profile, registered skills, resume diagnostics, learning courses, and mock evaluation scorecards.
                </p>
              </div>

              {/* Quick Actions grids */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Quick Career Prompts</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickActions.map((act, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSendMessage(act.prompt)}
                      className="text-left p-3.5 bg-white hover:bg-indigo-50/20 border border-slate-200/70 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-950 hover:shadow-xs transition-all flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="p-1.5 bg-slate-50 group-hover:bg-indigo-50 border border-slate-100 rounded-lg shrink-0">
                        {act.icon}
                      </div>
                      <div className="flex-1 leading-normal">
                        <span className="block font-bold mb-0.5">{act.label}</span>
                        <span className="block text-[10px] text-slate-400 font-medium group-hover:text-slate-500 truncate max-w-[210px]">
                          {act.prompt}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 mt-2 hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-4">
                  
                  {/* User Question */}
                  <div className="flex items-start gap-3 justify-end max-w-full">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4.5 py-3 text-xs leading-relaxed max-w-[85%] shadow-md shadow-indigo-950/20 font-sans tracking-wide">
                      {msg.question}
                    </div>
                    <div className="h-8 w-8 bg-slate-200/80 rounded-lg flex items-center justify-center font-bold text-slate-700 uppercase shrink-0 text-[10px]">
                      {profile.name.slice(0, 2)}
                    </div>
                  </div>

                  {/* AI response blocks */}
                  {(msg.response || isGenerating && idx === messages.length - 1) && (
                    <div className="flex items-start gap-3 max-w-full text-slate-800">
                      <div className="h-8 w-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="bg-white border border-slate-200/60 rounded-3xl rounded-tl-none px-5 py-4 leading-relaxed text-xs max-w-[85%] shadow-xs space-y-3 font-sans">
                        
                        {isGenerating && !msg.response ? (
                          <div className="flex items-center gap-2.5 py-1.5 text-slate-400 font-medium italic">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                            <span>Genie is formulating response...</span>
                          </div>
                        ) : (
                          <div className="space-y-2 whitespace-pre-wrap selection:bg-indigo-100 selection:text-indigo-900 select-all leading-normal text-slate-800">
                            {msg.response}
                          </div>
                        )}

                        {/* Actions overlay panel */}
                        {msg.response && (
                          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-400 shrink-0">
                            <button 
                              onClick={() => handleCopyText(msg.response, idx)}
                              className="hover:text-indigo-600 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              {copySuccessId === idx ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <span>•</span>
                            <span className="text-[10px] font-mono text-slate-300">
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </span>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 3. INPUT ZONE ACTIONS */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200/80 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2 hover:border-slate-300 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
              
              {/* Voice micro key */}
              <button 
                onClick={handleToggleVoiceInput}
                className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                  voiceInputActive 
                    ? "bg-rose-500 text-white animate-pulse" 
                    : "text-slate-400 hover:text-rose-500 hover:bg-slate-100"
                }`}
                title={voiceInputActive ? "Stop voice listening" : "Start Voice Input"}
              >
                {voiceInputActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input 
                type="text" 
                placeholder={voiceInputActive ? "Listening..." : "Ask programming, code-review, DSA, ATS or career questions..."}
                value={inputVal}
                disabled={voiceInputActive}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputVal);
                  }
                }}
                className="flex-grow bg-transparent text-slate-800 placeholder:text-slate-400 text-xs focus:outline-none py-1.5 focus:bg-transparent"
              />

              <button 
                onClick={() => handleSendMessage(inputVal)}
                disabled={!inputVal.trim() || isGenerating}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  inputVal.trim() && !isGenerating
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-950/20" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>

            </div>
            
            <p className="text-[9px] text-slate-400 font-bold tracking-normal text-center mt-2.5">
              Powered by secure Node SQLite memory modules. Responses are contextually personalized to your candidate credentials.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
