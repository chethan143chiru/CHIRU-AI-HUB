import { 
  Search, 
  Mail, 
  FileUser, 
  BarChart3, 
  FileText, 
  Code2, 
  Briefcase, 
  Database, 
  Settings, 
  Globe, 
  Rocket, 
  GraduationCap, 
  Headphones, 
  Calendar 
} from "lucide-react";
import { Agent } from "./types";

export const AGENTS: Agent[] = [
  {
    id: 1,
    name: "AI Research Agent",
    icon: "Search",
    description: "Search and analyze topics, summarize information, and generate structured reports.",
    tasks: ["Search and analyze topics", "Summarize information", "Generate structured reports"],
    instructions: "Search and analyze topics. Summarize information. Generate structured reports."
  },
  {
    id: 2,
    name: "Email & Content Agent",
    icon: "Mail",
    description: "Write emails, generate blogs/posts, and create social media content.",
    tasks: ["Write emails", "Generate blogs/posts", "Create social media content"],
    instructions: "Write emails. Generate blogs/posts. Create social media content. Tone: Clear, engaging, professional."
  },
  {
    id: 3,
    name: "Resume & Interview Agent",
    icon: "FileUser",
    description: "Analyze resumes, suggest improvements, and generate interview questions.",
    tasks: ["Analyze resumes", "Suggest improvements", "Generate interview questions"],
    instructions: "Analyze resumes. Suggest improvements. Generate interview questions. Career coach AI."
  },
  {
    id: 4,
    name: "Data Analyst Agent",
    icon: "BarChart3",
    description: "Analyze CSV/data, generate insights, and identify patterns.",
    tasks: ["Analyze CSV/data", "Generate insights", "Identify patterns"],
    instructions: "Analyze CSV/data. Generate insights. Identify patterns."
  },
  {
    id: 5,
    name: "Document Q&A Agent",
    icon: "FileText",
    description: "Answer from uploaded documents and extract key info.",
    tasks: ["Answer from uploaded documents", "Extract key info"],
    instructions: "Answer from uploaded documents. Extract key info. Document Intelligence AI."
  },
  {
    id: 6,
    name: "Coding Assistant Agent",
    icon: "Code2",
    description: "Generate code, debug errors, and explain logic.",
    tasks: ["Generate code", "Debug errors", "Explain logic"],
    instructions: "Generate code. Debug errors. Explain logic. Expert software engineer."
  },
  {
    id: 7,
    name: "Business Analyst Agent",
    icon: "Briefcase",
    description: "Research, analyze, and generate business reports and strategies.",
    tasks: ["Research", "Analyze", "Generate Report"],
    instructions: "Research -> Analyze -> Generate Report. Problem, Market Analysis, Data Insights, Business Strategy."
  },
  {
    id: 8,
    name: "Enterprise Knowledge Assistant",
    icon: "Database",
    description: "Answer based on company data and retrieve relevant info.",
    tasks: ["Answer based on company data", "Retrieve relevant info"],
    instructions: "Answer based on company data. Retrieve relevant info. Internal knowledge AI."
  },
  {
    id: 9,
    name: "Task Automation Agent",
    icon: "Settings",
    description: "Break tasks into steps and execute workflows.",
    tasks: ["Break tasks into steps", "Execute workflows"],
    instructions: "Break tasks into steps. Execute workflows. Automation AI."
  },
  {
    id: 10,
    name: "Web Automation Agent",
    icon: "Globe",
    description: "Navigate websites and extract or submit data.",
    tasks: ["Navigate websites", "Extract or submit data"],
    instructions: "Navigate websites. Extract or submit data. Web automation AI."
  },
  {
    id: 11,
    name: "Startup Idea Generator",
    icon: "Rocket",
    description: "Generate business ideas and validate market potential.",
    tasks: ["Generate business ideas", "Validate market"],
    instructions: "Generate business ideas. Validate market. Startup strategist AI."
  },
  {
    id: 12,
    name: "Learning Assistant Agent",
    icon: "GraduationCap",
    description: "Teach concepts and generate quizzes for personalized learning.",
    tasks: ["Teach concepts", "Generate quizzes"],
    instructions: "Teach concepts. Generate quizzes. Personalized AI tutor."
  },
  {
    id: 13,
    name: "Customer Support Agent",
    icon: "Headphones",
    description: "Answer FAQs and resolve customer issues efficiently.",
    tasks: ["Answer FAQs", "Resolve issues"],
    instructions: "Answer FAQs. Resolve issues. Customer support AI."
  },
  {
    id: 14,
    name: "Project Manager Agent",
    icon: "Calendar",
    description: "Plan projects, allocate tasks, and manage timelines.",
    tasks: ["Plan projects", "Allocate tasks"],
    instructions: "Plan projects. Allocate tasks. Project manager AI."
  }
];
