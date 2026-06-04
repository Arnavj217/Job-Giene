import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import path from "path";
import { PRESET_CURATED_COURSES } from "./courses_db.js";
import { GoogleGenAI } from "@google/genai";
import dns from "dns";
import bcrypt from "bcryptjs";
import http from "http";
import { WebSocketServer } from "ws";
import { connectDB } from "./server/db.js";
import {
  User, ATSScore, Resume, CoverLetter, Roadmap, RoadmapProgress,
  Course, SavedCourse, Job, SavedJob, InterviewSession, InterviewQuestion,
  InterviewAnswer, InterviewReport, ChatSession, ChatMessage, Activity, AdminLog
} from "./server/models/index.js";
import { generateToken, verifyToken, requireAdmin } from "./server/middleware/auth.js";
import { ResumeReport, InterviewSession as IInterviewSessionType, RoadmapNode, CareerRoadmap, Profile } from "./src/types.js";

// Ensure DNS works properly
dns.setDefaultResultOrder && dns.setDefaultResultOrder("ipv4first");

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;

// Create HTTP server wrapping express
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const wsClients = new Set<any>();

wss.on("connection", (ws) => {
  wsClients.add(ws);
  ws.on("close", () => {
    wsClients.delete(ws);
  });
});

function broadcastWS(event: string, payload: any) {
  const msg = JSON.stringify({ event, payload });
  for (const client of wsClients) {
    if (client.readyState === 1) {
      client.send(msg);
    }
  }
}

app.use(express.json({ limit: "50mb" }));

// Helper to get Gemini Client with lazy initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

// Robust JSON Cleaner & Parser for Gemini LLM responses
function cleanAndParseJSON(rawText: string): any {
  if (!rawText) throw new Error("Empty response received from AI model.");
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?/i, "");
    cleaned = cleaned.replace(/```$/, "");
    cleaned = cleaned.trim();
  }
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let startIndex = -1;
  let endIndex = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
    endIndex = cleaned.lastIndexOf("}");
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
    endIndex = cleaned.lastIndexOf("]");
  }
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    cleaned = cleaned.substring(startIndex, endIndex + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch (err: any) {
    try {
      const lines = cleaned.split("\n").map(line => {
        if (line.includes("//") && !line.includes("://")) {
          return line.split("//")[0];
        }
        return line;
      });
      cleaned = lines.join("\n").trim();
      return JSON.parse(cleaned);
    } catch (fallbackErr: any) {
      throw new Error(`Failed to parse response to JSON: ${err.message}`);
    }
  }
}

// -------------------------------------------------------------------------
// JOB & COURSE INTERFACES (in-memory defaults)
// -------------------------------------------------------------------------
interface JobItem {
  id: string;
  role: string;
  company: string;
  domain: string;
  type: "Job" | "Internship";
  location: string;
  remote: boolean;
  usdMinSalary: number;
  usdMaxSalary: number;
  skillsRequired: string[];
  applyLink: string;
}

interface CourseItem {
  id: string;
  title: string;
  platform: string;
  skills: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  link: string;
  rating: number;
  duration?: string;
  instructor?: string;
  type?: string;
  domain?: string;
  learners?: string;
  certificate?: string;
  subDomain?: string;
  isAiRecommended?: boolean;
  recommendReason?: string;
}

// Default pre-populated job database
let DEFAULT_JOBS: JobItem[] = [
  { id: "j1", role: "Software Engineering Intern (Front-End/Full-Stack)", company: "Google LLC", domain: "Tech", type: "Internship", location: "US", remote: true, usdMinSalary: 6800, usdMaxSalary: 9500, skillsRequired: ["React", "TypeScript", "JavaScript", "CSS"], applyLink: "https://careers.google.com/jobs/results/?q=intern" },
  { id: "j2", role: "Junior Web UX Frontend Build Engineer", company: "Vercel Inc", domain: "Tech", type: "Job", location: "US", remote: true, usdMinSalary: 85000, usdMaxSalary: 115000, skillsRequired: ["Next.js", "React", "Tailwind CSS", "REST APIs"], applyLink: "https://vercel.com/careers" },
  { id: "j3", role: "Associate Interface Product Designer", company: "Figma Inc", domain: "Design", type: "Job", location: "UK", remote: true, usdMinSalary: 72000, usdMaxSalary: 95000, skillsRequired: ["Figma", "UI Design", "Design Systems", "Prototyping"], applyLink: "https://www.figma.com/careers/" },
  { id: "j4", role: "Core Commerce Business Systems Intern", company: "Stripe Systems Inc", domain: "Finance", type: "Internship", location: "US", remote: false, usdMinSalary: 5500, usdMaxSalary: 7200, skillsRequired: ["Excel", "Financial Modeling", "Data Analysis", "SQL"], applyLink: "https://stripe.com/jobs" },
  { id: "j5", role: "Growth Campaign & Dynamic Marketing Analyst", company: "Semrush Inc", domain: "Marketing", type: "Job", location: "CA", remote: true, usdMinSalary: 64000, usdMaxSalary: 82000, skillsRequired: ["SEO", "Google Analytics", "Content Strategy", "Digital Marketing"], applyLink: "https://www.semrush.com/company/careers/" },
  { id: "j6", role: "People Operations & HR Intern", company: "Microsoft Corp", domain: "HR", type: "Internship", location: "DE", remote: false, usdMinSalary: 3800, usdMaxSalary: 5200, skillsRequired: ["Talent Acquisition", "Communication", "Onboarding", "Excel"], applyLink: "https://careers.microsoft.com/" },
  { id: "j7", role: "Machine Learning Solutions Architect Support", company: "Cognitive Systems Inc", domain: "Tech", type: "Job", location: "US", remote: true, usdMinSalary: 105000, usdMaxSalary: 140000, skillsRequired: ["Python", "TensorFlow", "Pandas", "Scikit-Learn"], applyLink: "https://careers.google.com/" },
  { id: "j8", role: "Junior Interactive Interface Designer", company: "Nexus Design Labs", domain: "Design", type: "Job", location: "CA", remote: true, usdMinSalary: 62000, usdMaxSalary: 80000, skillsRequired: ["Figma", "Design Systems", "User Research", "Wireframing"], applyLink: "https://www.figma.com/careers/" },
];

let DEFAULT_COURSES: CourseItem[] = PRESET_CURATED_COURSES.map(c => ({
  id: c.id, title: c.title, platform: c.platform, skills: c.skills,
  level: c.level as "Beginner" | "Intermediate" | "Advanced",
  link: c.link, rating: c.rating, duration: c.duration, instructor: c.instructor,
  type: "Course", domain: c.domain, learners: c.learners, certificate: c.certificate, subDomain: c.subDomain
}));

// Programmatic catalog generator
function generateLargeCatalog() {
  const generatedJobs: JobItem[] = [];
  const domains = ["Frontend", "Backend", "AI/ML", "Data Science", "Finance", "Marketing", "HR", "Product Management", "Business", "Design", "Entrepreneurship", "Commerce", "Healthcare"];
  const domainSkills: Record<string, string[]> = {
    "Frontend": ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Next.js"],
    "Backend": ["Node.js", "Express", "Python", "MongoDB", "REST APIs", "Docker"],
    "AI/ML": ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP"],
    "Data Science": ["Python", "SQL", "Pandas", "Tableau", "Statistics"],
    "Finance": ["Financial Modeling", "Excel", "Accounting", "Corporate Finance"],
    "Marketing": ["SEO", "Google Analytics", "Content Strategy", "Digital Marketing"],
    "HR": ["Talent Acquisition", "Onboarding", "Communication", "HR Analytics"],
    "Product Management": ["Product Roadmap", "Scrum", "Agile", "A/B Testing"],
    "Business": ["Strategy", "Management", "Leadership", "Business Analytics"],
    "Design": ["Figma", "UI Design", "Prototyping", "User Research"],
    "Entrepreneurship": ["Pitch Deck", "Startups", "Venture Capital"],
    "Commerce": ["E-Commerce", "Shopify", "Sales Strategy"],
    "Healthcare": ["Biostatistics", "Clinical Research", "Health Informatics"]
  };
  const companyPool = ["Google", "Microsoft", "Meta", "Amazon", "Apple", "Stripe", "Vercel", "Netflix", "Salesforce", "Atlassian", "Canva", "JPMorgan Chase", "Goldman Sachs", "OpenAI", "Airbnb", "Pfizer", "Adobe", "Shopify", "HubSpot", "Uber", "Tesla", "LinkedIn", "GitHub", "Figma", "Zoom", "Slack", "BlackRock"];
  const locations = ["US", "IN", "UK", "CA", "DE"];

  domains.forEach((dom) => {
    const skills = domainSkills[dom] || ["General Skills"];
    for (let i = 1; i <= 102; i++) {
      const co = companyPool[i % companyPool.length];
      const loc = locations[i % locations.length];
      const isRemote = i % 2 === 0;
      const skillsShuffled = [skills[0], skills[1 % skills.length], skills[2 % skills.length]].filter((v, idx, arr) => arr.indexOf(v) === idx);
      generatedJobs.push({
        id: `gen-job-${dom.toLowerCase().replace(/[^a-z0-9]/g, "")}-${i}`,
        role: `Lead ${dom} Solutions Architect / Engineer (Version ${i})`,
        company: `${co} Inc.`,
        domain: dom, type: "Job", location: loc, remote: isRemote,
        usdMinSalary: 65000 + (i * 450), usdMaxSalary: 85000 + (i * 900),
        skillsRequired: skillsShuffled,
        applyLink: `https://www.google.com/search?q=${encodeURIComponent(co + " " + dom + " Careers")}`
      });
      generatedJobs.push({
        id: `gen-intern-${dom.toLowerCase().replace(/[^a-z0-9]/g, "")}-${i}`,
        role: `${dom} Engineering Intern (Cohort ${i})`,
        company: `${co} Labs`,
        domain: dom, type: "Internship", location: loc, remote: isRemote,
        usdMinSalary: 3600 + (i * 25), usdMaxSalary: 5100 + (i * 45),
        skillsRequired: skillsShuffled,
        applyLink: `https://www.google.com/search?q=${encodeURIComponent(co + " " + dom + " Internship careers")}`
      });
    }
  });
  return { generatedJobs };
}

const { generatedJobs } = generateLargeCatalog();
DEFAULT_JOBS = [...DEFAULT_JOBS, ...generatedJobs];

// -------------------------------------------------------------------------
// HELPER: Convert MongoDB User doc to Profile shape for frontend
// -------------------------------------------------------------------------
async function userToProfile(user: any): Promise<Profile> {
  // Load resumes from MongoDB
  const resumeDocs = await Resume.find({ user_id: user._id }).sort({ created_at: -1 });
  const resumes: ResumeReport[] = resumeDocs.map(r => r.resume_data as ResumeReport);

  // Load interview reports from MongoDB
  const reportDocs = await InterviewReport.find({ user_id: user._id }).sort({ timestamp: -1 });
  const interviews: IInterviewSessionType[] = reportDocs.map(r => ({
    id: r._id.toString(),
    role: r.role,
    difficulty: r.difficulty as "Easy" | "Medium" | "Hard",
    score: r.overall_score,
    feedback: {
      fluency: r.fluency,
      confidence: r.confidence,
      communication: r.communication,
      overallScore: r.overall_score,
      detailedEvaluation: r.detailed_evaluation,
      communicationScore: r.communication_score,
      confidenceScore: r.confidence_score,
      accuracyScore: r.accuracy_score,
    } as any,
    answers: r.answers || [],
    createdAt: r.timestamp?.toISOString() || new Date().toISOString(),
  }));

  // Load roadmaps from MongoDB
  const roadmapDocs = await Roadmap.find({ user_id: user._id }).sort({ created_at: -1 });
  const roadmaps: CareerRoadmap[] = roadmapDocs.map(r => ({
    id: r._id.toString(),
    targetRole: r.target_role,
    currentSkills: r.current_skills,
    nodes: r.nodes,
    createdAt: r.created_at?.toISOString(),
  }));

  return {
    name: user.name || "",
    email: user.email,
    targetRole: user.target_job || "",
    domain: user.domain || "Tech",
    skills: user.skills || [],
    interests: user.interests || [],
    targetCountry: user.target_country || "US",
    experienceLevel: user.experience_level || "",
    profileImage: user.profile_image || "",
    atsScore: user.ats_score || 0,
    resumeStrength: user.resume_strength || 0,
    xp: user.xp || 0,
    streak: user.streak || 0,
    level: user.level || 1,
    badges: user.badges || [],
    completedTasks: user.completed_tasks || [],
    completedNodes: user.completed_nodes || [],
    lastTaskResetDate: user.last_task_reset_date || new Date().toISOString().split("T")[0],
    savedJobs: user.saved_jobs || [],
    savedCourses: user.saved_courses || [],
    completedCourses: user.completed_courses || [],
    applications: user.applications || [],
    resumes,
    interviews,
    roadmaps,
    phone: user.phone || "",
    dob: user.dob || "",
    country: user.country || "",
    city: user.city || "",
    education: user.education || "",
    degree: user.degree || "",
    college: user.college || "",
    careerGoals: user.career_goals || "",
    preferredRoles: user.preferred_roles || [],
    preferredIndustries: user.preferred_industries || [],
    coverImage: user.cover_image || "",
    region: user.region || "",
  };
}

// Helper: Log activity to MongoDB
async function logActivity(userId: string, activityType: string, metadata: string) {
  try {
    await Activity.create({ user_id: userId, activity_type: activityType, metadata, timestamp: new Date() });
  } catch (err) {
    console.error("Failed logging activity:", err);
  }
}

// Helper: get user from JWT-verified request
async function getAuthUser(req: Request) {
  if (!req.user) throw new Error("Authentication required");
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("User not found");
  // Update last_active
  user.last_active = new Date();
  await user.save();
  return user;
}

function recalculateProfileAILayer(profile: Profile) {
  if (profile.resumes && profile.resumes.length > 0) {
    const mainReport = profile.resumes[0];
    const resumeText = mainReport.parsingContent || "";
    const resolvedTargetRole = profile.targetRole || "Software Engineer";
    const targetLower = resolvedTargetRole.toLowerCase();
    let requiredSkills: string[] = [];
    if (targetLower.includes("front") || targetLower.includes("web") || targetLower.includes("dev")) {
      requiredSkills = ["React.js", "TypeScript", "Tailwind CSS", "API Integration", "Automated Testing"];
    } else if (targetLower.includes("data") || targetLower.includes("python") || targetLower.includes("analyst")) {
      requiredSkills = ["Python", "Pandas & NumPy", "SQL (PostgreSQL)", "Scikit-Learn", "Machine Learning"];
    } else if (targetLower.includes("product") || targetLower.includes("manager")) {
      requiredSkills = ["Agile & Scrum", "A/B Testing", "Product Roadmap", "User Personas & Metrics", "Jira & Confluence"];
    } else if (targetLower.includes("market") || targetLower.includes("seo")) {
      requiredSkills = ["SEO & SEM", "Google Analytics", "HubSpot CRM", "A/B Campaign Design", "Copywriting"];
    } else if (targetLower.includes("finance") || targetLower.includes("financial")) {
      requiredSkills = ["Financial Modeling", "Excel VBA", "Portfolio Valuation", "Bloomberg Terminal", "Quantitative Analysis"];
    } else if (targetLower.includes("hr") || targetLower.includes("human")) {
      requiredSkills = ["Talent Acquisition", "Employee Onboarding", "Workday (HRIS)", "Conflict Resolution", "HR Metrics"];
    } else {
      requiredSkills = [`${resolvedTargetRole} Fundamentals`, "Strategic Collaboration", "Data-Driven Decisions", "Industry Compliance", "Milestone Tracking"];
    }
    const currentSkillsList = requiredSkills.filter(skill =>
      resumeText.toLowerCase().includes(skill.toLowerCase()) ||
      (profile.skills || []).some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    if (currentSkillsList.length === 0) currentSkillsList.push(requiredSkills[0]);
    const missingSkillsList = requiredSkills.filter(s => !currentSkillsList.includes(s));
    const skillGapPercentage = Math.round((missingSkillsList.length / requiredSkills.length) * 100);
    let calculatedAts = 60 + currentSkillsList.length * 6;
    if (resumeText.length > 300) calculatedAts += 5;
    if (profile.interests && profile.interests.length > 0) calculatedAts += 2;
    if (profile.preferredIndustries && profile.preferredIndustries.length > 0) calculatedAts += 2;
    if (missingSkillsList.length > 2) calculatedAts -= 8;
    calculatedAts = Math.max(52, Math.min(94, calculatedAts));
    mainReport.atsScore = calculatedAts;
    mainReport.skillGapPercentage = skillGapPercentage;
    mainReport.requiredSkillsList = requiredSkills;
    mainReport.currentSkillsList = currentSkillsList;
    mainReport.missingSkillsList = missingSkillsList;
    mainReport.missingSkills = missingSkillsList;
    const highestAts = Math.max(...profile.resumes.map(r => r.atsScore), profile.atsScore || 0);
    profile.atsScore = highestAts;
    profile.resumeStrength = highestAts;
  }
}

// -------------------------------------------------------------------------
// SECURITY HEADERS
// -------------------------------------------------------------------------
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// -------------------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------------------

// 1. Register
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, name, password, region, interests } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required fields." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ error: "An account with this email already exists." });

    let interestsArr: string[] = [];
    if (Array.isArray(interests)) interestsArr = interests;
    else if (typeof interests === "string" && interests.trim()) interestsArr = interests.split(",").map((i: string) => i.trim()).filter(Boolean);

    const passwordHash = bcrypt.hashSync(password, 10);
    const displayName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    const newUser = await User.create({
      name: displayName,
      email: cleanEmail,
      password_hash: passwordHash,
      role: "user",
      region: region || "",
      interests: interestsArr,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: new Date(),
      last_active: new Date(),
    });

    // Log activity
    await logActivity(newUser._id.toString(), "signup", `Registered new account: ${displayName} (${cleanEmail})`);

    const token = generateToken(newUser._id.toString(), cleanEmail, newUser.role);
    const profile = await userToProfile(newUser);

    try {
      broadcastWS("notification", { message: `New User Registered: ${displayName} (${cleanEmail})`, type: "success" });
      broadcastWS("database-changed", { type: "signup", email: cleanEmail });
    } catch (wsErr) { console.error(wsErr); }

    res.json({ success: true, profile, session: { email: cleanEmail, name: displayName, token } });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to compile registration profile." });
  }
});

// 2. Login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required fields." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ error: "No user found with this email identifier." });

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ error: "Incorrect credentials. Please verify your password." });

    // Update last_login in MongoDB
    user.last_login = new Date();
    user.last_active = new Date();
    user.updated_at = new Date();
    await user.save();

    await logActivity(user._id.toString(), "login", "Logged in successfully");

    const token = generateToken(user._id.toString(), cleanEmail, user.role);
    const profile = await userToProfile(user);

    try {
      broadcastWS("notification", { message: `User Logged In: ${user.name || cleanEmail}`, type: "info" });
      broadcastWS("database-changed", { type: "login", email: cleanEmail });
    } catch (wsErr) { console.error(wsErr); }

    res.json({ success: true, profile, session: { email: cleanEmail, name: user.name, token } });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed authentication session check." });
  }
});

// 3. Forgot Password
app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is a mandatory reset parameter." });
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ error: "No registered accounts exist with this email destination." });
    res.json({ success: true, message: `A password recovery email was successfully dispatched to ${cleanEmail}.` });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to dispatch recovery credential links." });
  }
});

// 4. OAuth
app.post("/api/auth/oauth", async (req: Request, res: Response) => {
  try {
    const { provider, email, name, profileImage } = req.body;
    if (!email || !provider) return res.status(400).json({ error: "Provider and email are mandatory." });
    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        name: name || cleanEmail.split("@")[0], email: cleanEmail, password_hash: "",
        role: "user", profile_image: profileImage || "",
        created_at: new Date(), updated_at: new Date(), last_login: new Date(), last_active: new Date(),
      });
    }
    const token = generateToken(user._id.toString(), cleanEmail, user.role);
    const profile = await userToProfile(user);
    res.json({ success: true, profile, session: { email: cleanEmail, name: user.name, token } });
  } catch (error: any) {
    res.status(500).json({ error: "OAuth authorization handshake failed." });
  }
});

// Change Password
app.post("/api/auth/change-password", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required fields." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ error: "No user found with this email identifier." });
    user.password_hash = bcrypt.hashSync(password, 10);
    user.updated_at = new Date();
    await user.save();
    await logActivity(user._id.toString(), "change_password", "Updated account login credentials");
    res.json({ success: true, message: "Password updated successfully." });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update security credentials." });
  }
});

// Reset Password
app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required fields." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ error: "No user found with this email identifier." });
    user.password_hash = bcrypt.hashSync(password, 10);
    user.updated_at = new Date();
    await user.save();
    await logActivity(user._id.toString(), "reset_password", "Performed credential recovery reset");
    res.json({ success: true, message: "Password successfully reset." });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to reset security credentials." });
  }
});

// -------------------------------------------------------------------------
// PROFILE ENDPOINTS (JWT Protected)
// -------------------------------------------------------------------------
app.get("/api/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load session profile data." });
  }
});

app.post("/api/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    const freshData = req.body;
    const user = await getAuthUser(req);
    const currentProfile = await userToProfile(user);

    // Update user document
    if (freshData.name !== undefined) user.name = freshData.name;
    if (freshData.targetRole !== undefined) user.target_job = freshData.targetRole;
    if (freshData.domain !== undefined) user.domain = freshData.domain;
    if (freshData.skills !== undefined) user.skills = freshData.skills;
    if (freshData.interests !== undefined) user.interests = freshData.interests;
    if (freshData.targetCountry !== undefined) user.target_country = freshData.targetCountry;
    if (freshData.experienceLevel !== undefined) user.experience_level = freshData.experienceLevel;
    if (freshData.profileImage !== undefined) user.profile_image = freshData.profileImage;
    if (freshData.coverImage !== undefined) user.cover_image = freshData.coverImage;
    if (freshData.phone !== undefined) user.phone = freshData.phone;
    if (freshData.dob !== undefined) user.dob = freshData.dob;
    if (freshData.country !== undefined) user.country = freshData.country;
    if (freshData.city !== undefined) user.city = freshData.city;
    if (freshData.education !== undefined) user.education = freshData.education;
    if (freshData.degree !== undefined) user.degree = freshData.degree;
    if (freshData.college !== undefined) user.college = freshData.college;
    if (freshData.careerGoals !== undefined) user.career_goals = freshData.careerGoals;
    if (freshData.preferredRoles !== undefined) user.preferred_roles = freshData.preferredRoles;
    if (freshData.preferredIndustries !== undefined) user.preferred_industries = freshData.preferredIndustries;
    if (freshData.region !== undefined) user.region = freshData.region;
    // Gamification
    if (freshData.xp !== undefined) user.xp = freshData.xp;
    if (freshData.streak !== undefined) user.streak = freshData.streak;
    if (freshData.badges !== undefined) user.badges = freshData.badges;
    if (freshData.completedTasks !== undefined) user.completed_tasks = freshData.completedTasks;
    if (freshData.completedNodes !== undefined) user.completed_nodes = freshData.completedNodes;
    if (freshData.lastTaskResetDate !== undefined) user.last_task_reset_date = freshData.lastTaskResetDate;
    if (freshData.savedJobs !== undefined) user.saved_jobs = freshData.savedJobs;
    if (freshData.savedCourses !== undefined) user.saved_courses = freshData.savedCourses;
    if (freshData.completedCourses !== undefined) user.completed_courses = freshData.completedCourses;
    if (freshData.applications !== undefined) user.applications = freshData.applications;
    if (freshData.atsScore !== undefined) user.ats_score = freshData.atsScore;
    if (freshData.resumeStrength !== undefined) user.resume_strength = freshData.resumeStrength;
    user.level = Math.floor(1 + (user.xp || 0) / 500);
    user.updated_at = new Date();

    // Handle resumes array updates — sync to MongoDB Resume collection
    if (freshData.resumes !== undefined) {
      await Resume.deleteMany({ user_id: user._id });
      for (const r of freshData.resumes) {
        await Resume.create({ user_id: user._id, resume_data: r, ats_score: r.atsScore || 0, created_at: r.uploadedAt ? new Date(r.uploadedAt) : new Date() });
      }
    }

    // Handle roadmaps array updates
    if (freshData.roadmaps !== undefined) {
      await Roadmap.deleteMany({ user_id: user._id });
      for (const r of freshData.roadmaps) {
        await Roadmap.create({ user_id: user._id, target_role: r.targetRole, current_skills: r.currentSkills, nodes: r.nodes, title: r.targetRole, created_at: r.createdAt ? new Date(r.createdAt) : new Date() });
      }
    }

    // Handle saved jobs — write to SavedJob collection
    if (freshData.savedJobs !== undefined) {
      const currentSaved = currentProfile.savedJobs || [];
      const newSaved = freshData.savedJobs || [];
      // Find newly added jobs
      for (const jobId of newSaved) {
        if (!currentSaved.includes(jobId)) {
          await SavedJob.findOneAndUpdate({ user_id: user._id, job_id: jobId }, { user_id: user._id, job_id: jobId, saved_at: new Date() }, { upsert: true });
          await logActivity(user._id.toString(), "job_save", `Saved job: ${jobId}`);
        }
      }
    }

    // Activity logging for delta changes
    try {
      const currentXp = currentProfile.xp || 0;
      const freshXp = freshData.xp || 0;
      if (freshXp > currentXp) {
        await logActivity(user._id.toString(), "xp_increase", `Earned +${freshXp - currentXp} XP`);
      }
      if ((freshData.savedJobs || []).length > (currentProfile.savedJobs || []).length) {
        await logActivity(user._id.toString(), "job_application", "Bookmarked or applied to a job");
      }
      const currentResumes = currentProfile.resumes || [];
      const freshResumes = freshData.resumes || [];
      if (freshResumes.length > currentResumes.length) {
        const topResume = freshResumes[freshResumes.length - 1];
        await logActivity(user._id.toString(), "resume_upload", `Uploaded resume: ${topResume.fileName || "Resume.pdf"}`);
        await logActivity(user._id.toString(), "ats_analysis", `ATS score: ${topResume.atsScore || 70}/100`);
      }
    } catch (e) { console.error("Delta telemetry error:", e); }

    await user.save();
    const updatedProfile = await userToProfile(user);

    // WebSocket broadcasts
    try {
      broadcastWS("database-changed", { type: "profile-update", email: user.email });
    } catch (wsErr) { console.error(wsErr); }

    res.json(updatedProfile);
  } catch (error: any) {
    console.error("Profile save error:", error);
    res.status(500).json({ error: "Failed to autosave updated profile parameters." });
  }
});

// Reset Profile
app.post("/api/profile/reset", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    // Reset user fields to defaults
    user.target_job = ""; user.domain = "Tech"; user.skills = []; user.interests = [];
    user.target_country = "US"; user.experience_level = ""; user.profile_image = "";
    user.ats_score = 0; user.resume_strength = 0; user.xp = 0; user.streak = 0;
    user.level = 1; user.badges = []; user.completed_tasks = []; user.completed_nodes = [];
    user.saved_jobs = []; user.phone = ""; user.dob = ""; user.country = "";
    user.city = ""; user.education = ""; user.degree = ""; user.college = "";
    user.career_goals = ""; user.preferred_roles = []; user.preferred_industries = [];
    user.cover_image = ""; user.updated_at = new Date();
    await user.save();
    // Clear related collections
    await Resume.deleteMany({ user_id: user._id });
    await Roadmap.deleteMany({ user_id: user._id });
    await InterviewReport.deleteMany({ user_id: user._id });
    await SavedJob.deleteMany({ user_id: user._id });
    await SavedCourse.deleteMany({ user_id: user._id });
    const profile = await userToProfile(user);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to reset profile settings" });
  }
});

// -------------------------------------------------------------------------
// JOBS ENDPOINT (JWT Protected)
// -------------------------------------------------------------------------
app.get("/api/jobs", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    const targetCountry = profile.targetCountry || (req.query.country as string) || "US";
    const domain = req.query.domain as string;
    const type = req.query.type as string;
    const remote = req.query.remote as string;
    const search = req.query.search as string;
    const targetRoleName = profile.targetRole || "Software Engineer";

    await logActivity(user._id.toString(), "job_search", `Searched jobs for region: ${targetCountry}`);

    // Dynamic jobs based on profile
    const dynamicJobs: JobItem[] = [
      { id: "dyn-job-1", role: `${targetRoleName}`, company: "Apex Intelligent Core", domain: profile.domain || "Tech", type: "Job", location: "Remote", remote: true, usdMinSalary: 95000, usdMaxSalary: 125000, skillsRequired: profile.skills?.slice(0, 3) || ["System Design"], applyLink: "#apply" },
      { id: "dyn-job-2", role: `${targetRoleName} Intern`, company: "Stellar Automation Ventures", domain: profile.domain || "Tech", type: "Internship", location: "Hybrid", remote: false, usdMinSalary: 4200, usdMaxSalary: 6200, skillsRequired: profile.skills || ["Agile Flow"], applyLink: "#apply" }
    ];

    // Get admin-injected jobs from MongoDB
    const injectedJobDocs = await Job.find({ status: "active" }).sort({ created_at: -1 });
    const injectedJobs: JobItem[] = injectedJobDocs.map(j => ({
      id: j._id.toString(), role: j.title, company: j.company, domain: j.domain, type: j.job_type as "Job" | "Internship",
      location: j.location, remote: j.remote, usdMinSalary: j.usd_min_salary, usdMaxSalary: j.usd_max_salary,
      skillsRequired: j.skills_required, applyLink: j.application_link
    }));

    let jobsList = [...dynamicJobs, ...injectedJobs, ...DEFAULT_JOBS];

    if (domain && domain !== "All") jobsList = jobsList.filter(j => j.domain.toLowerCase() === domain.toLowerCase());
    if (type && type !== "All") jobsList = jobsList.filter(j => j.type.toLowerCase() === type.toLowerCase());
    if (remote && remote !== "All") { const isRemote = remote === "Remote"; jobsList = jobsList.filter(j => j.remote === isRemote); }
    if (search) { const q = search.toLowerCase(); jobsList = jobsList.filter(j => j.role.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skillsRequired.some(s => s.toLowerCase().includes(q))); }

    const rates: Record<string, { symbol: string; factor: number; code: string }> = {
      US: { symbol: "$", factor: 1.0, code: "USD" }, UK: { symbol: "£", factor: 0.79, code: "GBP" },
      IN: { symbol: "₹", factor: 83.5, code: "INR" }, CA: { symbol: "C$", factor: 1.36, code: "CAD" },
      DE: { symbol: "€", factor: 0.92, code: "EUR" }
    };
    const targetRate = rates[targetCountry] || rates["US"];

    const convertedJobs = jobsList.map(j => {
      const isInternship = j.type === "Internship";
      let loc = j.location;
      let comp = j.company;
      if (targetCountry === "IN") {
        if (["US", "Remote, US", "Remote"].includes(loc)) loc = "Bangalore, India";
        else if (loc === "UK") loc = "Mumbai, Maharashtra";
        else if (loc === "CA") loc = "Delhi NCR, India";
        else if (loc === "DE") loc = "Hyderabad, Telangana";
        if (comp === "Google LLC") comp = "Google India";
        else if (comp === "Vercel Inc") comp = "Vercel India";
      } else if (targetCountry === "UK") {
        if (["US", "Remote, US", "Remote"].includes(loc)) loc = "London, UK";
        else if (loc === "IN") loc = "London Tech Hub";
      } else if (targetCountry === "US") {
        if (loc === "IN") loc = "San Francisco, CA";
        else if (loc === "UK") loc = "New York, NY";
      }

      let salaryDisplay = "";
      if (targetCountry === "IN") {
        if (isInternship) {
          const minR = Math.round((j.usdMinSalary * 5) / 5000) * 5000;
          const maxR = Math.round((j.usdMaxSalary * 5) / 5000) * 5000;
          salaryDisplay = minR === maxR ? `₹${minR.toLocaleString()}/month` : `₹${minR.toLocaleString()} - ₹${maxR.toLocaleString()}/month`;
        } else {
          const minLpa = Math.round((j.usdMinSalary / 10000) * 1.25);
          const maxLpa = Math.round((j.usdMaxSalary / 10000) * 1.25);
          salaryDisplay = minLpa === maxLpa ? `₹${minLpa} LPA` : `₹${minLpa} - ₹${maxLpa} LPA`;
        }
      } else {
        const convertedMin = Math.round(j.usdMinSalary * targetRate.factor);
        const convertedMax = Math.round(j.usdMaxSalary * targetRate.factor);
        const suffix = isInternship ? "/month" : "/year";
        salaryDisplay = `${targetRate.symbol}${convertedMin.toLocaleString()} - ${targetRate.symbol}${convertedMax.toLocaleString()}${suffix}`;
      }
      return { ...j, location: loc, company: comp, currencySymbol: targetRate.symbol, currencyCode: targetRate.code, minSalary: Math.round(j.usdMinSalary * targetRate.factor), maxSalary: Math.round(j.usdMaxSalary * targetRate.factor), salaryDisplay };
    });

    res.json(convertedJobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to query jobs lists." });
  }
});

// -------------------------------------------------------------------------
// COURSES ENDPOINT (JWT Protected)
// -------------------------------------------------------------------------
app.get("/api/courses", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    const target = profile.targetRole || "Software Engineer";
    const missing = (profile.resumes && profile.resumes[0] && profile.resumes[0].missingSkillsList) || ["Advanced Design"];
    const domain = req.query.domain as string;
    const search = req.query.search as string;

    const dynamicCourses: CourseItem[] = [
      { id: "dyn-course-1", title: `Complete ${target} Professional Bootcamp`, platform: "Coursera", skills: [missing[0] || "Foundational Stack"], level: "Intermediate", link: `https://www.coursera.org/search?query=${encodeURIComponent(target)}`, rating: 4.8, duration: "24 Hours", instructor: "JOB GIENE AI Faculty", type: "Course", domain: profile.domain || "Tech", subDomain: "" },
      { id: "dyn-course-2", title: `Advanced ${missing[0] || "Modern Systems"} Masterclass`, platform: "Udemy", skills: missing.slice(0, 3), level: "Advanced", link: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(missing[0] || target)}`, rating: 4.9, duration: "16 Hours", instructor: "Industry Guild", type: "Course", domain: profile.domain || "Tech", subDomain: "" }
    ];

    // Get injected courses from MongoDB
    const injectedCourseDocs = await Course.find({ status: "active" }).sort({ created_at: -1 });
    const mappedInjected: CourseItem[] = injectedCourseDocs.map(ic => ({
      id: ic._id.toString(), title: ic.title, platform: ic.provider, skills: ic.skills,
      level: ic.level as any, link: ic.course_url, rating: ic.rating, duration: ic.duration,
      instructor: ic.instructor, type: "Course", domain: ic.domain, subDomain: ic.sub_domain
    }));

    let list = [...dynamicCourses, ...mappedInjected, ...DEFAULT_COURSES];
    if (domain && domain !== "All") list = list.filter(c => c.domain && c.domain.toLowerCase() === domain.toLowerCase());
    if (search) { const q = search.toLowerCase(); list = list.filter(c => c.title.toLowerCase().includes(q) || c.platform.toLowerCase().includes(q) || (c.subDomain && c.subDomain.toLowerCase().includes(q)) || c.skills.some(s => s.toLowerCase().includes(q))); }

    const userSkills = profile.skills || [];
    const missingSkills = (profile.resumes && profile.resumes[0] && profile.resumes[0].missingSkillsList) || [];
    const targetRole = profile.targetRole || "";
    const enrichedList = list.map(c => {
      let isAiRecommended = false; let recommendReason = "";
      const matchingMissing = c.skills.filter(s => missingSkills.some(ms => ms.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ms.toLowerCase())));
      const targetMatch = targetRole && (c.title.toLowerCase().includes(targetRole.toLowerCase()) || (c.subDomain && c.subDomain.toLowerCase().includes(targetRole.toLowerCase())));
      const matchingExisting = c.skills.filter(s => userSkills.some(us => us.toLowerCase().includes(s.toLowerCase())));
      if (matchingMissing.length > 0) { isAiRecommended = true; recommendReason = `🎯 Prioritized to close your ATS gap: ${matchingMissing[0]}`; }
      else if (targetMatch) { isAiRecommended = true; recommendReason = `🔥 Perfect alignment with your Target Role: ${targetRole}`; }
      else if (matchingExisting.length > 0) { isAiRecommended = true; recommendReason = `📈 Deepen your skill: ${matchingExisting[0]}`; }
      return { ...c, isAiRecommended, recommendReason };
    });

    res.json(enrichedList);
  } catch (error) {
    res.status(500).json({ error: "Failed to search recommended courses." });
  }
});

// -------------------------------------------------------------------------
// RESUME ANALYZER (JWT Protected)
// -------------------------------------------------------------------------
app.post("/api/resume/analyze", verifyToken, async (req: Request, res: Response) => {
  try {
    const { fileName, resumeText, skills, currentRole, targetRole } = req.body;
    if (!resumeText || resumeText.length < 15) return res.status(400).json({ error: "Resume text must be provided and longer than 15 characters." });

    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    const resolvedTargetRole = targetRole || profile.targetRole || "Software Engineer";
    const resolvedSkills = skills || profile.skills || [];
    const careerGoals = profile.careerGoals || "To grow and specialize";
    const interests = profile.interests || [];
    const experienceLevel = profile.experienceLevel || currentRole || "Student";
    const targetCountry = profile.targetCountry || "US";
    const preferredIndustries = profile.preferredIndustries || [];
    const education = `${profile.education || ""} - ${profile.degree || ""} from ${profile.college || ""}`;

    if (resolvedTargetRole && resolvedTargetRole !== user.target_job) {
      user.target_job = resolvedTargetRole;
    }

    let aiResult: any = null;
    try {
      const gemini = getGeminiClient();
      const prompt = `You are an expert recruiter and ATS expert.\nAnalyze the following resume.\n\nCandidate Context:\n- Target Role: ${resolvedTargetRole}\n- Skills: ${JSON.stringify(resolvedSkills)}\n- Career Goals: "${careerGoals}"\n- Interests: ${JSON.stringify(interests)}\n- Experience: ${experienceLevel}\n- Region: ${targetCountry}\n- Industries: ${JSON.stringify(preferredIndustries)}\n- Education: "${education}"\n\nResume:\n"""\n${resumeText}\n"""\n\nReply with JSON:\n{\n  "atsScore": (0-100),\n  "strengths": [3-4 items],\n  "weakAreas": [3-4 items],\n  "missingSkills": [4 items],\n  "suggestions": [3 items],\n  "improvedProjects": [2 items],\n  "weakSections": [2-3 items],\n  "missingAchievements": [2 items],\n  "experienceGaps": [1-2 items],\n  "actionPlan": { "improveBy": [3 items], "estimatedCompletionHours": number },\n  "skillGapPercentage": number,\n  "requiredSkillsList": [4 items],\n  "currentSkillsList": [matched skills],\n  "missingSkillsList": [missing items],\n  "recommendedSources": [{ "type": "Course", "name": "...", "platform": "...", "link": "..." }]\n}\nReturn only raw JSON.`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
      aiResult = cleanAndParseJSON(response.text);
    } catch (aiErr) {
      console.warn("Gemini failed, compiling fallback:", aiErr);
      const targetLower = resolvedTargetRole.toLowerCase();
      let requiredSkills: string[] = [];
      if (targetLower.includes("front") || targetLower.includes("web") || targetLower.includes("dev")) requiredSkills = ["React.js", "TypeScript", "Tailwind CSS", "API Integration", "Automated Testing"];
      else if (targetLower.includes("data") || targetLower.includes("python")) requiredSkills = ["Python", "Pandas & NumPy", "SQL", "Scikit-Learn", "Machine Learning"];
      else requiredSkills = [`${resolvedTargetRole} Fundamentals`, "Strategic Collaboration", "Data-Driven Decisions", "Industry Compliance", "Milestone Tracking"];

      const currentSkillsList = requiredSkills.filter(s => resumeText.toLowerCase().includes(s.toLowerCase()) || resolvedSkills.some((sk: string) => sk.toLowerCase().includes(s.toLowerCase())));
      if (currentSkillsList.length === 0) currentSkillsList.push(requiredSkills[0]);
      const missingSkillsList = requiredSkills.filter(s => !currentSkillsList.includes(s));
      let calculatedAts = 60 + currentSkillsList.length * 6;
      if (resumeText.length > 300) calculatedAts += 5;
      calculatedAts = Math.max(52, Math.min(94, calculatedAts));

      aiResult = {
        atsScore: calculatedAts, strengths: ["Solid foundational skills"], weakAreas: ["Needs metrics"],
        missingSkills: missingSkillsList, suggestions: ["Add skills matrix"], improvedProjects: ["Optimize portfolio"],
        weakSections: ["Project descriptions"], missingAchievements: ["Certifications"], experienceGaps: ["Alignment gaps"],
        actionPlan: { improveBy: ["Add project", "Add credentials", "Use STAR format"], estimatedCompletionHours: 35 },
        skillGapPercentage: Math.round((missingSkillsList.length / requiredSkills.length) * 100),
        requiredSkillsList: requiredSkills, currentSkillsList, missingSkillsList,
        recommendedSources: [{ type: "Course", name: `${resolvedTargetRole} Bootcamp`, platform: "Udemy", link: "https://www.udemy.com" }]
      };
    }

    const newReport: ResumeReport = {
      id: "res-" + Date.now(), fileName: fileName || "Pasted_Resume.pdf", uploadedAt: new Date().toISOString(),
      atsScore: aiResult.atsScore, strengths: aiResult.strengths, weakAreas: aiResult.weakAreas,
      missingSkills: aiResult.missingSkills, suggestions: aiResult.suggestions,
      improvedProjects: aiResult.improvedProjects, parsingContent: resumeText.substring(0, 1000),
      weakSections: aiResult.weakSections, missingAchievements: aiResult.missingAchievements,
      experienceGaps: aiResult.experienceGaps, actionPlan: aiResult.actionPlan,
      skillGapPercentage: aiResult.skillGapPercentage, requiredSkillsList: aiResult.requiredSkillsList,
      currentSkillsList: aiResult.currentSkillsList, missingSkillsList: aiResult.missingSkillsList,
      recommendedSources: aiResult.recommendedSources
    };

    // Save to MongoDB Resume collection
    await Resume.create({ user_id: user._id, resume_data: newReport, ats_score: newReport.atsScore, created_at: new Date() });

    // Save ATS score to MongoDB ats_scores collection
    await ATSScore.create({
      user_id: user._id, ats_score: newReport.atsScore,
      resume_score: newReport.atsScore, keyword_score: 100 - (aiResult.skillGapPercentage || 30),
      format_score: Math.min(90, newReport.atsScore + 5), experience_score: newReport.atsScore - 5,
      generated_at: new Date()
    });

    // Update user ATS score
    const allResumes = await Resume.find({ user_id: user._id });
    const highestAts = Math.max(...allResumes.map(r => r.ats_score || 0), user.ats_score || 0);
    user.ats_score = highestAts;
    user.resume_strength = highestAts;
    if (highestAts >= 70 && !user.badges.includes("ATS Optimizer")) user.badges.push("ATS Optimizer");
    await user.save();

    await logActivity(user._id.toString(), "resume_upload", `Uploaded resume: ${newReport.fileName}`);
    await logActivity(user._id.toString(), "ats_analysis", `ATS score: ${newReport.atsScore}/100`);

    const updatedProfile = await userToProfile(user);
    res.json({ report: newReport, profile: updatedProfile });
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume." });
  }
});

// -------------------------------------------------------------------------
// INTERVIEW ENDPOINTS (JWT Protected)
// -------------------------------------------------------------------------
app.post("/api/interview/start", verifyToken, async (req: Request, res: Response) => {
  try {
    const { role, difficulty, count, profile } = req.body;
    const selRole = role || "Frontend Engineer";
    const selDiff = difficulty || "Medium";
    const selCount = parseInt(count) || 5;
    let questions: string[] = [];

    let candidateContext = "";
    if (profile) {
      candidateContext = `Candidate Context:\n- Skills: ${Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "Not specified"}\n- Experience: ${profile.experience || "Not specified"}\n- Objective: ${profile.objective || "Not specified"}`;
    }

    try {
      const gemini = getGeminiClient();
      const prompt = `You are a professional interviewer.\nRole: "${selRole}"\nDifficulty: "${selDiff}"\n${candidateContext}\n\nGenerate exactly ${selCount} interview questions.\nInclude 1 HR/behavioral and ${selCount - 1} technical.\n\nJSON format:\n{ "questions": ["Q1", "Q2", ...] }`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
      const parsed = cleanAndParseJSON(response.text);
      questions = parsed.questions || [];
    } catch (_) {
      questions = [
        `Describe a challenging technical project in ${selRole}.`,
        `How would you optimize a slow application?`,
        `What is your understanding of modern state management?`,
        `Describe a disagreement with a colleague and how you resolved it.`,
        `What security practices do you implement?`
      ].slice(0, selCount);
    }

    // Save interview session to MongoDB
    const user = await getAuthUser(req);
    const session = await InterviewSession.create({
      user_id: user._id, domain: selRole, difficulty: selDiff,
      question_count: questions.length, timestamp: new Date()
    });

    // Save questions
    for (const q of questions) {
      await InterviewQuestion.create({ session_id: session._id, question: q });
    }

    await logActivity(user._id.toString(), "interview_start", `Started interview: ${selRole} (${selDiff})`);

    res.json({ questions, role: selRole, difficulty: selDiff, sessionId: session._id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Could not launch interview suite." });
  }
});

app.post("/api/interview/review-answer", verifyToken, async (req: Request, res: Response) => {
  try {
    const { question, answer, role, difficulty } = req.body;
    if (!question) return res.status(400).json({ error: "Question text is required." });
    const cleanAns = (answer || "").trim().toLowerCase();
    const isBlank = !cleanAns || ["skipped", "skipped answer", "microphone silence", "silence", "no answer submitted"].includes(cleanAns);

    if (isBlank) return res.json({ communication: 0, confidence: 0, technicalAccuracy: 0, suggestions: ["No answer submitted", "Try answering to improve readiness."], questionScore: 0 });

    let critique: any = null;
    try {
      const gemini = getGeminiClient();
      const prompt = `Evaluate this interview answer.\nRole: "${role || "Software Developer"}"\nDifficulty: "${difficulty || "Medium"}"\nQuestion: "${question}"\nAnswer: "${answer || ""}"\n\nGrade 1-10 on: Communication, Confidence, Technical Accuracy.\nSuggest 2-3 improvements.\n\nJSON:\n{ "communication": N, "confidence": N, "technicalAccuracy": N, "suggestions": ["..."] }`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
      critique = cleanAndParseJSON(response.text);
    } catch (_) {
      const len = (answer || "").length;
      critique = {
        communication: len > 60 ? 8 : len > 15 ? 6 : 4,
        confidence: len > 40 ? 8 : len > 10 ? 6 : 3,
        technicalAccuracy: len > 80 ? 9 : len > 20 ? 7 : 4,
        suggestions: len > 40 ? ["Add numerical indicators.", "Highlight collaboration role."] : ["Construct a more substantial reply.", "Elaborate on tools used."]
      };
    }
    res.json(critique);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to analyze answer." });
  }
});

app.post("/api/interview/submit", verifyToken, async (req: Request, res: Response) => {
  try {
    const { role, difficulty, answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) return res.status(400).json({ error: "Candidate answers must be logged." });

    const processedAnswers = answers.map((a: any) => {
      const cleanAns = (a.answer || "").trim().toLowerCase();
      const isBlank = !cleanAns || ["skipped", "skipped answer", "no answer submitted", "microphone silence", "silence"].includes(cleanAns);
      return { question: a.question, answer: isBlank ? "No answer submitted" : a.answer, isBlank };
    });

    let evaluation: any = null;
    try {
      const gemini = getGeminiClient();
      const prompt = `You are a senior recruiter evaluating interview responses.\nRole: "${role || "Technical Lead"}"\nDifficulty: "${difficulty || "Medium"}"\n\nResponses:\n${JSON.stringify(processedAnswers.map((pa: any) => ({ question: pa.question, answer: pa.answer })), null, 2)}\n\nIf answer is empty/skipped: score all 0, feedback: "You skipped this question."\n\nJSON:\n{ "overallScore": N, "fluency": "...", "confidence": "...", "communication": "...", "detailedEvaluation": "...", "individualFeedback": [{ "question": "...", "answer": "...", "feedback": "...", "isCorrect": bool, "communication": N, "confidence": N, "technicalAccuracy": N }] }`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
      evaluation = cleanAndParseJSON(response.text);
    } catch (_) {
      let validCount = 0;
      const individualFeedback = processedAnswers.map((a: any) => {
        if (a.isBlank) return { question: a.question, answer: "No answer submitted", feedback: "You skipped this question.", isCorrect: false, communication: 0, confidence: 0, technicalAccuracy: 0, score: 0 };
        const isBetter = (a.answer || "").length > 40;
        if (isBetter) validCount++;
        return { question: a.question, answer: a.answer, feedback: isBetter ? "Good coverage! Add metrics." : "Too brief. Use STAR method.", isCorrect: isBetter, communication: isBetter ? 8 : 4, confidence: isBetter ? 8 : 3, technicalAccuracy: isBetter ? 9 : 4, score: isBetter ? 85 : 50 };
      });
      evaluation = {
        overallScore: processedAnswers.length > 0 ? Math.round((validCount / processedAnswers.length) * 40 + 50) : 50,
        fluency: "Steady pacing.", confidence: "Good ownership.", communication: "Professional tone.",
        detailedEvaluation: "Strong foundations.", individualFeedback
      };
    }

    // Enforce blank scoring
    const items = evaluation.individualFeedback || [];
    let sumcomm = 0, sumconf = 0, sumaccu = 0;
    processedAnswers.forEach((pa: any, idx: number) => {
      let item = items[idx] || { question: pa.question, answer: pa.answer, feedback: "", isCorrect: !pa.isBlank, communication: pa.isBlank ? 0 : 5, confidence: pa.isBlank ? 0 : 5, technicalAccuracy: pa.isBlank ? 0 : 5 };
      if (pa.isBlank) { item.communication = 0; item.confidence = 0; item.technicalAccuracy = 0; item.score = 0; item.isCorrect = false; item.feedback = "You skipped this question."; }
      items[idx] = item;
      sumcomm += item.communication; sumconf += item.confidence; sumaccu += item.technicalAccuracy;
    });
    const numItems = items.length || 1;
    const computedComm = Math.round((sumcomm / numItems) * 10);
    const computedConf = Math.round((sumconf / numItems) * 10);
    const computedAccu = Math.round((sumaccu / numItems) * 10);

    const user = await getAuthUser(req);

    // Save to MongoDB InterviewSession
    const session = await InterviewSession.create({
      user_id: user._id, domain: role || "Frontend Engineer", difficulty: difficulty || "Medium",
      question_count: items.length, timestamp: new Date()
    });

    // Save individual answers
    for (const item of items) {
      await InterviewAnswer.create({
        session_id: session._id, question: item.question || "", answer: item.answer || "",
        score: item.score || 0, feedback: item.feedback || "",
        communication: item.communication || 0, confidence: item.confidence || 0,
        technical_accuracy: item.technicalAccuracy || 0, is_correct: item.isCorrect || false
      });
    }

    // Save report
    const report = await InterviewReport.create({
      session_id: session._id, user_id: user._id,
      overall_score: evaluation.overallScore, communication_score: computedComm,
      confidence_score: computedConf, accuracy_score: computedAccu,
      fluency: evaluation.fluency, confidence: evaluation.confidence,
      communication: evaluation.communication, detailed_evaluation: evaluation.detailedEvaluation,
      answers: items, role: role || "Frontend Engineer", difficulty: difficulty || "Medium",
      timestamp: new Date()
    });

    // Update user gamification
    user.xp += 150;
    user.streak += 1;
    if (!user.badges.includes("First Drill")) user.badges.push("First Drill");
    if (evaluation.overallScore >= 80 && !user.badges.includes("Elite Comm")) user.badges.push("Elite Comm");
    user.level = Math.floor(1 + user.xp / 500);
    user.updated_at = new Date();
    await user.save();

    await logActivity(user._id.toString(), "interview_complete", `Completed interview: ${role} (${difficulty}), Score: ${evaluation.overallScore}`);

    const updatedProfile = await userToProfile(user);
    const sessionData = {
      id: report._id.toString(), role: role || "Frontend Engineer",
      difficulty: difficulty || "Medium", score: evaluation.overallScore,
      createdAt: new Date().toISOString(),
      feedback: { fluency: evaluation.fluency, confidence: evaluation.confidence, communication: evaluation.communication, overallScore: evaluation.overallScore, detailedEvaluation: evaluation.detailedEvaluation, communicationScore: computedComm, confidenceScore: computedConf, accuracyScore: computedAccu },
      answers: items
    };

    res.json({ session: sessionData, profile: updatedProfile });
  } catch (error: any) {
    console.error("Interview submit error:", error);
    res.status(500).json({ error: error.message || "Failed to finalize evaluation." });
  }
});

// -------------------------------------------------------------------------
// CAREER MENTOR CHAT (JWT Protected)
// -------------------------------------------------------------------------
app.get("/api/mentor/chat/history", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    const history = await ChatMessage.find({ user_id: user._id, conversation_id: "default_mentor_session" }).sort({ timestamp: 1 });
    const responseHistory = history.map(h => ({ role: h.role, text: h.content }));
    res.json({ history: responseHistory });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve conversation logs." });
  }
});

app.post("/api/mentor/chat/clear", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    await ChatMessage.deleteMany({ user_id: user._id, conversation_id: "default_mentor_session" });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to clear chat session." });
  }
});

app.post("/api/mentor/chat", verifyToken, async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Please write a mentor inquiry." });
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);

    await ChatMessage.create({ user_id: user._id, conversation_id: "default_mentor_session", role: "user", content: message, timestamp: new Date() });

    const dbHistory = await ChatMessage.find({ user_id: user._id, conversation_id: "default_mentor_session" }).sort({ timestamp: 1 });
    let coachReply = "";

    try {
      const gemini = getGeminiClient();
      const systemPrompt = `You are "JOB GIENE AI Career Coach" helping "${profile.name}".\nTarget Role: "${profile.targetRole || "Software Engineer"}"\nSkills: ${profile.skills?.join(", ") || "None"}\nATS Score: ${profile.atsScore}/100\nBe relevant, no repetition, use markdown.`;
      const chatContents = dbHistory.map(h => ({ role: h.role === "user" ? "user" as const : "model" as const, parts: [{ text: h.content }] }));
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: chatContents, config: { systemInstruction: systemPrompt } });
      coachReply = response.text || "I was unable to formulate feedback. Please try again.";
    } catch (aiErr) {
      coachReply = `Hello ${profile.name}! 👋 As your **JOB GIENE Career Mentor**, here is guidance for your query: "${message}".\n\n- Align skills with ${profile.targetRole || "your target role"}\n- Complete active learning milestones\n- Run interview simulations`;
    }

    await ChatMessage.create({ user_id: user._id, conversation_id: "default_mentor_session", role: "model", content: coachReply, timestamp: new Date() });
    await logActivity(user._id.toString(), "mentor_chat", `Career mentor chat query`);

    res.json({ reply: coachReply });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Advisor server error." });
  }
});

// -------------------------------------------------------------------------
// AI GENIE CHAT (JWT Protected)
// -------------------------------------------------------------------------
app.get("/api/ai-genie/sessions", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    const sessions = await ChatSession.find({ user_id: user._id }).sort({ timestamp: -1 });
    res.json({ sessions });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve AI Genie sessions." });
  }
});

app.get("/api/ai-genie/session/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getAuthUser(req);
    const messages = await ChatMessage.find({ user_id: user._id, conversation_id: id }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve conversation." });
  }
});

app.delete("/api/ai-genie/session/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getAuthUser(req);
    await ChatSession.deleteMany({ user_id: user._id, conversation_id: id });
    await ChatMessage.deleteMany({ user_id: user._id, conversation_id: id });
    res.json({ success: true, message: "Conversation deleted." });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete conversation." });
  }
});

app.post("/api/ai-genie/chat", verifyToken, async (req: Request, res: Response) => {
  try {
    const { message, conversationId, title } = req.body;
    if (!message) return res.status(400).json({ error: "Please write an AI Genie inquiry." });

    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    const resolvedId = conversationId || "conv-" + Date.now();

    const history = await ChatMessage.find({ user_id: user._id, conversation_id: resolvedId }).sort({ timestamp: 1 });

    const systemPromptMessage = `You are "AI Genie", an expert career assistant.\nCandidate: "${profile.name}"\nTarget Job: "${profile.targetRole || "Software Engineer"}"\nSkills: [${profile.skills?.join(", ") || "None"}]\nATS Score: ${profile.atsScore || 70}/100\nBe practical, use markdown, no repetition.`;

    const gemini = getGeminiClient();
    const chatContents = history.map(m => ({ role: "user" as const, parts: [{ text: m.question || m.content || "" }] }));
    chatContents.push({ role: "user" as const, parts: [{ text: message }] });

    const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: chatContents, config: { systemInstruction: systemPromptMessage } });
    const genieAnswer = response.text || "AI Genie is experiencing issues. Please try again.";

    // Save session and message to MongoDB
    await ChatSession.findOneAndUpdate(
      { user_id: user._id, conversation_id: resolvedId },
      { user_id: user._id, conversation_id: resolvedId, title: title || message.slice(0, 30) + "...", timestamp: new Date() },
      { upsert: true }
    );
    await ChatMessage.create({ user_id: user._id, conversation_id: resolvedId, question: message, response: genieAnswer, timestamp: new Date() });
    await logActivity(user._id.toString(), "ai_genie_chat", `AI Genie conversation`);

    res.json({ conversationId: resolvedId, response: genieAnswer });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to get AI Genie response." });
  }
});

// -------------------------------------------------------------------------
// COVER LETTER (JWT Protected)
// -------------------------------------------------------------------------
app.post("/api/cover-letter", verifyToken, async (req: Request, res: Response) => {
  try {
    const { companyName, jobRole, experienceLevel, skillHighlights } = req.body;
    if (!companyName || !jobRole) return res.status(400).json({ error: "Company name and job role are required." });

    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    let letterContent = "";

    try {
      const gemini = getGeminiClient();
      const prompt = `Compose a professional Cover Letter.\nName: ${profile.name}\nExperience: ${experienceLevel || profile.experienceLevel || "College Fresher"}\nPosition: ${jobRole}\nCompany: ${companyName}\nSkills: ${skillHighlights || profile.skills.join(", ") || "Software engineering"}\n\n3 paragraphs, formal business letter format.`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt });
      letterContent = response.text || "";
    } catch (_) {
      const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      letterContent = `[Your Address]\n${currentDate}\n\nHiring Committee\n${companyName}\n\nSubject: Application for ${jobRole} - ${profile.name}\n\nDear Hiring Team,\n\nI am writing to express my interest in the ${jobRole} position at ${companyName}. As a ${experienceLevel || "motivated professional"} specializing in ${profile.skills[0] || "software engineering"}, I have admired ${companyName}'s commitment to excellence.\n\nDuring my career, I have focused on ${profile.skills.join(", ") || "modern technologies"}. I am confident my skills will prove valuable to your team.\n\nThank you for considering my application.\n\nSincerely,\n${profile.name}\n${profile.email}`;
    }

    // Save cover letter to MongoDB
    await CoverLetter.create({
      user_id: user._id, company_name: companyName, job_title: jobRole,
      skills: profile.skills || [], generated_letter: letterContent, created_at: new Date()
    });

    await logActivity(user._id.toString(), "cover_letter_generation", `Generated cover letter for ${jobRole} at ${companyName}`);

    res.json({ letter: letterContent });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate Cover Letter." });
  }
});

// -------------------------------------------------------------------------
// ROADMAP (JWT Protected)
// -------------------------------------------------------------------------
app.post("/api/roadmap", verifyToken, async (req: Request, res: Response) => {
  try {
    const { targetRole, skills } = req.body;
    if (!targetRole) return res.status(400).json({ error: "Please specify your target career role." });

    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    let roadmapNodes: RoadmapNode[] = [];

    try {
      const gemini = getGeminiClient();
      const prompt = `Generate a learning path with 4 phases for skills: ${JSON.stringify(skills || profile.skills)} into target role "${targetRole}".\n\nJSON:\n{ "targetRole": "${targetRole}", "nodes": [{ "id": "node-1", "title": "Phase 1: ...", "duration": "Month 1", "topics": ["..."], "suggestedProjects": ["..."], "recommendedCourses": ["..."] }] }`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
      const parsed = cleanAndParseJSON(response.text);
      roadmapNodes = parsed.nodes || [];
    } catch (_) {
      roadmapNodes = [
        { id: "seq-1", title: "Phase 1: Core Stack & Typing", duration: "Weeks 1-4", topics: ["Deep JS", "TypeScript"], suggestedProjects: ["Typed API Blueprint"], recommendedCourses: ["TypeScript Foundations"] },
        { id: "seq-2", title: "Phase 2: Modern Styling", duration: "Weeks 5-8", topics: ["Tailwind CSS", "Animations"], suggestedProjects: ["SaaS Dashboard"], recommendedCourses: ["Responsive Layouts"] },
        { id: "seq-3", title: "Phase 3: Testing & CI", duration: "Weeks 9-12", topics: ["Jest", "CI/CD"], suggestedProjects: ["CI Boilerplate"], recommendedCourses: ["Enterprise Testing"] },
        { id: "seq-4", title: "Phase 4: Capstone", duration: "Weeks 13-16", topics: ["Performance", "API Optimization"], suggestedProjects: ["Full-Stack Dashboard"], recommendedCourses: ["System Architecture"] }
      ];
    }

    // Save roadmap to MongoDB
    const roadmapDoc = await Roadmap.create({
      user_id: user._id, title: targetRole, target_role: targetRole,
      current_skills: skills || profile.skills, nodes: roadmapNodes,
      category: profile.domain || "Tech", skills: skills || profile.skills,
      steps: roadmapNodes, estimated_duration: "16 weeks", created_at: new Date()
    });

    // Create progress tracker
    await RoadmapProgress.create({
      user_id: user._id, roadmap_id: roadmapDoc._id,
      completed_steps: [], completion_percentage: 0, updated_at: new Date()
    });

    if (targetRole && !user.interests.includes(targetRole)) user.interests.push(targetRole);
    if (!user.badges.includes("Future Planner")) user.badges.push("Future Planner");
    user.updated_at = new Date();
    await user.save();

    await logActivity(user._id.toString(), "roadmap_generation", `Generated roadmap for: ${targetRole}`);

    const newRoadmap: CareerRoadmap = { id: roadmapDoc._id.toString(), targetRole, currentSkills: skills || profile.skills, nodes: roadmapNodes };
    const updatedProfile = await userToProfile(user);
    res.json({ roadmap: newRoadmap, profile: updatedProfile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate roadmap." });
  }
});

// -------------------------------------------------------------------------
// ADMIN ENDPOINTS (JWT + Admin Protected)
// -------------------------------------------------------------------------
app.get("/api/admin/metrics", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const activeToday = await Activity.distinct("user_id", { timestamp: { $gte: todayStart } }).then(ids => ids.length);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const weeklyActive = await Activity.distinct("user_id", { timestamp: { $gte: sevenDaysAgo } }).then(ids => ids.length);
    const newWeekly = await User.countDocuments({ created_at: { $gte: sevenDaysAgo } });

    const totalResumes = await Resume.countDocuments();
    const atsAgg = await ATSScore.aggregate([{ $group: { _id: null, avg: { $avg: "$ats_score" }, count: { $sum: 1 } } }]);
    const avgAts = atsAgg.length > 0 ? Math.round(atsAgg[0].avg) : 72;

    const totalInjectedJobs = await Job.countDocuments();
    const totalInjectedCourses = await Course.countDocuments();
    const totalInterviews = await InterviewReport.countDocuments();
    const totalCoverLetters = await CoverLetter.countDocuments();
    const totalRoadmaps = await Roadmap.countDocuments();
    const totalChatMessages = await ChatMessage.countDocuments();
    const totalSavedJobs = await SavedJob.countDocuments();
    const totalSavedCourses = await SavedCourse.countDocuments();

    const interviewAgg = await InterviewReport.aggregate([{ $group: { _id: null, avgScore: { $avg: "$overall_score" }, avgComm: { $avg: "$communication_score" }, avgConf: { $avg: "$confidence_score" }, avgAcc: { $avg: "$accuracy_score" } } }]);
    const avgInterviewScore = interviewAgg.length > 0 ? Math.round(interviewAgg[0].avgScore) : 0;

    // Activity logs
    const activityLogs = await Activity.find().sort({ timestamp: -1 }).limit(80).populate("user_id", "email name");
    const formattedLogs = activityLogs.map(l => {
      const u = l.user_id as any;
      return { id: l._id, email: u?.email || "unknown", action: l.activity_type, details: l.metadata, time: l.timestamp };
    });

    // User reports
    const allUsers = await User.find().select("email name region target_job ats_score xp streak role skills interests created_at");
    const userReports = allUsers.map(u => ({
      email: u.email, name: u.name, region: u.region, registeredAt: u.created_at,
      targetRole: u.target_job || "Not Configured", atsScore: u.ats_score, xp: u.xp,
      streak: u.streak, skills: u.skills, interests: u.interests, role: u.role,
      completionRate: Math.round(([u.name, u.education, u.target_job, u.phone, u.city].filter(Boolean).length / 5) * 100)
    }));

    // User growth (last 30 days)
    const userGrowth: any[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);
      const usersCount = await User.countDocuments({ created_at: { $gte: dayStart, $lte: dayEnd } });
      const actCount = await Activity.distinct("user_id", { timestamp: { $gte: dayStart, $lte: dayEnd } }).then(ids => ids.length);
      userGrowth.push({ date: d.toISOString().split("T")[0].substring(5), users: usersCount, activity: actCount });
    }

    // ATS Distribution
    const atsDistData = await User.aggregate([
      { $match: { ats_score: { $gt: 0 } } },
      { $bucket: { groupBy: "$ats_score", boundaries: [0, 21, 41, 61, 81, 101], default: "Other", output: { count: { $sum: 1 } } } }
    ]);
    const atsDistribution = [
      { range: "0-20", count: 0 }, { range: "21-40", count: 0 }, { range: "41-60", count: 0 },
      { range: "61-80", count: 0 }, { range: "81-100", count: 0 }
    ];
    atsDistData.forEach(b => {
      if (b._id === 0) atsDistribution[0].count = b.count;
      else if (b._id === 21) atsDistribution[1].count = b.count;
      else if (b._id === 41) atsDistribution[2].count = b.count;
      else if (b._id === 61) atsDistribution[3].count = b.count;
      else if (b._id === 81) atsDistribution[4].count = b.count;
    });

    const adminLogs = await AdminLog.find().sort({ timestamp: -1 }).limit(40);

    // Top skills from users
    const skillsAgg = await User.aggregate([{ $unwind: "$skills" }, { $group: { _id: "$skills", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]);
    const topSkills = skillsAgg.map(s => s._id);

    res.json({
      totalUsers, activeUsersToday: activeToday || 1, newUsersThisWeek: newWeekly || 0,
      totalJobApplications: totalSavedJobs, totalCoursesViewed: totalSavedCourses,
      totalRoadmapsOpened: totalRoadmaps, averageAtsScore: avgAts,
      totalJobs: totalInjectedJobs + 12, totalCourses: totalInjectedCourses + 15,
      topSkills: topSkills.slice(0, 5),
      averageProfileCompletion: 50, totalResumesAnalyzed: totalResumes,
      totalAiRequests: totalChatMessages, totalSavedJobs, totalBookmarkedCourses: totalSavedCourses,
      last30DaysGrowth: userGrowth, weeklyActiveUsers: weeklyActive || 1,
      totalResumesUploaded: totalResumes, profileCompletionRate: 50,
      streakStats: { average: 0, max: 0 }, userGrowth, atsDistribution,
      activityLogs: formattedLogs, userReports, adminLogs,
      totalInterviews, totalCoverLetters, avgInterviewScore,
      targetJobsDistribution: [],
      skillsAnalytics: skillsAgg.map(s => ({ name: s._id, category: "Skills", score: s.count * 10 })),
      interestsAnalytics: []
    });
  } catch (err: any) {
    console.error("Admin metrics error:", err);
    res.status(500).json({ error: "Failed to compile metrics." });
  }
});

// Admin: Inject Job
app.post("/api/admin/jobs/inject", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { role, company, domain, type, location, remote, minSalary, maxSalary, skillsRequired, applyLink, description } = req.body;
    if (!role || !company) return res.status(400).json({ error: "Job role and company are required." });
    const user = await getAuthUser(req);
    const job = await Job.create({
      title: role, company, domain: domain || "Tech", job_type: type || "Job",
      location: location || "Remote", remote: !!remote,
      usd_min_salary: Number(minSalary) || 80000, usd_max_salary: Number(maxSalary) || 120000,
      skills_required: Array.isArray(skillsRequired) ? skillsRequired : [skillsRequired || "Productivity"],
      application_link: applyLink || "#apply", description: description || "", status: "active",
      created_at: new Date()
    });
    await logActivity(user._id.toString(), "admin_action", `Created job: ${role} at ${company}`);
    await AdminLog.create({ admin_id: user._id, action: `Created job: ${role} at ${company}`, resource: "jobs", timestamp: new Date() });
    broadcastWS("notification", { message: `Job Posted: ${role} at ${company}`, type: "success" });
    broadcastWS("database-changed", { type: "job-posted" });
    res.json({ success: true, job: { id: job._id, role, company, domain: domain || "Tech" } });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create job." });
  }
});

// Admin: Inject Course
app.post("/api/admin/courses/inject", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, instructor, platform, duration, rating, link, domain, type } = req.body;
    if (!title || !platform) return res.status(400).json({ error: "Title and platform are required." });
    const user = await getAuthUser(req);
    const course = await Course.create({
      title, instructor: instructor || "Expert", provider: platform,
      duration: duration || "12 Hours", rating: parseFloat(rating) || 4.7,
      course_url: link || "#learn", domain: domain || "Tech",
      type: type || "Course", status: "active", created_at: new Date()
    });
    await logActivity(user._id.toString(), "admin_action", `Published course: ${title}`);
    await AdminLog.create({ admin_id: user._id, action: `Published course: ${title}`, resource: "courses", timestamp: new Date() });
    broadcastWS("notification", { message: `Course Added: ${title}`, type: "success" });
    broadcastWS("database-changed", { type: "course-added" });
    res.json({ success: true, course: { id: course._id, title, platform } });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create course." });
  }
});

// Admin: Delete User
app.delete("/api/admin/users/:email", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const emailToDelete = req.params.email.trim().toLowerCase();
    const targetUser = await User.findOne({ email: emailToDelete });
    if (!targetUser) return res.status(404).json({ error: "User not found." });
    if (targetUser.role === "admin") return res.status(400).json({ error: "Administrator accounts cannot be deleted." });

    const userId = targetUser._id;
    await User.deleteOne({ _id: userId });
    await Resume.deleteMany({ user_id: userId });
    await ATSScore.deleteMany({ user_id: userId });
    await CoverLetter.deleteMany({ user_id: userId });
    await Roadmap.deleteMany({ user_id: userId });
    await RoadmapProgress.deleteMany({ user_id: userId });
    await SavedJob.deleteMany({ user_id: userId });
    await SavedCourse.deleteMany({ user_id: userId });
    await InterviewSession.deleteMany({ user_id: userId });
    await InterviewReport.deleteMany({ user_id: userId });
    await ChatSession.deleteMany({ user_id: userId });
    await ChatMessage.deleteMany({ user_id: userId });
    await Activity.deleteMany({ user_id: userId });

    const admin = await getAuthUser(req);
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1").toString();
    await AdminLog.create({ admin_id: admin._id, action: `Deleted user: ${emailToDelete}`, resource: "users", ip_address: ip, timestamp: new Date() });
    broadcastWS("notification", { message: `User Deleted: ${emailToDelete}`, type: "warning" });
    broadcastWS("database-changed", { type: "user-deleted", email: emailToDelete });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to delete user." });
  }
});

// Admin: Edit User (disabled)
app.post("/api/admin/users/edit", verifyToken, requireAdmin, (req: Request, res: Response) => {
  res.status(403).json({ error: "Admin editing of user profiles is disabled." });
});

// Admin: Create User
app.post("/api/admin/users/create", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email, name, password, region, interests, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });
    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ error: "User already exists." });

    let interestsArr: string[] = [];
    if (Array.isArray(interests)) interestsArr = interests;
    else if (typeof interests === "string" && interests.trim()) interestsArr = interests.split(",").map((i: string) => i.trim()).filter(Boolean);

    await User.create({
      name: name || cleanEmail.split("@")[0], email: cleanEmail,
      password_hash: bcrypt.hashSync(password, 10), role: role || "user",
      region: region || "US", interests: interestsArr,
      created_at: new Date(), updated_at: new Date(), last_login: new Date(), last_active: new Date()
    });

    const admin = await getAuthUser(req);
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1").toString();
    await AdminLog.create({ admin_id: admin._id, action: `Created user: ${cleanEmail} (${role || "user"})`, resource: "users", ip_address: ip, timestamp: new Date() });
    broadcastWS("notification", { message: `User Created: ${name || cleanEmail}`, type: "success" });
    broadcastWS("database-changed", { type: "user-created", email: cleanEmail });
    res.json({ success: true, message: "User account created." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create user." });
  }
});

// Admin: Log Report
app.post("/api/admin/report/log", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { reportType, filters } = req.body;
    const admin = await getAuthUser(req);
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1").toString();
    await AdminLog.create({ admin_id: admin._id, action: `Exported report (${reportType}) with filters: ${filters}`, resource: "reports", ip_address: ip, timestamp: new Date() });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to record report." });
  }
});

// -------------------------------------------------------------------------
// VITE CLIENT-SIDE MIDDLEWARE
// -------------------------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// -------------------------------------------------------------------------
// STARTUP
// -------------------------------------------------------------------------
async function startServer() {
  await connectDB();
  console.log("✅ MongoDB Atlas connected. All collections ready.");

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ JOB GIENE is succesfully running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
