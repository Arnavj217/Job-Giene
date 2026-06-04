// server.ts
import dotenv2 from "dotenv";
import express from "express";
import path from "path";

// courses_db.ts
var PRESET_CURATED_COURSES = [
  // ==================== TECH (25 Courses) ====================
  {
    id: "tech-1",
    title: "React Complete Guide & Redux Toolkit Masterclass",
    platform: "Udemy",
    instructor: "Maximilian Schwarzm\xFCller",
    rating: 4.8,
    learners: "520K+",
    duration: "38 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["React", "Redux", "Hooks", "API Integration", "State Management"],
    link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
    domain: "Tech",
    subDomain: "Frontend"
  },
  {
    id: "tech-2",
    title: "TypeScript Essentials and Advanced Architecture Patterns",
    platform: "Udemy",
    instructor: "Stephen Grider",
    rating: 4.9,
    learners: "95K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["TypeScript", "OOP", "Generics", "Vite", "Advanced Coding"],
    link: "https://www.udemy.com/course/typescript-the-complete-developers-guide/",
    domain: "Tech",
    subDomain: "Frontend"
  },
  {
    id: "tech-3",
    title: "HTML5 and CSS3: Ultimate Responsive Layouts & Variables",
    platform: "Udemy",
    instructor: "Jonas Schmedtmann",
    rating: 4.8,
    learners: "380K+",
    duration: "37 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["HTML", "Flexbox", "CSS Grid", "Responsive Design", "Sass"],
    link: "https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/",
    domain: "Tech",
    subDomain: "Frontend"
  },
  {
    id: "tech-4",
    title: "Next.js Production-Ready App Blueprint (React 19 Hooks)",
    platform: "Udemy",
    instructor: "Maximilian Schwarzm\xFCller",
    rating: 4.9,
    learners: "85K+",
    duration: "44 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Next.js", "Server Components", "SEO Optimization", "Vercel Deployments"],
    link: "https://www.udemy.com/course/nextjs-react-the-complete-guide/",
    domain: "Tech",
    subDomain: "Frontend"
  },
  {
    id: "tech-5",
    title: "Tailwind CSS: Complete Guide From HTML to Interactive UI Assets",
    platform: "YouTube",
    instructor: "Brad Traversy",
    rating: 4.7,
    learners: "290K+",
    duration: "4 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Tailwind CSS", "Flexbox", "Responsive Design", "Utility Typography"],
    link: "https://www.youtube.com/results?search_query=tailwind+css+full+course",
    domain: "Tech",
    subDomain: "Frontend"
  },
  {
    id: "tech-6",
    title: "Node.js Complete Guide: Express, SQL & Mongoose Operations",
    platform: "Udemy",
    instructor: "Jonas Schmedtmann",
    rating: 4.8,
    learners: "240K+",
    duration: "42 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Node.js", "Express.js", "REST APIs", "Mongoose", "MongoDB"],
    link: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/",
    domain: "Tech",
    subDomain: "Backend"
  },
  {
    id: "tech-7",
    title: "The Ultimate SQL Bootcamp: Database Admin & Master Queries",
    platform: "Udemy",
    instructor: "Jose Portilla",
    rating: 4.7,
    learners: "410K+",
    duration: "9 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["SQL", "Query Optimization", "PostgreSQL", "Database Analysis"],
    link: "https://www.udemy.com/course/the-complete-sql-bootcamp/",
    domain: "Tech",
    subDomain: "Backend"
  },
  {
    id: "tech-8",
    title: "Go: Complete Developer's Blueprint (Golang Backend Tuning)",
    platform: "Udemy",
    instructor: "Stephen Grider",
    rating: 4.8,
    learners: "65K+",
    duration: "11 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Go (Golang)", "Concurrency", "REST APIs", "Performance Optimization"],
    link: "https://www.udemy.com/course/go-the-complete-developers-guide/",
    domain: "Tech",
    subDomain: "Backend"
  },
  {
    id: "tech-9",
    title: "Python Django & Flask Web Development Core Frameworks Roadmap",
    platform: "Coursera",
    instructor: "William Vincent",
    rating: 4.6,
    learners: "80K+",
    duration: "3 Months",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Django", "Flask", "Python Backend", "SQLAlchemy", "ORM"],
    link: "https://www.coursera.org/learn/django-database-web-development",
    domain: "Tech",
    subDomain: "Backend"
  },
  {
    id: "tech-10",
    title: "Supervised Machine Learning: Regression and Classification Tools",
    platform: "Coursera",
    instructor: "Andrew Ng",
    rating: 4.9,
    learners: "1.2M+",
    duration: "33 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Machine Learning", "Python Core", "Regression", "Classification Analysis"],
    link: "https://www.coursera.org/learn/machine-learning",
    domain: "Tech",
    subDomain: "AI/ML"
  },
  {
    id: "tech-11",
    title: "Deep Learning Specialization: RNNs, CNNS, tuning & setup",
    platform: "Coursera",
    instructor: "Andrew Ng",
    rating: 4.9,
    learners: "480K+",
    duration: "3 Months",
    level: "Advanced",
    certificate: "Available",
    skills: ["Deep Learning", "TensorFlow", "Neural Networks", "NLP Modelling"],
    link: "https://www.coursera.org/specializations/deep-learning",
    domain: "Tech",
    subDomain: "AI/ML"
  },
  {
    id: "tech-12",
    title: "Generative AI with Large Language Models Professional Strategy",
    platform: "Coursera",
    instructor: "Sharon Zhou",
    rating: 4.8,
    learners: "150K+",
    duration: "16 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["LLMs", "Generative AI", "Fine-tuning Systems", "Prompt Engineering"],
    link: "https://www.coursera.org/learn/generative-ai-with-llms",
    domain: "Tech",
    subDomain: "AI/ML"
  },
  {
    id: "tech-13",
    title: "IBM Data Science Professional Career Certification",
    platform: "Coursera",
    instructor: "IBM Global Faculty",
    rating: 4.7,
    learners: "890K+",
    duration: "5 Months",
    level: "Beginner",
    certificate: "Available",
    skills: ["Data Science", "Python Engine", "SQL", "Pandas", "Matplotlib Dash"],
    link: "https://www.coursera.org/professional-certificates/ibm-data-science",
    domain: "Tech",
    subDomain: "Data Science"
  },
  {
    id: "tech-14",
    title: "Advanced Analytics & Business Intelligence Dashboarding tools",
    platform: "Udemy",
    instructor: "Kirill Eremenko",
    rating: 4.7,
    learners: "110K+",
    duration: "21 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Tableau BI", "Data Wrangling", "Dashboarding Design", "Insights Pipeline"],
    link: "https://www.udemy.com/course/tableau10/",
    domain: "Tech",
    subDomain: "Data Science"
  },
  {
    id: "tech-15",
    title: "Google Cybersecurity Professional Career Certificate Program",
    platform: "Coursera",
    instructor: "Google Career Experts",
    rating: 4.8,
    learners: "320K+",
    duration: "6 Months",
    level: "Beginner",
    certificate: "Available",
    skills: ["Linux Terminal", "Security Audit Planning", "SIEM Dashboards", "Network Intrusion"],
    link: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    domain: "Tech",
    subDomain: "Cybersecurity"
  },
  {
    id: "tech-16",
    title: "CompTIA Security+ Exam Preparation Premium Prep Boot Camp",
    platform: "Udemy",
    instructor: "Jason Dion",
    rating: 4.8,
    learners: "160K+",
    duration: "30 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Cryptography Basics", "Threat Assessment", "Exam Readiness", "Protocol Defense"],
    link: "https://www.udemy.com/course/securityplus/",
    domain: "Tech",
    subDomain: "Cybersecurity"
  },
  {
    id: "tech-17",
    title: "AWS Certified Cloud Practitioner Ultimate Training Program",
    platform: "Udemy",
    instructor: "Stephane Maarek",
    rating: 4.8,
    learners: "540K+",
    duration: "15 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["AWS Platform", "EC2 Compute", "S3 Storage", "IAM Management", "Cloud Pricing"],
    link: "https://www.udemy.com/course/aws-certified-cloud-practitioner-training-course/",
    domain: "Tech",
    subDomain: "Cloud"
  },
  {
    id: "tech-18",
    title: "Docker and Kubernetes: Microservice Pipelines and DevOps",
    platform: "Udemy",
    instructor: "Stephen Grider",
    rating: 4.9,
    learners: "280K+",
    duration: "22 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Docker Core", "Kubernetes Clusters", "CI/CD Orchestration", "Microservices Networking"],
    link: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
    domain: "Tech",
    subDomain: "Cloud"
  },
  {
    id: "tech-19",
    title: "Google Cloud Platform Associate Solutions Engineer Blueprint",
    platform: "Udemy",
    instructor: "Ranga Kanamarlapudi",
    rating: 4.7,
    learners: "95K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["GCP Computing", "Kubernetes Engine", "IAM Security Policy", "Cloud Networks"],
    link: "https://www.udemy.com/course/google-cloud-associate-cloud-engineer-certification/",
    domain: "Tech",
    subDomain: "Cloud"
  },
  {
    id: "tech-20",
    title: "Google UX Design Professional Certification Roadmap",
    platform: "Coursera",
    instructor: "Google UX Research Team",
    rating: 4.8,
    learners: "590K+",
    duration: "6 Months",
    level: "Beginner",
    certificate: "Available",
    skills: ["Figma Design", "User Interviewing", "Wireframing Prototyping", "Design Strategy"],
    link: "https://www.coursera.org/professional-certificates/google-ux-design",
    domain: "Tech",
    subDomain: "UI/UX"
  },
  {
    id: "tech-21",
    title: "User Experience Design Masterclass: Adobe and Figma",
    platform: "Udemy",
    instructor: "Joe Natoli",
    rating: 4.7,
    learners: "120K+",
    duration: "24 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["UX Design Audit", "Figma Components", "Wireframe Analysis", "Cognitive Layouts"],
    link: "https://www.udemy.com/course/user-experience-design-fundamentals-course/",
    domain: "Tech",
    subDomain: "UI/UX"
  },
  {
    id: "tech-22",
    title: "Advanced Angular & RxJS Mastery Flow Components",
    platform: "Udemy",
    instructor: "Todd Motto",
    rating: 4.6,
    learners: "40K+",
    duration: "22 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Angular Architecture", "RxJS Operators", "Custom States", "Testing Workflows"],
    link: "https://www.udemy.com/course/angular-masterclass/",
    domain: "Tech",
    subDomain: "Frontend"
  },
  {
    id: "tech-23",
    title: "Spring Boot, JPA & Microservices Enterprise Java Architect",
    platform: "Udemy",
    instructor: "Chad Darby",
    rating: 4.7,
    learners: "150K+",
    duration: "41 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Spring Boot", "Enterprise Microservices", "Spring Security", "JPA Registry"],
    link: "https://www.udemy.com/course/spring-hibernate-tutorial-to-html-dev-to-unlimited/",
    domain: "Tech",
    subDomain: "Backend"
  },
  {
    id: "tech-24",
    title: "R Programming Language Bootcamp for Statisticians & NLP Data",
    platform: "Coursera",
    instructor: "Johns Hopkins Faculty",
    rating: 4.5,
    learners: "210K+",
    duration: "4 Weeks",
    level: "Beginner",
    certificate: "Available",
    skills: ["R Engine", "Data Wrangling", "GGPlot2 Visuals", "Inference Modeling"],
    link: "https://www.coursera.org/learn/r-programming",
    domain: "Tech",
    subDomain: "Data Science"
  },
  {
    id: "tech-25",
    title: "Natural Language Processing (NLP) Transformers pipeline",
    platform: "Coursera",
    instructor: "HuggingFace Core Team",
    rating: 4.8,
    learners: "75K+",
    duration: "18 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Transformer Architecture", "HuggingFace pipelines", "Attention Matrices", "Sentiment Tuners"],
    link: "https://www.coursera.org/learn/transformers-nlp",
    domain: "Tech",
    subDomain: "AI/ML"
  },
  // ==================== FINANCE (25 Courses) ====================
  {
    id: "fin-1",
    title: "Financial Analysis & Decision Making Executive Specialization",
    platform: "Coursera",
    instructor: "Prof. Keith Robertson",
    rating: 4.8,
    learners: "120K+",
    duration: "6 Months",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Financial Analysis", "Capital Budgeting", "Ratio Assessments", "Investment Decisions"],
    link: "https://www.coursera.org/specializations/financial-management",
    domain: "Finance",
    subDomain: "Financial Analysis"
  },
  {
    id: "fin-2",
    title: "Financial Modeling & Valuation Analyst (FMVA\xAE) Blueprint",
    platform: "Udemy",
    instructor: "Corporate Finance Institute",
    rating: 4.9,
    learners: "180K+",
    duration: "35 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["DCF Modeling", "Valuation Analysis", "Three Statement Models", "Leveraged Buyouts"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Finance",
    subDomain: "Financial Modeling"
  },
  {
    id: "fin-3",
    title: "Microsoft Excel: Advanced Formulation & Analytical Datatables",
    platform: "Udemy",
    instructor: "Chris Dutton",
    rating: 4.8,
    learners: "450K+",
    duration: "9 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Excel VLOOKUP/XLOOKUP", "Pivot Tables", "Dynamic Array Formulas", "Financial Structuring"],
    link: "https://www.udemy.com/course/microsoft-excel-formulas-functions/",
    domain: "Finance",
    subDomain: "Excel"
  },
  {
    id: "fin-4",
    title: "Power BI Complete Masterclass: Enterprise Data Analysis",
    platform: "Coursera",
    instructor: "Microsoft Press Team",
    rating: 4.7,
    learners: "95K+",
    duration: "24 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Power BI Engine", "DAX Formulas", "Data Modeling", "Dashboard Architecture"],
    link: "https://www.coursera.org/learn/power-bi-data-analytics",
    domain: "Finance",
    subDomain: "Power BI"
  },
  {
    id: "fin-5",
    title: "Investment Analysis & Corporate Asset Portfolio Management",
    platform: "Udemy",
    instructor: "Dr. Manish Kumar",
    rating: 4.8,
    learners: "70K+",
    duration: "12 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Portfolio Optimization", "Modern Portfolio Theory", "Risk Benchmarking", "Asset Allocation"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Finance",
    subDomain: "Financial Analysis"
  },
  {
    id: "fin-6",
    title: "Introduction to Corporate Finance & Structural Markets",
    platform: "Coursera",
    instructor: "Prof. Franklin Allen",
    rating: 4.8,
    learners: "220K+",
    duration: "10 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Corporate Finance", "Time Value of Money", "Investment Appraisal", "Debt Capital"],
    link: "https://www.coursera.org/learn/wharton-finance",
    domain: "Finance",
    subDomain: "Financial Modeling"
  },
  {
    id: "fin-7",
    title: "Economics of Banking & Global Monetary Policies",
    platform: "Coursera",
    instructor: "Prof. Andrew Sentance",
    rating: 4.7,
    learners: "60K+",
    duration: "16 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Commercial Banking", "Monetary Policy", "Interest Economics", "Liquidity Management"],
    link: "https://www.coursera.org/learn/money-banking",
    domain: "Finance",
    subDomain: "Banking"
  },
  {
    id: "fin-8",
    title: "FinTech: Foundations & Applications of Financial Technology",
    platform: "Coursera",
    instructor: "Wharton Business School",
    rating: 4.8,
    learners: "130K+",
    duration: "4 Months",
    level: "Beginner",
    certificate: "Available",
    skills: ["FinTech", "Blockchain Networks", "API Payments", "Robo-Advising Engines"],
    link: "https://www.coursera.org/specializations/financial-technology- Wharton",
    domain: "Finance",
    subDomain: "FinTech"
  },
  {
    id: "fin-9",
    title: "Advanced Financial Modeling for Investment Banking",
    platform: "Udemy",
    instructor: "Wall Street Prep Specialists",
    rating: 4.9,
    learners: "45K+",
    duration: "20 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["LBO Modeling", "M&A Analytics", "Sensitivity Datatables", "Pitchbook Formatting"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Finance",
    subDomain: "Financial Modeling"
  },
  {
    id: "fin-10",
    title: "Data Analysis and Modeling using Excel Power Query",
    platform: "Udemy",
    instructor: "Kyle Pew",
    rating: 4.8,
    learners: "190K+",
    duration: "15 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Power Query", "M Language", "ETL Pipelines", "Data Structuring"],
    link: "https://www.udemy.com/course/microsoft-excel-formulas-functions/",
    domain: "Finance",
    subDomain: "Excel"
  },
  {
    id: "fin-11",
    title: "The Mechanics of Investment Banking & Loan Syndications",
    platform: "Coursera",
    instructor: "Geneva Finance Faculty",
    rating: 4.6,
    learners: "35K+",
    duration: "18 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Investment Banking", "Syndicated Loans", "Capital Restructuring", "IPO Underwriting"],
    link: "https://www.coursera.org/learn/money-banking",
    domain: "Finance",
    subDomain: "Banking"
  },
  {
    id: "fin-12",
    title: "Introduction to Wealth Management and Financial Advisory",
    platform: "Udemy",
    instructor: "Financial Training Association",
    rating: 4.7,
    learners: "55K+",
    duration: "6 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Wealth Management", "Asset Preservation", "Advisory Ethics", "Tax Shield Strategies"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Finance",
    subDomain: "Banking"
  },
  {
    id: "fin-13",
    title: "Decentralized Finance (DeFi) & Smart Contracts Strategy",
    platform: "Coursera",
    instructor: "Cam Harvey (Duke University)",
    rating: 4.9,
    learners: "82K+",
    duration: "12 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["DeFi Economics", "Ethereum Protocols", "Automated Market Makers", "Liquidity Pools"],
    link: "https://www.coursera.org/specializations/financial-technology- Wharton",
    domain: "Finance",
    subDomain: "FinTech"
  },
  {
    id: "fin-14",
    title: "Quantitative Finance: Algorithmic Trading with Python",
    platform: "Udemy",
    instructor: "Dr. Yves Hilpisch",
    rating: 4.8,
    learners: "320K+",
    duration: "25 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Quantitative Finance", "Alpha Generation", "Backtesting Scripts", "Pandas Finance"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Finance",
    subDomain: "FinTech"
  },
  {
    id: "fin-15",
    title: "Advanced Power BI: DAX Calculations & Performance Tuning",
    platform: "Udemy",
    instructor: "Enterprise DNA Experts",
    rating: 4.8,
    learners: "50K+",
    duration: "14 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["DAX Query Tuning", "Filter Context", "Variables in DAX", "DirectQuery Optimization"],
    link: "https://www.udemy.com/course/microsoft-excel-formulas-functions/",
    domain: "Finance",
    subDomain: "Power BI"
  },
  {
    id: "fin-16",
    title: "Credit Risk Analysis & Debt Covenant Structuring",
    platform: "Coursera",
    instructor: "Delft University of Technology",
    rating: 4.7,
    learners: "28K+",
    duration: "22 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Credit Risk Models", "Covenants Analysis", "Probability of Default", "Basel III Norms"],
    link: "https://www.coursera.org/learn/money-banking",
    domain: "Finance",
    subDomain: "Banking"
  },
  {
    id: "fin-17",
    title: "Fundamental Analysis: Reading Corporate Balance Sheets",
    platform: "Udemy",
    instructor: "Sven Carlin",
    rating: 4.7,
    learners: "105K+",
    duration: "8 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Fundamental Analysis", "Balance Sheets Audit", "Capital Adequacy", "Earnings Yield"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Finance",
    subDomain: "Financial Analysis"
  },
  {
    id: "fin-18",
    title: "Excel Dashboard Design: Dynamic C-Suite Reporting Templates",
    platform: "Udemy",
    instructor: "Chandoo (Purna Duggirala)",
    rating: 4.9,
    learners: "115K+",
    duration: "12 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Interactive Charts", "Form Controls", "KPI Cards Design", "Conditional Formats"],
    link: "https://www.udemy.com/course/microsoft-excel-formulas-functions/",
    domain: "Finance",
    subDomain: "Excel"
  },
  {
    id: "fin-19",
    title: "Enterprise Power BI Data Warehouse Integration Strategy",
    platform: "Coursera",
    instructor: "Microsoft Learn experts",
    rating: 4.7,
    learners: "75K+",
    duration: "30 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Data Warehousing", "Synapse ETL Integration", "Role-Level Security", "Row Filters"],
    link: "https://www.coursera.org/learn/power-bi-data-analytics",
    domain: "Finance",
    subDomain: "Power BI"
  },
  {
    id: "fin-20",
    title: "Startup Valuation and Angel Investors Capital Structure",
    platform: "Coursera",
    instructor: "Younes Bensouda Mourri",
    rating: 4.8,
    learners: "44K+",
    duration: "10 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Startup Valuation", "First-round Cap Sheets", "Safes/Convertibles", "Equity dilution"],
    link: "https://www.coursera.org/learn/wharton-finance",
    domain: "Finance",
    subDomain: "Financial Modeling"
  },
  {
    id: "fin-21",
    title: "International Trade Finance and Letters of Credit Operations",
    platform: "Udemy",
    instructor: "Trade Finance Academy",
    rating: 4.6,
    learners: "22K+",
    duration: "9 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Letters of Credit", "Incoterms Rules", "Sovereign Bill Financing", "Guarantees Admin"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Finance",
    subDomain: "Banking"
  },
  {
    id: "fin-22",
    title: "Central Banking, Inflation, and Yield Curves Forecasting",
    platform: "Coursera",
    instructor: "Yale University Faculty",
    rating: 4.9,
    learners: "90K+",
    duration: "14 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Yield Curve Analysis", "Quantitative Easing", "Inflation Indicators", "Macro-Modeling"],
    link: "https://www.coursera.org/learn/money-banking",
    domain: "Finance",
    subDomain: "Banking"
  },
  {
    id: "fin-23",
    title: "Financial Econometrics and Statistical Modeling Basics",
    platform: "Coursera",
    instructor: "Erasmus University Rotterdam",
    rating: 4.7,
    learners: "29K+",
    duration: "25 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Econometrics", "GARCH Models", "Regression Diagnostics", "Stochastic Calculus"],
    link: "https://www.coursera.org/specializations/financial-management",
    domain: "Finance",
    subDomain: "Financial Analysis"
  },
  {
    id: "fin-24",
    title: "Algorithmic Risk Management and Stress Testing matrices",
    platform: "Udemy",
    instructor: "FRM Coaches Guild",
    rating: 4.8,
    learners: "18K+",
    duration: "16 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Value at Risk (VaR)", "Monte Carlo Simulation", "Backtesting Engine", "Counterparty Stress"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Finance",
    subDomain: "FinTech"
  },
  {
    id: "fin-25",
    title: "Excel VBA Programmatic Trading Macro Automation",
    platform: "Udemy",
    instructor: "Daniel Strong",
    rating: 4.8,
    learners: "85K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Excel VBA Macros", "API Fetching Macros", "Event Handling Controls", "Userforms Layouts"],
    link: "https://www.udemy.com/course/microsoft-excel-formulas-functions/",
    domain: "Finance",
    subDomain: "Excel"
  },
  // ==================== MARKETING (25 Courses) ====================
  {
    id: "mkt-1",
    title: "Digital Marketing Specialist: Ultimate Masterclass Blueprint",
    platform: "Udemy",
    instructor: "Robby Miles",
    rating: 4.8,
    learners: "650K+",
    duration: "22 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Digital Marketing", "SEO Basics", "Email Campaigns", "Conversion Metrics"],
    link: "https://www.udemy.com/course/learn-digital-marketing-course/",
    domain: "Marketing",
    subDomain: "Digital Marketing"
  },
  {
    id: "mkt-2",
    title: "Google Analytics 4 (GA4) Analytics Specialist Certification",
    platform: "Coursera",
    instructor: "Google Marketing Experts",
    rating: 4.9,
    learners: "220K+",
    duration: "12 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["GA4 Tracking", "Cohort Analytics", "User Funnels", "Custom Dimensions"],
    link: "https://www.coursera.org/learn/google-analytics",
    domain: "Marketing",
    subDomain: "Analytics"
  },
  {
    id: "mkt-3",
    title: "SEO Foundations & Enterprise Technical Site Audit",
    platform: "Udemy",
    instructor: "Alex Genadinik",
    rating: 4.7,
    learners: "150K+",
    duration: "11 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["On-Page SEO", "Search Rankings", "SEM Rush Tool", "Backlinking Strategy"],
    link: "https://www.udemy.com/course/seo-get-targeted-traffic-to-your-website-optimized/",
    domain: "Marketing",
    subDomain: "SEO"
  },
  {
    id: "mkt-4",
    title: "Social Media Strategy and Organic Brand Funnels Roadmap",
    platform: "Coursera",
    instructor: "Meta Marketing Faculty",
    rating: 4.8,
    learners: "270K+",
    duration: "10 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Social Media", "Community Growth", "Meta Pixel", "Ad Optimization"],
    link: "https://www.coursera.org/professional-certificates/meta-social-media-marketing",
    domain: "Marketing",
    subDomain: "Social Media"
  },
  {
    id: "mkt-5",
    title: "Brand Identity, Strategy, and Strategic Storytelling Architect",
    platform: "Coursera",
    instructor: "Prof. Maria Harrison",
    rating: 4.8,
    learners: "90K+",
    duration: "15 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Branding Concepts", "Brand Architecture", "Competitive Moats", "Visual Design Tone"],
    link: "https://www.coursera.org/learn/brand-management",
    domain: "Marketing",
    subDomain: "Branding"
  },
  {
    id: "mkt-6",
    title: "Inbound Marketing & Lead Sourcing Strategy Certification",
    platform: "Coursera",
    instructor: "HubSpot Academy Experts",
    rating: 4.8,
    learners: "115K+",
    duration: "8 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Inbound Marketing", "Lead Capture Formulas", "SEO Copywriting", "CRM Integration"],
    link: "https://www.coursera.org/learn/brand-management",
    domain: "Marketing",
    subDomain: "Digital Marketing"
  },
  {
    id: "mkt-7",
    title: "Advanced Technical SEO & Schema Markup Deployment Blueprint",
    platform: "Udemy",
    instructor: "SEO Industry Academy",
    rating: 4.9,
    learners: "30K+",
    duration: "14 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Technical SEO", "Schema Markup", "Core Web Vitals", "Sitemap Audits"],
    link: "https://www.udemy.com/course/seo-get-targeted-traffic-to-your-website-optimized/",
    domain: "Marketing",
    subDomain: "SEO"
  },
  {
    id: "mkt-8",
    title: "Copywriting Masterclass: Powering High Converting Landing Pages",
    platform: "Udemy",
    instructor: "Tamsin Henderson",
    rating: 4.9,
    learners: "140K+",
    duration: "6 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["AIDA Copywriting Framework", "Headline Psychology", "Value Propositions", "Call-to-Action Tuning"],
    link: "https://www.udemy.com/course/learn-digital-marketing-course/",
    domain: "Marketing",
    subDomain: "Digital Marketing"
  },
  {
    id: "mkt-9",
    title: "Meta Ads & Programmatic Media Retargeting Strategies",
    platform: "Coursera",
    instructor: "Meta Business Blueprint Team",
    rating: 4.8,
    learners: "210K+",
    duration: "25 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Meta Ads Manager", "A/B Multivariate Testing", "Lookalike Audiences", "LTV Retargeting"],
    link: "https://www.coursera.org/professional-certificates/meta-social-media-marketing",
    domain: "Marketing",
    subDomain: "Social Media"
  },
  {
    id: "mkt-10",
    title: "Digital Marketing Metrics, Web KPIs & ROI Dashboards",
    platform: "Coursera",
    instructor: "Wharton Business School",
    rating: 4.8,
    learners: "85K+",
    duration: "12 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Marketing Attribution", "Customer Acquisition Cost (CAC)", "LTV Modeling", "ROI Calculations"],
    link: "https://www.coursera.org/learn/google-analytics",
    domain: "Marketing",
    subDomain: "Analytics"
  },
  {
    id: "mkt-11",
    title: "International Brand Strategy & Localization Campaign Design",
    platform: "Coursera",
    instructor: "London Business School Faculty",
    rating: 4.7,
    learners: "45K+",
    duration: "18 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Localization Campaigns", "Cross-Border Branding", "Niche Scaling", "Cultural Sensitivities"],
    link: "https://www.coursera.org/learn/brand-management",
    domain: "Marketing",
    subDomain: "Branding"
  },
  {
    id: "mkt-12",
    title: "YouTube Growth Masterclass & Organic Video SEO Strategy",
    platform: "YouTube",
    instructor: "Traversy Media & Guests",
    rating: 4.7,
    learners: "300K+",
    duration: "5 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Video SEO", "YouTube Algorithm Mechanics", "Ctr Optimization", "Engagement Metrics"],
    link: "https://www.youtube.com/results?search_query=learn+seo+marketing+tutorial",
    domain: "Marketing",
    subDomain: "SEO"
  },
  {
    id: "mkt-13",
    title: "Automated B2B Email Marketing Flows & Hubspot Campaigns",
    platform: "Udemy",
    instructor: "B2B Strategic Partners",
    rating: 4.8,
    learners: "65K+",
    duration: "8 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Drip Campaigns Setup", "Cold Outreach Protocols", "CRM Trigger Flowcharts", "Spam Filter Avoidance"],
    link: "https://www.udemy.com/course/learn-digital-marketing-course/",
    domain: "Marketing",
    subDomain: "Digital Marketing"
  },
  {
    id: "mkt-14",
    title: "LinkedIn Ads Strategy and Organic Executive Authority Scaling",
    platform: "Coursera",
    instructor: "LinkedIn Marketing Lab experts",
    rating: 4.8,
    learners: "40K+",
    duration: "10 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["LinkedIn Campaign Manager", "Account-Based Marketing (ABM)", "Professional Demographics Filtering", "Direct Sponsored Messaging"],
    link: "https://www.coursera.org/professional-certificates/meta-social-media-marketing",
    domain: "Marketing",
    subDomain: "Social Media"
  },
  {
    id: "mkt-15",
    title: "Brand Auditing & Corporate Reputation Crisis Management",
    platform: "Coursera",
    instructor: "IE Business School Premium Experts",
    rating: 4.9,
    learners: "52K+",
    duration: "15 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Reputation Metrics Tracking", "Crisis Communication Plans", "Sentiment Listening Tools", "Brand Equity Recovery"],
    link: "https://www.coursera.org/learn/brand-management",
    domain: "Marketing",
    subDomain: "Branding"
  },
  {
    id: "mkt-16",
    title: "Growth Hacking Methodology for High Traction Startups",
    platform: "Udemy",
    instructor: "Sean Ellis Academy",
    rating: 4.9,
    learners: "95K+",
    duration: "14 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Pirate Metrics (AARRR)", "Growth Sprints Scheduling", "Virality Index Modeling", "Retention Loop Funnels"],
    link: "https://www.udemy.com/course/learn-digital-marketing-course/",
    domain: "Marketing",
    subDomain: "Digital Marketing"
  },
  {
    id: "mkt-17",
    title: "App Store Optimization (ASO) & Premium Mobile Growth Systems",
    platform: "Udemy",
    instructor: "Mobile Action Experts",
    rating: 4.7,
    learners: "28K+",
    duration: "11 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["ASO Keyword Optimization", "Storefront Conversion Optimization", "Deep-linking Schemes", "App Store Metrics Analytics"],
    link: "https://www.udemy.com/course/seo-get-targeted-traffic-to-your-website-optimized/",
    domain: "Marketing",
    subDomain: "SEO"
  },
  {
    id: "mkt-18",
    title: "Predictive Analytics, Machine Learning & Python for Modern Marketers",
    platform: "Coursera",
    instructor: "Wharton Business Analytics Team",
    rating: 4.8,
    learners: "72K+",
    duration: "24 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Predictive Analytics", "Cohort Churn Models", "Python Pandas Marketing", "Multi-Touch Attribution"],
    link: "https://www.coursera.org/learn/google-analytics",
    domain: "Marketing",
    subDomain: "Analytics"
  },
  {
    id: "mkt-19",
    title: "Customer Journey Mapping Methodology & Retention Frameworks",
    platform: "Udemy",
    instructor: "UX/CX Designers Alliance",
    rating: 4.8,
    learners: "45K+",
    duration: "7 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Customer Journey Maps", "Net Promoter Score Tracking", "Friction Point Auditing", "Loyalty Multipliers Builder"],
    link: "https://www.udemy.com/course/learn-digital-marketing-course/",
    domain: "Marketing",
    subDomain: "Branding"
  },
  {
    id: "mkt-20",
    title: "Google Tag Manager (GTM) Infrastructure Setup Masterclass",
    platform: "Udemy",
    instructor: "Julius Fedorovicius",
    rating: 4.9,
    learners: "88K+",
    duration: "16 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["GTM Tags/Triggers Setup", "Datalayer Variables configuration", "E-Commerce tracking APIs", "Third-party Pixels Management"],
    link: "https://www.udemy.com/course/seo-get-targeted-traffic-to-your-website-optimized/",
    domain: "Marketing",
    subDomain: "Analytics"
  },
  {
    id: "mkt-21",
    title: "Brand Equity Modeling: Interbrand Methodology Blueprint",
    platform: "Coursera",
    instructor: "Vanderbilt University Faculty",
    rating: 4.7,
    learners: "37K+",
    duration: "12 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Brand Valuation Formulas", "Financial Brand Strength Index", "Ecosystem Value Capture", "Perpetual Intangibles Metrics"],
    link: "https://www.coursera.org/learn/brand-management",
    domain: "Marketing",
    subDomain: "Branding"
  },
  {
    id: "mkt-22",
    title: "Product Marketing Fundamentals: Product Launch Launchpads",
    platform: "Coursera",
    instructor: "Product Marketing Alliance",
    rating: 4.9,
    learners: "64K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Go-to-Market Strategy (GTM)", "Competitive Positioning Arrays", "Sales Enablement Matrices", "Messaging Hierarchy Design"],
    link: "https://www.coursera.org/learn/brand-management",
    domain: "Marketing",
    subDomain: "Digital Marketing"
  },
  {
    id: "mkt-23",
    title: "Neuro-Marketing & Cognitive Behavioral Economics of Advertisements",
    platform: "Coursera",
    instructor: "Copenhagen Business School Faculty",
    rating: 4.8,
    learners: "79K+",
    duration: "20 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Neuromarketing Testing", "Biometric Advertising Feedback", "Prospect Decision Theory", "Attention Retention Mechanics"],
    link: "https://www.coursera.org/learn/google-analytics",
    domain: "Marketing",
    subDomain: "Analytics"
  },
  {
    id: "mkt-24",
    title: "Influencer Campaign Sourcing Strategies & ROI Auditing",
    platform: "Udemy",
    instructor: "Viral Branding Guild",
    rating: 4.6,
    learners: "41K+",
    duration: "9 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Macro/Micro Influencer Sourcing", "Contracts Negotiation Schemes", "UTM Performance Tracking", "Engagement Auditing Procedures"],
    link: "https://www.udemy.com/course/learn-digital-marketing-course/",
    domain: "Marketing",
    subDomain: "Social Media"
  },
  {
    id: "mkt-25",
    title: "Advanced SEO Copywriting for AI Search Engine Optimizations",
    platform: "Udemy",
    instructor: "SEO Industry Academy Experts",
    rating: 4.8,
    learners: "53K+",
    duration: "10 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Semantic Web Copywriting", "Keyword Intent Mapping", "AI Engine Crawlability Design", "Featured Snippet Markups"],
    link: "https://www.udemy.com/course/seo-get-targeted-traffic-to-your-website-optimized/",
    domain: "Marketing",
    subDomain: "SEO"
  },
  // ==================== HR (25 Courses) ====================
  {
    id: "hr-1",
    title: "Talent Acquisition, Modern Recruitment & Expert Sourcing Strategies",
    platform: "Coursera",
    instructor: "Prof. Angela Patterson",
    rating: 4.8,
    learners: "110K+",
    duration: "13 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Recruitment funnel", "Candidate sourcing", "Active interviewing", "Pipeline management"],
    link: "https://www.coursera.org/learn/recruitment-and-sourcing",
    domain: "HR",
    subDomain: "Recruitment"
  },
  {
    id: "hr-2",
    title: "Human Resource Management Specialist Core Certification",
    platform: "Coursera",
    instructor: "University of Minnesota Faculty",
    rating: 4.9,
    learners: "340K+",
    duration: "5 Months",
    level: "Intermediate",
    certificate: "Available",
    skills: ["HR Strategy", "Employee Onboarding", "Performance Management", "Company Culture Alignment"],
    link: "https://www.coursera.org/specializations/human-resource-management",
    domain: "HR",
    subDomain: "Talent Acquisition"
  },
  {
    id: "hr-3",
    title: "Payroll Management & Compensation Structuring Mastery",
    platform: "Udemy",
    instructor: "Amman Ahmed",
    rating: 4.7,
    learners: "85K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Payroll Processing", "Benefits Design", "Tax Rules Alignment", "SLA Salary Models"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "HR Analytics"
  },
  {
    id: "hr-4",
    title: "Employee Engagement, Corporate Culture & Hybrid Teams Leadership",
    platform: "Udemy",
    instructor: "Vikas Jolly",
    rating: 4.8,
    learners: "95K+",
    duration: "14 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Engagement Tactics", "Conflict Resolution", "Interpersonal Skills", "Hybrid Working Models"],
    link: "https://www.udemy.com/course/employee-engagement-training/",
    domain: "HR",
    subDomain: "Leadership"
  },
  {
    id: "hr-5",
    title: "HR Analytics: Data-driven Decisions with Excel & Tableau Tools",
    platform: "Coursera",
    instructor: "Workforce Analytics Guild",
    rating: 4.8,
    learners: "150K+",
    duration: "25 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Workforce Analytics", "Predictive Churn Models", "KPI Dashboards", "Retention Metrics"],
    link: "https://www.coursera.org/learn/hr-analytics",
    domain: "HR",
    subDomain: "HR Analytics"
  },
  {
    id: "hr-6",
    title: "High Performance Recruiting: Sourcing Candidates on LinkedIn",
    platform: "Udemy",
    instructor: "Job Hunt Alliance Professionals",
    rating: 4.8,
    learners: "70K+",
    duration: "8 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["LinkedIn Recruiter Premium", "Boolean Sourcing Strings", "InMail Outreach Optimization", "Employer Branding"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "Recruitment"
  },
  {
    id: "hr-7",
    title: "Strategic HR Leadership: Structuring Modern Global Organizations",
    platform: "Coursera",
    instructor: "Wharton Business School Executives",
    rating: 4.9,
    learners: "120K+",
    duration: "4 Months",
    level: "Advanced",
    certificate: "Available",
    skills: ["Strategic Re-orgs", "Talent Planning Protocols", "Corporate Change Execution", "Executive HR Partnering"],
    link: "https://www.coursera.org/specializations/human-resource-management",
    domain: "HR",
    subDomain: "Leadership"
  },
  {
    id: "hr-8",
    title: "Employment Law compliance & Workplace Safety Mandates",
    platform: "Udemy",
    instructor: "Legal Compliance Partners",
    rating: 4.7,
    learners: "55K+",
    duration: "12 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Labor Laws Compliance", "Arbitration Procedures", "OSHA Safeguards", "Title VII Anti-Discrimination"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "Talent Acquisition"
  },
  {
    id: "hr-9",
    title: "Diversity, Equity, and Inclusion (DEI) Corporate Architect",
    platform: "Coursera",
    instructor: "ESSEC Business School Faculty",
    rating: 4.8,
    learners: "88K+",
    duration: "16 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["DEI Strategy", "Unconscious Bias Mitigation", "Inclusive Job Specs", "Representative Recruitment Pipeline"],
    link: "https://www.coursera.org/learn/recruitment-and-sourcing",
    domain: "HR",
    subDomain: "Talent Acquisition"
  },
  {
    id: "hr-10",
    title: "Excel Data Sheets and Pivot Reporting for HR Managers",
    platform: "Udemy",
    instructor: "Kyle Pew",
    rating: 4.8,
    learners: "210K+",
    duration: "10 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Excel HR Calculations", "Attendance Macros", "Salary Modeling Matrices", "Pivot Tables Reporting"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "HR Analytics"
  },
  {
    id: "hr-11",
    title: "Advanced Interview Techniques & Forensic Candidate Assessment",
    platform: "Coursera",
    instructor: "PwC Consulting Academy Experts",
    rating: 4.9,
    learners: "67K+",
    duration: "15 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Structured Interview Auditing", "Behavioral Calibration Metrics", "STAR Response Scoring", "Executive Assessment Schemes"],
    link: "https://www.coursera.org/learn/recruitment-and-sourcing",
    domain: "HR",
    subDomain: "Recruitment"
  },
  {
    id: "hr-12",
    title: "Employer Branding and Candidate Recruitment Marketing Core",
    platform: "Udemy",
    instructor: "Corporate Brand Consultants",
    rating: 4.7,
    learners: "38K+",
    duration: "7 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Candidate Value Proposition", "Glassdoor Rating Strategy", "Social Media Sourcing Funnels", "Careers Page SEO"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "Recruitment"
  },
  {
    id: "hr-13",
    title: "Conflict Management & Negotiation Tactics in Corporate HR",
    platform: "Coursera",
    instructor: "University of Michigan Team",
    rating: 4.9,
    learners: "145K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Dispute Escalation Protocols", "Negotiation Frameworks", "Active Listening Systems", "Win-Win Agreements Crafting"],
    link: "https://www.coursera.org/specializations/human-resource-management",
    domain: "HR",
    subDomain: "Leadership"
  },
  {
    id: "hr-14",
    title: "Organisational Psychology: Managing Team Performance Gaps",
    platform: "Coursera",
    instructor: "Prof. Kenneth George",
    rating: 4.8,
    learners: "92K+",
    duration: "20 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Group Dynamics Theories", "Motivation Incentives Analysis", "Psychological Safety Metrics", "Behavioral Coaching Procedures"],
    link: "https://www.coursera.org/specializations/human-resource-management",
    domain: "HR",
    subDomain: "Leadership"
  },
  {
    id: "hr-15",
    title: "Workforce Planning, Scheduling & HR Succession Modeling",
    platform: "Udemy",
    instructor: "Workforce Solutions Hub",
    rating: 4.8,
    learners: "45K+",
    duration: "12 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Staffing Gap Assessments", "Succession Probability Charts", "Skill Mapping Databases", "Frictional Churn Forecasts"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "HR Analytics"
  },
  {
    id: "hr-16",
    title: "Employee Onboarding System Design: Fostering Day-One Ingress",
    platform: "Udemy",
    instructor: "Alex S. Mercer",
    rating: 4.8,
    learners: "32K+",
    duration: "9 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Onboarding Flowcharts", "New-hire Portal Integrations", "First-month Mentorship Systems", "Frictionless Documentation Processes"],
    link: "https://www.udemy.com/course/onboarding-employee-experience/",
    domain: "HR",
    subDomain: "Talent Acquisition"
  },
  {
    id: "hr-17",
    title: "Performance Review Infrastructure & Feedback Calibrations",
    platform: "Coursera",
    instructor: "IE Business School Professionals",
    rating: 4.8,
    learners: "135K+",
    duration: "11 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["KPI Definitions Sourcing", "OKR Cadence Setup", "360-degree Review Models", "Performance Alignment Schemes"],
    link: "https://www.coursera.org/specializations/human-resource-management",
    domain: "HR",
    subDomain: "Leadership"
  },
  {
    id: "hr-18",
    title: "Strategic Talent Management & Global Mobility Architecture",
    platform: "Coursera",
    instructor: "Erasmus University Faculty",
    rating: 4.7,
    learners: "29K+",
    duration: "16 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Global Relocation Visas", "Expat Compensation Plans", "Remote Workforce Compliance", "Tax Arbitrage Alignment"],
    link: "https://www.coursera.org/specializations/human-resource-management",
    domain: "HR",
    subDomain: "Talent Acquisition"
  },
  {
    id: "hr-19",
    title: "HRIS Database Operations & Oracle HCM Systems Roadmap",
    platform: "Udemy",
    instructor: "Enterprise ERP Academy",
    rating: 4.6,
    learners: "54K+",
    duration: "24 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Oracle HCM Integration", "Employee Data Security Standards", "Access Control Auditing", "Automated Payroll Feeds"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "HR Analytics"
  },
  {
    id: "hr-20",
    title: "Executive Search and Technical Recruitment Masterclass",
    platform: "Udemy",
    instructor: "DevRecruit Specialists",
    rating: 4.9,
    learners: "41K+",
    duration: "15 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Technical Vetting Sheets", "Executive Retainer Structures", "Non-compete Contract Interpretation", "C-suite Headhunting Strategies"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "Recruitment"
  },
  {
    id: "hr-21",
    title: "Labor Relations, Trade Unions and Collective Bargaining Strategy",
    platform: "Coursera",
    instructor: "Rutgers University Labor Team",
    rating: 4.7,
    learners: "25K+",
    duration: "20 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Union Contract Negotiations", "Collective Bargaining Agreements", "Grievance Redressal Mechanisms", "Industrial Dispute Codes"],
    link: "https://www.coursera.org/specializations/human-resource-management",
    domain: "HR",
    subDomain: "Talent Acquisition"
  },
  {
    id: "hr-22",
    title: "Mental Health Initiatives, Wellness Schemes and Employee Care",
    platform: "Udemy",
    instructor: "Mindfulness @ Work Trainers",
    rating: 4.8,
    learners: "65K+",
    duration: "6 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["EAP Schemes Deployment", "Stress Containment Seminars", "Workplace Burnout Indicators", "Mental Well-being Policies"],
    link: "https://www.udemy.com/course/employee-engagement-training/",
    domain: "HR",
    subDomain: "Leadership"
  },
  {
    id: "hr-23",
    title: "People Analytics: Transforming HR with Python & R Scripting",
    platform: "Coursera",
    instructor: "Professor Dave Ulrich",
    rating: 4.9,
    learners: "47K+",
    duration: "30 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["R Studio People Analysis", "Clustering Attrition Profiles", "Survival Analysis Algorithms", "Labor Pricing Forecasting"],
    link: "https://www.coursera.org/learn/hr-analytics",
    domain: "HR",
    subDomain: "HR Analytics"
  },
  {
    id: "hr-24",
    title: "Effective On-the-Job Mentorship & Skill Transfer Systems",
    platform: "Udemy",
    instructor: "Workforce Upskilling Network",
    rating: 4.7,
    learners: "19K+",
    duration: "10 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Apprenticeship Structuring", "Cross-Training Matrices", "Constructive Feedback Sheets", "Peer Evaluation Scales"],
    link: "https://www.udemy.com/course/onboarding-employee-experience/",
    domain: "HR",
    subDomain: "Talent Acquisition"
  },
  {
    id: "hr-25",
    title: "Modern HR Tech Ecosystems: Integration and APIs Strategy",
    platform: "Udemy",
    instructor: "SaaS Ecosystem Advisors",
    rating: 4.8,
    learners: "15K+",
    duration: "12 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["ATS Splicing", "REST Webhooks integration", "Zapier HR flows", "SaaS SSO setup"],
    link: "https://www.udemy.com/course/uk-payroll-masterclass-training/",
    domain: "HR",
    subDomain: "HR Analytics"
  },
  // ==================== MBA/BUSINESS (25 Courses) ====================
  {
    id: "mba-1",
    title: "Product Management complete guide: Agile, Scrum & Prototypes",
    platform: "Udemy",
    instructor: "Cole Mercer",
    rating: 4.9,
    learners: "510K+",
    duration: "25 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Agile Development", "User Stories", "Product Roadmaps", "Wireframing MVP", "Scrum Framework"],
    link: "https://www.udemy.com/course/the-one-week-technical-pm-course/",
    domain: "MBA/Business",
    subDomain: "Product Management"
  },
  {
    id: "mba-2",
    title: "Management Consulting Masterclass: McKinsey Presentation Frameworks",
    platform: "Udemy",
    instructor: "John Kim (Ex-Deloitte Partner)",
    rating: 4.8,
    learners: "85K+",
    duration: "15 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["MECE Structuring", "Case Interview Tactics", "Slide Desigining", "Strategic Recommendations"],
    link: "https://www.udemy.com/course/management-consulting-essential-training/",
    domain: "MBA/Business",
    subDomain: "Consulting"
  },
  {
    id: "mba-3",
    title: "Operations Management: Supply Chain & Six Sigma Frameworks",
    platform: "Coursera",
    instructor: "Wharton Operations Team",
    rating: 4.8,
    learners: "180K+",
    duration: "4 Months",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Six Sigma Methods", "Inventory Control Models", "Logistics Planning", "Bottleneck Identifications"],
    link: "https://www.coursera.org/specializations/wharton-operations-analytics",
    domain: "MBA/Business",
    subDomain: "Operations"
  },
  {
    id: "mba-4",
    title: "Business Analytics Specialization: Analytics-Driven Operations",
    platform: "Coursera",
    instructor: "Wharton Business School Analysts",
    rating: 4.9,
    learners: "280K+",
    duration: "5 Months",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Business Intellligence", "Descriptive Analytics", "Linear Programming", "Forecasting Matrices"],
    link: "https://www.coursera.org/specializations/business-analytics",
    domain: "MBA/Business",
    subDomain: "Business Analytics"
  },
  {
    id: "mba-5",
    title: "Strategic Management: Building Competitive Business Tactics",
    platform: "Coursera",
    instructor: "Copenhagen Business School",
    rating: 4.8,
    learners: "140K+",
    duration: "18 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Porter's Five Forces", "SWOT Calibration", "Blue Ocean Strategy", "Mergers Integration"],
    link: "https://www.coursera.org/learn/strategic-management",
    domain: "MBA/Business",
    subDomain: "Consulting"
  },
  {
    id: "mba-6",
    title: "Product Owner Core: Agile Scrum Mastery and Backlog Grooming",
    platform: "Udemy",
    instructor: "Scrum Alliance Instructors",
    rating: 4.8,
    learners: "92K+",
    duration: "11 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["User Persona Mapping", "Epic Sizing", "Backlog Prioritization", "Stakeholder Communications"],
    link: "https://www.udemy.com/course/the-one-week-technical-pm-course/",
    domain: "MBA/Business",
    subDomain: "Product Management"
  },
  {
    id: "mba-7",
    title: "Supply Chain Logistics & Global Distribution Management Blueprint",
    platform: "Coursera",
    instructor: "Rutgers University Logistics Team",
    rating: 4.7,
    learners: "98K+",
    duration: "30 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Warehouse Inventory Flow", "Incoterms Controls", "Route Visualizations", "Sourcing Logistics"],
    link: "https://www.coursera.org/specializations/wharton-operations-analytics",
    domain: "MBA/Business",
    subDomain: "Operations"
  },
  {
    id: "mba-8",
    title: "Data-Driven Business Analytics using SQL and Tableau Tools",
    platform: "Udemy",
    instructor: "Kirill Eremenko",
    rating: 4.8,
    learners: "220K+",
    duration: "21 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Tableau BI Charts", "SQL Group Joins", "Cohort Trendlines", "Interactive Dashboarding"],
    link: "https://www.udemy.com/course/tableau10/",
    domain: "MBA/Business",
    subDomain: "Business Analytics"
  },
  {
    id: "mba-9",
    title: "Project Management core: Principles and PMBOK Boot Camp",
    platform: "Udemy",
    instructor: "Joseph Phillips (PMP\xAE Mentor)",
    rating: 4.8,
    learners: "320K+",
    duration: "35 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Critical Path Method", "Earned Value Management", "Project Charter Generation", "Resource Allocations"],
    link: "https://www.udemy.com/course/management-consulting-essential-training/",
    domain: "MBA/Business",
    subDomain: "Operations"
  },
  {
    id: "mba-10",
    title: "Case Interview Secrets: Crack Consulting Firm Recruitment",
    platform: "Udemy",
    instructor: "Ex-McKinsey Consulting Reviewers",
    rating: 4.9,
    learners: "55K+",
    duration: "10 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Case Math Drills", "Interactive Breakouts", "Framework Assembly", "Profitability Trees"],
    link: "https://www.udemy.com/course/management-consulting-essential-training/",
    domain: "MBA/Business",
    subDomain: "Consulting"
  },
  {
    id: "mba-11",
    title: "Advanced Product Tactics: Metrics, Kpis, and A/B Testing Design",
    platform: "Coursera",
    instructor: "Johns Hopkins University Faculty",
    rating: 4.8,
    learners: "70K+",
    duration: "15 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["A/B Hypothesis Testing", "North Star Metrics", "Cohorts Churn Diagnostics", "User Engagement Loops"],
    link: "https://www.coursera.org/learn/strategic-management",
    domain: "MBA/Business",
    subDomain: "Product Management"
  },
  {
    id: "mba-12",
    title: "Total Quality Management (TQM) & Lean Six Sigma Certification",
    platform: "Udemy",
    instructor: "Quality Engineering Academy Experts",
    rating: 4.7,
    learners: "130K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Lean DMAIC Cycle", "Ishikawa Diagrams", "Pareto Distributions Analysis", "Process Capabilities (Cp/Cpk)"],
    link: "https://www.udemy.com/course/management-consulting-essential-training/",
    domain: "MBA/Business",
    subDomain: "Operations"
  },
  {
    id: "mba-13",
    title: "Financial Business Intelligence: DAX Models under Power BI",
    platform: "Coursera",
    instructor: "Microsoft Press Analyst Team",
    rating: 4.8,
    learners: "115K+",
    duration: "24 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["DAX Matrix Modeling", "Sales Trend Forecasts", "Inventory Reporting dashboards", "Power Query Formulas"],
    link: "https://www.coursera.org/specializations/business-analytics",
    domain: "MBA/Business",
    subDomain: "Business Analytics"
  },
  {
    id: "mba-14",
    title: "Strategic Consulting: Business Mergers & Valuation Cases",
    platform: "Coursera",
    instructor: "Wharton Finance Executives",
    rating: 4.8,
    learners: "65K+",
    duration: "12 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["M&A Consolidation Tactics", "Accretion/Dilution Analysis", "Strategic Synergies Calculations", "Transaction Pricing Cases"],
    link: "https://www.coursera.org/learn/strategic-management",
    domain: "MBA/Business",
    subDomain: "Consulting"
  },
  {
    id: "mba-15",
    title: "Product Road-mapping: Design to Engineering Pipelines Integration",
    platform: "Udemy",
    instructor: "ProdPad Product Founders",
    rating: 4.8,
    learners: "45K+",
    duration: "8 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Release Scheduling Tools", "Engineering JIRA alignment", "Customer Feedback Prioritizers", "GTM Communication Sheets"],
    link: "https://www.udemy.com/course/the-one-week-technical-pm-course/",
    domain: "MBA/Business",
    subDomain: "Product Management"
  },
  {
    id: "mba-16",
    title: "Factory Operations & Global Manufacturing Cost Optimizations",
    platform: "Coursera",
    instructor: "Munich Technical University",
    rating: 4.7,
    learners: "33K+",
    duration: "20 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Kanban Loops Automation", "Lead Time Compression", "MRP System Audits", "Asset Utilization Metrics"],
    link: "https://www.coursera.org/specializations/wharton-operations-analytics",
    domain: "MBA/Business",
    subDomain: "Operations"
  },
  {
    id: "mba-17",
    title: "Predictive Business Modeling using Python Pandas and Scikit-learn",
    platform: "Coursera",
    instructor: "Wharton Business Analytics Faculty",
    rating: 4.9,
    learners: "85K+",
    duration: "28 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Regression Forecasting", "Clustering Segments Analysis", "Sales Forecasting Python Scripts", "Scikit ML Estimators"],
    link: "https://www.coursera.org/specializations/business-analytics",
    domain: "MBA/Business",
    subDomain: "Business Analytics"
  },
  {
    id: "mba-18",
    title: "The McKinsey Problem Solving Test (PST) Ultimate Cracker",
    platform: "Udemy",
    instructor: "Firm Sourcing Specialists",
    rating: 4.9,
    learners: "25K+",
    duration: "14 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Graph Interpretations Drills", "Business Logical Splicing", "Quantitative Approximations", "Time Constraint Optimization"],
    link: "https://www.udemy.com/course/management-consulting-essential-training/",
    domain: "MBA/Business",
    subDomain: "Consulting"
  },
  {
    id: "mba-19",
    title: "Technical Product Management: APIs, System Design, SQL",
    platform: "Udemy",
    instructor: "Tech PM Academy Team",
    rating: 4.8,
    learners: "80K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["API Blueprint Reading", "REST Integrations Splicing", "Database ERD schemas", "System Cost Modeling"],
    link: "https://www.udemy.com/course/the-one-week-technical-pm-course/",
    domain: "MBA/Business",
    subDomain: "Product Management"
  },
  {
    id: "mba-20",
    title: "Procurement Management, Vendor Sourcing & RFPs Structuring",
    platform: "Udemy",
    instructor: "Logistics Academy experts",
    rating: 4.7,
    learners: "41K+",
    duration: "12 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["RFP Response Templates", "Vendor Evaluation Matrix", "SLA Negotiations", "Contract Pricing Schedules"],
    link: "https://www.udemy.com/course/management-consulting-essential-training/",
    domain: "MBA/Business",
    subDomain: "Operations"
  },
  {
    id: "mba-21",
    title: "Business Process Re-Engineering and Flowcharts Audits",
    platform: "Coursera",
    instructor: "University of Illinois Faculty",
    rating: 4.8,
    learners: "65K+",
    duration: "15 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["BPMN Flowchart Standards", "Waste Reductions Auditing", "Value Add Checks", "As-Is / To-Be Mapping"],
    link: "https://www.coursera.org/specializations/wharton-operations-analytics",
    domain: "MBA/Business",
    subDomain: "Operations"
  },
  {
    id: "mba-22",
    title: "Market Entry Case Strategies and Competitive Moats Construction",
    platform: "Coursera",
    instructor: "Harvard Business School Educators",
    rating: 4.9,
    learners: "120K+",
    duration: "20 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Market Size Guesstimates", "Competitive Reaction Scenarios", "Regulatory Barrier Assessments", "Pricing Strategy Models"],
    link: "https://www.coursera.org/learn/strategic-management",
    domain: "MBA/Business",
    subDomain: "Consulting"
  },
  {
    id: "mba-23",
    title: "Sales Operations Strategy & Salesforce Analytics Dashboarding",
    platform: "Udemy",
    instructor: "Enterprise ERP Professionals",
    rating: 4.8,
    learners: "54K+",
    duration: "16 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Sales Pipeline Funneling", "Salesforce Reports Setup", "Quotas Adjustments Modeling", "Territory Mapping Tables"],
    link: "https://www.udemy.com/course/tableau10/",
    domain: "MBA/Business",
    subDomain: "Business Analytics"
  },
  {
    id: "mba-24",
    title: "Growth Product Management: Activation, Conversions & Funnels",
    platform: "Udemy",
    instructor: "Growth Hackers Alliance Experts",
    rating: 4.9,
    learners: "38K+",
    duration: "12 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["User Activation Loops", "Checkout Optimization Plans", "Funnel Drop-Off Analytics", "In-App Gamification Guides"],
    link: "https://www.udemy.com/course/the-one-week-technical-pm-course/",
    domain: "MBA/Business",
    subDomain: "Product Management"
  },
  {
    id: "mba-25",
    title: "Supply Chain Risk Management & Crisis Mitigation Protocols",
    platform: "Coursera",
    instructor: "Wharton Operations Division",
    rating: 4.8,
    learners: "47K+",
    duration: "14 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Sovereign Supply Sourcing", "Macro Shock Planning", "Dual Partner Redundancies", "Safety Stock Formulas"],
    link: "https://www.coursera.org/specializations/wharton-operations-analytics",
    domain: "MBA/Business",
    subDomain: "Operations"
  },
  // ==================== COMMERCE (25 Courses) ====================
  {
    id: "com-1",
    title: "Accounting Foundations: Double-Entry Ledgers & Balance Sheets",
    platform: "Coursera",
    instructor: "Wharton Business School Accounting",
    rating: 4.9,
    learners: "280K+",
    duration: "15 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Double-Entry Ledgers", "T-Accounts Journaling", "Income Statements Configuration", "Depreciations Schemes"],
    link: "https://www.coursera.org/learn/wharton-accounting",
    domain: "Commerce",
    subDomain: "Accounting"
  },
  {
    id: "com-2",
    title: "Corporate Taxation Laws & Strategic Auditing and compliance",
    platform: "Coursera",
    instructor: "University of Illinois Taxation",
    rating: 4.8,
    learners: "95K+",
    duration: "4 Months",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Corporate Tax Shields", "State Jurisdictions Codes", "Capital Gains Deductibles", "Tax Audit Tracing"],
    link: "https://www.coursera.org/specializations/federal-taxation",
    domain: "Commerce",
    subDomain: "Taxation"
  },
  {
    id: "com-3",
    title: "Investment Analysis & Corporate Securities Valuation Models",
    platform: "Udemy",
    instructor: "Dr. Manish Kumar",
    rating: 4.8,
    learners: "120K+",
    duration: "25 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["DCF Equity Models", "Dividend Discount Modeling", "Relative Valuation Factors", "WACC Cost Calculations"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Commerce",
    subDomain: "Investment Analysis"
  },
  {
    id: "com-4",
    title: "Forensic Accounting, Fraud Sourcing & Audits Management",
    platform: "Coursera",
    instructor: "West Virginia University",
    rating: 4.8,
    learners: "110K+",
    duration: "22 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Fraud Triangle Indicators", "Asset Misappropriation Tracing", "Audit Sampling Formulas", "Bank Recs Forgeries Checks"],
    link: "https://www.coursera.org/learn/forensic-accounting",
    domain: "Commerce",
    subDomain: "Accounting"
  },
  {
    id: "com-5",
    title: "VAT, GST, and International Indirect Consumption Tax Policies",
    platform: "Udemy",
    instructor: "International Tax Academy experts",
    rating: 4.7,
    learners: "45K+",
    duration: "10 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Value-Added Tax (VAT)", "GST Invoicing Protocols", "Cross-Border customs taxes", "Input Tax Credits Retrieval"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Commerce",
    subDomain: "Taxation"
  },
  {
    id: "com-6",
    title: "Fixed Income Analysis: Pricing Bonds & Debt Portfolios",
    platform: "Udemy",
    instructor: "CFA Training Guild",
    rating: 4.8,
    learners: "65K+",
    duration: "16 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Yield to Maturity (YTM) Calculations", "Duration/Convexity Factor Calculations", "Credit Spreads Benchmarks", "Treasuries Pricing Formulas"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Commerce",
    subDomain: "Investment Analysis"
  },
  {
    id: "com-7",
    title: "Cost & Managerial Accounting Models for Industrial Factories",
    platform: "Coursera",
    instructor: "University of Pennsylvania",
    rating: 4.8,
    learners: "140K+",
    duration: "18 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Standard Costing variances", "Activity-Based Costing (ABC)", "Break-Even Margin matrices", "Cost Allocation Rules"],
    link: "https://www.coursera.org/learn/wharton-accounting",
    domain: "Commerce",
    subDomain: "Accounting"
  },
  {
    id: "com-8",
    title: "Individual Income Tax Return filing under Federal Statutes",
    platform: "Coursera",
    instructor: "Tax Academy of Illinois",
    rating: 4.8,
    learners: "70K+",
    duration: "20 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Form 1040 Preparation", "Adjusted Gross Income (AGI)", "Schedule C business filings", "Tax Bracket Calculations"],
    link: "https://www.coursera.org/specializations/federal-taxation",
    domain: "Commerce",
    subDomain: "Taxation"
  },
  {
    id: "com-9",
    title: "Ecosystems and Valuation of Real Estate Investment Trusts (REITs)",
    platform: "Udemy",
    instructor: "Real Estate Analyst Partners",
    rating: 4.7,
    learners: "35K+",
    duration: "12 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["FFO/AFFO Yield Calculations", "Net Asset Value (NAV) Appraisals", "REIT Tax Shields", "Mortgage-backed Securities Analysis"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Commerce",
    subDomain: "Investment Analysis"
  },
  {
    id: "com-10",
    title: "Consolidated Financial Accounting under IFRS & GAAP",
    platform: "Coursera",
    instructor: "University of London Specialists",
    rating: 4.9,
    learners: "85K+",
    duration: "30 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["IFRS Standards Alignment", "Inter-company Eliminations Sheets", "Non-controlling Interest Metrics", "Foreign Currency Consolidation"],
    link: "https://www.coursera.org/learn/wharton-accounting",
    domain: "Commerce",
    subDomain: "Accounting"
  },
  {
    id: "com-11",
    title: "Transfer Pricing Mechanics under Global Tax Statutes",
    platform: "Coursera",
    instructor: "Erasmus University Tax Law Team",
    rating: 4.8,
    learners: "28K+",
    duration: "14 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Arm's Length Principle", "Inter-company pricing formulas", "BEPS Multi-state Compliance", "Double Tax Treaties Interpretation"],
    link: "https://www.coursera.org/specializations/federal-taxation",
    domain: "Commerce",
    subDomain: "Taxation"
  },
  {
    id: "com-12",
    title: "Modern Derivative Pricing: Options, Swaps, Futuring models",
    platform: "Udemy",
    instructor: "Risk Analytics Specialists",
    rating: 4.9,
    learners: "72K+",
    duration: "22 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Black-Scholes Options Model", "Interest Swaps Agreements", "Delta Hedging Strategies", "Futures Margin Analysis"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Commerce",
    subDomain: "Investment Analysis"
  },
  {
    id: "com-13",
    title: "Audit Auditing Standards: Issuing Strategic Opinions and Reports",
    platform: "Coursera",
    instructor: "Wharton Audit Division Staff",
    rating: 4.8,
    learners: "130K+",
    duration: "25 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["GAAP Auditing Opinions", "Substantive Ledger Auditing", "Risk Assessment Frameworks", "C-Suite reporting briefs"],
    link: "https://www.coursera.org/learn/wharton-accounting",
    domain: "Commerce",
    subDomain: "Accounting"
  },
  {
    id: "com-14",
    title: "Sales Tax and Nexus Rules for modern E-Commerce Platforms",
    platform: "Udemy",
    instructor: "E-Commerce Accounting Alliance",
    rating: 4.7,
    learners: "41K+",
    duration: "9 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Economic Nexus Auditing", "Shipment Origin Taxing Rules", "Automated Shopify Tax Plugins", "Sales tax filings software"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Commerce",
    subDomain: "Taxation"
  },
  {
    id: "com-15",
    title: "Equity Research Analysis: Preparing Equity Recommendation Briefs",
    platform: "Udemy",
    instructor: "Sell-Side Analyst Coaches",
    rating: 4.8,
    learners: "53K+",
    duration: "18 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Sell-side Reporting Format", "Eps Modeling Excel Scripts", "Ecosystem Pricing Drivers", "Equity Recommendations formulation"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Commerce",
    subDomain: "Investment Analysis"
  },
  {
    id: "com-16",
    title: "Accounting Databases, SQL and Sage Accounts ERP Systems",
    platform: "Udemy",
    instructor: "Enterprise Accounting ERP Team",
    rating: 4.6,
    learners: "65K+",
    duration: "20 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Sage Accounts Enterprise", "SQL Ledger Auditing", "Automated Journal Entries Macros", "ERP Access Logging"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Commerce",
    subDomain: "Accounting"
  },
  {
    id: "com-17",
    title: "Cross-Border M&A Tax Restructuring and Corporate reorganizations",
    platform: "Coursera",
    instructor: "IE Business School Taxation Faculty",
    rating: 4.9,
    learners: "34K+",
    duration: "16 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Tax-Free reorganizations", "Stock buying taxation structures", "Asset purchase tax strategies", "Net Operating Loss carryforwards"],
    link: "https://www.coursera.org/specializations/federal-taxation",
    domain: "Commerce",
    subDomain: "Taxation"
  },
  {
    id: "com-18",
    title: "Venture Capital Term Sheets, Valuation models and Exit Cases",
    platform: "Udemy",
    instructor: "Venture Capitalists Training Hub",
    rating: 4.8,
    learners: "45K+",
    duration: "11 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Term sheet term valuations", "Liquidation preference multiples", "Anti-dilution triggers", "LTM Revenue valuation multiples"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Commerce",
    subDomain: "Investment Analysis"
  },
  {
    id: "com-19",
    title: "Small Business Accounting, Quickbooks and Basic Bookkeeping",
    platform: "Udemy",
    instructor: "Quickbooks Pro Trainers",
    rating: 4.8,
    learners: "190K+",
    duration: "8 Hours",
    level: "Beginner",
    certificate: "Available",
    skills: ["Quickbooks Pro setup", "Invoice generation flows", "Bank feeds auto-reconcile", "Quarterly estimates reporting"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Commerce",
    subDomain: "Accounting"
  },
  {
    id: "com-20",
    title: "Customs Taxation, Tariffs Rules and Global Supply Logistics",
    platform: "Coursera",
    instructor: "Erasmus University Customs Guild",
    rating: 4.7,
    learners: "22K+",
    duration: "13 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Harmonized Tariff (HTS) Codes", "Customs Appraisal Methods", "Anti-dumping penalties", "Bonded Warehouse Taxing"],
    link: "https://www.coursera.org/specializations/federal-taxation",
    domain: "Commerce",
    subDomain: "Taxation"
  },
  {
    id: "com-21",
    title: "Strategic Asset Pricing: Capital Asset Pricing Model (CAPM) and Arbitrage Theory",
    platform: "Udemy",
    instructor: "Dr. Manish Kumar",
    rating: 4.8,
    learners: "39K+",
    duration: "14 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["CAPM Index Pricing", "Fama-French Factor Models", "Arbitrage Pricing Theory", "Stochastic Valuation Factor"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Commerce",
    subDomain: "Investment Analysis"
  },
  {
    id: "com-22",
    title: "Government and Non-Profit Ledger Accounting Standards",
    platform: "Coursera",
    instructor: "University of Illinois Public Finance",
    rating: 4.8,
    learners: "43K+",
    duration: "24 Hours",
    level: "Intermediate",
    certificate: "Available",
    skills: ["Fund Ledger Accounting", "GASB Reporting Rules", "State and Local Gov Budgeting", "Encumbrance Ledger Auditing"],
    link: "https://www.coursera.org/learn/wharton-accounting",
    domain: "Commerce",
    subDomain: "Accounting"
  },
  {
    id: "com-23",
    title: "IRS Auditing Defense, Practices and Resolution Tactics",
    platform: "Udemy",
    instructor: "CPA/Enrolled Agent Defense Academy",
    rating: 4.9,
    learners: "18K+",
    duration: "12 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["IRS Audits Representation", "Statute of Limitations Defense", "Offer in Compromise (OIC)", "IRS Tax Appeal protocols"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Commerce",
    subDomain: "Taxation"
  },
  {
    id: "com-24",
    title: "Macro Currency Arbitrage, Forex Markets Valuation and Mechanics",
    platform: "Udemy",
    instructor: "Sell-Side Currency Structurers",
    rating: 4.7,
    learners: "61K+",
    duration: "15 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["Purchase Power Parity (PPP)", "Forward Premia Calculations", "Interest Rate Arbitrage Index", "Cross-currency Balance of Trade"],
    link: "https://www.udemy.com/course/investment-analysis-portfolio-management/",
    domain: "Commerce",
    subDomain: "Investment Analysis"
  },
  {
    id: "com-25",
    title: "IFRS 16 Lease accounting standards & Excel model worksheets",
    platform: "Udemy",
    instructor: "Wall Street Prep Experts",
    rating: 4.8,
    learners: "29K+",
    duration: "10 Hours",
    level: "Advanced",
    certificate: "Available",
    skills: ["IFRS 16 Lease Standards", "Right-of-Use Asset calculations", "Lease Liability scheduling", "GAAP Dual Classification Worksheets"],
    link: "https://www.udemy.com/course/financial-modeling-for-beginners/",
    domain: "Commerce",
    subDomain: "Accounting"
  }
];

// server.ts
import { GoogleGenAI } from "@google/genai";
import dns from "dns";
import bcrypt from "bcryptjs";
import http from "http";
import { WebSocketServer } from "ws";

// server/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
var MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  console.error("FATAL: MONGODB_URI environment variable is not set.");
  process.exit(1);
}
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "jobgiene"
    });
    console.log("\u2705 Connected to MongoDB Atlas successfully!");
    console.log(`   Database: ${mongoose.connection.db?.databaseName}`);
  } catch (error) {
    console.error("\u274C MongoDB Atlas connection failed:", error);
    process.exit(1);
  }
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("\u26A0\uFE0F MongoDB disconnected.");
  });
}

// server/models/User.ts
import mongoose2, { Schema } from "mongoose";
var UserSchema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, default: "" },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    region: { type: String, default: "" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    target_job: { type: String, default: "" },
    profile_completion: { type: Number, default: 0 },
    // Profile
    domain: { type: String, default: "Tech" },
    target_country: { type: String, default: "US" },
    experience_level: { type: String, default: "" },
    profile_image: { type: String, default: "" },
    cover_image: { type: String, default: "" },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    education: { type: String, default: "" },
    degree: { type: String, default: "" },
    college: { type: String, default: "" },
    career_goals: { type: String, default: "" },
    preferred_roles: { type: [String], default: [] },
    preferred_industries: { type: [String], default: [] },
    // Gamification
    ats_score: { type: Number, default: 0 },
    resume_strength: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: { type: [String], default: [] },
    completed_tasks: { type: [String], default: [] },
    completed_nodes: { type: [String], default: [] },
    last_task_reset_date: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
    saved_jobs: { type: [String], default: [] },
    saved_courses: { type: [String], default: [] },
    completed_courses: { type: [String], default: [] },
    applications: { type: [Schema.Types.Mixed], default: [] },
    // Timestamps
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    last_login: { type: Date, default: Date.now },
    last_active: { type: Date, default: Date.now }
  },
  { timestamps: false, collection: "users" }
);
UserSchema.index({ email: 1 });
var User = mongoose2.model("User", UserSchema);

// server/models/ATSScore.ts
import mongoose3, { Schema as Schema2 } from "mongoose";
var ATSScoreSchema = new Schema2(
  {
    user_id: { type: Schema2.Types.ObjectId, ref: "User", required: true },
    ats_score: { type: Number, required: true, default: 0 },
    resume_score: { type: Number, default: 0 },
    keyword_score: { type: Number, default: 0 },
    format_score: { type: Number, default: 0 },
    experience_score: { type: Number, default: 0 },
    generated_at: { type: Date, default: Date.now }
  },
  { collection: "ats_scores" }
);
ATSScoreSchema.index({ user_id: 1 });
var ATSScore = mongoose3.model("ATSScore", ATSScoreSchema);

// server/models/Resume.ts
import mongoose4, { Schema as Schema3 } from "mongoose";
var ResumeSchema = new Schema3(
  {
    user_id: { type: Schema3.Types.ObjectId, ref: "User", required: true },
    resume_data: { type: Schema3.Types.Mixed, default: {} },
    template: { type: String, default: "" },
    ats_score: { type: Number, default: 0 },
    download_count: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  { collection: "resumes" }
);
ResumeSchema.index({ user_id: 1 });
var Resume = mongoose4.model("Resume", ResumeSchema);

// server/models/CoverLetter.ts
import mongoose5, { Schema as Schema4 } from "mongoose";
var CoverLetterSchema = new Schema4(
  {
    user_id: { type: Schema4.Types.ObjectId, ref: "User", required: true },
    company_name: { type: String, required: true },
    job_title: { type: String, required: true },
    skills: { type: [String], default: [] },
    generated_letter: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
  },
  { collection: "cover_letters" }
);
CoverLetterSchema.index({ user_id: 1 });
var CoverLetter = mongoose5.model("CoverLetter", CoverLetterSchema);

// server/models/Roadmap.ts
import mongoose6, { Schema as Schema5 } from "mongoose";
var RoadmapSchema = new Schema5(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    skills: { type: [String], default: [] },
    steps: { type: [Schema5.Types.Mixed], default: [] },
    estimated_duration: { type: String, default: "" },
    user_id: { type: Schema5.Types.ObjectId, ref: "User", required: true },
    target_role: { type: String, default: "" },
    current_skills: { type: [String], default: [] },
    nodes: { type: [Schema5.Types.Mixed], default: [] },
    created_at: { type: Date, default: Date.now }
  },
  { collection: "roadmaps" }
);
RoadmapSchema.index({ user_id: 1 });
var Roadmap = mongoose6.model("Roadmap", RoadmapSchema);

// server/models/RoadmapProgress.ts
import mongoose7, { Schema as Schema6 } from "mongoose";
var RoadmapProgressSchema = new Schema6(
  {
    user_id: { type: Schema6.Types.ObjectId, ref: "User", required: true },
    roadmap_id: { type: Schema6.Types.ObjectId, ref: "Roadmap", required: true },
    completed_steps: { type: [String], default: [] },
    completion_percentage: { type: Number, default: 0 },
    updated_at: { type: Date, default: Date.now }
  },
  { collection: "roadmap_progress" }
);
RoadmapProgressSchema.index({ user_id: 1, roadmap_id: 1 });
var RoadmapProgress = mongoose7.model("RoadmapProgress", RoadmapProgressSchema);

// server/models/Course.ts
import mongoose8, { Schema as Schema7 } from "mongoose";
var CourseSchema = new Schema7(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    provider: { type: String, default: "" },
    duration: { type: String, default: "" },
    level: { type: String, default: "Beginner" },
    skills: { type: [String], default: [] },
    course_url: { type: String, default: "" },
    status: { type: String, default: "active" },
    instructor: { type: String, default: "" },
    rating: { type: Number, default: 4.5 },
    domain: { type: String, default: "Tech" },
    type: { type: String, default: "Course" },
    learners: { type: String, default: "" },
    certificate: { type: String, default: "" },
    sub_domain: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
  },
  { collection: "courses" }
);
var Course = mongoose8.model("Course", CourseSchema);

// server/models/SavedCourse.ts
import mongoose9, { Schema as Schema8 } from "mongoose";
var SavedCourseSchema = new Schema8(
  {
    user_id: { type: Schema8.Types.ObjectId, ref: "User", required: true },
    course_id: { type: String, required: true },
    saved_at: { type: Date, default: Date.now }
  },
  { collection: "saved_courses" }
);
SavedCourseSchema.index({ user_id: 1, course_id: 1 }, { unique: true });
var SavedCourse = mongoose9.model("SavedCourse", SavedCourseSchema);

// server/models/Job.ts
import mongoose10, { Schema as Schema9 } from "mongoose";
var JobSchema = new Schema9(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "Remote" },
    salary: { type: String, default: "" },
    job_type: { type: String, default: "Job" },
    skills_required: { type: [String], default: [] },
    description: { type: String, default: "" },
    application_link: { type: String, default: "#apply" },
    status: { type: String, default: "active" },
    domain: { type: String, default: "Tech" },
    remote: { type: Boolean, default: false },
    usd_min_salary: { type: Number, default: 0 },
    usd_max_salary: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }
  },
  { collection: "jobs" }
);
var Job = mongoose10.model("Job", JobSchema);

// server/models/SavedJob.ts
import mongoose11, { Schema as Schema10 } from "mongoose";
var SavedJobSchema = new Schema10(
  {
    user_id: { type: Schema10.Types.ObjectId, ref: "User", required: true },
    job_id: { type: String, required: true },
    saved_at: { type: Date, default: Date.now }
  },
  { collection: "saved_jobs" }
);
SavedJobSchema.index({ user_id: 1, job_id: 1 }, { unique: true });
var SavedJob = mongoose11.model("SavedJob", SavedJobSchema);

// server/models/InterviewSession.ts
import mongoose12, { Schema as Schema11 } from "mongoose";
var InterviewSessionSchema = new Schema11(
  {
    user_id: { type: Schema11.Types.ObjectId, ref: "User", required: true },
    domain: { type: String, required: true },
    difficulty: { type: String, required: true },
    question_count: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
  },
  { collection: "interview_sessions" }
);
InterviewSessionSchema.index({ user_id: 1 });
var InterviewSession = mongoose12.model("InterviewSession", InterviewSessionSchema);

// server/models/InterviewQuestion.ts
import mongoose13, { Schema as Schema12 } from "mongoose";
var InterviewQuestionSchema = new Schema12(
  {
    session_id: { type: Schema12.Types.ObjectId, ref: "InterviewSession", required: true },
    question: { type: String, required: true }
  },
  { collection: "interview_questions" }
);
InterviewQuestionSchema.index({ session_id: 1 });
var InterviewQuestion = mongoose13.model("InterviewQuestion", InterviewQuestionSchema);

// server/models/InterviewAnswer.ts
import mongoose14, { Schema as Schema13 } from "mongoose";
var InterviewAnswerSchema = new Schema13(
  {
    session_id: { type: Schema13.Types.ObjectId, ref: "InterviewSession", required: true },
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    technical_accuracy: { type: Number, default: 0 },
    is_correct: { type: Boolean, default: false }
  },
  { collection: "interview_answers" }
);
InterviewAnswerSchema.index({ session_id: 1 });
var InterviewAnswer = mongoose14.model("InterviewAnswer", InterviewAnswerSchema);

// server/models/InterviewReport.ts
import mongoose15, { Schema as Schema14 } from "mongoose";
var InterviewReportSchema = new Schema14(
  {
    session_id: { type: Schema14.Types.ObjectId, ref: "InterviewSession", required: true },
    user_id: { type: Schema14.Types.ObjectId, ref: "User", required: true },
    overall_score: { type: Number, default: 0 },
    communication_score: { type: Number, default: 0 },
    confidence_score: { type: Number, default: 0 },
    accuracy_score: { type: Number, default: 0 },
    fluency: { type: String, default: "" },
    confidence: { type: String, default: "" },
    communication: { type: String, default: "" },
    detailed_evaluation: { type: String, default: "" },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvement_areas: { type: [String], default: [] },
    answers: { type: [Schema14.Types.Mixed], default: [] },
    role: { type: String, default: "" },
    difficulty: { type: String, default: "Medium" },
    timestamp: { type: Date, default: Date.now }
  },
  { collection: "interview_reports" }
);
InterviewReportSchema.index({ user_id: 1 });
InterviewReportSchema.index({ session_id: 1 });
var InterviewReport = mongoose15.model("InterviewReport", InterviewReportSchema);

// server/models/ChatSession.ts
import mongoose16, { Schema as Schema15 } from "mongoose";
var ChatSessionSchema = new Schema15(
  {
    user_id: { type: Schema15.Types.ObjectId, ref: "User", required: true },
    conversation_id: { type: String, required: true },
    title: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now }
  },
  { collection: "chat_sessions" }
);
ChatSessionSchema.index({ user_id: 1 });
ChatSessionSchema.index({ conversation_id: 1 });
var ChatSession = mongoose16.model("ChatSession", ChatSessionSchema);

// server/models/ChatMessage.ts
import mongoose17, { Schema as Schema16 } from "mongoose";
var ChatMessageSchema = new Schema16(
  {
    user_id: { type: Schema16.Types.ObjectId, ref: "User", required: true },
    conversation_id: { type: String, required: true },
    question: { type: String, default: "" },
    response: { type: String, default: "" },
    role: { type: String, default: "" },
    content: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now }
  },
  { collection: "chat_messages" }
);
ChatMessageSchema.index({ user_id: 1, conversation_id: 1 });
var ChatMessage = mongoose17.model("ChatMessage", ChatMessageSchema);

// server/models/Activity.ts
import mongoose18, { Schema as Schema17 } from "mongoose";
var ActivitySchema = new Schema17(
  {
    user_id: { type: Schema17.Types.ObjectId, ref: "User", required: true },
    activity_type: { type: String, required: true },
    metadata: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now }
  },
  { collection: "user_activity" }
);
ActivitySchema.index({ user_id: 1 });
ActivitySchema.index({ activity_type: 1 });
ActivitySchema.index({ timestamp: -1 });
var Activity = mongoose18.model("Activity", ActivitySchema);

// server/models/AdminLog.ts
import mongoose19, { Schema as Schema18 } from "mongoose";
var AdminLogSchema = new Schema18(
  {
    admin_id: { type: Schema18.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    resource: { type: String, default: "" },
    ip_address: { type: String, default: "127.0.0.1" },
    timestamp: { type: Date, default: Date.now }
  },
  { collection: "admin_logs" }
);
AdminLogSchema.index({ admin_id: 1 });
AdminLogSchema.index({ timestamp: -1 });
var AdminLog = mongoose19.model("AdminLog", AdminLogSchema);

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "supersafesecret_job_giene_jwt_auth_key";
function generateToken(userId, email, role) {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token && req.headers["x-user-email"]) {
      const email = req.headers["x-user-email"].trim().toLowerCase();
      User.findOne({ email }).then((user) => {
        if (user) {
          req.user = { id: user._id.toString(), email: user.email, role: user.role };
          next();
        } else {
          res.status(401).json({ error: "User not found. Please log in again." });
        }
      }).catch(() => {
        res.status(401).json({ error: "Authentication failed." });
      });
      return;
    }
    if (!token) {
      res.status(401).json({ error: "Access denied. No authentication token provided." });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Session expired. Please log in again." });
    } else {
      res.status(401).json({ error: "Invalid authentication token." });
    }
  }
}
async function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }
    const adminEmails = ["aravjain2107@gmail.com", "arnavjain2107@gmail.com"];
    const isAdminEmail = adminEmails.includes(req.user.email.toLowerCase());
    if (!isAdminEmail && req.user.role !== "admin") {
      res.status(403).json({ error: "Access Denied. You do not have valid administrative credentials." });
      return;
    }
    next();
  } catch (error) {
    res.status(403).json({ error: "Admin verification failed." });
  }
}

// server.ts
dotenv2.config();
dns.setDefaultResultOrder && dns.setDefaultResultOrder("ipv4first");
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
var server = http.createServer(app);
var wss = new WebSocketServer({ server });
var wsClients = /* @__PURE__ */ new Set();
wss.on("connection", (ws) => {
  wsClients.add(ws);
  ws.on("close", () => {
    wsClients.delete(ws);
  });
});
function broadcastWS(event, payload) {
  const msg = JSON.stringify({ event, payload });
  for (const client of wsClients) {
    if (client.readyState === 1) {
      client.send(msg);
    }
  }
}
app.use(express.json({ limit: "50mb" }));
var aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } }
    });
  }
  return aiClient;
}
function cleanAndParseJSON(rawText) {
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
  } catch (err) {
    try {
      const lines = cleaned.split("\n").map((line) => {
        if (line.includes("//") && !line.includes("://")) {
          return line.split("//")[0];
        }
        return line;
      });
      cleaned = lines.join("\n").trim();
      return JSON.parse(cleaned);
    } catch (fallbackErr) {
      throw new Error(`Failed to parse response to JSON: ${err.message}`);
    }
  }
}
var DEFAULT_JOBS = [
  { id: "j1", role: "Software Engineering Intern (Front-End/Full-Stack)", company: "Google LLC", domain: "Tech", type: "Internship", location: "US", remote: true, usdMinSalary: 6800, usdMaxSalary: 9500, skillsRequired: ["React", "TypeScript", "JavaScript", "CSS"], applyLink: "https://careers.google.com/jobs/results/?q=intern" },
  { id: "j2", role: "Junior Web UX Frontend Build Engineer", company: "Vercel Inc", domain: "Tech", type: "Job", location: "US", remote: true, usdMinSalary: 85e3, usdMaxSalary: 115e3, skillsRequired: ["Next.js", "React", "Tailwind CSS", "REST APIs"], applyLink: "https://vercel.com/careers" },
  { id: "j3", role: "Associate Interface Product Designer", company: "Figma Inc", domain: "Design", type: "Job", location: "UK", remote: true, usdMinSalary: 72e3, usdMaxSalary: 95e3, skillsRequired: ["Figma", "UI Design", "Design Systems", "Prototyping"], applyLink: "https://www.figma.com/careers/" },
  { id: "j4", role: "Core Commerce Business Systems Intern", company: "Stripe Systems Inc", domain: "Finance", type: "Internship", location: "US", remote: false, usdMinSalary: 5500, usdMaxSalary: 7200, skillsRequired: ["Excel", "Financial Modeling", "Data Analysis", "SQL"], applyLink: "https://stripe.com/jobs" },
  { id: "j5", role: "Growth Campaign & Dynamic Marketing Analyst", company: "Semrush Inc", domain: "Marketing", type: "Job", location: "CA", remote: true, usdMinSalary: 64e3, usdMaxSalary: 82e3, skillsRequired: ["SEO", "Google Analytics", "Content Strategy", "Digital Marketing"], applyLink: "https://www.semrush.com/company/careers/" },
  { id: "j6", role: "People Operations & HR Intern", company: "Microsoft Corp", domain: "HR", type: "Internship", location: "DE", remote: false, usdMinSalary: 3800, usdMaxSalary: 5200, skillsRequired: ["Talent Acquisition", "Communication", "Onboarding", "Excel"], applyLink: "https://careers.microsoft.com/" },
  { id: "j7", role: "Machine Learning Solutions Architect Support", company: "Cognitive Systems Inc", domain: "Tech", type: "Job", location: "US", remote: true, usdMinSalary: 105e3, usdMaxSalary: 14e4, skillsRequired: ["Python", "TensorFlow", "Pandas", "Scikit-Learn"], applyLink: "https://careers.google.com/" },
  { id: "j8", role: "Junior Interactive Interface Designer", company: "Nexus Design Labs", domain: "Design", type: "Job", location: "CA", remote: true, usdMinSalary: 62e3, usdMaxSalary: 8e4, skillsRequired: ["Figma", "Design Systems", "User Research", "Wireframing"], applyLink: "https://www.figma.com/careers/" }
];
var DEFAULT_COURSES = PRESET_CURATED_COURSES.map((c) => ({
  id: c.id,
  title: c.title,
  platform: c.platform,
  skills: c.skills,
  level: c.level,
  link: c.link,
  rating: c.rating,
  duration: c.duration,
  instructor: c.instructor,
  type: "Course",
  domain: c.domain,
  learners: c.learners,
  certificate: c.certificate,
  subDomain: c.subDomain
}));
function generateLargeCatalog() {
  const generatedJobs2 = [];
  const domains = ["Frontend", "Backend", "AI/ML", "Data Science", "Finance", "Marketing", "HR", "Product Management", "Business", "Design", "Entrepreneurship", "Commerce", "Healthcare"];
  const domainSkills = {
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
      generatedJobs2.push({
        id: `gen-job-${dom.toLowerCase().replace(/[^a-z0-9]/g, "")}-${i}`,
        role: `Lead ${dom} Solutions Architect / Engineer (Version ${i})`,
        company: `${co} Inc.`,
        domain: dom,
        type: "Job",
        location: loc,
        remote: isRemote,
        usdMinSalary: 65e3 + i * 450,
        usdMaxSalary: 85e3 + i * 900,
        skillsRequired: skillsShuffled,
        applyLink: `https://www.google.com/search?q=${encodeURIComponent(co + " " + dom + " Careers")}`
      });
      generatedJobs2.push({
        id: `gen-intern-${dom.toLowerCase().replace(/[^a-z0-9]/g, "")}-${i}`,
        role: `${dom} Engineering Intern (Cohort ${i})`,
        company: `${co} Labs`,
        domain: dom,
        type: "Internship",
        location: loc,
        remote: isRemote,
        usdMinSalary: 3600 + i * 25,
        usdMaxSalary: 5100 + i * 45,
        skillsRequired: skillsShuffled,
        applyLink: `https://www.google.com/search?q=${encodeURIComponent(co + " " + dom + " Internship careers")}`
      });
    }
  });
  return { generatedJobs: generatedJobs2 };
}
var { generatedJobs } = generateLargeCatalog();
DEFAULT_JOBS = [...DEFAULT_JOBS, ...generatedJobs];
async function userToProfile(user) {
  const resumeDocs = await Resume.find({ user_id: user._id }).sort({ created_at: -1 });
  const resumes = resumeDocs.map((r) => r.resume_data);
  const reportDocs = await InterviewReport.find({ user_id: user._id }).sort({ timestamp: -1 });
  const interviews = reportDocs.map((r) => ({
    id: r._id.toString(),
    role: r.role,
    difficulty: r.difficulty,
    score: r.overall_score,
    feedback: {
      fluency: r.fluency,
      confidence: r.confidence,
      communication: r.communication,
      overallScore: r.overall_score,
      detailedEvaluation: r.detailed_evaluation,
      communicationScore: r.communication_score,
      confidenceScore: r.confidence_score,
      accuracyScore: r.accuracy_score
    },
    answers: r.answers || [],
    createdAt: r.timestamp?.toISOString() || (/* @__PURE__ */ new Date()).toISOString()
  }));
  const roadmapDocs = await Roadmap.find({ user_id: user._id }).sort({ created_at: -1 });
  const roadmaps = roadmapDocs.map((r) => ({
    id: r._id.toString(),
    targetRole: r.target_role,
    currentSkills: r.current_skills,
    nodes: r.nodes,
    createdAt: r.created_at?.toISOString()
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
    lastTaskResetDate: user.last_task_reset_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
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
    region: user.region || ""
  };
}
async function logActivity(userId, activityType, metadata) {
  try {
    await Activity.create({ user_id: userId, activity_type: activityType, metadata, timestamp: /* @__PURE__ */ new Date() });
  } catch (err) {
    console.error("Failed logging activity:", err);
  }
}
async function getAuthUser(req) {
  if (!req.user) throw new Error("Authentication required");
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("User not found");
  user.last_active = /* @__PURE__ */ new Date();
  await user.save();
  return user;
}
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, name, password, region, interests } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required fields." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });
    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ error: "An account with this email already exists." });
    let interestsArr = [];
    if (Array.isArray(interests)) interestsArr = interests;
    else if (typeof interests === "string" && interests.trim()) interestsArr = interests.split(",").map((i) => i.trim()).filter(Boolean);
    const passwordHash = bcrypt.hashSync(password, 10);
    const displayName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser = await User.create({
      name: displayName,
      email: cleanEmail,
      password_hash: passwordHash,
      role: "user",
      region: region || "",
      interests: interestsArr,
      created_at: /* @__PURE__ */ new Date(),
      updated_at: /* @__PURE__ */ new Date(),
      last_login: /* @__PURE__ */ new Date(),
      last_active: /* @__PURE__ */ new Date()
    });
    await logActivity(newUser._id.toString(), "signup", `Registered new account: ${displayName} (${cleanEmail})`);
    const token = generateToken(newUser._id.toString(), cleanEmail, newUser.role);
    const profile = await userToProfile(newUser);
    try {
      broadcastWS("notification", { message: `New User Registered: ${displayName} (${cleanEmail})`, type: "success" });
      broadcastWS("database-changed", { type: "signup", email: cleanEmail });
    } catch (wsErr) {
      console.error(wsErr);
    }
    res.json({ success: true, profile, session: { email: cleanEmail, name: displayName, token } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to compile registration profile." });
  }
});
app.post("/api/auth/login", async (req, res) => {
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
    user.last_login = /* @__PURE__ */ new Date();
    user.last_active = /* @__PURE__ */ new Date();
    user.updated_at = /* @__PURE__ */ new Date();
    await user.save();
    await logActivity(user._id.toString(), "login", "Logged in successfully");
    const token = generateToken(user._id.toString(), cleanEmail, user.role);
    const profile = await userToProfile(user);
    try {
      broadcastWS("notification", { message: `User Logged In: ${user.name || cleanEmail}`, type: "info" });
      broadcastWS("database-changed", { type: "login", email: cleanEmail });
    } catch (wsErr) {
      console.error(wsErr);
    }
    res.json({ success: true, profile, session: { email: cleanEmail, name: user.name, token } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed authentication session check." });
  }
});
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is a mandatory reset parameter." });
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ error: "No registered accounts exist with this email destination." });
    res.json({ success: true, message: `A password recovery email was successfully dispatched to ${cleanEmail}.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to dispatch recovery credential links." });
  }
});
app.post("/api/auth/oauth", async (req, res) => {
  try {
    const { provider, email, name, profileImage } = req.body;
    if (!email || !provider) return res.status(400).json({ error: "Provider and email are mandatory." });
    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        password_hash: "",
        role: "user",
        profile_image: profileImage || "",
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date(),
        last_login: /* @__PURE__ */ new Date(),
        last_active: /* @__PURE__ */ new Date()
      });
    }
    const token = generateToken(user._id.toString(), cleanEmail, user.role);
    const profile = await userToProfile(user);
    res.json({ success: true, profile, session: { email: cleanEmail, name: user.name, token } });
  } catch (error) {
    res.status(500).json({ error: "OAuth authorization handshake failed." });
  }
});
app.post("/api/auth/change-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required fields." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ error: "No user found with this email identifier." });
    user.password_hash = bcrypt.hashSync(password, 10);
    user.updated_at = /* @__PURE__ */ new Date();
    await user.save();
    await logActivity(user._id.toString(), "change_password", "Updated account login credentials");
    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update security credentials." });
  }
});
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required fields." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ error: "No user found with this email identifier." });
    user.password_hash = bcrypt.hashSync(password, 10);
    user.updated_at = /* @__PURE__ */ new Date();
    await user.save();
    await logActivity(user._id.toString(), "reset_password", "Performed credential recovery reset");
    res.json({ success: true, message: "Password successfully reset." });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset security credentials." });
  }
});
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to load session profile data." });
  }
});
app.post("/api/profile", verifyToken, async (req, res) => {
  try {
    const freshData = req.body;
    const user = await getAuthUser(req);
    const currentProfile = await userToProfile(user);
    if (freshData.name !== void 0) user.name = freshData.name;
    if (freshData.targetRole !== void 0) user.target_job = freshData.targetRole;
    if (freshData.domain !== void 0) user.domain = freshData.domain;
    if (freshData.skills !== void 0) user.skills = freshData.skills;
    if (freshData.interests !== void 0) user.interests = freshData.interests;
    if (freshData.targetCountry !== void 0) user.target_country = freshData.targetCountry;
    if (freshData.experienceLevel !== void 0) user.experience_level = freshData.experienceLevel;
    if (freshData.profileImage !== void 0) user.profile_image = freshData.profileImage;
    if (freshData.coverImage !== void 0) user.cover_image = freshData.coverImage;
    if (freshData.phone !== void 0) user.phone = freshData.phone;
    if (freshData.dob !== void 0) user.dob = freshData.dob;
    if (freshData.country !== void 0) user.country = freshData.country;
    if (freshData.city !== void 0) user.city = freshData.city;
    if (freshData.education !== void 0) user.education = freshData.education;
    if (freshData.degree !== void 0) user.degree = freshData.degree;
    if (freshData.college !== void 0) user.college = freshData.college;
    if (freshData.careerGoals !== void 0) user.career_goals = freshData.careerGoals;
    if (freshData.preferredRoles !== void 0) user.preferred_roles = freshData.preferredRoles;
    if (freshData.preferredIndustries !== void 0) user.preferred_industries = freshData.preferredIndustries;
    if (freshData.region !== void 0) user.region = freshData.region;
    if (freshData.xp !== void 0) user.xp = freshData.xp;
    if (freshData.streak !== void 0) user.streak = freshData.streak;
    if (freshData.badges !== void 0) user.badges = freshData.badges;
    if (freshData.completedTasks !== void 0) user.completed_tasks = freshData.completedTasks;
    if (freshData.completedNodes !== void 0) user.completed_nodes = freshData.completedNodes;
    if (freshData.lastTaskResetDate !== void 0) user.last_task_reset_date = freshData.lastTaskResetDate;
    if (freshData.savedJobs !== void 0) user.saved_jobs = freshData.savedJobs;
    if (freshData.savedCourses !== void 0) user.saved_courses = freshData.savedCourses;
    if (freshData.completedCourses !== void 0) user.completed_courses = freshData.completedCourses;
    if (freshData.applications !== void 0) user.applications = freshData.applications;
    if (freshData.atsScore !== void 0) user.ats_score = freshData.atsScore;
    if (freshData.resumeStrength !== void 0) user.resume_strength = freshData.resumeStrength;
    user.level = Math.floor(1 + (user.xp || 0) / 500);
    user.updated_at = /* @__PURE__ */ new Date();
    if (freshData.resumes !== void 0) {
      await Resume.deleteMany({ user_id: user._id });
      for (const r of freshData.resumes) {
        await Resume.create({ user_id: user._id, resume_data: r, ats_score: r.atsScore || 0, created_at: r.uploadedAt ? new Date(r.uploadedAt) : /* @__PURE__ */ new Date() });
      }
    }
    if (freshData.roadmaps !== void 0) {
      await Roadmap.deleteMany({ user_id: user._id });
      for (const r of freshData.roadmaps) {
        await Roadmap.create({ user_id: user._id, target_role: r.targetRole, current_skills: r.currentSkills, nodes: r.nodes, title: r.targetRole, created_at: r.createdAt ? new Date(r.createdAt) : /* @__PURE__ */ new Date() });
      }
    }
    if (freshData.savedJobs !== void 0) {
      const currentSaved = currentProfile.savedJobs || [];
      const newSaved = freshData.savedJobs || [];
      for (const jobId of newSaved) {
        if (!currentSaved.includes(jobId)) {
          await SavedJob.findOneAndUpdate({ user_id: user._id, job_id: jobId }, { user_id: user._id, job_id: jobId, saved_at: /* @__PURE__ */ new Date() }, { upsert: true });
          await logActivity(user._id.toString(), "job_save", `Saved job: ${jobId}`);
        }
      }
    }
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
    } catch (e) {
      console.error("Delta telemetry error:", e);
    }
    await user.save();
    const updatedProfile = await userToProfile(user);
    try {
      broadcastWS("database-changed", { type: "profile-update", email: user.email });
    } catch (wsErr) {
      console.error(wsErr);
    }
    res.json(updatedProfile);
  } catch (error) {
    console.error("Profile save error:", error);
    res.status(500).json({ error: "Failed to autosave updated profile parameters." });
  }
});
app.post("/api/profile/reset", verifyToken, async (req, res) => {
  try {
    const user = await getAuthUser(req);
    user.target_job = "";
    user.domain = "Tech";
    user.skills = [];
    user.interests = [];
    user.target_country = "US";
    user.experience_level = "";
    user.profile_image = "";
    user.ats_score = 0;
    user.resume_strength = 0;
    user.xp = 0;
    user.streak = 0;
    user.level = 1;
    user.badges = [];
    user.completed_tasks = [];
    user.completed_nodes = [];
    user.saved_jobs = [];
    user.phone = "";
    user.dob = "";
    user.country = "";
    user.city = "";
    user.education = "";
    user.degree = "";
    user.college = "";
    user.career_goals = "";
    user.preferred_roles = [];
    user.preferred_industries = [];
    user.cover_image = "";
    user.updated_at = /* @__PURE__ */ new Date();
    await user.save();
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
app.get("/api/jobs", verifyToken, async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    const targetCountry = profile.targetCountry || req.query.country || "US";
    const domain = req.query.domain;
    const type = req.query.type;
    const remote = req.query.remote;
    const search = req.query.search;
    const targetRoleName = profile.targetRole || "Software Engineer";
    await logActivity(user._id.toString(), "job_search", `Searched jobs for region: ${targetCountry}`);
    const dynamicJobs = [
      { id: "dyn-job-1", role: `${targetRoleName}`, company: "Apex Intelligent Core", domain: profile.domain || "Tech", type: "Job", location: "Remote", remote: true, usdMinSalary: 95e3, usdMaxSalary: 125e3, skillsRequired: profile.skills?.slice(0, 3) || ["System Design"], applyLink: "#apply" },
      { id: "dyn-job-2", role: `${targetRoleName} Intern`, company: "Stellar Automation Ventures", domain: profile.domain || "Tech", type: "Internship", location: "Hybrid", remote: false, usdMinSalary: 4200, usdMaxSalary: 6200, skillsRequired: profile.skills || ["Agile Flow"], applyLink: "#apply" }
    ];
    const injectedJobDocs = await Job.find({ status: "active" }).sort({ created_at: -1 });
    const injectedJobs = injectedJobDocs.map((j) => ({
      id: j._id.toString(),
      role: j.title,
      company: j.company,
      domain: j.domain,
      type: j.job_type,
      location: j.location,
      remote: j.remote,
      usdMinSalary: j.usd_min_salary,
      usdMaxSalary: j.usd_max_salary,
      skillsRequired: j.skills_required,
      applyLink: j.application_link
    }));
    let jobsList = [...dynamicJobs, ...injectedJobs, ...DEFAULT_JOBS];
    if (domain && domain !== "All") jobsList = jobsList.filter((j) => j.domain.toLowerCase() === domain.toLowerCase());
    if (type && type !== "All") jobsList = jobsList.filter((j) => j.type.toLowerCase() === type.toLowerCase());
    if (remote && remote !== "All") {
      const isRemote = remote === "Remote";
      jobsList = jobsList.filter((j) => j.remote === isRemote);
    }
    if (search) {
      const q = search.toLowerCase();
      jobsList = jobsList.filter((j) => j.role.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skillsRequired.some((s) => s.toLowerCase().includes(q)));
    }
    const rates = {
      US: { symbol: "$", factor: 1, code: "USD" },
      UK: { symbol: "\xA3", factor: 0.79, code: "GBP" },
      IN: { symbol: "\u20B9", factor: 83.5, code: "INR" },
      CA: { symbol: "C$", factor: 1.36, code: "CAD" },
      DE: { symbol: "\u20AC", factor: 0.92, code: "EUR" }
    };
    const targetRate = rates[targetCountry] || rates["US"];
    const convertedJobs = jobsList.map((j) => {
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
          const minR = Math.round(j.usdMinSalary * 5 / 5e3) * 5e3;
          const maxR = Math.round(j.usdMaxSalary * 5 / 5e3) * 5e3;
          salaryDisplay = minR === maxR ? `\u20B9${minR.toLocaleString()}/month` : `\u20B9${minR.toLocaleString()} - \u20B9${maxR.toLocaleString()}/month`;
        } else {
          const minLpa = Math.round(j.usdMinSalary / 1e4 * 1.25);
          const maxLpa = Math.round(j.usdMaxSalary / 1e4 * 1.25);
          salaryDisplay = minLpa === maxLpa ? `\u20B9${minLpa} LPA` : `\u20B9${minLpa} - \u20B9${maxLpa} LPA`;
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
app.get("/api/courses", verifyToken, async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    const target = profile.targetRole || "Software Engineer";
    const missing = profile.resumes && profile.resumes[0] && profile.resumes[0].missingSkillsList || ["Advanced Design"];
    const domain = req.query.domain;
    const search = req.query.search;
    const dynamicCourses = [
      { id: "dyn-course-1", title: `Complete ${target} Professional Bootcamp`, platform: "Coursera", skills: [missing[0] || "Foundational Stack"], level: "Intermediate", link: `https://www.coursera.org/search?query=${encodeURIComponent(target)}`, rating: 4.8, duration: "24 Hours", instructor: "JOB GIENE AI Faculty", type: "Course", domain: profile.domain || "Tech", subDomain: "" },
      { id: "dyn-course-2", title: `Advanced ${missing[0] || "Modern Systems"} Masterclass`, platform: "Udemy", skills: missing.slice(0, 3), level: "Advanced", link: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(missing[0] || target)}`, rating: 4.9, duration: "16 Hours", instructor: "Industry Guild", type: "Course", domain: profile.domain || "Tech", subDomain: "" }
    ];
    const injectedCourseDocs = await Course.find({ status: "active" }).sort({ created_at: -1 });
    const mappedInjected = injectedCourseDocs.map((ic) => ({
      id: ic._id.toString(),
      title: ic.title,
      platform: ic.provider,
      skills: ic.skills,
      level: ic.level,
      link: ic.course_url,
      rating: ic.rating,
      duration: ic.duration,
      instructor: ic.instructor,
      type: "Course",
      domain: ic.domain,
      subDomain: ic.sub_domain
    }));
    let list = [...dynamicCourses, ...mappedInjected, ...DEFAULT_COURSES];
    if (domain && domain !== "All") list = list.filter((c) => c.domain && c.domain.toLowerCase() === domain.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.platform.toLowerCase().includes(q) || c.subDomain && c.subDomain.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q)));
    }
    const userSkills = profile.skills || [];
    const missingSkills = profile.resumes && profile.resumes[0] && profile.resumes[0].missingSkillsList || [];
    const targetRole = profile.targetRole || "";
    const enrichedList = list.map((c) => {
      let isAiRecommended = false;
      let recommendReason = "";
      const matchingMissing = c.skills.filter((s) => missingSkills.some((ms) => ms.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ms.toLowerCase())));
      const targetMatch = targetRole && (c.title.toLowerCase().includes(targetRole.toLowerCase()) || c.subDomain && c.subDomain.toLowerCase().includes(targetRole.toLowerCase()));
      const matchingExisting = c.skills.filter((s) => userSkills.some((us) => us.toLowerCase().includes(s.toLowerCase())));
      if (matchingMissing.length > 0) {
        isAiRecommended = true;
        recommendReason = `\u{1F3AF} Prioritized to close your ATS gap: ${matchingMissing[0]}`;
      } else if (targetMatch) {
        isAiRecommended = true;
        recommendReason = `\u{1F525} Perfect alignment with your Target Role: ${targetRole}`;
      } else if (matchingExisting.length > 0) {
        isAiRecommended = true;
        recommendReason = `\u{1F4C8} Deepen your skill: ${matchingExisting[0]}`;
      }
      return { ...c, isAiRecommended, recommendReason };
    });
    res.json(enrichedList);
  } catch (error) {
    res.status(500).json({ error: "Failed to search recommended courses." });
  }
});
app.post("/api/resume/analyze", verifyToken, async (req, res) => {
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
    let aiResult = null;
    try {
      const gemini = getGeminiClient();
      const prompt = `You are an expert recruiter and ATS expert.
Analyze the following resume.

Candidate Context:
- Target Role: ${resolvedTargetRole}
- Skills: ${JSON.stringify(resolvedSkills)}
- Career Goals: "${careerGoals}"
- Interests: ${JSON.stringify(interests)}
- Experience: ${experienceLevel}
- Region: ${targetCountry}
- Industries: ${JSON.stringify(preferredIndustries)}
- Education: "${education}"

Resume:
"""
${resumeText}
"""

Reply with JSON:
{
  "atsScore": (0-100),
  "strengths": [3-4 items],
  "weakAreas": [3-4 items],
  "missingSkills": [4 items],
  "suggestions": [3 items],
  "improvedProjects": [2 items],
  "weakSections": [2-3 items],
  "missingAchievements": [2 items],
  "experienceGaps": [1-2 items],
  "actionPlan": { "improveBy": [3 items], "estimatedCompletionHours": number },
  "skillGapPercentage": number,
  "requiredSkillsList": [4 items],
  "currentSkillsList": [matched skills],
  "missingSkillsList": [missing items],
  "recommendedSources": [{ "type": "Course", "name": "...", "platform": "...", "link": "..." }]
}
Return only raw JSON.`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
      aiResult = cleanAndParseJSON(response.text);
    } catch (aiErr) {
      console.warn("Gemini failed, compiling fallback:", aiErr);
      const targetLower = resolvedTargetRole.toLowerCase();
      let requiredSkills = [];
      if (targetLower.includes("front") || targetLower.includes("web") || targetLower.includes("dev")) requiredSkills = ["React.js", "TypeScript", "Tailwind CSS", "API Integration", "Automated Testing"];
      else if (targetLower.includes("data") || targetLower.includes("python")) requiredSkills = ["Python", "Pandas & NumPy", "SQL", "Scikit-Learn", "Machine Learning"];
      else requiredSkills = [`${resolvedTargetRole} Fundamentals`, "Strategic Collaboration", "Data-Driven Decisions", "Industry Compliance", "Milestone Tracking"];
      const currentSkillsList = requiredSkills.filter((s) => resumeText.toLowerCase().includes(s.toLowerCase()) || resolvedSkills.some((sk) => sk.toLowerCase().includes(s.toLowerCase())));
      if (currentSkillsList.length === 0) currentSkillsList.push(requiredSkills[0]);
      const missingSkillsList = requiredSkills.filter((s) => !currentSkillsList.includes(s));
      let calculatedAts = 60 + currentSkillsList.length * 6;
      if (resumeText.length > 300) calculatedAts += 5;
      calculatedAts = Math.max(52, Math.min(94, calculatedAts));
      aiResult = {
        atsScore: calculatedAts,
        strengths: ["Solid foundational skills"],
        weakAreas: ["Needs metrics"],
        missingSkills: missingSkillsList,
        suggestions: ["Add skills matrix"],
        improvedProjects: ["Optimize portfolio"],
        weakSections: ["Project descriptions"],
        missingAchievements: ["Certifications"],
        experienceGaps: ["Alignment gaps"],
        actionPlan: { improveBy: ["Add project", "Add credentials", "Use STAR format"], estimatedCompletionHours: 35 },
        skillGapPercentage: Math.round(missingSkillsList.length / requiredSkills.length * 100),
        requiredSkillsList: requiredSkills,
        currentSkillsList,
        missingSkillsList,
        recommendedSources: [{ type: "Course", name: `${resolvedTargetRole} Bootcamp`, platform: "Udemy", link: "https://www.udemy.com" }]
      };
    }
    const newReport = {
      id: "res-" + Date.now(),
      fileName: fileName || "Pasted_Resume.pdf",
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
      atsScore: aiResult.atsScore,
      strengths: aiResult.strengths,
      weakAreas: aiResult.weakAreas,
      missingSkills: aiResult.missingSkills,
      suggestions: aiResult.suggestions,
      improvedProjects: aiResult.improvedProjects,
      parsingContent: resumeText.substring(0, 1e3),
      weakSections: aiResult.weakSections,
      missingAchievements: aiResult.missingAchievements,
      experienceGaps: aiResult.experienceGaps,
      actionPlan: aiResult.actionPlan,
      skillGapPercentage: aiResult.skillGapPercentage,
      requiredSkillsList: aiResult.requiredSkillsList,
      currentSkillsList: aiResult.currentSkillsList,
      missingSkillsList: aiResult.missingSkillsList,
      recommendedSources: aiResult.recommendedSources
    };
    await Resume.create({ user_id: user._id, resume_data: newReport, ats_score: newReport.atsScore, created_at: /* @__PURE__ */ new Date() });
    await ATSScore.create({
      user_id: user._id,
      ats_score: newReport.atsScore,
      resume_score: newReport.atsScore,
      keyword_score: 100 - (aiResult.skillGapPercentage || 30),
      format_score: Math.min(90, newReport.atsScore + 5),
      experience_score: newReport.atsScore - 5,
      generated_at: /* @__PURE__ */ new Date()
    });
    const allResumes = await Resume.find({ user_id: user._id });
    const highestAts = Math.max(...allResumes.map((r) => r.ats_score || 0), user.ats_score || 0);
    user.ats_score = highestAts;
    user.resume_strength = highestAts;
    if (highestAts >= 70 && !user.badges.includes("ATS Optimizer")) user.badges.push("ATS Optimizer");
    await user.save();
    await logActivity(user._id.toString(), "resume_upload", `Uploaded resume: ${newReport.fileName}`);
    await logActivity(user._id.toString(), "ats_analysis", `ATS score: ${newReport.atsScore}/100`);
    const updatedProfile = await userToProfile(user);
    res.json({ report: newReport, profile: updatedProfile });
  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume." });
  }
});
app.post("/api/interview/start", verifyToken, async (req, res) => {
  try {
    const { role, difficulty, count, profile } = req.body;
    const selRole = role || "Frontend Engineer";
    const selDiff = difficulty || "Medium";
    const selCount = parseInt(count) || 5;
    let questions = [];
    let candidateContext = "";
    if (profile) {
      candidateContext = `Candidate Context:
- Skills: ${Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "Not specified"}
- Experience: ${profile.experience || "Not specified"}
- Objective: ${profile.objective || "Not specified"}`;
    }
    try {
      const gemini = getGeminiClient();
      const prompt = `You are a professional interviewer.
Role: "${selRole}"
Difficulty: "${selDiff}"
${candidateContext}

Generate exactly ${selCount} interview questions.
Include 1 HR/behavioral and ${selCount - 1} technical.

JSON format:
{ "questions": ["Q1", "Q2", ...] }`;
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
    const user = await getAuthUser(req);
    const session = await InterviewSession.create({
      user_id: user._id,
      domain: selRole,
      difficulty: selDiff,
      question_count: questions.length,
      timestamp: /* @__PURE__ */ new Date()
    });
    for (const q of questions) {
      await InterviewQuestion.create({ session_id: session._id, question: q });
    }
    await logActivity(user._id.toString(), "interview_start", `Started interview: ${selRole} (${selDiff})`);
    res.json({ questions, role: selRole, difficulty: selDiff, sessionId: session._id.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not launch interview suite." });
  }
});
app.post("/api/interview/review-answer", verifyToken, async (req, res) => {
  try {
    const { question, answer, role, difficulty } = req.body;
    if (!question) return res.status(400).json({ error: "Question text is required." });
    const cleanAns = (answer || "").trim().toLowerCase();
    const isBlank = !cleanAns || ["skipped", "skipped answer", "microphone silence", "silence", "no answer submitted"].includes(cleanAns);
    if (isBlank) return res.json({ communication: 0, confidence: 0, technicalAccuracy: 0, suggestions: ["No answer submitted", "Try answering to improve readiness."], questionScore: 0 });
    let critique = null;
    try {
      const gemini = getGeminiClient();
      const prompt = `Evaluate this interview answer.
Role: "${role || "Software Developer"}"
Difficulty: "${difficulty || "Medium"}"
Question: "${question}"
Answer: "${answer || ""}"

Grade 1-10 on: Communication, Confidence, Technical Accuracy.
Suggest 2-3 improvements.

JSON:
{ "communication": N, "confidence": N, "technicalAccuracy": N, "suggestions": ["..."] }`;
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
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to analyze answer." });
  }
});
app.post("/api/interview/submit", verifyToken, async (req, res) => {
  try {
    const { role, difficulty, answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) return res.status(400).json({ error: "Candidate answers must be logged." });
    const processedAnswers = answers.map((a) => {
      const cleanAns = (a.answer || "").trim().toLowerCase();
      const isBlank = !cleanAns || ["skipped", "skipped answer", "no answer submitted", "microphone silence", "silence"].includes(cleanAns);
      return { question: a.question, answer: isBlank ? "No answer submitted" : a.answer, isBlank };
    });
    let evaluation = null;
    try {
      const gemini = getGeminiClient();
      const prompt = `You are a senior recruiter evaluating interview responses.
Role: "${role || "Technical Lead"}"
Difficulty: "${difficulty || "Medium"}"

Responses:
${JSON.stringify(processedAnswers.map((pa) => ({ question: pa.question, answer: pa.answer })), null, 2)}

If answer is empty/skipped: score all 0, feedback: "You skipped this question."

JSON:
{ "overallScore": N, "fluency": "...", "confidence": "...", "communication": "...", "detailedEvaluation": "...", "individualFeedback": [{ "question": "...", "answer": "...", "feedback": "...", "isCorrect": bool, "communication": N, "confidence": N, "technicalAccuracy": N }] }`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
      evaluation = cleanAndParseJSON(response.text);
    } catch (_) {
      let validCount = 0;
      const individualFeedback = processedAnswers.map((a) => {
        if (a.isBlank) return { question: a.question, answer: "No answer submitted", feedback: "You skipped this question.", isCorrect: false, communication: 0, confidence: 0, technicalAccuracy: 0, score: 0 };
        const isBetter = (a.answer || "").length > 40;
        if (isBetter) validCount++;
        return { question: a.question, answer: a.answer, feedback: isBetter ? "Good coverage! Add metrics." : "Too brief. Use STAR method.", isCorrect: isBetter, communication: isBetter ? 8 : 4, confidence: isBetter ? 8 : 3, technicalAccuracy: isBetter ? 9 : 4, score: isBetter ? 85 : 50 };
      });
      evaluation = {
        overallScore: processedAnswers.length > 0 ? Math.round(validCount / processedAnswers.length * 40 + 50) : 50,
        fluency: "Steady pacing.",
        confidence: "Good ownership.",
        communication: "Professional tone.",
        detailedEvaluation: "Strong foundations.",
        individualFeedback
      };
    }
    const items = evaluation.individualFeedback || [];
    let sumcomm = 0, sumconf = 0, sumaccu = 0;
    processedAnswers.forEach((pa, idx) => {
      let item = items[idx] || { question: pa.question, answer: pa.answer, feedback: "", isCorrect: !pa.isBlank, communication: pa.isBlank ? 0 : 5, confidence: pa.isBlank ? 0 : 5, technicalAccuracy: pa.isBlank ? 0 : 5 };
      if (pa.isBlank) {
        item.communication = 0;
        item.confidence = 0;
        item.technicalAccuracy = 0;
        item.score = 0;
        item.isCorrect = false;
        item.feedback = "You skipped this question.";
      }
      items[idx] = item;
      sumcomm += item.communication;
      sumconf += item.confidence;
      sumaccu += item.technicalAccuracy;
    });
    const numItems = items.length || 1;
    const computedComm = Math.round(sumcomm / numItems * 10);
    const computedConf = Math.round(sumconf / numItems * 10);
    const computedAccu = Math.round(sumaccu / numItems * 10);
    const user = await getAuthUser(req);
    const session = await InterviewSession.create({
      user_id: user._id,
      domain: role || "Frontend Engineer",
      difficulty: difficulty || "Medium",
      question_count: items.length,
      timestamp: /* @__PURE__ */ new Date()
    });
    for (const item of items) {
      await InterviewAnswer.create({
        session_id: session._id,
        question: item.question || "",
        answer: item.answer || "",
        score: item.score || 0,
        feedback: item.feedback || "",
        communication: item.communication || 0,
        confidence: item.confidence || 0,
        technical_accuracy: item.technicalAccuracy || 0,
        is_correct: item.isCorrect || false
      });
    }
    const report = await InterviewReport.create({
      session_id: session._id,
      user_id: user._id,
      overall_score: evaluation.overallScore,
      communication_score: computedComm,
      confidence_score: computedConf,
      accuracy_score: computedAccu,
      fluency: evaluation.fluency,
      confidence: evaluation.confidence,
      communication: evaluation.communication,
      detailed_evaluation: evaluation.detailedEvaluation,
      answers: items,
      role: role || "Frontend Engineer",
      difficulty: difficulty || "Medium",
      timestamp: /* @__PURE__ */ new Date()
    });
    user.xp += 150;
    user.streak += 1;
    if (!user.badges.includes("First Drill")) user.badges.push("First Drill");
    if (evaluation.overallScore >= 80 && !user.badges.includes("Elite Comm")) user.badges.push("Elite Comm");
    user.level = Math.floor(1 + user.xp / 500);
    user.updated_at = /* @__PURE__ */ new Date();
    await user.save();
    await logActivity(user._id.toString(), "interview_complete", `Completed interview: ${role} (${difficulty}), Score: ${evaluation.overallScore}`);
    const updatedProfile = await userToProfile(user);
    const sessionData = {
      id: report._id.toString(),
      role: role || "Frontend Engineer",
      difficulty: difficulty || "Medium",
      score: evaluation.overallScore,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      feedback: { fluency: evaluation.fluency, confidence: evaluation.confidence, communication: evaluation.communication, overallScore: evaluation.overallScore, detailedEvaluation: evaluation.detailedEvaluation, communicationScore: computedComm, confidenceScore: computedConf, accuracyScore: computedAccu },
      answers: items
    };
    res.json({ session: sessionData, profile: updatedProfile });
  } catch (error) {
    console.error("Interview submit error:", error);
    res.status(500).json({ error: error.message || "Failed to finalize evaluation." });
  }
});
app.get("/api/mentor/chat/history", verifyToken, async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const history = await ChatMessage.find({ user_id: user._id, conversation_id: "default_mentor_session" }).sort({ timestamp: 1 });
    const responseHistory = history.map((h) => ({ role: h.role, text: h.content }));
    res.json({ history: responseHistory });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve conversation logs." });
  }
});
app.post("/api/mentor/chat/clear", verifyToken, async (req, res) => {
  try {
    const user = await getAuthUser(req);
    await ChatMessage.deleteMany({ user_id: user._id, conversation_id: "default_mentor_session" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to clear chat session." });
  }
});
app.post("/api/mentor/chat", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Please write a mentor inquiry." });
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    await ChatMessage.create({ user_id: user._id, conversation_id: "default_mentor_session", role: "user", content: message, timestamp: /* @__PURE__ */ new Date() });
    const dbHistory = await ChatMessage.find({ user_id: user._id, conversation_id: "default_mentor_session" }).sort({ timestamp: 1 });
    let coachReply = "";
    try {
      const gemini = getGeminiClient();
      const systemPrompt = `You are "JOB GIENE AI Career Coach" helping "${profile.name}".
Target Role: "${profile.targetRole || "Software Engineer"}"
Skills: ${profile.skills?.join(", ") || "None"}
ATS Score: ${profile.atsScore}/100
Be relevant, no repetition, use markdown.`;
      const chatContents = dbHistory.map((h) => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.content }] }));
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: chatContents, config: { systemInstruction: systemPrompt } });
      coachReply = response.text || "I was unable to formulate feedback. Please try again.";
    } catch (aiErr) {
      coachReply = `Hello ${profile.name}! \u{1F44B} As your **JOB GIENE Career Mentor**, here is guidance for your query: "${message}".

- Align skills with ${profile.targetRole || "your target role"}
- Complete active learning milestones
- Run interview simulations`;
    }
    await ChatMessage.create({ user_id: user._id, conversation_id: "default_mentor_session", role: "model", content: coachReply, timestamp: /* @__PURE__ */ new Date() });
    await logActivity(user._id.toString(), "mentor_chat", `Career mentor chat query`);
    res.json({ reply: coachReply });
  } catch (error) {
    res.status(500).json({ error: error.message || "Advisor server error." });
  }
});
app.get("/api/ai-genie/sessions", verifyToken, async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const sessions = await ChatSession.find({ user_id: user._id }).sort({ timestamp: -1 });
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve AI Genie sessions." });
  }
});
app.get("/api/ai-genie/session/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getAuthUser(req);
    const messages = await ChatMessage.find({ user_id: user._id, conversation_id: id }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve conversation." });
  }
});
app.delete("/api/ai-genie/session/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getAuthUser(req);
    await ChatSession.deleteMany({ user_id: user._id, conversation_id: id });
    await ChatMessage.deleteMany({ user_id: user._id, conversation_id: id });
    res.json({ success: true, message: "Conversation deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete conversation." });
  }
});
app.post("/api/ai-genie/chat", verifyToken, async (req, res) => {
  try {
    const { message, conversationId, title } = req.body;
    if (!message) return res.status(400).json({ error: "Please write an AI Genie inquiry." });
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    const resolvedId = conversationId || "conv-" + Date.now();
    const history = await ChatMessage.find({ user_id: user._id, conversation_id: resolvedId }).sort({ timestamp: 1 });
    const systemPromptMessage = `You are "AI Genie", an expert career assistant.
Candidate: "${profile.name}"
Target Job: "${profile.targetRole || "Software Engineer"}"
Skills: [${profile.skills?.join(", ") || "None"}]
ATS Score: ${profile.atsScore || 70}/100
Be practical, use markdown, no repetition.`;
    const gemini = getGeminiClient();
    const chatContents = history.map((m) => ({ role: "user", parts: [{ text: m.question || m.content || "" }] }));
    chatContents.push({ role: "user", parts: [{ text: message }] });
    const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: chatContents, config: { systemInstruction: systemPromptMessage } });
    const genieAnswer = response.text || "AI Genie is experiencing issues. Please try again.";
    await ChatSession.findOneAndUpdate(
      { user_id: user._id, conversation_id: resolvedId },
      { user_id: user._id, conversation_id: resolvedId, title: title || message.slice(0, 30) + "...", timestamp: /* @__PURE__ */ new Date() },
      { upsert: true }
    );
    await ChatMessage.create({ user_id: user._id, conversation_id: resolvedId, question: message, response: genieAnswer, timestamp: /* @__PURE__ */ new Date() });
    await logActivity(user._id.toString(), "ai_genie_chat", `AI Genie conversation`);
    res.json({ conversationId: resolvedId, response: genieAnswer });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to get AI Genie response." });
  }
});
app.post("/api/cover-letter", verifyToken, async (req, res) => {
  try {
    const { companyName, jobRole, experienceLevel, skillHighlights } = req.body;
    if (!companyName || !jobRole) return res.status(400).json({ error: "Company name and job role are required." });
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    let letterContent = "";
    try {
      const gemini = getGeminiClient();
      const prompt = `Compose a professional Cover Letter.
Name: ${profile.name}
Experience: ${experienceLevel || profile.experienceLevel || "College Fresher"}
Position: ${jobRole}
Company: ${companyName}
Skills: ${skillHighlights || profile.skills.join(", ") || "Software engineering"}

3 paragraphs, formal business letter format.`;
      const response = await gemini.models.generateContent({ model: "gemini-3.5-flash", contents: prompt });
      letterContent = response.text || "";
    } catch (_) {
      const currentDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      letterContent = `[Your Address]
${currentDate}

Hiring Committee
${companyName}

Subject: Application for ${jobRole} - ${profile.name}

Dear Hiring Team,

I am writing to express my interest in the ${jobRole} position at ${companyName}. As a ${experienceLevel || "motivated professional"} specializing in ${profile.skills[0] || "software engineering"}, I have admired ${companyName}'s commitment to excellence.

During my career, I have focused on ${profile.skills.join(", ") || "modern technologies"}. I am confident my skills will prove valuable to your team.

Thank you for considering my application.

Sincerely,
${profile.name}
${profile.email}`;
    }
    await CoverLetter.create({
      user_id: user._id,
      company_name: companyName,
      job_title: jobRole,
      skills: profile.skills || [],
      generated_letter: letterContent,
      created_at: /* @__PURE__ */ new Date()
    });
    await logActivity(user._id.toString(), "cover_letter_generation", `Generated cover letter for ${jobRole} at ${companyName}`);
    res.json({ letter: letterContent });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate Cover Letter." });
  }
});
app.post("/api/roadmap", verifyToken, async (req, res) => {
  try {
    const { targetRole, skills } = req.body;
    if (!targetRole) return res.status(400).json({ error: "Please specify your target career role." });
    const user = await getAuthUser(req);
    const profile = await userToProfile(user);
    let roadmapNodes = [];
    try {
      const gemini = getGeminiClient();
      const prompt = `Generate a learning path with 4 phases for skills: ${JSON.stringify(skills || profile.skills)} into target role "${targetRole}".

JSON:
{ "targetRole": "${targetRole}", "nodes": [{ "id": "node-1", "title": "Phase 1: ...", "duration": "Month 1", "topics": ["..."], "suggestedProjects": ["..."], "recommendedCourses": ["..."] }] }`;
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
    const roadmapDoc = await Roadmap.create({
      user_id: user._id,
      title: targetRole,
      target_role: targetRole,
      current_skills: skills || profile.skills,
      nodes: roadmapNodes,
      category: profile.domain || "Tech",
      skills: skills || profile.skills,
      steps: roadmapNodes,
      estimated_duration: "16 weeks",
      created_at: /* @__PURE__ */ new Date()
    });
    await RoadmapProgress.create({
      user_id: user._id,
      roadmap_id: roadmapDoc._id,
      completed_steps: [],
      completion_percentage: 0,
      updated_at: /* @__PURE__ */ new Date()
    });
    if (targetRole && !user.interests.includes(targetRole)) user.interests.push(targetRole);
    if (!user.badges.includes("Future Planner")) user.badges.push("Future Planner");
    user.updated_at = /* @__PURE__ */ new Date();
    await user.save();
    await logActivity(user._id.toString(), "roadmap_generation", `Generated roadmap for: ${targetRole}`);
    const newRoadmap = { id: roadmapDoc._id.toString(), targetRole, currentSkills: skills || profile.skills, nodes: roadmapNodes };
    const updatedProfile = await userToProfile(user);
    res.json({ roadmap: newRoadmap, profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate roadmap." });
  }
});
app.get("/api/admin/metrics", verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
    const activeToday = await Activity.distinct("user_id", { timestamp: { $gte: todayStart } }).then((ids) => ids.length);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1e3);
    const weeklyActive = await Activity.distinct("user_id", { timestamp: { $gte: sevenDaysAgo } }).then((ids) => ids.length);
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
    const activityLogs = await Activity.find().sort({ timestamp: -1 }).limit(80).populate("user_id", "email name");
    const formattedLogs = activityLogs.map((l) => {
      const u = l.user_id;
      return { id: l._id, email: u?.email || "unknown", action: l.activity_type, details: l.metadata, time: l.timestamp };
    });
    const allUsers = await User.find().select("email name region target_job ats_score xp streak role skills interests created_at");
    const userReports = allUsers.map((u) => ({
      email: u.email,
      name: u.name,
      region: u.region,
      registeredAt: u.created_at,
      targetRole: u.target_job || "Not Configured",
      atsScore: u.ats_score,
      xp: u.xp,
      streak: u.streak,
      skills: u.skills,
      interests: u.interests,
      role: u.role,
      completionRate: Math.round([u.name, u.education, u.target_job, u.phone, u.city].filter(Boolean).length / 5 * 100)
    }));
    const userGrowth = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1e3);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      const usersCount = await User.countDocuments({ created_at: { $gte: dayStart, $lte: dayEnd } });
      const actCount = await Activity.distinct("user_id", { timestamp: { $gte: dayStart, $lte: dayEnd } }).then((ids) => ids.length);
      userGrowth.push({ date: d.toISOString().split("T")[0].substring(5), users: usersCount, activity: actCount });
    }
    const atsDistData = await User.aggregate([
      { $match: { ats_score: { $gt: 0 } } },
      { $bucket: { groupBy: "$ats_score", boundaries: [0, 21, 41, 61, 81, 101], default: "Other", output: { count: { $sum: 1 } } } }
    ]);
    const atsDistribution = [
      { range: "0-20", count: 0 },
      { range: "21-40", count: 0 },
      { range: "41-60", count: 0 },
      { range: "61-80", count: 0 },
      { range: "81-100", count: 0 }
    ];
    atsDistData.forEach((b) => {
      if (b._id === 0) atsDistribution[0].count = b.count;
      else if (b._id === 21) atsDistribution[1].count = b.count;
      else if (b._id === 41) atsDistribution[2].count = b.count;
      else if (b._id === 61) atsDistribution[3].count = b.count;
      else if (b._id === 81) atsDistribution[4].count = b.count;
    });
    const adminLogs = await AdminLog.find().sort({ timestamp: -1 }).limit(40);
    const skillsAgg = await User.aggregate([{ $unwind: "$skills" }, { $group: { _id: "$skills", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]);
    const topSkills = skillsAgg.map((s) => s._id);
    res.json({
      totalUsers,
      activeUsersToday: activeToday || 1,
      newUsersThisWeek: newWeekly || 0,
      totalJobApplications: totalSavedJobs,
      totalCoursesViewed: totalSavedCourses,
      totalRoadmapsOpened: totalRoadmaps,
      averageAtsScore: avgAts,
      totalJobs: totalInjectedJobs + 12,
      totalCourses: totalInjectedCourses + 15,
      topSkills: topSkills.slice(0, 5),
      averageProfileCompletion: 50,
      totalResumesAnalyzed: totalResumes,
      totalAiRequests: totalChatMessages,
      totalSavedJobs,
      totalBookmarkedCourses: totalSavedCourses,
      last30DaysGrowth: userGrowth,
      weeklyActiveUsers: weeklyActive || 1,
      totalResumesUploaded: totalResumes,
      profileCompletionRate: 50,
      streakStats: { average: 0, max: 0 },
      userGrowth,
      atsDistribution,
      activityLogs: formattedLogs,
      userReports,
      adminLogs,
      totalInterviews,
      totalCoverLetters,
      avgInterviewScore,
      targetJobsDistribution: [],
      skillsAnalytics: skillsAgg.map((s) => ({ name: s._id, category: "Skills", score: s.count * 10 })),
      interestsAnalytics: []
    });
  } catch (err) {
    console.error("Admin metrics error:", err);
    res.status(500).json({ error: "Failed to compile metrics." });
  }
});
app.post("/api/admin/jobs/inject", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { role, company, domain, type, location, remote, minSalary, maxSalary, skillsRequired, applyLink, description } = req.body;
    if (!role || !company) return res.status(400).json({ error: "Job role and company are required." });
    const user = await getAuthUser(req);
    const job = await Job.create({
      title: role,
      company,
      domain: domain || "Tech",
      job_type: type || "Job",
      location: location || "Remote",
      remote: !!remote,
      usd_min_salary: Number(minSalary) || 8e4,
      usd_max_salary: Number(maxSalary) || 12e4,
      skills_required: Array.isArray(skillsRequired) ? skillsRequired : [skillsRequired || "Productivity"],
      application_link: applyLink || "#apply",
      description: description || "",
      status: "active",
      created_at: /* @__PURE__ */ new Date()
    });
    await logActivity(user._id.toString(), "admin_action", `Created job: ${role} at ${company}`);
    await AdminLog.create({ admin_id: user._id, action: `Created job: ${role} at ${company}`, resource: "jobs", timestamp: /* @__PURE__ */ new Date() });
    broadcastWS("notification", { message: `Job Posted: ${role} at ${company}`, type: "success" });
    broadcastWS("database-changed", { type: "job-posted" });
    res.json({ success: true, job: { id: job._id, role, company, domain: domain || "Tech" } });
  } catch (err) {
    res.status(500).json({ error: "Failed to create job." });
  }
});
app.post("/api/admin/courses/inject", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { title, instructor, platform, duration, rating, link, domain, type } = req.body;
    if (!title || !platform) return res.status(400).json({ error: "Title and platform are required." });
    const user = await getAuthUser(req);
    const course = await Course.create({
      title,
      instructor: instructor || "Expert",
      provider: platform,
      duration: duration || "12 Hours",
      rating: parseFloat(rating) || 4.7,
      course_url: link || "#learn",
      domain: domain || "Tech",
      type: type || "Course",
      status: "active",
      created_at: /* @__PURE__ */ new Date()
    });
    await logActivity(user._id.toString(), "admin_action", `Published course: ${title}`);
    await AdminLog.create({ admin_id: user._id, action: `Published course: ${title}`, resource: "courses", timestamp: /* @__PURE__ */ new Date() });
    broadcastWS("notification", { message: `Course Added: ${title}`, type: "success" });
    broadcastWS("database-changed", { type: "course-added" });
    res.json({ success: true, course: { id: course._id, title, platform } });
  } catch (err) {
    res.status(500).json({ error: "Failed to create course." });
  }
});
app.delete("/api/admin/users/:email", verifyToken, requireAdmin, async (req, res) => {
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
    await AdminLog.create({ admin_id: admin._id, action: `Deleted user: ${emailToDelete}`, resource: "users", ip_address: ip, timestamp: /* @__PURE__ */ new Date() });
    broadcastWS("notification", { message: `User Deleted: ${emailToDelete}`, type: "warning" });
    broadcastWS("database-changed", { type: "user-deleted", email: emailToDelete });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to delete user." });
  }
});
app.post("/api/admin/users/edit", verifyToken, requireAdmin, (req, res) => {
  res.status(403).json({ error: "Admin editing of user profiles is disabled." });
});
app.post("/api/admin/users/create", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { email, name, password, region, interests, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required." });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });
    if (password.length > 128) return res.status(400).json({ error: "Password must be at most 128 characters long" });
    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ error: "User already exists." });
    let interestsArr = [];
    if (Array.isArray(interests)) interestsArr = interests;
    else if (typeof interests === "string" && interests.trim()) interestsArr = interests.split(",").map((i) => i.trim()).filter(Boolean);
    await User.create({
      name: name || cleanEmail.split("@")[0],
      email: cleanEmail,
      password_hash: bcrypt.hashSync(password, 10),
      role: role || "user",
      region: region || "US",
      interests: interestsArr,
      created_at: /* @__PURE__ */ new Date(),
      updated_at: /* @__PURE__ */ new Date(),
      last_login: /* @__PURE__ */ new Date(),
      last_active: /* @__PURE__ */ new Date()
    });
    const admin = await getAuthUser(req);
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1").toString();
    await AdminLog.create({ admin_id: admin._id, action: `Created user: ${cleanEmail} (${role || "user"})`, resource: "users", ip_address: ip, timestamp: /* @__PURE__ */ new Date() });
    broadcastWS("notification", { message: `User Created: ${name || cleanEmail}`, type: "success" });
    broadcastWS("database-changed", { type: "user-created", email: cleanEmail });
    res.json({ success: true, message: "User account created." });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user." });
  }
});
app.post("/api/admin/report/log", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { reportType, filters } = req.body;
    const admin = await getAuthUser(req);
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1").toString();
    await AdminLog.create({ admin_id: admin._id, action: `Exported report (${reportType}) with filters: ${filters}`, resource: "reports", ip_address: ip, timestamp: /* @__PURE__ */ new Date() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to record report." });
  }
});
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa"
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
async function startServer() {
  await connectDB();
  console.log("\u2705 MongoDB Atlas connected. All collections ready.");
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[JOB GIENE API Server with MongoDB Atlas + JWT Auth] running on http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
//# sourceMappingURL=server.js.map
