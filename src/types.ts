export interface ResumeReport {
  id: string;
  fileName: string;
  uploadedAt: string;
  atsScore: number;
  strengths: string[];
  weakAreas: string[];
  missingSkills: string[];
  parsingContent: string;
  suggestions: string[];
  improvedProjects: string[];

  // Advanced Analysis Fields
  weakSections?: string[];
  missingAchievements?: string[];
  experienceGaps?: string[];
  actionPlan?: {
    improveBy: string[];
    estimatedCompletionHours: number;
  };

  // Skill Gap Tracking
  skillGapPercentage?: number;
  requiredSkillsList?: string[];
  currentSkillsList?: string[];
  missingSkillsList?: string[];

  // Recommended Sources Guide
  recommendedSources?: {
    type: "Course" | "Roadmap" | "Practice";
    name: string;
    platform: string;
    link: string;
  }[];
}

export interface InterviewSession {
  id: string;
  role: string;
  difficulty: "Easy" | "Medium" | "Hard";
  score: number;
  feedback: {
    fluency: string;
    confidence: string;
    communication: string;
    overallScore: number;
    detailedEvaluation: string;
  };
  answers: {
    question: string;
    answer: string;
    feedback: string;
    isCorrect: boolean;
  }[];
  createdAt: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  duration: string;
  topics: string[];
  suggestedProjects: string[];
  recommendedCourses: string[];
}

export interface CareerRoadmap {
  id: string;
  targetRole: string;
  currentSkills: string[];
  nodes: RoadmapNode[];
  createdAt?: string;
}

export interface Profile {
  name: string;
  email: string;
  targetRole: string;
  domain: string; // Tech, Business, Design, HR, Finance, Marketing
  skills: string[];
  interests: string[];
  targetCountry: string; // US, UK, IN, CA, DE
  experienceLevel: string; // Student, Intern, Fresher, Beginner Developer
  profileImage: string;
  atsScore: number;
  resumeStrength?: number;
  xp: number;
  streak: number;
  streakDates?: string[];
  level: number;
  badges: string[];
  completedTasks: string[];
  completedNodes?: string[];
  lastTaskResetDate: string;
  savedJobs: string[];
  savedCourses?: string[];
  completedCourses?: string[];
  applications?: any[];
  resumes: ResumeReport[];
  interviews: InterviewSession[];
  roadmaps: CareerRoadmap[];
  isOnboardingCompleted?: boolean;

  // Basic details
  phone?: string;
  dob?: string;
  country?: string;
  city?: string;
  education?: string;
  degree?: string;
  college?: string;

  // Career details
  careerGoals?: string;
  preferredRoles?: string[];
  preferredIndustries?: string[];
  coverImage?: string;
  region?: string;
  courses?: any[];
  certifications?: any[];
  recommendations?: any[];
}

export interface JobOpenings {
  id: string;
  role: string;
  company: string;
  domain: string;
  type: "Job" | "Internship";
  location: string;
  remote: boolean;
  currencySymbol: string;
  currencyCode: string;
  minSalary: number;
  maxSalary: number;
  salaryDisplay: string;
  skillsRequired: string[];
  applyLink: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  platform: string;
  skills: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  link: string;
  rating: number;
  duration?: string;
  instructor?: string;
  type?: "Course" | "Learning Resource";
  learners?: string;
  certificate?: string;
  domain?: string;
  subDomain?: string;
  isAiRecommended?: boolean;
  recommendReason?: string;
}
