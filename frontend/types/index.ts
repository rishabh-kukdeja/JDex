export type Platform = {
  id: string;
  name: "LinkedIn" | "Naukri" | "Indeed" | "WorkIndia" | "Internshala";
  logo: string;
  enabled: boolean;
  connected: boolean;
};

export type JobDescription = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  workMode: "Remote" | "Hybrid" | "On-site";
  experience: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  requirements: string[];
  skills: string[];
  openings: number;
  status: "draft" | "published" | "closed";
  publishedOn: string[];
  applicantCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  jobId: string;
  jobTitle: string;
  source: "LinkedIn" | "Naukri" | "Indeed" | "WorkIndia" | "Direct";
  status: "new" | "shortlisted" | "interview_scheduled" | "selected" | "rejected" | "on_hold";
  atsScore: number;
  atsBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
  };
  skills: string[];
  experience: string;
  education: string;
  resumeData: {
    summary: string;
    workHistory: { company: string; role: string; duration: string; description: string }[];
    educationHistory: { institution: string; degree: string; year: string }[];
    certifications: string[];
  };
  appliedAt: string;
  notes: string;
  activityLog: { action: string; date: string; by: string }[];
};

export type Interview = {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  jobTitle: string;
  scheduledAt: string;
  duration: number;
  mode: "Online" | "Offline" | "Phone";
  interviewers: string[];
  meetLink?: string;
  location?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "shortlist" | "reject" | "interview" | "offer" | "custom";
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "HR Manager" | "Recruiter" | "Interviewer";
  avatar: string;
  department: string;
  joinedAt: string;
};

export type PipelineStage = {
  id: string;
  label: string;
  color: string;
  order: number;
};
